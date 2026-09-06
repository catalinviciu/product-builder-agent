"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { Metric, EntityLevel } from "../lib/schemas";
import { METRIC_FREQUENCY_LABELS, formatMetricValue } from "../lib/schemas";
import { useProductLine } from "../lib/hooks/useProductLine";
import { selectDoneSolutionsForProductOutcome } from "../lib/selectors";
import { MetricChart, DEFAULT_CHART_COLOR, type ChartColorConfig } from "@/components/ui/metric-chart";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { MetricRecordForm } from "./MetricRecordForm";
import { MetricSettingsForm } from "./MetricSettingsForm";

// ── Chart color mapping (app-specific: EntityLevel → color) ────────────

const CHART_COLORS: Partial<Record<EntityLevel, ChartColorConfig>> = {
  business_outcome: { stroke: "#3b82f6", fill: "#3b82f6" },
  product_outcome:  { stroke: "#8b5cf6", fill: "#8b5cf6" },
};

function getChartColor(entityLevel?: EntityLevel): ChartColorConfig {
  return (entityLevel && CHART_COLORS[entityLevel]) || DEFAULT_CHART_COLOR;
}

// ── MetricCard ─────────────────────────────────────────────────────────

/**
 * The metric an outcome extends: its history, its target, and the record form.
 *
 * Metrics carried over from pre-v2 data may have no numeric target, only the
 * display string that was typed at the time ("$3M", "<3%"). Those render in the
 * target slot as-is and the chart simply draws without a target line.
 */
export function MetricCard({ metric, entityLevel, entityId }: {
  metric: Metric;
  entityLevel?: EntityLevel;
  entityId?: string;
}) {
  const [recording, setRecording] = useState(false);
  const [editing, setEditing] = useState(false);

  const productLine = useProductLine();
  const solutionMarkers = useMemo(() => {
    if (entityLevel !== "product_outcome" || !entityId) return undefined;
    return selectDoneSolutionsForProductOutcome(productLine.entities, entityId);
  }, [entityLevel, entityId, productLine.entities]);

  if (editing) {
    return <MetricSettingsForm metric={metric} hasOutcome onClose={() => setEditing(false)} />;
  }

  const series = metric.dataSeries;
  const fmt = (v: number) => formatMetricValue(v, metric.valueFormat);

  const startingValue = metric.initialValue ?? series[0]?.value;
  const currentValue = series.length > 0 ? series[series.length - 1].value : startingValue;
  const target = metric.numericTarget;
  const lastRecordedDate = series.length > 0 ? series[series.length - 1].date : undefined;
  const color = getChartColor(entityLevel);

  const startLabel = startingValue !== undefined ? fmt(startingValue) : (metric.legacyCurrentValue ?? "—");
  const targetLabel = target !== undefined ? fmt(target) : (metric.legacyTargetValue ?? "—");

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleString("en", { month: "short", day: "numeric" });
  };

  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-border-default">
      {/* Header: metric name + frequency badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{metric.name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground/60 font-medium">
            {METRIC_FREQUENCY_LABELS[metric.frequency]}
          </span>
          <button
            onClick={() => setEditing(true)}
            title="Metric settings"
            className="cursor-pointer p-1 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <Pencil size={11} />
          </button>
        </div>
      </div>

      {/* Side-by-side: summary left, chart right */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left: metric summary panel */}
        <div className="lg:w-[35%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle px-4 py-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Current — hero */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-4xl lg:text-5xl font-bold text-foreground leading-none">
                  {currentValue !== undefined ? fmt(currentValue) : "—"}
                </span>
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
                <span className="text-lg font-semibold text-foreground/35 leading-none">{startLabel}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Start{metric.startDate ? ` · ${formatShortDate(metric.startDate)}` : ""}
                </span>
              </div>
              <span className="text-muted-foreground/30 text-sm">→</span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground/35 leading-none">{targetLabel}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Target{metric.endDate ? ` · ${formatShortDate(metric.endDate)}` : (metric.legacyTimeframe ? ` · ${metric.legacyTimeframe}` : "")}
                </span>
              </div>
            </div>
          </div>

          {/* Record Value — expands dynamically */}
          <AnimatePresence initial={false}>
            {recording && (
              <MetricRecordForm metric={metric} onClose={() => setRecording(false)} />
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
        </div>

        {/* Right: chart */}
        <div className="lg:w-[65%] min-w-0 bg-surface-1 rounded-lg border border-border-subtle p-1.5">
          <MetricChart
            dataSeries={series}
            target={target}
            endDate={metric.endDate}
            color={color}
            formatValue={fmt}
            solutionMarkers={solutionMarkers}
          />
        </div>
      </div>
    </div>
  );
}
