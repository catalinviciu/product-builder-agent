"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Copy } from "lucide-react";
import type { Entity } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { buildUserStorySlicerPrompt } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import { showToast } from "@/components/ui/toast";
import { listPersonasWithStories } from "@/app/lib/story-map-utils";
import { PattonMap } from "./PattonMap";
import { PersonaStrip } from "./PersonaStrip";
import { StoryMapToolbar } from "./StoryMapToolbar";

interface StoriesTabProps {
  entity: Entity;
}

export function StoriesTab({ entity }: StoriesTabProps) {
  const productLine = useProductLine();
  const stories = entity.stories ?? [];

  const personasWithStories = listPersonasWithStories(stories);
  const [activePersona, setActivePersona] = useState<string | null>(
    personasWithStories[0]?.name ?? null,
  );

  // Reset activePersona if the previously selected persona disappears from the list
  useEffect(() => {
    if (activePersona === null || personasWithStories.some((p) => p.name === activePersona)) return;
    setActivePersona(personasWithStories[0]?.name ?? null);
  }, [personasWithStories, activePersona]);

  if (stories.length > 0) {
    return (
      <div className="px-[var(--spacing-content-px)] py-[var(--spacing-content-py)] flex flex-col gap-3">
        <StoryMapToolbar entityId={entity.id} stories={stories} />
        {personasWithStories.length > 0 && (
          <PersonaStrip
            personas={personasWithStories}
            activePersona={activePersona ?? personasWithStories[0].name}
            onSelect={setActivePersona}
          />
        )}
        <PattonMap
          entityId={entity.id}
          stories={stories}
          activePersona={activePersona ?? undefined}
        />
      </div>
    );
  }

  async function handleCopy() {
    const text = buildUserStorySlicerPrompt(productLine, entity.id);
    await navigator.clipboard.writeText(text);
    analyticsEmitter.emit("slicer_prompt_copied", {
      solution_id: entity.id,
      persona_count: (productLine.personas ?? []).length,
    });
    showToast({ message: "Prompt copied — paste into Claude Code", tone: "success" });
  }

  return (
    <div className="flex flex-col items-center py-16 px-6 gap-4">
      <div className="max-w-md w-full rounded-xl border border-border-subtle bg-surface-1 px-8 py-10 flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[color-mix(in_oklch,var(--tier-sol)_15%,transparent)] flex items-center justify-center">
          <LayoutGrid size={32} className="text-[var(--tier-sol)]" />
        </div>

        {/* Title */}
        <div className="text-base font-semibold text-foreground">No stories yet</div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Slice the User Journey block on this solution into a Patton story map. Your co-worker will write structured stories, grouped by activity, task, and iteration.
        </p>

        {/* CTA */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        >
          <Copy size={14} />
          Slice user journey into stories
        </button>

        {/* Hint */}
        <div className="text-xs text-muted-foreground/70">
          Copies the slicer prompt to your clipboard. Paste it into Claude Code and refresh when they&apos;re done.
        </div>
      </div>
    </div>
  );
}
