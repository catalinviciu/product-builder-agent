# Gherkin Rules

How to write and format one story's acceptance criteria. Read this before writing AC for the first story in a run.

---

## Output format

AC ship as readable markdown, not a fenced `gherkin` block. This renders the same in the IDE preview, on GitHub, in Jira, and in Confluence, and it stays legible when a stakeholder reads it cold.

> **Analytics callouts are platform-generic.** The examples below show `**Pendo:**` because they come from a Pendo product line. Use `**<Platform>:**`, where `<Platform>` is the analytics platform named in the prompt's `## Analytics Platform` block (Pendo, Mixpanel, Amplitude, and so on). The callout style is the same regardless of platform.

Each scenario is a numbered heading. Each step is its own bold-keyword list item. A list item is its own block, so it cannot collapse into the line above it.

```markdown
**Prerequisites**

- **Given** Vanessa is in the alert policy setup

#### Scenario 1: Attribute filter is available on a video policy when the feature is enabled

- **Given** the attributes feature toggle is enabled
- **And** Vanessa is configuring a video alert policy
- **When** the monitoring filters are displayed
- **Then** the "Add attributes" option is available alongside vehicles, drivers, and groups

#### Scenario 2: Opening the picker lists available attributes at a single level

- **Given** the account has attributes assigned to vehicles, assets, and drivers
- **When** Vanessa opens the attributes picker
- **Then** the attribute names are listed at a single level
- **And** each attribute name can be expanded to reveal its values
- **Pendo:** `AlertAttributeFilterOpened` - trackid on the Add attribute button
```

Rules for the block:
- Number scenarios per story, restarting at 1 for each story.
- The AC block holds scenarios and Prerequisites only. Never repeat the story title, persona, goal, or benefit - they live in the card above.
- Out of scope is a hard boundary, but it is never restated inside the AC block. It lives in the card's Out of Scope section above; read it to bound what you write, and never emit an **Out of scope** callout in the AC.
- Prerequisites replace Background: the Givens every scenario in this story shares. Keep to 4 lines or fewer.
- Analytics events are a bold `**<Platform>:**` callout on the scenario where the event fires, never a Given/When/Then step.

---

## Cardinal rules

1. **One scenario, one behaviour.** Never two When-Then pairs in a scenario. Split them.
2. **No scenario, no build.** Every behaviour the story implies needs its own scenario: happy, alternate, edge, and negative. A behaviour with no scenario will not be built.
3. **Write the negative.** State what the system must not do. At least one negative scenario per story.
4. **No cross-story references.** Scenarios and Prerequisites must be independently understandable. Never refer to another story by number, title, or description. State the required condition directly; if the condition is unclear, ask instead of inferring it from another story.

Wrong:

- **Given** Story 1 has updated an event from the former driver to the corrected driver

Right:

- **Given** the event is assigned to the corrected driver

---

## Cover every path, not just the happy one

Walk these four for every story. The happy path alone is a failed AC set.

| Path | What it covers | Example from the alert-attributes work |
|------|----------------|----------------------------------------|
| Happy | The primary success | A matching video event triggers the alert and notification |
| Alternate | A valid but different route | Matching any one of several selected values triggers the alert |
| Edge | A boundary or unusual-but-valid state | Empty state when the account has no attributes; a saved value since deleted |
| Negative | What the system must not do | A non-matching event produces no alert and no notification |

Feature-toggle behaviour counts as a path in its own right when the story is gated: one scenario for on, one for off.

---

## Step rules

| Step | Must be | Must not be |
|------|---------|-------------|
| Given | State: "the panel is open" | Action: "the user opens the panel" |
| When | A single action, present tense | Past tense, or several actions |
| Then | An outcome the user can observe | Internal state |

**Then verifies what the user sees, never system internals.** This is the rule that keeps AC readable by a non-technical stakeholder and testable in a demo.

Wrong:

- **Then** the API returns status 200
- **And** the policy row is written to the database

Right:

- **Then** the selected count is shown on the attributes filter
- **And** reopening the policy shows the saved values

---

## Declarative, not imperative

Describe what the user does, never the mechanics of how. No "clicks", "types", "scrolls", "hovers".

Wrong:

- **When** the user clicks the "Apply" button
- **And** scrolls to the results section

Right:

- **When** Vanessa applies the filter
- **Then** the filtered results are shown

---

## Concrete values: use the ones you were given

Concrete values make a scenario testable: "State: FL" beats "an attribute value". Use them when the story card, journey, or the user supplies them.

Never invent them. If the card gives no example value, write the scenario against the general case ("an attribute value") and, if a specific value would sharpen it, ask. A plausible-looking invented value is worse than an honest general one, because the team will build to it.

---

## Phrasing

- Third person, using the persona's name or role ("Vanessa", "the safety manager"). Never "I".
- Present tense throughout.
- Clear subject, clear action.
- No full stop at the end of a step. A scenario is one construct split into clauses, not a list of sentences.
- No capitals except proper nouns and quoted UI text.

---

## Scenario outline, only for interchangeable values

Use an outline only when each row substitutes an interchangeable value and every row has the same Given/When/Then behaviour. Do not use an Examples table to combine distinct scenarios, paths, conditions, or expected outcomes. Give each distinct behaviour its own numbered scenario, even when a table could list the cases compactly. When in doubt, write separate scenarios.

```markdown
#### Scenario 1: The Add attributes option appears across policy types

- **Given** the attributes feature toggle is enabled
- **And** Vanessa is configuring a "<policyType>" alert policy
- **When** the monitoring filters are displayed
- **Then** the "Add attributes" option is available alongside vehicles, drivers, and groups

**Examples**

| policyType    |
|---------------|
| Speeding      |
| Geofence      |
| Harsh driving |
```

---

## Prerequisites, for shared state

The Givens every scenario in the story shares. Four lines or fewer. Lift a Given here only when it is genuinely common to all scenarios.

```markdown
**Prerequisites**

- **Given** a video alert policy exists
```

---

## Before you present a story's AC

Run these. A check with nothing named is a check you skipped.

- One scenario per behaviour, no merged behaviours.
- All four paths present: happy, alternate, edge, negative.
- At least one negative scenario.
- Steps are declarative, present tense, third person.
- Given is state; When is one action; Then is an observable outcome.
- Scenarios and Prerequisites contain no references to other stories; required state is stated directly.
- 3 to 5 steps per scenario, 10 at the most.
- No implementation detail: no URLs, selectors, status codes, table names.
- Every Human Verification bullet maps to at least one scenario.
- No scenario for anything in Out of Scope.
- Concrete values are real, taken from the card, never invented.

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Two When-Then pairs in one scenario | Split into separate scenarios |
| "clicks", "types", "scrolls" | Declarative: "selects", "submits", "applies" |
| First person "I" | Third person, the persona's name |
| Then asserts internal state | Then asserts what the user observes |
| Past or future tense | Present tense |
| No negative scenario | Add a "system must not" scenario |
| A scenario for an out-of-scope behaviour | Delete it, it is a hard boundary |
| An invented example value | Use a value from the card, or ask |
