import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { StoreAdapter } from "../adapters/StoreAdapter.js";
import {
  BlockSchema,
  CreateEntityInputSchema,
  EntityPatchSchema,
  BlockPatchSchema,
  CreateMetricInputSchema,
  MetricPatchSchema,
  ProductLineSettingsPatchSchema,
  StoryPatchSchema,
} from "./schemas.js";
import type { Block, Entity, ProductLineSettings, Story } from "../types.js";
import type { CreateMetricInput, UpdateMetricPatch } from "../adapters/StoreAdapter.js";

/**
 * Registers all Product Agent MCP tools on the given server.
 *
 * Design rules (see ARCHITECTURE.md):
 *  - Narrow, named tools — no über-tool with many toggles.
 *  - No identity parameters (userId/orgId). Identity flows from the
 *    adapter's auth token, never from tool input.
 *  - Read tools are scoped by intent: entity / ancestors / subtree /
 *    context — pick the smallest one that answers the question.
 */
export function registerTools(server: McpServer, adapter: StoreAdapter): void {
  const ok = (data: unknown) => ({
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  });

  // ── Reads ────────────────────────────────────────────────────────

  server.registerTool(
    "pa_list_product_lines",
    {
      title: "List product lines",
      description: "Returns summaries (id, name, status, description) for every product line the current user owns. Use this when you need to pick or reference a product line by name.",
      inputSchema: {},
    },
    async () => ok(await adapter.listProductLines())
  );

  server.registerTool(
    "pa_get_product_line",
    {
      title: "Get product line shell",
      description: "Returns the full product line record EXCLUDING the entity tree (personas, blocks, top-level metadata). Use this when you need the product line's name, personas, or product-line-level blocks but NOT the discovery tree contents.",
      inputSchema: { productLineId: z.string() },
    },
    async ({ productLineId }) => ok(await adapter.getProductLine(productLineId))
  );

  server.registerTool(
    "pa_get_entity",
    {
      title: "Get a single entity",
      description: "Returns one entity with its blocks. Does NOT include parents or children. Use when you already know the entity ID and only need that entity's own content.",
      inputSchema: { entityId: z.string() },
    },
    async ({ entityId }) => ok(await adapter.getEntity(entityId))
  );

  server.registerTool(
    "pa_get_ancestors",
    {
      title: "Get parent chain",
      description: "Returns the parent chain from the entity up to the product line root, ordered root→leaf. Use when you need OST context (e.g. which Product Outcome this Solution sits under) without descendants.",
      inputSchema: { entityId: z.string() },
    },
    async ({ entityId }) => ok(await adapter.getAncestors(entityId))
  );

  server.registerTool(
    "pa_get_subtree",
    {
      title: "Get entity + descendants",
      description: "Returns the entity and its descendants, nested, to the requested depth (default 99 = full subtree). Use for read-only synthesis across a branch (e.g. WIP briefing, opportunity review).",
      inputSchema: {
        entityId: z.string(),
        depth: z.number().int().min(0).max(99).optional(),
      },
    },
    async ({ entityId, depth }) => ok(await adapter.getSubtree(entityId, depth))
  );

  server.registerTool(
    "pa_get_context",
    {
      title: "Get entity in context (composite)",
      description: "Returns { productLine, ancestors, entity, descendants } in one call. The recommended default for skills that need to reason about an entity in its surroundings. Cheaper than chaining pa_get_ancestors + pa_get_subtree.",
      inputSchema: {
        entityId: z.string(),
        ancestors: z.boolean().optional(),
        descendantsDepth: z.number().int().min(0).max(99).optional(),
        productLineMeta: z.boolean().optional(),
      },
    },
    async ({ entityId, ancestors, descendantsDepth, productLineMeta }) =>
      ok(await adapter.getContext(entityId, { ancestors, descendantsDepth, productLineMeta }))
  );

  server.registerTool(
    "pa_get_story",
    {
      title: "Get a single story by id",
      description: "Returns ONE story by id from a solution entity — its narrative, acceptance criteria, context, scope, dependencies, and analytics events. Use this instead of pa_get_entity when you only need a single story.",
      inputSchema: {
        entityId: z.string(),
        storyId: z.string(),
      },
    },
    async ({ entityId, storyId }) => ok(await adapter.getStory(entityId, storyId))
  );

  // ── Writes ───────────────────────────────────────────────────────

  server.registerTool(
    "pa_create_entity",
    {
      title: "Create entity",
      description: "Creates an entity at the specified level under the given parent. Parent level must match the OST hierarchy (e.g. an Opportunity's parent must be a Product Outcome). Returns the created entity.",
      inputSchema: CreateEntityInputSchema.shape,
    },
    async (input) => ok(await adapter.createEntity(input))
  );

  server.registerTool(
    "pa_update_entity",
    {
      title: "Update entity fields",
      description: "Partial update of safe fields on an entity (title, description, status, persona, ICE, assumption/test type). Does NOT touch blocks — use pa_add_block / pa_update_block / pa_delete_block / pa_move_block for those, and the pa_*_metric tools for the outcome's metric.",
      inputSchema: {
        entityId: z.string(),
        patch: EntityPatchSchema,
      },
    },
    async ({ entityId, patch }) => ok(await adapter.updateEntity(entityId, patch as Partial<Entity>))
  );

  server.registerTool(
    "pa_delete_entity",
    {
      title: "Delete a leaf entity",
      description: "Deletes an entity ONLY if it has no children. Mirrors the UI rule — to remove a branch, delete the deepest leaves first and work upward. The API returns HTTP 409 with the blocking child IDs if the entity is not a leaf, so the caller knows what to delete first.",
      inputSchema: { entityId: z.string() },
    },
    async ({ entityId }) => {
      await adapter.deleteEntity(entityId);
      return ok({ deleted: entityId });
    }
  );

  server.registerTool(
    "pa_add_block",
    {
      title: "Append a block",
      description: "Appends a new block (accordion/pills/quote) to an entity's blocks array. Use accordion for free-form sections, pills for key/value pairs, quote for verbatim user quotes. Metrics are NOT blocks — they live on the product line, see pa_create_metric.",
      inputSchema: {
        entityId: z.string(),
        block: z.object({
          type: z.enum(["accordion", "pills", "quote"]),
          label: z.string().optional(),
          content: z.string().optional(),
          attribution: z.string().optional(),
          defaultOpen: z.boolean().optional(),
          items: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
        }),
      },
    },
    async ({ entityId, block }) => ok(await adapter.addBlock(entityId, block as Block))
  );

  server.registerTool(
    "pa_update_block",
    {
      title: "Update a block by id",
      description: "Patches safe fields of an existing block (located by its string id). The block's id and type cannot be changed. To reorder use pa_move_block. Metric config lives on the metric itself — see pa_update_metric.",
      inputSchema: {
        entityId: z.string(),
        blockId: z.string(),
        patch: BlockPatchSchema,
      },
    },
    async ({ entityId, blockId, patch }) =>
      ok(await adapter.updateBlock(entityId, blockId, patch as Partial<Block>))
  );

  server.registerTool(
    "pa_delete_block",
    {
      title: "Delete a block by id",
      description: "Deletes ONE block (located by its string id) from an entity, leaving every other block untouched.",
      inputSchema: {
        entityId: z.string(),
        blockId: z.string(),
      },
    },
    async ({ entityId, blockId }) => {
      await adapter.deleteBlock(entityId, blockId);
      return ok({ deleted: blockId });
    }
  );

  // ── Metrics ───────────────────────────────────────────────────────────
  // A metric is a first-class object on the product line. It forms the metric
  // tree through parentMetricId and exists with or without an outcome. An
  // outcome (BO/PO) extends a metric via Entity.metricId, adding a target and
  // a discovery tree; deleting the outcome leaves the metric standing.

  server.registerTool(
    "pa_list_metrics",
    {
      title: "List a product line's metrics",
      description: "Returns the full metric registry for a product line. Each metric's parentMetricId builds the metric tree; a metric with no parentMetricId is a root. To find which outcome extends a metric, match it against the entities' metricId — several outcomes can share one metric over time, of which at most one is active; the rest are done, dropped or archived.",
      inputSchema: { productLineId: z.string() },
    },
    async ({ productLineId }) => ok(await adapter.listMetrics(productLineId))
  );

  server.registerTool(
    "pa_create_metric",
    {
      title: "Create a metric",
      description: "Creates a metric on a product line, optionally under a parent metric (making it an input metric, shown as a 'signal' on the parent's outcome). A metric needs no outcome — map the metric tree first, then attach outcomes to the metrics you want to move with pa_attach_outcome. metricType (business/product) is a label the builder sets; it does not decide the level of any outcome attached later.",
      inputSchema: {
        productLineId: z.string(),
        metric: CreateMetricInputSchema,
      },
    },
    async ({ productLineId, metric }) =>
      ok(await adapter.createMetric(productLineId, metric as CreateMetricInput))
  );

  server.registerTool(
    "pa_update_metric",
    {
      title: "Update a metric",
      description: "Patches a metric's name, recording cadence, value format, status, or its target fields (initialValue, numericTarget, startDate, endDate). Changing frequency re-snaps the existing series onto the new period boundaries. To log a value use pa_record_metric_value.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
        patch: MetricPatchSchema,
      },
    },
    async ({ productLineId, metricId, patch }) =>
      ok(await adapter.updateMetric(productLineId, metricId, patch as UpdateMetricPatch))
  );

  server.registerTool(
    "pa_delete_metric",
    {
      title: "Delete a metric",
      description: "Deletes a metric. Its child metrics rise to take its place rather than being deleted, and any outcome attached to it is detached, not deleted. Returns the remaining registry.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
      },
    },
    async ({ productLineId, metricId }) => ok(await adapter.deleteMetric(productLineId, metricId))
  );

  server.registerTool(
    "pa_record_metric_value",
    {
      title: "Record a metric value",
      description: "Upserts one data point on a metric, keeping the series sorted. The date is snapped to the metric's recording period, so a Wednesday value on a weekly metric lands on that week's Monday. Use this instead of editing store.json.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
        date: z.string().describe("ISO date, YYYY-MM-DD; snapped to the metric's period (week start, month start, quarter start)"),
        value: z.number(),
      },
    },
    async ({ productLineId, metricId, date, value }) =>
      ok(await adapter.recordMetricValue(productLineId, metricId, date, value))
  );

  server.registerTool(
    "pa_reparent_metric",
    {
      title: "Move a metric in the metric tree",
      description: "Moves a metric under another metric, or to the top of the tree when parentMetricId is null. Any outcome attached at or below the moved metric follows it in the discovery tree, since the two trees are locked together. Rejects cycles and any move that would put a Business Outcome underneath a Product Outcome.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
        parentMetricId: z.string().nullable().describe("Target parent metric id, or null to move to the top"),
      },
    },
    async ({ productLineId, metricId, parentMetricId }) =>
      ok(await adapter.reparentMetric(productLineId, metricId, parentMetricId))
  );

  server.registerTool(
    "pa_attach_outcome",
    {
      title: "Attach an outcome to a metric",
      description: "Turns a metric into something you are actively trying to move, by attaching an outcome to it. Pass entityId to attach an existing Business/Product Outcome, or title to create a new one. The level is derived from tree position, not from metricType: a metric with no outcome above it gets a Business Outcome at the root, otherwise a Product Outcome under the nearest ancestor that has one. A metric holds at most one ACTIVE outcome — once its outcome is done, dropped or archived the metric is free to take a new one, and the finished outcome stays linked to it.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
        entityId: z.string().optional().describe("Attach this existing outcome"),
        title: z.string().optional().describe("Or create a new outcome with this title"),
        description: z.string().optional(),
      },
    },
    async ({ productLineId, metricId, entityId, title, description }) =>
      ok(await adapter.attachOutcome(productLineId, metricId, { entityId, title, description }))
  );

  server.registerTool(
    "pa_detach_outcome",
    {
      title: "Detach an outcome from its metric",
      description: "Removes the link between a metric and its outcome. The metric keeps its full history and its children, and its target is cleared. The outcome itself is not deleted.",
      inputSchema: {
        productLineId: z.string(),
        metricId: z.string(),
      },
    },
    async ({ productLineId, metricId }) => ok(await adapter.detachOutcome(productLineId, metricId))
  );

  server.registerTool(
    "pa_move_block",
    {
      title: "Move a block to a new position",
      description: "Moves a block to a new 0-based position within the entity's blocks array. Blocks are otherwise appended at the end when created.",
      inputSchema: {
        entityId: z.string(),
        blockId: z.string(),
        toIndex: z.number().int().min(0),
      },
    },
    async ({ entityId, blockId, toIndex }) =>
      ok(await adapter.moveBlock(entityId, blockId, toIndex))
  );

  server.registerTool(
    "pa_update_story",
    {
      title: "Update a story by id",
      description: "Patches safe fields of one story (located by its string id) on a solution entity, merging only the fields you provide and leaving every other field and every other story untouched. Use this for per-story edits (e.g. writing acceptanceCriteria/analyticsEvents) instead of pa_update_entity, which replaces the whole stories array.",
      inputSchema: {
        entityId: z.string(),
        storyId: z.string(),
        patch: StoryPatchSchema,
      },
    },
    async ({ entityId, storyId, patch }) =>
      ok(await adapter.updateStory(entityId, storyId, patch as Partial<Story>))
  );

  server.registerTool(
    "pa_delete_story",
    {
      title: "Delete a story by id",
      description: "Deletes ONE story (located by its string id) from a solution entity, leaving every other story untouched.",
      inputSchema: {
        entityId: z.string(),
        storyId: z.string(),
      },
    },
    async ({ entityId, storyId }) => {
      await adapter.deleteStory(entityId, storyId);
      return ok({ deleted: storyId });
    }
  );

  server.registerTool(
    "pa_update_product_line_settings",
    {
      title: "Update product line settings",
      description: "Partial update of settings fields on a product line (codebasePath, designSystem, analyticsPlatform, storyMap, detectionError). Does NOT touch the entity tree, personas, or blocks.",
      inputSchema: { productLineId: z.string(), patch: ProductLineSettingsPatchSchema },
    },
    async ({ productLineId, patch }) =>
      ok(await adapter.updateProductLineSettings(productLineId, patch as Partial<ProductLineSettings>))
  );
}
