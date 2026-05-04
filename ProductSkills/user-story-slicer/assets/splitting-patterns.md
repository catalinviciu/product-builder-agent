# 9 Patterns for Splitting User Stories

When a story is too big, apply one of these patterns. The meta-pattern: **find the complexity, reduce the variations to one**.

---

## Pattern 1: Workflow Steps

Split a multi-step workflow into its phases. Build the simple end-to-end case first, then add middle steps.

**Before:** As a content manager, I can publish a news story to the corporate website.

**After:**
- ...I can publish a news story directly to the corporate website
- ...I can publish a news story with editor review
- ...I can publish a news story with legal review
- ...I can view a news story on a staging site

**Warning:** Don't split one step at a time from beginning to end. Find a thin slice through the *whole* workflow first.

---

## Pattern 2: Operations (CRUD)

The word "manage" is a giveaway that the story covers multiple operations.

**Before:** As a user, I can manage my account.

**After:**
- ...I can sign up for an account
- ...I can edit my account settings
- ...I can cancel my account

---

## Pattern 3: Business Rule Variations

Different business rules that produce the same outcome can each be a separate story.

**Before:** As a user, I can search for flights with flexible dates.

**After:**
- ...as "n days between x and y"
- ...as "a weekend in December"
- ...as "+/- n days of x and y"

---

## Pattern 4: Variations in Data

When complexity comes from handling different data types or formats.

**Before:** As a user, I can search for providers by trip origin and destination.

**After:**
- ...by counties (simplest)
- ...by counties, cities, towns, or neighborhoods (added later as needed)

---

## Pattern 5: Data Entry Methods

When UI complexity is the issue, build with the simplest UI first.

**Before:** As a user, I can search for flights between two destinations.

**After:**
- ...using simple date input
- ...with a fancy calendar UI

---

## Pattern 6: Major Effort (First + Rest)

When the first implementation carries most of the infrastructure cost.

**Before:** As a user, I can pay with VISA, MasterCard, Diners Club, or American Express.

**After:**
- ...I can pay with one credit card type (defer which one)
- ...I can pay with all four credit card types (given one already works)

---

## Pattern 7: Simple/Complex

Keep the core simple. Move every variation and edge case into its own story.

**Before:** As a user, I can search for flights between two destinations.

**After:**
- ...basic search (simplest version)
- ...specifying a max number of stops
- ...including nearby airports
- ...using flexible dates

---

## Pattern 8: Defer Performance

Split "make it work" from "make it fast" (or secure, or scalable).

**Before:** As a user, I can search for flights between two destinations.

**After:**
- ...search works (show a "searching" animation)
- ...search completes in under 5 seconds

**Caution:** Don't accumulate technical debt by habitually deferring non-functionals.

---

## Pattern 9: Break Out a Spike

Last resort when implementation is poorly understood. Time-box the research.

**Before:** As a user, I can pay by credit card.

**After:**
- Investigate credit card processing (acceptance criteria = questions to answer)
- Implement credit card processing

**Use sparingly.** Try patterns 1-8 first.
