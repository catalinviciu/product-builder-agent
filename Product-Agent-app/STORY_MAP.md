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
| **Open Persona Manager** | Expand the Persona Manager section in the sidebar | `Persona Manager` |
| **Add a persona** | Click "Add Persona" to open the slide-over form | `Persona Manager` · `PersonaSlideOver` |
|  | Enter name and description | `PersonaSlideOver` |
|  | Save the persona | `PersonaSlideOver` |
| **Edit a persona** | Click pencil icon on a Persona Item to open slide-over | `Persona Item` · `PersonaSlideOver` |
|  | Modify fields and save | `PersonaSlideOver` |
| **Delete a persona** | Click trash icon on a Persona Item | `Persona Item` |


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
| **Refine the entity** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
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
| **Add Assumption children** | Click "Add Assumption" in the children section | `Add Child Button` |


### Activity 7: Validate Assumptions
> Surface and test the riskiest assumptions behind a solution.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Open parent Solution** | Click the Solution in the Entity Tree or Breadcrumb | `Entity Tree` · `Breadcrumb` |
| **Add Assumption** | Click "Add Assumption" in the children section | `Add Child Button` |
|  | Enter title and description, then confirm | `Add Child Button` |
| **Refine the Assumption** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |
| **Add Test children** | Click "Add Test" in the children section | `Add Child Button` |
| **Refine the Test** | Edit title inline (click pencil on hover) | `EntityView` · `Inline Edit` |
|  | Add or edit description inline | `EntityView` · `Inline Edit` |
|  | Add a content block (accordion, pills, quote, metric) | `EntityView` · `Add Block Button` |
|  | Edit an existing block | `EntityView` · `Block Toolbar` |
|  | Delete a block | `EntityView` · `Block Toolbar` |
|  | Change status via the Status Picker | `Entity Tab` · `Status Picker` |
|  | Copy the context anchor for AI reference | `Entity Tab` · `Copy Anchor` |


### Activity 8: Organize & Prioritize
> Manage entity statuses and views to focus on what matters most.

| Step | Story | Components |
|:-----|:------|:-----------|
| **Change status** | Open an entity and use the Status Picker | `Entity Tab` · `Status Picker` |
| **Switch to Kanban view** | Click the Kanban icon in the View Toggle | `View Toggle` |
| **Drag between columns** | Drag a Child Card from one Kanban Column to another | `Kanban View` · `Kanban Column` · `Child Card` · `Drag Overlay` |
| **Show/hide archived** | Click the Archived Toggle in the Done column | `Kanban View` · `Archived Toggle` |
| **Switch to Grid view** | Click the Grid icon in the View Toggle | `View Toggle` |


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
