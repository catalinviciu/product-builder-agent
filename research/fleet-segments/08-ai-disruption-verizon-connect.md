# Out-of-the-box: underserved needs Verizon Connect could exploit with AI

*Research date: September 2026. Sources are linked inline and listed at the end. Figures come from search-result summaries of the cited pages (direct page fetches were blocked in this environment), so verify against the primary reports before external use.*

---

## 0. Framing: where AI is already table stakes

Before looking for white space, remove what is no longer differentiating:

- **Generic "AI agents for fleet ops" are taken.** Samsara launched **Agent Studio** in June 2026: 15+ pre-built agent templates for driver support, maintenance briefings, compliance documentation and exception handling. ([Samsara press release](https://www.samsara.com/company/news/press-releases/samsara-launches-new-agentic-capabilities-to-automate-tedious-operational-tasks), [Fleet Equipment](https://www.fleetequipmentmag.com/samsara-agent-studio-fleet-operations/), [RTInsights](https://www.rtinsights.com/everything-ai-samsara-announced-at-beyond-2026/))
- **AI dash cams and coaching are mainstream.** Verizon Connect's own 2026 survey (~900 fleet pros) puts video telematics at 46% adoption, with 74% of users reporting safety improvement. It already lists "AI data assistants" and "agentic AI" as the next wave. ([Verizon news](https://www.verizon.com/about/news/2026-verizon-connect-fleet-technology-trends-report), [Work Truck Online](https://www.worktruckonline.com/news/verizon-connect-2026-fleet-technology-trends-report-shows-ai-moving-from-buzzword-to-bottom-line))
- **Verizon Connect is now a US-centric business.** In October 2025, Geotab bought Verizon Connect's commercial operations (sales and customers) in the UK, Ireland, France, Germany, Italy, the Netherlands, Poland, Portugal and Australia. Product and engineering stayed with Verizon. ([Geotab](https://www.geotab.com/press-release/verizon-connect/), [GlobeNewswire](https://www.globenewswire.com/news-release/2025/10/01/3159171/0/en/Geotab-Strengthens-Global-Footprint-and-Small-to-Mid-Sized-Fleet-Solutions-with-Acquisition-of-Verizon-Connect-s-International-Commercial-Operations-in-Europe-and-Australia.html), [Automotive Fleet](https://www.automotive-fleet.com/news/geotab-buys-verizon-connects-international-commercial-operations))

**Implication:** Verizon Connect will not win by shipping "AI features" alongside Samsara and Motive. It should use AI where **Verizon owns something competitors cannot copy**:

1. **The US cellular network itself.** Each device is a Verizon SIM that the network can locate and authenticate independently of the device's own GPS.
2. **Telco identity APIs.** Number Verification and SIM Swap detection launched with AT&T and T-Mobile via Aduna in 2025. ([Ericsson](https://www.ericsson.com/en/press-releases/2025/2/att-t-mobile-and-verizon-come-together-to-bring-first-standardized-5g-network-apis-to-the-u-s--leveraging-aduna), [RCR Wireless](https://rcrwireless.com/20250227/carriers/apis-us))
3. **The SMB's business phone line.** Verizon Business already sells an AI text assistant at $35 per line per month. ([Verizon news](https://www.verizon.com/about/news/verizon-business-launches-industry-first-genai-assistant-small-businesses), [RCR Wireless](https://rcrwireless.com/20250318/carriers/verizon-ai-assistant))
4. **Neutrality.** Verizon is a carrier-grade utility, not a freight marketplace.

The test applied to every idea below: **is the pain large, is it underserved, and does it need a Verizon-only asset?**

---

## 1. Summary ranking

| # | Underserved need | Size of pain | Underserved? | Verizon-only asset | Verdict |
|---|---|---|---|---|---|
| **1** | **Proving the truck, the driver and the phone are who they claim (freight fraud)** | $725M cargo theft in 2025; fictitious pickups +1,500% | Yes. Current checks rely on app GPS and ELD links that can be spoofed or cut off | **Network-attested location + SIM swap / number verification** | **Lead bet** |
| **2** | **Service fleets lose jobs to unanswered calls** | 27% of contractor calls missed (62% at SMBs); ~$1,200 per missed HVAC call | Partly. AI receptionists exist but don't know where the vans are | **Owns the phone line and the live van locations** | **Strong second bet (Verizon Connect's core SMB base)** |
| 3 | Detention time never gets paid | $15B/yr; only ~41% of earned detention is collected | Partly. Point startups exist | Weak. Anyone with ELD data can do it | Feature, not a moat |
| 4 | Downtime from the technician shortage | $448–760 per truck-day; 8.7 days/yr; 19.3% vacancy | Partly | Weak | Feature |
| 5 | Parking search | 56 min/day, ~$5,600 per driver per year | Crowded (apps exist) | Aggregated network location data (privacy-sensitive) | Watch |
| 6 | English proficiency out-of-service orders | 12,308 OOS violations in H2 2025 | Yes | None | Training add-on only; ethical limits |

---

## 2. Bet 1: "Proof of truck": network-attested carrier identity against freight fraud

### The pain

- **Cargo theft hit ~$725M in 2025**, up ~60% on 2024. The average theft was **$273,990** (+36%), and confirmed incidents rose from 2,243 to 2,646 (+18%). ([Verisk CargoNet](https://www.cargonet.com/news-and-events/cargonet-in-the-media/2025-theft-trends/))
- **Strategic theft (fraud rather than break-ins) rose 1,475% from 2022 to 2024** and is now about a third of cargo crime. Fictitious pickups are up more than 1,500% since 2021. ([IA Magazine](https://www.iamagazine.com/2026/09/21/cargo-theft-and-cybercrime-how-to-protect-commercial-auto-fleets/), [Inbound Logistics](https://www.inboundlogistics.com/articles/freight-fraud-prevention-industry-fighting-back/), [HDT](https://www.truckinginfo.com/digital-cover-features/cargo-thefts-new-playbook-strategic-fraud-double-brokering-and-cybercrime-hit-trucking))
- **The fraud playbook targets exactly what software currently trusts:**
  - fake location feeds from services that "simulate app-based tracking data";
  - fake MC numbers on the truck at the dock;
  - spoofed phone numbers and email;
  - brokers impersonating carriers.
  ([Inbound Logistics](https://www.inboundlogistics.com/articles/risky-business-inside-the-freight-fraud-surge/), [AMAROK](https://amarok.com/blog/freight-fraud/), [ITS Logistics](https://www.its4logistics.com/blog/freight-fraud-2025-insights-from-the-frontlines))
- **ELDs themselves are a loophole.** FMCSA revoked 24 ELD devices in 2025, the most since enforcement began, and experts say ELD loopholes are "fueling fraud". ([FreightWaves](https://www.freightwaves.com/news/eld-loopholes-fueling-fraud-driving-good-carriers-out-of-business-experts-warn))
- **Liability is rising for brokers.** After the Supreme Court allowed state negligence claims against freight middlemen, Highway made ELD connections mandatory for carrier ID checks. Brokers now *must* vet. ([Overdrive](https://www.overdriveonline.com/business/article/15830147/highway-doubles-down-on-eld-connections-for-carrier-id-checks))

### Why it is underserved

- **Today's best check is "connect your ELD so we can see the truck"** (Highway and others). ([FreightWaves](https://www.freightwaves.com/news/how-highway-sees-fraud-risk-and-carrier-vetting))
- **That check is fragile in two ways:**
  1. **Access can be cut off.** Motive restricted Highway's API access and demanded payment. Highway's position is that "carrier ELD data belongs to the motor carrier, not the telematics provider." ([FreightWaves](https://www.freightwaves.com/news/motive-restricted-highways-data-access-over-a-payment-demand), [AMB Logistic](https://amblogistic.us/when-freight-tech-connections-break-the-motive-highway-dispute-and-the-new-risk-for-freight-brokers/))
  2. **Device-reported GPS can be spoofed.** Neither the ELD nor the app can prove on its own that the location is real.
- **The weakest point, the pickup itself, has no cryptographic identity.** Brokers are told to "call the carrier at a pre-verified number", which is a manual process defeated by SIM swaps and number spoofing. ([DAT](https://www.dat.com/blog/carrier-identity-verification-why-it-matters-more-than-ever), [Truckstop](https://truckstop.com/blog/freight-fraud/))

### What Verizon can do that Samsara and Motive cannot

**"Verified Carrier Signal"**, a carrier-owned credential the carrier chooses to share with a broker or shipper for a specific load:

| Signal | How | Why it can't easily be faked |
|---|---|---|
| **The device is where it says it is** | Compare GPS reported by the Verizon Connect device with **network-derived location** (the cell sector the SIM is attached to) | A GPS spoofer can't fake which tower the modem is talking to. *Needs validation of the network-location precision and the legal basis.* |
| **The dispatcher's phone is really the carrier's** | **Number Verification** + **SIM Swap** APIs on the number the broker calls or texts | Detects recent SIM swaps and ported numbers, the tactic used to hijack carrier identities ([Thomson Reuters](https://www.thomsonreuters.com/en-us/posts/corporates/sim-swap-fraud/), [Telesign](https://www.telesign.com/blog/how-to-check-if-a-number-is-fraud-using-apis-and-telco-signals)) |
| **The truck at the dock is the truck on the rate con** | Device ID + VIN + MC bound to the Verizon account; geofence arrival at the shipper | Stops "false MC number on the door" pickups ([ITS Logistics](https://www.its4logistics.com/blog/freight-fraud-2025-insights-from-the-frontlines)) |
| **AI anomaly layer** | A model flags mismatches: truck not moving toward the pickup, a new dispatcher number, an MC/driver mismatch, route deviation after pickup | Turns the signals above into a simple green/amber/red for the broker |

**Business model:**
- Brokers or shippers pay per verification or per load.
- The carrier gets it free and owns the credential (a "trusted carrier" badge). That links back to doc 05's thesis: **safety and legitimacy turning into freight access**.
- The telco APIs work even if the carrier uses a different telematics provider, which extends Verizon's reach beyond its own installed base.

**Why incumbents struggle to copy it:**
- Samsara and Motive run on carrier SIMs they buy wholesale. They can't attest network location or SIM-swap status themselves without buying it through Aduna. Verizon can bundle and price it natively.
- Motive's fight with Highway shows marketplaces fear incumbents who gate data. Verizon can position itself as the **neutral utility** that never competes for freight.

**Risks / unknowns:**
- The precision of network-based location in rural areas.
- CPNI and privacy rules on using subscriber location, which would need explicit carrier consent.
- Highway, Carrier Assure and DAT already own the broker workflow. The right play may be to **sell the signal to them** rather than build a broker product.

---

## 3. Bet 2: The AI dispatcher that answers the phone for service fleets

Verizon Connect's heartland is SMB and mid-size **service fleets** (HVAC, plumbing, electrical, pest control), not only trucking.

### The pain

- **The industry misses 27% of inbound calls, and small businesses miss 62%.** After hours, when 35–45% of HVAC and plumbing calls arrive, pickup falls below 18%. ([Contractor In Charge](https://contractorincharge.com/blog/missed-call-statistics-for-home-service-companies), [Aira](https://www.getaira.io/blog/missed-business-calls-statistics), [CallJolt](https://calljolt.com/blog/guides/home-service-business-missed-call-statistics))
- **About 85% of callers who aren't answered never call back**, and 82% won't leave a voicemail. A missed HVAC call is worth ~$1,200, or $3,500+ for a replacement. ([Echo / Artifact AI](https://www.artifactaisolutions.com/blog/hvac-revenue-lost-from-missed-calls), [SkipCalls](https://skipcalls.com/blog/percentage-business-calls-unanswered-statistics-2026))
- **ServiceTitan data: 41% of weekend home-services calls go unanswered.** ([CallJolt](https://calljolt.com/blog/guides/home-service-business-missed-call-statistics))
- **The root cause is a labour shortage.** About 2.1M skilled-trades roles could go unfilled by 2030; ~600k trades jobs were posted versus ~150k apprenticeship entrants. The owner is in a van, not at a desk. ([JLL](https://www.jll.com/en-us/newsroom/critical-skilled-trades-shortage-threatens-economic-losses), [Fortune](https://fortune.com/2026/04/21/america-silent-army-jll-report-skilled-trades-job-shortage-cost/))

*Note: the missed-call stats come mostly from vendors selling AI receptionists. Treat them as directional.*

### Why it is underserved

- **Generic AI receptionists can take a message, but they don't know where the technicians are.** They can't promise a real ETA or slot the job into today's route.
- **Verizon's own Business Assistant is text-only FAQ answering**, not dispatch. ([Verizon news](https://www.verizon.com/about/news/verizon-business-launches-industry-first-genai-assistant-small-businesses))

### What only Verizon has

**"Answer-and-dispatch"** combines three things only Verizon holds together:

1. **The business's phone number.** It is on Verizon, so the call can be intercepted natively with no porting and no call forwarding.
2. **The live location, skills and job status of every van** (from Verizon Connect).
3. **An AI voice agent** that can answer: "The nearest technician is 22 minutes away. I can book you for 3:30. Want me to text you when they're on the way?" It then writes the job into the dispatch board and texts live ETA tracking.

**Outcome metric:** booked jobs per 100 inbound calls, and after-hours revenue captured.

**Why it matters for disruption:**
- It moves Verizon Connect from a **cost-saving** tool (fuel, safety) to a **revenue-generating** one.
- That is a much easier sale to an owner-operator, and it creates bundle lock-in with Verizon Business wireless.

**Competition:**
- ServiceTitan, Housecall Pro and Jobber, plus AI-receptionist startups.
- They own the booking workflow but not the phone line or the telematics. Partner with or integrate with them rather than replace them.

---

## 4. Other needs considered (features, not moats)

### 4.1 Detention: "you already earned it, go collect it"
- **The pain:**
  - Detention hits ~39% of truckload stops and costs **$15.1B/yr** ($3.6B direct, $11.5B lost productivity).
  - It also wastes 135M hours and 72M gallons of fuel.
  - Detained drivers drive **14.6% faster** afterwards, which ties back to the severity work in doc 07.

  ([ATRI 2024](https://truckingresearch.org/2024/09/new-research-documents-substantial-financial-and-safety-impacts-from-truck-driver-detention/), [Land Line](https://landline.media/study-shines-a-spotlight-on-costly-cascading-effects-of-detention-time/), [HDT](https://www.truckinginfo.com/articles/why-truck-detention-keeps-costing-fleets-time-and-money))
- **Only ~41% of earned detention is actually collected** (carriers invoice 75% of the time and get paid on 55%). Carriers without timestamps lose ~70% of disputes. ([DockClaim](https://dockclaim.com/compare/detention-tracking-software), vendor source)
- **AI play:** automatic geofence evidence, a rate-con parser for the grace period, and an auto-generated invoice.
- **Why it isn't the lead:** startups (DetentionIQ, DockClaim, DetentionTime) already do this from any ELD. ([DetentionIQ](https://www.detentioniq.com/), [DetentionTime](https://detentiontime.com/)) It is a good retention feature, but anyone can build it.

### 4.2 Downtime from the technician shortage
- **The pain:**
  - 65.5% of shops are understaffed, with a 19.3% vacancy rate.
  - The average breakdown takes ~20h to resolve.
  - Downtime costs **$448–760 per truck per day**, across **8.7 unplanned days per truck per year**.

  ([HDT/Fullbay](https://www.truckinginfo.com/news/repair-shops-see-strong-growth-rising-rates-in-fullbay-report-but-labor-shortage-persists), [Datadis](https://datadis.com/article/heavy-duty-mechanic-shortage/))
- **AI play:** fault-code triage and a technician copilot that gives the likely fix, parts and time before the truck arrives.
- **Why not the lead:** Samsara's Agent Studio already ships "maintenance briefings", and OEMs own the deep diagnostics.

### 4.3 Truck parking
- **The pain:**
  - Drivers spend **56 min/day** finding parking, worth ~$5,600/yr each.
  - Parking is drivers' #2 concern (ATRI 2025).

  ([FleetOwner](https://www.fleetowner.com/perspectives/ideaxchange/blog/55401528/truck-parking-crisis-safety-costs-and-other-fleet-risks), [Go Trucking](https://gotruckingmagazine.com/2025/07/10/truck-parking-shortage-national-safety-crisis/))
- **AI play:** predict lot occupancy from anonymised fleet dwell data and plan HOS-aware stops.
- **Why not the lead:** apps (Trucker Path and others) are entrenched, and using aggregate subscriber location raises privacy issues.

### 4.4 English-language-proficiency enforcement
- **The pain:**
  - English proficiency (ELP) became an out-of-service criterion on 25 June 2025.
  - It produced 12,308 OOS violations in H2 2025.
  - A rule codifying it was proposed on 10 August 2026.

  ([CVSA](https://cvsa.org/news/elp-oosc-06252025/), [CCJ](https://www.ccjdigital.com/regulations/safety-compliance/article/15831944/fmcsa-proposes-outofservice-rule-for-trucker-english-proficiency), [CDLLife](https://cdllife.com/2026/congress-mandates-fmcsa-regulation-change-so-english-proficiency-failure-triggers-out-of-service-order-for-cdl-drivers/))
- **AI play:** English-proficiency *training and readiness assessment* for drivers (a voice-AI tutor).
- **Limit:** a real-time translation "crutch" would defeat the regulation's intent, so don't build that. This is a niche add-on.

### 4.5 Driver turnover (context)
- Truckload turnover runs 69–95%, costing $8k–20k per replacement and $3–5B/yr in total. ([ATA](https://www.trucking.org/news-insights/truth-about-trucking-turnover), [Centerline](https://www.centerlinedrivers.com/resources/how-much-does-truck-driver-turnover-cost/))
- Detention and parking are among the stated drivers of turnover, so fixing 4.1 and 4.3 helps indirectly.

---

## 5. How the bets connect to prior work

- **Doc 05 (freight access):** Bet 1 is the fraud-proof version of the "carrier-owned defensibility record". Its buyer is brokers, not insurers.
- **Doc 07 (severity):**
  - Detained drivers drive faster, and fraud losses sit inside cargo insurance.
  - Both bets produce evidence (timestamps, attested location) that also serves claims defence.

**Recommended sequence:**
1. **Validate Bet 1 first.** Run three conversations:
   - Verizon network engineering, on the precision of network location and the legal basis (CPNI and consent);
   - 5 mid-size brokers, on willingness to pay per verification;
   - Highway or DAT, as a partner channel rather than a competitor.
2. **Pilot Bet 2 in parallel** with 20–50 existing Verizon Connect HVAC and plumbing customers who are also on Verizon Business lines. Measure booked jobs per 100 inbound calls before and after.
3. Ship detention evidence (4.1) as a retention feature. Don't position it as the disruption.

---

## 6. What would change this

- **If network-derived location is too coarse** to prove a truck is at a specific dock, Bet 1 shrinks to phone and SIM identity. That is still useful, but the telco APIs are sold to everyone via Aduna, so the moat is gone.
- **If Samsara or Motive license the Aduna APIs** and bundle them into broker products, Verizon's head start is only distribution.
- **If ServiceTitan or Housecall Pro ship voice agents with their own live technician GPS**, Bet 2 loses its uniqueness. The phone-line advantage remains only for SMBs whose numbers are on Verizon.

---

## Sources

**Incumbent landscape**
- Samsara Agent Studio: https://www.samsara.com/company/news/press-releases/samsara-launches-new-agentic-capabilities-to-automate-tedious-operational-tasks · https://www.fleetequipmentmag.com/samsara-agent-studio-fleet-operations/ · https://www.rtinsights.com/everything-ai-samsara-announced-at-beyond-2026/
- Verizon Connect 2026 Fleet Technology Trends: https://www.verizon.com/about/news/2026-verizon-connect-fleet-technology-trends-report · https://www.worktruckonline.com/news/verizon-connect-2026-fleet-technology-trends-report-shows-ai-moving-from-buzzword-to-bottom-line
- Geotab acquisition of Verizon Connect international operations: https://www.geotab.com/press-release/verizon-connect/ · https://www.globenewswire.com/news-release/2025/10/01/3159171/0/en/Geotab-Strengthens-Global-Footprint-and-Small-to-Mid-Sized-Fleet-Solutions-with-Acquisition-of-Verizon-Connect-s-International-Commercial-Operations-in-Europe-and-Australia.html · https://www.automotive-fleet.com/news/geotab-buys-verizon-connects-international-commercial-operations

**Verizon assets**
- Aduna network APIs (Number Verification, SIM Swap): https://www.ericsson.com/en/press-releases/2025/2/att-t-mobile-and-verizon-come-together-to-bring-first-standardized-5g-network-apis-to-the-u-s--leveraging-aduna · https://rcrwireless.com/20250227/carriers/apis-us · https://adunaglobal.com/newsroom/att-t-mobile-and-verizon-come-together-to-bring-first-standardized-5g-network-apis-to-the-u-s--leveraging-aduna/
- Verizon Business Assistant: https://www.verizon.com/about/news/verizon-business-launches-industry-first-genai-assistant-small-businesses · https://rcrwireless.com/20250318/carriers/verizon-ai-assistant

**Freight fraud**
- Verisk CargoNet 2025 theft trends: https://www.cargonet.com/news-and-events/cargonet-in-the-media/2025-theft-trends/
- IA Magazine: https://www.iamagazine.com/2026/09/21/cargo-theft-and-cybercrime-how-to-protect-commercial-auto-fleets/
- HDT: https://www.truckinginfo.com/digital-cover-features/cargo-thefts-new-playbook-strategic-fraud-double-brokering-and-cybercrime-hit-trucking
- Inbound Logistics: https://www.inboundlogistics.com/articles/risky-business-inside-the-freight-fraud-surge/ · https://www.inboundlogistics.com/articles/freight-fraud-prevention-industry-fighting-back/
- ITS Logistics: https://www.its4logistics.com/blog/freight-fraud-2025-insights-from-the-frontlines
- AMAROK: https://amarok.com/blog/freight-fraud/
- FreightWaves, ELD loopholes: https://www.freightwaves.com/news/eld-loopholes-fueling-fraud-driving-good-carriers-out-of-business-experts-warn
- Motive–Highway dispute: https://www.freightwaves.com/news/motive-restricted-highways-data-access-over-a-payment-demand · https://amblogistic.us/when-freight-tech-connections-break-the-motive-highway-dispute-and-the-new-risk-for-freight-brokers/
- Highway vetting: https://www.freightwaves.com/news/how-highway-sees-fraud-risk-and-carrier-vetting · https://www.overdriveonline.com/business/article/15830147/highway-doubles-down-on-eld-connections-for-carrier-id-checks
- DAT carrier identity: https://www.dat.com/blog/carrier-identity-verification-why-it-matters-more-than-ever
- Truckstop: https://truckstop.com/blog/freight-fraud/
- SIM swap: https://www.thomsonreuters.com/en-us/posts/corporates/sim-swap-fraud/ · https://www.telesign.com/blog/how-to-check-if-a-number-is-fraud-using-apis-and-telco-signals

**Service-fleet missed calls and trades shortage**
- https://contractorincharge.com/blog/missed-call-statistics-for-home-service-companies
- https://www.getaira.io/blog/missed-business-calls-statistics
- https://calljolt.com/blog/guides/home-service-business-missed-call-statistics
- https://www.artifactaisolutions.com/blog/hvac-revenue-lost-from-missed-calls
- https://skipcalls.com/blog/percentage-business-calls-unanswered-statistics-2026
- https://www.jll.com/en-us/newsroom/critical-skilled-trades-shortage-threatens-economic-losses
- https://fortune.com/2026/04/21/america-silent-army-jll-report-skilled-trades-job-shortage-cost/

**Detention**
- ATRI: https://truckingresearch.org/2024/09/new-research-documents-substantial-financial-and-safety-impacts-from-truck-driver-detention/
- Land Line: https://landline.media/study-shines-a-spotlight-on-costly-cascading-effects-of-detention-time/
- HDT: https://www.truckinginfo.com/articles/why-truck-detention-keeps-costing-fleets-time-and-money
- DockClaim: https://dockclaim.com/compare/detention-tracking-software
- DetentionIQ: https://www.detentioniq.com/
- DetentionTime: https://detentiontime.com/

**Downtime / technicians**
- https://www.truckinginfo.com/news/repair-shops-see-strong-growth-rising-rates-in-fullbay-report-but-labor-shortage-persists
- https://datadis.com/article/heavy-duty-mechanic-shortage/

**Parking**
- https://www.fleetowner.com/perspectives/ideaxchange/blog/55401528/truck-parking-crisis-safety-costs-and-other-fleet-risks
- https://gotruckingmagazine.com/2025/07/10/truck-parking-shortage-national-safety-crisis/

**English proficiency**
- https://cvsa.org/news/elp-oosc-06252025/
- https://www.ccjdigital.com/regulations/safety-compliance/article/15831944/fmcsa-proposes-outofservice-rule-for-trucker-english-proficiency
- https://cdllife.com/2026/congress-mandates-fmcsa-regulation-change-so-english-proficiency-failure-triggers-out-of-service-order-for-cdl-drivers/

**Turnover**
- https://www.trucking.org/news-insights/truth-about-trucking-turnover
- https://www.centerlinedrivers.com/resources/how-much-does-truck-driver-turnover-cost/
