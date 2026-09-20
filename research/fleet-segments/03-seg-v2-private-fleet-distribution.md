# Private Fleets — Wholesale & Retail Distribution (US)
### Segment research for fleet software product team | September 2026

**Scope**: ~3.4M power units. Companies whose fleet is a **cost center** serving their own product business (food & beverage distribution — Sysco, US Foods, McLane, PFG; grocery/retail DC-to-store replenishment; foodservice; beverage DSD; building materials/industrial distribution; pharma/medical distribution; route-based consumer services), not a for-hire revenue business.

**Method note**: WebFetch is blocked in this environment. All findings below come from WebSearch result snippets — one level below reading primary documents. Every claim is tagged with a confidence flag. NPTC's Benchmarking Survey Report itself is member-gated (120+ pages); what appears here is what trade press disclosed about it, not a read of the report.

Confidence key: 🟢 primary (named study/filing, credible restatement of its numbers) 🟡 secondary (vendor/trade-press synthesis, plausible but not traceable to one named study) 🔴 unverified industry lore (repeated across vendor blogs with no traceable origin)

---

## The central analytical point

A for-hire carrier sells transportation; its P&L question is "did this move make money at the rate we charged?" — hence operating ratio, revenue per mile, rate per mile. A private fleet in this segment **does not sell transportation to anyone**. It exists inside a company whose money is made selling cases of food, cases of beer, pallets of drywall, or bottles of insulin. The fleet's only job is to move that company's own product from DC to customer/store better than a common carrier or a third-party logistics provider would. That reframes every metric:

- The governing question is **"should we own this fleet at all?"** — a recurring make-vs-buy test, not a one-time capital decision.
- The core metric is **cost per unit delivered vs. the purchased-transportation (outsourced) benchmark**, not operating ratio or rate per mile. A private fleet has no "revenue" in the normal sense — value is measured as cost avoidance plus service value that outsourcing can't match (control, brand, guaranteed capacity).
- Success is invisible when things go right (on-time, in-full, no damage, no stockouts) and highly visible to the P&L owner when things go wrong or when the outsourcing alternative looks cheaper on paper.
- The fleet's advocates (Director of Fleet, VP Transportation) are structurally on the defensive: **the people who judge the fleet's numbers are the same people who could vote to eliminate it and hand the freight to a 3PL or dedicated-carriage provider.** This political dynamic (area 4) shapes which metrics get invested in and which get quietly under-reported.

---

## 1. The operating model

### Why companies run private fleets
- **Service level / control**: guaranteed delivery windows to stores/customers that a common carrier cannot promise at the same reliability, especially for DSD and grocery replenishment where shelf-stockout cost exceeds freight cost. 🟡
- **Capacity assurance**: private fleets grew sharply after two capacity shocks cited repeatedly in 2025-2026 trade coverage — the 2017-2018 for-hire capacity crunch and COVID-era freight volatility — reinforcing a "never get caught without trucks again" logic among shippers. 🟡 (FleetOwner/NPTC commentary, 2025)
- **Brand representation**: liveried trucks at retail/foodservice customers double as marketing/merchandising assets (relevant for beverage DSD and building materials in particular). 🟡
- **Backhaul/dedicated-carriage revenue offset**: fleets recapture cost by hauling paid freight (backhaul for outside shippers, or dedicated-carriage contracts) on return legs, and roughly half of NPTC survey respondents report holding **for-hire operating authority** specifically to monetize backhaul capacity. 🟡 (FleetOwner coverage of NPTC data, historically cited from the 2008-era survey; recency of the 50% figure to 2025 is not confirmed — flagging as directional, not current-year, 🔴 for the exact percentage in 2025)

### The make-vs-buy calculus
- Private fleet economics work when volume is **consistent, high-density, and on predictable lanes**; the traditional break-even logic is that utilization is the swing variable — empty backhauls, seasonal volume dips, and route inefficiency can flip a private fleet from cheaper-than-outsourcing to more expensive very quickly. 🟡 (CCJ, RXO, ArcBest commentary, 2025-2026)
- Trade commentary in 2026 explicitly frames a "fleet cost reset": rising capital costs (trucks, trailers, financing), tightening emissions/regulatory requirements, and driver-cost inflation are making the private-fleet model "more capital-intensive and less predictable" than the historical make-vs-buy math assumed. 🟡 (CCJ, "Private Fleet vs. Dedicated: Navigating the Upcoming Fleet Cost Reset," 2026)
- Most sophisticated shippers run a **hybrid model**: private fleet covers core/high-frequency lanes; common/contract carriers absorb overflow, seasonal peaks, and low-density lanes that can't amortize dedicated equipment. 🟡

### Private fleet share of freight (NPTC data)
- NPTC's 2025 Benchmarking Survey reportedly found private fleets moved **70% of surveyed companies' outbound freight**, down from a record **75% in the 2024 survey** — trade press frames this as a "moderation" after a growth run, not a reversal of the multi-year private-fleet-share increase. 🟡 (FleetOwner, TT/Transport Topics, Penske blog coverage of NPTC 2025 Benchmarking Survey, published ~Sept 2025)
- Inbound freight handled by private fleets rose to **43%** in the 2025 survey from 35% the prior year. 🟡 (same sourcing)
- Private fleet shipment volumes were said to be up **11.7% year-over-year** in the 2025 survey, accelerating from 7.5% and 4.6% growth in the two prior years. 🟡
- **NPTC = the single most relevant source for this whole segment**, but the full report is members-only; everything above is filtered through trade-press summaries (FleetOwner, Transport Topics, Truck News, CCJ, Penske's sponsor blog), not a direct read of NPTC's own tables.

### Chargeback to business units
- There is **no universal chargeback formula**; practitioner guidance (fleet-management vendors, SupplyChainBrain) says a fleet's internal billing methodology should reflect its own cost structure, org design, and accounting policy — common bases are vehicle assignment, mileage, usage, and risk profile. 🟡
- The stated goal of chargeback is to make business units "directly accountable for the services they consume" and avoid cross-subsidization between high-cost and low-cost users of the fleet (e.g., a rural DC subsidized by a dense urban DC's low cost-per-stop). 🟡
- This is the mechanism area 6 identifies as most broken: fleet cost typically sits in a logistics/SG&A cost center, while the thing it's compared against (COGS, product margin) sits in a different ledger, making apples-to-apples cost-per-case attribution to a business unit or product line genuinely hard without a deliberate allocation model.

### Backhaul / empty-mile recovery as cost offset
- Empty backhaul percentage for van-equipment private fleets was reported around **26%** in NPTC data (this figure traces to an older, 2008-era NPTC survey citation surfaced in current search results — treat as **directional lore, not a 2025/2026 number**). 🔴
- Whether backhaul revenue is credited back to the fleet's P&L or absorbed into corporate is inconsistent across companies and is flagged explicitly as a measurement breakdown in area 6.

---

## 2. The metrics that actually drive this segment

Metrics are grouped: **(A) Cost / make-vs-buy**, **(B) Productivity**, **(C) Service quality**, **(D) Asset & load utilization**, **(E) Cold chain / compliance (food & pharma)**, **(F) Labor & safety**.

### A. Cost / make-vs-buy metrics

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| Cost per case/unit delivered | Total fleet delivery cost ÷ cases (or units) delivered | $/case | Monthly / MBR | Director of Fleet, Finance/FP&A | DSD route cost modeled at **~10-15% of delivered revenue** once driver wage, vehicle cost, fuel, and merchandising time are included; illustrative DSD-vs-warehouse case-cost comparison cited as **$20.52 (DSD) vs $24.00 (warehouse-distributor margin equivalent)** | 🟡 (industry-practitioner modeling, not a named benchmark study) |
| Total operating cost per mile | Total fleet operating cost ÷ total miles | $/mile | Monthly / annual | VP Logistics, Director of Fleet | **$3.81/mile**, NPTC 2025 Benchmarking Survey (released Aug 1, 2025); NPTC explicitly cautions against cross-fleet comparison because of inconsistent calculation methods | 🟢 (named study, but caveat on comparability is itself from the study) |
| Purchased-transportation benchmark (for-hire cost per mile) | Industry-average all-in cost to run a Class 8 truck | $/mile | Annual | Finance/FP&A, VP Logistics | **$2.336/mile** industry average, all costs, 2025 (up 3.4% YoY); **$1.854/mile excluding fuel** (up 4.2% YoY) — ATRI "An Analysis of the Operational Costs of Trucking," released July 15, 2026 | 🟢 primary (ATRI is a named, credible study; figures via trade-press restatement) |
| Fleet cost as % of COGS / distribution expense as % of COGS | Total distribution/fleet cost ÷ COGS | % | Quarterly / annual | Finance/FP&A, VP Supply Chain | Wholesale/B2B distribution logistics cost commonly **3-8% of sales**; grocery/CPG dense-route logistics cost "low single digits to mid-single digits"; no single named primary study — synthesized range from multiple secondary sources (OpsDog, Umbrex) | 🔴 unverified lore (plausible ranges, no traceable primary study) |
| Cost per stop | Total route cost ÷ number of stops served | $/stop | Weekly / monthly | Route Supervisor, Director of Fleet | No credible published benchmark found | 🔴 (no source located) |
| Backhaul revenue recovery | Revenue from backhaul/dedicated-carriage loads ÷ total fleet operating cost | % offset | Monthly | VP Logistics, Finance | No current (2025/2026) published figure found; only a dated (2008-era) reference to ~50% of NPTC respondents holding for-hire authority | 🔴 |
| Driver turnover cost | Cost per driver replaced (recruiting, training, lost productivity) | $/turnover event | Annual | VP HR/Safety, Director of Fleet | **$12,313** per turnover event, up from $7,929 prior year — NPTC 2025 Benchmarking Survey (via FleetOwner) | 🟢 (named study via trade press) |

### B. Productivity metrics

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| Stops per route per day | Total stops completed ÷ routes run | stops/route/day | Daily debrief | Route Supervisor, DC/Branch Manager | No single authoritative number; case example: Anheuser-Busch wholesaler Mitchell Distributing increased stops per route by pairing drivers with "chasers" rather than adding drivers (Descartes case study) | 🔴 vendor case study, not a benchmark |
| Cases per hour | Cases delivered/handled ÷ driver/handler hours | cases/hour | Daily / weekly | Route Supervisor | Not found in a named study; frequently referenced in vendor marketing without a source | 🔴 |
| Deliveries per driver per day (density-adjusted) | Stops completed ÷ driver-day | stops/driver-day | Weekly | Route Supervisor, Director of Fleet | Urban delivery: **25-40/day** (15-25 drops/hour cited separately); suburban: **15-25/day**; rural: **8-15/day** (5-10 drops/hour) — last-mile industry compilations (Upper, FarEye, DispatchTrack style sources), not a single named study | 🔴 (numbers propagate across last-mile vendor blogs without a traceable primary source) |
| Planned vs. actual route time / route adherence | (Actual route time − planned route time) ÷ planned route time | % variance | Daily debrief | Route Supervisor, routing/TMS analyst | Illustrative pilot: +2% driver productivity, ~$106/vehicle/month saved via plan-vs-actual routing optimization (Descartes/telematics vendor case study) | 🔴 vendor case study |
| Driver hours per route / overtime % | Total driver hours (incl. OT) ÷ routes; OT hours ÷ total hours | hours; % | Weekly payroll cycle | Route Supervisor, Finance/Payroll | No named benchmark located | 🔴 |

### C. Service quality metrics

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| On-time in-full (OTIF) | Cases delivered on-time AND in-full ÷ total cases ordered | % | Daily/weekly ops review, MBR with customer/retailer | VP Supply Chain, DC/Branch Manager | Grocery/perishables OTIF benchmarks commonly cited as **96-99%**; general "good" OTIF **85-95%**, "excellent" **95-98%** — multiple secondary compilations (Slimstock, LeafIO, MetricHQ), FMI/GMA-descended Trading Partner Alliance set shared retailer-manufacturer OTIF definitions in 2009 | 🟡 (concept and formula are well-established industry-standard; specific numeric ranges are secondary-source synthesis, not one named current study) |
| Fill rate | Units shipped ÷ units ordered | % | Daily/weekly | DC/Branch Manager, VP Supply Chain | Referenced as a standard DSD/beverage operating metric; no specific numeric benchmark located | 🟡 (metric definition solid; no benchmark figure found) |
| Service failure rate | Failed/missed stops or short/damaged deliveries ÷ total stops | % | Weekly ops review | Route Supervisor, DC/Branch Manager | No named benchmark; framed by practitioners as needing to be tracked "by customer and geography" for true cost-to-serve | 🔴 |
| Order accuracy | Orders delivered exactly as ordered ÷ total orders | % | Daily | Route Supervisor | No published benchmark found; mobile/barcode capture cited as the standard mitigation, not a target number | 🔴 |

### D. Asset & load utilization metrics

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| Trailer cube utilization | Cubic volume used ÷ available cubic capacity | % | Weekly/monthly | Director of Fleet, DC Manager | Target commonly cited **85-95%**; industry average often cited as only **60-70%** (i.e., 30-40% of trailer space unused); "excellent" 80-90%, "good" 70-80% — multiple secondary/vendor sources (Fulfill.com, Owlery, Phillips Connect), no single named primary study | 🔴 unverified lore (numbers repeat across vendor glossaries without a traceable origin study) |
| Weight fill rate | Weight loaded ÷ legal weight capacity | % | Weekly/monthly | Director of Fleet | Target commonly cited **90-95%** of legal weight capacity | 🔴 |
| Load factor | Actual load ÷ maximum rated load (blended cube+weight) | % | Monthly | Director of Fleet | No single authoritative figure; conceptually tied to cube/weight fill above | 🔴 |
| Drop-and-hook ratio | Drop-and-hook moves ÷ total moves | % | Monthly | Director of Fleet, DC Manager | Most relevant to grocery/DC replenishment (trailer-pool models) vs. DSD (route-cab delivery, rarely drop-hook); no benchmark located | 🔴 |
| Equipment cost per hour | Tires + trailer maintenance + fuel + claims/insurance, per operating hour | $/hour | Monthly | Director of Fleet, Finance | NPTC 2025 Benchmarking Survey (via FleetOwner): **total equipment & maintenance ~$1.01/hour**, of which tires $0.06/hr, trailer maintenance $0.24/hr, fuel $0.58/hr, claims & insurance $0.20/hr | 🟢 (named study via trade press) |

### E. Cold chain / regulatory compliance (food & pharma — segment-critical)

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| Temperature compliance rate | Deliveries within specified temp range ÷ total temp-controlled deliveries | % | Per-load / daily | Safety Director, Quality/Food Safety Director | No numeric benchmark found; regulatory requirement (FSMA Sanitary Transportation Rule; pharma DSCSA) is the driver, not a target percentage | 🟡 (regulatory requirement well-documented; no numeric benchmark) |
| Cold chain excursion documentation / corrective action closure | Excursions with documented root cause + corrective action ÷ total excursions | % | Per-incident | Safety/Quality Director | FSMA requires investigation and documentation of **any** temperature excursion; a single undocumented/unmanaged excursion cited as able to exceed **$400,000 in total impact** (recall, write-off, compliance exposure) — cited in secondary compliance-vendor content, not a named regulatory or academic study | 🔴 (specific dollar figure is vendor-sourced, unverifiable) |
| Standard cold chain temperature band | N/A — regulatory/product spec | °C / °F | Continuous monitoring | Safety/Quality Director | Common pharma cold chain range **2-8°C (36-46°F)**, product-dependent | 🟢 (well-established GDP/pharma standard, not an invented benchmark) |
| DSCSA traceability completeness | Shipments with complete lot/serial/temperature chain-of-custody records ÷ total shipments | % | Per-shipment | Safety/Quality Director, Compliance | DSCSA fully effective by 2026 per current guidance; requires temperature history as part of proof-of-distribution data package | 🟢 (regulatory deadline is well-sourced; no numeric compliance-rate benchmark located) |

### F. Labor & safety metrics

| Metric | Formula | Unit | Cadence | Owner | Benchmark + source | Confidence |
|---|---|---|---|---|---|---|
| Driver turnover rate | Drivers separated ÷ average driver headcount, annualized | % | Annual (NPTC), tracked monthly internally | VP HR, Safety Director, Director of Fleet | NPTC 2025 Benchmarking Survey: **18.4%**, down from **20.2%** prior year. Longer historical ATA-adjacent comparison: private fleets averaged **~15% annualized turnover, 2005-2022**, vs. **92.7%** for large ($30M+) for-hire truckload carriers and **77.6%** for smaller for-hire fleets over a similar multi-year window; LTL averaged **11.8%** (Q4 2000-Q1 2022) | 🟢 (NPTC figure via trade press) / 🟡 (the ATA/truckload comparison is a widely cited multi-year average, sourced to ATA-adjacent commentary via Trucking Dive/trucking.org coverage rather than a single dated report) |
| CSA score / BASIC percentile | FMCSA percentile scoring across 7 BASICs (Unsafe Driving, HOS, Driver Fitness, Controlled Substances, Vehicle Maintenance, HM Compliance, Crash Indicator) | 0-100 percentile (higher = worse) | Continuous (FMCSA), reviewed monthly internally | Safety Director | Federal intervention threshold: **65%** in Crash Indicator/HOS/Unsafe Driving triggers FMCSA investigation; **50%** threshold for passenger/hazmat carriers | 🟢 (FMCSA program mechanics; this is regulatory fact, not a "benchmark" to beat) |
| Preventable accident rate / accident frequency | Preventable accidents ÷ million miles (or per 100 power units) | rate | Monthly | Safety Director | No specific current numeric benchmark located for this segment | 🔴 |
| Average driver compensation | — | $/year | Annual (NPTC) | VP HR, Director of Fleet | NPTC 2025 Benchmarking Survey: **$91,081** average for HD-equipment private fleet drivers; benefits add roughly one-third more to total comp cost | 🟢 (named study via trade press) |

---

## 3. How they measure — cadence, systems, reconciliation

### Operating cadence
- **Daily route debrief**: Route Supervisor reviews plan-vs-actual (stops completed, service time, temperature exceptions, POD, driver hours) against the morning's dispatch plan. Sourced from telematics + routing software geofence/stop-detection data. 🟡
- **Weekly ops review**: DC/Branch Manager and Route Supervisor roll up route-level data — stops per route, cost per stop where tracked, service failures, OT — typically compiled from routing software (Roadnet/Omnitracs, Descartes, Aptean, Paragon) exports, often into spreadsheets for cross-DC comparison. 🟡
- **Monthly business review (MBR)**: VP Supply Chain/Logistics presents fleet cost-vs-purchased-transportation, OTIF, safety/CSA trend, and driver turnover to the P&L owner (often a divisional President or CFO) — this is the meeting where the make-vs-buy case is implicitly re-litigated every month. 🟡
- **Annual**: NPTC Benchmarking Survey submission (spring data collection, report released ~August) lets Director of Fleet/VP Logistics benchmark against peer private fleets — described by NPTC itself as "the gold standard... scorecard for fleet justification." 🟢

### Systems of record
- **Routing & scheduling**: Descartes (Roadnet legacy), Omnitracs, Aptean, Paragon — generate the route plan and, via telematics integration, the plan-vs-actual comparison. 🟢 (vendor identities confirmed, standard industry tools)
- **WMS/ERP**: SAP, Oracle, Blue Yonder — hold case/unit counts, order data, and (in theory) COGS; this is the system fleet cost data must reconcile against to produce true cost-per-case. 🟡
- **TMS**: manages load planning, carrier selection for the outsourced portion of freight (the comparison baseline for make-vs-buy).
- **Telematics + in-cab/POD apps**: capture geofenced arrival/departure, driver hours, service time, proof-of-delivery signatures/photos — feed both the daily debrief and OTIF/service-failure metrics. 🟢
- **Temperature monitoring**: dedicated cold-chain sensors/loggers (time-temperature indicators, electronic data loggers cited in DSCSA/FSMA compliance context) feed exception reporting for food and pharma sub-models specifically. 🟢

### Where spreadsheets fill the gaps
- Cost-per-case/cost-per-stop calculations that require blending WMS/ERP case counts with TMS/routing-software cost data are commonly stitched together manually because the systems don't share a common unit of account — this is inferred from the chargeback-methodology commentary ("no universal formula... should reflect documented costs, organizational structure, accounting policies") rather than a direct citation of spreadsheet use. 🟡
- Backhaul revenue crediting back to the fleet cost center likewise appears to be a manual/ad hoc allocation exercise rather than a system-native calculation (see area 6).

---

## 4. Who owns each number — and the political dynamic

| Role | Owns | Bonused on (typical) |
|---|---|---|
| VP Supply Chain | OTIF, fleet cost as % of COGS, overall make-vs-buy narrative to the executive team | Service level + total logistics cost 🟡 |
| VP Logistics/Transportation | Cost per mile vs. purchased-transportation benchmark, backhaul revenue recovery, fleet cost trend | Cost control + capacity reliability 🟡 |
| Director of Fleet | Cost per case/stop, equipment cost per hour, trailer utilization, maintenance cost | Asset utilization + cost per unit 🟡 |
| DC/Branch Manager | Fill rate, service failure rate, stops per route, local OTIF | Local service level + throughput 🟡 |
| Route Supervisor | Daily route adherence, driver hours/OT, cases/stops per route | Route efficiency + on-time performance 🟡 |
| Safety Director | CSA/BASIC scores, preventable accident rate, cold-chain/DSCSA compliance | Safety score + regulatory compliance 🟢 (CSA mechanics are regulatory, ownership plausible but not directly sourced) |
| Finance/FP&A | Fleet cost as % of COGS, chargeback allocation methodology, driver turnover cost | Cost containment, budget variance 🟡 |

**The political dynamic** (explicitly requested by the brief, not directly documented in a single source but a clear synthesis of the make-vs-buy literature above): every metric the fleet organization reports is implicitly evidence in an ongoing internal trial over whether the company should keep running trucks at all. This creates an incentive structure where:
- Cost-per-mile and cost-per-case numbers are reported cautiously, because NPTC itself warns these numbers use "inconsistent calculation methods" across fleets — which also means they can be calculated inconsistently *within* a company to flatter the fleet's position relative to the outsourcing alternative. 🟡 (inference from NPTC's own caveat)
- Service-quality metrics (OTIF, fill rate) tend to be the fleet's strongest rhetorical asset, since a 3PL/common-carrier alternative is harder to hold to the same reliability standard — this is why OTIF is the number most consistently escalated to the P&L owner in the MBR. 🟡
- Backhaul revenue crediting is a site of dispute precisely because it is the fleet's best argument for looking cheaper than it otherwise would (see area 6).

---

## 5. Benchmarks — consolidated, with strict source skepticism

| Benchmark | Value | Source | Year | Confidence |
|---|---|---|---|---|
| Private fleet total operating cost per mile | $3.81/mile | NPTC Benchmarking Survey (via FleetOwner) | 2025 | 🟢 |
| Purchased-transportation (for-hire) cost per mile, all-in | $2.336/mile | ATRI, "Analysis of the Operational Costs of Trucking" | 2025 data, published July 2026 | 🟢 |
| Purchased-transportation cost per mile, ex-fuel | $1.854/mile | ATRI (same report) | 2025/2026 | 🟢 |
| Private fleet driver turnover | 18.4% (down from 20.2%) | NPTC Benchmarking Survey (via FleetOwner) | 2025 | 🟢 |
| Private fleet driver turnover, long-run average | ~15% (2005-2022) | ATA-adjacent commentary (Trucking Dive) | multi-year | 🟡 |
| For-hire truckload driver turnover ($30M+ fleets) | 92.7% average, Q3 1996-Q1 2023 | ATA (via Trucking Dive/trucking.org coverage) | through 2023 | 🟡 |
| Private fleet driver compensation (HD equipment) | $91,081/year average | NPTC Benchmarking Survey (via FleetOwner) | 2025 | 🟢 |
| Cost of driver turnover event | $12,313 (up from $7,929) | NPTC Benchmarking Survey (via FleetOwner) | 2025 | 🟢 |
| Equipment & maintenance cost per hour | ~$1.01/hr blended | NPTC Benchmarking Survey (via FleetOwner) | 2025 | 🟢 |
| Private fleet share of outbound freight | 70% (2025), down from 75% (2024) | NPTC Benchmarking Survey (via FleetOwner, TT, Penske) | 2025 | 🟡 (trade-press synthesis of member-gated study) |
| Grocery/perishables OTIF | 96-99% | Multiple secondary compilations (Slimstock, LeafIO, MetricHQ) | current (2026 blog content) | 🟡 |
| Trailer cube utilization target/actual | Target 85-95%; industry average 60-70% | Multiple vendor glossaries (Fulfill.com, Owlery, Phillips Connect) | current | 🔴 unverified lore — no named primary study, numbers repeat verbatim across vendor content |
| DSD route cost as % of delivered revenue | ~10-15% | Industry-practitioner modeling (CPG distribution commentary) | current | 🔴 |
| Fleet logistics cost as % of COGS (wholesale/B2B) | 3-8% | Secondary compilation (OpsDog, Umbrex) | current | 🔴 |
| Empty backhaul % (van equipment) | ~26% | NPTC survey citation | traces to 2008-era data | 🔴 stale/unverified for current year |
| Urban/suburban/rural deliveries per driver-day | 25-40 / 15-25 / 8-15 | Last-mile vendor blog compilations | current | 🔴 |
| IFDA Foodservice Distribution Operational Benchmark Report | Covers transportation productivity, driver availability, routing, incentive pay | IFDA | Report dated **2009** in search results; a 2025 IFDA report exists but is a **technology** benchmarking report (32 distributors surveyed), not an updated operations/productivity benchmark | 🟡 — the operations benchmark that would answer this brief's questions most directly appears stale (2009); the current IFDA output (2025) is scoped to technology adoption, not productivity KPIs |

**Explicit skepticism note**: Per the brief's instruction, several widely-repeated figures — trailer cube utilization ranges, cost-per-case DSD percentages, fleet-cost-as-%-of-COGS ranges, urban/rural deliveries-per-driver figures — could not be traced to one named primary study across multiple search attempts. They recur nearly verbatim across vendor blogs (Fulfill.com, Owlery, FleetRabbit, Upper, FarEye, DispatchTrack-style sites), which is the exact mutual-citation pattern the brief warned about. These are labeled 🔴 UNVERIFIED INDUSTRY LORE and should not be presented to the product team as validated benchmarks — at most as "commonly claimed ranges."

---

## 6. Where measurement breaks down today

1. **True cost per case when fleet cost sits in a different ledger than COGS.** Fleet operating cost typically lives in a logistics/SG&A cost center; COGS lives in a separate manufacturing/procurement ledger. Getting a genuine, allocatable cost-per-case requires a deliberate cross-ledger allocation exercise that most ERP/WMS-to-TMS integrations don't do natively — this is why chargeback methodology guidance stresses "no universal formula" and recommends bespoke allocation bases (mileage, usage, vehicle assignment). The result in practice is likely spreadsheet-mediated reconciliation, which is fragile and inconsistent across business units. 🟡 (inferred from chargeback-methodology sourcing; not directly observed)

2. **Proving the fleet beats purchased transportation on a like-for-like basis.** NPTC's own $3.81/mile figure comes with an explicit warning that "inconsistent calculation methods" make cross-fleet (and by extension, fleet-vs-purchased-transportation) comparisons unreliable. A private fleet's $/mile typically excludes or includes different cost buckets (depreciation treatment, driver benefits load, backhaul credit) than a purchased-transportation quote, so the "should we own this fleet" comparison that is the segment's central question is frequently apples-to-oranges even when both sides believe they're being rigorous. 🟢 (the caveat itself is directly sourced to NPTC's survey methodology note)

3. **Attributing service failures between fleet, warehouse, and customer.** A late or short delivery can originate from a warehouse pick error, a DC loading error, a route/traffic problem, or a customer-side receiving failure — but OTIF and fill-rate metrics as commonly implemented report a single blended number without failure-mode attribution. Practitioner guidance calls for tracking "service failure costs... by customer and geography" to build a true cost-to-serve view, which implies this attribution is not standard practice today. 🟡

4. **Cold-chain exception handling and FSMA/DSCSA proof.** FSMA and DSCSA both require documented temperature chain-of-custody with corrective-action records for any excursion, but the tooling for this is described in compliance-vendor content as fragmented — written shipper-carrier agreements, pre-cooling checks, in-transit logging, and delivery-handoff verification are separate steps that must be stitched into one audit trail. The claim that a single undocumented excursion "can exceed $400,000 in total impact" is vendor-sourced and not independently verifiable, but the underlying regulatory requirement (documented investigation of any excursion) is solid. 🟢 regulatory requirement / 🔴 dollar-impact claim

5. **Measuring driver productivity fairly across route density.** Deliveries-per-driver-day figures vary by an order of magnitude between dense urban DSD routes and sparse rural replenishment routes (cited ranges: 25-40/day urban vs. 8-15/day rural) purely as a function of geography, not driver effort — yet a single blended "stops per day" KPI, if used company-wide, will systematically penalize rural/low-density route drivers and DC branches. Practitioner commentary explicitly calls for "contextualizing driver KPIs against route difficulty and order density," implying this correction is not yet standard in most fleets' scorecards. 🟡

6. **Whether backhaul revenue is credited to the fleet or lost in corporate.** This is flagged directly by the brief and confirmed as a real ambiguity by the research: backhaul/for-hire-authority revenue is the private fleet's clearest lever for closing the cost gap against purchased transportation, but no source found describes a standardized practice for whether that revenue shows up in the fleet's own P&L (making its cost-per-mile look better) or is booked as unrelated corporate revenue (leaving the fleet's numbers to look worse than its true economic contribution). This ambiguity directly undermines the segment's central metric (cost vs. purchased transportation) because the two companies being compared may not be crediting backhaul the same way. 🟡 (no direct source resolves this; flagged as an open gap based on absence of any standardization discussion in the material found)

---

## Sub-model comparison table

| Dimension | Beverage/Food DSD | DC-to-Store Replenishment (Grocery/Retail) | Foodservice Distribution | Pharma/Medical Distribution |
|---|---|---|---|---|
| Signature cost metric | Cost per case delivered (route-level) | Cost per case/pallet vs. OTIF | Cost per case, cases per stop | Cost per delivery + compliance cost (often uncapped downside risk) |
| Primary service metric | Fill rate, order accuracy, merchandising execution at shelf | OTIF (96-99% cited for grocery/perishables) | OTIF, order accuracy | Temperature compliance, DSCSA traceability completeness |
| Route pattern | High-stop-density, short-haul, driver often also merchandiser/sales rep | DC-to-store, larger drops, fewer stops per route, drop-and-hook common | Multi-stop, restaurant/institutional customers, narrow delivery windows | Low-stop-count, high-value/high-liability per stop, strict chain-of-custody |
| Dominant risk | Stockout/out-of-stock at shelf; empty-mile/low-density route economics | Stockout cascading to multiple stores; trailer cube/weight utilization | Delivery-window failure at restaurants (opening-hours sensitivity) | Regulatory/compliance failure (FDA, DSCSA) with potential product-safety and legal exposure, not just cost |
| Cold chain relevance | High (perishable beverage/food SKUs) | High for perishable categories, mixed for dry grocery | Very high (frozen, refrigerated, dry mixed in one truck) | Critical — 2-8°C standard band, documented excursion handling mandatory |
| Chargeback complexity | Moderate — route/driver often tied to specific brand/product line | High — DC serves many banners/business units, allocation contentious | Moderate | High — compliance cost often can't be cleanly allocated per delivery |
| Backhaul/for-hire authority relevance | Low (route trucks rarely used for backhaul) | Moderate (DC trailers can backhaul) | Low-moderate | Low (specialized/compliant equipment, hard to repurpose) |

*(This table synthesizes the sub-model distinctions implied across the research above; no single source compares all four side-by-side, so treat structural claims here as reasoned synthesis rather than direct citation — 🟡 throughout.)*

---

## Full source list

- FleetOwner — "Key insights from the NPTC 2025 benchmarking survey on private fleet operations" — https://www.fleetowner.com/private-fleets/blog/55308859/key-insights-from-the-nptc-2025-benchmarking-survey-on-private-fleet-operations
- FleetOwner — "NPTC private fleet benchmarking survey shows equipment stats and increase in driver retirement" — https://www.fleetowner.com/operations/article/55136778/nptc-private-fleet-benchmarking-survey-shows-equipment-stats-and-increase-in-driver-retirement
- FleetOwner — "National Private Truck Council benchmarking survey reveals fleet growth and increased efficiency" — https://www.fleetowner.com/research/article/55136759/national-private-truck-council-benchmarking-survey-reveals-fleet-growth-and-increased-efficiency
- FleetOwner — "NPTC rolls out next-generation private fleet benchmarking" — https://www.fleetowner.com/management/nptc-private-fleet-assessment-tool-0626
- FleetOwner — "Trucking operational costs hit record $2.336 per mile, ATRI reports" — https://www.fleetowner.com/operations/article/55392569/atri-report-breaks-down-class-8-truck-operating-costs-by-region-and-expense-category
- Transport Topics — "Private Fleets Ship Record 75% of Owners' Outbound Freight" — https://www.ttnews.com/articles/nptc-private-fleet-growth
- Transport Topics — "For-Hire Carriers Gain Record Share of Private Fleet Freight" — https://www.ttnews.com/articles/nptc-freight-survey
- Transport Topics — "Truck operating costs rose 3.4% in 2025, ATRI finds" — https://www.ttnews.com/articles/atri-truck-costs-2025
- Penske Truck Leasing (sponsor blog) — "NPTC Benchmarking Survey: Private Fleets Strengthen Control Over Outbound and Inbound Freight" — https://www.pensketruckleasing.com/resources/blog/nptc-benchmarking-survey-private-fleets-strengthen-control-over-outbound-and-inbound-freight/
- Penske Truck Leasing — "Why Private Trucking Fleets Continue to Increase" — https://www.pensketruckleasing.com/resources/resource-library/private-trucking-fleets/
- Penske Truck Leasing — "How To Take Control as Operational Costs Rise" — https://www.pensketruckleasing.com/resources/resource-library/operational-costs/
- National Private Truck Council (NPTC) — "Benchmarking Survey" — https://www.nptc.org/benchmarking/benchmarking-survey/
- NPTC — "Benchmarking Report" — https://www.nptc.org/benchmarking/benchmarking-report/
- NPTC — "Benchmarking Report Archive" — https://www.nptc.org/benchmarking/benchmarking-report-archive/
- NPTC — "Private Fleets Eye More Growth" (Gary column) — https://www.nptc.org/gary-column/private-fleets-eye-more-growth/
- NPTC — "Fleet Scorecarding" (Gary column) — https://www.nptc.org/gary-column/fleet-scorecarding/
- Commercial Carrier Journal (CCJ) — "Private Fleet vs. Dedicated: Navigating the Upcoming Fleet Cost Reset" — https://www.ccjdigital.com/business/outlook-and-benchmarking/article/15829816/private-fleet-vs-dedicated-navigating-the-upcoming-fleet-cost-reset
- CCJ — "Private fleets thrive amid freight rate recession" — https://www.ccjdigital.com/business/outlook-and-benchmarking/article/15767943/private-fleets-thrive-amid-freight-rate-recession
- Truckinginfo/Heavy Duty Trucking — "ATRI: Average Truck Operating Cost Reaches Record $2.336 Per Mile" — https://www.truckinginfo.com/news/trucking-fleets-faced-record-operating-costs-during-third-year-of-freight-recession
- Truckinginfo — "Why Private Fleets are Taking More Freight" — https://www.truckinginfo.com/news/why-private-fleets-are-taking-more-freight
- Truckinginfo — "Private Fleets Growing and Poised for More" — https://www.truckinginfo.com/10226992/private-fleets-growing-and-poised-for-more
- FreightWaves — "NPTC report shows continued private fleet growth" — https://www.freightwaves.com/news/nptc-report-shows-continued-private-fleet-growth
- Truck News (Canada) — "Private fleets keep growing with fewer miles, higher driver pay and faster trade cycles" — https://www.trucknews.com/transportation/private-fleets-keep-growing-with-fewer-miles-higher-driver-pay-and-faster-trade-cycles/1003201818/
- American Transportation Research Institute (ATRI) — "Operational Costs of Trucking" — https://truckingresearch.org/about-atri/atri-research/operational-costs-of-trucking/
- ATRI/Trucking Research — "New ATRI Report Details Accelerating Costs and Low Profitability Despite Cuts" (2026) — https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/
- ATRI/Trucking Research — "New ATRI Report Shows Trucking Profitability Severely Squeezed by High Costs, Low Rates" (2025) — https://truckingresearch.org/2025/07/new-atri-report-shows-trucking-profitability-severly-squeezed-by-high-costs-low-rates/
- FleetMaintenance — "Breakdown of ATRI 2025 operational costs report" — https://www.fleetmaintenance.com/equipment/article/55301363/american-transportation-research-institute-atri-breakdown-of-atri-2025-operational-costs-report
- Oregon Trucking Associations — "ATRI's Latest Operational Costs of Trucking Analysis" — https://www.ortrucking.org/2025/07/02/atris-latest-operational-costs-of-trucking-analysis/
- Bulk Transporter — "ATRI: Trucking expenses hit record $2.336 per mile" — https://www.bulktransporter.com/fleet-management/news/55391667/atri-trucking-expenses-hit-record-2336-per-mile
- Cottingham & Butler — "2025 Trucking Operational Costs and Industry Trends" — https://www.cottinghambutler.com/post/2025-trucking-operational-costs-and-industry-trends-key-takeaways-from-atri-s-latest-report
- International Foodservice Distributors Association (IFDA) — "IFDA Releases 2025 Technology Benchmarking Report" — https://ifdaonline.org/ifda-releases-2025-technology-benchmarking-report-revealing-shifts-in-foodservice-distribution-tech-adoption/
- IFDA — "Benchmarking & Compensation (Operations & Financial)" — https://ifdaonline.org/benchmarking-compensation/
- Restaurant Business Online — "Foodservice Distributor Report Benchmarks Operations Areas Important to Success" (2009 IFDA operational benchmark) — https://www.restaurantbusinessonline.com/foodservice-distributor-report-benchmarks-operations-areas-important-success
- CPG Scout — "DSD vs warehouse, explained" — https://www.cpgscout.ai/glossary/cpg-distribution
- The Big Box Broker — "DSD vs. Warehouse Distribution" — https://thebigboxbroker.com/blog/dsd-vs-warehouse-distribution/
- Umbrex — "What is DSD in food and beverage?" — https://umbrex.com/resources/umbrex-explainers/agriculture-food-explainers/dsd-in-food-and-beverage/
- Umbrex — "Logistics Cost as Percentage of Sales Guide" — https://umbrex.com/resources/company-analysis/supply-chain-logistics/logistics-cost-as-percentage-of-sales/
- NextBillion.ai — "Case Picking vs. Full-Pallet Beverage Deliveries" — https://nextbillion.ai/blog/case-picking-vs-full-pallet-beverage-deliveries-dsd-routes
- NextBillion.ai — "DSD Route Software for Beverage Companies" — https://nextbillion.ai/blog/dsd-route-software-for-beverage-companies
- Slimstock — "OTIF (On-Time In-Full): What It Is and How to Measure It" — https://www.slimstock.com/blog/otif-guide/
- LeafIO — "OTIF in Supply Chain: Meaning, Formula, and How to Improve It" — https://www.leafio.ai/blog/on-time-in-full-formula-and-how-to-improve/
- MetricHQ — "On-Time In-Full (OTIF)" — https://www.metrichq.org/supply-chain/on-time-in-full/
- McKinsey — "Defining 'on-time, in-full' in the consumer sector" (PDF) — https://www.mckinsey.com/~/media/McKinsey/Business%20Functions/Operations/Our%20Insights/Defining%20ontime%20infull%20in%20the%20consumer%20sector/Defining-on-time-in-full-in-the-consumer-sector.pdf
- Descartes — "Roadnet Alternative: Find the Ideal Replacement" — https://www.descartes.com/resources/knowledge-center/evaluating-roadnet-software-alternative
- Descartes — "Route Execution & Fleet Performance Management" — https://www.descartes.com/solutions/routing-mobile-and-telematics/route-execution-and-fleet-performance-management
- Descartes — "Roadnet vs Descartes FAQ" — https://www.descartes.com/resources/knowledge-center/roadnet-vs-descartes-faq
- Descartes (UK) — "Routing plan vs actual" — https://routinguk.descartes.com/route-planning-and-scheduling/routing-plan-vs-actual
- SpotSee — "Understanding the Drug Supply Chain Security Act (DSCSA)" — https://spotsee.io/blog/understanging-the-drug-supply-chain-security-act-dscsa/
- IntuitionLabs — "Pharma Cold Chain Software & GDP Compliance Guide 2026" — https://intuitionlabs.ai/articles/pharma-cold-chain-software-gdp-compliance
- Food Logistics — "FDA To Finalize The FSMA Sanitary Transport Rule" — https://foodlogistics.com/cold-chain/article/12176705/fda-to-finalize-the-fsma-sanitary-transport-rule
- FleetRabbit — "Complete Guide to Cold Chain and FDA Compliance in Food Fleets" — https://fleetrabbit.com/industry/food-and-beverage/cold-chain-fda-compliance-guide-food-fleets
- FleetRabbit — "Productivity Per Driver Metrics for Logistics Fleets" — https://fleetrabbit.com/industry/transportation-and-logistics/driver-productivity-logistics-fleets
- Creek Logistic — "Cold Chain Excellence and FSMA 204 Compliance Guide" — https://creeklogistic.net/en/blog/food-beverage-cold-chain-fsma-204-compliance
- envigilance — "Food Distribution Center Monitoring: FSMA Guide 2026" — https://envigilance.com/blog/food-distribution-center-monitoring/
- APQC — "Expedited costs as a percentage of freight cost" — https://www.apqc.org/what-we-do/benchmarking/open-standards-benchmarking/measures/expedited-costs-percentage-freight
- APQC — "Full trailer-load or full container-load capacity utilization" — https://www.apqc.org/what-we-do/benchmarking/open-standards-benchmarking/measures/full-trailer-load-or-full-container
- OpsDog — "Distribution Expense as a Percentage of COGS Benchmarks" — https://opsdog.com/products/distribution-expense-as-a-percentage-of-cogs
- Lily Transportation — "Private Fleet vs. Outsourcing: The 2026 Executive Guide" — https://lily.com/private-fleet-vs-outsourcing-the-2026-executive-guide-to-choosing-the-right-transportation-model/
- Lily Transportation — "Private Fleet Cost Guide 2026" — https://lily.com/private-fleet-cost-guide-2026-what-transportation-leaders-need-to-know-before-building-or-expanding-a-fleet/
- ArcBest — "Owning a Fleet vs. Outsourcing Transportation" — https://arcb.com/blog/owning-a-fleet-vs-outsourcing-transportation
- RXO — "What Is Private Fleet Trucking? Using Private & Dedicated Fleets" — https://rxo.com/resources/shipper/private-vs-dedicated-fleet/
- ATS Inc. — "Private Fleet vs. Outsourced Trucking Services" — https://www.atsinc.com/blog/private-fleet-vs-outsourced-trucking
- RTA Fleet — "Fleet Chargeback Systems: A Guide to Cost Allocation, Rates, and Billing" — https://rtafleet.com/blog/fleet-chargeback-systems-a-guide-to-cost-allocation-rates-and-billing
- RTA Fleet — "The Hidden Value of Chargeback Systems" — https://rtafleet.com/blog/the-hidden-value-of-chargeback-systems-in-fleet-management
- Government Fleet — "How to Manage Fleet Costs with a Chargeback System" — https://www.government-fleet.com/articles/how-to-manage-fleet-costs-with-a-chargeback-system
- SupplyChainBrain — "Improving Cost Absorption in Private Fleet Transportation" — https://www.supplychainbrain.com/articles/40338-improving-cost-absorption-in-private-fleet-transportation
- American Trucking Associations (ATA) — "Turnover Remained Unchanged at Large Truckload Fleets in Fourth Quarter" — https://www.trucking.org/news-insights/turnover-remained-unchanged-large-truckload-fleets-fourth-quarter
- ATA — "The truth about trucking turnover" — https://www.trucking.org/news-insights/truth-about-trucking-turnover
- Trucking Dive — "6 charts show how private fleets recruit, retain drivers" — https://www.truckingdive.com/news/charts-data-private-fleet-truck-driver-retention-recruit/611047/
- National Academies — "Driver Retention and Turnover in Long-Distance Trucking" — https://www.nationalacademies.org/read/27892/chapter/6
- Foley Carrier Services — "What Is a CSA Score? FMCSA Safety Measurement System Guide 2026" — https://www.foleyservices.com/csa-score/
- Fleetworthy — "CSA Program Explained: Scores, BASICs, and How to Improve" — https://fleetworthy.com/resources/blog/what-is-the-csa-program/
- ABC Supply — "Our Fleet" — https://www.abcsupply.com/services/our-fleet/
- ABC Supply — "6 Ways ABC Supply's Fleet Delivers Guaranteed Service" — https://abcsupply.com/blog/6-ways-abc-supply-s-fleet-provides-guaranteed-delivery-abc-supply
- Wikipedia — "Beacon Building Products" — https://en.wikipedia.org/wiki/Beacon_Building_Products
- Wikipedia — "ABC Supply" — https://en.wikipedia.org/wiki/ABC_Supply
- Fulfill.com — "Cube Utilization: Definition, Calculation & Best Practices" — https://www.fulfill.com/glossary/cube-utilization
- Owlery — "What is Cube Utilization / Trailer Utilization?" — https://owlery.ai/glossary/cube-utilization-trailer-utilization
- Phillips Connect — "Understanding Asset Utilization for Trailer Fleets" — https://www.phillips-connect.com/the-1-understanding-trailer-utilization
- Upper Inc. — "The Top 5 Key Metrics to Measure in Last-Mile Delivery" — https://www.upperinc.com/blog/last-mile-delivery-metrics/
- FarEye — "Top 20 Delivery KPIs for Driver Performance" — https://fareye.com/resources/blogs/delivery-performance-kpis
- ScienceDirect — "Operational and environmental disparities in parcel last-mile delivery across spatial contexts" — https://www.sciencedirect.com/science/article/pii/S0966692326001365
- Motley Fool — "Sysco (SYY) Q4 2026 Earnings Call Transcript" — https://www.fool.com/earnings/call-transcripts/2026/08/11/sysco-syy-q4-2026-earnings-call-transcript/

---

## Summary for the product team (also delivered in final message)

The 10 metrics this segment lives or dies by, its top 3 measurement pain points, and how its metric set differs from a for-hire carrier's are given in the accompanying handback message.
