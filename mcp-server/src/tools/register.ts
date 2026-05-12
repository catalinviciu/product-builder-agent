import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { StoreAdapter } from "../adapters/StoreAdapter.js";
import {
  BlockSchema,
  CreateEntityInputSchema,
  EntityPatchSchema,
  BlockPatchSchema,
} from "./schemas.js";
import type { Block, Entity } from "../types.js";

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
      description: "Partial update of safe fields on an entity (title, description, status, persona, ICE, assumption/test type). Does NOT touch blocks — use pa_add_block / pa_update_block for those.",
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
      title: "Update a block by index",
      description: "Patches safe fields of an existing block (label, content, items, attribution, defaultOpen). The block's id and type cannot be changed.",
      inputSchema: {
        entityId: z.string(),
        blockIndex: z.number().int().min(0),
        patch: BlockPatchSchema,
      },
    },
    async ({ entityId, blockIndex, patch }) =>
      ok(await adapter.updateBlock(entityId, blockIndex, patch as Partial<Block>))
  );
}
