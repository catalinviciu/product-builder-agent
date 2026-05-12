"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import { cn } from "@/app/lib/utils";
import type { StoryIteration } from "@/app/lib/schemas";

interface AddStoryCellProps {
  solutionId: string;
  activity: string;
  task: string;
  iteration: StoryIteration;
  persona: string;
  hasStories: boolean;
}

export function AddStoryCell({
  solutionId,
  activity,
  task,
  iteration,
  persona,
  hasStories,
}: AddStoryCellProps) {
  const [mode, setMode] = useState<"idle" | "editing">("idle");
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "editing") {
      inputRef.current?.focus();
    }
  }, [mode]);

  function handleSubmit(e?: React.MouseEvent) {
    e?.stopPropagation();
    const result = useAppStore.getState().addStoryToCell(
      solutionId,
      { activity, task, iteration, persona },
      title,
    );
    if (result !== null) {
      setMode("idle");
      setTitle("");
    }
  }

  function handleCancel(e?: React.MouseEvent) {
    e?.stopPropagation();
    setMode("idle");
    setTitle("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && title.trim()) {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (mode === "editing") {
    return (
      <div
        className="relative z-10 bg-surface-1 border border-border-subtle rounded-md p-1.5 flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Story title…"
          className="w-full text-[12px] px-1.5 py-1 rounded-md bg-surface-2 border border-border-default focus:outline-none focus:border-[var(--border-focus)] text-foreground"
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            aria-label="Save story"
            className={cn(
              "inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors",
              title.trim()
                ? "text-foreground hover:bg-surface-hover cursor-pointer"
                : "opacity-40 cursor-not-allowed",
            )}
          >
            <Check size={13} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Cancel"
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  if (!hasStories) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMode("editing");
          }}
          aria-label="Add story"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center overflow-hidden max-h-0 -mt-2 group-hover:max-h-8 group-hover:mt-0 focus-within:max-h-8 focus-within:mt-0 transition-all duration-200">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMode("editing");
        }}
        aria-label="Add story"
        className="inline-flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
