import { NextResponse } from "next/server";
import type { Block } from "@/app/lib/schemas";
import { findEntity, patchBlock, withStoreMutex } from "@/app/lib/storeAccess";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; idx: string }> }) {
  try {
    const { id, idx } = await params;
    const blockIndex = Number(idx);
    if (!Number.isInteger(blockIndex) || blockIndex < 0) {
      return NextResponse.json({ ok: false, error: "Invalid block index" }, { status: 400 });
    }
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const patch = body as Partial<Block>;

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const block = found.entity.blocks[blockIndex];
      if (!block) throw new Error("Block index out of range");
      patchBlock(block, patch);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found|out of range/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
