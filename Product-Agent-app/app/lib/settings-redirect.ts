import type { ProductLineSettings } from "./schemas";

export type SettingsFieldKey =
  | "codebasePath" | "designSystem" | "analyticsPlatform" | "storyMap";

export const SETTINGS_FIELD_LABELS: Record<SettingsFieldKey, string> = {
  codebasePath: "codebase",
  designSystem: "design system",
  analyticsPlatform: "analytics platform",
  storyMap: "story map",
};

/** Is this setting configured? Drives highlight-clearing and the All-set flip. */
export function isSettingsFieldFilled(s: ProductLineSettings, key: SettingsFieldKey): boolean {
  switch (key) {
    case "codebasePath":      return !!s.codebasePath;
    case "designSystem":      return s.designSystem.mode === "skill"
                                ? !!s.designSystem.skillName
                                : !!s.designSystem.designMd?.trim();
    case "analyticsPlatform": return !!s.analyticsPlatform.platform;
    case "storyMap":          return s.storyMap.enabled;
  }
}

/** Oxford-style join: "codebase" | "codebase and design system" | "codebase, design system and analytics platform". */
export function joinFieldLabels(keys: SettingsFieldKey[]): string {
  const labels = keys.map((k) => SETTINGS_FIELD_LABELS[k]);
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}
