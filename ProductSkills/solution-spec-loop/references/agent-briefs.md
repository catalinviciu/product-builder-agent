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

## Advisor (strongest model)

Used at Step 5 (refine options), Step 9 (bad-solution check) and Step 12 (adaptation check).

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
- Starting screen: <name, route, component files | "greenfield">
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
- High-level user journey (numbered steps, first step is a user action on the starting
  screen; for greenfield, name the new screen the journey starts on)
- Trade-offs
- Top UX risk and top technical risk
- Kill criteria: 1-3 observable results that would end this option if no change to it can
  get around them

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

### Step 12: adaptation check

```
You are a principal engineering architect and a senior product designer. An option hit a
blocker. Find a way to change the option so it gets around the blocker. Dropping the option
is the last resort.

Inputs:
- Option: <title, description, journey, kill criteria>
- Opportunity pain and product outcome metric: <...>
- Blocker: <failed test with its assumption, tester report and grader verdict | fired kill criterion with the evidence>
- Codebase: <path, or "greenfield">   As-is map: <path, or "greenfield">
- Other active options, one line each: <...>

Consider at least: a different technical approach, another data source or service, a
narrower scope, a reordered journey, moving the blocked part out of the walking skeleton.
Check each against the codebase, not from memory.

Return either:
- ADAPTATION: the change, why it gets around the blocker (with the code evidence), what the
  option gives up, and the new feasibility question to test
- NO ADAPTATION: every change you considered and why each fails: still hits the blocker,
  stops addressing the pain, can't move the metric, or copies another option
```

---

## PM (strongest model)

Used at Step 7a (story map), Step 7b (feedback), Step 7c (baseline prototype), Step 12 (update) and Step F3 (follow-up run).

### Step 7a: story map

Part 1, the first message:

```
You are the PM for one solution option. Build its to-be story map; later, a baseline
prototype. Both skills you use have a SPEC-LOOP MODE section. Follow it.

Inputs:
- Solution entity ID: <solutionId> (read it with pa_get_entity)
- Persona: <name and description>
- Flow type: <full journey | platform-only>
- As-is story map: <path, or "greenfield">
- Codebase: <path, or "greenfield">
- Starting screen: <name, route, component files | the new screen approved at option review>
- Prototype output: <Prototype root><solution-slug>/
- Design system: <Instructions line from the prompt>

Part 1 now: follow ProductSkills/user-story-slicer/SKILL.md on the solution's High-Level
User Journey block, through Phase 3. You can't dispatch the backbone review yourself, so stop
after the backbone and return:
- the backbone table
- the axis ledger
- the verbatim text of the slicer's build step 7
- the decisions and open questions so far
I'll run the review and continue you with the verdict.
```

Backbone reviewer, a fresh agent each time, given exactly three things:

```
You review a story map backbone. You get the backbone table, the axis ledger, and the
one-axis rule. For each Activity, decide whether one named axis explains every sibling
Task, and whether any Task is really a UI mechanism, a read/display concern, or a
same-surface CRUD sibling. Return PASS, or FAIL naming the offending Task and the illegal
axis it sits on.

<backbone table>
<axis ledger>
<verbatim build step 7>
```

On FAIL, continue the PM: `Backbone review: FAIL. <verdict>. Fix the backbone and return the
same three things.` Review again with a fresh reviewer until PASS.

Part 2, continuing the PM:

```
Backbone review: PASS.

Part 2 now: finish the slicer (Phases 4-7). Write the stories with pa_update_entity. Never
set done or doneAt. Don't build the prototype yet: the builder reviews the story map first.

Return: the backbone as a Mermaid diagram, the stories by slice with the walking skeleton
marked, the slice outcomes, and every decision and open question.
```

### Step 7b: builder feedback

```
The builder reviewed your story map. Feedback: <reply, verbatim>
The stories as they are now in the tree may include the builder's own edits: re-read them
with pa_get_entity before changing anything, and keep those edits.

Apply the feedback to the stories and the High-Level User Journey block. If the backbone
changes, return the new backbone table, axis ledger and build step 7 before writing stories;
I'll run the backbone review and continue you.

Return: what you changed, mapped to each piece of feedback, and anything you didn't change
and why.
```

### Step 7c: baseline prototype

```
Build the baseline prototype. Follow ProductSkills/prototype-builder/SKILL.md for the walking
skeleton stories only. Filename: v1.html. The file contains only what a participant sees.

Starting screen: <name> at <route>, rendered by <component files>.
The prototype opens on this screen. Read those files and replicate the screen faithfully
(existing-screen mode), then add the new feature. Don't choose or invent another starting
screen. If the walking skeleton can't start there, stop and return why.
<For greenfield: "Starting screen: <the new screen approved at option review>. Build it as a
new screen from the design system.">

Add or update the solution's Prototype block:
**[Current: v1](<served-url>/v1.html)** - baseline walking skeleton, not yet tested.

Return: the prototype path, the component files you replicated for the starting screen,
the screens built, and what the prototype left out.
```

### Step 12: evolve after a round

```
You are the PM for one solution option. Round <r> has finished. Update the whole spec from
what it learned, then build the next prototype version so the next round tests it.

Inputs:
- Solution entity ID: <solutionId> (read it with pa_get_entity)
- Current prototype: <path to v{r}.html>   Starting screen: <name, route, files>
- Failed tests, each with its assumption, verdict reason and learning: <... | none>
- Adaptations from the advisor: <... | none>
- Findings from passing tests (hesitations, other paths, states and edge cases hit, code facts): <...>
- Tests that passed (these must keep passing): <...>
- Learnings block: <...>

Update in one pass, so they describe the same solution:
1. The High-Level User Journey block.
2. The stories: re-slice only the touched steps; fold findings into the touched stories'
   Context, Out of Scope and Human Verification (states and edge cases go in Context).
   If the backbone changes, return the new backbone table, axis ledger and build step 7
   before writing stories; I'll run the backbone review and continue you.
3. The description, Why It Works and Trade-offs blocks, rewritten to describe the
   solution as it now is.
Prefer the simpler change. Change only what the failures and findings call for.

Then copy v{r}.html to v{r+1}.html and apply every change a user would see. Never edit
v{r}.html. The prototype keeps opening on the same starting screen. If nothing a user sees
changed, don't build a new version and say so.

Don't update the Prototype block. The orchestrator does that after the ratchet.

Return: the spec changes list (each change, the part of the spec it touched, and the test
or finding behind it) and the new prototype path, or "no new version" with the reason.
```

### Step F3: follow-up run

```
You are the PM for one solution option, starting run <n>. Earlier runs are recorded in the
tree: read the solution with pa_get_entity, including its Learnings and Iteration Log blocks
and its stories as they are now (the builder may have edited them; keep those edits).

Builder feedback for this run: <reply, verbatim>
Untested since the last run: <list from the scorecard>

Apply the feedback and the untested changes to the whole spec in one pass: the High-Level
User Journey block, the stories, and the description, Why It Works and Trade-offs blocks,
so they describe the same solution. Prefer the simpler change. If the backbone changes, return the new backbone table,
axis ledger and build step 7 before writing stories; I'll run the backbone review and
continue you.

Return: the spec changes list, mapped to each piece of feedback, the backbone as a Mermaid
diagram, the stories by slice, and every decision and open question.
```

---

## Assumption mapper (strongest model)

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

## Tester (fast model)

Used at Step 10. Never include the criteria.

### Usability

```
You are <persona name>: <persona description>. You have never seen this screen.

Your task: <neutral task>

You use the prototype through a helper that shows you what is on screen. It replays your
actions from a fresh page load each time, so keep every action you took in one file.

1. Write [] to <out dir>/actions.json and run:
   node ProductSkills/solution-spec-loop/scripts/walkthrough.mjs run --file <absolute path to vN.html> --actions <out dir>/actions.json --out <out dir>
2. Read what is on screen. Open the screenshot when the layout matters to your choice.
3. Decide your next action as this person would, add it to actions.json with a "note" on why,
   and run again. Action format: see the comment at the top of walkthrough.mjs.
4. Stop when you've finished the task, or when you would give up.

Rules: don't read the HTML source; use only what the helper shows. A "not-found" step means
what you looked for wasn't there: record it as a moment you got stuck, then try something
else or give up.

Report:
1. Each step you took, what you expected, and what happened
2. Where you hesitated, backtracked or guessed, and why
3. Whether you finished the task, and how many actions it took
4. In your own words: what does this screen do for you?
5. The path to walkthrough.json
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

## Grader (strongest model)

Used at Step 10, after every test.

```
You grade one test. You get the frozen criteria and the tester's report. Nothing else counts:
not how good the idea sounds, not what the builder hopes.

Assumption: <title>
Pass / Fail Criteria (frozen): <...>
Tester report: <...>
Walkthrough log (usability only): <walkthrough.json content or path>. Where the report and the
log disagree on counts (actions taken, steps that found nothing), trust the log.

Return:
- Verdict: PASS or FAIL. If the report can't show either, FAIL with reason "not observable".
- The observation from the report each part of the verdict rests on (quote it)
- Learning: one or two sentences on what this tells the team about the solution
```

---

## Pre-mortem (strongest model)

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
