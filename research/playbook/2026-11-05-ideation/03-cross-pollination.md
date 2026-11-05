# 03 · Cross-pollination (orchestrator; this holds the merge reasoning)

Inputs: the six 02-diverge-*.md files (49 ideas, 58 discards) and the S1 verbatim sponsor text. Every diverge worker sourced from search snippets only (no full-page fetches), so every evidence URL below is **unverified until 05/06 open it**.

## 1. What the six frames produced (clusters)
| Cluster | Ideas (frame) | Signal |
|---|---|---|
| **A. Compromised keys / sweepers** | Canary Keys (D3), LIFEBOAT (D4), Frame Fuzz (D3), Lookalike Address Book (D5), Descriptor Diff (D3), Verify-then-Sponsor Frames (D2) | 2 frames independently reached "a leaked-key victim loses the race to sweeper bots". Fits Dhruv's attack-search background. |
| **B. Mains-hum (ENF) clock** | Gridhum Notary (D1), Grid-Clock Notary (D2), ENF Witness (D6) | **3 of 6 frames converged.** Caution: convergence may reflect the shared "RF/DSP" cue in the context file rather than quality. Treated as a signal to check, not as a vote. |
| **C. Phone-sensor quorum evidence** | Quakepool (D1), Neighbour Seismograph (D2), Coach Crowd (D5), Shoulder-to-shoulder (D1), Block-Arrival Mumbai (D3), WATERLINE (D4), Decibel Witness (D5) | Many frames reached "phones as a tamper-evident sensor quorum with TTL evidence". The Neighbour Seismograph has the best-evidenced Mumbai problem. |
| **D. Protocol instruments** | Frame Fuzz, Inclusion-List Replay, Mempool Gap Atlas, Island Index, Selective-Lie Detector (all D3) | High EF "should exist" value but little consumer WOW; dashboards exist. |
| **E. Physical AI on a phone** | Pocket Sonar Sentinel (D2), Nightwatch (D1), WATERLINE (D4) | Only cluster that directly targets 0G Physical AI, using Dhruv's radar skill (FMCW, CFAR). |
| **F. Registries with role separation** | Batch Truth Registry (D5), SABHA (D4), Co-Signed Khata (D5) | ENSv2 EAC fits ("let an account edit only certain text records" is in ENS's own brief). Weak WOW. |

## 2. Sponsor-text facts that changed the merge (from S1 verbatim)
- **EF alt mempool (verbatim):** the track invites "something only an alt mempool makes possible: … (b) more flexible state access in sender or paymaster (e.g. **ERC20 paymasters**, daily quota paymasters)". It also invites "**break the rules and improve them: DoS vectors and vulnerabilities, new rules, simulators and fuzzers**". Qualification is "a link to your admitted transaction on the devnet explorer". Devnets and a faucet run during the event, with alt-mempool staff on site.
- **EF CROPS** lists as its own ideas "a frontend that keeps working when its domain, backend or RPC provider disappears" and "a tool that shows what an app leaks". **That is exactly Fallback Checkout and ReadLeak.** A sponsor-listed idea draws many *concurrent* Mumbai entrants. This is a crowding risk the earlier-winner filter cannot see. Anon-RPC similarly lists "network health checker / playground".
- **Definitive:** the from-scratch track is "Social App" only, and "Most Creative" is continuity-only. This weakens Hedged LP's second pick.
- **0G Physical AI:** requires a 0G call in the decision loop, an **episode log on 0G Storage with a request id per decision**, a replayable sim or live hardware at the booth, and a non-faking safe stop. The word "phone" is never used; the brief says "pocket device". The $1k "best build on real hardware" is the 3rd slot, not an extra.
- **Whitechain Operate** "won't place … payroll, escrow and revenue splits on their own". It wants a drop-in piece that a demo app adds in about 20 lines, plus both the merchant and the customer view.
- **ENSv2 is live on mainnet** (the brief says so). From Scratch must be on mainnet or Sepolia, with no hard-coded values.
- **One EF prize per project:** the EF judges decide which track you are placed in.

## 3. Hybrids: "what if frame X's mechanism met frame Y's framing?"
**H1 = A(LIFEBOAT, D4) × A(Canary Keys, D3) × D(Frame Fuzz, D3) × S1(ERC20 paymaster text).**
LIFEBOAT's atomic sponsor + revoke + sweep frame transaction is the rescue. Canary Keys supplies the *problem number*: how fast real sweepers act. Frame Fuzz supplies the adversarial lens. The merge insight came from re-reading S1. **The same "ERC20 paymaster" feature the EF advertises would also let a sweeper drain the *tokens* from a compromised wallet without ever needing ETH.** Today many such wallets are "stuck safe", because the attacker has to fund gas, and funding gas is what rescuers race against.
So the strongest hybrid is a **two-sided race study plus a tool**:
- (1) show that frame transactions shift the race;
- (2) measure how much value sits in known-compromised, gas-less wallets, from chain data;
- (3) ship the rescue that wins under alt-mempool rules;
- (4) propose or implement a paymaster or admission rule that tilts the race toward the owner.

This covers EF alt-mempool areas (a) and (c) at once. → **Survivor S-A.**

**H2 = C(Neighbour Seismograph, D2) × C(Quakepool's sybil-resistant quorum, D1) × B(ENF as a shared clock).**
The Seismograph's hardest sub-problem is aligning phones in different flats in time; D2 used an ultrasonic chirp, which cannot cross walls. Mains hum is a free, building-wide common clock with no trusted time server. Quakepool adds "one human, one sensor", so a contractor cannot flood the quorum with fake phones. → **Survivor S-B (Tremor Witness).** ENF stays an *optional* component, because its feasibility is unproven.

**H3 = B(ENF, 3 frames) × D4(WITNESS journalist) × D6(insurance photo fraud).**
The standalone ENF idea is a phone that proves *when* a clip was filmed, checked against a reference ledger of witness phones. → **Survivor S-C (Hum Clock).** It is kept separate from S-B because 3 frames converged on it and its problem (back-dated evidence) differs. 05/06 decide whether it is real.

**H4 = E(Pocket Sonar, D2) × the 0G Physical AI text.**
This is the purest use of Dhruv's radar skill: FMCW over the speaker and mic, CFAR, and breathing phase. 0G decides the alarm, an episode log on 0G Storage records each decision, and a safe stop applies. → **Survivor S-D.** Known weakness: a one-sponsor stack, and "why crypto?" for the finalist panel.

**H5 = an existing candidate × D2(vibration fingerprint).**
**MachineLease phone-only:** a phone clipped to the rented machine classifies "running vs idle" from its accelerometer and mic signature. This is the phone-only reframe the brief asked for, and it enters CONVERGE.

**Hybrids considered and not formed:**
- ENF × Verify-then-Sponsor frames (D2#8): gas paid only if an ENF proof checks out. Two unproven parts stacked: fragility squared.
- Batch Truth × Tremor Witness roles: the same EAC pattern, but Batch Truth's problem already has a fix (independent testing brands exist; to be checked).
- CFAR × Uniswap: the headline reads as "dynamic hook", and slippage/MEV protection is crowded (MEV-protect RPCs, batch auctions).

## 4. Ideas dropped at merge (rationale kept, because it is free now and lost later)
| Idea | Why dropped (not build difficulty) |
|---|---|
| Frame Fuzz standalone | Folded into S-A as its adversarial component. On its own it has no user-facing WOW for the finalist panel. |
| Canary Keys standalone | Folded into S-A as the problem measurement. Leaking keys live on mainnet is an ethics and demo-reliability concern. |
| Lookalike Address Book | Wallets and explorers already warn on poisoned lookalikes ("can't they just" fails). Address-poisoning defence is a common wallet feature. |
| Selective-Lie Detector | Adjacent to the off-table RPC leak meter and duplicates the ReadLeak candidate's sponsor. |
| Descriptor Diff | Adjacent to a finalist (LeekWallet); a narrow audience. |
| Inclusion-List Replay / Mempool Gap Atlas / Island Index | Dashboards exist; no WOW; Island Index drifts into an integration app. |
| Block-Arrival Mumbai | A new fact, but no one's decision changes with it ("so what?"); weak sponsor money. |
| WATERLINE | The demo is staged (a dyed-water tray). Sponsor fit is stretched: Whitechain's tracks are merchant/payer-centric, and a payout to a rider is neither. |
| Quakepool standalone | Folded into S-B (its quorum and anti-sybil mechanism). Earthquake shaking is rare in Mumbai; construction shaking is not. |
| Coach Crowd / Shoulder-to-shoulder | No crypto necessity (D2 independently discarded the same idea). |
| Batch Truth Registry | Supply-chain provenance is historically saturated in crypto. An independent testing market probably exists. |
| Thumbprint | No problem evidence found. |
| CFAR swap guard | Off-table adjacency (hooks) and crowded MEV protection. Kept only as a pitch line for Dhruv's radar story. |
| Wage Ledger, Drip-Price Notary, Deposit Default-Flip, Co-Signed Khata, SABHA, Receipt Notary, Seventy-Two Hours, Heat Dose, Splashmark, Lockout, Dead Reckoning Court, Curtailment Meter, Milk-and-Oil, Honest-Location, Echo Gate, Nightwatch, Incident black box, AA consent artefact, General average, RLA claims, Chit fund, Route code | Each had one of: no evidenced problem; no load-bearing sponsor; an Enconomy/guardian/NoNet adjacency; or it duplicated a stronger survivor above (Nightwatch duplicates S-D; Decibel and Splashmark duplicate S-B's skeleton). |

**Filter log:** 49 ideas in, 4 new survivors out (8%). The 2 frames that produced no survivor directly were D5 (behavioral) and D1 (free), but both contributed a mechanism to a hybrid (D1's quorum/anti-sybil to S-B, D1's ENF to S-C). D3 (question-goal) and D4 (narrow) seeded the top hybrid. **The distant-analogy frame (D6) seeded S-C jointly with D1/D2, but none of its unique bridges survived on their own.** This is one data point against its "highest-yield" record.

## 5. Going into TRANSFORM (04)
New: **S-A LIFEBOAT race**, **S-B Tremor Witness**, **S-C Hum Clock**, **S-D Pocket Sonar**.
Existing, which must enter CONVERGE: **ReadLeak/LeakMeter**, **Fallback Checkout**, **MachineLease (phone-only, H5)**, **Hedged LP**.
New crowding signal for two existing candidates: EF's own track text lists the ReadLeak and Fallback Checkout ideas, so concurrent Mumbai collisions are likely. That is for the reconcile stage to weigh; it is not a kill.
