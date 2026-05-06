"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Copy, CheckCircle2 } from "lucide-react";
import type { Entity } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { buildUserStorySlicerPrompt } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";

interface StoriesTabProps {
  entity: Entity;
}

export function StoriesTab({ entity }: StoriesTabProps) {
  const productLine = useProductLine();
  const stories = entity.stories ?? [];
  const [copied, setCopied] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  if (stories.length > 0) {
    return (
      <div className="text-sm text-muted-foreground p-8">
        {stories.length} {stories.length === 1 ? "story" : "stories"} sliced. Map render coming in Story 2.
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
    setCopied(true);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => setCopied(false), 2800);
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

        {/* CTA + inline copy confirmation */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
          >
            <Copy size={14} />
            Slice user journey into stories
          </button>

          <div className="h-7 flex items-center justify-center" aria-live="polite">
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[12px] font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 size={12} />
                  Slicer prompt copied — paste into Claude Code
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hint */}
        <div className="text-xs text-muted-foreground/70">
          Copies the slicer prompt to your clipboard. Paste it into Claude Code and refresh when they&apos;re done.
        </div>
      </div>
    </div>
  );
}
