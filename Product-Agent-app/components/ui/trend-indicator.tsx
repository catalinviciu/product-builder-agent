"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrendIndicatorProps {
  dataSeries: { value: number }[];
  className?: string;
}

function TrendIndicator({ dataSeries, className }: TrendIndicatorProps) {
  if (dataSeries.length < 2) return null;
  const latest = dataSeries[dataSeries.length - 1].value;
  const prev = dataSeries[dataSeries.length - 2].value;
  const diff = latest - prev;
  const pct = prev !== 0 ? Math.round(Math.abs(diff / prev) * 100) : null;
  const pctLabel = pct !== null ? `${pct}%` : "";

  if (diff > 0) return (
    <span data-slot="trend-indicator" className={cn("inline-flex items-center gap-0.5 text-emerald-500 dark:text-emerald-400", className)}>
      <TrendingUp size={14} />
      <span className="text-[10px] font-medium">+{pctLabel || String(diff)}</span>
    </span>
  );

  if (diff < 0) return (
    <span data-slot="trend-indicator" className={cn("inline-flex items-center gap-0.5 text-rose-500 dark:text-rose-400", className)}>
      <TrendingDown size={14} />
      <span className="text-[10px] font-medium">-{pctLabel || String(Math.abs(diff))}</span>
    </span>
  );

  return (
    <span data-slot="trend-indicator" className={cn("text-[10px] text-muted-foreground/40 font-medium", className)}>
      no change
    </span>
  );
}

export { TrendIndicator };
