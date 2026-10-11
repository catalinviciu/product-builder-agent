# Story map format for reverse-engineered maps

Based on Jeff Patton's *User Story Mapping* (O'Reilly, 2014), adapted for reading a map out of shipped code rather than planning one.

---

## The shape

```
← NARRATIVE FLOW (left to right) →

ACTIVITY      [ The big thing this workflow does ]              ← Backbone
STEPS         [User A] [User B] [System C] [User D]             ← User + System Tasks
STORIES        line     line     line       line                ← coarse one-liners
               line              line
```

---

## Definitions

| Element | What it is | Rule |
|---------|-----------|------|
| **Activity** | A big thing the user does. "Filter the livemap", "Review flagged contracts" | A small workflow is one Activity. A bigger one splits into several - a new Activity begins when the user's goal changes to a fundamentally different one. Split on real goal shifts, not to pad. |
| **User Task (step)** | A meaningful moment a human drives, in narrative order | The order the flow runs, left to right. |
| **System Task (step)** | A meaningful moment an automated process drives - pipeline, job, event chain, agent | Same backbone level as a User Task. Tag `[System]`. Only for non-trivial automated work that runs on its own. **The test: would it still run if no one opened the feature?** A build pipeline, a scheduled job, an event chain, an agentic flow - yes, that is a System Task. NOT a System Task: client-side effects fired by a user action, however many they are; a sync request-response behind a click; UI state setup or teardown. That work is the implementation of the user step that triggered it - fold it into that step's story line, do not give it its own step. |
| **Story line** | A coarse one-liner naming functionality the code provides at that step | One line. What the user or system can do there. Not a buildable unit. |
| **Backbone** | The Activity and its steps, read left to right | The narrative. It is what the feature is. |

---

## Rules for the reverse map

1. **Left to right is the narrative.** Order steps as the flow runs, the order you would explain the feature to a stranger. Not repo order.
2. **It starts at the user.** The first step is always a user action. The system appears where it responds to the user, never as the opening frame.
3. **The backbone is description, not priority.** You are recording what exists, so there is no walking skeleton and no release slicing. Skip them.
4. **Steps come from the code, in the order the code runs them.**
5. **Story lines are coarse.** One meaningful piece of functionality per line. Merge clicks that serve one goal.
6. **Split Activities on goal shifts.** A bigger workflow can hold several Activities. Start a new one where the user's goal changes to a fundamentally different one, not at every step.

---

## Backbone self-check (run before you present)

The definitions above are the criteria. This is where you apply them. Do not present a backbone until it passes all four - naming a phase after each moment of the flow is the easy mistake, and these catch it.

1. **Name each activity's goal in one sentence.** Write the user goal each activity serves. If you cannot say it without listing steps, it is not an activity.
2. **Merge adjacent activities that share a goal.** Open, load, and first render are one goal - access the feature. Watch, inspect, play a clip, and close are one goal - review the journey. If two activities in a row serve the same goal, they are one activity.
3. **A one-step activity is not an activity.** A lone step folded under a banner is a step in a neighbouring activity. Move it.
4. **Test every System step with the "would it run on its own?" question** from the definition. If it only runs because a user clicked, it is not a System step - fold it into the click's step.

A phase of the flow (open, load, watch, change, close) is not automatically an activity. Most features have two or three real activities, not one per phase.

### Worked example - Replay

Wrong - a phase becomes an activity, and client work becomes a system step:
- A1 Open replay -> step "click Replay", step "[System] open the overlay and snapshot map state"
- A2 Load the journey -> step "[System] fetch journey", step "[System] keep it live"
- A3 Watch -> ...
- A4 Work with video -> ...
- A6 Close replay -> step "click close", step "[System] tear down and restore the map"

Right - phases fold into real goals, client effects fold into their click:
- **A1 Access replay** (goal: get into replay on a chosen vehicle) -> step "Open replay from the vehicle balloon" (the overlay open and map snapshot are this click's own work, folded in), step "[System] Load the journey into replay" (fetch and keep-live are behaviours under this one step, not steps)
- **A2 Review the journey** (goal: understand what happened) -> steps: auto-reveal the route, read the timeline, select a segment, step through positions, open a video event, request a clip, close replay
- **A3 Change what is replayed** (goal: replay something else) -> steps: change the date, move between days, switch trackable

The build pipeline that assembles journeys before anyone opens replay stays its own `[System]` activity - it passes the "would it run on its own?" test.

---

## Coarse story lines: the bar

Good (functionality, one line):
- "Browse available attributes in a collapsible tree"
- "Filter the map by selecting attribute values"
- "[System] Recompute matching vehicles when filters change"

Too granular (tutorial clicks - merge these):
- "Click the filter icon" + "Expand the tree" + "Tick a checkbox" + "Press apply"
  becomes "Filter the map by selecting attribute values"

Too vague (says nothing - open the code and name it):
- "Manage filters"
- "Handle data"

## Absence is a finding

What the code does *not* do at a step is often as telling as what it does - so record it, do not skip it. When you trace a user action to its response (see tracing-method.md step 6) and find a gap, that gap earns a line or a note:
- No confirmation that an action was sent or accepted.
- No placeholder or "processing" state while an async result is pending.
- No empty state, or no error handling on a path that can fail.
- A result that arrives silently, with nothing telling the user it is ready.

Record a confirmed gap as its own story line where it shapes the experience - e.g. "No confirmation is shown that the request was sent" - in the Map table, or gather several into a short "Gaps in the flow" note. Do not put it under "Not verified from code": a gap you looked for and found absent *is* verified. Reserve "Not verified" for what you could not check. A PM reading the map needs the missing feedback as much as the present features; leaving it out reads as if the experience is complete when it is not.

---

## The Mermaid backbone diagram

Show the backbone as a Mermaid diagram, both in chat (Phase 3, for review) and at the top of the MD file. It reads left to right, so the narrative is visible at a glance in a way a table hides.

The whole journey is **one** `flowchart TB` diagram. Each Activity is a lane that stacks top to bottom, one Activity per row. Inside a lane, the Activity name is a **banner node on its own row**, with the steps in a row beneath it. This keeps the Activity name on one line and off the step boxes - a plain subgraph label wraps and collides with the nodes, which is the bug this layout avoids.

Structure per lane: an outer `TB` subgraph holds the banner node and a nested `LR` subgraph of the steps, connected by a plain line. Lanes connect to each other by a plain line too. The journey title is a markdown heading above the diagram.

The spine is **sequential, not branching**. Draw the steps in narrative order, one arrow to the next, even when a step is optional. A user can skip a step - that does not make it a branch. You are drawing the order the steps come in, not a flow chart of every path through the code. Avoid fan-out arrows (one node pointing to several); they turn the narrative into a decision tree. When a step has more than one entry path (e.g. reached from the list or after a save), say so in the node label rather than drawing extra arrows into it.

## No punctuation in node labels

This is the top cause of a "Syntax error in text" render. Mermaid's parser trips on `()`, `/`, `:`, and similar even inside quotes, in the versions these maps render on. Keep labels to plain words and hyphens.

- Wrong: `s6["Open assign for a value (from the list, or after a create/edit)"]`
- Right: `s6["Open assign for a value - from the list or after a save"]`

For a system step, do not write `[System]` - the square brackets break the node. Prefix the label with `SYS -` instead, so the diagram marks system steps the way the Map table's Type column does.

## Styling with Reveal tokens

Colour the two layers, using the DESIGN.md tokens from the `reveal-prototype` skill (`assets/DESIGN.md`). Bigger text on the Activity banners:

- **Activity banner node:** fill `#E3F2FD`, stroke `#006FC1`, text `#000000`, `font-size:18px`, bold. (`container-information` / `border-focus`)
- **Step nodes:** fill `#FFFFFF`, stroke `#D8DADA`, text `#000000`, `font-size:14px`. (`background` / `border`)

The lane subgraphs carry blank `" "` labels, so they need no fill. The journey title is a markdown heading above the diagram.

## The pattern

```markdown
## Workflow name - user journey

​```mermaid
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
​```
```

Rules:
- **`flowchart TB` at the top, one Activity lane per row.** Each lane is a `TB` subgraph with a blank label holding a banner node (`t1`, styled `activity`) and a nested `LR` subgraph of the step row.
- **Banner on its own row.** Connect the banner to its step subgraph with a plain line (`t1 --- A1S`), no arrowhead. This puts the Activity name on a separate row above the steps and lets it render on one line.
- **Connect lanes with a plain line** between the outer subgraph ids (`A1 --- A2`), no arrowhead.
- Steps inside a lane flow left to right with a single `-->` chain. Arrows here, because they show narrative direction. Sequential, not branching.
- The first step of the first lane is always a user step.
- No punctuation in labels. System steps use the `SYS -` prefix, never `[System]`.
- The journey title is a markdown heading above the diagram.
- The blank `" "` lane labels can render as faint empty frames in some viewers. If that looks wrong, fall back to flat `flowchart TB` lanes with short one-line Activity labels.
- If your renderer ignores `font-size`, the colour and weight still carry the hierarchy - keep them.

---

## Output MD layout

````markdown
# Story Map: [Workflow Name]

> Source: reverse-engineered from [entry repo] (GitLab: [path or local])
> Entry point: [the user action the flow starts from]
> End point: [the user action or result the flow stops at]
> Other repos traced: [list, or "none"]
> Generated: [date]
> Method: traced from code, read-only. Story lines are coarse - functionality per step, not buildable stories.

---

## [Workflow name] - user journey

[The single styled `flowchart TB` diagram from "The pattern" above: one Activity lane per row, steps chained left to right inside each lane, lanes connected top to bottom, and the two-layer Reveal-token classDef block. Title is this markdown heading, not a box. No punctuation in labels.]

---

## Map

| Activity | Step | Type | Functionality (story line) | Source |
|----------|------|------|----------------------------|--------|
| [Activity] | [Step 1] | User | [coarse line] | `entry-repo / file.tsx` - handlerA, handlerB |
| [Activity] | [Step 1] | User | [coarse line] | `entry-repo / view.html` - the list block |
| [Activity] | [Step 2] | User | [coarse line] | `entry-repo / service.ts` - methodName |
| [Activity] | [System] [Step 3] | System | [coarse line] | `other-repo / pipeline.ts` - run |

---

## Code map

Grouped by repo. The components and files touched, and the API endpoints called. This is an inventory, not a second mapping - the story lines above already cite their file.

### [entry repo]

**Components and files**
- `file.tsx` - what it is
- `other.ts` - what it is

**Endpoints called**
- `POST /some/path` - what it does
- `GET /another/path` - what it does

### [other repo, if any]

**Components and files**
- `pipeline.ts` - what it is

**Endpoints called**
- `POST /pipeline/run` - what it does

---

## Not verified from code

- [Anything the trace could not confirm, said plainly. Omit this section if everything checked out.]
````

**Layout rules:**
- The Mermaid diagram leads, so the reader sees the whole narrative before the detail.
- The Map table keeps the `Type` column and the `[System]` tag, so system work reads apart from user work.
- **The Source column carries the detail: repo, file, and the specific functions or handlers** behind that story line (e.g. `entry-repo / file.ts - openCreateForm, commitCreate`). Name the repo in every row. This is the traceability a reader uses to jump straight to the code, so do not thin it out.
- The Code map is the repo-grouped inventory on top of that: the files touched and the endpoints called. List an endpoint once, even if several steps call it. If the workflow is one self-contained repo with no API of its own, say so and drop the endpoints subsection.
- A line with no source does not belong in the Map - it goes under "Not verified from code".
- Keep the "Not verified" section honest and short. If the trace was clean, drop the section entirely.
