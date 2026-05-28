"use client";

import React, { useState } from "react";
import { FolderOpen, Pencil, X } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import { cn } from "@/app/lib/utils";

export function ProductLineSettingsView() {
  const settingsProductLineId = useAppStore((s) => s.settingsProductLineId);
  const productLines = useAppStore((s) => s.productLines);
  const updateProductLineSettings = useAppStore((s) => s.updateProductLineSettings);
  const closeSettings = useAppStore((s) => s.closeSettings);

  const pl = settingsProductLineId ? productLines[settingsProductLineId] : null;
  const settings = pl?.settings;
  const savedPath = settings?.codebasePath ?? null;

  const [editing, setEditing] = useState(savedPath === null);
  const [inputValue, setInputValue] = useState(savedPath ?? "");

  if (!pl || !settingsProductLineId) return null;

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    updateProductLineSettings(settingsProductLineId, { codebasePath: trimmed });
    analyticsEmitter.emit("CodebasePicked", { productLineId: settingsProductLineId });
    setEditing(false);
  };

  const handleSkip = () => {
    updateProductLineSettings(settingsProductLineId, { codebasePath: null });
    analyticsEmitter.emit("CodebaseSkipped", { productLineId: settingsProductLineId });
    setEditing(false);
  };

  const handleEdit = () => {
    setInputValue(savedPath ?? "");
    setEditing(true);
  };

  return (
    <div className="px-8 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{pl.name}</p>
        </div>
        <button
          onClick={closeSettings}
          aria-label="Close settings"
          className="cursor-pointer p-1.5 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Codebase section */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Codebase</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Link the folder where this product line&apos;s code lives. AI actions use this path as context.
          </p>
        </div>

        {savedPath && !editing ? (
          // Saved state
          <div className="rounded-xl border border-border-default bg-surface-1 px-4 py-3 flex items-center gap-3">
            <FolderOpen size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="text-xs font-mono text-foreground flex-1 truncate">{savedPath}</span>
            <button
              onClick={handleEdit}
              aria-label="Edit codebase path"
              className="cursor-pointer p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors shrink-0"
            >
              <Pencil size={12} />
            </button>
          </div>
        ) : !editing && savedPath === null ? (
          // No-codebase state (after skip)
          <div className="rounded-xl border border-border-subtle bg-surface-1 px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground/50 flex-1">No codebase linked</span>
            <button
              onClick={handleEdit}
              className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
            >
              Add a codebase
            </button>
          </div>
        ) : (
          // Input state (empty state or editing)
          <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
            {!savedPath && (
              <h3 className="text-sm font-medium text-foreground">
                Where does this product line&apos;s code live?
              </h3>
            )}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`D:\\Projects\\my-app`}
              className="bg-surface-2 border border-border-strong rounded-md px-3 py-2 text-sm text-foreground hover:border-border-strong focus:outline-none focus:border-border-focus font-mono"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  if (savedPath) { setEditing(false); } else { handleSkip(); }
                }
              }}
            />
            <p className="text-xs text-muted-foreground/60">
              Open your file explorer and copy/paste the codebase folder&apos;s path here.
            </p>
            <div className={cn("flex items-center", savedPath ? "gap-2" : "flex-col items-start gap-2")}>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!inputValue.trim()}
                  className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                {savedPath && (
                  <button
                    onClick={() => setEditing(false)}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus text-muted-foreground transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {!savedPath && (
                <button
                  onClick={handleSkip}
                  className="cursor-pointer text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  I don&apos;t have a codebase yet — set up without one.
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
