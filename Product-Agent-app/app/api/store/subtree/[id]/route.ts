import { NextResponse } from "next/server";
import { buildSubtree, findEntity, readStore } from "@/app/lib/storeAccess";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const depthParam = url.searchParams.get("depth");
    const depth = depthParam !== null ? Math.max(0, Math.min(99, Number(depthParam))) : 99;

    const store = await readStore();
    const found = findEntity(store, id);
    if (!found) return NextResponse.json({ ok: false, error: "Entity not found" }, { status: 404 });

    const subtree = buildSubtree(found.productLine, id, depth);
    return NextResponse.json({ ok: true, data: subtree });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
