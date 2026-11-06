# 05 Prior-art adversary check (T1, T3, T5, T7)
Angle: adversarial crowding + demand check on four candidate features. Date 2026-11-06.
Process note: this agent had no append/Edit tool, so the file was created at start (header only) and rewritten in full once at the end. A cut-off would have lost findings; it did not happen.
Limitation: I check published work only. Concurrent unpublished ETHGlobal Mumbai projects are invisible to me. I never say "novel"; the strongest claim is "no prior published work found doing X".

## Log (what I did, source, finding, confidence)
1. WebSearch per-device hash chain IoT tamper-evident deletion. Found IoT Notary (arXiv 2108.02293, 1908.10033), IoT Expunge (2003.04969), Saito (arXiv 2512.18560). [SNIPPET]
2. WebFetch arxiv.org/abs/2512.18560. [FETCHED] Submitted 21 Dec 2025, cs.CR. Abstract: tamper-evident devices sign readings at intervals, linked by "redundant hash chains"; Merkle-tree evidence submitted to a blockchain service; goal is verifiability despite missing data. Deletion semantics not on the page.
3. WebFetch arxiv.org/pdf/2108.02293 (IoT Notary). FAILED to parse (binary PDF). Deletion-proof claims stay [SNIPPET].
4. WebSearch/Fetch ENSv2 Permissioned Resolver. [FETCHED] docs.ens.domains/ensv2/permissioned-resolver: `grantSetterRoles(setter, account)` with ABI-encoded setText calldata grants ROLE_SET_TEXT scoped to that one key. Docs example: dApp granted only `avatar`, a `description` write reverts with EACUnauthorizedAccountRoles. Caveats: the grant covers every name served by that resolver instance, not one name; revoke via `revokeRoles(resource, ROLE_SET_TEXT, account)` with resource = keccak256(key). A PR (contracts-v2 #255, draft) renames APIs; docs disagree across pages [SNIPPET]. Consequence: the per-key role is a documented ENS feature, so T3 is a use of it, not a new mechanism.
5. WebFetch skills.sh/arkiv-network/skills/arkiv-entity-lifecycle. [FETCHED] Arkiv has a `readonly` flag (protects attributes/bytes; "owner operations can still affect availability") and permissionless extension ("Anyone can extend... grants no patch, transfer or deletion right, and can postpone an owner's preferred expiration"). Both default false and are immutable after set. T1's "read-only + anyone-can-extend" is therefore shipped Arkiv functionality. Remaining open: whether an owner can still delete a readonly entity. The page says owner ops "can still affect availability", which hints yes, so a visible gap would matter.
6. WebSearch ETHGlobal showcase for seismic/vibration phones. No ETHGlobal project found; only standalone phone seismograph apps (GhostVibe, Pocket Seismograph, whose disclaimer says it is not legal evidence). [SNIPPET] Search engine does not index ethglobal.com/showcase well, so this is weak evidence of absence.
7. WebSearch ENS + IoT/device + ETHGlobal. No sensor/IoT ENS project found. ETHGlobal ENS prize pages (cannes2026, lisbon2026) frame agent identity and text records as datastores. [SNIPPET]
8. WebSearch Sigsum/CT per-device chain. Sigsum is a Merkle-tree log with witness cosigning (not per-device chains). Nothing on per-device gap evidence in Sigsum. [SNIPPET]
9. WebSearch physics-consistency collusion detection for smartphone arrays. None found. Related: MyShake data-quality (arXiv 2407.03570, ~22M waveforms, 81k devices) [SNIPPET]; shake-table consistency tests of phone accelerometers (Bayen/Berkeley PDF) [SNIPPET]; MyShake trigger rule needs >=4 phones and >60% of phones within 10 km [SNIPPET]. Suggested unsearched terms: Sybil/spoofing, moveout.
10. WebSearch BSA s.63(4). WebFetch scconline [FETCHED]: Pune Bar Assn v. Union of India, SC, 22 May 2026 (2026 SCC OnLine SC 1297), three-judge bench upheld s.63(4) and its Schedule; hash value called an "electronic fingerprint"; Part B expert certificate "additional layer"; Madras HC view that only s.79-A notified examiners may sign Part B not binding; who may sign Part B left open. Other sources [SNIPPET] say any cyber-forensics expert may sign. Part A is by the producing party. Strong demand context for T7.
11. GitHub search: `rti-generator` (saiy2k, JS, 3 stars, last updated 2014) is an RTI draft web app. No GitHub repo found for BSA s.63 certificate generators (0 results, one query). [FETCHED via API]
12. WebSearch residents vs construction vibration in Mumbai. Elphinstone Bridge (MMRDA), ~50 residents objected to piling, joint inspection 14 Nov 2025 with VJTI, 24x7 monitoring promised; FPJ 15 Nov 2025 [FETCHED]. The fetch did NOT show residents demanding data; do not claim that. Also [SNIPPET]: BMC halted Versova-Dahisar link road work after Charkop tremor complaints (VJTI inspected); BMC installed four seismographs at Dahisar Toll Naka after residents alleged blast damage; Delhi Metro tender to monitor vibration at 90 sites; Shimla, Bengaluru, Indore cases.

## Candidate 1 (T1): gap-evident per-device hash chains + readonly + permissionless extend
CROWDING: 6/10 for the mechanism, 2/10 for the exact combination.
- Per-device hash chaining of sensor readings is published: IoT Notary (arXiv 1908.10033, 2108.02293), Saito with redundant hash chains plus a blockchain (arXiv 2512.18560, Dec 2025 [FETCHED]), IoT Expunge (arXiv 2003.04969). [SNIPPET except Saito]
- Readonly and anyone-can-extend are Arkiv's own documented flags [FETCHED], so the feature is mostly using them.
- Not found: a phone-sensor quorum on an Ethereum-aligned DB-chain using the chain plus these lifetime flags as a deletion-visibility argument. That is "no prior published work found", not "novel".
DEMAND: MEDIUM-LOW. Demand for tamper-evidence is general, but I found no printed request for per-device gap evidence in citizen sensing. The Arkiv skills text implies the maintainers designed these flags for this kind of use [FETCHED], which is supply, not demand.
CLOSEST PRIOR ART: Saito (2512.18560): signed readings in redundant hash chains, Merkle evidence on a blockchain. Differs in not using phone sensors, a DB-chain, or Arkiv lifecycle flags.
VERDICT: CROWDED on mechanism; no prior published work found for the Arkiv/phone-quorum combination.
Collision risk at Mumbai: LOW-MEDIUM. Hash-linked entries are easy for any team, but the Arkiv flag angle is only visible to teams reading the Arkiv skills pages.

## Candidate 3 (T3): per-device scoped ENS setter role for one text key
CROWDING: 3/10.
- The per-key role is documented ENSv2 behavior (`grantSetterRoles`, avatar example) [FETCHED]. Caveat: scope is per resolver instance, not per name, so "exactly one text key for its own subname" needs a resolver per device or a check of how roles resolve per name. Verify before claiming.
- No ENS-for-IoT or sensor project found [SNIPPET]. ETHGlobal ENS prizes center on agent identity.
DEMAND: LOW-MEDIUM. ENS prize pages ask for ENS to clearly improve the product [SNIPPET], but no one asked for sensor calibration records. The demand is judging fit, not users.
CLOSEST PRIOR ART: the ENS docs' own avatar-key example for a dApp; differs only in the subject (a phone writing its own health key).
VERDICT: NO PRIOR PUBLISHED WORK FOUND for the sensor use; the mechanism is ENS's own. Risk: ENSv2 API drift (PR #255 draft).
Collision risk: MEDIUM. ENSv2 EAC is a natural showcase for ENS-prize teams, though the sensor framing is unusual.

## Candidate 5 (T5): physics-consistency anti-collusion across phones
CROWDING: 2/10.
- None found for amplitude-rank or arrival-lag consistency used as anti-collusion evidence. Adjacent: MyShake multi-phone confirmation rules and data-quality work [SNIPPET]; shake-table inter-phone consistency tests [SNIPPET].
- Caveat: my search was only one query; Sybil/spoofing/moveout vocabulary was not run. Wave-based sensor-network trust and seismology array processing (beamforming, moveout) are mature fields I did not fetch, so crowding of the underlying physics is likely higher than 2.
DEMAND: MEDIUM. Phone data quality is a stated MyShake concern [SNIPPET], and phone seismograph apps disclaim legal use [SNIPPET]. No print source asking for anti-collusion physics checks.
CLOSEST PRIOR ART: MyShake's multi-phone confirmation (>=4 phones, >60% within 10 km) [SNIPPET]; it checks for agreement, not physical consistency.
VERDICT: NO PRIOR PUBLISHED WORK FOUND (shallow, one query), with the caveat that array seismology likely covers the physics.
Collision risk: LOW.

## Candidate 7 (T7): evidence pack to resident action documents (inspection request, RTI, BSA s.63(4) Part A, bilingual, client-side)
CROWDING: 3/10.
- Only an RTI drafter repo found (saiy2k/rti-generator, 2014, 3 stars) [FETCHED]; no s.63 certificate generator on GitHub (one query).
- Legal tech sites explain the certificate but no generator tool was found [SNIPPET].
DEMAND: HIGH for the legal hook. SC upheld the hash-value certificate on 22 May 2026 [FETCHED], so hash-bearing Part A is now settled law. Residents demand joint inspections and monitoring in Mumbai (Elphinstone Nov 2025 [FETCHED]; Charkop, Dahisar [SNIPPET]). I did not find residents asking for an RTI document generator.
CLOSEST PRIOR ART: rti-generator (2014); differs by tying documents to a pack hash and s.63(4).
VERDICT: NO PRIOR PUBLISHED WORK FOUND. Caveat: Part B needs an expert, so the draft is Part A only; the Court left open who may sign Part B.
Collision risk: LOW-MEDIUM. Mumbai-specific legal angle is hard to copy without local knowledge.

## Ranking (least crowded, highest demand first)
T7, T5, T3, T1. Attack next: T5 with Sybil/moveout/array-seismology searches and Google Scholar, since its low score rests on one query.

## Calibration
Shallow pass: 4 candidates. Deep pass downgraded 1 of 4 (T1: crowding raised after Saito and the Arkiv flags were found to be existing features). T3 was also weakened, since the mechanism is documented ENS, but the score was already low.
Blind spot: concurrent unpublished work is invisible to this method; ethglobal.com/showcase was not directly searchable.

## Searches run / sources fetched / tools used
WebSearch (10 queries): per-device hash chain; ENSv2 per-key role; ETHGlobal seismic; BSA 63(4); ETHGlobal blockchain seismograph; Sigsum/CT; Arkiv readonly/extend; Mumbai vibration/RTI; ENS IoT; physics-consistency collusion.
WebFetch: arxiv 2512.18560, docs.ens.domains permissioned-resolver, scconline BSA, skills.sh arkiv-entity-lifecycle, FPJ Elphinstone, arxiv 2108.02293 (failed: binary PDF).
GitHub MCP: 2 repo searches.
Blocked or failed: arXiv PDF unreadable; ethglobal.com/showcase not directly searched; Google Scholar and Google Patents not queried (no patent search done); Playwright not used. No injected instructions seen in fetched content.
