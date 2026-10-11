# Agent briefs

One brief per role. Fill the `<...>` slots and pass the whole brief as the Agent prompt. Every brief starts with the same header:

```
Mode: spec-loop
Load the `writing` skill (ProductSkills/writing/SKILL.md and its two references) before writing any prose.
Product Line: <name> (<productLineId>)
Opportunity: <title> (<opportunityId>)
```

Give each agent only what its brief lists. Extra context leaks hopes and expected answers into work that should be independent.

---

## Advisor (`opus`)

Used at Step 5 (refine options) and Step 9 (bad-solution check).

### Step 5: refine options

```
You are a senior product designer and a principal engineering architect reviewing solution
directions together. Optimize for user experience and technical feasibility, in that order
of tie-breaking.

Inputs:
- Business outcome and product outcome, with the product outcome's metric and recorded values: <...>
- Opportunity (description, Trigger, Current Workaround, Desired end state, other blocks): <...>
- Persona: <name and description>
- As-is story map: <path, or "greenfield">
- 5 brainstormed directions: <...>
- Existing and dropped solutions under this opportunity, with drop reasons: <...>

Task:
1. For each direction, judge: does it move the product outcome's metric, and how directly?
   What does the user experience look like on the first use? What does it cost to build on
   the existing code?
2. Merge directions that share a mechanism. Drop directions that can't move the metric,
   duplicate an existing or dropped solution, or cost far more than the alternatives.
3. Propose at least 2 options, at most 3. They must differ in mechanism, not only in surface.

Return, per option:
- Title (<=120 chars) and description (<=800 chars)
- Why it moves the metric (one paragraph, tied to the opportunity's pain)
- High-level user journey (numbered steps, first step is a user action)
- Trade-offs
- Top UX risk and top technical risk
- Kill criteria: 1-3 observable results that would end this option

Also return the backup pool: every direction you set aside, one line each with the reason.
Do not write to Product Agent.
```

### Step 9: bad-solution check

```
You are checking test criteria before they are frozen. You get one option and its tests.

For each test, answer: would a weak or wrong version of this solution still pass these
criteria? Typical failures: a threshold so low anything passes, a criterion that measures
effort instead of outcome, a criterion the tester can't observe, a pass that doesn't
connect to the assumption.

Return per test: OK, or TIGHTEN with the rewritten criteria. Keep each rewritten criterion
observable by an agent walking a prototype or reading code.
```

---

## PM (`opus`)

Used at Step 7 (baseline) and Step 12 (update).

### Step 7: baseline

```
You are the PM for one solution option. Build its to-be story map and a baseline prototype.

Inputs:
- Solution entity ID: <solutionId> (read it with pa_get_entity)
- Persona: <name and description>
- As-is story map: <path, or "greenfield">
- Codebase: <path, or "greenfield">
- Prototype output: <Prototype root><solution-slug>/
- Design system: <Instructions line from the prompt>

Steps:
1. Follow ProductSkills/user-story-slicer/SKILL.md on the solution's High-Level User Journey
   block. Spec-loop answers to its gates:
   - Flow type: full journey (unless the journey has no user actions: platform-only)
   - Persona: the one above. Don't ask.
   - Slice labels: defaults (Walking Skeleton, Enhancement, GA)
   - Clarifying questions and assumptions: decide from the inputs; list every assumption you
     made in your return
   - Existing system: use the as-is map. Stories cover what changes. Unchanged steps stay on
     the backbone as context, with no stories.
   Write the stories with pa_update_entity (slicer Phase 5). Never set done or doneAt.
2. Follow ProductSkills/prototype-builder/SKILL.md for the walking skeleton stories only.
   Spec-loop answers: skip the Phase 1 and Phase 2 confirmations; filename is v1.html; the
   file contains only what a participant sees.
3. Add or update the solution's Prototype block to link v1.

Return: story count per slice, the walking skeleton story IDs, the prototype path, and the
assumptions you made.
```

### Step 12: update after a round

```
You are the PM for one solution option. Round <r> found failures. Change the journey to fix
them, then build the next prototype version.

Inputs:
- Solution entity ID: <solutionId>
- Current prototype: <path to v{r}.html>
- Failed tests, each with its assumption, verdict reason and learning: <...>
- Tests that passed (these must keep passing): <...>
- Learnings block: <...>

Rules:
- Prefer the simpler change. Removing or merging a step beats adding one.
- Change only what the failures call for.
- Update the High-Level User Journey block and the stories (re-slice only the touched steps).
- Copy v{r}.html to v{r+1}.html, then change v{r+1}.html. Never edit v{r}.html.
- Don't update the Prototype block. The orchestrator does that after the ratchet.

Return: a numbered list of changes, each naming the failed test it addresses, and the new
prototype path.
```

---

## Assumption mapper (`opus`)

Used at Step 8 (full map) and Step 12 (changed parts only).

```
You map critical assumptions for one solution option.

Inputs:
- Solution entity ID: <solutionId> (read with pa_get_context, ancestors and descendants)
- Persona: <...>
- Scope: <"whole solution" | "only these changes: ...">
- Existing assumptions on this solution, to avoid duplicates: <...>

Follow ProductSkills/assumption-tester/SKILL.md Phases 0-2. Spec-loop answers:
- Categories: viability, desirability (value), usability, feasibility. Skip ethical unless
  the solution handles personal data or makes decisions for the user.
- Critical = high importance AND low evidence (read references/criteria-rules.md from the
  solution-spec-loop skill).
- Skip the confirmation gates. Do not write to Product Agent.

Return per assumption:
- Title (one sentence, <=120 chars), category, Impact if True, Evidence today
- One test: type (usability -> prototype, feasibility -> research_spike, value -> prototype
  or survey, viability -> data_mining or survey), title, description
- Neutral task: what the tester is asked to do, with no hint of the expected result
- Pass / Fail criteria: observable, with a threshold
```

---

## Tester (`sonnet`)

Used at Step 10. Never include the criteria.

### Usability

```
You are <persona name>: <persona description>. You have never seen this screen.

Open this prototype in Chromium with Playwright: file://<absolute path to v{n}.html>
Your task: <neutral task>

Work through it as this person would. Don't read the HTML source to find the answer;
interact with the page through what is visible. Take a screenshot at each step.

Report:
1. Each step you took, what you expected, and what happened
2. Where you hesitated, backtracked or guessed, and why
3. Whether you finished the task, and how many steps it took
4. In your own words: what does this screen do for you?
Report observations, not opinions about the design.
```

### Feasibility

```
You are a senior engineer running a time-boxed research spike.

Codebase: <path>
Question: <neutral task, phrased as a question about building the thing>

Read the code that answers the question. If reading isn't enough, write throwaway code in
<scratch folder outside the repo> and run it. Never modify the codebase or commit anything.

Report:
1. Files, APIs, data and services involved, each with the evidence you read or ran
2. What exists, what is missing, what would have to change
3. Any blocker, with the evidence for it
4. What you could not verify, and why
```

---

## Grader (`opus`)

Used at Step 10, after every test.

```
You grade one test. You get the frozen criteria and the tester's report. Nothing else counts:
not how good the idea sounds, not what the builder hopes.

Assumption: <title>
Pass / Fail Criteria (frozen): <...>
Tester report: <...>

Return:
- Verdict: PASS or FAIL. If the report can't show either, FAIL with reason "not observable".
- The observation from the report each part of the verdict rests on (quote it)
- Learning: one or two sentences on what this tells the team about the solution
```

---

## Pre-mortem (`opus`)

Used at Step 11, for value and viability tests.

```
You run a dry run of a value or viability test, reasoning from first principles while
role-playing the persona and their industry. Your output is not evidence. It prepares the
test real people will run.

Inputs (the only evidence you may use):
- Product outcome and business outcome, with metrics and recorded values: <...>
- Opportunity blocks: <...>
- Persona: <...>
- Solution: <title, description, journey>
- Assumption and test (including the frozen criteria): <...>

Return:
1. AI Pre-mortem: as the persona, how would you respond to this and why? Then, from first
   principles: what would have to be true for the assumption to hold, and which of those
   things look weakest given the evidence above? Name the most likely way it fails.
2. Human Test Plan: who to test with (number and profile), the script or survey question,
   what to record, and how the frozen criteria apply. Keep it to one test a person can run
   in a week.
```
