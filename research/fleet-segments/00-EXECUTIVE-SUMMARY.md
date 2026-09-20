# US Fleet & Asset Management Software — Segments and Their Metrics

Executive summary. September 2026.

**Before using any figure here, read `EVIDENCE-LIMITATIONS.md`.** WebFetch was
blocked by network egress policy for the whole of this research, so every number
is derived from search-result snippets rather than a direct read of the source
document. Several widely-quoted industry benchmarks were found to trace to no
primary study at all.

---

## Question 1a — Top 5 US segments by number of VEHICLES

| # | Segment | US powered vehicles | Source | Buyer | Dominant pain |
|---|---|---|---|---|---|
| 1 | For-hire trucking / freight | ~3.9M power units | FMCSA MCMIS via FleetOwner, Dec 2025 | VP Safety / VP Maintenance | HOS compliance, driver safety, fuel and maintenance cost |
| 2 | Private fleets — wholesale & retail distribution | ~3.4M power units | FMCSA MCMIS via FleetOwner, Dec 2025 | VP Logistics / Transportation | Cost pressure plus proving the fleet beats outsourcing |
| 3 | Government & municipal | ~670K federal alone; no clean state/local total | GSA/GAO, 2023 | Civil-service Fleet Manager, via Sourcewell/NASPO | Ageing fleet, 18-36 month procurement cycles |
| 4 | Construction (vehicles) | No clean national total; hundreds of thousands | Estimate | Ops / Equipment Manager | Job-cost visibility, jobsite theft |
| 5 | Field services / trades | 1-3M light vehicles (bottom-up estimate) | Estimate from BLS establishment counts | Owner/GM under ~15 vehicles; Ops Manager above | Dispatch chaos, wasted miles, mid-route breakdowns |

### The ranking inverts when you account for what is actually winnable

| Segment | Rank by raw count | Rank by software-addressable count |
|---|---|---|
| Government & municipal | 3 | **1** |
| Construction (vehicles) | 4 | **2** |
| Field services / trades | 5 | **3** |
| Private fleet distribution | 2 | 4 |
| For-hire trucking | **1** | **6** |

For-hire trucking is the largest segment by vehicle count and among the least
attractive by winnable vehicles: the ELD mandate already forced near-universal
telematics adoption, so the contest is vendor switching, not new penetration.
Government moves to first because it combines a large base with the lowest
documented penetration (17.5% rising to 29.8% between 2018 and 2023, against a
roughly 53% all-segment average, per Berg Insight).

---

## Question 1b — Top 5 US segments by number of ASSETS

Researched separately, as requested. Assets are non-powered and off-road: they
have no driver, no engine to power a tracking device, and far lower unit value.

| # | Segment | US assets | Tracking penetration | Buyer type |
|---|---|---|---|---|
| 1 | Freight, trucking & intermodal | ~3.5-4.5M trailers (estimate) + 700K+ chassis (IANA 2024) | ~20% (Berg Insight 2023/24) | Split: trailers = owner-operator; chassis = rental/leasing |
| 2 | Equipment rental & leasing | ~857K MEWP units (IPAF 2024); United Rentals alone ~1.095M units | Highest in track | Rental/leasing |
| 3 | Construction owner-operators | No authoritative count | Low | Owner-operator |
| 4 | Warehousing, 3PL & manufacturing (forklifts/MHE) | ~2.5-3.5M (extrapolated from ITA order rates) | Under 25% | Owner-operator, often dealer-managed |
| 5 | Agriculture | 1.9M farms (USDA 2022); equipment count is a data gap | Bifurcated: near-saturated on new large equipment, near-zero on the rest | Owner-operator |

**Excluded despite enormous size:** returnable transport items (~2.6B pallets).
A $60/year tag against a $10-20 pallet has no viable economics; the category is
managed by pooling instead.

---

## Question 2 — The metrics differ by segment, and here is why

The segments do not share a KPI set. The reason is structural: **each segment
measures whatever its unit of value is, and the vehicle is that unit in only one
of them.**

| Segment | Unit of value | Governing question | Signature metrics |
|---|---|---|---|
| For-hire trucking | The truck | Did this load make money at this rate? | Operating ratio; revenue per truck per week; cost per mile |
| Private fleet distribution | The case delivered | Should we own this fleet at all? | Cost per case; cost per mile vs purchased transportation |
| Government & municipal | Service to a department | Can this survive an audit? | Vehicle availability; lifecycle cost; replacement backlog |
| Construction | The job | Did this project make margin? | Internal charge rate; cost per hour to cost code |
| Field services | The technician's billable hour | Is the tech earning while on the clock? | Revenue per technician; billable utilisation; first-time fix |
| Trailers / intermodal | Custody and time | Where is it and who is accountable? | Trailer-to-tractor ratio; dwell; detention recovery |
| Equipment rental | The asset itself | What return is this capital earning? | Time utilisation; dollar utilisation; rate realisation; ROIC |
| Construction equipment | The operating hour | Should we own this, and is it where the crew needs it? | Cost per operating hour; own-vs-rent break-even |
| Forklifts / MHE | Throughput, under OSHA | Are we compliant and are we right-sized? | Impact counts; certification compliance; picks per hour |
| Agriculture *(unverified)* | The acre | Did we make the weather window? | Yield per acre; timeliness cost; in-window uptime |

The same word means different things across columns. **Utilisation** means
on-rent days to a rental company, engine hours against a cost code to a
contractor, billable hours to a field service firm, and evidence of departmental
hoarding to a public fleet auditor. A single universal fleet dashboard answers
the trucking question to nine audiences who are not asking it.

---

## The four findings that matter most

### 1. In most segments the fleet system is not the system of record

| Segment | Where the numbers management acts on actually live | A fleet system? |
|---|---|---|
| For-hire trucking | TMS + ELD | Partly |
| Private fleet distribution | Routing + ERP/WMS | No |
| Government & municipal | FMIS | Yes |
| Construction | Construction ERP / job cost | No |
| Field services | FSM platform (ServiceTitan et al.) | No |
| Forklifts / MHE | Often the dealer's system | No — and the dealer is the measured party |

Where the fleet system is not the system of record, fleet data must be
translated into that system's terms or embedded in its workflow. Recasting
"windshield time" as **lost billable technician capacity** rather than a fuel and
idle metric is the difference between a number a service manager acts on and a
dashboard nobody opens.

### 2. The unsolved problem is reconciliation, not more telemetry

Every segment independently surfaced the same failure: a physical fact and a
financial fact that never match.

| Segment | Physical fact | Financial fact | Cost of the mismatch |
|---|---|---|---|
| For-hire trucking | ELD GPS miles | TMS billed miles, IFTA miles, odometer | Quarterly IFTA filing requires manual cross-referencing across three systems |
| Trailers | When the asset arrived and left | The detention invoice | Over 94% of carriers bill detention; under half get paid (ATRI 2024) |
| Equipment rental | Telematics runtime | Contracted billed time | Missed billing, mistimed maintenance, unflagged churn |
| Construction | Engine hours | Hours billed to a cost code | Idle is 38-40% of engine hours, so a 250-hour PM fires after ~150 productive hours |
| Private fleet | Fleet cost in SG&A | COGS in another ledger | No standard cross-ledger allocation exists |

### 3. Several structural failures are incentive problems software cannot solve

- **Government:** capital and operating budgets are appropriated separately, so
  the optimal replacement year and the year money exists differ, and the cost
  surfaces in the wrong budget line. Audit findings recur rather than resolve.
- **Government right-sizing:** a department surrendering a barely-used vehicle
  bears all the risk if it is suddenly needed; the fleet office bears all the
  audit blame if it is not returned. GAO documented real money (up to 47% of NPS
  leased vehicles underused; ~$8.7M across five agencies; ~$13.5M at CBP and
  NRCS in FY2015) and the finding still recurs.
- **Construction:** Equipment Managers are judged on cost recovery, Project
  Managers on job margin, and the internal charge rate converts one to the other.
- **Equipment rental:** branch managers are compensated on their own branch's
  utilisation, which incentivises hoarding and starves other branches.

Software can make these gaps visible to both parties. It cannot resolve them.

### 4. Much of the industry's benchmark base does not survive scrutiny

The benchmarks most quoted in fleet software marketing could not be traced to any
named study: 95% PM compliance, 95% uptime, 20-25% idle, 80% first-time fix,
95-98% on-time delivery. They recur across vendor blogs citing each other, with
ranges varying up to 3x between sources for the same metric.

Specific contradictions found:

- **Deadhead.** ATRI 2025 gives 16.5% for non-tank for-hire. A "35% industry
  average" circulates attributed loosely to ATA with no traceable citation.
- **Own-vs-rent break-even.** Cited from 50 to 200 days per year — a 4x spread on
  a core capital-allocation heuristic.
- **Equipment theft.** The standard NER/NICB reference has not been refreshed in
  a detailed joint public report since 2016. The 2026 citation is a decade-stale
  restatement.

Figures that did hold up include ATRI's cost-per-mile series ($2.336 all-in,
$1.854 marginal non-fuel, 2025), NACFE's 7.77 MPG fleet-wide Class 8 average
(2024), NPTC's private fleet figures (80,400 miles, 18.4% driver turnover, 2025),
CVSA 2025 inspection results, ATRI's 2024 detention study, and the public rental
disclosures from United Rentals, Herc and Ashtead — the only segment in the study
with quarterly, externally verifiable benchmark data.

---

## Product implications

1. **Segment by unit of value, not by fleet size.** It determines which metrics
   are meaningful, which integrations are mandatory, and who the buyer is.
2. **Assume the fleet system is not the system of record.** Integration into the
   TMS, ERP or FSM workflow is the product, not a connector on a roadmap.
3. **Build reconciliation layers rather than more dashboards.** The highest-value
   unsolved problems named across all ten segments are reconciliation problems.
4. **Make multi-job and multi-technician allocation first-class.** The
   one-asset-one-job assumption misstates cost in construction and misattributes
   revenue in field services.
5. **Design to the economic floor on assets.** Roughly $150-500 of asset value
   justifies a tag. Below it, offer non-electronic control rather than pretending
   everything can be instrumented.
6. **Ship provenance with every benchmark.** Given how much circulating lore this
   research found, showing the source and year behind a number is a cheap and
   durable credibility advantage.

---

## Contents of this research set

| File | What it covers |
|---|---|
| `00-EXECUTIVE-SUMMARY.md` | This document |
| `00-research-plan.md` | Method, scope decisions, evidence standard |
| `EVIDENCE-LIMITATIONS.md` | **Read before using any number** |
| `01-trackA-vehicle-sizing.md` | Vehicle ranking, both bases, with sources |
| `01-trackB-asset-sizing.md` | Asset ranking, rental vs owner-operator split |
| `02-kpi-taxonomy-reference.md` | Cross-industry metric definitions, benchmark sources, standards layer |
| `03-seg-v1` … `03-seg-v5` | Vehicle segment deep dives |
| `03-seg-a1` … `03-seg-a5` | Asset segment deep dives |
| `04-synthesis-vehicles.md` | Vehicle cross-segment analysis |
| `04-synthesis-assets.md` | Asset cross-segment analysis |
