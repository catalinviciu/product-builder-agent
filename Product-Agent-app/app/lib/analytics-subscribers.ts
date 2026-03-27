import { useAppStore } from "./store";
import { trackEvent } from "./analytics";
import type { ProductLine, Entity } from "./schemas";

type ProductLineMap = Record<string, ProductLine>;

let subscribed = false;

export function startAnalyticsSubscribers(): void {
  if (subscribed) return;
  subscribed = true;

  // Entity Viewed — fires when the user navigates to an entity
  useAppStore.subscribe(
    (state) => state.currentEntityId,
    (entityId: string | null, prevEntityId: string | null) => {
      console.log("[Analytics:sub] currentEntityId changed:", prevEntityId, "→", entityId);
      if (!entityId) return;
      const state = useAppStore.getState();
      const pl = state.productLines[state.currentProductLineId];
      if (!pl) return;
      const entity = pl.entities[entityId];
      if (!entity) return;

      trackEvent("Entity Viewed", {
        entity_type: entity.level,
        block_count: entity.blocks.length,
        ice_score_initiated: entity.iceScore != null,
      });
    },
  );

  // Product Line Viewed — fires when user switches product line
  useAppStore.subscribe(
    (state) => state.currentProductLineId,
    (plId: string, prevPlId: string) => {
      console.log("[Analytics:sub] currentProductLineId changed:", prevPlId, "→", plId);
      if (!plId) return;
      const state = useAppStore.getState();
      const pl = state.productLines[plId];
      if (!pl) return;

      trackEvent("Product Line Viewed", {
        status: pl.status,
        persona_count: (pl.personas ?? []).length,
        entity_count: Object.keys(pl.entities).length,
      });
    },
  );

  // Product line data changes — Entity Created, Product Line Created, Status Change
  useAppStore.subscribe(
    (state) => state.productLines,
    (current: ProductLineMap, previous: ProductLineMap) => {
      // Skip hydration load — previous is empty when store first populates
      if (Object.keys(previous).length === 0) {
        console.log("[Analytics:sub] productLines changed but previous is empty (hydration), skipping");
        return;
      }

      console.log("[Analytics:sub] productLines changed, diffing...");

      for (const plId of Object.keys(current)) {
        const currPl = current[plId];
        const prevPl = previous[plId];

        // Product Line Created — exists in current but not in previous
        if (currPl && !prevPl) {
          trackEvent("Product Line Created", {
            status: currPl.status,
            has_personas: (currPl.personas ?? []).length > 0,
            persona_count: (currPl.personas ?? []).length,
          });
          continue;
        }

        if (!currPl || !prevPl) continue;

        const currEntityIds = Object.keys(currPl.entities);
        const prevEntityIds = Object.keys(prevPl.entities);
        if (currEntityIds.length !== prevEntityIds.length) {
          console.log(`[Analytics:sub] Entity count changed: ${prevEntityIds.length} → ${currEntityIds.length}`);
        }

        for (const entityId of currEntityIds) {
          const currEntity = currPl.entities[entityId];
          const prevEntity = prevPl.entities?.[entityId];

          // Entity Created — exists in current but not in previous
          if (currEntity && !prevEntity) {
            console.log(`[Analytics:sub] New entity detected: ${entityId} (${currEntity.level})`);
            const props: Record<string, unknown> = {
              entity_type: currEntity.level,
              status: currEntity.status,
              has_children: currEntity.children.length > 0,
              child_count: currEntity.children.length,
            };

            if (currEntity.level === "solution") {
              props.assumption_count = 0;
              props.tests_total_count = 0;
              props.tests_done_count = 0;
            }

            trackEvent("Entity Created", props);
            continue;
          }

          if (!currEntity || !prevEntity) continue;
          if (currEntity.status === prevEntity.status) continue;

          // Status changed — build event properties
          const props: Record<string, unknown> = {
            entity_type: currEntity.level,
            from_status: prevEntity.status,
            to_status: currEntity.status,
            has_children: currEntity.children.length > 0,
            child_count: currEntity.children.length,
          };

          // Solution-specific: count assumptions and tests among children
          if (currEntity.level === "solution") {
            const children = currEntity.children
              .map((cid) => currPl.entities[cid])
              .filter((e): e is Entity => e !== undefined);

            props.assumption_count = children.filter(
              (c) => c.level === "assumption",
            ).length;

            const tests = children.filter((c) => c.level === "test");
            props.tests_total_count = tests.length;
            props.tests_done_count = tests.filter(
              (t) => t.status === "done",
            ).length;
          }

          trackEvent("Status Change", props);
        }
      }
    },
  );
}
