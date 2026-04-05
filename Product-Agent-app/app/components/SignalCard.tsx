"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { PlusCircle, Pause, Play, Trash2, Pencil, TrendingUp, TrendingDown, CalendarDays, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/ui/sparkline";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAppStore } from "../lib/store";
import {
  METRIC_FREQUENCY_LABELS, METRIC_VALUE_FORMAT_LABELS,
  getPeriodDate, formatMetricValue, formatPeriodTrigger, formatPeriodHint, CALENDAR_HEADER,
} from "../lib/schemas";
import type { Signal, MetricFrequency, MetricValueFormat } from "../lib/schemas";

interface SignalCardProps {
  signal: Signal;
  entityId: string;
  isRecording: boolean;
  onToggleRecord: (signalId: string | null) => void;
  draggable?: boolean;
}

function getTrend(dataSeries: { value: number }[]): { direction: "up" | "down" | "flat"; label: string } {
  if (dataSeries.length < 2) return { direction: "flat", label: "— 0%" };
  const latest = dataSeries[dataSeries.length - 1].value;
  const prev = dataSeries[dataSeries.length - 2].value;
  const diff = latest - prev;
  if (diff === 0) return { direction: "flat", label: "— 0%" };
  const pct = prev !== 0 ? Math.round(Math.abs(diff / prev) * 100) : null;
  if (diff > 0) return { direction: "up", label: `+${pct !== null ? `${pct}%` : String(diff)}` };
  return { direction: "down", label: `-${pct !== null ? `${pct}%` : String(Math.abs(diff))}` };
}

const SPARKLINE_COLORS = {
  up: { stroke: "var(--accent-green)", fill: "var(--accent-green)" },
  down: { stroke: "var(--accent-red)", fill: "var(--accent-red)" },
  flat: { stroke: "var(--muted-foreground)", fill: "var(--muted-foreground)" },
};

const TREND_BADGE_CLASS = {
  up: "bg-accent-green-bg text-accent-green",
  down: "bg-accent-red-bg text-accent-red",
  flat: "bg-surface-3 text-muted-foreground",
};

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  flat: null,
};

export function SignalCard({ signal, entityId, isRecording, onToggleRecord, draggable }: SignalCardProps) {
  const updateSignal = useAppStore((s) => s.updateSignal);
  const removeSignal = useAppStore((s) => s.removeSignal);
  const recordSignalValue = useAppStore((s) => s.recordSignalValue);

  // Sortable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: signal.id,
    disabled: !draggable,
  });
  const sortableStyle = { transform: CSS.Transform.toString(transform), transition };

  // Record form state
  const [recordValue, setRecordValue] = useState("");
  const [recordDate, setRecordDate] = useState(() => getPeriodDate(new Date(), signal.frequency));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(signal.name);
  const [editFrequency, setEditFrequency] = useState(signal.frequency);
  const [editFormat, setEditFormat] = useState(signal.valueFormat);

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset record form when recording state changes
  useEffect(() => {
    if (isRecording) {
      setRecordDate(getPeriodDate(new Date(), signal.frequency));
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setRecordValue("");
    }
  }, [isRecording, signal.frequency]);

  // Reset edit form when edit starts
  useEffect(() => {
    if (isEditing) {
      setEditName(signal.name);
      setEditFrequency(signal.frequency);
      setEditFormat(signal.valueFormat);
    }
  }, [isEditing, signal.name, signal.frequency, signal.valueFormat]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") onToggleRecord(null);
  }, [onToggleRecord]);

  const handleCalendarSelect = useCallback((day: Date | undefined) => {
    if (!day) return;
    setRecordDate(getPeriodDate(day, signal.frequency));
    setCalendarOpen(false);
  }, [signal.frequency]);

  const handleSave = () => {
    const val = parseFloat(recordValue);
    if (isNaN(val)) return;
    recordSignalValue(entityId, signal.id, recordDate, val);
    onToggleRecord(null);
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;
    updateSignal(entityId, signal.id, { name: editName.trim(), frequency: editFrequency, valueFormat: editFormat });
    setIsEditing(false);
  };

  // Recorded dates for calendar highlights
  const recordedDateObjects = useMemo(
    () => signal.dataSeries.map((dp) => new Date(dp.date + "T00:00:00")),
    [signal.dataSeries],
  );

  // Pre-fill value if date already recorded
  useEffect(() => {
    if (isRecording) {
      const existing = signal.dataSeries.find((dp) => dp.date === recordDate);
      if (existing) setRecordValue(String(existing.value));
      else setRecordValue("");
    }
  }, [recordDate, isRecording, signal.dataSeries]);

  const isPaused = signal.status === "paused";
  const latestValue = signal.dataSeries.length > 0 ? signal.dataSeries[signal.dataSeries.length - 1] : null;
  const trend = getTrend(signal.dataSeries);
  const TrendIcon = TREND_ICON[trend.direction];
  const fmt = (v: number) => formatMetricValue(v, signal.valueFormat);

  const lastRecordedDate = latestValue
    ? new Date(latestValue.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const recentValues = signal.dataSeries
    .slice(-5)
    .reverse()
    .map((d) => fmt(d.value))
    .join(", ");

  // Paused — compact single-row card
  if (isPaused) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-surface-1 border border-border-subtle opacity-45 hover:opacity-70 transition-opacity">
        <span className="text-xs font-medium text-muted-foreground flex-1 truncate">{signal.name}</span>
        <span className="text-[13px] font-semibold text-muted-foreground shrink-0">
          {latestValue ? fmt(latestValue.value) : "—"}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => updateSignal(entityId, signal.id, { status: "active" })}
            className="text-[10px] font-medium text-accent-purple cursor-pointer flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <Play size={10} /> Resume
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-1 ml-1">
              <button onClick={() => removeSignal(entityId, signal.id)} className="text-[10px] text-destructive cursor-pointer font-medium">Delete</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-muted-foreground cursor-pointer">Cancel</button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-[10px] text-muted-foreground/20 cursor-pointer hover:text-destructive transition-colors ml-1"
              title="Delete signal"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      className={cn(
        "flex flex-col gap-2 rounded-xl p-3.5 border transition-all",
        isRecording || isEditing
          ? "border-border-strong bg-surface-2"
          : "bg-surface-1 border-border-subtle hover:bg-surface-hover hover:border-border-default hover:shadow-[0_0_20px_var(--shadow-color)]",
        isDragging && "opacity-0 pointer-events-none",
      )}
    >
      {/* Header — edit mode or display */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(); if (e.key === "Escape") setIsEditing(false); }}
            autoFocus
            className="bg-surface-2 border border-border-strong rounded-lg px-2 py-1 text-xs text-foreground outline-none focus:border-border-focus w-full"
          />
          <div className="flex gap-1.5">
            <select
              value={editFrequency}
              onChange={(e) => setEditFrequency(e.target.value as MetricFrequency)}
              className="bg-surface-2 border border-border-strong rounded-lg px-2 py-1 text-[11px] text-foreground outline-none cursor-pointer appearance-none flex-1"
            >
              {Object.entries(METRIC_FREQUENCY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select
              value={editFormat}
              onChange={(e) => setEditFormat(e.target.value as MetricValueFormat)}
              className="bg-surface-2 border border-border-strong rounded-lg px-2 py-1 text-[11px] text-foreground outline-none cursor-pointer appearance-none flex-1"
            >
              {Object.entries(METRIC_VALUE_FORMAT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="flex gap-1">
            <button onClick={handleEditSave} className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-surface-3 text-foreground cursor-pointer hover:bg-surface-active transition-colors">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-[10px] font-medium px-2 py-1 rounded-lg text-muted-foreground cursor-pointer hover:bg-surface-hover transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground leading-tight">{signal.name}</span>
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-surface-3 text-muted-foreground/50 whitespace-nowrap shrink-0">
            {METRIC_FREQUENCY_LABELS[signal.frequency]}
          </span>
        </div>
      )}

      {/* Value row */}
      {!isEditing && (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-foreground leading-none">
              {latestValue ? fmt(latestValue.value) : "—"}
            </span>
            {signal.dataSeries.length >= 2 && (
              <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold rounded-[5px] px-1.5 py-0.5", TREND_BADGE_CLASS[trend.direction])}>
                {TrendIcon && <TrendIcon size={10} />}
                {trend.label}
              </span>
            )}
          </div>

          {/* Sparkline */}
          <Sparkline dataSeries={signal.dataSeries} color={SPARKLINE_COLORS[trend.direction]} height={40} />
        </>
      )}

      {/* Footer */}
      {!isEditing && (
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <span className="text-[10px] text-muted-foreground/40">
            {lastRecordedDate ? `Last: ${lastRecordedDate}` : "No data yet"}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleRecord(isRecording ? null : signal.id)}
              className="text-[10px] font-medium text-muted-foreground/50 cursor-pointer flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <PlusCircle size={10} /> Record
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground/30 cursor-pointer hover:text-muted-foreground transition-colors p-0.5 rounded hover:bg-surface-hover">
                  <MoreVertical size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setIsEditing(true)} className="text-xs gap-2">
                  <Pencil size={12} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSignal(entityId, signal.id, { status: "paused" })} className="text-xs gap-2">
                  <Pause size={12} /> Pause
                </DropdownMenuItem>
                {confirmDelete ? (
                  <DropdownMenuItem onClick={() => removeSignal(entityId, signal.id)} className="text-xs gap-2 text-destructive focus:text-destructive">
                    <Trash2 size={12} /> Confirm delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setConfirmDelete(true)} className="text-xs gap-2 text-destructive focus:text-destructive">
                    <Trash2 size={12} /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Inline record form with calendar */}
      <AnimatePresence initial={false}>
        {isRecording && !isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle" onKeyDown={handleKeyDown}>
              {/* Period picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground/50">Period</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1.5 bg-surface-2 border border-border-strong rounded-lg px-2.5 py-1.5 text-[12px] text-foreground cursor-pointer hover:border-border-focus transition-colors w-full text-left">
                      <CalendarDays size={13} className="text-muted-foreground/50 shrink-0" />
                      {formatPeriodTrigger(recordDate, signal.frequency)}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-xs text-muted-foreground">{CALENDAR_HEADER[signal.frequency]}</span>
                    </div>
                    <Calendar
                      mode="single"
                      selected={new Date(recordDate + "T00:00:00")}
                      onSelect={handleCalendarSelect}
                      defaultMonth={new Date(recordDate + "T00:00:00")}
                      disabled={{ after: new Date() }}
                      modifiers={{ recorded: recordedDateObjects }}
                      modifiersClassNames={{ recorded: "metric-calendar-recorded" }}
                    />
                    <div className="px-3 pb-3 pt-1 border-t border-border-subtle">
                      <span className="text-[11px] text-muted-foreground/60">{formatPeriodHint(recordDate, signal.frequency)}</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Value + actions */}
              <div className="flex gap-1.5 items-end">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground/50">Value</label>
                  <input
                    ref={inputRef}
                    type="number"
                    value={recordValue}
                    onChange={(e) => setRecordValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                    placeholder="0"
                    className="bg-surface-2 border border-border-strong rounded-lg px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-border-focus w-full"
                  />
                </div>
                <div className="flex gap-1">
                  <button onClick={handleSave} className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-surface-3 text-foreground cursor-pointer hover:bg-surface-active transition-colors">
                    Save
                  </button>
                  <button onClick={() => onToggleRecord(null)} className="text-[11px] font-medium px-2 py-1.5 rounded-lg text-muted-foreground cursor-pointer hover:bg-surface-hover transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
              {recentValues && (
                <span className="text-[10px] text-muted-foreground/40">Recent: {recentValues}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
