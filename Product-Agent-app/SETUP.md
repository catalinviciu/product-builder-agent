# Product Agent — Setup Guide for Claude Code

> **Using Google Antigravity instead?** See [SETUP-ANTIGRAVITY.md](./SETUP-ANTIGRAVITY.md).

This guide helps you set up Claude Code to work with Product Agent alongside your own codebase. By the end, Claude Code will understand your product context and have a story map bootstrapped for your project.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
- Product Agent running locally (`cd Product-Agent-app && npm install && npm run dev`)
- Your codebase folder sitting alongside `Product-Agent-app/` in the same parent directory

## Folder Structure

Your workspace should look like this:

```
your-workspace/
├── Product-Agent-app/      # This app (product context & discovery tree)
├── ProductSkills/          # Claude agent skills (story-map-updater, etc.)
├── <YOUR_CODEBASE>/         # Your application code — replace with your folder name
└── CLAUDE.md                # Will be created/updated during setup
```

> **Fill in your codebase folder name:** Replace `<YOUR_CODEBASE>` with your actual folder name throughout this guide (e.g. `my-saas-app`, `frontend`, etc.)

---

## Step 1: Create your CLAUDE.md

Open Claude Code in the workspace root (the parent folder containing both `Product-Agent-app/` and your codebase). Then paste the following prompt:

```
Create a CLAUDE.md file at the workspace root. It should include:

1. A section about my codebase at `./<YOUR_CODEBASE>/` — read the codebase and document:
   - Tech stack and framework
   - Key file structure
   - How to run, build, and test
   - Important patterns and conventions

2. A section about Product Agent with this content:

   ## Product Agent (Product Context Tool)

   Product Agent (`Product-Agent-app/`) is a local product management tool that runs alongside this codebase. It implements a Discovery Tree (Teresa Torres's Opportunity Solution Tree) where product thinking is organized as:

   ```
   ProductLine → Business Outcome → Product Outcome → Opportunity → Solution → Assumption → Test
   ```

   ### How It Connects to This Codebase

   - Product Agent holds the **product context** (opportunities, solutions, personas) for this project
   - The data lives in `Product-Agent-app/data/store.json` (auto-generated, not committed)
   - When a Solution entity's Copy Anchor button is used, it generates a **planning prompt** that includes the Opportunity context, Solution details, persona, and codebase path
   - You can read the store.json to understand the product context behind any feature

   ### Product Skills

   Claude agent skills live in `ProductSkills/`. Key skill:

   - **story-map-updater** (`ProductSkills/story-map-updater/SKILL.md`) — Keeps a Jeff Patton-style User Story Map in sync as features are planned and shipped. Read this skill file for full instructions on when and how to update the story map.

   ### Story Map

   The user story map for this codebase lives at:
   - **Source of truth:** `<YOUR_CODEBASE>/story-map.json`
   - **Generated view:** `<YOUR_CODEBASE>/STORY_MAP.md`
   - **Regenerate:** Run the generate script after editing the JSON (see Step 2 below)

   ### Commands

   ```bash
   # Product Agent dev server
   cd Product-Agent-app && npm run dev

   # Your codebase
   cd <YOUR_CODEBASE>
   # ... your build/run/test commands here
   ```

3. Any existing CLAUDE.md content should be preserved — merge, don't overwrite.
```

Review the generated file and adjust as needed.

---

## Step 2: Bootstrap Your Story Map

> **No codebase yet?** If your `<YOUR_CODEBASE>/` folder is empty or doesn't exist yet, **skip this step entirely**. You can come back and bootstrap the story map later once you have code to map. Just complete Steps 1 and 3 for now.

The story map captures your application's user journeys. To generate the initial version, paste this prompt into Claude Code:

```
I want to create a Jeff Patton-style User Story Map for my codebase at `./<YOUR_CODEBASE>/`.

1. Read `ProductSkills/story-map-updater/SKILL.md` to understand the story map format and quality criteria.

2. Read through my codebase at `./<YOUR_CODEBASE>/` to understand:
   - What the app does and who it's for
   - The main user-facing features and workflows
   - The key UI components and pages

3. Create these files in `<YOUR_CODEBASE>/`:

   a. `story-map-schema.ts` — Copy the types from `Product-Agent-app/app/lib/story-map-schema.ts`

   b. `story-map.json` — The story map data following the schema. Structure it as:
      - **Activities** = top-level user workflows (e.g., "Sign Up", "Create a Project", "Manage Settings")
      - **Steps** = sequential phases within each activity
      - **Stories** = individual user actions within each step
      - Follow the INVEST criteria from the skill file
      - Use actual component/page names from the codebase in the `components` arrays

   c. `STORY_MAP.md` — Generate a readable markdown version of the story map

4. Also create a script at `<YOUR_CODEBASE>/scripts/generate-story-map.ts` based on `Product-Agent-app/scripts/generate-story-map.ts` to regenerate the markdown from JSON. Adapt the paths to point to `<YOUR_CODEBASE>/story-map.json` and `<YOUR_CODEBASE>/STORY_MAP.md`.

5. Add a `generate:story-map` npm script to `<YOUR_CODEBASE>/package.json` if one doesn't exist.

Start by reading the codebase and the skill file, then draft the story map. Ask me questions if you need clarity about user workflows or personas.
```

---

## Step 3: Set Your Code Path in Product Agent

Once Product Agent is running (`npm run dev`):

1. Open the app in your browser (usually `http://localhost:3000`)
2. Click the **Product Line Selector** in the sidebar
3. Click the **pencil icon** to edit your product line
4. Set the **code path** field to `<YOUR_CODEBASE>/`
5. Save

This ensures the Solution Copy Anchor generates prompts that point Claude Code to the right folder.

---

## Using the Planning Prompt Workflow

Once setup is complete, the daily workflow is:

1. **Refine your product thinking** in Product Agent — define Opportunities, draft Solutions
2. **Generate a planning prompt** — navigate to a Solution entity and click the **Copy Anchor** button
3. **Paste into Claude Code** — it will receive the full context (Opportunity, Solution, persona, codebase path) and can plan the implementation
4. **Story map stays in sync** — the prompt instructs Claude Code to use the story-map-updater skill, so your story map evolves with each feature

---

## Troubleshooting

| Issue | Fix |
|:------|:----|
| Product Agent shows no data | Run `npm run dev` in `Product-Agent-app/` and refresh the browser |
| Story map generator fails | Make sure `tsx` is available (`npx tsx`) and the script paths are correct |
| Claude Code doesn't know about Product Agent | Verify your `CLAUDE.md` includes the Product Agent section from Step 1 |
| Copy Anchor gives simple text instead of rich prompt | Only **Solution** level entities generate the full planning prompt — other levels copy a simple context anchor |
