import type {
  Block,
  Entity,
  Metric,
  ProductLine,
  ProductLineSettings,
  Story,
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
  getStory(entityId: string, storyId: string): Promise<Story>;

  // ── Writes ──────────────────────────────────────────────────────────
  createEntity(input: CreateEntityInput): Promise<Entity>;

  // ── Metrics ─────────────────────────────────────────────────────────
  // Metrics belong to the product line, not to an entity. An outcome extends
  // a metric through Entity.metricId; the metric outlives the outcome.
  listMetrics(productLineId: string): Promise<Metric[]>;
  createMetric(productLineId: string, input: CreateMetricInput): Promise<Metric>;
  updateMetric(productLineId: string, metricId: string, patch: UpdateMetricPatch): Promise<Metric>;
  deleteMetric(productLineId: string, metricId: string): Promise<Metric[]>;
  recordMetricValue(productLineId: string, metricId: string, date: string, value: number): Promise<Metric>;
  reparentMetric(productLineId: string, metricId: string, parentMetricId: string | null): Promise<Metric>;
  attachOutcome(productLineId: string, metricId: string, input: AttachOutcomeInput): Promise<Entity>;
  detachOutcome(productLineId: string, metricId: string): Promise<Metric>;
  updateEntity(entityId: string, patch: Partial<Entity>): Promise<Entity>;
  updateProductLineSettings(productLineId: string, patch: Partial<ProductLineSettings>): Promise<ProductLineSettings>;
  deleteEntity(entityId: string): Promise<void>;
  addBlock(entityId: string, block: Block): Promise<Entity>;
  updateBlock(entityId: string, blockId: string, patch: Partial<Block>): Promise<Entity>;
  deleteBlock(entityId: string, blockId: string): Promise<void>;
  moveBlock(entityId: string, blockId: string, toIndex: number): Promise<Entity>;
  updateStory(entityId: string, storyId: string, patch: Partial<Story>): Promise<Entity>;
  deleteStory(entityId: string, storyId: string): Promise<void>;
}

/** Input for creating a metric on a product line. */
export interface CreateMetricInput {
  name: string;
  metricType?: Metric["metricType"];
  frequency?: Metric["frequency"];
  valueFormat?: Metric["valueFormat"];
  parentMetricId?: string;
  initialValue?: number;
  numericTarget?: number;
  startDate?: string;
  endDate?: string;
}

export type UpdateMetricPatch = Partial<
  Pick<Metric, "name" | "frequency" | "valueFormat" | "status" | "initialValue" | "numericTarget" | "startDate" | "endDate">
>;

/** Attach an existing outcome by id, or create a new one from a title. */
export interface AttachOutcomeInput {
  entityId?: string;
  title?: string;
  description?: string;
}
