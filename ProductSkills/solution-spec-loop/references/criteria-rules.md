# Criteria rules

The pass/fail criteria are the loop's evaluator, the equivalent of `evaluate_bpb` in autoresearch. If the evaluator can be bent, every result after it is worthless.

## Criticality

An assumption enters the loop only if both hold:

1. **High importance.** If it's false, the solution fails or can't move the outcome's metric. Assumptions about the first steps of the journey rank higher than later ones.
2. **Low evidence.** The tree, the as-is map and the codebase give little or no proof it's true today.

If you'd be surprised to find it false, it isn't critical. Leave it out.

Rank critical assumptions by importance first, then by how little evidence exists. Within a round, test feasibility before usability, and higher-ranked before lower-ranked.

## What a good criterion looks like

- **Observable by the agent who runs the test.** A usability tester can report steps, hesitations, completion and its own reading of the screen, and the walkthrough log counts actions and steps that found nothing. A feasibility tester can report files, APIs, data and the result of throwaway code. A criterion about anything else can't be graded.
- **A threshold, set before the run.** "Finishes the task in 6 steps or fewer without backtracking" beats "finds it easy".
- **Measures the outcome, not effort.** "Correctly states what the alert means" beats "opens the alert".
- **Tied to the assumption.** Passing must make the assumption more likely true; failing must make it less likely.
- **Both sides defined.** State what counts as PASS and what counts as FAIL. Anything in between is FAIL.

Examples:

| Weak | Frozen |
|---|---|
| Users understand the new filter | The tester names what the filter shows without opening help, and applies it in 3 steps or fewer |
| The API can support this | An existing endpoint returns the field at per-vehicle level, shown by a call in throwaway code or a cited response schema |
| The flow feels fast | The task finishes in 5 steps or fewer with no backtracking |

## The bad-solution check

Before freezing, the advisor asks of every test: would a weak or wrong version of this solution still pass? If yes, tighten the criterion. Common causes:

- a threshold anything clears
- a criterion that counts clicks or views instead of correct understanding
- a criterion the tester can't observe
- a pass that says nothing about the assumption

## Freezing

Once the test entity is written, its `Pass / Fail Criteria` block is frozen:

- Never update it, not even a typo.
- If a criterion turns out wrong, write a new test under the same assumption and note in the old test's `Learning` block why it was replaced.
- The tester never sees it. Only the grader does.

## Grading

- The grader decides from the tester's report against the frozen criteria. Nothing else counts.
- A result that can't be observed from the report is FAIL with reason "not observable".
- Every verdict quotes the observation it rests on.

## Evidence levels

Tag every result with one level. Later rounds and the builder weigh them differently.

| Level | Meaning | Can it pass an assumption? |
|---|---|---|
| `executed` | Code or data was read or run: feasibility spikes | Yes |
| `simulated` | An AI tester walked a prototype as the persona | Yes, for usability, inside this loop. Humans should confirm before commit. |
| `ai-premortem` | AI reasoning from first principles, no test run | No |
| `human` | A real person took part | Yes. Overrides every other level. |
