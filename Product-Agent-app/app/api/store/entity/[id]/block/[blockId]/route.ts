import { NextResponse } from "next/server";
import type { Block } from "@/app/lib/schemas";
import { findEntity, patchBlock, withStoreMutex } from "@/app/lib/storeAccess";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; blockId: string }> }) {
  try {
    const { id, blockId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const patch = body as Partial<Block>;

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const block = found.entity.blocks.find((b) => b.id === blockId);
      if (!block) throw new Error("Block not found");
      patchBlock(block, patch);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; blockId: string }> }) {
  try {
    const { id, blockId } = await params;
    await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const idx = found.entity.blocks.findIndex((b) => b.id === blockId);
      if (idx < 0) throw new Error("Block not found");
      found.entity.blocks.splice(idx, 1);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: { deleted: blockId } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
