# Story Mapping Reference (Token-Efficient)
# Story Mapping Reference

Based on Jeff Patton's *User Story Mapping* (O'Reilly, 2014).

---

## Anatomy of a Story Map

```
← NARRATIVE FLOW (left to right) →

ACTIVITIES    [Activity 1]    [Activity 2]    [Activity 3]       ← Backbone
TASKS         [System A][User B] [User C][User D] [System E]     ← Steps (User + System Tasks)
USER STORIES   story            story            story           ← Ribs (prioritized top to bottom)
               story            story            story
```

---

## Key Definitions

| Element | Definition | Rules |
|---------|-----------|-------|
| **Activity** | Big thing people do -- multi-step, no single precise workflow. "Managing email", "Booking a trip", "Filter livemap by attributes" | Backbone. Not prioritized -- it just IS. A single solution often = one Activity. Do NOT force multiple Activities when one suffices. |
| **User Task** | Meaningful step within an Activity where the actor is a human. "Send message", "Search for homes", "Select and apply filters" | Arranged in narrative order under its Activity. |
| **System Task** | Meaningful step within an Activity where the actor is an automated process that must run to produce the beneficiary's data: a pipeline, an agent, a stored procedure, a database system. "[System] Generate route recommendations", "[System] Parse and classify documents" | Same backbone level as User Tasks. Tagged `[System]`. Stories still name a human persona, the beneficiary the platform serves. A new API is not a System Task -- it is a story under the Task that needs it. In a platform-only flow the whole backbone is System Tasks. See the System Task rules below. |
| **User Story** | Smallest buildable piece -- a specific way to accomplish a User Task or System Task | Hangs below its Task. Prioritized top to bottom. |
| **Backbone** | The top rows -- Activities and Tasks (User + System) read left to right | The narrative. Never cut it down. |
| **Walking Skeleton** | The topmost stories across the whole backbone | Smallest set that closes the flow end to end. For a full journey, the thinnest path the persona completes start to finish. For a platform-only flow, the thinnest pipeline that produces usable output from first input to last stage. This is release Slice 1; its outcome is successful end-to-end completion. |
| **Horizontal slice** | A band cutting across the whole backbone | A release increment made up of stories across the backbone. Follow Phase 4 in `../SKILL.md` for Slice outcomes and Phase 5 for sequencing and story assignment. |

**Activity scope guidance:** When slicing a single solution, one Activity with many User Tasks is the normal pattern. Multiple Activities appear only when the solution spans fundamentally different user goals (e.g., "Create attributes" and "Filter by attributes" are two different Activities). A product-level story map spans many Activities and personas.

---

## System Task rules

A **System Task** is automated work that must run so the beneficiary gets the data they need: a pipeline, an agent, a stored procedure, a database system.

**The test:** would it run if no one opened the feature? A scheduled pipeline, an agent, an event chain, yes. Client-side effects fired by a user's click, a query behind a button, UI state setup, no. That work folds into the user step that triggers it; it is not its own step. In a platform-only flow no one opens anything, so the test becomes: is it triggered by a schedule, an event, or an upstream stage, and does it transform or produce data? Yes to that is a stage of its own; work that neither is triggered independently nor transforms data folds into the stage that drives it.

**A new API is not a System Task.** It is a story under the User Task that depends on it, not a backbone step. If the APIs exist already, the User Task story just consumes them (note it in Context). If they need building, add a story for that API under the same User Task.

**Existing vs new decides whether it carries stories:**

| Case | Backbone | Stories |
|------|----------|---------|
| Built new (pipeline, agent, stored proc, database) | System step, Type `System` | Yes, sliced by pipeline depth |
| Reused unchanged (any existing system) | System step, Type `System (existing)` | None. Skip it when numbering |

Show a reused system in the backbone anyway. The flow has to be honest about what runs to produce the user's data, even when the team builds none of it. Tagging it `System (existing)` says "this runs, we are not building it".

**Detect implied System Tasks.** When the journey opens with the user viewing computed, generated, or transformed data without saying what produces it, ask. If a pipeline, agent, or stored procedure has to run first, it is a System step, new or existing. Surface it rather than hiding months of work inside a User Task story.

**Platform-only flows are all System Tasks.** When the flow has no user interface, the whole backbone is System Tasks in pipeline order and there is no User Task to hang them under. The detection work flips from "did the author hide a pipeline inside a user step" to "is any stage that produces or transforms data hidden inside another, and does every stated output have stages behind it". Siblings vary on pipeline stage or data source, and the one-axis test still holds.

**System Task stories name a persona,** whoever the platform does the work for, the beneficiary who relies on the output even when they never touch the pipeline. Never "the system". They slice by pipeline depth: the skeleton is the simplest pipeline that produces usable output; later slices add sources, accuracy, or richness. In a mixed flow, this depth slicing happens inside the stories; the walking skeleton is still judged by whether the persona completes the end-to-end flow, not by pipeline maturity.

---

## Core Rules

1. **The map tells a story.** Left to right = narrative flow. The order you'd explain it in.
2. **The backbone is not prioritized.** You prioritize the details (stories) below it.
3. **Walking Skeleton first.** Topmost slice across the whole backbone = MVP. Build end-to-end, then deepen.
4. **Never cut down the tree.** Keep the backbone visible. A flat backlog destroys context.
5. **Build across, not deep.** Don't complete one Activity fully before starting others. Build thin horizontal slices across all Activities.

---

## How to Build the Backbone

1. **Frame:** What problem? Who? Why?
2. **Tell the story:** Map the user's journey at the highest level -- Activities left to right.
3. **Break down:** Under each Activity, identify User Tasks in narrative order.
4. **Walk it:** Narrate end to end. Listen for gaps ("you missed a step here").

**Finding order:** Ask someone to explain what the system does. The order they explain it in = the correct order.

---

## Horizontal slices map to outcomes

This diagram shows release slices crossing all Activities in the backbone. For Slice outcomes and metrics, follow Phase 4; for story sequencing and assignment, follow Phase 5 in `../SKILL.md`.

```
Activity 1     | Activity 2     | Activity 3
────────────────────────────────────────────────
Slice 1:  story, story  | story         | story      ← Walking skeleton
────────────────────────────────────────────────
Slice 2:  story         | story, story  | story      ← Learning outcome
────────────────────────────────────────────────
Slice 3:  story, story  | story         | story      ← Behaviour-change outcome
```

---

## Quality Checks for Journey Input

When reviewing a user journey before slicing, check:

- [ ] Are Activities clearly separable (different big goals)?
- [ ] Are User Tasks within each Activity in logical narrative order?
- [ ] Does the journey cover the full end-to-end flow (no missing backbone elements)?
- [ ] Are there gaps where "you missed a step" would apply?
- [ ] Full journey: is it told from the user's perspective (not system internals)? Platform-only: are the stages in data-flow order, first input to last output?
- [ ] Could you explain the flow to a stranger by walking it left to right?
- [ ] **System Task check:** Does the journey assume computed results, AI-generated content, or transformed data that doesn't exist today? If yes, is the process that produces it represented as a System Task in the backbone? Surface missing System Tasks -- especially when the journey starts with "user views/receives [something complex]" without explaining where it comes from.

---

## Common Mistakes (Relevant to Slicing)

| Mistake | Fix |
|---------|-----|
| Prioritizing backbone elements against each other | Prioritize the stories below each, not the backbone itself |
| Building one Activity completely before starting others | Build thin slices across all Activities |
| Stories too granular ("click the X button") | Each story = one meaningful user intent. Merge micro-actions. |
| Discarding the backbone after decomposition | Keep the map alive. It IS the backlog with context. |
| One story spanning multiple User Tasks | Split or reassign to its primary User Task |

---

## The Mermaid backbone diagram

Show the backbone as a Mermaid diagram: in chat when presenting for review, and at the top of the output MD file. It reads left to right, so the narrative is visible at a glance in a way a table hides.

The whole journey is **one** `flowchart TB`. Each Activity is a lane that stacks top to bottom, one per row. Inside a lane, the Activity name is a **banner node on its own row**, with the steps in a row beneath it. A plain subgraph label wraps and collides with the nodes, which is the bug this layout avoids.

Structure per lane: an outer `TB` subgraph holds the banner node and a nested `LR` subgraph of the steps, connected by a plain line. Lanes connect to each other by a plain line too.

### Two rules that break the render

1. **No punctuation in node labels.** Mermaid trips on `()`, `/`, `:`, and similar, even inside quotes. Keep labels to plain words and hyphens. `s1["Open assign for a value - from the list or after a save"]`, never `s1["Open assign (from list, or after create/edit)"]`.
2. **System steps use a `SYS -` prefix, never `[System]`.** The square brackets break the node. The Map table still uses `[System]`; only the diagram swaps it for `SYS -`.

### The spine is sequential, not branching

Draw steps in narrative order, one arrow to the next, even when a step is optional. A user skipping a step does not make a branch. Avoid fan-out arrows (one node to several); they turn the narrative into a decision tree. When a step has more than one entry path, say so in the label rather than drawing extra arrows in.

### Styling

Two layers, coloured with Reveal tokens, bigger text on the banners:
- **Activity banner:** fill `#E3F2FD`, stroke `#006FC1`, text `#000000`, `font-size:18px`, bold.
- **Step nodes:** fill `#FFFFFF`, stroke `#D8DADA`, text `#000000`, `font-size:14px`.

Lane subgraphs carry blank `" "` labels, so they need no fill. If a renderer shows the blank lanes as faint empty frames and it looks wrong, fall back to flat `flowchart TB` lanes with short one-line Activity labels. If a renderer ignores `font-size`, colour and weight still carry the hierarchy.

### The full pattern

```
flowchart TB
  subgraph A1[" "]
    direction TB
    t1["A1 - First activity"]:::activity
    subgraph A1S[" "]
      direction LR
      s1["Land on the entry screen"] --> s2["Do the next thing"]
      s2 --> s3["Do a later thing"]
    end
    t1 --- A1S
  end
  subgraph A2[" "]
    direction TB
    t2["A2 - Second activity"]:::activity
    subgraph A2S[" "]
      direction LR
      s4["SYS - process the input"] --> s5["Review the result"]
    end
    t2 --- A2S
  end
  A1 --- A2

  classDef step fill:#FFFFFF,stroke:#D8DADA,color:#000000,font-size:14px;
  classDef activity fill:#E3F2FD,stroke:#006FC1,color:#000000,font-size:18px,font-weight:bold;
  class s1,s2,s3,s4,s5 step;
```

Rules recap:
- `flowchart TB` at the top, one Activity lane per row.
- Banner on its own row, connected to its step subgraph by a plain line (`t1 --- A1S`), no arrowhead.
- Lanes connect by a plain line between the outer subgraph ids (`A1 --- A2`), no arrowhead.
- Steps flow left to right with a single `-->` chain. Sequential, not branching.
- For a full journey, the first step of the first lane is a user step. For a platform-only flow there is no user step: the first step is a System step and every step carries the `SYS -` prefix.
