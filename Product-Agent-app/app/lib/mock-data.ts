import type { EntityStore, DiscoveryTree, ProductLine } from "./schemas";

// ════════════════════════════════════════════════════════════════════════════
// PRODUCT LINE 1: FreshCart (B2C Grocery Delivery)
// ════════════════════════════════════════════════════════════════════════════

const FRESHCART_TREE: DiscoveryTree = {
  title: "Product Line: FreshCart",
  description: "Grocery delivery product discovery — mapping business outcomes to validated experiments",
  rootChildren: ["bo-1", "bo-2"],
};

const FRESHCART_ENTITIES: EntityStore = {
  "bo-1": {
    id: "bo-1",
    level: "business_outcome",
    title: "Increase annual revenue by 20%",
    icon: "Target",
    status: "commit",
    description: "FreshCart needs to grow from €12M to €14.4M ARR by end of FY 2026. This is the primary growth target agreed with the board and underpins our Series B fundraise narrative.",
    children: ["po-1a", "po-1b"],
    blocks: [
      { id: "bo-1-b0", type: "metric", metric: "Annual Recurring Revenue", currentValue: "€12M", targetValue: "€14.4M", timeframe: "FY 2026", frequency: "monthly", valueFormat: "currency_eur", initialValue: 12000000, numericTarget: 14400000, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "bo-1-b1", type: "accordion", label: "Strategic Alignment", content: "This aligns with FreshCart's **\"Growth through Retention\"** strategy — the board has determined that acquiring new customers costs 5× more than increasing value from existing ones. Revenue growth must come from a mix of order frequency and basket size, not just acquisition spend.\n\nThe Series B term sheet explicitly references a path to €14.4M ARR as the milestone for the next raise." },
      { id: "bo-1-b2", type: "accordion", label: "Why Now", content: "Three converging signals make this urgent:\n\n1. **Competitor pressure** — Gorillas and Getir are expanding into our core markets (Berlin, Amsterdam) with aggressive discounting\n2. **Unit economics window** — Our delivery cost per order dropped 18% after the warehouse automation rollout in Q3 2025. We have a 6-month window to capitalize before competitors catch up\n3. **Seasonal tailspin** — Q1 is historically our weakest quarter. If we don't ship retention features by March, we lose the spring/summer growth wave" },
      { id: "bo-1-b3", type: "accordion", label: "Risk of Inaction", content: "Without hitting €14.4M ARR:\n\n- **Series B at risk** — Lead investor has signaled they won't proceed below €13.5M ARR\n- **Market share erosion** — Gorillas' Berlin launch is projected to capture 8-12% of our active user base within 6 months\n- **Team attrition** — Engineering team has equity tied to revenue milestones; missing targets could trigger departures" },
    ],
  },
  "bo-2": {
    id: "bo-2",
    level: "business_outcome",
    title: "Expand to 3 new European cities by Q4 2026",
    icon: "Target",
    status: "commit",
    description: "FreshCart operates in 4 cities today. Expanding to Vienna, Copenhagen, and Lisbon unlocks a €2.8B addressable market and demonstrates geographic scalability for investors.",
    children: ["po-2a"],
    blocks: [
      { id: "bo-2-b0", type: "metric", metric: "New city launches at 10K orders/month", currentValue: "0 new cities", targetValue: "3 cities live", timeframe: "Q4 2026", frequency: "monthly", valueFormat: "number", initialValue: 0, numericTarget: 3, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "bo-2-b1", type: "accordion", label: "Strategic Alignment", content: "Geographic expansion is pillar #2 of FreshCart's growth strategy. The board views multi-country presence as a **moat** — it signals to investors that the model isn't market-specific and creates operational leverage through shared tech infrastructure.\n\nExpansion cities were selected based on: population density, existing grocery delivery penetration (<15%), and regulatory friendliness." },
      { id: "bo-2-b2", type: "accordion", label: "Why Now", content: "- **Regulatory window** — Vienna's new \"quick commerce\" licensing framework launches in April 2026, with a 6-month first-mover advantage for early applicants\n- **Partnership pipeline** — We have LOIs from 12 store chains across the 3 target cities, but they expire by Q3 2026\n- **Competitor lockout** — Flink is rumored to be eyeing Copenhagen for Q1 2027. Launching first gives us 6+ months of brand establishment" },
      { id: "bo-2-b3", type: "accordion", label: "Risk of Inaction", content: "- **LOI expiry** — 12 signed letters of intent expire Q3 2026; re-negotiation would take 4-6 months\n- **Investor narrative collapse** — Series B deck promises \"pan-European\" presence; 0 new cities undermines the story\n- **Engineering morale** — International launch is the #1 exciting project for the eng team; delaying it risks losing key talent to competitors" },
    ],
  },
  "po-1a": {
    id: "po-1a",
    level: "product_outcome",
    title: "Increase weekly active orderers by 15%",
    icon: "TrendingUp",
    status: "commit",
    parentId: "bo-1",
    description: "Our core retention metric. Currently 48K users place at least one order per week. Target: 55.2K weekly active orderers. This directly feeds revenue because our average order is €38 — each additional weekly orderer is worth ~€1,976/year.",
    children: ["opp-1", "opp-2"],
    blocks: [
      { id: "po-1a-b0", type: "metric", metric: "Weekly Active Orderers (WAO)", currentValue: "48K", targetValue: "55.2K", frequency: "weekly", valueFormat: "number", initialValue: 48000, numericTarget: 55200, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "po-1a-b1", type: "accordion", label: "Personas", content: "**Primary: The Busy Parent (\"Sarah\")**\n- Age 30-42, dual-income household, 1-2 kids\n- Orders 2-3× per week, average basket €45\n- Pain: substitutions ruin meal plans; delivery slots are confusing\n- Behavior: shops on mobile during commute, wants speed over browsing\n\n**Secondary: The Health-Conscious Single (\"Marco\")**\n- Age 25-35, urban professional\n- Orders 1-2× per week, average basket €28\n- Pain: hard to find specialty/organic items; wants nutritional info\n- Behavior: browses recipes then shops ingredients" },
      { id: "po-1a-b2", type: "accordion", label: "Constraints", content: "- **No price increases** — Board has ruled out raising delivery fees or item markups in 2026\n- **Existing warehouse capacity** — Can handle 20% more orders without new infrastructure\n- **3-person product team** — Must choose bets carefully; can't run more than 2 major initiatives per quarter\n- **GDPR compliance** — All personalization features must have explicit opt-in" },
      { id: "po-1a-b3", type: "accordion", label: "Trade-offs", content: "- **Retention vs. Acquisition**: We're betting that retaining existing users yields higher ROI than acquiring new ones. If wrong, we should redirect budget to paid acquisition.\n- **Personalization vs. Privacy**: ML-powered features (substitution engine, recommendations) require user behavior data. Users who opt out get a degraded experience.\n- **Speed vs. Quality**: Faster shipping (30-min) could increase orders but may reduce picker accuracy. We're prioritizing accuracy for now." },
      { id: "po-1a-b4", type: "accordion", label: "Assumptions", content: "- Users who order 3+ times in their first month have 80% 6-month retention\n- Substitution quality is the #1 driver of repeat orders (based on NPS verbatims)\n- Mobile-first users convert 2× better than desktop users" },
    ],
  },
  "po-1b": {
    id: "po-1b",
    level: "product_outcome",
    title: "Increase average order value by 10%",
    icon: "TrendingUp",
    status: "commit",
    parentId: "bo-1",
    description: "Current AOV is €38. Target: €41.80. Growing basket size is the most capital-efficient path to revenue growth — no additional delivery cost per incremental item.",
    children: ["opp-3"],
    blocks: [
      { id: "po-1b-b0", type: "metric", metric: "Average Order Value (AOV)", currentValue: "€38", targetValue: "€41.80", frequency: "weekly", valueFormat: "currency_eur", initialValue: 38, numericTarget: 41.80, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "po-1b-b1", type: "accordion", label: "Personas", content: "**Primary: The Meal Planner (\"Sarah\" again)**\n- Already buys staples; opportunity is adding recipe ingredients, snacks, household items\n- Responds well to \"complete the meal\" suggestions\n\n**Secondary: The Impulse Adder (\"Lena\")**\n- Age 22-30, orders for convenience\n- Susceptible to last-minute add-ons at checkout\n- Responds to social proof (\"Popular in your area\")" },
      { id: "po-1b-b2", type: "accordion", label: "Constraints", content: "- **No dark patterns** — Product principle: never trick users into buying more\n- **Delivery bag limit** — Max 3 bags per delivery; can't push AOV by adding bulky items\n- **Margin preservation** — Promoted items must maintain >15% gross margin" },
      { id: "po-1b-b3", type: "accordion", label: "Trade-offs", content: "- **AOV vs. Order Frequency**: If we push too hard on basket size, users might consolidate orders (buy more, less often), which hurts the WAO metric.\n- **Suggestions vs. Clutter**: More recommendations = more potential add-ons, but also more visual noise in the checkout flow." },
      { id: "po-1b-b4", type: "accordion", label: "Assumptions", content: "- Users plan meals but shop for individual items (behavior mismatch)\n- Recipe-based suggestions will increase items per cart by ≥3\n- Users won't reduce order frequency if basket size grows" },
    ],
  },
  "po-2a": {
    id: "po-2a",
    level: "product_outcome",
    title: "Achieve 10K orders/month within 3 months of city launch",
    icon: "TrendingUp",
    status: "commit",
    parentId: "bo-2",
    description: "Each new city must reach operational viability (10K orders/month) within 90 days of launch. Below this threshold, unit economics don't work and we bleed cash on fixed warehouse/delivery costs.",
    children: ["opp-4"],
    blocks: [
      { id: "po-2a-b0", type: "metric", metric: "Monthly orders per new city", currentValue: "0 (pre-launch)", targetValue: "10K orders/month", frequency: "monthly", valueFormat: "number", initialValue: 0, numericTarget: 10000, startDate: "2026-04-01", endDate: "2026-12-31" },
      { id: "po-2a-b1", type: "accordion", label: "Personas", content: "**New City Early Adopter**\n- Tech-savvy, 25-40, already uses delivery apps (Wolt, Deliveroo)\n- Willing to try new services but switches fast if experience is poor\n- Values: local store selection, fast delivery, transparent pricing" },
      { id: "po-2a-b2", type: "accordion", label: "Constraints", content: "- **No existing brand awareness** — Must build trust from zero in each city\n- **Local store catalog required** — Users won't order if their preferred local stores aren't available\n- **Lean launch budget** — €50K marketing budget per city; must rely on organic/referral growth\n- **Local language support** — App must be localized before launch" },
      { id: "po-2a-b3", type: "accordion", label: "Trade-offs", content: "- **Speed to launch vs. Catalog depth**: We could launch faster with fewer stores, but thin selection leads to poor first impressions.\n- **Self-serve vs. Sales-assisted onboarding**: Self-serve is cheaper but might not work for less tech-savvy store owners." },
      { id: "po-2a-b4", type: "accordion", label: "Assumptions", content: "- Store owners will complete onboarding without a dedicated sales rep\n- 30% of first-week users will place a second order within 14 days\n- Referral program will drive 40% of first-month signups" },
    ],
  },

  // ── Opportunities ────────────────────────────────────────────────────────
  "opp-1": {
    id: "opp-1", level: "opportunity", title: "Cart abandonment from poor substitution suggestions", icon: "Lightbulb", status: "commit", parentId: "po-1a", personaId: "persona-fc-busy-parent",
    description: "When items are out of stock, our current substitution logic picks alternatives based on category + price. Users frequently reject these substitutions, leading to incomplete orders and frustration. 23% of orders with substitutions result in the user removing items entirely rather than accepting the suggestion.",
    iceScore: { i: 8, c: 7, e: 5 },
    children: ["sol-1", "sol-2"],
    blocks: [
      { id: "opp-1-b0", type: "quote", content: "I ordered organic whole milk and they suggested fat-free almond milk. That's not even close. I just deleted the item and went to the store myself.", attribution: "Sarah, Berlin, interview #14" },
      { id: "opp-1-b1", type: "pills", items: [{ label: "Frequency", value: "Substitutions occur in 34% of orders; 23% of those lead to item removal or order abandonment" }, { label: "Impact", value: "High — Each abandoned substitution loses ~€4.20 in basket value. At scale, this is €180K/year in lost revenue." }] },
      { id: "opp-1-b2", type: "accordion", label: "Current Workaround", content: "Users add notes like \"NO substitutions please\" or \"only substitute with same brand.\" Pickers call customers during shopping, but only 40% answer." },
      { id: "opp-1-b3", type: "accordion", label: "Market Evidence", content: "Instacart's \"preference-based substitution\" feature reduced substitution rejections by 35% (Q3 2024 earnings call). Ocado reports that AI-driven substitutions increased basket completion by 12%." },
    ],
  },
  "opp-2": {
    id: "opp-2", level: "opportunity", title: "First-time users don't understand delivery time slots", icon: "Lightbulb", status: "commit", parentId: "po-1a", personaId: "persona-fc-busy-parent",
    description: "Our onboarding flow asks new users to select a delivery time slot before their first order. The current slot picker is a text-based list of times. 31% of first-time users abandon during slot selection — the highest drop-off point in the checkout funnel.",
    iceScore: { i: 7, c: 8, e: 3 },
    children: ["sol-3"],
    blocks: [
      { id: "opp-2-b0", type: "quote", content: "I didn't understand if '2-4pm' means it arrives at 2 or somewhere in that window. I just wanted it today, but all the 'today' slots were grey and I couldn't tell if that meant sold out or what.", attribution: "Marco, Amsterdam, usability test #7" },
      { id: "opp-2-b1", type: "pills", items: [{ label: "Frequency", value: "100% of first-time orders require slot selection; 31% abandon at this step" }, { label: "Impact", value: "High — 31% first-order drop-off translates to ~1,400 lost new customers/month" }] },
      { id: "opp-2-b2", type: "accordion", label: "Current Workaround", content: "Some users select the first available slot without understanding it, leading to missed deliveries and support tickets. Others call friends who already use FreshCart to explain the system." },
      { id: "opp-2-b3", type: "accordion", label: "Market Evidence", content: "Amazon Fresh moved to a visual calendar-style slot picker and reported 18% improvement in first-order completion. Picnic (Netherlands) uses a \"next available\" default with visual slot picker as optional — their first-order completion is 82% vs. our 69%." },
    ],
  },
  "opp-3": {
    id: "opp-3", level: "opportunity", title: "Users miss complementary items they'd want", icon: "Lightbulb", status: "commit", parentId: "po-1b", personaId: "persona-fc-impulse-adder",
    description: "Users shop for individual ingredients but think in terms of meals. They frequently forget items that would complete a recipe or complement their basket. Post-order surveys show 42% of users wish they'd \"remembered to add something\" — most commonly herbs, sauces, or side ingredients.",
    iceScore: { i: 6, c: 5, e: 7 },
    children: ["sol-4"],
    blocks: [
      { id: "opp-3-b0", type: "quote", content: "I bought pasta and tomatoes but forgot to get basil and parmesan. Every time. I wish the app just told me what I'm missing for the meal I'm obviously making.", attribution: "Lena, Munich, diary study #3" },
      { id: "opp-3-b1", type: "pills", items: [{ label: "Frequency", value: "42% of users report forgetting complementary items; average of 1.8 forgotten items per order" }, { label: "Impact", value: "Medium-High — Each forgotten item is a missed €2-5 in basket value. At 42% frequency × 85K orders/week = ~€350K/year opportunity." }] },
      { id: "opp-3-b2", type: "accordion", label: "Current Workaround", content: "Power users keep a running shopping list in Apple Notes. Some screenshot recipes before ordering. A few users place a second \"oops I forgot\" order (costly for us — double delivery)." },
      { id: "opp-3-b3", type: "accordion", label: "Market Evidence", content: "Kroger's \"Complete Your Meal\" feature increased AOV by 8% in pilot stores. HelloFresh's entire model is built on the insight that people want meal-level shopping, not item-level." },
    ],
  },
  "opp-4": {
    id: "opp-4", level: "opportunity", title: "Local store partnerships take too long to close", icon: "Lightbulb", status: "commit", parentId: "po-2a", personaId: "persona-fc-health-single",
    description: "Onboarding a new store partner currently takes 3-6 weeks from first contact to live catalog. The process requires a sales rep visit, paper contract signing, manual catalog upload, and quality verification. This bottleneck means we can't launch a new city with sufficient store coverage.",
    children: ["sol-5"],
    blocks: [
      { id: "opp-4-b0", type: "quote", content: "Your sales guy visited three weeks ago and I signed the papers. But my store still isn't on the app. My customers keep asking when they can order from me on FreshCart.", attribution: "Store owner, pilot city feedback" },
      { id: "opp-4-b1", type: "pills", items: [{ label: "Frequency", value: "Each new city requires 20-30 store partnerships; at current pace, that's 3-6 months of sales work per city" }, { label: "Impact", value: "Critical — Without sufficient store coverage at launch, users find nothing to buy and churn permanently. Cities that launched with <15 stores had 60% lower 90-day retention." }] },
      { id: "opp-4-b2", type: "accordion", label: "Current Workaround", content: "Sales team works overtime. We sometimes launch with fewer stores and hope to add more post-launch, but user reviews suffer (\"nothing available in my neighborhood\")." },
      { id: "opp-4-b3", type: "accordion", label: "Market Evidence", content: "DoorDash's self-serve restaurant onboarding reduced time-to-live from 14 days to 48 hours and scaled them to 300K+ merchants. Shopify's self-serve model proves that even complex onboarding (payments, shipping, catalog) can be self-serve if the UX is good." },
    ],
  },

  // ── Solutions ────────────────────────────────────────────────────────────
  "sol-1": {
    id: "sol-1", level: "solution", title: "ML-powered substitution engine with preference learning", icon: "Puzzle", status: "commit", parentId: "opp-1",
    description: "Replace the current category+price substitution logic with an ML model that learns individual user preferences. The model considers: past purchase history, dietary tags (vegan, gluten-free), brand preferences, and explicit substitution rules set by the user.\n\nThe engine ranks substitution candidates by predicted acceptance probability and presents the top 3 options to the user (instead of forcing a single suggestion).",
    children: ["asm-1", "asm-2"],
    blocks: [
      { id: "sol-1-b0", type: "quote", content: "As a returning customer, I want substitution suggestions that match my actual preferences so that out-of-stock items don't ruin my order or force me to go to a physical store." },
      { id: "sol-1-b1", type: "pills", items: [{ label: "Effort", value: "3-4 weeks" }, { label: "Confidence", value: "medium" }] },
      { id: "sol-1-b2", type: "accordion", label: "How it works", content: "Replace the current category+price substitution logic with an ML model that learns individual user preferences. The model considers: past purchase history, dietary tags (vegan, gluten-free), brand preferences, and explicit substitution rules set by the user.\n\nThe engine ranks substitution candidates by predicted acceptance probability and presents the top 3 options to the user (instead of forcing a single suggestion)." },
      { id: "sol-1-b3", type: "accordion", label: "Differentiator", content: "Most competitors use simple rule-based substitutions (same category, similar price). A preference-learning engine would be a genuine differentiator that improves with every order." },
    ],
  },
  "sol-2": {
    id: "sol-2", level: "solution", title: "Real-time chat with personal shopper during picking", icon: "Puzzle", status: "commit", parentId: "opp-1",
    description: "When a picker encounters an out-of-stock item, they send a real-time notification to the customer with a photo of the shelf and available alternatives. The customer can respond via chat to approve a substitution, reject it, or suggest their own alternative.",
    children: ["asm-3", "asm-4"],
    blocks: [
      { id: "sol-2-b0", type: "quote", content: "As a customer whose item is out of stock, I want to see what's actually available on the shelf right now so I can choose my own substitution instead of getting a random suggestion." },
      { id: "sol-2-b1", type: "pills", items: [{ label: "Effort", value: "4-5 weeks" }, { label: "Confidence", value: "low" }] },
      { id: "sol-2-b2", type: "accordion", label: "How it works", content: "When a picker encounters an out-of-stock item, they send a real-time notification to the customer with a photo of the shelf and available alternatives. The customer can respond via chat to approve a substitution, reject it, or suggest their own alternative." },
      { id: "sol-2-b3", type: "accordion", label: "Differentiator", content: "Creates a \"personal shopping\" experience that builds emotional loyalty. Competitors offer this only at premium tiers ($15/month for Instacart+)." },
    ],
  },
  "sol-3": {
    id: "sol-3", level: "solution", title: "Interactive onboarding with visual slot picker", icon: "Puzzle", status: "commit", parentId: "opp-2",
    description: "Replace the text-based time slot list with a visual calendar-style picker. Show delivery windows as colored blocks (green = available, amber = filling up, grey = full). Add a \"Fastest available\" button as the default option.",
    children: ["asm-5", "asm-6"],
    blocks: [
      { id: "sol-3-b0", type: "quote", content: "As a first-time user, I want to quickly see when I can get my groceries delivered so I don't have to decode a confusing list of time windows." },
      { id: "sol-3-b1", type: "pills", items: [{ label: "Effort", value: "2-3 weeks" }, { label: "Confidence", value: "high" }] },
      { id: "sol-3-b2", type: "accordion", label: "How it works", content: "Replace the text-based time slot list with a visual calendar-style picker. Show delivery windows as colored blocks (green = available, amber = filling up, grey = full). Add a \"Fastest available\" button as the default option." },
      { id: "sol-3-b3", type: "accordion", label: "Differentiator", content: "Simple but impactful UX improvement. The visual picker + \"fastest available\" default matches mental models from Uber/Lyft that our target users already understand." },
    ],
  },
  "sol-4": {
    id: "sol-4", level: "solution", title: "Recipe-based cart builder (\"Make this meal\")", icon: "Puzzle", status: "commit", parentId: "opp-3",
    description: "Add a \"Meals\" tab that suggests recipes based on the user's current cart contents and past orders. When a user taps a recipe, all missing ingredients are added to the cart with one tap.",
    children: ["asm-7", "asm-8"],
    blocks: [
      { id: "sol-4-b0", type: "quote", content: "As a user who's buying pasta and tomatoes, I want the app to suggest \"You're making pasta — add basil, parmesan, and garlic?\" so I don't forget anything." },
      { id: "sol-4-b1", type: "pills", items: [{ label: "Effort", value: "4-5 weeks" }, { label: "Confidence", value: "medium" }] },
      { id: "sol-4-b2", type: "accordion", label: "How it works", content: "Add a \"Meals\" tab that suggests recipes based on the user's current cart contents and past orders. When a user taps a recipe, all missing ingredients are added to the cart with one tap." },
      { id: "sol-4-b3", type: "accordion", label: "Differentiator", content: "Moves FreshCart from \"item shopping\" to \"meal shopping\" — a category shift that HelloFresh proved has massive consumer appeal." },
    ],
  },
  "sol-5": {
    id: "sol-5", level: "solution", title: "Self-serve store onboarding portal", icon: "Puzzle", status: "commit", parentId: "opp-4",
    description: "Build a web portal where store owners can create an account, upload their catalog, set delivery zones and hours, sign the partnership agreement digitally, and go live — all without talking to a sales rep.",
    children: ["asm-9", "asm-10"],
    blocks: [
      { id: "sol-5-b0", type: "quote", content: "As a store owner interested in FreshCart, I want to sign up and get my store listed on the app within 48 hours so I can start receiving orders without waiting for a sales representative." },
      { id: "sol-5-b1", type: "pills", items: [{ label: "Effort", value: "5-6 weeks" }, { label: "Confidence", value: "medium" }] },
      { id: "sol-5-b2", type: "accordion", label: "How it works", content: "Build a web portal where store owners can create an account, upload their catalog, set delivery zones and hours, sign the partnership agreement digitally, and go live — all without talking to a sales rep." },
      { id: "sol-5-b3", type: "accordion", label: "Differentiator", content: "Most grocery delivery platforms still require sales-assisted onboarding. A self-serve portal would let us scale to 100+ stores per city in weeks instead of months." },
    ],
  },

  // ── Assumptions ──────────────────────────────────────────────────────────
  "asm-1": {
    id: "asm-1", level: "assumption", title: "Users will trust AI-suggested substitutions", icon: "HelpCircle", status: "commit", parentId: "sol-1",
    description: "We believe that users will accept substitution suggestions from an ML model at a higher rate than the current rule-based system. The key risk is that users may distrust \"AI\" recommendations for food.",
    children: ["tst-1"],
    blocks: [
      { id: "asm-1-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "medium" }] },
      { id: "asm-1-b1", type: "accordion", label: "If False", content: "We'd need to add a \"substitution preferences\" setup flow where users explicitly tell us their rules (e.g., \"always choose organic,\" \"never substitute dairy\")." },
    ],
  },
  "asm-2": {
    id: "asm-2", level: "assumption", title: "Purchase history predicts substitution preferences", icon: "HelpCircle", status: "commit", parentId: "sol-1",
    description: "We believe that a user's past purchase behavior (brands bought, dietary patterns, price sensitivity) is a strong enough signal to predict which substitutions they'll accept.",
    children: ["tst-2"],
    blocks: [
      { id: "asm-2-b0", type: "pills", items: [{ label: "Category", value: "feasibility" }, { label: "Risk", value: "medium" }] },
      { id: "asm-2-b1", type: "accordion", label: "If False", content: "We'd need to combine it with explicit preference signals (user-set rules, dietary profiles) or collaborative filtering." },
    ],
  },
  "asm-3": {
    id: "asm-3", level: "assumption", title: "Customers respond within 2-minute picking window", icon: "HelpCircle", status: "commit", parentId: "sol-2",
    description: "The personal shopper chat only works if customers respond fast enough that the picker doesn't have to wait. Our picking process allows ~2 minutes per item.",
    children: ["tst-3"],
    blocks: [
      { id: "asm-3-b0", type: "pills", items: [{ label: "Category", value: "usability" }, { label: "Risk", value: "high" }] },
      { id: "asm-3-b1", type: "accordion", label: "If False", content: "We'd need to pre-collect substitution preferences before the order or use a hybrid approach where chat is offered but the ML engine provides a fallback after 90 seconds." },
    ],
  },
  "asm-4": {
    id: "asm-4", level: "assumption", title: "Shopper labor cost is less than substitution refund cost", icon: "HelpCircle", status: "commit", parentId: "sol-2",
    description: "The chat feature adds time to the picking process (~3-5 minutes per substitution event). This additional labor cost must be less than what we currently spend on substitution-related refunds.",
    children: ["tst-4"],
    blocks: [
      { id: "asm-4-b0", type: "pills", items: [{ label: "Category", value: "viability" }, { label: "Risk", value: "medium" }] },
      { id: "asm-4-b1", type: "accordion", label: "If False", content: "The personal shopper chat isn't economically viable as a standard feature. We'd limit it to high-value orders (>€60) or offer it as a premium add-on." },
    ],
  },
  "asm-5": {
    id: "asm-5", level: "assumption", title: "Visual slot picker reduces first-order drop-off", icon: "HelpCircle", status: "commit", parentId: "sol-3",
    description: "We believe that replacing the text-based slot list with a visual calendar picker and a \"fastest available\" default will significantly reduce the 31% first-order drop-off at the slot selection step.",
    children: ["tst-5"],
    blocks: [
      { id: "asm-5-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "low" }] },
      { id: "asm-5-b1", type: "accordion", label: "If False", content: "If drop-off isn't caused by UI confusion, a visual redesign won't help. We'd need to investigate the real cause via session recordings and exit surveys." },
    ],
  },
  "asm-6": {
    id: "asm-6", level: "assumption", title: "Users prefer choosing slots over 'fastest available'", icon: "HelpCircle", status: "commit", parentId: "sol-3",
    description: "We assume most first-time users will use \"fastest available\" for their first order, but will switch to manual slot selection for subsequent orders.",
    children: ["tst-6"],
    blocks: [
      { id: "asm-6-b0", type: "pills", items: [{ label: "Category", value: "usability" }, { label: "Risk", value: "low" }] },
      { id: "asm-6-b1", type: "accordion", label: "If False", content: "If >90% of users always pick \"fastest available,\" we can simplify the checkout by making that the default — saving significant dev effort on the visual picker." },
    ],
  },
  "asm-7": {
    id: "asm-7", level: "assumption", title: "Users plan meals, not individual items", icon: "HelpCircle", status: "commit", parentId: "sol-4",
    description: "The recipe-based cart builder only works if users actually think about meals before or during shopping. If most users shop opportunistically, recipe suggestions won't match their mental model.",
    children: ["tst-7"],
    blocks: [
      { id: "asm-7-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "medium" }] },
      { id: "asm-7-b1", type: "accordion", label: "If False", content: "We'd pivot to a simpler \"frequently bought together\" recommendation engine rather than a full recipe-based approach." },
    ],
  },
  "asm-8": {
    id: "asm-8", level: "assumption", title: "Recipe suggestions increase items per cart by >=3", icon: "HelpCircle", status: "commit", parentId: "sol-4",
    description: "For this feature to meaningfully impact AOV, each recipe suggestion accepted must add at least 3 items to the cart (≈€6-10 in value).",
    children: ["tst-8"],
    blocks: [
      { id: "asm-8-b0", type: "pills", items: [{ label: "Category", value: "viability" }, { label: "Risk", value: "medium" }] },
      { id: "asm-8-b1", type: "accordion", label: "If False", content: "We'd need to explore higher-value suggestions (premium ingredients, meal kits) or combine with other AOV tactics." },
    ],
  },
  "asm-9": {
    id: "asm-9", level: "assumption", title: "Store owners can complete onboarding without a sales rep", icon: "HelpCircle", status: "commit", parentId: "sol-5",
    description: "We believe that store owners can successfully navigate a self-serve web portal to create an account, upload their catalog, set delivery parameters, and sign a digital contract — all without human assistance.",
    children: ["tst-9"],
    blocks: [
      { id: "asm-9-b0", type: "pills", items: [{ label: "Category", value: "usability" }, { label: "Risk", value: "high" }] },
      { id: "asm-9-b1", type: "accordion", label: "If False", content: "We'd need a \"guided self-serve\" model — automated portal with optional video call support." },
    ],
  },
  "asm-10": {
    id: "asm-10", level: "assumption", title: "Catalog upload can be automated from POS exports", icon: "HelpCircle", status: "commit", parentId: "sol-5",
    description: "Most stores use a POS system that can export product catalogs. We assume we can build parsers for the top 5 POS systems (covering ~70% of target stores).",
    children: ["tst-10"],
    blocks: [
      { id: "asm-10-b0", type: "pills", items: [{ label: "Category", value: "feasibility" }, { label: "Risk", value: "medium" }] },
      { id: "asm-10-b1", type: "accordion", label: "If False", content: "We'd need to build a manual catalog entry tool with bulk upload + AI-assisted image/description generation." },
    ],
  },

  // ── Tests ────────────────────────────────────────────────────────────────
  "tst-1": {
    id: "tst-1", level: "test", title: "Fake-door test for AI substitution opt-in", icon: "FlaskConical", status: "commit", parentId: "asm-1",
    description: "At least 40% of users who encounter a substitution will opt into \"Smart Substitutions powered by AI\" when presented with a toggle during checkout.",
    children: [],
    blocks: [
      { id: "tst-1-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-1-b1", type: "quote", content: "At least 40% of users who encounter a substitution will opt into \"Smart Substitutions powered by AI\" when presented with a toggle during checkout." },
      { id: "tst-1-b2", type: "accordion", label: "Method", content: "1. Add a toggle in the checkout flow: \"Enable Smart Substitutions\"\n2. Track opt-in rate over 2 weeks\n3. Don't actually change substitution logic yet (fake door)\n4. Follow up with 20 opted-in users" },
      { id: "tst-1-b3", type: "accordion", label: "Success Criteria", content: "≥40% opt-in rate among users with substitution events" },
    ],
  },
  "tst-2": {
    id: "tst-2", level: "test", title: "Offline model accuracy test on 6 months of purchase data", icon: "FlaskConical", status: "commit", parentId: "asm-2",
    description: "An ML model trained on 6 months of purchase history can predict accepted substitutions with >=70% accuracy (vs. 52% baseline).",
    children: [],
    blocks: [
      { id: "tst-2-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-2-b1", type: "quote", content: "An ML model trained on 6 months of purchase history can predict accepted substitutions with ≥70% accuracy (vs. 52% baseline)." },
      { id: "tst-2-b2", type: "accordion", label: "Method", content: "1. Extract 6 months of order data including substitution events\n2. Train a collaborative filtering model\n3. Hold out recent 2 weeks as test set\n4. Compare against current rule-based system" },
      { id: "tst-2-b3", type: "accordion", label: "Success Criteria", content: "Model accuracy ≥70% on held-out test set" },
    ],
  },
  "tst-3": {
    id: "tst-3", level: "test", title: "SMS response time study with 200 orders", icon: "FlaskConical", status: "commit", parentId: "asm-3",
    description: "At least 60% of customers will respond to a substitution notification within 2 minutes during active orders.",
    children: [],
    blocks: [
      { id: "tst-3-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-3-b1", type: "quote", content: "At least 60% of customers will respond to a substitution notification within 2 minutes during active orders." },
      { id: "tst-3-b2", type: "accordion", label: "Method", content: "1. For 200 orders with substitution events, send an SMS notification\n2. Measure response time\n3. Track response rate by time of day\n4. Interview 10 non-responders" },
      { id: "tst-3-b3", type: "accordion", label: "Success Criteria", content: "≥60% response rate within 2 minutes" },
    ],
  },
  "tst-4": {
    id: "tst-4", level: "test", title: "4-week P&L comparison: chat orders vs. control", icon: "FlaskConical", status: "commit", parentId: "asm-4",
    description: "Orders with personal shopper chat will have lower total cost (labor + refunds + credits) compared to standard orders.",
    children: [],
    blocks: [
      { id: "tst-4-b0", type: "pills", items: [{ label: "Duration", value: "4 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-4-b1", type: "quote", content: "Orders with personal shopper chat will have lower total cost (labor + refunds + credits) compared to standard orders." },
      { id: "tst-4-b2", type: "accordion", label: "Method", content: "1. Run 4-week pilot with 50 pickers enabled for chat\n2. Compare picking time, refund costs, CSAT\n3. Calculate incremental labor cost vs. avoided refund cost\n4. Build unit economics model" },
      { id: "tst-4-b3", type: "accordion", label: "Success Criteria", content: "Chat orders have ≥15% lower total cost per substitution event" },
    ],
  },
  "tst-5": {
    id: "tst-5", level: "test", title: "A/B test: visual slot picker vs. current (500 new signups)", icon: "FlaskConical", status: "commit", parentId: "asm-5",
    description: "The visual slot picker will reduce first-order drop-off from 31% to <=20%.",
    children: [],
    blocks: [
      { id: "tst-5-b0", type: "pills", items: [{ label: "Duration", value: "3 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-5-b1", type: "quote", content: "The visual slot picker will reduce first-order drop-off from 31% to ≤20%." },
      { id: "tst-5-b2", type: "accordion", label: "Method", content: "1. Build visual slot picker as feature-flagged variant\n2. Randomly assign 500 new signups to A/B\n3. Measure first-order completion rate\n4. Track through first 3 orders" },
      { id: "tst-5-b3", type: "accordion", label: "Success Criteria", content: "First-order drop-off at slot selection ≤20% in variant B" },
    ],
  },
  "tst-6": {
    id: "tst-6", level: "test", title: "Preference survey after first 3 orders", icon: "FlaskConical", status: "commit", parentId: "asm-6",
    description: "After 3 orders, >=40% of users will have manually selected a time slot at least once.",
    children: [],
    blocks: [
      { id: "tst-6-b0", type: "pills", items: [{ label: "Duration", value: "4 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-6-b1", type: "quote", content: "After 3 orders, ≥40% of users will have manually selected a time slot at least once." },
      { id: "tst-6-b2", type: "accordion", label: "Method", content: "1. Track slot selection behavior across first 3 orders\n2. Categorize: always fastest, mixed, always manual\n3. Show 2-question survey after 3rd order\n4. Analyze segment value" },
      { id: "tst-6-b3", type: "accordion", label: "Success Criteria", content: "≥40% of users manually select a slot at least once" },
    ],
  },
  "tst-7": {
    id: "tst-7", level: "test", title: "Diary study: 20 users log meal planning behavior", icon: "FlaskConical", status: "commit", parentId: "asm-7",
    description: "At least 60% of users plan meals (however loosely) before or during grocery shopping.",
    children: [],
    blocks: [
      { id: "tst-7-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-7-b1", type: "quote", content: "At least 60% of users plan meals (however loosely) before or during grocery shopping." },
      { id: "tst-7-b2", type: "accordion", label: "Method", content: "1. Recruit 20 active users from primary persona\n2. Ask them to log shopping behavior for 1 week\n3. Follow-up interview with each participant\n4. Categorize: meal planners, list shoppers, impulse shoppers" },
      { id: "tst-7-b3", type: "accordion", label: "Success Criteria", content: "≥60% of participants show meal-planning behavior" },
    ],
  },
  "tst-8": {
    id: "tst-8", level: "test", title: "Pilot: recipe feature for 1000 users, measure AOV", icon: "FlaskConical", status: "commit", parentId: "asm-8",
    description: "Users who engage with recipe suggestions will add >=3 incremental items per order, increasing AOV by >=8%.",
    children: [],
    blocks: [
      { id: "tst-8-b0", type: "pills", items: [{ label: "Duration", value: "5 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-8-b1", type: "quote", content: "Users who engage with recipe suggestions will add ≥3 incremental items per order, increasing AOV by ≥8%." },
      { id: "tst-8-b2", type: "accordion", label: "Method", content: "1. Build MVP recipe suggestion engine (50 recipes)\n2. Roll out to 1000 users (500 recipe-enabled, 500 control)\n3. Measure items per cart, AOV, engagement rate\n4. Track over 4 weeks" },
      { id: "tst-8-b3", type: "accordion", label: "Success Criteria", content: "Recipe-engaged orders have ≥3 more items and ≥8% higher AOV" },
    ],
  },
  "tst-9": {
    id: "tst-9", level: "test", title: "Wizard-of-Oz test: 10 store owners try onboarding prototype", icon: "FlaskConical", status: "commit", parentId: "asm-9",
    description: "At least 7/10 store owners can complete the self-serve onboarding flow within 1 hour without assistance.",
    children: [],
    blocks: [
      { id: "tst-9-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-9-b1", type: "quote", content: "At least 7/10 store owners can complete the self-serve onboarding flow within 1 hour without assistance." },
      { id: "tst-9-b2", type: "accordion", label: "Method", content: "1. Build clickable prototype of onboarding portal\n2. Recruit 10 store owners (mix of tech-savvy and less technical)\n3. Observe via screen recording — no assistance\n4. Post-test interview" },
      { id: "tst-9-b3", type: "accordion", label: "Success Criteria", content: "≥7/10 store owners complete onboarding within 1 hour unassisted" },
    ],
  },
  "tst-10": {
    id: "tst-10", level: "test", title: "Parse 5 real POS exports, measure catalog accuracy", icon: "FlaskConical", status: "commit", parentId: "asm-10",
    description: "Our POS parser can generate a catalog with >=85% accuracy from real store POS exports.",
    children: [],
    blocks: [
      { id: "tst-10-b0", type: "pills", items: [{ label: "Duration", value: "3 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "tst-10-b1", type: "quote", content: "Our POS parser can generate a catalog with ≥85% accuracy from real store POS exports." },
      { id: "tst-10-b2", type: "accordion", label: "Method", content: "1. Collect real POS exports from 5 store owners\n2. Build parsers for each POS format\n3. Auto-generate catalogs\n4. Have store owners review accuracy" },
      { id: "tst-10-b3", type: "accordion", label: "Success Criteria", content: "Average catalog accuracy ≥85% across 5 stores" },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════
// PRODUCT LINE 2: InsightPulse (B2B SaaS Analytics)
// ════════════════════════════════════════════════════════════════════════════

const INSIGHTPULSE_TREE: DiscoveryTree = {
  title: "Product Line: InsightPulse",
  description: "B2B analytics platform for e-commerce teams — turning raw store data into actionable growth insights",
  rootChildren: ["ip-bo-1", "ip-bo-2"],
};

const INSIGHTPULSE_ENTITIES: EntityStore = {
  "ip-bo-1": {
    id: "ip-bo-1",
    level: "business_outcome",
    title: "Reach $3M ARR by end of 2026",
    icon: "Target",
    status: "commit",
    description: "InsightPulse currently generates $1.2M ARR across 85 paying accounts. The board has set $3M ARR as the Series A milestone, requiring us to 2.5x revenue in 12 months through a mix of new logos and expansion revenue.",
    children: ["ip-po-1a", "ip-po-1b"],
    blocks: [
      { id: "ip-bo-1-b0", type: "metric", metric: "Annual Recurring Revenue", currentValue: "$1.2M", targetValue: "$3M", timeframe: "FY 2026", frequency: "monthly", valueFormat: "currency_usd", initialValue: 1200000, numericTarget: 3000000, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "ip-bo-1-b1", type: "accordion", label: "Strategic Alignment", content: "This maps directly to our **\"Land and Expand\"** go-to-market strategy. We acquire accounts with a free tier or starter plan, then expand them into paid tiers as they hit data volume thresholds or need team collaboration features.\n\nOur investors view $3M ARR as the proof point that product-market fit is real and scalable — it unlocks the Series A conversation." },
      { id: "ip-bo-1-b2", type: "accordion", label: "Why Now", content: "- **Market timing** — E-commerce teams are being asked to do more with less after the 2024 layoff cycle. They need automated analytics, not more analysts.\n- **Competitor gap** — Mixpanel and Amplitude are focused on product analytics; nobody owns \"e-commerce operational analytics\" yet\n- **Data regulation** — GDPR and the death of third-party cookies are pushing teams toward first-party analytics. We're positioned perfectly for this shift." },
      { id: "ip-bo-1-b3", type: "accordion", label: "Risk of Inaction", content: "- **Series A window closes** — Our runway ends in Q1 2027. Without $3M ARR by Q4 2026, we can't raise and will need to cut the team\n- **Category definition** — If we don't establish \"e-commerce operational analytics\" as a category now, a larger player (Shopify, Klaviyo) will build it into their platform\n- **Talent retention** — Senior engineers joined for the growth story. Flat revenue = departures" },
    ],
  },
  "ip-bo-2": {
    id: "ip-bo-2",
    level: "business_outcome",
    title: "Reduce monthly churn to below 3%",
    icon: "Target",
    status: "commit",
    description: "Current monthly logo churn is 5.2% — well above the B2B SaaS benchmark of 3%. At this rate we're losing ~4 accounts/month, requiring 9+ new sales per month just to maintain flat revenue. Fixing churn is the highest-leverage thing we can do.",
    children: ["ip-po-2a"],
    blocks: [
      { id: "ip-bo-2-b0", type: "metric", metric: "Monthly logo churn rate", currentValue: "5.2%", targetValue: "<3%", timeframe: "Q3 2026", frequency: "monthly", valueFormat: "percentage", initialValue: 5.2, numericTarget: 3, startDate: "2026-01-01", endDate: "2026-09-30" },
      { id: "ip-bo-2-b1", type: "accordion", label: "Strategic Alignment", content: "Our investor memo identifies churn as the **#1 risk to Series A**. A leaky bucket undermines all growth investment. The board wants to see 2 consecutive quarters below 3% before greenlighting aggressive sales hiring." },
      { id: "ip-bo-2-b2", type: "accordion", label: "Why Now", content: "- **Churn is accelerating** — Was 4.1% in Q3 2025, now 5.2%. If we don't reverse the trend, we hit 7%+ by mid-2026\n- **Exit interview data** — We now have 30+ churned account interviews. The patterns are clear and actionable\n- **Quick wins available** — 60% of churned accounts cite the same 3 problems: setup complexity, report customization, and lack of team features" },
      { id: "ip-bo-2-b3", type: "accordion", label: "Risk of Inaction", content: "- **Revenue decay** — At 5.2% churn, we lose $62K MRR per month. That's $750K/year evaporating\n- **NPS death spiral** — Churned users leave negative G2 reviews; this is already affecting inbound lead quality\n- **CAC payback never arrives** — With current churn, payback period is 18 months. Most accounts churn before paying back acquisition cost" },
    ],
  },

  // Product Outcomes
  "ip-po-1a": {
    id: "ip-po-1a", level: "product_outcome", title: "Increase trial-to-paid conversion from 8% to 15%", icon: "TrendingUp", status: "commit", parentId: "ip-bo-1",
    description: "Only 8% of free trial signups convert to a paid plan within 14 days. Industry benchmark for B2B SaaS with self-serve is 12-18%. Doubling our conversion rate is the fastest path to new ARR without increasing top-of-funnel spend.",
    children: ["ip-opp-1", "ip-opp-2"],
    blocks: [
      { id: "ip-po-1a-b0", type: "metric", metric: "14-day trial-to-paid conversion", currentValue: "8%", targetValue: "15%", frequency: "weekly", valueFormat: "percentage", initialValue: 8, numericTarget: 15, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "ip-po-1a-b1", type: "accordion", label: "Personas", content: "**Primary: The Growth Marketer (\"Priya\")**\n- 28-35, works at a DTC e-commerce brand ($5-50M revenue)\n- Technically capable but not a data engineer\n- Uses Shopify, Klaviyo, Google Analytics today\n- Pain: can't answer \"why did revenue drop last Tuesday?\" without asking engineering\n\n**Secondary: The E-Commerce Director (\"James\")**\n- 35-45, manages a team of 3-5 marketers\n- Needs dashboards for weekly exec reporting\n- Pain: spends 4 hours/week manually building reports in Google Sheets" },
      { id: "ip-po-1a-b2", type: "accordion", label: "Constraints", content: "- **14-day trial window** — Must demonstrate value fast enough to convert within 2 weeks\n- **Self-serve only** — No sales team involvement for accounts under $500/month\n- **Shopify-first** — 70% of trial signups are Shopify stores; other platforms are secondary" },
      { id: "ip-po-1a-b3", type: "accordion", label: "Trade-offs", content: "- **Guided vs. Self-Serve**: More hand-holding increases conversion but doesn't scale. We're betting on smart onboarding automation.\n- **Feature gating vs. Full access**: Showing everything overwhelms; restricting too much hides value. Current bet: show all features, limit data history." },
      { id: "ip-po-1a-b4", type: "accordion", label: "Assumptions", content: "- Users who connect their data source within 24 hours are 4x more likely to convert\n- Pre-built dashboard templates eliminate the blank-canvas problem\n- Time-to-first-insight must be under 10 minutes to hook a trial user" },
    ],
  },
  "ip-po-1b": {
    id: "ip-po-1b", level: "product_outcome", title: "Grow average contract value from $1,200 to $2,000/year", icon: "TrendingUp", status: "commit", parentId: "ip-bo-1",
    description: "Most accounts are on the $99/month Starter plan. Target: move 30% of accounts to the $199/month Growth plan through feature-driven expansion — team seats, custom reports, API access.",
    children: ["ip-opp-3"],
    blocks: [
      { id: "ip-po-1b-b0", type: "metric", metric: "Average Contract Value (ACV)", currentValue: "$1,200/yr", targetValue: "$2,000/yr", frequency: "monthly", valueFormat: "currency_usd", initialValue: 1200, numericTarget: 2000, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "ip-po-1b-b1", type: "accordion", label: "Personas", content: "**Expansion target: Growing teams (3-10 people)**\n- Hit Starter plan limits on seats (max 2) or data queries\n- Manager needs to share dashboards with execs who won't log in\n- Pain: currently share screenshots or CSV exports instead of live dashboards" },
      { id: "ip-po-1b-b2", type: "accordion", label: "Constraints", content: "- **No forced upgrades** — Users must feel they're upgrading for value, not being extorted by artificial limits\n- **Transparent pricing** — All pricing is public on the website; no hidden gotchas\n- **Migration-free** — Upgrading must not require data re-import or dashboard rebuilding" },
      { id: "ip-po-1b-b3", type: "accordion", label: "Trade-offs", content: "- **Seat-based vs. Usage-based pricing**: Seat-based is simpler but penalizes collaboration. Usage-based (data rows, API calls) is fairer but harder to predict costs.\n- **Feature depth vs. Breadth**: We could add many shallow features or go deep on the ones that drive upgrades (team sharing, custom SQL)." },
      { id: "ip-po-1b-b4", type: "accordion", label: "Assumptions", content: "- Team sharing is the #1 trigger for plan upgrades (based on CS conversations)\n- Scheduled report delivery (email/Slack) creates organizational dependency that prevents churn\n- API access unlocks a different buyer persona (data engineers) who have larger budgets" },
    ],
  },
  "ip-po-2a": {
    id: "ip-po-2a", level: "product_outcome", title: "Increase 90-day retention from 72% to 88%", icon: "TrendingUp", status: "commit", parentId: "ip-bo-2",
    description: "28% of new paying accounts cancel within 90 days. Exit interviews reveal a consistent pattern: they set up InsightPulse, get initial value, but then stop logging in because the dashboards go stale and nothing pulls them back.",
    children: ["ip-opp-4", "ip-opp-5"],
    blocks: [
      { id: "ip-po-2a-b0", type: "metric", metric: "90-day paying account retention", currentValue: "72%", targetValue: "88%", frequency: "monthly", valueFormat: "percentage", initialValue: 72, numericTarget: 88, startDate: "2026-01-01", endDate: "2026-12-31" },
      { id: "ip-po-2a-b1", type: "accordion", label: "Personas", content: "**At-risk persona: The Set-and-Forget User**\n- Connected their Shopify store during onboarding\n- Built 1-2 dashboards in the first week\n- Never returned after week 2\n- Cancels when the invoice arrives: \"I forgot we were even paying for this\"" },
      { id: "ip-po-2a-b2", type: "accordion", label: "Constraints", content: "- **No spam** — Notification strategy must add value, not annoy. Users who feel spammed churn faster\n- **Privacy-first** — Can't surface competitor data or benchmarks without explicit consent from both parties\n- **Small team** — 1 product manager + 2 engineers allocated to retention" },
      { id: "ip-po-2a-b3", type: "accordion", label: "Trade-offs", content: "- **Proactive vs. Reactive**: We can wait for users to disengage and try to win them back, or proactively surface insights that keep them engaged. Betting on proactive.\n- **Automated vs. Human touch**: CS-led check-ins work but don't scale past 100 accounts. Need automated engagement that feels personal." },
      { id: "ip-po-2a-b4", type: "accordion", label: "Assumptions", content: "- Users who receive a weekly automated insight email retain 2x better than those who don't\n- Anomaly detection (\"your conversion rate dropped 15% yesterday\") drives more logins than scheduled reports\n- Accounts with 3+ team members have 60% lower churn than single-user accounts" },
    ],
  },

  // Opportunities
  "ip-opp-1": {
    id: "ip-opp-1", level: "opportunity", title: "Trial users hit a blank canvas and don't know where to start", icon: "Lightbulb", status: "commit", parentId: "ip-po-1a", personaId: "persona-ip-founder",
    description: "After connecting their data source, trial users land on an empty dashboard builder. 62% of trial signups who connect data never create a single dashboard. The blank canvas is paralyzing — they don't know what questions to ask or how to build a useful view.",
    children: ["ip-sol-1"],
    blocks: [
      { id: "ip-opp-1-b0", type: "quote", content: "I connected my Shopify store and then just... stared at the screen. There were like 200 metrics. I didn't know what mattered. I closed the tab and never came back.", attribution: "Priya, churned trial user, exit interview" },
      { id: "ip-opp-1-b1", type: "pills", items: [{ label: "Frequency", value: "62% of connected trial users create zero dashboards" }, { label: "Impact", value: "Critical — This is the single biggest leak in the trial funnel." }] },
      { id: "ip-opp-1-b2", type: "accordion", label: "Current Workaround", content: "Power users Google \"e-commerce KPIs\" and manually build dashboards from scratch. Some ask in our Slack community for template recommendations. CS team manually onboards high-potential accounts with screen-share sessions." },
      { id: "ip-opp-1-b3", type: "accordion", label: "Market Evidence", content: "Datadog's pre-built integration dashboards are cited as their #1 onboarding improvement (reduced time-to-value from 45 minutes to 3 minutes). Amplitude's \"Starter Kit\" templates increased 7-day retention by 23%." },
    ],
  },
  "ip-opp-2": {
    id: "ip-opp-2", level: "opportunity", title: "Data connection setup fails or stalls for 35% of trial users", icon: "Lightbulb", status: "commit", parentId: "ip-po-1a", personaId: "persona-ip-data-analyst",
    description: "The first step of any analytics trial is connecting a data source. 35% of trial signups either fail to connect their store (authentication errors, permissions issues) or give up during the process. Without data, there's zero chance of conversion.",
    children: ["ip-sol-2"],
    blocks: [
      { id: "ip-opp-2-b0", type: "quote", content: "I tried to connect my Shopify store but it kept asking for API scopes I didn't understand. I'm a marketer, not a developer. I gave up after 15 minutes.", attribution: "James, churned trial user" },
      { id: "ip-opp-2-b1", type: "pills", items: [{ label: "Frequency", value: "35% of trial signups never successfully connect a data source" }, { label: "Impact", value: "High — These users never see the product at all." }] },
      { id: "ip-opp-2-b2", type: "accordion", label: "Current Workaround", content: "Users reach out to support (adds 24-48 hour delay to activation). Some try to manually upload CSV exports. A few ask their engineering team to help with API setup." },
      { id: "ip-opp-2-b3", type: "accordion", label: "Market Evidence", content: "Segment reduced their Shopify integration setup from 12 steps to 3 clicks (OAuth-only) and saw connection success rate increase from 58% to 91%. Fivetran's \"zero-config\" connectors are their primary selling point." },
    ],
  },
  "ip-opp-3": {
    id: "ip-opp-3", level: "opportunity", title: "Teams share insights via screenshots instead of the product", icon: "Lightbulb", status: "commit", parentId: "ip-po-1b", personaId: "persona-ip-ecom-manager",
    description: "Starter plan allows 2 seats. Teams of 3-10 people work around this by having 1 person build dashboards and share screenshots via Slack/email. This means InsightPulse stays a single-user tool and never becomes organizational infrastructure.",
    children: ["ip-sol-3"],
    blocks: [
      { id: "ip-opp-3-b0", type: "quote", content: "I screenshot my InsightPulse dashboard every Monday and paste it in our team Slack. My boss doesn't have a login. If I left, nobody would even know we had this tool.", attribution: "Priya, Starter plan user, QBR call" },
      { id: "ip-opp-3-b1", type: "pills", items: [{ label: "Frequency", value: "68% of Starter plan accounts have never invited a second user; 45% share screenshots weekly" }, { label: "Impact", value: "High — Each account stuck at 2 seats is $1,200/yr instead of a potential $2,400-4,800/yr." }] },
      { id: "ip-opp-3-b2", type: "accordion", label: "Current Workaround", content: "Screenshots in Slack. CSV exports emailed weekly. One user builds a Google Sheet that mirrors InsightPulse data (completely manual)." },
      { id: "ip-opp-3-b3", type: "accordion", label: "Market Evidence", content: "Notion's free team tier (unlimited members, limited features) created viral adoption loops — teams grew 3x faster than individual accounts. Figma's \"anyone can view\" sharing model was critical to their enterprise expansion." },
    ],
  },
  "ip-opp-4": {
    id: "ip-opp-4", level: "opportunity", title: "Dashboards go stale and users forget to check them", icon: "Lightbulb", status: "commit", parentId: "ip-po-2a", personaId: "persona-ip-data-analyst",
    description: "Dashboards are pull-based — users have to remember to log in and check them. After the initial setup excitement fades, login frequency drops by 70% between week 1 and week 4. The product becomes invisible.",
    children: ["ip-sol-4"],
    blocks: [
      { id: "ip-opp-4-b0", type: "quote", content: "The dashboards were great when I set them up. But then I just... forgot about them. Nothing reminded me to look. By the time I remembered, I'd been paying for 2 months without logging in.", attribution: "churned account, exit interview #22" },
      { id: "ip-opp-4-b1", type: "pills", items: [{ label: "Frequency", value: "Login frequency drops 70% between week 1 and week 4 for new accounts" }, { label: "Impact", value: "High — Accounts that don't log in for 14+ consecutive days have an 80% chance of churning within 60 days." }] },
      { id: "ip-opp-4-b2", type: "accordion", label: "Current Workaround", content: "Some users set personal calendar reminders to \"check InsightPulse.\" A few built Zapier integrations to email themselves specific metrics. Most just forget." },
      { id: "ip-opp-4-b3", type: "accordion", label: "Market Evidence", content: "Datadog's automated alerting is cited in 73% of customer testimonials as the reason they stay. New Relic's weekly summary emails have a 42% open rate and correlate with 2x higher retention." },
    ],
  },
  "ip-opp-5": {
    id: "ip-opp-5", level: "opportunity", title: "Onboarding is one-size-fits-all regardless of store size or vertical", icon: "Lightbulb", status: "commit", parentId: "ip-po-2a", personaId: "persona-ip-founder",
    description: "A $2M/year fashion DTC brand and a $50K/year Etsy seller get the same onboarding flow. The fashion brand needs cohort analysis and attribution; the Etsy seller needs basic revenue tracking. The mismatch means both feel the product wasn't built for them.",
    children: ["ip-sol-5"],
    blocks: [
      { id: "ip-opp-5-b0", type: "quote", content: "Half the features don't apply to my business. I sell handmade jewelry on Etsy — I don't need multi-channel attribution. It made the whole product feel over-engineered.", attribution: "churned Etsy seller" },
      { id: "ip-opp-5-b1", type: "pills", items: [{ label: "Frequency", value: "Affects 100% of new accounts; manifests as low dashboard completion (avg 1.2 dashboards created vs. 4.5 in ideal usage)" }, { label: "Impact", value: "Medium-High — Personalized onboarding could increase dashboard creation by 3x and directly improve 90-day retention." }] },
      { id: "ip-opp-5-b2", type: "accordion", label: "Current Workaround", content: "CS team manually assesses account size during onboarding calls and recommends relevant features. Only works for accounts that book a call (~20%)." },
      { id: "ip-opp-5-b3", type: "accordion", label: "Market Evidence", content: "HubSpot's segmented onboarding (by company size and goal) increased activation rate by 35%. Canva asks \"What will you use Canva for?\" at signup and tailors the experience — credited with their 50%+ trial conversion." },
    ],
  },

  // Solutions
  "ip-sol-1": {
    id: "ip-sol-1", level: "solution", title: "Pre-built industry dashboard templates with guided setup", icon: "Puzzle", status: "commit", parentId: "ip-opp-1",
    description: "Instead of a blank canvas, new users choose from 5-8 pre-built dashboard templates tailored to e-commerce verticals (fashion DTC, food & bev, electronics, general). Each template comes with the right metrics pre-configured and a 3-step guided setup that asks simple business questions to customize the dashboard.",
    children: ["ip-asm-1", "ip-asm-2"],
    blocks: [
      { id: "ip-sol-1-b0", type: "quote", content: "As a trial user who just connected my Shopify store, I want to see a useful dashboard immediately — not a blank page — so I can understand the value of InsightPulse within 5 minutes." },
      { id: "ip-sol-1-b1", type: "pills", items: [{ label: "Effort", value: "3-4 weeks" }, { label: "Confidence", value: "high" }] },
      { id: "ip-sol-1-b2", type: "accordion", label: "How it works", content: "Instead of a blank canvas, new users choose from 5-8 pre-built dashboard templates tailored to e-commerce verticals (fashion DTC, food & bev, electronics, general). Each template comes with the right metrics pre-configured and a 3-step guided setup that asks simple business questions to customize the dashboard." },
      { id: "ip-sol-1-b3", type: "accordion", label: "Differentiator", content: "Most analytics tools show a blank canvas after setup. Pre-built templates that actually work with the user's real data create an instant 'wow' moment." },
    ],
  },
  "ip-sol-2": {
    id: "ip-sol-2", level: "solution", title: "One-click OAuth connector for Shopify, WooCommerce, BigCommerce", icon: "Puzzle", status: "commit", parentId: "ip-opp-2",
    description: "Replace the current API-key-based connection flow with OAuth for the top 3 platforms. User clicks \"Connect Shopify\" → redirected to Shopify login → approves permissions → data starts syncing. No API keys, no scopes, no technical setup.",
    children: ["ip-asm-3"],
    blocks: [
      { id: "ip-sol-2-b0", type: "quote", content: "As a non-technical marketer, I want to connect my store in under 60 seconds without understanding API keys or scopes." },
      { id: "ip-sol-2-b1", type: "pills", items: [{ label: "Effort", value: "2-3 weeks" }, { label: "Confidence", value: "high" }] },
      { id: "ip-sol-2-b2", type: "accordion", label: "How it works", content: "Replace the current API-key-based connection flow with OAuth for the top 3 platforms. User clicks \"Connect Shopify\" → redirected to Shopify login → approves permissions → data starts syncing. No API keys, no scopes, no technical setup." },
      { id: "ip-sol-2-b3", type: "accordion", label: "Differentiator", content: "Table-stakes UX but we're behind. Our current setup requires technical knowledge that excludes 40% of our target persona." },
    ],
  },
  "ip-sol-3": {
    id: "ip-sol-3", level: "solution", title: "Shareable dashboard links with viewer-only access (no login required)", icon: "Puzzle", status: "commit", parentId: "ip-opp-3",
    description: "Allow any user to generate a secret link to a dashboard that anyone can view without an InsightPulse account. Links are read-only, expire after 30 days, and can be revoked. Viewers see a \"Get your own InsightPulse\" banner — creating a viral acquisition loop.",
    children: ["ip-asm-4", "ip-asm-5"],
    blocks: [
      { id: "ip-sol-3-b0", type: "quote", content: "As a marketer, I want to share a live dashboard link with my boss and 3 teammates so they can see real-time data without needing their own login." },
      { id: "ip-sol-3-b1", type: "pills", items: [{ label: "Effort", value: "2-3 weeks" }, { label: "Confidence", value: "medium" }] },
      { id: "ip-sol-3-b2", type: "accordion", label: "How it works", content: "Allow any user to generate a secret link to a dashboard that anyone can view without an InsightPulse account. Links are read-only, expire after 30 days, and can be revoked. Viewers see a \"Get your own InsightPulse\" banner — creating a viral acquisition loop." },
      { id: "ip-sol-3-b3", type: "accordion", label: "Differentiator", content: "Creates a Figma-like sharing model. Each shared link exposes InsightPulse to 3-5 new potential users — turning every customer into a distribution channel." },
    ],
  },
  "ip-sol-4": {
    id: "ip-sol-4", level: "solution", title: "Weekly AI-generated insight digest via email and Slack", icon: "Puzzle", status: "commit", parentId: "ip-opp-4",
    description: "Every Monday morning, InsightPulse sends each user an automated digest: top 3 anomalies from last week, key metric trends, and one actionable recommendation. Delivered via email and (optionally) Slack. The digest is generated by an LLM analyzing their actual data.",
    children: ["ip-asm-6", "ip-asm-7"],
    blocks: [
      { id: "ip-sol-4-b0", type: "quote", content: "As a user who doesn't log in every day, I want the most important changes in my business delivered to my inbox so I never miss something critical." },
      { id: "ip-sol-4-b1", type: "pills", items: [{ label: "Effort", value: "4-5 weeks" }, { label: "Confidence", value: "medium" }] },
      { id: "ip-sol-4-b2", type: "accordion", label: "How it works", content: "Every Monday morning, InsightPulse sends each user an automated digest: top 3 anomalies from last week, key metric trends, and one actionable recommendation. Delivered via email and (optionally) Slack. The digest is generated by an LLM analyzing their actual data." },
      { id: "ip-sol-4-b3", type: "accordion", label: "Differentiator", content: "Turns InsightPulse from a pull-based dashboard tool into a push-based intelligence layer. Competitors require users to log in; we come to them." },
    ],
  },
  "ip-sol-5": {
    id: "ip-sol-5", level: "solution", title: "Segmented onboarding flow based on store size and vertical", icon: "Puzzle", status: "commit", parentId: "ip-opp-5",
    description: "At signup, ask 2 questions: \"What's your approximate annual revenue?\" and \"What do you sell?\" Based on answers, customize the entire onboarding: which templates to show, which features to highlight, what KPIs to track, and what the getting-started checklist looks like.",
    children: ["ip-asm-8"],
    blocks: [
      { id: "ip-sol-5-b0", type: "quote", content: "As a small Etsy seller, I want an onboarding experience that shows me the 3 metrics that matter for my business — not overwhelm me with enterprise features I'll never use." },
      { id: "ip-sol-5-b1", type: "pills", items: [{ label: "Effort", value: "3-4 weeks" }, { label: "Confidence", value: "high" }] },
      { id: "ip-sol-5-b2", type: "accordion", label: "How it works", content: "At signup, ask 2 questions: \"What's your approximate annual revenue?\" and \"What do you sell?\" Based on answers, customize the entire onboarding: which templates to show, which features to highlight, what KPIs to track, and what the getting-started checklist looks like." },
      { id: "ip-sol-5-b3", type: "accordion", label: "Differentiator", content: "Makes InsightPulse feel like it was built specifically for each user's business, even though it's the same product underneath. Creates emotional connection from minute one." },
    ],
  },

  // Assumptions
  "ip-asm-1": {
    id: "ip-asm-1", level: "assumption", title: "Pre-built templates eliminate the blank-canvas problem", icon: "HelpCircle", status: "commit", parentId: "ip-sol-1",
    description: "We believe that offering 5-8 pre-built dashboard templates will cause trial users to create their first dashboard within 5 minutes, eliminating the 62% zero-dashboard drop-off.",
    children: ["ip-tst-1"],
    blocks: [
      { id: "ip-asm-1-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "low" }] },
      { id: "ip-asm-1-b1", type: "accordion", label: "If False", content: "If templates don't match users' actual needs, they'll still feel lost. We'd need to invest in a guided wizard that builds a custom dashboard from user answers." },
    ],
  },
  "ip-asm-2": {
    id: "ip-asm-2", level: "assumption", title: "Users who see real data in <10 minutes convert 3x better", icon: "HelpCircle", status: "commit", parentId: "ip-sol-1",
    description: "We believe there's a direct correlation between time-to-first-real-insight and trial conversion. Specifically, users who see their own data in a meaningful dashboard within 10 minutes will convert at 3x the rate of users who take longer.",
    children: ["ip-tst-2"],
    blocks: [
      { id: "ip-asm-2-b0", type: "pills", items: [{ label: "Category", value: "viability" }, { label: "Risk", value: "medium" }] },
      { id: "ip-asm-2-b1", type: "accordion", label: "If False", content: "If speed-to-value doesn't predict conversion (maybe it's about feature depth or specific use cases), we'd need to optimize for depth of first experience rather than speed." },
    ],
  },
  "ip-asm-3": {
    id: "ip-asm-3", level: "assumption", title: "OAuth flow achieves 90%+ connection success rate", icon: "HelpCircle", status: "commit", parentId: "ip-sol-2",
    description: "We believe that switching from API-key-based setup to OAuth will increase data source connection success rate from 65% to 90%+ for the top 3 platforms.",
    children: ["ip-tst-3"],
    blocks: [
      { id: "ip-asm-3-b0", type: "pills", items: [{ label: "Category", value: "feasibility" }, { label: "Risk", value: "low" }] },
      { id: "ip-asm-3-b1", type: "accordion", label: "If False", content: "If OAuth still fails (due to platform-specific permission issues, store configurations, or API rate limits), we'd need a fallback \"concierge setup\" where our team connects the store for the user." },
    ],
  },
  "ip-asm-4": {
    id: "ip-asm-4", level: "assumption", title: "Shared links create a viral acquisition loop", icon: "HelpCircle", status: "commit", parentId: "ip-sol-3",
    description: "We believe that dashboard viewers who receive a shared link will sign up for InsightPulse at a meaningful rate (>=5%), creating a Figma-like viral loop that reduces customer acquisition cost.",
    children: ["ip-tst-4"],
    blocks: [
      { id: "ip-asm-4-b0", type: "pills", items: [{ label: "Category", value: "viability" }, { label: "Risk", value: "high" }] },
      { id: "ip-asm-4-b1", type: "accordion", label: "If False", content: "If shared link viewers don't convert (they're read-only consumers, not analytics buyers), the feature still helps retention (more eyes on dashboards = more organizational buy-in) but doesn't drive acquisition." },
    ],
  },
  "ip-asm-5": {
    id: "ip-asm-5", level: "assumption", title: "Sharing drives plan upgrades when teams hit the seat limit", icon: "HelpCircle", status: "commit", parentId: "ip-sol-3",
    description: "We believe that once 3+ people in an org are viewing dashboards via shared links, the account owner will upgrade to the Growth plan (more seats + collaboration features) rather than continuing to share via links.",
    children: ["ip-tst-5"],
    blocks: [
      { id: "ip-asm-5-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "medium" }] },
      { id: "ip-asm-5-b1", type: "accordion", label: "If False", content: "If shared links are \"good enough\" and teams never upgrade, we've actually cannibalized our own paid seats. We'd need to add time limits or feature restrictions to shared links." },
    ],
  },
  "ip-asm-6": {
    id: "ip-asm-6", level: "assumption", title: "AI-generated insights are accurate enough to be trusted", icon: "HelpCircle", status: "commit", parentId: "ip-sol-4",
    description: "We believe that an LLM analyzing store data can generate weekly insights that are accurate, relevant, and actionable at least 80% of the time. Inaccurate or generic insights would erode trust and cause users to unsubscribe from the digest.",
    children: ["ip-tst-6"],
    blocks: [
      { id: "ip-asm-6-b0", type: "pills", items: [{ label: "Category", value: "feasibility" }, { label: "Risk", value: "high" }] },
      { id: "ip-asm-6-b1", type: "accordion", label: "If False", content: "If LLM insights are too generic or occasionally wrong, we'd fall back to rule-based anomaly detection (simpler, more reliable) with human-written insight templates." },
    ],
  },
  "ip-asm-7": {
    id: "ip-asm-7", level: "assumption", title: "Weekly digests increase login frequency by 2x", icon: "HelpCircle", status: "commit", parentId: "ip-sol-4",
    description: "We believe that a well-crafted weekly email digest will double the average login frequency from 1.2/week to 2.4/week by giving users a reason to come back and investigate the insights further.",
    children: ["ip-tst-7"],
    blocks: [
      { id: "ip-asm-7-b0", type: "pills", items: [{ label: "Category", value: "desirability" }, { label: "Risk", value: "medium" }] },
      { id: "ip-asm-7-b1", type: "accordion", label: "If False", content: "If users read the digest but don't log in (they get enough value from the email alone), we'd need to add \"click to investigate\" deep links that require login to see the full analysis." },
    ],
  },
  "ip-asm-8": {
    id: "ip-asm-8", level: "assumption", title: "2 signup questions accurately segment users without adding friction", icon: "HelpCircle", status: "commit", parentId: "ip-sol-5",
    description: "We believe we can segment users into meaningful cohorts (small/medium/large x vertical) with just 2 questions at signup, without the extra step causing drop-off in the signup flow.",
    children: ["ip-tst-8"],
    blocks: [
      { id: "ip-asm-8-b0", type: "pills", items: [{ label: "Category", value: "usability" }, { label: "Risk", value: "low" }] },
      { id: "ip-asm-8-b1", type: "accordion", label: "If False", content: "If the extra questions cause measurable signup drop-off (>5% impact), we'd infer the segment from connected store data instead (revenue range, product categories) — more accurate but delayed." },
    ],
  },

  // Tests
  "ip-tst-1": {
    id: "ip-tst-1", level: "test", title: "A/B test: templates vs. blank canvas for 200 trial signups", icon: "FlaskConical", status: "commit", parentId: "ip-asm-1",
    description: "Trial users who see pre-built templates will create their first dashboard within 5 minutes (vs. 45+ minutes for blank canvas) and have >=2x higher 14-day conversion.",
    children: [],
    blocks: [
      { id: "ip-tst-1-b0", type: "pills", items: [{ label: "Duration", value: "3 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-1-b1", type: "quote", content: "Trial users who see pre-built templates will create their first dashboard within 5 minutes (vs. 45+ minutes for blank canvas) and have ≥2x higher 14-day conversion." },
      { id: "ip-tst-1-b2", type: "accordion", label: "Method", content: "1. Build 5 e-commerce dashboard templates\n2. Split 200 new trial signups: A (blank canvas) vs. B (template chooser)\n3. Track: time to first dashboard, dashboards created, 14-day conversion\n4. Qualitative: 10 user interviews per variant" },
      { id: "ip-tst-1-b3", type: "accordion", label: "Success Criteria", content: "Template variant achieves <5 minute time-to-first-dashboard and ≥2x conversion rate" },
    ],
  },
  "ip-tst-2": {
    id: "ip-tst-2", level: "test", title: "Correlation analysis: time-to-first-insight vs. conversion", icon: "FlaskConical", status: "commit", parentId: "ip-asm-2",
    description: "Users who see their first meaningful insight (real data, not sample) within 10 minutes convert at >=20% vs. 8% overall.",
    children: [],
    blocks: [
      { id: "ip-tst-2-b0", type: "pills", items: [{ label: "Duration", value: "1 week (retrospective analysis)" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-2-b1", type: "quote", content: "Users who see their first meaningful insight (real data, not sample) within 10 minutes convert at ≥20% vs. 8% overall." },
      { id: "ip-tst-2-b2", type: "accordion", label: "Method", content: "1. Instrument event tracking: timestamp of first real-data dashboard view\n2. Analyze last 500 trial accounts: bucket by time-to-first-insight\n3. Compare conversion rates across buckets\n4. Control for confounders: company size, data source, signup channel" },
      { id: "ip-tst-2-b3", type: "accordion", label: "Success Criteria", content: "Users with <10 minute time-to-insight convert at ≥20%" },
    ],
  },
  "ip-tst-3": {
    id: "ip-tst-3", level: "test", title: "OAuth integration pilot with 50 Shopify trial signups", icon: "FlaskConical", status: "commit", parentId: "ip-asm-3",
    description: "OAuth-based Shopify connection will achieve >=90% success rate (vs. 65% with current API key flow).",
    children: [],
    blocks: [
      { id: "ip-tst-3-b0", type: "pills", items: [{ label: "Duration", value: "2 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-3-b1", type: "quote", content: "OAuth-based Shopify connection will achieve ≥90% success rate (vs. 65% with current API key flow)." },
      { id: "ip-tst-3-b2", type: "accordion", label: "Method", content: "1. Build Shopify OAuth connector\n2. Route 50 new Shopify trial signups to OAuth flow\n3. Track: success rate, time to complete, error types, support tickets\n4. Compare to last 50 API-key signups on same metrics" },
      { id: "ip-tst-3-b3", type: "accordion", label: "Success Criteria", content: "≥90% connection success rate with ≤60 second median completion time" },
    ],
  },
  "ip-tst-4": {
    id: "ip-tst-4", level: "test", title: "Track shared link viewer -> signup conversion for 100 shared links", icon: "FlaskConical", status: "commit", parentId: "ip-asm-4",
    description: ">=5% of unique shared link viewers will create an InsightPulse account within 30 days.",
    children: [],
    blocks: [
      { id: "ip-tst-4-b0", type: "pills", items: [{ label: "Duration", value: "4 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-4-b1", type: "quote", content: "≥5% of unique shared link viewers will create an InsightPulse account within 30 days." },
      { id: "ip-tst-4-b2", type: "accordion", label: "Method", content: "1. Launch shareable links feature for 30 accounts\n2. Track: unique viewers per link, signup rate, time-to-signup\n3. Survey new signups who came from shared links: what motivated them?\n4. Calculate: viral coefficient (new signups per sharing account)" },
      { id: "ip-tst-4-b3", type: "accordion", label: "Success Criteria", content: "≥5% viewer-to-signup conversion rate" },
    ],
  },
  "ip-tst-5": {
    id: "ip-tst-5", level: "test", title: "Monitor upgrade rate for accounts with 3+ shared link viewers", icon: "FlaskConical", status: "commit", parentId: "ip-asm-5",
    description: "Accounts where 3+ unique people view shared dashboards will upgrade to Growth plan at >=2x the rate of accounts with 0-2 viewers.",
    children: [],
    blocks: [
      { id: "ip-tst-5-b0", type: "pills", items: [{ label: "Duration", value: "8 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-5-b1", type: "quote", content: "Accounts where 3+ unique people view shared dashboards will upgrade to Growth plan at ≥2x the rate of accounts with 0-2 viewers." },
      { id: "ip-tst-5-b2", type: "accordion", label: "Method", content: "1. Track viewer counts per account over 8 weeks\n2. Compare plan upgrade rates: accounts with 3+ viewers vs. 0-2 viewers\n3. Interview 10 upgraders: what triggered the decision?\n4. Interview 10 non-upgraders with 3+ viewers: why not?" },
      { id: "ip-tst-5-b3", type: "accordion", label: "Success Criteria", content: "≥2x upgrade rate for accounts with 3+ viewers" },
    ],
  },
  "ip-tst-6": {
    id: "ip-tst-6", level: "test", title: "Blind quality review of 50 AI-generated weekly digests", icon: "FlaskConical", status: "commit", parentId: "ip-asm-6",
    description: ">=80% of AI-generated insights will be rated as \"accurate and actionable\" by the account owner.",
    children: [],
    blocks: [
      { id: "ip-tst-6-b0", type: "pills", items: [{ label: "Duration", value: "3 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-6-b1", type: "quote", content: "≥80% of AI-generated insights will be rated as \"accurate and actionable\" by the account owner." },
      { id: "ip-tst-6-b2", type: "accordion", label: "Method", content: "1. Generate digests for 50 real accounts using our LLM pipeline\n2. Send each digest to the account owner with a 3-question rating form\n3. Questions: Is this accurate? Is it relevant? Would you act on it?\n4. Error analysis: categorize failures (wrong data, generic insight, hallucination)" },
      { id: "ip-tst-6-b3", type: "accordion", label: "Success Criteria", content: "≥80% of insights rated \"accurate and actionable\"" },
    ],
  },
  "ip-tst-7": {
    id: "ip-tst-7", level: "test", title: "A/B test: weekly digest vs. no digest for 100 accounts", icon: "FlaskConical", status: "commit", parentId: "ip-asm-7",
    description: "Accounts receiving weekly digests will have >=2x login frequency and >=15% better 90-day retention.",
    children: [],
    blocks: [
      { id: "ip-tst-7-b0", type: "pills", items: [{ label: "Duration", value: "8 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-7-b1", type: "quote", content: "Accounts receiving weekly digests will have ≥2x login frequency and ≥15% better 90-day retention." },
      { id: "ip-tst-7-b2", type: "accordion", label: "Method", content: "1. Split 100 similar-tenure accounts: A (digest enabled) vs. B (no digest)\n2. Run for 8 weeks\n3. Track: login frequency, dashboard views, feature usage, retention\n4. Measure digest engagement: open rate, click-through rate, unsubscribe rate" },
      { id: "ip-tst-7-b3", type: "accordion", label: "Success Criteria", content: "≥2x login frequency and ≥15% retention improvement in digest group" },
    ],
  },
  "ip-tst-8": {
    id: "ip-tst-8", level: "test", title: "Measure signup drop-off with vs. without segmentation questions", icon: "FlaskConical", status: "commit", parentId: "ip-asm-8",
    description: "Adding 2 segmentation questions to signup will cause <3% drop-off increase while enabling >=30% higher dashboard completion.",
    children: [],
    blocks: [
      { id: "ip-tst-8-b0", type: "pills", items: [{ label: "Duration", value: "3 weeks" }, { label: "Status", value: "Not Started" }] },
      { id: "ip-tst-8-b1", type: "quote", content: "Adding 2 segmentation questions to signup will cause <3% drop-off increase while enabling ≥30% higher dashboard completion." },
      { id: "ip-tst-8-b2", type: "accordion", label: "Method", content: "1. A/B test: A (current signup) vs. B (signup + 2 questions + tailored onboarding)\n2. Track: signup completion rate, time-to-first-dashboard, dashboards created in first week\n3. Run for 200 signups per variant\n4. Survey variant B: did the questions feel relevant or annoying?" },
      { id: "ip-tst-8-b3", type: "accordion", label: "Success Criteria", content: "<3% signup drop-off increase AND ≥30% higher dashboard completion" },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTED PRODUCT LINES
// ════════════════════════════════════════════════════════════════════════════

export const PRODUCT_LINES: Record<string, ProductLine> = {
  freshcart: {
    id: "freshcart",
    name: "FreshCart",
    description: "B2C grocery delivery",
    status: "active",
    personas: [
      { id: "persona-fc-busy-parent", name: "Busy Parent", description: "Age 30-42, dual-income household, 1-2 kids. Orders 2-3× per week, average basket €45. Pain: substitutions ruin meal plans; delivery slots are confusing." },
      { id: "persona-fc-health-single", name: "Health-Conscious Single", description: "Age 25-35, urban professional. Orders 1-2× per week, average basket €28. Pain: hard to find specialty/organic items; wants nutritional info." },
      { id: "persona-fc-impulse-adder", name: "Impulse Adder", description: "Age 20-40, spontaneous shopper who adds items during checkout. Responds to recommendations, deals, and visually appealing product pages." },
    ],
    tree: FRESHCART_TREE,
    entities: FRESHCART_ENTITIES,
  },
  insightpulse: {
    id: "insightpulse",
    name: "InsightPulse",
    description: "B2B e-commerce analytics",
    status: "active",
    personas: [
      { id: "persona-ip-data-analyst", name: "Data Analyst", description: "Mid-level analyst at a DTC brand. Builds dashboards and reports weekly. Pain: exporting data across tools is tedious and error-prone." },
      { id: "persona-ip-ecom-manager", name: "E-commerce Manager", description: "Manages online storefront and marketing spend. Needs high-level KPIs and trend summaries, not raw data." },
      { id: "persona-ip-founder", name: "DTC Founder", description: "Solo or small-team founder running a direct-to-consumer brand. Wants instant clarity on what's working and what's not, without learning complex BI tools." },
    ],
    tree: INSIGHTPULSE_TREE,
    entities: INSIGHTPULSE_ENTITIES,
  },
};

// DEFAULT_PRODUCT_LINE_ID moved to schemas.ts
