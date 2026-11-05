# 07 CONVERGE C1: Sponsor fit and stack coherence (S-B, S-A, E1)
Angle: sponsor fit only. Log is append-only; entries below.

## Log (append-only)
### [1] Read converge-brief.md (local). Three candidates S-B Tremor Witness, S-A LIFEBOAT, E1 ReadLeak. Confidence high.
### [2] Read sources/sponsor-tracks-verbatim.md in full for EF (L1623-1895), ENS (L1896-1992), Arkiv (L1082-1347), World (L111-265), Whitechain (L1348-1622), 0G (L362-628) and the "Resolved questions" block (L2355+). Confidence high (verbatim capture).
Key verbatim facts used below:
- EF CROPS judging: "depth of the lead property: structural (works without you) beats cosmetic (a setting)"; quals: README section titled CROPS with C/O/P/S lines; "demo video (3 minutes max) that shows the lead property working end to end, including the moment it matters: ... you switch off your backend, swap the RPC provider, or show server logs with nothing identifying in them"; "No third-party trackers or analytics in the client"; "One EF prize per project. You can submit to anon-rpc, the alt mempool and CROPS, but you will be placed in at most one. EF judges decide where it fits best." Prize 2000/1000/500.
- EF Anon-RPC: qual "Your app routes its RPC reads through Anon-RPC by default. If you're building a worker or the harness, a simple demo app is enough." Judging includes "how much of the app's traffic goes through Anon-RPC (if an app)" and "could this be shipped for real". Ideas include "network health checker / playground: run anon-rpc against multiple networks and measure/compare". Prize 2500/1500/1000.
- EF Alt mempool: qual "Show real alt mempool usage: a link to your admitted transaction on the devnet explorer, or code that submits one. Your team must be able to explain the design, the code and the trade-offs." Judging: creativity, usefulness, practicality, how well it works, relation to the alt mempool. Area (b) names "ERC20 paymasters, daily quota paymasters"; area (c) "DoS vectors and vulnerabilities, new rules, simulators and fuzzers". Prize 2500/1500/1000.
- ENSv2 (from scratch, 3000/2000/1000/1000): "ENSv2 features should be central to the product, not a cosmetic add-on. Your demo must be functional and not just include hard-coded values." live demo link + open source. Mainnet OR Sepolia.
- Arkiv Build (3000/1000) judged 25% each: friction.md, reach.md, why-arkiv.md, how-you-use-arkiv.md; plus schema.md; README wallet address(es) + one runnable query; "Not counted: the SDK installed but never used to read, or Arkiv used only as a log that nothing reads."; "at least one feature users see reads its data from Arkiv".
- Arkiv Mirror (3000/1000): friction, reach, why-arkiv, data-quality (25% each); "Not Sourcify data"; "The data's license allows republishing. Link it in your README."; "Your import script is in the repo, and we can re-run it."
- World Agent Pass from-scratch $5000 (2500/1500/1000): "Strong submissions will show a meaningful action that needs a human identity or approval layer, not simply a login screen"; must demo full journey + "a denied, expired, cancelled, or otherwise unsuccessful path where the protected action does not occur"; "Validate identity results in a secure backend"; short integration debrief. The $2,500 Agent Pass is Continuity-only (not available to us). IDKit $2,500 "Up to 2 teams will receive $1,250" is open.
- Whitechain: all four tracks need USDT 0xcedf... payment on Whitechain Sepolia, WHITECHAIN_FEEDBACK.md, 2-4 min video; "Won't place. A pay button that sends a plain transfer".
- 0G Physical AI: "Not wanted: ... 0G used only for logs"; 0G Private Computer: "Not wanted: Apps where the AI call could be removed without anyone noticing", "One sentence on what breaks if 0G is removed".
### [3] Read sources/sponsor-docs-notes.md. Facts used: Arkiv limits (string 128 B, bytes 128 KiB, 32 attrs, MAX_LIFETIME ~182.5 days, 100 rows/page, public RPC rate limited, need access key); ENSv2 live on Sepolia only (mainnet v1 still serves until launch; registration paid in stablecoin); Anon-RPC harness 0.4.0 pre-1.0, "anonymizing networks live on mainnet today"; EIP-8141 Draft, no public devnet RPC found by S2; AgentKit (beta, World Chain, npm 0.2.1) found but product named "Agent Pass" not found by S2 (medium confidence). Confidence high on quotes, medium on product naming.
### [4] WebFetch https://docs.altmempool.wtf/guides/devnet/ (2026-11-05)
Found: public devnet exists. Execution RPC https://altmempool.forshtat.com ; mempool/sidecar RPC https://altmempool.forshtat.com/rpc (ws wss://.../rpc); chain ID 1337. "There is no faucet." One genesis account, key published in sidecar repo; generate own key and fund by plain transfer. Submit with eth_sendFrameTransaction on the sidecar (simulates, checks validation prefix) or raw type 0x06 to ethrex. Page says NOTHING about EIP-7702 or ERC20 paymasters. This CONTRADICTS the S2 note "public devnet RPC not found" (S2 did not read this page). Single shared funded key: many teams will share one devnet. Confidence medium-high (small-model summary of page).
### [5] WebFetch https://docs.ens.domains/ensv2/enhanced-access-control/
Found: roles are per-resource (resource tied to a namehash and, for the Permissioned Resolver, scoped to keys/coin types/content types); admin can revokeRoles / revokeRootRoles. Page does NOT mention EAC restricting reads and does NOT mention time-limited roles. Implication: "contractor gets read-only access via EAC" (S-B brief) is meaningless (Arkiv/ENS records are public); expiry must come from expiring SUBNAMES (registry feature per ENS track text: "expiring, revocable, non-transferable"), not from roles. Confidence medium (summary).

## ANALYSIS

Probabilities and payouts below are JUDGMENT, not data. "Place" amounts from the verbatim prize splits. Feasibility (does the demo ship) belongs to other angles; EVs below are conditional on a working demo unless stated.

### CANDIDATE S-B Tremor Witness

Tracks S-B could enter (From Scratch only; Continuity-only prizes excluded):
1. Arkiv Build ($3k/$1k). 2. ENSv2 ($3k/$2k/$1k/$1k). 3. EF CROPS ($2k/$1k/$0.5k). 4. World Agent Pass $5k ($2.5k/$1.5k/$1k). 5. World IDKit $2.5k (up to 2 teams x $1,250). 6. EF Anon-RPC (stretch). Not plausible: Arkiv Mirror (our data is original, not a mirror: FAIL), Arkiv Node tooling (FAIL), Whitechain x4 (no USDT payment flow, FAIL), 0G x3 (FAIL; Physical AI would be "0G used only for logs", Private Computer would be an AI call nobody needs).

**1. Arkiv Build**
- Built from scratch: PASS.
- Writes to Rabdi testnet with @arkiv-network/sdk; "at least one feature users see reads its data from Arkiv": PASS only if the UI timeline/quorum check queries Arkiv. AT RISK if the PWA shows local state and Arkiv is write-only: that is exactly "Not counted: ... Arkiv used only as a log that nothing reads."
- README wallet address(es) + one runnable query: PASS (trivial) but see privacy finding F2.
- schema.md/friction.md/reach.md/why-arkiv.md/how-you-use-arkiv.md: all PASS-able; the design naturally answers them (query by site/ppv/time; owner = sensor; expiry = complaint window).
- Judging "How you use Arkiv: Does each Arkiv feature you use change something your users see?" PASS if the UI shows an "evidence window closes in N days, extend" countdown and a filterable PPV query. "Why Arkiv: if you swapped Arkiv for Postgres what would users lose?" Strong honest answer: the contractor/authority does not run the database and cannot delete or edit a row owned by a resident sensor key; anyone can run the same query without our API.
- COSMETIC flags: (a) expiry capped at MAX_LIFETIME 7,884,000 blocks (~182.5 days) per docs; a longer legal complaint window needs periodic extension, state it. (b) "read-only for contractor" is not an Arkiv feature (entities are public).
- Arkiv value pick-quality: HIGH.

**2. ENSv2**
- "Built on ENSv2 on Ethereum mainnet or Sepolia": PASS on Sepolia (contracts probed live by S2).
- "ENSv2 features should be central to the product, not a cosmetic add-on": AT RISK as briefed. As written ("Each building has an ENSv2 name; EAC roles: resident-contributor write only its own sensor's data, auditor role, contractor read-only") the name is a label and the EAC role set partly duplicates Arkiv entity ownership. The "contractor read-only" role is COSMETIC: EAC docs describe roles for what accounts "are allowed to do", nothing about reads; all data is public anyway.
- "demo functional, not hard-coded values": PASS if names/roles are really created on Sepolia in the demo.
- live demo link + open source: PASS.
- Judging text (track): "Use Enhanced Access Control ... letting an account edit only certain text records on a name", "expiring, revocable, non-transferable vs. transferable" subnames, "Permissioned Resolver so they fully own their data", "agents as namespaces". S-B design can hit these if redesigned (see Design changes).

**3. EF CROPS**
- Public FOSS repo + README with section titled CROPS (C/O/P/S): PASS (writable), but contents determine score.
- Lead property: S-B thesis is Censorship resistance: the only meter belongs to the contractor; evidence must not be deletable/editable by contractor, MMRCL, or us. That is a genuine "reason it exists", unusually strong for CROPS. "structural (works without you) beats cosmetic (a setting)": PASS only if confirmation of an event is derivable by anyone from raw per-phone signed entities (quorum is a deterministic query/function), AND the frontend is static (IPFS/any host) with no server we run. AT RISK if a backend aggregates quorum or relays writes.
- "the other three still hold, or trade-offs are stated": P is AT RISK: Arkiv entity $owner is public; if resident wallets own entities, who-reported is public. Fix: per-sensor ephemeral keys, never person wallets. Also the phone's IP is visible to the Arkiv RPC; state it (Anon-RPC cannot cover Arkiv writes).
- Required demo moment: "you switch off your backend": show server killed, PWA still loads from static host, events still queryable from Arkiv RPC, quorum recomputed client-side. Needs a "swap RPC provider" second moment optional.
- "No third-party trackers or analytics in the client": PASS if enforced (no CDN analytics, fonts from third parties are borderline; self-host).
- "Keys and personal data stay on the user's device": PASS (device key in browser; DeviceMotion data summarised on device; raw waveform optional).
- COSMETIC risk: if the backend only "helps" but the demo never kills it, judges see "a setting". Also Arkiv testnet is operated by Arkiv: honest C-letter statement "if Arkiv testnet resets, evidence is lost" is MED, must be stated, not hidden.

**4. World ID Agent Pass ($5k open track)**
- Integrate official Agent Pass: AT RISK. S2 could not find a product called "Agent Pass"; closest official is AgentKit (beta, registration in AgentBook on World Chain; "distinguish human-backed agents from bots"). Doc surface unverified. Confidence medium.
- Meaningful action needing human identity, "not simply a login screen": PASS-able: "one human, one sensor" is a real protected action (a sensor key may write quorum-counting readings only if it resolves to a unique human). Phone = human-backed agent is a faithful reading of AgentKit.
- Full journey + denied path: PASS-able and natural: a second sensor key from the same human is rejected, quorum does not count it.
- "Validate identity results in a secure backend": CONFLICT with CROPS kill-the-backend. The validation backend is an enrolment service we run; if it dies, new sensors cannot join (existing evidence survives). State in CROPS C line.
- Debrief: PASS-able (cheap).
- COSMETIC test (intervention below): quorum of N phones already limits one faked phone; World ID is only decisive against one person with N phones. With mocked proofs ("Proofs are using fake identities") the judge cannot see real unique-human enforcement. MED.

**5. World IDKit ($2.5k, up to 2 teams x $1,250)**: PASS-able ("real trust moment", minimum sufficient credential, success + alternative path), smaller payout, same backend caveat. Same World pick slot.

**6. Anon-RPC**: reads Sepolia ENS via Anon-RPC would be the only RPC reads in the app; docs say anonymizing networks are on mainnet; the app's main traffic is Arkiv, which is not Ethereum RPC. FAIL/AT RISK for "how much of the app's traffic goes through Anon-RPC". Not recommended; CROPS is the right EF track.

**Best stack S-B (<=3, <=1 EF):** Arkiv Build + ENSv2 + (EF CROPS or World Agent Pass).
Interdependence (honest): Arkiv holds evidence entities; ENSv2 holds who is allowed to be a sensor (subnames, expiry, revocation) and the quorum function READS ENS state to decide which Arkiv entities count; CROPS is the property that the whole thing survives the backend dying; World would gate enrolment.
Expected value (JUDGMENT, conditional on working demo):
- Arkiv Build: P(1st)=0.20, P(2nd)=0.15 -> 0.20*3000+0.15*1000 = $750.
- ENSv2: P(1st)=0.12, P(2nd)=0.12, P(3rd or 4th)=0.20 -> 360+240+200 = $800 if redesigned so ENS is central; if left as briefed (cosmetic roles) halve P -> ~$400.
- CROPS: P(1st)=0.10, P(2nd)=0.10, P(3rd)=0.10 -> 200+100+50 = $350 (EF CROPS is likely the most contested EF track; thesis fit is strong).
- World Agent Pass: P(1st)=0.10, P(2nd)=0.10, P(3rd)=0.10 -> 250+150+100 = $500 nominal; discount for unverified product naming and mocked proofs -> ~$350.
Totals: Arkiv+ENS+CROPS ~ $1,900; Arkiv+ENS+World ~ $1,900 (nominal) / ~$1,900 after discount. Tie on EV; CROPS preferred because its demo moment (kill the backend) also forces Arkiv and ENS to be load-bearing, while World adds a backend and a product-naming risk. Pick World instead only if the team can confirm the Agent Pass docs at auth.world.org/docs quickly (not done, see "cannot see").

**Intervention tests S-B**
- Remove ENSv2: events still stored and queried; sensors identified by Arkiv owner key. Product still works -> ENS is DECORATIVE as briefed. It becomes load-bearing only if sensor authorization (subname exists, unexpired, not revoked) is read by the quorum function. Then removal breaks enrolment/revocation.
- Remove Arkiv: events would need another store (IPFS/our DB); queryable, expiring, owner-written evidence disappears; core feature broken -> Arkiv is LOAD-BEARING (if the UI reads it).
- Remove CROPS (add a backend): product still works, but the thesis (evidence nobody can suppress) is gone; CROPS is a property, not a component. It is load-bearing for the pitch only if the kill-backend moment is shown.
- Remove World: quorum still rejects a single hand-shaken phone -> DECORATIVE for the core claim; load-bearing only for "one person with N phones". Say so honestly; the prize text wants "a meaningful action that needs a human identity".

**Design changes S-B (answering the brief's question)**
ENSv2 records vs Arkiv entities split:
- ENS (Sepolia): building name `bldg.tremor.eth`; each sensor = an expiring, revocable, non-transferable subname `flat3.bldg.tremor.eth` in a subname registry we deploy (track text: "expiring, revocable, non-transferable"). Subname's Permissioned Resolver holds ONLY slow-changing identity/config text records: sensor public key, calibration record (editable by the auditor role ONLY, per "letting an account edit only certain text records"), site coordinates/orientation, quorum parameters (N, T seconds, PPV threshold) on the building name, Arkiv query pointer. Sensor key may edit only its own `status` record.
- Arkiv: high-churn, queryable, expiring facts: per-phone signed readings and confirmed events (site, ppv, freq, quorum_size, bearing, ts), owner = sensor key, expiry = complaint window.
- Glue that makes ENS central: the confirmation function (client-side, recomputable by anyone) counts a reading only if its signer resolves via ENS to an unexpired, unrevoked sensor subname of that building, and uses the quorum parameters from the building's ENS records. Auditor changing calibration or the owner revoking a sensor visibly changes what counts. Drop "contractor read-only" from the pitch; instead state the contractor has no write role anywhere.
- Optional wow: wildcard resolution of `<eventid>.bldg.tremor.eth` returns the PPV record from Arkiv (needs a CCIP-read gateway = a server; conflicts with CROPS C unless gateway is replaceable/self-hostable; keep optional and disclose).
- Privacy: sensor keys are ephemeral per-device; subnames named by flat label only if residents consent; avoid linking resident wallets to flats (CROPS P).
World ID Agent Pass vs EF CROPS as third pick: CROPS is stronger on thesis fit and does not add a backend; World is stronger on payout ($5k pool) but weaker on product necessity and unverified docs. Choose CROPS unless World docs check out and the team wants the mocked-proof demo.

**Required files / README sections S-B**
- Arkiv: /arkiv/schema.md, friction.md, reach.md, why-arkiv.md, how-you-use-arkiv.md; README wallet address(es) + one runnable query; open-source license; AI-use statement; no reliance on SDK without reads.
- ENSv2: live demo link, open source, names/subnames created on Sepolia (list addresses/txs), no hard-coded values.
- CROPS: README section titled CROPS (C,O,P,S, 1-2 lines each, include testnet-reset and phone-IP trade-offs), FOSS license, <=3 min video with kill-the-backend moment, no third-party trackers.
- (If World instead) short debrief (time to first success, friction, missing docs, top improvement), denied-path demo, backend validation.

### CANDIDATE S-A LIFEBOAT

Tracks: 1. EF Alt Mempool ($2.5k/$1.5k/$1k). 2. Arkiv Mirror ($3k/$1k) or Arkiv Build ($3k/$1k). 3. EF CROPS (alt choice, same EF slot). 4. World Agent Pass (maybe). Not plausible: ENS (no honest dependence), Whitechain (no USDT payment product: FAIL), 0G (FAIL), Anon-RPC (FAIL, not an RPC-read app).

**1. EF Alt Mempool**
- "Show real alt mempool usage: link to admitted tx on devnet explorer, or code that submits one": PASS-able, devnet is public (RPC https://altmempool.forshtat.com, sidecar /rpc, chain 1337, eth_sendFrameTransaction) per docs [4]; note NO faucet and a shared genesis key. Explorer link available at explorer.altmempool.wtf.
- "must be able to explain the design, the code and the trade-offs": depends on team.
- Judging: creativity PASS (adversarial twist), usefulness PASS, practicality AT RISK (docs mention no EIP-7702 or ERC20 paymaster support; forum risk "7702-delegated EOAs break frame-transaction signature checks"), how well it works AT RISK (thin tooling, Draft EIP), relation to the alt mempool PASS (area (b) names "ERC20 paymasters, daily quota paymasters"; area (c) "DoS vectors and vulnerabilities, new rules").
- Fit is the strongest of any pick in this document: the rescue and the "sweepers can use the same paymaster" twist map onto areas (b) and (c) explicitly.
- COSMETIC: none if the demo shows a real admitted frame tx that atomically revokes approvals and moves assets with a paymaster paying gas, versus a bot that beats a naive ETH-top-up rescue.

**2a. Arkiv Mirror (registry of sweeper delegates / compromised-wallet labels)**
- "Pick public data Ethereum apps rely on... address labels, wallet ratings" PASS on category. Not Sourcify: PASS. License allows republishing: AT RISK (Aegis7702 and rescue repos' licences unchecked; deriving labels yourself from chain scans avoids it). Import script re-runnable: PASS-able if scanner reads 0xef0100 delegation designators. Feature reads from Arkiv: PASS if the rescue UI/paymaster policy queries it.
- Reach 25%: "How many people or projects already use or depend on this data?" AT RISK: nobody depends on a new sweeper registry today. Weakest criterion.
- Data quality 25% (up to date, filterable): PASS-able with a scanner cron and TTL (expiry = "not re-seen in N days") which is a legitimate use of expiry.
- Why Arkiv 25%: "what can people do with your copy that they can't with the original" AT RISK: there is no original source to compare; honest answer: queryable by delegate/owner/last_seen without our API.

**2b. Arkiv Build**: the registry plus rescue-case entities. Qualifies on "reads its data" only if rescue flow/paymaster consults it. how-you-use-arkiv: plausible (filters: delegate address, first_seen, tvl_est; owner = scanner wallet; expiry = freshness). But "Arkiv used only as a log that nothing reads" is a live danger: a write-only list of sweepers.
Mirror vs Build: Mirror is more honest for a registry of labels (listed idea "address labels"), and has a data-quality criterion we can score on; Build needs an app whose users see Arkiv-backed features (a rescue wizard that warns "this delegate is a known sweeper" is that). Prefer Mirror if the registry is the dataset, Build if the wizard is the product. Either way Arkiv is an add-on to S-A: remove it and LIFEBOAT still rescues. DECORATIVE for the headline; legitimate only as a secondary feature.

**3. Third pick**
- World Agent Pass: only honest framing is "daily quota paymaster": the sponsor paymaster signs gas sponsorship only for a verified unique human (once per day), keeping bots/sweepers from draining it; victim verifies from a different device/key. AT RISK/MED: mocked proofs; the attacker is also "a human" with a fake ID; ERC20-paymaster path needs no human gate; adds scope to a technically risky build. I judge it NOT honest enough unless the paymaster is genuinely sponsor-funded.
- No other third pick is honest. Recommend 2 picks.
**Best stack S-A:** EF Alt Mempool + Arkiv (Mirror preferred).
EV (JUDGMENT, conditional on an admitted frame tx and working sweeper-race demo): Alt mempool P(1st)=0.30,P(2nd)=0.20,P(3rd)=0.15 -> 750+300+150 = $1,200; Arkiv Mirror P(1st)=0.08,P(2nd)=0.10 -> 240+100 = $340. Total ~$1,540 conditional; multiply the EF part by the feasibility probability owned by another angle (EIP-8141 Draft, no 7702/ERC20 paymaster mention in devnet docs; my guess 0.5-0.6 -> ~$950 unconditional).
Intervention: remove Arkiv -> works (decorative for the rescue). Remove alt mempool -> product does not exist (frame tx is the rescue). Remove paymaster (user pays ETH) -> the whole premise (no ETH touches compromised address) breaks: load-bearing.
Files: EF Alt Mempool: devnet explorer tx link or submitting code, README design + trade-offs. Arkiv Mirror: schema.md, friction.md, reach.md, why-arkiv.md, data-quality.md, license link, re-runnable import script, writer wallet + one query.

### CANDIDATE E1 ReadLeak / LeakMeter

Tracks: 1. EF Anon-RPC ($2.5k/$1.5k/$1k). 2. EF CROPS (same EF slot; tool "that shows what an app leaks" is a verbatim CROPS idea). 3. Arkiv Mirror ($3k/$1k). 4. Arkiv Build (weaker). 5. ENSv2 (cosmetic). Not plausible: Whitechain, 0G (an LLM clustering narrative would be "an AI call that could be removed"), World.

**1. EF Anon-RPC**
- "Your app routes its RPC reads through Anon-RPC by default": AT RISK. E1's baseline arm deliberately goes through a normal RPC. Fix: default mode = Anon-RPC; baseline is an explicit comparison toggle; or classify E1 as "network health checker / playground: run anon-rpc against multiple networks and measure/compare", a verbatim listed idea, which also lets you argue "worker or harness: a simple demo app is enough".
- Judging "how much of the app's traffic goes through Anon-RPC": state intentional exclusion (baseline), which the track says "can be a good thing, just let us know".
- Works end to end / UX / "could it ship": PASS-able; "technical depth" AT RISK (harness is 0.4.0 pre-1.0; no latency data).
- Anon-RPC networks "live on mainnet today": measurements are mainnet-only. LOW.
- COSMETIC: if the "what each provider could infer" panel is canned text rather than computed from the recorded request log: HIGH credibility risk with judges; must be computed by a real linkage heuristic over the replayed corpus.
**2. EF CROPS (alternative within EF slot)**: PASS on idea; lead property P. Needs kill-the-backend/"show server logs with nothing identifying" moment: the tool is static client + no server; an analysis server would fail C and P. "Structural beats cosmetic": a leak meter is a diagnostic, not a property of itself; AT RISK that judges see it as a report generator, not an app whose reason to exist is a CROPS property. Both submitted, EF judges place in one: take both submissions (costs nothing, still one EF).
**3. Arkiv Mirror (licensed chain/RPC registry + measured leak scores)**
- Category listed verbatim ("chain and RPC registries"): PASS. License: AT RISK until checked (ethereum-lists/chains is, to my recollection, CC0: UNVERIFIED, must be linked in README). Not Sourcify: PASS. Re-runnable import: PASS. Reads from Arkiv: PASS if LeakMeter's endpoint picker queries Arkiv.
- Reach: PASS-able (chain registries are widely used by wallets) but crowded: the idea is on the sponsor's own list, so expect duplicates; differentiation = per-endpoint measured columns (leak score, anon-rpc compat, last_probed) with expiry as freshness TTL.
- Data quality: PASS-able (cron re-probe + TTL expiry).
- COSMETIC: if Arkiv holds a plain copy identical to the JSON source and LeakMeter does not need it: "why Arkiv" answer weak. The enrichment columns are the honest reason.
**4. ENSv2**: cosmetic (ENS lookups are just one corpus item); do not pick.
**Best stack E1:** EF (Anon-RPC, also submit CROPS) + Arkiv Mirror. No honest third pick (0G, World, Whitechain, ENS all decorative).
EV (JUDGMENT): Anon-RPC P(1st)=0.15,P(2nd)=0.15,P(3rd)=0.15 -> 375+225+150 = $750 (niche track, listed idea, but only our best-effort mock-free analysis); Arkiv Mirror P(1st)=0.10,P(2nd)=0.10 -> 300+100 = $400. Total ~$1,150. Highest qualification certainty of the three, lowest ceiling.
Intervention: remove Anon-RPC -> product meaningless (it is the comparison). Remove Arkiv -> works with static JSON (decorative to the tool; justified only as a published dataset). Remove CROPS -> same product, no change in code; CROPS is a README/video framing here.
Files: Anon-RPC: demo app, working end-to-end, note on excluded traffic. CROPS: README CROPS section, kill-backend/log moment. Arkiv Mirror: schema.md, friction.md, reach.md, why-arkiv.md, data-quality.md, licence link, import script, wallet + one query.

## FINDINGS (severity-tagged)
- F1 CRITICAL (S-B): ENSv2 as briefed is cosmetic. Track text: "ENSv2 features should be central to the product, not a cosmetic add-on." The "contractor read-only" role is not an EAC capability (EAC page: roles govern what accounts are "allowed to do"; data is public) and per-resident write roles duplicate Arkiv owner-write. Fix: make the quorum function read ENS subname validity/expiry/revocation and calibration/quorum records. (Evidence: ENS verbatim + EAC docs [5].)
- F2 HIGH (S-B): CROPS Privacy contradicted by public Arkiv $owner. If resident wallets own entities, "who reported stays private" is false. Use ephemeral per-sensor keys. CROPS P line must also admit the RPC sees phone IP.
- F3 HIGH (S-B): World Agent Pass requires "Validate identity results in a secure backend", which conflicts with CROPS kill-the-backend (disclose or choose one); and "Agent Pass" product not located (only AgentKit beta). Intervention shows World is decorative for the core claim (quorum already limits one faked phone) and proofs are mocked.
- F4 HIGH (S-A): Arkiv is decorative to the rescue; Mirror "Reach" has no existing users and "Why Arkiv" has no original source. "Arkiv used only as a log that nothing reads" applies if the registry is write-only. Keep at 2 picks.
- F5 MED (S-A): devnet docs [4] list no 7702 or ERC20-paymaster support; no faucet; one shared genesis key. EF Alt Mempool fit is the best in this document (areas (b),(c) named) but qualification needs a real admitted tx. Corrects S2 note that no public RPC existed.
- F6 MED (E1): Anon-RPC qualification "routes its RPC reads through Anon-RPC by default" collides with a baseline-vs-anon design; frame as comparison playground and state excluded traffic. Leak inference must be computed, not canned.
- F7 MED (S-B/E1): Arkiv MAX_LIFETIME ~182.5 days, string values 128 B; expiry = complaint window needs extension story; Arkiv is a testnet (reset risk) which weakens "censorship-resistant evidence"; state in CROPS C.
- F8 MED (E1): Arkiv Mirror "chain and RPC registries" is an idea on the sponsor's own list: crowded; differentiate via measured columns; licence unverified.
- F9 LOW: EF cap is one prize; submitting Anon-RPC+CROPS (E1) or CROPS+others is free but only one can place; ETHGlobal picks cap 3, Arkiv counts one.

## CLEAR (checked, found no problem)
- Whitechain and 0G: no candidate has an honest fit; checked verbatim "Won't place"/"Not wanted" lists, all FAIL, so none is proposed. Nothing hidden there.
- Pick-count rule: all three stacks <=3 picks, <=1 EF, one Arkiv track each. CLEAR.
- From-scratch eligibility: all proposed tracks are open to non-Continuity teams; continuity-only prizes (World $2.5k Agent Pass, ENS integration, Arkiv existing) excluded. CLEAR.
- Sepolia is acceptable for ENSv2 from-scratch track (verbatim). CLEAR.

## What this lens cannot see
Real competition density per track; whether the Agent Pass docs (auth.world.org/docs not fetched) match AgentKit; whether Arkiv numeric attributes/queries support PPV range filters at the SDK 1.0.1 level; whether frame txs from a compromised EOA/7702 account are valid (technical angle); the finalist rubric weight of sponsor prizes; judge taste. All probabilities are judgment.

## Searches run / sources fetched / tools used
- Local reads (Bash cat/sed/grep): converge-brief.md, sources/sponsor-tracks-verbatim.md (EF, ENS, Arkiv, World, Whitechain, 0G sections + Resolved questions), sources/sponsor-docs-notes.md.
- WebFetch: https://docs.altmempool.wtf/guides/devnet/ (ok), https://docs.ens.domains/ensv2/enhanced-access-control/ (ok, summary only).
- Not fetched: auth.world.org/docs, docs.arkiv.network query docs, ethereum.github.io/anon-rpc (S2 already covered). No ethglobal.com visit. No agents spawned. No blocked paths. No other file edited.
