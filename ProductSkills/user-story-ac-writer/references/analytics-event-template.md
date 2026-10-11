# Analytics Event Template

How to define the analytics events that measure task success and funnel behaviour. Read this in Phase 2, before proposing events.

> **This guidance is platform-agnostic.** The analytics platform is named in the prompt's `## Analytics Platform` block. Naming, properties, classification, and placement below apply to any platform (Pendo, Mixpanel, Amplitude, gtag). Only the funnel-native note is Pendo-specific - it is flagged where it applies. The examples use Pendo trackids because they come from a Pendo product line; read `trackid` as "the platform's event binding".

---

## What an analytics event is here

The platform tracks events with a binding placed on a UI element (a button, a control) - a Pendo trackid, a Mixpanel/Amplitude `track` call, a `gtag` event. The event fires when the user acts on that element. So each event ties to a real, observable action, and it attaches to the scenario where that action happens.

---

## User steps only

A trackid sits on a UI element the user acts on. A system step has no such element, so it gets no event. Check the `Type` column of the story map before proposing anything: define events for user steps only. If every step is a system step, there are no events to define.

---

## Define three things per event

| Element | What it is |
|---------|------------|
| Trigger | The user action or system state that fires the event |
| Event name | PascalCase, verb-noun. The trackid name |
| Properties | Key-value pairs that reveal the behaviour behind the count |

---

## Naming

- PascalCase, no spaces, no underscores.
- Verb-noun, past tense, because the event fires after the action: `AlertAttributeFilterOpened`, `AlertAttributeSelectionApplied`, `AlertAttributePolicySaved`.
- Specific over generic: `AlertAttributeFilterOpened`, not `FilterUsed`.

---

## Properties

A property answers "what context turns this count into a behaviour we can read?"

- Volume: how many items - a count. "value = number of attribute values selected".
- Type: which category of item - a string.
- Source: how the user got here - a string.
- State: the system state at the moment - a string or boolean.

Keep properties to the ones a decision would actually use. A property no one will read is noise.

---

## Classify each event

| Priority | Test | Example |
|----------|------|---------|
| Must-have | Task success or a funnel step cannot be measured without it | `AlertAttributeSelectionApplied` - the task-success signal |
| Optional | Behavioural insight, not needed to measure success | An attribute-group expand - an exploration signal |

Must-haves answer "did the user succeed?" Optional events answer "how did they behave on the way?"

---

## Funnels: only track what happened

Most analytics platforms (Pendo, Mixpanel, Amplitude) measure dropout between two sequential events on their own. If A then B is a funnel, the platform shows the completion rate without a separate "abandoned" event.

So define events only for actions that happened. Abandonment and dropout are read from the funnel, never fired as their own event. If the platform named in the prompt does not derive funnels natively, note that an explicit step event may be needed, but still never invent an "abandoned" event.

---

## Where the event sits in the AC

Attach the event to the scenario where its data becomes available, not the action that started the flow. If the property is a count of rendered items, place the event on the scenario where those items render.

In the AC block the event is a bold `**<Platform>:**` callout, never a Given/When/Then step. `<Platform>` is the platform from the prompt block (shown here as Pendo):

```markdown
- **Then** the selected count is shown on the attributes filter
- **Pendo:** `AlertAttributeSelectionApplied` - trackid on the Save selection button; property `value` = number of attribute values selected
```

---

## Worked examples, from the alert-attributes work

### Funnel entry - must-have

| Element | Value |
|---------|-------|
| Trigger | Vanessa opens the attributes picker from an alert policy |
| Event name | `AlertAttributeFilterOpened` |
| Properties | trackid on the Add attribute button |

Must-have: without the funnel entry there is no dropout to measure.

### Task success - must-have

| Element | Value |
|---------|-------|
| Trigger | Vanessa saves her attribute selection |
| Event name | `AlertAttributeSelectionApplied` |
| Properties | `value` = number of attribute values selected |

Must-have: this is the task-success signal.

### Scope persisted - must-have

| Element | Value |
|---------|-------|
| Trigger | Vanessa saves the policy |
| Event name | `AlertAttributePolicySaved` |
| Properties | `value` = number of attributes saved |

Must-have: confirms the scope took effect, the point of the whole flow.

---

## Overlay format

Present the events as a table over the story map, one row per event, showing which story it maps to.

```markdown
| Story | Event Name | Trigger | Properties | Priority |
|-------|-----------|---------|------------|----------|
| Story 1 | AlertAttributeFilterOpened | Vanessa opens the picker | trackid on Add attribute button | Must-have |
| Story 1 | AlertAttributeSelectionApplied | Vanessa saves the selection | value = count selected | Must-have |
| Story 3 | AlertAttributePolicySaved | Vanessa saves the policy | value = count saved | Must-have |
```
