---
name: solution-spec-loop
description: Runs the solution spec loop on one opportunity. Maps the existing code, brainstorms 5 directions, has an advisor refine them into at least 2 solution options, gets human approval, then builds a story map per option for human review and a baseline prototype from the real starting screen, puts every prototype version through a design critique against the design system's DESIGN.md, and tests every critical usability and feasibility assumption in up to 2 rounds. After every round it updates the whole solution spec (description, blocks, journey, stories) from what the round learned and builds the next prototype version, so the next round tests the evolved solution. Value and viability assumptions get an AI pre-mortem and a test plan for humans. Everything is recorded in the Product Agent tree, and a finished run can be followed by a new run that starts from the builder's feedback and the previous learnings. Use when the builder runs the "Run solution spec loop" AI action on an opportunity, or asks to spec solutions for an opportunity end to end. Do NOT use to brainstorm only (solutions-brainstormer) or to test one solution's assumptions by hand (assumption-tester).
metadata:
  author: Cata Viciu
  version: 1.5.0
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

# WALKTHROUGH HELPER

`scripts/walkthrough.mjs` runs prototypes in Chromium with Playwright, so every usability test and every gate check runs the same way.

| Command | Use |
|---|---|
| `node ProductSkills/solution-spec-loop/scripts/walkthrough.mjs check --file <vN.html>` | Hard gates on a new prototype version: no HTML comments, no script or console errors, visible text after load. Exit code 1 on FAIL. Warnings (failed CDN requests, words that suggest test framing) are yours to judge. |
| `node ProductSkills/solution-spec-loop/scripts/walkthrough.mjs run --file <vN.html> --actions <actions.json> --out <dir>` | One replay for the tester: loads the page, replays the actions, prints what is on screen now (accessibility tree and a screenshot path), and writes `<dir>/walkthrough.json`. The action format is at the top of the script. |

Walkthrough logs go to `Product-Agent-app/data/spec-loop/<opp-slug>/<solution-slug>/<test-id>-r<r>/`. That folder is local and not committed.

---

# AGENTS AND MODELS

Launch each role as a subagent with your tool's subagent feature (for example the Agent tool in Claude Code, or subagents in Kiro). Pick the model per role by tier, using the latest version your tool offers. If your tool can't choose a model per subagent, use its default and record that in the Spec Loop block under "Decisions made without the builder".

| Role | Model tier | Writes to the tree? |
|------|-------|---------------------|
| Orchestrator (you) | session model | Yes: run state, entities, results, learnings |
| Advisor (product designer + engineering architect) | strongest | No. Returns options. |
| PM (journey, story map, prototype) | strongest | Yes, only its own solution: stories, journey and spec blocks, prototype files. Never the Prototype block. |
| Assumption mapper | strongest | No. Returns assumptions and tests. |
| Tester (usability and feasibility) | fast | No. Returns observations. |
| Grader | strongest | No. Returns PASS / FAIL with reasons. |
| Pre-mortem (value and viability) | strongest | No. Returns a dry run and a human test plan. |
| Design critic (UI and UX) | strongest | No. Returns findings and replies to the designer. |

With Claude models, strongest is Opus and fast is Sonnet.

**Continuing an agent.** Some steps hand an agent's work back to you and then continue it (the PM around the backbone review, and after a failed gate check). If your tool can send a follow-up message to the same agent, do that. If it can't, launch a new agent with the same brief, the previous agent's full output, and the new message. Either way the agent picks up where the last one stopped.

The tester never sees the pass/fail criteria. The grader never sees the builder's hopes, only the frozen criteria and the tester's observations.

---

# SPEC-LOOP MODE FOR SUB-SKILLS

The loop drives existing skills that normally stop at every gate for the builder. Each of them has a `SPEC-LOOP MODE` section that says what changes when the prompt or brief says `Mode: spec-loop`: solutions-brainstormer, code-to-story-map-archeologist, user-story-slicer, prototype-builder and assumption-tester. Every brief you send starts with that line.

- Gates in a sub-skill are answered by the brief or decided by the sub-skill from the tree, and the decision is returned to you. Record decisions in the Spec Loop block under "Decisions made without the builder".
- A question nobody could answer comes back as an open question with the reading used. Record it in the Spec Loop block.
- Spawned agents can't spawn agents of their own. Where a sub-skill needs an independent reviewer (the slicer's backbone review gate), the agent hands the material back to you and you run the review (Step 7a).
- Only the human gates in this skill stop the run: Step 1 (codebase), Step 6 (option review) and Step 7b (story map review). Step 2 adds one only if the DESIGN.md can't be found, and the drop check can add one more (Step 13).

---

# STATUS RULES

The tree's statuses are how the builder sees where things stand, so they must match the latest results. Set them in the same step that records a result, with `pa_update_entity({ entityId, patch: { status } })`. Step 15 checks them all again before the run ends.

**Tests**

| When | Test status |
|---|---|
| Written at Step 9 | `draft` |
| A usability or feasibility test has run (PASS or FAIL) | `done` |
| A value or viability test with only an AI pre-mortem | stays `draft` until a person runs it |

**Assumptions** follow the latest result of their tests:

| Latest result | Assumption status |
|---|---|
| Not tested yet, or only an AI pre-mortem | `explore` |
| A test passed | `done` |
| A test failed and will be re-tested in the next round | `explore` |
| A test failed and the run ended without a re-test | `explore`, listed as open in the scorecard |
| A test failed and the adaptation replaced the approach it depended on | `dropped`, with a line in its Evidence block: "Invalidated in Run <n>, Round <r>. Replaced by [<new assumption>](#entity/<id>)." |
| A test that had passed fails its re-test | back to `explore` |

Value and viability assumptions never become `done` from AI work. Only a passed human test does that.

**Prototype block.** You own each solution's `Prototype` block (format in `references/memory-blocks.md`), not the PM. Update it with `pa_update_block` at exactly these points, so it always links every version that exists:

| When | Prototype block |
|---|---|
| v1 passes its gate check (Step 7c) | v1 is **Current** |
| Step 12 or Step F4 builds a new version | add it as **Candidate (untested)**; Current stays |
| The candidate's round finishes and every re-test of a passed test passed on it | the candidate becomes **Current**; the old one moves to **Earlier versions** |
| A re-test fails on the candidate | it stays listed as **Candidate**, marked "failed a re-test; change undone in v<n+1>" |
| The run ends with a version built after round 2 | it stays **Candidate (untested)** |

**Solutions** stay `explore` while the loop runs. Only the drop check (Step 13) changes one, to `dropped`. Never set `commit` or `done` on a solution: that's the builder's call.

---

# OPERATIONAL PROTOCOL

## Pre-loop

### Step 0: Resume or start

Call `pa_get_entity(opportunityId)`.

- No `Spec Loop` block: this is run 1. Go to Step 1.
- A `Spec Loop` block whose status is not `complete`: read it and resume from the recorded step. Never start a second run over an unfinished one without asking.
- A `Spec Loop` block whose status is `complete`: offer a follow-up run (see "Follow-up runs" at the end of the protocol). Don't start over from Step 1.

Then make sure the walkthrough helper runs: if `ProductSkills/solution-spec-loop/scripts/node_modules` is missing, run `npm install` in that folder. If Chromium is missing, run `npx playwright install chromium` there. If neither works, tell the builder now; usability tests can't run without it.

### Step 1: Ask for the codebase (HUMAN GATE)

Ask in one message:

> "Which codebase does this opportunity touch? Settings say `<path or not set>`. Reply with:
> - `yes` to use it, or another path
> - `greenfield` if no existing code is involved
>
> If there is a codebase: where does the related workflow start (a user action) and where does it end?"

Wait for the reply. Record codebase, start and end in the Spec Loop block (create it now, per `references/memory-blocks.md`).

**Never show a raw ID to the builder.** In every block and every message, name an entity by its title and, in blocks, link it as `[Title](#entity/<id>)`. The app opens the entity on click; agents read the ID from the link. Write types out in full, as `references/memory-blocks.md` lists them.

### Step 2: Read the context

1. `pa_get_outline({ entityId: opportunityId })` - existing solutions at every status, including dropped ones and why.
2. `pa_get_context(opportunityId, { ancestors: true, descendantsDepth: 1, productLineMeta: true })` - opportunity, product outcome, business outcome, personas, settings.
3. `pa_get_metric(metricId)` for the product outcome's metric (and the business outcome's, if set). This is the only read that returns the recorded series.
4. Resolve the persona: the opportunity's `personaId`, else the nearest ancestor's.
5. **Find the DESIGN.md** the design critic reviews against (see "Design critique"):
   - Settings in `designMd` mode: it's the text in `productLine.settings.designSystem.designMd`.
   - Settings in `skill` mode: find the skill folder named `skillName` in your tool's skill folders (for example `.claude/skills/<name>/` in the project or the home folder) and in `ProductSkills/<name>/`. The DESIGN.md is a `DESIGN.md` file inside it, usually `assets/DESIGN.md`.
   - **Not found: ask the builder** (human gate): "I couldn't find the DESIGN.md for the `<name>` design system. Where is it? Reply with a path." Wait for the reply.

   Record where it is in the Spec Loop block as **Design system**.

Check the opportunity has real content (not template placeholder text in italics) in: description, Trigger, Current Workaround, Desired end state; and that the product outcome has a metric. If any is missing, stop and tell the builder to run "Refine this opportunity" first. The AI action checks this too; this is the backstop.

### Step 3: Map the existing code

Skip for greenfield. Otherwise run `code-to-story-map-archeologist` in spec-loop mode yourself (not a subagent: it may need repo tools only you hold):

- Bounds and repo come from Step 1. Don't ask again.
- Gate 1 and Gate 2: accept your own backbone and map after its self-checks pass.
- Cross-repo depth: locate and name (option 2). No deep backend trace.
- Output: `<Prototype root>spec-loop/as-is-story-map.md`.

The as-is map is shared by every option.

**Record the starting screen.** From the map, take the screen where the user acts at the start point: its name as the user sees it, its route if it has one, and the component files that render it, as cited in the map. Write it to the Spec Loop block as **Starting screen**. Every option's journey and every prototype starts from this screen. For greenfield, the starting screen is set per option at Step 6.

### Step 4: Brainstorm 5 directions

Run `solutions-brainstormer` Phases 1 and 2 yourself, in spec-loop mode:

- Research is still mandatory.
- Answer its clarifying question yourself from the opportunity, outcome and as-is map. Record the question and your answer in the Spec Loop block.
- Feed it the as-is map so directions build on what exists.
- Do NOT run its Phase 3. Directions are not written to the tree.

### Step 5: Advisor refines the options

Spawn the **advisor** (brief in `references/agent-briefs.md`) with: outcome + metric, opportunity, as-is map, starting screen, the 5 directions, existing and dropped solutions.

It returns at least 2 refined options, each with a journey sketch, why it moves the metric, UX and technical risks, and **kill criteria**, plus the directions it set aside and why (the backup pool).

### Step 6: Option review (HUMAN GATE)

Present the refined options and the backup pool. For each option, show the screen its journey starts from: the recorded starting screen, or for greenfield the new screen the advisor proposes. Ask the builder to approve, edit, swap in a pool direction, or drop options, and to correct a starting screen if it's wrong. At least 2 must remain.

Wait for the reply. Then, for each approved option, write a solution entity per the brainstormer's Phase 3 schema (`status: "explore"`, blocks Why It Works, Trade-offs, High-Level User Journey), plus a `Kill Criteria` block. Record the solution IDs and the backup pool in the Spec Loop block.

The next stop for the builder is the story map review (Step 7b).

### Step 7a: Story map per option

For each option, spawn a **PM** agent (brief in `references/agent-briefs.md`). PM agents for different options can run in parallel.

1. **Backbone.** It slices the **to-be** story map with `user-story-slicer` from the as-is map and the option's journey (stories cover what changes; unchanged steps stay as backbone context), and stops after the backbone. It returns the backbone table, the axis ledger and the verbatim text of the slicer's build step 7.
2. **Backbone review.** Spawn a fresh reviewer agent with exactly those three things and nothing else, per the slicer's backbone review gate. On FAIL, continue the PM with the verdict (see "Continuing an agent"), get the fixed backbone, and review again with a fresh reviewer. Loop until PASS.
3. **Stories.** Continue the PM with the PASS verdict. It finishes the slicer (slice outcomes, stories written to the solution) and returns the backbone as a Mermaid diagram, the stories by slice, and every decision and open question.

### Step 7b: Story map review (HUMAN GATE)

AI story maps miss steps a person who knows the product sees at once, so the builder reviews them before anything is built on top.

Present, per option: the backbone diagram, the stories by slice with the walking skeleton marked, and the PM's decisions and open questions. Say the stories are on each solution's Stories tab. Ask the builder to reply with feedback, or to edit the stories in the app and reply `done`.

Wait for the reply. Then continue each option's PM with the feedback, and with the stories as they are now in the tree (re-read them with `pa_get_entity`; the builder may have edited them). The PM applies the feedback. If the backbone changed, run the Step 7a backbone review again. Record the feedback in the Spec Loop block. Ask again only if the builder's reply asked for another look.

From here to the end of the run, nothing stops for the builder except the drop check (Step 13).

### Step 7c: Baseline prototype per option

1. **Prototype.** Continue the PM. It builds prototype `v1.html` of the walking skeleton stories with `prototype-builder` at `<Prototype root><solution-slug>/v1.html` (solution slug = first 5 words of the title, slugified), starting from the **starting screen**: the brief names the screen, its route and its component files, and the PM replicates that screen from those files. It returns the files it replicated.
2. **Starting screen check.** Compare the files the PM replicated with the starting screen's files. If they differ, or the first screen of v1 isn't the starting screen, continue the PM to rebuild v1 from the right screen. Never accept a starting screen the PM chose itself.
3. **Gate check.** Run the helper's `check` on v1. On FAIL, continue the PM with the failures to fix v1 in place (v1 hasn't been tested yet), and check again until PASS.
4. **Design critique.** Run the design critique on v1 (see "Design critique" below).
5. **Prototype block.** Write the solution's `Prototype` block with v1 as Current (status rules).

### Design critique (after every prototype version)

Every prototype version gets a design review before it's tested: v1 at Step 7c, each new version at Step 12 and Step F4. The PM who built it is the **designer**. A separate **design critic** challenges it, the two talk it through, and the designer applies what they agree. Briefs for both are in `references/agent-briefs.md`.

1. **Critique.** Spawn the **design critic** with: the DESIGN.md, the prototype file, the starting screen and its component files, the journey and the stories this version implements, the persona, and the earlier design reviews for this option (so settled points aren't raised again). Never give it the assumptions, tests or criteria: it reviews the design, not the test. It looks at the prototype through the walkthrough helper and may read the HTML source. It returns numbered findings, each with: UI or UX, severity (**must fix**, **should fix**, **consider**), where, the problem, the DESIGN.md section or UX principle behind it, and a proposed change.
2. **Designer replies.** Continue the PM with the findings. For each one it answers **accept**, **counter** (a different fix, with the reason) or **reject** (with the reason, grounded in the DESIGN.md, the journey, the persona or faithfulness to the starting screen).
3. **Critic replies.** Continue the critic with the answers. For each counter or reject it answers **agree** or **hold** (with the reason).
4. **Agree.** Repeat steps 2 and 3 at most twice. Anything still disputed, you decide, in this order: the DESIGN.md's rules, then faithfulness to the existing starting screen, then what serves the persona's task in the journey, then the simpler option. Record the reason.
5. **Apply.** The designer applies every agreed change to the same version file (it hasn't been tested yet, so editing in place is fine). If an agreed change alters the flow, it also updates the journey and the stories, so spec and prototype stay in step; if the backbone changes, run the Step 7a backbone review.
6. **Check and record.** Run the helper's `check` again. Write the solution's `Design Review v<n>` block and add a line to the Iteration Log (`references/memory-blocks.md`).

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
- Round 2: on v2, the version Step 12 evolved from round 1 (on v1 only if round 1 changed nothing a user sees). Tests that failed in round 1, new tests from Step 12, and the **ratchet set**: every usability test that passed in round 1, re-run on v2. Re-run a passed feasibility test only if the v2 change touches what it tested.

For each test:

1. Spawn the **tester** (fast model) with the tester brief. It gets the artifact (prototype path or codebase), the persona, and the neutral task. It does NOT get the criteria.
   - Usability: walk the current prototype with the helper's `run` command, one action at a time, as the persona, and report what happened.
   - Feasibility: research spike against the codebase. Read code, and if needed write throwaway code in a scratch folder outside the repo. Never modify the codebase.
2. Spawn the **grader** with the frozen criteria, the tester's report and, for usability tests, the walkthrough log (`walkthrough.json`). It returns PASS or FAIL with the observation each verdict rests on.
3. Record per `references/memory-blocks.md`: a `Result: Run <n>, Round <r>` block and the `Learning` block on the test (a re-run adds a new Result block next to the earlier ones and rewrites `Learning`); update the assumption's `Evidence` block; add a line to the solution's Iteration Log.
4. **Set the statuses now**, per the status rules: the test to `done`, and the assumption from this result (`done` on PASS, `explore` on FAIL, back to `explore` if a test that had passed fails its re-test). Don't leave it for later.
5. Tell the builder in one line: test, verdict, next test.

Options can run their rounds in parallel. Within one option, tests run one at a time.

When the round's tests are done, **update each option's Prototype block** (status rules): if the round tested a candidate and every re-test of a passed test passed on it, make it Current; if one failed, mark the candidate as failed.

### Step 11: Value and viability pre-mortem

Spawn the **pre-mortem** agent for every value and viability test, once per test. It doesn't depend on the prototype, so it can run alongside round 1. Its only evidence is what's in the tree: the outcome metrics and recorded values, and the opportunity's blocks. No external data sources.

Record its output on the test as an `AI Pre-mortem` block with evidence level `ai-premortem`, plus a `Human Test Plan` block. The test stays `status: "draft"`: a human runs it. The assumption stays `explore` (status rules). Never count a pre-mortem as a pass.

### Step 12: Evolve the solution (after every round)

Runs after every round, for every active option, whether or not anything failed. The spec and the prototype move forward together: the next round always tests a new version that carries everything this round learned.

**1. Collect the round's learnings.** The failures with the grader's reasons, any fired kill criteria, and the findings from tests that passed: where the persona hesitated or took another path, states and edge cases the tester hit, facts a feasibility spike turned up about the code.

**2. Adaptation check** (only for failed critical feasibility tests and fired kill criteria). Spawn the **advisor** with the adaptation-check brief: the option, the tester report and grader verdict, the codebase and as-is map. It looks for a change that gets around the blocker while the option still addresses the opportunity's pain and can move the metric: a different technical approach, another data source or service, a narrower scope, a reordered journey, or moving the blocked part out of the walking skeleton. It returns the adaptation, or `NO ADAPTATION` with every change it considered and why each fails.

- If any blocker came back `NO ADAPTATION`, go to Step 13 for that option. Don't run the PM.
- Otherwise each adaptation becomes part of the PM's change, and gets a new feasibility test (through Step 9) that tests the adapted approach in the next round. The failed test stays as it was. If the adaptation replaces the approach the failed assumption depended on, set that assumption to `dropped` and link its replacement in its Evidence block (status rules).

**3. Update the whole spec.** Spawn the option's **PM** agent with the failures, the adaptations, the findings from passing tests and the Learnings block. It updates, in one pass, so they always describe the same solution:

- the **High-Level User Journey** block;
- the **stories**: re-slice the touched steps, and fold findings into the touched stories' Context, Out of Scope and Human Verification (states and edge cases go in Context for the AC writer). If the backbone changes, it returns the new backbone first and you run the Step 7a backbone review again before it writes stories;
- the solution's **description**, **Why It Works** and **Trade-offs** blocks, rewritten to describe the solution as it now is.

Prefer the simpler change: removing or merging a step beats adding one. Change only what the learnings call for. It returns a **spec changes** list: each change, the part of the spec it touched, and the test or finding behind it.

**4. Evolve the prototype.** The PM builds `v{r+1}.html` from the current version, applying every spec change a user would see, from the same starting screen. Never overwrite an existing version. Run the helper's `check` on it; the PM fixes the new version until PASS. Then run the **design critique** on it. Skip this part only when the round changed nothing a user sees, and say so in the Iteration Log.

**5. Record.**

- Add a `Spec changes` line to the Iteration Log for each change, linking the test behind it.
- Rewrite the solution's `Learnings` block.
- Spawn the **assumption mapper** on **the changed parts only**. New critical usability or feasibility assumptions go through Step 9 and join the next round. New value or viability assumptions go through Step 9, then Step 11.
- **Update the Prototype block now**: add the new version as Candidate (untested), keep the current one as Current (status rules). Step 10 promotes it after the next round, if its re-tests pass.

**6. Undo together.** If a ratchet test fails in round 2, the change that broke it is undone everywhere it landed: the journey, the stories, the description and blocks, and the prototype (in v3, along with this round's other changes). Its assumption goes back to `explore` (Step 10 already did this). The Learnings block records what was tried and why it was undone.

### Step 13: Drop check

Drop an option only when the adaptation check found no way around a blocker: every change it considered either still hits the blocker, stops addressing the opportunity's pain, can't move the metric, or turns the option into a copy of another option. A test failing twice is not on its own a reason to drop; run the adaptation check again.

To drop: set the solution `status: "dropped"`, add a `Drop Reason` block listing the blocker and the adaptations considered, and log it in the Spec Loop block. Leave the dropped option's assumptions and tests as they are: they're the record of why.

If fewer than 2 options remain, **stop and ask the builder**: offer the backup pool. A replacement enters at Step 7a with its own 2-round budget.

### Step 14: Stop or continue

After round `r`:

- If `r = 2`: stop. Step 12 still ran after round 2, so the spec is up to date and v3 exists if anything a user sees changed. List those changes, and any new critical assumptions they raised, as **untested since round 2** in the scorecard.
- If `r = 1`, nothing failed, Step 12 made no spec changes and found no new critical usability or feasibility assumptions: stop. There is nothing new to test.
- Otherwise: `r = 2`, back to Step 10. Round 2 tests v2.

---

## Finish

### Step 15: Scorecard

**Status check first.** Call `pa_get_outline` on each active option. Walk every assumption and test under it and compare its status with its latest result, per the status rules. Fix every mismatch with `pa_update_entity` and log each fix in the Iteration Log ("Status fixed: ..."). Also list the prototype files in each option's folder and check its Prototype block: every version file is linked, and Current is the latest version that passed its re-tests. Fix the block if not. Don't write the scorecard until statuses and Prototype blocks match.

**Then the consistency check.** For each active option, read the description, Why It Works, Trade-offs, the High-Level User Journey, the stories and the latest prototype version. They must describe the same flow. If any part is behind, continue the PM to bring it in line (spec text and stories only; don't build another prototype version) and log it as a spec change.

Then write the `Spec Loop Scorecard` block on the opportunity per `references/memory-blocks.md`: options side by side, assumptions by evidence level, assumptions still open and why, untested changes, human tests waiting, and one recommended next step. Set the Spec Loop block status to `complete`.

Tell the builder in three lines or fewer: how many options survived, where the scorecard is, which human tests come first. Add that they can give feedback and run the action again for a follow-up run.

---

## Follow-up runs

A finished run is a starting point, not an end. After reviewing the scorecard, the prototypes and the story maps, the builder can edit things in the app and run the action again. A follow-up run starts from what the previous runs learned, so nothing is redone from scratch.

### Step F1: Collect feedback (HUMAN GATE)

Step 0 found a `complete` Spec Loop block. Ask in one message:

> "Run <n> finished on <date>. Start run <n+1>? Tell me what to change: feedback on options, journeys, story maps or prototypes. If you edited stories or blocks in the app, say so and I'll pick them up. You can also bring in a direction from the backup pool."

Wait for the reply. Record it in the Spec Loop block as the run's feedback, increase **Run**, set status to `running`.

### Step F2: Read what carries over

For each active option, read: the solution and its blocks (Learnings, Iteration Log, Kill Criteria, Prototype), its stories as they are now (the builder's edits included), its assumptions and tests with results, and the scorecard's **untested since round 2** list. Reuse the codebase, the as-is map and the starting screen from the Spec Loop block. Don't repeat Steps 1-6.

A backup-pool direction the builder brings in becomes a new solution (Step 6 schema) and enters at Step 7a with its own budget.

### Step F3: Apply the feedback to each option

Continue a PM per option (a new agent given the PM brief, the feedback, the Learnings block and the current stories). It applies the feedback and the untested changes from the last run to the whole spec, as in Step 12 part 3: journey, stories, description, Why It Works and Trade-offs, and returns the spec changes list. If the backbone changed, run the Step 7a backbone review.

Then run **Step 7b** again: the builder reviews the changed story maps before anything is built.

### Step F4: Next prototype version

The PM builds the next version (`v{n+1}.html`) from the current one, applying every spec change a user would see, from the same starting screen (Step 7c checks apply). Never overwrite an earlier version. Run the **design critique** on it, then add it to the Prototype block as Candidate (untested). Round 1 of this run tests it.

### Step F5: Run the loop again

Map assumptions on the changed parts only (Step 8), plus anything listed as untested since round 2. Freeze criteria (Step 9). Then Steps 10-14 with a **fresh 2-round budget**. In this run's round 1, the ratchet set is every usability test that passed in earlier runs, re-run on the new version.

Log lines carry the run number ("Run 2, Round 1"). At the end, rewrite the scorecard (Step 15) and keep one line per earlier run under **Previous runs**.

---

# STRICT RULES

1. **Never edit a frozen Pass / Fail Criteria block.** Fix a bad criterion with a new test.
2. **The tester never sees the criteria.** The grader decides PASS or FAIL against the criteria, nothing else.
3. **At most 2 test rounds.** No third round, no matter what failed.
4. **Ratchet.** A spec change stays only if every previously passed usability test still passes. When one is undone, it's undone in the spec and the prototype together.
5. **AI pre-mortems are not evidence.** Tag them `ai-premortem`, keep the test `draft`, never mark a value or viability assumption passed.
6. **Value and viability evidence comes only from the tree.** Outcome metrics and the opportunity's blocks.
7. **Never modify the codebase.** Feasibility spikes write throwaway code outside the repo.
8. **Never overwrite a prototype version.** v1, v2, v3 stay side by side.
9. **Write only under this opportunity.** Its blocks, its new solutions and their assumptions and tests. Never edit sibling opportunities, outcomes or existing solutions.
10. **Never set a story's `done` or `doneAt`.**
11. **Only the human gates stop the run.** Steps 1, 6, 7b, F1 and, when triggered, Step 2 (DESIGN.md not found) and Step 13. Everything else is decided by the loop and recorded.
12. **Record before moving on.** A test without its Result and Learning blocks hasn't finished.
13. **The prototype starts from the real starting screen.** It comes from the as-is map's cited files, or for greenfield from the screen approved at Step 6. No agent picks its own.
14. **No raw IDs for humans.** Link entities as `[Title](#entity/<id>)` in blocks and name them by title in messages. Write types out in full.
15. **Spec and prototype move together.** After every round the whole spec (description, Why It Works, Trade-offs, journey, stories) is updated from what the round learned, and the next round tests a new prototype version built from it.
16. **Statuses match results.** Set test and assumption statuses when each result is recorded, per the status rules, and check them all before the scorecard. No run ends with a status that doesn't match its latest result.
17. **The Prototype block links every version.** You update it when a version is built, promoted or fails a re-test. The PM never writes it.
18. **Every prototype version passes a design critique before it's tested.** The critic never sees the assumptions, tests or criteria, and disputes are settled by the DESIGN.md first.
