> **STATUS: HYPOTHESIS DOCUMENT — NOT VERIFIED RESEARCH**
>
> This report contains **no live-sourced research**. The session-wide WebSearch
> budget (200 calls) was exhausted by earlier parallel agents before this task
> ran, and WebFetch was blocked by network egress policy. Every query issued by
> this agent failed. The content below is therefore drawn entirely from model
> knowledge with a January 2026 training cutoff.
>
> Treat it as a structured framework and set of hypotheses to be tested, not as
> findings. No number in it should be used for sizing, a business case or a
> go/no-go decision without a verification pass against USDA NASS and ERS, Iowa
> State Ag Decision Maker, Purdue, farmdoc Illinois, ASABE standards and AFBF's
> right-to-repair tracker.
>
> One specific correction the agent flagged: **Granular**, named in the research
> brief as an active farm management platform, was wound down by Corteva around
> 2023-2024. Confirm before citing it as a current system of record.
>
> The other nine segment reports in this set are search-sourced. This one is not.

# Segment A5 — Agriculture: Farm Equipment & Assets (US)

## ⚠️ Research-method note (read first)

This report was to be built on live WebSearch snippets (WebFetch is blocked by egress policy per instructions). In practice, **the WebSearch tool returned "budget exhausted (200 of 200 calls used)" on every query issued in this session before a single search for this report completed** — the quota is evidently shared across parallel research agents running in this same orchestration, and it was already spent by others before this task's queries ran. No live search evidence was obtainable for this report.

Everything below is therefore drawn from pre-existing model knowledge (training data, cutoff January 2026), **not** live-verified snippets. Per the confidence scheme requested:
- Nothing in this report qualifies as 🟢 (primary, freshly verified) — that would require an actual fetch/search this session, which was unavailable.
- Facts I hold with high confidence because they are stable, well-documented public-record items (statute names/dates, standard names, well-known institutional facts) are labeled 🟡 **(recalled, not live-verified this session)**.
- Specific numbers, percentages, and anything that moves year-to-year (adoption rates, commodity prices, machinery cost tables, custom rates) are labeled 🔴 **UNVERIFIED — recalled order-of-magnitude, confirm before use**, even where I have a reasonable memory of the figure, because these are exactly the values that go stale and that Iowa State/Purdue/USDA republish annually.
- I have flagged a few places where I know the landscape *changed* since these figures were established (e.g., Granular's shutdown) so the reader isn't misled by stale assumptions baked into the brief itself.

**Recommendation:** before this report is used for a go/no-go decision, re-run the six research questions with working search access against: USDA NASS Census of Agriculture (2022, quickstats.nass.usda.gov), USDA ERS ARMS precision-ag and farm expenditure reports, Iowa State Ag Decision Maker (extension.iastate.edu, files A3-10/A3-24), Purdue Crop Cost & Return Guide, ASABE D497.7, and AFBF's right-to-repair tracker.

---

## 1. The operating model — how farms make money

Row-crop farming's economics run in one direction: **agronomic outcome → revenue; equipment is a cost input subordinate to that outcome, not a revenue driver in itself.** This is the structural difference from every other fleet/asset segment in this study (trucking, construction, field service, etc.), where the asset's utilization *is* the revenue driver.

- **Revenue = yield (bu/ac or cwt/ac) × acres × price ($/bu), minus basis.** A farm doesn't sell "hours of combine operation"; it sells bushels. Every equipment decision is instrumental to maximizing bushels at acceptable cost, not an end in itself. 🟡
- **Margin per acre**, not revenue per acre, is the operating unit farmers and lenders actually think in: revenue per acre minus input costs (seed, fertilizer, crop protection chemicals, fuel, custom work, land rent/cash rent, machinery cost, labor, interest). Row-crop margins are notoriously thin and volatile — a few tens of dollars per acre in a bad year, over $100/ac in a good year — which is why every operation obsesses over cost per acre control rather than equipment utilization per se. 🔴 (magnitude only; commodity-price-dependent and needs current-year confirmation)
- **Input costs dominate the cost structure**: seed, fertilizer, and chemicals together are typically the largest cost categories on a corn/soybean budget — larger than the machinery line. USDA ERS's annual corn and soybean cost-of-production estimates break this out (direct/operating costs vs. overhead/machinery costs). 🔴 (needs current ERS table)
- **Crop insurance (Federal, via USDA RMA, sold through approved private insurers)** is a central financial institution for row-crop farms: revenue and yield-protection products (RP, YP) key off each farm's **Actual Production History (APH)** — a multi-year average yield per acre per field/unit. This creates a second, independent, high-stakes reason (beyond agronomy) that **yield per acre must be measured and documented accurately** — it sets the farm's insurance guarantee and claims. 🟡 (mechanism); specific participation rates 🔴.
- **The row-crop calendar is fixed by biology and weather, not by the operator**: a roughly 2–4 week planting window per crop (driven by soil temperature/moisture) and a roughly 2–4 week harvest window per crop (driven by grain moisture, weather, and competing acres), regionally shifted by latitude. Missing either window has a yield or quality cost that cannot be recovered by working harder afterward — this is the seasonality/timeliness point the brief calls out, and it is the single most important structural fact separating this segment from all others. 🟡
- **Custom operators and custom rates**: many farms — especially smaller operations, or larger ones at peak-load moments (spraying, combining) — hire custom operators (or hire out spare capacity) rather than own every machine. Published **custom rate surveys** (Iowa State, Purdue, Illinois, Kansas State) set the going $/acre rate for each operation (planting, spraying, combining, hauling, etc.) and are the reference price both custom operators and farms doing their own cost-benefit math use. 🟡 (surveys exist and are authoritative); rate levels 🔴 (need current-year survey).
- **Own vs. lease vs. custom-hire** is a capital-allocation decision made once a year or once every few years per machine class, weighed against: annual acres to cover, timeliness risk if self-owned equipment breaks in-window, cost per acre of ownership (depreciation + interest + repairs + insurance + housing) vs. custom rate, and resale/trade-in cycle. Dealers' finance/lease programs and equipment resale values are central inputs to this decision (see §4).
- **Equipment sharing / cooperatives** exist (informal neighbor-sharing of high-cost, low-annual-use machinery like tile plows or manure applicators; formal machinery-sharing arrangements and co-ops in some regions) but are a minority pattern next to custom hire and outright ownership, because timeliness risk (two farms needing the same machine in the same 5-day window) is a hard constraint on sharing during planting/harvest specifically — sharing works better for off-peak or one-pass operations. 🔴 (qualitative, not sourced to a specific study this session)
- **Farm size stratification (bimodal distribution)**: USDA data has long shown a small number of large commercial operations account for most production value while a large number of small farms (many "residence" or retirement farms with off-farm income as the primary household income source) hold most of the *farm count* but a small share of *production value*. This is exactly the bifurcation the brief describes for equipment/telematics: large commercial operations run new, connected equipment near OEM-telematics saturation; the numerically dominant small-farm population runs older, frequently unconnected equipment. 🟡 (directional pattern is well-established in USDA ERS's farm typology work); precise percentile splits 🔴 (need current ERS Farm Structure/typology report).

**Implication for equipment decisions**: a farm does not buy or maintain a planter to "increase machine utilization" — it buys/maintains it to guarantee that every acre gets planted inside the yield-optimal window, at the seeding rate/depth an agronomist specified, with the fewest possible skips/overlaps. Machine health, timeliness, and precision are means to an agronomic end. Any fleet-software framing built around classic utilization or uptime metrics will read as tone-deaf to this buyer unless translated into "acres covered per day" and "yield/quality risk avoided."

---

## 2. The metrics that drive this segment

| Metric | Formula | Unit | Why it matters / decision triggered | Confidence |
|---|---|---|---|---|
| **Yield per acre** | Harvested crop weight or volume ÷ harvested acres (from yield monitor/yield map or scale tickets) | bu/ac (or cwt/ac, ton/ac) | The single outcome metric the whole operation exists to produce; sets revenue, sets crop insurance APH, benchmarks agronomic and equipment decisions retrospectively | 🟡 concept / 🔴 any specific benchmark number |
| **Yield mapping** | GPS-tagged, per-second yield monitor readings interpolated into a spatial map of the field | bu/ac by grid cell | Diagnoses in-field variability (drainage, compaction, hybrid performance, planter skips) after the fact; feeds next year's prescriptions | 🟡 |
| **Cost per acre (total, and by operation)** | Total input + operating + machinery + labor + land cost ÷ acres; also broken out per pass (tillage $/ac, planting $/ac, spraying $/ac, harvest $/ac) | $/ac | The primary financial control variable farmers and lenders use instead of $/mile or $/hour; drives own-vs-custom-hire and machine replacement decisions | 🟡 concept, 🔴 levels (need ERS/extension tables) |
| **Field capacity — effective vs. theoretical** | Theoretical: Width(ft) × Speed(mph) ÷ 8.25 = ac/hr. Effective (actual): Theoretical × Field Efficiency | ac/hr | Determines how many acres a machine can realistically cover per day within a window — the core "can we finish in time" planning number | 🟡 (ASABE D497 standard formula) |
| **Field efficiency** | Effective field capacity ÷ theoretical field capacity | % (typically ~60–85% depending on operation) | Accounts for overlap, turning, refilling/unloading, idle repositioning; the agronomic-engineering analogue of "OEE" for field machines — ASABE D497 is the reference standard | 🟡 standard exists, 🔴 typical % ranges by operation (need current D497 table) |
| **Timeliness cost / yield penalty of off-window planting or harvest** | Yield loss (bu/ac or % of potential) as a function of days before/after agronomic optimum, from university trial regressions | bu/ac lost per day late (or $/ac/day) | Converts "the sprayer was down for 3 days" into a dollar number leadership actually reacts to — this is the metric a fleet vendor MUST be able to compute to be relevant here | 🟡 concept well-established in agronomy literature (e.g., Purdue/Iowa State planting-date studies), 🔴 specific slope values (crop/region/year specific, need current extension pubs) |
| **Equipment uptime during the critical window** (NOT annual uptime) | % of scheduled field hours the machine was operational during the ~2–4 week planting or harvest window specifically | % | Annual uptime is close to meaningless here (equipment sits idle most of the year *by design*); in-window uptime is the only uptime number with agronomic consequence | 🟡 framing, no published benchmark found |
| **Downtime cost, expressed as acres not covered per day** | Effective field capacity (ac/hr) × hours lost | acres/day (convertible to $ via timeliness-cost curve) | Translates a breakdown directly into "how much of the window did we just lose," the natively correct unit for this segment vs. $/day used elsewhere | 🟡 framing |
| **Fuel use per acre** | Gallons of diesel consumed ÷ acres covered, by operation | gal/ac | Second-largest energy-cost line after inputs on many machinery cost budgets; also a proxy for compaction/tillage intensity choices | 🟡 concept, 🔴 typical gal/ac values (need ASABE/extension fuel-use tables) |
| **Application accuracy: overlap/skip reduction from GPS guidance & section control** | % reduction in double-applied or missed area vs. manual driving, from GPS autosteer + boom/planter section control | % area saved, or $ input savings/ac | Directly reduces input cost (seed, chemical, fertilizer) and improves agronomic accuracy; one of the most quantifiable, provable ROI stories in ag tech and heavily marketed by OEMs and input companies | 🟡 mechanism well documented, 🔴 specific savings % (varies widely by field shape/report; commonly cited industry figures need re-verification) |
| **Variable-rate application (VRA) compliance** | As-applied rate vs. prescription rate, by GPS location | % compliance / rate deviation | Confirms the prescription an agronomist wrote was actually executed — ties the FMIS/agronomy layer to the equipment controller layer; a data-integration point, not a machine-health point | 🟡 |
| **Moisture and grain loss at harvest** | Grain loss monitor readings (kernels or lbs lost per unit area) and grain moisture % at intake, driven by combine settings (rotor/cylinder speed, concave clearance, fan speed, sieve settings) vs. crop condition | % loss of yield; % moisture | Directly reduces harvested yield if mis-set; moisture also drives drying cost and price docking at the elevator; extension rule-of-thumb conversions (kernels/sq ft → bu/ac) are widely published | 🟡 concept and existence of rule-of-thumb tables, 🔴 exact conversion constants (need current extension pub) |
| **Soil compaction** | Not a single number; proxied by axle load, tire/track footprint pressure, and field traffic pattern (esp. under wet conditions) | psi / traffic % of field | Compaction from ill-timed heavy-equipment passes (esp. grain carts at harvest) has multi-year yield drag — another way timeliness pressure (wanting to harvest in wet conditions) directly threatens future yield, not just current cost | 🟡 |
| **Equipment hours and depreciation per acre** | Machine depreciation (from cost tables, e.g., straight-line or ASABE depreciation schedules) ÷ annual acres covered | $/ac | Because annual hours are low and fixed by the window, depreciation per acre is highly sensitive to farm size (acres) — this is *why* farm size drives the make/lease/custom-hire decision more than utilization does | 🟡 |
| **Repair & maintenance cost per hour**, and its rise as machines age out of warranty | Cumulative R&M spend ÷ cumulative machine hours, tracked by age/hour bracket | $/hr | R&M cost curves rise sharply after warranty (~ machine-hour thresholds vary by class); extension machinery-cost tables (Iowa State, ASABE) publish age-based R&M multipliers used to decide trade-in timing | 🟡 concept and existence of tables, 🔴 specific multiplier values (need current Ag Decision Maker table) |
| **Parts availability lead time during season** | Days from parts order to install, tracked in-season vs. off-season | days | In-season parts delay directly consumes the timeliness window; dealer parts-counter proximity and inventory depth is a real competitive factor among OEM dealer networks, anecdotally more important to farmers than most spec sheets | 🔴 (qualitative/anecdotal, not a published benchmark found) |
| **Resale / trade-in value** | Market or auction-comparable value at trade-in vs. purchase price, by age/hours | $, or % retained value | A major farm capital-planning input: high resale value on late-model, well-maintained, low-hour, complete-service-history equipment lets farms run a shorter trade cycle at a similar net cost — auction data (e.g., machinery auction reporting services) and dealer trade appraisals are the reference source | 🟡 concept, 🔴 specific retained-value curves (need current auction/appraisal data) |
| **Operator availability and skill** | Not a standard formula; proxied by hired-labor headcount vs. peak-season machine-hours needed, and by variance in performance metrics (fuel/ac, overlap %, grain loss) across operators on the same machine | qualitative / variance metric | Skilled-labor shortage at planting/harvest is a widely cited operational risk; operator skill directly shows up in every agronomic-efficiency metric above (an inexperienced combine operator drives grain loss up) | 🔴 (directionally well known, no specific benchmark found) |
| **Precision-ag data metrics: as-applied maps, prescription compliance** | As-applied map (actual rate/location) vs. prescription map (planned rate/location by zone) | spatial %, or acres out-of-compliance | The record of *what actually happened agronomically*, used for input-cost reconciliation, insurance/regulatory documentation (e.g., nutrient management plans), and next season's prescription refinement | 🟡 |

### The 10 metrics this segment lives or dies by (my synthesis — see final message too)
1. Yield per acre (and yield map)
2. Cost per acre, total and by operation
3. Field capacity (effective, ac/hr) and field efficiency
4. Timeliness cost — yield penalty per day outside the optimal window
5. In-window equipment uptime (not annual uptime)
6. Downtime expressed as acres not covered per day
7. Grain loss % and moisture at harvest
8. Input-application overlap/skip % (GPS guidance/section control savings)
9. Variable-rate prescription compliance
10. Repair/maintenance cost per hour by machine age, and resulting trade-in timing

---

## 3. How they measure — cadence, workflow, systems of record

**Cadence is binary, not continuous** — the defining operational fact for a would-be software vendor:
- **In-season (roughly April–June planting, June–August spraying/scouting, September–November harvest, region-dependent)**: daily, sometimes hourly attention. Every day of good field conditions is a day to be maximized; every equipment issue is triaged immediately because the window is closing. 🟡
- **Off-season (roughly December–March)**: comparatively dormant for field operations. This is when annual crop-year planning happens (input purchase decisions, seed selection, equipment trade decisions, financing renewal) and post-harvest review (yield map analysis, cost-per-acre reconciliation, what worked/didn't). 🟡
- **Financial year**: aligns with the farm's fiscal year and its relationship with its **agricultural lender** (commercial ag lender or Farm Credit System institution), which typically requires an annual balance sheet, cash-flow projection, and sometimes historical yield/production records — but generally does NOT require granular equipment telematics data; lenders care about net worth, working capital, and debt-to-asset ratios, not machine uptime. 🟡

**Systems of record — and the central point for a fleet-software vendor**: the decisions in this segment are made in **Farm Management Information Systems (FMIS) and precision-ag/agronomy platforms**, not in anything resembling a fleet-management system:
- **John Deere Operations Center** — the dominant FMIS/telematics portal for Deere-equipped operations; aggregates machine data, as-applied/as-planted maps, and increasingly agronomic recommendations. 🟡
- **Climate FieldView (Bayer)** — brand-agnostic-ish agronomic data platform, strong on seed/agronomy tie-in given Bayer's Climate Corp/seed business. 🟡
- **Trimble Ag Software** — guidance/precision-ag hardware vendor's own FMIS. 🟡
- **Ag Leader SMS** — desktop/cloud precision-ag data management tied to Ag Leader's displays/controllers. 🟡
- **Granular** — ⚠️ note: Granular was Corteva's farm-management software business; **Corteva discontinued/wound down the Granular Business Solutions software in 2023–2024** (sold or shuttered parts of it) as part of a broader digital-ag retrenchment. If the brief's source list still treats Granular as an active major FMIS, that should be corrected before use. 🔴 (recalled, needs current verification — this is exactly the kind of fact that needs a live check)
- **Conservis** — farm ERP/grain-accounting-oriented FMIS for larger operations. 🟡
- **OEM telematics portals more broadly** — Case IH AFS Connect, AGCO Fuse (and constituent brands Fendt, Massey Ferguson, Challenger) — each largely locked to that OEM's own colour of iron, which is precisely the interoperability problem in §6. 🟡
- **Grain accounting / marketing systems** — separate from the FMIS in many operations, used to track bushels sold, contracts, basis, and elevator settlements.
- **Guidance and controllers** (autosteer displays, section control, planter/sprayer rate controllers) generate the raw as-applied data that flows (or fails to flow) into the FMIS.

**Implication for a fleet-software vendor**: the FMIS/agronomy platform, not a maintenance/fleet-tracking system, is where farm decisions get made and where the OEMs and ag-tech incumbents have already built the workflow and the data model (fields, hybrids, prescriptions, as-applied maps) around agronomic units (acres, bushels, rates) rather than fleet units (miles, hours, vehicles). A generic fleet-maintenance or telematics product entering this space is entering *underneath* an already-occupied decision layer — it can plausibly own "is the machine healthy enough to finish the window" but cannot easily displace or bypass the FMIS as the place yield, cost-per-acre, and agronomic decisions are made. Any positioning has to interoperate with (ideally, feed data into) the FMIS layer rather than compete with it.

---

## 4. Who owns each number

| Role | What they own / decide | Notes |
|---|---|---|
| **Farm owner/operator** | On the majority of US farms, this is one person (often with family labor) who is simultaneously the agronomist, the mechanic, the equipment buyer, the bookkeeper, and the operator. Owns essentially every number on the small-farm end of the spectrum. | Structural fact: unlike other fleet segments, there is frequently no role specialization at all. 🟡 |
| **Farm manager** (larger operations, or hired managers on absentee-owned land) | Coordinates labor, equipment scheduling across the window, and reports up to ownership/investors | More common on large commercial operations and on farmland owned by investors/institutions and professionally managed. 🟡 |
| **Agronomist / crop consultant** | Owns the agronomic prescription: seeding rate, hybrid/variety selection, fertility and chemical program, scouting, and interprets yield maps; increasingly independent (retail agronomist) or FMIS-vendor-affiliated | Sets the target the equipment must execute (rate, timing, placement) — the agronomist's plan is upstream of every equipment-execution metric. 🟡 |
| **Equipment dealer** | Far more central than in other segments: performs most major maintenance and warranty work, often holds the machine's telematics/diagnostic data by virtue of running the OEM portal, originates equipment financing/leasing, and drives trade-in valuation | The dealer relationship is arguably *the* dominant equipment relationship in this segment — a fleet-software vendor competes for a role the dealer already partially occupies (see §6, dealer-held maintenance data). 🟡 |
| **Custom operator** | Owns their own machine's performance metrics (acres/day, cost/acre they charge) and often runs a fleet at genuinely higher utilization than an individual farm because they aggregate acres across many customers' windows in sequence (following harvest north/south, e.g.) | Custom operators are actually closer to a "traditional fleet" utilization mindset than farm owner-operators are, because they chase acres across many farms sequentially — worth noting as a possible more-fleet-native beachhead sub-segment. 🔴 (my inference, not sourced) |
| **Agricultural lender** (Farm Credit System institution or commercial ag bank) | Sets annual reporting requirements: balance sheet, cash flow, debt service coverage; sometimes requires yield history / crop insurance documentation as loan collateral support | Lenders do not, as far as I'm aware, require or consume fleet-telematics-style reporting — their unit of analysis is the whole-farm balance sheet, not the machine. 🟡 |

---

## 5. Benchmarks

Given the tool failure, I cannot supply freshly pulled numeric benchmarks with confidence. What follows lists **which sources are the right ones to pull specific numbers from** (these are genuinely the authoritative, free, primary sources the brief correctly identifies), plus the handful of numbers I hold with reasonable (but unverified-this-session) confidence.

| Item | Value recalled | Source (should be re-verified live) | Confidence |
|---|---|---|---|
| US farm count | ~1.9 million farms | USDA NASS, 2022 Census of Agriculture | 🟡 (this specific figure is widely reported and matches the brief's own framing) |
| US farmland | ~880 million acres (declining slightly from 2017 census) | USDA NASS, 2022 Census of Agriculture | 🔴 (recalled, re-verify) |
| Farm production concentration | A small share of farms (large-scale operations) account for a large majority of production value; a large share of farms are small/very-small and contribute a small share of value | USDA ERS, "America's Diverse Family Farms" annual report / Farm Structure and typology data | 🟡 directional, 🔴 exact percentages |
| Field efficiency ranges by operation | Roughly ~60–70% for planting/harvesting-type operations with more turns/stops, ~75–90% for simpler continuous operations (e.g., some tillage, spraying with wide booms) | ASABE D497.7, "Agricultural Machinery Management Data" | 🔴 (order of magnitude only; the standard itself, and its existence, is 🟡) |
| Machinery cost estimation methodology (depreciation, R&M, fuel, per-hour and per-acre) | Standard methodology exists and is republished annually | Iowa State University Extension, Ag Decision Maker, "Estimating Farm Machinery Costs" (File A3-24), and Iowa Farm Custom Rate Survey | 🟡 (source exists and is authoritative); 🔴 for any specific $/hr or $/ac figure (published annually, changes with steel/fuel/interest costs) |
| Custom rate surveys (comparable to Iowa State's) | Exist and are widely used as the reference price for custom work | Purdue Crop Cost & Return Guide / Purdue custom rates; University of Illinois farmdoc "Illinois Farm Custom Rates"; Kansas State custom rate survey | 🟡 sources exist; 🔴 specific $/ac rates |
| AFBF–John Deere MOU on right to repair | Signed January 2023; a non-binding memorandum committing Deere to provide farmers and independent repair shops access to diagnostic tools, manuals, and software for self-repair, while reserving OEM control over emissions/safety-critical software modification | American Farm Bureau Federation press materials, January 2023 | 🟡 (well-documented, high-confidence recall of the event and its rough terms; exact clause language should be re-verified) |
| Colorado agricultural right-to-repair law | Colorado enacted the first state-level agricultural equipment right-to-repair law in 2023 (HB23-1011), effective January 2024, requiring manufacturers to make manuals, parts, and diagnostic software available to owners and independent repair shops | Colorado General Assembly | 🟡 (high confidence on existence/timing; should re-verify bill number and effective date) |
| Subsequent state legislation | Multiple other states introduced similar ag right-to-repair bills after Colorado (2023–2025); I do not have reliable, current knowledge of exactly which additional states had *passed* ag-specific right-to-repair laws by September 2026 | Needs live tracking — AFBF and PIRG/Repair.org maintain right-to-repair legislation trackers | 🔴 (explicitly flagging: do not assume any specific state beyond Colorado without re-verification) |
| John Deere/OEM telematics penetration on new large equipment | Very high / "near-saturated" on new large row-crop equipment (matches the brief's own framing) — but I do not have a reliable current percentage | OEM investor materials / AEM | 🔴 |
| Precision-ag adoption (GPS guidance/autosteer, yield monitors, variable-rate technology) | GPS guidance and yield monitors have high adoption among larger corn/soybean operations; variable-rate technology adoption is meaningfully lower than guidance/monitoring adoption | USDA ERS, ARMS-based precision agriculture reports (e.g., "Precision Agriculture in the Digital Era," and periodic updates) | 🟡 directional pattern (guidance > monitoring > VRT in adoption ranking is a consistent, long-standing finding); 🔴 specific adoption percentages |
| AEM (Association of Equipment Manufacturers) equipment shipment data | AEM publishes monthly/annual US ag equipment unit shipment data (tractors by horsepower class, combines, etc.) | AEM Ag Tractor and Combine Report | 🟡 source exists and is the standard trade reference; 🔴 current unit numbers |

**Bottom line on benchmarks**: the brief is correct that this segment has unusually good, free, authoritative primary sources (land-grant extension, USDA, ASABE) — but I was not able to pull a single current number from them this session. A follow-up pass with working search (or direct navigation to extension.iastate.edu/agdm, purdue.edu ag econ, farmdoc.illinois.edu, ers.usda.gov, and asabe.org) should replace essentially every 🔴 in this section before the report is used for sizing or benchmarking decisions.

---

## 6. Where measurement breaks down today

1. **Machine activity ≠ agronomic outcome.** Knowing a planter ran — even knowing it ran at the right speed, in the right field, on the right day, with section control engaged — is not the same as knowing the stand established, emerged evenly, and will yield well. The gap between "as-planted map" and "actual stand count/yield" can only be closed by later scouting or by the eventual yield map, weeks to months later. Any fleet-software metric that stops at "machine operated correctly" is answering a proxy question, not the real one — and farmers know this, which limits how much confidence they place in equipment-only telemetry as a performance signal. 🟡 (structural argument)

2. **The majority of the installed base is unconnected**, and there is no good answer for how performance is measured on it. Older tractors/combines/planters without factory telematics are tracked, if at all, via: manual paper or spreadsheet logs of hours and passes, the operator's memory and judgment, aftermarket telematics/hardware retrofits (a real but limited product category), and dealer service records at time of repair. For these operations, "measurement" is largely informal, experience-based, and reactive rather than instrumented — which is both the gap a third-party vendor could fill and the reason such a product has to be radically cheap and simple to be worth adopting on a machine used six weeks a year. 🟡

3. **OEM data lock-in and right-to-repair constraints directly gate third-party access.** The 2023 AFBF–Deere MOU addressed *repair* access (manuals, diagnostic tools, parts) but did not, to my knowledge, mandate open API access to the *telematics/operational data stream* itself for competing software platforms — repair access and data-platform access are legally and practically distinct asks. Colorado's law and any state that follows it are aimed at the repair-access problem (right to fix your own machine), not necessarily at forcing OEMs to open their cloud data to third-party FMIS or fleet-software competitors. This means: (a) a fleet-software vendor's access to Deere/Case/AGCO machine data likely still runs through OEM-controlled APIs (e.g., Deere's Operations Center API program, which is subject to Deere's own commercial terms and partner approval) rather than a legal right of access, and (b) the right-to-repair movement, while important and directionally favorable to openness, should not be assumed to solve the data-API problem for a software vendor. 🔴 (this is an inference about the *scope* of right-to-repair law vs. data-API access — a genuinely important distinction to re-verify with current legal/API-terms sources before relying on it)

4. **Interoperability across mixed-colour fleets is a real, only-partially-solved problem.** Most working farms run more than one brand (e.g., a Deere planter behind a Case tractor, or a mixed fleet accumulated through trade-ins and estate purchases). Two standards efforts address this: **ISOBUS (ISO 11783)**, the implement-to-tractor communication standard enabling cross-brand implement control, and **ADAPT** (Ag Data Application Programming Toolkit), an open-source data-format translation layer championed by **AgGateway** to let different FMIS/equipment data formats interoperate. Both are real, credible industry efforts, but neither fully eliminates the practical friction of moving data between OEM ecosystems — brand-specific portals, proprietary file formats, and commercial incentives to keep growers inside one ecosystem all persist alongside the standards. 🟡 (existence and purpose of ISOBUS/ADAPT/AgGateway); 🔴 (how complete/effective interoperability actually is in practice today)

5. **Measuring timeliness cost credibly is hard.** The yield-penalty-per-day-late curves that would make "downtime cost" a rigorous, defensible number are field/soil/weather/hybrid-specific and only exist as regional/average regression curves from university trials — applying them to a specific farm's specific delay in a specific year requires assumptions a farmer may reasonably distrust ("my field is different"). A vendor claiming to quantify "this breakdown cost you $X" is making an inherently probabilistic claim dressed as a precise number, and needs to be transparent about the uncertainty rather than oversell precision.

6. **Dealer-held maintenance data is a real barrier and a real opportunity.** Because dealers do most major service and hold OEM diagnostic/telematics access, a farm's own maintenance history is often more complete in the dealer's system than in anything the farm controls — mirroring (and probably exceeding) the "who holds the data" problem seen in other equipment-dealer-mediated segments. A third-party vendor either needs a data-sharing relationship with dealers (hard, since dealers profit from being the service/data chokepoint) or needs to rebuild maintenance history from scratch with the farm, starting from zero.

7. **The six-week-a-year economics are brutal for SaaS.** A farm's core equipment is decision-critical for a few weeks and functionally irrelevant the rest of the year. This argues against a per-seat or flat-annual-fee SaaS model priced like an always-on fleet product, and toward: usage-based/seasonal pricing, bundling into something used year-round (e.g., the agronomy/FMIS layer, which *is* used off-season for planning), or targeting the sub-segment (custom operators, dealers, large multi-farm operations) whose usage pattern is closer to continuous.

---

## Large-commercial vs. small-farm comparison

| Dimension | Large commercial operation | Small / majority farm |
|---|---|---|
| Equipment age & connectivity | New-ish, high-horsepower equipment; OEM telematics (JDLink/Operations Center, AFS Connect, Fuse) near-saturated | Older, often pre-telematics equipment; little to no factory connectivity |
| Data availability | Rich as-planted/as-applied/yield-map data flowing into an FMIS | Little to no digital data; paper/memory-based records |
| Equipment strategy | Own a full line, shorter trade cycle, sometimes multiple machines of the same class for window capacity/redundancy | Own fewer, older machines; heavier reliance on custom operators and neighbor sharing; longer trade cycle (or never trades) |
| Who runs the numbers | Often a farm manager plus agronomist/consultant, using an FMIS actively | Owner-operator doing everything personally, often informally |
| Role of the dealer | Strong relationship, but operation has some independent capacity (own mechanics, shop) | Dealer often IS the maintenance department, by necessity |
| Financing / lender relationship | More sophisticated reporting, sometimes multiple lenders/leases | Simpler balance sheet, single lender relationship, sometimes no formal financing |
| Fit for third-party fleet software | Already served/being served by OEM + FMIS incumbents; a fleet vendor must offer something the FMIS doesn't (e.g., cross-brand health/timeliness view) | Not currently instrumented by anyone; needs something radically simple/cheap given ~6-week annual usage, and often lacks the connectivity (telematics hardware) for a software-only product to attach to at all |

*(All qualitative; not tied to a specific published study this session — 🔴 for any implied percentages, 🟡 for the general shape, which is stated as fact in the brief itself and consistent with well-established USDA farm-structure findings.)*

---

## Source list

Because live search failed, I cannot provide URLs I actually fetched or saw in a snippet this session. Listed below are the sources that **should** be consulted to fill in and verify every 🔴 and 🟡 item above — these are the correct, authoritative targets named in the brief and recalled from training knowledge, but no live URL/snippet was retrieved for any of them in this session:

- USDA NASS, 2022 Census of Agriculture — https://www.nass.usda.gov/AgCensus/
- USDA ERS, Farm Production Expenditures and machinery cost data — https://www.ers.usda.gov/
- USDA ERS, ARMS-based precision agriculture adoption reports — https://www.ers.usda.gov/topics/farm-practices-management/technology-research/precision-agriculture
- USDA RMA, crop insurance / Actual Production History methodology — https://www.rma.usda.gov/
- Iowa State University Extension, Ag Decision Maker — https://www.extension.iastate.edu/agdm/ (machinery cost estimates, custom rate survey)
- Purdue University Center for Commercial Agriculture — Crop Cost & Return Guide, custom rates — https://ag.purdue.edu/commercialag/
- University of Illinois farmdoc, Illinois Farm Custom Rates — https://farmdoc.illinois.edu/
- Kansas State University Extension, custom rate survey — https://www.agmanager.info/ (or ksre.k-state.edu)
- ASABE, D497.7 "Agricultural Machinery Management Data" standard — https://www.asabe.org/
- AEM (Association of Equipment Manufacturers), Ag Tractor and Combine Report — https://www.aem.org/
- American Farm Bureau Federation, right-to-repair MOU and tracker — https://www.fb.org/
- Colorado General Assembly, HB23-1011 (agricultural right-to-repair) — https://leg.colorado.gov/
- AgGateway (ADAPT, data interoperability) — https://www.aggateway.org/
- ISOBUS / AEF (Agricultural Industry Electronics Foundation) — https://www.aef-online.org/
- John Deere Operations Center — https://www.deere.com/en/technology-products/precision-ag-technology/data-management/operations-center/
- Climate FieldView (Bayer) — https://www.climate.com/
- Trimble Ag Software — https://agriculture.trimble.com/
- Ag Leader SMS — https://www.agleader.com/

**None of these were actually fetched this session; treat every specific figure above as needing confirmation against them.**
