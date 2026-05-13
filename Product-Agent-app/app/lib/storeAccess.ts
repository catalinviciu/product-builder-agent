/**
 * Shared store-access helpers for /api/store/* routes.
 *
 * All scoped endpoints (entity, subtree, context, etc.) go through here so
 * read migration, atomic writes, and mutation serialization live in ONE place.
 *
 * Concurrency: writes are serialized via a module-level Promise mutex. Multiple
 * concurrent route handlers will queue rather than race on the file.
 */
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { PRODUCT_LINES } from "@/app/lib/mock-data";
import {
  CHILD_LEVEL,
  type Block,
  type Entity,
  type EntityLevel,
  type EntityStatus,
  type ProductLine,
} from "@/app/lib/schemas";

export type Store = Record<string, ProductLine>;

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const STORE_FILE_TMP = STORE_FILE + ".tmp";
const BACKUPS_DIR = path.join(DATA_DIR, ".backups");
const MAX_BACKUPS = 5;

// ── Migration (shared with existing GET /api/store) ──────────────────

export function migrateData(data: Store): Store {
  for (const plId of Object.keys(data)) {
    if (!data[plId].personas) {
      data[plId].personas = PRODUCT_LINES[plId]?.personas ?? [];
    }
    if (data[plId].codePath === undefined) {
      data[plId].codePath = "";
    }
    for (const entity of Object.values(data[plId].entities)) {
      if (entity.level === "assumption") {
        for (const block of entity.blocks) {
          if (block.type === "accordion" && (block as { label?: string }).label === "Belief") {
            (block as { label?: string }).label = "Impact if True";
          }
        }
      }
    }
  }
  return data;
}

// ── Read / Write ──────────────────────────────────────────────────────

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return migrateData(JSON.parse(raw) as Store);
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return migrateData(JSON.parse(JSON.stringify(PRODUCT_LINES)) as Store);
    }
    throw err;
  }
}

export async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
    await fs.access(STORE_FILE);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copyFile(STORE_FILE, path.join(BACKUPS_DIR, `store-${ts}.json`));
    const entries = await fs.readdir(BACKUPS_DIR);
    const backups = entries
      .filter((f) => f.startsWith("store-") && f.endsWith(".json"))
      .sort()
      .reverse();
    for (const old of backups.slice(MAX_BACKUPS)) {
      await fs.unlink(path.join(BACKUPS_DIR, old));
    }
  } catch (err) {
    console.error("[store-backup]", err);
  }

  const serialized = JSON.stringify(store, null, 2);
  await fs.writeFile(STORE_FILE_TMP, serialized, "utf-8");
  await fs.rename(STORE_FILE_TMP, STORE_FILE);
}

// ── Mutex: serialize all mutations to the store ───────────────────────

let mutationChain: Promise<unknown> = Promise.resolve();

export function withStoreMutex<T>(fn: (store: Store) => Promise<{ store: Store; result: T }>): Promise<T> {
  const next = mutationChain.then(async () => {
    const store = await readStore();
    const { store: nextStore, result } = await fn(store);
    await writeStore(nextStore);
    return result;
  });
  mutationChain = next.catch(() => undefined);
  return next;
}

// ── Lookups ───────────────────────────────────────────────────────────

export interface FoundEntity {
  entity: Entity;
  productLine: ProductLine;
  productLineId: string;
}

export function findEntity(store: Store, entityId: string): FoundEntity | null {
  for (const productLineId of Object.keys(store)) {
    const pl = store[productLineId];
    const entity = pl.entities[entityId];
    if (entity) return { entity, productLine: pl, productLineId };
  }
  return null;
}

/** Walk parent chain from root → leaf, excluding the target entity itself. */
export function getAncestors(productLine: ProductLine, entityId: string): Entity[] {
  const chain: Entity[] = [];
  let current = productLine.entities[entityId];
  if (!current) return chain;
  let safety = 100;
  while (current.parentId && safety-- > 0) {
    const parent = productLine.entities[current.parentId];
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

export interface EntityNode {
  entity: Entity;
  children: EntityNode[];
}

export function buildSubtree(productLine: ProductLine, entityId: string, depth = 99): EntityNode | null {
  const root = productLine.entities[entityId];
  if (!root) return null;
  const build = (e: Entity, d: number): EntityNode => ({
    entity: e,
    children: d <= 0
      ? []
      : e.children
          .map((cid) => productLine.entities[cid])
          .filter((c): c is Entity => Boolean(c))
          .map((c) => build(c, d - 1)),
  });
  return build(root, depth);
}

// ── Mutations ─────────────────────────────────────────────────────────

export interface CreateEntityInput {
  productLineId: string;
  level: EntityLevel;
  title: string;
  description?: string;
  parentId?: string;
  status?: EntityStatus;
  personaId?: string;
  secondaryPersonaIds?: string[];
  assumptionType?: Entity["assumptionType"];
  testType?: Entity["testType"];
}

/** Validates parent/level relationship per CHILD_LEVEL hierarchy. */
export function validateParentChild(parentLevel: EntityLevel | null, childLevel: EntityLevel): string | null {
  if (parentLevel === null) {
    if (childLevel !== "business_outcome") {
      return `Top-level entities must be business_outcome (got ${childLevel}).`;
    }
    return null;
  }
  const expected = CHILD_LEVEL[parentLevel];
  if (expected !== childLevel) {
    return `A ${parentLevel} cannot have a ${childLevel} child (expected ${expected ?? "none"}).`;
  }
  return null;
}

const ICON_BY_LEVEL: Record<EntityLevel, string> = {
  business_outcome: "Target",
  product_outcome: "TrendingUp",
  opportunity: "Lightbulb",
  solution: "Puzzle",
  assumption: "HelpCircle",
  test: "FlaskConical",
};

export function createEntityIn(store: Store, input: CreateEntityInput): Entity {
  const pl = store[input.productLineId];
  if (!pl) throw new Error(`Product line not found: ${input.productLineId}`);

  let parentLevel: EntityLevel | null = null;
  if (input.parentId) {
    const parent = pl.entities[input.parentId];
    if (!parent) throw new Error(`Parent entity not found: ${input.parentId}`);
    parentLevel = parent.level;
  }
  const validationError = validateParentChild(parentLevel, input.level);
  if (validationError) throw new Error(validationError);

  const id = randomUUID();
  const today = new Date().toISOString().slice(0, 10);
  const status: EntityStatus = input.status ?? "draft";

  const entity: Entity = {
    id,
    level: input.level,
    title: input.title,
    icon: ICON_BY_LEVEL[input.level],
    description: input.description ?? "",
    status,
    statusHistory: [{ status, date: today }],
    parentId: input.parentId,
    personaId: input.personaId,
    secondaryPersonaIds: input.secondaryPersonaIds,
    assumptionType: input.assumptionType,
    testType: input.testType,
    children: [],
    blocks: [],
  };

  pl.entities[id] = entity;
  if (input.parentId) {
    pl.entities[input.parentId].children.push(id);
  } else {
    pl.tree.rootChildren.push(id);
  }
  return entity;
}

/**
 * Deletes a leaf entity. Refuses if it still has children — the caller must
 * delete the children first. This matches the UI (see EntityView.tsx:389
 * which only renders the delete button when entity.children.length === 0).
 *
 * Returns the list of child IDs that block the delete, so callers can
 * surface a useful error to the user.
 */
export class EntityHasChildrenError extends Error {
  childIds: string[];
  constructor(childIds: string[]) {
    super(
      `Cannot delete: entity has ${childIds.length} child ${childIds.length === 1 ? "entity" : "entities"}. ` +
        `Delete the children first. Child IDs: ${childIds.join(", ")}`
    );
    this.name = "EntityHasChildrenError";
    this.childIds = childIds;
  }
}

export class EntityHasContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityHasContentError";
  }
}

export function deleteEntity(store: Store, entityId: string): void {
  const found = findEntity(store, entityId);
  if (!found) throw new Error(`Entity not found: ${entityId}`);
  const { entity, productLine } = found;

  if (entity.children.length > 0) {
    throw new EntityHasChildrenError(entity.children);
  }

  if (entity.blocks.length > 0) {
    throw new EntityHasContentError(
      `Cannot delete: entity has ${entity.blocks.length} block${entity.blocks.length === 1 ? "" : "s"}. Clear the blocks first.`
    );
  }

  if (entity.stories && entity.stories.length > 0) {
    throw new EntityHasContentError(
      `Cannot delete: entity has ${entity.stories.length} ${entity.stories.length === 1 ? "story" : "stories"}. Clear the stories first.`
    );
  }

  // Unlink from parent (or root)
  if (entity.parentId) {
    const parent = productLine.entities[entity.parentId];
    if (parent) parent.children = parent.children.filter((c) => c !== entityId);
  } else {
    productLine.tree.rootChildren = productLine.tree.rootChildren.filter((c) => c !== entityId);
  }

  delete productLine.entities[entityId];
}

/** Allowed-field patch — silently drops keys not in the safe list. */
const SAFE_ENTITY_FIELDS: ReadonlyArray<keyof Entity> = [
  "title",
  "description",
  "status",
  "personaId",
  "secondaryPersonaIds",
  "assumptionType",
  "testType",
  "iceScore",
  "stories",
];

export function patchEntity(entity: Entity, patch: Partial<Entity>): Entity {
  const entityRec = entity as unknown as Record<string, unknown>;
  for (const key of SAFE_ENTITY_FIELDS) {
    if (key in patch && patch[key] !== undefined) {
      entityRec[key as string] = patch[key] as unknown;
    }
  }
  // Track status transitions in history
  if (patch.status && patch.status !== entity.status) {
    entity.statusHistory = entity.statusHistory ?? [];
    entity.statusHistory.push({ status: patch.status, date: new Date().toISOString().slice(0, 10) });
  }
  return entity;
}

const SAFE_BLOCK_FIELDS = ["label", "content", "defaultOpen", "attribution", "items"] as const;

export function patchBlock(block: Block, patch: Partial<Block>): Block {
  const blockRec = block as unknown as Record<string, unknown>;
  const patchRec = patch as unknown as Record<string, unknown>;
  for (const key of SAFE_BLOCK_FIELDS) {
    if (key in patch && patchRec[key] !== undefined) {
      blockRec[key as string] = patchRec[key];
    }
  }
  return block;
}
