# Tracing a workflow through a codebase

The map lives in the code. This is how you follow one workflow from its entry point to its edges and record what a user or system can actually do at each step.

---

## The evidence rule

Read before you claim. Every step and every story line traces to code you opened. If you infer behavior you did not see, mark it unverified. A map built from guesses is worse than a short map built from fact, because it reads as true.

Track the file behind each finding as you go. You cite these in the output, so a reader can check your work and an AI can reopen the same files.

**Search with the right tool, and never downgrade a finding to "unverified" because one tool could not reach the code.** A workspace-scoped text search only sees folders open in the workspace. When the repo you are tracing is not one of them (a cloud repo, or a local clone outside the workspace), that search returning nothing is not evidence of absence - it means you used the wrong tool. Switch:
- **Cloud repo:** search the project through the `gitlab` MCP.
- **Local clone outside the workspace:** run `git grep` in that repo through the terminal, or read the files by absolute path.
"I could not grep it" is never a valid reason to leave a claim unverified when one of these would have answered it. Exhaust them first; only then is "unverified" honest.

---

## Follow the flow the way a user moves through it

Trace layer by layer, in the order the feature runs, not the order files sit in the repo.

**1. Entry surface.** Start where the user acts: the page, route, or screen the user named. Find the top-level component the user's action lands in. The map begins at the user, not at a system step, so if you were handed a system file, walk back to the user action that triggers it and start there. This anchors the first Activity.

**2. Steps.** From the entry, find the meaningful moments the flow passes through. In a UI: what the user sees first, what they act on, what happens next, where the flow ends. Each moment that uses a different surface or serves a different intent is a candidate step. These become User Tasks. Stop at the step that contains the end point the user gave in Phase 1. That step is the last one on the map (end inclusive); do not trace past it.

**3. Components and handlers per step.** For each step, find the components, event handlers, or functions that make it work. This tells you what functionality the step offers - the raw material for the coarse story lines.

**4. Data and API layer.** Follow each step down to its data: the API calls, queries, or state changes behind it. A plain read or write behind a button stays inside the step's story line as context. It is not its own step. **Record the endpoints** each step calls - method and path (e.g. `POST /assignments/search`) - from the service or HTTP-client code. You list these in the Code map, grouped by repo.

**5. System and async work.** Watch for work a human does not drive: pipelines, background jobs, event chains, scheduled tasks, agentic or ML steps. If the flow shows the user results that something had to compute first, find what computes them. Non-trivial automated work is a System Task step, tagged `[System]`. These are never System Tasks: a CRUD endpoint, a synchronous request and response, a query behind a button. That work stays inside its step's story line as context. The bar is pipeline depth - could the automated work slice into several steps of its own? If not, it is not a System Task.

**6. The response, not just the trigger (mandatory for every user action).** Finding the click that fires an action is half the trace. You are not done with a step until you have followed it to **what the user sees back**. For each user action, trace the return path and record which of these it is:
- **Inline result** - data comes back and renders in place.
- **Navigation** - the user is sent to another screen, tab, or app (follow where, e.g. a `window.open` to another microsite is a different destination, not the same panel).
- **New state on the same surface** - a flag flips, a control enables, a badge appears.
- **Deferred / async arrival** - the action fires and returns only an acknowledgement; the real result shows up later, often elsewhere, often after a backend pipeline. This is the **fire-and-forget signal**: a handler that dispatches a request and maps the response to nothing but a success flag (no returned data) is telling you two things - (a) there is probably a backend pipeline behind it, so run the cross-repo gate, and (b) the result surfaces in a *separate* place the user reaches later, so trace that surface and give it its own step or story line. The request and the result are two different moments; do not collapse them into one.
- **Nothing** - no confirmation, no placeholder, no state change the user can perceive. This is a real finding (see "Absence is a finding" in `story-map-format.md`), not a blank to skip. Record it plainly.

Do not guess the response. If a success flag is set, find who reads it before you say whether the user sees anything - use the search tools above rather than assuming. "No confirmation found" is only honest after you have looked for the consumer of that flag.

---

## What signals a step

- A new screen, panel, modal, or route
- A different interaction surface than the step before it
- A distinct user intent (browse vs. act, view vs. edit)
- A handoff to an automated process
- An empty or error path the code handles in a *different* component from the step it falls out of

## What does NOT signal a step

- A single click inside a larger goal
- Loading an empty container - the step is "use the content", not "open the shell"
- A CRUD call that serves one UI action - it belongs inside that step's story line
- An empty or error path in the *same* component as its step - that is a scenario of the step, not a step
- Read-only display, unless it carries real weight of its own - an API call, a tree to build, standalone value. Rendering a list of chips, badges, or counts stays with the interaction it serves

---

## Merge before you record

Before you write a step down, check it against the step before it. Same surface plus same state machine is one step, even when the two feel like different intents. "First filter" and "change the filter" in the same panel are one step - the second is just the panel working when a filter already exists. Two entry paths into one state machine do not make two steps. "Remove via a chip" is a different surface with a different pattern, so it can stand alone.

This keeps the backbone honest and stops the map inflating into a click log.

---

## Tracing across repos

A workflow's dependencies often live outside the entry repo - a shared API, a data service, a component library. Most System steps are exactly this: the entry repo calls an endpoint, the real work runs in another service. When the trace hits a call into code that is not in the entry repo:

1. **Find where it lives.** Use the `dev-portal-mcp` to find which service or repo owns the dependency, API, or endpoint you hit.
2. **Open it there.** Use the `gitlab` MCP to read that repo (recipe below).
3. **Trace in.** Follow the dependency far enough to see what it does for the step, then come back to the main flow.

Read what carries the map, not every repo. A shared util behind one call stays as context inside the step's story line. A whole data pipeline in another repo that produces what the user sees is its own System Task, cited to that repo.

Record which repo each finding came from. The source citation names the repo whenever it is not the entry one, so a reader can find it.

*(SKILL.md Phase 2 makes this mandatory for every System step and sets when to trace deep vs just locate-and-name. This section is the how; that gate is the rule.)*

### Reading a repo: local vs cloud

- **Local repo:** read files directly by path.
- **Cloud GitLab repo:** read through the `gitlab` MCP - the default, and it reads the repo in place with no clone. Do not ask the user to clone a cloud repo as your first move; use this sequence:
  1. `search_repositories` with the service name -> get the `project_id` (a number) and the full path.
  2. `get_repository_tree` with that `project_id`, `recursive: true`, and `pagination: keyset` -> see the file layout and find the files that carry the step.
  3. `get_file_contents` with the `project_id`, the file path, and the `ref` (the repo's default branch, e.g. `develop` or `master`) -> read the actual code.
  4. Need to find a symbol or route across the repo? Search the project through the GitLab MCP rather than guessing paths.

**When cloning is allowed.** Clone a cloud repo only if the user explicitly asks for a local clone, or the GitLab MCP genuinely cannot do what the trace needs (e.g. a repo it cannot reach, or analysis that needs the code local). In that second case, do not clone on your own - say what the MCP could not do and why a clone would fix it, then ask the user, and clone only once they grant it. A clone is the fallback, not the reflex.

Either way the evidence rule holds: cite the real file and repo you read.

## Using a subagent

For a large or unfamiliar codebase, dispatch `context-gatherer` to trace the flow: give it the entry point and ask for the steps, the components and handlers per step, the data calls, the repos involved, and any system or async work, each with file paths. Treat its report as your reads. Then reopen the files behind the steps that carry the map and verify them before you write, since those lines are the ones a reader will trust most.

**A subagent scoped to the entry repo cannot cross repo boundaries.** It will trace to the endpoint call and stop, flagging the backend as external. That flag is not the answer - it is your cue to run the cross-repo lookup yourself with the two MCPs (see SKILL.md Phase 2). Do not copy an "external / not traced" flag into the output when the gate says to resolve it.

---

## When the code is unclear

If you cannot tell what a step does from the code - dead paths, heavy indirection, config-driven behavior you cannot resolve - say so. Record the step, write what you can support, and flag the rest as unverified in the output. Do not fill the gap with a plausible guess.
