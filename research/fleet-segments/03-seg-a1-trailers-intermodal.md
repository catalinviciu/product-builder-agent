# Segment A1 — Freight, Trucking & Intermodal: Non-Powered Cargo Assets (US)
### Trailers, Reefers, Chassis — Research Brief (September 2026)

**Scope note:** This segment is the unpowered box, not the tractor. A parallel workstream covers powered trucks and the for-hire operating model — deliberately not duplicated here. Evidence is search-snippet derived (WebFetch blocked by policy) — one level below primary-source reading. Every number is tagged 🟢 primary (official body/report data as reported by a secondary source), 🟡 secondary (industry press/vendor citing a study), or 🔴 UNVERIFIED INDUSTRY LORE (circulates widely, no traceable primary study found in this pass).

---

## 0. The Central Analytical Point

A trailer or chassis is not a vehicle. It has no engine, no driver, and typically no continuous power source. It spends the large majority of its life parked — at a shipper dock, a yard, a customer lot, or a port terminal — not moving freight. Because of this:

- **Value creation is about ratio, not motion.** A tractor earns revenue by driving; a trailer earns nothing while parked, but the whole drop-and-hook model *requires* it to be parked somewhere, waiting, most of the time. The trailer fleet's job is to be "pre-positioned inventory," and the central sizing question is not "how much did it move" but "how many do we need per tractor to never have a tractor waiting on a box."
- **The signature waste is dwell/detention, not downtime.** A truck's downtime (maintenance, idle) is a cost center you minimize toward zero. A trailer's dwell is structurally necessary (that's the point of drop-and-hook) — the discipline is keeping dwell *intentional and short*, not zero, and billing for the time it exceeds what's free.
- **The power constraint defines the technology.** A tractor's telematics box runs off the truck's electrical system and can report every few seconds. A trailer or chassis has no engine alternator. Tracking devices must run on battery (5–10 year replaceable-battery units) or solar-assisted battery, which forces a fundamentally different reporting cadence (hours, not seconds), a fundamentally different cost model (a device that must survive years unattended in the open on an asset worth a fraction of a tractor), and fundamentally different questions the device must answer indirectly (is this loaded or empty? where exactly is it? is it still where we think it is?).

Everything below is built around this: ratio and dwell as the organizing metrics, and the power/reporting constraint as the technology story.

---

## 1. The Operating Model

### Drop-and-hook vs. live load
- **Live load**: a tractor arrives at a shipper, backs to a dock, and the driver waits while the trailer is loaded/unloaded before departing with the same trailer. One trailer effectively "belongs" to one tractor-trip. 🟡
- **Drop-and-hook**: a driver drops an empty (or already-loaded) trailer at a facility and immediately hooks a different, already-loaded trailer, decoupling the truck's schedule from the dock's schedule. This preserves Hours-of-Service driving time that would otherwise be burned waiting at a dock. 🟡 (bobtail.com, DataDocks, Saint John Capital, TrucksOnTheMap — 2025/2026)
- **Why drop-and-hook demands more trailers**: a live-load lane needs roughly 1 trailer per tractor-in-transit; a drop-and-hook lane needs at minimum one trailer at the shipper, one on the road, and one at the receiver/yard in rotation — commonly cited as needing "2–3 trailers in the system to maintain continuous operations." 🟡 This is the direct mechanical driver of trailer-to-tractor ratio (Section 2).
- **Trailer pools between shipper and carrier**: a trailer pool is a set of trailers stationed at (or dedicated to) a shipper/DC site so loading and transport are decoupled — the trailer is loaded on the warehouse's schedule and a tractor collects it later on the carrier's schedule. 🟡 (TrucksOnTheMap 2025)
- **Ownership in dedicated contracts**: three common models circulate in industry commentary — (a) carrier-owned trailer pool dedicated to a shipper's freight, billed into the contract rate; (b) shipper-owned trailers loaned to the carrier under a trailer-interchange/pool agreement (the carrier only supplies the tractor — sometimes called "power-only"); (c) third-party trailer-leasing-company-owned trailers rented to whichever party the contract assigns. 🟡 No single primary census of contract-ownership split was found in this pass; treat mix estimates as 🔴 lore.
- **Chassis provisioning models** (intermodal): historically ocean carriers owned and supplied chassis bundled with the container move ("carrier-controlled"). Starting in the early 2010s, ocean carriers systematically divested US chassis fleets to third-party lessors (TRAC Intermodal, DCLI, Flexi-Van) because chassis capital/maintenance is not a core shipping-line competency. 🟡 (multiple trade sources, Hilco Global, FreightWaves) This produced the **"merchant" / neutral-pool model**: motor carriers rent chassis per-diem from a pool operator or a "pool of pools" rather than getting one bundled with the container. On March 1, 2015, DCLI, Flexi-Van, and TRAC Intermodal launched a "pool of pools" arrangement making their individual pools interchangeable at major ports to relieve chassis shortages. 🟡 (multiple industry sources; widely reported, treat exact date as 🟡 secondary) A **motor-carrier-controlled** model also exists where large asset-based carriers or private fleets own and control their own chassis fleet rather than renting from a pool, common for repeat high-volume drayage lanes. 🟡
- **Structural chassis disputes at US ports**: the shift from carrier-owned to leased/pooled chassis created recurring conflict over availability, per-diem pricing, chassis quality/roadability, and choice of provider. A Federal Maritime Commission case brought by drayage interests accused ocean carriers and chassis-pool operators of a "sweetheart deal" restricting carrier choice of chassis provider — this case proceeded past a stay-denial (Supply Chain Dive). 🟡 Regional and event-driven chassis shortages (post-2020 import surge, hurricane disruptions) recur as a persistent theme in trade press through 2024–2025. 🟡
- **Reefer trailers as a distinct class**: reefers (temperature-controlled/refrigerated trailers) carry substantially higher cargo value (produce, pharma, dairy) and materially higher operating risk than dry van — a mechanical reefer failure or temperature excursion can spoil an entire load (cited ranges of $40,000–$200,000 in loss per incident, see §5) versus a dry-van cargo-theft or damage claim, and they carry a second powered subsystem (the diesel/electric reefer unit itself, which needs its own fuel/battery, runtime-hour, and maintenance tracking) layered on top of the unpowered chassis. 🟡

---

## 2. The Metrics That Drive This Segment

| Metric | Formula | Unit | Why it matters / decision it triggers | Confidence |
|---|---|---|---|---|
| **Trailer-to-tractor ratio** | Total trailers ÷ total tractors | ratio (e.g., 2.5:1) | Core capital-sizing metric for drop-and-hook fleets; too low → tractors wait on trailers (lost revenue miles); too high → excess capital tied up in idle boxes. Triggers fleet right-sizing/disposal decisions. | 🟡 |
| **Trailer utilization rate** | (trailers actively loaded/moving or revenue-generating time) ÷ (total trailer-time or total fleet count) | % or ratio | Identifies underused units that are candidates for redeployment, sale, or lease-back. | 🟡 |
| **Dwell time by location** | Total idle time at a location ÷ number of trailer visits (or per-trailer) | hours/days | Diagnoses where the fleet is losing productive capacity (yard vs. customer dock vs. port); drives yard-slotting and appointment-scheduling decisions. | 🟡 |
| **Detention time & detention billing recovery** | Time beyond contracted "free time" at a facility; recovery = (detention $ collected) ÷ (detention $ invoiced) | hours; % | Detention consumes driver HOS and trailer capacity without revenue; billing recovery measures whether the carrier is actually being made whole. Drives accessorial contract renegotiation and adoption of automated timestamp capture. | 🟢/🟡 (ATRI is primary; recovery-rate figure is secondary press) |
| **Turn time at shipper/receiver/port** | Gate-in timestamp to gate-out (or dock-in to dock-out) | minutes/hours | Facility-level efficiency metric; slow turn times cascade into detention and dwell. Drives appointment/dock-scheduling investment. | 🟡 |
| **Empty vs. loaded positioning / empty miles-equivalent for trailers** | % of trailer-days or trailer-moves spent empty vs. loaded | % | Empty trailer repositioning is unbilled cost; cargo-presence sensors are the direct product answer (see §6, power constraint). | 🟡 |
| **Trailer pool size optimization** | Modeled optimal pool size vs. actual pool size, using cycle-time and demand-variability data | count | Determines capex/opex tradeoff between too few trailers (missed loads) and too many (idle capital, yard congestion, storage fees). | 🟡 |
| **Asset idle days** | Consecutive days a trailer records zero movement | days | Flags "lost," abandoned, or forgotten trailers and stranded capital; commonly the trigger for a physical yard audit. | 🟡 |
| **Yard inventory accuracy / lost or misplaced trailer count** | (trailers physically confirmed at expected location) ÷ (trailers on system record) | % ; count | Directly measures whether the "system of record" reflects reality; drives investment in RFID/GPS yard checks and yard management systems (YMS). | 🟡 |
| **Cube utilization (load fill, volume)** | Actual cubic volume loaded ÷ total trailer cubic capacity | % | Determines whether freight is moved efficiently per trailer-trip; low cube utilization inflates fleet-size need and cost per unit shipped. | 🟡 |
| **Weight utilization** | Actual payload weight ÷ maximum legal/rated payload | % | Complements cube utilization — a "cubed out" light load and a "weighed out" dense load require different fleet/equipment strategies. | 🟡 |
| **Reefer temperature compliance** | % of transit time cargo temperature stayed within the set-point range/tolerance | % | Direct FSMA (Food Safety Modernization Act, Rule 204) audit trail requirement and primary defense against false spoilage claims. | 🟡 |
| **Reefer fuel level / runtime hours** | Diesel fuel remaining in the reefer's own tank; cumulative engine-hours on the refrigeration unit | gallons/%; hours | Reefer units have their own separate fuel supply and run independently of the tractor — running out of fuel mid-transit is a spoilage event; runtime hours drive the reefer unit's own separate maintenance schedule. | 🟡 |
| **Pre-trip verification (reefer)** | Documented confirmation the reefer unit was set, running, and pre-cooled to spec before dispatch | pass/fail, timestamped | Primary point of liability determination when a claim occurs — did the excursion happen because pre-trip was skipped. | 🟡 |
| **Cargo claim rate from temperature excursion** | Claims attributable to temp excursion ÷ total reefer loads (or per driver, per lane) | % / rate | Direct P&L and insurance-pricing driver for reefer operations; the segment's highest-severity claim category. | 🟡 |
| **PM interval compliance (trailers)** | Actual maintenance events vs. scheduled interval (commonly ~90-day PM for high-utilization trailers; pre-load inspection after >30 days idle for low-utilization units) | % compliance | Directly tied to roadside OOS risk (see below); drives shop scheduling. | 🟡 |
| **Tire and brake condition** | Tread depth (federal min. 2/32"); brake lining thickness vs. OOS threshold; brake stroke | mm / in; pass-fail | Tires and brakes are the leading DOT roadside out-of-service violation categories for trailers (see §5). | 🟢 (FMCSA/CVSA data) |
| **FMCSA roadside inspection OOS rate (trailer-attributable)** | Trailers placed out of service ÷ trailers inspected | % | Regulatory compliance and safety-rating (CSA) exposure; directly affects insurance and shipper contract eligibility. | 🟢 |
| **CVSA Brake Safety Week / International Roadcheck results** | Vehicles OOS for brake violations ÷ vehicles inspected during the campaign | % | Annual industry benchmark and PR-visible compliance signal. | 🟢 |
| **Chassis roadability compliance** | Chassis passing IEP (Intermodal Equipment Provider) systematic inspection & driver pre-trip DVIR vs. total in circulation | % / pass-fail | Federal requirement (49 U.S.C. §31151) that IEPs keep interchanged chassis in "safe and proper operating condition"; DVIR data flows through IANA's GIER/DVIR system. | 🟢/🟡 |
| **Per-diem billing accuracy / disputes (chassis)** | Per-diem invoices disputed ÷ total invoiced; $ recovered through UIIA Dispute Resolution Process | % / $ | UIIA governs >90% of intermodal chassis interchange; disputes go through a formal binding arbitration process — a strong signal that billing accuracy is a chronic, structurally unresolved pain point. | 🟢 (UIIA structure) / 🟡 (dispute volume) |
| **Street dwell (chassis)** | Days a chassis (loaded or empty) sits off-terminal at a shipper/receiver/trucker lot before return | days | Benchmarked informally: 1–3 days = healthy, 4–6 days = caution, 7+ days = poor/target breach; dwell >4 days is cited as degrading marine-terminal-wide chassis availability. | 🟡 |
| **Cargo theft / load security** | Reported theft incidents; average $ loss per incident | count; $ | CargoNet/Verisk is the closest thing to a primary industry benchmark (see §5); trailer burglary and full-trailer theft are named as elevated risk categories. | 🟢 (CargoNet, via Verisk press releases) |
| **Asset lifecycle / residual value** | Book/market value over time vs. maintenance cost curve ("sweet spot" crossover) | $ | Determines optimal trailer replacement age; generic fleet-lifecycle framework (not trailer-specific primary data found). | 🔴 (framework is generic fleet-management content, not trailer-specific study) |

---

## 3. How They Measure — Cadence, Systems, Workflow

**Cadence** (industry-typical, not from a single named primary study — 🟡):
- **Daily**: yard checks (physical or RFID/camera-based gate sweep) to reconcile what's on the lot against the system of record; reefer pre-trip verification per dispatch.
- **Weekly**: asset utilization review (which trailers/chassis moved, which sat); detention-exception review.
- **Monthly**: per-diem/chassis-lease reconciliation against invoices; maintenance-due reporting; theft/claims rollups.
- **Annual**: DOT/FMCSA annual inspection per 49 CFR §396.17 (mandatory regardless of utilization); chassis IEP systematic inspection cycle.

**Systems of record:**
- **TMS (Transportation Management System)** — load/dispatch assignment, which trailer is on which load.
- **YMS (Yard Management System)** — gate transactions, spotting, dock-door assignment; vendors referenced: Opendock, c3 Solutions, Peripass, Descartes, Outrider (yard-automation robotics). 🟡
- **Trailer/asset telematics** — ORBCOMM (~1.6M installed trailer/asset units, 2023 🟢 Berg Insight-sourced), SkyBitz (~750K units 🟢 Berg Insight-sourced), Nexxiot (~1.0M units 🟢 Berg Insight-sourced), BlackBerry Radar (non-powered asset tracking: location, mileage, door open/close, wireless sensor integration 🟡), Samsara Asset/Trailer Powered Gateway and battery-powered AG46 unpowered-asset gateway (cargo presence detection 🟡), Spireon/Solera (intelligent cargo sensors, utilization/readiness reporting 🟡), Tive (named in brief as a market participant; not directly evidenced in this pass — 🔴 unverified for specifics).
- **Reefer telematics** — Thermo King TracKing and Carrier Transicold DataLink 2, both aimed specifically at FSMA record-keeping (temperature logs, set-point history, retained ~12 months per FSMA Rule 204 requirement). 🟡
- **Port/terminal & chassis systems** — IANA's Global Intermodal Equipment Registry (GIER) and Driver Vehicle Inspection Reporting (DVIR) service link chassis registration, driver credentialing (Intermodal Driver Database), and the UIIA database for electronic pre-trip inspection compliance under 49 CFR §396.11-12. 🟢

**How yard inventory is actually reconciled today, and how often it's wrong** (🟡, vendor-sourced but consistent across sources):
- Without a YMS, reconciliation is largely manual: security-guard gate logs, spreadsheet trailer lists, and periodic physical "trailer hunts" by yard jockeys.
- A yard jockey is reported to waste up to 30% of a shift searching for misplaced trailers/assets, with each search averaging 10–12 minutes; without a YMS, locating one lost trailer can take 45–50 minutes and 2–3 people; with a system, similar tasks are reported to resolve in ~2 minutes. 🟡
- Real-time location tracking is reported to reduce shrinkage from ~1.8% to below 0.3% in yard/warehouse contexts (not trailer-specific but illustrative of the accuracy gap manual tracking leaves). 🟡
- Reconciliation errors compound because trailers move between multiple parties' custody (carrier yard → shipper dock → receiver dock → repair vendor → another carrier's interchange) with no single owner of the "location of record" at each handoff — this is the structural reason drift accumulates (analysis, not sourced to a single study).

---

## 4. Who Owns Each Number

| Role | Owns / accountable for |
|---|---|
| **VP Operations** | Trailer-to-tractor ratio target; overall fleet sizing strategy; drop-and-hook vs. live-load network design. |
| **Director of Assets / Equipment** | Trailer/chassis pool sizing, utilization rate, lifecycle/replacement and residual-value decisions, capex planning. |
| **Terminal / Yard Manager** | Daily yard inventory accuracy, dwell time by location, turn time, lost/misplaced trailer resolution. |
| **Maintenance Director** | PM interval compliance, tire/brake condition, DOT annual inspection completion, roadside OOS rate exposure. |
| **Intermodal Manager** | Chassis roadability compliance, street dwell, chassis pool selection/contracting, GIER/DVIR compliance. |
| **Finance (accessorial / lease accounting)** | Detention billing issuance and recovery rate, per-diem reconciliation and dispute resolution, trailer/chassis lease accounting (ASC 842 treatment for leased equipment). |
| **Revenue Management (chassis lessors — TRAC, DCLI, Flexi-Van, XTRA Lease)** | Fleet utilization across the pool, per-diem/subscription billing accuracy, dispute volume, pool-of-pools interoperability terms. |
| **Safety/Compliance** | CSA score exposure from trailer OOS violations, CVSA campaign results, cargo securement compliance. |
| **Risk/Insurance & Security** | Cargo theft rate and loss $, reefer cargo claim rate, temperature-excursion liability. |

---

## 5. Benchmarks (with source and year)

| Benchmark | Value | Source / Year | Confidence |
|---|---|---|---|
| Non-powered cargo tracking devices installed (trailers, containers, rail wagons, ULDs, pallets, worldwide) | 11.1 million active in 2023, projected 22.4 million by 2028 (15.0% CAGR) | Berg Insight, via Telematics Wire, 2024 | 🟢 |
| Trailer telematics market leaders (installed base) | ORBCOMM ~1.6M units; Nexxiot ~1.0M; SkyBitz ~750K (end of 2023) | Berg Insight, via Telematics Wire, 2024 | 🟢 |
| Trailer/cargo container tracking penetration (US, cited in brief) | ~20% | Berg Insight 2023/24 (as cited in task brief; not independently re-confirmed via search in this pass) | 🟡 |
| US trailer population (estimate) | ~3.5–4.5 million trailers | Task brief framing; consistent order-of-magnitude with industry commentary, no single census source confirmed in this pass | 🟡 |
| US intermodal chassis population | 700,000+ (2024) | IANA, as cited in task brief | 🟡 (not independently re-verified to a specific IANA report page in this pass) |
| 2024 intermodal volume | 18,083,970 units, +8.5% YoY; domestic containers 8,472,063 (+5.3%); trailers 591,388 (-16.1% YoY) | IANA / Logistics Management, 2024–2025 reporting | 🟢 |
| Trailer-to-tractor ratio, US/Canada overall | 2.46:1 (Aug 2020) | Trade press citing industry data (TT News/ProQuest) | 🟡 |
| Trailer-to-tractor ratio, for-hire fleets, before/after telematics adoption | 2.9:1 before → 2.5:1 after (survey of 25 for-hire fleets) | Trade press / vendor-cited survey | 🟡 |
| "Ideal" dry van truckload ratio | ~3:1 traditionally; data-optimized fleets report ≤2.5:1 | Trade press / vendor content | 🔴 UNVERIFIED INDUSTRY LORE (no named primary study) |
| LTL trailer-to-tractor ratio | >2:1 for 56% of a 2018 survey; some CA fleets >4:1 | Trade press citing a 2018 survey (unnamed) | 🔴 UNVERIFIED INDUSTRY LORE |
| Trailer utilization target | "above 60%" as a redeployment/disposal threshold | Vendor blog content (Opsima) | 🔴 UNVERIFIED INDUSTRY LORE |
| Cube utilization industry norm | ~70% average; many operations 65–70% | Vendor/industry blog content | 🔴 UNVERIFIED INDUSTRY LORE |
| Driver detention frequency | Drivers detained on 39.3% of deliveries (2023 data) | ATRI, 2024 report ("New Research Documents Substantial Financial and Safety Impacts from Truck Driver Detention," truckingresearch.org, Sept 2024) | 🟢 |
| Total hours lost to detention (for-hire trucking) | >135 million hours in 2023; 117–209 hours/driver/year depending on sector | ATRI, 2024 | 🟢 |
| Industry cost of detention | $3.6B direct expense + $11.5B lost productivity in 2023; some framings put total >$15B/year | ATRI, 2024 | 🟢 |
| Detention rate charged to shippers vs. carrier operating cost | ~$63/hour charged vs. $66.65/hour operating cost | ATRI, 2024 | 🟢 |
| Detention fee charge vs. collection rate | 94.5% of fleets charge detention fees; <50% of those invoices get paid | ATRI-sourced, via trade press (TRADLINX), 2024 | 🟡 |
| Detention speeding correlation | Detained trucks driven 14.6% faster on average than non-detained trucks | ATRI, 2024 | 🟢 |
| Detention dispute documentation effect | Analysis of 3,100 detention disputes: party without timestamped check-in/out records loses ~70% of the time | Cited in secondary trade content; original study not independently confirmed in this pass | 🟡 (leaning 🔴 — could not trace to a named primary source) |
| CVSA International Roadcheck 2025 | 81.6% of vehicles, 94.1% of drivers passed with no OOS violations; vehicle OOS rate 18.1%; driver OOS rate 5.9%; 10,148 trucks and 3,342 drivers placed OOS | CVSA, 2025 (cvsa.org, FreightWaves) | 🟢 |
| Roadcheck 2025 — brake violations | Most-cited vehicle OOS violation category, 24.4% of vehicle OOS violations; 5,561 of 13,553 total vehicle OOS violations (41.0%) | CVSA, 2025 | 🟢 |
| Roadcheck 2025 — tire violations | 2,899 tire-related OOS violations, 2nd most common (21.4% of vehicle OOS violations) | CVSA, 2025 | 🟢 |
| 2024 nationwide defective-brake/tire citations | 50,501 citations for brakes ≥20% deficient; 40,623 citations for tires <50% max inflation/leaking | FMCSA-derived data cited in trade press, 2024 | 🟡 |
| CVSA Brake Safety Week 2025 | 15,175 inspections across 52 jurisdictions in North America; 2,296 vehicles OOS for brakes = 15.1% overall OOS rate (US: 14.9%; Canada: 17.8%; Mexico: 6.3%) | CVSA, 2025 (cvsa.org, FreightWaves, Trucking Info) | 🟢 |
| Trailer share of all roadside OOS orders | ~25% of all OOS orders trailer-attributable, chiefly brakes/tires | Trade press aggregation of FMCSA data | 🟡 |
| Cargo theft, US/Canada, 2024 | 3,625 reported incidents, +27% YoY; average value per theft $202,364 (up from $187,895 in 2023) | CargoNet/Verisk, Jan 2025 | 🟢 |
| Cargo theft, 2025 | Incident count roughly stable but confirmed-theft incidents +18% YoY (2,243 → 2,646); estimated losses ~$725M, +60% YoY; average value per theft $273,990 (+36% YoY) | CargoNet/Verisk, Jan 2026 | 🟢 |
| US trailer production, 2025 | ~64,000 units Q1, projected ~74,000 by Q3; August net orders 24,200 units (+55% MoM); backlog-to-build ratio fell to 3.6 months in August | ACT Research, 2025 (via Trailer Body Builders / FleetEquipment Mag) | 🟢/🟡 |
| Chassis "pool of pools" launch | DCLI, Flexi-Van, TRAC Intermodal interoperable pool launched March 1, 2015 | Trade press, widely reported | 🟡 |
| Street dwell threshold | 1–3 days = healthy; 4–6 = caution; 7+ = poor; >4-day average degrades marine-terminal-wide chassis availability | Trade press / vendor content, informal benchmark table | 🔴 UNVERIFIED INDUSTRY LORE (no named primary study for the specific day thresholds) |
| Reefer claim data | Temperature damage = ~30% of all container-vessel cargo claims (frequency); average reefer claim ~$38,000 after deductible (5-yr average) | Industry/insurer-sourced content (unnamed insurer study), trade press | 🟡 |
| Reefer spoilage-risk range | 25–50% "spoilage risk" cited for temp-controlled freight market | Vendor blog content | 🔴 UNVERIFIED INDUSTRY LORE |
| Trailer tracking ROI claims | "800% ROI"; site savings of $450K–$2.5M/year cited in case studies | Vendor case-study content (Tompkins Ventures et al.) | 🔴 UNVERIFIED INDUSTRY LORE (vendor-marketing sourced) |

---

## 6. Where Measurement Breaks Down Today

1. **Location without power.** A trailer/chassis has no engine and typically no vehicle electrical bus to draw from, so telematics devices must run on replaceable batteries (5–10 year life cited for battery units 🟡) or solar-assisted batteries. This forces infrequent, event-driven or scheduled reporting (hours, not seconds) rather than continuous streaming — a direct architectural consequence of the power constraint, and the reason unpowered-asset tracking is sold as a distinct product category from vehicle telematics (see "Telematics vs Asset Tracking" framing, gpx.co, 2025 🟡).
2. **Loaded vs. empty without a cargo sensor.** GPS alone tells you where a box is, not whether it's doing anything productive. Vendors have added door open/close sensors and cargo-presence/ultrasonic sensors (BlackBerry Radar, Samsara, Spireon) specifically to close this gap 🟡 — but sensor coverage is far from universal across the ~3.5-4.5M trailer population given the ~20% tracking penetration cited in the brief (Berg Insight 2023/24).
3. **Detention billing disputes over contested arrival/departure times.** Without automated, mutually trusted timestamps (geofenced gate/dock events), detention claims default to a documentation fight — the party without timestamped records reportedly loses the dispute most of the time (🟡, source not fully traceable). This is the single biggest reason <50% of invoiced detention actually gets paid despite >94% of carriers billing for it (ATRI 2024 🟢).
4. **Per-diem chassis billing disputes.** The UIIA governs >90% of intermodal chassis interchange and has a standing binding-arbitration Dispute Resolution Process specifically for per-diem/detention/M&R invoice disputes — the existence of a formalized, ongoing arbitration mechanism is itself evidence that billing accuracy is a chronic structural problem, not an edge case. 🟢 (process exists) / 🟡 (dispute volume/frequency not independently quantified in this pass).
5. **Yard inventory drift.** Trailers change custody across multiple parties (carrier, shipper, receiver, repair vendor, another carrier at interchange) with no single continuously-updated owner of "location of record" at each handoff. Manual gate logs and spreadsheets are the default without a YMS; industry content puts unassisted trailer-search time at 45–50 minutes with 2-3 people, versus ~2 minutes with a YMS 🟡 — though these figures are vendor-sourced and should be treated as directional, not exact.
6. **Reefer temperature proof for FSMA and cargo claims.** FSMA Rule 204 requires shippers/carriers of designated foods to keep detailed transit temperature records; reefer OEM telematics (Thermo King TracKing, Carrier Transicold DataLink 2) are positioned specifically to generate the audit trail and to counter false spoilage claims from customers (Samsara cites a named case of a distributor using its temperature reports to rebut false claims) 🟡 — but adoption is uneven, and a single missed pre-trip verification or a device/sensor failure can leave a real excursion undocumented, which is worse than no claim at all in a liability dispute.
7. **Battery life and device maintenance at scale.** Maintaining tracking hardware across thousands of unpowered, dispersed, weather-exposed assets is itself an operational burden — a battery unit dying mid-life means a silent tracking gap that isn't discovered until someone looks for the trailer. Device cost estimates found in this pass range roughly $14–$290 per unit hardware plus ~$7–$20/month subscription 🟡 (wide vendor variance, treat with caution), which sets the economics of the next point.
8. **The economics of tagging a low-value asset.** A trailer is worth a small fraction of a tractor, and a chassis often less than a trailer — so the tracking device, install labor, and subscription cost must be justified against a much smaller base asset value and (for pool operators) amortized across per-diem revenue rather than freight revenue. At ~20% tracking penetration across an estimated 3.5–4.5M trailer population (Berg Insight-derived figure, per task brief), the remaining ~80% is presumably judged not to clear this bar today — though no primary source in this pass explains the penetration ceiling directly; this is inference from the stated benchmark plus the cost figures above.

---

## Comparison Table: Dry Van vs. Reefer vs. Flatbed vs. Chassis

| Dimension | Dry Van | Reefer | Flatbed | Chassis |
|---|---|---|---|---|
| Typical owner | Carrier / private fleet / lessor | Carrier / private fleet (often carrier-owned given asset value) | Carrier / private fleet | Pool operator (TRAC, DCLI, Flexi-Van, XTRA) or motor-carrier-controlled |
| Relative asset value | Baseline | Higher (reefer unit adds significant cost) | Comparable to dry van, sometimes higher (specialized decking/tie-downs) | Generally lowest of the four |
| Power source | None (unpowered box) | Reefer unit has own diesel/electric engine + fuel tank, independent of tractor | None | None |
| Primary risk/loss driver | Cargo theft, damage, detention | Temperature excursion / spoilage, mechanical reefer failure, fuel-out | Cargo securement violations, load shift, weather exposure (open deck) | Roadability/mechanical defect at interchange, per-diem billing disputes |
| Distinctive metric | Cube/weight utilization, dwell, trailer-to-tractor ratio | Temperature compliance %, reefer fuel/runtime hours, pre-trip verification, cargo claim rate | Load securement compliance, tie-down inspection | Roadability compliance, per-diem billing accuracy, street dwell |
| Regulatory anchor | 49 CFR §396.17 annual inspection | 49 CFR §396.17 + FSMA Rule 204 (temp record-keeping) | 49 CFR §396.17 + cargo securement rules (49 CFR §393) | 49 U.S.C. §31151 roadability + UIIA + GIER/DVIR |
| OOS violation profile | Brakes and tires dominate (CVSA 2025: 24.4% brakes, 21.4% tires of vehicle OOS violations) | Same base trailer OOS profile + reefer-unit mechanical failure as an added risk | Same base OOS profile + cargo securement citations | Chassis-specific roadability defects caught at interchange DVIR |
| Telematics approach | GPS + cargo-presence sensor (door/ultrasonic) | GPS + OEM reefer telematics (Thermo King TracKing, Carrier DataLink 2) for temp/fuel/runtime | GPS + tie-down/load sensors (less mature market) | GPS/RFID for pool-return tracking + roadability DVIR data feed |
| Typical billing dispute | Detention (carrier vs. shipper/receiver) | Detention + cargo-claim liability (carrier/shipper/insurer) | Detention | Per-diem (motor carrier vs. IEP/pool operator) |

---

## Top-Level Findings

**The 10 metrics this segment lives or dies by:**
1. Trailer-to-tractor ratio
2. Dwell time by location
3. Detention time and detention billing recovery rate
4. Turn time at shipper/receiver/port
5. Yard inventory accuracy / lost-misplaced trailer count
6. Cube and weight utilization (load fill)
7. Reefer temperature compliance %
8. Tire/brake condition and FMCSA/CVSA out-of-service rate
9. Chassis per-diem billing accuracy and street dwell
10. Cargo theft rate and $ loss

**Top 3 measurement pain points:**
1. **Contested time and location records drive unpaid revenue.** Detention and per-diem billing disputes are structurally chronic (>94% of carriers bill detention, <50% get paid — ATRI 2024 🟢; UIIA maintains a standing binding-arbitration process for per-diem disputes 🟢) because arrival/departure timestamps are not automatically, mutually trusted between the parties who owe and are owed.
2. **Loaded/empty and "where exactly" are not directly observable from an unpowered box.** GPS position is comparatively easy; knowing whether the box is doing anything productive (loaded, in a usable location, not abandoned) requires additional sensors (door, cargo presence) that are only reaching a minority of the fleet (~20% overall tracking penetration cited in the brief, Berg Insight 2023/24).
3. **Yard/pool custody handoffs create data drift no single party owns.** Because trailers and chassis pass through multiple custodians (carrier, shipper, receiver, repair shop, interchange partner) with no continuously synced system of record, "what the system says" and "what's physically on the lot" diverge, and reconciling that gap today is largely a manual, labor-intensive process (vendor-cited: up to 30% of a yard jockey's shift spent searching for misplaced assets 🟡).

**How unpowered-asset measurement differs fundamentally from vehicle measurement:**
A tractor's telematics measures an active, powered, driver-operated machine in near-real time, off its own electrical system — the questions are almost all about *how well it is being operated right now* (speed, fuel burn, driver behavior, engine health). A trailer or chassis has none of that: no power to run frequent reporting, no driver to report status, and no engine health signal. Measurement instead has to (a) infer state indirectly — cargo presence from a door sensor rather than an engine sensor, "in service" from movement patterns rather than ignition state; (b) tolerate and design around low-frequency, battery-conserving reporting rather than continuous streams; (c) treat *location and custody* as the primary open question, not operational efficiency, because the asset is unattended most of its life and changes hands between organizations that don't share a system of record; and (d) size the entire tracking investment against a much lower per-unit asset value, which is the direct explanation for why tracking penetration across the trailer/chassis population remains around 20% (Berg Insight 2023/24) rather than near-universal as it is for powered trucks.

---

## Full Source List

- Berg Insight, trailer/cargo tracking installed base and forecast (via Telematics Wire), 2024 — https://telematicswire.net/berg-insight-the-installed-base-of-tracking-devices-for-trailers-containers-rail-freight-wagons-ulds-and-pallets-reached-11-million-in-2023/
- Berg Insight, Fleet Management in the Americas report PDF, 2024 — https://media.berginsight.com/2024/12/03204201/bi-fmam14-ps.pdf
- ATRI ("New Research Documents Substantial Financial and Safety Impacts from Truck Driver Detention"), Sept 2024 — https://truckingresearch.org/2024/09/new-research-documents-substantial-financial-and-safety-impacts-from-truck-driver-detention/
- ATRI detention survey call, March 2024 — https://truckingresearch.org/2024/03/atri-issues-call-for-truck-drivers-to-participate-in-detention-survey/
- Transport Topics, "ATRI Finds Truck Drivers Detained on 39% of Deliveries," 2023/2024 — https://www.ttnews.com/articles/atri-driver-detention-2023
- TRADLINX, "Over 90% Charge Detention. Fewer Than 50% Get Paid" — https://blogs.tradlinx.com/over-90-charge-detention-fewer-than-50-get-paid/
- Land Line Media, "Detention time: New study outlines true costs, consequences" — https://landline.media/magazine/detention-time-new-study-outlines-true-costs-consequences/
- CVSA, 2025 International Roadcheck results — https://cvsa.org/news/2025-roadcheck-results/
- FreightWaves, "CVSA's 2025 International Roadcheck Puts Fleets Under the Microscope" — https://www.freightwaves.com/news/cvsas-2025-international-roadcheck-puts-fleets-under-the-microscope
- CVSA, 2025 Brake Safety Week results — https://cvsa.org/news/2025-bsw-results/
- FreightWaves, "CVSA Brake Week 2025 Results Show 15% Failure Rate" — https://www.freightwaves.com/news/cvsa-brake-week-2025-results-show-15-failure-rate
- Truckinginfo/Heavy Duty Trucking, "15% of Trucks Put Out of Service During 2025 Brake Safety Week" — https://www.truckinginfo.com/news/15-of-trucks-put-out-of-service-during-2025-brake-safety-week
- Seubert, "Top Violations Causing Out-of-Service Orders in 2024" — https://www.seubert.com/blog/top-violations-causing-out-of-service-orders-in-2024/
- Simplex Group, "Brake Violations & Out-of-Service Data" — https://simplexgroup.net/brake-violations-out-of-service-data/
- CargoNet/Verisk, 2024 Supply Chain Risk Trends Analysis — https://www.cargonet.com/news-and-events/cargonet-in-the-media/2024-theft-trends/
- Verisk newsroom, "Cargo Theft Surges to Record Levels in 2024" — https://www.verisk.com/company/newsroom/cargo-theft-surges-to-record-levels-in-2024-verisk-cargonet-analysis-reveals/
- CargoNet/Verisk, 2025 theft trends / $725M losses — https://www.cargonet.com/news-and-events/cargonet-in-the-media/2025-theft-trends/
- Carrier Management, "Cargo Theft Surged 60% in 2025" — https://www.carriermanagement.com/news/2026/01/22/283728.htm
- Insurance Journal, "Cargo Theft Surges to Record Levels in 2024" — https://www.insurancejournal.com/news/national/2025/01/23/809322.htm
- Logistics Management, "IANA reports calendar year 2024 and December intermodal volume gains" — https://www.logisticsmgmt.com/article/iana_reports_calendar_year_2024_and_december_intermodal_volume_gains
- Intermodal.org (IANA), "Chassis Market Changes Focus on Pools, Efficiency" — https://www.intermodal.org/chassis-market-changes-focus-pools-efficiency
- Hilco Global, "Intermodal Chassis Market Demonstrates Pandemic Period Resilience" — https://hilcoglobal.com/perspective/intermodal-chassis-market-demonstrates-pandemic-period-resilience/
- FreightWaves, "IANA panel: Intermodal chassis squeeze easing, but it's far from over" — https://www.freightwaves.com/news/iana-panel-intermodal-chassis-squeeze-easing-but-its-far-from-over
- UIIA / Intermodal Association of North America, UIIA overview — https://intermodal.org/uiia
- UIIA Dispute Resolution Panel documentation — https://uiia.intermodal.org/documents/uiia/E.6.a.%20-%20PD.pdf
- UIIA Equipment Providers Free Days and Per Diem/Use Charges — https://highmountaintransport.com/Per%20Diem%20Document%5B1%5D.pdf
- IANA DVIR Recommended Practices ("Roadability Compliance") — https://uiia.intermodal.org/documents/dvir/IANA_DVIR_Recommended_Practices.pdf
- IANA Driver Vehicle Inspection Reporting Service (GIER/DVIR) — https://intermodal.org/gier/driver-vehicle-inspection-reporting-service
- Cornell LII, 49 U.S. Code §31151 (Roadability) — https://www.law.cornell.edu/uscode/text/49/31151
- Federal Register, IEP/motor carrier roadability requirements (2008 final rule) — https://www.federalregister.gov/documents/2008/12/17/E8-29254/requirements-for-intermodal-equipment-providers-and-for-motor-carriers-and-drivers-operating
- Supply Chain Dive, "Case accusing carriers, chassis pool operators of 'sweetheart deal' moves forward" — https://www.supplychaindive.com/news/ata-ocean-carriers-pool-operators-limiting-chassis-choice-fmc/583937/
- FreightWaves, "Pick your bottleneck: Ports, chassis, containers, labor" — https://www.freightwaves.com/news/pick-your-bottleneck-ports-chassis-containers-labor
- Green Worldwide Shipping, "Vessel Dwell, Terminal Dwell & Street Dwell FAQ" — https://www.greenworldwide.com/faq-what-is-the-difference-between-vessel-dwell-terminal-dwell-street-dwell/
- ACT Research / Trailer Body Builders, TTMA trailer forecasts — https://www.trailer-bodybuilders.com/whats-in-print/article/55056838/ttma-trailer-forecasts-from-act-ftr
- FleetEquipment Mag, "U.S. Trailer Industry Faces Challenging Times, According to ACT Research" — https://www.fleetequipmentmag.com/us-trailer-industry-2025-act-reseach/
- Samsara, Trailer Powered Asset Gateway product page — https://www.samsara.com/products/models/trailer-powered-asset-gateway
- Samsara blog, "Samsara for Thermo King and Carrier Refrigeration Units" — https://www.samsara.com/blog/samsara-for-thermo-king-refrigeration-units
- BlackBerry Radar, Trailer Tracking solution page — https://blackberryradar.com/solutions/trailer-tracking
- CCJ Digital, "The BlackBerry is back for asset, cargo monitoring" — https://www.ccjdigital.com/business/article/14936193/the-blackberry-is-back-for-asset-cargo-monitoring
- Spireon/Solera, Asset & Trailer Tracking pages — https://fleet-solutions.solera.com/asset-tracking-1/ , https://fleet-solutions.solera.com/trailer-tracking/
- CCJ Digital, "Complying with FSMA: an update of options for motor carriers" — https://www.ccjdigital.com/business/article/14933992/complying-with-fsma-an-update-of-options-for-motor-carriers
- Geotab, "Reefer trailer temperature monitoring: How it works and benefits" — https://www.geotab.com/blog/reefer-trailer-temperature-monitoring/
- TrucksOnTheMap, "Trailer Pool Management: How to Size, Track and Cost a Drop-Trailer Fleet" — https://trucksonthemap.com/trailer-pool-management/
- DataDocks, "Drop Trailer Programs vs Live Unload" — https://datadocks.com/posts/drop-trailer-vs-live-unload
- bobtail.com, "Live-Load Vs. Drop-And-Hook Trucking" — https://www.bobtail.com/blog/live-load-trucking/
- Yardview, "What Is a Yard Management System? Reducing Missing or Lost Inventory" — https://yardview.com/post/reducing-missing-or-lost-inventory-with-a-yms
- Tompkins Ventures, "Trailer Tracking Can Yield an 800% ROI" (vendor case-study content, treat as marketing) — https://tompkinsventures.com/trailer-tracking-can-yield-an-800-roi-really/
- Outrider, trailer inventory tracking press release — https://www.outrider.ai/press-releases/outrider-announces-trailer-inventory-tracking-technology-to-increase-distribution-yard-efficiency/
- Fulfill.com, "Cube Utilization: Definition, Calculation & Best Practices" — https://www.fulfill.com/glossary/cube-utilization
- APQC, "Full trailer-load or full container-load capacity utilization" benchmark measure — https://www.apqc.org/what-we-do/benchmarking/open-standards-benchmarking/measures/full-trailer-load-or-full-container
- Identec Solutions, "When a Reefer Unit Warms Up: Understanding Failures & Preventing Losses" — https://www.identecsolutions.com/news/when-a-reefer-unit-warms-up-understanding-failures-preventing-losses
- Heavy Vehicle Inspection, "Reefer Trailer Inspection Checklist: Pre-Trip & FSMA Guide" — https://heavyvehicleinspection.com/blog/post/reefer-trailer-pre-trip-checklist
- Heavy Vehicle Inspection, "Trailer Inspection Requirements: Daily, Annual & DOT Rules" — https://heavyvehicleinspection.com/blog/post/trailer-inspection-requirements-annual-daily
- Digital Matter, "Trailer GPS Trackers: Choosing the Right Battery-Powered Device" — https://www.digitalmatter.com/blog/trailer-gps-trackers-choosing-the-right-battery-powered-device
- gpx.co, "Telematics vs Asset Tracking: What Non-Powered Fleets Actually Need" — https://gpx.co/blog/telematics-vs-asset-tracking-non-powered-fleets/
- gpx.co, "Chassis Tracking for Intermodal and Drayage Fleets" — https://gpx.co/blog/chassis-tracking/
- TRAC Intermodal, corporate site (chassis pool manager) — https://www.tracintermodal.com/
- DCLI, corporate site — https://dcli.com/
- Supply Chain Dive, "DCLI to acquire TRAC Intermodal's chassis fleet" — https://www.supplychaindive.com/news/dcli-trac-intermodal-acquisition-chassis-fleet/508244/
- FreightWaves, "DCLI, FlexiVan launch asset sharing program" — https://www.freightwaves.com/news/dcli-flexivan-launch-asset-sharing-program

---

*Compiled from WebSearch snippet evidence only (WebFetch blocked by network egress policy per task constraints). No primary documents were opened directly; figures reflect how secondary sources report on primary studies (ATRI, CVSA, FMCSA, CargoNet/Verisk, Berg Insight, ACT Research, IANA). Numbers without a specific named study/report should be treated as directional industry commentary, not audited data.*
