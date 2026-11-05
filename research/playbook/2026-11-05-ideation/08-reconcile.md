# 08 · Reconcile: hunting the tensions

Orchestrator ground-truth re-checks:
- The alt-mempool devnet answers `eth_chainId = 0x539`.
- The Arkiv Rabdi testnet answers `0x76edaf`.
- C3's `sim.py` re-run reproduces its output exactly (`scratchpad/c3/rerun_orch.txt`, byte-identical tail).

## Tensions and what they turned out to mean
**T1: S-A's headline number.** The impact validator (06) said the missing aggregate "is the measurement S-A would produce". C2 tried to produce it, by scanning 6,788 7702 authorities and the 2025 labelled sweeper victims.
- **Result: it cannot be produced from public data.** Labelled sweeper victims hold $0. The large gas-less, token-holding pool is mostly legitimate (Trust Wallet delegators). A clean leaked EOA carries no on-chain marker.
- **Resolution:** S-A's headline number must be a *lab* number (a race outcome on the devnet), never "$X at risk on mainnet". Any extrapolation, such as C2's ~$1.1M from the $96k sample, is **forbidden in the pitch**: it would be misleading.

**T2: S-A's core promise.** TRANSFORM promised "the rescue and the rule that keep owners ahead". C2 (spec-level) found the race is **symmetric**:
- staking is never slashed;
- reputation tracks inclusion rate;
- same-nonce conflicts are a fee auction.

No post-leak mempool rule favours the owner. A sweeper-delegated victim cannot frame-rescue at all, because sweeper code has no APPROVE opcode.
**Resolution:** the honest S-A is a **security finding + a paymaster policy**: "ERC20-fee frame transactions make clean leaked EOAs gas-lessly sweepable; the only defence is a pre-leak commitment (e.g. a recovery address) enforced by the paymaster inspecting SENDER frames." That fits EF area (c) "break the rules and improve them" precisely. It is weaker as a consumer product: a pre-leak commitment is recovery/guardian-adjacent, which is crowded, and it only helps users who opted in beforehand. C4's Usability score of 2 for S-A stands. **S-A is demoted to the EF-specialist alternate.**

**T3: S-B's ENS role.** C1 found ENS cosmetic as briefed (removing it still left a working product). C3 found EAC scoping is per key ("There is no per-name scoping").
**Resolution:** both point to the same fix. ENS becomes the **sensor registry that the confirmation logic reads**:
- each phone gets an **expiring, revocable, non-transferable sensor subname** (flat-301.tower-a.<society>.eth). That is the exact vocabulary of ENS's own brief ("expiring, revocable, non-transferable");
- each sensor gets its own key, or its own resolver instance, to work around per-key scoping;
- the society auditor role issues and revokes subnames;
- quorum parameters and a calibration record live in auditor-only text records;
- **a reading counts toward quorum only if its signer resolves to a live sensor subname.**

ENS is now the anti-sybil layer, not decoration. This also resolves **T4**.

**T4: S-B's anti-sybil.** S-B was framed as "one human, one sensor" (World, from Quakepool). C3 found a PWA cannot attest a device and World proves a human, not a sensor. C1 found World decorative (the quorum already stops a single fake) and in conflict with CROPS's kill-the-backend moment, because World requires a secure backend validator.
**Resolution:** do the anti-sybil socially, through ENS. The society auditor vouches for each flat's sensor subname. The claim becomes "N **registered flats** agreed", not "N sensors" or "N humans". Third pick = **EF CROPS**, not World. World stays an optional swap if the human prefers it.

**T5: S-B accuracy vs the MMRC objection.** C4 rates its CRITICAL risk as "no validated accuracy number; MMRC said phone readings aren't accurate". C3 *measured, in simulation*:
- the browser is capped at 60 Hz (Chromium source), which biases PPV by about −25%…+17%;
- a native 200 Hz build comes within about ±5% when taped to the wall;
- loose coupling adds +30…60%.

There is no reference geophone (phones only), so absolute accuracy **cannot be validated by this team**.
**Resolution:** change the claim. S-B does not replace a calibrated geophone. It is a **resident-owned, tamper-evident trigger record that compels the official monitor**, which is exactly what Colaba residents demanded ("real-time reporting shared with residents"). The headline numbers become things the team *can* measure:
- (a) inter-phone agreement spread on the same impact;
- (b) the quorum false-accept rate (hand-shake/stomp spoofs) and false-reject rate;
- (c) PPV reported as a band, with the coupling caveat stated.

This answers the MMRC quote head-on instead of hiding from it. TDOA is **dropped** (C3 and C4 agree independently).

**T6: the S-B phone-only build vs the finalist link gate.** C3 says the honest design is a PWA for quorum/UI plus a native APK for the PPV claim. C4 says a judge alone on the link sees one sensor, and a laptop has no motion sensor.
**Resolution:** the "live deployment" is the **public verification dashboard** (it reads Arkiv + ENS; anyone can open it) plus the **PWA sensor mode**: a judge's own phone can join a live quorum during the session. A labelled replay of a real recorded session is available for solo link-openers, plus an optional APK for full-bandwidth PPV.

**T7: rankings agree. Is that overlap?** C4 (finalist) ranks S-B > S-A > E1. C1's EV ranks S-B ($1.9k) > E1 ($1.15k) ≈ S-A ($0.95k, discounted). 05/06 put S-B as the only clean survivor. Those are three different lenses (panel reaction, sponsor rules, crowding/impact) reaching the same order **for different reasons**. The disagreements were all *inside* candidates (T1–T6), which shows the angles were not overlapping. No composition fix needed.

**T8: E1 control.** It was the compendium's "safest pick". It is now weaker on all three lenses:
- Originality 2: EF lists the idea itself, giving a 4–8-team collision estimate;
- impact NICE-TO-HAVE;
- the Anon-RPC harness is browser-only, with latency unmeasured and the spec still a draft.

It remains the most reliable sponsor *qualification*, because the browser harness is probed and EF suggests it. **It is a fallback, not a pick.**

## Result after reconcile
1. **S-B Tremor Witness (restated per T3–T6).** Recommended.
2. **S-A LIFEBOAT, restated as "the gas-less sweep finding + a recovery-commitment paymaster" (T1–T2).** The EF-specialist alternate.
3. **E1.** Fallback only.
