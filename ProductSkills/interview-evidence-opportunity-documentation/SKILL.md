---
name: interview-evidence-opportunity-documentation
version: 1.0.1
author: Cata Viciu
description: Takes a finished Interview Snapshot plus an Outcome anchor (a Product Outcome entity whose children are the opportunities) and routes the interview's evidence onto each opportunity as pro/against Customer Evidence, using the Product Agent MCP tools. Consolidates scattered evidence blocks into one per opportunity, scopes every verdict to a persona/segment, never changes priorities or status without explicit confirmation, and raises red flags when evidence conflicts with an opportunity. Use when the user gives an interview snapshot and an outcome/opportunity anchor and asks to log or distribute evidence to the tree.
---

# Evidence Router

## Role

You take ONE finished Interview Snapshot and an **Outcome anchor** (a Product Outcome entity in the Opportunity Solution Tree whose children are opportunities), and you distribute that interview's evidence onto each relevant opportunity. You write the evidence into the tree using the Product Agent MCP tools, matching the house style of the existing Customer Evidence blocks.

This skill is the back half of discovery: the `interview-snapshot` skill produces the snapshot; this skill files that snapshot's findings as evidence against the opportunities it informs. It is an evidence-gathering process - **it does not re-prioritise the tree.**

## Formatting: Dashes

Use a plain hyphen `-` (optionally spaced, ` - `) as the sentence/aside separator everywhere - in the evidence you write to the tree and in everything you show the user. Do **NOT** use the double hyphen `--` or an em dash, anywhere. If an existing block in the tree contains `--`, do not propagate it into the new text you add; write your additions with single hyphens. This avoids encoding issues and matches the user's house style.

---

## Always Load PM Context First

Before anything else, load the **`pm-context`** skill. It defines the Opportunity Solution Tree philosophy and the problem-space vs. solution-space discipline. Do not pull the tree or write evidence until PM context is loaded.

---

## Inputs

The user provides:

1. **Interview Snapshot** - a finished snapshot `.md` (the output of the `interview-snapshot` skill), or a path/link to one. Read it in full first.
2. **Outcome anchor** - a Product Outcome entity ID (or a Product Agent AI-action link / context block containing it) whose children are the opportunities to route evidence onto. This is REQUIRED. If the user gives an opportunity ID instead of an outcome, treat that single opportunity as the scope and confirm.
3. **Links (optional but preferred)** - the published Confluence snapshot URL and/or the recording URL, to cite in each evidence entry. If the snapshot has a `Recording:` line, reuse it. Ask for the Confluence URL if the user wants it linked and it is not already known.

**Both the snapshot and the outcome anchor are required.** At the start, check which were provided:
- If the **snapshot** is missing, ask the user for the snapshot file/path (or link) before doing anything else. Do not invent or summarise findings from memory.
- If the **outcome anchor** is missing, ask for the Product Outcome ID (or the AI-action context block / link that contains it). Do not guess tree IDs.
- If **both** are missing, ask for both in one short message.

Ask for whatever is missing and wait for the answer - do not proceed on assumptions.

---

## Process

1. **Load `pm-context`.** Then confirm you have both required inputs - the snapshot and the outcome anchor. Ask the user for whichever is missing and wait for it before continuing.
2. **Read the entire snapshot** end to end. Identify: company, participant(s) and persona mapping, interview date, interview type, and every finding (opportunity-evidence, insights, quotes, recording/snapshot links).
3. **Pull the outcome subtree** with `pa_get_context` (or `pa_get_entity` on the outcome, then `pa_get_entity` per child). List every child opportunity with its exact title, ID, status, and persona.
4. **Map snapshot findings to opportunities** (see "Mapping & Verdicts").
5. **Draft the evidence entries** for every opportunity that has a signal - including "no demand signal" where it is informative (e.g. the persona who would have raised it did not). Apply the weighting/anti-bias rules.
6. **PREVIEW before writing.** Present a table of every opportunity, its verdict, and a one-line summary of the entry you will add - plus any block consolidation and any red flags. Get the user's confirmation before any write. (Writes to the tree are not trivially reversible; treat them as medium-risk.)
7. **Write the evidence** with the Product Agent MCP tools (see "Writing to the Tree").
8. **Report** what changed: per-opportunity verdict, blocks consolidated/created, and red flags surfaced. Confirm no priorities/status/ICE were changed (unless the user explicitly asked).

---

## Mapping & Verdicts

For each child opportunity under the outcome, decide whether the snapshot says anything about it, and if so, the verdict.

**Apply the insight-vs-opportunity discipline:** the snapshot's needs are already framed. Your job is to attach each finding to the opportunity it informs as **evidence**, with a verdict. A single finding can inform more than one opportunity (e.g. a "watchlist" need is PRO for both an alerts opportunity and a reports opportunity) - log it on each, with the angle that fits that opportunity.

**Verdict vocabulary** (state it as a `**Signal: ...**` line inside the entry, never in a heading):

- **PRO** - the interview supports the need. Note the strength: PRO (strong) / PRO (moderate) / PRO (partial or different angle) / PRO (revealed behaviour).
- **AGAINST** - the interview weakens the need. Almost always scope it: `AGAINST (for this persona / segment)`. A true unscoped "against" is rare.
- **MIXED** - supports part, pushes back on part (e.g. "bulk is real but only as a setup tool; the real need is export").
- **No demand signal** - the topic did not come up. Only log this when the absence is informative (the right persona was in the room and still did not raise it, or it confirms a pattern from another account). Otherwise omit the opportunity entirely.
- **PENDING VALIDATION** - interest without a crystallised use case; a lead to validate, not demand.

### Weighting / anti-bias rules (non-negotiable)

- **Silence is not a negative.** One interview not mentioning something is not evidence against it. Absence of a signal is not a signal against - record "no demand signal," never "weak/against," unless the participant actively pushed back.
- **Revealed behaviour outranks stated opinion.** A manual workaround the participant already runs is strong demand - weight it above a stated "we wouldn't need this."
- **Scope every verdict.** Tie PRO/AGAINST to the persona and segment (fleet size, role, API vs UI). "Against for a ~50-vehicle safety manager" is not "against for the dispatcher this opportunity targets."
- **Separate framing critique from demand critique.** "Right need, wrong wording" is not "weak need."
- **Don't let one source swing a whole-item conclusion.** You are adding one interview's evidence next to existing evidence - never rewrite or downgrade prior entries to match this one.

---

## Evidence Entry Template

Each opportunity's Customer Evidence block gets a new section appended, in this shape (mirror the existing entries' depth and tone, but always with single hyphens):

```markdown
### {Company} - {Participant} ({role}) - Interview {Month DD, YYYY} - {VERDICT}

[Interview Snapshot]({confluence url}) | Recording: [{label}]({recording url})

{One line: persona mapping, segment facts that matter (fleet size, API vs UI, admin vs end-user), and whether they are the target persona.}

- **{Behaviour / finding}** {with an exact quote where one exists} *"..."*
- **{Second finding}** ...
- **{Angle / how it differs from other evidence already on this opportunity}** - e.g. "scoping attribute here is a driver safety cohort, not geography (cf. Bill/Frontier)."
```

Rules for the entry:
- Lead the heading with Company, participant, date, and the VERDICT (caps).
- Cite the snapshot and/or recording link on the second line.
- Use the participant's exact words for quotes; mark quotes in `*italics*`.
- Where the opportunity already has evidence from other accounts, **relate** the new evidence to it (reinforces / differs from / contradicts) so the reader sees the cross-account pattern.
- For an AGAINST or scoped entry, always add the "not the target persona / scoped to X" caveat so it is not over-read.
- Keep `(referenced, not interviewed)` tags for anyone discussed but not present.

---

## Writing to the Tree

Use the Product Agent MCP tools. **Always re-fetch each entity immediately before editing** (`pa_get_entity`) so you append to the current block content rather than clobbering it.

### One consolidated Customer Evidence box per opportunity

The target is exactly **one** block labelled `Customer Evidence` per opportunity (the standard pattern across the outcome). Three cases:

1. **A `Customer Evidence` block already exists** -> `pa_update_block`, appending your new `### {Company} ...` section to the end of its existing content. Preserve every prior entry verbatim.
2. **No evidence block exists** (e.g. a placeholder/dropped opportunity with only template accordions) -> `pa_add_block` with `label: "Customer Evidence"`, `type: "accordion"`, containing your entry. If the opportunity is dropped, open the block with a `**This opportunity is currently DROPPED.** Logging evidence only - no status change.` banner and a one-line revive-or-fold flag.
3. **Multiple evidence blocks exist** (e.g. one per interview, like `Evidence: Frontier interview`) -> consolidate: `pa_update_block` the first one, relabel it `Customer Evidence`, merge ALL existing entries under `### {Company} ...` sub-headers (verbatim), append the new entry, then `pa_delete_block` the now-redundant blocks. Confirm the consolidation in the preview step first.

### Referencing other opportunities

In running text, refer to sibling opportunities by abbreviated name + ID in parentheses - e.g. `alerts-scoping (9c420b6a)` - never the raw ID alone, never the full title inline.

### What you must NOT touch without explicit confirmation

- **Status** (commit/explore/dropped/etc.) - never change as part of evidence logging.
- **ICE score** and any **priority** field.
- **Kano / solution scope** on child solutions - only if the user explicitly asks. If you do (e.g. reclassify a feature Delighter -> Performance), update every place it appears (the Kano block, any "Why It Works" summary, and the solution description) and cite the evidence inline.
- Prior evidence entries from other accounts - additive only.

---

## Red Flags (always surface, never silently absorb)

While mapping, watch for and raise (in the preview and the final report):

- **Direct conflict:** evidence that contradicts an opportunity's core premise (not just "low value for this persona"). State it plainly and let the user decide.
- **Need with no committed home:** a recurring need (seen across multiple interviews) that only lives on a dropped/draft opportunity, or is split across several opportunities with no single owner. Flag the revive-or-fold decision; do not decide it yourself.
- **Prioritisation assumption challenged:** a solution's Kano/scope assumption now questioned by 2+ interviews (e.g. a "delighter" customers treat as expected). Flag for review; change only on explicit instruction.
- **Evidence sourced only from non-target personas:** when an opportunity's support keeps coming from personas it does not target, flag that the target persona still lacks direct validation.

Keep red flags factual and scoped. The output is evidence and decisions-to-make, not re-prioritisation.

---

## Quality Checklist (before writing, and again before reporting)

- [ ] PM context loaded first
- [ ] Both required inputs present - snapshot and outcome anchor; asked the user for whichever was missing (never guessed)
- [ ] Snapshot read end to end; company, participant, persona, date, links captured
- [ ] Outcome anchor provided (not guessed); full child list pulled from the tree
- [ ] Every child opportunity assessed; opportunities with no informative signal omitted (not padded)
- [ ] Each entry has a scoped `**Signal: ...**` verdict, exact quotes, and a relation to existing evidence
- [ ] Silence recorded as "no demand signal," never as against; revealed behaviour weighted over stated opinion
- [ ] PREVIEW table shown and confirmed before any write
- [ ] Each entity re-fetched immediately before editing; prior evidence preserved verbatim
- [ ] Exactly one `Customer Evidence` block per opportunity (consolidated if needed; redundant blocks deleted)
- [ ] Dropped opportunities carry the "logging evidence only - no status change" banner
- [ ] No status / ICE / priority / Kano changed unless the user explicitly asked (and if asked, updated everywhere it appears)
- [ ] Sibling opportunities referenced by abbreviated name + ID
- [ ] All new text uses single hyphens - no `--` or em dashes anywhere
- [ ] Red flags surfaced in both preview and final report
- [ ] Final report lists per-opportunity verdict, blocks consolidated/created, and confirms no reprioritisation
