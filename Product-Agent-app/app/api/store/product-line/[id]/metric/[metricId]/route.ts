import { NextResponse } from "next/server";
import { withStoreMutex, withStoreRead } from "@/app/lib/storeAccess";
import {
  getMetric,
  getChildMetrics,
  outcomesForMetric,
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

/** The four fields that only mean something while an outcome is attached — the only ones a null may clear. */
const TARGET_FIELDS = new Set<(typeof PATCHABLE)[number]>(["initialValue", "numericTarget", "startDate", "endDate"]);

const FREQUENCIES = ["daily", "weekly", "monthly", "quarterly"];
const FORMATS = ["number", "currency_usd", "currency_eur", "currency_gbp", "percentage"];
const STATUSES = ["active", "paused"];

/**
 * Patches safe fields on a metric. Changing frequency re-snaps the series.
 * A target field (initialValue/numericTarget/startDate/endDate) set to `null`
 * clears it — every other field rejects null with a 400.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    const patch = body as Partial<Record<(typeof PATCHABLE)[number], unknown>>;

    if ("name" in patch && (typeof patch.name !== "string" || !patch.name.trim())) {
      return NextResponse.json({ ok: false, error: "name must be a non-empty string" }, { status: 400 });
    }
    if ("metricType" in patch && patch.metricType !== "business" && patch.metricType !== "product") {
      return NextResponse.json({ ok: false, error: "metricType must be 'business' or 'product'" }, { status: 400 });
    }
    if ("frequency" in patch && !FREQUENCIES.includes(patch.frequency as string)) {
      return NextResponse.json({ ok: false, error: `frequency must be one of ${FREQUENCIES.join(", ")}` }, { status: 400 });
    }
    if ("valueFormat" in patch && !FORMATS.includes(patch.valueFormat as string)) {
      return NextResponse.json({ ok: false, error: `valueFormat must be one of ${FORMATS.join(", ")}` }, { status: 400 });
    }
    if ("status" in patch && !STATUSES.includes(patch.status as string)) {
      return NextResponse.json({ ok: false, error: `status must be one of ${STATUSES.join(", ")}` }, { status: 400 });
    }
    for (const key of ["initialValue", "numericTarget"] as const) {
      if (key in patch && patch[key] !== null && typeof patch[key] !== "number") {
        return NextResponse.json({ ok: false, error: `${key} must be a number, or null to clear it` }, { status: 400 });
      }
    }
    for (const key of ["startDate", "endDate"] as const) {
      if (key in patch && patch[key] !== null && typeof patch[key] !== "string") {
        return NextResponse.json({ ok: false, error: `${key} must be an ISO date string, or null to clear it` }, { status: 400 });
      }
    }

    const updated = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");

      for (const key of PATCHABLE) {
        if (!(key in patch)) continue;
        // Validation above already confines null to the four target fields.
        if (patch[key] === null && TARGET_FIELDS.has(key)) {
          delete (metric as unknown as Record<string, unknown>)[key];
        } else if (key === "name") {
          metric.name = (patch.name as string).trim();
        } else {
          (metric as unknown as Record<string, unknown>)[key] = patch[key];
        }
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
 * Deletes a metric. Children rise to take its place, and every outcome attached
 * to it is detached rather than deleted — a metric can carry one active outcome
 * plus any number of finished ones, and all of them have to let go of it or
 * they are left pointing at a metric that no longer exists.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;

    const summary = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");

      const reparentedChildren: string[] = [];
      for (const child of getChildMetrics(pl, metricId)) {
        child.parentMetricId = metric.parentMetricId;
        reparentedChildren.push(child.id);
      }
      const detachedOutcomes: string[] = [];
      for (const outcome of outcomesForMetric(pl, metricId)) {
        outcome.metricId = undefined;
        detachedOutcomes.push(outcome.id);
      }

      pl.metrics = (pl.metrics ?? []).filter((m) => m.id !== metricId);
      // Re-derive discovery-tree parentage from where the survivors now sit. A
      // root deletion has no parent to walk down from, so every root is synced.
      if (metric.parentMetricId) syncOutcomeParentage(pl, metric.parentMetricId);
      else for (const root of pl.metrics.filter((m) => !m.parentMetricId)) syncOutcomeParentage(pl, root.id);

      return {
        store,
        result: {
          deleted: metricId,
          reparentedTo: metric.parentMetricId ?? null,
          reparentedChildren,
          detachedOutcomes,
          remainingCount: pl.metrics.length,
        },
      };
    });

    return NextResponse.json({ ok: true, data: summary });
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
    const metric = await withStoreRead((store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const found = getMetric(pl, metricId);
      if (!found) throw new Error("Metric not found");
      return found;
    });
    return NextResponse.json({ ok: true, data: metric });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
