import { NextResponse } from "next/server";
import type { Entity } from "@/app/lib/schemas";
import { findEntity, patchEntity, readStore, deleteEntity, EntityHasChildrenError, withStoreMutex } from "@/app/lib/storeAccess";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const store = await readStore();
    const found = findEntity(store, id);
    if (!found) return NextResponse.json({ ok: false, error: "Entity not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: found.entity });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const patch = body as Partial<Entity>;

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      patchEntity(found.entity, patch);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg === "Entity not found" ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await withStoreMutex(async (store) => {
      deleteEntity(store, id);
      return { store, result: id };
    });
    return NextResponse.json({ ok: true, data: { deleted: id } });
  } catch (err) {
    if (err instanceof EntityHasChildrenError) {
      return NextResponse.json(
        { ok: false, error: err.message, blockedBy: err.childIds },
        { status: 409 }
      );
    }
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.startsWith("Entity not found") ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
