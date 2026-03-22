"use client";

import { useState, useMemo } from "react";
import { Plus, Check, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MetricBlock, MetricDataPoint, MetricFrequency, EntityLevel } from "../lib/schemas";
import { METRIC_FREQUENCY_LABELS, getPeriodDate } from "../lib/schemas";
import { useAppStore } from "../lib/store";

// ── Sparkline ──────────────────────────────────────────────────────────

function MetricSparkline({ dataSeries, target, height = 40 }: {
  dataSeries: MetricDataPoint[];
  target?: number;
  height?: number;
}) {
  if (dataSeries.length === 0) return null;

  const vw = 200;
  const vh = height;
  const pad = 4;

  const values = dataSeries.map((dp) => dp.value);
  const allValues = target !== undefined ? [...values, target] : values;
  let min = Math.min(...allValues);
  let max = Math.max(...allValues);
  if (max === min) { min -= 1; max += 1; }

  const yScale = (v: number) => vh - pad - ((v - min) / (max - min)) * (vh - pad * 2);

  if (dataSeries.length === 1) {
    const cx = vw / 2;
    const cy = yScale(values[0]);
    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {target !== undefined && (
          <line x1={0} y1={yScale(target)} x2={vw} y2={yScale(target)}
            stroke="currentColor" className="text-muted-foreground/30" strokeDasharray="4 3" strokeWidth={1} />
        )}
        <circle cx={cx} cy={cy} r={3} fill="currentColor" className="text-foreground/50" />
      </svg>
    );
  }

  const points = dataSeries.map((dp, i) => {
    const x = (i / (dataSeries.length - 1)) * (vw - pad * 2) + pad;
    const y = yScale(dp.value);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {target !== undefined && (
        <line x1={0} y1={yScale(target)} x2={vw} y2={yScale(target)}
          stroke="currentColor" className="text-muted-foreground/30" strokeDasharray="4 3" strokeWidth={1} />
      )}
      <polyline points={points} fill="none" stroke="currentColor" className="text-foreground/40" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {dataSeries.map((dp, i) => {
        const x = (i / (dataSeries.length - 1)) * (vw - pad * 2) + pad;
        const y = yScale(dp.value);
        return <circle key={dp.date} cx={x} cy={y} r={2} fill="currentColor" className="text-foreground/50" />;
      })}
    </svg>
  );
}

// ── Trend indicator ────────────────────────────────────────────────────

function TrendIndicator({ dataSeries, target }: { dataSeries: MetricDataPoint[]; target?: number }) {
  if (dataSeries.length < 2) return null;
  const latest = dataSeries[dataSeries.length - 1].value;
  const prev = dataSeries[dataSeries.length - 2].value;
  const diff = latest - prev;
  if (diff > 0) return <TrendingUp size={14} className="text-emerald-500 dark:text-emerald-400" />;
  if (diff < 0) return <TrendingDown size={14} className="text-rose-500 dark:text-rose-400" />;
  return <Minus size={14} className="text-muted-foreground/50" />;
}

// ── Record Value Form ──────────────────────────────────────────────────

function RecordValueForm({ block, entityId, onClose }: {
  block: MetricBlock;
  entityId: string;
  onClose: () => void;
}) {
  const frequency = block.frequency!;
  const defaultDate = getPeriodDate(new Date(), frequency);
  const [date, setDate] = useState(defaultDate);
  const [valueStr, setValueStr] = useState(() => {
    const existing = block.dataSeries?.find((dp) => dp.date === defaultDate);
    return existing ? String(existing.value) : "";
  });

  const recordMetricValue = useAppStore((s) => s.recordMetricValue);

  // When date changes, pre-fill existing value if present
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = block.dataSeries?.find((dp) => dp.date === newDate);
    setValueStr(existing ? String(existing.value) : "");
  };

  const handleSave = () => {
    const num = parseFloat(valueStr);
    if (isNaN(num)) return;
    recordMetricValue(entityId, block.id, date, num);
    onClose();
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden"
    >
      <div className="flex items-end gap-2 pt-3 border-t border-border-subtle mt-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">Period</label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-surface-1 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">Value</label>
          <input
            type="number"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            placeholder="0"
            className="bg-surface-1 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors"
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onClose(); }}
            autoFocus
          />
        </div>
        <button onClick={handleSave} className="cursor-pointer text-xs px-2.5 py-1.5 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1">
          <Check size={12} /> Save
        </button>
        <button onClick={onClose} className="cursor-pointer text-xs px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// ── MetricCard ─────────────────────────────────────────────────────────

export function MetricCard({ block, entityLevel, entityId }: {
  block: MetricBlock;
  entityLevel?: EntityLevel;
  entityId?: string;
}) {
  const [recording, setRecording] = useState(false);
  const isStructured = block.frequency !== undefined;

  // Legacy display — unchanged from original
  if (!isStructured) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border-default">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{block.metric}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground/60">{block.currentValue}</span>
            <span className="text-muted-foreground/40">&rarr;</span>
            <span className="text-lg font-semibold text-foreground">{block.targetValue}</span>
          </div>
          {block.timeframe && <span className="text-[11px] text-muted-foreground/40">{block.timeframe}</span>}
        </div>
      </div>
    );
  }

  // Structured display
  const series = block.dataSeries ?? [];
  const latestValue = series.length > 0 ? series[series.length - 1].value : block.initialValue ?? 0;
  const target = block.numericTarget;

  const dateRange = block.startDate && block.endDate
    ? `${block.startDate} – ${block.endDate}`
    : block.startDate ? `From ${block.startDate}` : block.timeframe;

  return (
    <div className="p-4 rounded-xl bg-surface-2 border border-border-default">
      {/* Header: metric name + frequency badge */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{block.metric}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground/60 font-medium">
          {METRIC_FREQUENCY_LABELS[block.frequency!]}
        </span>
      </div>

      {/* Values row */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-foreground/60">{latestValue}</span>
        <TrendIndicator dataSeries={series} target={target} />
        <span className="text-muted-foreground/40">&rarr;</span>
        <span className="text-lg font-semibold text-foreground">{target ?? block.targetValue}</span>
      </div>

      {/* Date range */}
      {dateRange && <span className="text-[11px] text-muted-foreground/40">{dateRange}</span>}

      {/* Sparkline */}
      {series.length > 0 && (
        <div className="mt-3">
          <MetricSparkline dataSeries={series} target={target} />
        </div>
      )}

      {/* Record Value button / form */}
      {entityId && (
        <>
          <AnimatePresence initial={false}>
            {recording && (
              <RecordValueForm block={block} entityId={entityId} onClose={() => setRecording(false)} />
            )}
          </AnimatePresence>
          {!recording && (
            <button
              onClick={() => setRecording(true)}
              className="cursor-pointer mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-1.5 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors w-full justify-center"
            >
              <Plus size={14} /> Record Value
            </button>
          )}
        </>
      )}
    </div>
  );
}
