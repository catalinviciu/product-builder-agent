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
import { canParentMetric, latestPoint, levelForMetric, outcomeForMetric } from "@/app/lib/metrics";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MetricSettingsForm } from "./MetricSettingsForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { getPeriodDate } from "@/app/lib/schemas";

// ── ReparentDropdown ────────────────────────────────────────────────────────

interface ReparentDropdownProps {
  metric: Metric;
  productLine: ProductLine;
  onSelect: (newParentId: string | undefined) => void;
  onClose: () => void;
}

function ReparentDropdown({ metric, productLine, onSelect, onClose }: ReparentDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const candidates = (productLine.metrics ?? []).filter(
    (m) => m.id !== metric.id && canParentMetric(productLine, metric.id, m.id),
  );

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-7 right-0 z-50 w-72 bg-popover border border-border-default rounded-lg shadow-lg overflow-hidden max-h-[360px] overflow-y-auto"
    >
      <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border-subtle">
        Move under
      </div>

      <div className="px-1 py-1">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(undefined); onClose(); }}
          disabled={!metric.parentMetricId}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs rounded transition-colors",
            !metric.parentMetricId ? "bg-surface-3 text-foreground cursor-default" : "hover:bg-surface-hover text-foreground",
          )}
        >
          <span className="flex-1 truncate">No parent (top of the tree)</span>
          {!metric.parentMetricId && <span className="text-[10px] text-muted-foreground">current</span>}
        </button>
      </div>

      {candidates.length > 0 ? (
        <div className="px-1 pb-1 border-t border-border-subtle pt-1">
          {candidates.map((m) => {
            const outcome = outcomeForMetric(productLine, m.id);
            const isCurrent = metric.parentMetricId === m.id;
            const Icon = outcome ? LEVEL_ICON_MAP[LEVEL_META[outcome.level].icon] : Activity;
            return (
              <button
                key={m.id}
                onClick={(e) => { e.stopPropagation(); if (!isCurrent) onSelect(m.id); onClose(); }}
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
                  <div className="truncate">{m.name}</div>
                  {outcome && <div className="text-[10px] text-muted-foreground truncate">{outcome.title}</div>}
                </div>
                {isCurrent && <span className="text-[10px] text-muted-foreground">current</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-3 text-xs text-muted-foreground text-center border-t border-border-subtle">
          No valid parents available
        </div>
      )}
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
}

type CardMode = "view" | "edit" | "add-outcome" | "add-child";

/**
 * One node of the metric tree. A metric with an active outcome shows that
 * outcome's identity and status; once the outcome is finished the card goes back
 * to being a plain metric that can take a new one, keeping a link to what came
 * before.
 */
export function MetricTreeCard({ metric, outcome, pastOutcomes = [] }: MetricTreeCardProps) {
  const [reparentOpen, setReparentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<CardMode>("view");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const navigateFromMetricTree = useAppStore((s) => s.navigateFromMetricTree);
  const reparentMetric = useAppStore((s) => s.reparentMetric);
  const removeMetric = useAppStore((s) => s.removeMetric);
  const addMetric = useAppStore((s) => s.addMetric);
  const recordMetricValue = useAppStore((s) => s.recordMetricValue);
  const productLine = useProductLine();

  const levelMeta = outcome ? LEVEL_META[outcome.level] : undefined;
  const LevelIcon = levelMeta ? LEVEL_ICON_MAP[levelMeta.icon] : Activity;

  const last = latestPoint(metric);
  const currentLabel = last
    ? formatMetricValue(last.value, metric.valueFormat)
    : metric.legacyCurrentValue ?? "—";
  const targetLabel =
    metric.numericTarget !== undefined
      ? formatMetricValue(metric.numericTarget, metric.valueFormat)
      : metric.legacyTargetValue;

  const editing = mode !== "view";

  /**
   * Clicking through goes to the outcome being worked here. A plain metric has
   * nowhere to go, so it opens its own settings — turning it into an outcome is
   * a deliberate choice from the actions menu, not the default click.
   */
  function open() {
    if (outcome) navigateFromMetricTree(outcome.id);
    else setMode("edit");
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

  return (
    <div
      id={`metric-tree-node-${metric.id}`}
      role="button"
      tabIndex={editing ? -1 : 0}
      aria-label={outcome ? `Open ${outcome.title}` : `Edit ${metric.name}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        "group relative rounded-xl border p-3.5 select-none transition-all duration-150",
        editing ? "w-[320px] cursor-default" : "w-[260px] cursor-pointer",
        "hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
        outcome && levelMeta
          ? cn("border-border-default border-l-[3px] hover:border-border-strong", levelMeta.bgTint, levelMeta.borderTint)
          : "border-border-subtle bg-surface-1 hover:border-border-default",
      )}
    >
      {/* Actions — visible on hover */}
      {mode === "view" && (
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
              onSelect={(newParentId) => reparentMetric(metric.id, newParentId)}
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
            if (id && currentValue !== undefined) {
              recordMetricValue(id, getPeriodDate(new Date(), values.frequency ?? metric.frequency), currentValue);
            }
          }}
          onClose={() => setMode("view")}
        />
      ) : mode === "add-outcome" ? (
        <AddOutcomeForm metric={metric} onClose={() => setMode("view")} />
      ) : (
        <>
          {/* Header: icon + name */}
          <div className="flex items-start gap-2.5 mb-2.5 pr-10">
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
            <div className="min-w-0">
              <span className="text-[13px] font-medium leading-snug text-foreground line-clamp-2 block">
                {outcome ? outcome.title : metric.name}
              </span>
              {outcome && (
                <span className="text-[10px] text-muted-foreground/60 truncate block mt-0.5">{metric.name}</span>
              )}
            </div>
          </div>

          {/* Current → target */}
          <div className="flex items-center gap-1.5 mb-2.5 text-sm">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full flex-shrink-0",
                  last ? "bg-emerald-500" : "bg-border-default",
                )}
              />
              <span className="font-semibold text-foreground tabular-nums">{currentLabel}</span>
            </span>
            {targetLabel && (
              <>
                <span className="text-muted-foreground text-xs">→</span>
                <span className="text-muted-foreground tabular-nums">{targetLabel}</span>
              </>
            )}
          </div>

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

          {/* Footer: status badge, or type for a plain metric */}
          <div className="flex items-center justify-between gap-1.5">
            {outcome ? (
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border",
                  ENTITY_STATUS_META[outcome.status].color,
                )}
              >
                {ENTITY_STATUS_META[outcome.status].label}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground bg-surface-2 border border-border-subtle px-1.5 py-0.5 rounded">
                {METRIC_TYPE_LABELS[metric.metricType]}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground bg-surface-2 border border-border-subtle px-1.5 py-0.5 rounded">
              {METRIC_FREQUENCY_LABELS[metric.frequency]}
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
    </div>
  );
}

function getChildMetricCount(productLine: ProductLine, metricId: string): number {
  return (productLine.metrics ?? []).filter((m) => m.parentMetricId === metricId).length;
}
