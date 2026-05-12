import { NextResponse } from "next/server";
import { readStore } from "@/app/lib/storeAccess";

export async function GET() {
  try {
    const store = await readStore();
    const summaries = Object.values(store).map((pl) => ({
      id: pl.id,
      name: pl.name,
      status: pl.status,
      description: pl.description,
    }));
    return NextResponse.json({ ok: true, data: summaries });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
