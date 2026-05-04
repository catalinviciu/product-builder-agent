# Gherkin Rules (Condensed Reference)

## Structure

One Feature = one User Story. Scenarios under it = the story's acceptance criteria.

```gherkin
Feature: [Story title]
  As a [persona]
  I want to [goal]
  So that [benefit]

  # Context
  # Existing system: [what already exists]
  # Constraints: [rules AI must follow]
  # Out of scope: [hard boundaries]

  Scenario: [One specific behavior]
    Given [precondition -- state, not action]
    When [single action]
    Then [observable outcome]
```

---

## Cardinal Rules

1. **One Scenario = One Behavior.** Never multiple When-Then pairs in one scenario. Split.
2. **Completeness Rule:** If a behavior has no scenario, it will not be built. Every expected behavior -- happy, alternate, edge, negative -- must have an explicit scenario.
3. **Negative scenarios are mandatory.** Explicitly state what the system must NOT do.

---

## Step Rules

| Step | Must be | Must NOT be |
|------|---------|-------------|
| Given | State ("the panel is open") | Action ("the user opens the panel") |
| When | Single action, present tense | Past tense or multiple actions |
| Then | Observable outcome to the user | Internal state ("DB has record") |

---

## Declarative vs Imperative

**Always declarative.** Describe WHAT, never HOW.

BAD (imperative):
```gherkin
When the user clicks the "Apply" button
  And the user scrolls to the results section
```

GOOD (declarative):
```gherkin
When the user applies the filter
Then the filtered results are displayed
```

---

## Phrasing

- Third-person always ("the user", "the dispatcher") -- never "I"
- Present tense for all steps
- Subject-predicate format: clear subject + clear action
- No punctuation at end of steps
- No capitals unless proper nouns

---

## Scenario Outline (for variations)

```gherkin
Scenario Outline: Error message for invalid input
  Given the form is displayed
  When the user enters "<input>" in the field
  Then the error "<message>" is displayed

  Examples:
    | input   | message              |
    | (empty) | Field is required    |
    | abc     | Must be a number     |
```

Use only when rows represent distinct equivalence classes, not redundant variations.

---

## Background (shared preconditions)

Max 4 lines. Only for Givens shared by ALL scenarios in the Feature.

```gherkin
Background:
  Given the dispatcher is logged in
  And the livemap is displayed
```

---

## Quality Checklist

- [ ] One scenario per behavior
- [ ] Steps are declarative
- [ ] Present tense, third-person
- [ ] Step count per scenario: 3-5 (max 10)
- [ ] No implementation details (URLs, selectors, button labels)
- [ ] Then = observable outcomes only
- [ ] Given = state, not action
- [ ] Every Human Verification bullet has a scenario
- [ ] At least one negative scenario per story
- [ ] Out of Scope items have NO scenarios
- [ ] Test data uses realistic domain values (not "test123")

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Multiple When-Then in one scenario | Split into separate scenarios |
| Imperative ("clicks", "types", "scrolls") | Declarative ("selects", "submits", "applies") |
| First-person | Third-person |
| Testing internal state | Test observable output |
| Past/future tense | Present tense |
| Missing negative scenarios | Add "system must NOT" scenarios |
| Scenarios for out-of-scope behaviors | Delete -- hard boundary |
