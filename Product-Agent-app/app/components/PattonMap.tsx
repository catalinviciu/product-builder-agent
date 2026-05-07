"use client";

import { useEffect, useMemo } from "react";
import { Server } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import type { Story } from "@/app/lib/schemas";
import { cn, buildPlanImplementIterationPrompt } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import { showToast } from "@/components/ui/toast";
import {
  buildBackbone,
  deriveIterationRows,
  filterStoriesForPersona,
  getStoriesAt,
  isSystemTask,
  resolvePrimaryPersona,
  type IterationRow,
} from "@/app/lib/story-map-utils";
import { PattonMapCard } from "./PattonMapCard";

interface PattonMapProps {
  entityId: string;
  stories: Story[];
  activePersona?: string;
}

export function PattonMap({ entityId, stories, activePersona }: PattonMapProps) {
  const openStoryDetail = useAppStore((s) => s.openStoryDetail);

  async function handlePlanImplement(_row: IterationRow, storyIds: string[]) {
    const text = buildPlanImplementIterationPrompt(storyIds);
    await navigator.clipboard.writeText(text);
    analyticsEmitter.emit("plan_implement_prompt_copied", {
      solution_id: entityId,
      scope: "iteration",
      story_count: storyIds.length,
    });
    showToast({ message: "Prompt copied — paste into your agentic tool", tone: "success" });
  }

  const { visibleStories, backbone } = useMemo(() => {
    const primary = activePersona ?? resolvePrimaryPersona(stories);
    const visible = filterStoriesForPersona(stories, primary);
    return { visibleStories: visible, backbone: buildBackbone(visible) };
  }, [stories, activePersona]);

  useEffect(() => {
    analyticsEmitter.emit("story_map_rendered", {
      solution_id: entityId,
      story_count: visibleStories.length,
      activity_count: backbone.activities.length,
    });
    // Fire once per entity change — visibleStories/backbone derived from stories.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  if (backbone.tasks.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 px-6 py-10 text-center text-sm text-muted-foreground">
        No stories for the active persona.
      </div>
    );
  }

  const lastTask = backbone.tasks[backbone.tasks.length - 1];

  const visibleIterationRows = deriveIterationRows(visibleStories);

  if (visibleIterationRows.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 px-6 py-10 text-center text-sm text-muted-foreground">
        No stories for the active persona.
      </div>
    );
  }

  const lastIterRow = visibleIterationRows[visibleIterationRows.length - 1];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 overflow-hidden">
      <div className="overflow-x-auto pb-1">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `168px repeat(${backbone.tasks.length}, minmax(180px, 1fr))`,
            minWidth: `${168 + backbone.tasks.length * 180}px`,
          }}
        >
          {/* Row 1: corner + activity backbone */}
          <div
            className="bg-surface-3 border-b border-r border-border-default"
            aria-hidden
          />
          {backbone.activities.map((activity, i) => (
            <div
              key={`act-${activity.name}`}
              className="bg-surface-2 border-b border-border-default px-3.5 py-2.5 flex items-center gap-2"
              style={{ gridColumn: `span ${activity.tasks.length}` }}
            >
              <span className="bg-surface-3 text-[10px] font-mono px-1.5 py-px rounded text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] font-semibold text-foreground tracking-tight">
                {activity.name}
              </span>
            </div>
          ))}

          {/* Row 2: corner + task headers */}
          <div
            className="bg-surface-3 border-b border-r border-border-default"
            aria-hidden
          />
          {backbone.tasks.map((task) => {
            const isSys = isSystemTask(visibleStories, task);
            const isLast = task === lastTask;
            return (
              <div
                key={`task-${task}`}
                className={cn(
                  "bg-surface-1 border-b border-border-default px-3 py-2 flex items-center gap-1.5",
                  !isLast && "border-r border-border-subtle",
                )}
              >
                {isSys && (
                  <>
                    <Server size={11} className="text-muted-foreground/60 shrink-0" />
                    <span className="text-[9px] font-mono uppercase px-1 py-px rounded bg-surface-3 text-muted-foreground">
                      SYS
                    </span>
                  </>
                )}
                <span className="text-[12px] font-medium text-muted-foreground">
                  {task}
                </span>
              </div>
            );
          })}

          {/* Rows 3+: iteration label + story cells — only rows with stories render */}
          {visibleIterationRows.map((iter) => {
            const rowKey = `${iter.kind}-${iter.label}`;
            const isLastRow = iter.kind === lastIterRow.kind && iter.label === lastIterRow.label;
            const iterStoryIds = visibleStories
              .filter((s) => s.iteration.kind === iter.kind && s.iteration.label === iter.label)
              .map((s) => s.id);
            const kindBadge = iter.kind === "enh" ? "EN" : iter.kind.toUpperCase();
            return (
              <div key={`row-${rowKey}`} className="contents">
                <div
                  className={cn(
                    "bg-surface-2 border-r border-border-default px-3 py-3.5 flex flex-col gap-1 items-start",
                    !isLastRow && "border-b border-border-subtle",
                  )}
                >
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    {kindBadge}
                  </span>
                  <span className="text-[12px] font-semibold text-foreground leading-tight">
                    {iter.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlanImplement(iter, iterStoryIds)}
                    className="mt-1.5 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border border-border-subtle bg-surface-3 hover:bg-surface-hover active:bg-surface-active text-[10px] font-medium text-foreground transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    Plan & Implement
                  </button>
                </div>
                {backbone.tasks.map((task) => {
                  const cellStories = getStoriesAt(visibleStories, task, iter);
                  const isLastCol = task === lastTask;
                  if (cellStories.length > 0) {
                    return (
                      <div
                        key={`cell-${rowKey}-${task}`}
                        className={cn(
                          "p-2.5 flex flex-col gap-2 min-h-[86px]",
                          !isLastCol && "border-r border-border-subtle",
                          !isLastRow && "border-b border-border-subtle",
                        )}
                      >
                        {cellStories.map((story) => (
                          <PattonMapCard
                            key={story.id}
                            story={story}
                            onClick={() => openStoryDetail(entityId, story.id)}
                          />
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`cell-${rowKey}-${task}`}
                      className={cn(
                        "min-h-[86px] opacity-60",
                        !isLastCol && "border-r border-border-subtle",
                        !isLastRow && "border-b border-border-subtle",
                      )}
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent 0 6px, var(--surface-1) 6px 12px)",
                      }}
                      aria-hidden
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
