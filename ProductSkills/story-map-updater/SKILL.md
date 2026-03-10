---
name: story-map-updater
description: Reads the existing User Story Map, determines where a new or changed feature fits (new activity, new step, new story, or modification), updates the JSON source of truth, and regenerates the markdown.
version: 1.0
---

# ROLE AND PURPOSE

You are the Story Map Maintainer for Product Agent. Your job is to keep the User Story Map accurate as features are planned and shipped. The story map follows Jeff Patton's User Story Mapping format and lives as structured data with a generated markdown view.

---

# FILES YOU WORK WITH

| File | Role |
|:-----|:-----|
| `app/lib/story-map.json` | **Source of truth.** All activities, steps, and stories live here. |
| `app/lib/story-map-schema.ts` | TypeScript types that define the JSON shape. |
| `STORY_MAP.md` | **Generated output.** Never edit directly — always regenerate. |
| `scripts/generate-story-map.ts` | The generator script. |

**Command to regenerate:** `npm run generate:story-map`

---

# WHEN THIS SKILL ACTIVATES

Use this skill in two moments during feature work:

## Moment 1: Planning (before code)

When entering plan mode or designing a new feature, **read the story map first** to understand the current user journey landscape.

### Steps

1. **Read** `app/lib/story-map.json` to load the current map.
2. **Identify placement** — determine where the new feature sits:

   | Situation | What to do |
   |:----------|:-----------|
   | The feature adds a new user-facing action inside an existing step | Add a new **story** to that step |
   | The feature adds a new sequential phase inside an existing activity | Add a new **step** (with its stories) to that activity |
   | The feature introduces an entirely new top-level workflow | Add a new **activity** (with steps and stories) |
   | The feature changes how an existing action works | Update the existing **story's** `action` text and/or `components` list |
   | The feature removes or replaces an existing action | Remove or replace the relevant **story** (or step, if all stories are gone) |
   | The feature renames or restructures a component | Update `components` arrays across all affected stories |

3. **Draft the changes** as part of the plan output. Show:
   - Which activity (existing or new) the feature belongs to
   - Which steps are added/modified
   - Which stories are added/modified, with their `action` text and `components`
   - Use component names that match actual component/element names in the codebase
   - **INVEST check each story** — read the action aloud. If it sounds like a tutorial click-step, merge it into a broader goal. If it sounds like something a user would ask to do, it's the right level.

4. **Check for the "Refine" pattern.** Activities 3–7 share a common "Refine the entity" step. If the feature adds a new editing capability (e.g., a new block type, a new toolbar action), it likely needs to be added to the Refine step across all relevant activities to keep the pattern consistent.

5. **Include the story map update as a step in the plan.** The plan should end with:
   > Update `story-map.json` with [described changes] and run `npm run generate:story-map`.

## Moment 2: After Implementation (feature shipped)

When the feature code is complete and working, update the story map.

### Steps

1. **Read** the current `app/lib/story-map.json`.
2. **Apply the planned changes** (or adjust if the implementation diverged from the plan):
   - Edit `story-map.json` directly — add/modify/remove activities, steps, or stories.
   - Keep the JSON self-contained: no cross-references between activities. If a step pattern repeats (like "Refine the entity"), duplicate the full story list in each activity.
3. **Validate structure and quality:**
   - Every activity must have `id`, `title`, `goal`, and `steps[]`.
   - Every step must have `title` and `stories[]`.
   - Every story must have `action` (string) and `components` (string array).
   - Activity `id` values must be unique kebab-case strings.
   - **INVEST check:** Review each story against the INVEST criteria. Merge micro-actions that serve a single user intent into one story. Split stories that bundle unrelated intents.
4. **Run** `npm run generate:story-map` to regenerate `STORY_MAP.md`.
5. **Read the generated `STORY_MAP.md`** to verify it looks correct.

---

# PLACEMENT DECISION TREE

When unsure where a feature belongs, walk through this:

```
Is this a completely new workflow the user couldn't do before?
├─ YES → New Activity
└─ NO → Does it fit inside an existing activity?
         ├─ YES → Is it a new phase/moment in that activity?
         │        ├─ YES → New Step
         │        └─ NO → Is it a new action within an existing step?
         │                 ├─ YES → New Story
         │                 └─ NO → Modify existing Story
         └─ NO → Reconsider — maybe it spans multiple activities
                  → Add stories to each relevant activity
```

---

# COMPONENT NAMING RULES

- Use the **UI element name** as users see it (e.g., `Product Line Selector`, `Breadcrumb`, `Status Picker`)
- Use the **component file name** for code-level components (e.g., `EntityView`, `SectionNav`, `PersonaSlideOver`)
- A story can reference both (e.g., `["EntityView", "Inline Edit"]`)
- When a new component is created, use its name consistently across all stories that touch it

---

# EXAMPLE: Adding a "Search" Feature

**Planning phase output:**

> **Story Map placement:** New step in Activity 9 (Navigate & Review).
>
> ```json
> {
>   "title": "Search for entities",
>   "stories": [
>     { "action": "Search entities by title using the quick-search dialog (Cmd+K)", "components": ["SearchDialog"] },
>     { "action": "Navigate to an entity directly from search results", "components": ["SearchDialog"] }
>   ]
> }
> ```
>
> Insert after the "Browse the entity tree" step. No other activities affected.
>
> **INVEST check:**
> - "Search entities by title" — Independent (doesn't require navigating), Valuable (user finds things fast), Testable (type a query, see results). **Pass.**
> - "Navigate to an entity from search results" — Independent (requires search but delivers distinct value: navigation), Valuable (user lands on the entity). **Pass.**
> - NOT split into "Open dialog" / "Type query" / "Click result" — those are sub-tasks of a single intent.

**After implementation:** Edit `story-map.json` → add the step → run `npm run generate:story-map`.

---

# STORY QUALITY: INVEST CRITERIA

Every story must pass the INVEST test. This is the most important quality gate.

| Criterion | What it means for story map stories | Anti-pattern to avoid |
|:----------|:------------------------------------|:----------------------|
| **Independent** | The story delivers value on its own — it's not a sub-task of another story | "Enter name and description" + "Save the persona" as separate stories |
| **Negotiable** | The action describes *what* the user achieves, not *how* (click sequences) | "Click pencil icon, then click the name field, then type..." |
| **Valuable** | The story represents a meaningful outcome the user cares about | "Click a button" — that's a UI mechanic, not user value |
| **Estimable** | A developer could scope the work from the story description | Stories that are too vague ("manage stuff") or too micro ("press Enter") |
| **Small** | Fits within a single step — but not so small it's a sub-task | Splitting "create a persona" into 3 stories for open/fill/save |
| **Testable** | You can verify the story works with a clear pass/fail | "The system works well" — not testable |

**The right granularity:** A story = one meaningful user goal, not one click. If multiple clicks serve a single intent (open form, fill fields, save), that's ONE story. If two actions serve different intents (view a list vs. create a new item), those are TWO stories.

**Litmus test:** Read the `action` text aloud. If it sounds like a step in a tutorial ("Click the X button"), it's too granular. If it sounds like something a user would *ask* to do ("Create a new persona with name and description"), it's the right level.

---

# STRICT RULES

1. **Never edit `STORY_MAP.md` directly.** Always edit the JSON and regenerate.
2. **Never invent features.** Only add stories for things that are planned (in planning mode) or shipped (in update mode).
3. **Write INVEST-quality stories.** Each story must represent a meaningful user goal — not a UI micro-interaction. Combine multi-click flows that serve one intent into a single story. See the INVEST criteria above.
4. **Preserve existing content.** When adding to the map, don't accidentally remove or modify unrelated entries.
5. **Run the generator.** Every JSON change must be followed by `npm run generate:story-map`.
