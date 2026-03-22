"use client";

import { useState, useRef, useCallback } from "react";
import { useClickOutside } from "@/app/lib/hooks/useClickOutside";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Entity, Block, AccordionBlock, PillsBlock, QuoteBlock, MetricBlock, EntityLevel, MetricFrequency, MetricValueFormat } from "@/app/lib/schemas";
import { METRIC_VALUE_FORMAT_LABELS } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { MarkdownBlock, MarkdownToolbar } from "./MarkdownToolbar";
import { AccordionSection } from "./AccordionSection";
import { MetricCard } from "./MetricCard";
import { Pills } from "./Pills";
import { EditableText } from "./EditableText";

// ── Block toolbar ─────────────────────────────────────────────────────────

export function BlockToolbar({ onEdit, onDelete, canDelete = true }: { onEdit: () => void; onDelete: () => void; canDelete?: boolean }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="absolute top-1 right-1 opacity-0 group-hover/block:opacity-100 transition-opacity flex gap-1">
      <button onClick={onEdit} className="cursor-pointer p-1.5 rounded-md bg-surface-hover hover:bg-surface-3 text-muted-foreground/60 hover:text-foreground transition-colors">
        <Pencil size={12} />
      </button>
      {canDelete && (
        confirmDelete ? (
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
        )
      )}
    </div>
  );
}

// ── Block editors ─────────────────────────────────────────────────────────

export function AccordionBlockEditor({ block, onSave, onCancel, labelMaxLength, contentMaxLength }: { block: AccordionBlock; onSave: (b: Partial<AccordionBlock>) => void; onCancel: () => void; labelMaxLength?: number; contentMaxLength?: number }) {
  const [label, setLabel] = useState(block.label);
  const [content, setContent] = useState(block.content);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <div className="flex flex-col gap-0.5">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Section title"
          {...(labelMaxLength ? { maxLength: labelMaxLength } : {})}
          className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus font-semibold" />
        {labelMaxLength && (
          <div className={cn("text-right text-[10px]",
            label.length >= labelMaxLength        ? "text-red-500 dark:text-red-400" :
            label.length >= labelMaxLength * 0.85 ? "text-amber-500 dark:text-amber-400" :
            "text-muted-foreground/40"
          )}>
            {label.length}/{labelMaxLength}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <MarkdownToolbar textareaRef={contentRef} draft={content} setDraft={setContent} showPreview={showPreview} setShowPreview={setShowPreview} />
        {showPreview ? (
          <div className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 min-h-[144px]">
            {content ? <MarkdownBlock content={content} /> : <span className="text-muted-foreground/40 italic text-sm">Nothing to preview</span>}
          </div>
        ) : (
          <textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content (markdown)"
            {...(contentMaxLength ? { maxLength: contentMaxLength } : {})}
            className="w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus font-mono" />
        )}
        {contentMaxLength && (
          <div className={cn("text-right text-[10px]",
            content.length >= contentMaxLength        ? "text-red-500 dark:text-red-400" :
            content.length >= contentMaxLength * 0.85 ? "text-amber-500 dark:text-amber-400" :
            "text-muted-foreground/40"
          )}>
            {content.length}/{contentMaxLength}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ label, content })} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

export function PillsBlockEditor({ block, onSave, onCancel }: { block: PillsBlock; onSave: (b: Partial<PillsBlock>) => void; onCancel: () => void }) {
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

export function QuoteBlockEditor({ block, onSave, onCancel }: { block: QuoteBlock; onSave: (b: Partial<QuoteBlock>) => void; onCancel: () => void }) {
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

export function MetricBlockEditor({ block, onSave, onCancel, entityLevel }: { block: MetricBlock; onSave: (b: Partial<MetricBlock>) => void; onCancel: () => void; entityLevel?: EntityLevel }) {
  const [metric, setMetric] = useState(block.metric);
  const [currentValue, setCurrentValue] = useState(block.currentValue);
  const [targetValue, setTargetValue] = useState(block.targetValue);
  const [timeframe, setTimeframe] = useState(block.timeframe || "");
  // Structured fields
  const isOutcome = entityLevel === "business_outcome" || entityLevel === "product_outcome";
  const [frequency, setFrequency] = useState<MetricFrequency | "">(block.frequency ?? (isOutcome ? "weekly" : ""));
  const [valueFormat, setValueFormat] = useState<MetricValueFormat>(block.valueFormat ?? "number");
  const [initialValue, setInitialValue] = useState(block.initialValue !== undefined ? String(block.initialValue) : "");
  const [numericTarget, setNumericTarget] = useState(block.numericTarget !== undefined ? String(block.numericTarget) : "");
  const [startDate, setStartDate] = useState(block.startDate ?? "");
  const [endDate, setEndDate] = useState(block.endDate ?? "");

  const inputCls = "bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors";

  const handleSave = () => {
    const base: Partial<MetricBlock> = { metric };
    if (isOutcome) {
      // BO/PO always save structured fields
      base.frequency = (frequency || "weekly") as MetricFrequency;
      base.valueFormat = valueFormat;
      base.initialValue = initialValue ? parseFloat(initialValue) : undefined;
      base.numericTarget = numericTarget ? parseFloat(numericTarget) : undefined;
      base.startDate = startDate || undefined;
      base.endDate = endDate || undefined;
      // Keep legacy fields for data compatibility but they're not shown
      base.currentValue = currentValue;
      base.targetValue = targetValue;
    } else {
      base.currentValue = currentValue;
      base.targetValue = targetValue;
      base.timeframe = timeframe || undefined;
    }
    onSave(base);
  };

  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <input value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Metric name" className={inputCls} />

      {/* Legacy fields — only for non-outcome levels */}
      {!isOutcome && (
        <>
          <div className="flex gap-2">
            <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Current" className={cn(inputCls, "flex-1")} />
            <input value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="Target" className={cn(inputCls, "flex-1")} />
          </div>
          <input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="Timeframe (optional)" className={cn(inputCls, "text-xs")} />
        </>
      )}

      {/* Structured tracking — always shown for outcomes, no "No tracking" option */}
      {isOutcome && (
        <>
          <div className="border-t border-border-subtle pt-3 mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Structured Tracking</span>
          </div>
          <div className="flex gap-2">
            <select value={valueFormat} onChange={(e) => setValueFormat(e.target.value as MetricValueFormat)} className={cn(inputCls, "flex-1 text-xs")}>
              {Object.entries(METRIC_VALUE_FORMAT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select value={frequency || "weekly"} onChange={(e) => setFrequency(e.target.value as MetricFrequency)} className={cn(inputCls, "flex-1 text-xs")}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="number" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="Initial value" className={cn(inputCls, "flex-1 text-xs")} />
            <input type="number" value={numericTarget} onChange={(e) => setNumericTarget(e.target.value)} placeholder="Numeric target" className={cn(inputCls, "flex-1 text-xs")} />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground/50">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={cn(inputCls, "text-xs")} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground/50">End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={cn(inputCls, "text-xs")} />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button onClick={handleSave} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
      </div>
    </div>
  );
}

// ── Block renderer ────────────────────────────────────────────────────────

export function BlockRenderer({ block, entityId, entityLevel }: { block: Block; entityId: string; entityLevel?: EntityLevel }) {
  const [editing, setEditing] = useState(false);
  const { updateBlock, removeBlock, recordMetricValue } = useAppStore();

  const handleSave = (updates: Partial<Block>) => {
    updateBlock(entityId, block.id, updates);

    // Auto-seed: when structured tracking is first enabled, seed the start date with initial value
    if (
      block.type === "metric" &&
      "frequency" in updates && updates.frequency &&
      "startDate" in updates && updates.startDate &&
      "initialValue" in updates && updates.initialValue !== undefined
    ) {
      const currentSeries = (block as MetricBlock).dataSeries ?? [];
      if (currentSeries.length === 0) {
        recordMetricValue(entityId, block.id, updates.startDate as string, updates.initialValue as number);
      }
    }

    setEditing(false);
  };
  const handleDelete = () => removeBlock(entityId, block.id);

  if (editing) {
    switch (block.type) {
      case "accordion": return <AccordionBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} labelMaxLength={40} contentMaxLength={3000} />;
      case "pills": return <PillsBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
      case "quote": return <QuoteBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} />;
      case "metric": return <MetricBlockEditor block={block} onSave={handleSave} onCancel={() => setEditing(false)} entityLevel={entityLevel} />;
    }
  }

  const isOutcome = entityLevel === "business_outcome" || entityLevel === "product_outcome";
  const canDelete = !(block.type === "metric" && isOutcome);

  return (
    <div className="relative group/block">
      <BlockToolbar onEdit={() => setEditing(true)} onDelete={handleDelete} canDelete={canDelete} />
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
        <MetricCard block={block} entityLevel={entityLevel} entityId={entityId} />
      )}
    </div>
  );
}

// ── Add Block dropdown ────────────────────────────────────────────────────

export function AddBlockButton({ entityId }: { entityId: string }) {
  const [open, setOpen] = useState(false);
  const { addBlock } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback(() => setOpen(false), []);
  useClickOutside(ref, handleClickOutside, open);

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
        <div className="absolute left-0 right-0 bottom-full mb-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden">
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

// ── Block list ────────────────────────────────────────────────────────────

export function BlockList({ entity }: { entity: Entity }) {
  const { updateEntity } = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[length:var(--text-body)] text-foreground/80 leading-[var(--text-body-leading)]">
        <EditableText
          value={entity.description}
          onSave={(v) => updateEntity(entity.id, { description: v })}
          as="textarea"
          placeholder="Add a description..."
          maxLength={800}
        />
      </div>
      {entity.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} entityId={entity.id} entityLevel={entity.level} />
      ))}
      <AddBlockButton entityId={entity.id} />
    </div>
  );
}
