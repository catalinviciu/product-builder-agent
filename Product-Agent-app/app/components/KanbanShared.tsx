"use client";

import type { EntityStatus } from "@/app/lib/schemas";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/app/lib/utils";

export const STATUS_GROUP_ORDER: Record<EntityStatus, number> = {
  commit: 0, explore: 1, draft: 2, done: 3, archived: 4, dropped: 5,
};

export const KANBAN_COLUMNS = [
  { key: "draft",   label: "Draft",    statuses: ["draft"] as EntityStatus[],                        accentBorder: "border-zinc-400/30",    dotColor: "bg-zinc-500 dark:bg-zinc-400" },
  { key: "explore", label: "Explore",  statuses: ["explore"] as EntityStatus[],                      accentBorder: "border-blue-400/30",    dotColor: "bg-blue-500 dark:bg-blue-400" },
  { key: "commit",  label: "Commit",   statuses: ["commit"] as EntityStatus[],                       accentBorder: "border-emerald-400/30", dotColor: "bg-emerald-500 dark:bg-emerald-400" },
  { key: "done",    label: "Done",     statuses: ["done", "archived", "dropped"] as EntityStatus[],  accentBorder: "border-violet-400/30",  dotColor: "bg-violet-500 dark:bg-violet-400" },
];

export function KanbanColumn({ columnKey, label, dotColor, accentBorder, children, count }: {
  columnKey: string; label: string; dotColor: string; accentBorder: string; children: React.ReactNode; count: number;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: columnKey });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg bg-surface-1 border border-border-subtle p-2 flex flex-col gap-2 min-w-[75vw] md:min-w-[220px] xl:min-w-0 snap-center xl:snap-align-none",
        "border-t-2",
        accentBorder,
        isOver && "border-border-strong bg-surface-2",
      )}
    >
      <div className="flex items-center gap-2 px-1 py-1">
        <span className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{label}</span>
        <span className="text-[10px] text-muted-foreground/40 ml-auto">{count}</span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {children}
      </div>
    </div>
  );
}
