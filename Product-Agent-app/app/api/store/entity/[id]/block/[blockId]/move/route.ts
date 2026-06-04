import { NextResponse } from "next/server";
import { findEntity, moveBlock, withStoreMutex } from "@/app/lib/storeAccess";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; blockId: string }> }) {
  try {
    const { id, blockId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { toIndex } = body as { toIndex: unknown };
    if (typeof toIndex !== "number" || !Number.isInteger(toIndex) || toIndex < 0) {
      return NextResponse.json({ ok: false, error: "toIndex must be an integer >= 0" }, { status: 400 });
    }

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      moveBlock(found.entity, blockId, toIndex);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
