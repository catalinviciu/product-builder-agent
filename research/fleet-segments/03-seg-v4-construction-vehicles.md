# Construction — Vehicle Fleet (US) — How the Segment Measures Performance

**Scope**: pickups, service trucks, crew vans, dump trucks, mixers, water trucks and other on-road powered units used by US construction firms. Sub-models covered: general contractors (GC), heavy civil/infrastructure, specialty trade contractors (electrical, mechanical, concrete), and residential builders. Off-road heavy equipment (excavators, loaders, cranes) is covered by a parallel researcher; it appears here only where it connects to vehicles through job costing, mixed-fleet operations, or shared systems.

**Confidence key**: 🟢 primary (official source, read directly or via a study's own numbers reported by a secondary outlet) · 🟡 secondary (vendor/trade-press synthesis, plausible and internally consistent but not a primary dataset) · 🔴 unverified industry lore (circulates across vendor blogs with no traceable primary study).

**Method note**: WebFetch was unavailable in this environment; all evidence below comes from WebSearch result snippets, one level removed from the underlying pages. Numbers are cited with the outlet that reported them, not confirmed by reading the primary document directly — treat 🟢 labels here as "a primary-source number as relayed by a snippet," not as a verified direct read.

---

## 0. The Central Analytical Point

Construction does not measure its fleet for its own sake. It measures the fleet because every vehicle-hour and equipment-hour is an input cost that must land against a **job, phase, and cost code**, or the project's reported margin is wrong. The governing question in this segment is never "how healthy is my fleet" in isolation — it is **"what did this job actually cost, and are we making money on it?"** Fleet metrics (utilization, uptime, cost per hour) matter only insofar as they feed job costing and protect margin. This reframes almost every metric a generic fleet-management vendor would propose: utilization isn't a fleet KPI here, it's a job-cost input; downtime isn't a maintenance KPI, it's a crew-idle-cost problem; even DOT compliance is a risk-to-project-schedule issue, not just a safety checkbox.

The mechanism that converts fleet cost into job cost is the **internal equipment charge rate** (also called the internal rental rate, charge-out rate, or equipment cost-recovery rate). It is where fleet management and finance literally meet on the same ledger line, and it is the segment's defining structural feature — nothing else in this project's other fleet segments has an equivalent internal transfer-pricing mechanism sitting between the asset and the P&L.

---

## 1. The Operating Model

### 1.1 How contractors get paid, and why margin is fragile
- **Hard bid / competitive bid**: owner solicits bids from multiple GCs off completed design documents; lowest qualified bidder wins. Margin is locked in at bid time and can only be protected, not renegotiated, except through change orders. 🟡 (Perlo Construction, downtobid.com, 2024–2026 vendor explainers)
- **Negotiated bid**: a single GC or CM is selected early, often before design is complete, and price is negotiated collaboratively — more common for heavy civil/infrastructure and complex commercial work with an established owner relationship. 🟡
- **Cost-plus (with or without a GMP — guaranteed maximum price)**: owner pays actual costs plus a fee (often 10% overhead + 10% profit, or a combined ~15% per the AIA A201 default when parties don't specify otherwise). Offers flexibility but requires rigorous, defensible cost tracking because the owner can audit actual costs. 🟡 (case.edu contract-change-order guidance; procore.com cost-plus explainer)
- **Change orders** are the primary lever for margin recovery/erosion after a hard bid is signed. A contractor who "bids low and recovers through change orders" is a well-known (if reputationally risky) pattern; disciplined firms treat change-order management as a formal workflow because unpriced or under-priced change work is one of the largest sources of margin erosion. 🟡

### 1.2 The internal equipment charge rate — the fleet/finance interface
This is the single mechanism to understand to understand this segment.

- **What it is**: a standard hourly (sometimes daily/weekly) rate that the equipment/fleet department charges to a job for use of an owned vehicle or piece of equipment, analogous to a rental rate but paid internally, job to equipment-fleet cost center.
- **How it's built** (typical build-up, dual-rate method): Annual Ownership Cost (depreciation, interest/cost of capital, insurance, taxes, storage) ÷ Annual Budgeted Usage Hours = fixed hourly ownership rate; add a variable hourly rate for fuel, maintenance, tires/consumables, and repairs. Sum = the internal charge rate, sometimes benchmarked against or directly sourced from EquipmentWatch's **Rental Rate Blue Book / Cost Recovery** rates. 🟢 (EquipmentWatch, own methodology page, "Annual Ownership Cost ÷ Annual Usage Hours = Equipment Hourly Recovery Rate")
- **Why it matters**: it is literally how a "free" owned asset becomes a real cost on a project's job cost report. Without it, project managers would treat owned vehicles as zero-cost and over-consume them, while the equipment department would have no way to recover its capital and operating costs.
- **The dual-rate approach**: separates a fixed/ownership rate (recovers capital cost regardless of use) from a variable/operating rate (recovers fuel, wear, repairs — scales with hours). This is considered a best practice over a single blended rate because a blended rate misprices both very-high-use and very-low-use assets. 🟡 (Construction Equipment magazine "How to Recover Equipment Costs"; ForConstructionPros "A Formula for Rental Equipment Cost Recovery")
- **Set-and-drift problem**: rates are typically set **once a year** (often at budget time) and then held fixed for 12 months for planning stability — but actual fuel prices, parts costs, and utilization drift throughout the year, so the rate silently diverges from true cost. This is one of the report's Section 6 breakdowns.
- **Where the fight happens**: "Jobs see themselves as accountable for the internal equipment charges and frequently have little commitment to the true cost of the equipment. They do everything they can to reduce charges to the lowest level possible within the scope of company policy." Job margins — and PM bonuses — are calculated net of these charges, so PMs are structurally incentivized to dispute or minimize them, while the equipment manager is structurally incentivized to hold rates at true-cost-recovery levels. Best-practice firms centralize rate-setting (a corporate VP of equipment) precisely to take this fight out of field hands. 🟡 (constructionequipment.com "The Case for a Regionalized Fleet"; boomandbucket.com "A Fleet Manager's Guide to Building an Internal Rate Structure")

### 1.3 Own vs. rent vs. lease
- Rule-of-thumb breakeven bands circulate widely but are inconsistent across sources — treat exact day-counts as directional, not authoritative:
  - "Fewer than 150–180 days/year favors rental; above 200 favors ownership" 🔴
  - "Renting is cheaper below ~50 days/year; buying makes sense above ~150 days/year" 🔴
  - "Rent when utilization is below 60–70%, own above ~65%" 🔴
  - All these appear in vendor blogs (Cleveland Brothers, ToolGrit, ForConstructionPros, BuildWitt) with no shared primary study; they cluster around the same intuition (utilization drives the decision) but the specific thresholds are **UNVERIFIED INDUSTRY LORE** and vary 3x depending on the source.
- What is more solidly supported: US equipment-rental penetration has been rising — the rental penetration rate hit **57% in 2024**, its fourth consecutive annual increase, and the US construction/general-tool rental market was projected to grow **5.2% in 2025 to $87.5B** (EquipmentWatch/ARA-linked reporting) or, per a separate ARA Q1 2025 forecast, **3.9% to $80.9B**. 🟡 (equipmentworld.com citing EquipmentWatch; rermag.com citing ARA — the two dollar figures disagree by ~$7B, indicating different scope/methodology, so treat both as directional)
- Strategic pattern repeatedly cited: a **hybrid fleet** — own the core, high-utilization assets (pickups, service trucks, workhorse equipment) and rent for peaks, specialty needs, and short-duration jobs — is the dominant recommended posture. 🟡

### 1.4 Mobilization
- Mobilization cost/time scales enormously with project type: a residential remodel may mobilize in 1–2 days; a large commercial project may need 2–4 weeks. 🟡 (Projul, Procore mobilization guides)
- Commercial mobilization cost ranges cited: small commercial (retail/office) **$21,000–$52,000**; large commercial (mall/high-rise) **$52,000–$153,000**. 🔴 (single vendor blog figure, no primary source identified — treat as illustrative only)
- Heavy-equipment transport for mobilization (lowboy + operator) runs roughly **$500–$2,000 per load** depending on distance. 🔴 (same class of vendor sourcing)
- Mobilization/demobilization time and cost is itself a job-cost line item and a place margin leaks when standby days (weather, access holds, coordination delays) aren't separately coded and instead get buried in "general conditions."

### 1.5 Crew structure and how vehicles follow crews
- Vehicles (pickups, service trucks, crew vans) are typically assigned to a **crew or superintendent**, not to an individual employee, and move with the crew from phase to phase or job to job. This is the root of the "shared truck" allocation problem in Section 6: a single service truck may touch three jobs in a week, but most job-cost and telematics systems default to a single default job-cost assignment per asset.
- Crew-hour is the basic labor planning unit: crew-hours/day = crew size × hours/day; working days = adjusted labor-hours ÷ crew-hours/day. 🟡 (vdci.edu, toolgrit.com estimating guides)

---

## 2. The Metrics That Actually Drive This Segment

| Metric | Formula | Unit | Cadence | Owner | Benchmark / Source (year) | Confidence |
|---|---|---|---|---|---|---|
| **Internal equipment charge rate (per asset)** | (Annual ownership cost ÷ annual budgeted hours) + variable hourly operating cost | $/hr | Set annually, applied per job transaction | Equipment Manager, with CFO sign-off | Build-up methodology mirrors EquipmentWatch Rental Rate Blue Book / Cost Recovery formula | 🟢 methodology / 🟡 specific values |
| **Cost recovery rate (actual vs. charged)** | Total $ recovered via internal charges ÷ Total actual equipment cost incurred | % | Monthly/quarterly | Equipment Manager + CFO | "You Recovered 71 Cents of Every Overhead Dollar" — illustrative single-firm example, not an industry average | 🟡 |
| **Overhead recovery rate** (adjacent, often confused w/ above) | Overhead $ recovered through billed work ÷ Total actual overhead | % | Monthly | Controller/CFO | Distinct from bid overhead % — "the distance between them is unrecovered overhead that comes straight out of net profit" | 🟡 |
| **Cost per operating hour (equipment/vehicle)** | (Ownership cost + operating cost) ÷ usage hours | $/hr | Monthly, per asset | Equipment Manager | Example cited: backhoe loader ~$100k, 800 hrs/yr → ~$22.81/hr ownership + ~$28.50/hr operating ≈ ~$51/hr before markup; general range **$50–$320/hr** across equipment classes | 🟡 |
| **Equipment/vehicle utilization rate** | Hours used ÷ available hours (or on-rent days ÷ total days, per ARA's Time Utilization definition) | % | Weekly/monthly | Equipment Manager | ARA "Time Utilization" is the standard formula: OEC-weighted fleet-days used ÷ total days. Vendor-cited target bands: 70–85% optimal, <60% underutilized, industry rental-fleet target often cited at ~65% | 🟢 (ARA formula) / 🔴 (specific % bands, no traceable primary study) |
| **Asset availability (uptime when a crew needs it)** | Hours asset was operational and available ÷ hours it was scheduled/needed | % | Daily/weekly, escalates to PM when unmet | Shop Foreman → Equipment Manager | No single authoritative industry-wide benchmark found; treated qualitatively across vendor sources | 🔴 |
| **Job cost variance** | Actual cost − Budgeted cost (also tracked as % complete vs. % of budget spent) | $ and % | Weekly job cost review | Project Manager, reviewed by Controller | Standard construction-accounting practice (job costing / CSI cost codes); no single numeric benchmark, it's a per-job control, not an industry rate | 🟢 (practice is universal) |
| **Cost-code / equipment-hour accuracy** | % of equipment/vehicle hours correctly coded to job + cost code vs. total hours logged | % | Weekly, reconciled before invoicing/WIP | Equipment Manager + PM | "Most contractors recover only a fraction of their true equipment costs" due to hour-coding gaps (Tenna) | 🟡 |
| **Project margin / margin erosion** | (Contract revenue − Total job cost) ÷ Contract revenue; tracked at bid, at WIP updates, and at closeout | % | Weekly/monthly (WIP), final at closeout | Project Manager (owns it), CFO (aggregates) | No universal target; CFMA Benchmarker tracks firm-level gross/net margin by segment (see Section 5) | 🟢 (practice) |
| **Labor productivity / crew-hours (earned vs. actual)** | Earned hours (budgeted hrs for work completed) ÷ Actual hours worked | Ratio / productivity factor | Daily field report, weekly rollup | Superintendent, PM | Field studies commonly cited: workers spend only **30–50%** of paid time on direct productive work, rest lost to waiting, travel, rework, coordination | 🟡 |
| **Windshield/travel time vs. billable time** | Non-productive drive/wait time ÷ total paid time | % | Daily | Superintendent, Equipment/Fleet Manager | Rolled into the 30–50% productive-time figure above; no separately verified benchmark isolating "windshield time" alone | 🔴 |
| **Mobilization cost and time** | Actual mobilization $ and days vs. budgeted (bid) mobilization line item | $ and days | Per job, at kickoff and closeout | PM, Equipment Manager | See Section 1.4 — figures found are single-source vendor illustrations, not verified industry averages | 🔴 |
| **Own vs. rent cost comparison / breakeven utilization** | Total cost of ownership (annualized) vs. total annual rental cost at the same usage level | $/year comparison | Annual fleet planning; per-job at bid | Equipment Manager, CFO | Breakeven day-count thresholds vary 3x across sources (50–200 days cited) — no reconciled primary study found | 🔴 |
| **Rental spend leakage** | (Actual rental spend) − (Rental spend if utilization/return timing were optimal) | $ | Monthly rental audit | Equipment Manager, Procurement | Cited: idle rental equipment can represent **40–50% of engine hours** unmonitored; billing-discrepancy leakage of **3–5% of total rental spend** from missed credits/incorrect fees | 🟡 |
| **Fuel cost per hour / per job** | Fuel $ spent ÷ operating hours (or ÷ job) | $/hr or $/job | Weekly (fuel card reconciliation), monthly rollup | Equipment Manager, Controller | Fuel-factor estimating rule: ~0.04 gal/horsepower-hour × load factor (0.40–0.55 light, 0.55–0.70 medium, 0.70–0.85 heavy); example consumption 5–7 gal/hr (excavator), 3–5 gal/hr (dozer) | 🟡 |
| **Maintenance cost per hour** | Total maintenance/repair $ ÷ operating hours | $/hr | Monthly | Shop Foreman, Equipment Manager | Embedded in the $50–$320/hr all-in cost-per-hour range above; deviation >15% from fuel-consumption benchmark is cited as a maintenance-issue flag | 🟡 |
| **Downtime cost as crew-idle cost** | Idle crew size × fully burdened hourly rate × idle hours (+ standby/rental/penalty costs) | $/incident or $/day | Per incident, rolled into monthly job cost | Equipment Manager escalates; PM absorbs cost | Widely cited range: **$1,000–$4,000/idle machine/day** in lost productivity and standby; single excavator failure idling 4–8 crew at $45–$85/hr → **$1,440–$5,440** in an 8-hr day before repair cost; a 50-unit fleet at ~23 downtime-days/yr → **$1.3M–$2.6M/yr** in idle wages alone | 🔴 (figures repeat across vendor blogs — e.g. FleetRabbit, MapTrack, DozerHub — with no shared primary study; label as unverified lore despite intuitive appeal) |
| **PM (preventive maintenance) compliance rate** | PMs completed on schedule ÷ PMs scheduled | % | Monthly | Shop Foreman, Equipment Manager | Cited targets: 90%+ "world-class," 95%+ for critical/A-class assets (echoing SMRP guidance), <80% flagged as high failure risk; **75–80% cited as an industry average** | 🟡 (SMRP-anchored figures more credible; the "75-80% average" is a widely repeated but unsourced figure) |
| **Theft and shrinkage rate** | $ value of stolen/missing assets ÷ total fleet value, or incident count/year | % or count | Quarterly/annual, insurance renewal | Equipment Manager, Safety Director, Risk/Insurance | NICB/NER: heavy-equipment theft costs **$300M–$1B/year**; **>11,000 incidents/year** (~1,000/month); average single-theft loss **~$30,000**; only **~20–21%** of stolen equipment recovered overall (single-item recovery <7%) | 🟢 (NICB/NER are the recognized primary sources for this figure, though relayed here via secondary summaries) |
| **DOT compliance (on-road fleet only)** | HOS/ELD violations, CDL currency, drug/alcohol testing compliance, roadside inspection out-of-service rate | Count / % | Continuous (ELD), audited quarterly | Safety Director, Fleet/Equipment Manager | ELD required for CMVs ≥10,001 lbs GVWR; violations cost **$500–$5,000 per violation** at roadside inspection, can trigger immediate out-of-service orders. The 10,001–26,000 lb "gray zone" (service trucks, crew-cab utility beds, water tank trucks) is explicitly called out as the most confusing compliance band for construction fleets | 🟡 (regulatory thresholds are 🟢 FMCSA rule; penalty dollar figures are 🟡 secondary) |
| **Safety incident rate / EMR** | Actual losses ÷ Expected losses (NCCI formula), 3-year lookback | Ratio (1.0 = industry average) | Set annually by workers' comp carrier/NCCI, tracked continuously | Safety Director; gates PM/Superintendent bidding eligibility | EMR = 1.0 is industry average; **most successful contractors target 0.70–0.90**; excellent firms reach **0.50–0.75**; **>1.25 severely restricts bid eligibility**; many owners/GCs require subcontractor EMR **≤1.0** (some require ≤0.8) as a prequalification gate | 🟢 (EMR mechanics and the 1.0 baseline are well-established NCCI-based facts) / 🟡 (specific target bands are vendor-repeated but directionally consistent) |
| **Telematics engine hours vs. billed job-cost hours (reconciliation gap)** | Engine hours reported by telematics − hours actually billed/coded to jobs | Hours or % variance | Weekly, before invoicing/WIP close | Equipment Manager, Controller | Framed as a structural disconnect "between what machines do and what financial systems know"; one contractor reconciliation example recovered "thousands in previously unbilled hours" — single anecdote, not a benchmark | 🟡 |

**Note on EMR**: EMR (Experience Modification Rate) deserves separate emphasis because, unlike every other metric above, it is **contractually decisive** — it isn't just an internal KPI, it is a pass/fail gate on which jobs a contractor is even allowed to bid. It is calculated by the contractor's workers' comp carrier / rating bureau (NCCI in most states) from three years of claims history (actual losses vs. expected losses for the firm's size and class code), lags by about a year, and directly sets workers' comp insurance premiums (an EMR of 1.25 means paying 25% more than the class average). Because vehicle-related injuries (driving, backing, loading) are a meaningful share of construction claims, fleet safety practices feed directly into EMR, and EMR feeds directly into bid eligibility — closing the loop between fleet safety metrics and revenue opportunity.

---

## 3. How They Measure — Cadence, Workflow, Systems of Record

### 3.1 Reporting cadence
- **Daily**: field/daily reports and time cards — labor hours, equipment hours, materials delivered, weather/delays — captured by superintendents/foremen, increasingly via mobile apps (Rhumbix, HCSS, Procore, SmartBarrel-type tools) rather than paper.
- **Weekly**: job cost review meetings comparing actual vs. budgeted cost by cost code, including equipment-hour charges; this is where cost variance and "% complete vs. % spent" divergence is caught early (e.g., "40% complete but 60% of budget spent" is the classic red flag). 🟢 (standard, widely described practice)
- **Monthly**: **WIP (work-in-progress) reporting** using percentage-of-completion accounting (ASC 606-aligned) — revenue recognized = % complete × contract value; the WIP report also surfaces over/under-billings and gross profit to date. Most firms run WIP monthly; many run it weekly during peak season. 🟢 (Procore, IECI, industry-standard practice)
- **Project closeout**: post-mortem comparing final actual cost/margin to bid estimate, feeding future bid accuracy and internal rate-setting for the next budget cycle.

### 3.2 Systems of record
- **Construction ERP/accounting**: Viewpoint Vista (Trimble), Sage 300 CRE (formerly Timberline), Foundation Software, CMiC, Procore (project management layer, often paired with one of the above for accounting). CMiC is notable for including equipment management natively in a single database, positioned against Vista's older, more siloed architecture. 🟡
- **Equipment/fleet management**: Tenna, EquipmentShare, HCSS Equipment360, B2W Track/Maintain, Trackunit, Samsara. HCSS and B2W are called out specifically as stronger at **job-costing and mechanic workflows** than pure GPS-tracking vendors (Tenna, Trackunit), which are stronger at **location/utilization visibility**. 🟡
- **Telematics/data standard**: AEMP 2.0 / ISO 15143-3 (formalized 2020, first AEMP spec 2010) — a common JSON/XML schema (position, hours, fuel, machine status) that lets OEM telematics (Cat, Komatsu, etc.) and third-party fleet systems interoperate without a custom connector per brand. This is what, in principle, lets engine hours flow from a mixed-OEM equipment fleet into one common system. 🟢 (ISO standard, described consistently across AEM/ISO/OEM sources)
- **Fuel cards** and **field time-tracking apps** feed cost and hours data into the ERP, but often on separate schedules/systems from telematics, which is a reconciliation break point (Section 6).

### 3.3 How equipment hours are supposed to flow into job cost — and where the chain breaks
Ideal chain: **Telematics captures engine hours per asset → hours are attributed to a job/cost code → hours × internal charge rate = $ charged to the job → job cost report updates → WIP/margin updates.**
Breaks identified in research:
1. Telematics reports **engine hours**, not **job-attributed hours** — the asset doesn't know which job it served without a manual or geofence-based assignment step.
2. Field-reported ("operator-reported") hours are still common where telematics coverage is incomplete (especially for lower-value vehicles, attachments, and older equipment), reintroducing manual error.
3. Reconciliation is often a manual, periodic ("20-minute pass before invoices go out") step rather than a real-time system — meaning the job cost report a PM sees mid-month may already be stale relative to actual usage.

---

## 4. Who Owns Each Number

| Role | Primarily owns | Structural tension |
|---|---|---|
| **Owner/President** | Overall company margin, bid/no-bid strategy, EMR as a strategic bidding asset | Wants growth and bid competitiveness; both depend on the two roles below reconciling their numbers |
| **CFO/Controller** | WIP accuracy, overhead recovery rate, cost-recovery rate (internal charges vs. actual equipment cost), financial statement integrity (feeds CFMA-style ratios) | Needs equipment charges to reflect true cost for the balance sheet to be right — but doesn't control field behavior that drives actual cost |
| **Equipment Manager / Fleet Manager** | Cost per operating hour, utilization, PM compliance, maintenance cost, own-vs-rent decisions, internal charge rate design | **Judged on fleet cost and recovery** — wants rates set at true cost and jobs to accept full charges |
| **Project Manager** | Job cost variance, project margin, change-order capture, crew productivity | **Judged on job margin** — wants equipment charges minimized since they're a direct hit to their P&L line; is "the internal customer of the fleet" |
| **Superintendent** | Daily field reports, crew productivity, day-to-day equipment assignment and windshield/idle time on site | Reports to the PM but interfaces directly with the Equipment Manager/dispatch for asset availability |
| **Shop Foreman** | Asset availability, maintenance execution, PM schedule compliance, downtime/repair turnaround | Owns the physical uptime the Equipment Manager is judged on, but has no visibility into job-level cost consequences of a delay |
| **Safety Director** | EMR, DOT compliance, incident rate, TRIR/DART, near-miss reporting | Owns a number (EMR) that gates bidding eligibility company-wide, but doesn't control day-to-day driving behavior at the crew level |

**The structural tension worth naming explicitly**: the Equipment Manager is compensated/evaluated on fleet-level cost efficiency and recovery, while the Project Manager is compensated/evaluated on job margin — and the **internal charge rate is the exact number both roles are trying to move in opposite directions.** This is not a peripheral detail; it is arguably the single most important organizational fact for a fleet software product to design around in this segment (see final section).

---

## 5. Benchmarks (with source, year, and confidence)

| Benchmark | Value | Source | Year | Confidence |
|---|---|---|---|---|
| Return on Assets, all construction (CFMA survey) | 12.5% | CFMA 2025 Financial Benchmarker (via ENR/CFMA reporting) | 2025 (FY2024 data) | 🟢 |
| Return on Equity, all construction | 32.7% | CFMA 2025 Financial Benchmarker | 2025 | 🟢 |
| Debt-to-equity, all construction | 1.3 | CFMA 2025 Financial Benchmarker | 2025 | 🟢 |
| Residential construction: ROA / ROE / leverage / working capital turnover | 12.1% / 34.0% / 3.1x / 11.3x | CFMA 2025 Financial Benchmarker, residential segment article | 2025 | 🟢 |
| Residential "Best in Class": ROA / ROE | 20.9% / 65.9% | CFMA 2025 Financial Benchmarker | 2025 | 🟢 |
| CFMA Benchmarker sample size | ~10,000 firms surveyed, 1,558 valid responses | CFMA | 2025 | 🟢 |
| EMR industry average | 1.0 (by definition) | NCCI-based methodology, widely reported | ongoing | 🟢 |
| EMR target for competitive bidders | 0.70–0.90 (good), 0.50–0.75 (excellent) | Multiple safety/insurance vendor sources (HCSS, SmartQHSE, CCIG) | 2025–2026 | 🟡 |
| EMR bid-disqualification threshold commonly used by owners/GCs | ≤1.0, sometimes ≤0.8 | Same vendor cluster | 2025–2026 | 🟡 |
| Heavy equipment theft, annual cost | $300M–$1B | NICB / NER | reported 2025 | 🟢 (primary bureau figures, relayed via secondary sources) |
| Heavy equipment theft, incident volume | >11,000/year (~1,000/month) | NICB | reported 2025 | 🟢 |
| Average single equipment theft loss | ~$30,000 | NER | reported 2025 | 🟢 |
| Stolen equipment recovery rate | ~20–21% overall; <7% for single-item thefts | NER/NICB-derived reporting | 2025 | 🟢 |
| US equipment rental penetration rate | 57% (2024), 4th consecutive annual increase | EquipmentWatch-linked reporting | 2025 (reporting on 2024 data) | 🟡 |
| US construction/general-tool rental market size 2025 | $87.5B (+5.2%) per one source; $80.9B (+3.9%) per ARA-linked source | EquipmentWatch vs. ARA reporting — figures disagree | 2025 | 🟡 (two independent estimates diverge ~8%, so treat as a range, not a point estimate) |
| Equipment utilization "optimal" band | 70–85%; <60% = underutilized | Multiple fleet-software vendor blogs (FleetRabbit, Hapn, Zigaflow) | 2026 | 🔴 (repeats across sources with no shared primary study) |
| PM compliance benchmark | 90%+ world class, 95%+ for critical assets, 75–80% "industry average" | SMRP-anchored (90/95%) vs. unsourced "average" claim | 2025–2026 | 🟡 for the SMRP-anchored figures / 🔴 for the "75-80% average" |
| Downtime cost per idle machine per day | $1,000–$4,000 | FleetRabbit, MapTrack, DozerHub (mutually citing vendor cluster) | 2026 | 🔴 |
| Crew idle cost examples ($/hr, $/day) | $340/hr (4-person crew @ $85/hr burdened); $1,136/day (crew @ $142/hr) | Same vendor cluster | 2026 | 🔴 |
| ELD/DOT violation penalty | $500–$5,000 per violation | Fleet compliance vendor guides (HOS247, GeoSavi) | 2026 | 🟡 |
| Own-vs-rent breakeven utilization | Ranges cited from 40% to 70%, and 50 to 200 days/year, depending on source | Cleveland Brothers, ToolGrit, ForConstructionPros, BuildWitt | 2025–2026 | 🔴 |
| Rental billing-discrepancy leakage | 3–5% of total rental spend | Construction Business Owner / BigRentz | 2025–2026 | 🟡 |
| Idle rental equipment as share of engine hours when unmonitored | 40–50% | BigRentz | 2026 | 🔴 |
| Non-productive time share of field labor | Only 30–50% of paid time is direct productive work | CMAA, multiple productivity-study syntheses | 2025–2026 | 🟡 |
| Fuel consumption benchmarks | Excavator 5–7 gal/hr; dozer 3–5 gal/hr; fuel factor ~0.04 gal/hp-hr | Fuel Logic, FieldFix vendor guides | 2026 | 🟡 |
| Equipment cost-per-hour range, all-in | $50–$320/hr depending on class | LatestCost / 100calc vendor calculators | 2026 | 🔴 |
| AGC construction machinery & equipment price index | +4.0% YoY (as of Apr 2026) | AGC of America | 2026 | 🟢 |

---

## 6. Sub-Model Comparison

| Dimension | General Contractor | Heavy Civil / Infrastructure | Specialty Trade (electrical, mechanical, concrete) | Residential Builder |
|---|---|---|---|---|
| Typical contract type | Mix of hard-bid and negotiated, often GC-at-risk or CM | Heavily hard-bid, public-sector procurement rules, often DBE/prevailing-wage requirements | Negotiated with GC, sometimes design-build; margins thinner, volume-driven | Fixed-price or cost-plus with homeowner/developer; for-sale builders also carry site acquisition/financing risk |
| Fleet composition | Broad mix: pickups, service trucks, crew vans; owns less heavy equipment than heavy civil, subs most excavation/earthwork | Largest, most equipment-intensive fleets — dump trucks, water trucks, mixers as core production assets, not just support vehicles; on-road/off-road blend is heaviest here | Narrow, trade-specific: service vans, small pickups, maybe a boom truck (electrical/mechanical); very little heavy equipment ownership | Lean fleets: pickups and small trailers per superintendent/super; equipment is mostly rented or sub-trade-owned |
| Job-cost intensity of vehicles | Moderate — vehicles are support assets, often allocated across concurrent jobs | High — vehicles like dump/water trucks are direct production assets billed per haul/hour, closely tied to cost codes (e.g., earthwork, hauling) | Low-moderate — vehicle cost is a smaller share of job cost than labor/materials, but still tracked per job for crew mobility | Low — vehicle cost is typically absorbed into overhead/G&A rather than charged per job, since crews rotate across many small jobs quickly |
| Mobilization pattern | Moderate; multiple concurrent jobs, moderate mobilization cadence | Highest — large equipment moves between remote/rural sites are a major cost and schedule factor, often separately bid | Low — vans/trucks self-mobilize with the crew, minimal formal mobilization cost | Very low — trucks move between nearby residential lots frequently, informally |
| EMR sensitivity | High — required for GC prequalification on most commercial bids | Very high — public agencies often have strict, published EMR thresholds for infrastructure bids | High for subcontractor prequalification to GCs | Lower formal EMR gating (fewer public-bid requirements), but still affects workers' comp premiums |
| Shared-asset allocation problem | Present, especially for a "job-hopping" service truck fleet | Less acute — assets tend to be dedicated to one large job for its duration | Very acute — a single service van/truck routinely touches 3–5 small jobs in a week | Very acute — superintendents and their trucks rotate across many lots in a subdivision daily |
| Dominant fleet software need | Balanced equipment + vehicle job costing (HCSS/B2W style) | Heavy equipment utilization, PM compliance, hauling/production tracking (mixed with DOT for on-road trucks) | Lightweight time/mileage/job allocation for many small, frequent job assignments | Simple mileage/job allocation, largely for overhead allocation and tax/expense purposes rather than granular job costing |

---

## 7. Where Measurement Breaks Down Today

1. **Shared-asset allocation across multiple jobs in a week.** A pickup or service truck that touches 3+ jobs doesn't map cleanly to the "one asset → one job" assumption baked into most job-cost and telematics-to-ERP integrations. The result is either (a) all hours dumped into whichever job happened to be "active" in the system, misstating multiple jobs' costs, or (b) manual, after-the-fact allocation by percentage estimate — both undermine the accuracy the whole internal-charge-rate mechanism depends on. Sources repeatedly describe this as a visibility gap, not a technology-availability gap: the GPS/telematics data usually exists, but the job-attribution logic on top of it doesn't.
2. **Telematics engine hours vs. billed job-cost hours reconciliation.** Engine hours are a physical fact; billed hours are an accounting fact; nothing in most stacks automatically reconciles the two, so the gap is closed manually (a "20-minute reconciliation pass") or not at all, meaning contractors "recover only a fraction of their true equipment costs." This directly undermines the internal charge-rate mechanism at the center of this segment's economics.
3. **Internal charge rates set once a year and left to drift.** Rates are built from a snapshot of expected fuel, parts, and utilization costs at budget time, then held fixed all year for planning stability. Actual costs move (fuel price swings, unexpected repair costs, utilization above or below the assumed baseline) and the rate silently mispreices jobs — over-recovering on some, under-recovering on others — without anyone re-running the calculation until next year's budget cycle.
4. **Own-vs-rent decisions made without clean utilization history.** Because utilization data is fragmented across telematics (for larger/newer assets), fuel cards, and manual logs (for smaller/older assets), most contractors "overestimate future use" and the own/rent decision is made on incomplete information rather than the actual historical hours a comparable asset logged.
5. **Equipment lost or stolen on jobsites, with a lag before anyone notices.** With an average theft loss of ~$30,000 and only ~20% recovery, and thefts often only surfacing when a crew goes looking for the asset days later, the detection lag itself is a cost driver — the NICB/NER data on under-reporting ("contractors who absorb smaller losses out of pocket to avoid insurance premium increases") suggests the true loss and detection-lag problem is worse than reported figures show.
6. **Small tools and attachments never enter any asset register.** Tools and attachments fall below the value threshold that triggers formal tracking in most fleet/equipment systems, so they live in trucks, gang boxes, and job trailers with no accountability chain. Cited cost: roughly one day of labor per month per jobsite lost simply searching for missing tools — a productivity leak that never appears in "fleet cost" reporting at all because the tools were never fleet assets to begin with.
7. **Mixed fleets split across two disconnected systems of record.** On-road vehicles (subject to DOT/FMCSA compliance — ELD, CDL, drug testing) typically sit in a trucking-compliance system, while off-road equipment sits in a separate maintenance/telematics system (Tenna, B2W, HCSS Equipment360), with no common asset register connecting the two. This means a "fleet" view of the business — which construction firms conceptually treat as one mixed fleet of vehicles + equipment serving the same jobs — doesn't actually exist as a single data source anywhere in the standard stack; a PM or CFO has to manually stitch together two (or more) systems to see total transportation-and-equipment cost on a job.

---

## Source List

- CFMA, [The Data Is in the Details: CFMA's 2025 Financial Benchmarker Results for Residential Construction](https://cfma.org/articles/the-data-is-in-the-details-cfma-s-2-25-financial-benchmarker-results-for-residential-construction) — 2025
- CFMA, [CFMA's 2025 Construction Financial Benchmarker](https://cfma.org/benchmarker) — 2025
- ENR/BNP Media, [Highlights From CFMA's 2025 Financial Benchmarker](https://digital.bnpmedia.com/article/Highlights+From+CFMA%E2%80%99s+2025+Financial+Benchmarker/5046617/853298/article.html) — 2025
- Foundation Software, [Equipment Costing is Key to Better Bidding and Higher Profits](https://www.foundationsoft.com/learn/equipment-job-costing/)
- Construction Equipment magazine, [How to Set an Internal Rate](https://www.constructionequipment.com/topical/executive-institute/article/10748847/how-to-set-an-internal-rate)
- Construction Equipment magazine, [How to Recover Equipment Costs](https://www.constructionequipment.com/executive-institute/article/10754797/how-to-recover-equipment-costs)
- Construction Equipment magazine, [The Case for a Regionalized Fleet](https://www.constructionequipment.com/executive-institute/article/10756493/the-case-for-a-regionalized-fleet)
- Construction Equipment magazine, [Rent or Buy Depends on Utilization](https://www.constructionequipment.com/executive-institute/article/33018956/rent-or-buy-depends-on-utilization)
- Tenna, [How to Estimate Equipment Cost In Construction](https://www.tenna.com/blog/how-to-estimate-equipment-cost-in-construction/)
- Tenna, [How Contractors Reduce Disputes Over Billed Equipment Hours](https://www.tenna.com/blog/how-contractors-reduce-disputes-over-billed-equipment-hours/)
- Tenna, [Transport Costs For Construction Job Costing](https://www.tenna.com/blog/mobilization-transport-costs-for-construction-job-costing/)
- Tenna, [Measure and Improve Construction Equipment Utilization](https://www.tenna.com/blog/measure-and-improve-construction-equipment-utilization/)
- ForConstructionPros, [A Formula for Rental Equipment Cost Recovery](https://www.forconstructionpros.com/profit-matters/article/10303476/gb-financial-services-llc-a-formula-for-rental-equipment-cost-recovery)
- ForConstructionPros, [Calculate Equipment Costs to Assess When to Own vs. Rent](https://www.forconstructionpros.com/business/article/21563423/gb-financial-services-llc-calculate-equipment-costs-to-assess-when-to-own-vs-rent)
- Metal Construction News, [Calculate the Right Equipment Rate](https://www.metalconstructionnews.com/articles/columns/calculate-the-right-equipment-rate/)
- Raken, [What is an Experience Modification Rate (EMR) in Construction?](https://www.rakenapp.com/blog/emr-in-construction)
- HCSS, [What is Experience Modification Rate (EMR) in Construction?](https://www.hcss.com/blog/emr-and-how-it-protects-your-construction-business/)
- Heavy Vehicle Inspection, [Experience Modification Rate](https://heavyvehicleinspection.com/blog/post/experience-modification-rate-construction) and [Heavy Equipment Maintenance KPIs](https://heavyvehicleinspection.com/blog/post/heavy-equipment-maintenance-kpis-contractors-fleet-managers)
- SmartQHSE, [EMR Calculator](https://www.smartqhse.com/emr-calculator)
- CCIG, [Not Winning Construction Bids? It Could be Your E-Mod](https://thinkccig.com/construction-experience-modification-rate/)
- Work Comp Consultant, [EMR Rating for Contractors](https://www.workcompconsultant.com/emr-rating-contractor-construction-bid-contracts/) and [Construction Industry Workers Compensation Claims and Problems Using the EMR as a Safety Indicator](https://www.workcompconsultant.com/blog/posts/construction-industry-workers-compensation-claims-emr-safety-indicator-problems/)
- FleetRabbit, [Construction Equipment Utilization Rate](https://fleetrabbit.com/industry/construction-management-system/construction-equipment-utilization-rate-improve), [Real Cost of Construction Equipment Downtime](https://fleetrabbit.com/industry/construction-management-system/real-cost-construction-equipment-downtime), [Construction Telematics Explained](https://fleetrabbit.com/industry/construction-management-system/construction-telematics-explained-guide), [ELD Compliance](https://fleetrabbit.com/industry/transportation-and-logistics/eld-compliance-transportation-fleets-2026)
- Hapn, [Fleet Utilization Benchmarks 2026](https://gethapn.com/blog/fleet-utilization-benchmarks-2026-is-your-equipment-actually-making-money/)
- TruxNow, [Asset Utilization Ratio and Formula for Construction Equipment](https://www.truxnow.com/blog/inefficient-asset-utilization-costs-construction-companies)
- getSafeAndSound, [Construction Theft Statistics: Complete Guide (2025)](https://getsafeandsound.com/blog/construction-site-theft-statistics/)
- LiveViewGPS, [Construction Equipment Theft Statistics (2026)](https://www.liveviewgps.com/gps-tracking-statistics/construction-equipment-theft/)
- National Equipment Register, [ner.net](https://www.ner.net/)
- Rouse Services, [The Equipment Report January 2025 US Edition](https://rouseservices.com/wp-content/uploads/2025/01/The-Equipment-Report-US-2025-01.pdf) and [Rental Insights](https://www.rouseservices.com/solutions/rental-insights/)
- EquipmentWatch, [Rental Rate Blue Book / Cost Recovery](https://equipmentwatch.com/resource/cost-recovery-2/), [Estimator / Internal Charge Rates](https://equipmentwatch.com/ESTIMATOR/)
- Equipment World, [Equipment Rental Rates Rising, EquipmentWatch Reports](https://www.equipmentworld.com/business/equipment-rental/article/15744905/equipment-rental-rates-rising-equipmentwatch-reports)
- ARM Software, [ARA Rental Market Metrics - KPIs for Equipment Rentals](https://www.armsoftware.com/resources/ara-rental-market-metrics-2/)
- RER Mag, [American Rental Association Projects 5.2-Percent Growth Rate in 2025](https://www.rermag.com/news-analysis/headline-news/article/55275129/american-rental-association-projects-52-percent-growth-rate-in-2025)
- AEM, [ISO/TS 15143-3: ISO Fleet Data Exchange](https://www.aem.org/standards/iso15143/3)
- ISO, [ISO/TS 15143-3:2020](https://www.iso.org/standard/76394.html)
- AutoPI, [AEMP 2.0 Explained: Mixed-Fleet Telematics Standard](https://www.autopi.io/blog/what-is-aemp-telematics-standard/)
- Trackunit, [Everything you should know about ISO 15143-3](https://trackunit.com/articles/benefits-from-iso-15143-4/)
- IECI, [The Complete Guide to Work in Progress (WIP)](https://ieci.org/the-complete-guide-to-work-in-progress-wip/)
- JobTread, [What Is a WIP Report in Construction?](https://www.jobtread.com/blog/what-is-a-wip-report-in-construction)
- Procore, [Work in Progress (WIP) Accounting](https://www.procore.com/library/work-in-progress-accounting) and [Managing Construction Mobilization Costs](https://www.procore.com/library/managing-construction-mobilization-costs) and [What is a Cost-Plus Contract in Construction?](https://www.procore.com/library/cost-plus-contracts) and [6 Types of Construction Projects & Key Differences](https://www.procore.com/library/construction-project-types)
- Beancount, [The Construction WIP Schedule: Percentage-of-Completion Accounting Under ASC 606](https://beancount.io/blog/2026/05/15/construction-work-in-progress-schedule-percentage-of-completion-asc-606-overbillings-underbillings-contractors-bonding-banks-guide)
- Case Western Reserve University Facilities, [Pricing of Construction Contract Change Orders](https://case.edu/facilities/sites/default/files/2024-10/410%20Pricing%20of%20Construction%20Contract%20Change%20Orders.pdf)
- downtobid.com, [Negotiated Bids Construction](https://downtobid.com/blog/negotiated-bids-construction)
- Perlo Construction, [Hard Bid vs. Negotiated Procurement Strategies](https://perlo.biz/hard-bid-vs-negotiated-procurement-strategies/)
- Rhumbix, [Construction Cost Codes: The Complete Guide for Contractors](https://www.rhumbix.com/blog/construction-cost-codes-complete-guide)
- Projul, [Job Costing in Construction: 2026 Guide](https://projul.com/blog/construction-job-costing-complete-guide) and [Construction Mobilization: Jobsite Setup Guide](https://projul.com/blog/construction-mobilization-guide/)
- HOS247, [DOT ELD Requirements](https://hos247.com/resources/eld-mandate/dot-eld-requirements/)
- GeoSavi, [ELD Compliance Rules For Construction Vehicles 2026](https://www.geosavi.com/eld-compliance-for-construction-vehicles-regulations-and-best-practices/)
- CMAA, [Construction Productivity](https://www.cmaanet.org/sites/default/files/resource/Construction-Productivity_0.pdf)
- Miter, [How to calculate construction labor productivity](https://www.miter.com/resources/construction-labor-productivity/)
- FMI Corp, [Consulting for contractors, construction managers, heavy civil, infrastructure and specialty trade firms](https://fmicorp.com/consulting/c-sectors/c-contractors-construction-services)
- BigRentz, [How Contractors Lose Money on Multi-Site Rentals](https://www.bigrentz.com/blog/4-ways-contractors-with-multi-site-projects-quietly-lose-money-on-equipment-rentals) and [5 Hidden Costs that Inflate Enterprise Rental Spend](https://www.bigrentz.com/blog/5-hidden-costs-that-inflate-enterprise-rental-spend-and-how-to-avoid-them)
- Construction Business Owner, [Targeting Rental Overspend in Construction](https://www.constructionbusinessowner.com/article/targeting-rental-overspend-in-construction/)
- EquipmentShare, [How An Excavation Contractor Unearthed Rental Spend Savings](https://www.equipmentshare.com/articles/how-an-excavation-contractor-unearthed-rental-spend-savings)
- AutoSist, [Construction Tool Tracking Across Multiple Job Sites](https://autosist.com/blog/construction-tool-tracking-multiple-job-sites/) and [6 Reasons Construction Fleets Lose Control of Small Assets](https://autosist.com/blog/reasons-construction-fleets-lose-control-small-assets/)
- Fuel Logic, [How Do You Calculate the Fuel Consumption of Construction Equipment?](https://www.fuellogic.net/how-to-calculate-construction-equipment-fuel-consumption/)
- ERP Research, [Best ERP for Construction Companies 2026](https://www.erpresearch.com/industries/construction-real-estate)
- Alter Accounting CPA, [Construction ERP Comparison 2026](https://alteraccountingcpa.com/blog/construction-erps-compared/)
- Boom & Bucket, [A Fleet Manager's Guide To Building an Internal Rate Structure](https://www.boomandbucket.com/blog/a-fleet-managers-guide-to-building-an-internal-rate-structure)
- Construction CFO, [You Recovered 71 Cents of Every Overhead Dollar](https://constructioncfo.net/construction-overhead-recovery-rate)
- Construction Executive, [Calculating the Overhead Recovery Rate Can Make or Break a Business](https://constructionexec.com/article/calculating-the-overhead-recovery-rate-can-make-or-break-a-business/)
- AGC of America, [Construction Data](https://www.agc.org/learn/construction-data)
