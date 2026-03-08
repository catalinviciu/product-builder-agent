export interface StoryMap {
  persona: string;
  description: string;
  activities: StoryMapActivity[];
}

export interface StoryMapActivity {
  id: string;
  title: string;
  goal: string;
  steps: StoryMapStep[];
}

export interface StoryMapStep {
  title: string;
  stories: StoryMapStory[];
}

export interface StoryMapStory {
  action: string;
  components: string[];
}
