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

  analyticsEmitter.on("slicer_prompt_copied", (props) => {
    trackEvent("SlicerPromptCopied", props);
  });

  analyticsEmitter.on("story_map_rendered", (props) => {
    trackEvent("StoryMapRendered", props);
  });

  analyticsEmitter.on("story_detail_opened", (props) => {
    trackEvent("StoryDetailOpened", props);
  });

  analyticsEmitter.on("ac_writer_prompt_copied", (props) => {
    trackEvent("AcWriterPromptCopied", props);
  });

  analyticsEmitter.on("plan_implement_prompt_copied", (payload) => {
    trackEvent("PlanImplementPromptCopied", payload);
  });

  analyticsEmitter.on("story_marked_done", (payload) => {
    trackEvent("StoryMarkedDone", payload);
  });

  analyticsEmitter.on("story_map_ac_enriched", (props) => {
    trackEvent("StoryMapAcEnriched", props);
  });

  // Diff subscription: emit story_map_ac_enriched when a solution's
  // stories_with_ac count increases compared to the previous snapshot.
  // First snapshot after hydration is the silent baseline.
  let acCountBaseline: Record<string, number> | null = null;
  useAppStore.subscribe(
    (state) => state.productLines,
    (current) => {
      if (Object.keys(current).length === 0) return; // hydration guard

      const next: Record<string, number> = {};
      const totals: Record<string, number> = {};
      for (const pl of Object.values(current)) {
        for (const e of Object.values(pl.entities)) {
          if (e.level !== "solution" || !e.stories?.length) continue;
          const withAc = e.stories.filter((s) => !!s.acceptanceCriteria).length;
          next[e.id] = withAc;
          totals[e.id] = e.stories.length;
        }
      }

      if (acCountBaseline === null) {
        acCountBaseline = next;
        return;
      }

      for (const [solutionId, withAc] of Object.entries(next)) {
        const prev = acCountBaseline[solutionId] ?? 0;
        if (withAc > prev) {
          analyticsEmitter.emit("story_map_ac_enriched", {
            solution_id: solutionId,
            stories_with_ac: withAc,
            stories_total: totals[solutionId],
          });
        }
      }
      acCountBaseline = next;
    },
  );
}
