"use client";

import { useState, useMemo } from "react";
import { Plus, Check, X, TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, ReferenceLine,
  Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { MetricBlock, MetricDataPoint, EntityLevel } from "../lib/schemas";
import { METRIC_FREQUENCY_LABELS, getPeriodDate } from "../lib/schemas";
import { useAppStore } from "../lib/store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// ── Chart colors per entity level ──────────────────────────────────────

const CHART_COLORS: Partial<Record<EntityLevel, { stroke: string; fill: string }>> = {
  business_outcome: { stroke: "#3b82f6", fill: "#3b82f6" },
  product_outcome:  { stroke: "#8b5cf6", fill: "#8b5cf6" },
};
const DEFAULT_CHART_COLOR = { stroke: "#3b82f6", fill: "#3b82f6" };

function getChartColor(entityLevel?: EntityLevel) {
  return (entityLevel && CHART_COLORS[entityLevel]) || DEFAULT_CHART_COLOR;
}

// ── Custom tooltip ─────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border-default rounded-lg shadow-md px-2.5 py-1.5 text-xs">
      <div className="text-muted-foreground/60">{label}</div>
      <div className="font-semibold text-foreground">{payload[0].value}</div>
    </div>
  );
}

// ── Recharts area chart ────────────────────────────────────────────────

function MetricChart({ dataSeries, target, entityLevel, height = 120 }: {
  dataSeries: MetricDataPoint[];
  target?: number;
  entityLevel?: EntityLevel;
  height?: number;
}) {
  const color = getChartColor(entityLevel);
  const gradientId = `metricGrad-${entityLevel || "default"}`;

  if (dataSeries.length === 0 && target === undefined) return null;

  // For empty data with only a target, show a minimal placeholder
  if (dataSeries.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-surface-1 border border-border-subtle" style={{ height }}>
        <span className="text-[10px] text-muted-foreground/40">No data yet</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={dataSeries} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.fill} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color.fill} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
        <XAxis dataKey="date" hide />
        <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: color.stroke, strokeOpacity: 0.2 }} />
        {target !== undefined && (
          <ReferenceLine
            y={target}
            stroke="#888"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: `Target: ${target}`, position: "insideTopRight", fontSize: 10, fill: "#888" }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color.stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 3, fill: color.stroke, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: color.stroke, strokeWidth: 2, stroke: "var(--surface-2)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Trend indicator ────────────────────────────────────────────────────

function TrendIndicator({ dataSeries }: { dataSeries: MetricDataPoint[] }) {
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [valueStr, setValueStr] = useState(() => {
    const existing = block.dataSeries?.find((dp) => dp.date === defaultDate);
    return existing ? String(existing.value) : "";
  });

  const recordMetricValue = useAppStore((s) => s.recordMetricValue);
  const recordedDates = useMemo(() => new Set((block.dataSeries ?? []).map((dp) => dp.date)), [block.dataSeries]);

  // Convert recorded date strings to Date objects for the calendar modifier
  const recordedDateObjects = useMemo(
    () => (block.dataSeries ?? []).map((dp) => new Date(dp.date + "T00:00:00")),
    [block.dataSeries]
  );

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = block.dataSeries?.find((dp) => dp.date === newDate);
    setValueStr(existing ? String(existing.value) : "");
  };

  const handleCalendarSelect = (day: Date | undefined) => {
    if (!day) return;
    const snapped = getPeriodDate(day, frequency);
    handleDateChange(snapped);
    setCalendarOpen(false);
  };

  const handleSave = () => {
    const num = parseFloat(valueStr);
    if (isNaN(num)) return;
    recordMetricValue(entityId, block.id, date, num);
    onClose();
  };

  // Format the selected date for the trigger button
  const formattedDate = (() => {
    const d = new Date(date + "T00:00:00");
    const month = d.toLocaleString("en", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    if (frequency === "monthly") return `${month} ${year}`;
    return `${month} ${day}, ${year}`;
  })();

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-3 border-t border-border-subtle mt-3 flex flex-col gap-2">
        {/* Input row */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">Period</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="cursor-pointer bg-surface-1 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors text-left flex items-center gap-2">
                  <CalendarDays size={14} className="text-muted-foreground/50 shrink-0" />
                  {formattedDate}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(date + "T00:00:00")}
                  onSelect={handleCalendarSelect}
                  defaultMonth={new Date(date + "T00:00:00")}
                  modifiers={{ recorded: recordedDateObjects }}
                  modifiersClassNames={{ recorded: "metric-calendar-recorded" }}
                />
              </PopoverContent>
            </Popover>
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

  // Structured display — side-by-side layout
  const series = block.dataSeries ?? [];
  const latestValue = series.length > 0 ? series[series.length - 1].value : block.initialValue ?? 0;
  const target = block.numericTarget;

  const dateRange = block.startDate && block.endDate
    ? `${block.startDate} – ${block.endDate}`
    : block.startDate ? `From ${block.startDate}` : block.timeframe;

  return (
    <div className="p-4 rounded-xl bg-surface-2 border border-border-default">
      {/* Header: metric name + frequency badge — full width */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{block.metric}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground/60 font-medium">
          {METRIC_FREQUENCY_LABELS[block.frequency!]}
        </span>
      </div>

      {/* Side-by-side: summary left, chart right */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: metric summary */}
        <div className="md:w-[35%] min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{latestValue}</span>
            <TrendIndicator dataSeries={series} />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground/50">Target</span>
            <span className="text-xs font-medium text-foreground/70">{target ?? block.targetValue}</span>
          </div>
          {dateRange && <span className="text-[11px] text-muted-foreground/40 mt-1">{dateRange}</span>}

          {/* Record Value — subtle inline button */}
          {entityId && (
            <div className="mt-auto pt-2">
              <AnimatePresence initial={false}>
                {recording && (
                  <RecordValueForm block={block} entityId={entityId} onClose={() => setRecording(false)} />
                )}
              </AnimatePresence>
              {!recording && (
                <button
                  onClick={() => setRecording(true)}
                  className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors mt-1"
                >
                  <Plus size={12} /> Record
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Recharts area chart — visually separated */}
        <div className="md:w-[65%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle p-2">
          <MetricChart dataSeries={series} target={target} entityLevel={entityLevel} />
        </div>
      </div>
    </div>
  );
}
