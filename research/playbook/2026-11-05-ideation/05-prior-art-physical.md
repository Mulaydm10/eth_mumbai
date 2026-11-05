# 05 Prior-art check: physical-sensor candidates (S-B, S-C, S-D, E3)
Angle: adversarial prior-art search. Date 2026-11-05. Limitation: only published work is visible; concurrent unpublished Mumbai work is invisible. Nothing is called novel; the strongest statement is "no prior published work found doing X". Tags: [FETCHED] opened and read; [SNIPPET] search summary only; [UNVERIFIED] not confirmed.

## Log (chronological)
- [start] Read candidates-brief.md lines 6-16 (S-B, S-C, S-D, E3). Certain.
- [search] ENF + smartphone rolling shutter + blockchain. [SNIPPET]
- [fetched] https://pmc.ncbi.nlm.nih.gov/articles/PMC9304164 : Frijters & Geradts, J Forensic Sci, 4 Feb 2022. Smartphone rolling-shutter ENF flicker matched to reference gives zero time error in ideal conditions (30 cm, white wall; r>0.95); LED/CFL fail at 100 cm; static scenes only; authors say a stored ENF reference database does not yet exist; more validation needed. No blockchain. [FETCHED] Implication for S-C: LED lighting (most of India now) is the weak case; the reference-database gap is stated by researchers.
- [search] smartphone sonar apnea. [SNIPPET]
- [fetched] https://www.washington.edu/news/2015/04/27/new-uw-app-can-detect-sleep-apnea-events-via-smartphone/ : ApneaApp, UW, 27 Apr 2015, Android speaker/mic as inaudible sonar, 37 patients, 95-99% event accuracy vs polysomnography, 3 ft, under blanket; not yet consumer. [FETCHED] The page does not state FMCW; the UW PDF snippet does [SNIPPET].
- [fetched] https://comotion.uw.edu/press_release/non-contact-sleep-tracking-mobile-app-sleepscore-inspired-in-part-by-apneaapp-research-performed-by-university-of-washington-researchers : 30 Jul 2018, SleepScore (ResMed licensed ApneaApp + a pending patent), free non-contact sleep app for iOS and Android, inaudible sonar breathing/movement. [FETCHED] So S-D's sensing is not only published but shipped as a consumer app since 2018.
- [search] Sleep as Android sonar / Nest Hub / Soli: no official confirmation found for Sleep as Android sonar apnea; Nest Hub/Soli not individually confirmed. [UNVERIFIED]
- [search] crowdsourced phone vibration SHM. Ozer/Feng Citizen Sensors for SHM (https://pmc.ncbi.nlm.nih.gov/articles/PMC4507648, 2015), MyShake building monitoring (seismosoc abstract), UC tech-transfer patent-pending phone-array listing (https://techtransfer.universityofcalifornia.edu/NCD/34618.html). No blockchain evidence in results. [SNIPPET]
- [search] pay-per-use rental + IoT + blockchain. IOFY, PermaRent, GitHub Thegaram/device-rental-platform, Justia patent. [SNIPPET]
- [fetched] https://ethglobal.com/showcase/iofy-xzj0e : IOFY, FVM Space Warp. IoT device marketplace, ERC20 pay, MQTT lock/unlock for session proportional to payment. Time purchased, not sensed usage. [FETCHED]
- [FAILED] https://patents.justia.com/patent/12567090 HTTP 403. Retried via Playwright on Google Patents (worked).
- [fetched via Playwright] https://patents.google.com/patent/US12567090B2/en : "Devices, systems and methods for autonomously monitoring customer use of equipment and billing via a blockchain network", assignee IoT EQ LLC, filed 2022-07-15, published 2023-01-19, GRANTED 2026-03-03. Abstract: a device proximal to rented equipment charges the renter via a blockchain network based on the amount of vibration, pressure, flow rate or temperature; description also mentions run-time and blocking operation on insufficient balance. [FETCHED] Closest prior art for E3 (granted patent, not a hackathon blocker).
- [search+fetch] ENF + blockchain: found DEMA (SPIE 2023, Nagothu, Xu, Chen, Binghamton: "decentralized ENF map" as reference for time and location checks of social-media media), DeFakePro (Proof-of-ENF consensus), EconLedger (Future Internet, Sep 2021, https://mdpi.com/1999-5903/13/10/248). [SNIPPET] for DEMA/EconLedger (SPIE page empty, MDPI 403, DOAJ Cloudflare 403, arXiv 2207.13070 PDF unreadable). 
- [fetched] https://api.deepai.org/publication/defakepro-decentralized-deepfake-attacks-detection-using-enf-authentication : DeFakePro, Nagothu et al., 22 Jul 2022, decentralized consensus (Proof-of-ENF) among participants to authenticate video-conference media; page does not itself say "blockchain". [FETCHED]
- [fetched] https://patents.google.com/patent/US10623712 : University of Maryland (Min Wu et al.), US10623712B2, priority 2012-11-29, granted 2020-04-14: extracting ENF from video via rolling shutter and synchronizing recordings. [FETCHED] (Claims not read.)
- [search] ProofMode / Starling Lab / Truepic / Numbers Protocol: Numbers Protocol stores media provenance on its own chain and has a Capture app with C2PA; Starling Lab CLI registers assets on-chain and works with ProofMode; ProofMode signature carried a DigiCert countersigned time. [SNIPPET only, none opened]. These attest "signed at time T by a device", not ENF-based physical time.
- [search+fetch] Equipment telematics: Trackunit (usage data to adjust rental agreements and billing), Sunbelt+Trackunit, Hilti ON!Track+Trackunit; Hapn markets engine-hour billing for rentals. [SNIPPET] for Trackunit/Sunbelt/Hilti. [FETCHED] https://gethapn.com/equipment-rental/generator/ : Hapn syncs engine hours to rental software for engine-hour billing, hardwired or battery trackers; page does not say how run-time is detected. This is the incumbent market for E3 (dedicated hardware, not a phone).
- [search] MACH402 / Kleeto / Paybot: nothing found by name; only generic x402 pages. Could not verify the team's own prior-art claims about them [UNVERIFIED].
- [search] India construction vibration. Mumbai Metro Line III and Bengaluru metro EIAs (opencity.in), MMRC media note, Jaipur seismograph PPV monitoring. No commercial resident-side PPV service found. [SNIPPET]
- [fetched] https://www.asianage.com/metros/mumbai/071017/vibrations-less-than-14th-of-permissible-limit-mmrc.html (7 Oct 2017): MMRC says vibrations are under the limit; J.N. Petit institute went to court alleging 4x the limit; MMRC director said readings from mobile apps cannot be that accurate; weak/heritage buildings under online round-the-clock monitoring. [FETCHED] Real Mumbai dispute (demand) and a stated credibility objection to phone evidence.
- [ETHGlobal showcase via Playwright; https://ethglobal.com/showcase?q=<term> searches ALL events. The browser is apparently shared and was sometimes redirected mid-call; reruns worked. Search appears to match only titles/taglines, since bare "sensor" returned zero, so zero = "not found in title/tagline search"]:
  - NONE found for: vibration, earthquake, accelerometer, sensor, apnea, elderly, "timestamp video", "proof of time". 
  - sonar: only "Sonar" (AI runtime fleets, Open Agents), unrelated.
  - Enconomy confirmed: "Two phones prove they're within close proximity, using sound and then ZKP", ETHGLOBAL TOKYO 2026 (https://ethglobal.com/showcase?q=enconomy) [FETCHED listing]. Phone audio + on-device ZK precedent, but different headline.
  - rental: RentalRide (pay-as-you-go vehicle rental, ETHOnline 2025), Rental Agreement, PixelRental, PolyBikeRental (ETHIndia 2022), ENSRental.
  - IoT: IoTrix (New Delhi), BlockIoT (ETHIndia 2023), Smart NeSt, CloudX3-IoT, Codigo, FIL-Riot. None bills by sensed usage.
  - usage: UsageX ("usage-based payments with off-chain tracking and on-chain USDC settlement", HackMoney 2026), ENS Proof-of-Usage (HackMoney 2026). Software usage, not machine run-time.
  - machine: MachineMetricAgent (ETHGlobal San Francisco; "open, verifiable hardware and software stacks using proof-of-machinehood"), Crypto Recycling Machine, others unrelated.
  - provenance: Provenance Chain (document notary, Cannes 2026), Provenance (trading agents, ETHOnline 2026). Not ENF.
  - ETHOnline 2026 listing also shows Quorly ("A quorum releases it. The contractor gets paid in a minute.") : construction payment quorum, different problem but overlaps the words "quorum" and "contractor".
  - NOT done: events=tokyo2026 and events=newdelhi filtered pages were not browsed individually; q= search covered all events including them.
- [GitHub] search_repositories "electric network frequency ENF timestamp" and "smartphone sonar breathing apnea FMCW android": 0 results each (note: sparse GitHub phrasing; not evidence of absence). 

## Scores (0-10; crowding = how much exists; demand = who asks in print; collision = teams at Mumbai building the same headline, a guess from the showcase search plus base rates, not a count)

### S-B Tremor Witness
- CROWDING 4/10. Phone vibration/structural monitoring is academically crowded (Ozer/Feng 2015 PMC4507648 [SNIPPET]; MyShake building monitoring [SNIPPET]; UC patent-pending listing [SNIPPET]). Blockchain evidence layer: no prior published work found for phone-PPV + quorum + tamper-evident record. Zero ETHGlobal title hits for vibration/earthquake/accelerometer/sensor.
- DEMAND 6/10. Mumbai Metro III dispute with residents/J.N. Petit (asianage 2017 [FETCHED]); but the same source records the authority dismissing phone-app readings. Demand for evidence exists; demand for a phone-grade instrument is contested. Calibration against a real seismograph would be the weak link.
- CLOSEST: Citizen Sensors for SHM / MyShake (phone accelerometer crowd monitoring) minus any adversarial-evidence or ledger layer.
- COLLISION 1/10 (expect 0-1 teams with a vibration headline; ~0 hits in showcase).

### S-C Hum Clock
- CROWDING 7/10 at the research level, 3/10 at the product level. ENF smartphone video timestamping is published (Frijters 2022 [FETCHED]); UMD patent on rolling-shutter ENF [FETCHED]; ENF + decentralized ledger/consensus is published (DEMA SPIE 2023, DeFakePro 2022 [FETCHED], EconLedger 2021 [SNIPPET]). A public ENF map as reference is exactly DEMA's headline. No consumer product found; no hackathon project found.
- DEMAND 5/10. Frijters 2022 says a reference database does not exist and more validation is needed [FETCHED]; media-authenticity demand broadly high (C2PA/Truepic/Numbers ecosystem [SNIPPET]) but those incumbents use device signing, not ENF. Technical risk: LED fails at distance; India is mostly LED and 50 Hz grid variance across a large synchronous grid is small, so a witness-phone ledger needs mic hum (not tested here).
- CLOSEST: DEMA (Binghamton, SPIE 2023): decentralized ENF map to verify media time/location. Differs: academic paper aimed at social media/surveillance; Hum Clock = phone-witness crowd ledger on a public chain, a hackathon build.
- COLLISION 1/10 (zero showcase hits for timestamp/ENF/provenance-by-physics; ENF is obscure).

### S-D Pocket Sonar
- CROWDING 9/10. ApneaApp (UW 2015 [FETCHED]) is the same phone-sonar apnea mechanism; ResMed SleepScore shipped in 2018 [FETCHED]; further papers on phone sonar hybrids (JTD hybrid app [SNIPPET]), SonarBeat 18-22 kHz [SNIPPET], opioid-overdose FMCW variant [SNIPPET]. Only the 0G decision/safe-state wrapper has no prior work found (and that is a sponsor-wrapper, not the physics).
- DEMAND 6/10. Clinical demand for home apnoea screening is real (UW pursued FDA approval [FETCHED]); elderly-alone monitoring demand not separately sourced here [UNVERIFIED]. Nothing from hackathon users.
- CLOSEST: ApneaApp / SleepScore: identical sensing; differs only in the 0G alarm decision, logging, and safe state.
- COLLISION 1/10 (no showcase hits for apnea/elderly/sonar-breathing; physics is hard to rebuild in 36 h).

### E3 MachineLease
- CROWDING 8/10. Granted US12567090B2 (IoT EQ LLC, granted 2026-03-03): vibration/run-time-based billing of rented equipment via blockchain [FETCHED]. Commercial: Trackunit/Sunbelt/Hilti telematics and Hapn engine-hour billing [SNIPPET+FETCHED]. Hackathon: IOFY [FETCHED], UsageX (HackMoney 2026, usage-based USDC settlement) [listing FETCHED], PermaRent [SNIPPET], RentalRide (pay-as-you-go rental) [FETCHED listing]. Only "phone clipped to machine as the sensor + 0G AI checkpoint + stop-on-unreachable" has no prior work found.
- DEMAND 6/10. Telematics vendors sell billing-by-usage to recover unbilled hours (Trackunit equipment utilization page [SNIPPET]); no printed demand for phone-only metering found.
- CLOSEST: US12567090B2 (vibration-based blockchain billing) plus Hapn/Trackunit hardware; differs in using a phone and AI classifier, and in refund settlement.
- COLLISION 3/10 (usage-based payment and rental are common hackathon themes; the machine-vibration headline specifically has no hits).

## Summary table
| Candidate | Crowding | Demand | Closest prior art | Concurrent-collision risk |
|---|---|---|---|---|
| S-B | 4 | 6 | Ozer/Feng Citizen Sensors SHM + MyShake (no ledger layer) | 1 |
| S-C | 7 (research) / 3 (product) | 5 | DEMA SPIE 2023 decentralized ENF map; UMD ENF patent | 1 |
| S-D | 9 | 6 | ApneaApp (UW 2015) / ResMed SleepScore (2018) | 1 |
| E3 | 8 | 6 | US12567090B2 granted 2026 vibration-billed blockchain rental; Hapn/Trackunit | 3 |

Least crowded and best demand: S-B. Attack next: verify that smartphone MEMS accelerometers can credibly measure PPV (calibration against a shake table or reference geophone; the Mumbai authority already dismissed phone readings), and open the DEMA paper to see exactly what it claims.

## Calibration
Shallow pass: 4 candidates. Deep pass downgraded 3 of 4 (S-C from "nothing found" to research-level ENF+ledger prior art; S-D to already shipped; E3 to a granted patent). S-B stayed. Blind spot: concurrent unpublished work is invisible; zero ETHGlobal title hits may reflect title/tagline-only search.

## Searches run / sources fetched / tools used
Searches (WebSearch): ENF smartphone rolling shutter blockchain; smartphone sonar apnea ApneaApp; crowdsourced phone vibration SHM MyShake blockchain; pay-per-use equipment rental IoT blockchain; ENF blockchain reference database; Sleep as Android/Nest Hub/Soli; India construction vibration monitoring; Enconomy; Trackunit/Hilti/Sunbelt billing; DEMA authors; ProofMode/Starling/Truepic/Numbers; MACH402/Kleeto. GitHub: two repo searches (0 hits). ETHGlobal showcase q= terms: vibration, rental, sonar, apnea, earthquake, accelerometer, sensor, timestamp video, IoT, proof of time, enconomy, elderly, provenance, usage, machine.
Fetched: PMC9304164, UW ApneaApp news, CoMotion SleepScore, IOFY page, Google Patents US12567090B2 (Playwright) and US10623712, DeepAI DeFakePro, asianage MMRC, gethapn.com.
Blocked/failed: Justia (403), SPIE DEMA page (empty), MDPI EconLedger (403), DOAJ (Cloudflare 403), arXiv 2207.13070 PDF (unreadable), Enconomy page itself not opened (listing only), events=tokyo2026/newdelhi filter pages not browsed separately. Not searched: Truepic/Starling official docs, Nest Hub/Soli individually, MyShake docs, patents for S-B/S-D, GitHub issues for demand.
