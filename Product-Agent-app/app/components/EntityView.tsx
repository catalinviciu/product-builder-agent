"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical,
  ChevronDown, ChevronRight, Pencil, Trash2, Plus, X, Check, Copy, LayoutGrid, Columns3, User,
  type LucideIcon,
} from "lucide-react";
import type {
  Entity, Block, AccordionBlock, PillsBlock, QuoteBlock, MetricBlock, EntityLevel, EntityStatus,
} from "@/app/lib/schemas";
import { LEVEL_META, CHILD_LEVEL, ENTITY_STATUS_META, ENTITY_STATUSES, PERSONA_LEVELS } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { getEntity, getRootEntities, getEntityPreview, generateId, cn, buildEntityAnchor, buildRootAnchor } from "@/app/lib/utils";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { DndContext, DragEndEvent, useDroppable, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { EntityBreadcrumb } from "./EntityBreadcrumb";
import { ChildEntityCard } from "./ChildEntityCard";

const LEVEL_ICON_MAP: Record<string, LucideIcon> = {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical,
};

function CopyAnchorButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy context anchor for AI agent"
      className="cursor-pointer p-1 rounded text-muted-foreground/50 hover:text-foreground transition-colors"
    >
      {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}

// ── Shared components ─────────────────────────────────────────────────────

function MarkdownBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <article className="max-w-none text-[14px] leading-relaxed text-foreground/80
      [&_h1]:text-[14px] [&_h2]:text-[14px] [&_h3]:text-[14px] [&_h4]:text-[14px]
      [&_h1]:font-medium [&_h2]:font-medium [&_h3]:font-medium [&_h4]:font-medium
      [&_h1]:text-foreground/70 [&_h2]:text-foreground/70 [&_h3]:text-foreground/70 [&_h4]:text-foreground/70
      [&_h1]:mt-3 [&_h2]:mt-3 [&_h3]:mt-3 [&_h4]:mt-3
      [&_h1]:mb-1 [&_h2]:mb-1 [&_h3]:mb-1 [&_h4]:mb-1
      [&_p]:my-1.5
      [&_ul]:my-1.5 [&_ol]:my-1.5
      [&_li]:my-0.5
      [&_strong]:text-foreground/90 [&_strong]:font-medium
      [&_code]:text-blue-600 dark:[&_code]:text-blue-300 [&_code]:text-xs [&_code]:bg-surface-hover [&_code]:px-1 [&_code]:rounded
      [&_blockquote]:text-muted-foreground/70 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong
      [&_blockquote]:pl-4 [&_blockquote]:text-[13px] [&_blockquote]:italic [&_blockquote]:my-2"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}

function MetricCard({ metric, currentValue, targetValue, timeframe }: {
  metric: string; currentValue: string; targetValue: string; timeframe?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border-default">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{metric}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground/60">{currentValue}</span>
          <span className="text-muted-foreground/40">&rarr;</span>
          <span className="text-lg font-semibold text-foreground">{targetValue}</span>
        </div>
        {timeframe && <span className="text-[11px] text-muted-foreground/40">{timeframe}</span>}
      </div>
    </div>
  );
}

function Pills({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.label} className={cn(
          "text-[11px] px-2.5 py-1 rounded-lg border",
          item.color || "text-foreground/70 bg-surface-2 border-border-default"
        )}>
          <span className="text-muted-foreground/50 mr-1">{item.label}:</span>
          {item.value}
        </span>
      ))}
    </div>
  );
}

function AccordionSection({ label, children, defaultOpen = false }: {
  label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border-default overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center justify-between w-full px-4 py-3 bg-surface-1 hover:bg-surface-2 transition-colors"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-border-subtle">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Status picker ─────────────────────────────────────────────────────────

function StatusPicker({ status, onChange }: { status: EntityStatus; onChange: (s: EntityStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const meta = ENTITY_STATUS_META[status];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "cursor-pointer text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border transition-all duration-150 group/status flex items-center gap-1.5",
          meta.color,
          "hover:brightness-125 hover:shadow-[0_0_8px_rgba(255,255,255,0.06)] hover:scale-105"
        )}
      >
        {meta.label}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[120px]">
          {ENTITY_STATUSES.map((s) => {
            const m = ENTITY_STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                  status === s && "bg-surface-3"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", m.dotColor)} />
                <span className={status === s ? "text-foreground font-medium" : "text-muted-foreground"}>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Persona picker ────────────────────────────────────────────────────────

function PersonaPicker({ entityId, personaId }: { entityId: string; personaId?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { assignPersona } = useAppStore();
  const productLine = useProductLine();
  const personas = productLine.personas ?? [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentPersona = personas.find((p) => p.id === personaId);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
          "cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1",
          currentPersona ? "text-foreground/70" : "text-muted-foreground/50"
        )}
      >
        <User size={10} />
        {currentPersona ? currentPersona.name : "Unassigned"}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[160px]">
          <button
            onClick={(e) => { e.stopPropagation(); assignPersona(entityId, undefined); setOpen(false); }}
            className={cn(
              "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
              !personaId && "bg-surface-3"
            )}
          >
            <span className={!personaId ? "text-foreground font-medium" : "text-muted-foreground"}>Unassigned</span>
          </button>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={(e) => { e.stopPropagation(); assignPersona(entityId, p.id); setOpen(false); }}
              className={cn(
                "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                personaId === p.id && "bg-surface-3"
              )}
            >
              <span className={personaId === p.id ? "text-foreground font-medium" : "text-muted-foreground"}>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Click-to-edit helpers ─────────────────────────────────────────────────

function EditableText({ value, onSave, as = "input", placeholder }: {
  value: string; onSave: (v: string) => void; as?: "input" | "textarea"; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="cursor-pointer text-left group inline-flex items-center gap-1.5 hover:bg-surface-hover rounded-md px-1 -mx-1 transition-colors"
      >
        <span>{value || <span className="text-muted-foreground/40 italic">{placeholder || "Click to edit"}</span>}</span>
        <Pencil size={12} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </button>
    );
  }

  const save = () => { onSave(draft); setEditing(false); };
  const cancel = () => setEditing(false);

  const common = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && as === "input") save();
      if (e.key === "Escape") cancel();
    },
    className: "w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus",
  };

  return (
    <div className="flex flex-col gap-2">
      {as === "textarea" ? (
        <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} rows={4} {...common} />
      ) : (
        <input ref={ref as React.RefObject<HTMLInputElement>} maxLength={80} {...common} />
      )}
      <div className="flex gap-2">
        <button onClick={save} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1">
          <Check size={12} /> Save
        </button>
        <button onClick={cancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── Block renderers ───────────────────────────────────────────────────────

function BlockToolbar({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity flex gap-1">
      <button onClick={onEdit} className="cursor-pointer p-1.5 rounded-md bg-surface-hover hover:bg-surface-3 text-muted-foreground/60 hover:text-foreground transition-colors">
        <Pencil size={12} />
      </button>
      {confirmDelete ? (
        <div className="flex gap-1">
          <button onClick={onDelete} className="cursor-pointer p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors text-[10px] font-medium px-2">
            Delete
          </button>
          <button onClick={() => setConfirmDelete(false)} className="cursor-pointer p-1.5 rounded-md bg-surface-hover hover:bg-surface-3 text-muted-foreground/60 transition-colors text-[10px] px-2">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setConfirmDelete(true)} className="cursor-pointer p-1.5 rounded-md bg-surface-hover hover:bg-surface-3 text-muted-foreground/60 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}

function AccordionBlockEditor({ block, onSave, onCancel }: { block: AccordionBlock; onSave: (b: Partial<AccordionBlock>) => void; onCancel: () => void }) {
  const [label, setLabel] = useState(block.label);
  const [content, setContent] = useState(block.content);
  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Section title"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus font-semibold" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content (markdown)"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus font-mono" />
      <div className="flex gap-2">
        <button onClick={() => onSave({ label, content })} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

function PillsBlockEditor({ block, onSave, onCancel }: { block: PillsBlock; onSave: (b: Partial<PillsBlock>) => void; onCancel: () => void }) {
  const [items, setItems] = useState(block.items.map((i) => ({ ...i })));
  const updateItem = (idx: number, field: "label" | "value", val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: val };
    setItems(next);
  };
  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Label"
            className="bg-surface-hover border border-border-strong rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none w-28" />
          <input value={item.value} onChange={(e) => updateItem(i, "value", e.target.value)} placeholder="Value"
            className="bg-surface-hover border border-border-strong rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none flex-1" />
          <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="cursor-pointer p-1 text-muted-foreground/40 hover:text-red-600 dark:hover:text-red-400"><X size={14} /></button>
        </div>
      ))}
      <button onClick={() => setItems([...items, { label: "", value: "" }])} className="cursor-pointer text-xs text-muted-foreground/50 hover:text-foreground flex items-center gap-1"><Plus size={12} /> Add item</button>
      <div className="flex gap-2">
        <button onClick={() => onSave({ items })} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

function QuoteBlockEditor({ block, onSave, onCancel }: { block: QuoteBlock; onSave: (b: Partial<QuoteBlock>) => void; onCancel: () => void }) {
  const [content, setContent] = useState(block.content);
  const [attribution, setAttribution] = useState(block.attribution || "");
  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Quote text"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus italic" />
      <input value={attribution} onChange={(e) => setAttribution(e.target.value)} placeholder="Attribution (optional)"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border-focus" />
      <div className="flex gap-2">
        <button onClick={() => onSave({ content, attribution: attribution || undefined })} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

function MetricBlockEditor({ block, onSave, onCancel }: { block: MetricBlock; onSave: (b: Partial<MetricBlock>) => void; onCancel: () => void }) {
  const [metric, setMetric] = useState(block.metric);
  const [currentValue, setCurrentValue] = useState(block.currentValue);
  const [targetValue, setTargetValue] = useState(block.targetValue);
  const [timeframe, setTimeframe] = useState(block.timeframe || "");
  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <input value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Metric name"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none" />
      <div className="flex gap-2">
        <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Current"
          className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none flex-1" />
        <input value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="Target"
          className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none flex-1" />
      </div>
      <input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="Timeframe (optional)"
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none" />
      <div className="flex gap-2">
        <button onClick={() => onSave({ metric, currentValue, targetValue, timeframe: timeframe || undefined })} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

function BlockRenderer({ block, entityId }: { block: Block; entityId: string }) {
  const [editing, setEditing] = useState(false);
  const { updateBlock, removeBlock } = useAppStore();

  const handleSave = (updates: Partial<Block>) => {
    updateBlock(entityId, block.id, updates);
    setEditing(false);
  };
  const handleDelete = () => removeBlock(entityId, block.id);

  if (editing) {
    switch (block.type) {
      case "accordion": return <AccordionBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
      case "pills": return <PillsBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
      case "quote": return <QuoteBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
      case "metric": return <MetricBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
    }
  }

  return (
    <div className="relative group/block">
      <BlockToolbar onEdit={() => setEditing(true)} onDelete={handleDelete} />
      {block.type === "accordion" && (
        <AccordionSection label={block.label} defaultOpen={block.defaultOpen}>
          <MarkdownBlock content={block.content} />
        </AccordionSection>
      )}
      {block.type === "pills" && <Pills items={block.items} />}
      {block.type === "quote" && (
        <blockquote className="border-l-2 border-amber-400/30 pl-4 py-2 text-sm text-foreground/70 italic bg-amber-400/[0.03] rounded-r-lg">
          <p>{block.content}</p>
          {block.attribution && <cite className="text-xs text-muted-foreground/50 not-italic block mt-1">&mdash; {block.attribution}</cite>}
        </blockquote>
      )}
      {block.type === "metric" && (
        <MetricCard metric={block.metric} currentValue={block.currentValue} targetValue={block.targetValue} timeframe={block.timeframe} />
      )}
    </div>
  );
}

// ── Add Block dropdown ────────────────────────────────────────────────────

function AddBlockButton({ entityId }: { entityId: string }) {
  const [open, setOpen] = useState(false);
  const { addBlock } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const blockTypes: { type: Block["type"]; label: string }[] = [
    { type: "accordion", label: "Accordion Section" },
    { type: "pills", label: "Pills / Tags" },
    { type: "quote", label: "Quote" },
    { type: "metric", label: "Metric Card" },
  ];

  const handleAdd = (type: Block["type"]) => {
    const id = `${entityId}-b${Date.now()}`;
    let block: Block;
    switch (type) {
      case "accordion": block = { id, type, label: "New Section", content: "" }; break;
      case "pills": block = { id, type, items: [{ label: "Label", value: "Value" }] }; break;
      case "quote": block = { id, type, content: "" }; break;
      case "metric": block = { id, type, metric: "Metric", currentValue: "0", targetValue: "0" }; break;
    }
    addBlock(entityId, block);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors w-full justify-center"
      >
        <Plus size={14} /> Add block
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden">
          {blockTypes.map((bt) => (
            <button
              key={bt.type}
              onClick={() => handleAdd(bt.type)}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-left text-xs text-foreground hover:bg-surface-hover transition-colors"
            >
              {bt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Block list (replaces renderEntityContent) ─────────────────────────────

function BlockList({ entity }: { entity: Entity }) {
  const { updateEntity } = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-foreground/80 leading-relaxed">
        <EditableText
          value={entity.description}
          onSave={(v) => updateEntity(entity.id, { description: v })}
          as="textarea"
          placeholder="Add a description..."
        />
      </div>
      {entity.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} entityId={entity.id} />
      ))}
      <AddBlockButton entityId={entity.id} />
    </div>
  );
}

// ── Children grid + Add child ─────────────────────────────────────────────

function AddChildForm({ parentId, childLevel, onClose }: { parentId: string; childLevel: EntityLevel; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addChildEntity, navigateToChild } = useAppStore();
  const childMeta = LEVEL_META[childLevel];

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = generateId();
    const entity: Entity = {
      id,
      level: childLevel,
      title: title.trim(),
      icon: childMeta.icon,
      description: description.trim(),
      status: "draft",
      parentId,
      children: [],
      blocks: [],
    };
    addChildEntity(parentId, entity);
    navigateToChild(id);
    onClose();
  };

  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        New {childMeta.label}
      </span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={`${childMeta.label} title (required)`}
        maxLength={80}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
          <Check size={12} /> Create
        </button>
        <button onClick={onClose} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── Kanban column config ──────────────────────────────────────────────────

const KANBAN_COLUMNS = [
  { key: "draft",   label: "Draft",    statuses: ["draft"] as EntityStatus[],                        accentBorder: "border-zinc-400/30",    dotColor: "bg-zinc-500 dark:bg-zinc-400" },
  { key: "explore", label: "Explore",  statuses: ["explore"] as EntityStatus[],                      accentBorder: "border-blue-400/30",    dotColor: "bg-blue-500 dark:bg-blue-400" },
  { key: "commit",  label: "Commit",   statuses: ["commit"] as EntityStatus[],                       accentBorder: "border-emerald-400/30", dotColor: "bg-emerald-500 dark:bg-emerald-400" },
  { key: "done",    label: "Done",     statuses: ["done", "archived", "dropped"] as EntityStatus[],  accentBorder: "border-violet-400/30",  dotColor: "bg-violet-500 dark:bg-violet-400" },
];

function KanbanColumn({ columnKey, label, dotColor, accentBorder, children, count }: {
  columnKey: string; label: string; dotColor: string; accentBorder: string; children: React.ReactNode; count: number;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: columnKey });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg bg-surface-1 border border-border-subtle p-2 flex flex-col gap-2 min-w-[75vw] md:min-w-0 snap-center",
        "border-t-2",
        accentBorder,
        isOver && "border-border-strong bg-surface-2",
      )}
    >
      <div className="flex items-center gap-2 px-1 py-1">
        <span className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{label}</span>
        <span className="text-[10px] text-muted-foreground/40 ml-auto">{count}</span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {children}
      </div>
    </div>
  );
}

function ChildrenGrid({ entity }: { entity: Entity }) {
  const productLine = useProductLine();
  const { entities } = productLine;
  const { updateEntity } = useAppStore();
  const personas = productLine.personas ?? [];
  const getPersonaName = (child: Entity) => {
    if (!PERSONA_LEVELS.has(child.level) || !child.personaId) return undefined;
    return personas.find((p) => p.id === child.personaId)?.name;
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const childLevel = CHILD_LEVEL[entity.level];

  const children = entity.children
    .map((id) => getEntity(entities, id))
    .filter((e): e is Entity => e !== undefined);

  const levelMeta = LEVEL_META[entity.level];
  const hasContent = children.length > 0 || childLevel !== null;

  // Persist view mode in localStorage — default deterministically to avoid hydration mismatch
  const [viewMode, setViewMode] = useState<"grid" | "kanban">(children.length >= 4 ? "kanban" : "grid");

  useEffect(() => {
    const saved = localStorage.getItem("pa-view-mode");
    if (saved === "grid" || saved === "kanban") setViewMode(saved);
  }, []);

  const handleSetViewMode = (mode: "grid" | "kanban") => {
    setViewMode(mode);
    localStorage.setItem("pa-view-mode", mode);
  };

  if (!hasContent) return null;

  function getChildCardProps(child: Entity) {
    let preview = getEntityPreview(child);
    let badge = "";
    if (child.level === "product_outcome") {
      const metricBlock = child.blocks.find((b) => b.type === "metric");
      const childCount = child.children?.length ?? 0;
      if (metricBlock && metricBlock.type === "metric") {
        preview = `${metricBlock.currentValue} → ${metricBlock.targetValue}${metricBlock.timeframe ? ` · ${metricBlock.timeframe}` : ""}`;
      }
      badge = `${childCount} opportunit${childCount !== 1 ? "ies" : "y"}`;
    }
    return { preview, badge };
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const columnKey = over.id as string;
    const statusMap: Record<string, EntityStatus> = { draft: "draft", explore: "explore", commit: "commit", done: "done" };
    const newStatus = statusMap[columnKey];
    if (newStatus) {
      updateEntity(active.id as string, { status: newStatus });
    }
  }

  const activeChild = activeId ? children.find(c => c.id === activeId) : null;

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Header with view toggle */}
      {(children.length > 0 || childLevel) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground shrink-0">
              {levelMeta.childrenLabel}
            </span>
            {childLevel && (
              <span className="text-[11px] text-muted-foreground/30 italic hidden sm:inline">
                {LEVEL_META[childLevel].description}
              </span>
            )}
          </div>
          {children.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSetViewMode("grid")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md transition-colors",
                  viewMode === "grid" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
                )}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => handleSetViewMode("kanban")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md transition-colors",
                  viewMode === "kanban" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
                )}
                title="Kanban view"
              >
                <Columns3 size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && children.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {children.map((child) => {
            const { preview, badge } = getChildCardProps(child);
            return (
              <ChildEntityCard
                key={child.id}
                id={child.id}
                title={child.title}
                icon={child.icon}
                level={child.level}
                preview={preview}
                status={child.status}
                badge={badge}
                personaName={getPersonaName(child)}
              />
            );
          })}
        </div>
      )}

      {/* Kanban view */}
      {viewMode === "kanban" && children.length > 0 && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)} collisionDetection={pointerWithin}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none flex md:grid">
            {KANBAN_COLUMNS.map((col) => {
              const doneItems = children.filter((c) => c.status === "done");
              const archivedOrDroppedItems = children.filter((c) => c.status === "archived" || c.status === "dropped");
              const colChildren = col.key === "done"
                ? doneItems
                : children.filter((c) => col.statuses.includes(c.status));

              const totalCount = col.key === "done" ? doneItems.length + archivedOrDroppedItems.length : colChildren.length;

              return (
                <KanbanColumn
                  key={col.key}
                  columnKey={col.key}
                  label={col.label}
                  dotColor={col.dotColor}
                  accentBorder={col.accentBorder}
                  count={totalCount}
                >
                  {colChildren.length === 0 && (col.key !== "done" || archivedOrDroppedItems.length === 0) && (
                    <p className="text-xs text-muted-foreground/30 italic px-1 py-3 text-center">No items</p>
                  )}
                  {colChildren.map((child) => {
                    const { preview, badge } = getChildCardProps(child);
                    return (
                      <ChildEntityCard
                        key={child.id}
                        id={child.id}
                        title={child.title}
                        icon={child.icon}
                        level={child.level}
                        preview={preview}
                        status={child.status}
                        badge={badge}
                        hideStatus
                        draggable
                        personaName={getPersonaName(child)}
                      />
                    );
                  })}
                  {/* Archived toggle in Done column */}
                  {col.key === "done" && archivedOrDroppedItems.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="cursor-pointer text-[11px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors flex items-center gap-1.5 px-1 py-1"
                      >
                        <ChevronDown size={12} className={cn("transition-transform", showArchived && "rotate-180")} />
                        {showArchived ? "Hide" : "Show"} {archivedOrDroppedItems.length} archived/dropped
                      </button>
                      {showArchived && archivedOrDroppedItems.map((child) => {
                        const { preview, badge } = getChildCardProps(child);
                        return (
                          <ChildEntityCard
                            key={child.id}
                            id={child.id}
                            title={child.title}
                            icon={child.icon}
                            level={child.level}
                            preview={preview}
                            status={child.status}
                            badge={badge}
                            hideStatus
                            draggable
                            personaName={getPersonaName(child)}
                          />
                        );
                      })}
                    </>
                  )}
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>
            {activeChild ? (
              <div className="bg-popover rounded-xl shadow-2xl shadow-black/50">
                <ChildEntityCard
                  id={activeChild.id}
                  title={activeChild.title}
                  icon={activeChild.icon}
                  level={activeChild.level}
                  preview={getChildCardProps(activeChild).preview}
                  status={activeChild.status}
                  badge={getChildCardProps(activeChild).badge}
                  hideStatus
                  personaName={getPersonaName(activeChild)}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {childLevel && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors justify-center"
        >
          <Plus size={14} /> Add {LEVEL_META[childLevel].label}
        </button>
      )}
      {childLevel && showAddForm && (
        <AddChildForm parentId={entity.id} childLevel={childLevel} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

// ── Root view ─────────────────────────────────────────────────────────────

function AddRootEntityForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addRootEntity, navigateToChild } = useAppStore();
  const boMeta = LEVEL_META.business_outcome;

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = generateId();
    const entity: Entity = {
      id,
      level: "business_outcome",
      title: title.trim(),
      icon: boMeta.icon,
      description: description.trim(),
      status: "draft",
      children: [],
      blocks: [],
    };
    addRootEntity(entity);
    navigateToChild(id);
    onClose();
  };

  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        New Business Outcome
      </span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Business Outcome title (required)"
        maxLength={80}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
          <Check size={12} /> Create
        </button>
        <button onClick={onClose} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

function RootView() {
  const productLine = useProductLine();
  const { tree, entities, id: plId } = productLine;
  const { updateTree, updateEntity } = useAppStore();
  const roots = getRootEntities(entities, tree);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Persist view mode in localStorage — default deterministically to avoid hydration mismatch
  const [viewMode, setViewMode] = useState<"grid" | "kanban">(roots.length >= 4 ? "kanban" : "grid");

  useEffect(() => {
    const saved = localStorage.getItem("pa-view-mode");
    if (saved === "grid" || saved === "kanban") setViewMode(saved);
  }, []);

  const handleSetViewMode = (mode: "grid" | "kanban") => {
    setViewMode(mode);
    localStorage.setItem("pa-view-mode", mode);
  };

  function getRootCardProps(entity: Entity) {
    const childCount = entity.children?.length ?? 0;
    const metricBlock = entity.blocks.find((b) => b.type === "metric");
    let preview = "";
    let badge = "";
    if (entity.level === "business_outcome" && metricBlock && metricBlock.type === "metric") {
      preview = `${metricBlock.currentValue} → ${metricBlock.targetValue}${metricBlock.timeframe ? ` · ${metricBlock.timeframe}` : ""}`;
      badge = `${childCount} product outcome${childCount !== 1 ? "s" : ""}`;
    }
    return { preview: preview || getEntityPreview(entity), badge };
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const columnKey = over.id as string;
    const statusMap: Record<string, EntityStatus> = { draft: "draft", explore: "explore", commit: "commit", done: "done" };
    const newStatus = statusMap[columnKey];
    if (newStatus) {
      updateEntity(active.id as string, { status: newStatus });
    }
  }

  const activeChild = activeId ? roots.find(c => c.id === activeId) : null;
  const boMeta = LEVEL_META.business_outcome;

  return (
    <div className="px-8 py-8 pb-28 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            <EditableText
              value={tree.title}
              onSave={(v) => updateTree(plId, { title: v })}
            />
          </h1>
          <CopyAnchorButton text={buildRootAnchor(productLine.name)} />
        </div>
        <div className="text-xs text-muted-foreground">
          <EditableText
            value={tree.description}
            onSave={(v) => updateTree(plId, { description: v })}
            placeholder="Add a description..."
          />
        </div>
      </div>

      {/* Section header with view toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground shrink-0">
            Business Outcomes
          </span>
          <span className="text-[11px] text-muted-foreground/30 italic hidden sm:inline">
            {boMeta.description}
          </span>
        </div>
        {roots.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSetViewMode("grid")}
              className={cn(
                "cursor-pointer p-1.5 rounded-md transition-colors",
                viewMode === "grid" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
              )}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => handleSetViewMode("kanban")}
              className={cn(
                "cursor-pointer p-1.5 rounded-md transition-colors",
                viewMode === "kanban" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
              )}
              title="Kanban view"
            >
              <Columns3 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Grid view */}
      {viewMode === "grid" && roots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {roots.map((entity) => {
            const { preview, badge } = getRootCardProps(entity);
            return (
              <ChildEntityCard
                key={entity.id}
                id={entity.id}
                title={entity.title}
                icon={entity.icon}
                level={entity.level}
                preview={preview}
                status={entity.status}
                badge={badge}
              />
            );
          })}
        </div>
      )}

      {/* Kanban view */}
      {viewMode === "kanban" && roots.length > 0 && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)} collisionDetection={pointerWithin}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none flex md:grid">
            {KANBAN_COLUMNS.map((col) => {
              const doneItems = roots.filter((c) => c.status === "done");
              const archivedOrDroppedItems = roots.filter((c) => c.status === "archived" || c.status === "dropped");
              const colChildren = col.key === "done"
                ? doneItems
                : roots.filter((c) => col.statuses.includes(c.status));

              const totalCount = col.key === "done" ? doneItems.length + archivedOrDroppedItems.length : colChildren.length;

              return (
                <KanbanColumn
                  key={col.key}
                  columnKey={col.key}
                  label={col.label}
                  dotColor={col.dotColor}
                  accentBorder={col.accentBorder}
                  count={totalCount}
                >
                  {colChildren.length === 0 && (col.key !== "done" || archivedOrDroppedItems.length === 0) && (
                    <p className="text-xs text-muted-foreground/30 italic px-1 py-3 text-center">No items</p>
                  )}
                  {colChildren.map((child) => {
                    const { preview, badge } = getRootCardProps(child);
                    return (
                      <ChildEntityCard
                        key={child.id}
                        id={child.id}
                        title={child.title}
                        icon={child.icon}
                        level={child.level}
                        preview={preview}
                        status={child.status}
                        badge={badge}
                        hideStatus
                        draggable
                      />
                    );
                  })}
                  {col.key === "done" && archivedOrDroppedItems.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="cursor-pointer text-[11px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors flex items-center gap-1.5 px-1 py-1"
                      >
                        <ChevronDown size={12} className={cn("transition-transform", showArchived && "rotate-180")} />
                        {showArchived ? "Hide" : "Show"} {archivedOrDroppedItems.length} archived/dropped
                      </button>
                      {showArchived && archivedOrDroppedItems.map((child) => {
                        const { preview, badge } = getRootCardProps(child);
                        return (
                          <ChildEntityCard
                            key={child.id}
                            id={child.id}
                            title={child.title}
                            icon={child.icon}
                            level={child.level}
                            preview={preview}
                            status={child.status}
                            badge={badge}
                            hideStatus
                            draggable
                          />
                        );
                      })}
                    </>
                  )}
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>
            {activeChild ? (
              <div className="bg-popover rounded-xl shadow-2xl shadow-black/50">
                <ChildEntityCard
                  id={activeChild.id}
                  title={activeChild.title}
                  icon={activeChild.icon}
                  level={activeChild.level}
                  preview={getRootCardProps(activeChild).preview}
                  status={activeChild.status}
                  badge={getRootCardProps(activeChild).badge}
                  hideStatus
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors justify-center"
        >
          <Plus size={14} /> Add Business Outcome
        </button>
      ) : (
        <AddRootEntityForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export function EntityView() {
  const { currentEntityId, updateEntity, deleteEntity, dropEntityCascade } = useAppStore();
  const productLine = useProductLine();
  const { entities } = productLine;
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [confirmDeleteEntity, setConfirmDeleteEntity] = useState(false);
  const [confirmDrop, setConfirmDrop] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [editingTitle]);

  // Reset confirmations when entity changes
  useEffect(() => {
    setConfirmDeleteEntity(false);
    setConfirmDrop(false);
  }, [currentEntityId]);

  if (!currentEntityId) return <RootView />;

  const entity = getEntity(entities, currentEntityId);
  if (!entity) return <RootView />;

  const levelMeta = LEVEL_META[entity.level];
  const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];
  const hasBlocks = entity.blocks.length > 0;

  return (
    <div className="px-8 py-6 pb-28 flex flex-col gap-5">
      <EntityBreadcrumb />

      {/* File-shaped entity detail — collapsible */}
      <div>
        {/* Tab */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 border border-b-0 rounded-t-lg",
          levelMeta.bgTint, levelMeta.borderTint
        )}>
          <span className={cn("text-[10px] font-semibold uppercase tracking-widest", levelMeta.accentColor)}>
            {levelMeta.label}
          </span>
          <StatusPicker status={entity.status} onChange={(s) => {
            if (s === 'dropped' && entity.children.length > 0) {
              setConfirmDrop(true);
            } else {
              updateEntity(entity.id, { status: s });
            }
          }} />
          <CopyAnchorButton text={buildEntityAnchor(entities, productLine.name, entity.id)} />
          {entity.children.length === 0 && (
            confirmDeleteEntity ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => { deleteEntity(entity.id); setConfirmDeleteEntity(false); }}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDeleteEntity(false)}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteEntity(true)}
                title="Delete entity"
                className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )
          )}
        </div>

        {/* Cascade drop warning */}
        {confirmDrop && (
          <div className="inline-flex items-center gap-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-b-lg rounded-tr-lg text-sm">
            <span className="text-red-600 dark:text-red-400 text-xs">
              This will also drop all {entity.children.length} {entity.children.length === 1 ? 'child' : 'children'}. Continue?
            </span>
            <button
              onClick={() => { dropEntityCascade(entity.id); setConfirmDrop(false); }}
              className="cursor-pointer text-[10px] font-medium px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
            >
              Drop all
            </button>
            <button
              onClick={() => setConfirmDrop(false)}
              className="cursor-pointer text-[10px] font-medium px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Body */}
        <div className="rounded-xl rounded-tl-none border border-border-default bg-background flex flex-col">
          {/* Always-visible: toggle header + title + description preview */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(!expanded)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
            className="cursor-pointer text-left w-full p-5 flex flex-col gap-3 group/collapse"
          >
            <div className="flex items-center gap-3">
              {/* Collapse/expand chevron — left side, before icon */}
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="shrink-0 w-5 h-5 rounded flex items-center justify-center bg-surface-2 border border-border-subtle group-hover/collapse:bg-surface-3 group-hover/collapse:border-border-default transition-all"
              >
                <ChevronRight size={12} className="text-muted-foreground/50 group-hover/collapse:text-muted-foreground transition-colors" />
              </motion.div>
              {IconComponent && (
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", levelMeta.iconBg)}>
                  <IconComponent size={16} className={levelMeta.accentColor} />
                </div>
              )}
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { if (titleDraft.trim()) updateEntity(entity.id, { title: titleDraft.trim() }); setEditingTitle(false); }
                    if (e.key === "Escape") setEditingTitle(false);
                  }}
                  onBlur={() => { if (titleDraft.trim()) updateEntity(entity.id, { title: titleDraft.trim() }); setEditingTitle(false); }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xl font-semibold text-foreground flex-1 bg-surface-hover border border-border-strong rounded-lg px-2 py-1 focus:outline-none focus:border-border-focus"
                />
              ) : (
                <h1 className="text-xl font-semibold text-foreground flex-1 flex items-center gap-2">
                  {entity.title}
                  <button
                    onClick={(e) => { e.stopPropagation(); setTitleDraft(entity.title); setEditingTitle(true); }}
                    className="cursor-pointer text-muted-foreground/30 opacity-0 group-hover/collapse:opacity-100 hover:text-muted-foreground transition-all shrink-0"
                    title="Edit title"
                  >
                    <Pencil size={13} />
                  </button>
                </h1>
              )}
              {PERSONA_LEVELS.has(entity.level) && (
                <PersonaPicker entityId={entity.id} personaId={entity.personaId} />
              )}
            </div>

            <p className="text-xs text-muted-foreground/60 italic">
              {levelMeta.description}
            </p>

            {/* Collapsed description preview */}
            {!expanded && entity.description && (
              <div className="relative">
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                  {entity.description}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            )}

            {/* Collapsed hint: block count */}
            {!expanded && hasBlocks && (
              <span className="text-[11px] text-muted-foreground/40">
                {entity.blocks.length} content block{entity.blocks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border-subtle pt-4">
                  <BlockList entity={entity} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Children grid */}
      <ChildrenGrid entity={entity} />
    </div>
  );
}
