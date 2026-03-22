"use client";

import { useState, useMemo } from "react";
import { Plus, Check, X, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, Line, ReferenceLine,
  Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { MetricBlock, MetricDataPoint, MetricFrequency, EntityLevel } from "../lib/schemas";
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

function MetricChart({ dataSeries, target, entityLevel, endDate, frequency, height = 110 }: {
  dataSeries: MetricDataPoint[];
  target?: number;
  entityLevel?: EntityLevel;
  endDate?: string;
  frequency?: MetricFrequency;
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

  // Build chart data with optional target projection
  const lastPoint = dataSeries[dataSeries.length - 1];
  const hasProjection = target !== undefined && endDate && endDate > lastPoint.date;

  // Merge actual data + projection point into one dataset
  // "value" = actual data, "projection" = dashed line from last point to target
  const chartData = dataSeries.map((dp) => ({
    date: dp.date,
    value: dp.value,
    projection: dp.date === lastPoint.date ? dp.value : undefined as number | undefined,
  }));

  // Insert today marker point if it falls within the chart date range
  const todayIso = new Date().toISOString().slice(0, 10);
  const chartEndDate = hasProjection ? endDate : lastPoint.date;
  if (todayIso >= dataSeries[0].date && todayIso <= chartEndDate && !chartData.find(d => d.date === todayIso)) {
    let todayValue: number | undefined = undefined;
    let todayProjection: number | undefined = undefined;

    if (todayIso <= lastPoint.date) {
      // Today is within the actual data range — interpolate value so the line stays continuous
      // Find the two surrounding data points
      let before = dataSeries[0];
      let after = dataSeries[dataSeries.length - 1];
      for (let i = 0; i < dataSeries.length - 1; i++) {
        if (dataSeries[i].date <= todayIso && dataSeries[i + 1].date >= todayIso) {
          before = dataSeries[i];
          after = dataSeries[i + 1];
          break;
        }
      }
      const t0 = new Date(before.date).getTime();
      const t1 = new Date(after.date).getTime();
      const tNow = new Date(todayIso).getTime();
      const ratio = t1 > t0 ? (tNow - t0) / (t1 - t0) : 0;
      todayValue = before.value + ratio * (after.value - before.value);
    } else if (hasProjection && todayIso > lastPoint.date && todayIso < endDate) {
      // Today is within the projection segment — interpolate projection value
      const projStart = new Date(lastPoint.date).getTime();
      const projEnd = new Date(endDate).getTime();
      const todayTime = new Date(todayIso).getTime();
      const t = (todayTime - projStart) / (projEnd - projStart);
      todayProjection = lastPoint.value + t * (target! - lastPoint.value);
    }

    chartData.push({
      date: todayIso,
      value: (todayValue ?? undefined) as unknown as number,
      projection: todayProjection,
    });
  }

  if (hasProjection) {
    chartData.push({
      date: endDate,
      value: undefined as unknown as number,
      projection: target,
    });
  }

  // Sort by date to ensure correct order
  chartData.sort((a, b) => a.date.localeCompare(b.date));

  // Y domain needs to include the target if projection exists
  const allValues = dataSeries.map((dp) => dp.value);
  if (target !== undefined) allValues.push(target);
  const yMin = Math.min(...allValues) - 1;
  const yMax = Math.max(...allValues) + 1;

  // Today marker — use actual today so it shows at the right position on the timeline
  const todayStr = new Date().toISOString().slice(0, 10);
  const firstDate = chartData[0].date;
  const lastDate = chartData[chartData.length - 1].date;
  const showToday = todayStr >= firstDate && todayStr <= lastDate;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.fill} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color.fill} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
        <XAxis dataKey="date" hide />
        <YAxis hide domain={[yMin, yMax]} />
        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: color.stroke, strokeOpacity: 0.2 }} />
        {target !== undefined && (
          <ReferenceLine
            y={target}
            stroke="#888"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: `Target: ${target}`, position: "insideBottomRight", fontSize: 9, fill: "#888" }}
          />
        )}
        {showToday && (
          <ReferenceLine
            x={todayStr}
            stroke={color.stroke}
            strokeOpacity={0.35}
            strokeWidth={1}
            label={{ value: "Today", position: "insideTopLeft", fontSize: 9, fill: color.stroke, opacity: 0.5 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color.stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={(props: Record<string, unknown>) => {
            const { cx, cy, index } = props as { cx: number; cy: number; index: number };
            if (!cx || !cy) return <g key={`dot-${index}`} />;
            // Hide dot for interpolated today point — it's not a real data point
            const point = chartData[index];
            if (point && point.date === todayIso && !dataSeries.find(dp => dp.date === todayIso)) {
              return <g key={`dot-${index}`} />;
            }
            return <circle key={`dot-${index}`} cx={cx} cy={cy} r={2.5} fill={color.stroke} strokeWidth={0} />;
          }}
          activeDot={{ r: 4, fill: color.stroke, strokeWidth: 2, stroke: "var(--surface-2)" }}
          connectNulls
        />
        {hasProjection && (
          <Line
            type="monotone"
            dataKey="projection"
            stroke={color.stroke}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            strokeOpacity={0.25}
            dot={(props: Record<string, unknown>) => {
              const { cx, cy, index } = props as { cx: number; cy: number; index: number };
              if (!cx || !cy) return <g key={`proj-${index}`} />;
              // Place "Projection" label at the true visual midpoint of the dashed line
              const projPoints = chartData
                .map((d, i) => d.projection !== undefined ? { i, cx: 0 } : null)
                .filter((p): p is { i: number; cx: number } => p !== null);
              if (projPoints.length >= 2) {
                const firstIdx = projPoints[0].i;
                const lastIdx = projPoints[projPoints.length - 1].i;
                // Pick the projection point closest to the visual center
                const centerIdx = (firstIdx + lastIdx) / 2;
                let closestProjIdx = projPoints[0].i;
                let closestDist = Math.abs(projPoints[0].i - centerIdx);
                for (const p of projPoints) {
                  const dist = Math.abs(p.i - centerIdx);
                  if (dist < closestDist) {
                    closestDist = dist;
                    closestProjIdx = p.i;
                  }
                }
                if (index === closestProjIdx) {
                  return (
                    <text key={`proj-${index}`} x={cx} y={cy - 6} textAnchor="middle" fontSize={8} fill={color.stroke} fillOpacity={0.45}>
                      Projection
                    </text>
                  );
                }
              }
              return <g key={`proj-${index}`} />;
            }}
            activeDot={false}
            connectNulls
          />
        )}
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
  const pct = prev !== 0 ? Math.round(Math.abs(diff / prev) * 100) : null;
  const pctLabel = pct !== null ? `${pct}%` : "";
  if (diff > 0) return (
    <span className="inline-flex items-center gap-0.5 text-emerald-500 dark:text-emerald-400">
      <TrendingUp size={14} />
      {pctLabel && <span className="text-[10px] font-medium">+{pctLabel}</span>}
    </span>
  );
  if (diff < 0) return (
    <span className="inline-flex items-center gap-0.5 text-rose-500 dark:text-rose-400">
      <TrendingDown size={14} />
      {pctLabel && <span className="text-[10px] font-medium">-{pctLabel}</span>}
    </span>
  );
  return <span className="text-[10px] text-muted-foreground/40 font-medium">no change</span>;
}

// ── Period label helpers ──────────────────────────────────────────────

function formatPeriodTrigger(dateStr: string, frequency: MetricFrequency): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.toLocaleString("en", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();
  if (frequency === "monthly") return `${month} ${year}`;
  if (frequency === "weekly") return `Week of ${month} ${day}`;
  return `${month} ${day}, ${year}`;
}

function formatPeriodHint(dateStr: string, frequency: MetricFrequency): string {
  const d = new Date(dateStr + "T00:00:00");
  if (frequency === "monthly") {
    const monthFull = d.toLocaleString("en", { month: "long", year: "numeric" });
    return `Recording for ${monthFull}`;
  }
  if (frequency === "weekly") {
    const endOfWeek = new Date(d);
    endOfWeek.setDate(d.getDate() + 6);
    const startLabel = d.toLocaleString("en", { month: "short", day: "numeric" });
    const endLabel = endOfWeek.toLocaleString("en", { month: "short", day: "numeric" });
    return `Recording for ${startLabel} – ${endLabel}`;
  }
  return `Recording for ${d.toLocaleString("en", { month: "short", day: "numeric", year: "numeric" })}`;
}

const CALENDAR_HEADER: Record<MetricFrequency, string> = {
  daily: "Select a day",
  weekly: "Select any day to pick its week",
  monthly: "Select any day to pick its month",
};

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
    // Snap to period start — user clicks any day, we map to period boundary
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
        {/* Input row */}
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
  const startingValue = block.initialValue ?? 0;
  const currentValue = series.length > 0 ? series[series.length - 1].value : startingValue;
  const target = block.numericTarget;
  const lastRecordedDate = series.length > 0 ? series[series.length - 1].date : undefined;

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleString("en", { month: "short", day: "numeric" });
  };

  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-border-default">
      {/* Header: metric name + frequency badge — full width */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{block.metric}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground/60 font-medium">
          {METRIC_FREQUENCY_LABELS[block.frequency!]}
        </span>
      </div>

      {/* Side-by-side: summary left, chart right */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left: metric summary panel */}
        <div className="md:w-[35%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle px-4 py-3">
          {/* Current | vertical divider | Start & Target */}
          <div className="flex items-center gap-4">
            {/* Current — hero, big */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-5xl font-bold text-foreground leading-none">{currentValue}</span>
                <TrendIndicator dataSeries={series} />
              </div>
              <span className="text-[10px] text-muted-foreground/50 mt-1">Current{lastRecordedDate ? ` · ${formatShortDate(lastRecordedDate)}` : ""}</span>
            </div>

            {/* Vertical divider */}
            <div className="w-px self-stretch bg-border-subtle" />

            {/* Starting → Target horizontal */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground/35 leading-none">{startingValue}</span>
                <span className="text-[9px] text-muted-foreground/40 mt-0.5">Start{block.startDate ? ` · ${formatShortDate(block.startDate)}` : ""}</span>
              </div>
              <span className="text-muted-foreground/30 text-sm">→</span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground/35 leading-none">{target ?? block.targetValue}</span>
                <span className="text-[9px] text-muted-foreground/40 mt-0.5">Target{block.endDate ? ` · ${formatShortDate(block.endDate)}` : ""}</span>
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

        {/* Right: Recharts area chart */}
        <div className="md:w-[65%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle p-1.5">
          <MetricChart dataSeries={series} target={target} entityLevel={entityLevel} endDate={block.endDate} frequency={block.frequency} />
        </div>
      </div>
    </div>
  );
}
