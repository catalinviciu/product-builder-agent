---
name: solution-spec-loop
description: Runs the solution spec loop on one opportunity. Maps the existing code, brainstorms 5 directions, has an advisor refine them into at least 2 solution options, gets human approval, then builds a story map and baseline prototype per option and tests every critical usability and feasibility assumption in up to 2 rounds, updating the journey and prototype after each round. Value and viability assumptions get an AI pre-mortem and a test plan for humans. Everything is recorded in the Product Agent tree. Use when the builder runs the "Run solution spec loop" AI action on an opportunity, or asks to spec solutions for an opportunity end to end. Do NOT use to brainstorm only (solutions-brainstormer) or to test one solution's assumptions by hand (assumption-tester).
metadata:
  author: Cata Viciu
  version: 1.0.0
  category: product
  tags: [solution spec, discovery, assumption testing, prototyping, autoresearch]
  dependencies:
    skills:
      - solutions-brainstormer
      - code-to-story-map-archeologist
      - user-story-slicer
      - prototype-builder
      - assumption-tester
      - writing
    mcp:
      - name: product-agent
        why: The tree is the loop's memory. Every read and write goes through the pa_* tools.
---

> **Load the `writing` skill before drafting any prose.** Read `ProductSkills/writing/SKILL.md`
> and the two reference files it names, then run its passes over every piece of text this skill
> produces - titles, descriptions, block content, and anything presented to the builder.
> Every agent you spawn gets the same instruction in its brief.

# ROLE AND PURPOSE

You are the orchestrator of the solution spec loop. You take one opportunity and finish with **at least 2 solution options** that fit the parent outcome, each with a story map, a tested prototype, and every critical usability and feasibility assumption tested.

The loop follows Karpathy's autoresearch pattern:

- **Fixed evaluator.** Pass/fail criteria are written and frozen before a test runs. Nobody edits them afterwards.
- **One test at a time.** Each result is recorded before the next test runs.
- **Ratchet.** A change to the journey is kept only if the tests that already passed still pass.
- **Memory in the tree.** Every goal, result and learning is written to Product Agent, so a later round, or a later run, starts from what was learned.
- **Hard budget.** At most 2 test rounds, so at most 2 prototype iterations per option.

You coordinate. Spawned agents do the thinking-heavy work. You own the run state, the frozen criteria and the decisions to keep, discard, adapt or drop.

---

# INPUT

The "Run solution spec loop" AI action on an opportunity copies this prompt (sections separated by `---`):

```
Use skill: ProductSkills/solution-spec-loop/SKILL.md

Product Line: <name> (id: <productLineId>)
Opportunity ID: <id>
Codebase (from settings): <path | not set>
Prototype root: Product-Agent-app/public/prototypes/<pl-slug>/<opp-slug>/
Instructions: <design system steering line>

Data: pa_get_entity("<opportunityId>")
```

The action only copies the prompt when the opportunity has a real description, a persona (its own or an ancestor's), real content in Trigger, Current Workaround and Desired end state, a parent product outcome with a metric, and the product line has a design system. Step 2 checks the same things again.

All data is read and written through the Product Agent MCP tools. Never read `store.json` directly.

---

# REFERENCES (read when the step says to)

Reading a reference is a hard gate. A step that names one is not done until you have read it.

| File | Read at |
|------|---------|
| `references/agent-briefs.md` | Before spawning any agent. One brief per role: advisor, PM, assumption mapper, tester, grader, pre-mortem. |
| `references/criteria-rules.md` | Before freezing criteria (Step 9) and before grading. The criticality rule, the frozen-criteria rules, the bad-solution check. |
| `references/memory-blocks.md` | Before the first write to the tree. Exact block labels, templates, evidence levels, scorecard. |

---

# AGENTS AND MODELS

Spawn agents with the Agent tool. Use the model alias, which resolves to the latest version.

| Role | Model | Writes to the tree? |
|------|-------|---------------------|
| Orchestrator (you) | session model | Yes: run state, entities, results, learnings |
| Advisor (product designer + engineering architect) | `opus` | No. Returns options. |
| PM (journey, story map, prototype) | `opus` | Yes, only its own solution: stories, journey block, Prototype block, prototype file |
| Assumption mapper | `opus` | No. Returns assumptions and tests. |
| Tester (usability and feasibility) | `sonnet` | No. Returns observations. |
| Grader | `opus` | No. Returns PASS / FAIL with reasons. |
| Pre-mortem (value and viability) | `opus` | No. Returns a dry run and a human test plan. |

The tester never sees the pass/fail criteria. The grader never sees the builder's hopes, only the frozen criteria and the tester's observations.

---

# SPEC-LOOP MODE FOR SUB-SKILLS

The loop drives existing skills that normally stop at every gate for the builder. Each of them has a `SPEC-LOOP MODE` section that says what changes when the prompt or brief says `Mode: spec-loop`: solutions-brainstormer, code-to-story-map-archeologist, user-story-slicer, prototype-builder and assumption-tester. Every brief you send starts with that line.

- Gates in a sub-skill are answered by the brief or decided by the sub-skill from the tree, and the decision is returned to you. Record decisions in the Spec Loop block under "Decisions made without the builder".
- A question nobody could answer comes back as an open question with the reading used. Record it in the Spec Loop block.
- Spawned agents can't spawn agents of their own. Where a sub-skill needs an independent reviewer (the slicer's backbone review gate), the agent hands the material back to you and you run the review (Step 7).
- Only the two human gates in this skill stop the run: Step 1 (codebase) and Step 6 (option review). The drop check can add a third (Step 13).

---

# OPERATIONAL PROTOCOL

## Pre-loop

### Step 0: Resume or start

Call `pa_get_entity(opportunityId)`. If it has a `Spec Loop` block whose status is not `complete`, read it and resume from the recorded step. Never start a second run over an unfinished one without asking.

### Step 1: Ask for the codebase (HUMAN GATE)

Ask in one message:

> "Which codebase does this opportunity touch? Settings say `<path or not set>`. Reply with:
> - `yes` to use it, or another path
> - `greenfield` if no existing code is involved
>
> If there is a codebase: where does the related workflow start (a user action) and where does it end?"

Wait for the reply. Record codebase, start and end in the Spec Loop block (create it now, per `references/memory-blocks.md`).

### Step 2: Read the context

1. `pa_get_outline({ entityId: opportunityId })` - existing solutions at every status, including dropped ones and why.
2. `pa_get_context(opportunityId, { ancestors: true, descendantsDepth: 1, productLineMeta: true })` - opportunity, product outcome, business outcome, personas, settings.
3. `pa_get_metric(metricId)` for the product outcome's metric (and the business outcome's, if set). This is the only read that returns the recorded series.
4. Resolve the persona: the opportunity's `personaId`, else the nearest ancestor's.

Check the opportunity has real content (not template placeholder text in italics) in: description, Trigger, Current Workaround, Desired end state; and that the product outcome has a metric. If any is missing, stop and tell the builder to run "Refine this opportunity" first. The AI action checks this too; this is the backstop.

### Step 3: Map the existing code

Skip for greenfield. Otherwise run `code-to-story-map-archeologist` in spec-loop mode yourself (not a subagent: it may need repo tools only you hold):

- Bounds and repo come from Step 1. Don't ask again.
- Gate 1 and Gate 2: accept your own backbone and map after its self-checks pass.
- Cross-repo depth: locate and name (option 2). No deep backend trace.
- Output: `<Prototype root>spec-loop/as-is-story-map.md`.

The as-is map is shared by every option.

### Step 4: Brainstorm 5 directions

Run `solutions-brainstormer` Phases 1 and 2 yourself, in spec-loop mode:

- Research is still mandatory.
- Answer its clarifying question yourself from the opportunity, outcome and as-is map. Record the question and your answer in the Spec Loop block.
- Feed it the as-is map so directions build on what exists.
- Do NOT run its Phase 3. Directions are not written to the tree.

### Step 5: Advisor refines the options

Spawn the **advisor** (brief in `references/agent-briefs.md`) with: outcome + metric, opportunity, as-is map, the 5 directions, existing and dropped solutions.

It returns at least 2 refined options, each with a journey sketch, why it moves the metric, UX and technical risks, and **kill criteria**, plus the directions it set aside and why (the backup pool).

### Step 6: Option review (HUMAN GATE)

Present the refined options and the backup pool. Ask the builder to approve, edit, swap in a pool direction, or drop options. At least 2 must remain.

Wait for the reply. Then, for each approved option, write a solution entity per the brainstormer's Phase 3 schema (`status: "explore"`, blocks Why It Works, Trade-offs, High-Level User Journey), plus a `Kill Criteria` block. Record the solution IDs and the backup pool in the Spec Loop block.

From here to the end of the run, nothing stops for the builder except the drop check (Step 13).

### Step 7: Story map and baseline prototype per option

For each option, spawn a **PM** agent (brief in `references/agent-briefs.md`). It runs in two parts:

1. **Backbone.** It slices the **to-be** story map with `user-story-slicer` from the as-is map and the option's journey (stories cover what changes; unchanged steps stay as backbone context), and stops after the backbone. It returns the backbone table, the axis ledger and the verbatim text of the slicer's build step 7.
2. **Backbone review.** Spawn a fresh reviewer agent with exactly those three things and nothing else, per the slicer's backbone review gate. On FAIL, resume the PM with the verdict (SendMessage to the same agent), get the fixed backbone, and review again with a fresh reviewer. Loop until PASS.
3. **Stories and prototype.** Resume the PM with the PASS verdict. It finishes the slicer (slice outcomes, stories written to the solution), builds prototype `v1.html` of the walking skeleton stories with `prototype-builder` at `<Prototype root><solution-slug>/v1.html` (solution slug = first 5 words of the title, slugified), and updates the solution's `Prototype` block to link v1 as current.

PM agents for different options can run in parallel.

---

## The loop

### Step 8: Map assumptions (per option)

Spawn the **assumption mapper** for each option. It uses `assumption-tester` Phases 0-2 in spec-loop mode across four categories:

| Loop category | `assumptionType` |
|---|---|
| Business viability | `viability` |
| Value | `desirability` |
| Usability | `usability` |
| Technical feasibility | `feasibility` |

It returns critical assumptions only, each with one test: type, a neutral task, and pass/fail criteria.

### Step 9: Freeze the criteria

Read `references/criteria-rules.md`. Then, per option:

1. Spawn the **advisor** once with all the option's tests for the bad-solution check: "Would a weak or wrong solution still pass this?" Tighten any criterion that fails the check.
2. For each test, write the assumption entity (blocks Impact if True, Evidence) and its test entity (`status: "draft"`, blocks Define Test, Pass / Fail Criteria) per the assumption-tester schema.

From this moment the Pass / Fail Criteria block is frozen. Never update it. A wrong criterion is fixed by writing a new test, never by editing the old one.

### Step 10: Run a round

Round number `r` starts at 1. Per option, run the round's usability and feasibility tests **one at a time**, feasibility first (no point polishing a flow that can't be built), riskiest first within each category.

A round's tests are:
- Round 1: every critical usability and feasibility test.
- Round 2: tests that failed in round 1 (re-run against v2), new tests from Step 12, and the **ratchet set**: every usability test that passed in round 1, re-run against v2. Re-run a passed feasibility test only if the v2 change touches what it tested.

For each test:

1. Spawn the **tester** (`sonnet`) with the tester brief. It gets the artifact (prototype path or codebase), the persona, and the neutral task. It does NOT get the criteria.
   - Usability: walk the current prototype in Playwright as the persona and report what happened.
   - Feasibility: research spike against the codebase. Read code, and if needed write throwaway code in a scratch folder outside the repo. Never modify the codebase.
2. Spawn the **grader** with the frozen criteria and the tester's report. It returns PASS or FAIL with the observation each verdict rests on.
3. Record per `references/memory-blocks.md`: `Result R<r>` and `Learning` blocks on the test (a re-run in round 2 adds `Result R2` next to `Result R1` and rewrites `Learning`), status `done`; update the assumption's `Evidence` block; add a line to the solution's Iteration Log.
4. Tell the builder in one line: test, verdict, next test.

Options can run their rounds in parallel. Within one option, tests run one at a time.

### Step 11: Value and viability pre-mortem

Spawn the **pre-mortem** agent for every value and viability test, once per test. It doesn't depend on the prototype, so it can run alongside round 1. Its only evidence is what's in the tree: the outcome metrics and recorded values, and the opportunity's blocks. No external data sources.

Record its output on the test as an `AI Pre-mortem` block with evidence level `ai-premortem`, plus a `Human Test Plan` block. The test stays `status: "draft"`: a human runs it. The assumption stays `explore`. Never count a pre-mortem as a pass.

### Step 12: Adapt the solution (only if something failed)

A failure is a reason to change the option, not to drop it. Run this step for every option with a failed test or a fired kill criterion.

**First, the adaptation check.** For each failed critical feasibility test and each fired kill criterion, spawn the **advisor** with the adaptation-check brief: the option, the tester report and grader verdict, the codebase and as-is map. It looks for a change that gets around the blocker while the option still addresses the opportunity's pain and can move the metric: a different technical approach, another data source or service, a narrower scope, a reordered journey, or moving the blocked part out of the walking skeleton. It returns the adaptation, or `NO ADAPTATION` with every change it considered and why each fails.

- If any blocker came back `NO ADAPTATION`, go to Step 13 for that option. Don't run the PM.
- Otherwise each adaptation becomes part of the PM's change, and gets a new feasibility test (through Step 9) that tests the adapted approach in the next round. The failed test stays as it was.

**Then the update.** Spawn the option's **PM** agent with the failures, the adaptations and the learnings. It:

1. Changes the journey to address the failures. Prefer the simpler change: removing or merging a step beats adding one.
2. Applies the change to the story map (`stories`) and the High-Level User Journey block. If the backbone changes, it returns the new backbone first and you run the Step 7 backbone review again before it writes stories.
3. Builds the next prototype version `v{r+1}.html` from the current one. Never overwrite an existing version.
4. Returns the list of what changed.

Then:

- Rewrite the solution's `Learnings` block.
- Spawn the **assumption mapper** on **the changed parts only**. New critical usability or feasibility assumptions go through Step 9 and join the next round.
- New value or viability assumptions go through Step 9, then Step 11.
- The Prototype block lists the new version as an untested candidate. It becomes current only after the ratchet passes in the next round.
- If a ratchet test fails in round 2, the change that broke it is discarded. The round 2 update (v3) reverts that part along with fixing the round's failures, and the Learnings block records what was tried and why it failed.

### Step 13: Drop check

Drop an option only when the adaptation check found no way around a blocker: every change it considered either still hits the blocker, stops addressing the opportunity's pain, can't move the metric, or turns the option into a copy of another option. A test failing twice is not on its own a reason to drop; run the adaptation check again.

To drop: set the solution `status: "dropped"`, add a `Drop Reason` block listing the blocker and the adaptations considered, and log it in the Spec Loop block.

If fewer than 2 options remain, **stop and ask the builder** (third human gate): offer the backup pool. A replacement enters at Step 7 with its own 2-round budget.

### Step 14: Stop or continue

After round `r`:

- If `r = 2`: stop. If round 2 had failures and Step 12 produced v3, list v3's changes, and any new critical assumptions they raised, as **untested since round 2** in the scorecard.
- If `r = 1` and nothing failed and Step 12 found no new critical usability or feasibility assumptions: stop.
- Otherwise: `r = 2`, back to Step 10.

---

## Finish

### Step 15: Scorecard

Write the `Spec Loop Scorecard` block on the opportunity per `references/memory-blocks.md`: options side by side, assumptions by evidence level, untested changes, human tests waiting, and one recommended next step. Set the Spec Loop block status to `complete`.

Tell the builder in three lines or fewer: how many options survived, where the scorecard is, which human tests come first.

---

# STRICT RULES

1. **Never edit a frozen Pass / Fail Criteria block.** Fix a bad criterion with a new test.
2. **The tester never sees the criteria.** The grader decides PASS or FAIL against the criteria, nothing else.
3. **At most 2 test rounds.** No third round, no matter what failed.
4. **Ratchet.** A journey change stays only if every previously passed usability test still passes.
5. **AI pre-mortems are not evidence.** Tag them `ai-premortem`, keep the test `draft`, never mark a value or viability assumption passed.
6. **Value and viability evidence comes only from the tree.** Outcome metrics and the opportunity's blocks.
7. **Never modify the codebase.** Feasibility spikes write throwaway code outside the repo.
8. **Never overwrite a prototype version.** v1, v2, v3 stay side by side.
9. **Write only under this opportunity.** Its blocks, its new solutions and their assumptions and tests. Never edit sibling opportunities, outcomes or existing solutions.
10. **Never set a story's `done` or `doneAt`.**
11. **Only the human gates stop the run.** Steps 1, 6 and, when triggered, 13. Everything else is decided by the loop and recorded.
12. **Record before moving on.** A test without its Result and Learning blocks hasn't finished.
