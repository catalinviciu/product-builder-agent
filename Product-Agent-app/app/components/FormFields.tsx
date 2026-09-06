"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronDown, CalendarDays } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useClickOutside } from "@/app/lib/hooks/useClickOutside";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/** Shared input styling for the inline editor forms. */
export const FIELD_INPUT_CLASS =
  "bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus transition-colors";

// ── Field dropdown ────────────────────────────────────────────────────────

export function FieldDropdown({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback(() => setOpen(false), []);
  useClickOutside(ref, handleClickOutside, open);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border-focus transition-colors flex items-center justify-between gap-1"
      >
        {options[value] ?? value}
        <ChevronDown size={12} className="text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-full">
          {Object.entries(options).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              className={cn(
                "cursor-pointer flex items-center w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                value === key ? "bg-surface-3 text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Date picker field (Popover + Calendar pattern) ───────────────────────

export function DatePickerField({ value, onChange, label }: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[10px] text-muted-foreground/50">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border-focus transition-colors text-left flex items-center gap-2">
            <CalendarDays size={14} className="text-muted-foreground/50 shrink-0" />
            {value || "Select date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value + "T00:00:00") : undefined}
            onSelect={handleSelect}
            defaultMonth={value ? new Date(value + "T00:00:00") : new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
