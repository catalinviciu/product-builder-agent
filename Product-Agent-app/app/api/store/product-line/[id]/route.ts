import { NextResponse } from "next/server";
import { readStore } from "@/app/lib/storeAccess";

/** Returns the product line shell WITHOUT the entity tree contents. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const store = await readStore();
    const pl = store[id];
    if (!pl) return NextResponse.json({ ok: false, error: "Product line not found" }, { status: 404 });

    const shell = {
      id: pl.id,
      name: pl.name,
      description: pl.description,
      status: pl.status,
      personas: pl.personas ?? [],
      codePath: pl.codePath ?? "",
      blocks: pl.blocks ?? [],
      tree: { title: pl.tree.title, description: pl.tree.description, rootChildren: pl.tree.rootChildren },
    };
    return NextResponse.json({ ok: true, data: shell });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
