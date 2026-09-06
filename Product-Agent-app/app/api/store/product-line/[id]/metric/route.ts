import { NextResponse } from "next/server";
import { withStoreMutex } from "@/app/lib/storeAccess";
import { createMetric, getMetric } from "@/app/lib/metrics";
import type { MetricFrequency, MetricValueFormat, MetricType } from "@/app/lib/schemas";

const FREQUENCIES = ["daily", "weekly", "monthly", "quarterly"];
const FORMATS = ["number", "currency_usd", "currency_eur", "currency_gbp", "percentage"];

/** Creates a metric on a product line, optionally under a parent metric. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { name, metricType, frequency, valueFormat, parentMetricId, initialValue, numericTarget, startDate, endDate } =
      body as Record<string, unknown>;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ ok: false, error: "name must be a non-empty string" }, { status: 400 });
    }
    if (metricType !== undefined && metricType !== "business" && metricType !== "product") {
      return NextResponse.json({ ok: false, error: "metricType must be 'business' or 'product'" }, { status: 400 });
    }
    if (frequency !== undefined && !FREQUENCIES.includes(frequency as string)) {
      return NextResponse.json({ ok: false, error: `frequency must be one of ${FREQUENCIES.join(", ")}` }, { status: 400 });
    }
    if (valueFormat !== undefined && !FORMATS.includes(valueFormat as string)) {
      return NextResponse.json({ ok: false, error: `valueFormat must be one of ${FORMATS.join(", ")}` }, { status: 400 });
    }

    const created = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      pl.metrics ??= [];
      if (parentMetricId !== undefined && !getMetric(pl, parentMetricId as string)) {
        throw new Error("Parent metric not found");
      }
      const metric = createMetric(`metric-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, {
        name: name.trim(),
        metricType: (metricType as MetricType) ?? "product",
        frequency: frequency as MetricFrequency | undefined,
        valueFormat: valueFormat as MetricValueFormat | undefined,
        parentMetricId: parentMetricId as string | undefined,
        initialValue: typeof initialValue === "number" ? initialValue : undefined,
        numericTarget: typeof numericTarget === "number" ? numericTarget : undefined,
        startDate: typeof startDate === "string" ? startDate : undefined,
        endDate: typeof endDate === "string" ? endDate : undefined,
      });
      pl.metrics.push(metric);
      return { store, result: metric };
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/** Lists the metric registry for a product line. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const metrics = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      return { store, result: pl.metrics ?? [] };
    });
    return NextResponse.json({ ok: true, data: metrics });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
