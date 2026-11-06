# D4 DISTANT ANALOGY frame: mechanisms imported from far domains -> features for Tremor Witness
Started 2026-11-06. Append-only log.

## Log (append-only)
- [fetch OK] https://earthquake.usgs.gov/data/dyfi/background.php : DYFI groups responses into ZIP/city communities, weights 8 questions, averages per question (N/A excluded), CWS -> CDI = 3.40 ln(CWS) - 4.38, map refreshes ~5 min and recolours as responses arrive; raw unchecked data, no min-response rule stated. Sure: high.
- [fetch FAIL] github.com/sigsum/sigsum design.md : 404. Will retry other URL.
- [fetch OK] https://en.wikipedia.org/wiki/Parallel_vote_tabulation : PVT = random sample of polling stations, observers record the result POSTED at the station, send to a centre, estimates are checked against the official count (Zimbabwe 2008: photographed posted results). Margin-of-error not in article. Sure: medium (Wikipedia, thin).
- [fetch OK, low yield] Wikipedia Cosmic-ray_observatory: no coincidence details (WALTA = Washington Large Area Time Coincidence Array only). Need a better source.
- [fetch OK] https://git.glasklar.is/sigsum/project/documentation/-/raw/main/log.md : Sigsum witness cosigns a tree head only if consistent with earlier heads; cosignature = Ed25519 over "cosignature/v1 / time <unix> / tree head"; verifier policy defines which witnesses are trusted + quorum; proof = leaf + cosigned tree head + inclusion proof, verified OFFLINE with no outbound connections; log waits for enough cosignatures before publishing. Sure: high.
- [fetch OK] https://c2sp.org/tlog-witness : witness add-checkpoint: verifies sig, old size matches the last cosigned size, RFC6962 consistency proof, same-size root equality; refuses (409/422) otherwise and may log it as evidence of misbehaviour; persists state atomically. Cosignatures are timestamped. Sure: high.
- [fetch FAIL] auger.org page 404; Wikipedia Interferometry gave only D sin(theta) caption (TDOA geometry; from own knowledge, mark as not-fetched). Need seismology/air shower source via search.
- [search OK] MyShake (arXiv 2407.03570 "Real-World Accelerometer Data Quality in a Global Smartphone Seismic Network"; Kong-Allen-Schreier GRL 2016 https://rallen.berkeley.edu/pub/2016kong2/Kong-Allen-Schreier-MyShakeNetwork-GRL-2016.pdf ; ScienceDaily 2016): phone only classifies when STATIONARY; on-phone ANN separates quake vs human motion; trigger carries location/time/amplitude; server confirms by cluster in time+space (2016 press: >=4 phones AND >60% of phones within 10 km); after confirmation phone uploads 5 min of raw data. Search snippets only (not fetched in full). Sure: medium.
- [search OK] Raspberry Shake: community Python tool estimates minimum detectable magnitude from a station's measured background noise PSD; studies grade stations by PSD vs Nominal High/Low Noise Models; sites vary in availability %. Pages: community.raspberryshake.org/t/a-tool-for-analysing-background-noise/4291 ; pubs.usgs.gov/publication/70203350. Snippets only. Sure: medium.
- [search OK] OpenTimestamps: batch many digests into one Merkle tree to a calendar; first proof is a pending "calendar promise", upgraded ~1-2 h later with the Bitcoin attestation; calendar URLs in a proof are untrusted input (allowlist); verify by recomputing digest, following the branches, compare to block-header merkle root. Third-party sources only (github.com/sirruf/opentimestamps/wiki). Sure: medium.
- [search OK] eBird: curated regional filters compare each record to expected species/date/count thresholds; flagged records (4.6% in 2017; 57.4% validated) go to volunteer reviewer queue; unconfirmed stay in observer's own records, excluded from public output. https://biss.pensoft.net/article_preview.php?id=25395 ; https://birdcount.in/ebird-data-quality-review/ . Sure: medium.
- [search OK, thin] Safecast: device IDs required in config, logs tied to device ID/import ID, device-number collisions across third-party builds, anomaly review is informal (isolated spike with no neighbouring elevated points likely not real). No formal drift protocol found. Source: groups.google.com/g/safecast-devices threads. Sure: low-medium.
- [search OK, thin] IEC 60601-1-8 medical alarms: priority categories, "ALARM SYSTEM delay" components (Annex A), alarm limits, alarm condition LOGGING sections exist; full text paywalled, escalation/fatigue details NOT confirmed. Source: https://scc-ccn.ca/standardsdb/standards/2004077 . Sure: low.
- [search OK] Parametric insurance: trigger = measurable index + independent data source + threshold + payout table + observation period + dispute rules; payout calc "replicable by the client"; basis risk = payout misses real loss. Sources: https://www.pwc.ch/en/publications/2024/Basis_risk_in_parametric_insurance_challenges_and_mitigation_strategies.pdf , icmif Swiss Re deck. Sure: medium.
- [search OK] Hawk-Eye tennis: claimed mean error 3.6 mm (later 2.2 mm), ITF requires <5 mm; critics: broadcast shows definitive animation, not the uncertainty; clay excluded partly because of margin. https://tennisnerd.net/articles/electronic-line-calling-hawk-eye-technology-explained/39915 . Sure: medium (journalism).
- [search OK] CrowdQC/CrowdQC+ (Napoly 2018, Fenner 2021, https://www.frontiersin.org/journals/environmental-science/articles/10.3389/fenvs.2021.720747/pdf ): QC of citizen weather stations needs no reference data; levels incl. spatial check vs neighbours and temporal correction. Step detail (low-correlation filter) NOT confirmed. Sure: low-medium.
- [search OK] Certificate Transparency gossip (draft-ietf-trans-gossip-05, https://www.ietf.org/archive/id/draft-ietf-trans-gossip-05.txt): split-view / history-rewriting detected by STH Pollination (clients/servers pass tree heads around), SCT Feedback, trusted auditors; auditors periodically fetch STHs + inclusion proofs. Snippets only. Sure: medium.
- [search OK] Flight recorders: crash-survivable memory unit in layered armor + insulation, solid-state; underwater locator beacon 37.5 kHz pinger, water-activated, 30 days; spec ED-112A. Figures from secondary sources. Sure: medium-low.
- [search OK] CREDO (cosmic-ray ensembles with phones; arXiv 1811.10248): phones are detectors, time coincidence across distant detectors is the signature; false positives from hot pixels / bad coverage handled by persistence rule (>3 consecutive frames); GPS timing improves; timestamp uncertainty when frames lost. Sure: medium.

Fetches/searches done so far: 4+4+4+4 batches. Now: a few ingredient fetches for k-of-n/time-of-arrival and nuclear test ban verification (IMS), notary journal, then write features.
- [BLOCKED] 4 further WebSearch calls (CTBTO IMS, notary journal, structural health monitoring, DIN 4150-3) returned "You've hit your 5-hour limit, resets 7:20am IST". No further search possible; the features below for those domains rest on own knowledge and are marked UNFETCHED. Did not try curl for search engines (not a search path with ingredients quality); remaining budget used to write.

# FEATURES (18). Format: src / one-line / criterion / native / demo / evidence / difficulty / phones

## F1 Witness-style cosigned checkpoint ("cosigned event head") — Sigsum / C2SP tlog-witness
1 src: Certificate-Transparency-family witnesses; fetched https://c2sp.org/tlog-witness and https://git.glasklar.is/sigsum/project/documentation/-/raw/main/log.md. Witness cosigns a checkpoint only if consistent with the last one it cosigned (old size + consistency proof), refuses and logs otherwise; verifier policy = which witnesses + quorum; proof verifies offline.
2 feature: every site's Arkiv trigger stream is periodically summarised in a Merkle "site head" (size, root); each ENS phone cosigns the head only if it is an append-only extension of the head it last cosigned, and the sealed pack carries head + cosignatures so a viewer rejects a pack whose history was rewritten.
3 criterion: Technicality; Arkiv "How you use Arkiv" (who can edit each entity) and Why Arkiv; ENS "ENSv2 features central" (phones as witnesses named by subnames).
4 native: phones already sign readings and are ENS-registered; the policy k-of-n is already in ENS text records. Turns "tamper-evident" from a claim into an append-only proof.
5 demo: ~20 s: operator "deletes" a past trigger in a mock; viewer shows red "head inconsistent with cosignature of phone-02 (2 days ago)".
6 evidence: counts of heads cosigned per phone, max gap between cosigned heads, consistency check pass/fail per event.
7 difficulty: medium-high (Merkle tree over entities, cosign message format, viewer verifier in core). No server needed.
8 real phones: yes for the cosign step; simulate.ts can fake it.

## F2 Rolling split-view gossip between phones — Certificate Transparency STH pollination
1 src: https://www.ietf.org/archive/id/draft-ietf-trans-gossip-05.txt (search snippet; not fully fetched). Clients pass the tree heads they have seen to others so a log showing different views to different people is exposed.
2 feature: each phone writes the site-head hash it currently sees into its next trigger/sensor entity, so any viewer can check that all phones saw the same history (a "consensus-view" column).
3 criterion: Technicality, Originality; Arkiv how-you-use (fields filtered on).
4 native: sensor entity already exists and is queried by every viewer.
5 demo: 15 s: dashboard grid of phones x head-hash colour; one phone seeded with a divergent hash turns amber with "sees a different history".
6 evidence: % of phones agreeing per hour; a divergence log.
7 difficulty: low-medium (one extra field + viewer table). 8 phones: yes (simulated ok).

## F3 "Did You Feel It?" resident intensity reports bound to quorum events — USGS DYFI
1 src fetched https://earthquake.usgs.gov/data/dyfi/background.php : weighted questionnaire answers averaged per community -> CWS -> CDI = 3.40 ln(CWS) - 4.38, N/A answers excluded, map recolours as responses arrive, raw unchecked.
2 feature: after an event is flagged, each registered resident gets a 3-tap prompt (felt? / things moved? / cracks seen?) signed with the phone key and written to Arkiv, aggregated per building into a felt-index shown next to the PPV.
3 criterion: Practicality, Usability; Arkiv reach ("who is it for").
4 native: ground-truth human perception for events instruments cannot calibrate; fixes "phone PPV not geophone-grade" by pairing with human reports.
5 demo: 20 s: pulse the spare phone; second phone buzzes "Did you feel it?", tap; dashboard bar for flat 4B moves.
6 evidence: agreement between felt-index and PPV across events (a calibration curve built from the field).
7 difficulty: low-medium. 8 yes (the prompt UX), but could be shown on one phone.

## F4 Parallel vote tabulation: sampled posted-result comparison against the contractor's own log — PVT
1 src fetched https://en.wikipedia.org/wiki/Parallel_vote_tabulation (thin): observers at sampled stations record the result posted there, send to a centre, compared with the official count.
2 feature: let the contractor's/regulator's published vibration figure (a posted monitoring report) be entered as a signed "official claim" entity, and the viewer shows an automatic side-by-side: official claim vs what k-of-n phones recorded in the same window.
3 criterion: Practicality ("what challenges it solved"), WOW.
4 native: the exact dispute scenario (the builder says 'within limits').
5 demo: 20 s: claim entity "max PPV 4 mm/s at 14:00" vs phone record 11 mm/s; banner "claim disagrees with 3 of 3 witnesses".
6 evidence: discrepancy rate per claim.
7 difficulty: low (new schema + viewer panel). 8 no.

## F5 Coincidence-with-geometry: arrival-time lag check — radio astronomy / air-shower arrays / TDOA
1 src: from Dhruv's own domain knowledge; fetched Wikipedia Interferometry gave only the D sin(theta) timing offset caption; Auger and cosmic-ray pages 404/no content. CREDO (arXiv 1811.10248, search snippet) treats cross-detector time coincidence as signature. UNFETCHED for the maths.
2 feature: besides "k of n inside window", require that the arrival-time differences, after the sound-sync alignment, are physically plausible for the declared flat positions at a plausible ground wave speed (a causality envelope); implausible lags flag a replayed or fabricated trigger.
3 criterion: Technicality, Originality; answers the weak coherence/collusion item.
4 native: sync.ts already aligns clocks to ms; ENS text records can hold coarse positions.
5 demo: 20 s: a plot of lag vs distance with the allowed cone; a spoofed phone's point sits outside.
6 evidence: lag-residual distribution per event; speed-of-propagation estimates.
7 difficulty: medium-high (sync accuracy at ~60 Hz sampling limits it; needs positions). 8 yes, 3 phones at different distances.

## F6 Stationary gating of reports (MyShake) 
1 src: arXiv 2407.03570, GRL 2016 (search snippets): phones classify only when stationary; trigger carries location/time/amplitude; server clusters in time and space; raw data only after confirmation.
2 feature: a "phone is resting" gate (low gyro/accel variance for N s before and after) stored as a field; triggers during handling are marked handling and the quorum already rejects "handling"; add 'rest-minutes before trigger' to every record so viewers can reproduce the filter.
3 criterion: Technicality, Practicality.
4 native: quorum has reject reason handling; this makes the reason evidenced.
5 demo: 10 s: pick up a phone, record flips to "handling, excluded"; set down, it counts.
6 evidence: fraction of triggers excluded; false-trigger rate.
7 difficulty: low. 8 yes.

## F7 Upload-after-confirmation raw waveform window — MyShake
1 src as F6 (5 min raw after a confirmed quake).
2 feature: only after quorum is met does each witness phone publish a longer (e.g. 60 s) signed waveform pack to Swarm and point to it from the event entity; before that only the 1.5 s trigger lives on Arkiv.
3 criterion: Swarm bonus ("keep the files users see on Swarm and point to them"); Arkiv Why Arkiv (128 KiB limit).
4 native: solves the bytes limit and gives Swarm a real job.
5 demo: 15 s: event seals, report shows "3 raw 60 s packs, hashes match".
6 evidence: pack size, upload latency, % phones delivering.
7 difficulty: medium (needs phones to keep a ring buffer; outbox exists). 8 yes.

## F8 Station quality score from the phone's own noise floor — Raspberry Shake / PSD vs noise model
1 src: search snippets (community.raspberryshake.org/t/a-tool-for-analysing-background-noise/4291; USGS pubs 70203350): minimum detectable magnitude estimated from measured background noise PSD; stations graded against Nominal High/Low Noise Models.
2 feature: each phone publishes a nightly noise-floor summary (band RMS 2-25 Hz) signed to Arkiv; the viewer prints per-phone "smallest PPV I could have seen" and discounts a witness whose floor is above the event amplitude (no vote from a deaf phone).
3 criterion: Technicality, Practicality (honest limits).
4 native: turns "not geophone-grade" into a measured per-phone detection threshold.
5 demo: 15 s: bars per phone, one marked "floor 0.8 mm/s > event, cannot witness".
6 evidence: per-phone detection threshold history; availability %.
7 difficulty: low-medium. 8 yes (to be meaningful).

## F9 Pending-then-upgraded proof (OpenTimestamps calendar promise)
1 src: search results only (github.com/sirruf/opentimestamps/wiki): pending proof upgraded 1-2 h later with Bitcoin attestation; calendar URLs in a proof are untrusted.
2 feature: the evidence pack has two states, "sealed (cosigned by phones)" and "anchored later" where a daily Merkle root of all site heads is posted to an ENS text record or a public chain tx; the viewer shows the proof upgrading with a timestamp and refuses unknown anchor sources.
3 criterion: Technicality; Arkiv lifetime weakness (182.5 d) addressed by an external anchor.
4 native: gives an answer to "years-long disputes".
5 demo: 15 s: report badge "anchored in block N" vs earlier "pending".
6 evidence: seal-to-anchor delay.
7 difficulty: medium (needs an anchor target; a mainnet name was ASSUMED costly). 8 no.

## F10 Eligible-reporter tiers with filter-and-review queue — eBird
1 src: https://biss.pensoft.net/article_preview.php?id=25395 and https://birdcount.in/ebird-data-quality-review/ (snippets): automated filters flag unusual records for volunteer reviewers; unconfirmed records stay private; 4.6% flagged in 2017.
2 feature: an event whose amplitude/frequency is atypical for that site (compared with its own baseline) is auto-flagged "needs second look"; registered reviewer ENS names (e.g. a society engineer) can add a signed review entity: confirm/doubt; the public report shows both.
3 criterion: Practicality, Usability; ENS (roles via EAC).
4 native: reviewers are ENS subnames with limited rights.
5 demo: 20 s: flag appears, reviewer taps confirm, badge updates.
6 evidence: flag rate, reviewer agreement.
7 difficulty: medium. 8 no.

## F11 Persistence rule against hot-pixel-style stuck sensors — CREDO
1 src: arXiv 1811.10248 (snippet): hot pixels/bad coverage false positives; problem only if persisted >3 consecutive frames.
2 feature: a phone whose triggers recur with identical frequency/amplitude fingerprint outside any quorum is auto-quarantined (its own entity says "stuck/hot"), and its past votes are annotated.
3 criterion: Technicality.
4 native: phone accelerometers have stuck states and periodic machinery nearby (a pump).
5 demo: 10 s: a phone near a motor is flagged "constant 24 Hz, not an event".
6 evidence: quarantine log.
7 difficulty: low. 8 yes.

## F12 Parametric-trigger contract rendered from the record — parametric insurance
1 src: PwC basis risk paper https://www.pwc.ch/en/publications/2024/Basis_risk_in_parametric_insurance_challenges_and_mitigation_strategies.pdf (snippet): trigger = measurable index + independent data source + threshold + observation period + dispute rules; payout calculation must be replicable by the client; basis risk = payout misses loss.
2 feature: a "site rule card" stored in ENS text records (index = PPV over X for Y s, k, window, observation period, dispute window) with a viewer button "does this event satisfy the rule?" returning a signed yes/no a third party (society, builder, lawyer) can re-run; no money, no token.
3 criterion: Practicality, ENS records central.
4 native: k and window already come from ENS text records.
5 demo: 15 s: change k from 3 to 4 in ENS, same event flips to "rule not met".
6 evidence: rule-version hash included in every sealed event.
7 difficulty: low-medium. 8 no.

## F13 Measurement-uncertainty band shown on every verdict — Hawk-Eye
1 src: https://tennisnerd.net/articles/electronic-line-calling-hawk-eye-technology-explained/39915 : claimed mean error 3.6 mm vs 5 mm allowance; criticised because broadcasts show a definitive animation, not the uncertainty.
2 feature: every PPV and every quorum verdict is shown with an uncertainty band derived from the phone's own measured floor and clock offset (F8, sync), and "in/out" verdicts near a threshold render as "too close to call".
3 criterion: Usability, Practicality (honest), Originality.
4 native: known weakness (50-370 mm/s unvalidated) turned into a feature.
5 demo: 10 s: threshold line with a shaded band; verdict "too close to call".
6 evidence: fraction of verdicts inside the band.
7 difficulty: medium (uncertainty model). 8 no.

## F14 Multi-angle review replay (sports officiating)
1 src: tennisnerd source above (multiple cameras reconstructing a ball track); mechanism otherwise own knowledge, UNFETCHED.
2 feature: a "review" view that lines up all phones' waveforms on a common clock, scrubbable, with each phone's trigger instant marked, as the video-review room does for cameras.
3 criterion: WOW, Usability.
4 native: waveforms are on Arkiv and the viewer is offline.
5 demo: 20 s: judge drags a scrubber and sees three phones' waves line up on the stomp.
6 evidence: pairwise cross-correlation lags.
7 difficulty: low-medium. 8 yes (3 phones) but works on recorded data.

## F15 Underwater-locator-style "find my evidence" beacon (flight recorders)
1 src: search snippets on ED-112A: crash-survivable memory in layered armour; ULB pinger activates on water contact for 30 days.
2 feature: a human-readable "recovery card" (QR + short ENS name + Swarm hash + the 4 steps) printed per site so the record can be located and verified in 10 years even if our domain is gone; the card encodes where to look, not the data.
3 criterion: EF CROPS (lead property structural; "frontend keeps working when domain disappears"), Practicality.
4 native: the record survives servers going off; this makes that findable.
5 demo: 15 s: type the ENS name into the offline viewer, no network to our domain.
6 evidence: time to verify from the card alone.
7 difficulty: low. 8 no.

## F16 Journal-with-two-signatures notary entry (UNFETCHED, search was blocked)
1 src: notary journal practice; own knowledge, not fetched. A notary logs each act and requires the signer and notary signatures.
2 feature: a "custodian entry" where the resident who owns a phone countersigns (with a second key or a tap) each sealed event they accept as true, producing a person-plus-device double signature.
3 criterion: Originality, Practicality.
4 native: separates "my phone" from "me, I felt it".
5 demo: 10 s: tap "I confirm" and the pack gains a second signature.
6 evidence: % events confirmed by a human.
7 difficulty: low-medium. 8 yes.

## F17 Heartbeat / liveness tick (medical alarm "technical alarm" idea + availability stats)
1 src: IEC 60601-1-8 catalog only (https://scc-ccn.ca/standardsdb/standards/2004077), content of delay/logging sections not confirmed. Low confidence on mechanism; idea is own.
2 feature: phones write a tiny signed "I am listening" tick every N minutes; the viewer shows silence as a distinct state ("no data", never "no vibration") and the quorum report lists which phones were live at the event time.
3 criterion: Technicality; fixes absence-of-evidence misread.
4 native: isLive hook exists in quorum.ts.
5 demo: 10 s: kill one phone's tab; its dot turns grey, report says "2 of 3 live".
6 evidence: availability per phone.
7 difficulty: low (bytes cost on Arkiv, expiry 7 d fits). 8 yes.

## F18 Baseline-drift tracking for the building (structural health monitoring, UNFETCHED)
1 src: search blocked; own knowledge that SHM compares ambient-vibration modal frequencies to a long-term baseline. UNFETCHED. 
2 feature: using the nightly noise summaries, show a per-flat spectral baseline and flag a persistent shift in dominant frequency after a construction phase as an informational "building response changed" note, explicitly not a damage claim.
3 criterion: Originality, Practicality.
4 native: phones sit in the building already.
5 demo: 15 s: before/after spectra overlay (seeded).
6 evidence: baseline stability over days.
7 difficulty: medium-high, science risk. 8 yes, over days.

# DISCARDED (with reasons)
- Parallel counting of real "posted result photos" with image forensics: needs image pipeline, off-mission.
- Bitcoin calendar server of our own for timestamps: puts our server in the path (breaks CROPS).
- Insurance payouts / money: token/money mechanics, out of scope; kept only the rule-card idea (F12).
- CT log monitors run by us: server in verify path.
- Hot-pixel dark-frame style averaging for accelerometer: no analogue gain beyond F11.

# Searches run / sources fetched / tools used
WebFetch OK: USGS DYFI; Wikipedia PVT; Wikipedia Cosmic-ray observatory (no content on coincidence); Sigsum log.md (Glasklar); c2sp.org/tlog-witness; Wikipedia Interferometry (partial). WebFetch FAIL: github sigsum design.md (404), auger.org (404).
WebSearch OK (12): MyShake, Raspberry Shake, OpenTimestamps, eBird, Safecast, IEC 60601-1-8, parametric insurance, Hawk-Eye, CrowdQC, CT gossip, flight recorder, CREDO. WebSearch BLOCKED by 5-hour usage limit (4): CTBTO IMS, notary journal, structural health monitoring, DIN 4150-3. No curl fallback tried. Tools: Read, Bash (append), WebFetch, WebSearch. No injection text seen in fetched content. No novelty claimed. No other files edited, nothing committed.
