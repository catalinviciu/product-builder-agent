"use client";

import { CheckCircle2 } from "lucide-react";
import type { Story } from "@/app/lib/schemas";
import { cn, buildStoryAnchor } from "@/app/lib/utils";
import { useAppStore } from "@/app/lib/store";
import { CopyAnchorButton } from "@/app/components/CopyAnchorButton";

interface PattonMapCardProps {
  story: Story;
  onClick?: () => void;
}

export function PattonMapCard({ story, onClick }: PattonMapCardProps) {
  const currentEntityId = useAppStore((s) => s.currentEntityId);
  const currentProductLineId = useAppStore((s) => s.currentProductLineId);
  const productLines = useAppStore((s) => s.productLines);

  const productLine = Object.values(productLines).find((pl) => pl.id === currentProductLineId);
  const entityStore = productLine?.entities ?? {};
  const productLineName = productLine?.name ?? "";

  const storyPointer =
    currentEntityId
      ? buildStoryAnchor(entityStore, productLineName, currentEntityId, story.id, story.title)
      : "";

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "relative group bg-card border border-border-default rounded-md px-2.5 py-2 flex flex-col gap-1",
        onClick &&
          "cursor-pointer hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
      )}
    >
      {storyPointer && (
        <div
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <CopyAnchorButton
            text={storyPointer}
            tooltip="Copy a pointer to this story — paste into a prompt and tell the agent what to do (e.g. read, delete, move to another iteration, update acceptance criteria)"
            toast="Story pointer copied"
          />
        </div>
      )}
      <span className="text-[9.5px] font-mono uppercase text-muted-foreground/70 tracking-wide">
        {story.id}
      </span>
      <span className="text-[12px] font-medium text-foreground leading-snug tracking-tight">
        {story.title}
      </span>
      {story.done ? (
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[var(--accent-green)]">
          <CheckCircle2 size={11} className="shrink-0" />
          <span>Done</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              story.acceptanceCriteria ? "bg-emerald-500" : "bg-border-default"
            )}
          />
          <span>{story.acceptanceCriteria ? "AC defined" : "No AC yet"}</span>
        </div>
      )}
    </div>
  );
}
