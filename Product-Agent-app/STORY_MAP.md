# User Story Map — Product Agent

> **Format:** Jeff Patton's User Story Mapping. Activities form the backbone (left → right),
> steps break each activity into sequential actions, and stories are the atomic user interactions.
>
> **Persona:** Product Builder — A product manager or product-minded builder who needs to extract, articulate, and maintain product context using the Discovery Tree framework.
>
> **Source of truth:** `app/lib/story-map.json`. This file is generated — do not edit directly.
> Run `npm run generate:story-map` to regenerate after editing the JSON.

---

## Backbone (Activity Overview)

| 1. Set Up a Product Line | 2. Define Personas | 3. Define a Business Outcome | 4. Define a Product Outcome | 5. Map Opportunities | 6. Design Solutions | 7. Validate Assumptions | 8. Organize & Prioritize | 9. Navigate & Review | 10. Manage Preferences | 11. Export Context for AI Agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

---

## Activities


### Activity 1: Set Up a Product Line
> Create the top-level container that holds all discovery work for one product.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Create product line** | Create a new product line with a name via the Product Line Selector | `Product Line Selector` |
| **Edit product line details** | Edit the product line title inline on the Overview page | `RootView` · `EditableText` |
|  | Edit the product line description with markdown formatting and preview | `RootView` · `EditableText` · `MarkdownToolbar` |
|  | Set the local code path for a product line so AI prompts can reference the codebase location | `EditProductLineForm` · `SectionNav` |
| **Change product line status** | Change product line status (active, closed, archived) via the status indicator | `Product Line Selector` |
| **Delete product line** | Delete a product line from the Product Line Selector | `Product Line Selector` |


### Activity 2: Define Personas
> Create and manage user/buyer personas for the current product line.

| Step | Story | Components |
|:-----|:------|:-----------|
| **View existing personas** | Expand the Persona Manager to see all personas for this product line | `PersonaManager` |
|  | Hover a persona name to see its markdown-rendered description in a tooltip | `PersonaManager` · `Tooltip` · `MarkdownBlock` |
| **Add a persona** | Create a new persona with name and markdown description via the slide-over form | `PersonaManager` · `PersonaSlideOver` · `MarkdownToolbar` |
| **Edit a persona** | Open an existing persona in the slide-over to update its details | `PersonaManager` · `PersonaSlideOver` · `MarkdownToolbar` |
| **Delete a persona** | Remove a persona with a confirmation prompt | `PersonaManager` |


### Activity 3: Define a Business Outcome
> Create the top-level strategic goal for the product line.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open Overview** | Navigate to the Overview page from the sidebar | `SectionNav` |
| **Add Business Outcome** | Create a new Business Outcome with title and description | `RootView` · `Add Root Form` |
| **Refine the entity** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Configure structured metric tracking with frequency, numeric targets, and date range | `EntityBlocks` · `MetricBlockEditor` |
|  | Record a metric data point for the current or a past period and track outcome progress over time | `MetricCard` · `RecordValueForm` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |
| **Add Product Outcome children** | Add a child Product Outcome from the children section | `EntityView` · `Add Child Button` |


> **Pattern note:** Activities 3–7 each include a "Refine the entity" step with the same core stories (edit title, edit description, manage blocks, change status, copy anchor). This reflects the consistent editing experience across all entity levels.


### Activity 4: Define a Product Outcome
> Break a business outcome into measurable product-level results.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Navigate to parent** | Open the parent Business Outcome via the Entity Tree or Breadcrumb | `SectionNav` · `EntityBreadcrumb` |
| **Add Product Outcome** | Create a new Product Outcome with title and description | `EntityView` · `Add Child Button` |
| **Refine the entity** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Configure structured metric tracking with frequency, numeric targets, and date range | `EntityBlocks` · `MetricBlockEditor` |
|  | Record a metric data point for the current or a past period and track outcome progress over time | `MetricCard` · `RecordValueForm` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |
| **Assign Personas** | Assign a primary persona via the Persona Picker | `EntityView` · `PersonaPicker` |
|  | Add or remove secondary personas via the multi-select picker | `EntityView` · `SecondaryPersonaPicker` |
| **Add Opportunity children** | Add a child Opportunity from the children section | `EntityView` · `Add Child Button` |


### Activity 5: Map Opportunities
> Identify user needs and pain points that a product outcome could address.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Navigate to parent** | Open the parent Product Outcome via the Entity Tree or Breadcrumb | `SectionNav` · `EntityBreadcrumb` |
| **Add Opportunity** | Create a new Opportunity with title and description | `EntityView` · `Add Child Button` |
| **Assign a Persona** | Assign a primary persona to the opportunity (primary only — secondary personas are available only on Product Outcomes) | `EntityView` · `PersonaPicker` |
| **Score opportunity with ICE** | Rate the opportunity using Impact, Confidence, and Ease sliders (1–10 each) to compute an ICE score | `EntityView` · `IceScorePanel` |
| **Refine the entity** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |
|  | Copy an opportunity writing prompt to capture or refine the opportunity via the AI skill | `EntityView` · `AIActionsMenu` |
| **Add Solution children** | Add a child Solution from the children section | `EntityView` · `Add Child Button` |


### Activity 6: Design Solutions
> Propose concrete solutions that address an identified opportunity.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Navigate to parent** | Open the parent Opportunity via the Entity Tree or Breadcrumb | `SectionNav` · `EntityBreadcrumb` |
| **Add Solution** | Create a new Solution with title and description | `EntityView` · `Add Child Button` |
| **Refine the entity** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |
| **Add Assumption children** | Add a child Assumption from the children section | `EntityView` · `Add Child Button` |


### Activity 7: Validate Assumptions
> Surface and test the riskiest assumptions behind a solution.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Navigate to parent** | Open the parent Solution via the Entity Tree or Breadcrumb | `SectionNav` · `EntityBreadcrumb` |
| **Add Assumption** | Create a new Assumption with title and description (auto-generates Impact if True and Evidence blocks) | `EntityView` · `Add Child Button` |
| **Classify the Assumption** | Assign an assumption type (Desirability, Usability, Feasibility, Viability, or Ethical) via the type picker | `EntityView` · `AssumptionTypePicker` |
|  | View the colored type pill on the entity and on child cards in the parent grid | `EntityView` · `ChildEntityCard` |
| **Refine the Assumption** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |
| **Add Test children** | Create a new Test under the assumption (auto-generates Define Test and Pass/Fail Criteria blocks) | `EntityView` · `Add Child Button` |
| **Classify the Test** | Assign a test type (Prototype Test, One-Question Survey, Data Mining, or Research Spike) via the type picker | `EntityView` · `TestTypePicker` |
|  | View the colored type pill on the entity and on child cards in the parent grid | `EntityView` · `ChildEntityCard` |
| **Refine the Test** | Edit the entity title inline | `EntityView` · `EditableText` |
|  | Edit the entity description with markdown formatting and preview | `EntityView` · `EditableText` · `MarkdownToolbar` |
|  | Add a content block (accordion, pills, quote, or metric) | `EntityView` · `Add Block Button` |
|  | Edit or delete an existing content block | `EntityView` · `Block Toolbar` · `MarkdownToolbar` |
|  | Change entity status via the Status Picker | `EntityView` · `Status Picker` |
|  | Copy the context anchor for AI reference | `AIActionsMenu` · `EntityView` |
|  | Delete the entity (only when it has no children) | `EntityView` |
|  | Mark entity as dropped, cascading the status to all children | `EntityView` · `Status Picker` |


### Activity 8: Organize & Prioritize
> Manage entity statuses and views to focus on what matters most.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Change entity status** | Change an entity's status (draft, explore, commit, done, archived, dropped) via the Status Picker | `EntityView` · `Status Picker` |
| **Switch view modes** | Switch between Grid and Kanban views using the view mode toggle | `EntityView` · `View Toggle` |
| **Move entities between statuses in Kanban** | Drag a child card from one Kanban column to another to change its status | `Kanban View` · `ChildEntityCard` · `Drag Overlay` |
| **Stack-rank entities by priority** | Drag cards up or down within a Kanban column to reorder by priority | `Kanban View` · `ChildEntityCard` · `SortableContext` |
|  | Reorder root Business Outcome cards within a column on the Overview page | `RootView` · `ChildEntityCard` · `SortableContext` |
| **Show/hide archived and dropped** | Toggle visibility of archived and dropped items in the Done column | `Kanban View` · `Archived Toggle` |
| **View priority-sorted grid** | View cards in Grid mode grouped by status priority: commit, explore, draft, done, archived, dropped | `Grid View` · `ChildEntityCard` |
| **Compare ICE scores** | Compare ICE score badges on opportunity cards to prioritize across the grid | `ChildEntityCard` · `ICE Badge` |


### Activity 9: Navigate & Review
> Move through the discovery tree to review and connect ideas.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open Overview** | Navigate to the Overview page to see all Business Outcomes | `SectionNav` |
| **Browse the entity tree** | Navigate to any entity by clicking it in the sidebar tree | `SectionNav` |
| **Use breadcrumbs** | Jump to any ancestor entity using the breadcrumb trail | `EntityBreadcrumb` |
| **Switch product line** | Switch to a different product line via the Product Line Selector | `Product Line Selector` |
| **Toggle sidebar** | Collapse or expand the sidebar to control workspace layout | `DashboardLayout` · `Sidebar Toggle` |


### Activity 10: Manage Preferences
> Customize how the workspace looks and behaves.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Set display theme** | Open the account menu to access display preferences | `AccountMenu` |
|  | Choose between automatic (time-based) or manual light/dark theme | `AccountMenu` · `ThemePreferenceContext` |


### Activity 11: Export Context for AI Agent
> Generate context-rich prompts from the discovery tree to drive AI-assisted planning and coding.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Copy entity anchor** | Copy a context anchor for any entity to reference it in an AI agent | `AIActionsMenu` · `EntityView` |
| **Generate solution planning prompt** | Copy a full planning prompt from a Solution entity that includes Opportunity context, Solution details, persona, codebase path, and skill instructions | `AIActionsMenu` · `EntityView` · `buildSolutionPlanningPrompt` |
| **Generate opportunity writing prompt** | Copy an AI writing prompt from a Product Outcome to launch the opportunity writer skill for a new opportunity | `AIActionsMenu` · `EntityView` · `buildOpportunityWriterPrompt` |
|  | Copy an AI writing prompt from an existing Opportunity to launch the opportunity writer skill for editing | `AIActionsMenu` · `EntityView` · `buildOpportunityWriterPrompt` |
| **Brainstorm solutions for an opportunity** | Copy an AI prompt from an Opportunity to launch the solutions brainstormer skill and generate 5 distinct solution approaches | `AIActionsMenu` · `EntityView` · `buildSolutionsBrainstormerPrompt` |


---

## Maintenance

- **Source of truth:** `app/lib/story-map.json`
- **Types:** `app/lib/story-map-schema.ts`
- **Regenerate:** `npm run generate:story-map`
- **Component names** should match actual component/element names in the codebase
- When adding a new feature, add its stories to the relevant activity (or create a new activity)
- When a feature ships, update the JSON and regenerate this file
