import { useAppStore } from "./store";
import { trackEvent } from "./analytics";
import type { ProductLine, Entity } from "./schemas";

type ProductLineMap = Record<string, ProductLine>;

let subscribed = false;

export function startAnalyticsSubscribers(): void {
  if (subscribed) return;
  subscribed = true;

  useAppStore.subscribe(
    (state) => state.productLines,
    (current: ProductLineMap, previous: ProductLineMap) => {
      // Skip hydration load — previous is empty when store first populates
      if (Object.keys(previous).length === 0) return;

      for (const plId of Object.keys(current)) {
        const currPl = current[plId];
        const prevPl = previous[plId];
        if (!currPl || !prevPl) continue;

        for (const entityId of Object.keys(currPl.entities)) {
          const currEntity = currPl.entities[entityId];
          const prevEntity = prevPl.entities?.[entityId];
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
