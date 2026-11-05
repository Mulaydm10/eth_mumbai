# 07 CONVERGE angle C4: FINALIST-PANEL RED-TEAM (S-B Tremor Witness, S-A LIFEBOAT, E1 LeakMeter)
Lens: only how a live ETHGlobal finalist panel (4 min demo + 3 min Q&A, ~25 teams/3h, unweighted Technicality/Originality/Practicality/Usability/WOW) reacts. Sponsor fit and feasibility are other angles.
Log format: each entry = what I did / URL or file / found / confidence.

## Log
- [read] converge-brief.md (only brief read). Candidates, rubric and gates noted. Confidence high.
- [browser] ethglobal.com/showcase?q=TARE then https://ethglobal.com/showcase/tare-ozced (ETHOnline 2026 Finalist; Uniswap Foundation winner). Playwright works, no rate limit seen.
  Problem (1 sentence): "Measures what a Uniswap v4 hook really takes from your swap; nobody publishes how much."
  Measured number: 125,072 measurements / 7,817 pools / 112 hooks; "96.74 bps quoted, 96.74 bps executed, to the wei"; 61,916 rows honestly published as "not measurable" (reasons kept, no zeros).
  Demo moment: swap quote with hook vs same pool with hook bytecode replaced by 89-byte stub (anvil_setCode); gap IS the take. Extension reads calldata 3s before you sign. Live demo is a static site: 8.3 MB corpus shipped in page, zero network requests (deployment gate trivially safe).
  Lesson: winners lead with a hard measured number, a single clever trick, honest "unmeasurable" disclosure, and a live demo that cannot break (no backend). Confidence high.
- [browser] ?q=Cordon -> two Cordon entries (Tokyo 2026 cordon-3c7yx, ETHOnline 2026 cordon-vw3kh): "helps AI teams balance performance and cost within a shared budget". List cards give no finalist badge; not opened (low value). Confidence: low on whether finalist.
- [browser] https://ethglobal.com/showcase/nonet-xyebu NoNet, ETHGlobal New Delhi 2025 Finalist + Hedera 1st. Problem: "Enable onchain transactions completely without internet or cellular." Demo moment (inferred from described mechanism, not seen on video): sign tx on phone offline, BLE hops phone to phone until a gateway phone with internet broadcasts it, receipt returns through mesh. Measured number: NONE on page (6-byte fragments, ~1KB max message only). Only "Source Code" link, no Live Demo link, yet still a finalist. Lesson: a physical multi-phone moment can carry a finalist slot without a number or hosted link. Confidence high on page text; medium on how it was demoed.
- [browser] https://ethglobal.com/showcase/kura-so3wx Kura, ETHGlobal Tokyo 2026 Finalist (+Uniswap 1st, ENSv2 3rd). Problem: "Vault physical Magic cards, sell shards to verified humans, buy out 80% to take the card home." Demo moment: vendor scans a physical card, it is recognised and priced, on-chain twin appears (physical object on table). Number: none headline (80% buyout threshold only). Live Demo link present; Sepolia testnet; World ID in play. Lesson: finalists can be a testnet product with a physical prop, an understandable one-line story and a hosted link; ENSv2 is already used by finalists (not novel). Confidence high on text.
- [browser] ?q=Enconomy and ?q=LeekWallet are not yet opened (next).
- [browser] https://ethglobal.com/showcase/enconomy-9m8x8 Enconomy, ETHGlobal Tokyo 2026 Finalist (no sponsor prize listed on page). Problem: "Two phones prove they're within close proximity, using sound and then ZKP." Demo moment: two phones side by side play tones, 'NEAR' under 60 cm; relay attack adds measurable delay (sound ~34 cm/ms). Measured numbers: <60 cm threshold, ~9 s on-device proof on Pixel 6. Live Demo link present. Android phones + sensors only. CLOSEST precedent to S-B: phone sensors as the whole hardware, physics-based anti-spoof, a finalist. Lesson: phone-physics novelty plus a named attack it defeats ("relay") plus honest numbers reads as Technicality+Originality. Confidence high.
- [browser] ?q=LeekWallet next.
- [browser] ?q=LeekWallet returned [] with 4 console errors (retry with ?q=Leek worked) -> https://ethglobal.com/showcase/leekdiyhardwarewallet-5qssg "LeekDIYHardwareWallet", ETHOnline 2026 Finalist (no sponsor prize on page). Problem: "Open-source ESP32 hardware wallet with on-device verification and refuse-by-default signing." Demo moment: physical OLED shows decoded tx; device refuses unknown calldata (a physical object on the table). Number: none headline. Live Demo link present. States its own limits ("PoC, testnets, no audit") and was still a finalist. Lesson: honesty about limits is not penalised; physical object + clear refusal moment. Confidence high.
- Grounding summary (6 finalist pages seen: TARE, NoNet, Kura, Enconomy, LeekWallet; Cordon only list card): 5/5 opened pages have a one-line problem a stranger gets in 5 s; 4/5 have a physical or one-trick visual moment; only TARE leads with a hard number; 4/5 have a Live Demo link, NoNet does not (still a finalist). None used a mock for its central claim except where labelled. I did not see their videos or the 3-min Q&A, only write-ups. Confidence: medium that this generalises (n=5).

## ANALYSIS (judge view). Evidence = brief + finalist pages above; everything about live behaviour is my reasoning, not observed.

### Cross-cutting findings
- [HIGH] Finalists in the sample that won on phone physics (Enconomy) pair a named attack (relay) with a threshold (<60 cm) and a proving time (9 s). S-B needs the same: a named attack (hand-shake spoof), a threshold, a calibration number. Without one measured number S-B reads as "an app that logs shaking".
- [HIGH] Pitch size: 4 min + 3 min Q&A with ~25 teams in 3 h means ~7 min/team, no setup slack. Anything needing a second network handshake (testnet confirmation, Arkiv write, ENS resolve) in the live path is a risk; pre-write, then show read-back.
- [MED] ENSv2 and World ID are already seen at Tokyo finalists (Kura). They are not a novelty signal; do not count them toward Originality.
- [MED] Mocked World ID proofs: a judge who knows the event will ask. Say "mocked at this event" first, before they ask.

---
## CANDIDATE S-B: Tremor Witness
### 1. Problem as a judge hears it and 30-s opening
Problem: "Residents next to metro construction have no independent vibration meter, so we turned their phones into one the contractor can't own or fake."
Opening (30 s), numbers marked [MEASURE] must be filled from real tests, not invented: "In 2017 Mumbai's metro authority said app readings 'cannot be that accurate', and J.N. Petit said buildings saw 4x the limit while the authority said 'below limit'. So we did not ask you to trust one phone. We laid four phones on this table [MEASURE: phone vs reference agreement within X %]. Watch what one phone can't do alone."
### 2. 4-min beat sheet (WOW marked)
- 0:00-0:30 Opening above. Four Android phones lie flat on the table running the PWA, laptop shows live dashboard.
- 0:30-1:00 Dashboard shows the four traces, quiet. Say what PPV is, one sentence.
- 1:00-1:40 Presenter drops/stomps a heavy book on the table (or taps a speaker with bass) three feet away. All four traces spike within the window; dashboard flips to "CONFIRMED: 4/4 agree, PPV x mm/s, f Hz" and an Arkiv entity ID appears with the expiry date.
- 1:40-2:30 **WOW: the spoof.** One teammate picks up ONE phone and shakes it violently. Only one trace spikes; dashboard shows "REJECTED: 1/4, no quorum" and the heavy trace stays unconfirmed. Judge's eyes: the room can see physical cause and rejection in one gesture. (Do the real stomp first so the contrast is earned.)
- 2:30-3:00 Open the Arkiv entity from a second device: fields site/PPV/freq/quorum/expiry; ENS name with contractor read-only role (show it is read-only: attempted write fails).
- 3:00-3:40 Kill the app server (close the laptop's local server / block host), reload the evidence from Arkiv: still readable (CROPS property).
- 3:40-4:00 Close with the measured number and the one open limitation (phone sampling band).
Physically on table: 4 phones, one heavy object. Screen: 4 live traces plus a verdict banner.
### 3. Scores (sceptical judge, 1-5)
- Technicality 3: multi-device time alignment and quorum is non-trivial, but no validated PPV; TDOA from browser clocks is not credible (see risk). Becomes 4 only with a calibration result.
- Originality 4: phone-network-as-witness plus expiring on-chain evidence is unusual. Crowd-sensing seismology exists (MyShake etc.) so not 5.
- Practicality 3: real, documented grievance; but evidentiary weight of phone data is exactly what the authority disputes.
- Usability 4: one-link PWA, any judge can become a sensor; DX of the Arkiv schema is a bonus.
- WOW 4: physical, live and on cue; the spoof rejection is a memorable beat.
### 4. Five hardest questions
1. "Why does this need a blockchain?" Honest: the claim is not computation but custody: the contractor and the authority both have an incentive to dispute or delete a record. Arkiv gives append-only, expiry-bound, third-party-readable storage that survives our server; the quorum rule lives off-chain. A signed S3 log by a trusted notary would be the alternative; we say what we lose (a notary to trust). STRONG-ish, rated OK: judges may reply "a notarised PDF does it".
2. "Can't they just... say the phones are inaccurate?" (the 2017 line). Honest: yes, which is why we publish phone vs reference error and a quorum, not single readings. Strength depends entirely on having the number. WEAK until a calibration number exists; STRONG after.
3. "What did you measure?" Needs: agreement between phones on the same shake (spread %), detection rate and false positive rate of quorum on N real events including spoofs, and how many we rejected. If only "it works on the table": WEAK. With numbers: STRONG.
4. "Can't someone put four phones and shake them together / own N phones?" Honest: the quorum assumes one human per sensor; World ID Agent Pass is mocked at this event so sybil resistance is demonstrated, not proven. Physical collocation (all four on one table) is also easy to spoof by one actor. OK at best, honest answer is "we require geographic/floor diversity in deployment, not shown here". WEAK-OK.
5. "How does a phone on a floor measure structural PPV, and what about frequency range?" Honest: MEMS accelerometers in Chrome typically deliver ~50-100 Hz sampling (browser may cap), coupling to the structure matters; we only claim the band we validated. OK if band is stated; WEAK if the team claims full-spectrum PPV.
### 5. Failure modes and honest fallbacks
- Sensor permission/API: Chrome Android needs HTTPS and a user gesture; iOS needs explicit permission. Fallback: pre-grant on all demo phones, test 10 min before the slot; keep a 2nd spare phone.
- Table noise (audience, HVAC, hand on table) causes false confirms. Fallback: show the threshold and a quiet baseline for 10 s; real, not faked.
- Clock sync between phones: quorum window T seconds is lenient; keep T generous and say so. Do not demo TDOA bearing live (see HIGH).
- Wi-Fi at the venue: use the team's own hotspot; Arkiv write may be slow/fail. Fallback: write the entity beforehand and show a second real event as "queued, pending write" with the pending state shown honestly.
- Arkiv or ENS endpoint down: show the previously written entity; label "recorded earlier".
- The stomp is not reproducible on cue: rehearse with a fixed object and distance; if it fails, repeat once, real.
### 6. Finalist gate (live deployment by link)
- PWA hosted at an HTTPS URL runs on any Android phone (works) and iOS Safari (permission prompt). A judge on a LAPTOP has no motion sensor: they can only see the dashboard. [HIGH] Provide a clearly-labelled "replay of a real recorded session" mode for laptops, plus a "join as a sensor" QR for phones; do not offer a simulated shake as if live.
- A judge opening the link alone sees one sensor: quorum can never confirm. [HIGH] The page must say "needs 3+ phones; here is a recorded real session", else the first impression is "REJECTED/no data".
- Dashboard hosted statically reads Arkiv from the browser: fine if Arkiv endpoint allows CORS (not checked by me; see sponsor-docs-notes in other angle).
- ENS names: resolvable only on whatever network ENSv2 testnet exposes; a judge cannot reproduce write roles without a wallet, so show recorded read-only proof.
### 7. INTERVENTION (weakest = Practicality and Technicality at 3; I rewrite for Practicality/credibility)
New opening (30 s): "The metro authority's director said phone readings 'cannot be that accurate'. So we measured. On a [MEASURE] ... [TEST ARRANGEMENT] four ordinary Android phones agreed within [X]% on peak velocity, and a single phone shaken by hand was rejected [N]/[N] times. One phone is a claim. Four is a witness." Then WOW: put ONE phone on the table next to a trusted reference vibration (e.g. a calibrated app on a lab phone or a known actuator) and show side-by-side error (only if actually measured).
Re-score if the numbers exist: Practicality 3 to 4 (answers the authority's own objection), Technicality 3 to 4, total +2. If numbers do NOT exist, scores stay at 3 and Q2/Q3 stay WEAK. Fabricating an accuracy figure is not an option.
### Biggest risk S-B: [CRITICAL] No validated accuracy number. The one objection on record from the authority is "not accurate", and a panel will ask exactly that.
Other: [HIGH] TDOA bearing from browser clocks over Wi-Fi: phone clock sync error (tens of ms) vs seismic travel across a flat is ~ms; the bearing is not credible live, cut it. [MED] sybil proof mocked.

---
## CANDIDATE S-A: LIFEBOAT race (EIP-8141 frame transactions)
### 1. Problem and 30-s opening
Problem: "Your private key leaked, bots steal any ETH you send in for gas, so your tokens can't be rescued, until now: no ETH ever touches the compromised address."
Opening: "Sweeper bots drain a compromised wallet within seconds of any gas arriving. We built the bot, and here is how fast it is: [MEASURE: median ms from deposit to sweep on the testnet]. Then we rescued the tokens anyway, without sending a single wei to that address. Also: we counted how much sits in wallets like this: [MEASURE: $X across N addresses]."
### 2. 4-min beat sheet
- 0:00-0:30 Opening with the two numbers.
- 0:30-1:10 Screen: a wallet "leaked key" holding tokens and approvals, no ETH. Sweeper bot window running next to it (our own bot).
- 1:10-1:50 Demo the OLD way: send gas ETH; bot sweeps in X ms; tokens gone. Visible loss.
- 1:50-2:50 **WOW: the rescue.** Same setup with a fresh wallet; submit ONE frame transaction with an ERC20 paymaster; the bot logs "no ETH to sweep" and assets land in the fresh key; approvals revoked, atomic. Two-pane screen: bot log scrolling while rescue lands.
- 2:50-3:30 Adversarial twist slide: [MEASURE] share of delegated-to-sweeper wallets that hold ERC20 but no ETH, and the admission rule that keeps the owner ahead.
- 3:30-4:00 Arkiv registry of sweeper delegates (read, with query), close.
Physically: no hardware; two terminals/screens only. Weakest on-table presence of all three.
### 3. Scores
- Technicality 5 if live on real EIP-8141 plumbing; 3 if it is a simulation. A panel can tell: show the tx hash.
- Originality 3: rescue-by-7702 and Flashbots whitehat exist (brief); novelty is gasless-via-paymaster plus the twist.
- Practicality 3: real loss category, but the audience is people who already lost keys; tooling that doesn't exist on mainnet yet (EIP is a draft).
- Usability 2: a judge cannot use it; the DX is a spec-level integration.
- WOW 4: a bot defeated on screen is a clean beat, if the race works.
### 4. Hardest questions
1. "Why does this need a blockchain?" Fair but off-target: it is a blockchain-native problem; the honest answer is that the exploit and the fix live in the tx format. STRONG (but they may ask "why Arkiv"; OK: public registry needs durable neutral storage).
2. "Can't they just use EIP-7702 / Flashbots whitehat?" Honest: yes, those exist (name them): 7702 rescuers need gas ETH at the address or a relayer fee and Flashbots has a $1k minimum with 5-10% fee; ours needs no ETH and works for small balances. Strength: OK, depends on verifying those claims and that a 7702-delegated EOA works with frame signature checks (the forum comment says it may not): WEAK if it fails.
3. "What did you measure?" Needs the sweeper speed and the wallet census. If the census is a small sample: say N. OK; WEAK if only anecdotal.
4. "Does the paymaster let sweepers attack too?" The team's own adversarial twist: strength STRONG when the admission rule is demonstrated, WEAK if only proposed.
5. "Is this on a network anyone can reach? Does EIP-8141 exist on mainnet?" Honest: no, a draft EIP on a devnet/testnet we operate or a client branch. WEAK-OK; the judge will downgrade Practicality and Usability.
### 5. Failure modes
- The race may not happen on cue: bots and mempools are nondeterministic. Fallback: record the real run in advance, show the live attempt AND the logged run side by side, labelled as such; never script the bot's response.
- Devnet down/reset: keep a reproducible local node; state "local devnet" out loud.
- Frame tx tooling bug: precompute and show the tx hash from a previous successful run with block explorer link.
- Own bot is a straw man: publish its code; judges may say "you wrote the opponent". Fallback: replay a bot from existing public repos (sweeper in the brief) unmodified.
### 6. Finalist gate
Hosted page can show the replay and the registry, and a "run it yourself" button against a public testnet only if an 8141-capable network is public. [CRITICAL] If EIP-8141 only runs on a local devnet or custom client, "anyone can open the link and try it" is NOT satisfiable beyond a recorded replay; judges also need to bring a wallet for a testnet that wallets don't support (current wallets cannot create frame txs). Android phones: a hosted page works for viewing; no part runs on phones. Arkiv registry is the only part a judge can verify independently.
### 7. INTERVENTION (weakest = Usability 2)
Opening rewrite: "Open this link on your phone and press 'Leak a wallet'. It makes a burner key, funds it with test tokens, and starts our sweeper. Press 'Rescue': one transaction, zero ETH. Your phone just won a race that every existing rescue tool loses." WOW: audience's own phone triggers the race live (via burner on a testnet), result in under a few seconds with the sweeper log on the main screen.
Re-score: Usability 2 to 3 (any judge can run it) and WOW 4 to 4 (a participant's own action may raise to 5 if it works on cue, but the failure risk rises). Net +1, and it requires a public network. If no public 8141 network exists, the intervention is not available and the score stays 2.
### Biggest risk S-A: [CRITICAL] Dependence on a draft EIP with thin tooling and a flagged 7702 incompatibility; if the live race is a recording the demo becomes "trust our video" and Usability/Practicality collapse.
Other: [HIGH] opponent is self-written; [MED] prior-art repos exist.

---
## CANDIDATE E1: ReadLeak / LeakMeter
### 1. Problem and 30-s opening
Problem: "Every RPC call you make tells your provider who you are; we show you exactly what, and how much disappears when you use Anon-RPC."
Opening: "After [MEASURE: N requests / M minutes] a normal RPC provider can link [X of Y] of your wallets; behind Anon-RPC it links [Z]. Here is the same 200-read session, run both ways."
### 2. 4-min beat sheet
- 0:00-0:30 Opening with the numbers.
- 0:30-1:30 Run the fixed read corpus through plain RPC; a graph builds node by node: wallets linked by IP, timing, shared reads.
- 1:30-2:30 **WOW (as designed, mild):** the same corpus via Anon-RPC, graph stays disconnected; side by side score "leak 87 vs 12" [MEASURE].
- 2:30-3:20 Compatibility score: which calls fail through Anon-RPC (honest column).
- 3:20-4:00 Arkiv-mirrored registry of chains/RPCs; close.
Physically: laptop only.
### 3. Scores
- Technicality 3: a harness and a scoring heuristic; depends on the quality of the inference model.
- Originality 2: EF's own track texts list "what an app leaks" as a suggested idea; judges will see it as the obvious submission.
- Practicality 3: real privacy gap; but who will run it?
- Usability 3: simple dashboard, clear before/after.
- WOW 2: charts, no physical moment.
### 4. Hardest questions
1. "Why does this need a blockchain?" Honest: it doesn't; Arkiv holds a registry mirror. WEAK. Say it before they do.
2. "Can't they just run their own node / use Tor / a VPN?" Honest: yes for some; we measure that too only if we included those baselines. WEAK unless a baseline row exists.
3. "What did you measure?" Leak score on a fixed corpus; depends on ground-truth: the adversary is OUR heuristic. OK.
4. "You wrote the attacker; of course it links your wallets." Honest: heuristic is deliberately simple; publish it and the corpus; precision/recall against known linkages. OK.
5. "Is Anon-RPC production-ready and does compatibility hold?" Honest: report the pass rate. OK if numbers are real.
### 5. Failure modes
- Anon-RPC endpoint down or rate-limited: pre-run and cache the real result set; show live run plus cached run, labelled. 
- Slow anonymising round trips eat demo time: run the corpus ahead and replay with a timer showing real latencies.
- Leak graph looks synthetic: show raw logs on request.
### 6. Finalist gate
Fully static dashboard + cached results can be hosted; the live "run it yourself" works from a laptop or phone if the Anon-RPC harness is browser-based (it is a browser harness package per the brief). Safest gate of the three. [LOW] Nothing here needs sensors or special hardware.
### 7. INTERVENTION (weakest = WOW 2, and Originality 2)
Opening rewrite: "Paste any wallet address. Watch your provider's view of you assemble in real time, and then watch it fail to assemble the same view through Anon-RPC." WOW: judge pastes their own address (read-only) and the page shows their own linked wallets from public chain data plus request timing, then the Anon-RPC pane remains blank.
Re-score: WOW 2 to 3 (personal and live), Originality 2 stays 2. Net +1; stays below the others. Honest caveat: the "provider" is our own proxy.
### Biggest risk E1: [HIGH] "Obvious submission" perception: EF track text suggests it; combined with low WOW and "why blockchain" weakness it blends into the 25.

---
## HEAD-TO-HEAD (probability of making the finalist cut; my lens only)
1. S-B Tremor Witness: highest. Physical, on-cue, easy to explain, one-gesture WOW (spoof rejection), and Enconomy shows phone-physics finalists exist. Condition: a real calibration number. Without it, falls to a tie with S-A.
2. S-A LIFEBOAT: highest ceiling, highest variance. Drops to 3rd if no public 8141 network (gate) or the race is not live.
3. E1 LeakMeter: highest P(gate and demo work) but lowest P(selected): low originality, low WOW. TARE shows a measurement tool can win but only with a hard, large and novel measurement and a clever trick, which E1's fixed corpus does not yet have.
Biggest risk per candidate: S-B = no validated accuracy number [CRITICAL]; S-A = draft EIP/tooling and a non-public network [CRITICAL]; E1 = indistinguishable from the obvious idea [HIGH].
Single WOW per candidate: S-B = one phone shaken by hand rejected while the table stomp is confirmed by four; S-A = bot log shows nothing to sweep while the frame tx rescues the tokens; E1 = judge pastes own address and sees the provider's view assemble then fail on Anon-RPC.

## What this lens cannot see
Sponsor-prize fit, EIP-8141 / Arkiv / Anon-RPC / ENSv2 real availability, whether phones' browser sampling rate and clock sync support the claims, the actual panel members, and how finalists were selected before the live session (it is by video and link, which I did not model). I saw write-ups only, not demo videos or Q&A. n=5 finalist pages. All [MEASURE] placeholders are things the team must produce; I invented no results.

## Searches run / sources fetched / tools used
- Read: converge-brief.md (only).
- Playwright (ethglobal.com): showcase?q=TARE, tare-ozced; ?q=Cordon (list only); ?q=NoNet, nonet-xyebu; ?q=Kura, kura-so3wx; ?q=Enconomy, enconomy-9m8x8; ?q=LeekWallet (returned empty with console errors), ?q=Leek, leekdiyhardwarewallet-5qssg.
- Not done: Cordon detail pages (not clearly finalists), demo videos, WebSearch/WebFetch (not needed, browser worked). Blocked/failed: ?q=LeekWallet exact query returned no results (worked via ?q=Leek).
