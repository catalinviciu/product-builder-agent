# Synthesis — asset track

Cross-segment analysis of the US verticals ranked highest by non-powered and
off-road asset count. Read `EVIDENCE-LIMITATIONS.md` first.

---

## 1. Assets are not small vehicles

Every primitive that on-road fleet management is built on is absent from most of
this track. The differences are structural, not differences of degree.

| | Powered vehicles | Non-powered / off-road assets |
|---|---|---|
| Power for the tracking device | The vehicle's own electrical system | Replaceable battery or solar; 5-10 year life cited |
| Reporting frequency | Near-continuous | Low-frequency, battery-conserving |
| What is observable | How a machine is being operated right now | Where it is, and little else without added sensors |
| Primary open question | Operating efficiency and driver behaviour | Location and custody |
| Attended? | A driver is present and accountable | Unattended most of its life |
| Regulatory backstop | DOT, ELD mandate, HOS, IFTA | None on-road; OSHA indoors; none at all for most assets |
| Value per unit | High | Often low enough to make tagging uneconomic |

The consequence is that tracking penetration on cargo-carrying units sits around
20% (Berg Insight, 2023/24) against near-universal adoption on powered trucks.
That gap is not a sales-effort gap. It is an economics-and-physics gap.

---

## 2. The economic floor is the defining commercial constraint

The asset track has a boundary the vehicle track does not: below a certain asset
value, instrumenting the asset costs more than the asset is worth.

The construction research put the floor at roughly **$150-500 of asset value**
for a rugged tag at $3-15 per unit plus subscription. Below it, contractors fall
back on tool-room checkout logs and crew accountability rather than per-item
tracking — not from ignorance, but because the arithmetic does not work.

The exception is bundling: where tracking is included free in a tool or
subscription the buyer was purchasing anyway (Milwaukee ONE-KEY, Hilti's
fleet-management-included rental model), the marginal tagging decision disappears
entirely. That is the only demonstrated route below the floor.

This is why returnable transport items — pallets at roughly 2.6 billion units,
the single largest asset population in the US — were excluded from the top five
despite their size. A $60/year tag against a $10-20 pallet has no path to
viability, and the category is managed by pooling (CHEP-style) instead, which is
a third ownership model that is neither rental nor owner-operator.

---

## 3. Ownership model determines the buyer and the metric set

The same physical asset generates completely different metrics depending on who
holds it and why.

| Ownership model | Who buys software | Governing question | Signature metrics |
|---|---|---|---|
| Rental / leasing | The asset owner | What return is this asset earning on its capital? | Time utilisation; dollar utilisation; rate realisation; ROIC |
| Owner-operator | The asset user | Should we own this at all, and is it where the crew needs it? | Cost per operating hour; own-vs-rent break-even; availability |
| Dealer full-maintenance lease | Contested — the dealer holds the data | Is the dealer delivering what we are paying for? | Uptime and MTTR, needed to verify the dealer's own claims |
| Pooling (RTI) | The pool operator | Asset recovery and cycle time | Loss rate; dwell; cycle count |

The dealer-managed case, dominant in forklifts, is the most commercially
interesting: **the party being measured controls the measurement**, and unlike
on-road there is no ELD-style regulatory mandate forcing data portability. That
makes independent verification of dealer SLA and billing claims a clean wedge for
third-party software.

---

## 4. Equipment rental is the sharpest test of an asset product

It is the only segment in the study where the asset literally is the
revenue-generating unit, and — uniquely — three large public companies disclose
the governing metrics quarterly, so the benchmarks are externally verifiable
rather than vendor-claimed.

| Company | Fleet OEC | Avg fleet age | Utilisation / return | Period |
|---|---|---|---|---|
| United Rentals | $22.48B, ~1.095M units, 1,768 locations | 49.5 months | ROIC 11.7%; adj EBITDA margin 45.5%; used OEC recovery 50.2% (Q4) | FY2025 |
| Herc Holdings | ~$9.5B | 45 months | Dollar utilisation 37.5% (Q4 2025, down from 40.6%) | FY2025 |
| Ashtead / Sunbelt | — | — | Dollar utilisation 47% LTM General Tool; 74% LTM Specialty | 2026 |

Two utilisation definitions run this industry and must never be conflated:

- **Time utilisation** = days on rent ÷ days available
- **Dollar utilisation** = annual rental revenue ÷ original equipment cost (OEC)

OEC rather than net book value is the denominator because it is fixed and does
not depreciate, making the ratio comparable across assets and years.

If a product's utilisation, ROIC and lifecycle logic cannot hold up here — where
ground truth is public and the incentive to game local numbers is strongest — it
will not hold up elsewhere.

---

## 5. The recurring failure: a physical fact and a financial fact that never match

Every asset segment independently surfaced the same structural problem in
different clothing.

| Segment | Physical fact | Financial fact | What the mismatch costs |
|---|---|---|---|
| Trailers / intermodal | When the asset actually arrived and departed | The detention or per-diem invoice | Over 94% of carriers bill detention; under half get paid (ATRI, 2024) |
| Equipment rental | Telematics runtime | Contracted billed time | Missed billing, mistimed maintenance, unflagged churn risk |
| Construction owned | Engine hours (key-on) | Hours billed to a cost code | Idle runs ~38-40% of engine hours, so utilisation is overstated and PM fires early |
| Forklifts / MHE | Actual uptime and repair time | The dealer's maintenance bill | The measured party owns the measurement |

The construction case is the most concrete: an excavator idling 40% of engine
hours reaches a 250-hour PM interval after only ~150 productive hours. The
maintenance schedule is being driven by a number that does not represent work.

**Reconciliation between these two facts — not additional telemetry — is the
unsolved product problem across the entire asset track.**

---

## 6. Standards exist on paper and under-deliver in practice

AEMP 2.0 / ISO 15143-3 defines a common payload for hours, position, fuel and
fault status across OEMs. Adoption is broad among major manufacturers. Yet
contractors still report losing an estimated 12-15 hours per week reconciling
separate native OEM portals (Cat VisionLink, JDLink, Komtrax, CareTrack).

The same pattern repeats in materials handling, where Crown, Toyota, Hyster,
Raymond and Linde each run proprietary portals with differing metric definitions
and no dominant brand-agnostic aggregator.

A genuinely unified, standard-native view is therefore still a differentiator
rather than table stakes — the standard normalises the format, not the workflow.

---

## 7. Benchmark integrity in the asset track is worse than the vehicle track

Several foundational figures are estimates or stale, and should be treated as
such:

- **US trailer population (~3.5-4.5M)** — extrapolated from 1994 and 2005
  anchors plus build rates. No current authoritative count found.
- **US forklift population (~2.5-3.5M)** — extrapolated from ITA's ~249,000/year
  North American order rate. No authoritative installed base exists.
- **Equipment theft (~$300M-$1B/year, ~20% recovery)** — the standard NER/NICB
  reference has not been refreshed in a detailed joint public report since 2016.
  The authoritative 2026 citation is a decade-stale restatement.
- **Rental vs owned split** — no source provides this breakdown for construction
  equipment, forklifts or agricultural equipment. This is the single most
  consequential gap for sizing the two buyer types against each other.

Unverified lore identified and rejected: the "ideal 3:1 trailer ratio", a "70%
cube utilisation norm", "800% ROI" trailer-tracking claims, and a "70% accident
reduction from training" figure in materials handling.

Figures that did hold up: CVSA 2025 International Roadcheck (18.1% vehicle
out-of-service rate; brakes 24.4% and tyres 21.4% of vehicle OOS violations);
CVSA 2025 Brake Safety Week (15.1% OOS, 2,296 of 15,175 inspections); ATRI 2024
detention study (39.3% of deliveries detained, 135M+ hours, $3.6B direct and
$11.5B productivity cost in 2023); CargoNet/Verisk cargo theft (3,625 incidents
in 2024, +27% YoY, average $202,364; 2025 estimated $725M, +60% YoY); IANA 2024
intermodal volume (18.08M units, +8.5% YoY).

---

## 8. What this implies for product

1. **Lead with location and custody, not operating efficiency.** For unattended
   assets that is the open question, and it is what the buyer will pay for.
2. **Design to the economic floor.** Know which assets justify a tag and offer
   non-electronic control (checkout, crew accountability) below it rather than
   pretending everything can be instrumented.
3. **Build the reconciliation layer.** Physical hours against billed hours is the
   consistent unsolved problem in all four segments.
4. **Sell verification where the dealer holds the data.** In dealer-managed
   forklift fleets, independently verifying SLA and billing claims is the wedge.
5. **Treat AEMP/ISO 15143-3 as a floor, not a feature.** The standard normalises
   payloads; the unified workflow is still the differentiator.
6. **Separate the two utilisation definitions explicitly in the UI.** Conflating
   time and dollar utilisation would be immediately disqualifying in rental.
