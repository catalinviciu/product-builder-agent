"use client";

import { useMemo, useRef, useState } from "react";
import { Activity, ChevronDown, Search } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { LEVEL_META } from "@/app/lib/schemas";
import type { Metric, ProductLine } from "@/app/lib/schemas";
import { LEVEL_ICON_MAP } from "@/app/lib/icons";
import { useClickOutside } from "@/app/lib/hooks/useClickOutside";
import { canParentMetric, outcomeForMetric } from "@/app/lib/metrics";

/**
 * Picking a parent metric, wherever that happens: moving an existing metric in
 * the tree, or choosing where a new one lands. A product line can hold dozens
 * of metrics, so the list is always searchable — by metric name and by the
 * title of whatever outcome is being worked on it.
 */

interface MetricParentListProps {
  productLine: ProductLine;
  /** Currently chosen parent, or undefined for the top of the tree. */
  value: string | undefined;
  onSelect: (parentMetricId: string | undefined) => void;
  /**
   * The metric being moved. Its own subtree and any illegal placement are left
   * out. Omit when creating a metric, which has nothing to exclude.
   */
  excludeMetricId?: string;
  autoFocusSearch?: boolean;
}

export function MetricParentList({
  productLine,
  value,
  onSelect,
  excludeMetricId,
  autoFocusSearch = true,
}: MetricParentListProps) {
  const [query, setQuery] = useState("");

  const candidates = useMemo(() => {
    const all = (productLine.metrics ?? []).filter((m) => {
      if (!excludeMetricId) return true;
      return m.id !== excludeMetricId && canParentMetric(productLine, excludeMetricId, m.id);
    });
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((m) => {
      const outcome = outcomeForMetric(productLine, m.id);
      return (
        m.name.toLowerCase().includes(q) ||
        (outcome?.title.toLowerCase().includes(q) ?? false)
      );
    });
  }, [productLine, excludeMetricId, query]);

  const topMatchesQuery = "top of the tree".includes(query.trim().toLowerCase());

  return (
    <div className="flex flex-col min-h-0">
      <div className="p-2 border-b border-border-subtle">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search metrics"
            autoFocus={autoFocusSearch}
            className="w-full bg-surface-2 border border-border-default rounded-md pl-7 pr-2 py-1.5 text-xs text-foreground outline-none focus:border-border-focus transition-colors"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[260px] p-1">
        {topMatchesQuery && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(undefined); }}
            disabled={value === undefined}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs rounded transition-colors",
              value === undefined
                ? "bg-surface-3 text-foreground cursor-default"
                : "hover:bg-surface-hover text-foreground",
            )}
          >
            <span className="flex-1 truncate">Top of the tree</span>
            {value === undefined && <span className="text-[10px] text-muted-foreground">current</span>}
          </button>
        )}

        {candidates.map((m) => (
          <MetricRow
            key={m.id}
            metric={m}
            productLine={productLine}
            isCurrent={value === m.id}
            onSelect={onSelect}
          />
        ))}

        {candidates.length === 0 && !topMatchesQuery && (
          <div className="px-3 py-4 text-xs text-muted-foreground text-center">
            No metrics match that search.
          </div>
        )}
      </div>
    </div>
  );
}

function MetricRow({ metric, productLine, isCurrent, onSelect }: {
  metric: Metric;
  productLine: ProductLine;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}) {
  const outcome = outcomeForMetric(productLine, metric.id);
  const Icon = outcome ? LEVEL_ICON_MAP[LEVEL_META[outcome.level].icon] : Activity;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!isCurrent) onSelect(metric.id); }}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs rounded transition-colors",
        isCurrent ? "bg-surface-3 text-foreground cursor-default" : "hover:bg-surface-hover text-foreground",
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
          outcome ? LEVEL_META[outcome.level].iconBg : "bg-surface-3",
        )}
      >
        {Icon && (
          <Icon
            className={cn("w-3 h-3", outcome ? LEVEL_META[outcome.level].accentColor : "text-muted-foreground")}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate">{metric.name}</div>
        {outcome && <div className="text-[10px] text-muted-foreground truncate">{outcome.title}</div>}
      </div>
      {isCurrent && <span className="text-[10px] text-muted-foreground">current</span>}
    </button>
  );
}

// ── Form field wrapper ────────────────────────────────────────────────────

/** A labelled trigger that opens the searchable list. For use inside a form. */
export function MetricParentField({
  productLine,
  value,
  onChange,
  label = "Parent",
  inline = false,
}: {
  productLine: ProductLine;
  value: string | undefined;
  onChange: (parentMetricId: string | undefined) => void;
  label?: string;
  /**
   * Expand the list in normal flow rather than as a floating panel. Use inside a
   * scrollable container such as a modal, where an absolute panel gets clipped.
   */
  inline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const selected = value ? (productLine.metrics ?? []).find((m) => m.id === value) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-muted-foreground/50">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border-focus transition-colors flex items-center justify-between gap-1"
        >
          <span className="truncate">{selected ? selected.name : "Top of the tree"}</span>
          <ChevronDown size={12} className="text-muted-foreground shrink-0" />
        </button>
        {open && (
          <div
            className={cn(
              "rounded-lg border border-border-default bg-popover overflow-hidden",
              inline
                ? "mt-1 w-full"
                : "absolute left-0 top-full mt-1 z-30 w-full min-w-[240px] shadow-xl",
            )}
          >
            <MetricParentList
              productLine={productLine}
              value={value}
              onSelect={(id) => { onChange(id); setOpen(false); }}
            />
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground/50">
        {selected
          ? "This metric will feed the one above, showing as a signal on its outcome."
          : "This metric will sit at the top of the tree, driven by nothing above it."}
      </span>
    </div>
  );
}
