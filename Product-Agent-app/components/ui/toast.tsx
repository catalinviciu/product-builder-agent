"use client";

import * as React from "react";
import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastTone = "default" | "success" | "error";

export interface ToastInput {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
}

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
  createdAt: number;
}

// ── Internal store ─────────────────────────────────────────────────────────

interface ToastStore {
  toasts: ToastItem[];
  add: (item: ToastItem) => void;
  remove: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (item) => set((s) => ({ toasts: [...s.toasts, item] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ── Imperative API ─────────────────────────────────────────────────────────

export function showToast({ message, tone = "default", durationMs = 3000 }: ToastInput): void {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item: ToastItem = { id, message, tone, durationMs, createdAt: Date.now() };
  useToastStore.getState().add(item);
  setTimeout(() => useToastStore.getState().remove(id), durationMs);
}

// ── Tone config ────────────────────────────────────────────────────────────

const toneConfig: Record<ToastTone, { containerClass: string; icon: React.ReactNode }> = {
  default: {
    containerClass: "bg-popover border border-border-default text-foreground",
    icon: null,
  },
  success: {
    containerClass: "bg-popover border border-[color-mix(in_oklch,var(--accent-green)_30%,transparent)] text-foreground",
    icon: <CheckCircle2 size={15} className="shrink-0 text-[var(--accent-green)]" />,
  },
  error: {
    containerClass: "bg-popover border border-[color-mix(in_oklch,var(--accent-red)_30%,transparent)] text-foreground",
    icon: <AlertCircle size={15} className="shrink-0 text-[var(--accent-red)]" />,
  },
};

// ── Single toast ───────────────────────────────────────────────────────────

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const { containerClass, icon } = toneConfig[item.tone];

  return (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "pointer-events-auto flex items-center gap-2.5",
        "px-4 py-3 rounded-xl shadow-lg shadow-shadow-color",
        "min-w-[280px] max-w-[480px]",
        containerClass
      )}
    >
      {icon}
      <span
        className="flex-1 text-[length:var(--text-body)] leading-[var(--text-body-leading)]"
      >
        {item.message}
      </span>
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 ml-1 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ── Toaster (mount once in layout) ────────────────────────────────────────

export function Toaster(): React.ReactElement {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={remove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
