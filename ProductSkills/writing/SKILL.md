---
name: writing
description: Writes clear, concise prose free of AI tells. Use before producing any written deliverable and when writing or rewriting product artefacts - business outcome, product outcome, opportunity, solution, assumption, test, persona, entity description, ICE rationale, PRD, spec, epic, user story, acceptance criteria, interview snapshot, memo, email, Slack message, presentation, README, commit body. Also use when asked to write, rewrite, tighten, shorten, sharpen, edit, review or de-slop prose, when a draft reads as AI-generated or bloated, and when composing a chat reply. Do NOT use for code, config, or data files.
license: MIT
metadata:
  author: Cata Viciu
  version: 1.0.0
  category: writing
  tags: [writing, editing, clarity, communication, ai-tells, product-management]
---

# Writing

Goal: clear, concise prose, free of Claude talk.

Required for every document and every chat reply, one-liners included. No exemptions.

## Workflow

1. Read `references/clear-writing-rules.md` and `references/claude-talk.md`.
2. Write version 1.
3. Claude talk pass. Walk `claude-talk.md` rule by rule. Name what fails.
4. Cutting pass. Judgement, not arithmetic. Ask of every sentence:
   - Is every word doing new work?
   - Can this thought be said with less?
   - Cut it, then read on. If the piece still works, it was never needed.
   - Any long word where a short everyday one would do?
   Then name every claim made more than once. A repeat means the first mention wasn't clear.
5. Ambiguity pass. Hunt for sentences that can be read two ways. Name them.
6. Fix everything the three passes named, then present.
7. On pushback, run passes 3 to 5 again and present again.

Never present version 1 unevaluated. A pass with nothing named is a pass you skipped. A shorter draft that still repeats itself failed the cutting pass, so word count proves nothing on its own.
