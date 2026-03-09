// ── Entity levels ────────────────────────────────────────────────────────
export type EntityLevel =
  | "business_outcome"
  | "product_outcome"
  | "opportunity"
  | "solution"
  | "assumption"
  | "test";

export interface LevelMeta {
  label: string;
  description: string;
  childrenLabel: string;
  icon: string;
  accentColor: string;
  bgTint: string;
  borderTint: string;
  iconBg: string;
}

export const LEVEL_META: Record<EntityLevel, LevelMeta> = {
  business_outcome: {
    label: "Business Outcome",
    description: "The measurable business result this product must drive",
    childrenLabel: "Product Outcomes",
    icon: "Target",
    accentColor: "text-blue-600 dark:text-blue-400",
    bgTint: "bg-blue-500/[0.06] dark:bg-blue-500/[0.04]",
    borderTint: "border-blue-500/25 dark:border-blue-500/20",
    iconBg: "bg-blue-500/15",
  },
  product_outcome: {
    label: "Product Outcome",
    description: "The user behavior change that creates business value",
    childrenLabel: "Opportunities",
    icon: "TrendingUp",
    accentColor: "text-violet-600 dark:text-violet-400",
    bgTint: "bg-violet-500/[0.06] dark:bg-violet-500/[0.04]",
    borderTint: "border-violet-500/25 dark:border-violet-500/20",
    iconBg: "bg-violet-500/15",
  },
  opportunity: {
    label: "Opportunity",
    description: "Persona's unmet need, pain point, or desire that drives the product outcome",
    childrenLabel: "Solutions",
    icon: "Lightbulb",
    accentColor: "text-amber-600 dark:text-amber-400",
    bgTint: "bg-amber-500/[0.06] dark:bg-amber-500/[0.04]",
    borderTint: "border-amber-500/25 dark:border-amber-500/20",
    iconBg: "bg-amber-500/15",
  },
  solution: {
    label: "Solution",
    description: "A specific way to address an opportunity",
    childrenLabel: "Assumptions",
    icon: "Puzzle",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    bgTint: "bg-emerald-500/[0.06] dark:bg-emerald-500/[0.04]",
    borderTint: "border-emerald-500/25 dark:border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
  },
  assumption: {
    label: "Assumption",
    description: "A belief that must be true for a solution to work",
    childrenLabel: "Tests",
    icon: "HelpCircle",
    accentColor: "text-orange-600 dark:text-orange-400",
    bgTint: "bg-orange-500/[0.06] dark:bg-orange-500/[0.04]",
    borderTint: "border-orange-500/25 dark:border-orange-500/20",
    iconBg: "bg-orange-500/15",
  },
  test: {
    label: "Test",
    description: "An experiment to validate or invalidate an assumption",
    childrenLabel: "",
    icon: "FlaskConical",
    accentColor: "text-cyan-600 dark:text-cyan-400",
    bgTint: "bg-cyan-500/[0.06] dark:bg-cyan-500/[0.04]",
    borderTint: "border-cyan-500/25 dark:border-cyan-500/20",
    iconBg: "bg-cyan-500/15",
  },
};

// ── Status system ─────────────────────────────────────────────────────────

export type EntityStatus = "commit" | "explore" | "draft" | "done" | "archived" | "dropped";
export type ProductLineStatus = "active" | "closed" | "archived";

export const ENTITY_STATUS_META: Record<EntityStatus, { label: string; color: string; dotColor: string }> = {
  draft:    { label: "Draft",    color: "text-zinc-600 dark:text-zinc-400 bg-zinc-400/10 border-zinc-400/25",         dotColor: "bg-zinc-500 dark:bg-zinc-400" },
  explore:  { label: "Explore",  color: "text-blue-600 dark:text-blue-400 bg-blue-400/10 border-blue-400/25",         dotColor: "bg-blue-500 dark:bg-blue-400" },
  commit:   { label: "Commit",   color: "text-emerald-600 dark:text-emerald-400 bg-emerald-400/10 border-emerald-400/25", dotColor: "bg-emerald-500 dark:bg-emerald-400" },
  done:     { label: "Done",     color: "text-violet-600 dark:text-violet-400 bg-violet-400/10 border-violet-400/25",   dotColor: "bg-violet-500 dark:bg-violet-400" },
  archived: { label: "Archived", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/25",         dotColor: "bg-zinc-600" },
  dropped:  { label: "Dropped",  color: "text-rose-600 dark:text-rose-400 bg-rose-400/10 border-rose-400/25",         dotColor: "bg-rose-500 dark:bg-rose-400" },
};

export const PRODUCT_LINE_STATUS_META: Record<ProductLineStatus, { label: string; color: string; dotColor: string }> = {
  active:   { label: "Active",   color: "text-emerald-600 dark:text-emerald-400 bg-emerald-400/10 border-emerald-400/25", dotColor: "bg-emerald-500 dark:bg-emerald-400" },
  closed:   { label: "Closed",   color: "text-amber-600 dark:text-amber-400 bg-amber-400/10 border-amber-400/25",      dotColor: "bg-amber-500 dark:bg-amber-400" },
  archived: { label: "Archived", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/25",          dotColor: "bg-zinc-600" },
};

export const ENTITY_STATUSES: EntityStatus[] = ["draft", "explore", "commit", "done", "archived", "dropped"];
export const PRODUCT_LINE_STATUSES: ProductLineStatus[] = ["active", "closed", "archived"];

// ── Block system ──────────────────────────────────────────────────────────

export type BlockType = "accordion" | "pills" | "quote" | "metric";

interface BlockBase {
  id: string;
  type: BlockType;
}

export interface AccordionBlock extends BlockBase {
  type: "accordion";
  label: string;
  content: string;
  defaultOpen?: boolean;
}

export interface PillsBlock extends BlockBase {
  type: "pills";
  items: { label: string; value: string }[];
}

export interface QuoteBlock extends BlockBase {
  type: "quote";
  content: string;
  attribution?: string;
}

export interface MetricBlock extends BlockBase {
  type: "metric";
  metric: string;
  currentValue: string;
  targetValue: string;
  timeframe?: string;
}

export type Block = AccordionBlock | PillsBlock | QuoteBlock | MetricBlock;

// ── Personas ─────────────────────────────────────────────────────────────

export interface Persona {
  id: string;
  name: string;
  description: string;
}

export const PERSONA_LEVELS: Set<EntityLevel> = new Set(["opportunity", "product_outcome"]);
export const MULTI_PERSONA_LEVELS: Set<EntityLevel> = new Set(["product_outcome"]);

// ── Assumption Types ────────────────────────────────────────────────────
export type AssumptionType = "desirability" | "usability" | "feasibility" | "viability" | "ethical";

export interface AssumptionTypeMeta {
  label: string;
  description: string;
  color: string;
  dotColor: string;
}

export const ASSUMPTION_TYPE_META: Record<AssumptionType, AssumptionTypeMeta> = {
  desirability: { label: "Desirability", description: "Will customers want this?", color: "text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/25", dotColor: "bg-pink-500 dark:bg-pink-400" },
  usability:    { label: "Usability",    description: "Can customers use it easily?", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25", dotColor: "bg-amber-500 dark:bg-amber-400" },
  feasibility:  { label: "Feasibility",  description: "Can we build this?", color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/25", dotColor: "bg-cyan-500 dark:bg-cyan-400" },
  viability:    { label: "Viability",     description: "Is this good for our business?", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25", dotColor: "bg-emerald-500 dark:bg-emerald-400" },
  ethical:      { label: "Ethical",       description: "Should we build this?", color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/25", dotColor: "bg-violet-500 dark:bg-violet-400" },
};

// ── Test Types ─────────────────────────────────────────────────────────
export type TestType = "prototype" | "survey" | "data_mining" | "research_spike";

export interface TestTypeMeta {
  label: string;
  description: string;
  color: string;
  dotColor: string;
}

export const TEST_TYPE_META: Record<TestType, TestTypeMeta> = {
  prototype:      { label: "Prototype Test",      description: "Simulating a specific moment to evaluate customer behavior", color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25", dotColor: "bg-rose-500 dark:bg-rose-400" },
  survey:         { label: "One-Question Survey",  description: "Quickly evaluating past or current customer behavior", color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25", dotColor: "bg-sky-500 dark:bg-sky-400" },
  data_mining:    { label: "Data Mining",           description: "Using existing system or product data to evaluate inherent risk", color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/25", dotColor: "bg-orange-500 dark:bg-orange-400" },
  research_spike: { label: "Research Spike",        description: "Time-boxed engineering activity to evaluate technical difficulty", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25", dotColor: "bg-indigo-500 dark:bg-indigo-400" },
};

// ── Unified entity ────────────────────────────────────────────────────────

export interface Entity {
  id: string;
  level: EntityLevel;
  title: string;
  icon: string;
  description: string;
  status: EntityStatus;
  parentId?: string;
  personaId?: string;
  secondaryPersonaIds?: string[];
  assumptionType?: AssumptionType;
  testType?: TestType;
  children: string[];
  blocks: Block[];
}

export type EntityStore = Record<string, Entity>;

export const CHILD_LEVEL: Record<EntityLevel, EntityLevel | null> = {
  business_outcome: "product_outcome",
  product_outcome: "opportunity",
  opportunity: "solution",
  solution: "assumption",
  assumption: "test",
  test: null,
};

// ── Block templates ──────────────────────────────────────────────────────

/** Returns a placeholder description for new entities of the given level */
export function getDescriptionPlaceholder(level: EntityLevel): string {
  switch (level) {
    case "business_outcome": return "*What is the measurable business result this product must drive?*";
    case "product_outcome":  return "*What user behavior change will drive the business outcome?*";
    case "opportunity":      return "*What unmet need, pain point, or desire does this persona have?*";
    case "solution":         return "*What is this solution and how does it address the opportunity?*";
    case "assumption":       return "*What assumption are we making that needs to be true for this solution to work?*";
    case "test":             return "*What evaluative method will you use to validate or invalidate the parent assumption?*";
    default:                 return "";
  }
}

/** Returns pre-populated starter blocks for new entities of the given level */
export function createBlockTemplate(level: EntityLevel, entityId: string): Block[] {
  const ts = Date.now();
  switch (level) {
    case "business_outcome":
      return [
        { id: `${entityId}-b${ts}`, type: "metric", metric: "Key Metric", currentValue: "", targetValue: "", timeframe: "" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Strategic Alignment", content: "*How does this outcome connect to the company's strategy or OKRs?*" },
        { id: `${entityId}-b${ts + 2}`, type: "accordion", label: "Why Now", content: "*What makes this outcome urgent or timely?*" },
        { id: `${entityId}-b${ts + 3}`, type: "accordion", label: "Risk of Inaction", content: "*What happens if we don't pursue this outcome?*" },
      ];
    case "product_outcome":
      return [
        { id: `${entityId}-b${ts}`, type: "metric", metric: "Key Metric", currentValue: "", targetValue: "", timeframe: "" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Strategic Alignment", content: "*How does this product outcome map to the business outcome above?*" },
        { id: `${entityId}-b${ts + 2}`, type: "accordion", label: "Constraints", content: "*What technical, business, or resource constraints shape this outcome?*" },
        { id: `${entityId}-b${ts + 3}`, type: "accordion", label: "Trade-offs", content: "*What are we choosing not to do? What trade-offs are we accepting?*" },
      ];
    case "opportunity":
      return [
        { id: `${entityId}-b${ts}`, type: "accordion", label: "Trigger", content: "*When exactly does this problem occur? What is the context of the need?*" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Current Workaround", content: "*How are users solving this problem today without our product?*" },
        { id: `${entityId}-b${ts + 2}`, type: "accordion", label: "Competition View", content: "*How do competitors or alternatives address this opportunity?*" },
      ];
    case "solution":
      return [
        { id: `${entityId}-b${ts}`, type: "accordion", label: "Why It Works", content: "*How does this solution address the parent opportunity?*" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Trade-offs", content: "*What are the trade-offs of this approach? What are we giving up?*" },
        { id: `${entityId}-b${ts + 2}`, type: "accordion", label: "High-Level User Journey", content: "*What is the high-level user journey for this feature?*" },
      ];
    case "assumption":
      return [
        { id: `${entityId}-b${ts}`, type: "accordion", label: "Belief", content: "*What specifically do we believe to be true? State it as a falsifiable claim.*" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Evidence", content: "*What evidence do we have for or against this assumption today?*" },
      ];
    case "test":
      return [
        { id: `${entityId}-b${ts}`, type: "accordion", label: "Define Test", content: "*Describe the evaluative method you will use to validate or invalidate the assumption. This is not about generating new ideas — it's about designing a specific experiment or measurement to test what you already believe.*" },
        { id: `${entityId}-b${ts + 1}`, type: "accordion", label: "Pass / Fail Criteria", content: "*What specific, observable result would tell you this assumption is true (pass)? What result would tell you it's false (fail)? Define the threshold before running the test.*" },
      ];
    default:
      return [];
  }
}

// ── Tree / Product Line ───────────────────────────────────────────────────

export interface DiscoveryTree {
  title: string;
  description: string;
  rootChildren: string[];
}

export interface ProductLine {
  id: string;
  name: string;
  description: string;
  status: ProductLineStatus;
  personas?: Persona[];
  tree: DiscoveryTree;
  entities: EntityStore;
}
