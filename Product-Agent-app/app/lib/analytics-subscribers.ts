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

  analyticsEmitter.on("story_added_manually", (payload) => {
    trackEvent("StoryAddedManually", { solution_id: payload.solution_id, iteration: payload.iteration_kind });
  });

  analyticsEmitter.on("story_map_ac_enriched", (props) => {
    trackEvent("StoryMapAcEnriched", props);
  });

  analyticsEmitter.on("refine_story_prompt_copied", (props) => {
    trackEvent("RefineStoryPromptCopied", props);
  });

  analyticsEmitter.on("story_enriched", (props) => {
    trackEvent("StoryEnriched", props);
  });

  // Diff subscription: emit story_map_ac_enriched when a solution's
  // stories_with_ac count increases compared to the previous snapshot.
  // Also emit story_enriched when a manually-added story (wasManual = !narrative)
  // transitions from no-AC to has-AC.
  // First snapshot after hydration is the silent baseline for both.
  let acCountBaseline: Record<string, number> | null = null;
  let storyEnrichedBaseline: Record<string, { wasManual: boolean; hadAc: boolean }> | null = null;

  useAppStore.subscribe(
    (state) => state.productLines,
    (current) => {
      if (Object.keys(current).length === 0) return; // hydration guard

      const next: Record<string, number> = {};
      const totals: Record<string, number> = {};
      const nextStoryState: Record<string, { wasManual: boolean; hadAc: boolean }> = {};

      for (const pl of Object.values(current)) {
        for (const e of Object.values(pl.entities)) {
          if (e.level !== "solution" || !e.stories?.length) continue;
          const withAc = e.stories.filter((s) => !!s.acceptanceCriteria).length;
          next[e.id] = withAc;
          totals[e.id] = e.stories.length;
          for (const s of e.stories) {
            const key = `${e.id}::${s.id}`;
            nextStoryState[key] = {
              wasManual: !s.narrative,
              hadAc: !!s.acceptanceCriteria,
            };
          }
        }
      }

      if (acCountBaseline === null) {
        acCountBaseline = next;
        storyEnrichedBaseline = nextStoryState;
        return;
      }

      // story_map_ac_enriched diff
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

      // story_enriched diff — fires when a wasManual story gains AC for the first time
      if (storyEnrichedBaseline !== null) {
        for (const [key, nextState] of Object.entries(nextStoryState)) {
          const prev = storyEnrichedBaseline[key];
          if (!prev) {
            // New story — record its initial state, don't emit
            storyEnrichedBaseline[key] = nextState;
            continue;
          }
          if (prev.wasManual && !prev.hadAc && nextState.hadAc) {
            const [solutionId, storyId] = key.split("::");
            analyticsEmitter.emit("story_enriched", { solution_id: solutionId, story_id: storyId });
            // Update so it only fires once
            storyEnrichedBaseline[key] = { ...nextState, wasManual: prev.wasManual };
          } else {
            storyEnrichedBaseline[key] = nextState;
          }
        }
      }
    },
  );
}
