# Where to disrupt: the biggest underserved need in for-hire trucking and private fleets

September 2026. This builds on the segment research on branch
`claude/fleet-segments-research-nxavs0` (see `03-seg-v1-forhire-trucking.md`,
`03-seg-v2-private-fleet-distribution.md`, `04-synthesis-vehicles.md`).

**Evidence caveat.** WebFetch was blocked again (`EGRESS_BLOCKED` on
truckingresearch.org), so every figure below comes from search-result snippets
of named sources, not from reading the primary documents. Treat numbers as
"secondary, directionally reliable". Figures marked *(calc)* are my own
arithmetic on the cited inputs.

---

## The answer in one paragraph

**Carriers have bought safety technology, but they cannot turn it into money.**
These fleets are the most instrumented in the US: 88% use telematics for safety,
and 89% of private fleets run in-cab cameras and collision warning. Crash rates
are falling. Yet liability premiums keep rising: +18.6% per mile from 2021 to
2024 while truck crash rates fell 2.6% (ATRI, May 2026). Three parties decide a
carrier's economics: the insurer, the broker, and a jury. None of them can see
the carrier's safety record in a form they trust. Only 30% of fleets share
telematics data with insurers, and 79% of those who don't say that **no one
asked** (SambaSafety, Oct 2025). The underserved need is for a **portable,
carrier-owned, vendor-neutral record that proves the fleet is safe**. It would
turn safety spend into lower premiums, a place on broker approved-carrier lists,
and a stronger defence after a crash. The data already exists on the fleet's
devices. What is missing is the layer that turns that data into proof other
parties accept.

---

## 1. Why this problem is the biggest

### It is the cost line that decides whether a fleet makes money

| Fact | Figure | Source |
|---|---|---|
| Truckload operating ratio | ~99.8–100%+ (near breakeven) | Marten 10-Q via trade press, 2025 |
| Liability premium, all fleets | 10.2¢/mile (2024), +18.6% since 2021 | ATRI *Trucking's Rising Insurance Costs*, May 2026 |
| Liability premium, fleets ≤25 trucks | **20.3¢/mile**, about twice what 101–250-truck fleets pay (10.4¢) | ATRI via CCJ, 2026 |
| Insurance as a share of revenue, small fleets | **~5% of asset-based revenue** | ATRI via CCJ, 2026 |
| Per-mile liability losses | +33.1% (2021–2024) | ATRI, 2026 |
| Excess layers ($5–10M, $10–15M) | +34% and +45% per mile | ATRI, 2026 |
| Fleets forced to buy more layers to keep the same limit | 33.3% | ATRI via CCJ, 2026 |
| Median nuclear verdict | $36–51M, against $21M in 2020 | Multiple, 2025–2026 |

**The margin arithmetic.** In truckload, the operating ratio sits at about 100%.
A small carrier pays about 5% of its revenue for insurance. **For small
carriers, the insurance bill is larger than the profit.** *(calc)* At ATRI's
85,991 miles per truck per year:
- An average fleet pays about **$8,800 per truck per year** for liability cover.
- A fleet of 25 trucks or fewer pays about **$17,500 per truck per year**.
- Moving that premium by 10% is worth **$900–1,750 per truck per year**, which
  is 2–4 times a typical telematics subscription.

### The industry ranks it at the top

ATRI's *Critical Issues in the Trucking Industry 2025* surveyed more than 4,200
respondents. **Lawsuit abuse reform ranked #2 and insurance cost/availability
#3**, behind only "the economy", which no product can change. Insurance rose
eight places in a single year. On the private-fleet side, NPTC 2026 found that
**73% of private fleets name safety as their #1 operational challenge**.

### Buying more technology has not fixed it

- 88% of fleets use telematics for safety, and **70% run two or more safety
  devices**. **66% say their top telematics problem is interpreting the data
  and acting on it**, not collecting it (SambaSafety 2025).
- Underwriters give credit for evidence that a safety programme is working,
  not for owning the equipment. That evidence includes coaching records tied to
  camera events, 90+ days of behaviour trends, and proof that ADAS is
  calibrated. Sending a raw export from a device "proves that the system
  produces data but doesn't prove that the operation is safer" (Trucordia,
  2026).
- ATRI found **six ADAS technologies statistically linked to lower per-mile
  liability losses**, with forward collision warning showing the strongest
  link. The value is real and measurable, but no one packages it for the
  underwriter.
- Progressive stopped new enrolments in its Motive dashcam discount (worth
  15–22% combined) on 1 July 2026. Discounts tied to a single vendor are
  unstable, so a fleet's safety credit should not depend on one telematics
  brand.

### Since mid-2026, the same gap also costs carriers freight

- In **Montgomery v. Caribe Transport II** (May 2026), the Supreme Court held
  that brokers can be sued in state court for negligently selecting a carrier.
- In July 2026, a Dallas jury returned a **$604M verdict against C.H. Robinson**
  for negligent carrier selection. The carrier had a Satisfactory rating and
  270 clean loads, but plaintiffs pointed to its CSA alert signals.
- Brokers are moving to **"whitelisting defensible carriers"**, meaning
  carriers that would look good to a jury (Overdrive, 2026).
- **Landstar cut its approved carriers from about 100,000 to about 64,000
  (−35%)**. T.D. Cowen expects shippers and brokers to concentrate on a smaller
  pool of heavily vetted carriers.

A small carrier with a clean record that cannot prove it now loses on two
fronts:
- It pays about twice the per-mile premium of a mid-size fleet.
- It gets cut from the approved-carrier lists that supply its loads.

**One proof asset addresses both problems, and a third: the defence after a
crash.** Dash-cam footage on loop recorders can be overwritten within 1–3 days,
and ECM data within about 30. If that evidence is lost after the fleet is on
notice of a claim, courts can impose spoliation sanctions. The fleet then pays
for the cameras, loses the footage that would clear the driver, and a jury may
treat the gap as concealment.

---

## 2. Why this beats the other candidates

I scored each candidate on four questions. How much money is at stake? How
poorly is it served today? Can the carrier act on it? Does it fit a
software-and-data company?

| Candidate pain | Size | Served today | Can the carrier act on it? | Verdict |
|---|---|---|---|---|
| **Safety not turning into insurance and freight access** | ~5% of revenue for small fleets; nuclear-verdict tail risk; lost broker access | **Poorly.** Insurer-side and broker-side scores exist; nothing is carrier-owned and vendor-neutral | **High.** The data is already on the trucks | **Pick** |
| Detention / dwell | $15.1B a year (ATRI, 2023 data); <50% of detention invoices paid | Moderately. Dock scheduling (Opendock/Loadsmart) and TMS billing tools exist | **Low.** The fix sits with the shipper, and the carrier's leverage is contract terms | Real but hard to win from the carrier side |
| Cargo theft and freight fraud | $725M in theft losses in 2025 (+60%); ~$18M a day in fraud (Highway) | Well served. Highway serves 70 of the top 100 brokers; Carrier Assure; RMIS | Broker is the buyer, not the carrier | Crowded; wrong buyer |
| Unplanned downtime / maintenance | ~8.7 days per truck per year; $448–760 per day; 77% of private fleets outsource maintenance | Well served. Fleetio, Decisiv, OEM remote diagnostics, lessors | Medium. The problem shifts to lessors (full-service leasing rose from 28% to 42%) | Crowded; lessors own it |
| Driver turnover | 90–95% at large truckload fleets; 35% of new hires quit within 90 days | Mostly a pay and HR problem | Low software leverage | Not a software wedge |
| Mileage reconciliation across ELD, TMS, IFTA and odometer (prior research) | Hours per quarter | Many point tools | High | Real but low value; better as a feature |
| Data overload / device sprawl | 66% can't act on their data | Being addressed by the incumbents' AI features | — | **A symptom of the pick, and its entry point** |

The key distinction: detention, fraud and downtime are **operations problems
that already have operations tools**. The insurance and liability problem is a
**trust problem between parties**. Samsara, Motive and Lytx sell to one party,
the fleet, and each sees only its own devices. That structure is why the gap is
still open in the most penetrated segment in fleet software.

---

## 3. How it plays out in each segment

| | For-hire trucking | Private fleets |
|---|---|---|
| Who feels it most | Carriers with 5–250 trucks. They are big enough to run ELDs and cameras, but too small for captives or large self-insured retentions, so they pay about 2x per mile | Large fleets with deep pockets, which makes them nuclear-verdict targets. Many carry large self-insured retentions, and 73% rank safety #1 |
| Most valuable outcome | Lower premium at renewal, and staying on broker whitelists | Lower loss costs and stronger litigation defence. Evidence for the monthly "should we own this fleet" review, since a documented safety record is part of the case against outsourcing |
| Buyer | Owner or CFO, with the VP Safety | VP Safety / Risk Manager, with Legal and Finance |
| Channel | Insurance agents and MGAs, since 79% of fleets that don't share data were never asked for it (about 55% of all fleets); broker onboarding platforms | Direct sales; the risk-management function; captive managers |
| Emerging adjacency | Access to group captives, which want members that can prove strong loss control | Group and agency captives for mid-size fleets |

**Start with for-hire carriers of 10–250 trucks at insurance renewal.** Their
pain is sharpest (20.3¢ a mile, and cuts from broker lists). There is a hard
deadline every year: the renewal date. And the value is easy to count in
dollars. Private fleets come second, sold on litigation defence and
self-insured loss control.

---

## 4. The product this implies

A **carrier-owned "defensibility record"** that sits on top of whatever devices
the fleet already runs. It does not replace Samsara or Motive.

1. **Ingest from any source.** ELD and camera platforms (Motive, Samsara, Lytx,
   Netradyne and others), maintenance and ADAS calibration logs, driver MVR and
   CSA data, and coaching completions.
2. **Show the safety programme working.** Link each risky event to a coaching
   action and the behaviour change that followed. This is what underwriters say
   they want, and what a raw export cannot show.
3. **Produce three outputs from one record:**
   - An **underwriting-ready renewal packet** with at least 90 days of trends,
     ADAS coverage and calibration evidence, and benchmarks with named sources
     (following the prior research's rule of showing provenance).
   - A **"defensible carrier" credential** that the carrier shares, with
     permissions, into broker onboarding (RMIS, Highway, MyCarrierPackets,
     DAT).
   - An **automatic litigation hold**: on any crash or harsh event, lock and
     hash the video, ECM, HOS and dispatch records within minutes, before loop
     recorders overwrite them.
4. **Business model options.** Charge a share of documented premium savings,
   or sell through agents and MGAs who need a reason to start the data
   conversation.

### Competitors and the gap they leave

| Player | What they do | What they leave open |
|---|---|---|
| TruckerCloud FleetFile | Vendor-neutral crash-risk score, filed as a rating variable | Sold to the **insurer**; the carrier doesn't own or build its case |
| CMT Freight Safety Intelligence | 90-day telematics score for **brokers** | Broker-side only; no insurance or litigation use |
| Nirvana ($1.5B valuation, >$100M premium) | Insurer that prices on telematics | Only helps if you insure with Nirvana; 26–27 states |
| Samsara–Northland, Motive–Sentry and Progressive programmes | Insurance discounts tied to one vendor | Single-vendor, and unstable (Progressive ended its Motive programme) |
| Highway, Carrier Assure, RMIS | Identity and compliance vetting | Built on FMCSA public data and identity checks, not operating behaviour |

**The white space is the carrier's side of the table.** Insurers and brokers
each have their own risk score. The carrier has nothing it owns to put in front
of all three audiences: insurer, broker and jury. The existence of these
competitors supports the need. None of them is positioned as the carrier's
advocate.

---

## 5. Risks and what would disprove this

| Risk | Why it matters | Mitigation or test |
|---|---|---|
| Insurers don't price the packet | ATRI attributes much of the cost rise to "social inflation" (verdict severity), not crash frequency | Lead with severity: exoneration footage and litigation holds. Test: an A/B test of submissions with 3–5 MGAs |
| Incumbents build it | Samsara and Motive already have insurer partnerships | Stay vendor-neutral: 70% of fleets run 2+ devices, and single-vendor discounts proved unstable |
| Carriers fear sharing data | Bad data could also be seen | Carrier owns the record and controls what is shared. Start with fleets that know they are good (the self-selection is part of the value) |
| Regulatory change | Tort reform or a federal carrier-selection standard (sought by TIA and C.H. Robinson) | A federal standard would **raise** the value of standardised proof |
| Evidence quality | All figures are from search snippets | Re-verify ATRI (May 2026), SambaSafety (Oct 2025) and NPTC (2026) against the primary reports before any external use |

## 6. Next validation steps (about 3 weeks)

1. **15 carrier interviews** (10–250 trucks, renewal within 90 days). Ask what
   they sent at their last renewal and what the underwriter asked for. Have
   they lost broker access since Montgomery?
2. **5 agents or MGAs.** Would a standard vendor-neutral packet change pricing
   or their willingness to quote? Why do they rarely ask fleets for data? (Only 15% of brokers offer telematics services.)
3. **3 broker compliance leads.** What would make a carrier "defensible" enough
   to whitelist? Would they accept a credential the carrier shares with
   permissions?
4. **Concierge test.** Build a renewal packet by hand for 3 carriers from their
   existing Motive or Samsara exports and track the premium outcome.
   **Success metric:** a premium change at renewal attributable to the packet,
   or reinstatement on a broker's approved list.

---

## Sources

- ATRI, *Trucking's Rising Insurance Costs: Issues and Opportunities* (May 2026): [ATRI](https://truckingresearch.org/2026/05/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs/), [HDT](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising), [CCJ – safe fleets paying record rates](https://www.ccjdigital.com/business/insurance/article/15825494/why-safe-trucking-fleets-are-paying-recordhigh-insurance-rates), [Truckers News](https://www.truckersnews.com/news/article/15825499/atri-study-finds-insurance-rates-up-186-while-crash-rates-down-26), [FleetOwner](https://www.fleetowner.com/news/news/55378757/atri-examines-fleet-risk-strategies-as-commercial-truck-insurance-costs-rise)
- ATRI, *Critical Issues in the Trucking Industry 2025*: [PDF](https://connect.ncdot.gov/resources/BUILD2026-I77Surry/Documents/ATRI-Top-Industry-Issues-2025.pdf), [TT](https://www.ttnews.com/articles/atri-trucking-issues-2025), [Carrier Management](https://www.carriermanagement.com/news/2025/11/04/281123.htm)
- SambaSafety 2025 Telematics Report: [press release](https://www.globenewswire.com/news-release/2025/10/15/3167243/0/en/88-of-Fleets-Now-Use-Telematics-for-Safety-But-Only-30-Share-Data-with-Insurers.html), [why fleets won't share](https://sambasafety.com/blog/why-fleets-wont-share-telematics-data), [Trucking Dive](https://www.truckingdive.com/news/survey-finds-fleets-struggle-to-use-telematics-data/821388/)
- NPTC 2026 Benchmarking: [FleetOwner](https://www.fleetowner.com/operations/article/55406770/private-fleets-lock-in-supply-chain-control-nptc-benchmarking-report), [Platform Science](https://www.platformscience.com/blog/3-key-takeaways-from-nptc-2026)
- Underwriter evidence expectations: [Trucordia](https://www.trucordia.com/blog/your-safety-investment-deserves-more-credit-at-renewal), [TT – mitigating insurance costs](https://www.ttnews.com/articles/insurance-cost-mitigation)
- Progressive ends Motive programme: [FreightWaves](https://www.freightwaves.com/news/10-discount-gone-progressive-ends-motive-dashcam-enrollments-signals-new-telematics-program)
- Insurer-telematics partnerships: [Samsara–Northland](https://www.samsara.com/blog/northland-insurance-partnership), [Motive–Sentry](https://www.sentry.com/about-us/company-news-and-events/sentry-and-motive-partner-on-transportation-industry-telematics)
- Competitors: [TruckerCloud FleetFile](https://www.prnewswire.com/news-releases/truckercloud-launches-fleetfile-a-crash-risk-score-commercial-auto-insurers-can-apply-across-their-book-302885991.html), [CMT Freight Safety Intelligence](https://www.freightwaves.com/news/cmt-launches-safety-platform-for-freight-brokers), [Nirvana Series D](https://siliconangle.com/2025/12/18/ai-native-trucking-insurance-startup-nirvana-tech-bags-100m-series-d-round/), [Highway](https://www.freightwaves.com/news/carrier-identity-platform)
- Broker liability: [Overdrive – whitelisting](https://www.overdriveonline.com/channel-19/article/15831393/brokers-new-carrierselection-strategy-after-604m-ch-robinson-verdict), [CCJ – SCOTUS and $604M](https://www.ccjdigital.com/regulations/safety-compliance/article/15832848/broker-liability-shifts-after-scotus-ruling-604m-ch-robinson-verdict), [Logistics Management](https://www.logisticsmgmt.com/article/c.h_robinson_hit_with_604_million_advisory_verdict_in_negligent_carrier_selection_case), [FreightWaves – Landstar](https://www.freightwaves.com/news/landstar-has-cut-more-than-35000-carriers-from-approved-network)
- Nuclear verdicts and evidence: [Zonar – $604M](https://www.zonar.com/blog/inside-the-604-million-nuclear-verdict-rewriting-fleet-liability), [Land Line](https://landline.media/magazine/nuclear-verdicts/), [evidence loss after a wreck](https://www.dmlawusa.com/blog/what-evidence-disappears-first-after-a-commercial-wreck/), [spoliation and ECM](https://www.tobininjurylaw.com/2026/05/26/can-a-trucking-company-destroy-evidence-like-black-box-data-after-a-crash/)
- Captives: [captive.com 2026 outlook](https://www.captive.com/news/2026-captive-insurance-outlook-expansion-innovation-and-volatility), [HDT](https://www.truckinginfo.com/articles/3-trucking-insurance-options-to-consider)
- Alternatives considered: [Verisk CargoNet 2025](https://www.verisk.com/company/newsroom/cargo-theft-losses-surge-to-estimated-$725-million-in-2025-verisk-cargonet-analysis-reveals/), [FreightWaves – detention](https://www.freightwaves.com/news/new-study-shows-detention-improving-slightly-but-still-pervasive), [Opendock](https://opendock.com/en/), [Penske – downtime](https://www.pensketruckleasing.com/resources/resource-library/cost-of-downtime/), [Fleetio 2026 benchmark](https://www.fleetio.com/resources/press/fleetio-s-2026-fleet-benchmark-report-finds-53-3-of-fleets-researching-or-piloting-ai), [driver turnover](https://otrucking.com/resources/guides/truck-driver-shortage-2026/)
