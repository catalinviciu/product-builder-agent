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
