"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import {
  METRIC_VALUE_FORMAT_LABELS,
  METRIC_FREQUENCY_LABELS,
  METRIC_TYPE_LABELS,
} from "@/app/lib/schemas";
import type { Metric, MetricFrequency, MetricValueFormat, MetricType } from "@/app/lib/schemas";
import { getPeriodDate, formatMetricValue } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { latestPoint, type NewMetricInput } from "@/app/lib/metrics";
import { FieldDropdown, DatePickerField, FIELD_INPUT_CLASS } from "./FormFields";

/** Everything a metric is, in one form. */
export interface MetricFormValues {
  name: string;
  metricType: MetricType;
  frequency: MetricFrequency;
  valueFormat: MetricValueFormat;
  initialValue?: number;
  numericTarget?: number;
  startDate?: string;
  endDate?: string;
}

const BLANK: MetricFormValues = {
  name: "",
  metricType: "product",
  frequency: "monthly",
  valueFormat: "number",
};

function toValues(metric: Metric): MetricFormValues {
  return {
    name: metric.name,
    metricType: metric.metricType,
    frequency: metric.frequency,
    valueFormat: metric.valueFormat,
    initialValue: metric.initialValue,
    numericTarget: metric.numericTarget,
    startDate: metric.startDate,
    endDate: metric.endDate,
  };
}

interface MetricSettingsFormProps {
  /** Editing an existing metric. Omit to create a new one. */
  metric?: Metric;
  /** Called with the finished values when creating. Omit to save onto `metric`. */
  onCreate?: (values: NewMetricInput & { currentValue?: number }) => void;
  onClose: () => void;
  /** Stack every field in one column, for the narrow metric tree card. */
  compact?: boolean;
  /** Defaults for a new metric — e.g. inherit the parent's type. */
  defaults?: Partial<MetricFormValues>;
  title?: string;
  submitLabel?: string;
  /**
   * Rendered under the Type field. Where a metric sits in the tree is the
   * caller's business, so the parent picker is passed in rather than owned here.
   */
  parentField?: React.ReactNode;
  /** Hide the form's own frame when a modal already provides one. */
  bare?: boolean;
  /**
   * A target, a start value and a date range only mean something once an outcome
   * is driving the metric. Without one, the form asks for the current value
   * instead.
   */
  hasOutcome?: boolean;
}

/**
 * The single metric form: what it is called, what kind of metric it is, how it
 * is recorded, and the target it is aiming at. Backs creating a metric and
 * editing one, in the tree card and in the outcome's metric card.
 *
 * Changing the frequency re-snaps the existing series onto the new period
 * boundaries; that happens in `updateMetric`.
 */
export function MetricSettingsForm({
  metric,
  onCreate,
  onClose,
  compact = false,
  defaults,
  title,
  submitLabel,
  hasOutcome = false,
  parentField,
  bare = false,
}: MetricSettingsFormProps) {
  const updateMetric = useAppStore((s) => s.updateMetric);
  const recordMetricValue = useAppStore((s) => s.recordMetricValue);

  const [values, setValues] = useState<MetricFormValues>(() =>
    metric ? toValues(metric) : { ...BLANK, ...defaults },
  );
  const [initialStr, setInitialStr] = useState(
    values.initialValue !== undefined ? String(values.initialValue) : "",
  );
  const [targetStr, setTargetStr] = useState(
    values.numericTarget !== undefined ? String(values.numericTarget) : "",
  );
  // A plain metric is just a number you track, so it edits its latest reading.
  const [currentStr, setCurrentStr] = useState(() => {
    const point = metric ? latestPoint(metric) : undefined;
    return point ? String(point.value) : "";
  });

  const set = <K extends keyof MetricFormValues>(key: K, v: MetricFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSave = () => {
    if (!values.name.trim()) return;
    const initialValue = initialStr ? parseFloat(initialStr) : undefined;
    const numericTarget = targetStr ? parseFloat(targetStr) : undefined;
    const currentValue = currentStr ? parseFloat(currentStr) : undefined;

    const payload = {
      name: values.name.trim(),
      metricType: values.metricType,
      frequency: values.frequency,
      valueFormat: values.valueFormat,
      // Target fields belong to the outcome driving the metric.
      ...(hasOutcome
        ? {
            initialValue,
            numericTarget,
            startDate: values.startDate || undefined,
            endDate: values.endDate || undefined,
          }
        : {}),
    };

    if (onCreate) {
      onCreate({ ...payload, currentValue: hasOutcome ? undefined : currentValue });
      onClose();
      return;
    }
    if (!metric) return;

    updateMetric(metric.id, payload);

    if (hasOutcome) {
      // A metric with a start date and a starting value but no history gets that
      // first point recorded, so the chart has somewhere to begin.
      if (payload.startDate && initialValue !== undefined && metric.dataSeries.length === 0) {
        recordMetricValue(metric.id, payload.startDate, initialValue);
      }
    } else if (currentValue !== undefined && currentValue !== latestPoint(metric)?.value) {
      // Editing the current value records it against the period we are in now.
      recordMetricValue(metric.id, getPeriodDate(new Date(), values.frequency), currentValue);
    }

    onClose();
  };

  const rowClass = compact ? "flex flex-col gap-2" : "flex gap-2";
  const canSave = values.name.trim().length > 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        !bare && "rounded-xl border border-border-strong p-4 bg-surface-1",
        !compact && "w-full",
      )}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {title && (
        <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground/50">
          {title}
        </span>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/50">Name</label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          placeholder="What are you measuring?"
          autoFocus
          className={FIELD_INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/50">Type</label>
        <FieldDropdown
          value={values.metricType}
          onChange={(v) => set("metricType", v as MetricType)}
          options={METRIC_TYPE_LABELS}
        />
      </div>

      {parentField}

      <div className={rowClass}>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] text-muted-foreground/50">Recorded</label>
          <FieldDropdown
            value={values.frequency}
            onChange={(v) => set("frequency", v as MetricFrequency)}
            options={METRIC_FREQUENCY_LABELS}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] text-muted-foreground/50">Format</label>
          <FieldDropdown
            value={values.valueFormat}
            onChange={(v) => set("valueFormat", v as MetricValueFormat)}
            options={METRIC_VALUE_FORMAT_LABELS}
          />
        </div>
      </div>

      {hasOutcome ? (
        <>
          <div className={rowClass}>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground/50">Starting value</label>
              <input
                type="number"
                value={initialStr}
                onChange={(e) => setInitialStr(e.target.value)}
                placeholder="0"
                className={cn(FIELD_INPUT_CLASS, "w-full text-xs")}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground/50">Target</label>
              <input
                type="number"
                value={targetStr}
                onChange={(e) => setTargetStr(e.target.value)}
                placeholder="0"
                className={cn(FIELD_INPUT_CLASS, "w-full text-xs")}
              />
            </div>
          </div>

          <div className={rowClass}>
            <DatePickerField
              value={values.startDate ?? ""}
              onChange={(v) => set("startDate", v)}
              label="Start date"
            />
            <DatePickerField
              value={values.endDate ?? ""}
              onChange={(v) => set("endDate", v)}
              label="End date"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-foreground/50">Current value</label>
          <input
            type="number"
            value={currentStr}
            onChange={(e) => setCurrentStr(e.target.value)}
            placeholder="0"
            className={cn(FIELD_INPUT_CLASS, "w-full text-xs")}
          />
          <span className="text-[10px] text-muted-foreground/50">
            {metric && latestPoint(metric)
              ? `Last recorded ${formatMetricValue(latestPoint(metric)!.value, metric.valueFormat)} on ${latestPoint(metric)!.date}`
              : "Recorded against the period you are in now"}
          </span>
        </div>
      )}

      {hasOutcome && metric && (metric.legacyCurrentValue || metric.legacyTargetValue) && !targetStr && (
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
          This metric still shows the values typed before it was tracked
          {metric.legacyCurrentValue ? ` (${metric.legacyCurrentValue}` : ""}
          {metric.legacyTargetValue ? ` to ${metric.legacyTargetValue})` : metric.legacyCurrentValue ? ")" : ""}.
          Set a target above to chart it.
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
            canSave
              ? "bg-surface-3 text-foreground hover:bg-surface-active"
              : "bg-surface-2 text-muted-foreground/30 cursor-not-allowed",
          )}
        >
          {submitLabel ?? (onCreate ? "Add metric" : "Save")}
        </button>
        <button
          onClick={onClose}
          className="cursor-pointer text-xs font-medium px-2.5 py-1.5 rounded-lg text-muted-foreground hover:bg-surface-hover transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
