# VERDICT: ETHGlobal Mumbai 2026 ideation (DIVERGE → CONVERGE)
Status: **FINAL v2**. Board fixes are applied; see 10-gate.md. Orchestrator: playbook (Opus). Each claim cites the stage file that holds its evidence, and RUN_LOG.md has the full trace.

## Intake gaps
- **Nothing essential was missing.** BRIEF.md was complete. The open facts were researched rather than asked:
  - **World Agent Pass $5k:** $2.5k/$1.5k/$1k, and proofs are mocked at this event. A separate $2.5k track is continuity-only.
  - **0G Physical AI:** $2.5k/$1.5k, and the $1k "Best build on real hardware" is the 3rd slot, not an extra. The brief never says "phone", only "pocket device". Entries also need an episode log on 0G Storage. (Source: sources/sponsor-tracks-verbatim.md, via Playwright.)
- **Time information** was present in the local files. I deliberately did not use it for scoping, and no branch was pruned for time or build difficulty.
- **Assumption:** the Mumbai panel resembles past ETHGlobal panels. C4 grounded this on 5 finalist pages.
- **Security note:** the Definitive Flash docs index contains text that tries to instruct AI agents to POST an "intent report" to definitive.fi. The worker did not act on it, and neither did I.

## Mode + why
**DIVERGE, then CONVERGE** (the human's choice), run in that order and never blended. The task passed the subtlety test for four reasons:
- the design space is wide: 12 sponsors, about 30 From Scratch tracks, phone sensors, and Dhruv's DSP skill;
- crowding hides across about 1,680 earlier projects, and a single pass regresses to the crowded agent-cap idea;
- the sponsor rules are coupled;
- the two judge populations reward different things.

The profile is in 00-intake-and-profile.md, and the rubric was committed before generation in 01-commitments.md.

## Angles run
| Stage | Lens (Sonnet unless noted) | Risk it owned |
|---|---|---|
| D1–D6 | free · in-solution mechanism · question-the-goal · narrow-scope · behavioral/informational · distant analogy | breadth (altitudes) + depth (ingredient search) → 49 ideas |
| S1 / S2 | verbatim prize text (Playwright) / sponsor docs + endpoint probes | sponsor rubric; tech availability |
| 03 / 04 | cross-pollination + TRANSFORM (orchestrator) | hybrids; judge the best version |
| 05 ×2 | prior-art-adversary (crypto / physical) | crowding, concurrent collision |
| 06 ×2 | impact-validator (crypto / physical) | is the problem real; "can't they just" |
| C1 | sponsor fit + stack coherence | cosmetic integrations, pick math |
| C2 | technical S-A: devnet, EIP-8141 spec, mainnet chain scan | mechanism + headline number |
| C3 | technical S-B (+E1): physics, Chromium source, simulation | mechanism + headline number |
| C4 | finalist-panel red-team (5 finalist pages) | WOW, judge questions, link gate |
| Board | correctness · consistency · red-team · goal-fit · reproducibility | errors in the verdict itself |

## Findings

### #1 RECOMMENDED: Tremor Witness
**One-sentence problem.** "Residents of old Mumbai buildings next to metro and bridge construction have no vibration record of their own. The readings that exist belong to the contractor or the authority, and residents have had to go to court to get them."

**Evidence of the problem and its cost** (every link below was fetched by a worker; the three marked † were re-checked by the correctness board).
- † Colaba residents demanded "installed vibration monitoring instruments with real-time reporting shared with residents" (FPJ, 23 May 2025). https://www.freepressjournal.in/amp/mumbai/mumbai-news-heritage-wall-near-gateway-of-india-develops-cracks-after-colaba-jetty-drilling-residents-demand-structural-audit-and-vibration-monitoring
- † The Supreme Court directed MMRCL to file details of any tremors after two Mahim buildings tilted. The tilt is *allegedly* from Metro-3, and the "beyond repair" audit is relayed by an MLA. https://www.mumbailive.com/en/infrastructure/supreme-court-asks-mmrc-to-present-report-on-south-mumbai-station-after-two-mahim-buildings-tilt-42146
- † In 2017, MMRC said vibrations were "less than 1/4th of the permissible limit". The J.N. Petit institute alleged 4× the limit in court. MMRC's director said readings from mobile apps "can't be that accurate". https://www.asianage.com/metros/mumbai/071017/vibrations-less-than-14th-of-permissible-limit-mmrc.html
- **Counter-evidence (stated honestly).** At Elphinstone, MMRDA resumed work within a day under 24×7 monitoring by VJTI, an independent institute, with a joint inspection with residents. Authorities sometimes react fast. The validator also found no evidence of *forged* contractor data. The complaint pattern is "no data shared with us", not "the data was faked". (06-impact-physical.md)
- **Cost is not sized in ₹.** The verdict is REAL, narrow and locally costly. Say so in the pitch; do not invent a number.

**Crowding check** (05-prior-art.md):
- crowding 4/10, demand 6/10, low collision risk at Mumbai;
- the closest prior art is citizen-sensor structural monitoring (Ozer/Feng 2015; MyShake), which has no evidence or ledger layer;
- nothing on the crowded list (01-commitments.md §C);
- **no prior published work found** doing a phone-PPV quorum with a tamper-evident, resident-owned record. That statement comes from title/tagline-level showcase search plus web search. The deep pass downgraded 6 of 8 shallow survivors, so weight it at roughly 1 in 4. Keep it out of pitch copy.

**Sponsor stack** (3 picks: 1 EF, 1 Arkiv, 1 ENS). C1's EV is about $1.9k, which is a *judgment* estimate.

**1. Arkiv: Build on Arkiv (from scratch)**, $3k / $1k.
- Verbatim requirement: "Your app writes to Arkiv's current testnet (see the docs) with @arkiv-network/sdk or the JSON-RPC API, and at least one feature users see reads its data from Arkiv." / "Not counted: the SDK installed but never used to read, or Arkiv used only as a log that nothing reads."
- How Tremor Witness meets it:
  - Each reading is an entity (site, flat, PPV band, f_dom, t), and each confirmed event and each revocation is too.
  - The **quorum decision is itself an Arkiv attribute/time-window query**.
  - The public dashboard and the downloadable evidence pack read only from Arkiv.
  - Expiry equals the complaint window, with a maximum lifetime of about 182.5 days, which must be stated.
  - The dashboard filters on `$owner`.
- Required files: schema.md, friction.md, reach.md, why-arkiv.md, how-you-use-arkiv.md, plus the README writer addresses and one runnable query.
- Probed: Rabdi chain 0x76edaf; SDK `createEntity(…, {expiration})` and `select().where(and(eq, gt))`.

**2. ENS: Best Use of ENSv2**, $3k / $2k / $1k / $1k.
- Verbatim requirement: "ENSv2 features should be central to the product, not a cosmetic add-on. Your demo must be functional and not just include hard-coded values."
- How Tremor Witness meets it:
  - ENS is the **sensor registry that the confirmation logic reads**.
  - Each phone is an expiring, revocable, non-transferable subname under the building's name. That phrase is ENS's own brief vocabulary.
  - The issue/revoke role is granted through Enhanced Access Control (`grantRoles`; PermissionedResolver `grantSetterRoles` + `ROLE_SET_TEXT`) to a **k-of-n society-committee Safe**, not to one person.
  - Quorum parameters and the calibration note are text records that only the committee may *write*; anyone can read them.
  - **A reading counts only if its signer resolves to a live sensor subname.**
  - EAC scoping is per key, not per name, so use one key or resolver per sensor (C3).
- Network: Sepolia. ENSv2 bytecode was probed there. The sponsor says mainnet is live, but S2 found mainnet v1 still serving, so build on Sepolia, which From Scratch allows.
- **Residual risk:** a judge may still read this as "an allowlist". The answer is that expiry, revocation and committee roles are ENSv2-native features.

**3. Ethereum Foundation: Best CROPS App**, $2k / $1k / $500.
- Verbatim requirement: "Build an app, wallet feature or dev tool where one CROPS property is the reason it exists, without giving up the other three." / "depth of the lead property: structural (works without you) beats cosmetic (a setting)". The README needs a "CROPS" section with C/O/P/S lines, and the video must include "the moment it matters: for example you switch off your backend".
- How Tremor Witness meets it: the lead property is **C**.
  - No single party can edit, delete or selectively withhold a confirmed event: not the contractor, the authority, the society secretary or us.
  - A revocation stops only *future* readings and is itself public.
  - The video kills our backend, and the dashboard rebuilds the event from Arkiv + ENS.
- P and S, stated honestly: per-device ephemeral keys; the RPC provider sees the phone's IP; a sensor key could delete its *own* entities (a stated trade-off). Use an MIT/Apache licence and no trackers.
- At most one EF prize applies.

**Picks considered and rejected:**
- *World Agent Pass* as a swap for CROPS: decorative for the core claim. Its "validate in a secure backend" requirement conflicts with the kill-the-backend moment, and it proves a human, not a sensor (C1, C3).
- *Uniswap, Arc, Hedera, 0G, Whitechain:* no surviving idea uses them centrally. C1 checked Whitechain's "Won't place" and 0G's "Not wanted" lists. Bolting them on would be cosmetic and would lower both the sponsor and the finalist score. This is why the larger nominal pools were not chased.

**Level-3 component.** A multi-phone vibration quorum over registered flats, with PPV estimation and spoof rejection.
- The PPV limits are characterised in **simulation only** (C3; reproduced by the orchestrator and by the reproducibility board across 4 seeds; a self-built model with no phone data):
  - **Browser at 60 Hz** (the Chromium cap, read in the source): taped impacts read about −17% to −30% low. Bursts read +13% to +17% with a timestamp-resampled pipeline, or about +40% with a naive one.
  - **Native app at 200 Hz:** the median error for taped impacts is about −5% to +2%, but only at ≥5 mm/s. At 1–3 mm/s, which is the 2–5 mm/s dwelling-limit zone, the error is +8% to +34%.
  - **Loose coupling on tile** adds +30% to +36% for a 20 Hz burst near the modelled tile resonance, and only +8% to +11% for impacts.
- TDOA bearing was **dropped**: phone clocks cannot support it.

**Claim discipline.** The product proves that *a corroborated event with this PPV band occurred at this time*. It does **not** prove that a legal limit was exceeded. No Indian piling limit was found, and the DIN figures are secondary.

**Answer to "why a blockchain?"** (rehearse this; red-team F1):
- A shared Sheet: the owner can edit it.
- A WhatsApp video: it can be deleted, cannot be verified, and has no quorum.
- A signed PDF: one signer, made after the fact.
- Tremor Witness: many registered flats co-sign in real time; nobody, us included, can rewrite or withhold the record; a court, a journalist or the authority can verify it without asking us.

**Finalist rubric for #1** (C4's sceptical scores, before and after the fixes):
- **Technicality 3 → 4**, if the spoof and agreement numbers are measured.
- **Originality 4.**
- **Practicality 3 → 4**, with the "trigger record that compels an official monitor" framing and the honest band.
- **Usability 4.** Judges join from their own phones via the PWA.
- **WOW 4.**

**4-minute demo WOW.**
1. Four phones lie on the judges' table: two from the team, and two the judges join via the PWA link.
2. A stomp or mallet tap is confirmed 4/4 within seconds, and the event appears on the public dashboard.
3. One phone is hand-shaken alone and is **rejected: no quorum**.
4. The committee revokes one sensor's subname (a 2-of-3 Safe signature), and that phone stops counting. The revocation appears publicly.
5. The backend is killed, and the dashboard still rebuilds everything.

Present this as a **demonstration of quorum and revocation**, not as a simulation of piling. Pair it with a *labelled* replay of a real recorded construction-site session.

**Headline number** (measurable by the team; **not yet measured**, so do not quote one):
- the spoof false-accept rate over N hand-shake and lone-stomp attempts;
- the true-event confirmation rate over N real multi-phone impacts;
- the inter-phone PPV spread on the same impact, reported as a band.

Open the pitch with the MMRC 2017 "can't be that accurate" quote, then show the measured band.

**Build-difficulty note (a note, not a filter): medium.**
- Parts: PWA sensor capture; an optional native Android APK at 200 Hz; Arkiv SDK writes and queries; an ENSv2 subname registry plus EAC plus a Safe on Sepolia; a static dashboard.
- Hardest parts: the DSP and quorum (Dhruv's strength), and ENSv2 EAC (new docs, exercised by nobody in this run).
- Three pillars are untested on real hardware and are chained in one demo: real-handset sensing, ENSv2 EAC end to end, and Arkiv burst writes.

**What a phone-only build needs.**
- Android Chrome (Generic Sensor API, capped at 60 Hz) for the PWA.
- Optionally a native APK (SensorManager at about 200 Hz, with no special permission on Android 12+) for the PPV band.
- Laptops host the dashboard.
- The finalist "live link" is the **public dashboard plus the PWA join**. Add a labelled replay for judges who open it alone or on a laptop, since a laptop has no accelerometer.

**Finalist vs sponsor trade-off: low.** The quorum, the revocation and the kill-the-backend moment are both the WOW and the sponsor-central features.

---

### #2 ALTERNATE (EF-specialist): "Frame transactions make leaked wallets gas-lessly sweepable", plus a recovery-commitment paymaster
This is S-A, restated after C2 found the race symmetric.

**One-sentence problem.** "When your key leaks, bots steal any ETH you send for gas so you can't rescue what's left, and EIP-8141's ERC20-fee frame transactions let the thief skip the gas step entirely."

**Evidence.**
- A victim on 21 Jan 2026 reported about 170k USDT at risk and that gas ETH is "drained instantly". This is self-reported; the board checked the wording. https://collective.flashbots.net/t/need-flashbots-bundle-help-for-eoa-wallet-drained-by-sweeper-bot-170k-usdt/5502
- Wintermute: more than 80% of 7702 delegations went to copy-pasted sweeper contracts (The Block, 2025-06-01). That is a share of delegations, not dollars.
- Status quo: the Flashbots whitehat service, with a $1k minimum and a 5–10% fee (MetaMask support).
- **The aggregate dollars at risk cannot be computed from public data** (C2 scanned 6,788 authorities, and labelled sweeper victims hold $0). **Never quote an extrapolation.**

**Crowding.** Generic "gasless rescue" scores 7–8/10 (codeesura/eip7702-asset-rescuer, mevdao rescue, the Aegis7702 registry). The EIP-8141 sweep finding plus paymaster policy scores about 2/10. **Goal-fit caution:** the pre-committed recovery address sits next to the crowded allowlist/guardian items, so the headline must be the *finding*, not the recovery feature.

**Sponsors** (2 picks; C1's EV is about $1.5k if a transaction is admitted, about $0.95k after a feasibility discount, both judgment):
- **EF: Best use of the Frame Transaction Alternative Mempool**, $2.5k / $1.5k / $1k.
  - Verbatim: "something only an alt mempool makes possible: … (b) more flexible state access in sender or paymaster (e.g. ERC20 paymasters …)" and "break the rules and improve them: DoS vectors and vulnerabilities, new rules, simulators and fuzzers". Qualification: "a link to your admitted transaction on the devnet explorer, or code that submits one."
  - How it meets them: a staked ERC20 paymaster sweep is admissible only in the alt mempool. The policy paymaster is a "new rule". The devnet is live (chain 0x539, re-probed twice).
- **Arkiv: Mirror something Ethereum depends on**, $3k / $1k. Optional.
  - Verbatim: "Pick public data that Ethereum apps and developers rely on, and mirror it into Arkiv entities that anyone can query without asking you for access." Qualification: "The data's license allows republishing."
  - How it meets them: a mirror of labelled sweeper-delegate data, but only if a licensed source exists. C1 judges it decorative to the rescue and weak on reach. data-quality.md, reach.md and why-arkiv.md are required.
- There is no honest third pick.

**Level-3.** On the devnet, show an ERC20-fee frame transaction sweeping a zero-ETH leaked EOA. Show the race is symmetric (stake is never slashed, and same-nonce transactions go to a fee auction). Ship a paymaster that sponsors only SENDER frames paying a pre-committed recovery address.

**WOW.** The team's sweeper drains a "no ETH, so safe" wallet, then the same attack is refused by the policy paymaster while the owner's rescue lands.

**Number.** A lab number only: outcomes over N seeded devnet races per policy.

**Weaknesses.**
- Usability is 2/5 (C4).
- It protects only users who committed beforehand.
- Victims already delegated to a sweeper cannot be frame-rescued at all, because the sweeper code has no APPROVE opcode (reproduced with an opcode-aware walk).
- The rules are unstable: the sidecar follows an ERC-7562 PR, not ERC-8421.
- The faucet docs conflict.

**Build difficulty (a note):** medium-high, because the transaction type is new and the tooling is thin. **Phone-only:** phones are not needed; the live link is a web dashboard against the devnet.

---

### #3 FALLBACK ONLY: ReadLeak / LeakMeter (E1, the control)
- **Problem:** "Your RPC provider sees every address you look up and can link your wallets without a single transaction."
- **Evidence:** weak. The pain is inferred. arXiv 2306.08170 found 13 of 100 wallets and 211 of 616 dApps leaking the address to third parties. ConsenSys says IP and wallet data "are not stored together". Impact: NICE-TO-HAVE.
- **Crowding:** 3/10 historically, but EF's own track text lists "network health checker / playground" and "a tool that shows what an app leaks", so 4–8 concurrent teams are likely.
- **Stack:** **EF Anon-RPC** ($2.5k / $1.5k / $1k; verbatim: "Your app routes its RPC reads through Anon-RPC by default") plus **Arkiv Mirror** (a licensed registry). EV is about $1.15k (judgment).
- **Level-3:** a reproducible read corpus that infers address linkage, before and after.
- **WOW:** a judge pastes their own address and watches the provider's view of them assemble, then fail to assemble through Anon-RPC.
- **Number:** linked-wallet count and latency, before and after. Latency is unmeasured: `@anon-rpc/browser-harness` 0.4.0 is browser-only.
- **Build:** low-medium. Phones are not needed.
- **Why it ranks below #2 despite a higher EV:** its finalist odds are the lowest (C4: Originality 2, WOW 2), and the goal puts finalist first.

### Dropped (each killed by the human's crowding filter or by impact, never by build difficulty)
"Crowded" here includes shipped products and granted patents. That is the human's hard filter, and it maps to the Originality criterion. It was not a novelty-first ranking.
- **Hum Clock (ENF):** 3 of 6 frames converged on it. But ENF plus a ledger is published (DEMA, Proof-of-ENF), LED and CFL light fails at 100 cm (Frijters & Geradts 2022), and impact is NICE-TO-HAVE.
- **Pocket Sonar:** already shipped as ApneaApp, licensed to ResMed as SleepScore (2018). Its only new part is a 0G wrapper. Note that this leaves the 0G Physical AI pool untouched by every survivor.
- **Fallback Checkout:** no customer-side problem evidence, and Unwind already does payer reclaim.
- **MachineLease (phone-only):** granted patent US12567090B2 (vibration-based blockchain billing of rented equipment), plus existing telematics. Impact: REAL BUT MINOR.
- **Hedged LP:** crowding 9/10 (GammaHedge, HedgeLP, Panoptic), it sits on the off-table LP-automation list, and Definitive's from-scratch track is Social only.

## Tensions resolved (08-reconcile.md, T1–T8)
- **T1–T2, S-A:** the headline number could not be computed from public data, so it became a lab number. The race was symmetric, so S-A became a finding plus a policy and was demoted to #2.
- **T3–T4, S-B sponsors:** ENS was cosmetic as briefed, so it became the sensor-registry gate. World was decorative and conflicted with CROPS, so the anti-sybil role moved to committee-issued ENS subnames.
- **T5, S-B accuracy:** accuracy cannot be validated without a geophone, so the claim became "a corroborated trigger record" with a measurable spoof rate and a PPV band.
- **T6, the link gate:** met by the dashboard plus the PWA join plus a labelled replay.
- **T7, agreement:** the angles agreed on the ranking for *different* reasons and disagreed inside candidates, so the composition was not overlapping.
- **T8, E1:** E1 is weaker on every lens.
- **Board (10-gate.md):** physics wording, a single-auditor chokepoint (fixed with a committee Safe), and a crisp why-blockchain answer were all fixed centrally.

## Not covered (the honest part)
- **Adoption: who installs this and who maintains the sensor registry.** No resident or housing society was asked, and residents asked the *authority* for installed instruments. This is the top residual.
- Concurrent Mumbai submissions, which cannot be measured.
- The actual judges.
- Real-handset behaviour: Chrome's delivered rate, OEM filtering, and background throttling. No phone was tested.
- The Indian piling vibration limit.
- ENSv2 EAC and Safe end to end on Sepolia (probed, not exercised).
- Arkiv burst-write limits.
- The legal standing of phone evidence in India.
- The rupee cost of damage.

## Confidence
- **Measured:**
  - the devnet (0x539) and Arkiv (0x76edaf) RPCs are live, re-probed three times;
  - the Chromium 60 Hz cap, read in the source;
  - C2's mainnet scan and the opcode-aware APPROVE check;
  - the verbatim sponsor text;
  - three URLs, re-fetched by the board.
- **Simulated, not measured:** every PPV error figure (a self-built model; deterministic and seed-robust in its qualitative conclusions).
- **Argued:** every EV and probability, the rubric scores, "low collision", and the finalist ranking.
- **Residual unknowns:** real-phone PPV, adoption, ENS judges' reading of "central", and whether the panel accepts "a trigger record, not a geophone".

## For the human
The decision handed back to you is **Tremor Witness (finalist-first, 3 picks, about $1.9k judged sponsor EV) or the frame-transaction sweep finding (EF-specialist, 2 picks, highest technical ceiling and highest variance).**
**I would pick Tremor Witness.** It is the only candidate that survived crowding, impact and sponsor centrality together. Its WOW is physical and happens in the judges' hands. It uses Dhruv's rarest skill. Its main weakness, "phones can't be accurate", becomes the opening line instead of the hidden flaw.

These calls are yours:
- feasibility against your clock;
- whether to build the native APK;
- CROPS vs World as the third pick;
- whether to spend 15 minutes asking one sponsor (ENS: "is a sensor-subname registry central?") and one resident or society contact ("would your society run this?") before committing.

The reframe that makes the pitch land is also yours: I found the inconsistencies, and the story that resolves them belongs to the team.
