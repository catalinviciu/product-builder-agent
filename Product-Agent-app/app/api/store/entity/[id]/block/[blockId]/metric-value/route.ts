import { NextResponse } from "next/server";
import { findEntity, withStoreMutex } from "@/app/lib/storeAccess";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; blockId: string }> }) {
  try {
    const { id, blockId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const { date, value } = body as { date: unknown; value: unknown };
    if (typeof date !== "string") {
      return NextResponse.json({ ok: false, error: "date must be a string" }, { status: 400 });
    }
    if (typeof value !== "number") {
      return NextResponse.json({ ok: false, error: "value must be a number" }, { status: 400 });
    }

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const block = found.entity.blocks.find((b) => b.id === blockId);
      if (!block) throw new Error("Block not found");
      if (block.type !== "metric") throw new Error("Block is not a metric block");
      if (!block.dataSeries) block.dataSeries = [];
      const existing = block.dataSeries.find((dp) => dp.date === date);
      if (existing) {
        existing.value = value;
      } else {
        block.dataSeries.push({ date, value });
        block.dataSeries.sort((a, b) => a.date.localeCompare(b.date));
      }
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 404 });
    if (/not a metric/.test(msg)) return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
