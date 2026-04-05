import { useAppStore } from "./store";
import { trackEvent } from "./analytics";
import { analyticsEmitter } from "./analytics-events";

let subscribed = false;

export function startAnalyticsSubscribers(): void {
  if (subscribed) return;
  subscribed = true;

  // Entity Viewed — fires when the user navigates to an entity
  useAppStore.subscribe(
    (state) => state.currentEntityId,
    (entityId: string | null) => {
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
    (plId: string) => {
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

  // Mutation events — emitted directly from store actions via analyticsEmitter
  analyticsEmitter.on("Entity Created", (props) => {
    trackEvent("Entity Created", props);
  });

  analyticsEmitter.on("Product Line Created", (props) => {
    trackEvent("Product Line Created", props);
  });

  analyticsEmitter.on("Status Change", (props) => {
    trackEvent("Status Change", props);
  });

  analyticsEmitter.on("Signal Created", (props) => {
    trackEvent("Signal Created", props);
  });
}
