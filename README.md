# Product Builder Agent

A discovery tree dashboard for product builders, based on Teresa Torres's Opportunity Solution Tree framework. Built with Next.js 16, React 19, and Zustand.

Manage your product thinking — from business outcomes down to assumptions and tests — in a single interactive tree.

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

## Getting Started

### Step 1: Clone the repository

```bash
git clone https://github.com/catalinviciu/product-builder-agent.git
cd product-builder-agent
```

### Step 2: Navigate to the app folder

```bash
cd Solution3
```

### Step 3: Install dependencies

```bash
npm install
```

This will download all required packages (React, Next.js, Tailwind, etc.) into a `node_modules` folder. It may take a minute or two.

### Step 4: Start the development server

```bash
npm run dev
```

You should see output like:

```
▲ Next.js 16.1.6 (Turbopack)
- Local: http://localhost:3000
```

### Step 5: Open in your browser

Go to [http://localhost:3000](http://localhost:3000)

You'll see the discovery tree dashboard with sample data (FreshCart Grocery) pre-loaded.

## Available Commands

Run these from the `Solution3/` folder:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the dev server (auto-reloads on code changes) |
| `npm run build` | Create a production build (use to verify everything compiles) |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run the linter to check for code issues |

## How It Works

- **All data is stored locally** in `Solution3/data/store.json` (auto-generated on first use)
- The app runs entirely on your machine — no external database or cloud services needed
- Changes you make in the UI are automatically saved to the local JSON file

## AI Agent Workflow (Copy Context Anchor)

Each entity in the tree has a small copy button in its header. Clicking it copies a context anchor to your clipboard like:

```
[Product Agent Context]
Product Line: FreshCart Grocery
Path: Business Outcome > Product Outcome > Opportunity
Entity: "Cart abandonment from poor substitution suggestions" (opp-1)
Data: Solution3/data/store.json
```

Paste this into any code-aware AI agent (Claude Code, Cursor, Copilot, etc.) that has access to the project files. The agent can read `store.json`, locate the entity by ID, and help you think through your product decisions with full tree context.

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.
