import type { Story, StoryIterationKind } from "@/app/lib/schemas";

export const SYSTEM_PERSONA = "System";

export interface MapBackbone {
  activities: { name: string; tasks: string[] }[];
  tasks: string[]; // flat, first-seen order across activities
}

export interface IterationRow {
  kind: StoryIterationKind;
  label: string;
}

/**
 * Returns ordered iteration rows derived from the given stories:
 *   1. The single WS row (label taken from the first WS story)
 *   2. Enhancement rows in first-seen order, grouped by label
 *   3. The single GA row (label taken from the first GA story)
 * Rows with zero stories are omitted.
 */
export function deriveIterationRows(stories: Story[]): IterationRow[] {
  let ws: IterationRow | null = null;
  const enhMap = new Map<string, IterationRow>();
  let ga: IterationRow | null = null;
  for (const s of stories) {
    const { kind, label } = s.iteration;
    if (kind === "ws") {
      if (!ws) ws = { kind, label };
    } else if (kind === "ga") {
      if (!ga) ga = { kind, label };
    } else if (!enhMap.has(label)) {
      enhMap.set(label, { kind, label });
    }
  }
  return [...(ws ? [ws] : []), ...enhMap.values(), ...(ga ? [ga] : [])];
}

/** Returns the first persona name that is non-empty and not "System". */
export function resolvePrimaryPersona(stories: Story[]): string | null {
  for (const s of stories) {
    if (s.persona && s.persona !== SYSTEM_PERSONA) {
      return s.persona;
    }
  }
  return null;
}

/**
 * Keeps stories whose persona is "System" OR matches the primary persona.
 * If primary is null, returns all stories unchanged (graceful fallback).
 */
export function filterStoriesForPersona(stories: Story[], primary: string | null): Story[] {
  if (primary === null) return stories;
  return stories.filter(
    (s) => s.persona === SYSTEM_PERSONA || s.persona === primary
  );
}

/**
 * Builds an activity backbone from the given stories in insertion order.
 * Maintains first-seen order for both activities and tasks.
 */
export function buildBackbone(stories: Story[]): MapBackbone {
  const activityMap = new Map<string, string[]>(); // activity name → tasks (ordered)

  for (const s of stories) {
    if (!activityMap.has(s.activity)) {
      activityMap.set(s.activity, []);
    }
    const tasks = activityMap.get(s.activity)!;
    if (!tasks.includes(s.task)) {
      tasks.push(s.task);
    }
  }

  const activities = Array.from(activityMap.entries()).map(([name, tasks]) => ({
    name,
    tasks,
  }));

  // Flat tasks list preserving first-seen order across activities
  const tasks: string[] = [];
  for (const { tasks: actTasks } of activities) {
    for (const t of actTasks) {
      if (!tasks.includes(t)) {
        tasks.push(t);
      }
    }
  }

  return { activities, tasks };
}

/**
 * Returns all stories matching the given task and iteration row, in their array order.
 * When more than one is present, the renderer stacks them vertically in the same cell.
 */
export function getStoriesAt(
  stories: Story[],
  task: string,
  row: IterationRow
): Story[] {
  return stories.filter(
    (s) => s.task === task && s.iteration.kind === row.kind && s.iteration.label === row.label
  );
}

/**
 * Returns true if every story for the given task column has persona === "System".
 */
export function isSystemTask(stories: Story[], task: string): boolean {
  const forTask = stories.filter((s) => s.task === task);
  if (forTask.length === 0) return false;
  return forTask.every((s) => s.persona === SYSTEM_PERSONA);
}
