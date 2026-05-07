"use client";

import { User } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface PersonaStripProps {
  personas: { name: string; count: number }[];
  activePersona: string;
  onSelect: (persona: string) => void;
}

export function PersonaStrip({ personas, activePersona, onSelect }: PersonaStripProps) {
  return (
    <div
      role="tablist"
      className="flex items-center gap-1 border-b border-border-subtle overflow-x-auto"
    >
      {personas.map(({ name, count }) => {
        const isActive = name === activePersona;
        return (
          <button
            key={name}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onSelect(name)}
            className={cn(
              "cursor-pointer text-[13px] font-medium py-2.5 px-5 flex items-center gap-1.5 relative border-b-2 -mb-px transition-colors whitespace-nowrap",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
              isActive
                ? "text-foreground font-semibold border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground",
            )}
          >
            <User size={14} />
            {name}
            {count > 0 && (
              <span className="text-[10px] font-semibold bg-surface-3 text-muted-foreground px-1.5 py-px rounded-full tabular-nums">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
