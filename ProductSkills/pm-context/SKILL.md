---
name: pm-context
description: PM thinking framework for Product Agent. Explains the Opportunity Solution Tree philosophy, what each entity level means in business terms, and the rules for staying in problem vs. solution space.
type: context
---

# Product Thinking Framework — Product Agent

## The Core Philosophy

Product Agent is built on Teresa Torres's **Opportunity Solution Tree (OST)** — a framework for disciplined product discovery. The key idea: separate *what problem we're solving* from *how we're solving it* before committing to building anything.

The hierarchy exists because each level answers a different question:

```
Business Outcome   → "What business result are we driving toward?"
  Product Outcome  → "What user behaviour change will deliver that result?"
    Opportunity    → "What user pain, need, or desire is in our way?"
      Solution     → "What could we build to address that opportunity?"
        Assumption → "What must be true for this solution to work?"
          Test     → "How do we validate that assumption cheaply?"
```

Each level is **causally connected** to the one above. A solution is only valid if it addresses a real opportunity. An opportunity is only valid if solving it would move a product outcome. This chain prevents building things that feel useful but don't drive business results.

---

## Entity Levels in Business Terms

### Business Outcome
The commercial result the organisation needs to achieve. Expressed as a metric with a target and timeframe.
- **Good example:** "Get 3 paying customers within 6 months"
- **Not this:** A product feature or initiative

### Product Outcome
The measurable change in user behaviour that would deliver the business outcome. This is the *product team's bet* — if users do X more, the business wins.
- **Good example:** "5 product builders actively building products using the software within 3 months"
- **Not this:** A feature shipped or a project completed

### Opportunity
A **user need, pain, or desire** that, if addressed, would move the product outcome. This is always **problem space** — what the user is experiencing, not what we're building.

**The cardinal rule:** Opportunities must never describe solutions, features, or capabilities. If the text describes what the product *does*, it belongs in the solution layer.

- **Good example:** "I have all this context in my head and across scattered docs, but making it available for the AI and the team is incredibly tedious."
- **Not this:** "Users need a dashboard where they can manage their product context" ← that's a solution
- Structure: user pain/need/desire + who experiences it (persona) + what they do today as a workaround + what their desired state looks like

### Solution
A concrete approach to addressing an opportunity. This is **solution space** — a specific thing we could build, design, or change. Solutions are hypotheses, not commitments.
- **Good example:** "AI-assisted opportunity writer that interviews the builder and writes structured opportunity cards"
- Solutions have children: assumptions and tests that must be validated before committing to build

### Assumption
Something that **must be true** for the solution to deliver its intended outcome. Assumptions are risks — if they're wrong, the solution fails.
- **Good example:** "Builders will trust an AI-generated opportunity write-up without extensive manual editing"
- Frame as a belief that could be falsified: "We believe X is true"

### Test
A lightweight, fast, cheap experiment designed to validate or invalidate one specific assumption.
- **Good example:** "Show 5 builders a sample AI-written opportunity card. Ask: would you use this as-is or need to rewrite it? Target: 3 of 5 say they'd use it as-is."
- Tests have a `testType`: `prototype`, `interview`, `survey`, `data_analysis`, or `other`
- A test is only `done` when the experiment has been run and findings are recorded — not when it's designed

---

## The Causal Chain — How to Reason Across Levels

**Going up (explaining why a solution matters):**
> This solution addresses the opportunity "..." which blocks users from achieving "..." which is what we need to move our product outcome "..." which drives our business outcome "..."

**Going down (connecting strategy to execution):**
> To move our product outcome, we need to address the opportunity "...". The best solution candidate is "...". Before building, we need to validate the assumption "..." by running a test that "..."

**When given a solution entity, always establish:**
1. Which opportunity does this solve? (parent)
2. Which product outcome does that opportunity feed? (grandparent)
3. Which persona experiences this opportunity?
4. What assumptions are still unvalidated? (children)

---

## Status Flow

Statuses reflect confidence and commitment, not just progress:

| Status | Meaning |
|--------|---------|
| `draft` | Being defined — not yet ready to act on |
| `explore` | Active discovery — researching, interviewing, testing |
| `commit` | Decision made to build — in development |
| `done` | Shipped and delivering value |
| `dropped` | Deprioritised or invalidated |
| `archived` | No longer relevant but kept for reference |

**Important distinction:** `commit` means decided to build, not shipped. Only `done` solutions are actually delivering impact on the product outcome metric.

---

## Minimum Viable Framing — What Each Level Needs

These are the fields and blocks the app provides for each level. When helping a builder frame or write an entity, ensure these are populated before considering it well-defined.

### Business Outcome
| Field | What to fill |
|-------|-------------|
| **Title** | The outcome statement — short, outcome-oriented (e.g. "Get 3 paying customers") |
| **Description** | What measurable business result this product must drive |
| **Key Metric** *(metric block)* | Metric name + current value + target + timeframe |
| **Strategic Alignment** *(block)* | How this connects to company strategy or OKRs |
| **Why Now** *(block)* | What makes this outcome urgent or timely |
| **Risk of Inaction** *(block)* | What happens if we don't pursue this |

### Product Outcome
| Field | What to fill |
|-------|-------------|
| **Title** | The user behaviour change — measurable (e.g. "5 builders actively using the tool in 3 months") |
| **Description** | What user behaviour change will drive the business outcome |
| **Persona(s)** | Who the target users are — one or more personas |
| **Key Metric** *(metric block)* | Metric name + current value + target + timeframe |
| **Strategic Alignment** *(block)* | How this maps to the business outcome above |
| **Constraints** *(block)* | Technical, business, or resource constraints |
| **Trade-offs** *(block)* | What we're choosing not to do |

### Opportunity
| Field | What to fill |
|-------|-------------|
| **Title** | The user need/pain in their words — ideally a first-person quote |
| **Description** | The unmet need, pain point, or desire (problem space only) |
| **Persona** | Which persona experiences this opportunity |
| **Trigger** *(block)* | When exactly this problem occurs — the context of the need |
| **Current Workaround** *(block)* | How users solve this today without our product |
| **Competition View** *(block)* | How competitors or alternatives address this |
| **ICE Score** *(optional)* | Impact / Confidence / Ease score for prioritisation |

### Solution
| Field | What to fill |
|-------|-------------|
| **Title** | The solution name — specific enough to be actionable |
| **Description** | What this solution is and how it addresses the parent opportunity |
| **Why It Works** *(block)* | How this solution addresses the parent opportunity |
| **Trade-offs** *(block)* | What we're giving up with this approach |
| **High-Level User Journey** *(block)* | The main flow a user would take through this feature |

### Assumption
| Field | What to fill |
|-------|-------------|
| **Title** | The assumption — framed as "We believe X is true" |
| **Description** | What must be true for the solution to work |
| **Assumption Type** | One of: `desirability` · `usability` · `feasibility` · `viability` · `ethical` |
| **Impact if True** *(block)* | What happens if this assumption holds — how it affects solution success |
| **Evidence** *(block)* | What evidence exists for or against this assumption today |

### Test
| Field | What to fill |
|-------|-------------|
| **Title** | The test name — what experiment this is |
| **Description** | What evaluative method will be used to validate or invalidate the assumption |
| **Test Type** | One of: `prototype` · `survey` · `data_mining` · `research_spike` |
| **Define Test** *(block)* | The specific experiment or measurement design |
| **Pass / Fail Criteria** *(block)* | The observable threshold that determines true or false — defined before running |

---

## Common PM Thinking Mistakes to Catch

1. **Solution-space language in opportunities** — if an opportunity block describes what the product does, push it down to the solution layer
2. **Missing the "why" chain** — a solution without a clear parent opportunity is a feature without a problem
3. **Assumptions stated as facts** — "Users will adopt this" is an assumption, not a given; it needs a test
4. **Tests marked done without findings** — a designed test is not a done test
5. **Committing before validating critical assumptions** — solutions with high-risk unvalidated assumptions should stay in `explore`
