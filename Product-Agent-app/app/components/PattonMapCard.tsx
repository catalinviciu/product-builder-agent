"use client";

import type { Story } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";

interface PattonMapCardProps {
  story: Story;
}

export function PattonMapCard({ story }: PattonMapCardProps) {
  return (
    <div className="bg-card border border-border-default rounded-md px-2.5 py-2 flex flex-col gap-1">
      <span className="text-[9.5px] font-mono uppercase text-muted-foreground/70 tracking-wide">
        {story.id}
      </span>
      <span className="text-[12px] font-medium text-foreground leading-snug tracking-tight">
        {story.title}
      </span>
      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            story.acceptanceCriteria ? "bg-emerald-500" : "bg-border-default"
          )}
        />
        <span>{story.acceptanceCriteria ? "AC defined" : "No AC yet"}</span>
      </div>
    </div>
  );
}
