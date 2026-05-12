import { NextResponse } from "next/server";
import { findEntity, getAncestors, readStore } from "@/app/lib/storeAccess";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const store = await readStore();
    const found = findEntity(store, id);
    if (!found) return NextResponse.json({ ok: false, error: "Entity not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: getAncestors(found.productLine, id) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
