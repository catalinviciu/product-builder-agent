"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    },
    [open, onCancel, onConfirm]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-overlay backdrop-blur-[4px]"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(480px,calc(100vw-32px))] rounded-2xl border border-border-subtle bg-card p-6 shadow-2xl"
          >
            <h2
              id="confirm-dialog-title"
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={onCancel}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus text-muted-foreground transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                autoFocus
                className={cn(
                  "cursor-pointer text-xs px-3 py-1.5 rounded-md focus:outline-2 focus:outline-border-focus transition-colors",
                  destructive
                    ? "bg-destructive text-white hover:opacity-90 active:opacity-80"
                    : "bg-surface-3 hover:bg-surface-active active:bg-surface-active text-foreground"
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
