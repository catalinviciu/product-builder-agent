import { NextResponse } from "next/server";
import type { Story } from "@/app/lib/schemas";
import { findEntity, patchStory, readStore, withStoreMutex } from "@/app/lib/storeAccess";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; storyId: string }> }) {
  try {
    const { id, storyId } = await params;
    const store = await readStore();
    const found = findEntity(store, id);
    if (!found) return NextResponse.json({ ok: false, error: "Entity not found" }, { status: 404 });
    const story = found.entity.stories?.find((s) => s.id === storyId);
    if (!story) return NextResponse.json({ ok: false, error: "Story not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: story });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; storyId: string }> }) {
  try {
    const { id, storyId } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
    const patch = body as Partial<Story>;

    const updated = await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const story = found.entity.stories?.find((s) => s.id === storyId);
      if (!story) throw new Error("Story not found");
      patchStory(story, patch);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; storyId: string }> }) {
  try {
    const { id, storyId } = await params;
    await withStoreMutex(async (store) => {
      const found = findEntity(store, id);
      if (!found) throw new Error("Entity not found");
      const idx = found.entity.stories?.findIndex((s) => s.id === storyId) ?? -1;
      if (idx < 0) throw new Error("Story not found");
      found.entity.stories!.splice(idx, 1);
      return { store, result: found.entity };
    });
    return NextResponse.json({ ok: true, data: { deleted: storyId } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
