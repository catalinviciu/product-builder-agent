import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const STORE_FILE = path.join(process.cwd(), "data", "store.json");

export async function GET() {
  try {
    const stat = await fs.stat(STORE_FILE);
    return NextResponse.json({ mtime: stat.mtimeMs });
  } catch {
    return NextResponse.json({ mtime: 0 });
  }
}
