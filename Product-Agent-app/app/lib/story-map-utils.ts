import type { Story, StoryIteration } from "@/app/lib/schemas";

export const SYSTEM_PERSONA = "System";

export interface MapBackbone {
  activities: { name: string; tasks: string[] }[];
  tasks: string[]; // flat, first-seen order across activities
}

export const ITERATION_ROWS: { key: StoryIteration; label: string }[] = [
  { key: "WS", label: "Walking Skeleton" },
  { key: "Enh", label: "Enhancement" },
  { key: "GA", label: "GA" },
];

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
 * Returns the first story matching the given task and iteration, or null.
 */
export function getStoryAt(
  stories: Story[],
  task: string,
  iteration: StoryIteration
): Story | null {
  return stories.find((s) => s.task === task && s.iteration === iteration) ?? null;
}

/**
 * Returns true if every story for the given task column has persona === "System".
 */
export function isSystemTask(stories: Story[], task: string): boolean {
  const forTask = stories.filter((s) => s.task === task);
  if (forTask.length === 0) return false;
  return forTask.every((s) => s.persona === SYSTEM_PERSONA);
}
