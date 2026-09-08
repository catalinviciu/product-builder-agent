import { NextResponse } from "next/server";
import { withStoreRead } from "@/app/lib/storeAccess";
import {
  getRootMetrics,
  getChildMetrics,
  activeOutcomeForMetric,
  pastOutcomesForMetric,
  levelForMetric,
  toMetricSummary,
  type MetricSummary,
} from "@/app/lib/metrics";
import type { Entity, EntityLevel, Metric, ProductLine } from "@/app/lib/schemas";

interface OutcomeSummary {
  id: string;
  title: string;
  level: EntityLevel;
  status: Entity["status"];
}

interface MetricTreeNode {
  /** Digested, not the whole metric — the recorded series stays on GET /metric/[metricId]. */
  metric: MetricSummary;
  activeOutcome: OutcomeSummary | null;
  pastOutcomes: OutcomeSummary[];
  levelIfAttached: "business_outcome" | "product_outcome";
  canTakeOutcome: boolean;
  children: MetricTreeNode[];
}

function toSummary(entity: Entity): OutcomeSummary {
  return { id: entity.id, title: entity.title, level: entity.level, status: entity.status };
}

// `seen` stops a corrupt parentMetricId cycle from recursing forever, the same
// way nearestOutcomeAncestor refuses to loop.
function buildNode(pl: ProductLine, metric: Metric, seen: Set<string>): MetricTreeNode {
  const active = activeOutcomeForMetric(pl, metric.id);
  seen.add(metric.id);
  return {
    metric: toMetricSummary(metric),
    activeOutcome: active ? toSummary(active) : null,
    pastOutcomes: pastOutcomesForMetric(pl, metric.id).map(toSummary),
    levelIfAttached: levelForMetric(pl, metric.id) as "business_outcome" | "product_outcome",
    canTakeOutcome: !active,
    children: getChildMetrics(pl, metric.id)
      .filter((child) => !seen.has(child.id))
      .map((child) => buildNode(pl, child, seen)),
  };
}

/**
 * Returns the metric tree nested, with trimmed outcome summaries instead of
 * whole entities and digested metrics instead of full series — this is the
 * cheap way to read metric + outcome shape together, versus pa_list_metrics
 * plus cross-referencing entities by hand.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tree = await withStoreRead((store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const seen = new Set<string>();
      return getRootMetrics(pl).map((root) => buildNode(pl, root, seen));
    });
    return NextResponse.json({ ok: true, data: tree });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
