"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ZoomIn, ZoomOut, Activity, MoveRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ENTITY_STATUS_META, METRIC_FREQUENCY_LABELS, formatMetricValue } from "@/app/lib/schemas";
import type { Entity, EntityStore, Signal } from "@/app/lib/schemas";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { useAppStore } from "@/app/lib/store";
import { MetricTreeCard } from "./MetricTreeCard";

// ── Status sort ──────────────────────────────────────────────────────────

const STATUS_ORDER: Record<string, number> = {
  commit: 0,
  explore: 1,
  draft: 2,
  done: 3,
  archived: 4,
  dropped: 5,
};

function sortByStatus(a: Entity, b: Entity): number {
  return (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
}

// ── Signal leaf card ─────────────────────────────────────────────────────

// Walk all descendants of a signal within a PO's flat signals array.
function getSignalDescendants(signals: Signal[], signalId: string): Set<string> {
  const result = new Set<string>();
  const queue = [signalId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const s of signals) {
      if (s.parentSignalId === id && !result.has(s.id)) {
        result.add(s.id);
        queue.push(s.id);
      }
    }
  }
  return result;
}

interface SignalReparentDropdownProps {
  signal: Signal;
  currentPoId: string;
  entities: EntityStore;
  onClose: () => void;
}

function SignalReparentDropdown({
  signal,
  currentPoId,
  entities,
  onClose,
}: SignalReparentDropdownProps) {
  const reparentSignal = useAppStore((s) => s.reparentSignal);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const pos = Object.values(entities)
    .filter((e) => e.level === "product_outcome")
    .sort((a, b) => a.title.localeCompare(b.title));

  // Descendants are only meaningful for cycle-prevention within current PO
  const currentSignals =
    (entities[currentPoId]?.signals ?? []) as Signal[];
  const descendants = getSignalDescendants(currentSignals, signal.id);

  // All candidate signal targets (any PO, excluding self + own descendants if same PO)
  const signalTargets: Array<{ signal: Signal; po: Entity }> = [];
  pos.forEach((po) => {
    (po.signals ?? []).forEach((s) => {
      if (s.id === signal.id) return;
      if (po.id === currentPoId && descendants.has(s.id)) return;
      signalTargets.push({ signal: s, po });
    });
  });

  const isCurrentRootHere = (poId: string) =>
    poId === currentPoId && !signal.parentSignalId;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 z-20 w-[280px] rounded-lg border border-border-default bg-popover shadow-lg p-1 max-h-[360px] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Under Product Outcome
      </div>
      {pos.map((po) => {
        const disabled = isCurrentRootHere(po.id);
        return (
          <button
            key={po.id}
            disabled={disabled}
            onClick={() => {
              reparentSignal(signal.id, { poId: po.id });
              onClose();
            }}
            className={cn(
              "w-full text-left px-2 py-1.5 text-[12px] text-foreground rounded-md truncate",
              disabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-surface-hover",
            )}
          >
            {po.title}
          </button>
        );
      })}

      {signalTargets.length > 0 && (
        <>
          <div className="px-2 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Under Signal
          </div>
          {signalTargets.map(({ signal: s, po }) => {
            const disabled =
              po.id === currentPoId && signal.parentSignalId === s.id;
            return (
              <button
                key={s.id}
                disabled={disabled}
                onClick={() => {
                  reparentSignal(signal.id, {
                    poId: po.id,
                    parentSignalId: s.id,
                  });
                  onClose();
                }}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md truncate",
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-surface-hover",
                )}
              >
                <div className="text-[12px] text-foreground truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  in {po.title}
                </div>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

interface MetricSignalCardProps {
  signal: Signal;
  parentEntityId: string;
  entities: EntityStore;
}

function MetricSignalCard({ signal, parentEntityId, entities }: MetricSignalCardProps) {
  const navigateFromMetricTree = useAppStore((s) => s.navigateFromMetricTree);
  const [reparentOpen, setReparentOpen] = useState(false);
  const lastPoint = signal.dataSeries[signal.dataSeries.length - 1];
  const displayValue = lastPoint
    ? formatMetricValue(lastPoint.value, signal.valueFormat)
    : "—";
  const frequencyLabel = METRIC_FREQUENCY_LABELS[signal.frequency];

  return (
    <div
      id={`metric-tree-signal-${signal.id}`}
      onClick={() => navigateFromMetricTree(parentEntityId)}
      className={cn(
        "group relative w-[260px] rounded-xl border border-border-subtle bg-surface-1 p-3 cursor-pointer select-none",
        "hover:border-border-default hover:shadow-sm transition-all duration-150",
      )}
    >
      {/* Reparent button — visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setReparentOpen((v) => !v);
        }}
        title="Move to another Product Outcome"
        className={cn(
          "absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          reparentOpen && "opacity-100",
        )}
      >
        <MoveRight className="w-3.5 h-3.5" />
      </button>

      {reparentOpen && (
        <SignalReparentDropdown
          signal={signal}
          currentPoId={parentEntityId}
          entities={entities}
          onClose={() => setReparentOpen(false)}
        />
      )}

      {/* Header: icon + name */}
      <div className="flex items-start gap-2 mb-2 pr-6">
        <Activity className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <span className="text-[12px] font-medium leading-snug text-foreground line-clamp-2">
          {signal.name}
        </span>
      </div>

      {/* Value + frequency */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              lastPoint ? "bg-emerald-500" : "bg-border-default",
            )}
          />
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {displayValue}
          </span>
        </div>
        {frequencyLabel && (
          <span className="text-[10px] text-muted-foreground bg-surface-2 border border-border-subtle px-1.5 py-0.5 rounded">
            {frequencyLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Recursive signal subtree ─────────────────────────────────────────────

interface SignalSubtreeProps {
  signal: Signal;
  allSignals: Signal[];
  poId: string;
  entities: EntityStore;
}

function MetricSignalSubtree({
  signal,
  allSignals,
  poId,
  entities,
}: SignalSubtreeProps) {
  const children = allSignals.filter(
    (s) => s.status === "active" && s.parentSignalId === signal.id,
  );
  return (
    <div className="flex flex-col items-center">
      <MetricSignalCard
        signal={signal}
        parentEntityId={poId}
        entities={entities}
      />
      {children.length > 0 && (
        <div className="flex gap-5 justify-center mt-14">
          {children.map((c) => (
            <MetricSignalSubtree
              key={c.id}
              signal={c}
              allSignals={allSignals}
              poId={poId}
              entities={entities}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Recursive subtree ────────────────────────────────────────────────────

interface SubtreeProps {
  entity: Entity;
  entities: EntityStore;
}

function MetricSubtree({ entity, entities }: SubtreeProps) {
  // Only BO and PO children — filter out opportunities/solutions/etc.
  const metricChildren = entity.children
    .map((id) => entities[id])
    .filter(
      (e): e is Entity =>
        e !== undefined &&
        (e.level === "business_outcome" || e.level === "product_outcome"),
    )
    .sort(sortByStatus);

  // Root-level signals on a PO (no parentSignalId)
  const allSignals =
    entity.level === "product_outcome" ? (entity.signals ?? []) : [];
  const rootSignals = allSignals.filter(
    (s) => s.status === "active" && !s.parentSignalId,
  );

  const hasAnyChildren = metricChildren.length > 0 || rootSignals.length > 0;

  return (
    <div className="flex flex-col items-center">
      <MetricTreeCard entity={entity} />
      {hasAnyChildren && (
        <div className="flex gap-5 justify-center mt-14">
          {metricChildren.map((child) => (
            <MetricSubtree key={child.id} entity={child} entities={entities} />
          ))}
          {rootSignals.map((s) => (
            <MetricSignalSubtree
              key={s.id}
              signal={s}
              allSignals={allSignals}
              poId={entity.id}
              entities={entities}
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
  entities: EntityStore,
  zoom: number,
) {
  if (!canvasEl || !svgEl) return;

  const containerRect = canvasEl.getBoundingClientRect();
  const w = canvasEl.scrollWidth;
  const h = canvasEl.scrollHeight;
  svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svgEl.setAttribute("width", String(w));
  svgEl.setAttribute("height", String(h));

  // Remove old lines
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const allNodes = Object.values(entities).filter(
    (e) => e.level === "business_outcome" || e.level === "product_outcome",
  );

  allNodes.forEach((parent) => {
    const metricChildren = parent.children
      .map((id) => entities[id])
      .filter(
        (e): e is Entity =>
          e !== undefined &&
          (e.level === "business_outcome" || e.level === "product_outcome"),
      );

    metricChildren.forEach((child) => {
      const parentEl = document.getElementById(`metric-tree-node-${parent.id}`);
      const childEl = document.getElementById(`metric-tree-node-${child.id}`);
      if (!parentEl || !childEl) return;

      const parentRect = parentEl.getBoundingClientRect();
      const childRect = childEl.getBoundingClientRect();

      // Convert visual (scaled) coords back to unscaled canvas-local coords
      const x1 = (parentRect.left + parentRect.width / 2 - containerRect.left) / zoom;
      const y1 = (parentRect.bottom - containerRect.top) / zoom;
      const x2 = (childRect.left + childRect.width / 2 - containerRect.left) / zoom;
      const y2 = (childRect.top - containerRect.top) / zoom;
      const midY = y1 + (y2 - y1) * 0.5;

      // Orthogonal elbow path (square corners)
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--border-default)");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("opacity", "0.6");
      svgEl.appendChild(path);

      // Dot at child end
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("cx", String(x2));
      circle.setAttribute("cy", String(y2));
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", "var(--border-default)");
      circle.setAttribute("opacity", "0.6");
      svgEl.appendChild(circle);
    });
  });

  // Draw signal lines: root signals connect to their PO; nested signals connect to their parent signal
  const pos = Object.values(entities).filter((e) => e.level === "product_outcome");
  pos.forEach((po) => {
    (po.signals ?? [])
      .filter((s) => s.status === "active")
      .forEach((signal) => {
        const parentEl = signal.parentSignalId
          ? document.getElementById(`metric-tree-signal-${signal.parentSignalId}`)
          : document.getElementById(`metric-tree-node-${po.id}`);
        const signalEl = document.getElementById(`metric-tree-signal-${signal.id}`);
        if (!parentEl || !signalEl) return;

        const parentRect = parentEl.getBoundingClientRect();
        const signalRect = signalEl.getBoundingClientRect();

        const x1 = (parentRect.left + parentRect.width / 2 - containerRect.left) / zoom;
        const y1 = (parentRect.bottom - containerRect.top) / zoom;
        const x2 = (signalRect.left + signalRect.width / 2 - containerRect.left) / zoom;
        const y2 = (signalRect.top - containerRect.top) / zoom;
        const midY = y1 + (y2 - y1) * 0.5;

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "var(--border-default)");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("opacity", "0.4");
        path.setAttribute("stroke-dasharray", "4 3");
        svgEl.appendChild(path);

        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", String(x2));
        circle.setAttribute("cy", String(y2));
        circle.setAttribute("r", "3");
        circle.setAttribute("fill", "var(--border-default)");
        circle.setAttribute("opacity", "0.4");
        svgEl.appendChild(circle);
      });
  });
}

// ── Legend ────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Signal with data
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

// ── MetricTreeView ────────────────────────────────────────────────────────

export function MetricTreeView() {
  const productLine = useProductLine();
  const entities = productLine.entities;

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);

  // Root BOs from tree.rootChildren
  const roots = productLine.tree.rootChildren
    .map((id) => entities[id])
    .filter((e): e is Entity => e !== undefined && e.level === "business_outcome")
    .sort(sortByStatus);

  const redrawLines = useCallback(() => {
    drawLines(canvasRef.current, svgRef.current, entities, zoom);
  }, [entities, zoom]);

  // Redraw after render (double rAF ensures DOM has painted)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(redrawLines));
    return () => cancelAnimationFrame(id);
  }, [redrawLines, productLine]);

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

  const hasContent = roots.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-[var(--spacing-page-px)] pt-[var(--spacing-page-py)] pb-4">
        <h2 className="text-base font-semibold text-foreground">Metric Tree</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          How your outcomes connect and drive each other
        </p>
      </div>

      {/* Tree canvas — scrollable in both directions */}
      <div className="flex-1 overflow-auto px-[var(--spacing-page-px)]">
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
              >
                <svg
                  ref={svgRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ overflow: "visible" }}
                  aria-hidden="true"
                />
                {/* Root row */}
                <div className="flex gap-5 justify-center">
                  {roots.map((root) => (
                    <MetricSubtree key={root.id} entity={root} entities={entities} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-muted-foreground">
              No Business Outcomes yet. Create one to start your metric tree.
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
