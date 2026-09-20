# Segment A4 — Warehousing, Logistics/3PL & Manufacturing: Material Handling Equipment (US)

**Scope:** Forklifts / powered industrial trucks (PITs), reach trucks, order pickers, pallet jacks, tow tractors; AGVs/AMRs where relevant.
**Population:** Estimated 2.5–3.5M US forklift units in service (extrapolated from industry shipment data; no single authoritative installed-base census exists — 🔴 UNVERIFIED INDUSTRY LORE, treat as an order-of-magnitude estimate, not a benchmark). Tracking penetration likely under 25% at unit level (🔴 UNVERIFIED INDUSTRY LORE — analyst/vendor-narrative figure, no primary count found).
**Research date:** September 2026.

> **Methodology note on evidence quality.** Per tool constraints, WebFetch is blocked; this research used WebSearch only, so every finding is derived from search-result snippets, not primary-source documents read in full. In addition, this session's WebSearch budget was exhausted after 4 queries (OSHA citation ranking, OSHA/NSC injury statistics, ITA/WITS shipment data, WERC DC Measures 2025), so the OEM telematics landscape (§3), the lease/dealer-maintenance structure (§1), the battery/lithium transition (§1, §2) and most of §6 could not be freshly searched this session. Those sections are built from established, well-documented industry structure (OSHA 29 CFR 1910.178 itself, named commercial telematics products, and standard MHE financing practice) rather than from a search snippet, and are labeled 🟡 accordingly rather than presented as freshly verified. Nothing below is fabricated; where a specific number could not be tied to a snippet, it is labeled 🔴 UNVERIFIED INDUSTRY LORE.

---

## 1. The Operating Model

Material handling equipment operates inside a building envelope under conditions that share almost nothing structurally with on-road fleets. This is the foundation for everything else in the report.

**Shift patterns and multi-shift operation.** DCs and plants commonly run 2–3 shifts across a 24-hour day, especially in e-commerce fulfillment, food/beverage, and automotive-adjacent manufacturing supply. Fleet sizing is therefore a function of peak-shift throughput, not calendar-day utilization — a truck idle on nightshift is not "wasted" the way an idle delivery van is, because the whole facility may be single-shifted seasonally (e.g., retail DCs surging for peak season) and multi-shifted the rest of the year. 🟡 (established industry structure, not from a fresh snippet this session.)

**Throughput requirements drive fleet size**, not mileage or route coverage as in on-road fleets. The controlling question is "how many pallets/cases/lines must move per hour at peak" and "how many truck-hours does that require given travel and dwell time" — the MHE equivalent of vehicle-count math is a queueing/throughput calculation, not a routing one. 🟡

**Owned vs. leased vs. dealer full-maintenance contract — this determines who the software buyer even is.** MHE is very commonly financed through a dealer under one of a few models:
- **Outright purchase, owned maintenance** — the DC/plant's own maintenance team or a mixed in-house/dealer arrangement services the fleet; the operator holds all the data.
- **Operating lease** — the equipment is leased (often 3–5 year terms) from the OEM's captive finance arm or a third-party lessor, with maintenance handled separately (either in-house or contracted).
- **Full-maintenance lease (FML) / "power by the hour"** — the single most consequential structure for software buying. The dealer owns and maintains the truck for a fixed cost per hour or per month, bundling parts, labor, and often planned replacement into one bill. Under this model, **the dealer's service system, not the customer's WMS or telematics platform, is the system of record for maintenance history, uptime, and repair cost.** The warehouse operator sees an invoice, not underlying data, unless the telematics contract with the dealer specifically grants data access or export. This is the segment's core "split incentive" problem (see §6): the party paying for downtime (the warehouse) and the party holding the data explaining the downtime (the dealer) are different parties, and the dealer's commercial interest is not automatically aligned with maximum data transparency. 🟡 (well-established MHE financing structure; not confirmed via fresh search this session — recommend primary verification against a dealer or ITA source before using in external-facing material.)
- Because of this, **the software buyer for a fleet-management/telematics layer is frequently NOT the fleet owner** — it may be a facility that leases everything and has limited visibility, a corporate EHS/safety function trying to get compliance data the dealer's system doesn't surface, or a 3PL account team needing utilization data to justify billed hours to a client, independent of who "owns" the trucks.

**Electric vs. LP/IC power and the battery/lithium transition.** Warehouses have been steadily shifting from internal-combustion (propane/LP, diesel, gasoline) trucks to electric, and within electric, from flooded lead-acid to lithium-ion. Lead-acid requires a dedicated "battery room," scheduled swaps, cooldown time, and watering/equalization maintenance; lithium-ion enables opportunity charging (short top-ups during breaks) without a battery-swap infrastructure or a dedicated room, which changes both the physical facility requirement and the fleet-sizing math (fewer spare batteries/trucks needed to cover charge downtime). 🟡 — directionally correct and widely reported in trade press (Modern Materials Handling, MMH), but this session could not re-verify a current 2025/2026 lithium-ion penetration percentage via search; treat any such percentage elsewhere as 🔴 unless sourced.

**3PL contract warehouses** typically pass MHE cost through to the client, either as a line item in an open-book cost-plus contract or embedded in a per-unit/per-pallet handling rate. This creates a distinct buyer behavior: the 3PL's site or account manager needs utilization and cost-per-hour data not just to run the operation but to defend the fleet size and cost against client audit — i.e., MHE metrics become a *contract-defense* artifact, not just an operations artifact. 🟡

**Labour, not equipment, is usually the binding constraint.** In most DCs the limiting factor on throughput is available, trained, certified operators per shift — not truck count — which is why operator productivity and certification/compliance metrics (§2) carry outsized weight relative to equipment-utilization metrics in how the segment actually manages performance. 🟡

---

## 2. The Metrics That Drive This Segment

| Metric | Formula | Unit | Why it matters / decision triggered | Confidence |
|---|---|---|---|---|
| Equipment utilization rate | Hours truck is in productive use ÷ hours available per shift | % | Drives fleet right-sizing decisions (add/retire trucks); low utilization is the primary evidence used to challenge "every truck is needed" claims | 🟡 |
| Hours per shift / hours per day operated | Engine-on or key-on hours from telematics | hrs | Basic utilization input; also used to schedule preventive maintenance intervals (hour-based, not mileage-based) | 🟡 |
| Fleet right-sizing ratio / units per throughput unit | Truck-hours required ÷ throughput volume (pallets, cases, lines) at peak | trucks per (pallets/hr) | Core capital-planning metric; determines lease renewal quantity | 🟡 |
| Throughput served: cases/pallets/lines picked per hour | Units moved ÷ labor or equipment hours | units/hr | Central WERC/DC benchmarking metric; ties equipment directly to warehouse output | 🟢 WERC 2025 confirms this class of metric (picking, dock-to-stock) as a top-ranked DC metric (WERC, 2025) |
| Dock-to-stock time | Time from receipt at dock to putaway/available-to-pick | hours/minutes | Named explicitly by WERC 2025 respondents as one of the most important DC metrics; measures receiving+MHE efficiency together | 🟢 (WERC, 2025) |
| Order cycle time | Order received → order shipped | hours | Composite metric MHE throughput feeds into; used in SLA/OTIF reporting | 🟡 |
| Operator productivity: picks/hour, travel vs. pick time | Picks completed ÷ hours worked; travel time ÷ total task time | picks/hr, % | Distinguishes value-add time from travel waste; drives slotting and labor-management-system (LMS) engineering standards | 🟡 |
| Impact/collision detection count | Number of impact-sensor-triggered events above threshold ÷ period (often per truck or per 1,000 hours) | count | THE signature MHE telematics metric; without sensors, impacts go entirely unreported (see §6); drives operator coaching, damage attribution, and insurance conversations | 🟡 (concept well-established in MHE telematics products; no fresh benchmark figure found this session) |
| OSHA recordable incident rate | (Number of OSHA-recordable injuries × 200,000) ÷ total hours worked | rate per 100 FTE/yr | Standard EHS KPI; forklifts are a leading cause of warehouse recordables | 🟡 (formula is the standard OSHA/BLS incidence-rate formula; not specific to a cited MHE benchmark this session) |
| Forklift-related injury/fatality rate | Annual injuries or fatalities involving PITs ÷ population or hours | count/year | National benchmark context for EHS risk cases; see §5 for sourced figures | 🟢 (see §5) |
| Operator certification compliance / expiry tracking | % of active operators with current OSHA 1910.178 evaluation (valid ≤3 years) | % | Direct regulatory compliance metric; an expired certification operating a truck is a citable, potentially fatal-incident-triggering gap | 🟢 the 3-year re-evaluation requirement is codified in 29 CFR 1910.178(l) |
| Pre-shift inspection completion rate | # of shifts with a completed OSHA-required daily/pre-use checklist ÷ total shifts | % | OSHA-mandated daily practice; paper-based compliance is the segment's most common "spreadsheet failure point" (§6) | 🟢 requirement source: 29 CFR 1910.178 general industry practice; completion-rate benchmark itself is 🔴 unsourced |
| Unauthorized-operator access attempts | Count of ignition/access attempts by non-certified or non-badged users | count | Safety and liability metric enabled by keyless/RFID access systems bundled with telematics | 🟡 |
| Maintenance cost per hour / per unit | Total maintenance spend ÷ operating hours (or ÷ unit count) | $/hr or $/unit | Central to lease-vs-own and dealer-contract negotiation; the number a full-maintenance-lease bill is built around | 🟡 |
| Planned vs. unplanned maintenance ratio | Planned work orders ÷ total work orders | % or ratio | Leading indicator of fleet health and dealer-contract compliance; high unplanned share signals under-maintained or aging fleet | 🟡 |
| Uptime / availability | Hours available for use ÷ scheduled hours | % | Directly affects throughput capacity at peak; a contractual SLA term in many full-maintenance leases | 🟡 |
| Mean time to repair (MTTR) | Total repair downtime ÷ number of repair events | hrs | Dealer-service responsiveness metric; especially visible where the dealer, not the customer, controls parts/labor scheduling | 🟡 |
| Battery/charge cycle metrics (electric fleets) | Cycles logged, state of health (SoH) %, opportunity-charge events, watering-compliance completion (lead-acid) | count/%/events | Battery room throughput can be a hidden constraint (§6); lithium SoH tracking is emerging as fleet electrification scales | 🟡 |
| LP cylinder consumption | Cylinders used ÷ operating hours | cylinders/hr | Cost and refueling-logistics metric for IC/LP fleets | 🔴 no sourced benchmark found; formula is inferred from standard practice |
| Cost per operating hour | Total fleet cost (lease/own + maintenance + energy) ÷ total operating hours | $/hr | The single number most often used to compare lease vs. own and to benchmark against dealer full-maintenance quotes | 🟡 |
| Lease vs. own total cost comparison | NPV of lease payments + service vs. NPV of purchase + owned maintenance + residual value | $ | Procurement/Finance decision metric at contract renewal | 🟡 |
| Damage to racking and product | $ value or count of damage incidents attributed to MHE ÷ period | $/count | Chronic attribution problem (see §6) — often not tied to a specific operator/shift without sensor or badge data | 🟡 |
| Equipment-caused product damage cost | $ value of product written off due to MHE-caused damage | $ | Feeds into 3PL client cost reconciliation and claims/insurance; rarely reconciled cleanly against warehouse cost-per-unit-shipped (§6) | 🟡 |

**Notes on confidence:** The regulatory facts (3-year certification cycle, pre-shift inspection requirement) are codified in 29 CFR 1910.178 and are treated as 🟢 even though this session did not re-fetch the OSHA regulation text live (WebFetch blocked; this is a well-established, stable regulatory citation). Numeric benchmarks for utilization %, cost-per-hour, MTTR, and damage cost were **not found via search this session** and no specific number is asserted for them — the table intentionally leaves the "benchmark" cell blank/qualitative rather than inventing one. See §5 for the numbers that ARE sourced.

---

## 3. How They Measure — Cadence, Workflow, and Systems of Record

**Cadence:**
- **Shift-level:** productivity reporting (picks/hour, throughput vs. plan) reviewed by shift supervisors at shift changeover; this is the tightest feedback loop in the segment.
- **Daily:** dock and throughput review (dock-to-stock time, receiving backlog) typically in a DC manager's daily standup; pre-shift inspection completion is nominally a daily control but frequently reviewed only exceptionally (see §6).
- **Monthly:** maintenance and cost review with the dealer under full-maintenance contracts — this is where uptime, repair cost, and planned/unplanned ratios are reconciled against the contract, and where data asymmetry (§1, §6) is most visible.
- **Annual:** fleet contract review/renewal — lease-vs-own analysis, right-sizing decisions, and dealer contract renegotiation, usually timed to lease-term expiration (commonly 3–5 year cycles).

🟡 (standard operating cadence for the segment based on how DC operations and MHE contracts are structured; not confirmed via a fresh search snippet this session.)

**Systems of record:**
- **WMS** — Manhattan Associates, Blue Yonder, SAP EWM, Körber — owns throughput, pick, and labor-standard data; generally does NOT own equipment health/maintenance data.
- **Labour management systems (LMS)** — often bundled with or adjacent to the WMS — owns operator productivity/engineered-standard data.
- **MHE telematics / fleet management** — OEM-proprietary platforms dominate: Crown InfoLink, Toyota I_Site, Hyster-Yale (Hyster Tracker/Utilimap), Raymond iWarehouse, Linde Connect, plus multi-brand third-party platforms. **This mirrors construction telematics fragmentation exactly**: a mixed-brand fleet (e.g., Toyota reach trucks + Crown order pickers + Hyster IC trucks) means the DC manager must reconcile 3+ separate proprietary portals with different metric definitions, export formats, and data-access terms to get one fleet-wide utilization or impact-event view. No dominant brand-agnostic aggregator has the market position that, say, Samsara/Motive have achieved on-road. 🟡 (product names and general architecture are well-established industry knowledge; this session could not freshly search vendor feature sets or confirm current market share due to exhausted search budget — flag for follow-up verification.)
- **Dealer service systems** — the system of record for maintenance history, parts, and labor cost under full-maintenance contracts; frequently NOT integrated with the customer's WMS/ERP or even the OEM's own telematics portal.
- **ERP** — SAP, Oracle, etc. — owns capital cost, lease accounting, and depreciation; the terminus for cost-per-hour and lease-vs-own analysis.

**The structural fragmentation point:** because telematics are OEM-proprietary and dealers hold maintenance data under common leasing arrangements, a facility with a mixed-brand fleet or a dealer-maintained fleet faces the segment's core measurement problem — no single native system contains utilization + maintenance + cost + compliance for the whole fleet, and building that view requires either single-sourcing to one OEM (rare in practice) or a third-party integration layer.

---

## 4. Who Owns Each Number

| Role | Numbers owned |
|---|---|
| Warehouse / DC Manager | Overall throughput, dock-to-stock time, fleet right-sizing decisions, day-to-day equipment availability |
| Operations Manager | Order cycle time, cost per operating hour, cross-functional throughput vs. labor vs. equipment tradeoffs |
| Shift Supervisor | Shift-level productivity, picks/hour, immediate pre-shift inspection enforcement |
| Maintenance Manager | Maintenance cost per hour/unit, planned vs. unplanned ratio, uptime, MTTR — or, under a full-maintenance lease, the liaison managing the dealer relationship rather than the data itself |
| EHS / Safety Manager | OSHA recordable incident rate, forklift-related injury data, certification compliance/expiry, pre-shift inspection completion, unauthorized-access attempts — **frequently the real internal champion for MHE telematics**, because impact/collision data and certification tracking are the tools that reduce the org's OSHA exposure and insurance risk |
| Procurement | Lease contract terms, lease-vs-own cost comparison, dealer full-maintenance contract negotiation |
| Finance | Cost per operating hour, capital vs. operating expense treatment, total cost of fleet ownership |
| 3PL Account Manager | Cost-to-serve reconciliation — must prove MHE cost and utilization to a client under an open-book or cost-plus contract; this role sits outside the typical org chart above and is unique to the 3PL sub-segment |

🟡 (role structure inferred from standard DC/plant organizational practice; not confirmed via fresh search this session.)

---

## 5. Benchmarks (Sourced)

| Statistic | Value | Source | Year | Confidence |
|---|---|---|---|---|
| OSHA 1910.178 (Powered Industrial Trucks) citation count | Rose from 2,345 citations (2020) to 3,710 citations (2024); consistently ranks among OSHA's most frequently cited general-industry standards | [SafetyRecord — OSHA's Top 10 Most Cited Standards (FY2025)](https://safetyrecord.org/analysis/osha-top-10-most-cited-standards); [EHS.com — The Crucial Importance of OSHA's Powered Industrial Truck Standard](https://www.ehs.com/blogs/the-crucial-importance-of-oshas-powered-industrial-truck-standard/) | 2024/2025 reporting | 🟡 (secondary/aggregator sources, not OSHA's own published top-10 table, which this session could not fetch directly since WebFetch is blocked) |
| Most-cited general-industry OSHA standard overall (context) | Hazard Communication, 29 CFR 1910.1200 — 8,184 citations in FY2024 | Same as above | 2024 | 🟡 |
| Forklift-related fatalities | ~84 workers died in 2024 in incidents involving forklifts, order pickers, or platform trucks (per National Safety Council Injury Facts, citing BLS data); OSHA's long-standing estimate is ~85 fatal accidents/year | [NSC Injury Facts — Work Safety: Forklifts](https://injuryfacts.nsc.org/work/safety-topics/forklifts/data-details/) | 2024 | 🟡 (search snippet paraphrase; primary NSC/BLS table not directly fetched) |
| Forklift-related injuries | ~34,900 serious injuries + ~61,800 non-serious injuries (~97,000 total) annually; also cited as "97,000 annual forklift injuries, including 35,000 serious and 62,000 non-serious" in an OSHA directive reference | [Voxel AI — 38 Forklift Accident Statistics](https://www.voxelai.com/industry-insights/forklift-accident-statistics); [WarehouseWiz — OSHA Forklift Accident Statistics & Facts](https://warehousewiz.com/en-us/blogs/news/osha-forklift-accident-statistics) | Recurring OSHA estimate, cited across current (2025/2026) secondary sources | 🟡 (this ~97,000/year figure is a long-standing OSHA estimate repeatedly recirculated by secondary sources; this session could not confirm the original OSHA publication date or verify it hasn't been superseded) |
| Cause breakdown of fatal forklift accidents | ~42% involve the vehicle tipping over (operator crushed); ~36% involve a struck pedestrian | [Voxel AI — 38 Forklift Accident Statistics](https://www.voxelai.com/industry-insights/forklift-accident-statistics) | Undated within snippet, presented as current 2025/2026 | 🟡 |
| Effect of training on accident reduction | OSHA estimate that proper training reduces forklift accidents by ~70% | [Voxel AI — 38 Forklift Accident Statistics](https://www.voxelai.com/industry-insights/forklift-accident-statistics) | Long-standing OSHA estimate, origin/date not confirmed this session | 🔴 UNVERIFIED INDUSTRY LORE (widely recirculated round number with no primary citation surfaced) |
| Global forklift shipments | 1.75 million units shipped globally in 2023, up 8.4% YoY | World Industrial Truck Statistics (WITS), via [Astute Analytica — Forklift Trucks Market](https://www.globenewswire.com/news-release/2025/05/07/3076314/0/en/Forklift-Trucks-Market-Hit-Valuation-of-US-102-87-Billion-by-2033-Astute-Analytica.html) | 2023 (reported 2025) | 🟡 (global, not US-specific; no 2025/2026 US/North America unit figure surfaced this session) |
| Electric share of new unit shipments | Electric riders = 67% of all new units shipped across North America and Europe in 2023, up from 59% in 2020 | ITA / WITS, via same Astute Analytica release | 2023 | 🟡 |
| ITA market coverage | Industrial Truck Association represents "over 90%" of the forklift market across US, Canada, Mexico | [DC Velocity — ITA: Who we are and what we do](https://www.dcvelocity.com/material-handling/ita-who-we-are-and-what-we-do) | 2025 | 🟡 |
| WERC 2025 DC Measures Report scope | Tracks 30+ metrics; top-ranked metrics per surveyed DC professionals include on-time shipments, average warehouse capacity used, order picking accuracy, and dock-to-stock cycle time; survey spans manufacturing, retail, wholesale/distributor, 3PL, and life sciences respondents | [Modern Materials Handling — WERC releases 2025 DC Measures Report](https://www.mmh.com/article/werc_releases_2025_dc_measures_report_with_a_focus_on_combining_vision_with_vigilance); [WERC.org — DC Measures](https://werc.org/page/ASSESS-DC_Measures); [WERC DC Measures Survey 2025 PDF](https://wercmetrics.werc.org/WERC-DC-Measures-Survey-2025.pdf) | 2025 (released at WERC Annual Conference; based on 2024/2025 survey data) | 🟢 (multiple corroborating trade-press and primary-association sources; this is the authoritative annual benchmark for this segment's warehouse productivity metrics, though full numeric detail sits behind WERC's paid Online Benchmarking Tool and was not directly retrievable here) |
| US installed forklift base | No authoritative figure found; commonly extrapolated estimate of 2.5–3.5M units | — (per this project's own brief; not independently corroborated this session) | N/A | 🔴 UNVERIFIED INDUSTRY LORE |
| Telematics/tracking penetration at unit level | Estimated <25% | — (not corroborated this session) | N/A | 🔴 UNVERIFIED INDUSTRY LORE |

---

## 6. Where Measurement Breaks Down Today

1. **Proving fleet right-sizing against "every truck is needed."** Utilization data exists in OEM telematics but is fragmented by brand (§3) and rarely rolled up to a single fleet-wide view; without that, a DC manager's qualitative assertion that all trucks are needed is hard to counter quantitatively, especially when utilization dips are seasonal (peak vs. non-peak) and a snapshot view looks misleadingly low or high. 🟡

2. **Attributing product/racking damage to a specific operator and shift.** Absent badge-linked or RFID-linked equipment access tied to impact sensors, a racking-damage event is discovered after the fact with no reliable way to tie it to who was driving, on which shift — turning a potentially coachable safety event into an unassignable cost. This is a direct consequence of the segment's OSHA-driven access-control requirement (only certified operators may run a truck) not being systematically tied to telematics event logs in most fleets. 🟡

3. **Impact events that go unreported without sensors.** Operator self-reporting of a minor collision (with racking, a column, another truck) is unreliable by nature — the operator has an incentive not to report a minor bump that caused no visible injury. Impact-sensor telematics is the direct technical response to this gap, which is why it is treated as the segment's signature MHE-specific metric (§2); fleets without sensors structurally cannot know their true impact rate. 🟡

4. **Certification expiry tracked on a spreadsheet.** The 3-year OSHA re-evaluation cycle (29 CFR 1910.178(l)) is a hard compliance date per operator, but in many facilities it is tracked in HR or EHS spreadsheets rather than integrated with the access-control system that determines who can start a truck — creating a real (if hard to quantify without a fresh audit source) risk that an expired-certification operator is never technically locked out. 🟡

5. **The split-incentive problem under full-maintenance dealer contracts.** As described in §1, when the dealer both maintains the fleet and holds the maintenance/uptime data, the customer's ability to independently verify uptime SLAs, MTTR, or the planned/unplanned maintenance ratio depends entirely on what the dealer chooses to expose. This is structurally identical to a landlord holding a tenant's usage meter — the party being measured controls the measurement. It is the single most consequential "data ownership" issue in this segment, and it has no clean on-road analogy (a DOT-regulated carrier always retains its own ELD data by law; there is no equivalent regulatory backstop forcing MHE maintenance-data portability). 🟡

6. **Battery room throughput as a hidden constraint.** Under lead-acid power, the battery room's charging/swap capacity — not the truck count itself — can silently cap how many electric trucks can run a given shift pattern, especially at 2-3 shift facilities where charge windows are tight; this constraint is rarely modeled explicitly alongside "fleet size" in planning, and the lithium transition is reshaping it by removing the swap-room requirement, but genuine 2025/2026 US penetration data was not available to this research pass. 🟡

7. **Mixed-OEM telematics fragmentation.** As in §3, a facility running Toyota, Crown, and Hyster trucks side by side must either live without a single fleet-wide utilization/impact/maintenance view, or invest in third-party integration — a close structural parallel to the multi-OEM telematics fragmentation problem well documented in construction/heavy-equipment fleets. 🟡

8. **Whether MHE cost is ever reconciled against warehouse cost-per-unit-shipped.** This appears to be a genuine, largely unaddressed gap: MHE cost data (lease payments, dealer maintenance invoices, energy/fuel) typically lives in ERP/Finance, while cost-per-unit-shipped is a WMS/operations KPI (and, per WERC's 2025 findings, a top-ranked DC metric) — but this research could not find evidence of a standard, systematic reconciliation process linking the two. This is consistent with the broader pattern that MHE is often treated as a facilities/capital-cost line rather than as a direct input to per-unit warehouse economics. 🔴 UNVERIFIED — flagged as a plausible/likely gap based on the systems-of-record fragmentation documented in §3, not as a confirmed finding from a specific source.

---

## Owned vs. Leased vs. Dealer-Managed — How the Buyer and Metric Set Change

| Dimension | Owned (in-house maintenance) | Operating lease (maintenance separate) | Full-maintenance lease / dealer-managed |
|---|---|---|---|
| Who holds the maintenance data | Customer's own maintenance team/CMMS | Split — customer or a contracted third party | **Dealer** — the customer typically sees only invoices/summary reports |
| Primary software buyer | Maintenance Manager / DC Manager | Procurement (contract) + Maintenance Manager (operations) | **Procurement** (contract terms) and **EHS/Safety** (compliance data the dealer's system may not surface) — Maintenance Manager's role shifts from "doing the work" to "auditing the dealer" |
| Metrics the buyer can natively see | Full stack: utilization, MTTR, planned/unplanned ratio, cost/hr — all internally generated | Utilization and cost data are internal; maintenance-specific data depends on the servicing party's reporting | Utilization/impact data (if telematics is separately contracted) may be visible, but **uptime, MTTR, and planned/unplanned ratio are dealer-controlled** unless contractually specified as deliverables |
| Core tension | None structurally — data and incentive are aligned | Moderate — lessor's residual-value interest can conflict with customer's usage patterns | **High** — dealer is paid a fixed rate regardless of how efficiently it services the fleet; customer has limited leverage to verify SLA performance without independent telematics |
| Where telematics adds the most value | Confirms internal MTTR/cost claims are accurate | Validates usage against lease terms (e.g., hour caps) | **Independently verifies the dealer's own SLA and billing claims** — this is the segment's strongest wedge use case for third-party (non-OEM, non-dealer) telematics/fleet software |
| Typical contract cadence | N/A (capital purchase) | 3–5 year lease term | 3–5 year lease term, monthly cost reconciliation, annual renewal review |

🟡 (Table synthesizes standard MHE financing/contracting structure; not independently verified via fresh search this session — recommend confirming specifics with an ITA member, a dealer, or a primary OEM finance-arm source before external use.)

---

## Sources

- [SafetyRecord — OSHA's Top 10 Most Cited Standards (FY2025)](https://safetyrecord.org/analysis/osha-top-10-most-cited-standards)
- [EHS.com — The Crucial Importance of OSHA's Powered Industrial Truck Standard](https://www.ehs.com/blogs/the-crucial-importance-of-oshas-powered-industrial-truck-standard/)
- [OSHA — Powered Industrial Trucks (Forklifts): Standards](https://www.osha.gov/powered-industrial-trucks/standards)
- [OSHA — Powered Industrial Trucks (Forklifts): Overview](https://www.osha.gov/powered-industrial-trucks)
- [OSHA — 29 CFR 1910.178, Powered Industrial Trucks](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178)
- [NSC Injury Facts — Work Safety: Forklifts, Data Details](https://injuryfacts.nsc.org/work/safety-topics/forklifts/data-details/)
- [Voxel AI — 38 Forklift Accident Statistics](https://www.voxelai.com/industry-insights/forklift-accident-statistics)
- [WarehouseWiz — OSHA Forklift Accident Statistics & Facts You Need to Know](https://warehousewiz.com/en-us/blogs/news/osha-forklift-accident-statistics)
- [Industrial Truck Association (ITA) — official site](https://www.indtrk.org/)
- [DC Velocity — ITA: Who we are and what we do](https://www.dcvelocity.com/material-handling/ita-who-we-are-and-what-we-do)
- [GlobeNewswire / Astute Analytica — Forklift Trucks Market Hit Valuation of US$102.87 Billion by 2033](https://www.globenewswire.com/news-release/2025/05/07/3076314/0/en/Forklift-Trucks-Market-Hit-Valuation-of-US-102-87-Billion-by-2033-Astute-Analytica.html)
- [Modern Materials Handling — WERC releases 2025 DC Measures Report with a focus on combining vision with vigilance](https://www.mmh.com/article/werc_releases_2025_dc_measures_report_with_a_focus_on_combining_vision_with_vigilance)
- [Supply Chain 24/7 — WERC releases 2025 DC Measures Report](https://www.supplychain247.com/article/werc_releases_2025_dc_measures_report_with_a_focus_on_combining_vision_with_vigilance)
- [WERC.org — DC Measures](https://werc.org/page/ASSESS-DC_Measures)
- [WERC.org — News: WERC Releases 2025 DC Measures Report](https://werc.org/news/702949/WERC-Releases-2025-DC-Measures-Report-with-a-Focus-on-Combining-Vision-with-Vigilance-.htm)
- [WERC DC Measures Survey 2025 (PDF)](https://wercmetrics.werc.org/WERC-DC-Measures-Survey-2025.pdf)
- [WERC.org — Metrics](https://werc.org/page/metrics)
- [MHI Solutions — WERC Releases 2025 DC Measures Report](https://www.mhisolutionsmag.com/index.php/2025/09/18/werc-releases-2025-dc-measures-report-with-a-focus-on-combining-vision-with-vigilance/)
- [Yale (Hyster-Yale) — Benchmarking and improving distribution center metrics (white paper)](https://www.yale.com/globalassets/coms/yale/north-america/documents/white-papers/0000ybc0wp001_e_en-us_benchmarking-and-improving-dc-metrics.pdf)

### Not independently verified this session (recommend follow-up search/fetch when budget allows)
- Current (2025/2026) OEM telematics platform feature comparisons: Crown InfoLink, Toyota I_Site, Hyster-Yale Tracker/Utilimap, Raymond iWarehouse, Linde Connect.
- Lease vs. own vs. full-maintenance-lease pricing structures and prevalence percentages.
- Lithium-ion vs. lead-acid forklift battery penetration rates, 2025/2026.
- 3PL fleet cost pass-through contract mechanics (open-book vs. cost-plus prevalence).
- Full numeric detail behind the WERC 2025 DC Measures Report (sits behind WERC's paid Online Benchmarking Tool).
- A primary OSHA table ranking 1910.178 by exact numeric rank among all cited standards (only secondary/aggregator sources were reachable).

---

*Research constrained by: WebFetch blocked (network egress policy); WebSearch budget exhausted after 4 queries in this session (shared session-wide limit, not query-count-specific to this task). All benchmark numbers are search-snippet derived, one level below primary-source verification, per the task's stated evidence standard.*
