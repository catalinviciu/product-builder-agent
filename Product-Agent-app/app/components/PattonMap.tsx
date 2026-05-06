"use client";

import { useEffect, useMemo } from "react";
import { Server } from "lucide-react";
import type { Story } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import {
  ITERATION_ROWS,
  buildBackbone,
  filterStoriesForPersona,
  getStoryAt,
  isSystemTask,
  resolvePrimaryPersona,
} from "@/app/lib/story-map-utils";
import { PattonMapCard } from "./PattonMapCard";

interface PattonMapProps {
  entityId: string;
  stories: Story[];
}

export function PattonMap({ entityId, stories }: PattonMapProps) {
  const { visibleStories, backbone } = useMemo(() => {
    const primary = resolvePrimaryPersona(stories);
    const visible = filterStoriesForPersona(stories, primary);
    return { visibleStories: visible, backbone: buildBackbone(visible) };
  }, [stories]);

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
  const lastIter = ITERATION_ROWS[ITERATION_ROWS.length - 1].key;

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

          {/* Rows 3-5: iteration label + story cells */}
          {ITERATION_ROWS.map((iter) => {
            const isLastRow = iter.key === lastIter;
            return (
              <div key={`row-${iter.key}`} className="contents">
                <div
                  className={cn(
                    "bg-surface-2 border-r border-border-default px-3 py-3.5 flex flex-col gap-1 items-start",
                    !isLastRow && "border-b border-border-subtle",
                  )}
                >
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    {iter.key === "Enh" ? "ENH" : iter.key}
                  </span>
                  <span className="text-[12px] font-semibold text-foreground leading-tight">
                    {iter.label}
                  </span>
                </div>
                {backbone.tasks.map((task) => {
                  const story = getStoryAt(visibleStories, task, iter.key);
                  const isLastCol = task === lastTask;
                  if (story) {
                    return (
                      <div
                        key={`cell-${iter.key}-${task}`}
                        className={cn(
                          "p-2.5 flex flex-col gap-2 min-h-[86px]",
                          !isLastCol && "border-r border-border-subtle",
                          !isLastRow && "border-b border-border-subtle",
                        )}
                      >
                        <PattonMapCard story={story} />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`cell-${iter.key}-${task}`}
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
