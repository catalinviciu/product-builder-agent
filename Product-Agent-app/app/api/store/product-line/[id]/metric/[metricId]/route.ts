import { NextResponse } from "next/server";
import { withStoreMutex } from "@/app/lib/storeAccess";
import {
  getMetric,
  getChildMetrics,
  outcomeForMetric,
  syncOutcomeParentage,
  upsertDataPoint,
} from "@/app/lib/metrics";
import type { Metric } from "@/app/lib/schemas";

const PATCHABLE = [
  "name",
  "metricType",
  "frequency",
  "valueFormat",
  "status",
  "initialValue",
  "numericTarget",
  "startDate",
  "endDate",
] as const;

/** Patches safe fields on a metric. Changing frequency re-snaps the series. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    const updated = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");

      const patch = body as Partial<Record<(typeof PATCHABLE)[number], unknown>>;
      for (const key of PATCHABLE) {
        if (patch[key] === undefined) continue;
        (metric as unknown as Record<string, unknown>)[key] = patch[key];
      }

      if (patch.frequency !== undefined) {
        const points = metric.dataSeries;
        metric.dataSeries = [];
        for (const dp of points) upsertDataPoint(metric, dp.date, dp.value);
      }

      return { store, result: metric as Metric };
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * Deletes a metric. Children rise to take its place, and any outcome attached
 * to it is detached rather than deleted.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;

    const remaining = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");

      for (const child of getChildMetrics(pl, metricId)) {
        child.parentMetricId = metric.parentMetricId;
      }
      const outcome = outcomeForMetric(pl, metricId);
      if (outcome) outcome.metricId = undefined;

      pl.metrics = (pl.metrics ?? []).filter((m) => m.id !== metricId);
      if (metric.parentMetricId) syncOutcomeParentage(pl, metric.parentMetricId);

      return { store, result: pl.metrics };
    });

    return NextResponse.json({ ok: true, data: remaining });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/** Reads one metric. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const metric = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const found = getMetric(pl, metricId);
      if (!found) throw new Error("Metric not found");
      return { store, result: found };
    });
    return NextResponse.json({ ok: true, data: metric });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
