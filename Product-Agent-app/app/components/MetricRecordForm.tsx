"use client";

import { useState, useMemo } from "react";
import { Check, X, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import type { Metric } from "../lib/schemas";
import { getPeriodDate, formatPeriodTrigger, formatPeriodHint, CALENDAR_HEADER } from "../lib/schemas";
import { useAppStore } from "../lib/store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/app/lib/utils";

/**
 * Records one value against a metric, snapped to its period. Shared by the
 * metric card and the input-metric cards so there is one recording UI.
 */
export function MetricRecordForm({
  metric,
  onClose,
  className,
}: {
  metric: Metric;
  onClose: () => void;
  className?: string;
}) {
  const frequency = metric.frequency;
  const defaultDate = getPeriodDate(new Date(), frequency);
  const [date, setDate] = useState(defaultDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [valueStr, setValueStr] = useState(() => {
    const existing = metric.dataSeries.find((dp) => dp.date === defaultDate);
    return existing ? String(existing.value) : "";
  });

  const recordMetricValue = useAppStore((s) => s.recordMetricValue);

  const recordedDateObjects = useMemo(
    () => metric.dataSeries.map((dp) => new Date(dp.date + "T00:00:00")),
    [metric.dataSeries],
  );

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = metric.dataSeries.find((dp) => dp.date === newDate);
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
    recordMetricValue(metric.id, date, num);
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
      <div className={cn("pt-3 border-t border-border-subtle mt-3 flex flex-col gap-2", className)}>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
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
          <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">Value</label>
            <input
              type="number"
              value={valueStr}
              onChange={(e) => setValueStr(e.target.value)}
              placeholder="0"
              className="bg-surface-2 border border-border-strong rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors w-full"
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
