"use client";

import { useCallback, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { analyticsEmitter } from "@/app/lib/analytics-events";

// ── Gherkin keyword highlighter ────────────────────────────────────────────
const GHERKIN_KEYWORDS =
  /\b(Scenario|Feature|Background|Given|When|Then|And|But|Examples|Prerequisites)\b/g;

function renderGherkinLine(line: string, key: number) {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("# Mixpanel:")) {
    return (
      <span key={key} className="text-amber-600 dark:text-amber-400">
        {line}
      </span>
    );
  }
  if (trimmed.startsWith("#")) {
    return (
      <span key={key} className="text-muted-foreground">
        {line}
      </span>
    );
  }
  const parts = line.split(GHERKIN_KEYWORDS);
  return (
    <span key={key}>
      {parts.map((p, j) =>
        /^(Scenario|Feature|Background|Given|When|Then|And|But|Examples|Prerequisites)$/.test(p) ? (
          <span key={j} className="text-violet-600 dark:text-violet-400 font-medium">
            {p}
          </span>
        ) : (
          <span key={j}>{p}</span>
        )
      )}
    </span>
  );
}

function renderGherkin(src: string) {
  return src.split(/(\r?\n)/).map((seg, i) =>
    seg === "\n" || seg === "\r\n" ? <span key={i}>{seg}</span> : renderGherkinLine(seg, i)
  );
}

// ── Iteration tag normaliser ───────────────────────────────────────────────
function iterationTag(iteration: string): string {
  return iteration === "Enh" ? "EN" : iteration;
}

// ── Component ─────────────────────────────────────────────────────────────
export function StoryDetailSlideOver() {
  const open = useAppStore((s) => s.storyDetailOpen);
  const solutionId = useAppStore((s) => s.storyDetailSolutionId);
  const storyId = useAppStore((s) => s.storyDetailStoryId);
  const close = useAppStore((s) => s.closeStoryDetail);

  const productLine = useProductLine();

  // Resolve story from the active product line
  const solution = solutionId ? productLine.entities?.[solutionId] : null;
  const story = solution?.stories?.find((s) => s.id === storyId) ?? null;

  // Auto-close if story can't be resolved (race / stale state)
  useEffect(() => {
    if (open && (!solution || !story)) {
      close();
    }
  }, [open, solution, story, close]);

  // Escape key handler (mirrors PersonaSlideOver.tsx)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
    },
    [open, close]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Analytics: fire once per story open
  useEffect(() => {
    if (open && story) {
      analyticsEmitter.emit("story_detail_opened", {
        story_id: story.id,
        iteration: story.iteration === "Enh" ? "EN" : story.iteration,
        has_ac: !!story.acceptanceCriteria,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, story?.id]);

  return (
    <AnimatePresence>
      {open && story && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 bg-overlay z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0.24, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[min(520px,100vw)] bg-card border-l border-border-subtle shadow-[-10px_0_40px_var(--shadow-color)] z-50 flex flex-col"
          >
            {/* ── Header ── */}
            <div className="px-5 pt-[18px] pb-3.5 border-b border-border-subtle flex flex-col gap-2">
              {/* Top line: crumb + close */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span>{story.activity}</span>
                  <ChevronRight size={11} className="text-muted-foreground/40" />
                  <span>{story.task}</span>
                </span>
                <button
                  aria-label="Close"
                  onClick={close}
                  className="cursor-pointer w-9 h-9 rounded-md border border-border-default bg-surface-2 hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Story id */}
              <span className="text-[10px] font-mono text-muted-foreground/70 tracking-wide">
                {story.id}
              </span>

              {/* Title */}
              <h2 className="text-[16px] font-semibold text-foreground leading-snug tracking-tight">
                {story.title}
              </h2>

              {/* Pills row */}
              <div className="flex gap-1.5 items-center mt-0.5">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-2 border border-border-subtle text-muted-foreground">
                  {iterationTag(story.iteration)}
                </span>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 flex flex-col gap-[18px]">
              {/* Narrative */}
              {story.narrative && (
                <section className="flex flex-col gap-1">
                  <div className="text-[13px] leading-relaxed text-foreground/90 italic bg-surface-1 border border-border-subtle rounded-md px-3.5 py-3">
                    <span className="font-semibold not-italic">As a</span>{" "}
                    {story.narrative.role}, I {story.narrative.action}{" "}
                    <span className="font-semibold not-italic">so that</span>{" "}
                    {story.narrative.benefit}.
                  </div>
                </section>
              )}

              {/* Context */}
              {story.context && (
                <section className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                    Context
                  </span>
                  <div className="text-[13px] leading-relaxed text-foreground/85 whitespace-pre-line">
                    {story.context}
                  </div>
                </section>
              )}

              {/* Out of Scope */}
              {story.outOfScope && story.outOfScope.length > 0 && (
                <section className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                    Out of Scope
                  </span>
                  <ul className="list-disc pl-5 text-[13px] leading-relaxed text-foreground/85 flex flex-col gap-1">
                    {story.outOfScope.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Dependencies */}
              {story.dependencies && story.dependencies.length > 0 && (
                <section className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                    Dependencies
                  </span>
                  <ul className="list-disc pl-5 text-[13px] leading-relaxed text-foreground/85 flex flex-col gap-1">
                    {story.dependencies.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Human Verification */}
              {story.humanVerification && (
                <section className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                    Human Verification
                  </span>
                  <div className="text-[13px] leading-relaxed text-foreground/85 whitespace-pre-line">
                    {story.humanVerification}
                  </div>
                </section>
              )}

              {/* Acceptance Criteria */}
              <section className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Acceptance Criteria
                </span>
                {story.acceptanceCriteria ? (
                  <div className="bg-surface-2 border border-border-subtle rounded-md px-3.5 py-3 font-mono text-[12px] leading-[1.7] text-foreground whitespace-pre-wrap">
                    {renderGherkin(story.acceptanceCriteria)}
                  </div>
                ) : (
                  <div className="text-[12px] text-muted-foreground/70 italic px-3 py-2.5 border border-dashed border-border-default rounded-md bg-surface-1">
                    No acceptance criteria yet
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
