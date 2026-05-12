import { NextResponse } from "next/server";
import { createEntityIn, withStoreMutex, type CreateEntityInput } from "@/app/lib/storeAccess";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const input = body as CreateEntityInput;
    if (!input.productLineId || !input.level || !input.title) {
      return NextResponse.json({ ok: false, error: "productLineId, level, and title are required" }, { status: 400 });
    }

    const created = await withStoreMutex(async (store) => {
      const entity = createEntityIn(store, input);
      return { store, result: entity };
    });
    return NextResponse.json({ ok: true, data: created });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found|cannot have/.test(msg) ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
