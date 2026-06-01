"use client";

import { Settings } from "lucide-react";
import { useAppStore } from "@/app/lib/store";

export function AccountMenu() {
  const openSettings = useAppStore((s) => s.openSettings);

  return (
    <button
      onClick={() => openSettings("header-link")}
      className="absolute top-3 right-3 z-20 cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border-default bg-popover text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
      aria-label="Settings"
    >
      <Settings size={16} />
    </button>
  );
}
