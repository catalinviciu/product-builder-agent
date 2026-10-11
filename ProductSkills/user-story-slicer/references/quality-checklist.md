# Story Quality Checklist & Anti-Patterns

## Story Quality Checklist

### Before writing
- [ ] Is this a vertical slice (touches UI + logic + data as needed)?
- [ ] Does it describe a change in system behavior from the user's perspective?
- [ ] Is the role specific (not just "a user")?

### INVEST check
- [ ] **Independent** -- can be delivered and tested without another story
- [ ] **Negotiable** -- describes what, not how (no click sequences)
- [ ] **Valuable** -- delivers a meaningful outcome a user cares about
- [ ] **Estimable** -- team can scope the work
- [ ] **Small** -- fits in a sprint (6-10 stories per sprint)
- [ ] **Testable** -- has clear pass/fail acceptance criteria

### AI-readiness check
- [ ] **Context block** present (stack, existing system, constraints)
- [ ] **Out of scope** explicitly listed
- [ ] **Dependencies** declared (what must exist before AI starts)
- [ ] **Human verification** steps described (how reviewer validates AI output)
- [ ] No ambiguous words ("appropriate", "relevant", "as needed") -- replace with specifics

### Granularity litmus test
- [ ] Read the story aloud. Does it sound like something a user would *ask to do*? (Good)
- [ ] Or does it sound like a step in a tutorial? (Too granular -- merge up)
- [ ] Or does it sound like a project? (Too big -- split using the 9 patterns)

---

## Common Anti-Patterns

Use this table when pushing back on user feedback that would break story quality.

| Anti-Pattern | Problem | Fix |
|---|---|---|
| **Vague stories** | "Handle vehicles appropriately" -- AI guesses wrong | Replace every ambiguous word with a specific behavior |
| **Horizontal slices** | "Build the API" / "Build the UI" -- no value alone | Combine into vertical slices that deliver end-to-end value |
| **Technical stories** | "As a developer, I want a database diagram" -- that's a task | Embed technical work inside user-facing stories |
| **"As a user..."** | Too generic -- doesn't help prioritize or empathize | Use specific roles: Fleet Manager, Dispatcher, Admin |
| **Splitting by architecture** | One story per layer -- fails Independent and Valuable | Split by behavior, not by component |
| **Giant stories** | "Manage fleet vehicles" -- too big to estimate or test | Apply the 9 splitting patterns |
| **Micro stories** | "Click the save button" -- a sub-task, not a goal | Merge into a single story per user intent |
| **Missing "so that"** | No one knows *why* -- AI builds more than needed | Add the benefit/value clause -- it constrains scope |
| **Solution-prescriptive** | "Add a dropdown with options X, Y, Z" -- locks design | Describe the need; let the team design the solution |
| **Dependent chains** | Story B can't start until Story A ships | Restructure so each story has its own Given (setup) |
| **No out-of-scope** | AI over-builds features nobody asked for | Add explicit "this story does NOT include" list |
| **Missing context** | AI invents its own conventions, ignores existing patterns | Add context block with stack, constraints, existing system state |
