# US Fleet & Asset Management Software — Segment & Metrics Research

## Research question

1. Which are the top 5 segments of US business customers buying fleet management
   software, ranked by **number of vehicles** — and, as a **separate** question,
   ranked by **number of assets**?
2. For each selected segment, which metrics actually matter to that business type,
   and how does it measure its own performance? KPIs are expected to differ
   materially by segment — no generic fleet KPI list.

## Two independent research tracks

Vehicles and assets are researched separately. They have different installed-base
data sources, different tracking penetration, different unit economics and
different buyers, so blending them into one ranking would hide more than it shows.

| | Track A — Vehicles | Track B — Assets |
|---|---|---|
| Unit of count | Powered on-road units | Non-powered and off-road assets |
| In scope | Class 1-8 trucks, vans, pickups, cars, buses | Trailers, containers, heavy equipment, forklifts, generators, ag equipment, roll-off containers, tools |
| Typical buyer problem | Driver behaviour, compliance, fuel, uptime | Utilisation, shrinkage/theft, location, maintenance |
| Tracking penetration | High | Low — the commercial gap |
| Economic constraint | Per-vehicle subscription | Tag cost vs asset value floor |

## Scope decisions

| Decision | Choice | Rationale |
|---|---|---|
| "Segment" means | Industry vertical, not fleet-size tier | The question asks which *kinds of businesses* buy; size tiering is a secondary cut |
| Geography | United States | As specified |
| Included | Commercial, private, for-hire and public-sector fleets | All are software buyers |
| Excluded | Consumer/personal vehicles; rental-car fleets where the vehicle *is* the product | Different buying motion and metric set |
| Ranking output | Both raw count **and** software-addressable count | Raw size overstates saturated segments |

## Method

| Phase | Task | Status |
|---|---|---|
| 1A | Rank US verticals by **vehicle** count; select top 5 | dispatched |
| 1B | Rank US verticals by **asset** count; select top 5 | dispatched |
| 1C | Cross-industry KPI taxonomy, benchmark sources, standards layer | dispatched |
| 2 | Per-segment KPI deep dives — one per selected segment, tailored to that business model | pending phase 1 |
| 3 | Synthesis, cross-segment matrix, email delivery of .md reports | pending |

## Evidence standard

Every quantitative claim carries a source and year inline. Vendor blogs and SEO
listicles are labelled low confidence. Estimates are labelled as estimates with
their basis stated. Where sources conflict, both numbers are shown.

## Delivery

Reports are delivered as markdown file attachments by email, and committed to
this repository under `research/fleet-segments/`.
