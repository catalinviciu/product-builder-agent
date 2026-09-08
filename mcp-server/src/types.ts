/**
 * Re-export of canonical app types. Imported directly from Product-Agent-app
 * so the MCP server can never drift from the app's schema — if the app
 * changes a type, tsc fails here.
 */
export type {
  Entity,
  EntityLevel,
  EntityStatus,
  EntityStore,
  Block,
  BlockType,
  AccordionBlock,
  PillsBlock,
  QuoteBlock,
  ProductLine,
  ProductLineStatus,
  ProductLineSettings,
  DesignSystemSettings,
  AnalyticsPlatformSettings,
  StoryMapSettings,
  Persona,
  Metric,
  MetricType,
  MetricStatus,
  Story,
  StoryIteration,
  AssumptionType,
  TestType,
  IceScore,
  StatusHistoryEntry,
  DiscoveryTree,
  MetricFrequency,
  MetricValueFormat,
  MetricDataPoint,
} from "../../Product-Agent-app/app/lib/schemas.js";

export { CHILD_LEVEL } from "../../Product-Agent-app/app/lib/schemas.js";

import type { ProductLine, Entity, EntityLevel, Metric } from "../../Product-Agent-app/app/lib/schemas.js";

/** Lightweight summary used by list endpoints. */
export interface ProductLineSummary {
  id: ProductLine["id"];
  name: ProductLine["name"];
  status: ProductLine["status"];
  description: ProductLine["description"];
}

/** Recursive entity tree used by getSubtree and getContext. */
export interface EntityNode {
  entity: Entity;
  children: EntityNode[];
}

/** Composite payload returned by pa_get_context. */
export interface EntityContext {
  productLine: {
    id: ProductLine["id"];
    name: ProductLine["name"];
    status: ProductLine["status"];
    personas?: ProductLine["personas"];
  };
  ancestors: Entity[];
  entity: Entity;
  descendants: EntityNode[];
}

/**
 * A metric with its recorded series replaced by a three-field digest. Every
 * list-shaped metric read returns these; the series itself comes back one
 * metric at a time from pa_get_metric. Mirrors MetricSummary in
 * Product-Agent-app/app/lib/metrics.ts.
 */
export type MetricSummary = Omit<Metric, "dataSeries"> & {
  pointCount: number;
  latestDate?: string;
  latestValue?: number;
};

/** What pa_delete_metric reports back, instead of the whole surviving registry. */
export interface DeleteMetricResult {
  deleted: string;
  /** Where the deleted metric's children were re-hung; null when it was a root. */
  reparentedTo: string | null;
  reparentedChildren: string[];
  /** Every outcome that let go of the metric, active and finished alike. */
  detachedOutcomes: string[];
  remainingCount: number;
}

/** Trimmed outcome summary used in the metric tree, instead of a whole entity. */
export interface OutcomeSummary {
  id: string;
  title: string;
  level: EntityLevel;
  status: Entity["status"];
}

/** One node of the metric tree returned by pa_get_metric_tree. */
export interface MetricTreeNode {
  metric: MetricSummary;
  activeOutcome: OutcomeSummary | null;
  pastOutcomes: OutcomeSummary[];
  levelIfAttached: "business_outcome" | "product_outcome";
  canTakeOutcome: boolean;
  children: MetricTreeNode[];
}

/** Input shape for creating a new entity. */
export interface CreateEntityInput {
  productLineId: string;
  level: Entity["level"];
  title: string;
  description?: string;
  parentId?: string;
  status?: Entity["status"];
  personaId?: string;
  secondaryPersonaIds?: string[];
  assumptionType?: Entity["assumptionType"];
  testType?: Entity["testType"];
}
