# 01 · Commitments (written before any generation)

## A. Rubrics, verbatim
**Finalist rubric** (ETHGlobal, via COMPETITION.md): "Technicality, Originality, Practicality, Usability (UI, UX, DX), WOW factor". **No weights are published, and none are invented here.** The compendium glosses Practicality as "complete and usable today".
Judges prepare to ask: "What inspired your project?", "What tools did you use, and why?", "What challenges did you solve, and how?"

**Sponsor rubrics.** These are the verbatim track texts, being collected into `sources/sponsor-tracks-verbatim.md` by the sponsor-source worker. Until that file lands, the sponsor half is judged against the summaries in compendium §2 and handover §"Mumbai sponsor tracks", which are marked ASSUMED.

**Goal ordering (human).** A finalist place first. Then the largest stackable sponsor money: at most 3 partner picks, at most 1 EF prize, and Arkiv counts as one pick.

## B. Constraints: TESTED / ASSUMED
| # | Constraint | Status | Source / test |
|---|---|---|---|
| C1 | Team of 3 (Dhruv: full-stack, contracts, RF/radar DSP, ML, Solana depth; Akhilesh: full-stack; Somnath: "Other") | TESTED | the human |
| C2 | No hardware except Android phones | TESTED | the human |
| C3 | From Scratch track, so no continuity prizes | TESTED | the human |
| C4 | Up to 3 partner picks; one partner's tracks count as 1 | TESTED | COMPETITION.md (site + email) |
| C5 | At most 1 EF prize per project | ASSUMED | compendium; verify on the prizes page |
| C6 | All Arkiv tracks count as one pick; Arkiv is judged partly on schema.md, friction.md, reach.md, why-arkiv.md, data-quality.md | ASSUMED | compendium; verify |
| C7 | A phone counts as a 0G Physical AI "pocket device" for the main places | ASSUMED (partly) | compendium quotes the brief; verify the verbatim text |
| C8 | A phone counts for 0G's $1k real-hardware prize | **UNKNOWN** | must be tested before it prunes or promotes anything |
| C9 | Every Arc prize must start in Arc Studio | ASSUMED | compendium; verify |
| C10 | ENSv2 must be on mainnet or Sepolia, central not cosmetic, with a live demo, open source and no hard-coded values | ASSUMED | compendium; verify |
| C11 | World Agent Pass: show the full journey plus a denied/expired path, backend validation and a debrief; split $2.5k/$1.5k/$1k vs "not stated"; "proofs are mocked" | CONFLICT | resolve from the live page |
| C12 | No Mumbai 0G track rewards 0G Storage alone | ASSUMED | compendium control test; verify |
| C13 | The finalist gate needs a live deployment anyone can open with a link | TESTED | finalist email via COMPETITION.md. A phone-only build therefore needs a web/PWA surface or a hosted viewer: this is a **design constraint, not a filter** |
| C14 | Crowded mechanisms may be features, never the headline | TESTED | the human |
| C15 | EF Anon-RPC, the Frame Transaction alternative mempool and the CROPS tracks exist with usable endpoints/devnets | ASSUMED | the technical-grounding angle in CONVERGE must test endpoints |

**The rule for ASSUMED constraints:** none of C5–C12 or C15 may prune a high-value branch until it has been tested by the sponsor-source worker or a CONVERGE angle.

## C. The crowded list (the hard filter on the core pitch)
Derived from BRIEF.md, compendium §3/§6 and handover §Winners. These must not be the headline:
1. Agent spending caps, allowlists, expiry, revoke or budget trees (Cordon, Omamoris, LedgerMind, Harness, Kagi, Capsule, Batas, Airlock, x402 Guard, Preflight MCP, payOrRefuse, AutoVoyage, Turnstile's cap, Novi Corpus treasury).
2. x402 pay-per-call tool or data marketplaces for agents (OpenBook, OnchainRouter, Turnstile, Carpool, Covenant, Autonome, ad-402, Director.AI, Instant).
3. Agent identity, legal wrappers and guardians (Novi Corpus, ZKred, Surety, Lifeline); "only route to a human what needs one" (yohaku).
4. LP automation, copy-LP, dynamic-fee or anti-arbitrage hooks, delta-neutral LP (Arrakis, Gamma, lpTOKEN.fun, Fables, Remora, Delta Zero, OniBlock, LP Agent).
5. ENS-branded stablecoin checkout and invoices (AnyAsset, Enscribe); onchain refunds (Unwind).
6. Generic integration apps (MemeWarp / ad-402 tier); calendar-as-wallet (calendefi); AI copy trading (KagamiAI); Bluetooth-mesh offline transactions (NoNet); NFC event payments (AccessFi, Tap Pay); UPI crypto on/off-ramp (ShieldRamp, PyPI).
7. Already rejected: HumanFlow, NetraPay, Bharosa, DawaBox, Fiducia continuity.
8. Adjacent and to be watched (not banned): prediction-market UX (OddsFlow, Dike), hardware wallets (LeekWallet), phone proximity proofs (Enconomy), hook measurement (TARE), radio through the mempool (Patio Station), fractional collectibles (Kura).

## D. Config note (known trade-offs)
- **DIVERGE buys originality at a usefulness cost.** The single-pass baseline beats it on usefulness, 2.8 vs 3.4. Practicality and Usability are both scored here, so **a hard CONVERGE pass is planned now**, and selection runs rubric fit → impact evidence → crowding, with novelty never first.
- **Finalist vs sponsor arm.** When an idea cannot satisfy both judge populations, I choose the **finalist arm** (the human's stated priority) and name the sponsor money given up.
- **Depth vs breadth.** Breadth comes from 6 altitude frames. Depth comes from each frame searching for *ingredients* (mechanisms, sensor physics, sponsor primitives, far-domain mechanisms) and **never for solutions to the brief**. Both are kept; neither is traded for the other.

## E. CONVERGE failure-mode map (each live risk is owned by an angle)
| Risk | Owner |
|---|---|
| F1 Crowding: the headline matches the crowded list or an earlier winner | prior-art-adversary (05) |
| F2 Problem not real, or fails "can't they just do X?" | impact-validator (06) |
| F3 Sponsor integration cosmetic, or fails a qualification rule (ENSv2 network, Arc Studio start, World full journey + denied path, 0G safe-stop / no faked decisions, Arkiv judging files, Anon-RPC use) | converge angle **sponsor-fit** |
| F4 The stack does not cohere (sponsors not interdependent; EF limit; pick-count math) | converge angle **sponsor-fit** |
| F5 Sponsor tech not actually available or usable (endpoints, devnets, SDKs, faucets): **capability, not clock** | converge angle **technical-grounding** (must hit the endpoints and install the SDKs) |
| F6 No Level-3 component, or the headline number cannot be measured | converge angle **technical-grounding** |
| F7 The phone does not count as hardware where the idea relies on it | sponsor-fit (verbatim text) + technical-grounding (Web Sensor APIs in a browser) |
| F8 No 4-minute WOW moment; the point is not visible in 60 seconds; weak answers to the 3 standard questions | converge angle **finalist-demo red-team** |
| F9 Finalist-gate violation (live link, From Scratch, public repo) | finalist-demo red-team |
| F10 Concurrent novelty (other Mumbai teams): unmeasurable | stated as residual; never claim "unique" |
| (removed) Execution ceiling vs time left | removed under the clock rule |

## F. Angle plan
**DIVERGE fan-out** (all Sonnet, in parallel, blind to each other, with one file each):
| Worker | Frame | Altitude / job | Output |
|---|---|---|---|
| D1 | free generator | unconstrained | 02-diverge-free.md |
| D2 | in-solution mechanism | phone-sensor physics + RF/DSP + the newest primitive of each sponsor | 02-diverge-mechanism.md |
| D3 | question-the-goal | what Devcon-week Ethereum actually needs; is "an app" even the right deliverable? | 02-diverge-question-goal.md |
| D4 | narrow-scope | one extreme user or one slice (India-specific, one actor) | 02-diverge-narrow.md |
| D5 | behavioral / informational | change information or behaviour, not the artifact | 02-diverge-behavioral.md |
| D6 | distant analogy | import a mechanism from a far domain (the highest-yield frame on record) | 02-diverge-analogy.md |

**Grounding run in parallel** (not a diverge frame; it feeds CONVERGE):
| S1 | sponsor primary sources: the verbatim ETHGlobal prizes page via Playwright | sources/sponsor-tracks-verbatim.md |
| S2 | sponsor docs, starter repos, workshop and blog material: what each sponsor wants and its newest feature (no ethglobal.com, to respect the reader cap) | sources/sponsor-docs-notes.md |

**That is 8 concurrent workers**, above the usual 3–6. This is justified because the 6-frame diverge composition is a measured invariant ("do not collapse it"), and S1/S2 are grounding infrastructure that the CONVERGE pass needs regardless. Only S1 touches ethglobal.com, which keeps us within the cap of about 3 readers.

**After DIVERGE:** I run cross-pollination (03) and TRANSFORM (04) centrally. Then prior-art-adversary (05) and impact-validator (06) run on the short list plus the 4 existing candidates. Then CONVERGE angles (07): sponsor-fit, technical-grounding and finalist-demo red-team. Then reconcile (08), the board (09) and the gate (10).
