import { z } from "zod";
import type { Entity, Block, CreateEntityInput } from "../types.js";

/**
 * Zod runtime schemas for MCP tool inputs.
 *
 * Each schema below is followed by a compile-time assertion that the
 * z.infer<typeof X> matches the corresponding TypeScript type from
 * Product-Agent-app. If the app changes a type, tsc fails here.
 *
 * This is layer 2 of schema-drift prevention (see ARCHITECTURE.md).
 */

// ── Block schemas ─────────────────────────────────────────────────────

const AccordionBlockSchema = z.object({
  id: z.string(),
  type: z.literal("accordion"),
  label: z.string(),
  content: z.string(),
  defaultOpen: z.boolean().optional(),
});

const PillsBlockSchema = z.object({
  id: z.string(),
  type: z.literal("pills"),
  items: z.array(z.object({ label: z.string(), value: z.string() })),
});

const QuoteBlockSchema = z.object({
  id: z.string(),
  type: z.literal("quote"),
  content: z.string(),
  attribution: z.string().optional(),
});

const MetricBlockSchema = z.object({
  id: z.string(),
  type: z.literal("metric"),
  metric: z.string(),
  currentValue: z.string(),
  targetValue: z.string(),
  timeframe: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
  valueFormat: z.enum(["number", "currency_usd", "currency_eur", "currency_gbp", "percentage"]).optional(),
  initialValue: z.number().optional(),
  numericTarget: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dataSeries: z.array(z.object({ date: z.string(), value: z.number() })).optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  AccordionBlockSchema,
  PillsBlockSchema,
  QuoteBlockSchema,
  MetricBlockSchema,
]);

// ── Create-entity input ───────────────────────────────────────────────

export const CreateEntityInputSchema = z.object({
  productLineId: z.string(),
  level: z.enum(["business_outcome", "product_outcome", "opportunity", "solution", "assumption", "test"]),
  title: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(["draft", "explore", "commit", "done", "archived", "dropped"]).optional(),
  personaId: z.string().optional(),
  secondaryPersonaIds: z.array(z.string()).optional(),
  assumptionType: z.enum(["desirability", "usability", "feasibility", "viability", "ethical"]).optional(),
  testType: z.enum(["prototype", "survey", "data_mining", "research_spike"]).optional(),
});

// ── Compile-time drift assertions ─────────────────────────────────────
// If these fail to compile, Zod and TypeScript disagree about a type.
// Fix the Zod schema until both compile. Do NOT relax the assertion.

type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertBlock: Exact<z.infer<typeof BlockSchema>, Block> = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertCreateEntityInput: Exact<z.infer<typeof CreateEntityInputSchema>, CreateEntityInput> = true;

// Re-export inferred types so tool handlers stay in lockstep
export type ZBlock = z.infer<typeof BlockSchema>;
export type ZCreateEntityInput = z.infer<typeof CreateEntityInputSchema>;

// ── Partial-update schemas (Partial<Entity>, Partial<Block>) ──────────
// We don't drift-assert these — Partial<T> erases discriminated-union
// information that Zod can't faithfully model. The narrow tools below
// only allow patching a safe subset of fields.

export const EntityPatchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "explore", "commit", "done", "archived", "dropped"]).optional(),
  personaId: z.string().optional(),
  secondaryPersonaIds: z.array(z.string()).optional(),
  assumptionType: z.enum(["desirability", "usability", "feasibility", "viability", "ethical"]).optional(),
  testType: z.enum(["prototype", "survey", "data_mining", "research_spike"]).optional(),
  iceScore: z.object({
    i: z.number(),
    c: z.number(),
    e: z.number(),
    rationale: z.string().optional(),
  }).optional(),
  stories: z.array(z.any()).optional(),
});

export const BlockPatchSchema = z.object({
  label: z.string().optional(),
  content: z.string().optional(),
  defaultOpen: z.boolean().optional(),
  attribution: z.string().optional(),
  items: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});
