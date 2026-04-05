"use client";

import { useState, useMemo } from "react";
import { Plus, Check, X, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MetricBlock, MetricFrequency, EntityLevel } from "../lib/schemas";
import { METRIC_FREQUENCY_LABELS, getPeriodDate, formatMetricValue, formatPeriodTrigger, formatPeriodHint, CALENDAR_HEADER } from "../lib/schemas";
import { useAppStore } from "../lib/store";
import { useProductLine } from "../lib/hooks/useProductLine";
import { selectDoneSolutionsForProductOutcome } from "../lib/selectors";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MetricChart, DEFAULT_CHART_COLOR, type ChartColorConfig } from "@/components/ui/metric-chart";
import { TrendIndicator } from "@/components/ui/trend-indicator";

// ── Chart color mapping (app-specific: EntityLevel → color) ────────────

const CHART_COLORS: Partial<Record<EntityLevel, ChartColorConfig>> = {
  business_outcome: { stroke: "#3b82f6", fill: "#3b82f6" },
  product_outcome:  { stroke: "#8b5cf6", fill: "#8b5cf6" },
};

function getChartColor(entityLevel?: EntityLevel): ChartColorConfig {
  return (entityLevel && CHART_COLORS[entityLevel]) || DEFAULT_CHART_COLOR;
}

// formatPeriodTrigger, formatPeriodHint, CALENDAR_HEADER — imported from schemas.ts

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
    handleDateChange(getPeriodDate(day, frequency));
    setCalendarOpen(false);
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
      <div className="pt-3 border-t border-border-subtle mt-3 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">Period</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="cursor-pointer bg-surface-2 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors text-left flex items-center gap-2">
                  <CalendarDays size={14} className="text-muted-foreground/50 shrink-0" />
                  {formatPeriodTrigger(date, frequency)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="px-3 pt-3 pb-1">
                  <span className="text-[11px] text-muted-foreground/60 font-medium">{CALENDAR_HEADER[frequency]}</span>
                </div>
                <Calendar
                  mode="single"
                  selected={new Date(date + "T00:00:00")}
                  onSelect={handleCalendarSelect}
                  defaultMonth={new Date(date + "T00:00:00")}
                  disabled={{ after: new Date() }}
                  modifiers={{ recorded: recordedDateObjects }}
                  modifiersClassNames={{ recorded: "metric-calendar-recorded" }}
                />
                <div className="px-3 pb-3 pt-1 border-t border-border-subtle">
                  <span className="text-[10px] text-muted-foreground/50">{formatPeriodHint(date, frequency)}</span>
                </div>
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
              className="bg-surface-2 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors"
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

  // Hooks must be called unconditionally (before any early return)
  const productLine = useProductLine();
  const solutionMarkers = useMemo(() => {
    if (entityLevel !== "product_outcome" || !entityId) return undefined;
    return selectDoneSolutionsForProductOutcome(productLine.entities, entityId);
  }, [entityLevel, entityId, productLine.entities]);

  // Legacy display
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
  const startingValue = block.initialValue ?? 0;
  const currentValue = series.length > 0 ? series[series.length - 1].value : startingValue;
  const target = block.numericTarget;
  const lastRecordedDate = series.length > 0 ? series[series.length - 1].date : undefined;
  const color = getChartColor(entityLevel);
  const fmt = (v: number) => formatMetricValue(v, block.valueFormat);

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleString("en", { month: "short", day: "numeric" });
  };

  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-border-default">
      {/* Header: metric name + frequency badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{block.metric}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground/60 font-medium">
          {METRIC_FREQUENCY_LABELS[block.frequency!]}
        </span>
      </div>

      {/* Side-by-side: summary left, chart right */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left: metric summary panel */}
        <div className="lg:w-[35%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle px-4 py-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Current — hero */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-4xl lg:text-5xl font-bold text-foreground leading-none">{fmt(currentValue)}</span>
                <TrendIndicator dataSeries={series} />
              </div>
              <span className="text-[10px] text-muted-foreground/60 mt-1">
                Current{lastRecordedDate ? ` · ${formatShortDate(lastRecordedDate)}` : ""}
              </span>
            </div>

            {/* Vertical divider */}
            <div className="w-px self-stretch bg-border-subtle" />

            {/* Start → Target */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground/35 leading-none">{fmt(startingValue)}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Start{block.startDate ? ` · ${formatShortDate(block.startDate)}` : ""}
                </span>
              </div>
              <span className="text-muted-foreground/30 text-sm">→</span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground/35 leading-none">{target !== undefined ? fmt(target) : block.targetValue}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Target{block.endDate ? ` · ${formatShortDate(block.endDate)}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Record Value — expands dynamically */}
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
                  className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors pt-2.5"
                >
                  <Plus size={12} /> Record
                </button>
              )}
            </>
          )}
        </div>

        {/* Right: chart */}
        <div className="lg:w-[65%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle p-1.5">
          <MetricChart
            dataSeries={series}
            target={target}
            endDate={block.endDate}
            color={color}
            formatValue={fmt}
            solutionMarkers={solutionMarkers}
          />
        </div>
      </div>
    </div>
  );
}
