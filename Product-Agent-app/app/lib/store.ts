import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PRODUCT_LINES, DEFAULT_PRODUCT_LINE_ID } from "./mock-data";
import type { Entity, Block, ProductLine, DiscoveryTree, Persona, AssumptionType, TestType, IceScore } from "./schemas";

interface AppStore {
  // Data
  productLines: Record<string, ProductLine>;

  // UI state
  currentProductLineId: string;
  currentEntityId: string | null;
  isHydrated: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  personaPanelOpen: boolean;
  personaPanelId: string | null;
  openPersonaPanel: (id?: string) => void;
  closePersonaPanel: () => void;

  // Persistence
  hydrate: () => Promise<void>;
  resetData: () => Promise<void>;

  // Navigation
  switchProductLine: (id: string) => void;
  navigateTo: (id: string | null) => void;
  navigateUp: () => void;
  navigateToChild: (childId: string) => void;

  // Product Line CRUD
  addProductLine: (pl: ProductLine) => void;
  updateProductLine: (id: string, updates: Partial<Pick<ProductLine, "name" | "description" | "status">>) => void;
  updateTree: (plId: string, updates: Partial<Pick<DiscoveryTree, "title" | "description" | "rootChildren">>) => void;
  deleteProductLine: (id: string) => void;
  addRootEntity: (entity: Entity) => void;

  // Entity CRUD
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  addChildEntity: (parentId: string, entity: Entity) => void;
  deleteEntity: (id: string) => void;
  dropEntityCascade: (id: string) => void;

  // Block CRUD
  addBlock: (entityId: string, block: Block) => void;
  updateBlock: (entityId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (entityId: string, blockId: string) => void;

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

function deepCloneProductLines(pls: Record<string, ProductLine>): Record<string, ProductLine> {
  return JSON.parse(JSON.stringify(pls));
}

// Debounced save to /api/store
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedSave(productLines: Record<string, ProductLine>) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productLines),
    }).catch((err) => {
      console.warn("[ProductAgent] Failed to save data:", err);
    });
  }, 500);
}

export const useAppStore = create<AppStore>()(subscribeWithSelector((set) => ({
  productLines: deepCloneProductLines(PRODUCT_LINES),
  currentProductLineId: DEFAULT_PRODUCT_LINE_ID,
  currentEntityId: null,
  isHydrated: false,
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  personaPanelOpen: false,
  personaPanelId: null,
  openPersonaPanel: (id) => set({ personaPanelOpen: true, personaPanelId: id ?? null }),
  closePersonaPanel: () => set({ personaPanelOpen: false, personaPanelId: null }),

  hydrate: async () => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second between retries

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.exists && json.data) {
          // Migrate: backfill missing personas from mock data
          const data = json.data as Record<string, ProductLine>;
          for (const plId of Object.keys(data)) {
            if (!data[plId].personas) {
              data[plId].personas = PRODUCT_LINES[plId]?.personas ?? [];
            }
          }
          // Migrate: rename "Belief" block label to "Impact if True" on assumption entities
          for (const plId of Object.keys(data)) {
            for (const entity of Object.values(data[plId].entities)) {
              if (entity.level === "assumption") {
                for (const block of entity.blocks) {
                  if (block.type === "accordion" && block.label === "Belief") {
                    block.label = "Impact if True";
                  }
                }
              }
            }
          }
          // Restore last selected product line from localStorage
          const savedPlId = typeof window !== "undefined" ? localStorage.getItem("pa-current-pl") : null;
          const currentProductLineId = savedPlId && data[savedPlId] ? savedPlId : Object.keys(data)[0] || DEFAULT_PRODUCT_LINE_ID;
          set({ productLines: data, currentProductLineId, isHydrated: true });
          return;
        }
        // json.exists is false → no store.json yet (first run), fall through
        break;
      } catch {
        if (attempt < maxRetries) {
          console.warn(`[ProductAgent] Hydration fetch failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${retryDelay}ms...`);
          await new Promise(r => setTimeout(r, retryDelay));
          continue;
        }
        console.warn("[ProductAgent] Hydration failed after all retries — falling back to initial data");
        // Exhausted retries — fall through to mock-data fallback
      }
    }
    // Only reach here if: no persisted data exists OR all retries failed
    const savedPlId = typeof window !== "undefined" ? localStorage.getItem("pa-current-pl") : null;
    const pls = useAppStore.getState().productLines;
    if (savedPlId && pls[savedPlId]) {
      set({ currentProductLineId: savedPlId, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  resetData: async () => {
    try {
      await fetch("/api/store", { method: "DELETE" });
    } catch {}
    set({
      productLines: deepCloneProductLines(PRODUCT_LINES),
      currentProductLineId: DEFAULT_PRODUCT_LINE_ID,
      currentEntityId: null,
    });
  },

  switchProductLine: (id) => {
    if (typeof window !== "undefined") localStorage.setItem("pa-current-pl", id);
    set({ currentProductLineId: id, currentEntityId: null, personaPanelOpen: false, personaPanelId: null });
  },
  navigateTo: (id) => set({ currentEntityId: id }),
  navigateUp: () =>
    set((state) => {
      if (!state.currentEntityId) return state;
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return { currentEntityId: null };
      const entity = pl.entities[state.currentEntityId];
      if (!entity) return { currentEntityId: null };
      return { currentEntityId: entity.parentId || null };
    }),
  navigateToChild: (childId) => set({ currentEntityId: childId }),

  addProductLine: (pl) =>
    set((state) => ({
      productLines: { ...state.productLines, [pl.id]: pl },
      currentProductLineId: pl.id,
      currentEntityId: null,
    })),

  updateProductLine: (id, updates) =>
    set((state) => {
      const pl = state.productLines[id];
      if (!pl) return state;
      return {
        productLines: {
          ...state.productLines,
          [id]: { ...pl, ...updates },
        },
      };
    }),

  updateTree: (plId, updates) =>
    set((state) => {
      const pl = state.productLines[plId];
      if (!pl) return state;
      return {
        productLines: {
          ...state.productLines,
          [plId]: { ...pl, tree: { ...pl.tree, ...updates } },
        },
      };
    }),

  deleteProductLine: (id) =>
    set((state) => {
      const remaining = { ...state.productLines };
      delete remaining[id];
      const keys = Object.keys(remaining);
      if (keys.length === 0) return state;
      return {
        productLines: remaining,
        currentProductLineId: state.currentProductLineId === id ? keys[0] : state.currentProductLineId,
        currentEntityId: state.currentProductLineId === id ? null : state.currentEntityId,
      };
    }),

  addRootEntity: (entity) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            tree: { ...pl.tree, rootChildren: [...pl.tree.rootChildren, entity.id] },
            entities: { ...pl.entities, [entity.id]: entity },
          },
        },
      };
    }),

  updateEntity: (id, updates) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[id]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [id]: { ...pl.entities[id], ...updates },
            },
          },
        },
      };
    }),

  addChildEntity: (parentId, entity) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[parentId]) return state;
      const parent = pl.entities[parentId];
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [parentId]: { ...parent, children: [...parent.children, entity.id] },
              [entity.id]: entity,
            },
          },
        },
      };
    }),

  deleteEntity: (id) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[id]) return state;
      const entity = pl.entities[id];
      const newEntities = { ...pl.entities };

      // Recursively collect all descendant IDs
      const toDelete: string[] = [];
      const collect = (eid: string) => {
        toDelete.push(eid);
        const e = newEntities[eid];
        if (e) e.children.forEach(collect);
      };
      collect(id);
      toDelete.forEach((did) => delete newEntities[did]);

      // Remove from parent's children
      if (entity.parentId && newEntities[entity.parentId]) {
        const parent = newEntities[entity.parentId];
        newEntities[entity.parentId] = {
          ...parent,
          children: parent.children.filter((cid) => cid !== id),
        };
      }

      // Remove from tree rootChildren if applicable
      const newTree = {
        ...pl.tree,
        rootChildren: pl.tree.rootChildren.filter((rid) => rid !== id),
      };

      return {
        currentEntityId: state.currentEntityId === id ? entity.parentId || null : state.currentEntityId,
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: { ...pl, tree: newTree, entities: newEntities },
        },
      };
    }),

  dropEntityCascade: (id) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[id]) return state;
      const newEntities = { ...pl.entities };
      const cascade = (eid: string) => {
        const e = newEntities[eid];
        if (!e) return;
        newEntities[eid] = { ...e, status: 'dropped' };
        e.children.forEach(cascade);
      };
      cascade(id);
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: { ...pl, entities: newEntities },
        },
      };
    }),

  addBlock: (entityId, block) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      const entity = pl.entities[entityId];
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: { ...entity, blocks: [...entity.blocks, block] },
            },
          },
        },
      };
    }),

  updateBlock: (entityId, blockId, updates) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      const entity = pl.entities[entityId];
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: {
                ...entity,
                blocks: entity.blocks.map((b) =>
                  b.id === blockId ? { ...b, ...updates } as Block : b
                ),
              },
            },
          },
        },
      };
    }),

  removeBlock: (entityId, blockId) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      const entity = pl.entities[entityId];
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: {
                ...entity,
                blocks: entity.blocks.filter((b) => b.id !== blockId),
              },
            },
          },
        },
      };
    }),

  addPersona: (persona) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            personas: [...(pl.personas ?? []), persona],
          },
        },
      };
    }),

  updatePersona: (id, updates) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            personas: (pl.personas ?? []).map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          },
        },
      };
    }),

  deletePersona: (id) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return state;
      const newEntities = { ...pl.entities };
      for (const eid of Object.keys(newEntities)) {
        if (newEntities[eid].personaId === id) {
          newEntities[eid] = { ...newEntities[eid], personaId: undefined };
        }
        if (newEntities[eid].secondaryPersonaIds?.includes(id)) {
          newEntities[eid] = {
            ...newEntities[eid],
            secondaryPersonaIds: newEntities[eid].secondaryPersonaIds!.filter(pid => pid !== id),
          };
        }
      }
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            personas: (pl.personas ?? []).filter((p) => p.id !== id),
            entities: newEntities,
          },
        },
      };
    }),

  assignPersona: (entityId, personaId) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: {
                ...pl.entities[entityId],
                personaId,
                ...(personaId === undefined && { secondaryPersonaIds: [] }),
              },
            },
          },
        },
      };
    }),

  assignSecondaryPersonas: (entityId, personaIds) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: { ...pl.entities[entityId], secondaryPersonaIds: personaIds },
            },
          },
        },
      };
    }),

  assignAssumptionType: (entityId, assumptionType) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: { ...pl.entities[entityId], assumptionType },
            },
          },
        },
      };
    }),

  assignTestType: (entityId, testType) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: { ...pl.entities[entityId], testType },
            },
          },
        },
      };
    }),

  updateIceScore: (entityId, iceScore) =>
    set((state) => {
      const pl = state.productLines[state.currentProductLineId];
      if (!pl || !pl.entities[entityId]) return state;
      return {
        productLines: {
          ...state.productLines,
          [state.currentProductLineId]: {
            ...pl,
            entities: {
              ...pl.entities,
              [entityId]: { ...pl.entities[entityId], iceScore },
            },
          },
        },
      };
    }),
})));

// Auto-save whenever productLines changes (after hydration)
useAppStore.subscribe(
  (state) => state.productLines,
  (productLines) => {
    if (useAppStore.getState().isHydrated) {
      debouncedSave(productLines);
    }
  }
);
