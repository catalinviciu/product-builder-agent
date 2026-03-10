"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";

export function AccordionSection({ label, children, defaultOpen = false }: {
  label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border-default overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-2 w-full px-[var(--spacing-block-px)] py-[var(--spacing-block-py)] bg-surface-1 hover:bg-surface-2 transition-colors"
      >
        <ChevronRight
          size={14}
          className={cn(
            "text-muted-foreground/40 transition-transform duration-200 shrink-0",
            open && "rotate-90"
          )}
        />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </span>
      </button>
      {open && (
        <div className="px-[var(--spacing-block-px)] py-[var(--spacing-block-py)] border-t border-border-subtle">
          {children}
        </div>
      )}
    </div>
  );
}
