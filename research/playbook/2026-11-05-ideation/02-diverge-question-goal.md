# DIVERGE worker D3 - frame: QUESTION THE GOAL
Angle: question the stated objective (consumer app for a Devcon panel?). Look at what Ethereum itself says is broken/missing in 2025-26 and wrap tools/measurements/public goods in a demoable product. Generation mode; criticism off. Date 2026-11-05.

## Log (append-only)
- [read] diverge-context.md in full. Found: rubric, sponsors, OFF-THE-TABLE list (incl. RPC-read privacy leak meters, merchant-disappearance checkout). Sure: high.
- [WebSearch] "FOCIL inclusion lists ... Glamsterdam status". Found: FOCIL (EIP-7805) deferred from Glamsterdam (Dec 2025 ACD), now Hegota headliner; lists capped 8KB; one analysis says ~92% of txs in top-fee ILs are wasted bandwidth; devs argue inclusion already high so no tangible user benefit. URLs: https://ethereum-magicians.org/t/hegota-headliner-proposal-focil-eip-7805/27604 ; https://hackmd.io/@nixorokish/FOCIL-breakout-summary ; https://etherworld.co/focil-eip-7805-cfid-with-strong-developer-community-backing . Sure: medium (secondary summaries; Nov 2026 status unverified).
- [WebSearch] "Vitalik trustless wallet RPC light client". Found: Vitalik 2026 push: wallets drifted to Infura/Alchemy; Helios light client (a16z) turns untrusted RPC into verified local RPC; EF Kohaku wallet ships Helios + privacy by default; PIR endgame for private reads. URLs: https://cryptoslate.com/ethereum-may-finally-kill-trust-me-wallets-in-2026-and-vitalik-says-the-fix-is-already-shipping/ . Sure: medium (syndicated; original post not seen).
- [WebSearch] "frame transactions EIP-8141 mempool concerns". Found: EIP-8141 (type 0x06, VERIFY + EXECUTE frames) CFI for Hegota; nodes must simulate before mempool admission -> DoS risk; proposed policy "self-relay only" public mempool, sponsored via bundlers; frame txs fix gas-payer leak not order-flow leak; Nethermind/Besu complexity concerns. URLs: https://hackmd.io/@matt/frame-mempool ; https://ethereum-magicians.org/t/native-account-abstraction-1-april-22-2026/28227 . Sure: medium.
- [WebFetch] https://hackmd.io/@matt/frame-mempool -> returned empty content (FAILED; rely on search summary only).
- [WebSearch] "Anon-RPC EF private reads". Found: EF Private Reads team (privreads.ethereum.foundation): source privacy (Anon-RPC, TorJS = Arti->WASM, Abstract Access Layer to swap anonymity networks), content privacy (PIR/ORAM), light clients for correctness. Standard RPC leaks IP, device fingerprint, queried addresses, timing. URLs: https://privreads.ethereum.foundation/roadmap/ ; https://privreads.ethereum.foundation/workstreams ; https://ethereum.org/ja/roadmap/privacy.md . Sure: medium-high (official EF pages). Note: leak-meter is OFF-TABLE as headline.
- [WebSearch] "L2 interop fragmentation EIL". Found: EF Ethereum Interop Layer (Nov 2025), wallet-centric, ERC-4337 based, aims at "feel like one chain"; critiques current interop as CEX-like (bridge operators, relayers, solvers). URL: https://blog.ethereum.org/2025/11/18/eil . Sure: medium-high.
- [WebSearch] drainer stats. Found (Scam Sniffer 2025 report): drainer losses $83.85M in 2025, -83% vs ~$494M 2024; 106,106 victims; avg loss ~$790 (shift to small high-frequency theft); Permit = 38% of >$1M losses; EIP-7702 exploits an emerging vector. URL: https://drops.scamsniffer.io/scam-sniffer-2025-crypto-phishing-losses-fall-83-to-84-million/ . Sure: medium-high (lower bound, EVM signature drainers only).
- [WebSearch] builder centralization. Found: secondary claim top-2 builders ~73% blocks mid-2026 (spark glossary), other sources 80-86%; 2023 IMC paper: PBS may stimulate censorship, relays unreliable; ePBS EIP-7732 is the proposed fix. URLs: https://www.spark.money/glossary/block-builder ; https://arxiv.org/abs/2305.19037 . Sure: low-medium on the exact number (conflicting secondary sources).
- [WebSearch] mempool health / private flow. Found: ~half of txs private by early 2025 (vendor glossary); the % depends on definition (public / private / exclusive); papers use MempoolDumpster. No ethresear.ch thread or 2026 measurement found = a MEASUREMENT GAP. URLs: https://arxiv.org/html/2512.17602 ; https://arxiv.org/html/2506.04940v3 . Sure: medium.
- [WebSearch] EIP-7702 delegation phishing. Found: Wintermute: >80% of 7702 delegations target copy-pasted sweeper contracts, >450k wallets compromised (second-hand, dashboard not seen); Protos: ~48% of 7702 authorizations crime-linked; arXiv 2512.12174 analyses >150k 7702 auth/exec events, 26k addresses; counter-view: root cause is leaked keys. URLs: https://protos.com/48-of-ethereum-eip-7702-uses-linked-to-crime-says-wintermute ; https://arxiv.org/abs/2512.12174v1 ; https://www.theblock.co/news/ecosystems/2025-06-01-wintermute-warns-pectra-upgrade-leaves-ethereum-users-at-risk-of-automated-attacks . Sure: medium (figures conflict on denominator).
- [WebSearch] Helios/Kohaku light client. Found: Helios verifies untrusted RPC (CL from weak-subjectivity checkpoint, EL proofs for balances/storage/receipts), supports OP Stack; Helios team once said "do not add as main RPC in wallets yet"; ethereum.org says light clients not production ready (page may be dated). URL: https://a16zcrypto.com/building-helios-ethereum-light-client/ . Sure: medium. Gap: nothing on verifying blobs / non-OP L2 state.
- [WebSearch] Vitalik walkaway test. Found: late 2025/Jan 2026 Vitalik: apps should survive Cloudflare going offline; wallets fail basic usability/walkaway test (multisig check). Secondary sources only. URL: https://www.crowdfundinsider.com/2026/01/257035-ethereum-co-founder-vitalik-buterin-emphasizes-importance-of-decentralization-and-real-world-use-cases-for-dapps/ . Sure: low-medium. NOTE: "checkout that survives merchant disappearance" is OFF-TABLE; do not headline walkaway.
- [GitHub MCP search_issues] "light client verify RPC response wallet trust infura" -> output 108k chars, too large, saved to tool-results file; NOT read (skipped to save context; no evidence taken from it). Marked blocked/unused.
- [WebSearch] clear signing ERC-7730. Found: EF Trillion Dollar Security Initiative stewards ERC-7730; registry live; V2 April 2026; spec itself warns of "registry poisoning" and input-injection; Ledger best implementation. URLs: https://thedefiant.io/news/blockchains/ethereum-foundation-launches-clear-signing-standard ; https://onekey.so/blog/ecosystem/ethereum-foundations-clear-signing-standard-aims-to-end-blind-signing-risk-on-ethereum-20260513045204/ . Sure: medium. Bybit link unverified.
- [WebSearch] geographic distribution / Asia. Found: 4pillars (operator of 25k+ validators in Asia): attestation accuracy hardest; P2P layer structurally disadvantages low-density regions; Cambridge: 31% of node activity in US; Lido "Borderless Ethereum" measuring validator geography; no India-specific numbers. URLs: https://4pillars.io/en/articles/ethereums-geographic-blind-spot ; https://research.lido.fi/t/borderless-ethereum-measuring-the-geographical-distribution-of-validators/4472 ; https://arxiv.org/html/2509.21475v2 . Sure: medium. India-specific data = gap.

---------------------------------------------------------------
## Reframing the objective (rationale, first-class)
1. "Consumer app" is not the rubric. The rubric (Technicality, Originality, Practicality, Usability, WOW) is satisfied equally by a MEASUREMENT or ADVERSARIAL STUDY wrapped in a live product, and the context file says 2026 winners are "Level 2 + one Level 3 component with a self-measured number". A measurement is a number by construction. EF/ecosystem judges see apps daily and rarely see a new fact about Ethereum; "we measured X from Mumbai and here is a tool anyone can open" answers "this should exist".
2. Evidence that Ethereum needs facts, not more apps: FOCIL devs argue "inclusion is already high" while another analysis says ~92% of IL bandwidth is waste (no live counterfactual tool found); frame-tx mempool policy is explicitly "a policy choice" with DoS unknowns; 7702 sweeper numbers conflict (80% / 48% / "it's key leaks"); builder share quoted anywhere from 73% to 86%; public/private flow share depends on definition. Disagreement on numbers = demand for a reproducible instrument.
3. Sponsor-money vs finalist tension: stacking is penalised by 2-minute sponsor judging if sponsors are bolted on. The dissolving shape: ONE adversarial/measurement instrument whose data layer (Arkiv TTL entities), identity/governance layer (ENSv2 roles) and EF subject (CROPS/frame mempool/Anon-RPC) are each load-bearing. The finalist story ("a new fact + a tool") and sponsor story ("deepest use of the newest feature") then are the same story. Best single example: idea 1.
4. Caveat for orchestrator: I am not scoring feasibility (criticism off), but ideas 2 and 8 depend on EF mempool/FOCIL spec details I could not read (hackmd fetch failed).

## IDEAS

### 1. Canary Keys (live 7702 sweeper honeypot + public delegate registry)
- Problem: EIP-7702 made "sweeper" delegation a one-signature drain; wallet users (esp. those with leaked keys) lose funds and nobody can answer how big or how fast. Who suffers: EOA holders, wallet teams.
- Evidence: https://protos.com/48-of-ethereum-eip-7702-uses-linked-to-crime-says-wintermute ("almost half of EIP-7702 authorizations involve crimes" per Protos report of Wintermute); https://arxiv.org/abs/2512.12174v1 (150k events analysed). Conflicting denominators = the gap (confidence medium).
- Mechanism: Plant funded bait EOAs with deliberately leaked keys (testnet + tiny mainnet amounts on a cheap chain) in public places; watch for 7702 authorization txs; capture the delegate bytecode; classify (sweeper/batcher/legit); publish each as an entity in a queryable registry with TTL and attributes (code hash, first-seen, victim count, selectors). A phone/web "Delegation Check" lets anyone paste an address and see its current delegate against the registry.
- Ingredients: Scam Sniffer report https://drops.scamsniffer.io/scam-sniffer-2025-crypto-phishing-losses-fall-83-to-84-million/ ; Wintermute via https://www.theblock.co/news/ecosystems/2025-06-01-wintermute-warns-pectra-upgrade-leaves-ethereum-users-at-risk-of-automated-attacks
- Sponsors (3): EF CROPS (security/open source, the subject); Arkiv (registry of delegates with expiry + attribute queries is exactly its model; "Mirror something Ethereum depends on"); ENSv2 (reporters/curators hold roles via EAC under e.g. canary.eth sub-registries; wildcard resolver resolves any delegate code hash to a verdict). ENS needed because curation permissions (who may mark a delegate malicious) is an access-control problem.
- Phone role: bait wallet UI + haptic/flashlight alert; phone is the "victim" on stage. Optional.
- Level-3: the honeypot fleet + classifier, with measured time-to-sweep and distinct-sweeper count.
- WOW: on stage, publish a bait key live; within seconds a bot sweeps it; the registry gets a new red entry, and a second phone that checks the victim address flips to "delegated to known sweeper".
- Self-measured number: median seconds from key exposure to first sweep; # distinct sweeper contracts per 24h.
- Fit: Dhruv's adversarial/trust-and-safety background.

### 2. Frame Fuzz (adversarial DoS lab for the frame-tx alternative mempool)
- Problem: Frame txs make nodes simulate VERIFY frames before admission; nobody can say how cheap it is to exhaust a node under each proposed mempool policy. Who suffers: node operators, AA users, core devs deciding Hegota.
- Evidence: https://hackmd.io/@matt/frame-mempool (content not fetched; via search summary: policy "is a choice, not a fixed rule", "self-relay only" first option); https://ethereum-magicians.org/t/native-account-abstraction-1-april-22-2026/28227 (mempool/statelessness concerns raised; Nethermind and Besu complexity concerns per summary).
- Mechanism: Implement 2-3 candidate mempool admission policies in a small node/simulator; a generator produces adversarial frame-tx corpora (expensive-to-simulate, state-dependent invalidation, griefing sponsor); report attacker-cost vs node-cost amplification per policy; dashboard to replay.
- Ingredients: https://everstake.one/resources/blog/native-account-abstraction-on-ethereum-what-eip-8141-means-for-validators (node-operator view; search result only).
- Sponsors: EF Frame Transaction Alternative Mempool (the prize, only EF pick); Arkiv (attack corpus as attribute-queryable entities with TTL, "Node tooling" track); optional 0G (no - skip). Two sponsors.
- Phone role: none required (honest).
- Level-3: the amplification-ratio fuzzer with reproducible corpora.
- WOW: slider switches policy from "self-relay only" to "permissive sponsored"; a node-CPU graph flat-lines then explodes under the same attack stream.
- Number: amplification ratio (node CPU-ms per attacker-gas) per policy.

### 3. Selective-Lie Detector (do RPC providers answer you differently when they know who you are?)
- Problem: Wallets trust Infura/Alchemy-class RPCs for balances, state, tx status; nobody checks whether answers are stale, wrong, or differ by client identity/region. Who suffers: every wallet user; India users on high-latency routes.
- Evidence: https://cryptoslate.com/ethereum-may-finally-kill-trust-me-wallets-in-2026-and-vitalik-says-the-fix-is-already-shipping/ (Vitalik: wallet defaults drifted to centralized RPC; secondary source). EF Private Reads: https://privreads.ethereum.foundation/roadmap/
- Mechanism: Phone-resident verifier (light-client check à la Helios) queries N public RPCs both directly and through an anonymized path (Anon-RPC/Tor-style); compares against proofs; scores providers on staleness, disagreement, censorship of specific addresses/contracts, and identified-vs-anonymous divergence. Not a privacy leak meter: the headline is CORRECTNESS/DISCRIMINATION.
- Ingredients: https://a16zcrypto.com/building-helios-ethereum-light-client/ ; https://privreads.ethereum.foundation/workstreams (TorJS, Abstract Access Layer).
- Sponsors: EF Anon-RPC (needed: anonymized path is the control group); Arkiv (provider scorecard time series with TTL); ENS (provider endpoints/attestations as names with roles - optional). 
- Phone role: runs the verifier and probes from Indian cellular/Wi-Fi vantage.
- Level-3: proof-checked comparison engine across providers, identified vs anonymous.
- WOW: a rigged "evil RPC" on stage lies about a balance by 1 wei/10%; the phone turns red and names the exact proof that fails; then the leaderboard of real providers.
- Number: % of queries where provider answers disagree with proof; median staleness in blocks per provider per path.
- Caveat: close to the off-table "RPC read privacy leak meter"; this one differs by testing correctness and discrimination, not exposure. Orchestrator should judge.

### 4. Descriptor Diff (poisoning audit for ERC-7730 clear-signing registry)
- Problem: Clear signing shows human text from a registry JSON; a poisoned or sloppy descriptor makes wallets display a lie. Who suffers: users of Ledger/Trezor/MetaMask-class wallets who trust the screen.
- Evidence: https://onekey.so/blog/ecosystem/ethereum-foundations-clear-signing-standard-aims-to-end-blind-signing-risk-on-ethereum-20260513045204/ (spec itself warns of "registry poisoning" and input injection).
- Mechanism: Fetch descriptors from the registry, fuzz calldata through each, simulate the real state change, and diff against the rendered text (wrong amount, wrong recipient, hidden approve). Output: mismatch list + CI-style badge; second-screen phone view that renders the same tx from raw simulation.
- Ingredients: https://thedefiant.io/news/blockchains/ethereum-foundation-launches-clear-signing-standard
- Sponsors: EF CROPS; ENSv2 (descriptor publisher authority by name roles/permissioned resolvers - genuinely needed for "who may publish a descriptor for contract X"); Arkiv (mismatch findings).
- Phone: independent rendering device (camera scans tx QR).
- Level-3: the descriptor/simulation diff engine, with count of real mismatches found in the registry.
- WOW: tamper with a descriptor; wallet screen says "send 1 USDC", phone's independent render says "approve unlimited".
- Number: # of registry descriptors with at least one material mismatch / total.
- Risk note: adjacent to "hardware wallet refuses what it cannot display" (finalist); differ by auditing the registry.

### 5. Inclusion-List Replay (what would FOCIL have forced, and at what bandwidth waste?)
- Problem: FOCIL's value is disputed ("inclusion already high" vs bandwidth-wasting lists); no one-click counterfactual on real blocks. Who suffers: core devs choosing Hegota scope; censored users.
- Evidence: https://ethereum-magicians.org/t/hegota-headliner-proposal-focil-eip-7805/27604 ; https://hackmd.io/@nixorokish/FOCIL-breakout-summary (per search summary: 8KB lists, ~92% wasted bandwidth in one analysis).
- Mechanism: Replay N historical slots plus mempool-dump data (MempoolDumpster, https://arxiv.org/html/2506.04940v3 method); simulate committee ILs under tunable rules; measure rescued-censored-tx vs wasted bytes; interactive "turn the knobs" UI; live deployment with the replay in-browser.
- Sponsors: EF CROPS (censorship resistance); Arkiv (replay datasets as entities); 0G optional (heavy compute - skip).
- Phone: none.
- Level-3: the counterfactual simulator validated against known censored transactions.
- WOW: pick a real historically-delayed transaction; scrub the slider; watch it get forced in.
- Number: % delayed txs rescued vs bytes wasted at 8KB cap.

### 6. Block-Arrival Mumbai (crowd probe: how late does Ethereum reach India, even on a local train?)
- Problem: low-node-density regions are structurally disadvantaged in the P2P layer (4pillars), but there is no India-level, mobile-network dataset. Who suffers: Indian validators/solo stakers, and every Indian user relying on slow-confirming apps.
- Evidence: https://4pillars.io/en/articles/ethereums-geographic-blind-spot (operator of 25k+ validators in Asia: attestation accuracy "hardest"); https://ethresear.ch/t/geographical-decentralisation/13350 (older).
- Mechanism: Android phones run a lightweight header-subscriber; log slot-start vs header-arrival per network type (Jio/Airtel, Wi-Fi, moving train); submit measurements to a shared queryable dataset; map + percentile dashboard anyone can join by opening the link on their phone.
- Sponsors: Arkiv ("Mirror something Ethereum depends on": time-stamped probe data with TTL); EF CROPS (geographic decentralisation as censorship/resilience); 0G optional.
- Phone role: the instrument (GPS, network type, IMU for train motion, cell RSSI).
- Level-3: clock-skew-corrected arrival-time measurement on mobile, publishing validated percentile maps.
- WOW: team member rides a Mumbai local during the demo; the map streams p50/p95 lateness live; the judges can open the link and add their own phone from the venue.
- Number: p50/p95 block-header lateness by network type; delta Mumbai vs reference vantage.

### 7. Island Index (what does it really cost to move between L2s today?)
- Problem: Users still bridge ETH to pay gas on another L2; claims that EIL fixes it lack an independent continuously-run benchmark. Who suffers: any multi-L2 user.
- Evidence: https://blog.ethereum.org/2025/11/18/eil (EF: interop today resembles a CEX-like model of bridge operators, relayers, solvers).
- Mechanism: A synthetic user continuously executes the same intent over N interop paths (canonical bridge, intent solver, CCIP, EIL-style 4337 path); records time, fee, steps, trust assumptions; public live scoreboard, with a "state-changing cross-chain call" through CCIP as a path.
- Sponsors: Chainlink CCIP 2.0 (must change state cross-chain: needed as measured path and for result attestation); Arkiv (history); EF none.
- Phone: tap to run the same transfer from a phone wallet while the scoreboard records. Optional.
- Level-3: the multi-path harness with reproducible cost/time numbers.
- WOW: three phones race the same $5 move over three paths; stopwatch shows 2 s vs 14 min.
- Number: median settle time and total fee per path over 24h.
- Weakness flagged for later: edges toward "integration app"; the benchmark is the differentiator.

### 8. Mempool Gap Atlas (public vs exclusive vs private by definition)
- Problem: "half of transactions are private" depends entirely on whether you mean unseen-in-mempool or single-builder-exclusive; nobody can reproduce either live. Who suffers: researchers, FOCIL/frame-mempool designers.
- Evidence: https://arxiv.org/html/2512.17602 (three-way public/private/exclusive split, per search summary) ; https://www.spark.money/glossary/private-order-flow (~half private early 2025, vendor source).
- Mechanism: A multi-vantage listener (cloud + phone Wi-Fi/cell) timestamps pending txs; joins to included blocks; classifies per the three definitions; live chart of each share plus top builder shares; one-click publishable CSV.
- Sponsors: EF Frame Mempool (feeds policy question); Arkiv.
- Phone role: extra vantage points.
- Level-3: vantage-fused classification with a verified precision against known private bundles.
- WOW: a transaction the judges submit from their phone is classified live as public/private/exclusive.
- Number: public/private/exclusive % per hour; vantage-agreement rate.
- Overlap warning: dashboards exist (MempoolDumpster); may be too crowded.

## DISCARDED
1. Helios-by-default wallet (ship a verifying wallet): Kohaku already does it (EF); integration-only; no Level 3.
2. Implement PIR for state reads: EF Private Reads team is researching; unrealistic in a weekend; no honest demo.
3. Post-quantum frame-tx wallet: gas costs for PQ signatures flagged at the April 22 call; demo would be a slide.
4. Builder-centralization dashboard (ePBS case): numbers conflict (73-86%) but dashboards exist and a dashboard is not a Level 3.
5. Walkaway-test checker for dapp frontends / DNS-proof frontends: Vitalik quotes are strong but this sits next to off-table "checkout survives merchant disappearance" and the sources I found are secondary.
6. Another drainer-blocking wallet extension: crowded; no measured number beyond a blocklist.
7. Hardware wallet that refuses undisplayable calls: already done by a finalist (context file).
8. Consumer app wrapping any of the above (e.g. "safe wallet for India"): fails the "question the goal" test; rubric rewards a new fact and a hard component, and sponsors judged in 2 minutes reward depth.

## Ranking by this frame (my view, not feasibility-checked)
1 Canary Keys (strongest fusion of EF + Arkiv + ENS and the dissolving-tension case; fits Dhruv's adversarial history). 2 Frame Fuzz (highest "should exist" for EF judges; risk: spec not read). 3 Block-Arrival Mumbai (best phone role + India/train WOW).

## Searches run / sources fetched / tools used
WebSearch (standard) x13: FOCIL status; Vitalik trustless RPC; EIP-8141 mempool; Anon-RPC/EF private reads; EIL L2 interop; wallet drainer stats; builder centralization; private order flow share; EIP-7702 delegation phishing; Helios/Kohaku; walkaway test; ERC-7730 clear signing; geographic distribution.
WebFetch x1: https://hackmd.io/@matt/frame-mempool -> FAILED (empty content); Playwright fallback not tried.
GitHub MCP search_issues x1 -> result too large (108k chars), unread, no evidence used.
Blocked/unfetched: original Vitalik posts, ethresear.ch posts directly (search surfaced none besides 13350), privreads anon-rpc page. All quotes/figures above come from search-result summaries, not full-page reads; confidence labelled per entry. Did not visit ethglobal.com. No agents spawned. No other files edited.
