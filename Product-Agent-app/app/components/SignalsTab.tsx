"use client";

import { useState } from "react";
import { Plus, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, pointerWithin, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { useAppStore } from "../lib/store";
import { generateId } from "../lib/utils";
import { METRIC_FREQUENCY_LABELS, METRIC_VALUE_FORMAT_LABELS } from "../lib/schemas";
import type { Entity, Signal, MetricFrequency, MetricValueFormat } from "../lib/schemas";
import { SignalCard } from "./SignalCard";

interface SignalsTabProps {
  entity: Entity;
}

export function SignalsTab({ entity }: SignalsTabProps) {
  const addSignal = useAppStore((s) => s.addSignal);
  const updateSignal = useAppStore((s) => s.updateSignal);
  const reorderSignals = useAppStore((s) => s.reorderSignals);

  const [showAddForm, setShowAddForm] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newFrequency, setNewFrequency] = useState<MetricFrequency>("weekly");
  const [newFormat, setNewFormat] = useState<MetricValueFormat>("number");

  const signals = entity.signals ?? [];
  const activeSignals = signals.filter((s) => s.status === "active");
  const pausedSignals = signals.filter((s) => s.status === "paused");
  const activeSignalIds = activeSignals.map((s) => s.id);

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = activeSignalIds.indexOf(active.id as string);
    const newIdx = activeSignalIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    // Build full signal order: reordered active + paused (unchanged)
    const newActiveIds = arrayMove(activeSignalIds, oldIdx, newIdx);
    const pausedIds = pausedSignals.map((s) => s.id);
    reorderSignals(entity.id, [...newActiveIds, ...pausedIds]);
  };

  const activeCard = activeId ? activeSignals.find((s) => s.id === activeId) : null;

  const handleToggleRecord = (signalId: string | null) => {
    setRecordingId(signalId);
  };

  const handleAddSignal = () => {
    if (!newName.trim()) return;
    const signal: Signal = {
      id: generateId(),
      name: newName.trim(),
      frequency: newFrequency,
      valueFormat: newFormat,
      status: "active",
      dataSeries: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addSignal(entity.id, signal);
    setNewName("");
    setNewFrequency("weekly");
    setNewFormat("number");
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setNewName("");
    setNewFrequency("weekly");
    setNewFormat("number");
    setShowAddForm(false);
  };

  // Empty state
  if (signals.length === 0 && !showAddForm) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 px-5 border border-dashed border-border-default rounded-xl text-center">
        <BarChart3 size={32} className="text-muted-foreground/20" />
        <p className="text-[13px] text-muted-foreground/60 leading-relaxed max-w-[360px]">
          Signals are the diagnostic metrics you watch when your outcome isn&apos;t moving. No target, no deadline — ongoing tracking you can pause anytime.
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-xs font-medium text-muted-foreground/50 border border-dashed border-border-default rounded-lg px-3.5 py-1.5 cursor-pointer flex items-center gap-1 hover:opacity-100 hover:border-border-strong hover:bg-surface-hover transition-all"
        >
          <Plus size={12} /> Add your first signal
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/50">
          {activeSignals.length} active{pausedSignals.length > 0 ? ` · ${pausedSignals.length} paused` : ""}
        </span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-muted-foreground/50 border border-dashed border-border-default rounded-lg px-3.5 py-1.5 cursor-pointer flex items-center gap-1 hover:opacity-100 hover:border-border-strong hover:bg-surface-hover transition-all"
        >
          <Plus size={12} /> Add signal
        </button>
      </div>

      {/* Inline add form */}
      <AnimatePresence initial={false}>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="bg-popover border border-border-strong rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground/50">Signal name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSignal(); if (e.key === "Escape") handleCancelAdd(); }}
                  placeholder="e.g. Solutions created / wk"
                  autoFocus
                  className="bg-surface-2 border border-border-strong rounded-lg px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-border-focus w-full"
                />
              </div>
              <div className="flex flex-col min-[480px]:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground/50">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as MetricFrequency)}
                    className="bg-surface-2 border border-border-strong rounded-lg px-2.5 py-1.5 text-[13px] text-foreground outline-none cursor-pointer appearance-none"
                  >
                    {Object.entries(METRIC_FREQUENCY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground/50">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as MetricValueFormat)}
                    className="bg-surface-2 border border-border-strong rounded-lg px-2.5 py-1.5 text-[13px] text-foreground outline-none cursor-pointer appearance-none"
                  >
                    {Object.entries(METRIC_VALUE_FORMAT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleAddSignal}
                  disabled={!newName.trim()}
                  className={cn(
                    "text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors",
                    newName.trim() ? "bg-surface-3 text-foreground hover:bg-surface-active" : "bg-surface-2 text-muted-foreground/30 cursor-not-allowed",
                  )}
                >
                  Add signal
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="text-[11px] font-medium px-2 py-1.5 rounded-lg text-muted-foreground cursor-pointer hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active signal cards — with drag-and-drop */}
      {activeSignals.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={(e) => setActiveId(e.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={activeSignalIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {activeSignals.map((signal) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  entityId={entity.id}
                  isRecording={recordingId === signal.id}
                  onToggleRecord={handleToggleRecord}
                  draggable
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeCard ? (
              <div className="bg-popover rounded-xl shadow-2xl shadow-black/50">
                <SignalCard
                  signal={activeCard}
                  entityId={entity.id}
                  isRecording={false}
                  onToggleRecord={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Paused section */}
      {pausedSignals.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/35">
            Paused
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {pausedSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                entityId={entity.id}
                isRecording={false}
                onToggleRecord={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
