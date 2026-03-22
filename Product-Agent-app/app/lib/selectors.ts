import { DEFAULT_PRODUCT_LINE_ID } from "./schemas";
import type { EntityStore } from "./schemas";
import type { AppStore } from "./store";

/** Returns the currently active ProductLine (falls back to default). */
export const selectCurrentProductLine = (s: AppStore) =>
  s.productLines[s.currentProductLineId] ?? s.productLines[DEFAULT_PRODUCT_LINE_ID];

// ── Solution marker helpers ────────────────────────────────────────────────

export interface SolutionMarkerData {
  date: string;      // ISO YYYY-MM-DD
  titles: string[];  // one or more solution names on this date
}

/**
 * Traverses PO → children (opportunities) → their children (solutions),
 * filters to status "done", extracts the done date from statusHistory,
 * groups by date, and returns sorted markers.
 */
export function selectDoneSolutionsForProductOutcome(
  entities: EntityStore,
  productOutcomeId: string,
): SolutionMarkerData[] {
  const po = entities[productOutcomeId];
  if (!po || po.level !== "product_outcome") return [];

  const doneSolutions: { date: string; title: string }[] = [];
  for (const oppId of po.children) {
    const opp = entities[oppId];
    if (!opp) continue;
    for (const solId of opp.children) {
      const sol = entities[solId];
      if (!sol || sol.status !== "done") continue;
      const doneEntry = sol.statusHistory?.filter((h) => h.status === "done").at(-1);
      if (!doneEntry) continue;
      doneSolutions.push({ date: doneEntry.date, title: sol.title });
    }
  }

  // Group by date
  const byDate = new Map<string, string[]>();
  for (const { date, title } of doneSolutions) {
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(title);
  }

  return Array.from(byDate.entries())
    .map(([date, titles]) => ({ date, titles }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
