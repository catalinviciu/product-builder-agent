# Segment A2 — Equipment Rental & Leasing Companies (US)

**Players:** United Rentals (URI), Sunbelt Rentals / Ashtead Group (AHT), Herc Holdings (HRI), plus a long tail of independents and specialty renters (aerial/MEWP, earthmoving, power & HVAC, trench safety, tool rental).
**Scale anchors:** ~857,000-unit US MEWP rental fleet, 2024 (IPAF) 🟡; United Rentals ~$22.48B fleet OEC, ~1.095M units, 1,768 locations, FY2025 (10-K) 🟢.
**Research date:** September 2026. Confidence key: 🟢 primary (SEC filing, company press release/IR, standards body) · 🟡 secondary (trade press, vendor content, industry association summary) · 🔴 unverified industry lore.

---

## 0. The Central Analytical Point: Two Utilizations, Not One

Rental is the purest asset-economics business in this study: **the asset is the product, the balance sheet is the P&L engine, and every idle day is permanently lost revenue** — there is no "make it up later," unlike a factory that can run a double shift. The entire industry is run on two numbers that sound similar and are not:

| | Time Utilization | Dollar (Financial/Revenue) Utilization |
|---|---|---|
| **Question answered** | "Out of the days I could have rented this asset, how many was it actually on rent?" | "How much annual rental income am I extracting from every dollar I invested in this asset?" |
| **Formula** | Days on rent ÷ Days available to rent (calendar or fleet days) | Annualized rental revenue ÷ Original Equipment Cost (OEC) |
| **Unit** | % (bounded 0–100%) | % (unbounded — mathematically can exceed 100% for cheap, high-turnover items) |
| **Drivers** | Fleet sizing, mix, branch demand matching, transfer discipline | Rate achieved, time utilization, and how conservatively the asset was priced/bought |
| **What it misses** | Says nothing about the rate charged — a machine rented 100% of the time at a giveaway rate looks "great" | Says nothing about idle-day counts on its own — high-OEC, low-volume equipment can post modest dollar utilization while still being the profit engine |

**Why OEC and not net book value (NBV):** OEC is the original, undepreciated capitalized cost of the asset when purchased — it is fixed for the life of the asset and doesn't move with depreciation policy, funding structure, or accounting elections. NBV depreciates every year purely from accounting, which would make dollar utilization rise mechanically over an asset's life even with flat revenue — that's an accounting artifact, not a performance signal. OEC lets the industry compare a 6-year-old aerial lift to a brand-new one on a like-for-like investment basis, and it's the number United Rentals, Herc, and Ashtead all standardize on and disclose publicly (🟢 all three 10-Ks/annual reports use OEC as the utilization denominator).

### Worked example — same asset, two numbers

Assume a 40-ft boom lift purchased new for **$85,000 OEC** (a plausible mid-range unit cost for this class), used for a full fiscal year (365 days):

- The unit was on rent for **240 days** during the year at an average realized rate of **$450/day** (day-equivalent rate blended across day/week/month bookings).
- Rental revenue generated in the year = 240 days × $450/day = **$108,000**.

**Time Utilization** = 240 days on rent ÷ 365 available days = **65.8%**
**Dollar Utilization** = $108,000 annual rental revenue ÷ $85,000 OEC = **127%**

Now contrast with a second unit in the same class fleet that was rented out cheaply through a national account at $220/day but achieved near-perfect placement:
- 330 days on rent × $220/day = $72,600 revenue on the same $85,000 OEC.
- Time Utilization = 330/365 = **90.4%** (looks excellent on the daily utilization board)
- Dollar Utilization = $72,600/$85,000 = **85.4%** (materially worse than unit #1 despite higher time utilization)

This is exactly the trap the segment is built to avoid: a branch manager chasing time utilization alone will under-price to fill the yard, while dollar utilization (or "fleet productivity," URI's combined rate/utilization/mix metric 🟢) is the number that actually tracks profit. United Rentals explicitly frames "fleet productivity" as the multiplicative effect of rate, time utilization and mix on revenue (🟢 URI Q4/FY2025 release, businesswire.com).

---

## 1. The Operating Model

**Revenue mechanics — the rate ladder.** Pricing is anchored to a daily "book" rate with built-in discounts for longer commitments: industry convention is roughly a weekly rate at ~4–5x daily (not 7x) and a monthly rate at ~3x the weekly, i.e., ~10–12x daily, not 30x 🟡 (gethapn.com, armsoftware.com, 2026). As a % of the asset's acquisition/retail cost, monthly powered-equipment rates commonly run ~4–6% of acquisition cost, weekly ~2–2.5%, daily ~0.7–1% 🟡 (lendcontrol.com, 2026) — this is exactly what makes annualized dollar utilization able to exceed 100%: a unit rented continuously at even modest daily-equivalent rates recovers well over its OEC in a year. Actual achieved rate vs. this "book"/list rate — **rate realization** — is watched closely because national accounts, competitive bids, and branch-level discretion erode the book rate before revenue ever hits the P&L.

**Fleet investment (OEC) is the dominant strategic lever.** Fleet capex decisions — what to buy, how much, and when — are effectively the entire strategic decision for a rental company, since the fleet IS the balance sheet. United Rentals carried $22.48B OEC across ~1.095M units at Dec 31, 2025 (🟢 URI 10-K FY2025, sec.gov); Herc carried ~$9.5B OEC at Dec 31, 2025, up sharply (avg. OEC +26% for the year) largely from the H&E Equipment Services acquisition (🟢 Herc FY2025 press release, sec.gov).

**Fleet age management and the replacement cycle.** Average fleet age is a disclosed, closely watched proxy for both resale value and maintenance burden: United Rentals' average fleet age was 49.5 months at Dec 31 2025 (down from 51.3 months in 2024, i.e., the fleet got younger as capex additions outpaced aging) 🟢; Herc's average fleet age was 45 months at Dec 31 2025 vs 46 months in 2024 🟢. The replacement logic: as equipment ages, unplanned maintenance cost rises and residual/resale value falls, so companies aim to sell/rotate equipment before the maintenance-cost curve crosses the declining-resale-value curve — generic fleet-management guidance frames the trigger as maintenance spend approaching ~25–30% of current market value, or repair cost exceeding ~50% of current value 🔴 (unverified industry lore — generic fleet-vehicle guidance, not rental-specific or sourced to a rental operator; treat as directional only, autosist.com/myekos.com, 2026).

**Used-equipment resale as a profit center.** Disposal isn't a write-off event — it's an actively timed second revenue stream. United Rentals reported a **50.2% OEC recovery rate** on fleet sold in Q4 2025 (🟢 URI Q4/FY2025 press release) — i.e., used equipment sold for roughly half of its original cost after years of rental income already earned on it, which is the mechanism that makes total lifetime ROIC on a fleet asset run well above the rental-yield number alone.

**Branch network economics, re-rent, and ancillary revenue.** Branches are semi-autonomous P&L units that carry local fleet, staff, and often compensation tied to branch-level utilization and rate (see §4). When a branch lacks a unit, it "re-rents" from another branch or a third-party fleet to serve the customer rather than losing the job — a mechanism that blurs branch-level utilization and creates internal transfer-pricing tension. Ancillary revenue is material: damage waivers/loss damage waiver (LDW) fees commonly run ~10–14% of the rental line 🟡 (evidentid.com, partyrentalltd.com — mixed general/party-rental sourcing, treat as directional), and delivery/pickup charges are typically targeted at ~4–5% of total rental revenue 🟡 (gethapn.com, 2026). Overall, ancillary fees and incremental charges are cited as contributing roughly **15% of total rental revenue** industry-wide 🔴 (unverified industry lore — vendor blog figure, not sourced to a public filing; treat as directional).

---

## 2. The Metrics That Drive This Segment

| Metric | Formula | Unit | Cadence | Owner | Benchmark & Source (year) | Confidence |
|---|---|---|---|---|---|---|
| **Time utilization** | Days on rent ÷ days available | % | Daily/weekly board, monthly close | Branch Mgr / VP Fleet | Definition per URI/Herc methodology; specific current-year % not found in public snippets for URI/Herc (2025) | 🟡 definition; 🔴 for a specific current numeric benchmark |
| **Dollar (financial) utilization** | Annualized rental revenue ÷ OEC | % | Monthly, quarterly (disclosed) | CFO / VP Fleet | Herc: 37.5% Q4 2025 vs 40.6% Q4 2024 (Herc FY2025 release, sec.gov, 2026) 🟢; Ashtead/Sunbelt North America General Tool: 47% LTM vs 48% prior year; Specialty: 74% vs 73% (Ashtead FY2026 update, morningstar.com, 2026) 🟢 | 🟢 |
| **Physical utilization** | Time on rent + committed/held time ÷ total time (excludes non-rental-ready) | % | Weekly fleet review | VP Fleet | "Industry standard" target ~72% out on rent, ~20% in-yard rental-ready, ≤8% non-rental-ready (Rouse-style benchmark cited via targit.com, 2026) 🔴 unverified lore-level sourcing | 🔴 |
| **Rate realization (achieved vs. book/list rate)** | Actual invoiced rate ÷ list/book rate | % | Weekly rate review | Rate/Revenue Manager | Rouse Analytics benchmark service tracks this at local-market level across 400+ participating companies, $115B fleet OEC, $49B rental revenue (Rouse/ARA, rermag.com, empoweringpumps.com — service launched 2011, participant scale as of most recent report) 🟡 | 🟡 |
| **Fleet OEC / OEC on rent** | Total fleet OEC; OEC of units currently on rent ÷ total OEC | $ / % | Monthly close, quarterly disclosure | CFO / VP Fleet | URI: $22.48B total OEC, Dec 2025 (10-K, sec.gov) 🟢; Herc: ~$9.5B OEC, Dec 2025 (FY2025 release, sec.gov) 🟢 | 🟢 |
| **Average fleet age** | Weighted average age of fleet units (months) | Months | Quarterly disclosure | VP Fleet | URI: 49.5 months (Dec 2025) vs 51.3 (Dec 2024) 🟢; Herc: 45 months (Dec 2025) vs 46 (Dec 2024) 🟢 | 🟢 |
| **Replacement cost** | Current cost to buy equivalent new unit | $ | Quarterly capex planning | VP Fleet / CFO | Not separately disclosed by URI/Herc in public snippets; embedded in capex guidance | 🔴 (definition solid; no public per-unit figure found) |
| **Return on Invested Capital (ROIC)** | NOPAT ÷ (debt + equity − cash), trailing 12mo | % | Quarterly, annual | CEO / CFO | URI: 12.4% (12 months ended June 30, 2025); 11.7% full-year 2025 (URI IR releases, 2025–2026) 🟢 | 🟢 |
| **Adjusted EBITDA margin** | Adjusted EBITDA ÷ total revenue | % | Quarterly | CFO | URI: 45.9% (Q2 2025), 46.0% (Q3 2025), 45.5% (full-year 2025) (URI press releases, sec.gov/businesswire, 2025) 🟢 | 🟢 |
| **Flow-through / incremental margin** | Δ(operating profit or EBITDA) ÷ Δ(revenue), period over period | % | Quarterly | CFO | Standard industrials definition (ibinterviewquestions.com, trueprofit.io, 2026) 🟡; no URI/Herc-specific % found in these snippets | 🟡 definition only |
| **Revenue per branch / per unit** | Total rental revenue ÷ branch count or unit count | $ | Monthly/quarterly | Regional/Branch Manager | URI: ~1,768 locations, ~1.095M units, FY2025 (10-K) — enables a derived revenue/branch and revenue/unit figure but not a disclosed KPI per se 🟢 (inputs), 🔴 (as a named published KPI) | 🟢/🔴 |
| **Used equipment sale proceeds % of OEC (recovery rate)** | Net sale proceeds ÷ OEC of unit sold | % | Quarterly disclosure | Used Equipment Sales Manager | URI: 50.2% OEC recovery rate on fleet sold, Q4 2025 (URI Q4/FY2025 release) 🟢 | 🟢 |
| **Fleet mix optimization / demand forecasting by class** | Forecast demand by equipment class vs. current fleet mix by class | Class-level $ / units | Quarterly capex planning | VP Fleet / CEO | Vendor/industry commentary on AI-driven demand forecasting feeding dynamic pricing and capex (rentechmag.com, tapgoods.com, 2026) 🟡; Sunbelt cited as integrating demand forecasting with dynamic pricing 🟡 | 🟡 |
| **Transfer/rebalancing between branches** | Units transferred inter-branch ÷ total fleet; often tied to profit-sharing splits | % / count | Weekly/monthly | Regional Manager | Revenue-sharing on transfers cited as the standard remedy for hoarding (wynnesystems.com, 2026) 🟡 | 🟡 |
| **Delivery efficiency (on-time %, cost per delivery)** | On-time deliveries ÷ total deliveries; delivery cost ÷ delivery revenue | % / $ | Daily branch ops | Branch/Dispatch Manager | Delivery revenue target ~4–5% of total rental revenue (gethapn.com, 2026) 🔴 lore-level | 🔴 |
| **Maintenance cost as % of OEC** | Annual maintenance spend ÷ OEC | % | Monthly/quarterly | Service Manager | No rental-specific public benchmark found; generic fleet-vehicle rule of thumb (~25–30% of market value trigger) exists but is not rental-sector-sourced (autosist.com, myekos.com, 2026) 🔴 | 🔴 |
| **Downtime / out-of-service %** | Days out of service (repair/inspection) ÷ total fleet days | % | Daily/weekly | Service Manager | No public benchmark found in this research pass | 🔴 (no source found) |
| **Shrinkage / theft loss** | Value of lost/stolen units ÷ total fleet value | % / $ | Quarterly/annual | VP Fleet / Risk/Insurance | Construction-equipment theft recovery rate ~20–25% (vs. much higher for passenger vehicles); estimated ~$1B/year industry-wide loss (National Equipment Register, cited via getsafeandsound.com, liveviewgps.com, 2025–2026) 🟡 (trade-press summary of NER data, not a direct NER report read) | 🟡 |
| **Damage recovery rate** | Damage-waiver / billed-damage recoveries ÷ total damage incidents | % | Monthly | Service Manager / Risk | No public benchmark found | 🔴 (no source found) |
| **On-time delivery & pickup** | Same as delivery efficiency above | % | Daily | Branch/Dispatch Manager | No independent benchmark found beyond revenue-share figure above | 🔴 |
| **Contract & billing accuracy** | Error-free invoices ÷ total invoices | % | Monthly close | Billing/Revenue Manager | No public benchmark found | 🔴 (no source found) |
| **Telematics runtime hours vs. rented (billed) hours** | Actual engine/machine hours (telematics) vs. contracted rental hours | Hours, % variance | Continuous (telematics), reviewed weekly/monthly | VP Fleet / Service Manager | Trackunit markets ~4% average revenue increase from usage-based billing enabled by runtime reconciliation (trackunit.com, 2026) 🟡 (vendor claim) | 🟡 |
| **Days-to-return** | Days between contract end date and physical/system return confirmation | Days | Weekly | Branch Manager | No public benchmark found | 🔴 (no source found) |

---

## 3. How They Measure — Cadence, Workflow, and Systems of Record

**Cadence.** The segment runs a tight, nested measurement loop:
- **Daily** — branch utilization board: which units are on rent, in the yard ready, or down for service; daily dispatch/delivery scheduling.
- **Weekly** — fleet and rate reviews at the regional level: rate realization vs. book rate, transfer requests between branches, physical-utilization mix (on-rent / ready / not-ready).
- **Monthly** — financial close: dollar utilization, fleet productivity (rate × time utilization × mix), branch P&L roll-up.
- **Quarterly** — capex planning and public disclosure: fleet OEC, average fleet age, used-equipment OEC recovery rate, ROIC, EBITDA margin — this is also the cadence at which URI, Herc, and Ashtead report these metrics externally (🟢 confirmed across all three companies' quarterly IR releases, 2025–2026).

**Systems of record.**
- **Rental ERP** — the system of record for contracts, billing, and the fleet register: Wynne Systems' **RentalMan** (enterprise heavy-equipment fleets, built-in utilization/performance analytics as core functionality, not an add-on), **Point of Rental** (broad multi-vertical, SMB–mid-market), **Texada** (rent-and-service heavy equipment with integrated work orders/PM), plus Alert Management Systems and Smart Equip in the wider vendor landscape 🟡 (fieldservicesoftware.io comparison pages, 2026 — vendor-comparison-site sourcing, not the vendors' own primary documentation). Time and dollar utilization are computed natively inside these ERPs from the contract/fleet tables (days on rent ÷ days owned; revenue ÷ OEC), which is why utilization is reportable at unit, class, branch, region, and company level.
- **Telematics** — Trackunit, Samsara, and OEM feeds (Caterpillar Product Link, John Deere JDLink, Komatsu) supply actual machine runtime, location, and fault-code data, layered on top of the ERP's contractual/billing view. **This is where the ERP's answer and the telematics answer diverge**: the ERP knows what was *billed* (days/hours under contract); telematics knows what was *actually run*. A unit can be on-contract (counted as "on rent" for time utilization) while its engine hours show near-zero actual use — invisible to the ERP alone, visible only via telematics.
- **AEMP / ISO 15143-3** — this standard (formalized 2020, built on AEMP's original 2010 telematics standard) defines a common JSON/XML schema for position, hours, fuel, and machine-status data so a mixed-OEM fleet (Cat, Deere, Komatsu, JCB, etc.) can be ingested into one system instead of building bespoke connectors per brand 🟢 (iso.org, aem.org — standards-body sourcing). For a rental company running thousands of units across dozens of OEMs, this normalization is what makes fleet-wide telematics analytics (vs. per-brand silos) possible at all — without it, "true runtime hours" is only knowable brand-by-brand.
- **Where telematics changes the answer:** ERP-based time utilization says a unit was "on rent" for the full contract period; telematics-based runtime can show the customer ran it only a fraction of that time — meaning (a) the customer may be a churn/right-sizing risk (over-renting relative to need), (b) maintenance intervals set by calendar time are wrong and should be set by actual engine hours instead, and (c) usage-based billing becomes possible, which Trackunit markets as worth ~4% average revenue uplift by capturing usage that pure time-based billing missed (🟡 vendor claim, trackunit.com, 2026).

---

## 4. Who Owns Each Number

- **CEO** — overall ROIC, EBITDA margin, capital allocation between fleet growth capex and shareholder returns (URI's 2026 capital plan: ~$2B planned shareholder returns, new $5B buyback, alongside continued fleet capex — 🟢 URI Q4/FY2025 release).
- **CFO** — dollar utilization, EBITDA margin, flow-through, ROIC, OEC recovery rate on disposals — the metrics that translate operating performance into the numbers Wall Street tracks.
- **VP Fleet / Fleet Manager** — fleet OEC, average fleet age, fleet mix by class, replacement/disposal timing, telematics program ownership.
- **Regional and Branch Managers** — time utilization and physical utilization at the branch level; branch managers are **typically compensated on utilization and rate performance**, which is exactly the incentive structure that drives real, documented dysfunction: branch managers hold onto ("hoard") extra units "just in case" to protect their own utilization and rate numbers, creating artificial equipment shortages elsewhere in the network, unless transfer profit-sharing explicitly splits the revenue on a transferred unit between the sending and receiving branch (🟡 wynnesystems.com, 2026 — vendor blog, consistent with well-known industry behavior pattern).
- **Rate/Revenue Manager** — rate realization vs. book rate, rate-ladder design (daily/weekly/monthly multipliers), competitive benchmarking (often via Rouse Analytics data feeds).
- **Service Manager** — maintenance cost, downtime/out-of-service %, PM scheduling (increasingly telematics-hours-driven rather than calendar-driven).
- **Used Equipment Sales Manager** — disposal timing, channel selection (retail, auction, wholesale), and the OEC recovery rate that determines whether disposal timing captured or destroyed value.

---

## 5. Benchmarks (Published, with Source and Year)

| Metric | Value | Company/Source | Year | Confidence |
|---|---|---|---|---|
| Fleet OEC | $22.48B (vs $21.43B in 2024) | United Rentals 10-K, sec.gov | FY2025 | 🟢 |
| Average fleet age | 49.5 months (vs 51.3 in 2024) | United Rentals 10-K | FY2025 | 🟢 |
| Fleet units / locations | ~1.095M units; 1,768 locations | United Rentals 10-K | FY2025 | 🟢 |
| Fleet productivity growth | +0.5% Q4 YoY; +2.2% full-year YoY | United Rentals Q4/FY2025 press release, businesswire.com | FY2025 | 🟢 |
| ROIC | 12.4% (TTM June 2025); 11.7% (full-year 2025) | United Rentals IR releases | 2025 | 🟢 |
| Adjusted EBITDA margin | 45.9% (Q2), 46.0% (Q3), 45.5% (FY) | United Rentals press releases | 2025 | 🟢 |
| Rental revenue / total revenue | $13.8B rental / $16.1B total; net income margin 15.5% | United Rentals FY2025 release | FY2025 | 🟢 |
| Used equipment OEC recovery rate | 50.2% | United Rentals Q4/FY2025 release | Q4 2025 | 🟢 |
| Total fleet OEC | ~$9.5B | Herc Holdings FY2025 press release, sec.gov | FY2025 | 🟢 |
| Average fleet age | 45 months (vs 46 in 2024) | Herc Holdings FY2025 press release | FY2025 | 🟢 |
| Dollar utilization | 37.5% (Q4 2025) vs 40.6% (Q4 2024), attributed to lower utilization of acquired (H&E) fleet pre-optimization | Herc Holdings FY2025 press release | Q4 2025 | 🟢 |
| Dollar utilization — North America General Tool | 47% LTM (vs 48% prior year) | Ashtead/Sunbelt Rentals FY2026 update, morningstar.com | 2026 | 🟢 |
| Dollar utilization — North America Specialty | 74% LTM (vs 73% prior year) | Ashtead/Sunbelt Rentals FY2026 update | 2026 | 🟢 |
| Ashtead Group rental revenue | $9.98B, +4% YoY | Ashtead Annual Report FY2025 (year ended April 30, 2025), ir.sunbeltrentals.com | FY2025 | 🟢 |
| US MEWP rental fleet size | ~857,000 units (2024, no net growth YoY — first flat year); ~875,000 units (2025, +2%) | IPAF, reported via rermag.com / forconstructionpros.com | 2024–2025 | 🟡 (trade-press summary of IPAF report, not the primary IPAF PDF itself) |
| ARA rental penetration index | 59.5% in 2025 (5th consecutive annual rise) | American Rental Association, news.ararental.org | 2025 | 🟡 |
| Combined US CIE + general tool rental market size | $83.5B forecast for 2026 (+3.4–3.6% YoY) | ARA forecast, forconstructionpros.com / news.ararental.org | 2026 | 🟡 |
| Rouse Analytics benchmark service scale | 400+ participating companies; >$115B fleet OEC; $49B rental revenue tracked | Rouse Services / ARA, rermag.com | Most recent report cited (exact year of the 400+ figure not confirmed in snippet) | 🟡 |
| Rental rate ladder convention | Weekly ≈ 4–5x daily; monthly ≈ 10–12x daily (not the older "3x/3x" rule of thumb) | Industry pricing guides, gethapn.com/armsoftware.com | 2026 | 🟡 |
| Physical utilization fleet-mix target | ~72% on rent / ~20% yard-ready / ≤8% non-rental-ready | Cited via targit.com | 2026 | 🔴 (no primary Rouse/ARA source located) |
| Construction equipment theft recovery rate | ~20–25% (vs. much higher for cars) | National Equipment Register data, cited via getsafeandsound.com/liveviewgps.com | 2025–2026 | 🟡 |
| Estimated annual theft loss, construction/farm equipment | ~$1B/year | National Equipment Register, cited via multiple trade sources | Undated within snippets | 🟡 |

---

## 6. Where Measurement Breaks Down Today

1. **Billed time vs. telematics runtime.** The ERP's time-utilization number and the telematics runtime number answer different questions, and reconciling them at scale (across a mixed multi-OEM, multi-thousand-unit fleet) is still largely a manual/BI-layer exercise rather than a native ERP capability. A customer who has a machine "on rent" per the contract but idle per telematics is simultaneously (a) a churn risk once they notice they're overpaying for unused capacity, and (b) a maintenance-scheduling problem if PM intervals are calendar-based rather than hours-based. AEMP/ISO 15143-3 solves the *data normalization* half of this problem (getting comparable hours/fuel/status data out of Cat, Deere, Komatsu, etc. into one schema) but does not by itself solve the *reconciliation and action* half — turning the mismatch into a re-rate conversation, a maintenance trigger, or a churn-prevention outreach still requires a purpose-built layer on top.

2. **True asset condition before pickup.** Rental companies dispatch pickups without reliable remote knowledge of the unit's physical condition (damage, missing accessories, fluid levels) — condition is typically assessed only at physical pickup/return, which is exactly when damage disputes with the customer are hardest to resolve fairly (no baseline photo/telematics-condition record from drop-off to compare against). This is a documented gap rather than a solved-and-disclosed capability in the vendor materials reviewed.

3. **Branch-level optimization vs. network-level optimization (rebalancing).** Because branch managers are compensated on their own branch's utilization and rate, the segment has a structural, well-documented incentive problem: hoarding equipment "just in case" starves other branches, undermining fleet-wide dollar utilization even while individual branch utilization boards look fine. The standard mitigation (revenue-sharing on inter-branch transfers) is a compensation-design fix, not a measurement fix — it doesn't change what the ERP reports, only what people are willing to do about it. A product that could show *network-level* opportunity cost of a hoarded unit (in dollar-utilization terms, not just time-utilization) directly to a branch manager would attack the actual incentive misalignment rather than just the reporting.

4. **Static rate books vs. real-time demand.** Most rental ERPs (RentalMan, Point of Rental, Texada) are architected around a rate table that gets updated periodically (rate reviews are a *weekly* cadence in this segment, not real-time), while demand for a given class in a given local market can swing daily with weather, project starts, and competitor fleet availability. Vendor and trade-press material increasingly discusses AI-driven dynamic pricing layered on top of these ERPs (and Sunbelt is cited as integrating demand forecasting with dynamic pricing), but this is emerging-practice territory, not yet a standard, and the underlying rate-book architecture in the core ERPs remains fundamentally batch/period-based.

5. **Damage assessment and recovery disputes.** Loss damage waivers exist precisely because damage attribution (was this pre-existing, in-transit, or customer-caused?) is contentious, and no public benchmark for damage-recovery-rate or dispute-resolution-time was found in this research pass — this looks like a metric the industry doesn't publish even internally in a standardized way, which is itself a signal of how unresolved the underlying process is.

6. **Theft on customer jobsites and insurance recovery.** Heavy equipment has no VIN-equivalent universal registry, no license plate, and is frequently left on unsecured/unmonitored third-party jobsites overnight — recovery rates of ~20–25% (vs. much higher for passenger vehicles) reflect a structurally weak identification/tracking regime industry-wide, not a rental-company-specific failure. Telematics/GPS tracking (Trackunit, Hapn, LiveView) is marketed explicitly as a partial fix, but adoption is uneven, especially in the independent/long-tail portion of the segment that lacks URI/Herc/Sunbelt-scale telematics programs.

7. **Demand forecasting by class to time capex.** Fleet mix decisions (which classes to add capex to) are consequential and largely still driven by regional fleet managers' judgment plus lagging utilization data, rather than a forward-looking, class-level demand model tied directly to the capex-approval workflow — AI-driven demand forecasting is discussed in trade press as an emerging capability, not yet described as embedded in the standard capex process at the major public operators based on available disclosures.

---

## Sources

**SEC filings / company IR (🟢 primary):**
- United Rentals 10-K FY2025 — https://www.sec.gov/Archives/edgar/data/1067701/000106770126000007/uri-20251231.htm
- United Rentals Q4/FY2025 press release (fleet, ROIC, EBITDA, OEC recovery rate) — https://www.businesswire.com/news/home/20260128560444/en/United-Rentals-Announces-Fourth-Quarter-and-Full-Year1-2025-Results
- United Rentals FY2025 results / IR — https://investors.unitedrentals.com/press-releases/press-releases-details/2026/United-Rentals-Announces-Fourth-Quarter-and-Full-Year1-2025-Results-Introduces-2026-Outlook-for-Growth-and-Announces-Plan-to-Return-Approximately-2-Billion-to-Shareholders-in-2/default.aspx
- United Rentals Q2/Q3 2025 8-K press releases — https://www.sec.gov/Archives/edgar/data/1067701/000162828025035758/uri-6302025xex991.htm ; https://www.sec.gov/Archives/edgar/data/1067701/000106770125000041/uri-9302025xex991.htm
- United Rentals 10-Q Q3 2025 — https://www.sec.gov/Archives/edgar/data/1067701/000106770125000039/uri-20250930.htm
- Herc Holdings FY2025 results / 2026 guidance — https://www.sec.gov/Archives/edgar/data/1364479/000136447926000049/herc2025q4-pressrelease.htm
- Herc Holdings Q1 2026 results — https://www.sec.gov/Archives/edgar/data/1364479/000136447926000084/herc2026q1-pressrelease.htm
- Ashtead Group Annual Report & Accounts FY2025 — https://ir.sunbeltrentals.com/_assets/_9e286c86847803e1180566458d2f7d1a/sunbeltrentals/db/3746/34974/annual_report/Ashtead_Annual_Report_2025_.pdf
- Sunbelt Rentals FY2026 (fiscal Q4) results, dollar utilization by segment — https://www.morningstar.com/news/business-wire/20260623670507/sunbelt-rentals-reports-fiscal-fourth-quarter-and-full-year-2026-results

**Standards bodies (🟢 primary):**
- ISO/TS 15143-3:2020 — https://www.iso.org/standard/76394.html
- AEM / ISO 15143 fleet data exchange overview — https://www.aem.org/standards/iso15143/3

**Trade press / industry associations (🟡 secondary):**
- IPAF 2025 MEWP rental market reports — https://www.rermag.com/news-analysis/headline-news/article/55302348/ipafs-2025-mewp-rental-market-report-shows-us-market-slowdown
- IPAF 2024 growth report — https://www.forconstructionpros.com/rental/lifting-equipment/article/22910561/international-powered-access-federation-ipaf-growth-in-the-lift-industry-the-2024-us-mewp-rental-report
- ARA rental market forecast / penetration index — https://news.ararental.org/surging-ahead-rental-management-s-2026-equipment-market-movers ; https://www.forconstructionpros.com/rental/rental-business/press-release/22972607/american-rental-association-ara-rental-market-forecast-34-annual-growth
- Rouse Analytics Rental Benchmark Service scale — https://www.rermag.com/news-analysis/headline-news/article/20950099/rouse-analytics-rental-benchmark-service-tops-50-participants ; https://empoweringpumps.com/rouse-analytics-rental-benchmark-service-surpasses-50-total-participants/
- Rouse Services Rental Insights — https://www.rouseservices.com/solutions/rental-insights/
- AED Rental Companion Report — https://aednet.org/industry-insight-news/benchmarking-reports/rental-report/
- Physical utilization / fleet-mix targets — https://www.targit.com/en/blog/best-kpis-for-the-equipment-rental-industry
- Time vs. dollar utilization comparison — https://www.intemposoftware.com/blog/equipment-rental-metrics-time-dollar-utilization
- Rental utilization definitions — https://en.wikipedia.org/wiki/Rental_utilization

**Vendor / product content (🟡 secondary, commercial source — treat claims about "average uplift" etc. as marketing-adjacent):**
- Trackunit rental telematics / runtime reconciliation — https://trackunit.com/rental/ ; https://trackunit.com/articles/rental/how-trackunit-helps-rentals-cut-complexity/
- Wynne Systems (RentalMan) equipment transfers / profit-sharing and hoarding — https://wynnesystems.com/equipment-transfers-profit-sharing-optimal-utilization/
- Wynne Systems ancillary fees guide — https://wynnesystems.com/ancillary-fees-in-equipment-rental/
- Rental ERP comparisons (Point of Rental, Texada, RentalMan) — https://fieldservicesoftware.io/comparisons/point-of-rental-vs-wynne-rentalman/ ; https://texadasoftware.com/texada-vs-rentalman/
- Rate ladder / pricing conventions — https://gethapn.com/blog/the-price-is-right-how-much-to-charge-for-rental-equipment/ ; https://lendcontrol.com/blog/equipment-rental-pricing/ ; https://www.armsoftware.com/how-to-calculate-equipment-rental-rates/
- Equipment theft statistics (NER-sourced, secondary compilation) — https://getsafeandsound.com/blog/construction-site-theft-statistics/ ; https://www.liveviewgps.com/gps-tracking-statistics/construction-equipment-theft/
- Dynamic pricing / AI demand forecasting commentary — https://rentechmag.com/articles/ai-technology/ai-equipment-rental-forecasting/ ; https://www.tapgoods.com/pro/blog/construction-equipment-rental-software/demand-forecasting-with-ai/

**Financial-metric definitions (🟡 secondary, general finance reference, not rental-specific):**
- Flow-through / incremental margin definitions — https://ibinterviewquestions.com/guides/industrials-investment-banking/incremental-decremental-margin-analysis ; https://trueprofit.io/blog/incremental-margin
- Fleet vehicle repair-vs-replace rule of thumb (generic, not rental-sector-specific — 🔴) — https://autosist.com/blog/fleet-vehicle-repair-vs-replacement/ ; https://info.myekos.com/post/when-to-repair-vs-replace-a-fleet-vehicle
