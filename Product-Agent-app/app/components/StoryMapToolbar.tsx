"use client";

import { Copy } from "lucide-react";
import type { Story } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { buildUserStoryAcWriterPrompt } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import { showToast } from "@/components/ui/toast";

interface StoryMapToolbarProps {
  entityId: string;
  stories: Story[];
}

export function StoryMapToolbar({ entityId, stories }: StoryMapToolbarProps) {
  const productLine = useProductLine();
  // Only sliced stories (with narrative) are eligible for the AC writer.
  // Manual stories (no narrative) need refining first — they're handled via the slide-over.
  const slicedStoriesWithoutAcCount = stories.filter(
    (s) => !!s.narrative && !s.acceptanceCriteria,
  ).length;
  const hasAnyMissingAc = slicedStoriesWithoutAcCount > 0;

  const title = `${stories.length} ${stories.length === 1 ? "story" : "stories"}`;
  const subtitle = hasAnyMissingAc
    ? "No acceptance criteria yet. Add AC before you plan & implement."
    : "Pick a scope to plan & implement: whole map, an iteration row, or a single story.";

  async function handleCopy() {
    const text = buildUserStoryAcWriterPrompt(productLine, entityId);
    await navigator.clipboard.writeText(text);
    analyticsEmitter.emit("ac_writer_prompt_copied", {
      solution_id: entityId,
      stories_without_ac: slicedStoriesWithoutAcCount,
    });
    showToast({ message: "Prompt copied — paste into your agentic tool", tone: "success" });
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 px-3.5 py-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>
      {hasAnyMissingAc && (
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        >
          <Copy size={14} />
          Add acceptance criteria
        </button>
      )}
    </div>
  );
}
