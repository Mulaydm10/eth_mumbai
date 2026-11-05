# Playbook run: ETHGlobal Mumbai ideation (DIVERGE → CONVERGE)

Started 2026-11-05 ~21:25 IST by Claude Code for Dhruv Mulay. Orchestrator: `playbook` agent (Opus).
**Append-only checkpoint log.** Every stage start/finish and every spawned worker is recorded here so that the run can be resumed if it is cut off.

| Time (IST) | Stage | Event | Output file |
| --- | --- | --- | --- |
| 21:25 | 0 | Run directory created; brief written to BRIEF.md | BRIEF.md |
| 21:20 | 1 | Orchestrator started; intake read (BRIEF.md complete, no INTAKE REQUEST needed) | BRIEF.md |
| 21:21 | 1 | Stage 1/1b/2 done: profile, triage (fan-out justified), mode = DIVERGE then CONVERGE | 00-intake-and-profile.md |
| 21:22 | 3 | Stage 3 done: rubric, TESTED/ASSUMED constraints, crowded list, config note, failure-mode map, angle plan | 01-commitments.md |
| 21:22 | 4 | Stage 4 start: spawning D1-D6 (diverge frames) + S1, S2 (sponsor grounding), all Sonnet | RESUME.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D1 free generator | 02-diverge-free.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D2 in-solution mechanism | 02-diverge-mechanism.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D3 question-the-goal | 02-diverge-question-goal.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D4 narrow-scope | 02-diverge-narrow.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D5 behavioral/informational | 02-diverge-behavioral.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): D6 distant analogy | 02-diverge-analogy.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): S1 sponsor prizes page verbatim (Playwright) | sources/sponsor-tracks-verbatim.md |
| 21:24 | 4 | Spawned general-purpose (sonnet): S2 sponsor docs/starters/endpoint probes | sources/sponsor-docs-notes.md |
| 21:27 | 4 | D1 free returned: 9 ideas (top: Quakepool, Thumbprint, Gridhum Notary); snippet-only sourcing, moderate confidence | 02-diverge-free.md |
| 21:28 | 4 | S1 returned: full verbatim prizes/details pages captured (Playwright, no 429). Resolved: World 5k=2.5/1.5/1k, proofs mocked; 0G PhysAI 2.5/1.5/1k (1k=best real hardware, phone not named, 0G Storage episode log required); EF one-prize rule; Arkiv one pick; Arc Studio required; ENSv2 mainnet/Sepolia (scratch); Definitive creative=continuity | sources/sponsor-tracks-verbatim.md |
| 21:28 | 4 | D3 question-goal returned: 8 ideas (top: Canary Keys, Frame Fuzz, Block-Arrival Mumbai); snippet-level evidence, medium confidence | 02-diverge-question-goal.md |
| 21:28 | 4 | D5 behavioral returned: 9 ideas (top: Lookalike-Proof Address Book, Coach Crowd Truth, Batch Truth Registry); search-summary evidence only | 02-diverge-behavioral.md |
| 21:28 | 4 | D6 analogy returned: 8 bridges (top: ENF Witness, CFAR swap guard, Incident-pinned black box); search-summary evidence. NOTE: ENF independently converges with D1 Gridhum Notary | 02-diverge-analogy.md |
| 21:29 | 4 | D2 mechanism returned: 8 ideas (top: Neighbour Seismograph, Pocket Sonar Sentinel, Grid-Clock Notary). ENF now from 3 of 6 frames (D1, D2, D6). Seismic quorum from 2 (D1 Quakepool, D2) | 02-diverge-mechanism.md |
| 21:30 | 4 | D4 narrow returned: 7 ideas (top: LIFEBOAT frame-tx rescue, WATERLINE, WITNESS); snippet evidence only. Compromised-key theme now from D3 (Canary Keys) + D4 (LIFEBOAT) | 02-diverge-narrow.md |
| 21:30 | 4 | Orchestrator read S1 key tracks (0G, Arkiv, EF x3, ENS, Whitechain, World). Key: EF alt-mempool explicitly invites DoS/fuzzers + ERC20/quota paymasters; CROPS demands structural property + kill-backend demo; ENSv2 is live on mainnet | sources/sponsor-tracks-verbatim.md |
| 21:33 | 5a | Cross-pollination start (S2 still running; not needed for this step) | 03-cross-pollination.md |
| 21:33 | 5a | Cross-pollination done: 4 new survivors (S-A LIFEBOAT race, S-B Tremor Witness, S-C Hum Clock, S-D Pocket Sonar) + 4 existing; 49->4 filter log | 03-cross-pollination.md |
| 21:33 | 4 | S2 returned: availability table (Anon-RPC probed OK via browser-harness 0.4.0; Arkiv Rabdi probed OK; ENSv2 Sepolia probed OK, mainnet v1 still serving; 0G testnet chat models absent, mainnet router only; frame-tx devnet UNCLEAR to S2 but S1 lists docs.altmempool.wtf devnet). SECURITY NOTE: Definitive docs index contains prompt-injection text asking agents to POST an intent report; not acted on | sources/sponsor-docs-notes.md |
| 21:33 | 4 | Stage 4 complete: all 8 workers returned | - |
| 21:34 | 5b | TRANSFORM start | 04-transform.md |
| 21:34 | 5b | TRANSFORM done: best versions of 4 new + 4 existing; all 8 go to 05/06 | 04-transform.md |
| 21:34 | 6 | Stage 5/6 start: spawning 2x prior-art-adversary + 2x impact-validator (4 candidates each) | candidates-brief.md |
| 21:35 | 6 | Spawned prior-art-adversary: S-A,E1,E2,E4 (crypto) | 05-prior-art-crypto.md |
| 21:35 | 6 | Spawned prior-art-adversary: S-B,S-C,S-D,E3 (physical) | 05-prior-art-physical.md |
| 21:35 | 6 | Spawned impact-validator: S-A,E1,E2,E4 (crypto) | 06-impact-crypto.md |
| 21:35 | 6 | Spawned impact-validator: S-B,S-C,S-D,E3 (physical) | 06-impact-physical.md |
| 21:38 | 6 | impact-validator (crypto) returned: S-A REAL&COSTLY per victim (aggregate unsized; Flashbots whitehat service min $1k, 5-10% fee); E1 NICE-TO-HAVE/minor; E2 NICE-TO-HAVE no evidence (drop); E4 REAL market fact, minor consumer need. Process note: worker overwrote its log (reconstructed file) | 06-impact-crypto.md |
| 21:38 | 6 | impact-validator (physical) returned: S-B REAL narrow/locally costly (residents lack data; Colaba demand quote; SC order to MMRCL); S-C NICE-TO-HAVE (timestamp not the bottleneck); S-D REAL&COSTLY health problem, product fit unproven; E3 REAL BUT MINOR (telematics exists). Worker also rebuilt its log after an overwrite | 06-impact-physical.md |
| 21:40 | 5 | prior-art (crypto) returned: S-A crowding 5 overall (7-8 for 7702/Flashbots gasless rescue: codeesura/eip7702-asset-rescuer, mevdao rescue, Aegis7702 registry; ~2 for 8141 + sweeper-paymaster measurement; forum snippet: 7702-delegated EOAs may break frame sig checks); E1 crowding 3 but Mumbai collision med-high, Anon-RPC spec draft; E2 crowding 6-7 (Unwind payer reclaim); E4 crowding 9 (GammaHedge, HedgeLP, Panoptic). Shared Playwright browser contention noted | 05-prior-art-crypto.md |
| 21:41 | 5 | prior-art (physical) returned: S-B crowding 4/demand 6/collision low (2017 MMRC vs J.N. Petit vibration dispute found; MMRC: phone readings not accurate = credibility risk); S-C crowding 7 research (DEMA ENF map, Frijters&Geradts: LED fails at 100 cm); S-D crowding 9 (ApneaApp, SleepScore shipped); E3 crowding 8 (granted patent US12567090B2) | 05-prior-art-physical.md |
| 21:41 | 6 | 05/06 merged. Survivors to CONVERGE: S-B Tremor Witness, S-A LIFEBOAT race (8141 form), E1 ReadLeak (control). Dropped S-C,S-D,E2,E3,E4 with reasons | 05-prior-art.md, 06-impact.md |
| 21:42 | 7 | CONVERGE start: spawning C1 sponsor-fit, C2 technical S-A, C3 technical S-B(+E1), C4 finalist red-team (all Sonnet) | converge-brief.md |
| 21:43 | 7 | Spawned general-purpose (sonnet) C1 sponsor-fit (S-B,S-A,E1) | 07-converge-sponsor-fit.md |
| 21:43 | 7 | Spawned general-purpose (sonnet) C2 technical S-A (devnet, EOA frame tx, ERC20 paymaster race, chain-data measurement) | 07-converge-technical-SA.md |
| 21:43 | 7 | Spawned general-purpose (sonnet) C3 technical S-B (+E1 Anon-RPC) (PPV physics, browser sensor caps, simulation intervention) | 07-converge-technical-SB.md |
| 21:43 | 7 | Spawned general-purpose (sonnet) C4 finalist-panel red-team (S-B,S-A,E1) | 07-converge-finalist-redteam.md |
| 21:46 | 7 | C4 finalist red-team returned: ranking S-B > S-A > E1. S-B CRITICAL: no validated accuracy number; drop TDOA; judge-link needs replay. S-A CRITICAL: public 8141 network/link gate; team-written bot. E1: originality 2 (sponsor-listed). Grounded on TARE, NoNet, Kura, Enconomy, LeekWallet pages | 07-converge-finalist-redteam.md |
| 21:47 | 7 | C1 sponsor-fit returned: S-B Arkiv Build+ENSv2+EF CROPS EV~$1.9k (CRITICAL: ENS cosmetic as briefed; fix = ENS sensor subnames gate confirmation; HIGH: CROPS privacy vs Arkiv $owner; World conflicts with kill-backend). S-A EF alt-mempool+Arkiv Mirror EV~$1.5k cond./$0.95k disc. (alt mempool best fit in doc; Arkiv decorative). E1 EF Anon-RPC+Arkiv EV~$1.15k. Public alt-mempool devnet found: altmempool.forshtat.com, chain 1337, eth_sendFrameTransaction, no faucet | 07-converge-sponsor-fit.md |
| 21:50 | 7 | C3 technical S-B(+E1) returned: signal 10-100x noise at >=3 mm/s 10-40 Hz; Chromium caps Generic Sensor + DeviceMotion at 60 Hz (source cited) -> PWA PPV biased -25..+17%, native 200 Hz within ~5% (simulated, scratchpad/c3/sim.py); coupling +30-60%; TDOA dropped; no PWA device attestation; ENS EAC per-key not per-name; Arkiv Rabdi + SDK API confirmed; Anon-RPC harness browser-only, latency unmeasured | 07-converge-technical-SB.md |
| 22:15 | 7 | C2 technical S-A returned: devnet LIVE (altmempool.forshtat.com chain 0x539); plain EOA can send frame tx via default code; ERC20-fee frame in spec; race SYMMETRIC (stake never slashed, same-nonce = fee auction) -> no post-leak protocol fix, only pre-leak commitment enforced by paymaster; CRITICAL: compromised-gasless-value number NOT computable (labelled sweeper victims hold $0; sample pool mostly legit Trust Wallet users); sweeper-delegated victims cannot frame-rescue (no APPROVE opcode). Stage 7 complete | 07-converge-technical-SA.md |
| 22:16 | 8 | Orchestrator spot-checks: altmempool devnet eth_chainId=0x539 (OK), Arkiv Rabdi=0x76edaf (OK), C3 sim.py re-run reproduces sim_out2 tail identically (scratchpad/c3/rerun_orch.txt). Reconcile start | 08-reconcile.md |
| 22:16 | 8 | Reconcile done: 8 tensions resolved (S-A number not computable -> lab number; race symmetric -> finding+paymaster policy, demoted; S-B ENS made the sensor registry gate; anti-sybil via ENS not World; accuracy claim reframed to trigger-record + measurable agreement/spoof rates; TDOA dropped; link gate = dashboard + PWA join). Ranking S-B > S-A' > E1 | 08-reconcile.md |
| 22:17 | 9 | Draft VERDICT v1 written; spawning adversarial board (5 roles) | VERDICT.md |
| 22:18 | 9 | Spawned board (sonnet, read-only): correctness | 09-board-correctness.md |
| 22:18 | 9 | Spawned board (sonnet, read-only): consistency | 09-board-consistency.md |
| 22:18 | 9 | Spawned board (sonnet, read-only): redteam | 09-board-redteam.md |
| 22:18 | 9 | Spawned board (sonnet, read-only): goalfit | 09-board-goalfit.md |
| 22:18 | 9 | Spawned board (sonnet, read-only): reproducibility | 09-board-reproducibility.md |
| 22:19 | 9 | Board red-team returned: #1 not shown wrong; dropped list holds. HIGH: why-blockchain answer not crisp; CROPS undermined by single auditor chokepoint; adoption/who-installs unevidenced; ENS allowlist-ish; Arkiv log-shaped; event-not-exceedance claim; table stomp vs piling | 09-board-redteam.md |
| 22:19 | 9 | Board goal-fit returned: no CRIT/HIGH. MED: sponsor-max not shown (Uniswap/Arc/Hedera/0G unassessed for survivors); Practicality/Usability scores missing in verdict; #2 borderline crowded; prior-art used as kill beyond hard filter; uneven fields for #3 | 09-board-goalfit.md |
| 22:19 | 9 | Board consistency returned: no CRIT/HIGH; amounts, picks, EVs, ranking consistent. MED: E1 and #2 missing required fields; LOW: 'measured' wording slip, mainnet vs Sepolia, write-only roles, E1-vs-S-A EV ordering unexplained in verdict | 09-board-consistency.md |
| 22:19 | 9 | Board correctness returned: no CRIT. HIGH: physics compressed (60 Hz -30..+17; 200 Hz +-5% only median for >=5 mm/s; at 1-3 mm/s +8..+34%). MED: sim labelled measured -> must be 'simulated'; problem sentence overstates (no disputed contractor data evidenced; Elphinstone VJTI is independent = counter-evidence). LOW: quote 'drained instantly' not 'almost immediately'; Enconomy generalisation; EV inline tags. URL spot-checks clear | 09-board-correctness.md |
| 22:20 | 9 | Board reproducibility returned: devnet/Arkiv/ENS Sepolia/Chromium cap/0xAA opcode check/sim all reproduce; seed intervention (7,123,2024) keeps conclusions; MED: '-25..+17' mixes pipelines; coupling +30-60% scenario-specific (20 Hz burst near tile resonance). Stage 9 complete | 09-board-reproducibility.md |
| 22:20 | 10 | Gate: STOP (0 CRIT; all HIGH fixable centrally except adoption, which is unresolvable by desk research -> handed to human) | 10-gate.md |
| 22:22 | 11 | VERDICT v2 FINAL written (board fixes applied centrally); re-verified devnet live; novelty-claim scan done. Run complete; handing back to parent | VERDICT.md |
