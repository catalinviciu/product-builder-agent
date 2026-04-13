"use client";

import { cn } from "@/app/lib/utils";

export function Pills({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.label} className={cn(
          "text-xs px-2.5 py-1 rounded-lg border",
          item.color || "text-foreground/70 bg-surface-2 border-border-default"
        )}>
          <span className="text-muted-foreground/60 mr-1">{item.label}:</span>
          <span className="font-medium">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
