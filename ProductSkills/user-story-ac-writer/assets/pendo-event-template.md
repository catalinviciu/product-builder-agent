# Pendo Event Definition Template

## Event Format

For each analytics event, define exactly three elements:

| Element | Description |
|---------|-------------|
| **Trigger** | The specific user action or system state that fires the event |
| **Event Name** | PascalCase, verb-noun pattern |
| **Properties** | Key-value pairs that reveal behavior patterns |

---

## Naming Convention

- PascalCase, no spaces, no underscores
- Pattern: `VerbNoun` or `NounVerb` (prefer verb-noun: `FilterApplied`, `PanelOpened`)
- Be specific: `AttributeFilterApplied` not `FilterUsed`
- Past tense verb (the event fires AFTER the action): `Applied`, `Opened`, `Removed`

---

## Property Design

Properties answer: "What additional context helps us understand the behavior?"

Good properties reveal:
- **Volume:** How many items were involved? (count)
- **Type:** What category of item? (string)
- **Source:** How did the user get here? (string)
- **Duration:** How long did the interaction take? (ms)
- **State:** What was the system state when this happened? (string/boolean)

---

## Classification

| Priority | Criteria | Example |
|----------|----------|---------|
| **Must-have** | Cannot measure task success or key funnel step without it | User applied filter (task completion signal) |
| **Optional** | Behavioral insight, not critical for success measurement | User expanded an attribute group (exploration signal) |

Rule of thumb: Must-haves answer "Did the user succeed?" Optional events answer "How did the user behave along the way?"

---

## Funnel Context

Pendo funnels measure dropout between sequential events natively. If Event A → Event B is defined as a funnel, Pendo shows completion rate and dropout without a separate "abandoned" event.

**Implication:** Only define events for actions that **happened**, not actions that didn't happen. Abandonment, dropout, and "user didn't complete" are derived from funnel analysis -- never create explicit events for them.

---

## Worked Examples

### Example 1: Task Success Event

**Story:** Apply attribute filters to the livemap

| Element | Value |
|---------|-------|
| Trigger | User clicks Apply and filter is committed to the map |
| Event Name | `AttributeFilterApplied` |
| Properties | `AttributesSelected: <number>` -- count of distinct attribute values selected |
|  | `AttributeNames: <string[]>` -- list of attribute name categories used |

**Priority:** Must-have (this IS the task success signal)

### Example 2: Funnel Entry Event

**Story:** Open the attribute filter panel

| Element | Value |
|---------|-------|
| Trigger | User opens the attribute filter panel from the Vehicles tab |
| Event Name | `FilterPanelOpened` |
| Properties | `AttributesAvailable: <number>` -- total attribute values visible in the tree |
|  | `Source: <string>` -- "icon" or "chip-view-all" (how the panel was opened) |

**Priority:** Must-have (funnel entry -- without this we can't measure dropout)

### Example 3: Optional Behavioral Event

**Story:** Search attributes within the panel

| Element | Value |
|---------|-------|
| Trigger | User types in the search input and results are filtered |
| Event Name | `AttributeSearchUsed` |
| Properties | `SearchTerm: <string>` -- the text entered (first 50 chars) |
|  | `ResultsCount: <number>` -- number of matching items shown |

**Priority:** Optional (tells us if search is useful, but not needed for success measurement)

---

## Overlay Format

When presenting events overlaid on the story map, use this table:

```markdown
| Story | Event Name | Trigger | Properties | Priority |
|-------|-----------|---------|------------|----------|
| Story 1 | FilterPanelOpened | User opens the filter panel | AttributesAvailable: count | Must-have |
| Story 2 | AttributeFilterApplied | User clicks Apply | AttributesSelected: count, AttributeNames: list | Must-have |
| Story 3 | FilterChipRemoved | User removes a chip | RemainingFilters: count | Optional |
```
