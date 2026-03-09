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

| 1. Set Up a Product Line | 2. Define Personas | 3. Define a Business Outcome | 4. Define a Product Outcome | 5. Map Opportunities | 6. Design Solutions | 7. Validate Assumptions | 8. Organize & Prioritize | 9. Navigate & Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

---

## Activities


### Activity 1: Set Up a Product Line
> Create the top-level container that holds all discovery work for one product.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Create product line** | Open the Product Line Selector dropdown | `Product Line Selector` |
|  | Click "New Product Line" | `Product Line Selector` |
|  | Enter name and confirm | `Product Line Selector` |
| **Edit product line details** | Click product line title to edit inline | `Overview Title` |
|  | Click product line description to edit inline | `Overview Description` |
| **Delete product line** | Open Product Line Selector and click delete | `Product Line Selector` |


### Activity 2: Define Personas
> Create and manage user/buyer personas for the current product line.

| Step | Story | Components |
|:-----|:------|:-----------|
| **View existing personas** | Expand the Persona Manager to see all personas for this product line | `PersonaManager` |
|  | Hover a persona name to see its description in a tooltip | `PersonaManager` · `Tooltip` |
| **Add a persona** | Create a new persona with name and description via the slide-over form | `PersonaManager` · `PersonaSlideOver` |
| **Edit a persona** | Open an existing persona in the slide-over to update its details | `PersonaManager` · `PersonaSlideOver` |
| **Delete a persona** | Remove a persona with a confirmation prompt | `PersonaManager` |


### Activity 3: Define a Business Outcome
> Create the top-level strategic goal for the product line.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open Overview** | Click "Overview" in the sidebar | `Overview Button` · `SectionNav` |
| **Add Business Outcome** | Click the dashed "Add Business Outcome" button | `Add Root Form` |
|  | Enter title and description, then confirm | `Add Root Form` |
| **Refine the entity** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |
| **Add Product Outcome children** | Click "Add Product Outcome" in the children section | `Add Child Button` |


> **Pattern note:** Activities 3–7 each include a "Refine the entity" step with the same core stories (edit title, edit description, manage blocks, change status, copy anchor). This reflects the consistent editing experience across all entity levels.


### Activity 4: Define a Product Outcome
> Break a business outcome into measurable product-level results.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open parent Business Outcome** | Click the Business Outcome in the Entity Tree or Breadcrumb | `Entity Tree` · `Breadcrumb` |
| **Add Product Outcome** | Click "Add Product Outcome" in the children section | `Add Child Button` |
|  | Enter title and description, then confirm | `Add Child Button` |
| **Refine the entity** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |
| **Assign Personas** | Assign a primary persona via the Persona Picker pill | `EntityView` · `PersonaPicker` |
|  | Add secondary personas via the multi-select picker | `EntityView` · `SecondaryPersonaPicker` |
|  | Remove a secondary persona by unchecking in the picker | `EntityView` · `SecondaryPersonaPicker` |
| **Add Opportunity children** | Click "Add Opportunity" in the children section | `Add Child Button` |


### Activity 5: Map Opportunities
> Identify user needs and pain points that a product outcome could address.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open parent Product Outcome** | Click the Product Outcome in the Entity Tree or Breadcrumb | `Entity Tree` · `Breadcrumb` |
| **Add Opportunity** | Click "Add Opportunity" in the children section | `Add Child Button` |
|  | Enter title and description, then confirm | `Add Child Button` |
| **Assign a Persona** | Click the Persona Picker pill on the entity tab | `Entity Tab` · `Persona Picker` |
|  | Select a persona from the dropdown | `Persona Picker` |
| **Score opportunity with ICE** | Open the ICE Score panel on an opportunity entity | `EntityView` · `IceScorePanel` |
|  | Adjust the Impact slider (1–10) | `IceScorePanel` |
|  | Adjust the Confidence slider (1–10) | `IceScorePanel` |
|  | Adjust the Ease slider (1–10) | `IceScorePanel` |
|  | View the computed ICE score (Impact × Confidence × Ease) | `IceScorePanel` |
| **Refine the entity** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |
| **Add Solution children** | Click "Add Solution" in the children section | `Add Child Button` |


### Activity 6: Design Solutions
> Propose concrete solutions that address an identified opportunity.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open parent Opportunity** | Click the Opportunity in the Entity Tree or Breadcrumb | `Entity Tree` · `Breadcrumb` |
| **Add Solution** | Click "Add Solution" in the children section | `Add Child Button` |
|  | Enter title and description, then confirm | `Add Child Button` |
| **Refine the entity** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |
| **Add Assumption children** | Click "Add Assumption" in the children section | `Add Child Button` |


### Activity 7: Validate Assumptions
> Surface and test the riskiest assumptions behind a solution.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open parent Solution** | Click the Solution in the Entity Tree or Breadcrumb | `Entity Tree` · `Breadcrumb` |
| **Add Assumption** | Click "Add Assumption" in the children section | `Add Child Button` |
|  | Enter title and description, then confirm — template creates Belief and Evidence accordion blocks | `Add Child Button` · `EntityView` |
| **Classify the Assumption** | Click "Set type" pill in assumption header to open type picker | `EntityView` · `AssumptionTypePicker` |
|  | Select one of 5 types: Desirability, Usability, Feasibility, Viability, Ethical | `AssumptionTypePicker` |
|  | View colored type pill with tooltip on hover | `EntityView` · `AssumptionTypePicker` |
|  | Change or clear the type by reopening the picker | `AssumptionTypePicker` |
|  | See assumption type pill on child cards in parent's children grid | `ChildEntityCard` |
| **Refine the Assumption** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |
| **Add Test children** | Click "Add Test" in the children section — template creates Define Test and Pass/Fail Criteria accordion blocks | `Add Child Button` · `EntityView` |
| **Classify the Test** | Click "Set type" pill in test header to open type picker | `EntityView` · `TestTypePicker` |
|  | Select one of 4 types: Prototype Test, One-Question Survey, Data Mining, Research Spike | `TestTypePicker` |
|  | View colored type pill with tooltip on hover | `EntityView` · `TestTypePicker` |
|  | Change or clear the type by reopening the picker | `TestTypePicker` |
|  | See test type pill on child cards in parent's children grid | `ChildEntityCard` |
| **Refine the Test** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
|  | Delete the entity (only when it has no children) | `Entity Tab` |
|  | Drop entity and all children via status change confirmation | `Entity Tab` · `Status Picker` |


### Activity 8: Organize & Prioritize
> Manage entity statuses and views to focus on what matters most.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Change status** | Open an entity and use the Status Picker | `Entity Tab` · `Status Picker` |
| **Switch to Kanban view** | Click the Kanban icon in the View Toggle | `View Toggle` |
| **Drag between columns** | Drag a Child Card from one Kanban Column to another | `Kanban View` · `Kanban Column` · `Child Card` · `Drag Overlay` |
| **Show/hide archived** | Click the Archived Toggle in the Done column | `Kanban View` · `Archived Toggle` |
| **Switch to Grid view** | Click the Grid icon in the View Toggle | `View Toggle` |
| **Stack-rank within column** | Drag a Child Card up or down within a Kanban Column to reorder by priority | `Kanban View` · `Kanban Column` · `Child Card` · `SortableContext` |
|  | Drag a root Business Outcome card within a column to reorder | `Root View` · `Kanban Column` · `Child Card` · `SortableContext` |
| **View priority-sorted grid** | Switch to Grid view to see cards grouped by status: commit → explore → draft → done → archived → dropped | `Grid View` · `Child Card` |
| **Compare ICE scores** | View ICE score badges on opportunity child cards to compare priorities | `ChildEntityCard` · `ICE Badge` |
|  | Open an opportunity to adjust its ICE score via sliders | `EntityView` · `IceScorePanel` |


### Activity 9: Navigate & Review
> Move through the discovery tree to review and connect ideas.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open Overview** | Click "Overview" in the sidebar | `Overview Button` · `SectionNav` |
| **Browse the entity tree** | Click any entity in the Entity Tree sidebar | `Entity Tree` · `SectionNav` |
| **Use breadcrumbs** | Click any segment in the Breadcrumb to jump up | `Breadcrumb` |
| **Switch product line** | Open the Product Line Selector and choose another line | `Product Line Selector` |
| **Toggle sidebar** | Click the Sidebar Toggle to collapse/expand | `Sidebar Toggle` |


---

## Maintenance

- **Source of truth:** `app/lib/story-map.json`
- **Types:** `app/lib/story-map-schema.ts`
- **Regenerate:** `npm run generate:story-map`
- **Component names** should match actual component/element names in the codebase
- When adding a new feature, add its stories to the relevant activity (or create a new activity)
- When a feature ships, update the JSON and regenerate this file
