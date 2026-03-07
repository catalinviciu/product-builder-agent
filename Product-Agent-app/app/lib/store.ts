import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PRODUCT_LINES, DEFAULT_PRODUCT_LINE_ID } from "./mock-data";
import type { Entity, Block, ProductLine, DiscoveryTree } from "./schemas";

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
  updateTree: (plId: string, updates: Partial<Pick<DiscoveryTree, "title" | "description">>) => void;
  deleteProductLine: (id: string) => void;
  addRootEntity: (entity: Entity) => void;

  // Entity CRUD
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  addChildEntity: (parentId: string, entity: Entity) => void;
  deleteEntity: (id: string) => void;

  // Block CRUD
  addBlock: (entityId: string, block: Block) => void;
  updateBlock: (entityId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (entityId: string, blockId: string) => void;
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
    }).catch(() => {});
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

  hydrate: async () => {
    try {
      const res = await fetch("/api/store");
      const json = await res.json();
      if (json.exists && json.data) {
        set({ productLines: json.data, isHydrated: true });
        return;
      }
    } catch {}
    set({ isHydrated: true });
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

  switchProductLine: (id) => set({ currentProductLineId: id, currentEntityId: null }),
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
