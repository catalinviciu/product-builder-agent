import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Entity, EntityStore, DiscoveryTree } from "./schemas";
import { LEVEL_META } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

// ── Tree helpers ────────────────────────────────────────────────────────

export function getEntity(store: EntityStore, id: string): Entity | undefined {
  return store[id];
}

export function getParentChain(store: EntityStore, id: string): Entity[] {
  const chain: Entity[] = [];
  let current = store[id];
  while (current && current.parentId) {
    const parent = store[current.parentId];
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

export function getChildren(store: EntityStore, id: string): Entity[] {
  const entity = store[id];
  if (!entity || !entity.children) return [];
  return entity.children
    .map((childId) => store[childId])
    .filter((e): e is Entity => e !== undefined);
}

export function getRootEntities(store: EntityStore, tree: DiscoveryTree): Entity[] {
  return tree.rootChildren
    .map((id) => store[id])
    .filter((e): e is Entity => e !== undefined);
}

export function getEntityPreview(entity: Entity, maxLength = 120): string {
  let text = entity.description || "";
  if (!text) {
    const firstAccordion = entity.blocks.find((b) => b.type === "accordion");
    if (firstAccordion && firstAccordion.type === "accordion") {
      text = firstAccordion.content;
    }
  }
  if (!text) return "No content yet";
  if (text.length > maxLength) return text.slice(0, maxLength) + "\u2026";
  return text;
}

// ── Context anchor for AI agents ────────────────────────────────────────

export function buildEntityAnchor(
  store: EntityStore,
  productLineName: string,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity) return "";
  const chain = getParentChain(store, entityId);
  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[entity.level].label];
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${entity.title}" (${entity.id})`,
    `Data: Solution3/data/store.json`,
  ].join("\n");
}

export function buildRootAnchor(productLineName: string): string {
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `View: Overview (full tree)`,
    `Data: Solution3/data/store.json`,
  ].join("\n");
}
