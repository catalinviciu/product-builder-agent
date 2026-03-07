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
    accentColor: "text-blue-400",
    bgTint: "bg-blue-500/[0.04]",
    borderTint: "border-blue-500/20",
    iconBg: "bg-blue-500/15",
  },
  product_outcome: {
    label: "Product Outcome",
    description: "The user behavior change that creates business value",
    childrenLabel: "Opportunities",
    icon: "TrendingUp",
    accentColor: "text-violet-400",
    bgTint: "bg-violet-500/[0.04]",
    borderTint: "border-violet-500/20",
    iconBg: "bg-violet-500/15",
  },
  opportunity: {
    label: "Opportunity",
    description: "An unmet need, pain point, or desire worth solving",
    childrenLabel: "Solutions",
    icon: "Lightbulb",
    accentColor: "text-amber-400",
    bgTint: "bg-amber-500/[0.04]",
    borderTint: "border-amber-500/20",
    iconBg: "bg-amber-500/15",
  },
  solution: {
    label: "Solution",
    description: "A specific way to address an opportunity",
    childrenLabel: "Assumptions",
    icon: "Puzzle",
    accentColor: "text-emerald-400",
    bgTint: "bg-emerald-500/[0.04]",
    borderTint: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
  },
  assumption: {
    label: "Assumption",
    description: "A belief that must be true for a solution to work",
    childrenLabel: "Tests",
    icon: "HelpCircle",
    accentColor: "text-orange-400",
    bgTint: "bg-orange-500/[0.04]",
    borderTint: "border-orange-500/20",
    iconBg: "bg-orange-500/15",
  },
  test: {
    label: "Test",
    description: "An experiment to validate or invalidate an assumption",
    childrenLabel: "",
    icon: "FlaskConical",
    accentColor: "text-cyan-400",
    bgTint: "bg-cyan-500/[0.04]",
    borderTint: "border-cyan-500/20",
    iconBg: "bg-cyan-500/15",
  },
};

// ── Status system ─────────────────────────────────────────────────────────

export type EntityStatus = "now" | "next" | "later" | "done" | "archived";
export type ProductLineStatus = "active" | "closed" | "archived";

export const ENTITY_STATUS_META: Record<EntityStatus, { label: string; color: string; dotColor: string }> = {
  now:      { label: "Now",      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25", dotColor: "bg-emerald-400" },
  next:     { label: "Next",     color: "text-blue-400 bg-blue-400/10 border-blue-400/25",         dotColor: "bg-blue-400" },
  later:    { label: "Later",    color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/25",         dotColor: "bg-zinc-400" },
  done:     { label: "Done",     color: "text-violet-400 bg-violet-400/10 border-violet-400/25",   dotColor: "bg-violet-400" },
  archived: { label: "Archived", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/25",         dotColor: "bg-zinc-600" },
};

export const PRODUCT_LINE_STATUS_META: Record<ProductLineStatus, { label: string; color: string; dotColor: string }> = {
  active:   { label: "Active",   color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25", dotColor: "bg-emerald-400" },
  closed:   { label: "Closed",   color: "text-amber-400 bg-amber-400/10 border-amber-400/25",      dotColor: "bg-amber-400" },
  archived: { label: "Archived", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/25",          dotColor: "bg-zinc-600" },
};

export const ENTITY_STATUSES: EntityStatus[] = ["now", "next", "later", "done", "archived"];
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

// ── Unified entity ────────────────────────────────────────────────────────

export interface Entity {
  id: string;
  level: EntityLevel;
  title: string;
  icon: string;
  description: string;
  status: EntityStatus;
  parentId?: string;
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
  tree: DiscoveryTree;
  entities: EntityStore;
}
