# Evidence limitations — read before using any number in this research

## Network egress restriction

WebFetch is blocked by this environment's network egress policy. Every external
domain attempted returned `EGRESS_BLOCKED`, including fhwa.dot.gov, sec.gov,
bts.gov, berginsight.com, automotive-fleet.com, fleetowner.com and trucking.org.

Research was therefore conducted with **WebSearch only**. All figures are
paraphrases of search-result snippets, not direct reads of the underlying
tables, filings or reports.

**Practical consequence:** treat every number in this research as one level less
authoritative than "verified against the primary source". The VIUS summary
tables, Berg Insight reports and SEC filings referenced throughout were never
opened directly. Before any figure is used in a board deck, a business case or
external material, it should be re-verified against the primary document.

## Benchmark laundering

A dedicated review of benchmark provenance found that many fleet benchmarks
circulating universally in vendor marketing cannot be traced to any named,
methodologically transparent study. They recur across vendor blogs in a pattern
consistent with mutual citation rather than independent measurement.

Affected figures include the commonly quoted 95% PM compliance target, 95%
vehicle uptime target, 20-25% idle time, 80%+ first-time fix rate, and
95-98% on-time delivery.

These are flagged UNVERIFIED INDUSTRY LORE throughout. They are directionally
useful as a statement of what the industry believes, and should not be presented
as measured fact.

## Confidence flags used throughout

| Flag | Meaning |
|---|---|
| Primary | Traceable to a named primary study or regulatory source |
| Secondary | Secondary reporting of a primary source; directionally reliable |
| Unverified | No identifiable primary study behind the number |

## Figures that did trace cleanly to primary sources

| Metric | Value | Source | Year |
|---|---|---|---|
| All-in cost per mile, Class 8 for-hire | $2.336/mile | ATRI Operational Costs of Trucking | 2025 data |
| Marginal non-fuel cost per mile | $1.854/mile, +4.2% YoY | ATRI | 2025 data |
| Fuel cost per mile | $0.215/mile, +8.6% YoY | ATRI | 2025 data |
| Class 8 fleet-wide real-world MPG | 7.77 | NACFE Fleet Fuel Study | 2024 |
| Private fleet average annual mileage | 80,400 miles | NPTC Benchmarking Survey | 2025 |
| Private fleet cost per mile | $3.81/mile | NPTC Benchmarking Survey | 2025 |
| Private fleet driver turnover | 18.4% | NPTC Benchmarking Survey | 2025 |
| Driver turnover, large truckload | ~90-93% | ATA | recent |
| Driver turnover, LTL | ~11-15% | ATA | recent |
| Federal civilian fleet size | ~670,000 vehicles | GSA/GAO | 2023 |
| Intermodal chassis population | 700,000+ | IANA | 2024 |
| Cargo-carrying-unit tracking penetration | ~20% | Berg Insight | 2023/24 |
| US MEWP rental fleet | ~857,000 units | IPAF | 2024 |
| US farms | 1.9M | USDA Census of Agriculture | 2022 |

## The private-fleet cost comparison is not like-for-like

NPTC's $3.81/mile private fleet figure and ATRI's $2.336/mile for-hire figure
are **not directly comparable**, and the difference does not mean private fleets
are more expensive. The two use different scopes and calculation methods, and
NPTC's own survey documentation warns that respondent private fleets compute
cost per mile inconsistently between themselves.

This matters because the make-versus-buy comparison is the single question the
private fleet segment exists to answer. Anyone presenting these two numbers side
by side without that caveat is producing a misleading result.

## Known unresolved data conflicts

- **US trucking fleet size.** FMCSA MCMIS (via FleetOwner, Dec 2025) reports
  ~3.9M for-hire and ~3.4M private power units with ~1M double-registered.
  ATA American Trucking Trends reports private trucks at "slightly more than two
  million vehicles". Different methodologies (self-reported registration vs
  survey). Not reconciled — both are shown wherever the figure is used.
- **Government fleet total.** Federal is solid at ~670,000 (GSA/GAO). No clean
  state and local total exists. The only aggregate found, NAFA's 4.8M vehicles
  under management, mixes government and corporate membership and is not a
  government-only figure. Treated as a data gap rather than forced into a number.
- **US trailer population.** No current authoritative count found. The ~3.5-4.5M
  estimate is extrapolated from 1994 and 2005 anchors plus build rates. Treat as
  an estimate, not a fact. ACT Research and TTMA likely hold real figures behind
  paywalls.
- **US forklift population.** No authoritative installed-base figure exists. The
  ~2.5-3.5M estimate is extrapolated from ITA's ~249,000/year North American
  order rate. Treat as an estimate.
- **Rental vs owned split.** No source gives a percentage-owned versus
  percentage-rented breakdown for construction equipment, forklifts or
  agricultural equipment. This is the most consequential gap for sizing the
  owner-operator and rental buyer segments against each other.
- **A Verizon fleet figure of 64,688 vehicles** surfaced in a 2026-dated search
  result but appears to be circa-2009 data. Not used as current.

## Search budget exhaustion

The session-wide WebSearch budget (200 calls) was consumed by the parallel
research agents. Three reports were affected, in increasing severity:

| Report | Impact |
|---|---|
| Forklifts / MHE | Four queries succeeded before exhaustion. OSHA citation data, injury statistics, ITA shipment data and the WERC 2025 DC Measures report are sourced. OEM telematics platforms, lease and dealer-maintenance contract structures, and the lithium-ion transition are drawn from industry structure rather than fresh search, and labelled accordingly. |
| Construction owned equipment | About 15 queries succeeded. Unsearched: PM-interval compliance detail, downtime-as-crew-idle-cost, Samsara and Trackunit specifics, Procore integration, OSHA equipment incident data, Tier 4 emissions detail, ARA's rate index, and small-tool-specific shrinkage rates. Flagged as gaps in the report rather than filled. |
| Agriculture | **Zero queries succeeded.** The report contains no live-sourced research and is drawn entirely from model knowledge with a January 2026 cutoff. Marked as a hypothesis document. |

None of the three agents fabricated figures to cover the gap. Each flagged what
it could not verify, which is the correct behaviour and means the gaps are
visible rather than hidden.

**Highest-value follow-up if search budget is restored:** verify the agriculture
report end to end; close the construction equipment gaps listed above; and
verify the forklift OEM telematics and dealer-contract sections.
