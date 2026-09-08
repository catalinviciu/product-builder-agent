import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { withStoreMutex } from "@/app/lib/storeAccess";
import {
  getMetric,
  activeOutcomeForMetric,
  nearestOutcomeAncestor,
  levelForMetric,
  placeOutcome,
  syncOutcomeParentage,
} from "@/app/lib/metrics";
import { createBlockTemplate } from "@/app/lib/schemas";
import type { Entity } from "@/app/lib/schemas";

/**
 * Attaches an outcome to a metric — either an existing entity (`entityId`) or a
 * new one (`title`). The outcome's level and its place in the discovery tree are
 * derived from the metric tree: the nearest ancestor metric that already has an
 * outcome becomes its parent, and a metric with no such ancestor gets a
 * Business Outcome at the root.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { entityId, title, description } = body as Record<string, unknown>;
    if (entityId === undefined && typeof title !== "string") {
      return NextResponse.json(
        { ok: false, error: "Provide entityId to attach an existing outcome, or title to create one" },
        { status: 400 },
      );
    }

    const outcome = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const metric = getMetric(pl, metricId);
      if (!metric) throw new Error("Metric not found");
      // One *active* outcome per metric. A finished one leaves the metric free.
      if (activeOutcomeForMetric(pl, metricId)) throw new Error("Conflict: this metric already has an outcome being worked on");

      let entity: Entity;
      if (typeof entityId === "string") {
        const existing = pl.entities[entityId];
        if (!existing) throw new Error("Entity not found");
        if (existing.level !== "business_outcome" && existing.level !== "product_outcome") {
          throw new Error("Conflict: only a Business or Product Outcome can attach to a metric");
        }
        if (existing.metricId) throw new Error("Conflict: that outcome already has a metric");
        entity = existing;
      } else {
        const level = levelForMetric(pl, metricId);
        const today = new Date().toISOString().slice(0, 10);
        const newId = randomUUID();
        entity = {
          id: newId,
          level,
          title: (title as string).trim() || metric.name,
          icon: level === "business_outcome" ? "Target" : "TrendingUp",
          description: typeof description === "string" ? description : "",
          status: "draft",
          statusHistory: [{ status: "draft", date: today }],
          children: [],
          blocks: createBlockTemplate(level, newId),
        };
        pl.entities[newId] = entity;
      }

      entity.metricId = metricId;
      placeOutcome(pl, entity, nearestOutcomeAncestor(pl, metricId)?.id);
      syncOutcomeParentage(pl, metricId);

      return { store, result: entity };
    });

    return NextResponse.json({ ok: true, data: outcome });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    if (/^Conflict/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 409 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * Detaches an outcome from this metric. The metric keeps its data and children.
 *
 * With no `entityId` query param, detaches today's active outcome (the
 * original behaviour). With `entityId`, detaches that specific outcome —
 * active or already finished — as long as it is the one attached to this
 * metric. The metric's target fields are only cleared when the outcome
 * being detached was the active one; a finished outcome carries no target.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; metricId: string }> }) {
  try {
    const { id, metricId } = await params;
    const entityId = new URL(req.url).searchParams.get("entityId");

    const metric = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      const found = getMetric(pl, metricId);
      if (!found) throw new Error("Metric not found");

      const active = activeOutcomeForMetric(pl, metricId);

      if (entityId) {
        const entity = pl.entities[entityId];
        if (!entity || entity.metricId !== metricId) throw new Error("Outcome not found on this metric");
        entity.metricId = undefined;
        if (active?.id === entity.id) {
          found.numericTarget = undefined;
          found.endDate = undefined;
          found.legacyTargetValue = undefined;
          found.legacyTimeframe = undefined;
        }
        return { store, result: found };
      }

      if (active) active.metricId = undefined;
      found.numericTarget = undefined;
      found.endDate = undefined;
      found.legacyTargetValue = undefined;
      found.legacyTimeframe = undefined;
      return { store, result: found };
    });

    return NextResponse.json({ ok: true, data: metric });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
