# Slicing lessons from practice

Worked wrong-vs-right examples. Read these when a backbone Task boundary or a story split feels borderline. Each names why the wrong version is wrong, so you can spot the same shape in new work.

---

## Backbone: where a Task boundary lands

### Bad: splitting reassignment history by read and write

| Activity | Task | Type | Layer |
| --- | --- | --- | --- |
| Correct retroactive driver attribution | Correct a historical driver assignment through an existing source | User, existing | Trigger |
| Correct retroactive driver attribution | Propagate correction to matching video events | System | Slice 1 |
| Correct retroactive driver attribution | Recompute the corrected driver's safety score | System | Slice 1 |
| Correct retroactive driver attribution | Update coaching session membership | System | Slice 1 |
| Correct retroactive driver attribution | Sync corrected data to Redshift | System | Slice 1 |
| Review reassignment history | Record the reassignment in the activity log | System | Slice 2 |
| Review reassignment history | Review driver and change history on event details | User | Slice 2 |

| Activity | Sibling Tasks | The single axis they vary on | Any Task that does not fit the axis |
| --- | --- | --- | --- |
| Correct retroactive driver attribution | Correct assignment; propagate event correction; recompute score; update coaching; sync reporting | Workflow phase | None |
| Review reassignment history | Record activity; review event details | Read vs write (illegal) | Review event details is a read/display Task |

The Slice 2 tasks vary by read vs write, not workflow phase, so they fail the one-axis rule. Keep activity-log creation as a System Task in the correction Activity and rely on the existing event-details view to display it; do not add a separate read/display Task.

### Bad: overlapping state machine

Splitting "Filter the livemap by selecting attribute values" into two User Tasks:
- Task A: open panel, browse tree, select values, apply
- Task B: modify active filters via the panel (reopen, change, apply)

Wrong because Task B is just Task A's panel working when filters already exist. Reopening with pre-checked state is the same staged-apply state machine. Two Tasks sharing one state machine is coupling, not independence.

The merge rule: same interaction surface AND same state machine means one Task. "First-time select" and "modify existing selection" in the same panel are one Task. But "remove via a chip" is a different surface with a different pattern (immediate removal, no staged apply), so it stands alone.

### Bad: scenario disguised as a Task

Treating "empty filter results on the map" as its own thing when it is a scenario of the search Task.

Wrong because "no matching attributes in the search tree" and "no vehicles match applied filters on the map" are different behaviours in different components. Bundling them conflates search results with map results. They belong to different Tasks, not one.

### Bad: four axes pretending to be four steps

Slicing the Activity "Associate entities to attribute values" into these sibling Tasks:
- Associate and remove entities for a value
- Select all / deselect all per entity type
- See association counts per value
- Associate driver entities to a value

Wrong because each Task is sliced on a *different axis*, and a backbone splits on one axis at a time. Line them up:

| Task | Axis it is really on | Legal at backbone? |
|------|----------------------|--------------------|
| Associate and remove entities | write / CRUD op on the assignment surface | No - one Task, split into stories |
| Select all / deselect all | UI mechanism (a faster click) | No - a story detail or AC scenario |
| See association counts | read / display, and on a different surface (the list) | No - a story under the list Task |
| Associate drivers | entity type | Yes - this is the real axis |

Only the last one is a genuine backbone Task. The other three are a write concern, a UI mechanism, and a read concern wearing step costumes. Reading the list top to bottom feels like a workflow ("associate, then bulk-select, then check counts, then do drivers") but it is one step viewed four ways, not four steps.

**The fix - split on entity type only:**
- Associate vehicles to a value
- Associate powered assets to a value
- Associate non-powered assets to a value
- Associate drivers to a value

Then select-all and remove become stories under those Tasks (same surface, same state machine), and counts becomes a story under the list Task where the numbers render.

**How to catch it before it ships:** name the single axis your sibling Tasks vary on. If you cannot name one axis that explains all of them, you are mixing axes. Write the axis ledger, put every Task that does not fit the named axis in the last column, and if that column is not empty, the split is wrong. This is exactly what the one-axis test and the ledger in Phase 3 exist to force.

---

## Stories: read-only display vs interaction

### Good: split when the display layer carries real weight

Splitting "Filter the livemap by selecting attribute values" into:
- Story 1: open the panel and browse available attributes (read-only: component structure, API integration, tree rendering)
- Story 2: select values and filter the livemap (interaction: checkboxes, staged state machine, map update)

Works because Story 1 is data display and Story 2 is state management layered on top. The AI builds the component in Story 1, extends it in Story 2, no rework. Each delivers value alone: browse what is available, then act on it.

### Bad: split when the display is trivial

Splitting "View and manage active filter chips" into:
- Story A: view filter chips (render active filters as labels)
- Story B: remove or modify filters (click X, reopen panel)

Wrong because rendering a list of labels is not a substantial buildable unit. Chips without dismiss buttons are an incomplete pattern with no standalone value. "See my filters" and "manage my filters" are one user intent.

The rule: only split read-only display from interaction when the display has substantial independent complexity, an API call, data transformation, real component architecture, standalone value. If it is "render a list of labels, badges, or counts", it stays with its interaction in one story.

---

## System Tasks: slice by pipeline depth

### Good: each slice a deeper pipeline layer

An agentic workflow that reviews uploaded contracts and flags risky clauses:
- Story 1: [System] parse documents and extract clause text (OCR + extraction)
- Story 2: [System] identify high-risk clauses with rule-based heuristics
- Story 3: review flagged clauses with risk explanations (User)
- Story 5: [System] use an LLM for nuanced risk analysis (replaces heuristics)
- Story 6: [System] learn from user overrides (feedback loop)

Works because each System story builds a deeper layer. Story 1 extracts. Story 2 analyses simply (rules). Story 5 analyses richly (LLM). Each produces progressively richer output for the same downstream User Task. The walking skeleton ships with heuristics, good enough to be usable; the LLM improves accuracy in a later slice.

The principle: slice by pipeline depth and sophistication, not by technical component (that would be horizontal). Every slice produces observable output the downstream user can verify. "Build the ingestion layer" is horizontal. "Produce basic recommendations from yesterday's data" is vertical, thin but end to end.

### Bad: hiding system complexity inside a User Task

Journey says: "The dispatcher opens the morning dashboard and sees AI-generated route recommendations." Treating this as one User Task ("view recommendations") with no System Task.

Wrong because the pipeline behind it (trip ingestion, pattern analysis, route computation, recommendation generation) is months of work. Hiding it inside a story's context makes it invisible to planning, impossible to slice, and produces a story that fails INVEST's Small. The journey author assumed the pipeline exists. It does not.

The fix: surface the System Task in the backbone. Ask "what produces these recommendations?" Add System Tasks for the pipeline steps that carry real effort. The User Task ("view recommendations") then covers only the UI that displays what the pipeline produced.
