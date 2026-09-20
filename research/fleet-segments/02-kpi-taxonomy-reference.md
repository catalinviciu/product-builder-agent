# US Fleet Performance Measurement — Cross-Industry Reference Layer

**Purpose:** Canonical KPI taxonomy, authoritative benchmark sources, published benchmark values, and standards/definitions layer for US fleet-operating businesses. This is background for per-vertical deep dives; treat definitions and sourcing as load-bearing.

**Date of research:** September 2026. Confidence flags: 🟢 = primary/authoritative source (association, government agency, standards body, or named research report). 🟡 = credible secondary/trade press citing a primary source. 🔴 = low-confidence — only found on SEO/vendor-blog content with no traceable primary source; treat as directional, not citable.

---

## 1. THE CANONICAL FLEET KPI TAXONOMY

### 1.1 Cost

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| Total Cost of Ownership (TCO) | Sum of acquisition cost (net of residual), fuel/energy, maintenance & repair, insurance, financing, licensing/taxes, and overhead, over the asset's life or a standard period | $ (total or per-unit-time) | Annual / per lifecycle | Fleet manager, Finance | Buy vs. lease, spec selection, replacement timing |
| Cost Per Mile (CPM) | Total operating cost ÷ total miles driven (often split into fixed CPM and variable/marginal CPM) | $/mile | Monthly/Quarterly | Fleet manager, Finance | Pricing, route profitability, budget variance |
| Cost Per Hour | Total operating cost ÷ engine or operating hours (used for vocational/equipment-hour assets, e.g., construction, utility bucket trucks) | $/hour | Monthly | Fleet/Ops manager | Equipment vs. rental decisions, job costing |
| Cost Per Unit Delivered / Stop / Job | Total delivery or service cost ÷ stops, units, or jobs completed | $/stop, $/unit, $/job | Weekly/Monthly | Ops, Finance | Route density optimization, customer profitability |
| Fixed vs. Variable Cost Split | Fixed = depreciation/lease, insurance, licensing (independent of use); Variable = fuel, maintenance, tires (scales with use). ATRI publishes this split explicitly. | % of total, $/mile each | Annual (ATRI); ongoing internally | Finance, CFO | Break-even analysis, utilization-based pricing |
| Depreciation | Acquisition cost minus salvage/residual value, allocated over useful life (straight-line most common in fleet) | $/year or $/mile | Monthly/Annual | Finance | Replacement timing, resale strategy |
| Lifecycle / Replacement Cost | Point at which marginal cost of keeping an asset (rising M&R) exceeds marginal cost of replacing it (depreciation + financing of new asset) — modeled via optimal replacement cycle analysis (e.g., Mercury Associates' ORCA tool) | $/mile or $/year crossover point | Annual review | Fleet manager, Finance | Vehicle replacement/disposal scheduling |
| Cost Per Engine Hour | Maintenance + fuel + depreciation allocated to hour-metered equipment ÷ engine hours | $/engine hour | Monthly | Fleet/Ops manager | Off-road/vocational equipment lifecycle decisions |

**Sourcing note:** ATRI's *Operational Costs of Trucking* is the dominant authoritative source for the fixed/variable CPM split and marginal cost per mile in trucking; TCO/CPM benchmark blog content (Fleetio, easitrack) for non-trucking verticals (construction, utility, service) is 🟡/🔴 — vendor-published, methodology not independently disclosed.

### 1.2 Asset & Utilization

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| Utilization Rate | Actual usage (miles, hours, or days in active service) ÷ available capacity | % | Monthly | Fleet manager | Right-sizing, redeployment |
| Idle vs. Active Time | Engine-on-not-moving time ÷ total engine-on time (telematics-derived) | % | Daily/Weekly | Ops, fleet manager | Fuel waste reduction, driver coaching |
| Asset Dwell Time | Time an asset sits unused/unassigned (at a yard, depot, or job site) | Hours/days | Weekly | Ops | Yard management, asset redistribution |
| Vehicle-to-Driver Ratio | Number of vehicles ÷ number of drivers assigned | Ratio | Quarterly | Fleet manager, HR | Spare ratio planning, hiring pace |
| Right-Sizing / Underutilized Asset Count | Count (or %) of assets below a utilization threshold (e.g., <60% of benchmark miles/hours) | Count, % | Quarterly/Annual | Fleet manager, Finance | Fleet downsizing, reallocation |
| Seasonal Peak Utilization | Peak-period utilization vs. baseline utilization | % variance | Seasonal/Annual | Fleet manager, Ops | Rental/spare strategy, seasonal fleet flexing |
| Equipment-Hours Billed vs. Owned | Billable hours ÷ total available (owned) hours | % | Monthly | Ops, Finance | Fleet size justification, billing/chargeback rates |

**Sourcing note:** These are standard fleet-management-consulting concepts (Mercury Associates, APWA committee materials) 🟡 rather than metrics with one universally cited numeric benchmark; benchmark values vary heavily by vertical (see Section 3).

### 1.3 Maintenance

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| PM Compliance % | PMs completed on/within schedule ÷ PMs due | % | Monthly | Maintenance/fleet manager | Downtime prevention, warranty/compliance risk |
| Scheduled vs. Unscheduled Maintenance Ratio | $ or hours of scheduled (planned) repair work ÷ unscheduled (breakdown) work | Ratio or % | Monthly | Maintenance manager | Shop planning maturity, budget predictability |
| Mean Time Between Failures (MTBF) | Total operating time ÷ number of failures | Hours or miles | Quarterly | Maintenance manager | Reliability engineering, spec/vendor selection |
| Mean Time To Repair (MTTR) | Total repair time ÷ number of repairs | Hours | Monthly | Shop/maintenance manager | Shop staffing, parts stocking |
| Vehicle Uptime / Availability % | (Total time − downtime) ÷ total time | % | Monthly | Fleet/maintenance manager | SLA commitments, spare ratio |
| Downtime Cost Per Day | Lost revenue + rental replacement + labor idle cost per day a unit is down | $/day | Per incident, rolled up monthly | Finance, Ops | Justifying preventive investment |
| Roadside Breakdown Rate | Roadside/road-call incidents ÷ total miles (often per 1,000 or 1M miles) or per vehicle per year | Incidents per 1M miles or per vehicle-year | Monthly/Annual | Maintenance manager, Safety | PM program tuning, vendor/spec accountability |
| Parts Inventory Turns | Cost of parts used (annual) ÷ average parts inventory value | Turns/year | Quarterly | Parts/shop manager | Inventory investment, stockout risk |
| Technician Wrench Time | Time technicians spend on actual repair/turning wrenches ÷ total paid shop time | % | Monthly | Shop manager | Shop productivity, staffing/scheduling |
| Comebacks / Rework Rate | Repairs requiring a repeat visit for the same issue within a defined window (e.g., 30 days) ÷ total repairs | % | Monthly | Shop manager, Quality | Technician training, QC process |

**Definitional note — competing definitions:** "Wrench time" benchmarks vary sharply by source cluster: general industrial-maintenance literature cites an industry average of 25–35% with best-in-class at 45–55%, while several fleet-specific blog sources claim fleet best-in-class wrench time of 85–90%. These two ranges are **not reconcilable from public sourcing** — likely reflecting different denominators (paid shop time vs. scheduled work time) — and neither is traceable to a named primary study. **Flag: 🔴 low confidence on the specific numeric benchmark; the industrial-maintenance range (25–55%) is more broadly corroborated in general reliability literature.**

### 1.4 Fuel & Energy

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| MPG / Fuel Economy | Miles driven ÷ gallons consumed | MPG | Monthly | Fleet manager | Spec'ing, driver behavior, replacement |
| Fuel Cost Per Mile | Total fuel spend ÷ total miles | $/mile | Monthly | Finance, fleet manager | Pricing, route/spec decisions |
| Idle % and Idle Fuel Cost | Idle time ÷ total engine-on time; gallons burned at idle × price/gallon | % ; $ | Monthly | Fleet manager, Ops | Idle-reduction policy, APU investment |
| Fuel Card Exception/Fraud Rate | Flagged transactions (odd location, volume exceeding tank size, off-hours) ÷ total transactions | % | Monthly | Finance, fleet manager | Card program controls |
| **EV: kWh/Mile** | Energy consumed ÷ miles driven | kWh/mile | Monthly | Fleet manager | Route/vehicle-class suitability for electrification |
| **EV: Cost Per kWh** | Blended cost of electricity (depot off-peak + public DCFC) | $/kWh | Monthly | Finance, fleet manager | Charging strategy (depot vs. public mix) |
| **EV: Charging Uptime** | Time charging infrastructure is operational ÷ total time | % | Monthly | Fleet manager, Facilities | Infrastructure investment, backup charging plans |
| **EV: State-of-Charge at Dispatch** | Battery % at the moment of vehicle dispatch | % | Daily | Dispatch, fleet manager | Route assignment, range risk management |
| **EV: Range-Anxiety / Failed-Charge Events** | Count of trips aborted, delayed, or requiring emergency charging due to insufficient range/charge | Count/period | Monthly | Fleet manager | Route redesign, charger placement |
| **EV: Depot vs. Public Charging Mix** | % of total charging sessions/kWh delivered at depot vs. public stations | % | Monthly | Fleet manager, Finance | Infrastructure build-out prioritization |

**Sourcing note:** EV kWh/mile and cost-per-kWh figures found (Section 3) are aggregated from multiple vendor/consumer-finance blog sources rather than a single fleet-specific authoritative benchmark study — 🔴/🟡. NACFE's Run on Less studies (🟢) are the most rigorous public source for real-world Class 8 fuel/energy comparisons across powertrains.

### 1.5 Safety & Risk

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| DOT Recordable Accident Rate | (Number of DOT-recordable accidents × 1,000,000) ÷ miles driven in trailing 12 months. A "recordable" accident (49 CFR 390.5) involves a fatality, injury requiring immediate medical treatment away from the scene, or a vehicle towed from the scene with disabling damage — **regardless of fault/preventability**. | Accidents per million miles (MVMT) | Monthly/Annual | Safety manager | FMCSA safety rating, insurance underwriting |
| Preventable Accidents Per Million Miles (PAMM) | Same numerator logic but numerator is limited to accidents the carrier's own review process (or National Safety Council standard) deems *preventable* by the driver | Accidents per million miles | Monthly/Annual | Safety manager | Driver coaching, safety program ROI |
| Harsh Event Rate | Harsh braking + harsh acceleration + harsh cornering events ÷ miles or hours driven (telematics-derived) | Events per 1,000 miles/hours | Weekly/Monthly | Safety manager | Driver coaching, insurance discounts |
| Speeding Events | Count of events over posted limit (or over a threshold, e.g., 5/10/15 mph over) ÷ miles driven | Events per 1,000 miles | Weekly | Safety manager | Coaching, governor settings |
| Seatbelt Compliance | % of trips/miles with seatbelt engaged (in-cab camera/telematics) | % | Monthly | Safety manager | Coaching, liability reduction |
| CSA BASIC Scores | FMCSA percentile ranking across 7 (pre-2026)/renamed "compliance categories" (2026 SMS overhaul) — see Section 4 | Percentile (0–100) | Continuously updated (FMCSA); reviewed monthly by carriers | Safety/compliance manager | Intervention avoidance, insurance/broker qualification |
| DVIR / Inspection Out-of-Service (OOS) Rate | Vehicles placed OOS at roadside inspection ÷ total inspections | % | Monthly/Annual (national avg published by FMCSA) | Safety/maintenance manager | Vehicle maintenance BASIC score, PM tuning |
| Insurance Loss Ratio | Incurred losses + loss adjustment expense ÷ earned premium | % / ratio | Annual (policy period) | Risk manager, CFO | Renewal pricing, retention/self-insurance decisions |
| Claims Cost Per Vehicle Per Year | Total claims paid ÷ number of vehicles | $/vehicle/year | Annual | Risk manager, Finance | Budgeting, safety program investment case |
| Driver Safety Score | Composite index (telematics events + violations + accidents), vendor-specific weighting (e.g., Samsara Safety Score, Motive Safety Score) | Index (0–100 or letter grade) | Continuous/Monthly | Safety manager | Driver coaching, incentive pay, hiring |
| Camera/ADAS Event Rate | AI-flagged distraction, following-distance, or collision-warning events ÷ miles or hours | Events per 1,000 miles | Weekly | Safety manager | Coaching prioritization |
| Workers' Comp Incidence Rate | (Number of OSHA-recordable injuries × 200,000) ÷ total hours worked (OSHA standard formula) | Rate per 100 FTEs | Annual (BLS/OSHA reporting) | Safety manager, HR | Insurance premium, program investment |

**Definitional note:** The "DOT recordable accident rate" and "preventable accidents per million miles" are frequently conflated in vendor content, but they differ materially: DOT-recordable status is fault-agnostic (any qualifying accident counts), while "preventable" status requires an internal or NSC-standard review determining driver fault. **FMCSA's own safety-audit failure thresholds (49 CFR Part 385 Appendix A) use the fault-agnostic recordable rate**: >1.5 per million miles (non-urban carriers) or >1.7 per million miles (urban carriers) over 12 months triggers a failing safety-audit factor. This FMCSA threshold is the single most authoritative, citable numeric safety benchmark in the entire taxonomy. 🟢

### 1.6 Compliance

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| HOS Violations | Count of Hours-of-Service rule violations (e.g., driving beyond 11/14-hour limits) ÷ total driver logs or per driver per period | Count, or % of logs | Weekly/Monthly | Safety/compliance manager | Driver discipline, dispatch scheduling |
| ELD Compliance | % of required vehicles/drivers with a certified, functioning Electronic Logging Device per FMCSA ELD mandate (49 CFR 395) | % | Continuous | Compliance manager | Regulatory audit readiness |
| IFTA Reporting Accuracy | Reported miles/fuel by jurisdiction reconciled against telematics/fuel-card data; discrepancy rate | % variance | Quarterly (IFTA filing cadence) | Finance/compliance manager | Audit risk, tax liability accuracy |
| DOT Audit Readiness | Composite self-assessment against FMCSA safety audit checklist (driver files, vehicle files, HOS, drug/alcohol program) | Pass/fail checklist, % complete | Ongoing/Annual mock audit | Compliance manager | Avoiding conditional/unsatisfactory rating |
| License / Medical Card Expiry Tracking | % of drivers with current CDL and DOT medical certificate on file, tracked against expiration | % current | Continuous | Compliance/HR | Driver eligibility, insurance validity |
| IRP / Registration Compliance | % of fleet with current International Registration Plan apportioned plates and state registration | % | Annual (IRP renewal cycle) | Compliance manager | Legal operation across jurisdictions |

### 1.7 Service / Productivity

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| On-Time Delivery/Arrival % | Deliveries/arrivals within agreed window ÷ total deliveries | % | Daily/Weekly | Ops manager | Customer SLA management, dispatch tuning |
| First-Time Fix Rate (FTFR) | Repairs resolved without a repeat visit for the same issue ÷ total repair visits | % | Monthly | Maintenance manager | Technician training, parts availability |
| Jobs/Stops Per Truck Per Day | Total stops or jobs completed ÷ number of trucks in service | Count/truck/day | Daily/Weekly | Ops manager | Route density, staffing levels |
| Route Adherence (Plan vs. Actual) | Actual route/stops followed vs. planned route | % adherence | Daily | Ops/dispatch | Route planning tool ROI, driver compliance |
| Windshield Time vs. Wrench Time | Driving/non-productive time vs. value-added time (distinct usage in service-fleet context vs. maintenance-shop "wrench time" above) | % split | Weekly | Ops manager | Scheduling efficiency, territory design |
| Miles Per Stop | Total miles ÷ total stops | Miles/stop | Weekly | Ops manager | Route density optimization |
| SLA Attainment | Service commitments met ÷ total service commitments | % | Monthly | Ops manager, Account management | Contract renewal risk, penalty exposure |
| Dispatch-to-Arrival Time | Time from job assignment to technician/driver arrival on-site | Minutes/hours | Daily | Ops/dispatch | Staffing, geographic coverage planning |
| Revenue Per Vehicle | Total revenue attributable ÷ number of vehicles | $/vehicle/period | Monthly/Annual | Finance, Ops | Fleet-size/right-sizing decisions |
| Revenue Per Mile | Total revenue ÷ total miles driven | $/mile | Monthly | Finance | Pricing, lane/route profitability |

### 1.8 Workforce

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| Driver/Technician Turnover Rate | Separations during period ÷ average headcount during period, annualized | % (often annualized from quarterly) | Quarterly (ATA benchmark) / Annual | HR, Fleet manager | Hiring pipeline sizing, pay/benefit strategy |
| Cost Per Hire | Total recruiting cost (advertising, referral bonus, agency fees, onboarding) ÷ number of hires | $/hire | Quarterly/Annual | HR | Recruiting channel ROI |
| Driver Retention (inverse of turnover) | 1 − turnover rate, often tracked at 90-day / 1-year / 2-year milestones | % retained | Quarterly | HR, Fleet manager | Onboarding program investment |
| Overtime % | Overtime hours ÷ total hours worked | % | Weekly/Monthly | Ops, Finance | Staffing level adequacy, labor cost control |
| Time-to-Productivity | Days/weeks from hire to reaching standard productivity benchmark (routes/jobs at target pace) | Days/weeks | Per cohort | Ops, HR | Training program design |
| Labor Cost Per Job | Fully-loaded labor cost ÷ jobs completed | $/job | Monthly | Finance, Ops | Pricing, staffing model |

**Sourcing note:** ATA's quarterly Trucking Activity Report (via the "Truckload Carrier Driver Turnover" series, reported through trade press such as *Logistics Management*/*Transport Topics*) is the dominant authoritative recurring source for large vs. small truckload and LTL turnover, segmented by carrier revenue size (>$30M vs. smaller). 🟢 for methodology and cadence; specific historical point-values found in secondary reporting are 🟡 unless traced to the original ATA release.

### 1.9 Sustainability

| Metric | Formula / Definition | Unit | Cadence | Owner | Decision Driven |
|---|---|---|---|---|---|
| CO2e Per Mile / Per Ton-Mile | GHG Protocol Scope 1 mobile-combustion emissions (fuel volume × emission factor) ÷ miles or ton-miles | kg CO2e/mile or g CO2e/ton-mile | Annual (with monthly tracking) | Sustainability lead, Fleet manager | Fleet electrification prioritization, ESG reporting |
| SmartWay Metrics | EPA SmartWay Transport Partnership tool outputs: fleet-average CO2, NOx, and PM emissions per ton-mile, benchmarked against the SmartWay carrier database | g/ton-mile (CO2, NOx, PM) | Annual (SmartWay reporting cycle) | Sustainability lead, Compliance | Shipper scorecards, SmartWay partner status |
| EV Share of Fleet | Number of BEV/PHEV/FCEV units ÷ total fleet units | % | Quarterly/Annual | Fleet manager, Sustainability | Electrification roadmap pacing |
| Fleet Electrification Targets (progress) | Actual EV share vs. stated target (e.g., corporate net-zero commitment milestones) | % of target achieved | Annual | Sustainability lead, CFO | Capital planning, regulatory (e.g., CARB ACF) compliance |

---

## 2. AUTHORITATIVE BENCHMARK SOURCES

| Source | What it publishes | Cadence | Free / Paid | Confidence |
|---|---|---|---|---|
| **NPTC (National Private Truck Council) Benchmarking Survey Report** | 120+ page report covering safety, finance, operations, equipment, maintenance, HR, and technology metrics for private (captive) fleets. Sponsored by Penske Truck Leasing (5th consecutive year as of 2025). | Annual (released ~August; the "2026 Report" covers 2025 operations) | Paid / members-only (NPTC members) | 🟢 |
| **ATRI (American Transportation Research Institute) — "An Analysis of the Operational Costs of Trucking"** | The single most-cited per-mile cost benchmark in US trucking: total cost per mile broken into driver wages/benefits, fuel, truck/trailer lease-purchase, repair & maintenance, insurance, permits/licenses, tires, tolls; marginal (non-fuel) cost per mile; regional cost breakdowns. | Annual (update published mid-year, e.g., July 2025 report covering 2024 data; July 2026 report covering 2025 data) | Free summary; full report often free via ATRI/trucking.org | 🟢 |
| **NAFA Fleet Management Association** | CAFM (Certified Automotive Fleet Manager) and CAFS certifications — a competency map (asset management, maintenance, fuel management, financial management, risk management, and more) of what fleet managers are formally trained to measure; also administers the "100 Best Fleets in the Americas" awards program. | Certification ongoing; awards annual | Certification fee-based; awards application free | 🟢 |
| **AFLA (Automotive Fleet & Leasing Association)** | Corporate fleet professional education/conference forum; less a numeric-benchmark publisher, more a peer-network and best-practices body. | Ongoing (conferences, education) | Membership | 🟡 |
| **APWA (American Public Works Association) — Public Works Benchmarks: Fleet** | Public-sector fleet benchmarking; ran a pilot benchmarking survey (2022, ~150 agencies) covering operational and resource-utilization metrics for public works fleets. Fleet Management Committee is the standing body. | Periodic (pilot in 2022; committee-driven cadence, not confirmed annual) | Membership/resource-dependent | 🟡 |
| **"100 Best Fleets in the Americas"** | Awards/benchmark program (public and commercial categories) recognizing top-performing fleet operations across North, Central, and South America; now administered by NAFA (founded by Tom Johnson, run 2000–2022 independently). Publishes case studies of practices from winning fleets rather than a standardized numeric benchmark dataset. | Annual | Free to apply; case studies often free | 🟡 |
| **Utilimarc** | Fleet data-analytics vendor; publishes benchmarking reports/blog series (e.g., vehicle-model-specific benchmarking such as Toyota Prius performance) and powers AssetWorks' benchmarking tool. No single flagship annual public "State of Fleet" report was confirmed in this research — content is more ad hoc/vehicle-specific. | Ad hoc | Free (blog); paid (platform/benchmarking tool) | 🟡 (vendor content; some 🔴 for specific numeric claims not otherwise corroborated) |
| **Mercury Associates** | Independent fleet-management consulting firm; publishes methodology and tools (e.g., ORCA — Optimal Replacement Cycle Analysis) for lifecycle costing and benchmarking, primarily for government/corporate fleet clients; benchmarks are typically client-specific/consulting deliverables rather than public numeric reports. | Ongoing (client engagements) | Paid (consulting) | 🟡 |
| **ARI / Element Fleet Management / Holman / Enterprise Fleet Management** | Large fleet management companies (FMCs) publish quarterly/periodic trend reports (e.g., Element's "Fleet Management Trends" Q3/Q4 2025 reports covering economics, fuel, and remarketing) and sustainability reports, drawing on their own managed-fleet data. Not standardized public benchmark tables; more qualitative trend commentary. | Quarterly (Element); ad hoc (others) | Free (public blog reports) | 🟡 |
| **ATA (American Trucking Associations)** | Publishes *American Trucking Trends* (annual industry statistical compendium) and the quarterly Truckload Carrier driver-turnover data (segmented by large vs. small truckload and LTL) via its Trucking Activity Report / Report series. | Annual (Trends); Quarterly (turnover) | Paid (full reports); summary data often reported free via trade press | 🟢 |
| **TMC (Technology & Maintenance Council) of ATA** | Custodian of VMRS (Vehicle Maintenance Reporting Standards, since 1970) and publisher of 400+ Recommended Practices (RPs) covering maintenance and engineering standards, via a two-volume RP Manual. | RP Manual updated ~annually (e.g., "2024–2025 Recommended Practices Manual") | Paid (membership/manual purchase) | 🟢 |
| **FMCSA — CSA/SMS** | Publishes the Safety Measurement System methodology, BASIC/compliance-category percentiles, safety-audit evaluation criteria (49 CFR Part 385 Appendix A), and roadside-inspection/OOS statistics. 2026 brought a major SMS overhaul: violation codes consolidated from 950+ into ~116 groups, a simplified 2-tier (Standard/Critical) severity weighting, a new "Vehicle Maintenance: Driver Observed" category, and a 12-month full-reset rule for violation-free categories. | Continuous (SMS scores updated monthly); methodology changes are periodic, most recently 2026 | Free (public, at ai.fmcsa.dot.gov / csa.fmcsa.dot.gov) | 🟢 |
| **Verizon Connect — Fleet Technology Trends Report** | Annual survey-based report (2026 edition = 6th year, ~900 fleet professionals) covering technology adoption (GPS tracking, video telematics, AI), cost-saving outcomes, and fleet manager priorities. | Annual | Free | 🟢 (as a survey; findings are self-reported, not audited operational data) |
| **Geotab** | Telematics/data vendor; publishes fleet-data-driven blog content and benchmarking comparisons; no single standardized annual "State of Fleet" numeric report was confirmed distinct from competitor-comparison content in this research. | Ad hoc | Free (blog) | 🟡 |
| **Samsara** | Telematics/IoT vendor; publishes fleet-safety and product benchmarking content; G2 ranks Samsara #1 in Fleet Management category through 2025 into Spring 2026. Company blog covers customer outcome stats (self-reported) rather than an independent industry benchmark study. | Ongoing | Free (blog) | 🟡 |
| **Motive** | ELD/telematics vendor; publishes fleet-safety glossary/KPI content; not confirmed to publish a flagship annual benchmark report distinct from marketing content. | Ad hoc | Free (blog) | 🟡/🔴 |
| **Descartes** | Logistics/supply-chain software vendor; publishes market surveys (e.g., on last-mile delivery, global logistics trends) — not independently verified in this research pass as a fleet-KPI-benchmark-specific publisher. | Periodic | Free (some reports) | 🟡 (not deeply verified this pass) |
| **DAT Freight & Analytics** | Freight-rate and market-transaction data (spot/contract rates for dry van, reefer, flatbed); DAT iQ Benchmark product compares a shipper/carrier's network against ~$80B of annual transportation spend data. Primarily a *rate/market* benchmark, not an operational-KPI benchmark. | Continuous (daily load-board data); periodic reports | Paid (core product); some free trend reports | 🟢 |
| **FTR Transportation Intelligence** | Publishes the Trucking Conditions Index (TCI), a composite index of the operating environment for carriers (freight, capacity, rates, fuel costs, financing costs). | Monthly | Paid (subscription); summary often reported free via trade press | 🟢 |
| **ACT Research** | Publishes the ACT For-Hire Trucking Index (freight volume/rate survey of carriers, >50 = expansion) and the Freight Database (monthly truckload/LTL/rail/air/port indicators since 2009), plus Class 8 order forecasts. | Monthly | Paid (subscription); summary via trade press | 🟢 |
| **Bureau of Labor Statistics (BLS) — JOLTS** | Job Openings and Labor Turnover Survey; publishes hires, quits, layoffs, and openings by industry (including Transportation, Warehousing & Utilities) — the authoritative government source for cross-industry labor turnover context, though not trucking-specific. | Monthly | Free | 🟢 |
| **NACFE (North American Council for Freight Efficiency)** | Publishes the Fleet Fuel Study (annual, real-world fleet MPG for Class 8) and "Run on Less" real-world demonstration events (e.g., "Run on Less – Messy Middle," Sept 2025: 14 Class 8 trucks/13 fleets across diesel, RNG, BEV, and hydrogen powertrains) — the most rigorous independent public source on real-world truck fuel/energy performance across powertrains. | Annual (Fleet Fuel Study); periodic (Run on Less events) | Free | 🟢 |
| **State/municipal fleet benchmarking consortia** | Individual state and city fleet associations/consortia (e.g., state DOT fleet groups, NCsGA-type government fleet networks) share benchmarking data at conferences (e.g., Government Fleet, NAFA I&E); no single unified national database was confirmed to exist beyond NAFA's 100 Best Fleets and APWA's pilot survey. | Ad hoc / conference-driven | Mixed | 🟡 |

**Bottom line on source hierarchy:** For **cost-per-mile**, ATRI is unambiguously the reference standard. For **safety thresholds**, FMCSA's own regulatory criteria (49 CFR Part 385) are authoritative and legally binding, while CSA/SMS percentiles are the ongoing operational safety benchmark. For **standards/coding**, TMC/VMRS is authoritative. For **private-fleet operational/HR/equipment metrics**, NPTC is the most rigorous available (though gated to members). For **turnover**, ATA's quarterly reporting (trucking-specific) plus BLS JOLTS (cross-industry context) together form the best public picture. Vendor-published "benchmark reports" (Utilimarc, Geotab, Samsara, Motive, Fleetio) should be treated as **directional/marketing-adjacent** unless they cite a named, reproducible methodology — several are 🟡/🔴 in this research.

---

## 3. PUBLISHED BENCHMARK VALUES

| Metric | Value | Segment/Context | Source | Year | Confidence |
|---|---|---|---|---|---|
| Total average cost per mile (Class 8 trucking) | $2.336/mile | Industry-average, all-in operating cost | ATRI, *Operational Costs of Trucking* | 2025 data (2026 report) | 🟢 |
| Total average cost per mile (Class 8 trucking, prior year) | $2.260/mile | Industry-average, all-in operating cost | ATRI | 2024 data (2025 report) | 🟢 |
| Marginal (non-fuel) cost per mile | $1.854/mile (+4.2% YoY) | Industry-average | ATRI | 2025 data | 🟢 |
| Marginal (non-fuel) cost per mile, prior year | $1.779/mile (+3.6% YoY, then a record high) | Industry-average | ATRI | 2024 data | 🟢 |
| Fuel cost per mile | $0.215/mile (+8.6% YoY from $0.198) | Industry-average | ATRI | 2025 data (2026 report) | 🟢 |
| Maintenance & repair (M&R) cost per mile growth | +~9% YoY | Industry-average | ATRI (via FleetMaintenance.com reporting) | 2025 | 🟡 (secondary reporting of ATRI data; directionally reliable) |
| NPTC annual mileage among private fleet respondents | 80,400 miles | Private fleet average | NPTC 2025 Benchmarking Survey | 2025 (reflects prior year ops) | 🟢 |
| Private fleets' share of outbound freight moves | ~70% (down from ~75% prior year); 2026 report ~72% vs. historical 66–67% | Private fleet market share | NPTC Benchmarking Survey | 2025 & 2026 reports | 🟢 |
| PM compliance — leading-fleet target | 95–100% | Cross-industry fleet maintenance | Aggregated trade/vendor benchmark content (heavyvehicleinspection.com, oxmaint, maintainly) | 2026 | 🔴 (no single named primary study; consistent across multiple vendor sources but methodology undisclosed) |
| PM compliance — "good" tier | 85–94% | Cross-industry | Same as above | 2026 | 🔴 |
| Vehicle uptime — industry standard/target | ~95% | Well-managed commercial fleets | Aggregated vendor benchmark content | 2026 | 🔴 |
| Vehicle uptime — OTR/long-haul top performers | >96% | Long-haul trucking | Vendor benchmark content | 2026 | 🔴 |
| Vehicle uptime — OTR/long-haul industry average | ~91% | Long-haul trucking | Vendor benchmark content | 2026 | 🔴 |
| Idle time — typical average | ~20–25% of operating time | Commercial fleets, general | Vendor benchmark aggregation | 2026 | 🔴 |
| Idle time — "good ops" benchmark | ~5–20% (best-in-class as low as 5%) | Commercial fleets | Vendor benchmark aggregation | 2026 | 🔴 |
| Idle fuel burn rate | ~0.8–1.5 gallons/hour | Heavy-duty diesel at idle | Vendor aggregation (physically well-grounded figure) | 2026 | 🟡 |
| Class 8 fleet-wide average MPG | 7.77 MPG (fleet-wide average, best-in-class 10+ MPG on long-haul routes) | Class 8, real-world | NACFE 2024 Fleet Fuel Study | 2024 (most recent verified) | 🟢 |
| Class 8 real-world MPG — best performer in live event | 11.5 MPG (diesel) | Long-haul, single demonstration truck | NACFE Run on Less – Messy Middle | Sept 2025 | 🟢 |
| Class 8 BEV sleeper — single-day range achieved | ~900 miles in one day (Windrose BEV) | Long-haul BEV demonstration | NACFE Run on Less – Messy Middle | Sept 2025 | 🟢 |
| Class 8 duty-cycle MPG range (sleeper tractor, dry van, interstate) | 7.5–9 MPG | Long-haul | Vendor aggregation (heavyvehicleinspection.com) | 2026 | 🔴 |
| Class 8 duty-cycle MPG range (regional day-cab) | 5.5–7 MPG | Regional | Same | 2026 | 🔴 |
| Class 8 duty-cycle MPG range (vocational dump/mixer) | 3.5–5.5 MPG | Vocational | Same | 2026 | 🔴 |
| DOT safety-audit failing threshold — accident rate | >1.5 per million miles (non-urban carriers); >1.7 per million miles (urban carriers), trailing 12 months | Regulatory threshold | FMCSA, 49 CFR Part 385, Appendix A | Current (long-standing regulation, still in force 2026) | 🟢 |
| CSA BASIC categories (pre-2026 structure) | 7 categories: Unsafe Driving, HOS/Fatigued Driving, Driver Fitness, Controlled Substances/Alcohol, Vehicle Maintenance, Cargo-Related, Crash Indicator | Regulatory | FMCSA | Pre-2026 (in force through 2025) | 🟢 |
| SMS violation-code consolidation (2026 overhaul) | ~950+ violation codes consolidated into ~116 violation groups; severity simplified to a 2-tier (Standard=1, Critical/OOS/Disqualifying=2) weighting; new "Vehicle Maintenance: Driver Observed" category added; 12-month full percentile reset for violation-free categories | Regulatory methodology change | FMCSA SMS overhaul (via trade/legal press coverage) | 2026 | 🟡 (overhaul confirmed by multiple independent trade/legal sources; exact code-consolidation figures not yet cross-checked against an FMCSA primary-source document in this pass) |
| Truckload driver turnover — large carriers (>$30M revenue) | ~90–92% annualized | Large truckload carriers | ATA (via trade press: Logistics Management, Transport Topics) | Recent quarters through 2025–2026 | 🟢 (ATA methodology); 🟡 (specific point-in-time % via secondary reporting) |
| Truckload driver turnover — smaller carriers | ~72–85% annualized | Small truckload carriers | ATA (via trade press) | Recent quarters through 2025–2026 | 🟡 |
| LTL driver turnover | ~11–15% annualized | LTL carriers | ATA (via trade press) | Recent quarters through 2025–2026 | 🟡 |
| Drivers actively looking for a new job | 58.1% (up from 46.8% same period prior year) | Truck driver workforce | Spring 2026 Truck Driver Survey (cited by bizpacreview.com/trade press) | Spring 2026 | 🟡 (survey exists; original publisher not directly verified in this pass) |
| Cost to replace one driver | ~$8,234–$20,729 | Truckload carriers | Aggregated trade source | 2026 | 🟡 |
| Warehouse worker turnover | ~36% | Warehouse workforce (broader logistics, not driver-specific) | Industry workforce research (via secondary aggregation) | 2025–2026 | 🔴 (no primary BLS figure found matching this exact number; treat as directional) |
| Commercial auto insurance combined ratio | 107.2 | US commercial auto line, industry-wide (underwriting loss) | Insurance industry reporting (2024, 14th consecutive unprofitable year) | 2024 | 🟡 |
| Average nuclear verdict against a trucking company | $27.5 million (average, June 2020–April 2023 window) | Trucking litigation | Insurance/legal industry reporting | 2020–2023 window | 🟡 |
| Fleet insurance cost per vehicle/year | ~$10,200 (small fleets, 2–5 vehicles); ~$6,600–$18,000+ range by fleet size/state | US commercial fleet insurance | Truckwriters.com aggregation | 2026 | 🔴 (vendor/blog aggregation, not a named insurer or NAIC-level primary source) |
| On-time delivery — industry-standard threshold | 95–98% | Logistics/3PL | Aggregated vendor/logistics benchmark content | 2026 | 🔴 |
| On-time delivery — best-in-class | 99.5–99.8% | 3PL / best-in-class carriers | Aggregated vendor content | 2026 | 🔴 |
| First-time fix rate — standard/target | ≥80% (world-class 85–90%) | Fleet/equipment maintenance | Aggregated vendor content (tractian.com, oxmaint) | 2026 | 🔴 |
| EV commercial delivery van energy use | ~0.34 kWh/mile | Light commercial EV van | Aggregated vendor/consumer-finance content | 2026 | 🔴 |
| EV Class 6–7 truck energy use | ~2.1 kWh/mile | Medium-duty EV truck | Aggregated vendor content | 2026 | 🔴 |
| EV fleet off-peak/depot electricity rate | ~$0.04–$0.08/kWh (utility EV fleet rate schedules) | Depot charging | Aggregated vendor content | 2026 | 🔴 |
| EV public/daytime charging rate | ~$0.18–$0.30/kWh | Public/DCFC charging | Aggregated vendor content | 2026 | 🔴 |
| New DCFC ports added in US | 16,700 (16% YoY increase) | US public charging infrastructure | Aggregated vendor content citing industry forecast | 2025 | 🟡 |
| Verizon Connect: cost-savings from telematics/AI adoption | 11–19% average decrease in fuel, accident, labor, and maintenance expenses | Cross-industry fleet respondents | Verizon Connect 2026 Fleet Technology Trends Report | 2026 | 🟢 (as a self-reported survey finding) |
| Verizon Connect: GPS fleet tracking adoption | 80% of fleet professionals (up 11 points YoY) | Cross-industry fleet respondents | Verizon Connect 2026 report | 2026 | 🟢 |
| Verizon Connect: video telematics adoption | 46% adoption; 74% of users report improved driver safety | Cross-industry fleet respondents | Verizon Connect 2026 report | 2026 | 🟢 |

**Reading the confidence pattern:** Note that virtually every "textbook" operational KPI benchmark that appears repeatedly across SEO/vendor-blog content — PM compliance %, uptime %, idle %, first-time fix rate, on-time delivery %, EV kWh/mile, fleet insurance cost/vehicle — could **not** be traced to a single named, methodologically transparent primary study in this research pass, despite being extremely consistent in stated values across many sites (a sign of mutual citation/rehashing rather than independent measurement). Treat these as **industry lore with reasonable directional validity**, not citable statistics, until corroborated against a gated primary source (NPTC, APWA member data, an FMC's proprietary book of business, or a vendor's disclosed underlying dataset size/methodology). By contrast, ATRI, FMCSA, ATA, NACFE, and BLS-sourced figures are traceable, dated, and citable.

---

## 4. STANDARDS & DEFINITIONS LAYER

| Standard/Body | What it defines | Relevance to FMS vendors |
|---|---|---|
| **VMRS (Vehicle Maintenance Reporting Standards)** | A hierarchical coding system (since 1970) for classifying vehicle systems, components, failure modes, labor, and parts — a "universal language" across fleets, OEMs, suppliers, and software systems. Custodianship: ATA's Technology & Maintenance Council (TMC). | FMS/maintenance-software vendors must support VMRS coding for maintenance records to be portable and comparable across fleets, OEMs, and parts suppliers; it underlies most fleet maintenance analytics and cost-per-repair-category benchmarking. |
| **ATA TMC Recommended Practices (RPs)** | 400+ published RPs (starting with RP 101 in 1973) covering maintenance and engineering practices (e.g., component mounting, PM intervals, specs), published in a two-volume RP Manual (e.g., "2024–2025 Recommended Practices Manual"). | Sets de facto engineering/maintenance-process standards that inform PM schedule design, inspection procedures, and spec'ing — a key input to what "compliant" maintenance looks like. |
| **FMCSA CSA / SMS (Safety Measurement System)** | Regulatory safety-scoring methodology. Pre-2026: 7 BASICs (Unsafe Driving, Hours-of-Service/Fatigued Driving, Driver Fitness, Controlled Substances/Alcohol, Vehicle Maintenance, Cargo-Related, Crash Indicator). 2026 overhaul: violation codes consolidated (~950+ → ~116 groups), renamed "compliance categories," 2-tier severity weighting (Standard=1, Critical=2), new "Vehicle Maintenance: Driver Observed" category, shortened data window with heavier recency weighting, and a 12-month full percentile reset for violation-free categories. Also defines the fault-agnostic "recordable accident" safety-audit failure threshold (>1.5/>1.7 per million miles) under 49 CFR Part 385, Appendix A. | Any FMS/safety-analytics vendor selling into trucking/carrier customers must map its internal safety scoring to FMCSA's compliance categories and accident-rate definitions to be relevant for insurance, broker-qualification, and audit-readiness use cases. |
| **IFTA (International Fuel Tax Agreement)** | Interstate/interprovincial cooperative agreement (lower 48 US states + Canadian provinces) requiring a single fuel-tax license and quarterly reporting of miles traveled and fuel purchased by jurisdiction, for power units >26,000 lbs GVW or 3+ axles. | FMS/ELD vendors must produce IFTA-ready mileage-by-jurisdiction and fuel-purchase reports; this is one of the most common compliance-report features requested by trucking customers. |
| **SAE J1939** | Heavy-duty vehicle (26,001+ lbs — trucks, buses, refuse, farm/construction equipment) CAN-bus communication standard; diagnostic fault codes structured as SPN (Suspect Parameter Number, identifying the component/subsystem) + FMI (Failure Mode Identifier, identifying the failure type), transmitted via the J1939-73 diagnostic message (DM1). | The dominant heavy-duty engine/vehicle-data standard that telematics and FMS platforms must decode to deliver real-time fault alerts and predictive-maintenance triggers. |
| **SAE J1708 / J1587** | Legacy heavy-duty vehicle serial communications standard, largely superseded by J1939 but still present in older vehicle populations. | FMS/telematics hardware often needs dual J1708/J1939 support for mixed-age fleets. |
| **OBD-II** | Federally mandated (since Jan 1, 1996) onboard diagnostics standard for light- and medium-duty vehicles (6,000–26,000 lbs); generates standardized DTCs. | Relevant for FMS vendors serving light/medium-duty fleets (last-mile delivery vans, service vehicles) — a different diagnostic protocol from J1939 heavy-duty trucks, so cross-fleet FMS platforms must support both. |
| **DTC (Diagnostic Trouble Code) handling** | SAE-originated fault-code framework generated by a vehicle's onboard diagnostic system (OBD-II or J1939-based), read and interpreted by telematics devices to trigger real-time alerts. | Core to predictive/prescriptive maintenance features in modern FMS platforms; code-to-severity-to-action mapping is a differentiator among telematics vendors. |
| **NAFA CAFM Body of Knowledge** | Certification competency framework (Certified Automotive Fleet Manager) spanning asset management, maintenance, fuel management, financial management, risk management, and related domains — effectively a map of what a professionally trained US fleet manager is expected to measure and know. Governance moved to an independent CAFM Commission (est. 2025) to oversee the CAFM/CAFS credentials. | Useful as a checklist for FMS feature completeness — if the product doesn't support a CAFM competency area (e.g., risk management reporting, lifecycle financial analysis), it's missing a domain a "professionally certified" buyer will expect. |
| **GHG Protocol — Scope 1 (Mobile Combustion) and Scope 3, Category 3 (Fuel- and Energy-Related Activities)** | Scope 1 covers direct emissions from company-owned/controlled fossil-fuel vehicles (mobile combustion, one of four Scope 1 categories alongside stationary combustion, fugitive emissions, and process emissions). Scope 3 Category 3 covers upstream well-to-tank emissions from fuel production/transport not captured in Scope 1. | FMS/sustainability-reporting features must calculate Scope 1 mobile-combustion emissions (fuel volume × EPA/GHG Protocol emission factors) per vehicle/fleet, and increasingly Scope 3 Category 3 for full lifecycle carbon accounting — required for ESG disclosures and shipper/customer sustainability scorecards (see also EPA SmartWay below). |
| **EPA SmartWay** | Voluntary EPA partnership/reporting tool benchmarking a fleet's fuel/emissions efficiency (CO2, NOx, PM per ton-mile) against a national carrier database; SmartWay Partner status is often a shipper-selection criterion. | FMS vendors serving freight/logistics customers benefit from SmartWay-aligned emissions reporting to support customers' shipper-scorecard and partner-status requirements. |
| **Telematics data standards (general)** | No single unifying US telematics data standard exists across vendors; interoperability instead relies on J1939/J1708/OBD-II at the vehicle-data layer, ELD data-transfer standards (49 CFR 395 Subpart B, for FMCSA-compliant ELDs), and vendor-specific/aggregator APIs (e.g., Geotab SDK, Samsara API) at the platform layer. | FMS platform architects should design for multi-protocol vehicle-data ingestion (J1939 + OBD-II + ELD data files) and expect to integrate via vendor APIs rather than a single universal telematics data standard. |

---

## SOURCE LIST (full URLs)

**NPTC / Private Fleet Benchmarking**
- https://www.nptc.org/benchmarking/benchmarking-report/
- https://www.nptc.org/benchmarking/benchmarking-survey/
- https://www.nptc.org/benchmarking/benchmarking-report-archive/
- https://www.pensketruckleasing.com/resources/blog/nptc-benchmarking-survey-private-fleets-strengthen-control-over-outbound-and-inbound-freight/
- https://www.fleetowner.com/research/article/55136759/national-private-truck-council-benchmarking-survey-reveals-fleet-growth-and-increased-efficiency
- https://www.truckinginfo.com/news/why-private-fleets-are-taking-more-freight

**ATRI — Operational Costs of Trucking**
- https://truckingresearch.org/about-atri/atri-research/operational-costs-of-trucking/
- https://truckingresearch.org/2025/07/new-atri-report-shows-trucking-profitability-severly-squeezed-by-high-costs-low-rates/
- https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/
- https://www.fleetowner.com/operations/article/55392569/atri-report-breaks-down-class-8-truck-operating-costs-by-region-and-expense-category
- https://www.fleetmaintenance.com/shop-operations/data-and-telematics/article/55396219/american-transportation-research-institute-atri-trucking-costs-rise-as-fleets-face-higher-maintenance-and-replacement-expenses
- https://www.ortrucking.org/2025/07/02/atris-latest-operational-costs-of-trucking-analysis/
- https://trid.trb.org/View/2570650

**NAFA / CAFM / 100 Best Fleets**
- https://www.nafa.org/certification/
- https://fleetcertification.org/comprehensive-guide-to-the-cafm-certification-exam-process/
- https://cardata.co/glossary/certified-automotive-fleet-manager-cafm
- https://www.prnewswire.com/news-releases/nafa-appoints-commission-for-its-certified-automotive-fleet-manager-cafm-certification-301631222.html
- https://www.nafa.org/awards/the-100-best-fleets/
- https://www.fleetowner.com/show-coverage/nafa-institute-expo/article/55371303/nafa-2026-100-best-fleets-recipients
- https://www.fleetmanagementweekly.com/nafa-opens-applications-for-the-2026-100-best-fleets-in-the-americas/

**AFLA / APWA**
- https://www.afla.org/
- https://www.afla.org/page/About
- https://www.apwa.org/resource/public-works-benchmarks-fleet/
- https://www.apwa.org/group/fleet-management/
- https://www.apwa.org/education-careers/focus-on-public-works/focus-on-fleet/
- https://www.government-fleet.com/10215673/industry-associations-the-heartbeat-of-fleet-management

**Utilimarc / Mercury Associates / ARI / Element**
- https://www.utilimarc.com/blog/fleet-benchmarking-report-toyota-prius
- https://www.government-fleet.com/news/assetworks-launches-fleet-benchmarking-tool-powered-by-utilimarc
- https://www.government-fleet.com/news/utility-service-trucks-analyzed-in-benchmarking-study
- https://mercury-assoc.com/
- https://mercury-assoc.com/services/fleet-analytics-tools/
- https://mercury-assoc.com/resources/tools/
- https://www.elementfleet.com/insights-and-resources/insights/blogs/fleet-management-trends-q4-2025-report
- https://www.elementfleet.com/insights-and-resources/blogs/fleet-industry-trends-report-q3-2025
- https://www.elementfleet.com/about/news/element-demonstrates-progress-on-climate-strategy-and-enhanced-transparency-in-latest-sustainability-report

**ATA / TMC / VMRS**
- https://www.trucking.org/news-insights/ata-american-trucking-trends-2025
- https://www.logisticsmgmt.com/article/ata_reports_q3_gains_in_truckload_driver_turnover
- https://www.logisticsmgmt.com/article/ata_reports_driver_turnover_rates_head_up_for_third_straight_quarter
- https://www.logisticsmgmt.com/article/ata_data_highlights_steep_q2_truckload_driver_turnover
- https://www.dcvelocity.com/articles/50092-truck-driver-turnover-held-steady-in-fourth-quarter-ata-says
- https://www.bizpacreview.com/2026/09/18/truckers-dont-stick-around-for-long-with-employers-heres-why-1659604/
- https://tmc.trucking.org/VMRS-Overview
- https://tmc.trucking.org/TMC-Recommended-Practices
- https://tmc.trucking.org/sites/default/files/VMRS_INTRO.pdf
- https://www.atabusinesssolutions.com/Shopping/Product/viewproduct/11277684/ATA's-TMC-2024-2025-Recommended-Practices-Manual

**FMCSA CSA/SMS**
- https://heavyvehicleinspection.com/blog/post/csa-score-guide
- https://buscmms.com/blog/fmcsa-safety-rating-overhaul-2026-csa-scoring-bus-fleets
- https://carrierowl.com/blog/basic-scores-fmcsa
- https://truckcaselawyer.com/csa-system-sms-scoring-2026/
- https://idispatchhub.com/fmcsas-new-sms-scoring-system-is-live-how-the-2026-safety-measurement-overhaul-changes-your-compliance-score-out-of-service-risk-and-what-every-carrier-must-do-before-their-percentile-spikes/
- https://fleetcollect.net/blog/csa-scores-explained-fmcsa-safety-measurement
- https://workplacecomplianceinsights.com/articles/fmcsa-sms-scoring-overhaul-2026-motor-carrier-compliance-guide/
- https://gomotive.com/glossary/fleet-safety/behavior-analysis-and-safety-improvement-categories/
- https://www.foleyservices.com/articles/csa-7-basic-categories/
- https://blog.blueinktech.com/blog/what-are-the-7-csa-basics
- https://www.law.cornell.edu/cfr/text/49/appendix-A_to_part_385
- https://www.callahan-law.com/what-is-a-dot-recordable-accident/
- https://trucksafe.com/post/what-is-a-dot-recordable-accident

**Verizon Connect / Geotab / Samsara / Motive**
- https://www.worktruckonline.com/10256017/verizon-connect-2026-fleet-technology-trends-report-shows-ai-moving-from-buzzwor
- https://www.verizon.com/about/news/2026-verizon-connect-fleet-technology-trends-report
- https://www.verizonconnect.com/resources/article/2026-fleet-technology-trends/
- https://www.verizonconnect.com/resources/ebook/fleet-technology-trends-report/
- https://www.dcvelocity.com/transportation/trucking/verizon-connect-trucking-fleets-make-ai-a-core-business-tool
- https://www.samsara.com/blog/samsara-g2-winter-2026
- https://www.samsara.com/guides/fleet-faq/who-is-better-samsara-or-geotab-for-fleet-management
- https://www.samsara.com/ca/guides/dtc-codes

**DAT / FTR / ACT Research**
- https://www.dat.com/benchmark-analytics
- https://www.dat.com/resources/freight-focus-report
- https://www.dat.com/solutions/act-research-freight-forecast
- https://www.actresearch.net/resources/blog/freight-volume
- https://www.actresearch.net/reports-data/databases
- https://www.usbank.com/about-us-bank/news-and-stories/article-library/us-bank-dat-freight-analytics-launch-joint-freight-rates-research.html
- https://en.wikipedia.org/wiki/DAT_Solutions

**BLS / JOLTS**
- https://www.bls.gov/jlt/
- https://www.bls.gov/news.release/jolts.htm
- https://www.bls.gov/news.release/archives/jolts_09032025.htm
- https://www.bls.gov/news.release/archives/jolts_03132026.pdf
- https://www.bls.gov/news.release/jolts.a.htm

**NACFE**
- https://nacfe.org/research/affs/
- https://nacfe.org/news/nacfe-releases-latest-fleet-fuel-study/
- https://nacfe.org/news/nacfe-releases-initial-findings-from-run-on-less-messy-middle-2/
- https://www.fleetowner.com/emissions-efficiency/article/55133653/decarbonizing-long-haul-trucking-nacfes-2025-run-on-less-explores-messy-middle-solutions
- https://www.fleetmaintenance.com/equipment/emissions-and-efficiency/article/55366656/fleets-are-finding-a-path-through-decarbonization-nacfe-says
- https://runonless.com/news/
- https://www.cleantrucking.com/white-papers/article/15770845/run-on-less-2025-shows-truckings-tech-challenges

**Standards: VMRS, SAE J1939/J1708/OBD-II, IFTA, GHG Protocol, SmartWay**
- https://www.csselectronics.com/pages/j1939-73-dm1-diagnostic-message-dtc
- https://www.noregon.com/guide-to-sae-j1939/
- https://fleetrabbit.com/blogs/post/j1939-j1708-heavy-truck-diagnostics
- https://www.calamp.com/blog/dtc-codes/
- https://en.wikipedia.org/wiki/International_Fuel_Tax_Agreement
- https://gomotive.com/glossary/fleet-compliance/international-fuel-tax-agreement/
- https://www.geotab.com/blog/what-is-ifta/
- https://ghgprotocol.org/sites/default/files/2022-12/Chapter3.pdf
- https://www.epa.gov/sites/default/files/2020-12/documents/mobileemissions.pdf
- https://sawatchlabs.com/industry-insights/scope-1-2-3-emissions-decoding-fleet-ghg

**Aggregated/vendor-blog benchmark content (🔴/🟡 — used for directional values only, flagged inline above)**
- https://www.fleetio.com/blog/2025-fleet-cost-per-mile-total-cost-ownership-construction
- https://www.fleetio.com/blog/cost-per-mile-total-cost-ownership-trucking-logistics
- https://www.fleetio.com/blog/cost-per-mile-total-cost-ownership-service-providers
- https://www.fleetio.com/blog/fleet-cost-per-mile-total-cost-ownership-utilities
- https://easitrack.com/blog-2025-fleet-cost-benchmarks.html
- https://heavyvehicleinspection.com/blog/post/fleet-maintenance-cost-per-mile
- https://heavyvehicleinspection.com/blog/post/heavy-vehicle-preventive-maintenance-program-guide
- https://heavyvehicleinspection.com/blog/post/fleet-maintenance-kpis
- https://heavyvehicleinspection.com/fleet-management/uptime/logistics-uptime-benchmark
- https://heavyvehicleinspection.com/blog/post/fuel-efficiency-benchmarks-vehicle-class-2026
- https://heavyvehicleinspection.com/blog/post/idle-time-fuel-cost-reduce-fleet-mpg
- https://heavyvehicleinspection.com/blog/post/truck-driver-retention-guide
- https://oxmaint.com/industries/fleet-management/top-10-fleet-management-kpis-2026
- https://oxmaint.com/industries/fleet-management/fleet-benchmarking-top-performers-cost-uptime-safety-metrics
- https://oxmaint.com/industries/fleet-management/fleet-idle-time-fuel-waste-reduction-guide-2026
- https://maintainly.com/articles/fleet-maintenance-kpis-metrics-guide
- https://opsima.com/blog/kpis/fleet-management-kpis/
- https://reliamag.com/guides/wrench-time-benchmarks-typical-good-and-world-class-rates/
- https://tractian.com/en/glossary/first-time-fix-rate
- https://tractian.com/en/glossary/wrench-time
- https://cigotracker.com/glossary/what-is-the-industry-benchmark-for-on-time-delivery-and-why-it-matters/
- https://recharged.com/articles/ev-cost-per-mile
- https://recharged.com/articles/cost-per-mile-ev-vs-gas
- https://fleetrabbit.com/article/ev-fleet-total-cost-ownership-year
- https://fleetrabbit.com/blogs/post/ev-vs-diesel-fleet-cost-comparison
- https://truckwriters.com/blog/average-cost-fleet-insurance-rate/
- https://www.truckwriters.com/blog/fleet-insurance-rates/
