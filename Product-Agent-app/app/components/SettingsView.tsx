"use client";

import React, { useState, useRef, useCallback } from "react";
import { ArrowLeft, ChevronRight, ChevronDown, Check, Monitor, Sun, Moon, Layers, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemePreference } from "../lib/ThemePreferenceContext";
import { useAppStore } from "@/app/lib/store";
import { PRODUCT_LINE_STATUS_META } from "@/app/lib/schemas";
import { useClickOutside } from "@/app/lib/hooks/useClickOutside";
import { cn } from "@/app/lib/utils";
import { ProductLineSettingsView } from "./ProductLineSettingsView";

// ── Product line selector dropdown ───────────────────────────────────────────

function PLSelectorDropdown() {
  const currentProductLineId = useAppStore((s) => s.currentProductLineId);
  const productLines = useAppStore((s) => s.productLines);
  const switchProductLine = useAppStore((s) => s.switchProductLine);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => setOpen(false), []);
  useClickOutside(ref, handleClickOutside, open);

  const allLines = Object.values(productLines);
  const current = productLines[currentProductLineId];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left min-w-0",
          "border-border-default bg-surface-2 hover:bg-surface-hover",
          open && "border-border-strong bg-surface-hover"
        )}
      >
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1.5">
            Active product line
            {current?.status && (
              <span className={cn("w-1.5 h-1.5 rounded-full", PRODUCT_LINE_STATUS_META[current.status].dotColor)} />
            )}
          </span>
          <span className="text-xs font-medium text-foreground truncate max-w-[220px]">
            {current?.name ?? "—"}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 w-full min-w-[260px] rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden">
          {allLines.map((pl) => {
            const isActive = pl.id === currentProductLineId;
            return (
              <button
                key={pl.id}
                onClick={() => { switchProductLine(pl.id); setOpen(false); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 transition-colors text-left",
                  "hover:bg-surface-hover",
                  isActive && "bg-surface-3"
                )}
              >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    {pl.name}
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded border", PRODUCT_LINE_STATUS_META[pl.status].color)}>
                      {PRODUCT_LINE_STATUS_META[pl.status].label}
                    </span>
                  </span>
                  {pl.description && (
                    <span className="text-[11px] text-muted-foreground/50 truncate">{pl.description}</span>
                  )}
                </div>
                {isActive && <Check size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Product line tab header (selector + delete) ───────────────────────────────

function ProductLineTabHeader() {
  const currentProductLineId = useAppStore((s) => s.currentProductLineId);
  const productLines = useAppStore((s) => s.productLines);
  const deleteProductLine = useAppStore((s) => s.deleteProductLine);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const allLines = Object.values(productLines);

  const handleDelete = () => {
    deleteProductLine(currentProductLineId);
    setConfirmDelete(false);
  };

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <PLSelectorDropdown />
      </div>
      {allLines.length > 1 && (
        <div className="shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Delete this product line?</span>
              <button
                onClick={handleDelete}
                className="cursor-pointer text-[11px] px-2 py-1 rounded-md bg-destructive-surface text-destructive border border-destructive-border hover:bg-destructive-surface-hover transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer text-[11px] px-2 py-1 rounded-md bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="cursor-pointer text-[11px] px-2.5 py-1.5 rounded-md border border-destructive-border text-destructive bg-destructive-surface hover:bg-destructive-surface-hover transition-colors"
            >
              Delete product line
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Appearance tab ────────────────────────────────────────────────────────────

function AppearanceTab() {
  const { setTheme, theme } = useTheme();
  const { mode, setMode } = useThemePreference();

  const currentValue = mode === "auto" ? "auto" : (theme ?? "dark");

  const handleChange = (value: string) => {
    if (value === "auto") {
      setMode("auto");
    } else {
      setMode("manual");
      setTheme(value);
    }
  };

  const options = [
    { value: "auto", label: "Automatic", description: "Follows your system setting", icon: Monitor },
    { value: "light", label: "Light", description: "Always use light mode", icon: Sun },
    { value: "dark", label: "Dark", description: "Always use dark mode", icon: Moon },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground mb-3">Choose how Product Agent looks to you.</p>
      {options.map(({ value, label, description, icon: Icon }) => {
        const isSelected = currentValue === value;
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className={cn(
              "cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg border text-left transition-colors",
              isSelected
                ? "bg-surface-3 border-border-strong"
                : "bg-surface-1 border-border-subtle hover:bg-surface-hover hover:border-border-default"
            )}
          >
            <div className={cn(
              "shrink-0 w-8 h-8 flex items-center justify-center rounded-lg",
              isSelected ? "bg-surface-active" : "bg-surface-2"
            )}>
              <Icon size={16} className={isSelected ? "text-foreground" : "text-muted-foreground"} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className={cn("text-sm font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
              <span className="text-xs text-muted-foreground/70">{description}</span>
            </div>
            {isSelected && (
              <Check size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Breadcrumb (back out of settings + menu trail) ────────────────────────────

function SettingsBreadcrumb() {
  const closeSettings = useAppStore((s) => s.closeSettings);
  const settingsTab = useAppStore((s) => s.settingsTab);
  const tabLabel = settingsTab === "appearance" ? "Appearance" : "Product line settings";

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
      <button
        onClick={closeSettings}
        className="cursor-pointer flex items-center gap-1.5 -ml-1.5 px-1.5 py-0.5 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
      >
        <ArrowLeft size={14} className="shrink-0" />
        <span>Settings</span>
      </button>
      <ChevronRight size={12} className="shrink-0 text-muted-foreground/30" />
      <span className="font-medium text-foreground">{tabLabel}</span>
    </nav>
  );
}

// ── Main SettingsView ─────────────────────────────────────────────────────────

export function SettingsView() {
  const settingsTab = useAppStore((s) => s.settingsTab);
  const setSettingsTab = useAppStore((s) => s.setSettingsTab);

  const navItems: { id: "product-line" | "appearance"; label: string; icon: React.ElementType }[] = [
    { id: "product-line", label: "Product line settings", icon: Layers },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* ── Left sub-nav ── */}
      <div className="shrink-0 md:w-52 border-b md:border-b-0 md:border-r border-border-subtle bg-surface-1 flex flex-col">
        <div className="px-4 py-3 border-b border-border-subtle">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Settings
          </span>
        </div>
        <nav className="flex md:flex-col gap-1 p-2 overflow-x-auto md:overflow-x-visible">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = settingsTab === id;
            return (
              <button
                key={id}
                onClick={() => setSettingsTab(id)}
                className={cn(
                  "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-surface-3 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Right detail area ── */}
      <div className="flex-1 overflow-y-auto">
        {settingsTab === "product-line" ? (
          <div>
            <div className="px-8 pt-8 max-w-2xl">
              <SettingsBreadcrumb />
              <div className="border-t border-border-subtle pt-6">
                <ProductLineTabHeader />
              </div>
            </div>
            <ProductLineSettingsView />
          </div>
        ) : (
          <div className="px-8 pt-8 pb-8 max-w-lg">
            <SettingsBreadcrumb />
            <div className="border-t border-border-subtle pt-6">
              <AppearanceTab />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
