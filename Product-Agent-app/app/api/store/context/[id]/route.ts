import { NextResponse } from "next/server";
import { buildSubtree, findEntity, getAncestors, readStore } from "@/app/lib/storeAccess";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const ancestorsFlag = url.searchParams.get("ancestors") !== "false"; // default true
    const productLineMeta = url.searchParams.get("productLineMeta") !== "false"; // default true
    const depthParam = url.searchParams.get("descendantsDepth");
    const depth = depthParam !== null ? Math.max(0, Math.min(99, Number(depthParam))) : 2;

    const store = await readStore();
    const found = findEntity(store, id);
    if (!found) return NextResponse.json({ ok: false, error: "Entity not found" }, { status: 404 });

    const { entity, productLine } = found;
    const subtree = buildSubtree(productLine, id, depth);
    const data = {
      productLine: productLineMeta
        ? {
            id: productLine.id,
            name: productLine.name,
            status: productLine.status,
            personas: productLine.personas ?? [],
          }
        : { id: productLine.id, name: productLine.name, status: productLine.status },
      ancestors: ancestorsFlag ? getAncestors(productLine, id) : [],
      entity,
      descendants: subtree?.children ?? [],
    };
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
