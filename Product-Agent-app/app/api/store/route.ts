import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { migrateData, writeStore, type Store } from "@/app/lib/storeAccess";
import { PRODUCT_LINES } from "@/app/lib/mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const data = JSON.parse(raw) as Store;
    let mtime = 0;
    try { const stat = await fs.stat(STORE_FILE); mtime = stat.mtimeMs; } catch {}
    return NextResponse.json({ exists: true, data: migrateData(data), mtime });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ exists: true, data: PRODUCT_LINES });
    }
    return NextResponse.json({ exists: false });
  }
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: "Invalid payload shape" }, { status: 400 });
    }

    const serialized = JSON.stringify(body, null, 2);
    if (serialized.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    await writeStore(body as Store);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fs.unlink(STORE_FILE);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
