"use client";

import { useState } from "react";
import { ChevronDown, LayoutGrid, Columns3, Plus } from "lucide-react";
import type { Entity, EntityStatus } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";
import { DndContext, DragEndEvent, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { ChildEntityCard } from "./ChildEntityCard";
import { KanbanColumn, KANBAN_COLUMNS, STATUS_GROUP_ORDER } from "./KanbanShared";

export interface CardDisplayProps {
  preview: string;
  badge: string;
  personaName?: string;
  personaDescription?: string;
  secondaryPersonaCount?: number;
  assumptionTypeLabel?: string;
  assumptionTypeColor?: string;
  assumptionTypeDescription?: string;
  assumptionTypeDotColor?: string;
  testTypeLabel?: string;
  testTypeColor?: string;
  testTypeDescription?: string;
  testTypeDotColor?: string;
  iceScore?: number;
  iceScoreColor?: { text: string; bg: string; border: string };
}

interface EntityGridViewProps {
  items: Entity[];
  orderedIds: string[];
  onReorder: (newIds: string[]) => void;
  onStatusChange: (id: string, status: EntityStatus) => void;
  headerLabel: string;
  headerDescription?: string;
  getCardProps: (entity: Entity) => CardDisplayProps;
  addButton?: React.ReactNode;
  storageKey: string;
}

export function EntityGridView({
  items,
  orderedIds,
  onReorder,
  onStatusChange,
  headerLabel,
  headerDescription,
  getCardProps,
  addButton,
  storageKey,
}: EntityGridViewProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Lazy initializer reads localStorage synchronously on first render — no flash, no second render
  const [viewMode, setViewMode] = useState<"grid" | "kanban">(() => {
    if (typeof window === "undefined") return items.length >= 4 ? "kanban" : "grid";
    const saved = localStorage.getItem(storageKey);
    return (saved === "grid" || saved === "kanban") ? saved : (items.length >= 4 ? "kanban" : "grid");
  });

  const handleSetViewMode = (mode: "grid" | "kanban") => {
    setViewMode(mode);
    localStorage.setItem(storageKey, mode);
  };

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const draggedId = active.id as string;
    const overId = over.id as string;

    // Column drop → status change only
    const statusMap: Record<string, EntityStatus> = { draft: "draft", explore: "explore", commit: "commit", done: "done" };
    if (statusMap[overId]) {
      onStatusChange(draggedId, statusMap[overId]);
      return;
    }

    // Card drop → reorder (and possibly status change)
    const activeEntity = items.find(c => c.id === draggedId);
    const overEntity = items.find(c => c.id === overId);
    if (!activeEntity || !overEntity) return;

    // Reorder in ordered IDs array
    const currentIds = [...orderedIds];
    const oldIdx = currentIds.indexOf(draggedId);
    const newIdx = currentIds.indexOf(overId);
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
      onReorder(arrayMove(currentIds, oldIdx, newIdx));
    }

    // Cross-column: also change status
    if (activeEntity.status !== overEntity.status) {
      onStatusChange(draggedId, overEntity.status);
    }
  }

  const activeChild = activeId ? items.find(c => c.id === activeId) : null;

  if (items.length === 0 && !addButton) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Header with view toggle */}
      {(items.length > 0 || addButton) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground shrink-0">
              {headerLabel}
            </span>
            {headerDescription && (
              <span className="text-[11px] text-muted-foreground/30 italic hidden sm:inline">
                {headerDescription}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSetViewMode("grid")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md transition-colors",
                  viewMode === "grid" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
                )}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => handleSetViewMode("kanban")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md transition-colors",
                  viewMode === "kanban" ? "bg-surface-3 text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover"
                )}
                title="Kanban view"
              >
                <Columns3 size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...items].sort((a, b) => STATUS_GROUP_ORDER[a.status] - STATUS_GROUP_ORDER[b.status]).map((child) => {
            const cardProps = getCardProps(child);
            return (
              <ChildEntityCard
                key={child.id}
                id={child.id}
                title={child.title}
                icon={child.icon}
                level={child.level}
                preview={cardProps.preview}
                status={child.status}
                badge={cardProps.badge}
                personaName={cardProps.personaName}
                personaDescription={cardProps.personaDescription}
                secondaryPersonaCount={cardProps.secondaryPersonaCount}
                assumptionTypeLabel={cardProps.assumptionTypeLabel}
                assumptionTypeColor={cardProps.assumptionTypeColor}
                assumptionTypeDescription={cardProps.assumptionTypeDescription}
                assumptionTypeDotColor={cardProps.assumptionTypeDotColor}
                testTypeLabel={cardProps.testTypeLabel}
                testTypeColor={cardProps.testTypeColor}
                testTypeDescription={cardProps.testTypeDescription}
                testTypeDotColor={cardProps.testTypeDotColor}
                iceScore={cardProps.iceScore}
                iceScoreColor={cardProps.iceScoreColor}
              />
            );
          })}
        </div>
      )}

      {/* Kanban view */}
      {viewMode === "kanban" && items.length > 0 && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)} collisionDetection={pointerWithin}>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 overflow-x-auto xl:overflow-x-visible snap-x snap-mandatory xl:snap-none flex xl:grid">
            {KANBAN_COLUMNS.map((col) => {
              const doneItems = items.filter((c) => c.status === "done");
              const archivedOrDroppedItems = items.filter((c) => c.status === "archived" || c.status === "dropped");
              const colChildren = col.key === "done"
                ? doneItems
                : items.filter((c) => col.statuses.includes(c.status));

              const totalCount = col.key === "done" ? doneItems.length + archivedOrDroppedItems.length : colChildren.length;

              return (
                <KanbanColumn
                  key={col.key}
                  columnKey={col.key}
                  label={col.label}
                  dotColor={col.dotColor}
                  accentBorder={col.accentBorder}
                  count={totalCount}
                >
                  {colChildren.length === 0 && (col.key !== "done" || archivedOrDroppedItems.length === 0) && (
                    <p className="text-xs text-muted-foreground/30 italic px-1 py-3 text-center">No items</p>
                  )}
                  <SortableContext items={colChildren.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {colChildren.map((child) => {
                    const cardProps = getCardProps(child);
                    return (
                      <ChildEntityCard
                        key={child.id}
                        id={child.id}
                        title={child.title}
                        icon={child.icon}
                        level={child.level}
                        preview={cardProps.preview}
                        status={child.status}
                        badge={cardProps.badge}
                        hideStatus
                        draggable
                        personaName={cardProps.personaName}
                        personaDescription={cardProps.personaDescription}
                        secondaryPersonaCount={cardProps.secondaryPersonaCount}
                        assumptionTypeLabel={cardProps.assumptionTypeLabel}
                        assumptionTypeColor={cardProps.assumptionTypeColor}
                        assumptionTypeDescription={cardProps.assumptionTypeDescription}
                        assumptionTypeDotColor={cardProps.assumptionTypeDotColor}
                        testTypeLabel={cardProps.testTypeLabel}
                        testTypeColor={cardProps.testTypeColor}
                        testTypeDescription={cardProps.testTypeDescription}
                        testTypeDotColor={cardProps.testTypeDotColor}
                        iceScore={cardProps.iceScore}
                        iceScoreColor={cardProps.iceScoreColor}
                      />
                    );
                  })}
                  </SortableContext>
                  {/* Archived toggle in Done column */}
                  {col.key === "done" && archivedOrDroppedItems.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="cursor-pointer text-[11px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors flex items-center gap-1.5 px-1 py-1"
                      >
                        <ChevronDown size={12} className={cn("transition-transform", showArchived && "rotate-180")} />
                        {showArchived ? "Hide" : "Show"} {archivedOrDroppedItems.length} archived/dropped
                      </button>
                      {showArchived && archivedOrDroppedItems.map((child) => {
                        const cardProps = getCardProps(child);
                        return (
                          <ChildEntityCard
                            key={child.id}
                            id={child.id}
                            title={child.title}
                            icon={child.icon}
                            level={child.level}
                            preview={cardProps.preview}
                            status={child.status}
                            badge={cardProps.badge}
                            hideStatus
                            draggable
                            personaName={cardProps.personaName}
                            personaDescription={cardProps.personaDescription}
                            secondaryPersonaCount={cardProps.secondaryPersonaCount}
                            assumptionTypeLabel={cardProps.assumptionTypeLabel}
                            assumptionTypeColor={cardProps.assumptionTypeColor}
                            assumptionTypeDescription={cardProps.assumptionTypeDescription}
                            assumptionTypeDotColor={cardProps.assumptionTypeDotColor}
                            testTypeLabel={cardProps.testTypeLabel}
                            testTypeColor={cardProps.testTypeColor}
                            testTypeDescription={cardProps.testTypeDescription}
                            testTypeDotColor={cardProps.testTypeDotColor}
                            iceScore={cardProps.iceScore}
                            iceScoreColor={cardProps.iceScoreColor}
                          />
                        );
                      })}
                    </>
                  )}
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>
            {activeChild ? (
              <div className="bg-popover rounded-xl shadow-2xl shadow-black/50">
                {(() => {
                  const cardProps = getCardProps(activeChild);
                  return (
                    <ChildEntityCard
                      id={activeChild.id}
                      title={activeChild.title}
                      icon={activeChild.icon}
                      level={activeChild.level}
                      preview={cardProps.preview}
                      status={activeChild.status}
                      badge={cardProps.badge}
                      hideStatus
                      personaName={cardProps.personaName}
                      personaDescription={cardProps.personaDescription}
                      secondaryPersonaCount={cardProps.secondaryPersonaCount}
                      assumptionTypeLabel={cardProps.assumptionTypeLabel}
                      assumptionTypeColor={cardProps.assumptionTypeColor}
                      assumptionTypeDescription={cardProps.assumptionTypeDescription}
                      assumptionTypeDotColor={cardProps.assumptionTypeDotColor}
                      testTypeLabel={cardProps.testTypeLabel}
                      testTypeColor={cardProps.testTypeColor}
                      testTypeDescription={cardProps.testTypeDescription}
                      testTypeDotColor={cardProps.testTypeDotColor}
                      iceScore={cardProps.iceScore}
                      iceScoreColor={cardProps.iceScoreColor}
                    />
                  );
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {addButton}
    </div>
  );
}
