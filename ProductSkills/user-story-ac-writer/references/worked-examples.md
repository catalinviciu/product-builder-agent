# Worked Examples

Three real stories with their AC, from the "Scope alert policies by attributes" solution (Reveal - Visibility). Read this when the shape of a scenario, a system-task AC, or a scenario outline is unclear.

The persona is Vanessa (Safety Manager). Each example shows the story card first, then its AC in the output format.

> **The analytics callouts here read `**Pendo:**` because this solution runs on Pendo.** The callout label is always the platform named in the prompt's `## Analytics Platform` block - `**<Platform>:**`. The shape (a bold callout on the scenario where the event fires) is identical across platforms.

---

## Example 1: a UI story with feature toggle, empty and error states, and analytics events

This is a walking-skeleton story. Note the four paths: the picker works (happy), search and selection behave (alternate), empty and error states hold (edge), the toggle-off and non-video cases produce nothing (negative). Two analytics events sit on the scenarios where they fire.

**Story 1: Add or change attributes on an alert policy**

As Vanessa (Safety Manager),
I search for and select attribute values in an alert policy's monitoring filter
so that I can define which slice of my fleet a policy applies to.

### Acceptance Criteria

**Out of scope:** persisting the selection (story-3); loading a saved selection (story-2); non-video alert types (story-5); trigger-time evaluation (story-4)

**Prerequisites**

- **Given** Vanessa is in the alert policy setup

#### Scenario 1: Attribute filter is available on a video policy when the feature is enabled

- **Given** the attributes feature toggle is enabled
- **And** Vanessa is configuring a video alert policy
- **When** the monitoring filters are displayed
- **Then** the "Add attributes" option is available alongside vehicles, drivers, and groups

#### Scenario 2: Opening the picker lists available attributes at a single level

- **Given** the account has attributes assigned to vehicles, assets, and drivers
- **When** Vanessa opens the attributes picker
- **Then** the attribute names are listed at a single level
- **And** each attribute name can be expanded to reveal its values
- **Pendo:** `AlertAttributeFilterOpened` - trackid on the Add attribute button

#### Scenario 3: Selecting a value updates its parent attribute name state

- **Given** the picker is open with an expanded attribute name
- **When** Vanessa selects a value under that attribute name
- **Then** the parent attribute name reflects the selection state of its values

#### Scenario 4: Searching shows matching names and values without changing the tree

- **Given** the picker is open
- **When** Vanessa searches for a term
- **Then** the attribute names and values matching the term are shown
- **And** the tree structure is unchanged

#### Scenario 5: Search with no matches shows all attributes

- **Given** the picker is open
- **When** Vanessa searches for a term that matches no name or value
- **Then** all attributes are shown

#### Scenario 6: Account with no attributes shows the empty state

- **Given** the account has no attributes defined
- **When** Vanessa opens the picker
- **Then** an empty state indicating no attributes are available is shown

#### Scenario 7: Attribute retrieval failure shows an error state

- **Given** the attribute service is unavailable
- **When** Vanessa opens the picker
- **Then** an error state indicating the attributes could not be loaded is shown

#### Scenario 8: Saving the selection stages it into the policy setup

- **Given** the picker is open with values selected
- **When** Vanessa saves the selection
- **Then** the picker closes
- **And** the selected count is shown on the attributes filter
- **Pendo:** `AlertAttributeSelectionApplied` - trackid on the Save selection button; property `value` = number of attribute values selected

#### Scenario 9: Canceling the picker discards unsaved changes

- **Given** the picker is open with unsaved changes to the selection
- **When** Vanessa cancels the picker
- **Then** the previously staged selection is unchanged

#### Scenario 10: Attribute filter is hidden when the feature toggle is off

- **Given** the attributes feature toggle is disabled
- **And** Vanessa is configuring a video alert policy
- **When** the monitoring filters are displayed
- **Then** the "Add attributes" option is not shown

---

## Example 2: a system story, where the outcome is a triggered alert

A system task. The persona is still the downstream user who benefits (Vanessa), never "the system". The Then asserts what Vanessa observes - an alert in the log, a notification received - not the evaluator internals. The negative scenario carries the whole point of the story: no match, no alert.

**Story 4: Trigger a video alert only on attribute match**

As Vanessa (Safety Manager),
I have a video alert fire only when the event matches my attribute scope
so that I stop receiving video alerts from outside my region.

### Acceptance Criteria

**Out of scope:** triggering on driver attributes (driver UUID not ready - vehicle and asset only at launch); the non-video pipeline (story-8)

**Prerequisites**

- **Given** a video alert policy exists

#### Scenario 1: A video event for a matching vehicle or asset triggers the alert

- **Given** the policy is scoped by an attribute value
- **And** the attributes feature is enabled
- **When** a video event occurs for a vehicle or asset that has that attribute value
- **Then** the alert is recorded in the alert log
- **And** the recipient receives the notification

#### Scenario 2: A non-matching video event does not trigger the alert

- **Given** the policy is scoped by an attribute value
- **And** the attributes feature is enabled
- **When** a video event occurs for a vehicle or asset that does not have that attribute value
- **Then** no alert is recorded
- **And** no notification is sent
- **And** the video event still appears on the video page

#### Scenario 3: Matching any one of several selected values triggers the alert

- **Given** the policy is scoped by multiple attribute values
- **And** the attributes feature is enabled
- **When** a video event occurs for a vehicle or asset that has at least one of the selected values
- **Then** the alert is recorded in the alert log

#### Scenario 4: A vehicle target triggers even without an attribute match

- **Given** the policy is scoped by both an attribute value and a vehicle target
- **And** the attributes feature is enabled
- **When** a video event occurs for the targeted vehicle that lacks the selected attribute
- **Then** the alert is recorded in the alert log

#### Scenario 5: Attribute scope is ignored when the feature is disabled

- **Given** the attributes feature is disabled
- **And** the policy is scoped by a vehicle target and an attribute value
- **When** a video event occurs for the targeted vehicle
- **Then** the alert is recorded based on the vehicle target
- **And** the attribute scope is not evaluated

#### Scenario 6: Existing vehicle, driver, and group matching is unchanged

- **Given** the policy is scoped by a vehicle target with no attribute scope
- **When** a video event occurs for the targeted vehicle
- **Then** the alert is recorded as it was before attribute scoping

---

## Example 3: a scenario outline, for a behaviour that holds across a list

When one behaviour must hold across a known set of cases, an outline says it once. Here the attributes filter must appear on every non-video policy type. The rows are distinct policy types, not reworded copies of one case, which is the only time an outline is right.

**Story 5: Enable the attributes filter for non-video alerts**

As Vanessa (Safety Manager),
I have the attributes filter available on non-video alert policies
so that I can scope safety, activity, and maintenance alerts by attribute too.

### Acceptance Criteria

**Out of scope:** non-video trigger-time evaluation - plot/event-based (story-8) and timer-based (story-9)

**Prerequisites**

- **Given** Vanessa is in the alert policy setup for a non-video alert type

#### Scenario 1: The Add attributes option appears on every non-video policy type

- **Given** the attributes feature toggle is enabled
- **And** Vanessa is configuring a "<policyType>" alert policy
- **When** the monitoring filters are displayed
- **Then** the "Add attributes" option is available alongside vehicles, drivers, and groups

**Examples**

| policyType                    |
|-------------------------------|
| Speeding                      |
| Geofence                      |
| Harsh driving                 |
| Diagnostic trouble code (DTC) |
| Idling                        |
| HOS violation                 |

#### Scenario 2: An alert type evaluated in two categories still shows a single filter

- **Given** the attributes feature toggle is enabled
- **And** Vanessa is configuring an HOS violation alert policy
- **When** the monitoring filters are displayed
- **Then** a single "Add attributes" option is available

#### Scenario 3: The Add attributes option is hidden when the toggle is off

- **Given** the attributes feature toggle is disabled
- **When** the monitoring filters are displayed for a non-video alert policy
- **Then** the "Add attributes" option is not shown

---

## What these three teach

- **Every story covers four paths.** Happy, alternate, edge, negative. The negative scenario often carries the point of the story (Example 2, scenario 2).
- **A gated story tests the gate both ways.** Toggle on and toggle off are two scenarios.
- **A system story reads from the user's side.** The Then is an alert in the log or a notification received, never an evaluator or a query.
- **The analytics callout sits where the event fires**, as a `**<Platform>:**` callout, never a step.
- **Out of scope is a hard boundary.** No scenario touches a story-3 or story-4 concern inside story-1.
