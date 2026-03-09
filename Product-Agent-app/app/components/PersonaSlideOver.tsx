"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { MarkdownToolbar, MarkdownBlock } from "./MarkdownToolbar";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";

export function PersonaSlideOver() {
  const open = useAppStore((s) => s.personaPanelOpen);
  const editId = useAppStore((s) => s.personaPanelId);
  const closePanel = useAppStore((s) => s.closePersonaPanel);
  const addPersona = useAppStore((s) => s.addPersona);
  const updatePersona = useAppStore((s) => s.updatePersona);
  const productLine = useProductLine();
  const personas = productLine.personas ?? [];

  const existing = editId ? personas.find((p) => p.id === editId) : null;
  const isEdit = !!editId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Sync form when panel opens or editId changes
  useEffect(() => {
    if (open) {
      setName(existing?.name ?? "");
      setDescription(existing?.description ?? "");
      setShowPreview(false);
    }
  }, [open, editId, existing?.name, existing?.description]);

  // Auto-close if the persona being edited was deleted
  useEffect(() => {
    if (open && editId && !personas.find((p) => p.id === editId)) {
      closePanel();
    }
  }, [open, editId, personas, closePanel]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closePanel();
    },
    [open, closePanel]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEdit && editId) {
      updatePersona(editId, { name: name.trim(), description: description.trim() });
    } else {
      const id = "persona-" + Date.now();
      addPersona({ id, name: name.trim(), description: description.trim() });
    }
    closePanel();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePanel}
            className="fixed inset-0 bg-overlay z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background border-l border-border-default shadow-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <h2 className="text-sm font-semibold text-foreground">
                {isEdit ? "Edit Persona" : "New Persona"}
              </h2>
              <button
                onClick={closePanel}
                className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fleet Manager, Driver, Dispatcher"
                  autoFocus
                  className="bg-surface-1 border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border-focus transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <MarkdownToolbar textareaRef={descriptionRef} draft={description} setDraft={setDescription} showPreview={showPreview} setShowPreview={setShowPreview} />
                {showPreview ? (
                  <div className="bg-surface-1 border border-border-strong rounded-lg px-3 py-2 min-h-[192px]">
                    {description ? <MarkdownBlock content={description} /> : <span className="text-muted-foreground/40 italic text-sm">Nothing to preview</span>}
                  </div>
                ) : (
                  <textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Who is this persona? What are their goals, pain points, and behaviors?"
                    rows={8}
                    maxLength={1024}
                    className="bg-surface-1 border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border-focus transition-colors resize-none"
                  />
                )}
                <span className="text-[10px] text-muted-foreground/40 text-right">
                  {description.length}/1024
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border-subtle">
              <button
                onClick={closePanel}
                className="cursor-pointer px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="cursor-pointer px-4 py-1.5 rounded-lg text-sm font-medium bg-surface-3 hover:bg-surface-active text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
