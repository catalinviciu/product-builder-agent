"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, LayoutGrid,
  ChevronDown, Check, Plus, Pencil, X, Trash2, RotateCcw,
  type LucideIcon,
} from "lucide-react";
import type { Entity, ProductLineStatus } from "@/app/lib/schemas";
import { LEVEL_META, PRODUCT_LINE_STATUS_META, PRODUCT_LINE_STATUSES, ENTITY_STATUS_META } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";

const LEVEL_ICON_MAP: Record<string, LucideIcon> = {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, LayoutGrid,
};

function NewProductLineForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addProductLine } = useAppStore();

  const handleSubmit = () => {
    if (!name.trim()) return;
    const id = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    addProductLine({
      id,
      name: name.trim(),
      description: description.trim(),
      status: "active",
      tree: { title: `Product Line: ${name.trim()}`, description: description.trim(), rootChildren: [] },
      entities: {},
    });
    onClose();
  };

  return (
    <div className="px-2 mb-3">
      <div className="rounded-lg border border-white/15 p-3 flex flex-col gap-2 bg-white/[0.02]">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          New Product Line
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (required)"
          className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-white/30"
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-white/30"
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={!name.trim()} className="cursor-pointer text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
            <Check size={10} /> Create
          </button>
          <button onClick={onClose} className="cursor-pointer text-[10px] px-2 py-1 rounded-md hover:bg-white/5 text-muted-foreground transition-colors flex items-center gap-1">
            <X size={10} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProductLineForm({ plId, onClose }: { plId: string; onClose: () => void }) {
  const productLines = useAppStore((s) => s.productLines);
  const { updateProductLine, updateTree } = useAppStore();
  const pl = productLines[plId];
  const [name, setName] = useState(pl?.name || "");
  const [description, setDescription] = useState(pl?.description || "");
  const [status, setStatus] = useState<ProductLineStatus>(pl?.status || "active");

  if (!pl) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateProductLine(plId, { name: name.trim(), description: description.trim(), status });
    updateTree(plId, { title: `Product Line: ${name.trim()}`, description: description.trim() });
    onClose();
  };

  return (
    <div className="px-2 mb-3">
      <div className="rounded-lg border border-white/15 p-3 flex flex-col gap-2 bg-white/[0.02]">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Edit Product Line
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-white/30"
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-white/30"
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <div className="flex gap-1.5">
          {PRODUCT_LINE_STATUSES.map((s) => {
            const meta = PRODUCT_LINE_STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "cursor-pointer text-[10px] px-2 py-1 rounded-md border transition-colors",
                  status === s ? meta.color : "text-muted-foreground/40 bg-transparent border-white/8 hover:border-white/15"
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={!name.trim()} className="cursor-pointer text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
            <Check size={10} /> Save
          </button>
          <button onClick={onClose} className="cursor-pointer text-[10px] px-2 py-1 rounded-md hover:bg-white/5 text-muted-foreground transition-colors flex items-center gap-1">
            <X size={10} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductLineSelector() {
  const { currentProductLineId, switchProductLine, deleteProductLine } = useAppStore();
  const [open, setOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmDeleteId(null);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const productLines = useAppStore((s) => s.productLines);
  const allLines = Object.values(productLines);
  const current = productLines[currentProductLineId];

  if (showNewForm) {
    return <NewProductLineForm onClose={() => setShowNewForm(false)} />;
  }

  if (editingId) {
    return <EditProductLineForm plId={editingId} onClose={() => setEditingId(null)} />;
  }

  return (
    <div ref={ref} className="relative px-2 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "cursor-pointer flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left transition-colors",
          "hover:bg-white/5 border border-white/8",
          open && "bg-white/5 border-white/15"
        )}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1.5">
            Product Line
            {current?.status && (
              <span className={cn("w-1.5 h-1.5 rounded-full", PRODUCT_LINE_STATUS_META[current.status].dotColor)} />
            )}
          </span>
          <span className="text-xs font-medium text-foreground truncate">
            {current?.name}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-2 right-2 top-full mt-1 z-20 rounded-lg border border-white/10 bg-zinc-900 shadow-xl overflow-hidden">
          {allLines.map((pl) => {
            const isActive = pl.id === currentProductLineId;
            return (
              <div
                key={pl.id}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2.5 transition-colors group/pl",
                  "hover:bg-white/5",
                  isActive && "bg-white/[0.06]"
                )}
              >
                <button
                  onClick={() => { switchProductLine(pl.id); setOpen(false); setConfirmDeleteId(null); }}
                  className="cursor-pointer flex flex-col gap-0.5 min-w-0 flex-1 text-left"
                >
                  <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    {pl.name}
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded border", PRODUCT_LINE_STATUS_META[pl.status].color)}>
                      {PRODUCT_LINE_STATUS_META[pl.status].label}
                    </span>
                  </span>
                  <span className="text-[11px] text-muted-foreground/50">{pl.description}</span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  {isActive && <Check size={14} className="text-emerald-400" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(pl.id); setOpen(false); }}
                    className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-foreground opacity-0 group-hover/pl:opacity-100 transition-opacity"
                  >
                    <Pencil size={11} />
                  </button>
                  {confirmDeleteId === pl.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProductLine(pl.id); setOpen(false); setConfirmDeleteId(null); }}
                        className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                        className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    allLines.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(pl.id); }}
                        className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-red-400 opacity-0 group-hover/pl:opacity-100 transition-opacity"
                      >
                        <Trash2 size={11} />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => { setShowNewForm(true); setOpen(false); }}
            className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-left text-xs text-muted-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors border-t border-white/5"
          >
            <Plus size={13} /> New product line
          </button>
        </div>
      )}
    </div>
  );
}

export function SectionNav() {
  const { currentEntityId, navigateTo, resetData } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { tree, entities, name } = useProductLine();

  const expandedIds = React.useMemo(() => {
    const ids = new Set<string>();
    if (!currentEntityId) return ids;
    ids.add(currentEntityId);
    let current = entities[currentEntityId];
    while (current && current.parentId) {
      ids.add(current.parentId);
      current = entities[current.parentId];
    }
    return ids;
  }, [currentEntityId, entities]);

  function renderEntity(entity: Entity, depth: number): React.ReactNode {
    const isActive = currentEntityId === entity.id;
    const isExpanded = expandedIds.has(entity.id);
    const levelMeta = LEVEL_META[entity.level];
    const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];
    const hasChildren = entity.children && entity.children.length > 0;

    return (
      <div key={entity.id}>
        <button
          onClick={() => navigateTo(entity.id)}
          className={cn(
            "cursor-pointer flex items-start gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors duration-150",
            "hover:bg-white/5",
            isActive && "bg-white/8 text-foreground",
            !isActive && "text-muted-foreground"
          )}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          {IconComponent && (
            <IconComponent
              size={13}
              className={cn(
                "shrink-0 mt-0.5 transition-colors",
                isActive ? levelMeta.accentColor : "text-muted-foreground/60"
              )}
            />
          )}
          <span
            className={cn(
              "text-xs font-medium leading-snug flex items-center gap-1.5",
              isActive && "text-foreground"
            )}
          >
            {entity.title}
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", ENTITY_STATUS_META[entity.status].dotColor)} />
          </span>
        </button>

        {hasChildren && isExpanded && entity.children.map((childId) => {
          const child = entities[childId];
          if (!child) return null;
          return renderEntity(child, depth + 1);
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 py-4 px-3">
      <ProductLineSelector />

      <button
        onClick={() => navigateTo(null)}
        className={cn(
          "cursor-pointer flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors duration-150",
          "hover:bg-white/5",
          currentEntityId === null && "bg-white/8 text-foreground",
          currentEntityId !== null && "text-muted-foreground"
        )}
      >
        <LayoutGrid size={13} className="shrink-0 text-muted-foreground/60" />
        <span className={cn("text-xs font-medium", currentEntityId === null && "text-foreground")}>
          Overview
        </span>
      </button>

      {tree.rootChildren.map((id) => {
        const entity = entities[id];
        if (!entity) return null;
        return renderEntity(entity, 0);
      })}

      <div className="mt-auto pt-4 border-t border-white/5 px-2">
        {showResetConfirm ? (
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-muted-foreground/60">Reset all data?</span>
            <button
              onClick={() => { resetData(); setShowResetConfirm(false); }}
              className="cursor-pointer px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Yes
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="cursor-pointer px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="cursor-pointer flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <RotateCcw size={10} /> Reset to defaults
          </button>
        )}
      </div>
    </nav>
  );
}
