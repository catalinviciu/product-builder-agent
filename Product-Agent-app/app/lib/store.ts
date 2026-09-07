import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_PRODUCT_LINE_ID, DEFAULT_PRODUCT_LINE_SETTINGS, metricTypeForLevel, createBlockTemplate } from "./schemas";
import type { Entity, Block, ProductLine, ProductLineSettings, DiscoveryTree, Persona, AssumptionType, TestType, IceScore, EntityStatus, Metric, EntityLevel } from "./schemas";
import {
  migrateProductLineToMetrics,
  getMetric,
  getChildMetrics,
  outcomeForMetric,
  activeOutcomeForMetric,
  nearestOutcomeAncestor,
  canParentMetric,
  syncOutcomeParentage,
  placeOutcome,
  upsertDataPoint,
  createMetric,
  levelForMetric,
  type NewMetricInput,
} from "./metrics";
import type { SettingsFieldKey } from "./settings-redirect";
import { analyticsEmitter, type AnalyticsEventMap } from "./analytics-events";
import { getDescendantIds } from "./utils";
import { getStoryMapConfig } from "./story-map-config";
import { writeTreeFocus } from "./tree-focus-memory";

export interface AppStore {
  // Data
  productLines: Record<string, ProductLine>;

  // UI state
  currentProductLineId: string;
  currentEntityId: string | null;
  isHydrated: boolean;
  sidebarOpen: boolean;
  viewMode: "discovery" | "metric-tree";
  /**
   * A metric the tree should scroll to and centre on. UI-only, cleared as soon
   * as the tree has scrolled, so it never fires twice.
   */
  focusedMetricId: string | null;
  focusMetric: (metricId: string) => void;
  clearFocusedMetric: () => void;
  /**
   * The metric the tree is currently "zoomed" into — sticky across
   * navigation and persisted per product line so the tree reopens where the
   * builder left it. Distinct from `focusedMetricId`, which is a one-shot
   * scroll trigger.
   */
  treeFocusMetricId: string | null;
  setTreeFocus: (metricId: string | null) => void;
  clearTreeFocus: () => void;
  /** Switch to the metric tree and centre it on one metric. */
  openMetricTreeAt: (metricId: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewMode: (mode: "discovery" | "metric-tree") => void;
  settingsOpen: boolean;
  settingsTab: "product-line" | "appearance";
  openSettings: (source: "creation" | "header-link") => void;
  closeSettings: () => void;
  setSettingsTab: (tab: "product-line" | "appearance") => void;
  settingsRedirect: {
    actionName: string;
    missingFields: SettingsFieldKey[];
    returnEntityId: string | null;
  } | null;
  openSettingsWithRedirect: (plId: string, redirect: { actionName: string; missingFields: SettingsFieldKey[]; returnEntityId: string | null }) => void;
  exitSettingsRedirect: () => void;
  personaPanelOpen: boolean;
  personaPanelId: string | null;
  openPersonaPanel: (id?: string) => void;
  closePersonaPanel: () => void;
  storyDetailOpen: boolean;
  storyDetailSolutionId: string | null;
  storyDetailStoryId: string | null;
  openStoryDetail: (solutionId: string, storyId: string) => void;
  closeStoryDetail: () => void;
  navigateStoryDetail: (storyId: string) => void;
  setStoryDone: (solutionId: string, storyId: string, done: boolean) => void;
  addStoryToCell: (
    solutionId: string,
    cell: { activity: string; task: string; iteration: import("./schemas").StoryIteration; persona: string; taskType: "user" | "system" },
    title: string
  ) => string | null;

  // Persistence
  hydrate: () => Promise<void>;
  resetData: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;

  // Navigation
  switchProductLine: (id: string) => void;
  navigateTo: (id: string | null) => void;
  navigateUp: () => void;
  navigateToChild: (childId: string) => void;
  navigateFromMetricTree: (entityId: string) => void;
  reparentEntity: (entityId: string, newParentId: string) => void;

  // Product Line CRUD
  addProductLine: (pl: ProductLine) => void;
  updateProductLine: (id: string, updates: Partial<Pick<ProductLine, "name" | "description" | "status">>) => void;
  updateProductLineSettings: (id: string, patch: Partial<ProductLineSettings>) => void;
  updateTree: (plId: string, updates: Partial<Pick<DiscoveryTree, "title" | "description" | "rootChildren">>) => void;
  deleteProductLine: (id: string) => void;
  addRootEntity: (entity: Entity) => void;

  // Entity CRUD
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  addChildEntity: (parentId: string, entity: Entity) => void;
  deleteEntity: (id: string) => void;
  dropEntityCascade: (id: string) => void;
  setEntityStatus: (id: string, status: EntityStatus) => void;

  // Block CRUD
  addBlock: (entityId: string, block: Block) => void;
  updateBlock: (entityId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (entityId: string, blockId: string) => void;

  // Metric CRUD — metrics belong to the product line, not to an entity
  addMetric: (input: NewMetricInput) => string | null;
  updateMetric: (metricId: string, updates: Partial<Pick<Metric, "name" | "metricType" | "frequency" | "valueFormat" | "status" | "initialValue" | "numericTarget" | "startDate" | "endDate">>) => void;
  removeMetric: (metricId: string) => void;
  reparentMetric: (metricId: string, newParentMetricId: string | undefined) => void;
  recordMetricValue: (metricId: string, date: string, value: number) => void;
  reorderMetrics: (parentMetricId: string | undefined, metricIds: string[]) => void;

  // Outcome <-> metric linking
  attachOutcome: (metricId: string, entityId: string) => void;
  detachOutcome: (entityId: string) => void;
  createOutcomeForMetric: (metricId: string, title: string) => string | null;

  // Product Line Block CRUD
  addProductLineBlock: (plId: string, block: Block) => void;
  updateProductLineBlock: (plId: string, blockId: string, updates: Partial<Block>) => void;
  removeProductLineBlock: (plId: string, blockId: string) => void;

  // Persona CRUD
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, updates: Partial<Pick<Persona, "name" | "description">>) => void;
  deletePersona: (id: string) => void;
  assignPersona: (entityId: string, personaId: string | undefined) => void;
  assignSecondaryPersonas: (entityId: string, personaIds: string[]) => void;
  assignAssumptionType: (entityId: string, assumptionType: AssumptionType | undefined) => void;
  assignTestType: (entityId: string, testType: TestType | undefined) => void;
  updateIceScore: (entityId: string, iceScore: IceScore) => void;
}

// Debounced save to /api/store
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSavedAt = 0;
let pollingInterval: ReturnType<typeof setInterval> | null = null;

function debouncedSave(productLines: Record<string, ProductLine>) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productLines),
    }).then(() => {
      lastSavedAt = Date.now();
    }).catch((err) => {
      console.warn("[ProductAgent] Failed to save data:", err);
    });
  }, 500);
}

/** Strips the fields an outcome contributed, leaving a plain tracked metric. */
function clearMetricTarget(metric: Metric): void {
  metric.numericTarget = undefined;
  metric.endDate = undefined;
  metric.legacyTargetValue = undefined;
  metric.legacyTimeframe = undefined;
}

/** A new Business or Product Outcome arrives with a metric of its own. */
function seedOutcomeMetric(pl: ProductLine, entity: Entity, parentMetricId: string | undefined): void {
  if (entity.level !== "business_outcome" && entity.level !== "product_outcome") return;
  if (entity.metricId) return;
  const metric = createMetric(`metric-${entity.id}`, {
    name: "Key metric",
    metricType: metricTypeForLevel(entity.level),
    parentMetricId,
  });
  pl.metrics ??= [];
  pl.metrics.push(metric);
  entity.metricId = metric.id;
}

export const useAppStore = create<AppStore>()(subscribeWithSelector(immer((set, get) => ({
  productLines: {} as Record<string, ProductLine>,
  currentProductLineId: DEFAULT_PRODUCT_LINE_ID,
  currentEntityId: null,
  isHydrated: false,
  sidebarOpen: true,
  viewMode: "discovery" as "discovery" | "metric-tree",
  focusedMetricId: null as string | null,
  focusMetric: (metricId) => set({ focusedMetricId: metricId }),
  clearFocusedMetric: () => set({ focusedMetricId: null }),
  treeFocusMetricId: null as string | null,
  setTreeFocus: (metricId) => {
    set({ treeFocusMetricId: metricId });
    writeTreeFocus(get().currentProductLineId, metricId);
  },
  // No memory write here: null means "go back to root", and the tree
  // re-resolves to the root metric itself when it sees a null focus.
  clearTreeFocus: () => set({ treeFocusMetricId: null }),
  openMetricTreeAt: (metricId) => set((draft) => {
    draft.viewMode = "metric-tree";
    draft.currentEntityId = null;
    draft.sidebarOpen = false;
    draft.focusedMetricId = metricId;
    // Immer draft can't call setTreeFocus (it's a plain set-based action), so
    // only the in-memory field is updated here. The localStorage write
    // happens the next time the builder focuses a metric from the tree view.
    draft.treeFocusMetricId = metricId;
  }),
  toggleSidebar: () => set((draft) => { draft.sidebarOpen = !draft.sidebarOpen; }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setViewMode: (mode) => set((draft) => {
    draft.viewMode = mode;
    draft.focusedMetricId = null;
    draft.currentEntityId = null;
    draft.sidebarOpen = mode === "discovery";
  }),
  settingsOpen: false,
  settingsTab: "product-line",
  openSettings: (source) => {
    set({ settingsOpen: true, settingsTab: "product-line", currentEntityId: null });
    analyticsEmitter.emit("SettingsPageOpened", { source, productLineId: get().currentProductLineId });
  },
  closeSettings: () => set({ settingsOpen: false, settingsRedirect: null }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
  settingsRedirect: null,
  openSettingsWithRedirect: (plId, redirect) => set((draft) => {
    if (plId !== draft.currentProductLineId) {
      draft.currentProductLineId = plId;
      // The focused metric belongs to the line we are leaving, so drop it and let
      // the tree re-resolve from the new line's own memory.
      draft.treeFocusMetricId = null;
      if (typeof window !== "undefined") localStorage.setItem("pa-current-pl", plId);
    }
    draft.settingsOpen = true;
    draft.settingsTab = "product-line";
    draft.currentEntityId = null;
    draft.settingsRedirect = redirect;
  }),
  exitSettingsRedirect: () => set((draft) => {
    const returnId = draft.settingsRedirect?.returnEntityId ?? null;
    draft.settingsRedirect = null;
    draft.settingsOpen = false;
    draft.currentEntityId = returnId;
  }),
  personaPanelOpen: false,
  personaPanelId: null,
  openPersonaPanel: (id) => set({ personaPanelOpen: true, personaPanelId: id ?? null }),
  closePersonaPanel: () => set({ personaPanelOpen: false, personaPanelId: null }),
  storyDetailOpen: false,
  storyDetailSolutionId: null,
  storyDetailStoryId: null,
  openStoryDetail: (solutionId, storyId) => set({ storyDetailOpen: true, storyDetailSolutionId: solutionId, storyDetailStoryId: storyId }),
  closeStoryDetail: () => set({ storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null }),
  navigateStoryDetail: (storyId) => set({ storyDetailStoryId: storyId }),
  setStoryDone: (solutionId, storyId, done) => {
    let iterationKind: "ws" | "enh" | "ga" | null = null;
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      const solution = pl?.entities[solutionId];
      const story = solution?.stories?.find((s) => s.id === storyId);
      if (!story) return;
      story.done = done;
      story.doneAt = done ? new Date().toISOString() : undefined;
      iterationKind = story.iteration.kind;
    });
    if (iterationKind) {
      analyticsEmitter.emit("story_marked_done", {
        solution_id: solutionId,
        story_id: storyId,
        done,
        iteration_kind: iterationKind,
      });
    }
  },

  addStoryToCell: (solutionId, cell, title) => {
    const trimmed = title.trim();
    if (!trimmed) return null;

    let newId: string | null = null;
    let emitKind: 'ws' | 'enh' | 'ga' | null = null;

    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      const solution = pl?.entities[solutionId];
      if (!solution || solution.level !== 'solution') return;
      if (!solution.stories) solution.stories = [];

      let max = 0;
      for (const s of solution.stories) {
        const m = /^story-(\d+)$/.exec(s.id);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > max) max = n;
        }
      }
      const id = `story-${max + 1}`;

      solution.stories.push({
        id,
        title: trimmed,
        persona: cell.persona,
        activity: cell.activity,
        task: cell.task,
        iteration: cell.iteration,
        taskType: cell.taskType,
      });

      newId = id;
      emitKind = cell.iteration.kind;
    });

    if (newId && emitKind) {
      analyticsEmitter.emit('story_added_manually', {
        solution_id: solutionId,
        iteration_kind: emitKind,
      });
    }

    return newId;
  },

  hydrate: async () => {
    const maxRetries = 3;
    const retryDelay = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.exists && json.data) {
          const data = json.data as Record<string, ProductLine>;
          const savedPlId = typeof window !== "undefined" ? localStorage.getItem("pa-current-pl") : null;
          const currentProductLineId = savedPlId && data[savedPlId] ? savedPlId : Object.keys(data)[0] || DEFAULT_PRODUCT_LINE_ID;
          if (json.mtime) lastSavedAt = json.mtime;
          // Backfill statusHistory for existing entities that predate this field
          const todayIso = new Date().toISOString().slice(0, 10);
          for (const pl of Object.values(data)) {
            if (!pl.blocks) pl.blocks = [];
            for (const entity of Object.values(pl.entities)) {
              if (!entity.statusHistory) {
                entity.statusHistory = [{ status: entity.status, date: todayIso }];
              }
              if (entity.level === "solution" && !entity.stories) entity.stories = [];
              // Migrate iteration string enum → structured { kind, label }
              if (entity.stories) {
                for (const story of entity.stories) {
                  const iter = story.iteration as unknown;
                  if (typeof iter === "string") {
                    if (iter === "WS") story.iteration = { kind: "ws", label: "Walking Skeleton" };
                    else if (iter === "Enh") story.iteration = { kind: "enh", label: "Enhancement" };
                    else if (iter === "GA") story.iteration = { kind: "ga", label: "GA" };
                  }
                  // Backfill taskType for stories that pre-date the field
                  if (story.taskType === undefined) {
                    story.taskType = story.persona === "System" ? "system" : "user";
                  }
                }
              }
            }
          }
          // Backfill settings for product lines that predate this field
          for (const pl of Object.values(data)) {
            if (!pl.settings) {
              pl.settings = {
                ...DEFAULT_PRODUCT_LINE_SETTINGS,
                codebasePath: pl.codePath?.trim() ? pl.codePath.trim() : null,
              };
            }
            // Migrate legacy skillPath → skillName
            if (pl.settings.designSystem?.mode === "skill") {
              const ds = pl.settings.designSystem as unknown as { mode: "skill"; skillPath?: string | null; skillName?: string | null };
              if ("skillPath" in ds && ds.skillPath !== undefined) {
                pl.settings.designSystem = { mode: "skill", skillName: ds.skillPath ?? null };
              }
            }
            // Backfill missing otherName on manual analytics
            if (pl.settings.analyticsPlatform?.mode === "manual") {
              const ap = pl.settings.analyticsPlatform as { mode: "manual"; platform: string | null; otherName?: string | null };
              if (!("otherName" in ap)) {
                ap.otherName = null;
              }
            }
            // Backfill detectionError (added Story 3)
            pl.settings.detectionError ??= null;
            // Backfill storyMap.enabled for product lines with a known story map config
            if (getStoryMapConfig(pl.id)) {
              pl.settings.storyMap.enabled = true;
            }
            // Lift pre-v2 metric blocks and signals into the metric registry
            migrateProductLineToMetrics(pl);
            pl.metrics ??= [];
          }
          set({ productLines: data, currentProductLineId, isHydrated: true });
          return;
        }
        break;
      } catch {
        if (attempt < maxRetries) {
          console.warn(`[ProductAgent] Hydration fetch failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
          await new Promise(r => setTimeout(r, retryDelay));
          continue;
        }
        console.warn("[ProductAgent] Hydration failed after all retries");
      }
    }
    set({ isHydrated: true });
  },

  resetData: async () => {
    try { await fetch("/api/store", { method: "DELETE" }); } catch {}
    try {
      const res = await fetch("/api/store");
      const json = await res.json();
      if (json.exists && json.data) {
        set({ productLines: json.data, currentProductLineId: DEFAULT_PRODUCT_LINE_ID, currentEntityId: null });
        return;
      }
    } catch {}
    set({ productLines: {}, currentProductLineId: DEFAULT_PRODUCT_LINE_ID, currentEntityId: null });
  },

  switchProductLine: (id) => {
    if (typeof window !== "undefined") localStorage.setItem("pa-current-pl", id);
    set({ currentProductLineId: id, currentEntityId: null, personaPanelOpen: false, personaPanelId: null, viewMode: "discovery", sidebarOpen: true, storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null, focusedMetricId: null, treeFocusMetricId: null });
  },
  navigateTo: (id) => set({ currentEntityId: id, storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null, settingsOpen: false }),
  navigateUp: () =>
    set((draft) => {
      if (!draft.currentEntityId) return;
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) { draft.currentEntityId = null; return; }
      const entity = pl.entities[draft.currentEntityId];
      draft.currentEntityId = entity ? (entity.parentId || null) : null;
    }),
  navigateToChild: (childId) => set({ currentEntityId: childId, storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null }),

  navigateFromMetricTree: (entityId) => set((draft) => {
    draft.viewMode = "discovery";
    draft.currentEntityId = entityId;
    draft.sidebarOpen = true;
  }),

  reparentEntity: (entityId, newParentId) => set((draft) => {
    const pl = draft.productLines[draft.currentProductLineId];
    if (!pl) return;
    const entity = pl.entities[entityId];
    const newParent = pl.entities[newParentId];
    if (!entity || !newParent) return;
    if (entity.parentId === newParentId) return;
    // Cycle prevention: can't reparent to self or a descendant
    const descendants = getDescendantIds(pl.entities, entityId);
    if (entityId === newParentId || descendants.includes(newParentId)) return;
    // Remove from old parent
    const oldParentId = entity.parentId;
    if (oldParentId && pl.entities[oldParentId]) {
      pl.entities[oldParentId].children = pl.entities[oldParentId].children.filter((id) => id !== entityId);
    } else {
      pl.tree.rootChildren = pl.tree.rootChildren.filter((id) => id !== entityId);
    }
    // Add to new parent
    newParent.children.push(entityId);
    entity.parentId = newParentId;

    // Keep the metric tree locked to the discovery tree: an outcome that moves
    // takes its metric with it, landing under the new parent's metric.
    if (entity.metricId) {
      const metric = pl.metrics?.find((m) => m.id === entity.metricId);
      if (metric && canParentMetric(pl, entity.metricId, newParent.metricId)) {
        metric.parentMetricId = newParent.metricId;
      }
    }
  }),

  reparentMetric: (metricId, newParentMetricId) => set((draft) => {
    const pl = draft.productLines[draft.currentProductLineId];
    if (!pl) return;
    const metric = getMetric(pl, metricId);
    if (!metric) return;
    if ((metric.parentMetricId ?? undefined) === (newParentMetricId ?? undefined)) return;
    if (!canParentMetric(pl, metricId, newParentMetricId)) return;
    metric.parentMetricId = newParentMetricId;
    syncOutcomeParentage(pl, metricId);
  }),

  addProductLine: (pl) => {
    const plWithSettings = { ...pl, settings: pl.settings ?? DEFAULT_PRODUCT_LINE_SETTINGS };
    set((draft) => {
      draft.productLines[plWithSettings.id] = plWithSettings;
      draft.currentProductLineId = plWithSettings.id;
      draft.currentEntityId = null;
    });
    analyticsEmitter.emit("Product Line Created", {
      status: plWithSettings.status,
      has_personas: (plWithSettings.personas ?? []).length > 0,
      persona_count: (plWithSettings.personas ?? []).length,
    });
    // Open settings so user lands on Settings page after creation
    analyticsEmitter.emit("SettingsPageOpened", { source: "creation", productLineId: plWithSettings.id });
    set({ settingsOpen: true, settingsTab: "product-line", currentEntityId: null });
  },

  updateProductLine: (id, updates) =>
    set((draft) => {
      const pl = draft.productLines[id];
      if (!pl) return;
      Object.assign(pl, updates);
    }),

  updateProductLineSettings: (id, patch) =>
    set((draft) => {
      const pl = draft.productLines[id];
      if (!pl) return;
      if (!pl.settings) pl.settings = { ...DEFAULT_PRODUCT_LINE_SETTINGS };
      const patchCopy = { ...patch };
      if ("codebasePath" in patchCopy && typeof patchCopy.codebasePath === "string") {
        const trimmed = patchCopy.codebasePath.trim();
        patchCopy.codebasePath = trimmed || null;
      }
      if (patchCopy.designSystem?.mode === "skill" && typeof (patchCopy.designSystem as { mode: string; skillName?: string }).skillName === "string") {
        const ds = patchCopy.designSystem as { mode: "skill"; skillName: string | null };
        const trimmed = (ds.skillName as string).trim();
        ds.skillName = trimmed || null;
      }
      if (patchCopy.analyticsPlatform?.mode === "manual" && typeof (patchCopy.analyticsPlatform as { mode: string; otherName?: string | null }).otherName === "string") {
        const ap = patchCopy.analyticsPlatform as { mode: "manual"; platform: string | null; otherName: string | null };
        const trimmed = (ap.otherName as string).trim();
        ap.otherName = trimmed || null;
      }
      Object.assign(pl.settings, patchCopy);
    }),

  updateTree: (plId, updates) =>
    set((draft) => {
      const pl = draft.productLines[plId];
      if (!pl) return;
      Object.assign(pl.tree, updates);
    }),

  deleteProductLine: (id) =>
    set((draft) => {
      const remaining = Object.keys(draft.productLines).filter((k) => k !== id);
      if (remaining.length === 0) return;
      delete draft.productLines[id];
      if (draft.currentProductLineId === id) {
        draft.currentProductLineId = remaining[0];
        draft.currentEntityId = null;
      }
    }),

  addRootEntity: (entity) => {
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      pl.tree.rootChildren.push(entity.id);
      pl.entities[entity.id] = entity;
      seedOutcomeMetric(pl, pl.entities[entity.id], undefined);
    });
    analyticsEmitter.emit("Entity Created", {
      entity_type: entity.level,
      status: entity.status,
      has_children: entity.children.length > 0,
      child_count: entity.children.length,
    });
  },

  updateEntity: (id, updates) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[id]) return;
      Object.assign(pl.entities[id], updates);
    }),

  addChildEntity: (parentId, entity) => {
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[parentId]) return;
      pl.entities[parentId].children.push(entity.id);
      pl.entities[entity.id] = entity;
      seedOutcomeMetric(pl, pl.entities[entity.id], pl.entities[parentId].metricId);
    });
    const payload: AnalyticsEventMap["Entity Created"] = {
      entity_type: entity.level,
      status: entity.status,
      has_children: entity.children.length > 0,
      child_count: entity.children.length,
      ...(entity.level === "solution" && {
        assumption_count: 0,
        tests_total_count: 0,
        tests_done_count: 0,
      }),
    };
    analyticsEmitter.emit("Entity Created", payload);
  },

  deleteEntity: (id) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[id]) return;
      const entity = pl.entities[id];

      // Collect all descendant IDs before deleting
      const toDelete: string[] = [];
      const collectIds = (eid: string) => {
        toDelete.push(eid);
        const e = pl.entities[eid];
        if (e) e.children.forEach(collectIds);
      };
      collectIds(id);
      // Metrics outlive their outcomes. Clear the target the outcome set, keep
      // the name, the history and the children.
      for (const did of toDelete) {
        const metricId = pl.entities[did]?.metricId;
        if (!metricId) continue;
        const metric = pl.metrics?.find((m) => m.id === metricId);
        if (metric) clearMetricTarget(metric);
      }
      toDelete.forEach((did) => delete pl.entities[did]);

      // Remove from parent's children
      if (entity.parentId && pl.entities[entity.parentId]) {
        pl.entities[entity.parentId].children = pl.entities[entity.parentId].children.filter((cid) => cid !== id);
      }

      // Remove from tree rootChildren if applicable
      pl.tree.rootChildren = pl.tree.rootChildren.filter((rid) => rid !== id);

      if (draft.currentEntityId === id) {
        draft.currentEntityId = entity.parentId || null;
      }
    }),

  dropEntityCascade: (id) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[id]) return;
      const todayIso = new Date().toISOString().slice(0, 10);
      const cascade = (eid: string) => {
        const e = pl.entities[eid];
        if (!e) return;
        if (e.status !== "dropped") {
          e.status = "dropped";
          if (!e.statusHistory) e.statusHistory = [];
          e.statusHistory.push({ status: "dropped", date: todayIso });
        }
        e.children.forEach(cascade);
      };
      cascade(id);
    }),

  setEntityStatus: (id, status) => {
    const prev = get();
    const pl = prev.productLines[prev.currentProductLineId];
    const entity = pl?.entities[id];
    if (!entity || entity.status === status) return;

    set((draft) => {
      const draftPl = draft.productLines[draft.currentProductLineId];
      if (!draftPl?.entities[id]) return;
      draftPl.entities[id].status = status;
      if (!draftPl.entities[id].statusHistory) draftPl.entities[id].statusHistory = [];
      draftPl.entities[id].statusHistory!.push({
        status,
        date: new Date().toISOString().slice(0, 10),
      });
    });

    const payload: AnalyticsEventMap["Status Change"] = {
      entity_type: entity.level,
      from_status: entity.status,
      to_status: status,
      has_children: entity.children.length > 0,
      child_count: entity.children.length,
      ...(entity.level === "solution" && (() => {
        const children = entity.children
          .map((cid) => pl.entities[cid])
          .filter((e): e is Entity => e !== undefined);
        const tests = children.filter((c) => c.level === "test");
        return {
          assumption_count: children.filter((c) => c.level === "assumption").length,
          tests_total_count: tests.length,
          tests_done_count: tests.filter((t) => t.status === "done").length,
        };
      })()),
    };
    analyticsEmitter.emit("Status Change", payload);
  },

  addBlock: (entityId, block) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].blocks.push(block);
    }),

  updateBlock: (entityId, blockId, updates) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      const block = pl.entities[entityId].blocks.find((b) => b.id === blockId);
      if (block) Object.assign(block, updates);
    }),

  removeBlock: (entityId, blockId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].blocks = pl.entities[entityId].blocks.filter((b) => b.id !== blockId);
    }),

  // ── Metric CRUD ──────────────────────────────────────────────────────

  addMetric: (input) => {
    const id = `metric-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    let created = false;
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      if (input.parentMetricId && !getMetric(pl, input.parentMetricId)) return;
      pl.metrics ??= [];
      pl.metrics.push(createMetric(id, input));
      created = true;
    });
    if (!created) return null;
    analyticsEmitter.emit("Metric Created", {
      metric_type: input.metricType,
      is_root: !input.parentMetricId,
      frequency: input.frequency ?? "weekly",
    });
    return id;
  },

  updateMetric: (metricId, updates) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const metric = getMetric(pl, metricId);
      if (!metric) return;
      Object.assign(metric, updates);
      // A frequency change re-snaps the series onto the new period boundaries.
      if (updates.frequency) {
        const points = metric.dataSeries;
        metric.dataSeries = [];
        for (const dp of points) upsertDataPoint(metric, dp.date, dp.value);
      }
    }),

  removeMetric: (metricId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl?.metrics) return;
      const metric = getMetric(pl, metricId);
      if (!metric) return;
      // Children rise to take the removed metric's place rather than vanishing.
      for (const child of getChildMetrics(pl, metricId)) {
        child.parentMetricId = metric.parentMetricId;
      }
      const outcome = outcomeForMetric(pl, metricId);
      if (outcome) outcome.metricId = undefined;
      pl.metrics = pl.metrics.filter((m) => m.id !== metricId);
      if (metric.parentMetricId) syncOutcomeParentage(pl, metric.parentMetricId);
      else for (const root of pl.metrics.filter((m) => !m.parentMetricId)) syncOutcomeParentage(pl, root.id);
    }),

  recordMetricValue: (metricId, date, value) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const metric = getMetric(pl, metricId);
      if (!metric) return;
      upsertDataPoint(metric, date, value);
    }),

  reorderMetrics: (parentMetricId, metricIds) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl?.metrics) return;
      const order = new Map(metricIds.map((id, i) => [id, i]));
      const siblings = pl.metrics.filter((m) => (m.parentMetricId ?? undefined) === (parentMetricId ?? undefined));
      const others = pl.metrics.filter((m) => (m.parentMetricId ?? undefined) !== (parentMetricId ?? undefined));
      siblings.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
      pl.metrics = [...others, ...siblings];
    }),

  // ── Outcome <-> metric linking ───────────────────────────────────────

  attachOutcome: (metricId, entityId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const entity = pl.entities[entityId];
      const metric = getMetric(pl, metricId);
      if (!entity || !metric) return;
      if (entity.level !== "business_outcome" && entity.level !== "product_outcome") return;
      // One *active* outcome per metric. A finished one leaves the metric free.
      if (activeOutcomeForMetric(pl, metricId)) return;
      entity.metricId = metricId;
      placeOutcome(pl, entity, nearestOutcomeAncestor(pl, metricId)?.id);
      syncOutcomeParentage(pl, metricId);
    }),

  detachOutcome: (entityId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const entity = pl.entities[entityId];
      if (!entity?.metricId) return;
      const metric = getMetric(pl, entity.metricId);
      if (metric) clearMetricTarget(metric);
      entity.metricId = undefined;
    }),

  createOutcomeForMetric: (metricId, title) => {
    const id = `entity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    let level: EntityLevel | null = null;
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const metric = getMetric(pl, metricId);
      if (!metric || activeOutcomeForMetric(pl, metricId)) return;

      const outcomeLevel = levelForMetric(pl, metricId);
      const parent = nearestOutcomeAncestor(pl, metricId);
      const entity: Entity = {
        id,
        level: outcomeLevel,
        title: title.trim() || metric.name,
        icon: outcomeLevel === "business_outcome" ? "Target" : "TrendingUp",
        description: "",
        status: "draft",
        statusHistory: [{ status: "draft", date: new Date().toISOString().slice(0, 10) }],
        children: [],
        blocks: createBlockTemplate(outcomeLevel, id),
        metricId,
      };
      pl.entities[id] = entity;
      placeOutcome(pl, entity, parent?.id);
      syncOutcomeParentage(pl, metricId);
      level = outcomeLevel;
    });
    if (!level) return null;
    analyticsEmitter.emit("Entity Created", {
      entity_type: level,
      status: "draft",
      has_children: false,
      child_count: 0,
    });
    return id;
  },

  addProductLineBlock: (plId, block) =>
    set((draft) => {
      const pl = draft.productLines[plId];
      if (!pl) return;
      if (!pl.blocks) pl.blocks = [];
      pl.blocks.push(block);
    }),

  updateProductLineBlock: (plId, blockId, updates) =>
    set((draft) => {
      const pl = draft.productLines[plId];
      if (!pl?.blocks) return;
      const block = pl.blocks.find((b) => b.id === blockId);
      if (block) Object.assign(block, updates);
    }),

  removeProductLineBlock: (plId, blockId) =>
    set((draft) => {
      const pl = draft.productLines[plId];
      if (!pl?.blocks) return;
      pl.blocks = pl.blocks.filter((b) => b.id !== blockId);
    }),

  addPersona: (persona) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      if (!pl.personas) pl.personas = [];
      pl.personas.push(persona);
    }),

  updatePersona: (id, updates) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      const persona = (pl.personas ?? []).find((p) => p.id === id);
      if (persona) Object.assign(persona, updates);
    }),

  deletePersona: (id) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl) return;
      for (const entity of Object.values(pl.entities)) {
        if (entity.personaId === id) entity.personaId = undefined;
        if (entity.secondaryPersonaIds?.includes(id)) {
          entity.secondaryPersonaIds = entity.secondaryPersonaIds.filter((pid) => pid !== id);
        }
      }
      pl.personas = (pl.personas ?? []).filter((p) => p.id !== id);
    }),

  assignPersona: (entityId, personaId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      const entity = pl.entities[entityId];
      entity.personaId = personaId;
      if (personaId === undefined) entity.secondaryPersonaIds = [];
    }),

  assignSecondaryPersonas: (entityId, personaIds) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].secondaryPersonaIds = personaIds;
    }),

  assignAssumptionType: (entityId, assumptionType) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].assumptionType = assumptionType;
    }),

  assignTestType: (entityId, testType) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].testType = testType;
    }),

  updateIceScore: (entityId, iceScore) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].iceScore = iceScore;
    }),

  startPolling: () => {
    if (pollingInterval) return;
    pollingInterval = setInterval(async () => {
      if (!useAppStore.getState().isHydrated) return;
      if (saveTimer !== null) return; // our own save in-flight, skip
      try {
        const res = await fetch("/api/store/mtime");
        const { mtime } = await res.json();
        if (mtime > lastSavedAt + 1500) {
          // External write detected — skill wrote to store.json
          await useAppStore.getState().hydrate();
          lastSavedAt = Date.now();
        }
      } catch { /* ignore network errors */ }
    }, 3000);
  },

  stopPolling: () => {
    if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
  },
}))));

// Auto-save whenever productLines changes (after hydration)
useAppStore.subscribe(
  (state) => state.productLines,
  (productLines) => {
    if (useAppStore.getState().isHydrated) {
      debouncedSave(productLines);
    }
  }
);
