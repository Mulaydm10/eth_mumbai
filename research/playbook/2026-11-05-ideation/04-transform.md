# 04 · TRANSFORM: 3–5 reframings per candidate; the strongest is carried forward

The prompts are PAIR / BOUND / USE / SHIP / LOOP, plus ADVERSARY (Dhruv's edge). They are prompts, not a gate. This is the only additive stage, so **every candidate is judged in its best version below, including the 4 existing ones.**

---
## S-A · LIFEBOAT race (compromised wallets under frame transactions)
1. **SHIP:** a victim with a leaked key and zero ETH signs one EIP-8141 frame transaction. A sponsor (or an ERC20 paymaster paid from the rescued tokens) covers gas, and the transaction atomically revokes approvals and moves the assets to a fresh key. It is admitted on the alt-mempool devnet and beats a sweeper bot we wrote.
2. **ADVERSARY (the merge insight):** the alt mempool's advertised **ERC20 paymasters remove the attacker's gas bottleneck too**. Today a compromised wallet holding tokens but no ETH is "stuck safe" until someone funds gas. Under ERC20 paymasters the sweeper can drain the tokens directly. Measure how many known-compromised addresses hold residual tokens with no ETH (from chain data: sweeper-delegated EIP-7702 addresses), demonstrate the new sweep, then propose and implement a **paymaster/admission rule** that restores the owner's advantage.
3. **PAIR:** with a public registry of sweeper delegate contracts and compromised addresses (Arkiv entities with TTL, queryable by code hash), so paymasters and wallets can refuse to sponsor known sweepers. This is the defence half.
4. **USE:** the first 10 minutes after a victim notices the drain: a phone "panic" screen. Also airdrop or vesting claimants whose wallets are compromised before an unlock, a documented whitehat-rescue scenario (to be verified).
5. **BOUND (10×):** a rescue paymaster service any wallet can call.
**Carried forward: 1 + 2 + 3.** "We show that Ethereum's next transaction type changes who wins the race for a hacked wallet; we measured it, and we ship the rescue and the rule that keep owners ahead."
- Sponsors: **EF alt mempool** (the EF pick; it hits both "only an alt mempool makes possible" and "break the rules and improve them"); **Arkiv** (sweeper registry: Build, or Mirror if a licensed public source exists); third option **ENSv2** (role-based name recovery when the leaked key also owns the name: guardian-adjacent, so a feature only), else none.
- Level-3: the adversarial race with a measured win rate, plus the paymaster rule.
- WOW: a judge sends test ETH to the "victim"; our bot steals it in about 1 s; LIFEBOAT then rescues with zero ETH in one transaction. Then the twist: "and here is the attack frame transactions enable, and our rule that stops it".
- Number: rescue win rate over N seeded races; and the $ in compromised, gas-less wallets made newly sweepable.
- Phone: the panic button and the fresh-key holder (optional; a PWA works).

## S-B · Tremor Witness (residents' phones as a vibration monitor the contractor cannot own)
1. **USE:** a housing-society secretary next to Metro/coastal-road piling builds an evidence file of peak particle velocity (PPV) against the residential limit (DIN 4150-3 style; the Indian standard is to be verified) for a complaint or claim.
2. **PAIR (H2):** a quorum of phones on different floors, with one human per sensor so the contractor cannot flood it with fakes, and TDOA bearing to *which* site is shaking us. Optional mains-hum common clock.
3. **BOUND (1/10):** one flat, 3 phones, one event type: a phone-PPV monitor with a tamper-evident log.
4. **LOOP:** each event refines the site baseline; contractor-published readings are cross-checked against resident readings.
5. **SHIP:** a browser PWA (Generic Sensor API) and a mallet-tap demo on the table.
**Carried forward: 1 + 2.** "Your building is shaking from the metro site next door; the only vibration meter belongs to the contractor; your neighbours' phones now form one they can't own."
- Sponsors: **Arkiv** Build (TTL = the complaint/limitation window; attribute queries by site, building and PPV); **ENSv2** (per-building name; EAC roles: resident-contributor writes only its own readings, auditor, read-only contractor); **EF CROPS** (C: the evidence survives our server or a takedown; P: who reported is hidden). World is an alternative to CROPS for anti-sybil (mocked proofs).
- Level-3: multi-phone time alignment, quorum, PPV estimate and TDOA bearing, with a measured error.
- WOW: three phones on the judges' table; a mallet tap draws the bearing; a lone hand-shaken phone is rejected by quorum; the Arkiv record appears.
- Number: PPV error against a reference, sync error in ms, bearing error in degrees.

## S-C · Hum Clock (proving *when* a video was filmed, using the power grid's frequency wander)
1. **USE:** an insurance claimant, a journalist or a delivery proof: "this was filmed now, not reused".
2. **SHIP:** a phone films a mains-lit lamp for 20 s; rolling-shutter flicker gives the ENF trace; it is matched against a reference ledger written by witness phones; result: "filmed 14:02 ± X s".
3. **PAIR:** with S-B as its clock (not carried, to keep them separable).
4. **ADVERSARY:** a replayed or spliced clip is flagged; hum-injection spoofing is tested.
**Carried forward: 2 + 4.** Sponsors: **Arkiv** (the reference ENF ledger as TTL entities queried by minute); **EF CROPS** (a timestamp with no trusted server); **World** (the claimant is a unique human; a denied path for back-dated clips). Weakest sponsor money of the four. Highest physics WOW.
- Number: median timestamp error and false-match rate over N clips.

## S-D · Pocket Sonar (a phone's speaker and mic become a breathing radar; 0G decides; safe stop)
1. **USE:** a family checking an elderly parent living alone, or a suspected sleep-apnoea screening, contactless with no wearable.
2. **SHIP:** an 18–22 kHz FMCW chirp, de-chirp, range FFT, CFAR on the chest bin, phase gives breathing. 0G classifies apnoea/no-breath at checkpoints, logs each decision to 0G Storage with a request id, and on 0G loss shows a declared safe state.
3. **PAIR:** ENSv2 role for a caregiver alert reader (guardian-adjacent: a feature only).
**Carried forward: 2 (+1 as the story).** Sponsors: **0G Physical AI** (pocket device; possibly the $1k real-hardware slot); second is weak. Clear finalist physics WOW (hold your breath and the alarm fires), but "why Ethereum?" is the panel's obvious question.

---
## Existing candidates, best versions (TRANSFORM applied)
**E1 ReadLeak / LeakMeter.**
- Best version: an Anon-RPC **network playground**. A reproducible corpus of wallet/DeFi reads, run through normal RPC and Anon-RPC, gives a public compatibility and leak scorecard mirrored on Arkiv (a licensed chain/RPC registry).
- Its strongest reframe is **USE**: "the before/after linking of *your own* 3 wallets in 2 minutes".
- Note: EF's Anon-RPC and CROPS texts *list this idea themselves*, so concurrent collisions are likely.

**E2 Fallback Checkout.**
- Best version: **"kill the merchant"**. A customer reconstructs and exercises refund/settlement rights from a static client plus chain and ENS data after the backend and domain vanish.
- Whitechain Operate (drop-in widget, both views, a post-payment refund) + ENSv2 + EF CROPS.
- Note: CROPS lists "a frontend that keeps working when its domain, backend or RPC provider disappears" as a suggested idea, and the off-table list contains ENS checkout and onchain refunds. Survivability must be the headline.

**E3 MachineLease (phone-only, H5).**
- Best version: a phone clipped to a rented machine (generator, pump, power tool) classifies running vs idle from its vibration and acoustic signature. 0G decides at checkpoints and logs to 0G Storage. Metering pauses (a non-faking safe stop) when 0G is unreachable. Whitechain settles USDT by verified run-time.
- The phone cannot cut power, so "safe stop" means *stop billing and stop authorising*, not stopping the motor. This is a 0G fit question for CONVERGE.

**E4 Hedged LP.**
- Best version: the "position vs holding, with and without the hedge" replay on a real pool, with the hedge placed as Definitive Flash orders.
- **The S1 finding hurts:** Definitive's from-scratch track is "Social App" only. Hedged LP is therefore Uniswap + Definitive only if reframed socially (e.g. LP circles that share hedges), which is weak. The LP-automation crowding (Arrakis, Gamma, LP Agent, Delta Zero) also applies.

## Short list sent to prior-art (05) and impact (06): 8 candidates
S-A, S-B, S-C, S-D, E1, E2, E3, E4. **Nothing is pruned on build difficulty.**
