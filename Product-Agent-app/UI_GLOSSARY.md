# UI Glossary — Product Agent

> **Maintenance rule:** When adding, renaming, or removing a UI feature, update this glossary so it stays in sync with what the user actually sees.

Quick-reference for every visible element in the app. Organized by screen area — left to right, top to bottom, outer to inner.

---

## 1. App Shell

The two-panel layout you always see: sidebar on the left, main content on the right.

- **Sidebar** — Collapsible left panel containing navigation
- **Sidebar Toggle** — Chevron (desktop) / hamburger (mobile) to open/close the sidebar
- **Main Panel** — The right area where all content appears
- **Theme** — Auto light/dark mode based on OS preference + time-of-day override
- **Design Tokens** — The color system (surfaces, borders, accents) used everywhere

---

## 2. Inside the Sidebar

Top to bottom within the left panel.

- **Product Line Selector** — Dropdown at top to switch, create, edit, or delete product lines
- **Overview Button** — Navigation item to go to the root/overview page
- **Entity Tree** — Hierarchical tree of all entities, click any to navigate
- **Reset Button** — At the very bottom, reloads sample data (destructive)

---

## 3. Overview Page

What you see in the main panel when you click "Overview" or first load a product line.

- **Overview Title** — Editable product line title at top
- **Overview Description** — Editable product line description below the title
- **Section Header** — "Business Outcomes" label with italic description
- **View Toggle** — Grid/Kanban icon buttons (top-right of section header)
- **Grid View** — Business outcomes as a responsive card grid
- **Kanban View** — Business outcomes in Draft/Explore/Commit/Done columns with drag-and-drop
  - **Kanban Column** — Single status column with colored top border + item count
  - **Archived Toggle** — "Show/Hide archived/dropped" in the Done column
  - **Drag Overlay** — Ghost card following cursor while dragging
- **Child Card** — Individual card (icon, title, preview, status badge, count badge)
- **Add Root Form** — Dashed "Add Business Outcome" button → expands to title + description form

---

## 4. Entity Page

What you see after clicking into any entity. Three zones stacked vertically.

### 4a. Breadcrumb

- **Breadcrumb** — Sticky path showing Overview > Parent > … > Current. Click any segment to jump.

### 4b. Entity Detail

The file-shaped collapsible section for the selected entity, styled like a file folder with a colored tab.

- **Entity Tab** — Colored tab above the body showing:
  - Level label (e.g. "Business Outcome", "Opportunity")
  - **Status Picker** — Dropdown to change status (Draft/Explore/Commit/Done/Archived/Dropped)
  - **Copy Anchor** — Button that copies a shareable AI-reference string
- **Collapsible Body** — Click to expand/collapse. Chevron rotates to show state.
  - *When collapsed:* Shows icon + title, level description, first 3 lines of description, block count hint
  - *When expanded:* Shows everything below
- **Inline Edit** — Click-to-edit behavior on title and description (pencil icon on hover)
- **Block List** — The editable description + all content blocks, visible when expanded:
  - **Accordion Block** — Collapsible section with markdown content
  - **Pills Block** — Key-value tag pairs displayed as colored pills
  - **Quote Block** — Styled quote with optional attribution
  - **Metric Block** — Current → Target card with optional timeframe
  - **Block Toolbar** — Edit/Delete buttons that appear on hover over any block
  - **Add Block Button** — Dashed button at bottom to insert new block type

### 4c. Children Section

Below the entity detail — shows next-level entities belonging to this entity.

- **Section Header** — Label like "Product Outcomes" / "Opportunities" with italic description
- **View Toggle** — Grid/Kanban icon buttons (top-right of section header)
- **Grid View** — Children as responsive card grid (1–4 columns)
- **Kanban View** — Children in Draft/Explore/Commit/Done columns with drag-and-drop
  - **Kanban Column** — Single status column with colored top border + item count
  - **Archived Toggle** — "Show/Hide archived/dropped" in the Done column
  - **Drag Overlay** — Ghost card following cursor while dragging
- **Child Card** — Individual card (icon, title, preview, status badge, count badge)
- **Add Child Button** — Dashed button → expands to **Add Child Form** (title + description fields)
