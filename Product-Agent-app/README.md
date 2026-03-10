# Product Builder Agent

A discovery tree dashboard for product builders, based on Teresa Torres's Opportunity Solution Tree framework. Built with Next.js 16, React 19, and Zustand.

Manage your product thinking — from business outcomes down to assumptions and tests — in a single interactive tree. Then use the built-in AI workflow to generate planning prompts for Claude Code and other AI agents.

## Prerequisites

Before you start, make sure you have the following installed on your machine:

### 1. Node.js (v20 or later)

Download and install from [nodejs.org](https://nodejs.org/).

After installing, verify it works by opening a terminal and running:

```bash
node --version
# Should show v20.x.x or higher

npm --version
# Should show 10.x.x or higher (comes bundled with Node.js)
```

### 2. Git

Download and install from [git-scm.com](https://git-scm.com/).

Verify:

```bash
git --version
```

### 3. Claude Code (for AI workflow)

Install from [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code). This is optional but required for the planning prompt workflow.

## Getting Started

### Step 1: Clone the repository

```bash
git clone https://github.com/catalinviciu/product-builder-agent.git
cd product-builder-agent
```

### Step 2: Install and run

```bash
cd Product-Agent-app
npm install
npm run dev
```

You should see output like:

```
▲ Next.js 16.1.6 (Turbopack)
- Local: http://localhost:3000
```

### Step 3: Open in your browser

Go to [http://localhost:3000](http://localhost:3000)

You'll see the discovery tree dashboard with sample data (FreshCart Grocery) pre-loaded.

## Available Commands

Run these from the `Product-Agent-app/` folder:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the dev server (auto-reloads on code changes) |
| `npm run build` | Create a production build (use to verify everything compiles) |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run the linter to check for code issues |

## How It Works

- **All data is stored locally** in `Product-Agent-app/data/store.json` (auto-generated on first use)
- The app runs entirely on your machine — no external database or cloud services needed
- Changes you make in the UI are automatically saved to the local JSON file

## Using Product Agent with Your Codebase

Product Agent is designed to sit alongside your application code and help you plan features using AI agents like Claude Code. Here's the full workflow, step by step.

### 1. Set up your workspace folder

Place your codebase in the same parent folder as Product Agent:

```
your-workspace/
├── Product-Agent-app/      # This app
├── ProductSkills/          # Agent skills (story-map-updater, etc.)
├── your-app/                # Your application code
└── CLAUDE.md / .agent/      # Agent context (created during setup)
```

If you don't have a codebase yet, just create an empty folder — you can start building your product thinking first and add code later.

### 2. Teach your AI agent about your setup

Open your AI agent in the workspace root folder (the parent that contains both `Product-Agent-app/` and your codebase). Then follow the setup guide for your tool:

- **Claude Code** — follow **[SETUP.md](./SETUP.md)**
- **Google Antigravity** — follow **[SETUP-ANTIGRAVITY.md](./SETUP-ANTIGRAVITY.md)**

These guides will help you:

- Create a project context file that teaches your AI agent about both Product Agent and your codebase
- Set up the story-map-updater skill
- Bootstrap a User Story Map for your project (skip this if your codebase is empty)
- Set the code path in Product Agent's UI

### 3. Define your product thinking

In the Product Agent UI:

1. **Create a Product Line** — this is the top-level container for your product
2. **Set the code path** — edit the product line and fill in your codebase folder name (e.g. `your-app/`)
3. **Build your discovery tree** — work top-down:
   - **Business Outcome** — the measurable business result you're driving
   - **Product Outcome** — the user behavior change that creates business value
   - **Opportunity** — unmet needs or pain points (assign a Persona here)
   - **Solution** — concrete ways to address the opportunity

### 4. Generate a planning prompt

When you're ready to implement a Solution:

1. Navigate to the **Solution** entity in Product Agent
2. Click the **Copy** button in the entity header (tooltip: "Copy planning prompt for Claude Code")
3. This copies a rich prompt that includes:
   - The parent Opportunity (why you're building this)
   - The Solution details (what you're building)
   - The assigned Persona
   - Your codebase path
   - Instructions to use the story-map-updater skill

### 5. Paste into Claude Code

Open Claude Code and paste the prompt. Claude Code will:

- Understand the full product context behind the feature
- Plan the implementation using your codebase's patterns and conventions
- Include story map updates as part of the plan
- Ask clarifying questions if anything is unclear

### 6. Iterate

As you ship features and learn, come back to Product Agent to:

- Update Solution status (draft → explore → commit → done)
- Add Assumptions and Tests to validate your decisions
- Refine Opportunities based on what you've learned
- Start the next Solution's planning prompt

## AI Agent Workflow (Context Anchors)

Every entity in the tree has a copy button in its header. What it copies depends on the entity level:

**Solution entities** copy a full **planning prompt** — a rich, structured prompt with Opportunity context, Solution details, persona, codebase path, and instructions for Claude Code.

**All other entities** copy a simple **context anchor** like:

```
[Product Agent Context]
Product Line: FreshCart Grocery
Path: Business Outcome > Product Outcome > Opportunity
Entity: "Cart abandonment from poor substitution suggestions" (opp-1)
Data: Product-Agent-app/data/store.json
```

Both can be pasted into any code-aware AI agent (Claude Code, Cursor, Copilot, etc.) that has access to the project files.

## Product Skills

The `ProductSkills/` folder contains Claude agent skills — behavioral instructions that extend what Claude Code can do:

| Skill | What it does |
|-------|-------------|
| **story-map-updater** | Keeps a Jeff Patton-style User Story Map in sync as features are planned and shipped |

These skills are referenced automatically in the planning prompts generated by the Solution Copy Anchor.

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.
