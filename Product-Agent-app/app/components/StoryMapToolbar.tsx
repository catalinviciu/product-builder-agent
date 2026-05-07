"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";
import type { Story } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { buildUserStoryAcWriterPrompt } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";

interface StoryMapToolbarProps {
  entityId: string;
  stories: Story[];
}

export function StoryMapToolbar({ entityId, stories }: StoryMapToolbarProps) {
  const productLine = useProductLine();
  const storiesWithoutAcCount = stories.filter((s) => !s.acceptanceCriteria).length;
  const hasAnyMissingAc = storiesWithoutAcCount > 0;

  const [copied, setCopied] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  const title = hasAnyMissingAc
    ? `${stories.length} ${stories.length === 1 ? "story" : "stories"} sliced`
    : `${stories.length} stories · all AC defined`;
  const subtitle = hasAnyMissingAc
    ? "No acceptance criteria yet. Add AC before you plan & implement."
    : "Pick a scope to plan & implement: whole map, an iteration row, or a single story.";

  async function handleCopy() {
    const text = buildUserStoryAcWriterPrompt(productLine, entityId);
    await navigator.clipboard.writeText(text);
    analyticsEmitter.emit("ac_writer_prompt_copied", {
      solution_id: entityId,
      stories_without_ac: storiesWithoutAcCount,
    });
    setCopied(true);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => setCopied(false), 2800);
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 px-3.5 py-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>
      {hasAnyMissingAc && (
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
          >
            <Copy size={14} />
            Add acceptance criteria
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
                  AC writer prompt copied — paste into Claude Code
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
