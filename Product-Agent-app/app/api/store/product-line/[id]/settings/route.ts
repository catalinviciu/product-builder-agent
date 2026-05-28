import { NextResponse } from "next/server";
import type { ProductLineSettings } from "@/app/lib/schemas";
import { DEFAULT_PRODUCT_LINE_SETTINGS } from "@/app/lib/schemas";
import { withStoreMutex } from "@/app/lib/storeAccess";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const patch = body as Partial<ProductLineSettings>;

    // Trim codebasePath to null-if-empty (mirrors updateProductLineSettings in store.ts)
    if ("codebasePath" in patch && typeof patch.codebasePath === "string") {
      const trimmed = patch.codebasePath.trim();
      patch.codebasePath = trimmed || null;
    }

    const updated = await withStoreMutex(async (store) => {
      const pl = store[id];
      if (!pl) throw new Error("Product line not found");
      if (!pl.settings) pl.settings = { ...DEFAULT_PRODUCT_LINE_SETTINGS };
      Object.assign(pl.settings, patch);
      return { store, result: pl.settings };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg === "Product line not found" ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
