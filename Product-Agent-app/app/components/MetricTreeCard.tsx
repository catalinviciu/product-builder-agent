"use client";

import { useRef, useEffect, useState } from "react";
import { Link, Plus, Activity, MoreVertical, Pencil, Trash2, Target, ArrowUpRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import {
  LEVEL_META,
  ENTITY_STATUS_META,
  METRIC_FREQUENCY_LABELS,
  METRIC_TYPE_LABELS,
  formatMetricValue,
} from "@/app/lib/schemas";
import type { Entity, Metric, ProductLine } from "@/app/lib/schemas";
import { LEVEL_ICON_MAP } from "@/app/lib/icons";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { latestPoint, levelForMetric } from "@/app/lib/metrics";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MetricSettingsForm } from "./MetricSettingsForm";
import { MetricParentList } from "./MetricParentPicker";
import { ConfirmDialog } from "./ConfirmDialog";
import { MetricTilePreview } from "./MetricTilePreview";
import { getPeriodDate } from "@/app/lib/schemas";

// ── ReparentDropdown ────────────────────────────────────────────────────────

interface ReparentDropdownProps {
  metric: Metric;
  productLine: ProductLine;
  onSelect: (newParentId: string | undefined) => void;
  onClose: () => void;
}

/** The card's hover popover. The list itself is shared with the add-metric modal. */
function ReparentDropdown({ metric, productLine, onSelect, onClose }: ReparentDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="absolute top-7 right-0 z-50 w-72 bg-popover border border-border-default rounded-lg shadow-lg overflow-hidden"
    >
      <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border-subtle">
        Move under
      </div>
      <MetricParentList
        productLine={productLine}
        value={metric.parentMetricId}
        excludeMetricId={metric.id}
        onSelect={(id) => { onSelect(id); onClose(); }}
      />
    </div>
  );
}

// ── Add outcome ───────────────────────────────────────────────────────────

function AddOutcomeForm({ metric, onClose }: { metric: Metric; onClose: () => void }) {
  const createOutcomeForMetric = useAppStore((s) => s.createOutcomeForMetric);
  const navigateFromMetricTree = useAppStore((s) => s.navigateFromMetricTree);
  const productLine = useProductLine();
  const [title, setTitle] = useState(metric.name);
  const level = levelForMetric(productLine, metric.id);

  const save = () => {
    if (!title.trim()) return;
    const id = createOutcomeForMetric(metric.id, title.trim());
    onClose();
    if (id) navigateFromMetricTree(id);
  };

  return (
    <div
      className="flex flex-col gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground/50">
        New {LEVEL_META[level].label}
      </span>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
        placeholder="What are you trying to move?"
        autoFocus
        className="bg-surface-2 border border-border-strong rounded-lg px-2 py-1 text-xs text-foreground outline-none focus:border-border-focus w-full"
      />
      <div className="flex gap-1">
        <button onClick={save} className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-surface-3 text-foreground cursor-pointer hover:bg-surface-active transition-colors">Create</button>
        <button onClick={onClose} className="text-[10px] font-medium px-2 py-1 rounded-lg text-muted-foreground cursor-pointer hover:bg-surface-hover transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// ── MetricTreeCard ────────────────────────────────────────────────────────

interface MetricTreeCardProps {
  metric: Metric;
  /** The outcome currently being worked on this metric, if any. */
  outcome?: Entity;
  /** Outcomes that were worked here and are now done, dropped or archived. */
  pastOutcomes?: Entity[];
  /** "tile" is the shrunken state used for every metric outside the focused family. */
  display?: "full" | "tile";
  /** The hover preview renders a read-only copy of this card; it takes no clicks and shows no chrome. */
  interactive?: boolean;
  /** True when this card is the one the tree is focused on. */
  focused?: boolean;
}

type CardMode = "view" | "edit" | "add-outcome" | "add-child";

/**
 * One node of the metric tree. A metric with an active outcome shows that
 * outcome's identity and status; once the outcome is finished the card goes back
 * to being a plain metric that can take a new one, keeping a link to what came
 * before.
 */
export function MetricTreeCard({
  metric,
  outcome,
  pastOutcomes = [],
  display = "full",
  interactive = true,
  focused = false,
}: MetricTreeCardProps) {
  const [reparentOpen, setReparentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<CardMode>("view");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewAnchor, setPreviewAnchor] = useState<HTMLDivElement | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const navigateFromMetricTree = useAppStore((s) => s.navigateFromMetricTree);
  const reparentMetric = useAppStore((s) => s.reparentMetric);
  const removeMetric = useAppStore((s) => s.removeMetric);
  const addMetric = useAppStore((s) => s.addMetric);
  const recordMetricValue = useAppStore((s) => s.recordMetricValue);
  const focusMetric = useAppStore((s) => s.focusMetric);
  const setTreeFocus = useAppStore((s) => s.setTreeFocus);
  const productLine = useProductLine();

  const levelMeta = outcome ? LEVEL_META[outcome.level] : undefined;
  const LevelIcon = levelMeta ? LEVEL_ICON_MAP[levelMeta.icon] : Activity;

  const last = latestPoint(metric);
  const fmt = (v: number) => formatMetricValue(v, metric.valueFormat);
  const currentLabel = last ? fmt(last.value) : metric.legacyCurrentValue ?? "—";

  // The from -> to pair is what the outcome signed up for, so it only shows
  // when one is attached and a target exists.
  const fromLabel =
    metric.initialValue !== undefined ? fmt(metric.initialValue) : metric.legacyCurrentValue;
  const toLabel =
    metric.numericTarget !== undefined ? fmt(metric.numericTarget) : metric.legacyTargetValue;
  const showRange = Boolean(outcome && toLabel);

  const editing = mode !== "view";
  const isTile = display === "tile" && !editing;

  /**
   * A click picks what to read, it does not leave the tree. Opening the outcome
   * is an explicit choice from the title link or the actions menu, so the click
   * target and the reading target stay the same thing.
   */
  function open() {
    setTreeFocus(metric.id);
  }

  /**
   * The actions menu renders in a portal, so a click on a menu item is not inside
   * `.card-actions` in the DOM even though React still bubbles it through here.
   * Without the menu-state guard, choosing "Delete metric" also opened the card.
   */
  function fromCardChrome(target: EventTarget | null) {
    return menuOpen || reparentOpen || (target as Element | null)?.closest?.(".card-actions") != null;
  }

  function handleCardClick(e: React.MouseEvent) {
    if (editing || fromCardChrome(e.target)) return;
    open();
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (editing || fromCardChrome(e.target)) return;
    e.preventDefault();
    open();
  }

  /**
   * The preview is only worth showing for a tile the builder can't already
   * read, and only on pointers that can hover — a tap on touch focuses the
   * tile directly instead, which is the whole touch answer.
   */
  function clearPreviewTimer() {
    if (previewTimer.current) {
      clearTimeout(previewTimer.current);
      previewTimer.current = null;
    }
  }

  function handleCardMouseEnter() {
    if (!isTile || !interactive) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    clearPreviewTimer();
    previewTimer.current = setTimeout(() => setPreviewAnchor(cardRef.current), 120);
  }

  function handleCardMouseLeave() {
    clearPreviewTimer();
    setPreviewAnchor(null);
  }

  useEffect(() => clearPreviewTimer, []);

  return (
    <div
      ref={cardRef}
      // The hover preview renders a second copy of this card. Only the one in the
      // tree may carry the id, or `drawLines` would measure the floating preview
      // and hang the connectors off it.
      id={interactive ? `metric-tree-node-${metric.id}` : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive && !editing ? 0 : -1}
      aria-hidden={interactive ? undefined : true}
      aria-label={interactive ? `Focus ${metric.name}` : undefined}
      onClick={interactive ? handleCardClick : undefined}
      onKeyDown={interactive ? handleCardKeyDown : undefined}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className={cn(
        "group relative rounded-xl border select-none",
        "transition-[width,background-color,border-color,color] duration-250 ease-[cubic-bezier(0.32,0.72,0.24,1)]",
        editing
          ? "w-[320px] p-3.5 cursor-default"
          : isTile
            ? "w-[88px] p-2 cursor-pointer"
            : "w-[260px] p-3.5 cursor-pointer",
        "hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
        outcome && levelMeta
          ? cn("border-border-default border-l-[3px] hover:border-border-strong", levelMeta.bgTint, levelMeta.borderTint)
          : "border-border-subtle bg-surface-1 hover:border-border-default",
        focused && "border-border-strong bg-surface-active",
      )}
    >
      {/* Actions — visible on hover, hidden entirely in tile mode: too small for them */}
      {mode === "view" && !isTile && (
        <div className="card-actions absolute top-2.5 right-2.5 flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); setReparentOpen((v) => !v); }}
            title="Move under another metric"
            className={cn(
              "p-1 rounded-md transition-all opacity-0 group-hover:opacity-100",
              reparentOpen ? "opacity-100 bg-surface-active" : "hover:bg-surface-hover",
            )}
          >
            <Link className={cn("w-3 h-3", levelMeta?.accentColor ?? "text-muted-foreground")} />
          </button>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                title="Metric actions"
                className="p-1 rounded-md transition-all opacity-0 group-hover:opacity-100 hover:bg-surface-hover data-[state=open]:opacity-100"
              >
                <MoreVertical className={cn("w-3 h-3", levelMeta?.accentColor ?? "text-muted-foreground")} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[170px]">
              {outcome && (
                <DropdownMenuItem onClick={() => navigateFromMetricTree(outcome.id)} className="text-xs gap-2">
                  <ArrowUpRight size={12} /> Open outcome
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setMode("add-child")} className="text-xs gap-2">
                <Plus size={12} /> Add input metric
              </DropdownMenuItem>
              {!outcome && (
                <DropdownMenuItem onClick={() => setMode("add-outcome")} className="text-xs gap-2">
                  <Target size={12} /> Add outcome
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setMode("edit")} className="text-xs gap-2">
                <Pencil size={12} /> Edit metric
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setConfirmDelete(true)}
                className="text-xs gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 size={12} /> Delete metric
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {reparentOpen && (
            <ReparentDropdown
              metric={metric}
              productLine={productLine}
              onSelect={(newParentId) => {
                reparentMetric(metric.id, newParentId);
                focusMetric(metric.id);
              }}
              onClose={() => setReparentOpen(false)}
            />
          )}
        </div>
      )}

      {mode === "edit" ? (
        <MetricSettingsForm
          metric={metric}
          compact
          hasOutcome={Boolean(outcome)}
          onClose={() => setMode("view")}
        />
      ) : mode === "add-child" ? (
        <MetricSettingsForm
          compact
          title="New input metric"
          defaults={{ metricType: metric.metricType, frequency: metric.frequency }}
          onCreate={({ currentValue, ...values }) => {
            const id = addMetric({ ...values, parentMetricId: metric.id });
            if (!id) return;
            if (currentValue !== undefined) {
              recordMetricValue(id, getPeriodDate(new Date(), values.frequency ?? metric.frequency), currentValue);
            }
            focusMetric(id);
          }}
          onClose={() => setMode("view")}
        />
      ) : mode === "add-outcome" ? (
        <AddOutcomeForm metric={metric} onClose={() => setMode("view")} />
      ) : isTile ? (
        // Tile mode keeps only what reads at a glance: the tier icon, the
        // name, and whether it has data. Everything else needs the hover
        // preview or a focus click to reach.
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
              levelMeta?.iconBg ?? "bg-surface-3",
            )}
          >
            {LevelIcon && (
              <LevelIcon className={cn("w-3.5 h-3.5", levelMeta?.accentColor ?? "text-muted-foreground")} />
            )}
          </div>
          <span className="text-[10px] font-medium leading-snug text-foreground line-clamp-2 text-center">
            {metric.name}
          </span>
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              last ? "bg-emerald-500" : "bg-border-default",
            )}
          />
        </div>
      ) : (
        <>
          {/* The metric leads: this is a tree of metrics, whoever is working them */}
          <div className="flex items-start gap-2.5 mb-2 pr-10">
            <div
              className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                levelMeta?.iconBg ?? "bg-surface-3",
              )}
            >
              {LevelIcon && (
                <LevelIcon className={cn("w-3.5 h-3.5", levelMeta?.accentColor ?? "text-muted-foreground")} />
              )}
            </div>
            <span className="text-[13px] font-medium leading-snug text-foreground line-clamp-2 min-w-0">
              {metric.name}
            </span>
          </div>

          {/* Where it stands now, and how often it is read */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0 self-center",
                last ? "bg-emerald-500" : "bg-border-default",
              )}
            />
            <span className="text-lg font-semibold text-foreground tabular-nums leading-none">
              {currentLabel}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {METRIC_FREQUENCY_LABELS[metric.frequency].toLowerCase()}
            </span>
          </div>

          {/* The outcome being worked here, and the move it is going for */}
          {outcome && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateFromMetricTree(outcome.id); }}
              className="card-actions group/open flex items-start gap-1 text-left cursor-pointer mb-1.5"
            >
              <span className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                {outcome.title}
              </span>
              <ArrowUpRight className="w-2.5 h-2.5 text-muted-foreground/40 shrink-0 mt-0.5 group-hover/open:text-foreground transition-colors" />
            </button>
          )}

          {showRange && (
            <div className="flex items-center gap-1.5 mb-2.5 text-xs">
              <span className="text-muted-foreground tabular-nums">{fromLabel ?? "—"}</span>
              <span className="text-muted-foreground/50">→</span>
              <span className="text-foreground font-medium tabular-nums">{toLabel}</span>
            </div>
          )}

          {/* Finished outcomes worked on this metric */}
          {pastOutcomes.length > 0 && (
            <div className="flex flex-col gap-1 mb-2.5">
              {pastOutcomes.map((past) => (
                <button
                  key={past.id}
                  onClick={(e) => { e.stopPropagation(); navigateFromMetricTree(past.id); }}
                  className="group/past flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span
                    className={cn(
                      "inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded border shrink-0",
                      ENTITY_STATUS_META[past.status].color,
                    )}
                  >
                    {ENTITY_STATUS_META[past.status].label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 truncate group-hover/past:text-foreground transition-colors">
                    {past.title}
                  </span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-muted-foreground/40 shrink-0 group-hover/past:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Footer: what kind of metric, and who is working it */}
          <div className="flex items-center flex-wrap gap-1.5">
            {outcome && (
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border",
                  ENTITY_STATUS_META[outcome.status].color,
                )}
              >
                {ENTITY_STATUS_META[outcome.status].label}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground bg-surface-2 border border-border-subtle px-1.5 py-0.5 rounded">
              {METRIC_TYPE_LABELS[metric.metricType]}
            </span>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete metric"
        message={
          getChildMetricCount(productLine, metric.id) > 0
            ? `"${metric.name}" has input metrics under it. They will move up to take its place, keeping their own history.`
            : `"${metric.name}" and its recorded history will be removed. Any outcome on it stays, without a metric.`
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => { setConfirmDelete(false); removeMetric(metric.id); }}
        onCancel={() => setConfirmDelete(false)}
      />

      {/* Stays mounted while this is a tile so the preview's exit fade can run;
          `anchor` going null is what closes it. */}
      {isTile && interactive && (
        <MetricTilePreview
          metric={metric}
          outcome={outcome}
          pastOutcomes={pastOutcomes}
          anchor={previewAnchor}
        />
      )}
    </div>
  );
}

function getChildMetricCount(productLine: ProductLine, metricId: string): number {
  return (productLine.metrics ?? []).filter((m) => m.parentMetricId === metricId).length;
}
