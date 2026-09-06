/**
 * Metric registry helpers — shared by the Zustand store (client) and the API
 * route handlers (server) so the two write paths can never drift.
 *
 * A metric is a first-class object on the product line. It forms the metric
 * tree through `parentMetricId`. An outcome entity may attach to a metric via
 * `Entity.metricId`, which extends that metric with a target and a discovery
 * tree; the metric itself is independent of any outcome.
 */

import { getPeriodDate, formatMetricValue, CLOSED_OUTCOME_STATUSES, CURRENT_SCHEMA_VERSION } from "./schemas";
import type {
  Entity,
  EntityLevel,
  Metric,
  MetricDataPoint,
  MetricFrequency,
  MetricValueFormat,
  ProductLine,
  LegacyMetricBlock,
  LegacySignal,
} from "./schemas";

// ── Lookup ────────────────────────────────────────────────────────────────

export function getMetric(pl: ProductLine, metricId: string): Metric | undefined {
  return pl.metrics?.find((m) => m.id === metricId);
}

export function getRootMetrics(pl: ProductLine): Metric[] {
  return (pl.metrics ?? []).filter((m) => !m.parentMetricId);
}

/** Direct children of a metric, in registry order. */
export function getChildMetrics(pl: ProductLine, metricId: string): Metric[] {
  return (pl.metrics ?? []).filter((m) => m.parentMetricId === metricId);
}

/** Every descendant id of a metric, breadth-first. */
export function getMetricDescendantIds(pl: ProductLine, metricId: string): Set<string> {
  const out = new Set<string>();
  const queue = [metricId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const m of pl.metrics ?? []) {
      if (m.parentMetricId === id && !out.has(m.id)) {
        out.add(m.id);
        queue.push(m.id);
      }
    }
  }
  return out;
}

/**
 * Outcome lookup comes in two flavours, because two different questions were
 * being asked of one function:
 *
 *  - "Is someone working this metric right now?" -> `activeOutcomeForMetric`.
 *    Drives the card, the attach guards, the status badge and the sort. A metric
 *    whose outcome is done/dropped/archived answers no, and can take a new one.
 *
 *  - "Who owns this node in the discovery tree?" -> `outcomeForMetric`.
 *    Answers with the active outcome, or the most recent finished one when there
 *    is none. The hierarchy walk uses this so the discovery tree does not
 *    restructure itself the moment you mark something done.
 *
 * A metric therefore holds at most one active outcome plus any number of
 * finished ones. `Entity.metricId` stays the single truth on all of them.
 */

/** Every outcome ever attached to this metric, active or finished. */
export function outcomesForMetric(pl: ProductLine, metricId: string): Entity[] {
  return Object.values(pl.entities).filter((e) => e.metricId === metricId);
}

/** The outcome currently being worked on this metric, if any. */
export function activeOutcomeForMetric(pl: ProductLine, metricId: string): Entity | undefined {
  return outcomesForMetric(pl, metricId).find((e) => !CLOSED_OUTCOME_STATUSES.has(e.status));
}

/** Finished outcomes, most recently closed first, for the links on the metric card. */
export function pastOutcomesForMetric(pl: ProductLine, metricId: string): Entity[] {
  return outcomesForMetric(pl, metricId)
    .filter((e) => CLOSED_OUTCOME_STATUSES.has(e.status))
    .sort((a, b) => closedAt(b).localeCompare(closedAt(a)));
}

/** When an outcome was closed, from its status history. Empty string sorts last. */
function closedAt(entity: Entity): string {
  const history = entity.statusHistory ?? [];
  for (let i = history.length - 1; i >= 0; i--) {
    if (CLOSED_OUTCOME_STATUSES.has(history[i].status)) return history[i].date;
  }
  return "";
}

/** The outcome that owns this metric's node in the discovery tree. */
export function outcomeForMetric(pl: ProductLine, metricId: string): Entity | undefined {
  return activeOutcomeForMetric(pl, metricId) ?? pastOutcomesForMetric(pl, metricId)[0];
}

/** metricId -> the outcome currently being worked on it. */
export function activeMetricToOutcome(pl: ProductLine): Record<string, Entity> {
  const map: Record<string, Entity> = {};
  for (const e of Object.values(pl.entities)) {
    if (e.metricId && !CLOSED_OUTCOME_STATUSES.has(e.status)) map[e.metricId] = e;
  }
  return map;
}

/** metricId -> its finished outcomes, most recently closed first. */
export function pastMetricToOutcomes(pl: ProductLine): Record<string, Entity[]> {
  const map: Record<string, Entity[]> = {};
  for (const e of Object.values(pl.entities)) {
    if (!e.metricId || !CLOSED_OUTCOME_STATUSES.has(e.status)) continue;
    (map[e.metricId] ??= []).push(e);
  }
  for (const list of Object.values(map)) {
    list.sort((a, b) => closedAt(b).localeCompare(closedAt(a)));
  }
  return map;
}

/** The most recent data point, or undefined on an empty series. */
export function latestPoint(metric: Metric): MetricDataPoint | undefined {
  return metric.dataSeries.length ? metric.dataSeries[metric.dataSeries.length - 1] : undefined;
}

/** True once a metric carries a real target — the structured shape. Legacy metrics carry strings instead. */
export function hasTarget(metric: Metric): boolean {
  return metric.numericTarget !== undefined;
}

/**
 * One-line summary for a collapsed card: where the metric is now and where it
 * is headed. Falls back to the pre-v2 display strings when there is no target.
 */
export function metricPreview(metric: Metric): string {
  const last = latestPoint(metric);
  const fmt = (v: number) => formatMetricValue(v, metric.valueFormat);
  const current = last ? fmt(last.value) : metric.legacyCurrentValue;
  const start = metric.initialValue !== undefined ? fmt(metric.initialValue) : undefined;
  const target = metric.numericTarget !== undefined ? fmt(metric.numericTarget) : metric.legacyTargetValue;

  if (current && start && target) return `${current} current · ${start} → ${target}`;
  if (current && target) return `${current} → ${target}`;
  if (current) return `${current} current`;
  if (target) return `Target ${target}`;
  return "";
}

// ── Hierarchy ─────────────────────────────────────────────────────────────

/**
 * Walks up `parentMetricId` and returns the first ancestor that has an outcome
 * attached. Metrics with no outcome are transparent — they are skipped, so a
 * PO can sit under a BO through any number of plain tracking metrics.
 */
export function nearestOutcomeAncestor(pl: ProductLine, metricId: string): Entity | undefined {
  let current = getMetric(pl, metricId);
  const seen = new Set<string>([metricId]);
  while (current?.parentMetricId) {
    if (seen.has(current.parentMetricId)) return undefined; // corrupt cycle; refuse to loop
    seen.add(current.parentMetricId);
    const outcome = outcomeForMetric(pl, current.parentMetricId);
    if (outcome) return outcome;
    current = getMetric(pl, current.parentMetricId);
  }
  return undefined;
}

/**
 * Whether `metricId` may be moved under `newParentId`.
 * Rejects cycles, and rejects a placement that would put a Business Outcome
 * underneath a Product Outcome — the entity hierarchy has no such shape.
 */
export function canParentMetric(
  pl: ProductLine,
  metricId: string,
  newParentId: string | undefined,
): boolean {
  if (!newParentId) return true; // promoting to a root is always legal
  if (newParentId === metricId) return false;
  if (getMetricDescendantIds(pl, metricId).has(newParentId)) return false;
  if (!getMetric(pl, newParentId)) return false;

  const outcome = outcomeForMetric(pl, metricId);
  if (outcome?.level !== "business_outcome") return true;

  // A BO cannot end up below a PO. Walk the prospective ancestor chain.
  let cursor: string | undefined = newParentId;
  const seen = new Set<string>();
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    if (outcomeForMetric(pl, cursor)?.level === "product_outcome") return false;
    cursor = getMetric(pl, cursor)?.parentMetricId;
  }
  return true;
}

/** Detaches an entity from wherever it currently sits in the discovery tree. */
function unlinkFromTree(pl: ProductLine, entity: Entity): void {
  if (entity.parentId && pl.entities[entity.parentId]) {
    const parent = pl.entities[entity.parentId];
    parent.children = parent.children.filter((id) => id !== entity.id);
  }
  pl.tree.rootChildren = pl.tree.rootChildren.filter((id) => id !== entity.id);
}

/** Places an entity under `newParentId`, or at the root when undefined. */
export function placeOutcome(pl: ProductLine, entity: Entity, newParentId: string | undefined): void {
  if (entity.parentId === newParentId) {
    // Already correct, but make sure it is actually listed exactly once.
    const list = newParentId ? pl.entities[newParentId]?.children : pl.tree.rootChildren;
    if (list && !list.includes(entity.id)) list.push(entity.id);
    return;
  }
  unlinkFromTree(pl, entity);
  if (newParentId && pl.entities[newParentId]) {
    pl.entities[newParentId].children.push(entity.id);
    entity.parentId = newParentId;
  } else {
    pl.tree.rootChildren.push(entity.id);
    entity.parentId = undefined;
  }
}

/**
 * Re-derives discovery-tree parentage from metric parentage for a metric and
 * everything beneath it. This is what keeps the two trees locked together.
 */
export function syncOutcomeParentage(pl: ProductLine, metricId: string): void {
  const ids = [metricId, ...getMetricDescendantIds(pl, metricId)];
  for (const id of ids) {
    const parentId = nearestOutcomeAncestor(pl, id)?.id;
    // Every outcome on this metric travels with it, finished ones included, so
    // a metric move never strands past work somewhere unrelated.
    for (const outcome of outcomesForMetric(pl, id)) {
      placeOutcome(pl, outcome, parentId);
    }
  }
}

/** The level an outcome would take if attached to this metric. */
export function levelForMetric(pl: ProductLine, metricId: string): EntityLevel {
  return nearestOutcomeAncestor(pl, metricId) ? "product_outcome" : "business_outcome";
}

// ── Data points ───────────────────────────────────────────────────────────

/**
 * Upserts one data point, snapped to the metric's recording period, keeping the
 * series sorted. The single implementation for both the UI and the MCP path —
 * the MCP path previously skipped snapping and could write a Wednesday value
 * onto a weekly metric.
 */
export function upsertDataPoint(metric: Metric, date: string, value: number): void {
  const snapped = snapToPeriod(date, metric.frequency);
  const existing = metric.dataSeries.find((dp) => dp.date === snapped);
  if (existing) {
    existing.value = value;
    return;
  }
  metric.dataSeries.push({ date: snapped, value });
  metric.dataSeries.sort((a, b) => a.date.localeCompare(b.date));
}

export function snapToPeriod(date: string, frequency: MetricFrequency): string {
  const parsed = new Date(date + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) return date;
  return getPeriodDate(parsed, frequency);
}

// ── Creation ──────────────────────────────────────────────────────────────

export interface NewMetricInput {
  name: string;
  metricType: Metric["metricType"];
  frequency?: MetricFrequency;
  valueFormat?: MetricValueFormat;
  parentMetricId?: string;
  initialValue?: number;
  numericTarget?: number;
  startDate?: string;
  endDate?: string;
}

export function createMetric(id: string, input: NewMetricInput): Metric {
  const metric: Metric = {
    id,
    name: input.name.trim(),
    metricType: input.metricType,
    status: "active",
    frequency: input.frequency ?? "weekly",
    valueFormat: input.valueFormat ?? "number",
    dataSeries: [],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  if (input.parentMetricId) metric.parentMetricId = input.parentMetricId;
  if (input.initialValue !== undefined) metric.initialValue = input.initialValue;
  if (input.numericTarget !== undefined) metric.numericTarget = input.numericTarget;
  if (input.startDate) metric.startDate = input.startDate;
  if (input.endDate) metric.endDate = input.endDate;
  return metric;
}

// ── Migration to schema v2 ────────────────────────────────────────────────

type PreV2Entity = Entity & { signals?: LegacySignal[] };

/**
 * Lifts pre-v2 data into the metric registry, in place.
 *
 * Before v2 the same idea was stored twice: a `metric` block on the BO/PO, and
 * a root signal on `entity.signals` mirroring it. Those collapse into the one
 * metric the outcome attaches to. Child signals become child metrics. Signals
 * that were stored on a Business Outcome — invisible in the old UI, since only
 * POs rendered a Signals tab — migrate the same way and become visible.
 *
 * Legacy metric blocks hold display strings ("$1.2M", "<3%") with no numbers
 * behind them. Those strings are preserved as-is; no values are invented.
 */
export function migrateProductLineToMetrics(pl: ProductLine): boolean {
  if (pl.schemaVersion !== undefined && pl.schemaVersion >= CURRENT_SCHEMA_VERSION) return false;
  if (pl.metrics !== undefined && pl.metrics.length > 0) {
    pl.schemaVersion = CURRENT_SCHEMA_VERSION;
    return false;
  }

  const metrics: Metric[] = [];
  /** old signal id -> new metric id, so child signals can find their parent */
  const signalToMetric: Record<string, string> = {};

  const entities = Object.values(pl.entities) as PreV2Entity[];
  const outcomes = entities.filter(
    (e) => e.level === "business_outcome" || e.level === "product_outcome",
  );

  // Pass 1 — one metric per outcome, from its metric block plus its root signal.
  for (const entity of outcomes) {
    const block = entity.blocks.find(
      (b) => (b as unknown as LegacyMetricBlock).type === "metric",
    ) as unknown as LegacyMetricBlock | undefined;
    const signals = entity.signals ?? [];
    const rootSignal = signals.find((s) => !s.parentSignalId);

    const name =
      block?.metric?.trim() || rootSignal?.name?.trim() || entity.title || "Key metric";

    const metric: Metric = {
      id: `metric-${entity.id}`,
      name,
      metricType: entity.level === "business_outcome" ? "business" : "product",
      status: "active",
      frequency: block?.frequency ?? rootSignal?.frequency ?? "weekly",
      valueFormat: block?.valueFormat ?? rootSignal?.valueFormat ?? "number",
      dataSeries: (block?.dataSeries?.length ? block.dataSeries : rootSignal?.dataSeries) ?? [],
      createdAt: rootSignal?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    if (block?.initialValue !== undefined) metric.initialValue = block.initialValue;
    if (block?.numericTarget !== undefined) metric.numericTarget = block.numericTarget;
    if (block?.startDate) metric.startDate = block.startDate;
    if (block?.endDate) metric.endDate = block.endDate;

    // Legacy thin block: strings only, nothing numeric to carry across.
    if (block && block.frequency === undefined) {
      if (block.currentValue) metric.legacyCurrentValue = block.currentValue;
      if (block.targetValue) metric.legacyTargetValue = block.targetValue;
      if (block.timeframe) metric.legacyTimeframe = block.timeframe;
    }

    metrics.push(metric);
    entity.metricId = metric.id;
    if (rootSignal) signalToMetric[rootSignal.id] = metric.id;

    // The block and the signals array are now redundant.
    entity.blocks = entity.blocks.filter(
      (b) => (b as unknown as LegacyMetricBlock).type !== "metric",
    );
  }

  // Pass 2 — child signals become child metrics. Two passes over the list so a
  // signal nested under a signal resolves whatever the array order.
  const pending: Array<{ signal: LegacySignal; owner: PreV2Entity }> = [];
  for (const entity of outcomes) {
    for (const signal of entity.signals ?? []) {
      if (!signal.parentSignalId) continue;
      pending.push({ signal, owner: entity });
    }
  }

  for (const { signal } of pending) {
    signalToMetric[signal.id] = `metric-${signal.id}`;
  }

  for (const { signal, owner } of pending) {
    metrics.push({
      id: signalToMetric[signal.id],
      name: signal.name,
      metricType: "product",
      status: signal.status === "paused" ? "paused" : "active",
      frequency: signal.frequency,
      valueFormat: signal.valueFormat,
      dataSeries: signal.dataSeries ?? [],
      createdAt: signal.createdAt,
      parentMetricId:
        signalToMetric[signal.parentSignalId!] ?? owner.metricId ?? undefined,
    });
  }

  // Pass 3 — outcome metrics inherit the entity hierarchy they already had.
  for (const entity of outcomes) {
    if (!entity.parentId) continue;
    const parentMetricId = pl.entities[entity.parentId]?.metricId;
    if (!parentMetricId || !entity.metricId) continue;
    const metric = metrics.find((m) => m.id === entity.metricId);
    if (metric) metric.parentMetricId = parentMetricId;
  }

  for (const entity of entities) {
    delete entity.signals;
  }

  pl.metrics = metrics;
  pl.schemaVersion = CURRENT_SCHEMA_VERSION;
  return true;
}
