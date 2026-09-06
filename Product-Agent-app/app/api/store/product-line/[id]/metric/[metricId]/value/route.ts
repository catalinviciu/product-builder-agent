import { NextResponse } from "next/server";
import { withStoreMutex } from "@/app/lib/storeAccess";
import { getMetric, upsertDataPoint } from "@/app/lib/metrics";

/**
 * Upserts one data point on a metric.
 *
 * The date is snapped to the metric's recording period by `upsertDataPoint`,
 * the same helper the UI uses — so a Wednesday value on a weekly metric lands
 * on that week's Monday instead of sitting alongside the real points.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { date, value } = body as { date: unknown; value: unknown };
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ ok: false, error: "date must be an ISO date (YYYY-MM-DD)" }, { status: 400 });
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return NextResponse.json({ ok: false, error: "value must be a finite number" }, { status: 400 });
    }

    const updated = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");
      upsertDataPoint(metric, date, value);
      return { store, result: metric };
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
