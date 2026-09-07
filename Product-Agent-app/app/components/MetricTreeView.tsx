"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ZoomIn, ZoomOut, Plus, X } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { ENTITY_STATUS_META, getPeriodDate } from "@/app/lib/schemas";
import type { Entity, Metric, ProductLine } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { useAppStore } from "@/app/lib/store";
import { getChildMetrics, getRootMetrics, activeMetricToOutcome, pastMetricToOutcomes, focusFamilyIds } from "@/app/lib/metrics";
import { readTreeFocus } from "@/app/lib/tree-focus-memory";
import { MetricTreeCard } from "./MetricTreeCard";
import { MetricSettingsForm } from "./MetricSettingsForm";
import { MetricParentField } from "./MetricParentPicker";

// ── Status sort ──────────────────────────────────────────────────────────

const STATUS_ORDER: Record<string, number> = {
  commit: 0,
  explore: 1,
  draft: 2,
  done: 3,
  archived: 4,
  dropped: 5,
};

/** Metrics carrying an outcome lead, ordered by that outcome's status; plain metrics follow. */
function makeMetricSort(byMetric: Record<string, Entity>) {
  return (a: Metric, b: Metric): number => {
    const oa = byMetric[a.id];
    const ob = byMetric[b.id];
    if (oa && !ob) return -1;
    if (!oa && ob) return 1;
    if (oa && ob) return (STATUS_ORDER[oa.status] ?? 9) - (STATUS_ORDER[ob.status] ?? 9);
    return 0;
  };
}

// ── Recursive subtree ────────────────────────────────────────────────────

interface SubtreeProps {
  metric: Metric;
  productLine: ProductLine;
  byMetric: Record<string, Entity>;
  pastByMetric: Record<string, Entity[]>;
  family: Set<string>;
  focusedId: string | null;
}

function MetricSubtree({ metric, productLine, byMetric, pastByMetric, family, focusedId }: SubtreeProps) {
  const children = getChildMetrics(productLine, metric.id)
    .filter((m) => m.status === "active")
    .sort(makeMetricSort(byMetric));

  return (
    <div className="flex flex-col items-center">
      <MetricTreeCard
        metric={metric}
        outcome={byMetric[metric.id]}
        pastOutcomes={pastByMetric[metric.id]}
        display={family.size === 0 || family.has(metric.id) ? "full" : "tile"}
        focused={metric.id === focusedId}
      />
      {children.length > 0 && (
        // items-start: a tile next to a full card would otherwise stretch to the
        // full card's height (flex default is stretch), and the connector maths
        // anchors each child edge at childRect.top, which needs level tops.
        <div className="flex gap-5 justify-center items-start mt-14">
          {children.map((child) => (
            <MetricSubtree
              key={child.id}
              metric={child}
              productLine={productLine}
              byMetric={byMetric}
              pastByMetric={pastByMetric}
              family={family}
              focusedId={focusedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── SVG line drawing ─────────────────────────────────────────────────────

const SVG_NS = "http://www.w3.org/2000/svg";

function drawLines(
  canvasEl: HTMLDivElement | null,
  svgEl: SVGSVGElement | null,
  productLine: ProductLine,
  byMetric: Record<string, Entity>,
  zoom: number,
) {
  if (!canvasEl || !svgEl) return;

  const containerRect = canvasEl.getBoundingClientRect();
  const w = canvasEl.scrollWidth;
  const h = canvasEl.scrollHeight;
  svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svgEl.setAttribute("width", String(w));
  svgEl.setAttribute("height", String(h));

  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  for (const metric of productLine.metrics ?? []) {
    if (!metric.parentMetricId || metric.status !== "active") continue;

    const parentEl = document.getElementById(`metric-tree-node-${metric.parentMetricId}`);
    const childEl = document.getElementById(`metric-tree-node-${metric.id}`);
    if (!parentEl || !childEl) continue;

    const parentRect = parentEl.getBoundingClientRect();
    const childRect = childEl.getBoundingClientRect();

    // Convert visual (scaled) coords back to unscaled canvas-local coords
    const x1 = (parentRect.left + parentRect.width / 2 - containerRect.left) / zoom;
    const y1 = (parentRect.bottom - containerRect.top) / zoom;
    const x2 = (childRect.left + childRect.width / 2 - containerRect.left) / zoom;
    const y2 = (childRect.top - containerRect.top) / zoom;
    const midY = y1 + (y2 - y1) * 0.5;

    // An edge into an outcome is solid; one into a plain tracking metric is dashed.
    const isOutcome = Boolean(byMetric[metric.id]);
    const opacity = isOutcome ? "0.6" : "0.4";

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--border-default)");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("opacity", opacity);
    if (!isOutcome) path.setAttribute("stroke-dasharray", "4 3");
    svgEl.appendChild(path);

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(x2));
    circle.setAttribute("cy", String(y2));
    circle.setAttribute("r", "3");
    circle.setAttribute("fill", "var(--border-default)");
    circle.setAttribute("opacity", opacity);
    svgEl.appendChild(circle);
  }
}

// ── Legend ────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Has data
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-border-default" />
        No data yet
      </div>
      {(["commit", "explore", "draft"] as const).map((s) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border",
              ENTITY_STATUS_META[s].color,
            )}
          >
            {ENTITY_STATUS_META[s].label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Add metric modal ──────────────────────────────────────────────────────

/**
 * Adding a metric is a modal rather than a panel beside the tree, so choosing a
 * parent does not fight for space with the tree it is about to change.
 *
 * Follows the documented modal spec: overlay with a 4px blur, card surface,
 * 14px radius, 560px cap, ghost close button, opacity-only transitions. It is
 * portalled to <body> because the tree canvas is scaled, and a transformed
 * ancestor would otherwise capture the fixed positioning.
 */
function AddMetricModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addMetric = useAppStore((s) => s.addMetric);
  const recordMetricValue = useAppStore((s) => s.recordMetricValue);
  const focusMetric = useAppStore((s) => s.focusMetric);
  const productLine = useProductLine();
  const [parentMetricId, setParentMetricId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-overlay backdrop-blur-[4px]"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-metric-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(560px,calc(100vw-32px))] max-h-[calc(100vh-64px)] overflow-y-auto rounded-[14px] border border-border-subtle bg-card p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 id="add-metric-title" className="text-base font-semibold text-foreground">
                  Add a metric
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Track a number first. You can attach an outcome to it whenever you decide to move it.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <MetricSettingsForm
              bare
              defaults={{ metricType: "business" }}
              parentField={
                <MetricParentField
                  inline
                  productLine={productLine}
                  value={parentMetricId}
                  onChange={setParentMetricId}
                />
              }
              onCreate={({ currentValue, ...values }) => {
                const id = addMetric({ ...values, parentMetricId });
                if (!id) return;
                if (currentValue !== undefined) {
                  recordMetricValue(id, getPeriodDate(new Date(), values.frequency ?? "monthly"), currentValue);
                }
                focusMetric(id);
              }}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ── MetricTreeView ────────────────────────────────────────────────────────

export function MetricTreeView() {
  const productLine = useProductLine();

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [adding, setAdding] = useState(false);

  const byMetric = useMemo(() => activeMetricToOutcome(productLine), [productLine]);
  const pastByMetric = useMemo(() => pastMetricToOutcomes(productLine), [productLine]);

  const roots = useMemo(
    () => getRootMetrics(productLine).filter((m) => m.status === "active").sort(makeMetricSort(byMetric)),
    [productLine, byMetric],
  );

  // Looking-glass focus: one metric (plus its parent and direct children) stays
  // full size, everything else shrinks to a tile. This is what keeps a wide
  // branch legible once it no longer fits the viewport at full card width.
  const treeFocusMetricId = useAppStore((s) => s.treeFocusMetricId);
  const setTreeFocus = useAppStore((s) => s.setTreeFocus);
  const clearTreeFocus = useAppStore((s) => s.clearTreeFocus);
  const family = useMemo(
    () => focusFamilyIds(productLine, treeFocusMetricId),
    [productLine, treeFocusMetricId],
  );

  const redrawLines = useCallback(() => {
    drawLines(canvasRef.current, svgRef.current, productLine, byMetric, zoom);
  }, [productLine, byMetric, zoom]);

  // Redraw after render (double rAF ensures DOM has painted)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(redrawLines));
    return () => cancelAnimationFrame(id);
  }, [redrawLines]);

  // Redraw on window resize
  useEffect(() => {
    window.addEventListener("resize", redrawLines);
    return () => window.removeEventListener("resize", redrawLines);
  }, [redrawLines]);

  // Redraw whenever the canvas changes size — catches sidebar expand/collapse
  // transitions and any other layout shifts that would otherwise leave stale lines.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => redrawLines());
    observer.observe(el);
    return () => observer.disconnect();
  }, [redrawLines]);

  // The tree is always focused on something. When there is no focus yet
  // (fresh load, or a click on the canvas cleared it) resolve one: the
  // remembered metric if it still exists and is active, else the first root.
  useEffect(() => {
    if (roots.length === 0) return;
    // A focus can go stale: the metric was deleted, archived, or belonged to a
    // product line we have since left. Re-resolve rather than leaving the board
    // with nothing focused.
    const current = treeFocusMetricId
      ? productLine.metrics?.find((m) => m.id === treeFocusMetricId)
      : undefined;
    if (current && current.status === "active") return;
    const remembered = readTreeFocus(productLine.id);
    const rememberedMetric = remembered
      ? productLine.metrics?.find((m) => m.id === remembered)
      : undefined;
    const resolvedId =
      rememberedMetric && rememberedMetric.status === "active" ? rememberedMetric.id : roots[0]?.id;
    if (resolvedId) setTreeFocus(resolvedId);
  }, [productLine, treeFocusMetricId, roots, setTreeFocus]);

  // Cards animate their width over 250ms when the focus changes. drawLines
  // reads live rects so its own maths needs no change, but it has to run every
  // frame while the widths are moving or the connectors trail behind the
  // cards. Bounded to the transition window, so it never fires on hover (the
  // hover preview is an overlay that moves no card).
  useEffect(() => {
    if (!treeFocusMetricId) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      redrawLines();
      if (now - start < 300) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [treeFocusMetricId, redrawLines]);

  // Centre the focused family once the width transition has settled, so the
  // whole family (not just the focused card) sits in the middle of the view.
  const firstFocusDoneForPL = useRef<string | null>(null);

  useEffect(() => {
    if (!treeFocusMetricId) return;
    const timer = setTimeout(() => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const rects = Array.from(family)
        .map((id) => document.getElementById(`metric-tree-node-${id}`))
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => el.getBoundingClientRect());
      if (rects.length === 0) return;

      const view = scroller.getBoundingClientRect();
      let left = Math.min(...rects.map((r) => r.left));
      let right = Math.max(...rects.map((r) => r.right));
      let top = Math.min(...rects.map((r) => r.top));
      let bottom = Math.max(...rects.map((r) => r.bottom));

      // If the family is wider or taller than the viewport, centring the
      // union would push the focused card itself off-screen. Clamp the box
      // to a viewport-sized window around the focused card instead.
      const focusedEl = document.getElementById(`metric-tree-node-${treeFocusMetricId}`);
      if (focusedEl) {
        const fRect = focusedEl.getBoundingClientRect();
        if (right - left > view.width) {
          const cx = fRect.left + fRect.width / 2;
          left = cx - view.width / 2;
          right = cx + view.width / 2;
        }
        if (bottom - top > view.height) {
          const cy = fRect.top + fRect.height / 2;
          top = cy - view.height / 2;
          bottom = cy + view.height / 2;
        }
      }

      const isFirstForPL = firstFocusDoneForPL.current !== productLine.id;
      firstFocusDoneForPL.current = productLine.id;

      scroller.scrollTo({
        left: scroller.scrollLeft + (left + right) / 2 - (view.left + view.width / 2),
        top: scroller.scrollTop + (top + bottom) / 2 - (view.top + view.height / 2),
        behavior: isFirstForPL ? "auto" : "smooth",
      });
    }, 300);
    return () => clearTimeout(timer);
    // `family` is deliberately not a dependency: it is a fresh Set on every store
    // write, and re-centring the board every time a value is recorded would yank
    // the view out from under the builder. A newly added or moved metric is
    // centred by the `focusedMetricId` effect below instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeFocusMetricId, productLine.id]);

  // Bring a just-added or just-moved metric into the middle of the view, so the
  // change is where you are looking rather than somewhere off the canvas.
  const focusedMetricId = useAppStore((s) => s.focusedMetricId);
  const clearFocusedMetric = useAppStore((s) => s.clearFocusedMetric);

  useEffect(() => {
    if (!focusedMetricId) return;
    // Two frames, same as the connector redraw, so the card is laid out first.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const scroller = scrollRef.current;
        const card = document.getElementById(`metric-tree-node-${focusedMetricId}`);
        if (scroller && card) {
          const view = scroller.getBoundingClientRect();
          const target = card.getBoundingClientRect();
          scroller.scrollTo({
            left:
              scroller.scrollLeft +
              (target.left + target.width / 2) -
              (view.left + view.width / 2),
            top:
              scroller.scrollTop +
              (target.top + target.height / 2) -
              (view.top + view.height / 2),
            behavior: "smooth",
          });
        }
        clearFocusedMetric();
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusedMetricId, clearFocusedMetric]);

  const hasContent = roots.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-start justify-between gap-3 px-[var(--spacing-page-px)] pt-[var(--spacing-page-py)] pb-4 pr-14">
        <div>
          <h2 className="text-base font-semibold text-foreground">Metric Tree</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            What you track and what drives it. Attach an outcome to any metric you want to move.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-xs font-medium text-muted-foreground/60 border border-dashed border-border-default rounded-lg px-3.5 py-1.5 cursor-pointer flex items-center gap-1 shrink-0 hover:text-foreground hover:border-border-strong hover:bg-surface-hover transition-all"
        >
          <Plus size={12} /> Add metric
        </button>
      </div>

      <AddMetricModal key={adding ? "open" : "closed"} open={adding} onClose={() => setAdding(false)} />

      {/* Tree canvas — scrollable in both directions */}
      <div
        ref={scrollRef}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearTreeFocus();
        }}
        className="flex-1 overflow-auto px-[var(--spacing-page-px)]"
      >
        {hasContent ? (
          <div className="min-w-max pb-8">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              {/* Canvas with SVG overlay */}
              <div
                ref={canvasRef}
                className="relative inline-flex justify-center w-full pt-2 pb-16"
                onClick={(e) => {
                  // Click landed on the canvas background itself, not on a card
                  // or anything inside one. Clear the focus, which the effect
                  // above then re-resolves to the root metric, not "unfocused".
                  if (e.target === e.currentTarget) clearTreeFocus();
                }}
              >
                <svg
                  ref={svgRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ overflow: "visible" }}
                  aria-hidden="true"
                />
                {/* Root row */}
                <div className="flex gap-5 justify-center items-start">
                  {roots.map((root) => (
                    <MetricSubtree
                      key={root.id}
                      metric={root}
                      productLine={productLine}
                      byMetric={byMetric}
                      pastByMetric={pastByMetric}
                      family={family}
                      focusedId={treeFocusMetricId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-muted-foreground">
              No metrics yet. Add one to start mapping what drives your business.
            </p>
          </div>
        )}
      </div>

      {/* Footer: legend + zoom controls */}
      <div className="flex-shrink-0 flex items-center justify-between px-[var(--spacing-page-px)] py-3 border-t border-border-subtle">
        <Legend />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, parseFloat((z - 0.1).toFixed(1))))}
            disabled={zoom <= 0.5}
            title="Zoom out"
            className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            title="Reset zoom"
            className="px-2 py-1 rounded-md hover:bg-surface-hover text-xs text-muted-foreground hover:text-foreground transition-colors tabular-nums min-w-[44px] text-center"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, parseFloat((z + 0.1).toFixed(1))))}
            disabled={zoom >= 1.5}
            title="Zoom in"
            className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
