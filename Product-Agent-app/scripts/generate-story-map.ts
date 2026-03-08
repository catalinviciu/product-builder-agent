import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { StoryMap, StoryMapActivity, StoryMapStep } from '../app/lib/story-map-schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, '../app/lib/story-map.json');
const outputPath = resolve(__dirname, '../STORY_MAP.md');

const data: StoryMap = JSON.parse(readFileSync(jsonPath, 'utf-8'));

function formatComponents(components: string[]): string {
  return components.map(c => `\`${c}\``).join(' · ');
}

function renderStep(step: StoryMapStep, isFirst: boolean): string {
  const lines: string[] = [];
  step.stories.forEach((story, i) => {
    const stepCell = i === 0 ? `**${step.title}**` : '';
    lines.push(`| ${stepCell} | ${story.action} | ${formatComponents(story.components)} |`);
  });
  return lines.join('\n');
}

function renderActivity(activity: StoryMapActivity, index: number): string {
  const lines: string[] = [
    `### Activity ${index + 1}: ${activity.title}`,
    `> ${activity.goal}`,
    '',
    '| Step | Story | Components |',
    '|:-----|:------|:-----------|',
  ];

  activity.steps.forEach((step, i) => {
    lines.push(renderStep(step, i === 0));
  });

  lines.push('');
  return lines.join('\n');
}

function generateMarkdown(map: StoryMap): string {
  const sections: string[] = [];

  // Header
  sections.push(`# User Story Map — Product Agent

> **Format:** Jeff Patton's User Story Mapping. Activities form the backbone (left → right),
> steps break each activity into sequential actions, and stories are the atomic user interactions.
>
> **Persona:** ${map.persona} — ${map.description}
>
> **Source of truth:** \`app/lib/story-map.json\`. This file is generated — do not edit directly.
> Run \`npm run generate:story-map\` to regenerate after editing the JSON.

---`);

  // Backbone table
  sections.push(`## Backbone (Activity Overview)

| ${map.activities.map((a, i) => `${i + 1}. ${a.title}`).join(' | ')} |
| ${map.activities.map(() => '---').join(' | ')} |

---`);

  // Activities
  sections.push('## Activities\n');

  map.activities.forEach((activity, i) => {
    sections.push(renderActivity(activity, i));

    // Note the refine pattern for activities 3-7
    if (i >= 2 && i <= 6) {
      const hasRefine = activity.steps.some(s => s.title.startsWith('Refine'));
      if (hasRefine && i === 2) {
        sections.push(`> **Pattern note:** Activities 3–7 each include a "Refine the entity" step with the same core stories (edit title, edit description, manage blocks, change status, copy anchor). This reflects the consistent editing experience across all entity levels.\n`);
      }
    }
  });

  // Footer
  sections.push(`---

## Maintenance

- **Source of truth:** \`app/lib/story-map.json\`
- **Types:** \`app/lib/story-map-schema.ts\`
- **Regenerate:** \`npm run generate:story-map\`
- **Component names** should match actual component/element names in the codebase
- When adding a new feature, add its stories to the relevant activity (or create a new activity)
- When a feature ships, update the JSON and regenerate this file
`);

  return sections.join('\n\n');
}

const markdown = generateMarkdown(data);
writeFileSync(outputPath, markdown, 'utf-8');
console.log(`Generated STORY_MAP.md (${data.activities.length} activities, ${data.activities.reduce((sum, a) => sum + a.steps.length, 0)} steps)`);
