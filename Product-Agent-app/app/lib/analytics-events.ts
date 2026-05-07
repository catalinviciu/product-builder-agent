type Listener<T> = (payload: T) => void;

export type AnalyticsEventMap = {
  "Entity Created": {
    entity_type: string;
    status: string;
    has_children: boolean;
    child_count: number;
    assumption_count?: number;
    tests_total_count?: number;
    tests_done_count?: number;
  };
  "Product Line Created": {
    status: string;
    has_personas: boolean;
    persona_count: number;
  };
  "Status Change": {
    entity_type: string;
    from_status: string;
    to_status: string;
    has_children: boolean;
    child_count: number;
    assumption_count?: number;
    tests_total_count?: number;
    tests_done_count?: number;
  };
  "Signal Created": {
    frequency: string;
    value_format: string;
    signal_count: number;
  };
  slicer_prompt_copied: {
    solution_id: string;
    persona_count: number;
  };
  story_map_rendered: {
    solution_id: string;
    story_count: number;
    activity_count: number;
  };
  story_detail_opened: {
    story_id: string;
    iteration: "WS" | "EN" | "GA";
    has_ac: boolean;
  };
  ac_writer_prompt_copied: {
    solution_id: string;
    stories_without_ac: number;
  };
  plan_implement_prompt_copied: {
    solution_id: string;
    scope: "story" | "iteration" | "whole-map";
    story_count: number;
  };
  story_map_ac_enriched: {
    solution_id: string;
    stories_with_ac: number;
    stories_total: number;
  };
};

type ListenerMap = { [K in keyof AnalyticsEventMap]?: Array<Listener<AnalyticsEventMap[K]>> };
const _listeners: ListenerMap = {};

export const analyticsEmitter = {
  on<K extends keyof AnalyticsEventMap>(event: K, listener: Listener<AnalyticsEventMap[K]>): void {
    if (!_listeners[event]) _listeners[event] = [] as never;
    (_listeners[event] as Array<Listener<AnalyticsEventMap[K]>>).push(listener);
  },
  emit<K extends keyof AnalyticsEventMap>(event: K, payload: AnalyticsEventMap[K]): void {
    (_listeners[event] as Array<Listener<AnalyticsEventMap[K]>> | undefined)?.forEach(fn => fn(payload));
  },
};
