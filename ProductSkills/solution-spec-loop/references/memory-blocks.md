# Memory blocks

The tree is the loop's memory. Each block below has a fixed label so a later round, a resumed run or a follow-up run can find it. All blocks are `type: "accordion"`, label <=40 chars, content <=3000 chars, Markdown.

To update a block: `pa_get_entity`, find the block index by label, then `pa_update_block({ entityId, blockIndex, patch: { content } })`. To add one: `pa_add_block` without an `id`.

---

## Writing for two readers

Blocks are read by the builder and by agents. The builder needs names; agents need IDs. Give both with an entity link:

- **Link every solution, assumption and test** as `[Title](#entity/<id>)`. The app shows the title and opens the entity on click; an agent reads the ID from the link. Never write a bare ID in a block.
- **Write types out in full**, never as codes:

| Stored value | Write |
|---|---|
| `usability` | Usability |
| `feasibility` | Technical feasibility |
| `desirability` | Value |
| `viability` | Business viability |
| `prototype` (test type) | Prototype test |
| `research_spike` | Research spike |
| `survey` | One-question survey |
| `data_mining` | Data mining |
| `executed` (evidence) | Executed (code or data was run) |
| `simulated` | Simulated (AI walkthrough) |
| `ai-premortem` | AI pre-mortem (not evidence) |
| `human` | Human (real people) |

- **Write rounds and runs as words:** "Run 2, Round 1", not "R1".

---

## On the opportunity

### `Spec Loop` (run state)

Created at Step 1, updated after every step. Rewrite it, don't append. It's how a resumed or follow-up run knows where things stand.

```markdown
**Status:** running | waiting for builder | complete
**Run:** <n>   **Step:** <number and name>   **Round:** <0 | 1 | 2>
**Started:** <YYYY-MM-DD>

**Codebase:** <path | greenfield>
**Workflow bounds:** <start> -> <end>
**As-is map:** <path | none>
**Starting screen:** <name as the user sees it> at `<route>` - `<component files>`

**Options**
- [<title>](#entity/<solutionId>) - <active | dropped: reason> - prototype v<n>
- ...

**Backup pool**
- <direction> - <why it was set aside>

**Builder feedback**
- Story map review, run <n>: <summary of the feedback and what changed>
- Run <n> start: <summary>

**Decisions made without the builder**
- <question> -> <answer and why>

**Open questions**
- <question the tree couldn't answer, and the reading used>
```

### `Spec Loop Scorecard`

Written at the end of each run (Step 15), replacing the previous run's version.

```markdown
**Options compared after run <n>** (<YYYY-MM-DD>)

| | [<Option A>](#entity/<id>) | [<Option B>](#entity/<id>) |
|---|---|---|
| Usability | <n passed of n tested> | ... |
| Technical feasibility | <n passed of n tested> | ... |
| Value | <n waiting for human tests> | ... |
| Business viability | <n waiting for human tests> | ... |
| Prototype | v<n> (tested), v<n+1> (untested) | ... |
| Rounds used | <1 or 2> | ... |

**Assumptions still open**
- [<assumption>](#entity/<id>) (<category>) - <why: failed without a re-test, or waiting for a human test>

**Untested since round 2**
- [<option>](#entity/<id>): <change> - touches [<assumption>](#entity/<id>)

**Human tests waiting, in order**
1. [<test title>](#entity/<id>) (<option>) - <why first>

**Recommended next step**
<one or two sentences>

**Previous runs**
- Run <n-1> (<date>): <one line: what it changed and found>
```

---

## On each solution

### `Kill Criteria`

Written at Step 6 from the advisor's output. Never edited afterwards.

```markdown
Drop this option if any of these happens and no adaptation gets around it:
- <observable result>
- <observable result>
```

### `Learnings`

The compressed memory every round and every follow-up run reads first. Rewritten (not appended) after every round and every journey change. Keep it under 3000 chars by merging and dropping what no longer matters.

```markdown
**What works**
- <finding> ([<test title>](#entity/<id>), <evidence level>)

**What failed and why**
- <finding> ([<test title>](#entity/<id>)) - <what changed because of it, or "change discarded: it broke a test that had passed">

**Builder feedback applied**
- <feedback> - <what changed>

**Open questions**
- <question>

**Next**
<what the next round or run should test or change>
```

### `Iteration Log`

One line per event, appended. Old lines are never edited.

```markdown
- Run 1, Round 1 | Technical feasibility | [<test title>](#entity/<id>) | PASS | Executed
- Run 1, Round 1 | Usability | [<test title>](#entity/<id>) | FAIL | Simulated | "<quoted observation>"
- Run 1, Round 1 | Spec changes | <part of the spec> - <change> (from [<test title>](#entity/<id>))
- Run 1, Round 1 | Prototype evolved -> v2 | <one-line summary>
- Run 1, Round 2 | Re-test of a passed test | [<test title>](#entity/<id>) | PASS on v2
- Run 1, Round 2 | Spec change undone in spec and prototype | broke [<test title>](#entity/<id>)
- Run 2 | Builder feedback applied | <one-line summary>
```

### `Prototype`

Written by the orchestrator only, never the PM, at the points listed under "Prototype block" in `SKILL.md`. It links every version that exists: the current tested version, the candidate when there is one, and all earlier versions.

```markdown
**[Current: v2](<served-url>/v2.html)** - passed the round 2 re-test.
**[Candidate: v3](<served-url>/v3.html)** - untested, built after round 2.

Starts on: <starting screen name>.
Earlier versions: [v1](<served-url>/v1.html)
```

The served URL is the path after `public/` under `http://localhost:3000/`.

### `Drop Reason`

Added only when the loop drops the option (Step 13), after the adaptation check found no way around a blocker.

```markdown
**Dropped in run <n>, round <r>.** <The blocker: which feasibility test failed or which kill criterion fired.>
Evidence: [<test title>](#entity/<id>).

**Adaptations considered**
- <change> - <why it doesn't get around the blocker, or what it would cost the option>
```

---

## On each assumption

Standard blocks from assumption-tester: `Impact if True`, `Evidence`. The loop rewrites `Evidence` after each test of this assumption:

```markdown
<Evidence known before the loop.>

**Loop results**
- Run 1, Round 1 | [<test title>](#entity/<id>) | PASS/FAIL | <evidence level> | <one-line observation>
```

Status: set per the status rules in `SKILL.md` each time a result is recorded. In short: `done` after a pass, `explore` while untested or after a fail, `dropped` when an adaptation replaced the approach it depended on (with a line in Evidence linking the replacement), back to `explore` if a passed test fails its re-test. Value and viability assumptions stay `explore` until a human test passes.

---

## On each test

Standard blocks from assumption-tester: `Define Test`, `Pass / Fail Criteria` (frozen). The loop adds:

### `Result: Run <n>, Round <r>` (usability and feasibility)

One block per round the test ran in, for example `Result: Run 1, Round 2`. A re-run adds a new block and leaves earlier ones as they were.

```markdown
**Verdict:** PASS | FAIL
**Tested on:** prototype v<n> | codebase `<path>`
**Evidence level:** Executed (code or data was run) | Simulated (AI walkthrough)
**Walkthrough log:** `<path to walkthrough.json>` (usability only)

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
**Evidence level:** AI pre-mortem. This is not a test result.

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
