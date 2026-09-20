# Segment A3 — Construction Owner-Operators: Owned Heavy Equipment & Tools (US)

**Scope**: GCs, heavy civil/infrastructure contractors, and specialty trades that OWN their iron (excavators, loaders, dozers, cranes, skid steers, backhoes, compactors) plus attachments, small tools, generators, light towers. Perspective is the OWNER-OPERATOR's own-vs-rent decision, utilization of owned iron, and tool/small-asset control — not on-road vehicles/job-costing generally (separate researcher) and not the rental company's side (separate researcher).

**Research method note**: WebFetch was unavailable (network policy). All findings are WebSearch-snippet derived — one level removed from primary source documents — and the WebSearch budget for this session was exhausted before every sub-topic in the brief could be individually queried (notably: PM-interval compliance detail, downtime-cost-as-crew-idle-cost specifics, Samsara/Trackunit head-to-head, Procore equipment integration, OSHA equipment-specific incident data, Tier 4/emissions detail, and a direct ARA rate citation were not independently retrieved and are flagged as gaps below rather than guessed at). Confidence labels: 🟢 primary source directly cited in a retrieved snippet, 🟡 secondary/aggregator source, 🔴 UNVERIFIED INDUSTRY LORE (a number in circulation with no traceable source in what was retrieved).

---

## 1. The Operating Model: Own vs. Rent vs. Lease

**The core question is not "what does this machine cost" but "how many hours a year will it actually work."** Ownership converts a variable rental cost into a fixed cost (depreciation, interest/opportunity cost of capital, insurance, storage) plus a lower marginal operating cost; that fixed cost only pays for itself once utilization crosses a threshold.

- **The heuristic contractors actually use**: below roughly **40% utilization, renting almost always wins**; the **40–65% utilization band requires a real cost comparison**; above that, ownership tends to win. A commonly cited translation into calendar terms: **fewer than ~150–180 working days/year favors rental; above ~200 days/year favors ownership**, with break-even frequently landing around **60–65% utilization (~150 working days/year)** for a lot of mid-size iron. 🟡 (ToolGrit, Metal Construction News, Cleveland Brothers via WebSearch snippets, 2025-2026 blog content — no single primary-source study underlies the exact percentages; treat the *shape* of the curve as sound and the specific cutoffs as directionally right but soft.)
- **The formal methodology contractors and estimators point to** is the **U.S. Army Corps of Engineers EP 1110-1-8 (Construction Equipment Ownership and Operating Cost Guide)**, which is the standard reference for computing ownership vs. operating cost components (depreciation, cost of capital, insurance/taxes/storage vs. fuel, lube, maintenance, repair, wear parts, operator). 🟡 (referenced across multiple industry blogs; not independently verified against the EP document itself in this pass).
- **Break-even mechanics**: Break-even utilization is the point where Total Cost of Ownership (purchase price + lifetime operating/maintenance costs − salvage value, annualized) equals cumulative rental cost for the same hours. Below break-even, renting is cheaper per hour of actual use; above it, owning is cheaper. 🟡
- **Internal charge rate mechanism** (briefly, since job-costing is out of scope for this researcher): contractors set an **internal hourly rate per asset** — Cost of Purchase/motor-hour + Cost of Annual Ownership/motor-hour + Cost of Running/motor-hour + Cost of Maintaining/motor-hour = internal rate — and charge that rate to whichever job uses the machine, similar in structure to EquipmentWatch's Rental Rate Blue Book cost-recovery methodology used to set "what should I charge this job to break even on this machine." Example internal-rate build cited: **$12.80 (purchase) + $3.00 (ownership) + $25.50 (running) + $5.00 (maintaining) = $46.30/motor-hour**. 🟡 (illustrative example from a contractor-facing calculator tool, not an industry average).
- **Mobilization between jobsites**: moving heavy iron between jobs consumes non-productive hours (transport, permits for oversize loads, reassembly) that count against calendar availability but not against "working hours" — this is one of the reasons a machine's engine-hour clock and its billable-to-a-job clock diverge (see Section 6).
- **Attachment and tool management** sits on a fundamentally different economic curve than heavy iron (see comparison table below): attachments and small tools are numerous, individually low-value, and easily relocated/pocketed, so the control problem is inventory/shrinkage, not utilization economics.
- **Heavy iron vs. small tool economics — the core divergence driving different metrics**:

| Dimension | Heavy iron (excavators, dozers, cranes, loaders) | Small tools & attachments (buckets, breakers, generators, hand/power tools) |
|---|---|---|
| Unit value | $50K–$1M+ | $50–$5,000 |
| Decisive question | Own vs. rent; utilization % | Where is it, who has it, is it there when needed |
| Primary tracking tech | Telematics (OEM + aftermarket GPS), engine-hour meters | GPS/BLE tags, RFID, QR checkout, ONE-KEY-style crowdsourced BLE |
| Cost of tracking vs. asset value | Trivial (tracking hardware is a rounding error vs. machine cost) | Can exceed the item's value — a rugged BLE/RFID tag runs **$3–$15 per unit** against tools worth $50–$300, plus a subscription; the reason many small tools remain untracked is this basic economics problem 🟡 (Airpinpoint/RedBeam WebSearch snippets, 2025-2026) |
| Failure mode | Underutilization (idle capital) | Shrinkage/theft (walk-off, no accountability) |
| Owning metric | Utilization rate, cost/hour vs. rental equivalent | Checkout compliance %, loss rate %, count reconciliation |
| Who cares most | Equipment Manager, CFO | Superintendent, Tool Room Manager, Foreman |
| Typical system | HCSS Equipment360, B2W Maintain, Tenna, OEM telematics | Hilti ON!Track, Milwaukee ONE-KEY, ToolWatch/AlignOps, GoCodes |

---

## 2. The Metrics That Drive This Segment

| Metric | Formula | Unit | Why it matters / decision triggered | Benchmark (source, year) | Confidence |
|---|---|---|---|---|---|
| Equipment utilization rate | Operating (working) time ÷ total available time × 100 | % | Core own-vs-rent and redeploy/sell signal | Fleets *average* 55–70%; "optimal" target range cited as 70–85% | 🟡 (FleetRabbit/industry blog snippets, 2025-2026) |
| Engine hours vs. working hours vs. idle hours | Engine hrs = key-on time (telematics default); Working hrs = engine hrs − idle hrs; Idle hrs = engine-on, not producing | hours | Telematics reports engine hours by default; only working hours produce value — using raw engine hours overstates true utilization and mis-times PM intervals | Idle commonly **38–40% of total engine hours** industry-wide, ranging <20% (large machines) to >50% (compact machines); some sources cite fleets idling **40–60% of total operating hours** on poorly monitored fleets | 🟡 (FleetRabbit, Tenna-adjacent blog content, 2025-2026) |
| Owned cost per operating hour vs. equivalent rental rate | (Ownership cost/hr + operating cost/hr) vs. published rental rate/hr for same class | $/hr | Direct own-vs-rent comparator, feeds break-even calc | Internal rate example: **$46.30/motor-hour** all-in (illustrative build, not a market average); rental comparators come from EquipmentWatch Rental Rate Blue Book / Rouse Cat-Class benchmarks | 🟡 |
| Own-vs-rent break-even utilization | Point where annualized TCO = cumulative rental cost | % util or days/yr | Capital allocation gate — buy, keep renting, or sell | ~40% util = rent; 40–65% = analyze; >65% (~150–200 days/yr) = own | 🟡 |
| Asset availability when crew needs it | Machines ready/on-site at need date ÷ machines needed | % | Drives PM planning has direct standby friction with utilization (see Section 4) | No sourced benchmark found | 🔴 (concept is standard practice; no numeric benchmark retrieved) |
| Idle time / idling fuel waste | Idle fuel burn × idle hours | gal, $ | Direct, controllable cost; also inflates hour-meter without producing work | Large excavators burn **1.5–2.5 gal/hr at idle**; a single excavator idling 3 hrs/day at $25/hr fuel cost drains **~$19,500/yr** over a 260-day calendar; fleets can waste **20–25% of total fuel spend** on idle/deferred maintenance/mismatch | 🟡 (FleetRabbit, industry blog content, 2025-2026 — figures are illustrative/aggregated, not from a single audited study) |
| Equipment downtime cost as crew idle cost | Crew hourly burdened cost × hours crew waits on down machine | $ | Reframes a mechanical failure as a labor-productivity loss, which is usually the bigger number | Not independently sourced this pass | 🔴 gap — flagged for follow-up |
| PM compliance vs. manufacturer hour intervals | PMs completed on schedule ÷ PMs due, by hour interval | % | Warranty preservation, breakdown avoidance; idle-inflated engine hours cause PM to trigger "early" relative to actual work done | Example cited: excavator with 40% idle time hits a 250-hr service interval after only **156 productive hours**, effectively **increasing PM frequency ~60%** relative to work performed | 🟡 (FleetRabbit-style blog synthesis, 2025-2026) |
| Maintenance cost per hour / per asset | Total maintenance+repair $ ÷ hours (or per unit) | $/hr, $/asset | Cost-per-hour creep is the leading indicator a machine should be sold | No independently sourced benchmark retrieved this pass | 🔴 gap |
| Component life / major-repair timing | Hours or miles to major component failure (engine, transmission, undercarriage) | hours/miles | Determines rebuild-vs-replace and residual value | Undercarriage is "the primary depreciation driver after year 5"; full undercarriage replacement on a mid-size machine runs **$15,000–$35,000**; major component failures on trucks cited at 150,000–200,000 miles (on-road analogy, not iron-specific) | 🟡 (GetClue/HeavyDutyYard blog content, 2025-2026) |
| Fleet age / replacement point | Age or hours at which cost/hr crosses acceptable threshold | years/hours | Capex planning trigger | Excavators lose **~32% of value in first 3 years**, another **~23% years 3–7** (>50% total loss by year 7) — explains why 7-year-old crawler excavators dominate used listings; depreciation slows to **8–15%/yr years 3–5**, **5–10%/yr after year 6** | 🟡 (HeavyDutyYard/GetClue, 2025-2026) |
| Residual / resale value | Market resale price at disposal | $ | Feeds replacement-point and lease-vs-buy math | See depreciation curve above | 🟡 |
| Fuel burn per hour by machine class | Gallons/hour by machine class and load | gal/hr | Operating-cost input, idle-waste baseline | Only excavator-class idle figures retrieved (1.5–2.5 gal/hr idle); no cross-class table (dozer, loader, crane) sourced this pass | 🔴 partial — excavator only, gap for other classes |
| Theft/shrinkage rate — heavy equipment | Units stolen ÷ fleet, or $ lost/yr | %, $ | Insurance, security investment | Annual US construction equipment theft losses estimated at **$300M–$1B+/yr**; average single-theft incident cost **~$30,000**; recovery rate **~20–21%** overall, dropping to **<7%** for single-item thefts | 🟡 — see Section 5 caveat: NER/NICB stopped publishing detailed joint annual reports after 2016; current figures are industry restatements of that legacy data, not a fresh 2025/2026 primary count |
| Theft/shrinkage rate — small tools | Units lost ÷ tools issued | % | Tool-room accountability, replacement budget | Not independently sourced this pass (distinct from heavy-equipment theft stats above) | 🔴 gap |
| Tool accountability / checkout compliance | Checkouts logged ÷ tools issued | % | Tool Room Manager KPI | No numeric benchmark retrieved; qualitative vendor claims only (Hilti ON!Track, Milwaukee ONE-KEY) | 🔴 gap (no % benchmark found) |
| Attachment tracking | Attachments tagged/located ÷ attachments owned | % | Prevents "lost" buckets/breakers charged to wrong job or written off | Not independently sourced | 🔴 gap |
| Telematics engine hours vs. hours billed to a job | Engine hrs (telematics) vs. hrs allocated in job cost system | hours (delta) | Detects under/over-billing between jobs, idle inflation, meter drift | Conceptually well-established (see Section 6); no numeric reconciliation benchmark retrieved | 🟡 concept / 🔴 no benchmark |
| Equipment-related safety incidents / operator certification compliance | Incidents per equipment-hours; certified operators ÷ operators assigned | rate, % | Safety Director KPI, OSHA exposure | Not independently sourced this pass (OSHA equipment-specific data not retrieved before budget exhausted) | 🔴 gap |
| Emissions / Tier 4 compliance | Tier 4 Final-compliant units ÷ fleet, DEF/DPF uptime | % | Regulatory risk, especially in nonattainment areas / CARB-adjacent rules affecting fleets operating in California | Not independently sourced this pass | 🔴 gap |

---

## 3. How They Measure: Cadence, Workflow, Systems of Record

**Cadence** (largely consistent with standard construction-equipment management practice; not all steps individually re-verified this pass):
- **Daily**: operator pre-use/DVIR-style inspection reports on heavy equipment; fuel and hour-meter logging.
- **Weekly**: equipment/shop meetings reviewing open work orders, PM due lists, and utilization by machine.
- **Monthly**: cost reviews — cost/hour by asset, PM compliance %, idle-time trend, comparing owned cost/hr against current rental-market rates.
- **Annual**: fleet planning and capex — which units to sell/trade, replacement schedule, utilization-history-driven buy decisions.

**Systems of record**:
- **Equipment management platforms** — **Tenna** (GPS/telematics + PM + utilization built specifically for construction), **HCSS Equipment360** (PM scheduling by calendar/runtime/odometer, work orders, mechanic dispatch, integrates with job costing), **B2W Maintain** (paired with B2W Track; deepest on maintenance scheduling + heavy civil job costing), **Trackunit** and **Samsara** as telematics/asset-tracking layers (not independently re-verified feature-by-feature this pass). 🟡
- **Tool tracking** — **Hilti ON!Track** (cloud-connected tags + inventory gateways; tracks who has what, how long, and certification status; flags under-used/hoarded tools), **Milwaukee ONE-KEY** (free platform built around Milwaukee's own connected tools plus Bluetooth "TICK" tags for non-smart tools; crowdsourced location updates whenever any ONE-KEY user's phone passes a tagged tool), **ToolWatch** (now part of **AlignOps** as of 2025; warehouse-grade, deep Sage 300/Viewpoint Vista integration, 30+ years serving large contractors), **Asset Panda/GoCodes**-class generalist tools. 🟢/🟡 (vendor-stated capabilities from vendor and review-site pages, 2025-2026)
- **OEM telematics portals** — Caterpillar VisionLink/Product Link, John Deere JDLink, Komatsu KOMTRAX, Volvo CareTrack — each proprietary to its brand.
- **The AEMP 2.0 / ISO 15143-3 standard**: originally an AEMP initiative from **2010**, formalized as **ISO/TS 15143-3** (ISO calls it "Fleet Data Exchange"), later refined further around **2016–2020**. It defines a common JSON/XML payload for a handful of core parameters — **position, hours, fuel level, and machine/fault status** — so a mixed-OEM fleet can be ingested into one system. **Most major manufacturers now support it.** 🟢/🟡 (AEM.org standards page + multiple vendor whitepapers, snippets retrieved 2026).
- **Construction ERP**: Viewpoint Vista, Sage 300 CRE, CMiC, Foundation — these carry the job-costing and equipment-charge-out ledger; ToolWatch/AlignOps explicitly integrates with Sage 300 and Viewpoint Vista.
- **Procore** provides project/jobsite context (where crews are, schedule) that equipment systems increasingly need to route the right machine to the right job — not independently re-verified as a specific equipment-module integration this pass.

**The practical reality of mixed-OEM fragmentation**: a typical contractor's fleet spans Caterpillar, Deere, Komatsu, Volvo, plus aftermarket brands, each with its own telematics portal with different UI, units, and definitions of "hours." One cited estimate: **mixed-brand fleets running separate, unreconciled portals lose 12–15 hours/week of staff time to manual switching and reconciliation**, a cost that unified AEMP-based integration platforms are built to eliminate. 🟡 (Proemion/vendor-adjacent source, 2025-2026 — treat as vendor-motivated but directionally credible given how consistently the pain point appears across independent sources). **What contractors actually do about it**: adopt a third-party aggregator (Tenna, Trackunit, HCSS, or telematics-specific middleware) that pulls AEMP-standardized feeds from each OEM portal into one dashboard, rather than trying to get crews/managers to check multiple native OEM apps.

---

## 4. Who Owns Each Number

| Role | Owns / cares most about | Tension |
|---|---|---|
| **Equipment Manager** | Fleet-wide utilization %, cost/hour by asset, own-vs-rent decisions, PM compliance, telematics data quality | Wants machines **moving between jobs and staying utilized** — an idle machine on one job is capital that should be redeployed or sold |
| **Shop Foreman / Mechanic lead** | PM compliance, work-order turnaround, maintenance cost/hour, component-life tracking | Executes PM but is squeezed between PM windows and machines being "needed on-site right now" |
| **Project Manager / Superintendent** | Asset availability when the crew needs it, avoiding crew idle time due to down or absent equipment | Wants a **machine on standby** even if it sits idle much of the time — a idle-but-present machine is insurance against schedule risk, which directly fights the Equipment Manager's utilization target |
| **Owner/President** | Capex allocation, fleet age/replacement point, overall fleet ROI | Arbitrates the EM-vs-PM tension; ultimately owns buy/sell/rent capital decisions |
| **CFO/Controller** | Owned cost/hour vs. rental equivalent, depreciation schedule, internal charge rates, cash flow impact of capex | Cares about the accounting/tax treatment (depreciation, Section 179) as much as the operational economics |
| **Tool Room Manager** | Checkout compliance, shrinkage rate, tool inventory reconciliation | Owns the "small tools" side of the split economics table above — a completely different job than the Equipment Manager's |
| **Safety Director** | Equipment-related incident rate, operator certification compliance | Cross-cuts both heavy iron and tools; enforcement often depends on the same checkout/telematics systems built for cost control |

**The central tension worth building product around**: the Equipment Manager is compensated (implicitly or explicitly) on fleet utilization and cost/hour; the Project Manager/Superintendent is compensated on schedule adherence and is naturally risk-averse about equipment availability. A PM would rather have an underused machine standing by than risk a production stoppage. This is the segment's classic optimization conflict and is the reason "utilization" alone is an incomplete metric — it must be read alongside "was the crew ever blocked waiting on equipment."

---

## 5. Benchmarks (with source, year, and skepticism applied)

| Claim | Figure | Source (as retrieved) | Year | Confidence |
|---|---|---|---|---|
| Annual US construction equipment theft losses | **$300M–$1B+/yr**, commonly rounded to "over $1 billion" in circulation | National Equipment Register (NER) legacy estimate, restated across multiple 2025-2026 secondary sources (Texas Final Drive, GetSafeAndSound, LiveViewGPS, DroneStrategicPartners) | Legacy NER/NICB figures (last detailed joint report **2016**); restated 2024-2026 | 🟡 — figure is real but **stale**: NICB/NER stopped publishing detailed joint annual theft reports after 2016; every 2025/2026 "current" citation found in this pass is a restatement of that old baseline, not a fresh count |
| Average single equipment theft loss | **~$30,000/incident** | Same NER-derived secondary sources | Legacy, restated 2025-2026 | 🟡 |
| Equipment theft recovery rate | **~20–21%** overall; **<7%** for single-item thefts | Same NER-derived secondary sources | Legacy, restated 2025-2026 | 🟡 — directionally consistent with well-known "equipment theft recovery is far worse than auto theft recovery" framing, but exact percentage not traced to a primary NICB dataset in this pass |
| Construction fleet average utilization | **55–70%** average; **70–85%** cited as "optimal" | FleetRabbit and similar equipment-management blog content | 2025-2026 | 🟡 secondary aggregator, not a named primary study |
| Idle share of total engine hours | **38–40%** industry average; range **<20% to >50%** by machine size | Telematics-vendor-adjacent blog synthesis | 2025-2026 | 🟡 |
| CFMA 2025 Construction Financial Benchmarker | Exists, covers liquidity/profitability/leverage/efficiency ratios, distributed to **~10,000 firms** (CFMA members, non-members, CICPAC-affiliated) | CFMA.org | 2025 (based on 2024 data) | 🟢 primary (CFMA's own page) for the survey's existence and scope; **equipment-specific ratio values were not retrieved** — CFMA's site did not surface equipment-cost-per-hour or utilization detail in the snippets pulled |
| EquipmentWatch Q1 2025 retail rental rate moves | Compact track loaders **+3.28%** to $1,349/wk; skid steers **+2.21%** to $1,124/wk; wheel loaders **+1.85%** to $2,751/wk; telehandlers **+12.43%** to $2,103/wk | EquipmentWatch Rental Rate Report, via Equipment World coverage | Q1 2025 | 🟢/🟡 (trade-press coverage of a named primary report) |
| Rouse Services benchmarking scope | Data drawn from **400+ companies**, **$115B** of fleet (cost basis), **$49B** of rental revenue, benchmarked by Cat Class | Rouse Services own site | undated (site accessed 2026) | 🟢 primary (vendor's own claim about its own dataset scope — not independently audited) |
| AEM 2025 industry economic impact | US off-highway equipment manufacturing: **$902B** total sales activity, **2.2M jobs**, **$194B** labor income, **$415B** GDP contribution; construction-equipment-manufacturing direct employment **+2.9%** | AEM 2025 Annual Report (aem.org PDF) | 2025 | 🟢 primary — but this is **manufacturer-side** economic-impact data, not contractor utilization/ownership-economics data; included for context only, not as a segment behavior benchmark |
| Excavator depreciation curve | **~32%** value loss years 0-3; additional **~23%** years 3-7 (>50% cumulative by year 7); undercarriage replacement **$15,000–$35,000** | HeavyDutyYard, GetClue (blog/analytics content) | 2025-2026 | 🟡 secondary, plausible and consistent with general heavy-equipment depreciation knowledge, but not a named primary valuation study (e.g., not directly cited to Ritchie Bros/IronPlanet auction data, which would be the ideal primary source) |
| Excavator idle fuel burn | **1.5–2.5 gal/hr** at idle (large excavators) | FleetRabbit-style blog content | 2025-2026 | 🟡 |
| ARA rental benchmark rates as own-vs-rent comparator | Not independently retrieved this pass | — | — | 🔴 gap — flagged; EquipmentWatch and Rouse data above serve as partial substitutes but ARA's own published index was not queried before the search budget was exhausted |
| OSHA equipment-specific incident data | Not independently retrieved this pass | — | — | 🔴 gap |

**General skepticism note**: several figures repeated confidently across marketing/aggregator blogs (idle-time percentages, "internal rate" examples, tool-tag costs) recur nearly verbatim across multiple sites, suggesting a shared secondary source rather than independent measurement. Treat the *direction and order of magnitude* as reliable; treat the *second decimal place* as decoration.

---

## 6. Where Measurement Breaks Down Today

1. **Engine hours ≠ working hours ≠ billed hours, and the three routinely diverge.** Telematics defaults to reporting engine (key-on) hours because that's what the ECU exposes cheaply; only working hours reflect value produced; and hours billed to a job in the ERP are whatever got manually entered on a time card or DVIR, which may not match either. A machine idling 40% of its engine-on time hits its 250-hour PM interval after only ~156 productive hours — so **PM scheduling keyed to raw engine hours over-services machines relative to actual work**, while utilization reports keyed to engine hours **overstate** true productive use. 🟡
2. **Utilization *history* good enough to justify buying or selling a machine is rare.** Most contractors can say a machine "worked a lot" or "sat around," but a defensible hours-and-dollars trail per asset, reconciled against job costing, is the exception rather than the rule — this is exactly the gap platforms like Equipment360, B2W Maintain, and Tenna are selling against. (Synthesis from the cadence/systems findings above; no single source states this as a statistic, but it is the consistent implicit selling point across every equipment-management vendor's own positioning.) 🟡
3. **Attachments and small tools mostly have no tracking at all, and the reason is pure unit economics**: a rugged BLE/RFID tag costs **$3–$15**, plus a per-tag subscription, against tools frequently worth **$50–$300** — so item-level tagging can cost more than the tool itself once hardware + software + labor-to-tag is counted. One industry analysis states plainly that "even wildly optimistic projected cost savings only marginally justify the cost of the most optimistically-priced RFID tags," concluding universal item-level tagging isn't justified for lower-value items. **This is the economic floor for tagging an asset**: tagging only pencils out once (a) the asset's unit value clears roughly the price of a mid-tier connected/smart tool ($150–$500+) or better yet a piece of heavy iron, or (b) the tracking is bundled for free into a tool the contractor was buying anyway (Milwaukee's ONE-KEY-enabled tools, Hilti's fleet-management-included tool subscription), turning tagging from a discrete purchase decision into a zero-marginal-cost feature. Below that line, contractors rely on cheaper controls: tool-room checkout logs, gang-boxes, and crew accountability rather than per-item electronic tracking. 🟡
4. **Theft discovery lag on remote jobsites compounds the already-low recovery rate.** Heavy equipment often sits unattended on active or between-phase jobsites for days; by the time a theft is noticed, reported, and cross-checked against VIN/serial databases, the window for recovery (which is already only ~20% successful, ~7% for single-item thefts per the legacy NER data) has mostly closed. 🟡 (inference consistent with the recovery-rate data in Section 5; discovery-lag itself not separately quantified in sources retrieved).
5. **Mixed-OEM telematics fragmentation is real and costly in staff time, and AEMP/ISO 15143-3 is the answer on paper but adoption is uneven in practice.** Most major OEMs now expose an AEMP-compliant feed, but contractors still commonly report **12–15 hours/week** of staff time lost to manually reconciling separate native OEM portals — implying that even where the standard exists, contractors either aren't fully on AEMP-based aggregation yet, or the aggregation layer itself introduces its own friction. This is a clear opportunity space: a genuinely unified, AEMP-native equipment dashboard remains a differentiator rather than table stakes. 🟡
6. **PM scheduling by hours breaks when hour meters are inaccurate, disconnected, or the machine is offline.** Telematics-based hour tracking assumes a connected, functioning meter; on older machines, in poor-connectivity remote sites, or after meter/ECU faults, PM triggers revert to manual estimates or get missed entirely — compounding the engine-hours-vs-working-hours distortion in point 1. (Concept well-established across the equipment-management vendor content reviewed; not independently quantified with a "% of fleet with unreliable meters" statistic in this pass.) 🟡
7. **Allocating one machine's cost across several jobs in a month remains a manual, error-prone reconciliation** between the equipment system's hour/location log and the job-costing system's charge-out ledger — the same root cause as point 1 (which hours count) compounded by the practical difficulty of a single excavator working partial days across two or three job sites in the same billing period. This is the seam where "telematics hours" and "job-costed hours" are supposed to reconcile and frequently don't. 🟡

---

## Source List

- Cleveland Brothers, "Renting vs. Buying Construction Equipment in 2026" — https://www.clevelandbrothers.com/blog/rent-vs-buy-construction-equipment-for-2026
- For Construction Pros / United Rentals, "The Science of Construction Equipment Buy vs. Rent Decisions" — https://www.forconstructionpros.com/equipment/article/21119184/united-rentals-inc-infographic-the-science-of-construction-equipment-buy-vs-rent-decisions
- United Rentals, "How Does Your Construction Equipment Utilization Compare?" — https://www.unitedrentals.com/project-uptime/expertise/how-does-your-construction-equipment-utilization-compare
- ToolGrit, "Own vs. Rent: The Real Cost of Construction Equipment" — https://www.toolgrit.com/guides/equipment-cost-analysis
- Metal Construction News, "Calculate the Right Equipment Rate" — https://www.metalconstructionnews.com/articles/columns/calculate-the-right-equipment-rate/
- Alpine Equipment Repair, "Renting vs Buying Equipment: Cost Calculator & Guide" — https://alpineeq.com/blogs/news/renting-vs-buying-equipment-cost-calculator-guide
- For Construction Pros / GB Financial Services, "Calculate Equipment Costs to Assess When to Own vs. Rent" — https://www.forconstructionpros.com/business/article/21563423/gb-financial-services-llc-calculate-equipment-costs-to-assess-when-to-own-vs-rent
- SITECH Southwest, "Calculating Construction Technology ROI for Renting Versus Buying Equipment" — https://www.sitechsw.com/calculating-construction-technology-roi-for-renting-versus-buying-equipment/
- GetClue, "10 Construction Fleet Metrics for Enterprise Teams" — https://www.getclue.com/blog/construction-fleet-metrics-for-enterprise-teams
- FleetRabbit, "Construction Equipment Utilization Rate: What It Is and How to Improve It" — https://fleetrabbit.com/industry/construction-management-system/construction-equipment-utilization-rate-improve
- Tenna, "Construction Equipment Utilization" — https://www.tenna.com/blog/measure-and-improve-construction-equipment-utilization/
- Oxmaint, "Construction Fleet Equipment Maintenance Schedule by Utilization" — https://oxmaint.com/industries/fleet-management/construction-fleet-equipment-maintenance-schedule-by-utilization
- Hapn, "Equipment Utilization Tracking: A Rental Guide" — https://gethapn.com/blog/equipment-utilization-tracking/
- Texas Final Drive, "Heavy Losses: Uncovering the World of Construction Equipment Theft" — https://info.texasfinaldrive.com/shop-talk-blog/heavy-losses-uncovering-the-world-of-construction-equipment-theft
- GetSafeAndSound, "Construction Theft Statistics: Complete Guide (2025)" — https://getsafeandsound.com/blog/construction-site-theft-statistics/
- LiveViewGPS, "Construction Equipment Theft Statistics (2026)" — https://www.liveviewgps.com/gps-tracking-statistics/construction-equipment-theft/
- DroneStrategicPartners, "Construction Equipment Theft Statistics 2026: Complete Data Reference" — https://www.dronestrategicpartners.com/post/construction-equipment-theft-statistics-the-complete-2026-data-reference
- National Equipment Register (NER), "Annual Heavy Equipment Theft Report" (legacy page) — https://www.ner.net/annual-theft-report/
- CFMA, "2025 Construction Financial Benchmarker" — https://cfma.org/benchmarker
- CFMA, "The Data Is in the Details: CFMA's 2025 Financial Benchmarker Results for Residential Construction" — https://cfma.org/articles/the-data-is-in-the-details-cfma-s-2-25-financial-benchmarker-results-for-residential-construction
- AutoPi, "AEMP 2.0 Explained: Mixed-Fleet Telematics Standard" — https://www.autopi.io/blog/what-is-aemp-telematics-standard/
- Geoforce, "AEMP/ISO 15143-3: Mixed-fleet data ingestion with examples (CAT, Deere, CASE)" — https://llms.geoforce.com/aemp-iso-15143-3-mixed-fleet-ingestion
- Proemion, "Unlocking the Power of Mixed Fleet Telematics with AEMP API" — https://www.proemion.com/en/resources/knowledge/white-paper/aemp-white-paper/aemp-whitepaper-full.html
- Trackunit, "Everything you should know about the ISO 15143-3 standard" — https://trackunit.com/articles/benefits-from-iso-15143-4/
- AEM, "ISO/TS 15143-3: ISO Fleet Data Exchange" — https://www.aem.org/standards/iso15143/3
- Motive, "Motive supports heavy equipment telematics via AEMP 2.0" — https://gomotive.com/blog/aemp-heavy-equipment-telematics/
- Airpinpoint, "RFID Asset Tracking: Tags, Systems & Costs Explained (2026)" — https://airpinpoint.com/asset-tracking/rfid
- RedBeam, "RFID Cost: Tags, Readers, Software, and Full System Pricing" — https://redbeam.com/blog/cost-of-rfid-tags
- Construction Industry Institute, "Radio Frequency Identification Tagging" — https://www.construction-institute.org/radio-frequency-identification-tagging
- GPX, "Small Tool Tracking: 8 Systems Contractors Actually Use" — https://gpx.co/blog/small-tool-tracking/
- ABAX, "10 Best Tool & Asset Tracking Software of 2026" — https://www.abax.com/en-gb/blog/10-best-tool-asset-tracking-software
- Hilti, "Discover ON!Track" — https://help.ontrack3.hilti.com/hc/en-us/articles/34399853104273-Discover-ON-Track
- Hilti USA, "ON!Track Tool Tracking And Asset Management" — https://www.hilti.com/content/hilti/W1/US/en/business/business/equipment/on-track.html
- MapTrack, "Best Construction Asset Management Software 2026" — https://www.maptrack.com/best/construction-asset-management
- Tenna, "7 Best Construction Equipment Maintenance Software" — https://www.tenna.com/blog/best-construction-equipment-maintenance-software/
- HCSS, "Heavy Equipment Maintenance Software | Equipment360" — https://www.hcss.com/products/fleet-maintenance-software/
- HCSS, "What is Equipment360?" — https://www.hcss.com/equipment360/what-is-equipment360/
- Equipment World, "Equipment Rental Rates Rising, EquipmentWatch Reports" — https://www.equipmentworld.com/business/equipment-rental/article/15744905/equipment-rental-rates-rising-equipmentwatch-reports
- RERmag, "EquipmentWatch Expands Data on Rates and Charges" — https://www.rermag.com/rental-news/article/20954840/equipmentwatch-expands-data-on-rates-and-charges
- Rouse Services, "Rental Insights" — https://www.rouseservices.com/solutions/rental-insights/
- EquipmentWatch, "Custom Charge Rates | Internal Charge Rates" — https://equipmentwatch.com/consulting/custom-charge-rates/
- EquipmentWatch, "Rental Rate Blue Book For Cost Recovery" — https://equipmentwatch.com/blue-book-cost-recovery/
- AEM, "2025 Annual Report" (PDF) — https://www.aem.org/AEM/media/docs/About/AEM-2025-Annual-Report.pdf
- AEM, "Ag, Construction Equipment Markets Hope for Much-Needed Momentum in 2025" — https://www.aem.org/news/ag-construction-equipment-markets-hope-for-muchneeded-momentum-in-2025
- GetClue, "How to Estimate and Manage Construction Equipment Costs" — https://www.getclue.com/blog/construction-equipment-costs
- CFMA (chapter resource), "Internal Equipment Costs" — https://chapters.cfma.org/forum_old/internalequipcosts.html
- Construction Business Owner, "What Is Your Equipment's True Cost?" — https://www.constructionbusinessowner.com/business-management/what-your-equipments-true-cost
- The Common Contractor, "Equipment Cost Calculator" — https://thecommoncontractor.com/equipment-cost-calculator/
- Edgestrat Finance, "How to Allocate Equipment Costs in Construction Job Costing" — https://www.edgestratfinance.com/contractor-resources/how-to-allocate-equipment-costs-in-construction-job-costing-so-your-jobs-stop-absorbing-hidden-overhead
- FleetRabbit, "How to Reduce Equipment Idle Time on Construction Sites" — https://fleetrabbit.com/industry/construction-management-system/how-to-reduce-equipment-idle-time-construction-sites
- FleetRabbit, "Cutting Construction Fuel Spend Without Slowing Work" — https://fleetrabbit.com/industry/construction-management-system/construction-fleet-cutting-fuel-spend-without-slowing-work
- Al Marwan, "How to Reduce Excavator Idle Time on Busy Sites" — https://almarwan.com/news/4837/reduce-excavator-idle-time
- Construction Equipment, "How to Manage Engine Idling for Efficiency" — https://www.constructionequipment.com/sustainability/article/10757122/how-to-manage-engine-idling-for-efficiency
- SFWMD, "Analysis of Fleet Replacement Lifecycle" (PDF) — https://www.sfwmd.gov/sites/default/files/documents/fleet_life_cycle_12-14.pdf
- GetClue, "Understanding the Depreciation of Construction Equipment through Analytics" — https://www.getclue.com/blog/depreciation-of-construction-equipment
- Thompson Machinery, "Understanding Equipment Depreciation to Calculate True Resale Value" — https://thompsonmachinery.com/about-us/blog/understanding-equipment-depreciation/
- CONEXPO-CON/AGG, "Construction Equipment Life Cycle Costs: Using Data for Better Decision Making" — https://www.conexpoconagg.com/news/construction-equipment-life-cycle-costs-using-data
- NEBB/Certitrek, "Construction Equipment Resale Value: Key Factors in a Dynamic Market" — https://www.certitrek.com/nebb/blog/construction-equipment-resale-value-key-factors-in-a-dynamic-market/
- HeavyDutyYard, "Equipment Depreciation Guide" — https://www.heavydutyyard.com/equipment-depreciation-guide

### Gaps flagged for follow-up (search budget exhausted before these could be independently queried)
- ARA (American Rental Association) published rate index as a direct own-vs-rent comparator
- OSHA equipment-specific (struck-by, caught-in/between on heavy equipment) incident statistics
- Tier 4 Final / emissions compliance tracking specifics and CARB-adjacent fleet rules
- Direct AGC (Associated General Contractors) survey data on own-vs-rent behavior
- Samsara and Trackunit feature/benchmark detail specific to construction heavy-equipment telematics (only referenced in passing via other queries)
- Numeric benchmarks for: tool checkout compliance %, attachment tracking %, small-tool-specific shrinkage rate (as distinct from heavy-equipment theft), maintenance cost per hour/asset, and downtime cost expressed as crew idle cost
