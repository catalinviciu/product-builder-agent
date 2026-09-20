# Field Services / Trades (US) — How This Segment Measures Performance

**Segment scope:** HVAC, plumbing, electrical, pest control, landscaping, facilities/janitorial, appliance repair, security/alarm, pool service, and similar route-and-dispatch trades. Estimated 1–3M light vehicles (vans/pickups), highly fragmented — long tail of sub-10-vehicle operators alongside PE-backed consolidators.

**Research date:** September 2026. **Method note:** WebFetch was unavailable in this environment; all findings below come from WebSearch result snippets, not direct reads of primary documents. Every claim is labeled 🟢 (primary source directly reflected in the snippet, e.g., a named study/agency), 🟡 (secondary/vendor-blog synthesis, plausible but not independently verified), or 🔴 (widely repeated but traces to no identifiable primary study — treat as industry lore). Treat all numbers as directional, not audited.

---

## THE CENTRAL ANALYTICAL POINT

In trucking, the **vehicle is the revenue unit** — an empty truck earns nothing until it's loaded and moving freight; utilization, deadhead miles, and load factor are the business.

In field services, **the technician's billable hour is the revenue unit** and the van is only the delivery mechanism that gets a technician (and their parts) to the next chargeable hour. A parked van earns nothing; a technician standing in a driveway with the wrong part *also* earns nothing, even though the van did its job perfectly. This inverts the fleet-metrics hierarchy relative to trucking:

- Trucking asks: *is this vehicle moving, loaded, and safe?*
- Field services asks: *is this technician on a billable job, right now, with the parts and skills to finish it in one visit — and is the van doing everything possible to keep that hour billable rather than eating it as drive time?*

Fleet metrics (vehicle utilization, idle time, fuel, maintenance) matter in field service **only to the extent they add or destroy billable technician hours.** A van sitting idle for 20 minutes is a rounding error in trucking economics; it is a technician not on a ladder, which is the entire P&L. This report is organized around that inversion, and around the sales dimension unique to this segment: technicians in HVAC/plumbing/electrical routinely **sell** (system replacements, service agreements, upgrades), so average ticket and close rate sit alongside productivity metrics as core KPIs — a category that doesn't exist in trucking, pest inspection routes, or most other fleet verticals.

---

## 1. THE OPERATING MODEL

**Pricing: time-and-materials vs. flat-rate.** Residential HVAC and plumbing are dominated by **flat-rate (menu) pricing books** — a pre-built price list mapping each repair/service to a fixed customer price (built from cost + target margin + labor multiplier), rather than billing hourly. A well-built residential price book is reported to cover roughly 75–90% of service calls without technician judgment calls on price 🟡 (ServiceTitan/Simpro/FieldEdge vendor content, 2026). Flat-rate pricing removes the incentive problem of hourly billing (technician has no reason to work slowly) and lets a technician quote and close on the spot — which is why it also functions as a **sales tool**, not just a pricing mechanism. Commercial and construction work is more often time-and-materials or bid/contract-based because the work is less standardized.

**Service agreements / maintenance contracts — the profitability and valuation engine.** Recurring maintenance agreements (e.g., twice-yearly HVAC tune-ups, quarterly pest visits, monthly landscaping) are the mechanism by which trades convert one-off emergency demand into predictable revenue. They matter for three reasons: (1) they smooth brutal seasonality by guaranteeing shoulder-season work; (2) members get priority in overload season, and the membership base is a renewable lead-generation list for replacement/upsell work; (3) **buyers price recurring revenue at a premium** — search snippets put maintenance-agreement/service-revenue mix as adding roughly 1–2x additional EBITDA multiple turns versus install-heavy revenue 🟡 (Beancount.io, 2026), and PE roll-up platforms reportedly target 35–50% of revenue from service agreements at scale 🟡 (CT Acquisitions 2026 Home Services M&A report). This is **why service-agreement count, not vehicle count or even total revenue, is the number PE buyers ask for first** — it is a proxy for durable, non-lumpy cash flow and a built-in cross-sell channel.

**Residential vs. commercial mix.** Industry-wide the HVAC market splits roughly 55–60% residential / 40–45% commercial 🟡 (Withorbital/industry aggregator, 2026 — no primary source specified), though individual contractors vary widely (one cited example: 65/35) 🟡. Commercial work carries longer payment cycles (~42 days vs. ~18 days residential per one contractor-advisory source) 🟡, which changes cash-flow management even when job margins look similar.

**Emergency/after-hours premium work.** Emergency and after-hours calls typically carry a rate premium and are the highest-margin, highest-urgency category — but they're also unscheduled, which is why dispatch/response-time performance (Section 2) is scrutinized specifically for this bucket.

**Seasonality.** HVAC demand is sharply seasonal: search snippets describe summer/winter as peak (e.g., illustrative monthly revenue examples of ~$50K in peak months vs. ~$30–35K in spring/fall shoulder months) 🟡 (industry blog examples, 2026), with the "shoulder season" (spring, and especially September) showing a well-known demand dip 🟡 (Samsara blog, ServiceTitan blog, 2026). This is precisely why service agreements (contracted maintenance visits that can be scheduled into slow months) are treated as the primary seasonality hedge. It also means **month-over-month KPI trends are close to meaningless without year-over-year or seasonally-adjusted comparison** — a point directly relevant to Section 6.

**Technician pay models.** The field mixes base/hourly pay with commission and spot bonuses ("spiffs"):
- Straight commission on service tickets: roughly 5–15% of ticket value is described as a "sweet spot" for techs with a guaranteed base 🟡 (Sharewillow/Everstage vendor content, 2026); tiered structures citing 3–12% depending on sale size were also found 🟡.
- Spiffs: small flat bonuses for specific behaviors — e.g., ~$20 for a 5-star review, ~$10 for on-time arrival, ~$100 for a sold maintenance agreement, up to ~$500 for closing a top-tier equipment sale 🟡 (PipelineOn, 2026).
- A commonly cited "four-pillar" pay stack: base salary + % of service tickets + flat spiff per membership sold + % of equipment sold 🟡.
This matters because **technician comp is the direct behavioral lever** in this segment — scorecards aren't just reporting, they're payroll inputs (see Section 4).

**The private-equity roll-up dynamic.** This is reshaping the segment's competitive and measurement landscape. Search snippets (CT Acquisitions tracker, 2026) describe **288 active PE platforms rolling up US trades across 32 sectors**, with **30+ active home-services platforms** and at least 21 platforms with disclosed plumbing acquisitions Jan 2024–Apr 2026 🟡. Named platforms include Apex Service Partners (60+ acquired brands, reportedly $1B+ revenue), Wrench Group (35+ brands, ~$900M+ revenue), Sila Services, and Authority Brands (franchise-based, spanning HVAC/plumbing/pest/electrical) 🟡 (CT Acquisitions / marketingcode.com, 2026 — none of these figures verified against a primary financial filing). ServiceTitan itself is described as public since 2024 (NASDAQ: TTAN), powering 11,800+ contractors and ~$59B in annualized gross transaction volume 🟡 (search-snippet summary, likely drawn from ServiceTitan's own investor materials — treat as company-reported, not independently audited). Post-acquisition, platforms are reported to standardize reporting: moving bolt-on acquisitions off cash-basis QuickBooks onto accrual monthly close, installing a platform CFO, VP Operations, regional VPs, and unified KPI dashboards/weekly flash reporting 🟡 (search-snippet synthesis, 2026, no single named source). **Net effect for a fleet vendor:** the buyer for a multi-brand platform's tooling decisions is increasingly a regional VP or PE-installed CFO optimizing a portfolio-level KPI stack, not the original owner-operator.

---

## 2. THE METRICS THAT ACTUALLY DRIVE THIS SEGMENT

| Metric | Formula | Unit | Cadence | Typical Owner | Benchmark (source, year) | Confidence |
|---|---|---|---|---|---|---|
| Revenue per technician (per day/year) | Total completed revenue ÷ technician-days (or ÷ tech per year) | $ | Daily/annual | Service Mgr, Owner | Illustrative: 5 calls/day × ~$200/call × 5 days × 50 wks ≈ $250K/yr; separately, "2026 benchmarks" cited $180K–$250K/yr for HVAC (source unclear) | 🟡 |
| Technician utilization (billable vs. paid hours) | Billable field-job hours (incl. upsell time) ÷ total paid hours | % | Weekly | Service/Ops Mgr | Industry range cited as 60–80% "strong"; other sources cite a 65–85% target band | 🟡 |
| Jobs/calls completed per technician per day | Count of completed jobs ÷ tech-day | # | Daily | Dispatcher, Service Mgr | 3–5 calls/day typical, up to 7 for high performers (vendor blog synthesis) | 🟡 |
| First-time fix rate (FTFR) | Jobs resolved without a return visit ÷ total jobs | % | Weekly/monthly | Service Mgr, Ops Mgr | Snippets range 67–90% depending on source; Aberdeen Group cited at ~75–77% average, ~88–89% "best-in-class"; widely-repeated "80% target" traces to no single named primary study | 🔴 for the "80% target" specifically; 🟡 for the Aberdeen-attributed range (secondhand, not read directly) |
| Average ticket / average invoice | Total revenue ÷ number of invoices | $ | Weekly/monthly | Service Mgr, Owner | ~$200/call cited for HVAC; ~$315/call cited for plumbing (vendor blog, 2026) | 🟡 |
| Close rate / conversion rate on sold work | Jobs sold ÷ jobs quoted (or estimates presented) | % | Weekly | Service Mgr, Tech (comp) | "Top operators" cited at 35–45% close rate; membership-plan conversion cited at ≥30% target | 🟡 |
| Service agreement count | Count of active recurring-maintenance contracts | # | Monthly | Owner/GM, regional VP (at consolidators) | NPMA cited 85.4% of *residential pest revenue* as recurring (PCO Bookkeepers/NPMA 2025 study, per snippet) | 🟡 (secondhand from named study) |
| Renewal rate / attrition on agreements | Renewed agreements ÷ agreements up for renewal | % | Annual | Owner/GM | Landscaping: "successful" firms cited at 90–95% retention, bottom quartile ≤69% (NALP-adjacent source) | 🟡 |
| Recurring revenue % of total | Agreement/contract revenue ÷ total revenue | % | Monthly/annual | Owner, CFO (consolidator) | PE platforms reportedly target 35–50% recurring at scale (CT Acquisitions, 2026) | 🟡 |
| Callback/rework rate | Non-billable return visits ÷ total completed jobs | % | Weekly | Service Mgr | Industry benchmark cited "acceptable" at 2–3%, top performers ~2%; one ACCA-attributed figure: a callback costs ~$650 in tech time + overhead + lost opportunity | 🟡 (ACCA attribution not independently confirmed) |
| On-time arrival / window adherence | Jobs arriving within promised window ÷ total scheduled jobs | % | Daily/weekly | Dispatcher | Top-quartile firms cited placing techs in <8 minutes of dispatch (attributed to "ANGI Homeservices operational data" in a vendor blog) | 🔴 (single unverified vendor citation) |
| Emergency/urgent response time | Time from call to technician arrival, urgent jobs only | minutes/hours | Per-incident, reviewed daily | Dispatcher, Service Mgr | Plumbing emergency response cited ~30 min–2 hrs; HVAC emergency cited ~1–2 hrs typical, 2–4 hr windows common; 2-hr benchmark cited for critical/no-redundancy commercial assets | 🟡 |
| Windshield/drive time as % of workday | Drive-time hours ÷ total paid hours | % | Daily/weekly | Dispatcher, Ops Mgr | Manual dispatch cited at 35–40%; well-optimized operations cited under 20%; one source: up to 30–35% of the day, ~3 hrs, is unbillable drive time | 🟡 |
| Miles per job | Total fleet miles ÷ jobs completed | miles | Weekly/monthly | Ops Mgr, fleet admin | No verified industry benchmark found | 🔴 (not found) |
| Dispatch efficiency / schedule density | Booked job-hours ÷ available tech-hours in the schedule | % | Daily | Dispatcher | Smart dispatch cited to cut travel time 20–40%; route-optimization ROI payback cited "under 6 months" | 🟡 |
| Truck stock / parts availability (fill rate) | Jobs with all needed parts on van at job start ÷ total jobs | % | Weekly | Ops Mgr, Warehouse/Inventory lead | Missing/incorrect parts cited by Aberdeen as the #1 driver of FTFR failure (~51% of failures, secondhand); other snippets: 15–30% of calls fail FTF due to missing parts | 🟡 |
| Gross margin per job | (Job revenue − direct labor − direct materials) ÷ job revenue | % | Weekly/monthly | Service Mgr, CFO | Gross margins below ~40% flagged in vendor content as a sign of underpricing/poor parts management (no primary source named) | 🔴 |
| Labor cost per job | Direct technician labor cost ÷ job | $ | Weekly | Service Mgr | No single verified benchmark found; ties to wage-expense ratios below | — |
| Customer satisfaction / NPS | % promoters − % detractors (0–10 scale) | score | Monthly/quarterly | Owner, Service Mgr | Generic marketing-industry framing: score >0 "good," >50 "exceptional" — no trades-specific NPS benchmark study found | 🔴 (generic NPS framing, not trades-specific) |
| Online review rating | Aggregate star rating on Google/Yelp/etc. | stars | Continuous | Owner, Marketing | Widely cited as the primary driver of inbound (organic/LSA) lead volume in this segment; no single quantified benchmark found | 🟡 (directional consensus, no hard number) |
| Technician turnover | Techs departed ÷ average headcount | %/year | Annual | Owner, HR/Ops | 20–35% annual cited as typical HVAC turnover, alongside a projected 110,000-technician national shortage (vendor-blog synthesis, likely drawing on BLS projections) | 🟡 |
| Time-to-productivity, new hire | Months from hire to full billing rate | months | Per-hire | Service Mgr | 6–12 months cited typical for new HVAC hires | 🟡 |
| Cost per lead / CAC | Marketing spend ÷ leads (or ÷ booked customers) | $ | Monthly | Owner, Marketing | HVAC blended CPL ~$104 (Google Ads) cited; LSA-sourced customers ~$190; Google Ads $300–400/customer; SEO $50–150; referrals <$50 (marketing-agency blog, 2026) | 🟡 |
| Employee/labor cost as % of revenue | Total wage expense ÷ revenue | % | Monthly | CFO/Owner | Pest control ~42–47% (NPMA/PCO Bookkeepers 2025 study, per snippet); landscaping ~25–55%, "industry consensus ~35%" (NALP-adjacent) | 🟡 |
| Net profit margin | Net income ÷ revenue | % | Monthly/annual | Owner, CFO | ACCA 2024 Financial Benchmarking Study cited: median HVAC net margin 5.8%, top quartile 13.2% | 🟡 (secondhand citation of a named primary study — not independently read) |

---

## 3. HOW THEY MEASURE — cadence, workflow, systems of record

**Cadence, typical pattern (synthesized from vendor/operator content, not a single named study):**
- **Daily:** morning dispatch board (assign jobs, confirm truck stock), end-of-day review (jobs closed, callbacks flagged, cash/checks collected, tomorrow's schedule locked).
- **Weekly:** individual technician scorecards (jobs/day, average ticket, close rate, callback count) reviewed 1:1 or in a huddle; some operators do ride-alongs for coaching, especially for new hires or underperformers.
- **Monthly:** P&L reviewed by department/business unit (service, install, maintenance); at PE platforms this becomes a formal board/flash report cycle.
- **Quarterly:** at ServiceTitan-using shops, a vendor-generated "Benchmark Report" compares the business's metrics (booking rate, completed revenue, average ticket) against anonymized peers of similar size/trade/region — e.g., ServiceTitan's "Fall 2025 Benchmark Report" and "Summer Benchmark Report" webinars 🟡 (ServiceTitan blog, 2025–2026; company-generated benchmark, not third-party audited).

**Systems of record.** The **field service management (FSM) platform is the system of record**, not a fleet or telematics platform. Named platforms found: ServiceTitan (enterprise-grade, "$3–5M+ revenue" segment per comparison content), Housecall Pro (mid-market, "$500K–$3M," cited 40,000+ active contractors as of parent-company 2024 disclosure), Jobber (smaller/starting-out segment, "<$1M"), plus FieldEdge, ServiceMax, Salesforce Field Service, Workiz mentioned in the prompt as category peers 🟡. These platforms hold the price book, dispatch board, invoicing, technician scorecards, service-agreement records, and — increasingly — the benchmark comparison data. Telematics (Verizon Connect, Azuga, Samsara, Motive) and fuel cards sit *underneath* this layer, feeding vehicle location/fuel/idle data that may or may not make it into the FSM record (see Section 6). QuickBooks (or, at consolidators, a proper accrual ERP) sits downstream for accounting.

**Implication for a fleet software vendor:** a fleet product that only reports vehicle-centric metrics (idle time, harsh braking, fuel efficiency) is reporting on the wrong unit of analysis for this buyer. The FSM platform already owns technician utilization, revenue per tech, first-time fix, and close rate — the numbers the owner/GM/service manager actually manages to. A fleet vendor's data is valuable *only* insofar as it can be translated into FSM-native terms (e.g., "windshield time attributable to routing" mapped onto technician utilization) or piped directly into the FSM platform via integration. Standalone fleet dashboards risk being a second system nobody opens.

**How sub-10-vehicle operators actually run.** Search snippets describe very small operators still relying on **Excel-based estimating templates, paper/PDF work orders, and manual re-entry of the same data across estimate → work order → invoice** 🟡 (BuildOps/MEP Academy vendor content, 2026) — i.e., the "system of record" for the smallest tail of the segment is genuinely paper/spreadsheets/phone, with pricing built from static markup multipliers (3x–6x on parts cited as a rule of thumb) rather than a maintained digital price book. These operators typically measure **cash in the bank and whether the phone is ringing** — not FTFR or utilization — because they lack the tooling (and often the time) to compute anything more granular. This is a distinct and durable sub-market, not a transitional state most will graduate out of.

---

## 4. WHO OWNS EACH NUMBER

| Role | Typical scope | Metrics owned/reviewed | Compensated on |
|---|---|---|---|
| Owner/GM (small operator) | Everything — sales, dispatch, hiring, books | All of the above, informally | Business net profit (it's their business) |
| Service Manager | Field technician performance, quality, customer sat | FTFR, callback rate, close rate, average ticket, tech scorecards | Sometimes tied to department gross margin/callback rate |
| Dispatch Manager / Dispatcher | Scheduling, routing, response time, window adherence | On-time arrival, response time, schedule density, windshield time | Rarely commissioned directly; sometimes spiffed for dispatch efficiency |
| Operations Manager | Cross-functional: inventory, billing, fleet, HR | Truck stock/fill rate, labor cost per job, technician turnover | Operational bonus tied to multiple KPIs |
| Field Supervisor | Direct technician oversight, ride-alongs, coaching | Jobs/day, utilization, safety, quality audits | Team performance bonus |
| Regional VP (consolidator) | Multiple branches/brands under one PE platform | Roll-up of branch P&Ls, standardized KPI dashboard | Regional EBITDA / KPI targets |
| PE-installed CFO | Portfolio-wide financial reporting to sponsor/board | Recurring revenue %, EBITDA, cash conversion, roll-up integration metrics | Value-creation-plan milestones |
| **Technician (individual)** | The billable unit itself | **Directly compensated on:** commission % of ticket, spiffs for membership sales/reviews/on-time arrival, sometimes a callback-rate penalty | This is the group whose comp is most directly and mechanically tied to a scorecard — behavior follows the metric almost immediately |

**Key point for measurement design:** because technicians are commissioned on close rate, ticket size, and membership sales, and spiffed on reviews and on-time arrival, **the scorecard is not just a reporting artifact here — it is a live payroll input**, updated at the same cadence as pay. This is a meaningfully tighter metric-to-behavior loop than most other fleet-software verticals (e.g., trucking driver scorecards, which usually feed safety/insurance programs rather than piece-rate pay).

---

## 5. BENCHMARKS — full table with skepticism applied

The parallel research point holds up under this search: the frequently quoted **"80% first-time-fix-rate target"** appears across dozens of vendor blogs (ServiceTitan, FieldEdge, various FSM SaaS sites) with **no single named primary study cited consistently** — different blogs attribute different ranges (67–73%, 70–80%, 75%, 77%) to vaguely-cited "industry benchmarks" or to "Aberdeen Group" without a retrievable report title/year in the snippet, and the specific number moves depending on which vendor is publishing it. Two PDFs were found that appear to be genuine Aberdeen Group reports ("Fixing First-Time Fix," 2013, and an undated "RR-First-Time-Field" report), but this research could not read them directly (WebFetch blocked) — so even the Aberdeen attribution is 🟡 at best, not 🟢. **Treat "80% FTFR" as UNVERIFIED INDUSTRY LORE (🔴)** per the task's explicit instruction; treat the Aberdeen-attributed ~75–77% average / ~88–89% best-in-class figures as 🟡 secondhand-but-plausibly-real.

| Benchmark | Value | Source (as cited in snippet) | Year | Confidence |
|---|---|---|---|---|
| HVAC net profit margin, median / top quartile | 5.8% / 13.2% | ACCA Financial Benchmarking Study | 2024 | 🟡 |
| First-time fix rate, "target" | 80% | Repeated across vendor blogs, no consistent primary citation | ongoing | 🔴 |
| First-time fix rate, average / best-in-class | ~75–77% / ~88–89% | Attributed to Aberdeen Group (not directly read) | undated/2013-era | 🟡 |
| First-time fix rate, alternate range | 67–73% (typical) up to 85–90% (real-time inventory visibility) | Vendor blog synthesis (Ventory, SmartServiceOps) | 2026 | 🔴 |
| Root causes of FTF failure | Missing/incorrect parts ~51%; skills gap ~25%; insufficient time ~13% | Attributed to Aberdeen Group | undated | 🟡 |
| Callback rate, acceptable / top performers | 2–3% / ~2% | Vendor blog (Coach Ellie Marshall et al.) | 2026 | 🔴 |
| Callback cost estimate | ~$650 per 2-hour callback | Attributed to ACCA | undated | 🔴 (attribution not verifiable) |
| Technician utilization, "strong" range | 60–80% | FieldEdge/vendor blog | 2026 | 🟡 |
| Windshield time, manual vs. optimized dispatch | 35–40% vs. <20% | Vendor blog synthesis (multiple sources) | 2026 | 🟡 |
| Technician close rate, top operators | 35–45% | Vendor/benchmark-report blog | 2026 | 🟡 |
| Average ticket, HVAC / plumbing | ~$200 / ~$315 per call | Vendor blog synthesis | 2026 | 🟡 |
| HVAC technician turnover | 20–35% annually | Vendor blog (AvaHR, ServiceTitan), likely drawing on BLS | 2026 | 🟡 |
| HVAC job openings (BLS occupational projection) | ~40,100/year through 2034; 8% employment growth 2024–2034 | U.S. Bureau of Labor Statistics, Occupational Outlook Handbook | 2024–2034 projection | 🟢 (named federal primary source, though only reflected via snippet, not directly read) |
| Time-to-productivity, new HVAC hire | 6–12 months | Vendor blog synthesis | 2026 | 🟡 |
| NPMA/pest recurring revenue (residential) | 85.4% | NPMA / PCO Bookkeepers 2025 Pest Control Industry Cost Study | 2025 | 🟡 (named primary study, not directly read) |
| Pest control wage expense as % of revenue | 42–47% | NPMA / PCO Bookkeepers study | 2025 | 🟡 |
| NALP landscaping customer retention | 90–95% (successful firms) vs. ≤69% (bottom quartile) | NALP-adjacent survey source | 2025/2026 | 🟡 |
| Landscaping revenue per customer (median) | $14,682/year | NALP Financial Benchmark Study | recent (year in snippet unclear, survey open through 2026) | 🟡 |
| PE platforms rolling up US trades | 288 platforms across 32 sectors; 30+ home-services platforms | CT Acquisitions tracker | 2026 | 🟡 (single research-shop tracker, not government/academic) |
| ServiceTitan scale | 11,800+ contractors, ~$59B annualized GTV | Search-snippet summary (likely ServiceTitan investor materials) | 2025/2026 | 🟡 |

---

## 6. WHERE MEASUREMENT BREAKS DOWN TODAY

1. **Revenue attribution mismatch: vehicle vs. technician.** Fleet systems naturally attribute activity to a VIN; the business's actual revenue unit is the technician (who may swap vehicles, ride with a helper, or work multiple trucks in a day at a larger shop). Any fleet-vendor metric built around "revenue per vehicle" is answering a question this segment doesn't ask — the FSM platform already computes revenue per technician, and reconciling the two requires a clean technician-to-vehicle mapping that many fleets don't maintain consistently (helper vehicles, pool vehicles, loaner vans).

2. **Drive time vs. job time vs. idle-at-job time is poorly separated.** "Windshield time" as commonly reported often bundles genuine driving with idle-at-curb time (finishing paperwork, waiting for a customer, an unbillable diagnostic delay before the clock officially starts). Telematics can distinguish "vehicle moving" from "vehicle stopped," but not "technician actively billing" from "technician stopped but not yet working" — that distinction lives in the FSM platform's job-status timestamps (dispatched → en route → arrived → in progress → completed), not in GPS data. Fleet and FSM data need to be joined at the job level to produce a real windshield-time number, and search results suggest this join is often done ad hoc via a third-party integration layer rather than natively (see next point).

3. **The telematics-to-FSM integration gap.** Search snippets describe fleets running multiple telematics providers simultaneously (e.g., Samsara on vans, Verizon Connect legacy hardware), each with its own dashboard, and note that "neither Samsara nor Verizon Connect delivers end-to-end integration [with FSM platforms] without a workflow automation layer" — implying most of the vehicle-to-FSM connection observed in the wild is via **documented APIs plus a middle integration layer built by a systems integrator**, not a deep native bidirectional sync 🟡 (US Tech Automations vendor content, 2026). This is the crux of the "does fleet data ever reach the platform where the business is actually managed" question: the honest answer from available evidence is *partially, and usually via bolt-on integration, not by default.*

4. **Truck stock accuracy is a first-time-fix problem, not an inventory problem in the accounting sense.** The metric that matters is not "inventory value on hand" but "did *this specific truck* have *this specific part* at the moment of dispatch" — a real-time, per-vehicle, per-SKU question. Aberdeen-attributed data (secondhand) puts missing/incorrect parts as the single largest driver of FTF failure (~51%), ahead of skills gaps (~25%) and time (~13%). Most small-to-mid operators reportedly still reconcile truck stock manually or periodically rather than in real time, meaning the FTF metric they report may be a lagging consequence of an inventory system that itself isn't measured with any rigor.

5. **Routing-optimization ROI is confounded by skill matching.** Multiple snippets converge on the point the task anticipated: sending the *geographically nearest* technician who lacks the right skill or parts produces a worse outcome (callback, second visit, unhappy customer) than sending a farther technician who closes it in one visit. This means a fleet/routing vendor claiming ROI purely from reduced drive-time or fuel savings is likely overstating impact, or at minimum measuring the wrong lever — the real value pool is in dispatch decisions that jointly optimize distance, skill/certification match, and parts availability, which is a scheduling/FSM-layer problem more than a pure routing/telematics one.

6. **Seasonality distorts every month-over-month comparison.** Because HVAC (and to a lesser extent other trades) swings sharply between peak and shoulder seasons, a naive month-over-month utilization or revenue-per-tech trend line will show what looks like performance collapse every spring/fall that is actually just demand seasonality. Any benchmarking product for this segment needs year-over-year or same-period-prior-year framing, and ideally to segment by trade (pest control and landscaping have different seasonal curves than HVAC) — a generic month-over-month KPI dashboard, of the kind common in fleet software, will mislead operators and vendors alike if applied naively here.

7. **The long tail of very small operators can realistically measure almost nothing beyond cash and calls.** Sub-10-vehicle shops running on Excel/paper (per Section 3) lack a system that could compute FTFR, utilization, or windshield time even if they wanted to — those metrics require job-level timestamped data that a spreadsheet doesn't capture. For this tail, "what they measure" is closer to: is the phone ringing, is cash in the bank growing, and informally, whether a given technician "seems" productive. A fleet or software vendor targeting this tail should not assume FSM-grade metrics are attainable without first getting the shop onto *some* digital job-tracking system — fleet telematics alone cannot backfill that gap.

---

## SUB-MODEL COMPARISON: Residential HVAC vs. Commercial Mechanical vs. Pest Control vs. Landscaping

| Dimension | Residential HVAC | Commercial Mechanical | Pest Control | Landscaping |
|---|---|---|---|---|
| Pricing model | Flat-rate menu pricing dominant | Bid/contract, T&M common | Flat-rate + recurring contract | Contract (recurring) + bid (one-off/design-build) |
| Revenue rhythm | Sharply seasonal (summer/winter peaks, spring/fall shoulder) | Less seasonal; project/PM-schedule driven | Seasonal but smoother (pest pressure varies by region/season) | Extremely seasonal in cold climates (near-zero winter in much of the US) |
| Recurring revenue role | Maintenance agreements smooth seasonality + cross-sell | Preventive-maintenance (PM) contracts are the backbone of commercial relationships | ~85% of residential revenue reported recurring (NPMA/PCO Bookkeepers, 2025, 🟡) | Recurring maintenance contracts are the core; design/install is the one-off upsell |
| Sales dimension | High — techs sell replacements, memberships | Lower at the tech level; sales handled more by account managers | Moderate — techs sell add-on treatments | Moderate — crew leads rarely sell; sales is a separate function |
| Payment cycle | Fast (residential, ~18 days cited) | Slow (~42 days cited for commercial) | Fast (residential-style billing) | Fast to moderate |
| Key quality metric | First-time fix rate, callback rate | Uptime/SLA compliance, PM completion rate | Re-treatment/callback rate | Customer retention rate (cited 90–95% for top performers) |
| Dominant FSM platforms | ServiceTitan, Housecall Pro, Jobber | ServiceMax, Salesforce Field Service, ServiceTitan (commercial modules) | PestPac and pest-specific platforms | Industry-specific tools (less standardized on ServiceTitan-class platforms) |
| PE roll-up intensity | Very high | High, but slower given longer sales cycles | Growing (per CT Acquisitions exit-prep content) | Growing |

*Note: this comparison is a synthesis of directionally consistent search snippets across separate queries, not a single source; treat cell-by-cell precision as 🟡 at best.*

---

## SMALL OPERATOR vs. CONSOLIDATOR COMPARISON

| Dimension | Sub-10-vehicle operator | PE-backed consolidator / multi-brand platform |
|---|---|---|
| System of record | Paper, Excel, phone; maybe entry-level FSM (Jobber) | Enterprise FSM (ServiceTitan), often standardized across acquired brands |
| Accounting | Cash-basis QuickBooks | Accrual monthly close, unified chart of accounts |
| KPIs tracked | Cash in bank, is the phone ringing, informal sense of "busy" | Full KPI stack: FTFR, utilization, recurring revenue %, EBITDA, roll-up integration metrics |
| Reporting cadence | Ad hoc / owner's head | Weekly flash reports, quarterly board decks, annual budget cycles |
| Who decides on tooling | Owner/GM, price-sensitive, often resistant to new software | Regional VP / platform CFO, standardizing procurement across the portfolio |
| Fleet-vehicle purchasing | Used vehicles, ad hoc replacement | Fleet-management program, potentially centralized procurement/leasing |
| Technician comp | Informal, owner-negotiated | Standardized commission/spiff plans across brands |
| Vulnerability | High owner-key-person risk; measurement ceiling is real (can't measure what isn't tracked) | Integration risk (bolt-on brands on different systems); risk of KPI theater disconnected from field reality |

---

## THE 10 METRICS THIS SEGMENT LIVES OR DIES BY (for final message, restated here for completeness)

1. Revenue per technician (day/year)
2. Technician utilization — billable vs. paid hours
3. Jobs/calls completed per technician per day
4. First-time fix rate
5. Average ticket / average invoice
6. Close rate on sold/quoted work
7. Service agreement count and renewal rate
8. Recurring revenue as % of total revenue
9. Callback/rework rate
10. Windshield/drive time as % of the paid day

---

## SOURCE LIST (URLs as returned by WebSearch; not independently verified via direct fetch)

- https://www.servicetitan.com/industries/hvac-software/flat-rate
- https://www.housecallpro.com/industries/hvac-software/flat-rate-pricing/
- https://www.simprogroup.com/blog/hvac-price-book
- https://www.servicetitan.com/blog/hvac-flat-rate-pricing
- https://fieldedge.com/flat-rate-pricing-software/
- https://beancount.io/blog/2026/07/11/hvac-plumbing-private-equity-roll-up-guide
- https://neumannassociates.com/industry-deep-dive-why-hvac-and-other-contractor-valuations-have-stayed-resilient/
- https://www.clearlyacquired.com/blog/what-is-a-multiple-and-how-does-it-determine-your-hvac-or-plumbing-business-value
- https://ctacquisitions.com/why-private-equity-is-buying-home-services-companies/
- https://auxocapitaladvisors.com/private-equity-hvac-roll-ups/
- https://jakenequities.com/articles/hvac-plumbing-business-sales.html
- https://ctacquisitions.com/guides/home-services-ma-multiples-report-2026/
- https://pipelineon.com/blog/private-equity-buying-hvac/
- https://www.servicetitan.com/blog/hvac-private-equity
- https://amerivestgroup.com/en/private-equity-buying-hvac-plumbing-companies/
- https://www.marketingcode.com/industry-shift-pe-288-platforms-servicetitan-74-percent-ai-exit-multiple-jun-2026/
- https://ctacquisitions.com/plumbing-pe-rollup-tracker-2026/
- https://ctacquisitions.com/roll-up-strategy-guide-2026/
- https://ctacquisitions.com/guides/private-equity-hvac-2026/
- https://en.wikipedia.org/wiki/ServiceTitan
- https://www.sharewillow.com/blog/hvac-commission-pay
- https://www.fieldpulse.com/resources/blog/sales-commission
- https://www.servicetitan.com/blog/hvac-sales-commission
- https://teambuyin.com/blog/hvac-commissions-structure-technicians
- https://www.everstage.com/sales-commission/hvac-sales-commission-structure
- https://pipelineon.com/blog/hvac-spiff-program/
- https://pipelineon.com/blog/technician-pay-structure/
- https://www.servicetitan.com/blog/field-service-metrics
- https://www.tradesly.ai/blog/revenue-per-technician-benchmarks-guide
- https://www.servicetitan.com/blog/webinar-recap-2025-fall-benchmark-report
- https://sacra-pdfs.s3.us-east-2.amazonaws.com/servicetitan.pdf
- https://fieldedge.com/blog/technician-utilization-benchmarks/
- https://oxmaint.com/industries/hvac/hvac-contractor-first-time-fix-ai-diagnostics-case-study
- https://www.fieldpromax.com/blog/how-to-improve-first-time-fix-rate
- https://fieldservicesoftware.io/glossary/first-time-fix-rate-ftfr/
- https://smartserviceops.com/field-service-kpi-first-time-fix-rate/
- https://www.ibm.com/think/topics/first-time-fix-rate
- https://www.acca.org/financialsurvey
- https://contractorincharge.com/blog/average-profit-margins-for-hvac-and-plumbing-companies
- https://www.phccweb.org/news/acca-and-phcc-poised-to-pursue-strategic-collaboration/
- https://hvacprofitmath.com/benchmarks.html
- https://hvac-blog.acca.org/acca-and-phcc-launch-strategic-collaboration-to-strengthen-the-contracting-industry/
- https://www.cbh.com/insights/case-studies/defining-kpis-for-hvac-plumbing-company-case-study/
- https://concerttech.com/wp-content/uploads/2021/03/Aberdeen-Group-RR-First-Time-Field.pdf
- https://www.concerttech.com/wp-content/uploads/2021/05/Aberdeen_Fixing_First_Time_Fix_2013.pdf
- https://fieldpoint.net/first-time-fix-rates/
- https://zentrades.pro/field-service-management/first-time-fix-rate
- https://www.pctonline.com/article/pct0115-business-benchmarking-report/
- https://www.npmapestworld.org/your-business/latest-news/npma-and-pco-bookkeepers-release-comprehensive-2025-pest-control-industry-cost-study/
- https://www.pestpac.com/blog/pest-control-industry-standards
- https://www.landscapemanagement.net/nalp-opens-participation-for-its-2026-financial-benchmark-survey/
- https://www.landscapemanagement.net/participation-opens-for-2025-nalp-financial-benchmark-survey/
- https://www.landscapeprofessionals.org/LP/LP/Media/landscape-industry-statistics.aspx
- https://levelcfo.com/benchmarks/landscaping/
- https://www.levelcfo.com/downloads/level-landscaping-benchmarks-2026.pdf
- https://help.servicetitan.com/how-to/technician-close-rate-job
- https://www.textclint.com/blog/home-service-kpis-complete-metrics-playbook
- https://www.getjobber.com/academy/housecall-pro-competitors/
- https://www.servicetitan.com/comparison/servicetitan-vs-housecall-pro
- https://www.fieldpulse.com/resources/blog/servicetitan-vs-housecall-pro
- https://fieldservicesoftware.io/comparisons/housecall-pro-vs-jobber-vs-servicetitan/
- https://profitabilitypartners.io/comparing-home-services-software/
- https://heavyvehicleinspection.com/blog/post/gps-telematics-integration-with-samsara-geotab-verizon-connect
- https://fleetrabbit.com/blogs/post/telematics-integration-hub
- https://ustechautomations.com/resources/blog/samsara-vs-verizon-connect-for-service-fleet-tracking-2026
- https://avahr.com/hvac-hiring-statistics/
- https://www.servicetitan.com/blog/hvac-technician-shortage
- https://exoserva.com/blog/technician-shortage-index-2026
- https://hirealigned.com/learn/hvac-technician-shortage-statistics
- https://buildops.com/resources/hvac-estimating-excel-spreadsheet
- https://mepacademy.com/product/hvac_plumbing-estimating-spreadsheet/
- https://fieldservicesoftware.io/glossary/windshield-time/
- https://www.energymagazine.com.au/boosting-technician-productivity-the-hidden-cost-of-windshield-time/
- https://www.repair-crm.com/2026/09/20/how-to-reduce-tech-windshield-time-for-small-shops/
- https://www.enterpryze.com/post/field-service-scheduling-software-how-mid-market-service-companies-cut-windshield-time-and-missed
- https://www.kickcharge.com/blog/hvac-lead-generation-how-much-is-a-lead-worth/
- https://builtrightdigital.com/plumbing-lead-generation-cost/
- https://www.contractormag.com/management/best-practices/article/55395612/mastering-lead-cost-benchmarks-for-plumbing-hvac-success
- https://99calls.com/learn/customer-acquisition-cost-for-contractors
- https://pipelineon.com/blog/hvac-customer-acquisition-cost/
- https://www.servicetitan.com/blog/hvac-profit-margins
- https://coachelliemarshall.com/blog/hvac-callbacks-maintenance-plan-profit-leak
- https://www.shiftflow.app/blog/plumbing-hvac-callback-warranty-hours
- https://fieldedge.com/blog/the-real-cost-per-service-call/
- https://www.ventory.io/blog-posts/field-services-inventory-gap-first-time-fix
- https://smartserviceops.com/parts-fill-rate-kpi/
- https://www.fieldpulse.com/resources/blog/business-operations-manager
- https://100hires.com/hvac-service-manager-job-description.html
- https://www.fieldinsight.com/blog/hvac-dispatching-guide/
- https://contractorplus.app/blog/hvac-service-manager
- https://hvacprosales.com/hvac-career/hvac-dispatcher-and-service-coordinator-career-guide/
- https://www.fieldpromax.com/blog/how-to-handle-seasonal-demand-in-the-hvac-industry
- https://www.servicetitan.com/blog/hvac-slow-season
- https://www.bdrco.com/blog/hvac-maintenance-scheduling/
- https://hvacknowitall.com/blog/service-agreements-are-shoulder-season-insurance-how-to-build-recurring-revenue-before-the-phone-stops-ringing
- https://www.samsara.com/blog/peak-season-for-hvac
- https://www.crewhu.com/blog/net-promoter-score-benchmarks
- https://hvac-blog.acca.org/power-net-promoter-score-home-performance-contractors/
- https://www.dispatchtrack.com/blog/nps-plumbing-hvac/
- https://oxmaint.com/industries/hvac/hvac-service-dispatch-response-time-standards-explained
- https://www.achrnews.com/articles/127487-racing-the-clock-contractors-and-the-appointment-window
- https://paulbunyanplumbing.com/blog/average-response-time-for-emergency-plumbing-services/
- https://www.hardinsair.com/how-quickly-can-an-emergency-hvac-technician-arrive-near-me/
- https://ustechautomations.com/resources/blog/automate-emergency-dispatch-plumbing-hvac-home-services-2026
- https://www.geotab.com/blog/routing-decisions-cost-more-than-fuel/
- https://fieldcode.com/en/field-service-daily/how-to-optimize-field-technician-routing
- https://www.fieldpie.com/blog/technician-travel-time-optimization/
- https://www.gsquaredcfo.com/financial-services-private-equity
- https://www.bluemargin.com/industries/private-equity/
- https://profitabilitypartners.io/home-services-private-equity-guide/
- https://ctacquisitions.com/how-pe-roll-ups-unlock-value-in-home-services/
- https://www.hedgethink.com/the-capital-stack-behind-home-services-pe-roll-ups/
- https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm
- https://www.withorbital.com/data/hvac-industry-statistics/
- https://relayfi.com/blog/hvac-profit-margins/
- https://profitabilitypartners.io/hvac-profit-margins/
