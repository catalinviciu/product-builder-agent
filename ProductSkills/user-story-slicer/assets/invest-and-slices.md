# INVEST Criteria & Vertical Slices

## INVEST Quality Criteria

Every story must pass INVEST (Bill Wake, 2003). This is the primary quality gate.

| Letter | Criterion | What it means | Anti-pattern |
|--------|-----------|---------------|--------------|
| **I** | Independent | Can be prioritized and delivered without depending on another story | Story A can't be tested until Story B is done |
| **N** | Negotiable (Precise when AI builds) | Describes *what* the user achieves, leaving room for conversation about *how*. **When AI builds:** the story should be precise, not open-ended | Story reads like a contract with click-by-click instructions / Story is so vague AI has to guess |
| **V** | Valuable | Delivers a visible increment of value to the user | "Create database migration" -- that's a task, not value |
| **E** | Estimable | Team can scope the work from the description | Too vague ("improve the system") or too micro ("press Enter") |
| **S** | Small | Fits comfortably in a sprint -- rule of thumb: 6-10 stories per sprint | Story takes the entire sprint or spans multiple sprints |
| **T** | Testable | Has clear pass/fail criteria you can verify | "The system should be user-friendly" -- not testable |

**Tension between criteria:** As stories get smaller, it's harder to keep them independent and valuable. Different attributes matter at different times:
- **Sprint planning:** Small, Estimable, Testable matter most
- **Further out:** Independent, Negotiable, Valuable matter most

---

## Vertical Slices vs. Horizontal Slices

### Vertical Slice (GOOD)
A work item that delivers a valuable change in system behavior, touching multiple architectural layers (UI, logic, data) as needed. When you call it "done," the system is observably more valuable to a user.

### Horizontal Slice (BAD)
A work item scoped to one architectural layer (e.g., "build the API endpoint" or "create the database table"). Must be combined with other slices to deliver any user value. Fails the **Independent** and **Valuable** criteria.

```
           UI          Logic        Database
         ┌──────────┬──────────┬──────────┐
         │          │          │          │
Vertical │ ████████ │ ████████ │ ████████ │  ← Delivers value
Slice    │          │          │          │
         ├──────────┼──────────┼──────────┤
         │          │          │          │
Horiz.   │ ████████ │          │          │  ← No value alone
Slice    │          │          │          │
         └──────────┴──────────┴──────────┘
```

**Why vertical slices matter:**
- Make value explicit in the backlog
- Get value and feedback sooner
- Prevent accidentally building low-value changes
- Increase predictability (working software = primary measure of progress)

---

## Evaluating a Split

When multiple patterns apply, choose the split that:

1. **Lets you deprioritize or discard a story** -- the 80/20 principle says most value comes from a small share of the functionality
2. **Produces more equally-sized stories** -- an 8-point story split into four 2s is better than a 5 and a 3
