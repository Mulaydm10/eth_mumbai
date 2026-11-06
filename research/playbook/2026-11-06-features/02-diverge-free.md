# 02 DIVERGE D1: FREE GENERATOR frame (Tremor Witness features)
Angle: unconstrained, boldest and most varied features across DSP, quorum/trust, evidence pack, dashboard/report, onboarding, judging-table demo, measurement, judge materials. Criticism off; build-difficulty notes only. No novelty claims.
Date 2026-11-06. Worker D1. Read-only on repo.

## Log
- [read] diverge-context.md: product facts, off-table list (no pivot, no AI chat, no tokens, nothing server-load-bearing for read/verify). Sure: high.
- [read] 01-commitments.md §A: Arkiv 4x25% (friction, reach, why-arkiv, how-you-use), Swarm bonus (encrypted refs, feeds), ENS (EAC, permissioned resolver, aliasing, expiring/revocable, agents as namespaces bonus), EF CROPS (works when backend off; no trackers; "proves shipped frontend matches repo"). Sure: high.
- [skim] packages/core/src: dsp.ts (Biquad, VelocityTracker, StaLta, measuredRateHz, dominantHz, lowFreqRatio), quorum.ts (computeQuorum, Trigger, isLive), sync.ts, coherence.ts (COHERENT_AT 0.6, SUSPECT_BELOW 0.4). Sure: high on exports only; internals not read in depth.
- [search] WebSearch "Rayleigh wave velocity near-surface soil ... arrival time difference". Found (via search summary only, no page fetched): surface-wave geometric decay ~ r^-0.5 vs body waves r^-1; soft soil attenuates faster; for piling Rayleigh waves dominate far field; Rayleigh speed approx S-wave speed (MASW estimates it). Did NOT confirm the 100-300 m/s range (my prior knowledge, unverified). Sources: https://link.springer.com/doi/10.1007/s10706-017-0285-x , https://cyberleninka.ru/article/n/attenuation-of-the-soil-vibration-amplitude-at-pile-driving , https://www.kgs.ku.edu/Publications/OFR/2002/KGSOFR2002-70.pdf . Sure: medium on r^-0.5 / Rayleigh dominance; low on speeds. No injection text seen.
- [ingredient, from own knowledge, unverified] Android Chrome Generic Sensor API gives accelerometer ~60 Hz with jitter; Web Audio gives ~44.1 kHz mic; Vibration API gives motor pulses; WebCrypto supports ECDSA P-256 and Ed25519 (browser dependent); BarometerSensor not in Chrome. Sure: medium.

## IDEAS (numbered; fields: 1 sentence / 2 criterion+sponsor / 3 native / 4 demo / 5 evidence / 6 difficulty / 7 real phones? / 8 rationale)

### I-01 Wavefront arrival-time map (the phones locate the source)
1. With the 3-tone sound-sync giving sub-10 ms clock alignment, each phone's STA/LTA onset time is used to fit a source bearing/position and propagation speed, drawn as an expanding ring on the dashboard.
2. Technicality, WOW. Arkiv "How you use Arkiv" (trigger entities already carry t and waveform; location is the new queried field).
3. Uses only existing trigger+sync entities; location is an output of the record, not a new store.
4. 10 s: spare-phone motor buzzes at one end of the table; three phones light up in order, a ring and a "source is about here, 40 cm side" marker appear.
5. Measurement: localisation error vs ground truth on a table/floor; apparent wave speed in the demo medium.
6. Medium-hard: needs onset picking at 60 Hz (16 ms samples; interpolation), sync residual, multilateration with unknown speed (4 unknowns, 3 phones is under-determined unless speed is fixed or 4+ phones). Real physics bound: Rayleigh speed in soil is ~100s m/s (unverified), so cm-scale tables give sub-sample delays; works better as building-scale.
7. Yes.
8. Turns "k of n felt it" into "and here is where from", the missing evidence for attributing to a specific site.

### I-02 Moveout consistency check (physics-gated quorum)
1. Quorum additionally checks that onset order across phones is consistent with a single travelling wave (plausible speed range), flagging simultaneous-everywhere triggers as non-seismic (e.g., coordinated fake or common-mode noise).
2. Technicality, Practicality. Arkiv "Why Arkiv" (the check is recomputed from public entities).
3. Extends quorum.ts as another deterministic rule that every viewer recomputes.
4. 15 s: a "fake" run where three phones are triggered by the same software signal shows a red "no physical moveout" reject reason next to a green real event.
5. Rejection-rate data on real vs injected events.
6. Medium (new reject reason, needs sync-quality gating).
7. Yes.
8. Adds a physical, non-cryptographic defence to the trust model, and a new reject reason judges can see.

### I-03 Distance-decay fingerprint (amplitude vs distance, r^-0.5)
1. Phones declare an ENS text record for approximate distance band (e.g. 80 m) from a site; the record checks PPV falls off roughly as expected and flags outliers.
2. Technicality; ENS (text records as sensor metadata, EAC to let a phone edit only its own record).
3. ENS subname text records already exist per phone.
4. 10 s: scatter plot of PPV vs declared distance with a fitted decay curve and an outlier highlighted.
5. Fitted decay exponent from real phones at known distances.
6. Medium; privacy trade-off (coarse bands).
7. Yes.
8. Uses ENS records for something computed, not decorative. (Surface-wave decay ~r^-0.5 per search above; low confidence.)

### I-04 Phone-signed hash chain per sensor (gap-evident log)
1. Each phone chains its trigger records (and periodic heartbeat/quiet-window attestations) hash-linked, so deleting or backdating a record shows as a gap.
2. Technicality, Originality; Arkiv "who can edit each entity" and expiry fit.
3. Tamper-evidence is the product thesis; this makes it per-phone and cryptographic.
4. 10 s: dashboard shows a chain with one link removed turning red, verified in the browser.
5. Number of heartbeats and uptime per phone as evidence of "quiet means quiet".
6. Medium (heartbeat entity volume vs Arkiv writes; sensor entity has 7 d expiry).
7. Partly.
8. Answers the standard criticism: absence of events is also evidence only if the phone was listening.

### I-05 Quiet-night baseline attestation ("silence proof")
1. Each phone publishes a signed hourly noise-floor summary so a later claim "nothing happened at 3 am" or "piling ran at 3 am" is comparable to the baseline.
2. Practicality, Arkiv reach. 3. Same sensor entity, new field. 4. 8 s: timeline strip with baseline shading and a spike. 5. Per-phone noise-floor statistics (phone at rest, real nights). 6. Easy-medium. 7. Yes (overnight run). 8. Makes thresholds defensible, shows false-trigger rate.

### I-06 Resident-held evidence capsule (encrypted Swarm pack with threshold unlock)
1. Sealed pack is stored encrypted on Swarm; the key is secret-shared k-of-n among the co-signing phones so the pack opens only when k residents agree to release it (e.g., to a lawyer).
2. Swarm bonus ("upload them encrypted so only the people who get the reference can open them"); Arkiv "who can edit". 3. Quorum model reused for disclosure. 4. 20 s: two of three phones tap "release", pack decrypts in the viewer; one phone alone cannot. 5. Demonstrates privacy-preserving disclosure. 6. Hard-ish (Shamir in browser, key delivery without our server, e.g. via ENS-resolved pubkeys; must not store the reference with key in public Arkiv per the Swarm warning). 7. No. 8. Directly hits the Swarm text and a real tenant concern (retaliation by builders).

### I-07 Swarm feed as living site ledger
1. A Swarm feed (mutable pointer) per site updated at each sealing, so the latest viewer + data bundle has one stable address, with Arkiv holding the feed owner.
2. Swarm bonus ("reference or feed"), EF CROPS (serverless frontend). 3. Fixes the known "Swarm HTML hosting blocked / bzz.link needs mainnet ENS" gap. 4. 8 s: open the feed URL on a fresh laptop with our server off. 5. Time-to-open measurements. 6. Medium (feed signing key handling, gateway behaviour). 7. No. 8. Moves the read path off our server.

### I-08 "Pull the plug" demo mode
1. One button/section of the demo: kill the Vercel deployment and API, then open the offline viewer from a Swarm reference and recompute the quorum for a sealed event.
2. EF CROPS "including the moment it matters ... switch off your backend". 3. This is the product's lead property. 4. 25 s: terminal shows backend 503, viewer still recomputes "3 of 3 confirmed" and hash re-check passes. 5. Recorded proof. 6. Easy-medium (mostly scripting + a second RPC fallback). 7. No. 8. Makes the CROPS structural claim visible.

### I-09 RPC/gateway quorum reader (multi-provider verification)
1. Viewer queries Arkiv/Swarm/ENS through N independent endpoints and shows agreement, so no single RPC provider can lie or censor.
2. EF CROPS "swap the RPC provider"; "P: what each third party learns". 3. Verification path already client-side. 4. 10 s: toggle a provider to "malicious" and see disagreement flagged. 5. Provider disagreement counts. 6. Medium. 7. No. 8. Strengthens "nobody controls" past the phones to the readers.

### I-10 Reproducible frontend attestation
1. Viewer shows hash of the shipped bundle and a link to the repo commit/build recipe so a user can rebuild and compare.
2. EF CROPS idea list "a tool that proves the shipped frontend ... matches the public repo". 3. Same frontend that verifies the record verifies itself. 4. 10 s: "bundle hash matches build from commit abc" check. 5. Reproducible build log. 6. Medium (deterministic Vite build, hash published in Swarm/ENS contenthash). 7. No. 8. Closes the trust loop for judges asking "why trust the viewer".

### I-11 Committee as Safe 2-of-3 with ENS EAC delegation
1. Replace server committee key with a Safe (resident reps), and use Enhanced Access Control so a registrar role can register phones but only the Safe can revoke/change k.
2. ENS (EAC, expiring/revocable). 3. Fixes known weakness. 4. 20 s: revoke a phone from a second signer's phone; server not involved. 5. On-chain role table. 6. Hard-ish (Safe on Sepolia + ENSv2 contract roles). 7. No. 8. Removes the "committee is our key" objection.

### I-12 Phone-owned permissioned resolver (each phone edits only its own records)
1. Each phone subname has its own permissioned resolver so the phone key (not committee) updates its own health/params text records (band, firmware, last-calibrated), committee only controls registration.
2. ENS ("Give subnames their own Permissioned Resolver so they fully own their data"). 3. Phone already signs readings. 4. 10 s: phone updates its record; committee tries and is refused. 5. Contract tests. 6. Hard. 7. No. 8. Maps directly to prize text.

### I-13 Join by shaking: calibrate-and-onboard in 10 s
1. Onboarding requires the resident to put the phone on the floor and stomp/tap in a guided pattern, producing a calibration vector (sensitivity, noise floor, axis orientation) stored in the sensor entity and used to normalise PPV.
2. Usability, Practicality. 3. Same sensors, same signing. 4. 12 s: a progress ring fills by tapping; phone appears on the dashboard with calibration badge. 5. Inter-phone PPV spread before/after calibration. 6. Medium. 7. Yes. 8. Reduces the biggest uncertainty (uncalibrated phone PPV).

### I-14 Society QR + "join the witnesses" link
1. A printable QR/poster per building opens the PWA pre-bound to a site, runs drip, and registers pending ENS membership until a rep approves.
2. Usability, Reach (Arkiv reach.md). 3. Existing flow. 4. 8 s scanning a QR on the table. 5. Time from scan to first heartbeat. 6. Easy. 7. Yes. 8. Concrete answer to "who is it for and can they try it today".

### I-15 Interference-proof sync: ultrasonic/chirp sync with Doppler-free ranging
1. Replace/augment the 3-tone beep with a chirp (e.g. 2-6 kHz) and cross-correlation for sub-millisecond alignment; also gives phone-to-phone acoustic distance.
2. Technicality. 3. Extension of sync.ts. 4. 8 s: residual-clock-error readout drops from ~ms to sub-ms. 5. Sync accuracy measurement vs tone method. 6. Medium. 7. Yes. 8. Enables I-01 and tightens window.

### I-16 Source signature classifier (piling vs breaker vs TBM vs truck)
1. Fingerprint by dominant frequency, impulse repetition rate and low-freq ratio, shown as a label with confidence.
2. WOW, Practicality. 3. Features already computed. 4. 10 s: buzz motor pattern -> labelled "periodic impulse 1.4 Hz". 5. Confusion matrix on recorded sources. 6. Medium (needs labelled data; classical features, not ML chat). 7. Yes. 8. Helps residents assign blame to the activity.

### I-17 Public-threshold compliance view (against stated limits)
1. Report highlights when PPV in a band exceeds a configurable limit (from a site text record) and for how long, as a time-over-limit table.
2. Practicality, Usability. 3. Report page. 4. 8 s. 5. Exceedance logs. 6. Easy. 7. No. 8. Output in the form a regulator or lawyer reads. (Do not invent legal limits; make it configurable.)

### I-18 Replay with a live phone: "ghost event" scrubber
1. Dashboard lets a judge replay a sealed event's waveforms from Arkiv/Swarm in sync, with onset markers and the quorum window, and re-run the quorum at different k/window.
2. Usability, WOW. 3. Everything is computed in-browser. 4. 15 s: slide k from 3 to 2 and watch a rejected event become accepted. 5. Sensitivity of quorum to parameters. 6. Easy-medium. 7. No. 8. Makes the deterministic recomputation tangible.

### I-19 Adversary table: attack-and-detect scoreboard
1. A page that stages attacks (replayed record, forged phone, handling, single-phone fake, coordinated fake) and shows which defence rejects each.
2. Technicality, Practicality. 3. Matches quorum reject reasons. 4. 25 s. 5. Detection matrix, honest about coherence's weakness. 6. Medium. 7. Partly. 8. Judges trust visible failure cases; reuses EXP-0001 honesty.

### I-20 Judge-table "stand on it" rig
1. A foot-stomp pad/board with three phones taped at set distances, producing an event with scoreboard; judges stomp themselves.
2. WOW. 3. Trigger source already exists. 4. 10 s judges produce a sealed event. 5. Per-stomp PPV set. 6. Easy. 7. Yes. 8. Interactive, memorable, honest about phone PPV range.

### I-21 Custodian-less long retention: re-seal relay
1. Before Arkiv's ~182.5 d expiry, any viewer can re-publish an event with the same hash to a new entity ("anyone can extend"), keeping provenance via a pointer to the Swarm pack.
2. Arkiv friction/how-you-use (expiry fit); Practicality. 3. Addresses known weakness. 4. 8 s. 5. Retention across expiry. 6. Medium. 7. No. 8. Makes years-long disputes plausible without a server.

### I-22 One-page judge brief mapped to rubrics
1. Print/PDF with a QR to the report, claims-vs-evidence table incl. known weaknesses.
2. All rubrics. 3. Reuses report. 4. Handed over. 5. n/a. 6. Easy. 7. No. 8. Materials for judges.

## DISCARDED
- ML earthquake-style detector: no labelled data; adds nothing to tamper-evidence.
- Token reward for sensors: off-table.
- Server-side dedup/analytics: breaks CROPS "P".
- Camera/optical vibration: off-scope, privacy.
- Barometer/Bluetooth proximity: unavailable in Chrome (unverified).
- Chat assistant over data: off-table.
- Zero-knowledge proof of triggers: heavy, nothing a judge sees in 4 min.

## Searches run / sources fetched / tools used
1 WebSearch (Rayleigh/attenuation; summary only, no fetch). Read, Bash. No blocked paths. No injection text seen.
