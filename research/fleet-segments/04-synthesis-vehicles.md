# Synthesis — vehicle track

Cross-segment analysis of the five US verticals ranked highest by powered vehicle
count. Read `EVIDENCE-LIMITATIONS.md` first: all figures are search-snippet
derived, and several widely-quoted benchmarks trace to no primary study.

---

## 1. The organising insight: identify the revenue unit and the metric set follows

The five segments do not share a KPI set, and the reason is structural rather
than cultural. Each segment measures whatever its **revenue or value unit** is.
The vehicle is that unit in only one of the five.

| Segment | What the unit of value actually is | Governing question | Signature metric |
|---|---|---|---|
| For-hire trucking | The truck | Did this load make money at this rate? | Operating ratio; revenue per truck per week |
| Private fleet distribution | The case delivered | Should we own this fleet at all? | Cost per case; cost per mile vs purchased transportation |
| Government & municipal | The service provided to a department | Can this number survive an audit? | Vehicle availability; lifecycle cost |
| Construction | The job | Did this project make margin? | Internal charge rate; cost per hour to cost code |
| Field services | The technician's billable hour | Is the tech earning while on the clock? | Revenue per technician; billable utilisation |

This single distinction explains most of the divergence. A metric that is central
in one column is often meaningless in another:

- **Cost per mile** is the headline number in trucking and near-meaningless for
  police and fire vehicles, whose idle-heavy duty cycles and upfitted equipment
  mean per-mile cost does not track resource consumption.
- **Utilisation** means on-rent days to a rental company, engine hours against a
  cost code to a contractor, billable hours to a field service firm, and
  "evidence that a department is hoarding vehicles" to a public fleet auditor.
- **Revenue per vehicle** does not exist in government, is the wrong frame in
  field services (revenue attaches to the technician, who may swap vans), and is
  the core number in trucking.

A product that presents one universal fleet dashboard is answering the trucking
question to four audiences who are not asking it.

---

## 2. In three of five segments, the fleet system is not the system of record

This is the most commercially consequential finding of the vehicle track.

| Segment | System of record for the numbers management acts on | Is it a fleet system? |
|---|---|---|
| For-hire trucking | TMS (McLeod, Trimble/TMW) + ELD | Partly |
| Private fleet distribution | Routing (Descartes, Roadnet) + ERP/WMS | No |
| Government & municipal | FMIS (AssetWorks, Faster, RTA, Chevin) | Yes |
| Construction | Construction ERP / job cost (Vista, Sage 300 CRE, CMiC) | No |
| Field services | FSM platform (ServiceTitan, Housecall Pro, Jobber) | No |

Where the fleet system is not the system of record, telematics data must either
be translated into that system's native terms or integrated into its workflow.
The field services case is the sharpest: recasting "windshield time" as **lost
billable technician capacity** rather than as a fuel and idle metric is the
difference between a number the service manager acts on and a dashboard nobody
opens.

---

## 3. Raw vehicle count is the wrong ranking for commercial purposes

Both rankings were produced. They disagree, and the disagreement is the finding.

| Segment | Rank by raw vehicle count | Rank by software-addressable count | Why it moves |
|---|---|---|---|
| For-hire trucking | 1 | 6 | ELD mandate already forced near-universal telematics; the game is vendor switching, not new adoption |
| Private fleet distribution | 2 | 4 | Large fleets already well instrumented; the addressable slice is smaller than 3.4M implies |
| Government & municipal | 3 | 1 | Large base, lowest documented penetration (17.5% to 29.8% 2018-2023 vs ~53% all-segment average), fragmented incumbents |
| Construction (vehicles) | 4 | 2 | Low telematics maturity, minimal single-vendor lock-in |
| Field services | 5 | 3 | Enormous long tail historically on spreadsheets and paper |

For-hire trucking is the largest segment by vehicle count and among the least
attractive by winnable vehicles. Government and construction invert.

---

## 4. Where measurement breaks down, by segment

Each segment has a structural measurement failure that no amount of additional
telematics data resolves, because the failure is organisational rather than
technical.

| Segment | The structural failure | Why more data does not fix it |
|---|---|---|
| For-hire trucking | ELD miles, TMS billed miles, IFTA miles and odometer miles never reconcile | They are computed differently by design; reconciliation is a missing layer, not missing data |
| Private fleet distribution | Cost per case sits across two ledgers (fleet cost in SG&A, COGS elsewhere) | No standard cross-ledger allocation exists; chargeback guidance explicitly offers no universal formula |
| Government & municipal | Capital and operating budgets are appropriated separately | The optimal replacement year and the year money exists are different; the cost surfaces in the wrong budget line |
| Construction | Engine hours are a physical fact, billed hours an accounting fact | Reconciliation is manual or absent; annual charge rates drift silently all year |
| Field services | Fleet data attributes activity to a VIN; revenue attaches to a technician | The vehicle-centric frame answers a question this buyer does not ask |

Two of these — the government budget split and the construction
Equipment-Manager-versus-Project-Manager conflict over the charge rate — are
incentive problems. Software can make the gap visible to both parties, which is
useful, but cannot resolve it.

---

## 5. Sub-models diverge as much as segments do

Treating any of these five as homogeneous is an error. The most important
internal splits:

- **Truckload vs LTL.** Different businesses. LTL ran ~11.6% operating margin in
  2025 while truckload sat at or above 100% operating ratio. LTL's metrics are
  freight density, cost per shipment, terminal and dock productivity, and OS&D
  rate. Applying the truckload list to LTL is wrong.
- **Large carrier vs small carrier.** Operations of 1-10 trucks, the majority by
  carrier count, measure little beyond the bank balance. Dedicated micro-tools
  exist precisely because mainstream TMS is overbuilt for them.
- **Police and fire vs general municipal.** Standard cost-per-mile does not
  apply, and no normalised alternative has been standardised across the segment.
- **Small operator vs PE-backed consolidator in field services.** A reported 288
  private-equity platforms are rolling up US trades. The buyer at the top of the
  market is a regional VP or PE-installed CFO standardising tooling across a
  multi-brand portfolio, not an owner-operator. Portfolio-level reporting matters
  more there than single-shop features.

---

## 6. Benchmark integrity warning

The benchmarks most often quoted in fleet software marketing could not be traced
to any named study: 95% PM compliance, 95% uptime, 20-25% idle, 80% first-time
fix rate, 95-98% on-time delivery. They recur across vendor blogs citing each
other, with ranges that vary by up to 3x between sources for the same metric.

Two specific contradictions worth carrying:

- **Deadhead.** ATRI's 2025 figure for non-tank for-hire is 16.5%. A "35%
  industry average" circulates attributed loosely to ATA with no traceable
  citation. The gap is wide enough to change a product's empty-mile benchmark UI.
  Treat 16.5% as the credible figure.
- **Own-vs-rent breakeven in construction.** Cited anywhere from 50 to 200
  days per year depending on source — a 4x spread on a core capital-allocation
  heuristic.

Embedding any of these as authoritative in-product without a provenance caveat
would propagate the same laundering.

---

## 7. What this implies for product

1. **Segment the product by revenue unit, not by fleet size.** The revenue unit
   determines which metrics are meaningful, which integrations are mandatory, and
   who the buyer is.
2. **Assume the fleet system is not the system of record.** In three of five
   segments it is not. Integration into the TMS, ERP or FSM workflow is the
   product, not a connector on a roadmap.
3. **Multi-job and multi-technician allocation must be first-class.** The
   one-asset-one-job assumption misstates cost in construction and misattributes
   revenue in field services.
4. **Build reconciliation layers, not more dashboards.** The highest-value
   unsolved problems named across segments are reconciliation problems: miles
   across four systems, engine hours against billed hours, fleet cost against
   COGS.
5. **Ship provenance with every benchmark.** Given how much circulating lore this
   research found, a product that shows the source and year behind a benchmark
   has a credibility advantage that is cheap to build.
