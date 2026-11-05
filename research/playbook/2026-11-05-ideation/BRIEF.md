# Playbook brief: ETHGlobal Mumbai 2026 (intake answers)

Written 2026-11-05 by Claude Code (parent session) from Dhruv's answers plus the repo's research. This is the complete intake; return an INTAKE REQUEST only if something essential is still missing.

## Mode (chosen by Dhruv)
**Option (c): DIVERGE, then CONVERGE.** Generate fresh ideas, then stress-test them **together with** the existing candidates listed below, and select from the merged set. Never blend the two passes.

## Goal (chosen by Dhruv)
**Win a finalist place AND get the most out of the sponsor prizes.** The finalist place comes first: the per-person award for a 3-person team is in `COMPETITION.md`. The team also wants the largest expected sponsor money that can be stacked alongside it.
- Up to **3 partner picks**. All tracks from one partner count as one pick. At most **one EF prize** per project. All Arkiv tracks count as one pick.
- The pattern on record: sponsors pay for the *deepest use of their newest and most specific feature*. Stacking only works when the sponsors **genuinely depend on each other**. 9 of 16 finalists won no sponsor prize, so finalist judges and sponsor judges reward different things. The ideal idea satisfies both. Name the trade-off when it does not.

## Team (from Dhruv)
- **3 people.** Some research docs assume 4; ignore that.
  - **Dhruv Mulay:** backend, frontend, full-stack, product, design, smart contracts. Background in RF/radar signal-processing research, ML/data and energy (FlexGrid). Deep Solana/Anchor experience (Fiducia: 636 tests, attack search, a trust-and-safety mindset). Won the Crusoe track at RAISE with a robot-fleet trust-and-safety control plane.
  - **Akhilesh Nawale:** full-stack developer.
  - **Somnath Ghadge:** listed as "Other".
- **Hardware:** none, **except Android phones**. A phone counts as hardware where a sponsor accepts it: 0G Physical AI's brief explicitly includes a "pocket device", but whether a phone qualifies for the $1k real-hardware prize is unconfirmed. A phone gives you a camera, microphone/speaker (acoustic ranging was used by the Tokyo finalist Enconomy), IMU, NFC (Android host card emulation), BLE, Wi-Fi RSSI, GPS and a vibration motor.
- Track: **From Scratch**.

## Off the table (hard rule from Dhruv)
**Anything that was crowded in the patterns of winners and projects at earlier hackathons.** Derive the full list from the analysis files; at minimum it includes:
- Agent spending caps / allowlists / expiry / revoke / budget trees (15+ winners: Cordon, Omamoris, LedgerMind, Harness, Kagi, Capsule, Batas, Airlock, x402 Guard, Preflight MCP, payOrRefuse…)
- x402 pay-per-call tool/data marketplaces for agents (OpenBook, OnchainRouter, Turnstile, Carpool, Covenant, Autonome, ad-402, Director.AI)
- Agent identity / legal wrappers / guardians (Novi Corpus, ZKred, Surety, Lifeline)
- LP automation, copy-LP, dynamic-fee/anti-arbitrage hooks (Arrakis, Gamma, lpTOKEN.fun, Fables, Remora, Delta Zero, OniBlock)
- ENS-branded stablecoin checkout / invoices (AnyAsset, Enscribe), onchain refunds (Unwind)
- Generic integration apps (MemeWarp / ad-402 tier); calendar-as-wallet; AI copy trading; Bluetooth-mesh offline transactions (NoNet); NFC event payments (AccessFi, Tap Pay)
- Already rejected, with reasons: HumanFlow (Fables), NetraPay (UPI already shows the payee), Bharosa (fails the "can't they just" test), DawaBox (legal/hardware; hardware is now off the table anyway), Fiducia continuity (declined).
- **Crowded is a filter on the core pitch, not on features.** A crowded mechanism may appear as a supporting feature but never as the headline.
- Each existing candidate must be re-checked against this rule too. MachineLease (hardware-attested rental) needs special scrutiny on both the crowding rule and the no-hardware rule: phone-only versions are allowed.

## Sponsor and mentor feedback ("DO 5")
**No live sponsor or mentor feedback is available.** Dhruv wants the run to work out what each sponsor actually wants from **primary sources**: the ETHGlobal Mumbai prizes page (the full text of each track, its qualification requirements and any "what we want to see" wording), sponsor docs, workshop and announcement material, sponsor blog/X posts and GitHub starter repos. Record the **verbatim track text** for every sponsor considered. That text is the rubric for the sponsor half.

## Site access
`ethglobal.com` rate-limits automated reads (HTTP 429). **Use the Playwright MCP browser** (`mcp__playwright__browser_*`) whenever a fetch fails or is blocked, with short delays between pages. At most a few parallel readers may hit ethglobal.com at once. A failed fetch is not evidence of absence.
- https://ethglobal.com/events/mumbai/prizes
- https://ethglobal.com/events/mumbai/info/details
- https://ethglobal.com/events/mumbai
- Showcase: https://ethglobal.com/showcase?events=ethonline2026 · ?events=tokyo2026 · ?events=newdelhi (project pages: /showcase/<slug>)

## Judging (verbatim where available; full facts in `COMPETITION.md`)
- Finalist rubric, as listed by ETHGlobal: **Technicality, Originality, Practicality, Usability (UI, UX, DX), WOW factor.** **No weights are published.** Do not invent any.
- Finalist session: 7 minutes = 4-minute live demo + 3 minutes of questions. Many rooms run in parallel at about 25 teams per room over 3 hours, so this is a first-round screen by a panel reacting in minutes.
- Judges prepare to ask: what inspired the project, which tools were used and why, and what challenges it solved.
- Finalist gates: a **live deployment** usable by anyone with the link · a 2–4 min demo video (≥720p, real voice, no music, not sped up, not recorded on a phone) · every form field · a **public GitHub repo** with incremental history · AI use documented with specs/prompts in the repo.
- Sponsor prizes are judged **from the submitted materials** (write-up, per-sponsor integration explanation + feedback, video), with fewer than 2 minutes per project.
- Field: an estimated 250–600 projects at Mumbai (Devcon week). Recent finalist counts were 8 (ETHOnline 2026) and 10 (New Delhi 2025).

## Materials to read (all local)
- `/Users/mulaydm10/Dhruv/ETH mumbai/COMPETITION.md`: event facts (single source of truth)
- `/Users/mulaydm10/Dhruv/ETH mumbai/docs/research/ETHGlobal_Mumbai_Research_Handover.md`: sponsor-track table (41 tracks), winners at 3 events, patterns
- `/Users/mulaydm10/Dhruv/ETH mumbai/research/playbook/2026-11-05-ideation/sources/compendium.txt`: the newest and widest source: per-sponsor rules, what wins, depth levels, every idea considered with its verdict, the Fiducia post-mortem, who to ask what
- `/Users/mulaydm10/Dhruv/ETH mumbai/docs/research/Idea_Candidates_Verbatim.md`: the three current candidates in full
- `/Users/mulaydm10/Dhruv/ETH mumbai/research/playbook/2026-11-05-ideation/sources/ethonline-finalists-study-guide.txt`: why the ETHOnline finalists stood out (written for a Solana event; use only the finalist analysis)

## Existing candidates (must enter the CONVERGE pass alongside the DIVERGE survivors)
1. **ReadLeak / LeakMeter:** measures what a wallet/DeFi app leaks through RPC reads, fixes it with EF Anon-RPC plus an Arkiv mirror, and reports a before/after leak score. EF + Arkiv + Uniswap/ENS. The compendium calls it the safest pick; its risk is low WOW factor.
2. **Fallback Checkout:** a stablecoin checkout whose customer can still verify, reclaim or complete the payment after the merchant's backend and frontend vanish. Whitechain + ENSv2 + EF CROPS. Strong live moment (kill the server). Overlaps Unwind, AnyAsset and Enscribe.
3. **MachineLease:** payment accrues only during verified physical use, with a safe stop. 0G Physical AI + Whitechain + Arkiv. Needs a phone-only reframe.
4. **Hedged LP:** one-click hedging for ordinary LPs via Definitive Flash orders. Uniswap + Definitive. Check it against the LP-crowding rule.

## Known source conflicts (record which source each fact came from)
- World Agent Pass $5k split: the handover says $2.5k/$1.5k/$1k; the compendium says not stated and "proofs are mocked at this event". Resolve from the live prizes page.
- The 0G Physical AI third place / hardware prize is only partially captured.

## Deliberately excluded from this brief
Timing information is withheld per the playbook's clock rule. Design for the best version of the work. Report build difficulty as a note per idea and never use it as a filter; Dhruv decides feasibility.
