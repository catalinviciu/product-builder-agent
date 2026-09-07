/**
 * Remembers which metric was last focused in the metric tree, per product
 * line, so the tree reopens where the builder left it instead of always
 * resetting to the root. Purely a convenience layer on top of localStorage —
 * losing this data (private window, blocked site data, quota errors) should
 * never break the tree, so every operation is best-effort.
 */

const KEY = "pa-tree-focus";

type FocusMap = Record<string, string>;

function readMap(): FocusMap {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FocusMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: FocusMap): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // Best-effort — localStorage can throw (private window, blocked site data, quota).
  }
}

export function readTreeFocus(productLineId: string): string | null {
  const map = readMap();
  return map[productLineId] ?? null;
}

export function writeTreeFocus(productLineId: string, metricId: string | null): void {
  try {
    if (typeof window === "undefined") return;
    const map = readMap();
    if (metricId === null) {
      delete map[productLineId];
    } else {
      map[productLineId] = metricId;
    }
    writeMap(map);
  } catch {
    // Best-effort — see readMap/writeMap.
  }
}
