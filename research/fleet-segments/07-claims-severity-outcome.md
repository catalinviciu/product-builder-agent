# Reducing claim severity: the outcome fleet-management companies can own

September 2026. This is a follow-up to `05-pain-point-disruption.md` and
`06-incumbent-lens-verizon-connect.md`.

> **Target outcome:** reduce the **severity** of fleet insurance claims, that
> is, the **average cost per accident**.

**Evidence caveat.** Every figure comes from web-search result snippets of the
linked sources. The primary reports themselves (ATRI, IRC and others) could not
be opened in this environment. Figures marked *(calc)* are my own arithmetic.
Verify the key numbers against the primary reports before using them
externally.

---

## 1. How claim costs are built: the formula

Insurers price from **loss cost**, also called **pure premium**. It is the
expected claims cost per unit of exposure, where exposure means per truck, per
mile or per $ of revenue. Loss cost is the product of two numbers
([Casualty Actuarial Society, *Basic Ratemaking*](https://consumerwatchdog.org/wp-content/uploads/2025/04/IRH-SFG-163-2016-05-01-Basic-Ratemaking-Fifth-Edition-Pages-94-109-Excerpted.pdf),
[Milliman](https://www.milliman.com/en/insight/a-beginners-guide-to-the-casualty-actuarial-language)):

```
Loss cost (pure premium) = Frequency × Severity

Frequency = number of claims ÷ exposure        (e.g. crashes per million miles)
Severity  = total claim cost ÷ number of claims (average cost per accident)
```

The premium is built on top of the loss cost. The insurer adds loadings for
claims-handling expense, overhead, cost of capital or reinsurance, and profit.
The two parts of loss cost respond to different levers:

| Component | What it measures | What moves it |
|---|---|---|
| **Frequency** | How often crashes and claims happen | Driver behaviour, coaching, ADAS, routing, fatigue management. This is where most telematics products focus today |
| **Severity** | How much each crash costs once it happens | Crash impact, evidence, speed of response, attorney involvement, litigation outcomes, jury awards |

**Why severity is the lever.** In a multiplication, a 10% cut in severity cuts
loss cost exactly as much as a 10% cut in frequency. But in trucking,
frequency is already falling, while severity is where costs are exploding
(§2). The industry has invested heavily in frequency and very little in
severity.

---

## 2. The evidence: crashes fell, but costs and premiums rose

### Trucking (ATRI, *Trucking's Rising Insurance Costs: Issues and Opportunities*, May 2026)

| Metric (2021 → 2024) | Change | Source |
|---|---|---|
| Heavy-truck crash rate (frequency) | **−2.6%** | [ATRI](https://truckingresearch.org/2026/05/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs/), [Truckers News](https://www.truckersnews.com/news/article/15825499/atri-study-finds-insurance-rates-up-186-while-crash-rates-down-26) |
| Liability losses per mile (loss cost) | **+33.1%** | [Heavy Duty Trucking](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising) |
| Liability premium per mile | **+18.6%**, to 10.2¢/mile, outpacing consumer inflation by 5.4 points | [Truckers News](https://www.truckersnews.com/news/article/15825499/atri-study-finds-insurance-rates-up-186-while-crash-rates-down-26) |
| Liability premium per mile, 2015 → 2024 | +37.8%, to a record 10.2¢/mile | [FleetOwner](https://www.fleetowner.com/news/news/55378757/atri-examines-fleet-risk-strategies-as-commercial-truck-insurance-costs-rise), [PR Newswire](https://www.prnewswire.com/news-releases/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs-302776317.html) |
| Premium for the $5–10M excess layer | +34%; +45% for the $10–15M layer | [Truckers News](https://www.truckersnews.com/news/article/15825499/atri-study-finds-insurance-rates-up-186-while-crash-rates-down-26) |
| Fleets of ≤25 trucks | Pay 20.3¢/mile, about twice what 101–250-truck fleets pay (10.4¢). Insurance is ~5% of their revenue | [CCJ](https://www.ccjdigital.com/business/insurance/article/15825494/why-safe-trucking-fleets-are-paying-recordhigh-insurance-rates) |
| Fleets that had to buy more layers to keep the same coverage limit | 33.3% | [CCJ](https://www.ccjdigital.com/business/insurance/article/15825494/why-safe-trucking-fleets-are-paying-recordhigh-insurance-rates) |

**Implied change in severity** *(calc)*. Loss cost equals frequency times
severity. With losses up 33.1% and the crash rate down 2.6%, the implied
severity change is 1.331 ÷ 0.974 ≈ **+37% in the average cost per crash
(2021–2024)**. This is approximate: ATRI's crash rate is industry-wide, while
its loss figures come from fleets that responded to its survey.

ATRI attributes the gap to rising legal costs, larger lawsuit payouts and
**"social inflation"** ([HDT](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising)).

### Commercial auto overall

| Metric | Figure | Source |
|---|---|---|
| Consecutive years of underwriting losses | 14; a $4.9B underwriting loss in 2024. Severity is rising **~8% a year**, driven by social inflation | [Risk & Insurance](https://riskandinsurance.com/commercial-auto-insurance-losses-hit-4-9-billion-as-social-inflation-drives-severity-beyond-pricing-gains/) |
| Combined ratio (claims plus expenses per $1 of premium) | 107.2% in 2024; 113% for liability | [Christensen Group](https://www.christensengroup.com/article/why-commercial-auto-insurance-is-rising) |
| Five-year average combined ratio, commercial auto liability | 109% | [Pibit.AI](https://pibit.ai/blog/social-inflation-underwriting-profitability-2025-results) |
| Rate increases | 59 consecutive quarters (Q1 2026: +5.8%) | [Carrier Management](https://www.carriermanagement.com/news/2026/01/06/283094.htm), [Christensen Group](https://www.christensengroup.com/article/why-commercial-auto-insurance-is-rising) |
| Claim costs attributable to social inflation | +~7% in 2024, the largest annual rise in 20 years | [actuary.info](https://actuary.info/insights/social-inflation-litigation-trends-2026) |
| Nuclear verdicts (awards over $10M) | +52% in 2024: 135 verdicts totalling $31.3B. The median verdict is $51M, against $21M in 2020 | [RateFile AI](https://ratefileai.com/commercial-auto-nuclear-verdicts-2026.html), [actuary.info](https://actuary.info/insights/social-inflation-litigation-trends-2026) |
| Umbrella and excess cover, Q1 2026 | Clean accounts +10–20%; trucking +20–300%. $25M trucking lines are being cut to $5M or withdrawn | [Beancount](https://beancount.io/blog/2026/07/28/commercial-insurance-rates-2026-renewal-negotiation-guide), [RPS](https://www.rpsins.com/learn/2026-q2-umbrella-and-excess-market-update/), [Frost](https://www.frostins.com/why-the-umbrella-insurance-market-is-tightening-in-2026/) |

**What this means.** Fewer crashes are not lowering costs because each crash
has become much more expensive. **Frequency improvements are being wiped out
by severity growth.** That is also why fleets rarely see a premium *cut* for
their safety technology. Market-wide severity and reinsurance capacity drive
the base rate, and a fleet's safety credit is absorbed into that increase. In
ATRI's data, safety technology correlated with **lower losses**, not directly
with lower premiums
([FleetOwner](https://www.fleetowner.com/news/news/55378757/atri-examines-fleet-risk-strategies-as-commercial-truck-insurance-costs-rise)).

---

## 3. What drives severity

| Driver | Evidence | Source |
|---|---|---|
| Nuclear verdicts and litigation | +52% in 2024; the median verdict is $51M | [RateFile AI](https://ratefileai.com/commercial-auto-nuclear-verdicts-2026.html) |
| Attorney involvement | IRC 2026 (7.4M auto injury claims, 2017–2022): attorney involvement and litigation are pushing claim payments above medical inflation. An older IRC figure puts represented claimants' settlements at ~3.5 times those of unrepresented claimants. That figure is from 2014 and is partly confounded, because more serious injuries attract lawyers | [IRC via Business Wire](https://www.businesswire.com/news/home/20260730512903/en/Insurance-Research-Council-Study-Finds-Rising-Medical-Costs-and-Attorney-Involvement-Are-Driving-Up-Auto-Injury-Claim-Costs), [IRC](https://www.insurance-research.org/research-publications/attorney-involvement-auto-injury-claims) |
| Slow response and lost evidence | Claims escalate into longer cycle times, lost evidence, litigation and higher cost | [Sedgwick](https://www.sedgwick.com/press-release/sedgwick-launches-new-24-7-accident-response-team-to-transform-commercial-trucking-claims/), [HUB International](https://www.hubinternational.com/blog/2026/04/transportation-claims-reporting-and-renewal-strategies/) |
| Company-level negligence theories | Plaintiffs use stored safety alerts that nobody acted on to argue negligent supervision | [CLM](https://www.theclm.org/Magazine/articles/telematics-trucking-litigation-sword-shield/2716), [The Data Scientist](https://thedatascientist.com/how-big-data-and-telematics-are-reshaping-commercial-vehicle-litigation/) |
| Crash physics | Higher impact speed means worse injuries and larger payouts. ATRI links six ADAS technologies to lower per-mile liability losses, with forward collision warning the strongest | [HDT](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising) |

---

## 4. Severity levers a fleet-management company can own

These are ordered roughly by how directly fleet software controls them.

### Lever 1: Evidence preservation (litigation hold)

- **Problem.** Looping dashcam footage can be overwritten within 1–3 days, and
  engine (ECM) data within about 30. No federal rule requires fleets to keep
  it until they are on notice of a claim. After that, losing it can bring
  spoliation sanctions, and a jury may infer that the lost evidence was
  unfavourable to the fleet
  ([DM Law](https://www.dmlawusa.com/blog/what-evidence-disappears-first-after-a-commercial-wreck/),
  [Tobin Injury Law](https://www.tobininjurylaw.com/2026/05/26/can-a-trucking-company-destroy-evidence-like-black-box-data-after-a-crash/)).
- **Feature.** On a collision or severe harsh event, automatically lock and
  hash video (all cameras), ECM data, HOS logs, GPS trace, dispatch records
  and driver-assignment records. Keep an audit trail showing chain of custody.
- **KPI.** % of claims with a complete, preserved evidence set.

### Lever 2: Exoneration evidence

- **Problem.** Many truck crashes are caused by the other party. Without
  video, the fleet is presumed at fault by default.
- **Evidence.** Video that clears the driver can be shared with the opposing
  side and can lead to claims being dropped
  ([CLM](https://www.theclm.org/Magazine/articles/telematics-trucking-litigation-sword-shield/2716)).
  One vendor case study describes a driver cleared in a case with $51M of
  exposure. This is anecdotal and vendor-sourced
  ([HD Fleet](https://hdfleet.com/head-on-collision-on-a-snowy-road-how-dash-cam-footage-protected-a-truck-driver-from-a-51-million-liability-nightmare/)).
- **Feature.** Automatically assemble a fault-analysis packet within minutes:
  forward video, speed, following distance, braking and signal timeline, and
  HOS status. Flag clear not-at-fault events so they can be sent to the other
  party's insurer quickly.
- **KPI.** Share of claims closed at $0 or denied because of evidence; average
  cost of claims with video vs without.

### Lever 3: Early claims response (automated first notice of loss)

- **Problem.** The first 24–48 hours determine whether a claim stays simple or
  escalates to lawyers and litigation. Industry guidance is to report a crash
  the same day, ideally within hours
  ([HUB International](https://www.hubinternational.com/blog/2026/04/transportation-claims-reporting-and-renewal-strategies/),
  [Assured](https://www.assured.com/blog/claims-cycle-time-benchmarks)).
  Claims firms now run 24/7 teams that send adjusters to crash scenes
  ([Sedgwick](https://www.sedgwick.com/press-release/sedgwick-launches-new-24-7-accident-response-team-to-transform-commercial-trucking-claims/)).
- **Feature.** The truck detects the crash, and the platform notifies the
  insurer, the claims administrator or the fleet's rapid-response vendor
  within minutes. It sends location, severity estimate, video and driver
  status, and guides the driver through a scene checklist in the app.
- **KPIs.** Hours from crash to first notice of loss; hours to adjuster
  contact.

### Lever 4: Keeping lawyers out of simple claims

- **Problem.** Attorney involvement is a primary driver of severity growth
  ([IRC](https://www.businesswire.com/news/home/20260730512903/en/Insurance-Research-Council-Study-Finds-Rising-Medical-Costs-and-Attorney-Involvement-Are-Driving-Up-Auto-Injury-Claim-Costs)).
- **Feature.** Early, evidence-backed contact with the third party, with fast
  resolution of clear-liability property-damage claims. Hand off to the
  insurer's or claims administrator's workflow through an API.
- **KPIs.** % of claims with attorney representation; % of claims closed
  without litigation; claim cycle time.

### Lever 5: A defensible safety record (reducing negligence exposure)

- **Problem.** Alerts that nobody acts on become evidence against the fleet.
  Plaintiffs build negligent-supervision and negligent-retention claims from
  the fleet's own telematics data
  ([CLM](https://www.theclm.org/Magazine/articles/telematics-trucking-litigation-sword-shield/2716),
  [The Data Scientist](https://thedatascientist.com/how-big-data-and-telematics-are-reshaping-commercial-vehicle-litigation/)).
- **Feature.** A closed loop from each risky event to a documented coaching
  action and a behaviour change, with time stamps. Surface "open" high-risk
  drivers who have not been addressed, and set a defined data-retention
  policy.
- **KPIs.** % of high-severity events coached within X days; number of open
  unaddressed alerts per driver.

### Lever 6: Lower-impact crashes (the physical side of severity)

- **Problem.** Impact speed drives injury severity and therefore payout size.
- **Evidence.** ATRI found six ADAS technologies correlate with lower
  per-mile liability losses: forward collision warning, lane departure
  warning, collision mitigation, automatic emergency braking, blind-spot
  detection and adaptive cruise control
  ([HDT](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising)).
- **Feature.** Monitor ADAS health and calibration, and alert when a system is
  disabled or faulty. Report ADAS coverage across the fleet.
- **KPI.** % of miles driven with working ADAS.

---

## 5. How to measure the outcome

**Primary metric: severity, the average cost per accident**

```
Severity = total incurred claim cost (paid + reserves) ÷ number of claims
```

Track it by coverage (auto liability, physical damage, cargo), by
not-at-fault vs at-fault, and by claims with vs without preserved video.

**Leading indicators the platform controls**

| Indicator | Lever |
|---|---|
| Crash → first-notice-of-loss time (hours) | 3 |
| % of claims with complete preserved evidence | 1 |
| % of claims with a fault packet within 1 hour | 2 |
| % of claims with attorney representation | 4 |
| % of claims closed without litigation | 4 |
| % of high-severity events coached within the SLA | 5 |
| % of miles with working ADAS | 6 |

**Suggested proof point.** Take cohorts of fleets or claims with and without
automated preservation and first notice of loss. Compare average incurred cost
per claim after 12 months, using claims data from an insurer or claims
administrator partner such as Sedgwick or a marketplace insurer.

---

## 6. Caveats and open questions

- There is **no independent, quantified study** of the savings per claim from
  automated first notice of loss or evidence preservation. Existing claims come
  from claims firms and vendors. That makes it the first thing to validate
  with an insurer or claims administrator.
- The IRC "3.5×" settlement multiple is old (2014) and partly confounded.
  Cite the 2026 IRC direction (attorney involvement drives cost growth), not
  that multiple.
- The implied +37% severity change mixes an industry-wide crash rate with
  losses from ATRI survey respondents. Treat it as directional.
- Social inflation (verdicts and litigation funding) is also a **legal and
  policy** problem. Fleet software can reduce a fleet's exposure to it but
  cannot remove it.

---

## Sources

- ATRI, *Trucking's Rising Insurance Costs* (May 2026): [ATRI](https://truckingresearch.org/2026/05/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs/) · [PR Newswire](https://www.prnewswire.com/news-releases/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs-302776317.html) · [Truckers News](https://www.truckersnews.com/news/article/15825499/atri-study-finds-insurance-rates-up-186-while-crash-rates-down-26) · [Heavy Duty Trucking](https://www.truckinginfo.com/news/truck-crash-rates-are-down-so-why-do-insurance-costs-keep-rising) · [FleetOwner](https://www.fleetowner.com/news/news/55378757/atri-examines-fleet-risk-strategies-as-commercial-truck-insurance-costs-rise) · [CCJ](https://www.ccjdigital.com/business/insurance/article/15825494/why-safe-trucking-fleets-are-paying-recordhigh-insurance-rates)
- Actuarial definitions: [CAS *Basic Ratemaking* (excerpt)](https://consumerwatchdog.org/wp-content/uploads/2025/04/IRH-SFG-163-2016-05-01-Basic-Ratemaking-Fifth-Edition-Pages-94-109-Excerpted.pdf) · [Milliman](https://www.milliman.com/en/insight/a-beginners-guide-to-the-casualty-actuarial-language)
- Commercial auto market: [Risk & Insurance](https://riskandinsurance.com/commercial-auto-insurance-losses-hit-4-9-billion-as-social-inflation-drives-severity-beyond-pricing-gains/) · [Carrier Management](https://www.carriermanagement.com/news/2026/01/06/283094.htm) · [Christensen Group](https://www.christensengroup.com/article/why-commercial-auto-insurance-is-rising) · [Pibit.AI](https://pibit.ai/blog/social-inflation-underwriting-profitability-2025-results) · [actuary.info](https://actuary.info/insights/social-inflation-litigation-trends-2026) · [RateFile AI](https://ratefileai.com/commercial-auto-nuclear-verdicts-2026.html)
- Umbrella and excess: [Beancount](https://beancount.io/blog/2026/07/28/commercial-insurance-rates-2026-renewal-negotiation-guide) · [RPS](https://www.rpsins.com/learn/2026-q2-umbrella-and-excess-market-update/) · [Frost](https://www.frostins.com/why-the-umbrella-insurance-market-is-tightening-in-2026/)
- Attorney involvement: [IRC 2026 via Business Wire](https://www.businesswire.com/news/home/20260730512903/en/Insurance-Research-Council-Study-Finds-Rising-Medical-Costs-and-Attorney-Involvement-Are-Driving-Up-Auto-Injury-Claim-Costs) · [IRC](https://www.insurance-research.org/research-publications/attorney-involvement-auto-injury-claims)
- Claims response: [Sedgwick](https://www.sedgwick.com/press-release/sedgwick-launches-new-24-7-accident-response-team-to-transform-commercial-trucking-claims/) · [HUB International](https://www.hubinternational.com/blog/2026/04/transportation-claims-reporting-and-renewal-strategies/) · [Assured](https://www.assured.com/blog/claims-cycle-time-benchmarks)
- Evidence and litigation: [DM Law](https://www.dmlawusa.com/blog/what-evidence-disappears-first-after-a-commercial-wreck/) · [Tobin Injury Law](https://www.tobininjurylaw.com/2026/05/26/can-a-trucking-company-destroy-evidence-like-black-box-data-after-a-crash/) · [CLM](https://www.theclm.org/Magazine/articles/telematics-trucking-litigation-sword-shield/2716) · [The Data Scientist](https://thedatascientist.com/how-big-data-and-telematics-are-reshaping-commercial-vehicle-litigation/) · [HD Fleet](https://hdfleet.com/head-on-collision-on-a-snowy-road-how-dash-cam-footage-protected-a-truck-driver-from-a-51-million-liability-nightmare/)
- Insurers' use of telematics: [Carrier Management](https://www.carriermanagement.com/features/2025/11/24/281755.htm)
