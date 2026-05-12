import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_PRODUCT_LINE_ID } from "./schemas";
import type { Entity, Block, MetricBlock, ProductLine, DiscoveryTree, Persona, AssumptionType, TestType, IceScore, EntityStatus, Signal } from "./schemas";
import { analyticsEmitter, type AnalyticsEventMap } from "./analytics-events";
import { getDescendantIds } from "./utils";

export interface AppStore {
  // Data
  productLines: Record<string, ProductLine>;

  // UI state
  currentProductLineId: string;
  currentEntityId: string | null;
  isHydrated: boolean;
  sidebarOpen: boolean;
  viewMode: "discovery" | "metric-tree";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewMode: (mode: "discovery" | "metric-tree") => void;
  personaPanelOpen: boolean;
  personaPanelId: string | null;
  openPersonaPanel: (id?: string) => void;
  closePersonaPanel: () => void;
  storyDetailOpen: boolean;
  storyDetailSolutionId: string | null;
  storyDetailStoryId: string | null;
  openStoryDetail: (solutionId: string, storyId: string) => void;
  closeStoryDetail: () => void;
  setStoryDone: (solutionId: string, storyId: string, done: boolean) => void;
  addStoryToCell: (
    solutionId: string,
    cell: { activity: string; task: string; iteration: import("./schemas").StoryIteration; persona: string },
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
  reparentSignal: (
    signalId: string,
    target: { poId: string; parentSignalId?: string },
  ) => void;

  // Product Line CRUD
  addProductLine: (pl: ProductLine) => void;
  updateProductLine: (id: string, updates: Partial<Pick<ProductLine, "name" | "description" | "status" | "codePath">>) => void;
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
  recordMetricValue: (entityId: string, blockId: string, date: string, value: number) => void;

  // Signal CRUD (product_outcome entities)
  addSignal: (entityId: string, signal: Signal) => void;
  updateSignal: (entityId: string, signalId: string, updates: Partial<Pick<Signal, "name" | "frequency" | "valueFormat" | "status">>) => void;
  removeSignal: (entityId: string, signalId: string) => void;
  recordSignalValue: (entityId: string, signalId: string, date: string, value: number) => void;
  reorderSignals: (entityId: string, signalIds: string[]) => void;

  // Product Line Block CRUD
  addProductLineBlock: (plId: string, block: Block) => void;
  updateProductLineBlock: (plId: string, blockId: string, updates: Partial<Block>) => void;
  removeProductLineBlock: (plId: string, blockId: string) => void;
  recordProductLineMetricValue: (plId: string, blockId: string, date: string, value: number) => void;

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

export const useAppStore = create<AppStore>()(subscribeWithSelector(immer((set, get) => ({
  productLines: {} as Record<string, ProductLine>,
  currentProductLineId: DEFAULT_PRODUCT_LINE_ID,
  currentEntityId: null,
  isHydrated: false,
  sidebarOpen: true,
  viewMode: "discovery" as "discovery" | "metric-tree",
  toggleSidebar: () => set((draft) => { draft.sidebarOpen = !draft.sidebarOpen; }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setViewMode: (mode) => set((draft) => {
    draft.viewMode = mode;
    draft.currentEntityId = null;
    draft.sidebarOpen = mode === "discovery";
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
              if (!entity.signals) entity.signals = [];
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
                }
              }
            }
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
    set({ currentProductLineId: id, currentEntityId: null, personaPanelOpen: false, personaPanelId: null, viewMode: "discovery", sidebarOpen: true, storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null });
  },
  navigateTo: (id) => set({ currentEntityId: id, storyDetailOpen: false, storyDetailSolutionId: null, storyDetailStoryId: null }),
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
  }),

  reparentSignal: (signalId, target) => set((draft) => {
    const pl = draft.productLines[draft.currentProductLineId];
    if (!pl) return;
    const targetPo = pl.entities[target.poId];
    if (!targetPo || targetPo.level !== "product_outcome") return;

    // Find the PO currently holding the signal
    let currentPoId: string | undefined;
    for (const [eid, e] of Object.entries(pl.entities)) {
      if ((e.signals ?? []).some((s) => s.id === signalId)) {
        currentPoId = eid;
        break;
      }
    }
    if (!currentPoId) return;
    const currentPo = pl.entities[currentPoId];
    const currentSignals = currentPo.signals ?? [];
    const signal = currentSignals.find((s) => s.id === signalId);
    if (!signal) return;

    // Compute descendants of the signal (within its current PO)
    const descendants = new Set<string>();
    const queue = [signalId];
    while (queue.length) {
      const id = queue.shift()!;
      for (const s of currentSignals) {
        if (s.parentSignalId === id && !descendants.has(s.id)) {
          descendants.add(s.id);
          queue.push(s.id);
        }
      }
    }

    // Validate parent-signal target
    if (target.parentSignalId) {
      if (target.parentSignalId === signalId) return;
      // Only meaningful if target signal is in target PO
      const targetSignals = targetPo.signals ?? [];
      const targetParent = targetSignals.find((s) => s.id === target.parentSignalId);
      if (!targetParent) return;
      // Cycle check — only applies if same PO (cross-PO moves carry descendants along, so no cycle possible)
      if (currentPoId === target.poId && descendants.has(target.parentSignalId)) return;
    }

    // No-op
    if (
      currentPoId === target.poId &&
      (signal.parentSignalId ?? undefined) === (target.parentSignalId ?? undefined)
    ) return;

    if (currentPoId === target.poId) {
      // Same-PO move: just reassign parentSignalId
      signal.parentSignalId = target.parentSignalId;
      return;
    }

    // Cross-PO move: carry the full subtree along
    const movedIds = new Set<string>([signalId, ...descendants]);
    const moved = currentSignals.filter((s) => movedIds.has(s.id));
    currentPo.signals = currentSignals.filter((s) => !movedIds.has(s.id));
    const movedRoot = moved.find((s) => s.id === signalId);
    if (movedRoot) movedRoot.parentSignalId = target.parentSignalId;
    if (!targetPo.signals) targetPo.signals = [];
    targetPo.signals.push(...moved);
  }),

  addProductLine: (pl) => {
    set((draft) => {
      draft.productLines[pl.id] = pl;
      draft.currentProductLineId = pl.id;
      draft.currentEntityId = null;
    });
    analyticsEmitter.emit("Product Line Created", {
      status: pl.status,
      has_personas: (pl.personas ?? []).length > 0,
      persona_count: (pl.personas ?? []).length,
    });
  },

  updateProductLine: (id, updates) =>
    set((draft) => {
      const pl = draft.productLines[id];
      if (!pl) return;
      Object.assign(pl, updates);
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

  recordMetricValue: (entityId, blockId, date, value) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      const block = pl.entities[entityId].blocks.find((b) => b.id === blockId);
      if (!block || block.type !== "metric") return;
      if (!block.dataSeries) block.dataSeries = [];
      const existing = block.dataSeries.find((dp) => dp.date === date);
      if (existing) {
        existing.value = value;
      } else {
        block.dataSeries.push({ date, value });
        block.dataSeries.sort((a, b) => a.date.localeCompare(b.date));
      }
    }),

  // ── Signal CRUD ──────────────────────────────────────────────────────

  addSignal: (entityId, signal) => {
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      if (!pl.entities[entityId].signals) pl.entities[entityId].signals = [];
      pl.entities[entityId].signals!.push(signal);
    });
    analyticsEmitter.emit("Signal Created", {
      frequency: signal.frequency,
      value_format: signal.valueFormat,
      signal_count: (() => {
        const pl = get().productLines[get().currentProductLineId];
        return (pl?.entities[entityId]?.signals ?? []).length;
      })(),
    });
  },

  updateSignal: (entityId, signalId, updates) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      const signal = (pl.entities[entityId].signals ?? []).find((s) => s.id === signalId);
      if (signal) Object.assign(signal, updates);
    }),

  removeSignal: (entityId, signalId) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      pl.entities[entityId].signals = (pl.entities[entityId].signals ?? []).filter((s) => s.id !== signalId);
    }),

  recordSignalValue: (entityId, signalId, date, value) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return;
      const signal = (pl.entities[entityId].signals ?? []).find((s) => s.id === signalId);
      if (!signal) return;
      const existing = signal.dataSeries.find((dp) => dp.date === date);
      if (existing) {
        existing.value = value;
      } else {
        signal.dataSeries.push({ date, value });
        signal.dataSeries.sort((a, b) => a.date.localeCompare(b.date));
      }
    }),

  reorderSignals: (entityId, signalIds) =>
    set((draft) => {
      const pl = draft.productLines[draft.currentProductLineId];
      if (!pl?.entities[entityId]?.signals) return;
      const signalMap = new Map(pl.entities[entityId].signals!.map((s) => [s.id, s]));
      pl.entities[entityId].signals = signalIds.map((id) => signalMap.get(id)!).filter(Boolean);
    }),

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

  recordProductLineMetricValue: (plId, blockId, date, value) =>
    set((draft) => {
      const pl = draft.productLines[plId];
      if (!pl?.blocks) return;
      const block = pl.blocks.find((b) => b.id === blockId) as MetricBlock | undefined;
      if (!block || block.type !== "metric") return;
      if (!block.dataSeries) block.dataSeries = [];
      const existing = block.dataSeries.find((dp) => dp.date === date);
      if (existing) {
        existing.value = value;
      } else {
        block.dataSeries.push({ date, value });
        block.dataSeries.sort((a, b) => a.date.localeCompare(b.date));
      }
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
