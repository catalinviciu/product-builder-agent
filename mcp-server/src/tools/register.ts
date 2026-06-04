import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { StoreAdapter } from "../adapters/StoreAdapter.js";
import {
  BlockSchema,
  CreateEntityInputSchema,
  EntityPatchSchema,
  BlockPatchSchema,
  ProductLineSettingsPatchSchema,
  StoryPatchSchema,
} from "./schemas.js";
import type { Block, Entity, ProductLineSettings, Story } from "../types.js";

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
      description: "Partial update of safe fields on an entity (title, description, status, persona, ICE, assumption/test type). Does NOT touch blocks — use pa_add_block / pa_update_block for those; pa_delete_block, pa_record_metric_value and pa_move_block for block deletion/metric logging/reordering.",
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
      description: "Appends a new block (accordion/pills/quote/metric) to an entity's blocks array. Use accordion for free-form sections, pills for key/value pairs, metric for tracked numbers, quote for verbatim user quotes.",
      inputSchema: {
        entityId: z.string(),
        block: z.object({
          type: z.enum(["accordion", "pills", "quote", "metric"]),
          label: z.string().optional(),
          content: z.string().optional(),
          attribution: z.string().optional(),
          defaultOpen: z.boolean().optional(),
          items: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
          metric: z.string().optional(),
          currentValue: z.string().optional(),
          targetValue: z.string().optional(),
          timeframe: z.string().optional(),
          frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
          valueFormat: z.enum(["number", "currency_usd", "currency_eur", "currency_gbp", "percentage"]).optional(),
          initialValue: z.number().optional(),
          numericTarget: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          dataSeries: z.array(z.object({ date: z.string(), value: z.number() })).optional(),
        }),
      },
    },
    async ({ entityId, block }) => ok(await adapter.addBlock(entityId, block as Block))
  );

  server.registerTool(
    "pa_update_block",
    {
      title: "Update a block by id",
      description: "Patches safe fields of an existing block (located by its string id), including metric config fields (currentValue, numericTarget, target, label, etc.). The block's id and type cannot be changed. To log a metric data point use pa_record_metric_value; to reorder use pa_move_block.",
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

  server.registerTool(
    "pa_record_metric_value",
    {
      title: "Record a metric value",
      description: "Upserts one data point (by date) on a metric block's dataSeries, keeping it sorted. Use this to log a tracked number on a Business/Product Outcome metric instead of editing store.json.",
      inputSchema: {
        entityId: z.string(),
        blockId: z.string(),
        date: z.string(),
        value: z.number(),
      },
    },
    async ({ entityId, blockId, date, value }) =>
      ok(await adapter.recordMetricValue(entityId, blockId, date, value))
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
