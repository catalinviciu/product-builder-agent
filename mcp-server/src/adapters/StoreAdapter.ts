import type {
  Block,
  Entity,
  ProductLine,
  CreateEntityInput,
  EntityContext,
  EntityNode,
  ProductLineSummary,
} from "../types.js";

/**
 * The MCP server talks to "the store" exclusively through this interface.
 *
 * Today it's implemented by HttpStoreAdapter (calls Next.js /api/store/*).
 * In a multi-tenant cloud future, the same interface gets a Cloud variant
 * pointing at a hosted API. MCP tool handlers never care which.
 *
 * Identity rule: implementations carry an auth token internally (set at
 * server startup). NO method takes a userId / accountId — identity is
 * resolved on the API side from the token. See ARCHITECTURE.md.
 */
export interface StoreAdapter {
  // ── Reads ───────────────────────────────────────────────────────────
  listProductLines(): Promise<ProductLineSummary[]>;
  getProductLine(productLineId: string): Promise<ProductLine>;
  getEntity(entityId: string): Promise<Entity>;
  getAncestors(entityId: string): Promise<Entity[]>;
  getSubtree(entityId: string, depth?: number): Promise<EntityNode>;
  getContext(
    entityId: string,
    opts?: { ancestors?: boolean; descendantsDepth?: number; productLineMeta?: boolean }
  ): Promise<EntityContext>;

  // ── Writes ──────────────────────────────────────────────────────────
  createEntity(input: CreateEntityInput): Promise<Entity>;
  updateEntity(entityId: string, patch: Partial<Entity>): Promise<Entity>;
  deleteEntity(entityId: string): Promise<void>;
  addBlock(entityId: string, block: Block): Promise<Entity>;
  updateBlock(entityId: string, blockIndex: number, patch: Partial<Block>): Promise<Entity>;
}
