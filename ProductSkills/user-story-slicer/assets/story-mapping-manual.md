# Story Mapping Reference (Token-Efficient)

Based on Jeff Patton's *User Story Mapping* (O'Reilly, 2014).

---

## Anatomy of a Story Map

```
← NARRATIVE FLOW (left to right) →

ACTIVITIES    [Activity 1]    [Activity 2]    [Activity 3]       ← Backbone
USER TASKS    [Task A][Task B] [Task C][Task D] [Task E]         ← Steps under Activities
USER STORIES   story            story            story           ← Ribs (prioritized top to bottom)
               story            story            story
```

---

## Key Definitions

| Element | Definition | Rules |
|---------|-----------|-------|
| **Activity** | Big thing people do -- multi-step, no single precise workflow. "Managing email", "Booking a trip", "Filter livemap by attributes" | Backbone. Not prioritized -- it just IS. A single solution often = one Activity. Do NOT force multiple Activities when one suffices. |
| **User Task** | Meaningful step within an Activity. "Send message", "Search for homes", "Select and apply filters" | Arranged in narrative order under its Activity. |
| **User Story** | Smallest buildable piece -- a specific way to accomplish a User Task | Hangs below its User Task. Prioritized top to bottom. |
| **Backbone** | The top rows -- Activities and User Tasks read left to right | The narrative. Never cut it down. |
| **Walking Skeleton** | Topmost stories under each backbone element | Smallest system with end-to-end functionality = MVP. |

**Activity scope guidance:** When slicing a single solution, one Activity with many User Tasks is the normal pattern. Multiple Activities appear only when the solution spans fundamentally different user goals (e.g., "Create attributes" and "Filter by attributes" are two different Activities). A product-level story map spans many Activities and personas.

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

## Release Slicing

Draw horizontal lines to create releases:

```
Activity 1     | Activity 2     | Activity 3
────────────────────────────────────────────────
Release 1 (MVP): story, story  | story         | story         ← Walking Skeleton
────────────────────────────────────────────────
Release 2:       story         | story, story  | story         ← Enhanced
────────────────────────────────────────────────
Release 3:       story, story  | story         | story, story  ← Full vision
```

Each horizontal slice = a viable release delivering end-to-end value. Never "release a car without brakes."

---

## Quality Checks for Journey Input

When reviewing a user journey before slicing, check:

- [ ] Are Activities clearly separable (different big goals)?
- [ ] Are User Tasks within each Activity in logical narrative order?
- [ ] Does the journey cover the full end-to-end flow (no missing backbone elements)?
- [ ] Are there gaps where "you missed a step" would apply?
- [ ] Is the journey told from the user's perspective (not system internals)?
- [ ] Could you explain the system to a stranger by walking this journey left to right?

---

## Common Mistakes (Relevant to Slicing)

| Mistake | Fix |
|---------|-----|
| Prioritizing backbone elements against each other | Prioritize the stories below each, not the backbone itself |
| Building one Activity completely before starting others | Build thin slices across all Activities |
| Stories too granular ("click the X button") | Each story = one meaningful user intent. Merge micro-actions. |
| Discarding the backbone after decomposition | Keep the map alive. It IS the backlog with context. |
| One story spanning multiple User Tasks | Split or reassign to its primary User Task |
