import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const STORE_FILE_TMP = STORE_FILE + ".tmp";
const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ exists: true, data });
  } catch (err: unknown) {
    // ENOENT = file doesn't exist yet (first run) — not an error
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ exists: false });
    }
    return NextResponse.json({ exists: false });
  }
}

export async function POST(request: Request) {
  try {
    // Guard against oversized payloads
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();

    // Validate shape: must be a non-null, non-array plain object
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: "Invalid payload shape" }, { status: 400 });
    }

    // Guard against excessively large serialized data
    const serialized = JSON.stringify(body, null, 2);
    if (serialized.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Atomic write: write to .tmp then rename to avoid partial-write corruption
    await fs.writeFile(STORE_FILE_TMP, serialized, "utf-8");
    await fs.rename(STORE_FILE_TMP, STORE_FILE);

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
    // ENOENT is fine — file was already gone
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
