import { NextResponse } from "next/server";
import { withStoreMutex } from "@/app/lib/storeAccess";
import { getMetric, canParentMetric, syncOutcomeParentage } from "@/app/lib/metrics";

/**
 * Moves a metric under another metric, or to the top of the tree when
 * `parentMetricId` is null. Any outcome attached below the moved metric follows
 * it in the discovery tree, so the two trees stay locked together.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { parentMetricId } = body as { parentMetricId: unknown };
    if (parentMetricId !== null && typeof parentMetricId !== "string") {
      return NextResponse.json(
        { ok: false, error: "parentMetricId must be a metric id, or null to move to the top" },
        { status: 400 },
      );
    }

    const updated = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");

      const target = parentMetricId ?? undefined;
      if (!canParentMetric(pl, metricId, target)) {
        throw new Error(
          "Invalid move: that would create a cycle, or put a Business Outcome underneath a Product Outcome",
        );
      }

      metric.parentMetricId = target;
      syncOutcomeParentage(pl, metricId);
      return { store, result: metric };
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    if (/Invalid move/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
