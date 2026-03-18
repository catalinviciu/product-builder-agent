"use client";

import React, { useState, useRef, useCallback } from "react";
import { useClickOutside } from "@/app/lib/hooks/useClickOutside";
import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, LayoutGrid,
  ChevronDown, Check, Plus, Pencil, X, Trash2,
  type LucideIcon,
} from "lucide-react";
import type { Entity, ProductLineStatus } from "@/app/lib/schemas";
import { LEVEL_META, PRODUCT_LINE_STATUS_META, PRODUCT_LINE_STATUSES, ENTITY_STATUS_META } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { PersonaManager } from "./PersonaManager";

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
      personas: [],
      tree: { title: `Product Line: ${name.trim()}`, description: description.trim(), rootChildren: [] },
      entities: {},
    });
    onClose();
  };

  return (
    <div className="px-2 mb-3">
      <div className="rounded-lg border border-border-strong p-3 flex flex-col gap-2 bg-surface-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          New Product Line
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (required)"
          className="bg-surface-hover border border-border-strong rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-border-focus"
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="bg-surface-hover border border-border-strong rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-border-focus"
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={!name.trim()} className="cursor-pointer text-[10px] px-2 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
            <Check size={10} /> Create
          </button>
          <button onClick={onClose} className="cursor-pointer text-[10px] px-2 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
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
  const [codePath, setCodePath] = useState(pl?.codePath || "");

  if (!pl) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateProductLine(plId, { name: name.trim(), description: description.trim(), status, codePath: codePath.trim() });
    updateTree(plId, { title: `Product Line: ${name.trim()}`, description: description.trim() });
    onClose();
  };

  return (
    <div className="px-2 mb-3">
      <div className="rounded-lg border border-border-strong p-3 flex flex-col gap-2 bg-surface-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Edit Product Line
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="bg-surface-hover border border-border-strong rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-border-focus"
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="bg-surface-hover border border-border-strong rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-border-focus"
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
        />
        <input
          value={codePath}
          onChange={(e) => setCodePath(e.target.value)}
          placeholder="Local code path, e.g. Product-Agent-app/"
          className="bg-surface-hover border border-border-strong rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-border-focus"
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
                  status === s ? meta.color : "text-muted-foreground/40 bg-transparent border-border-default hover:border-border-strong"
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} disabled={!name.trim()} className="cursor-pointer text-[10px] px-2 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
            <Check size={10} /> Save
          </button>
          <button onClick={onClose} className="cursor-pointer text-[10px] px-2 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
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

  const handleClickOutside = useCallback(() => {
    setOpen(false);
    setConfirmDeleteId(null);
  }, []);
  useClickOutside(ref, handleClickOutside, open);

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
          "hover:bg-surface-hover border border-border-default",
          open && "bg-surface-hover border-border-strong"
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
        <div className="absolute left-2 right-2 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden">
          {allLines.map((pl) => {
            const isActive = pl.id === currentProductLineId;
            return (
              <div
                key={pl.id}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2.5 transition-colors group/pl",
                  "hover:bg-surface-hover",
                  isActive && "bg-surface-3"
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
                  {isActive && <Check size={14} className="text-emerald-600 dark:text-emerald-400" />}
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
                        className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                        className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted-foreground"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    allLines.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(pl.id); }}
                        className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover/pl:opacity-100 transition-opacity"
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
            className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-left text-xs text-muted-foreground/50 hover:text-foreground hover:bg-surface-hover transition-colors border-t border-border-subtle"
          >
            <Plus size={13} /> New product line
          </button>
        </div>
      )}
    </div>
  );
}

const HIDDEN_STATUSES = new Set(["done", "archived", "dropped"]);
const STATUS_SORT_ORDER: Record<string, number> = { commit: 0, explore: 1, draft: 2 };

export function SectionNav() {
  const { currentEntityId, navigateTo } = useAppStore();
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
            "hover:bg-surface-hover",
            isActive && "bg-surface-active text-foreground",
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
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", ENTITY_STATUS_META[entity.status].dotColor)} title={levelMeta.label} />
          </span>
        </button>

        {hasChildren && isExpanded && entity.children
          .map((childId) => entities[childId])
          .filter((child): child is Entity => !!child && !HIDDEN_STATUSES.has(child.status))
          .sort((a, b) => (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99))
          .map((child) => renderEntity(child, depth + 1))}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 py-4 px-3">
      <ProductLineSelector />
      <PersonaManager />

      <button
        onClick={() => navigateTo(null)}
        className={cn(
          "cursor-pointer flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors duration-150",
          "hover:bg-surface-hover",
          currentEntityId === null && "bg-surface-active text-foreground",
          currentEntityId !== null && "text-muted-foreground"
        )}
      >
        <LayoutGrid size={13} className="shrink-0 text-muted-foreground/60" />
        <span className={cn("text-xs font-medium", currentEntityId === null && "text-foreground")}>
          Overview
        </span>
      </button>

      {tree.rootChildren
        .map((id) => entities[id])
        .filter((entity): entity is Entity => !!entity && !HIDDEN_STATUSES.has(entity.status))
        .sort((a, b) => (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99))
        .map((entity) => renderEntity(entity, 0))}

    </nav>
  );
}
