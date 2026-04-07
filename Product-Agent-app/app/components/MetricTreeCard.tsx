"use client";

import { useRef, useEffect, useState } from "react";
import { Link } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { getDescendantIds } from "@/app/lib/utils";
import { LEVEL_META, ENTITY_STATUS_META } from "@/app/lib/schemas";
import type { Entity, EntityStore, MetricBlock } from "@/app/lib/schemas";
import { LEVEL_ICON_MAP } from "@/app/lib/icons";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";

// ── ReparentDropdown ────────────────────────────────────────────────────────

interface ReparentDropdownProps {
  entity: Entity;
  entities: EntityStore;
  onSelect: (newParentId: string) => void;
  onClose: () => void;
}

function ReparentDropdown({ entity, entities, onSelect, onClose }: ReparentDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const descendants = getDescendantIds(entities, entity.id);

  const bos = Object.values(entities).filter(
    (e) => e.level === "business_outcome" && e.id !== entity.id && !descendants.includes(e.id),
  );
  const pos = Object.values(entities).filter(
    (e) =>
      e.level === "product_outcome" &&
      e.id !== entity.id &&
      !descendants.includes(e.id),
  );

  const BoIcon = LEVEL_ICON_MAP["Target"];
  const PoIcon = LEVEL_ICON_MAP["TrendingUp"];

  function Item({
    e,
    Icon,
  }: {
    e: Entity;
    Icon: typeof BoIcon;
  }) {
    const isCurrent = entity.parentId === e.id;
    return (
      <button
        key={e.id}
        onClick={(ev) => {
          ev.stopPropagation();
          if (!isCurrent) onSelect(e.id);
          onClose();
        }}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs rounded transition-colors",
          isCurrent
            ? "bg-surface-3 text-foreground cursor-default"
            : "hover:bg-surface-hover text-foreground",
        )}
      >
        <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0", LEVEL_META[e.level].iconBg)}>
          <Icon className={cn("w-3 h-3", LEVEL_META[e.level].accentColor)} />
        </div>
        <span className="flex-1 truncate">{e.title}</span>
        {isCurrent && <span className="text-[10px] text-muted-foreground">current</span>}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-7 right-0 z-50 w-64 bg-popover border border-border-default rounded-lg shadow-lg overflow-hidden"
    >
      <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border-subtle">
        Move to parent
      </div>

      {bos.length > 0 && (
        <>
          <div className="px-3 pt-2 pb-0.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">
            Business Outcomes
          </div>
          <div className="px-1 pb-1">
            {bos.map((e) => (
              <Item key={e.id} e={e} Icon={BoIcon} />
            ))}
          </div>
        </>
      )}

      {pos.length > 0 && (
        <>
          <div className="px-3 pt-1.5 pb-0.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide border-t border-border-subtle">
            Product Outcomes
          </div>
          <div className="px-1 pb-1">
            {pos.map((e) => (
              <Item key={e.id} e={e} Icon={PoIcon} />
            ))}
          </div>
        </>
      )}

      {bos.length === 0 && pos.length === 0 && (
        <div className="px-3 py-3 text-xs text-muted-foreground text-center">
          No valid parents available
        </div>
      )}
    </div>
  );
}

// ── MetricTreeCard ────────────────────────────────────────────────────────

interface MetricTreeCardProps {
  entity: Entity;
}

export function MetricTreeCard({ entity }: MetricTreeCardProps) {
  const [reparentOpen, setReparentOpen] = useState(false);
  const navigateFromMetricTree = useAppStore((s) => s.navigateFromMetricTree);
  const reparentEntity = useAppStore((s) => s.reparentEntity);
  const productLine = useProductLine();
  const entities = productLine.entities;

  const levelMeta = LEVEL_META[entity.level];
  const statusMeta = ENTITY_STATUS_META[entity.status];
  const LevelIcon = LEVEL_ICON_MAP[levelMeta.icon];

  const isBO = entity.level === "business_outcome";

  // Find the metric block for current → target display
  const metricBlock = entity.blocks.find((b) => b.type === "metric") as MetricBlock | undefined;

  function handleCardClick(e: React.MouseEvent) {
    // Don't navigate if clicking the reparent button area
    if ((e.target as Element).closest(".reparent-zone")) return;
    navigateFromMetricTree(entity.id);
  }

  function handleReparent(newParentId: string) {
    reparentEntity(entity.id, newParentId);
    setReparentOpen(false);
  }

  return (
    <div
      id={`metric-tree-node-${entity.id}`}
      onClick={handleCardClick}
      className={cn(
        "group relative w-[260px] rounded-xl border border-border-default p-3.5 cursor-pointer select-none",
        "hover:border-border-strong hover:shadow-md transition-all duration-150",
        "border-l-[3px]",
        levelMeta.bgTint,
        levelMeta.borderTint,
      )}
    >
      {/* Reparent button — POs only, visible on hover */}
      {!isBO && (
        <div className="reparent-zone absolute top-2.5 right-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setReparentOpen((v) => !v);
            }}
            title="Change parent"
            className={cn(
              "p-1 rounded-md transition-all",
              "opacity-0 group-hover:opacity-100",
              reparentOpen ? "opacity-100 bg-surface-active" : "hover:bg-surface-hover",
            )}
          >
            <Link className={cn("w-3 h-3", levelMeta.accentColor)} />
          </button>
          {reparentOpen && (
            <ReparentDropdown
              entity={entity}
              entities={entities}
              onSelect={handleReparent}
              onClose={() => setReparentOpen(false)}
            />
          )}
        </div>
      )}

      {/* Header: icon + title */}
      <div className="flex items-start gap-2.5 mb-2.5 pr-5">
        <div
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
            levelMeta.iconBg,
          )}
        >
          {LevelIcon && (
            <LevelIcon className={cn("w-3.5 h-3.5", levelMeta.accentColor)} />
          )}
        </div>
        <span className="text-[13px] font-medium leading-snug text-foreground line-clamp-2">
          {entity.title}
        </span>
      </div>

      {/* Metric: current → target */}
      {metricBlock && (metricBlock.currentValue || metricBlock.targetValue) && (
        <div className="flex items-center gap-1.5 mb-2.5 text-sm">
          <span className="font-semibold text-foreground">{metricBlock.currentValue || "—"}</span>
          <span className="text-muted-foreground text-xs">→</span>
          <span className="text-muted-foreground">{metricBlock.targetValue || "—"}</span>
        </div>
      )}

      {/* Footer: status badge */}
      <div className="flex items-center">
        <span
          className={cn(
            "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border",
            statusMeta.color,
          )}
        >
          {statusMeta.label}
        </span>
      </div>
    </div>
  );
}
