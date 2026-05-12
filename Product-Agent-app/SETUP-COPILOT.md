# Product Agent — Setup Guide for VS Code / GitHub Copilot

> **Using Claude Code instead?** See [SETUP.md](./SETUP.md).

This guide helps you set up GitHub Copilot in VS Code to work with Product Agent alongside your own codebase. By the end, Copilot will understand your product context and have a story map bootstrapped for your project.

## Prerequisites

- VS Code 1.99 or later
- [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) installed and signed in
- [Node.js v20+](https://nodejs.org/) installed
- Git installed
- Product Agent cloned and running (see [README.md](./README.md))

## Folder Structure

Your workspace should look like this:

```
your-workspace/
├── Product-Agent-app/      # This app (product context & discovery tree)
├── ProductSkills/          # Agent skills (story-map-updater, etc.)
├── mcp-server/             # MCP server (bridge between Copilot and the app)
├── <YOUR_CODEBASE>/         # Your application code — replace with your folder name
└── .github/
    └── copilot-instructions.md   # Will be created during setup
```

> **Fill in your codebase folder name:** Replace `<YOUR_CODEBASE>` with your actual folder name throughout this guide (e.g. `my-saas-app`, `frontend`, etc.)

---

## Step 1: Build the MCP server

The MCP server is the local bridge between GitHub Copilot and Product Agent. Build it once:

```bash
cd mcp-server
npm ci
npm run build
```

> **Note:** You only need to do this once. Rebuild after any changes to `mcp-server/src/`.

---

## Step 2: Verify the VS Code MCP config

The file `.vscode/mcp.json` is already in the repository. Open it and verify it looks like this:

```json
{
  "servers": {
    "product-agent": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/dist/mcp-server/src/server.js"],
      "env": {
        "PA_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

VS Code 1.99+ auto-discovers this file and registers the MCP server for Copilot.

---

## Step 3: Start the app

```bash
cd Product-Agent-app
npm run dev
```

The MCP server talks to the app over HTTP, so the app must be running whenever you use Copilot's product-aware features.

---

## Step 4: Enable MCP in Copilot

1. Open Copilot Chat in VS Code (`Ctrl+Alt+I` / `Cmd+Option+I`)
2. Switch to **Agent mode** using the mode selector at the top of the chat panel
3. Click the tools icon and verify `product-agent` appears in the tools list

If `product-agent` doesn't appear, restart VS Code after completing Steps 1–3.

---

## Step 5: Create your Copilot instructions file

Copilot reads workspace context from `.github/copilot-instructions.md`. Open Copilot Chat in Agent mode in the workspace root (the parent folder containing both `Product-Agent-app/` and your codebase), then paste this prompt:

```
Create the file `.github/copilot-instructions.md` at the workspace root. It should include:

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
   - AI skills use MCP tools (`pa_get_entity`, `pa_get_context`, etc.) to read and write product context — the MCP server (`mcp-server/`) is started automatically by VS Code when you open Copilot Chat in Agent mode
   - When a Solution entity's Copy Anchor button is used, it generates a **planning prompt** that includes an MCP tool call to fetch the full Opportunity and Solution context, plus the codebase path

   ### Agent Skills

   Agent skills live in `ProductSkills/`. Key skill:

   - **story-map-updater** (`ProductSkills/story-map-updater/SKILL.md`) — Keeps a Jeff Patton-style User Story Map in sync as features are planned and shipped. Read this skill file for full instructions on when and how to update the story map.

   ### Story Map

   The user story map for this codebase lives at:
   - **Source of truth:** `<YOUR_CODEBASE>/story-map.json`
   - **Generated view:** `<YOUR_CODEBASE>/STORY_MAP.md`
   - **Regenerate:** Run the generate script after editing the JSON (see Step 6 below)

   ### Commands

   ```bash
   # Product Agent dev server
   cd Product-Agent-app && npm run dev

   # Your codebase
   cd <YOUR_CODEBASE>
   # ... your build/run/test commands here
   ```

3. Any existing `.github/copilot-instructions.md` content should be preserved — merge, don't overwrite.
```

Review the generated file and adjust as needed.

---

## Step 6: Bootstrap Your Story Map

> **No codebase yet?** If your `<YOUR_CODEBASE>/` folder is empty or doesn't exist yet, **skip this step entirely**. Come back once you have code to map. Complete Steps 5 and 7 for now.

The story map captures your application's user journeys. To generate the initial version, paste this prompt into Copilot Chat (Agent mode):

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

## Step 7: Set Your Code Path in Product Agent

Once Product Agent is running (`npm run dev`):

1. Open the app in your browser (usually `http://localhost:3000`)
2. Click the **Product Line Selector** in the sidebar
3. Click the **pencil icon** to edit your product line
4. Set the **code path** field to `<YOUR_CODEBASE>/`
5. Save

This ensures the Solution Copy Anchor generates prompts that point Copilot to the right folder.

---

## Using the Planning Prompt Workflow

Once setup is complete, the daily workflow is:

1. **Refine your product thinking** in Product Agent — define Opportunities, draft Solutions
2. **Generate a planning prompt** — navigate to a Solution entity and click the **Copy Anchor** button. The copied prompt includes an MCP tool call (`pa_get_entity`) that Copilot will use to fetch the full context automatically
3. **Paste into Copilot Chat (Agent mode)** — it will call the MCP server to retrieve the Opportunity, Solution, persona, and codebase path, then plan the implementation
4. **Story map stays in sync** — the prompt instructs Copilot to use the story-map-updater skill, so your story map evolves with each feature

---

## Troubleshooting

| Issue | Fix |
|:------|:----|
| Product Agent shows no data | Run `npm run dev` in `Product-Agent-app/` and refresh the browser |
| `product-agent` not in Copilot tools list | Make sure the MCP server is built (`cd mcp-server && npm run build`), then restart VS Code |
| MCP tools fail at runtime | The app must be running — start it with `npm run dev` in `Product-Agent-app/` |
| Story map generator fails | Make sure `tsx` is available (`npx tsx`) and the script paths are correct |
| Copilot doesn't know about Product Agent | Verify `.github/copilot-instructions.md` exists and contains the Product Agent section from Step 5 |
| Copy Anchor gives simple text instead of rich prompt | Only **Solution** level entities generate the full planning prompt — other levels copy a simple context anchor |
| MCP only works in Agent mode | GitHub Copilot MCP integration requires Agent mode — switch from Ask or Edit mode |
