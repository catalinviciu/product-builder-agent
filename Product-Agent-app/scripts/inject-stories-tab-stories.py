"""
One-off injector: writes the 12 refined stories from
Stories - User Story Map - refined.md into the
"Stories tab on the Solution with Patton story map…" entity in store.json.

Each story gets the full Gherkin AC (Given/When/Then/And bodies), with
# Mixpanel: EventName (...) comments inlined under the scenario that triggers
the event. Structured analyticsEvents[] is also kept on each record.

Run: C:\\Python312\\python.exe scripts/inject-stories-tab-stories.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORE = ROOT / "data" / "store.json"
SOLUTION_ID = "0e9d59c7-afed-4dca-8277-86ff821e01e5"

PERSONA = "Product Builder"
ACT_SLICE = "01 Slice user journey"
ACT_REVIEW = "02 Review the story map"
ACT_AC = "03 Add acceptance criteria"
ACT_PLAN = "04 Plan & Implement"


# ─────────────────────────────────────────────────────────────────────────
# Story 1
# ─────────────────────────────────────────────────────────────────────────
S1_AC = """  # Out of scope: re-slicing when stories already exist (Story 11); rendering the populated map (Story 2)

  Prerequisites:
    Given a solution exists with an empty stories array
    And the Product Builder is viewing that solution

  Scenario 1: Stories tab is visible alongside existing tabs
    Given the solution detail view is displayed
    When the Product Builder views the available tabs
    Then a "Stories" tab appears alongside the Discovery tab

  Scenario 2: Empty state displays when no stories exist
    Given the Product Builder selects the Stories tab
    When the tab content loads
    Then a centered empty-state card is displayed with a single primary CTA
    And no other decorative or secondary actions are visible

  Scenario 3: Slicer prompt copied to clipboard
    Given the empty-state card is displayed
    When the Product Builder activates the CTA
    Then the user-story-slicer prompt is copied to the OS clipboard
    And a toast confirms "Slicer prompt copied — paste into Claude Code"
    # Mixpanel: SlicerPromptCopied (solution_id: current solution, persona_count: personas on solution)

  Scenario 4: Stories populate after slicer skill completes
    Given the slicer prompt has been run in Claude Code
    When the Product Builder refreshes the page
    Then the stories array contains the generated story records
    And the Stories tab no longer shows the empty state

  Scenario 5: Empty state shows no map controls
    Given the solution has no stories
    When the Product Builder views the Stories tab
    Then no toolbar, map grid, or persona strip is visible"""


# ─────────────────────────────────────────────────────────────────────────
# Story 2
# ─────────────────────────────────────────────────────────────────────────
S2_AC = """  # Out of scope: count badges (Story 8); persona strip (Story 9); card click → slide-over (Story 3)

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Activity backbone spans child task columns
    Given the stories contain activities with multiple user tasks
    When the map renders
    Then each activity label spans the width of its child task columns in the top row

  Scenario 2: Task headers render beneath the activity backbone
    Given the map is rendered
    When the Product Builder views the second row
    Then each task appears as a column header beneath its parent activity

  Scenario 3: Iteration rows appear in the left gutter
    Given the map is rendered
    When the Product Builder views the left gutter
    Then three iteration rows are labeled Walking Skeleton, Enhancement, and GA

  Scenario 4: Story cards placed at correct intersections
    Given stories exist for various task × iteration combinations
    When the map renders
    Then each story card appears in exactly one cell matching its task column and iteration row
    # Mixpanel: StoryMapRendered (solution_id: current solution, story_count: total stories, activity_count: activities)

  Scenario 5: Empty cells show hatched background
    Given a task × iteration intersection has no stories
    When the map renders
    Then that cell displays a hatched background pattern

  Scenario 6: Horizontal scroll when map exceeds available width
    Given the map content exceeds the available container width
    When the map renders
    Then the map scrolls horizontally inside its container

  Scenario 7: Map renders for primary persona only
    Given the solution has stories for multiple personas
    When the map renders
    Then only stories belonging to the primary persona are displayed

  Scenario 8: Empty cells are non-interactive
    Given an empty cell with hatched background is displayed
    When the Product Builder interacts with it
    Then no action occurs and no navigation is triggered"""


# ─────────────────────────────────────────────────────────────────────────
# Story 3
# ─────────────────────────────────────────────────────────────────────────
S3_AC = """  # Out of scope: prev/next navigation (Story 10); focus restoration on close (Story 12); Plan & Implement button (Story 7)

  Prerequisites:
    Given the story map is rendered
    And the Product Builder is viewing the Stories tab

  Scenario 1: Story card opens slide-over
    Given story cards are displayed on the map
    When the Product Builder selects a story card
    Then a 520px-wide panel slides in from the right
    And a dim backdrop covers the page behind it
    # Mixpanel: StoryDetailOpened (story_id: selected story, iteration: WS/Enh/GA, has_ac: boolean)

  Scenario 2: Panel displays full story details
    Given the slide-over is open for a story
    When the Product Builder views the panel content
    Then the story ID, title, and iteration tag are displayed
    And an activity → task breadcrumb is shown

  Scenario 3: AC section shows empty placeholder when no AC exists
    Given the open story has no acceptance criteria
    When the Product Builder views the AC section
    Then the placeholder "No acceptance criteria yet" is displayed

  Scenario 4: Analytics section shows empty placeholder when no events exist
    Given the open story has no analytics events
    When the Product Builder views the Analytics section
    Then an empty placeholder is displayed

  Scenario 5: Backdrop click dismisses the slide-over
    Given the slide-over is open
    When the Product Builder selects the dim backdrop
    Then the slide-over closes and the backdrop is removed

  Scenario 6: Escape key dismisses the slide-over
    Given the slide-over is open
    When the Product Builder presses Escape
    Then the slide-over closes and the backdrop is removed

  Scenario 7: Close button dismisses the slide-over
    Given the slide-over is open
    When the Product Builder activates the Close button
    Then the slide-over closes and the backdrop is removed

  Scenario 8: No navigation controls are visible in the slide-over
    Given the slide-over is open
    When the Product Builder views the panel
    Then no prev/next navigation controls are present"""


# ─────────────────────────────────────────────────────────────────────────
# Story 4
# ─────────────────────────────────────────────────────────────────────────
S4_AC = """  # Out of scope: re-generating AC for stories that already have it; per-story Plan & Implement gating on AC presence

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Toolbar shows AC writer button when stories lack AC
    Given at least one story has empty acceptance criteria
    When the map renders
    Then a toolbar above the map displays an "Add acceptance criteria" button
    # Mixpanel: AcWriterPromptCopied (solution_id: current solution, stories_without_ac: count of stories missing AC)

  Scenario 2: AC writer prompt copied to clipboard
    Given the "Add acceptance criteria" button is visible
    When the Product Builder activates the button
    Then the user-story-ac-writer prompt is copied to the OS clipboard
    And a toast confirms the copy

  Scenario 3: AC writer button hidden when all stories have AC
    Given every story has populated acceptance criteria
    When the map renders
    Then no "Add acceptance criteria" button is visible in the toolbar

  Scenario 4: Stories enriched after AC writer skill completes
    Given the AC writer prompt has been run in Claude Code
    When the Product Builder refreshes the page
    Then every story record has populated acceptance_criteria and analytics_events
    # Mixpanel: StoryMapAcEnriched (solution_id: current solution, stories_with_ac: count, stories_total: count)

  Scenario 5: Slide-over renders Gherkin AC block
    Given a story has populated acceptance criteria
    When the Product Builder opens that story's slide-over
    Then the AC section renders the Gherkin block as formatted text

  Scenario 6: Slide-over renders analytics event list
    Given a story has populated analytics events
    When the Product Builder opens that story's slide-over
    Then the Analytics section renders each event with its name and properties"""


# ─────────────────────────────────────────────────────────────────────────
# Story 5
# ─────────────────────────────────────────────────────────────────────────
S5_AC = """  # Out of scope: narrower scopes — iteration row (Story 6) and single story (Story 7)

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Whole-map button visible in the map header
    Given the story map is rendered
    When the Product Builder views the map header
    Then a Plan & Implement button is displayed left-stacked under the scope label

  Scenario 2: Prompt copied with all story IDs
    Given the whole-map button is visible
    When the Product Builder activates the button
    Then a prompt is copied to the OS clipboard containing every story ID for the active persona
    And the prompt includes the path to store.json
    And a toast confirms the copy
    # Mixpanel: PlanImplementPromptCopied (solution_id: current solution, scope: "whole-map", story_count: total stories)
    # Prompt intent: the agent reads store.json directly using the provided IDs to fetch full story content

  Scenario 3: Prompt contains only IDs, never full bodies
    Given the prompt has been copied
    When the Product Builder inspects the clipboard content
    Then the prompt does not contain story titles, acceptance criteria, or analytics event bodies"""


# ─────────────────────────────────────────────────────────────────────────
# Story 6
# ─────────────────────────────────────────────────────────────────────────
S6_AC = """  # Out of scope: disabling when some stories in the row lack AC (future concern; not blocking)

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Iteration row label contains a Plan & Implement button
    Given the story map is rendered
    When the Product Builder views an iteration row's label cell
    Then a Plan & Implement button is displayed below the iteration name

  Scenario 2: Button copies prompt scoped to that iteration's stories
    Given the iteration row contains stories
    When the Product Builder activates that row's Plan & Implement button
    Then a prompt is copied containing only the story IDs from that iteration row
    And the prompt includes the path to store.json
    And a toast confirms the copy
    # Mixpanel: PlanImplementPromptCopied (solution_id: current solution, scope: "iteration", story_count: stories in row)
    # Prompt intent: the agent reads store.json directly using the provided IDs

  Scenario 3: Button disabled when iteration row has zero stories
    Given an iteration row contains no stories for the active persona
    When the Product Builder views that row's label cell
    Then the Plan & Implement button is visually disabled and non-interactive

  Scenario 4: Prompt excludes stories from other iteration rows
    Given the WS row's button has been activated
    When the Product Builder inspects the clipboard content
    Then the prompt contains only WS-row story IDs and no Enhancement or GA story IDs"""


# ─────────────────────────────────────────────────────────────────────────
# Story 7
# ─────────────────────────────────────────────────────────────────────────
S7_AC = """  # Out of scope: bulk story selection across the map

  Prerequisites:
    Given the slide-over is open for a story
    And the Product Builder is viewing the panel footer

  Scenario 1: Plan & Implement button visible when story has AC
    Given the open story has populated acceptance criteria
    When the Product Builder views the slide-over footer
    Then a "Plan & Implement story" button is displayed

  Scenario 2: Button copies prompt with single story ID
    Given the "Plan & Implement story" button is visible
    When the Product Builder activates the button
    Then a prompt is copied containing only that story's ID
    And the prompt includes the path to store.json
    And a toast confirms the copy
    # Mixpanel: PlanImplementPromptCopied (solution_id: current solution, scope: "story", story_count: 1)
    # Prompt intent: the agent reads store.json directly using the provided ID

  Scenario 3: Helper text replaces button when story has no AC
    Given the open story has no acceptance criteria
    When the Product Builder views the slide-over footer
    Then muted helper text "Add AC first to enable this scope" is displayed
    And no Plan & Implement button is present

  Scenario 4: Whole-map and iter-row buttons unaffected by per-story AC state
    Given a story without AC is open in the slide-over
    When the Product Builder views the map header and iteration labels
    Then the whole-map and iteration-row Plan & Implement buttons remain available"""


# ─────────────────────────────────────────────────────────────────────────
# Story 8
# ─────────────────────────────────────────────────────────────────────────
S8_AC = """  # Out of scope: filtering or hiding empty iteration rows

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Each iteration label displays a count badge
    Given the story map is rendered
    When the Product Builder views the iteration row labels
    Then each label (WS, EN, GA) displays a count badge showing the number of stories in that row

  Scenario 2: Count matches rendered stories
    Given stories are distributed across iteration rows
    When the Product Builder compares the count badge to the rendered cards
    Then each badge count matches the number of story cards in that row

  Scenario 3: Count reflects active persona only
    Given stories exist for multiple personas
    When the map renders for the active persona
    Then the count badges reflect only that persona's stories

  Scenario 4: Empty iteration row shows zero count
    Given an iteration row has no stories for the active persona
    When the Product Builder views that row's label
    Then the count badge displays "0 stories\""""


# ─────────────────────────────────────────────────────────────────────────
# Story 9
# ─────────────────────────────────────────────────────────────────────────
S9_AC = """  # Out of scope: adding/removing personas; rendering personas without stories

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Tab strip shows only personas with stories
    Given the solution has 3 personas but only 2 have stories
    When the map renders
    Then the persona strip displays 2 tabs
    And the persona with zero stories is not present in the strip

  Scenario 2: Each tab displays name, avatar, and count badge
    Given the persona strip is rendered
    When the Product Builder views a tab
    Then the tab shows the persona name, initials avatar, and story count badge

  Scenario 3: First persona with stories is selected by default
    Given the map renders for the first time
    When the Product Builder views the persona strip
    Then the first persona with stories is selected
    And the map displays that persona's backbone

  Scenario 4: Switching tabs swaps the entire backbone
    Given persona A's backbone is displayed
    When the Product Builder selects persona B's tab
    Then the map replaces all activities, tasks, iteration rows, and story cards with persona B's backbone

  Scenario 5: Single-persona solution shows one tab
    Given the solution has stories for only one persona
    When the map renders
    Then the persona strip displays one tab for that persona

  Scenario 6: Strip hidden when no stories exist
    Given the solution has no stories
    When the Product Builder views the Stories tab
    Then the persona strip is not visible"""


# ─────────────────────────────────────────────────────────────────────────
# Story 10
# ─────────────────────────────────────────────────────────────────────────
S10_AC = """  # Out of scope: jumping between personas

  Prerequisites:
    Given the slide-over is open for a story
    And the Product Builder is viewing the panel

  Scenario 1: Next button loads the next story in map order
    Given the open story is not the last in map traversal order
    When the Product Builder activates the next button
    Then the slide-over content updates to the next story without closing

  Scenario 2: Prev button loads the previous story in map order
    Given the open story is not the first in map traversal order
    When the Product Builder activates the prev button
    Then the slide-over content updates to the previous story without closing

  Scenario 3: Right arrow key navigates to next story
    Given the slide-over is open
    When the Product Builder presses the right arrow key
    Then the slide-over content updates to the next story

  Scenario 4: Left arrow key navigates to previous story
    Given the slide-over is open
    When the Product Builder presses the left arrow key
    Then the slide-over content updates to the previous story

  Scenario 5: Next button disabled on last story
    Given the open story is the last in map traversal order
    When the Product Builder views the footer
    Then the next button is visually disabled and non-interactive

  Scenario 6: Prev button disabled on first story
    Given the open story is the first in map traversal order
    When the Product Builder views the footer
    Then the prev button is visually disabled and non-interactive

  Scenario 7: URL updates to reflect the open story
    Given the Product Builder navigates to a different story via prev/next
    When the navigation completes
    Then the URL updates to identify the currently open story

  Scenario 8: Escape still closes the slide-over during navigation
    Given the Product Builder has navigated to a story via prev/next
    When the Product Builder presses Escape
    Then the slide-over closes"""


# ─────────────────────────────────────────────────────────────────────────
# Story 11
# ─────────────────────────────────────────────────────────────────────────
S11_AC = """  # Out of scope: selective re-slice of a single activity or persona

  Prerequisites:
    Given a solution has populated stories
    And the Product Builder is viewing the Stories tab

  Scenario 1: Re-slice button visible in toolbar
    Given the story map is rendered with existing stories
    When the Product Builder views the toolbar
    Then a "Re-slice" button is displayed next to the AC writer button

  Scenario 2: Confirmation modal opens on button activation
    Given the "Re-slice" button is visible
    When the Product Builder activates it
    Then a confirmation modal displays "Re-slicing will replace all existing stories. AC and Analytics events will be lost. Continue?"

  Scenario 3: Confirm copies the re-slice prompt
    Given the confirmation modal is displayed
    When the Product Builder confirms
    Then the re-slice prompt with overwrite-intent flag is copied to the OS clipboard
    And a toast confirms the copy
    And the modal closes
    # Mixpanel: ReSlicePromptCopied (solution_id: current solution, stories_overwritten: count of existing stories)

  Scenario 4: Cancel dismisses modal without copying
    Given the confirmation modal is displayed
    When the Product Builder cancels
    Then the modal closes
    And nothing is copied to the clipboard

  Scenario 5: Re-slice button not visible when no stories exist
    Given the solution has no stories
    When the Product Builder views the Stories tab
    Then no "Re-slice" button is visible"""


# ─────────────────────────────────────────────────────────────────────────
# Story 12
# ─────────────────────────────────────────────────────────────────────────
S12_AC = """  # Out of scope: focus management for prev/next navigation (Story 10 territory)

  Prerequisites:
    Given the slide-over is open
    And it was opened from a specific story card on the map

  Scenario 1: Focus returns to originating card on close
    Given the slide-over was opened from a story card
    When the Product Builder closes the slide-over
    Then DOM focus returns to the originating story card

  Scenario 2: All close methods restore focus
    Given the slide-over is open
    When the Product Builder dismisses via backdrop, Escape, or Close button
    Then focus returns to the originating card regardless of dismissal method

  Scenario 3: Focus falls back to map header when originating card is removed
    Given the originating story card has been removed from the DOM
    When the Product Builder closes the slide-over
    Then DOM focus falls back to the map header

  Scenario 4: Focus restores to originating card even after prev/next navigation
    Given the Product Builder navigated to a different story via prev/next
    When the Product Builder closes the slide-over
    Then focus returns to the card that originally opened the panel
    And focus does not go to the last-viewed story's card"""


STORIES = [
    {
        "id": "story-1",
        "title": "Slice empty user journey to populate the map",
        "persona": PERSONA,
        "activity": ACT_SLICE,
        "task": "Slice the journey to populate stories",
        "iteration": "WS",
        "narrative": {
            "role": "Product Builder",
            "action": "click the empty-state CTA on a Solution's Stories tab to copy the slicer prompt",
            "benefit": "I don't have to remember which AI Actions menu starts the slicing flow",
        },
        "context": (
            "Existing system: Solution detail view (EntityView.tsx) supports tabs (Discovery is the only tab today). "
            "The Stories tab is added alongside.\n"
            "Constraints: Empty state is one centered card with one primary CTA — no decorative or secondary actions. "
            "Clicking copies the user-story-slicer prompt to the OS clipboard via the same prompt-builder pattern used "
            "by other AI Actions (app/lib/utils.ts). On copy, a toast confirms (\"Slicer prompt copied — paste into "
            "Claude Code\"). Stories persist to solution.stories[] (new field) — requires a hydrate migration to "
            "backfill [] on existing solutions."
        ),
        "outOfScope": [
            "Re-slicing when stories already exist (Story 11)",
            "Rendering the populated map (Story 2)",
        ],
        "dependencies": [
            "stories[] field on Solution schema with hydrate migration",
            "user-story-slicer skill rewritten to write structured records into store.json instead of MD files (system story)",
        ],
        "humanVerification": (
            "Open a Solution with no stories → Stories tab shows centered empty state with one CTA. "
            "Click → toast + slicer prompt on clipboard. Run the prompt in Claude Code, refresh → "
            "solution.stories[] is populated."
        ),
        "acceptanceCriteria": S1_AC,
        "analyticsEvents": [
            {"name": "SlicerPromptCopied", "properties": {"solution_id": "string", "persona_count": "number"}},
        ],
    },
    {
        "id": "story-2",
        "title": "Patton map renders for the active persona",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Read the Patton map",
        "iteration": "WS",
        "narrative": {
            "role": "Product Builder",
            "action": "see all stories laid out as a Patton map (activity backbone → task columns → iteration rows)",
            "benefit": "I can read the structure at a glance instead of hunting through a flat list",
        },
        "context": (
            "Existing system: No story rendering in-app today.\n"
            "Constraints: Activity backbone = top row spanning child task columns. Task headers = second row. "
            "Iteration rows (Walking Skeleton / Enhancement / GA) live in a left gutter. Story cards live at the "
            "(task × iteration) intersection. Empty cells render with a hatched background. The map renders for "
            "the primary persona only at this stage. Map scrolls horizontally inside its container when content "
            "exceeds the available width."
        ),
        "outOfScope": [
            "Count badges (Story 8)",
            "Persona strip (Story 9)",
            "Card click → slide-over (Story 3)",
        ],
        "dependencies": ["Story 1"],
        "humanVerification": (
            "A solution with stories renders the full grid: backbone + task headers + 3 iteration rows. "
            "Each story appears in exactly one cell. Empty cells are visibly empty and non-interactive."
        ),
        "acceptanceCriteria": S2_AC,
        "analyticsEvents": [
            {"name": "StoryMapRendered", "properties": {"solution_id": "string", "story_count": "number", "activity_count": "number"}},
        ],
    },
    {
        "id": "story-3",
        "title": "Click a story card → right slide-over with AC + Analytics",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Open a story's details",
        "iteration": "WS",
        "narrative": {
            "role": "Product Builder",
            "action": "click a story card and read its full details in a side panel",
            "benefit": "I can see AC + Analytics events without losing sight of the surrounding map",
        },
        "context": (
            "Existing system: Slide-over patterns already exist (PersonaSlideOver).\n"
            "Constraints: Panel slides from the right at 520px wide, dim backdrop covering the page. Backdrop click, "
            "Escape key, and explicit Close button all dismiss. Panel content: story ID, title, iteration tag "
            "(WS/EN/GA), activity → task crumb, AC (Gherkin block), Analytics events (list). When a story has no AC "
            "yet, the AC section shows \"No acceptance criteria yet\"."
        ),
        "outOfScope": [
            "Prev/next navigation (Story 10)",
            "Focus restoration on close (Story 12)",
            "Plan & Implement story button inside the panel (Story 7)",
        ],
        "dependencies": ["Story 2"],
        "humanVerification": (
            "Click a card whose story has no acceptance_criteria → slide-over opens, AC section shows the empty "
            "placeholder, Analytics section shows its empty placeholder. All three close methods dismiss."
        ),
        "acceptanceCriteria": S3_AC,
        "analyticsEvents": [
            {"name": "StoryDetailOpened", "properties": {"story_id": "string", "iteration": "string", "has_ac": "boolean"}},
        ],
    },
    {
        "id": "story-4",
        "title": "AC writer button copies AC writer prompt",
        "persona": PERSONA,
        "activity": ACT_AC,
        "task": "Add or update AC + Analytics on stories",
        "iteration": "WS",
        "narrative": {
            "role": "Product Builder",
            "action": "click one button to copy the AC writer prompt when stories lack AC",
            "benefit": "I can enrich the whole map with Gherkin AC + Analytics events in one step",
        },
        "context": (
            "Constraints: Toolbar button visible above the map when at least one story has empty acceptance_criteria. "
            "Clicking copies the user-story-ac-writer prompt + toast. The skill writes Gherkin AC and analytics_events "
            "directly to each story record in store.json."
        ),
        "outOfScope": [
            "Re-generating AC for stories that already have it",
            "Per-story Plan & Implement gating on AC presence",
        ],
        "dependencies": [
            "Story 2",
            "user-story-ac-writer skill rewritten to write structured records to store.json (system story)",
        ],
        "humanVerification": (
            "Solution with stories but no AC → toolbar shows \"Add acceptance criteria\" button. Click → toast + "
            "prompt on clipboard. After running the prompt and refreshing, every story has populated "
            "acceptance_criteria and analytics_events."
        ),
        "acceptanceCriteria": S4_AC,
        "analyticsEvents": [
            {"name": "AcWriterPromptCopied", "properties": {"solution_id": "string", "stories_without_ac": "number"}},
            {"name": "StoryMapAcEnriched", "properties": {"solution_id": "string", "stories_with_ac": "number", "stories_total": "number"}},
        ],
    },
    {
        "id": "story-5",
        "title": "Plan & Implement — whole map",
        "persona": PERSONA,
        "activity": ACT_PLAN,
        "task": "Hand off scoped stories to the agent",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder",
            "action": "click one button in the map header to hand off every story on the map to my coding agent",
            "benefit": "I can implement the whole solution end-to-end without copy-pasting story content",
        },
        "context": (
            "Existing system: Plan & Implement exists at the entity level via the AI Actions menu; this adds a "
            "tab-local surface for whole-map scope.\n"
            "Constraints: Whole-map button lives in the map header above the grid. Copies a prompt with all story "
            "IDs from the active persona + a path to store.json. Prompt embeds only IDs, never full bodies."
        ),
        "outOfScope": ["Narrower scopes (single story — Story 7)"],
        "dependencies": ["Story 6 (iteration-row prompt-builder pattern)"],
        "humanVerification": (
            "Click whole-map button → toast + prompt on clipboard. Prompt contains every story ID. Prompt does NOT "
            "contain story titles, AC, or Analytics bodies."
        ),
        "acceptanceCriteria": S5_AC,
        "analyticsEvents": [
            {"name": "PlanImplementPromptCopied", "properties": {"solution_id": "string", "scope": "whole-map", "story_count": "number"}},
        ],
    },
    {
        "id": "story-6",
        "title": "Plan & Implement — iteration row",
        "persona": PERSONA,
        "activity": ACT_PLAN,
        "task": "Hand off scoped stories to the agent",
        "iteration": "WS",
        "narrative": {
            "role": "Product Builder",
            "action": "click a button inside an iteration row's label to hand off only that iteration's stories",
            "benefit": "I can ship the Walking Skeleton first, then enhancements, then GA — one slice at a time",
        },
        "context": (
            "Constraints: Each iter-label cell on the left gutter contains a Plan & Implement button below the "
            "iteration name. Same prompt-builder template as the whole-map button. Disabled when the iteration "
            "row has zero stories."
        ),
        "outOfScope": ["Disabling when some stories in the row lack AC (future concern; not blocking)"],
        "dependencies": ["Stories 1, 2, 4"],
        "humanVerification": (
            "Click WS row's button → prompt contains only WS-row story IDs. Empty iteration row → button disabled."
        ),
        "acceptanceCriteria": S6_AC,
        "analyticsEvents": [
            {"name": "PlanImplementPromptCopied", "properties": {"solution_id": "string", "scope": "iteration", "story_count": "number"}},
        ],
    },
    {
        "id": "story-7",
        "title": "Plan & Implement — single story",
        "persona": PERSONA,
        "activity": ACT_PLAN,
        "task": "Hand off scoped stories to the agent",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder",
            "action": "click a button inside a story's slide-over to hand off only that one story to the agent",
            "benefit": "I can iterate one story at a time when I want fine control over what gets built next",
        },
        "context": (
            "Constraints: Slide-over footer contains a \"Plan & Implement story\" button (when the story has AC). "
            "Copies a prompt containing only that one story's ID."
        ),
        "outOfScope": ["Bulk story selection across the map"],
        "dependencies": ["Stories 3, 5"],
        "humanVerification": (
            "Story with AC → footer shows button. Click → prompt contains only that story's ID. Story without AC "
            "→ button replaced by muted helper text."
        ),
        "acceptanceCriteria": S7_AC,
        "analyticsEvents": [
            {"name": "PlanImplementPromptCopied", "properties": {"solution_id": "string", "scope": "story", "story_count": "1"}},
        ],
    },
    {
        "id": "story-8",
        "title": "Iteration label shows count badge",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Read the Patton map",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder",
            "action": "see \"N stories\" next to each iteration label",
            "benefit": "I can size each iteration slice at a glance",
        },
        "context": (
            "Constraints: Counts only stories assigned to that iteration row for the active persona. Updates live "
            "when stories are added or removed."
        ),
        "outOfScope": ["Filtering or hiding empty iteration rows"],
        "dependencies": ["Story 2"],
        "humanVerification": "Each of WS / EN / GA labels shows a count matching what's actually rendered.",
        "acceptanceCriteria": S8_AC,
        "analyticsEvents": [],
    },
    {
        "id": "story-9",
        "title": "Persona strip switches between persona-specific backbones",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Read the Patton map",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder working on a multi-persona solution",
            "action": "switch between persona-specific backbones via a tab strip that only shows personas that have stories",
            "benefit": "I'm not distracted by personas with empty backbones",
        },
        "context": (
            "Constraints: Stories carry a persona field. The strip renders one tab per persona that has at least "
            "one story. Personas with zero stories are hidden. Each tab shows persona name, avatar (initials), and "
            "a count badge. Switching swaps the entire backbone. Default: first persona with stories."
        ),
        "outOfScope": ["Adding/removing personas", "Rendering personas without stories"],
        "dependencies": ["Stories 1, 2"],
        "humanVerification": (
            "Solution with stories for 2 of 3 personas → strip shows 2 tabs. Solution with stories for 1 persona "
            "→ strip still shows that 1 tab."
        ),
        "acceptanceCriteria": S9_AC,
        "analyticsEvents": [],
    },
    {
        "id": "story-10",
        "title": "Slide-over prev/next navigation",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Open a story's details",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder",
            "action": "walk through stories with prev/next controls (and ←/→ keys) without closing the slide-over",
            "benefit": "I can read related stories quickly without re-clicking the map",
        },
        "context": (
            "Constraints: Footer has prev / next icon buttons. Keyboard: ←/→ navigate, Escape closes. Order = map "
            "traversal (iteration rows top-to-bottom, then task columns left-to-right). URL updates so the panel "
            "state is shareable."
        ),
        "outOfScope": ["Jumping between personas"],
        "dependencies": ["Story 3"],
        "humanVerification": "Open a story → → loads next in map order. ← back. URL reflects open story.",
        "acceptanceCriteria": S10_AC,
        "analyticsEvents": [],
    },
    {
        "id": "story-11",
        "title": "Re-slice with overwrite confirmation",
        "persona": PERSONA,
        "activity": ACT_SLICE,
        "task": "Re-slice to overwrite",
        "iteration": "Enh",
        "narrative": {
            "role": "Product Builder",
            "action": "see a \"Re-slice\" option that warns me before overwriting existing stories",
            "benefit": "I can refresh the map after the user journey changes without losing in-progress AC by accident",
        },
        "context": (
            "Constraints: \"Re-slice\" button lives in the toolbar next to the AC writer button. Clicking opens a "
            "confirmation modal. Confirming copies a re-slice prompt with overwrite-intent flag."
        ),
        "outOfScope": ["Selective re-slice of a single activity or persona"],
        "dependencies": ["Story 1"],
        "humanVerification": "Sliced solution → \"Re-slice\" visible. Click → confirmation modal → copy only on confirm.",
        "acceptanceCriteria": S11_AC,
        "analyticsEvents": [
            {"name": "ReSlicePromptCopied", "properties": {"solution_id": "string", "stories_overwritten": "number"}},
        ],
    },
    {
        "id": "story-12",
        "title": "Slide-over close restores focus to originating story card",
        "persona": PERSONA,
        "activity": ACT_REVIEW,
        "task": "Open a story's details",
        "iteration": "GA",
        "narrative": {
            "role": "Product Builder using keyboard navigation",
            "action": "see focus return to the story card I opened the panel from when I close the slide-over",
            "benefit": "I can continue navigating the map without losing my place",
        },
        "context": (
            "Constraints: Close (any method — backdrop / Escape / button) returns DOM focus to the originating card. "
            "If the originating card has been removed (e.g., re-slice while panel was open), focus falls back to the "
            "map header."
        ),
        "outOfScope": ["Focus management for prev/next navigation (Story 10 territory)"],
        "dependencies": ["Story 3"],
        "humanVerification": "Tab to focus a card → Enter opens panel → Escape closes → focus is back on that card.",
        "acceptanceCriteria": S12_AC,
        "analyticsEvents": [],
    },
]


def main():
    with STORE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    found = False
    for pl_id, pl in data.items():
        if SOLUTION_ID in pl.get("entities", {}):
            pl["entities"][SOLUTION_ID]["stories"] = STORIES
            found = True
            print(f"Wrote {len(STORIES)} stories to {pl_id} → entities[{SOLUTION_ID}]")
            break

    if not found:
        raise SystemExit(f"Solution {SOLUTION_ID} not found in any product line")

    with STORE.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Saved {STORE}")


if __name__ == "__main__":
    main()
