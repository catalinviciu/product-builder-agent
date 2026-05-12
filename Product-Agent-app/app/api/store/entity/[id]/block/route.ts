import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { Block } from "@/app/lib/schemas";
import { findEntity, withStoreMutex } from "@/app/lib/storeAccess";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const block = { ...body, id: (body as { id?: string }).id ?? randomUUID() } as Block;
    if (!block.type) {
      return NextResponse.json({ ok: false, error: "Block must have a type" }, { status: 400 });
    }

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      found.entity.blocks.push(block);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg === "Entity not found" ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
