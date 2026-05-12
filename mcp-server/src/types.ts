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
  MetricBlock,
  ProductLine,
  ProductLineStatus,
  Persona,
  Signal,
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

import type { ProductLine, Entity } from "../../Product-Agent-app/app/lib/schemas.js";

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
