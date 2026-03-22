"use client";

import { useState, useRef, useEffect } from "react";
import { MarkdownBlock } from "./MarkdownToolbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Pencil, Trash2, Plus,
} from "lucide-react";
import type { Entity, EntityStatus } from "@/app/lib/schemas";
import { LEVEL_META, CHILD_LEVEL, PERSONA_LEVELS, MULTI_PERSONA_LEVELS, ASSUMPTION_TYPE_META, TEST_TYPE_META, getIceScoreColor } from "@/app/lib/schemas";
import { LEVEL_ICON_MAP } from "@/app/lib/icons";
import { useAppStore } from "@/app/lib/store";
import { getEntity, getRootEntities, getEntityPreview, cn, buildRootAnchor } from "@/app/lib/utils";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { EntityBreadcrumb } from "./EntityBreadcrumb";

// Extracted components
import { AIActionsMenu, RootAIActionsButton } from "./AIActionsMenu";
import { StatusPicker, PersonaPicker, SecondaryPersonaPicker, AssumptionTypePicker, TestTypePicker } from "./EntityPickers";
import { EditableText } from "./EditableText";
import { BlockRenderer, AddBlockButton, BlockList } from "./EntityBlocks";
import { MetricCard } from "./MetricCard";
import type { MetricBlock } from "@/app/lib/schemas";
import { IceScorePanel } from "./IceScorePanel";
import { AddChildForm, AddRootEntityForm } from "./EntityForms";
import { EntityGridView, type CardDisplayProps } from "./EntityGridView";

// ── Children grid (now delegates to EntityGridView) ───────────────────────

function ChildrenGrid({ entity }: { entity: Entity }) {
  const productLine = useProductLine();
  const { entities } = productLine;
  const { updateEntity } = useAppStore();
  const personas = productLine.personas ?? [];
  const [showAddForm, setShowAddForm] = useState(false);
  const childLevel = CHILD_LEVEL[entity.level];

  const children = entity.children
    .map((id) => getEntity(entities, id))
    .filter((e): e is Entity => e !== undefined);

  const levelMeta = LEVEL_META[entity.level];
  const hasContent = children.length > 0 || childLevel !== null;

  if (!hasContent) return null;

  function getChildCardProps(child: Entity): CardDisplayProps {
    let preview = getEntityPreview(child);
    let badge = "";
    let iceScoreTotal: number | undefined;
    let iceScoreColorObj: { text: string; bg: string; border: string } | undefined;
    if (child.level === "product_outcome") {
      const metricBlock = child.blocks.find((b) => b.type === "metric");
      const childCount = child.children?.length ?? 0;
      if (metricBlock && metricBlock.type === "metric") {
        if (metricBlock.frequency && metricBlock.numericTarget !== undefined) {
          const latest = metricBlock.dataSeries?.length ? metricBlock.dataSeries[metricBlock.dataSeries.length - 1].value : metricBlock.initialValue ?? 0;
          preview = `${latest} → ${metricBlock.numericTarget}`;
        } else {
          preview = `${metricBlock.currentValue} → ${metricBlock.targetValue}${metricBlock.timeframe ? ` · ${metricBlock.timeframe}` : ""}`;
        }
      }
      badge = `${childCount} opportunit${childCount !== 1 ? "ies" : "y"}`;
    }
    if (child.level === "opportunity" && child.iceScore) {
      iceScoreTotal = child.iceScore.i * child.iceScore.c * child.iceScore.e;
      iceScoreColorObj = getIceScoreColor(iceScoreTotal);
    }

    const getPersonaName = () => {
      if (!PERSONA_LEVELS.has(child.level) || !child.personaId) return undefined;
      return personas.find((p) => p.id === child.personaId)?.name;
    };
    const getPersonaDescription = () => {
      if (!PERSONA_LEVELS.has(child.level) || !child.personaId) return undefined;
      return personas.find((p) => p.id === child.personaId)?.description;
    };
    const getSecondaryPersonaCount = () => {
      if (!MULTI_PERSONA_LEVELS.has(child.level)) return 0;
      return (child.secondaryPersonaIds ?? []).length;
    };
    const getAssumptionTypeInfo = () => {
      if (child.level !== "assumption" || !child.assumptionType) return undefined;
      return ASSUMPTION_TYPE_META[child.assumptionType];
    };
    const getTestTypeInfo = () => {
      if (child.level !== "test" || !child.testType) return undefined;
      return TEST_TYPE_META[child.testType];
    };

    return {
      preview,
      badge,
      iceScore: iceScoreTotal,
      iceScoreColor: iceScoreColorObj,
      personaName: getPersonaName(),
      personaDescription: getPersonaDescription(),
      secondaryPersonaCount: getSecondaryPersonaCount(),
      assumptionTypeLabel: getAssumptionTypeInfo()?.label,
      assumptionTypeColor: getAssumptionTypeInfo()?.color,
      assumptionTypeDescription: getAssumptionTypeInfo()?.description,
      assumptionTypeDotColor: getAssumptionTypeInfo()?.dotColor,
      testTypeLabel: getTestTypeInfo()?.label,
      testTypeColor: getTestTypeInfo()?.color,
      testTypeDescription: getTestTypeInfo()?.description,
      testTypeDotColor: getTestTypeInfo()?.dotColor,
    };
  }

  const addButton = childLevel ? (
    <>
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors justify-center"
        >
          <Plus size={14} /> Add {LEVEL_META[childLevel].label}
        </button>
      ) : (
        <AddChildForm parentId={entity.id} childLevel={childLevel} onClose={() => setShowAddForm(false)} />
      )}
    </>
  ) : undefined;

  return (
    <EntityGridView
      items={children}
      orderedIds={entity.children}
      onReorder={(newIds) => updateEntity(entity.id, { children: newIds })}
      onStatusChange={(id, status) => updateEntity(id, { status })}
      headerLabel={levelMeta.childrenLabel}
      headerDescription={childLevel ? LEVEL_META[childLevel].description : undefined}
      getCardProps={getChildCardProps}
      addButton={addButton}
      storageKey="pa-view-mode"
    />
  );
}

// ── Root view ─────────────────────────────────────────────────────────────

function RootView() {
  const productLine = useProductLine();
  const { tree, entities, id: plId } = productLine;
  const { updateTree, updateEntity } = useAppStore();
  const roots = getRootEntities(entities, tree);
  const [showAddForm, setShowAddForm] = useState(false);
  const boMeta = LEVEL_META.business_outcome;

  function getRootCardProps(entity: Entity): CardDisplayProps {
    const childCount = entity.children?.length ?? 0;
    const metricBlock = entity.blocks.find((b) => b.type === "metric");
    let preview = "";
    let badge = "";
    if (entity.level === "business_outcome" && metricBlock && metricBlock.type === "metric") {
      if (metricBlock.frequency && metricBlock.numericTarget !== undefined) {
        const latest = metricBlock.dataSeries?.length ? metricBlock.dataSeries[metricBlock.dataSeries.length - 1].value : metricBlock.initialValue ?? 0;
        preview = `${latest} → ${metricBlock.numericTarget}`;
      } else {
        preview = `${metricBlock.currentValue} → ${metricBlock.targetValue}${metricBlock.timeframe ? ` · ${metricBlock.timeframe}` : ""}`;
      }
      badge = `${childCount} product outcome${childCount !== 1 ? "s" : ""}`;
    }
    return { preview: preview || getEntityPreview(entity), badge };
  }

  return (
    <div className="px-8 py-8 pb-28 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            <EditableText
              value={tree.title}
              onSave={(v) => updateTree(plId, { title: v })}
              maxLength={80}
            />
          </h1>
          <RootAIActionsButton text={buildRootAnchor(productLine.name)} />
        </div>
        <div className="text-xs text-muted-foreground">
          <EditableText
            value={tree.description}
            onSave={(v) => updateTree(plId, { description: v })}
            placeholder="Add a description..."
          />
        </div>
      </div>

      <EntityGridView
        items={roots}
        orderedIds={tree.rootChildren}
        onReorder={(newIds) => updateTree(plId, { rootChildren: newIds })}
        onStatusChange={(id, status) => updateEntity(id, { status })}
        headerLabel="Business Outcomes"
        headerDescription={boMeta.description}
        getCardProps={getRootCardProps}
        addButton={
          !showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors justify-center"
            >
              <Plus size={14} /> Add Business Outcome
            </button>
          ) : (
            <AddRootEntityForm onClose={() => setShowAddForm(false)} />
          )
        }
        storageKey="pa-view-mode"
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export function EntityView() {
  const { currentEntityId, updateEntity, deleteEntity, dropEntityCascade } = useAppStore();
  const productLine = useProductLine();
  const { entities } = productLine;
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [confirmDeleteEntity, setConfirmDeleteEntity] = useState(false);
  const [confirmDrop, setConfirmDrop] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [editingTitle]);

  // Reset confirmations when entity changes
  useEffect(() => {
    setConfirmDeleteEntity(false);
    setConfirmDrop(false);
  }, [currentEntityId]);

  if (!currentEntityId) return <RootView />;

  const entity = getEntity(entities, currentEntityId);
  if (!entity) return <RootView />;

  const levelMeta = LEVEL_META[entity.level];
  const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];
  const hasBlocks = entity.blocks.length > 0;

  return (
    <div className="px-[var(--spacing-page-px)] py-[var(--spacing-page-py)] pb-28 flex flex-col gap-[var(--spacing-page-gap)]">
      <EntityBreadcrumb />

      {/* File-shaped entity detail — collapsible */}
      <div>
        {/* Tab */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 border border-b-0 rounded-t-lg",
          levelMeta.bgTint, levelMeta.borderTint
        )}>
          <span className={cn("text-[10px] font-semibold uppercase tracking-widest", levelMeta.accentColor)}>
            {levelMeta.label}
          </span>
          <StatusPicker status={entity.status} onChange={(s) => {
            if (s === 'dropped' && entity.children.length > 0) {
              setConfirmDrop(true);
            } else {
              updateEntity(entity.id, { status: s });
            }
          }} />
          <AIActionsMenu entity={entity} entities={entities} productLine={productLine} />
          {entity.children.length === 0 && (
            confirmDeleteEntity ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => { deleteEntity(entity.id); setConfirmDeleteEntity(false); }}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDeleteEntity(false)}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteEntity(true)}
                title="Delete entity"
                className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )
          )}
        </div>

        {/* Cascade drop warning */}
        {confirmDrop && (
          <div className="inline-flex items-center gap-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-b-lg rounded-tr-lg text-sm">
            <span className="text-red-600 dark:text-red-400 text-xs">
              This will also drop all {entity.children.length} {entity.children.length === 1 ? 'child' : 'children'}. Continue?
            </span>
            <button
              onClick={() => { dropEntityCascade(entity.id); setConfirmDrop(false); }}
              className="cursor-pointer text-[10px] font-medium px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
            >
              Drop all
            </button>
            <button
              onClick={() => setConfirmDrop(false)}
              className="cursor-pointer text-[10px] font-medium px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Body */}
        <div className="rounded-xl rounded-tl-none border border-border-default bg-background flex flex-col">
          {/* Always-visible: toggle header + title + description preview */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(!expanded)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
            className="cursor-pointer text-left w-full px-[var(--spacing-entity-px)] py-[var(--spacing-entity-py)] flex flex-col gap-[var(--spacing-entity-gap)] group/collapse"
          >
            <div className="flex items-center gap-2.5">
              {/* Collapse/expand chevron — left side, before icon */}
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="shrink-0 w-5 h-5 rounded flex items-center justify-center bg-surface-2 border border-border-subtle group-hover/collapse:bg-surface-3 group-hover/collapse:border-border-default transition-all"
              >
                <ChevronRight size={12} className="text-muted-foreground/50 group-hover/collapse:text-muted-foreground transition-colors" />
              </motion.div>
              {IconComponent && (
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", levelMeta.iconBg)}>
                  <IconComponent size={16} className={levelMeta.accentColor} />
                </div>
              )}
              {editingTitle ? (
                <div className="flex flex-col flex-1 gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={titleInputRef}
                    value={titleDraft}
                    maxLength={120}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { if (titleDraft.trim()) updateEntity(entity.id, { title: titleDraft.trim() }); setEditingTitle(false); }
                      if (e.key === "Escape") setEditingTitle(false);
                      if (e.key === " ") e.stopPropagation();
                    }}
                    onBlur={() => { if (titleDraft.trim()) updateEntity(entity.id, { title: titleDraft.trim() }); setEditingTitle(false); }}
                    className="text-xl font-semibold text-foreground bg-surface-hover border border-border-strong rounded-lg px-2 py-1 focus:outline-none focus:border-border-focus"
                  />
                  <div className={cn("text-right text-[10px] px-1",
                    titleDraft.length >= 120 ? "text-red-500 dark:text-red-400" :
                    titleDraft.length >= 102 ? "text-amber-500 dark:text-amber-400" :
                    "text-muted-foreground/40"
                  )}>
                    {titleDraft.length}/120
                  </div>
                </div>
              ) : (
                <h1 className="text-xl font-semibold text-foreground flex-1 flex items-center gap-2">
                  {entity.title}
                  <button
                    onClick={(e) => { e.stopPropagation(); setTitleDraft(entity.title); setEditingTitle(true); }}
                    className="cursor-pointer text-muted-foreground/30 opacity-0 group-hover/collapse:opacity-100 hover:text-muted-foreground transition-all shrink-0"
                    title="Edit title"
                  >
                    <Pencil size={13} />
                  </button>
                </h1>
              )}
              {PERSONA_LEVELS.has(entity.level) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <PersonaPicker entityId={entity.id} personaId={entity.personaId} secondaryPersonaIds={entity.secondaryPersonaIds} />
                  {MULTI_PERSONA_LEVELS.has(entity.level) && entity.personaId && (
                    <SecondaryPersonaPicker
                      entityId={entity.id}
                      secondaryPersonaIds={entity.secondaryPersonaIds ?? []}
                      excludePersonaId={entity.personaId}
                    />
                  )}
                </div>
              )}
              {entity.level === "assumption" && (
                <AssumptionTypePicker entityId={entity.id} assumptionType={entity.assumptionType} />
              )}
              {entity.level === "test" && (
                <TestTypePicker entityId={entity.id} testType={entity.testType} />
              )}
            </div>

            <p className="text-xs text-muted-foreground/60 italic">
              {levelMeta.description}
            </p>

            {/* Collapsed description preview */}
            {!expanded && entity.description && (
              <div className="relative">
                <div className="text-[length:var(--text-body)] text-foreground/80 leading-[var(--text-body-leading)] line-clamp-3">
                  <MarkdownBlock content={entity.description} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            )}

            {/* Collapsed metric card for BO/PO */}
            {!expanded && (entity.level === "business_outcome" || entity.level === "product_outcome") && (() => {
              const metricBlock = entity.blocks.find(b => b.type === "metric") as MetricBlock | undefined;
              return metricBlock ? (
                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <MetricCard block={metricBlock} entityLevel={entity.level} />
                </div>
              ) : null;
            })()}

            {/* Collapsed hint: block count */}
            {!expanded && hasBlocks && (
              <span className="text-[11px] text-muted-foreground/40">
                {entity.blocks.length} content block{entity.blocks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="px-[var(--spacing-content-px)] pb-[var(--spacing-content-py)] flex flex-col gap-[var(--spacing-content-gap)] border-t border-border-subtle pt-[var(--spacing-content-py)]">
                  {entity.level === "opportunity" ? (
                    <>
                      {/* Description + ICE side-by-side */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-[60%] min-w-0 text-[length:var(--text-body)] text-foreground/80 leading-[var(--text-body-leading)]">
                          <EditableText
                            value={entity.description}
                            onSave={(v) => updateEntity(entity.id, { description: v })}
                            as="textarea"
                            placeholder="Add a description..."
                            maxLength={800}
                          />
                        </div>
                        <IceScorePanel entityId={entity.id} iceScore={entity.iceScore} />
                      </div>
                      {/* Blocks (without description, already shown above) */}
                      {entity.blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block} entityId={entity.id} entityLevel={entity.level} />
                      ))}
                      <AddBlockButton entityId={entity.id} />
                    </>
                  ) : (
                    <BlockList entity={entity} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Children grid */}
      <ChildrenGrid entity={entity} />
    </div>
  );
}
