# Story Template & Anatomy

## What is a User Story?

A description of a change in system behavior from the perspective of a user. It describes something a user wants to do with the system that it doesn't do today.

A user story is NOT a requirements document. It's an invitation to a conversation.

**When AI builds:** The conversation must conclude *before* the story reaches AI. The story AI receives is the final output of that conversation, not the starting point.

---

## The 3Cs: Card, Conversation, Confirmation

| C | What it is | Key point |
|---|---|---|
| **Card** | 2-3 sentence description of the need (who, what, why) | A reminder token, not a spec |
| **Conversation** | Discussion between user, PO, team, and stakeholders | Where the real value lives |
| **Confirmation** | Acceptance criteria / tests that verify the story is done | Written before development starts |

**AI-as-builder shift:** Conversation must be *complete* before handing to AI. The Card becomes more precise, and Confirmation (AC) becomes the executable contract.

---

## Story Card Format

```
As a [specific role],
I [action/need]
so that [benefit/value]
```

**Rules:**
- The role must be a specific human who interacts with the system -- not "a user" and never "a developer"
- The action describes a change in system behavior, not an implementation detail
- The "so that" clause is the most important part -- it tells the team *why*
- The "so that" clause is optional only when it adds zero information

---

## Story Anatomy for AI-as-Builder

When AI executes stories, each story needs more structure than a sticky note:

```
## [Story Title]

As a [specific role],
I [action/need]
so that [benefit/value]

### Context
- **Stack:** [tech stack, frameworks, languages]
- **Existing system:** [what's already built that this touches]
- **Constraints:** [conventions, patterns, rules to follow]

### Out of Scope
- [Explicit list of what this story does NOT include]
- [Prevents AI from over-building]

### Dependencies
- [What must exist before AI starts this story]
- [APIs, data models, components, other stories]

### Human Verification
- [What the reviewer should visually inspect]
- [What to spot-check in the output]
- [Specific user flows to walk through manually]
```

**Note:** Acceptance Criteria are NOT included in this skill's output. They are written by a separate skill after the team confirms the story set.

### Why each section matters

| Section | For human devs | For AI |
|---|---|---|
| **Context** | They already know this (tribal knowledge) | Must be stated -- AI has no institutional memory |
| **Out of Scope** | Discussed at standup if unclear | AI will infer scope without it -- often wrong |
| **Dependencies** | They check by asking teammates | AI needs explicit pointers to existing code/APIs |
| **Human Verification** | They demo at sprint review | The PM/reviewer needs a script to validate AI output |

---

## Story Sizing Quick Reference

| Size Signal | What It Means | Action |
|---|---|---|
| Takes < 1 day | Probably too small -- might be a sub-task | Merge with related stories |
| Takes 1-3 days | Sweet spot for a single story | Keep as-is |
| Takes 4-5 days | Acceptable but watch for hidden complexity | Consider splitting if unclear |
| Takes > 1 week | Too big -- hard to estimate, risky | Must split using the 9 patterns |
| "I don't know how big" | Not estimable -- likely poorly understood | Spike first, then split |
