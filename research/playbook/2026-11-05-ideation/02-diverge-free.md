# 02 - DIVERGE D1: FREE GENERATOR (unconstrained)
Angle: unconstrained generation; only filter is the OFF-THE-TABLE list. Criticism off. Searches look for ingredients, not answers.

## Log
- [read] diverge-context.md in full. Confident. Noted OFF-TABLE list, phone-only hardware, sponsor menu.
- [search] "smartphone accelerometer detect earthquake P-wave crowdsourced EEW". Found: Android Earthquake Alerts detects P-waves with phone accelerometers; >11,000 quakes, >1,200 alerts in 98 countries 2021-24 (Science paper); MyShake predecessor. https://www.research.google/blog/android-earthquake-alerts-a-global-system-for-early-warning/ , https://www.livescience.com/technology/communications/google-has-turned-2-billion-smartphones-into-a-global-earthquake-warning-system-its-as-effective-as-seismometers-tests-show . Sure (search snippets, not fetched). Ingredient: phone IMU as a seismometer; the trust problem (who attests a phone's reading) is open.
- [search] "phone mic machine sound anomaly / bridge vibration". Found: IIT Kanpur phone-mic air-compressor fault ~93% (3 classes); Saitama Univ phones as bridge-girder sensor nodes; phone mic poor below 200 Hz; phone haptic motor can act as acoustic probe (patent). Moderately sure (secondary summaries). Ingredient: vibration motor + accelerometer = active vibration probe of a surface (a phone can "ping" a structure/table/wall).
- [search] "Mumbai local train deaths". Found: 2,468 deaths on suburban tracks in 2024, 2,590 in 2023 (~7/day), 570 from falling out of trains in 2024; 7.5M riders/day at ~2.6x capacity. https://www.indiaspend.com/mumbai-locals-worlds-busiest-urban-rail-system-is-also-its-deadliest-96093 , https://theprint.in/opinion/7-die-daily-on-mumbai-trains-due-to-overcrowding-trespassing-pacs-2017-solutions-ignored/2660197 . Fairly sure (figures vary by source).
- [search] phone sonar / WiFi breathing sensing. Found: SonarBeat: 18-22 kHz CW sonar from phone speaker+mic gives contact-free breathing rate on Android; WiFi CSI breathing/heart rate in sleep. https://eng.auburn.edu/~szm0001/papers/ACMTCH2021.pdf , https://pmc.ncbi.nlm.nih.gov/articles/PMC8157398 . No clinical validation found. Sure of lab feasibility, not of clinical use.
- [search] Mumbai monsoon waterlogging data gaps. Found: BMC flood gauges at ~25-100 spots; waterlogging spots 498 (2026) vs 453; BMC IoT sensors planned for pumps not depth; tweet-mining of "ankle/knee-deep" reports. https://www.freepressjournal.in/mumbai/mumbai-to-tackle-waterlogging-bmc-installs-automated-flood-gauges , https://www.context.news/climate-risks/mumbai-turns-to-twitter-for-help-mapping-indias-monsoon-floods . No source quantifying the data gap. Moderately sure.
- [search] parametric insurance basis risk. Found: payout triggers rely on distant weather stations; ~80% of respondents dissatisfied with station locations (2010 AFC study via summary); 622 farmers got nothing though they had losses; denser data lowers basis risk. https://indexinsuranceforum.org/node/80 , https://www.wtwco.com/en-us/insights/2023/12/enhancing-disaster-resilience-addressing-basis-risk-in-parametric-insurance . Sure about the basis-risk concept.
- [search] Android keystore / Play Integrity attestation. Found: hardware key attestation (TEE/StrongBox) gives a cert chain a server can verify, works without Play services; unlocked-bootloader bypass tools exist (anecdotal). https://mas.owasp.org/MASWE/MASVS-RESILIENCE/MASWE-0054/ . Moderately sure. Ingredient: signed sensor readings from a real device. HCE/PPG/barometer parts of the query returned nothing.
- [search] Arkiv expiry/attributes. Found: entities have BTL (blocks, ~2 s each), expire out of queryable state but remain in tx history; string attrs eq-only, numeric attrs range-queryable; SQL-like query; BTL extendable. https://arkiv.dev.golem.network/docs , https://docs.rs/arkiv-sdk/0.4.1/arkiv_sdk/client/struct.ArkivClient.html . Moderately sure (SDK version skew noted; team summaries unverified).
- [search] street vendors heat India. Found: Mumbai M-East survey of 40 vendors (Apr-May 2026) near-daily heat symptoms; WIEGO 519 vendors, 89% no free clean water; 2025 survey 79% consulted doctor for heat illness. https://citizenmatters.in/more-heat-less-business-street-vendors-struggle-as-temperatures-soar-in-mumbai/ , https://www.newslaundry.com/2026/05/04/2026/04/13/as-india-braces-for-summer-informal-workers-have-little-heat-protection . Sure. PM2.5/haze half returned nothing.
- [search] ENF forensic timestamping. Found: mains-hum frequency fluctuations in recordings can be matched to a reference ENF database to date a recording and detect edits (UK case used National Grid readings); recapture can alter traces; needs a reference database. https://robertheaton.com/enf/ , https://www.mast.umd.edu/files/paper_ENF/conf_paper3_WIFS12.pdf . Sure of technique; no confirmed public reference DB found. Ingredient for idea 7 below.
- [search] acoustic injection on MEMS accelerometers. Found: WALNUT (Michigan, USENIX Sec 2018): sound at resonance makes accelerometers report false motion; a phone's own speaker drove an Android app output; defenses = randomized / 180-degree out-of-phase sampling. https://arxiv.org/pdf/1806.07558 , https://record.umich.edu/?p=42165 . Sure. Ingredient: a real, citable spoof attack for the Level-3 "attack and defend" component.
- [search] relay attack on proof of personhood. Found: little. Relay attack described generically; nothing confirming World ID's relay resistance. https://proof-of-you.netlify.app/learn/threats/relay-attack . Unsure; treat as an open question, not a fact.

## IDEAS (generation mode, criticism off)

### 1. Quakepool: a shake-quorum insurance that pays when pockets agree
- Problem: people uninsured against shaking/crowd-crush-type physical events get paid, if at all, weeks later by a distant station-based index (basis risk). Who: renters, small shops. Evidence: basis risk grows with distance from reference station; 622 enrolled farmers got nothing despite losses. https://indexinsuranceforum.org/node/80 and https://www.wtwco.com/en-us/insights/2023/12/enhancing-disaster-resilience-addressing-basis-risk-in-parametric-insurance
- Mechanism: each phone's IMU runs a P-wave-style detector; a reading is signed with Android hardware key attestation and bound to a World ID so one human is one sensor; a spatial quorum (N unique humans within R metres within T seconds) opens a payout window; payout in USDT with no gas. Spoofing (a speaker playing resonant tones to fake shaking) is rejected by randomized/phase-flipped sampling and a mic cross-check.
- Ingredients: Android Earthquake Alerts (https://www.research.google/blog/android-earthquake-alerts-a-global-system-for-early-warning/); WALNUT acoustic injection (https://arxiv.org/pdf/1806.07558); key attestation (https://mas.owasp.org/MASWE/MASVS-RESILIENCE/MASWE-0054/).
- Sponsors: World (sybil: a quorum of fake phones is the whole attack; ID makes the quorum count humans), Arkiv (readings as short-TTL entities with a numeric geo/time attribute so the quorum is a range query; expiry deletes raw location data), Whitechain (payout with no gas or crypto step). Each is structural: remove World and the quorum is farmable; remove Arkiv and there is no cheap spatial query.
- Phone role: the sensor, the signer, the wallet.
- Level 3: spoof-resistant quorum detector: measured detection latency and false-alarm rate on a hammer/shake-table test and a day of pocket walking, plus measured attack success of a speaker-injection spoof before/after the defence.
- WOW: Dhruv thumps the judges' table; every phone on it buzzes and a payout lands in under a few seconds; then he plays a spoof tone and the quorum refuses.
- Number: p95 time-to-quorum (ms); false alarms per phone-day; spoof success % before/after.

### 2. Thumbprint: a physical-object notary that works by vibrating it
- Problem: a tokenized physical thing (a gold chain, a warranty-item, a lab sample) can be swapped for a lookalike after the token is issued; the token proves nothing about the object. Who: buyers of tokenized real-world assets, kirana-scale gold lenders.
- Evidence: mixed, I found no direct source for swap fraud counts. Not claimed.
- Mechanism: put the phone on the object; the vibration motor plays a chirp, the accelerometer + mic record the object's resonance response (mass, shape, material give a structural fingerprint); the compressed fingerprint is committed at tokenization; re-verification compares response with a tolerance. Twin objects are the red-team test.
- Ingredients: phone motor as acoustic probe (patent mention, https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12490038); phones as vibration sensor nodes (Saitama bridge work, see log); phone mic poor under 200 Hz so the design leans on accelerometer and 200 Hz-20 kHz mic band.
- Sponsors: Hedera (HTS tokenization of the item; Studios needed because the token IS the product) and Arkiv (fingerprint entity with attributes, BTL as a re-verification deadline: lapse means "unverified"). Two only.
- Phone role: probe, sensor, verifier.
- Level 3: same-object-vs-identical-twin discrimination; equal error rate across, say, 20 near-identical mugs/keys/coins.
- WOW: three identical steel mugs on stage; a judge secretly swaps one; the app screams "not the same mug" and the audience watches the spectra differ.
- Number: EER % over N twin pairs; repeatability across placement angles.

### 3. Nightwatch: a pocket device that listens to a sleeper breathe (physical-AI)
- Problem: night-time breathing trouble in infants or the elderly goes unnoticed by families without wearables. Who: families in small Mumbai flats. Evidence: lab feasibility only (SonarBeat, https://eng.auburn.edu/~szm0001/papers/ACMTCH2021.pdf); no clinical validation found.
- Mechanism: phone emits 18-22 kHz CW sonar, extracts chest phase to get breaths/min and apnea gaps; a 0G-hosted model classifies pattern in the decision loop; decisions trigger local siren/vibration and a call; if 0G is unreachable a local conservative rule alarms (safe stop, no faked decisions). ENSv2 names such as grandma.family.eth with access-control roles decide who can read the live status and who can acknowledge an alarm; wildcard resolver gives each family a status endpoint.
- Sponsors: 0G Physical AI (the loop is the product; pocket device track), ENS (roles are the permission model of a health feed; hard-coded lists would defeat the point). 
- Phone role: the whole body of the agent: speaker, mic, vibration, siren.
- Level 3: breathing-rate accuracy vs manual count and vs a reference at 1 m with a fan and a TV on.
- WOW: a volunteer holds breath on stage; alarm goes after N s; their sister's phone across the room buzzes only because she holds the ENS role.
- Number: mean absolute error bpm; apnea-gap detection latency.

### 4. Gridhum Notary: prove WHEN a recording happened using the electricity grid
- Problem: viral clips and evidence recordings are impossible to date or to prove unedited; deepfakes make "this was recorded at 3pm Tuesday" unprovable. Who: journalists, complainants in disputes, court witnesses.
- Mechanism: a crowd of phones record 50 Hz mains-hum fluctuation (ENF) and publish a minute-by-minute grid-frequency reference trace; any later audio/video's ENF trace is matched against it to timestamp it and reveal splices. Chainlink CRE workflow aggregates the reference trace from many phones (median across devices, rejecting outliers) and writes it on-chain.
- Ingredients: ENF forensics (https://robertheaton.com/enf/ ; https://www.mast.umd.edu/files/paper_ENF/conf_paper3_WIFS12.pdf). Caveat found: reference database is the hard part, which is exactly what the crowd supplies.
- Sponsors: Chainlink CRE (aggregation workflow is the oracle), Arkiv (reference trace as queryable time-bucketed entities, query by minute), World optional; keep two.
- Phone role: mic as grid-frequency meter.
- Level 3: timestamp accuracy: given a 60 s clip, probability the true minute is the top match among a day of candidates; splice-detection rate on edited clips.
- WOW: judge records 30 s of room noise on their own phone; app names the minute they recorded to within seconds, then Dhruv splices ten seconds out and the app points at the cut.
- Number: top-1 minute accuracy on N clips; splice localization error in seconds. (Bonus: frequency droop map doubles as a grid-stress signal, Dhruv's energy background.)

### 5. Shoulder-to-shoulder: coach-level crush index from pocket signals, read anonymously
- Problem: Mumbai locals run at ~2.6x capacity and 2,468 died on the suburban tracks in 2024 (570 falling from trains); commuters have no way to see which coach/door is dangerous before boarding. https://www.indiaspend.com/mumbai-locals-worlds-busiest-urban-rail-system-is-also-its-deadliest-96093
- Mechanism: phones on a platform/in a coach advertise and scan BLE; count of distinct rotating-ID neighbours plus accelerometer jostle gives a density index per coach, published as short-TTL entities; riders query "least crowded coach for the 8:14" through EF Anon-RPC so the query does not reveal their station or commute.
- Sponsors: Arkiv (TTL = freshness; 90 s entities per coach; attribute queries by train and station), EF Anon-RPC (the commute is exactly the sensitive thing; reads must hide who asks).
- Phone role: sensor and display.
- Level 3: density index vs hand-counted ground truth on a platform (calibration), plus a privacy leak test of the read path.
- WOW: eight phones in the room "become a train"; the judges pile into a corner and the coach index rises live.
- Number: Spearman correlation of index vs headcount; query-linkability measured.
- Note: BLE counting only, no mesh payments (off-table avoided).

### 6. Splashmark: monsoon flood depth from a scooter's shudder, expiring when the water leaves
- Problem: Mumbai has 498 waterlogging spots, flood gauges at tens of locations, and BMC IoT sensors planned for pumps not depth. https://www.freepressjournal.in/mumbai/mumbai-to-tackle-waterlogging-bmc-installs-automated-flood-gauges
- Mechanism: a phone mounted on a two-wheeler/car uses accelerometer + mic (wading noise, drag-induced deceleration) to classify wading depth bands; a report becomes a TTL entity that expires on its own as water recedes; a Chainlink CRE workflow cross-checks reports against rain forecasts and writes a road-closed state.
- Sponsors: Arkiv (expiry is the native semantics of a flood), Chainlink CRE (cross-source check).
- Phone role: sensor.
- Level 3: depth-band classifier trained in a tub/puddle with a ruler; confusion matrix.
- WOW: a tub of water, a phone on a toy cart rolled through; depth band shown live and entity dies when the tub is drained.
- Number: depth-band accuracy; report-to-expiry lag.

### 7. Lockout: the machine will not start unless a verified human is breathing next to it
- Problem: industrial lockout-tagout failures kill maintenance workers when a remote operator starts a machine; a relayed or stolen human approval is the hole. Evidence: none gathered; not claimed.
- Mechanism: a World ID Agent Pass approval to start a machine is valid only if the approver's phone sonar shows a living chest within 1 m of the machine's own phone (speaker/mic liveness plus a shared acoustic challenge to defeat relay); denial/expiry path included. Roles for who may approve which machine live in ENS names (EAC).
- Caveat flagged: borderline with the OFF-TABLE "route only what needs a human" theme; the difference is physical co-presence, not routing.
- Sponsors: World (the human requirement), ENS (per-machine roles). 
- Level 3: relay-attack success rate of a remote approval replayed through a second phone, measured with and without the acoustic challenge.
- WOW: Somnath tries to approve from the next room via a video call and the motor stays dead; Dhruv walks up and it starts.
- Number: relay attack success % (target 0 of N); false-reject rate for genuine presence.

### 8. Heat Dose: a wage floor that pays street vendors for the hours they were actually cooked
- Problem: vendors work in heat with no protection; surveys show near-daily symptoms and 89% without free clean water. https://www.newslaundry.com/2026/05/04/2026/04/13/as-india-braces-for-summer-informal-workers-have-little-heat-protection
- Mechanism: the phone's own battery-temperature drift, light sensor (sun vs shade) and GPS dwell build a personal heat-exposure score; a World ID-bound vendor gets small automatic USDT top-ups on high-dose days with zero crypto steps; exposure is a short-TTL entity.
- Sponsors: Whitechain (Payments Nobody Notices), World ID (one vendor, one payout), Arkiv.
- Level 3: how well phone-derived exposure tracks a reference thermometer in a sun/shade experiment.
- WOW: put the phone on a windowsill in sun; dose climbs; a payout triggers on a second phone with no wallet visible.
- Number: R^2 of phone-derived temperature vs reference; payout latency.

### 9. Wild card: Dead Reckoning Court (adversarial)
- A public arena where anyone is paid to fool a phone-sensor oracle (replay, resonance injection, emulator) and the bounty pool is funded by the oracle's operators. Reuses the WALNUT attacks (https://arxiv.org/pdf/1806.07558) and Dhruv's attack-search habit; sponsors Arkiv (attack logs as queryable entities), World (one human, one attacker), 0G or none. More a Level-3 harness than a product; best folded into idea 1.

## DISCARDED
- Camera-PPG health screening: crowded in academic apps, no sponsor needs it, and clinical claims are dangerous. Discarded.
- Phone barometer indoor floor-level proof: nothing found, no sponsor-native role.
- Doppler ultrasonic gesture "air-sign" signatures: cute, no problem owner.
- Phone-as-radar for pothole depth: roads data already crowded by commercial maps, and no sponsor primitive.
- "Pocket Seance": ghost-detector joke app with zero practicality; kept only as a reminder that humour needs a problem.
- Bluetooth/NFC proximity payment variants: OFF-TABLE.
- Frame-transaction / alternative-mempool ideas: I found no technical detail on frame transactions in this run and will not invent a mechanism; left to another worker.
- Haze/PM2.5 estimation from the camera: search found nothing, so no ingredient.
- Crowd-seismology as a pure oracle with no payout: thin on Practicality/Usability.

## Searches run / sources fetched / tools used
- WebSearch (standard mode) x 13 queries as logged above. WebFetch: none used (all findings are search snippets, not read pages; confidence is therefore moderate). Playwright: not used. No agents spawned. No blocked paths except that several queries returned nothing for sub-topics (HCE, PPG, barometer, PM2.5 camera estimation, frame transactions).
