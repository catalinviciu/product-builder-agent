import { NextResponse } from "next/server";
import { withStoreMutex } from "@/app/lib/storeAccess";
import { getMetric, toMetricSummary } from "@/app/lib/metrics";

/**
 * Reorders the siblings under one parent metric (or the roots, when
 * parentMetricId is null). Mirrors the store action `reorderMetrics` exactly,
 * including the `[...others, ...siblings]` rebuild, so the UI and MCP write
 * paths cannot drift. Returns the reordered siblings, not the whole registry.
 * Siblings left out of metricIds keep their relative order at the end.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { parentMetricId, metricIds } = body as Record<string, unknown>;

    if (parentMetricId !== null && typeof parentMetricId !== "string") {
      return NextResponse.json(
        { ok: false, error: "parentMetricId must be a metric id, or null for the top of the tree" },
        { status: 400 },
      );
    }
    if (!Array.isArray(metricIds) || metricIds.length === 0 || !metricIds.every((m) => typeof m === "string")) {
      return NextResponse.json({ ok: false, error: "metricIds must be a non-empty array of metric ids" }, { status: 400 });
    }

    const reordered = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      pl.metrics ??= [];

      const target = parentMetricId ?? undefined;
      for (const metricId of metricIds as string[]) {
        const metric = getMetric(pl, metricId);
        if (!metric) throw new Error(`Metric not found: ${metricId}`);
        if ((metric.parentMetricId ?? undefined) !== target) {
          throw new Error(`Metric ${metricId} is not a sibling under the given parent`);
        }
      }

      const order = new Map((metricIds as string[]).map((mid, i) => [mid, i]));
      const siblings = pl.metrics.filter((m) => (m.parentMetricId ?? undefined) === target);
      const others = pl.metrics.filter((m) => (m.parentMetricId ?? undefined) !== target);
      siblings.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
      pl.metrics = [...others, ...siblings];

      // Only the siblings that moved come back. The rest of the registry is
      // untouched, and returning it would be a large answer to a small question.
      return { store, result: siblings.map(toMetricSummary) };
    });

    return NextResponse.json({ ok: true, data: reordered });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    if (/not a sibling/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
