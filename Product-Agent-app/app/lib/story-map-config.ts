export interface StoryMapConfig { jsonPath: string; mdPath: string; generateCommand: string; }

export const STORY_MAP_CONFIG: Record<string, StoryMapConfig> = {
  "productagent-1773131237459": {
    jsonPath: "app/lib/story-map.json",
    mdPath: "STORY_MAP.md",
    generateCommand: "npm run generate:story-map",
  },
};

export function getStoryMapConfig(productLineId: string): StoryMapConfig | null {
  return STORY_MAP_CONFIG[productLineId] ?? null;
}
