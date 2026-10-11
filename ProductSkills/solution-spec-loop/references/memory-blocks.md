# Memory blocks

The tree is the loop's memory. Each block below has a fixed label so a later round, or a resumed run, can find it. All blocks are `type: "accordion"`, label <=40 chars, content <=3000 chars, Markdown.

To update a block: `pa_get_entity`, find the block index by label, then `pa_update_block({ entityId, blockIndex, patch: { content } })`. To add one: `pa_add_block` without an `id`.

---

## On the opportunity

### `Spec Loop` (run state)

Created at Step 1, updated after every step. Rewrite it, don't append. It's how a resumed run knows where it is.

```markdown
**Status:** running | waiting for builder | complete
**Step:** <number and name>   **Round:** <0 | 1 | 2>
**Started:** <YYYY-MM-DD>

**Codebase:** <path | greenfield>
**Workflow bounds:** <start> -> <end>
**As-is map:** <path | none>

**Options**
- <title> (`<solutionId>`) - <active | dropped: reason> - prototype v<n>
- ...

**Backup pool**
- <direction> - <why it was set aside>

**Decisions made without the builder**
- <question> -> <answer and why>

**Open questions**
- <question the tree couldn't answer, and the reading used>
```

### `Spec Loop Scorecard`

Written once, at Step 15.

```markdown
**Options compared** (<YYYY-MM-DD>)

| | <Option A> | <Option B> |
|---|---|---|
| Usability | <n passed / n tested> | ... |
| Feasibility | <n passed / n tested> | ... |
| Value | <n awaiting humans> | ... |
| Viability | <n awaiting humans> | ... |
| Prototype | v<n> (tested), v<n+1> (untested) | ... |
| Rounds used | <1 or 2> | ... |

**Untested since round 2**
- <option>: <change> - <which assumption it touches>

**Human tests waiting, in order**
1. <test title> (<option>) - <why first>

**Recommended next step**
<one or two sentences>
```

---

## On each solution

### `Kill Criteria`

Written at Step 6 from the advisor's output. Never edited afterwards.

```markdown
Drop this option if any of these happens:
- <observable result>
- <observable result>
```

### `Learnings`

The compressed memory every round reads first. Rewritten (not appended) after every round and every journey change. Keep it under 3000 chars by merging and dropping what no longer matters.

```markdown
**What works**
- <finding> (<test title>, <evidence level>)

**What failed and why**
- <finding> (<test title>) - <what changed because of it, or "change discarded: ratchet">

**Open questions**
- <question>

**Next**
<what the next round should test or change>
```

### `Iteration Log`

One line per event, appended. Old lines are never edited.

```markdown
- R1 | feasibility | <test title> | PASS | executed
- R1 | usability | <test title> | FAIL | simulated | "<quoted observation>"
- R1 | journey change -> v2 | <one-line summary>
- R2 | ratchet | <test title> | PASS on v2
- R2 | journey change discarded | broke <test title>
```

### `Prototype`

Owned by the prototype-builder format. In this loop it links the current tested version and, when one exists, the untested candidate:

```markdown
**[Current: v2](<served-url>/v2.html)** - passed the round 2 ratchet.
**[Candidate: v3](<served-url>/v3.html)** - untested, built after round 2.

Earlier versions: [v1](<served-url>/v1.html)
```

The served URL is the path after `public/` under `http://localhost:3000/`.

### `Drop Reason`

Added only when the loop kills the option (Step 13).

```markdown
**Dropped in round <r>.** <Which kill criterion fired, or which feasibility test failed twice.>
Evidence: <test title(s)>.
```

---

## On each assumption

Standard blocks from assumption-tester: `Impact if True`, `Evidence`. The loop rewrites `Evidence` after each test of this assumption:

```markdown
<Evidence known before the loop.>

**Loop results**
- R1 | <test title> | PASS/FAIL | <evidence level> | <one-line observation>
```

Status: `explore` until a usability or feasibility test passes, then `done`. If a later run of that test fails (a ratchet failure), set it back to `explore`. Value and viability assumptions stay `explore` until a human test passes.

---

## On each test

Standard blocks from assumption-tester: `Define Test`, `Pass / Fail Criteria` (frozen). The loop adds:

### `Result R1`, `Result R2` (usability and feasibility)

One block per round the test ran in. A round 2 re-run (failed test or ratchet) adds `Result R2` and leaves `Result R1` as it was.

```markdown
**Verdict:** PASS | FAIL   **Round:** <r>   **Prototype:** v<n> | **Codebase:** <path>
**Evidence level:** executed | simulated

**Observations**
- "<quoted from the tester report>"

**Why this verdict:** <which criterion each observation meets or misses>
```

### `Learning`

Rewritten after each run of the test.

```markdown
<One or two sentences: what this tells the team about the solution.>
```

Status after the run: `done`.

### `AI Pre-mortem` (value and viability)

```markdown
**Evidence level:** ai-premortem. This is not a test result.

<The pre-mortem agent's reasoning: the persona's likely response, what must be true, the weakest link, the most likely failure.>
```

### `Human Test Plan` (value and viability)

```markdown
**Who:** <number and profile>
**Run:** <script, survey question or setup>
**Record:** <what to write down>
**Apply the criteria:** <how the frozen Pass / Fail Criteria map to what's recorded>
```

Status stays `draft` until a person runs it.
