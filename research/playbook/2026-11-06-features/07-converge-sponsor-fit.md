# 07 CONVERGE: SPONSOR-FIT angle
Lens: does each T1-T12 raise a sponsor/finalist score vs VERBATIM text; native vs cosmetic. Append-only log.

## Log of checks (append-only)
- Read 01-commitments §A, 04-transform T1-T12, README.md (53 lines), arkiv/swarm.md (25 lines). Sure: high. 03/05/06/02-* NOT read in full (time-boxed to the primary rubric+repo evidence; see "cannot see").
- INTERVENTION 1: ran `npx tsx scripts/pull.ts p2test 1440` from repo root. WORKS: "site=p2test sensors=3 triggers=4", wrote logs/arkiv-p2test-*.json (logs/ is gitignored). Caveats: prints "Rabdi: no access key ... public endpoint, heavily rate limited"; sensor writers printed truncated (0x4ab899d5) and are sim-1..3 "simulated by"; data is the 2026-11-05 simulate run, not a real-phone event. Sure: high.
- INTERVENTION 2: grep of apps/web/src + packages/*/src for hard-coded k/window/sensor lists. k/window come from ENS text records `tw.k`, `tw.window_ms` (ens.ts L113-118, dashboard.ts L127-134, L227-228); phone list from ENS registry (listSitePhones). Defaults (`k=3, windowMs=2000` in ensCreateSite L159; `max(2,min(3,phoneCount))` fallback dashboard L227) are fallbacks only. No hard-coded sensor lists found. Sure: medium-high (grep, not a full read of dashboard.ts).
- INTERVENTION 3: grep for readonly/permissionlessExtension/extendEntity/subscribe/executeBatch in packages/chain/src/arkiv.ts + apps/web/src: ZERO hits. grep Role/EAC in ens.ts: zero hits for setText-scoped grants (only committee setText L178-179; roles constants exist in ensv2-abi.ts L25-31). So T1/T2/T3 are net-new native use, not polish. Sure: high.
- `ls ens/` -> no such directory. `ls LICENSE` -> MIT, three team names. README L7 references `ens/` which does not exist; STATE.md L30 lists it as a todo.
- grep README/arkiv/submissions for "AI use|used AI|claude": only README L33 (a read-order line saying CLAUDE.md). No "how we used AI" statement. COMPETITION.md L69 requires documenting.

## 1. MATRIX (T1-T12). + raises, 0 none, - risks. All quotes verbatim from 01 §A.
Legend of columns: ARK = Arkiv 4x25%; SW = Swarm; ENS; EF; FIN = finalist 5.

| T | ARK | SW | ENS | EF | FIN |
|---|---|---|---|---|---|
| T1 readonly + prev chain + seal batch | + "who can edit each entity" (native: flags ARE the answer; today 0 flags used); + "what would your users lose" (no Postgres equivalent of creator-immutable+readonly) | 0 | 0 | + "depth of the lead property: structural (works without you)": deletion by owner is the last hole in README C | + Technicality, WOW (gap flag visible) |
| T2 keep-alive + countdown + Swarm feed + ENS tw.feed | + "when it expires fit what your app does"; + "Reach: will you keep building" (+ keep-alive is a post-Mumbai story) | + "The most useful integration wins" (feed = latest pack; needs stamp: see audit) | + weak: text record pointer; "central" arguable -> mostly cosmetic for ENS | + "could it ship after the hackathon" | + Practicality |
| T3 scoped setText grants per phone + revert demo | 0 | 0 | + STRONG: "Use Enhanced Access Control ... letting an account edit only certain text records on a name"; "not cosmetic" test passed because quorum already reads tw.k/window and phones from ENS | 0 (adds Sepolia gas dependency: - "works end to end") | + Technicality |
| T4 /judges scoreboard via Arkiv websocket | + "Does each Arkiv feature you use change something your users see?" (subscription = live push); caution: judges' page, not users' | 0 | 0 | + "works end to end in the demo" | + WOW, Usability(DX); cosmetic for sponsors unless rows cite entity keys (then evidence) |
| T5 physics-consistency panel | 0 | 0 | 0 | 0 | + Technicality, Originality; honest "insufficient to tell" protects Q&A. Not a sponsor lever |
| T6 known-source calibration | 0 | 0 | + only if cal record lives on phone's ENS key (via T3); else 0 | 0 | + Technicality; needs phones |
| T7 evidence-to-action annex | + "Who is it for, and would they use it?" (Reach) strongest single item | + pack hash/QR ties to Swarm ref | 0 | + "UX: would someone use it without knowing what CROPS means"; client-side = no third party | + Practicality, Usability |
| T8 /privacy ledger | 0 | 0 | 0 | + STRONG: README P "what each third party ... learns about the user"; video "show server logs with nothing identifying" | + Usability/Technicality |
| T9 verify-build vs ENS tw.build | 0 | 0 | + "ENSv2 features central" -> weak/cosmetic; just a text record | + matches EF idea "a tool that proves the shipped frontend ... matches the public repo"; O: "whether a user can build and run it from the repo alone" | + Technicality |
| T10 Marathi/Hindi/English | 0 | 0 | 0 | + "UX: would someone use it without knowing what CROPS means" | + Usability, Practicality (cosmetic to sponsors) |
| T11 encrypted annex on Swarm | 0 | + names encryption explicitly BUT adds the "Careful: an encrypted Swarm reference contains its key" hazard; risk > gain | 0 | - S line gets harder to defend | 0 |
| T12 materials/compliance | + friction/reach/why/how docs are 100% of Arkiv scoring (4 files x25%) | + closes 5 of 8 swarm.md items | + creates `ens/`, the missing "link to a live demo" anchor | + CROPS section accuracy | + Practicality (form). HIGHEST certainty per effort |

Cosmetic honestly: T4 (for sponsors), T10, T9-for-ENS, T2-for-ENS, T11. Native: T1, T3, T8, T7, T12.

## 2. COMPLIANCE AUDIT (state TODAY)
### Arkiv
| item | status | evidence |
|---|---|---|
| Writes to current testnet; a user-visible feature reads Arkiv | MEETS | pull.ts returned live data; dashboard reads Arkiv (how-you-use-arkiv.md L13) |
| README: wallet address(es) that wrote entities | MISSING in README | grep for 0x{40} in README.md: none. Only in arkiv/how-you-use-arkiv.md L26, and that is the FUNDER (gas only), not a writer. Phone writers are browser-generated and "printed when simulate runs" (L27) |
| README: one query we can run | PARTIAL | README L22-25 has `pull.ts demo 60` (site "demo", not labelled as the judge query; site p2test is in arkiv/how-you-use L19). pull.ts p2test 1440 works (above). Two different site names in two files |
| /arkiv/schema.md, friction.md | EXIST | arkiv/ has both (59, 64 lines) |
| Not counted: Arkiv only a log | MEETS | dashboard recomputes quorum from Arkiv |
| Schema vs "who can edit / when expires" | PARTIAL | schema.md L20-21 gives creator+expiry per entity; no edit rights beyond `$creator` immutability; zero use of readonly/extend flags (T1/T2) |
### Swarm bonus: arkiv/swarm.md vs 8 items
1 what on Swarm / Arkiv / field holding ref: MEETS (L3-10, `swarmRef`, `packHash`).
2 one entity key + Swarm ref with an openable link: MISSING (L22 shows truncated `bd1f901262d3…`, no entity key, no link).
3 postage batch ID + wallet that bought it + Bee node/service: MISSING/PARTIAL (L12 says "null postage stamp", public gateway, no Bee node; no batch ID/wallet named). Honest but does not satisfy "the postage stamp batch ID ... and the wallet that bought it (or who gave you the batch)".
4 files in repo that upload/read: MEETS (L12 swarm.ts, dashboard.ts).
5 steps to run one upload and one read: PARTIAL (L19-23 read/verify only; no upload step).
6 moment in demo video: MISSING.
7 what got in your way: MEETS by pointer (L25 -> friction.md S1-S2).
8 "Careful: encrypted reference contains its key": MISSING (not stated; N/A today since nothing is encrypted, but item is a required statement; one line fixes it).
Net: 3 of 8 met, 2 partial, 3 missing.
### ENS
- "Built on ENSv2 on Sepolia": MEETS (ensv2-abi.ts, ens.ts; dashboard L218 "Registry: ENSv2" with sepolia link).
- "central, not cosmetic": MEETS-ish: registry gates the phone list and quorum params (dashboard L127-134, L227-228). But NAMED prize features: EAC delegation to a non-committee account = not used; wildcard/aliasing/PermissionedResolver-per-subname: only committee setText (ens.ts L178-179). Gap = T3.
- "not just hard-coded values": MEETS (see Intervention 2).
- "link to a live demo": README L5 has it. MEETS.
- open source: LICENSE MIT, repo public per COMPETITION. MEETS (repo public-ness not verified by me).
- `ens/` write-up: MISSING (dir does not exist; README L7 links to it -> dead reference a judge will hit).
### EF CROPS
- README CROPS section: EXISTS, L9-18. C: states what is controlled? Defined as "what you control that the user depends on ... and what happens if it goes away": README C describes censorship resistance but does NOT name the dependencies it still has (Vercel domain, /api/drip, public Arkiv RPC with no access key, public Swarm gateway) nor what happens if each goes away; only the offline viewer is cited. Partial.
- O: MIT stated, "build and run it from the repo alone": README "Run it" exists. MEETS (the dashboard.html needing Vercel for HTTPS is stated at L22).
- P: "what each third party ... learns": README says no analytics/trackers but does NOT list RPC provider, Arkiv node, Swarm gateway, Vercel as learners of IP/times. PARTIAL (T8 closes this with measurement).
- S: keys + trust assumptions: MEETS, drip stated as a trade-off.
- Demo video, lead property incl. "switch off your backend": video not in repo scope I checked; cannot see.
- "No third-party trackers": grep for tracker/analytics/gtag/plausible in apps/web: zero matches (one command errored on glob but second form returned none). MEDIUM sure.
- "One EF prize per project": not an issue.
### Finalist/process
- LICENSE: present (MIT).
- "Say how you used AI": MISSING in README. COMPETITION.md L69 requires documentation; CLAUDE.md/worklog exist as artifacts but no README/submission statement. (HIGH below)
- public repo/commit history: not verified beyond git log (recent commits small).

## 4. FINDINGS
- HIGH F1: README lacks writer wallet addresses. Arkiv qualification text: "In your README: the wallet address(es) that wrote your entities". Evidence: grep 0x{40} README.md empty; how-you-use L26 lists only the funder. Fix: list p2test writers (pull prints truncated 0x4ab899d5 so full addresses need the JSON in logs/).
- HIGH F2: README references `ens/` which does not exist (README L7; STATE L30 todo). ENS judges read materials; it is the only place named prize features can be argued.
- HIGH F3: no "how we used AI" statement in README/submissions; COMPETITION L69 requires; "Projects relying entirely on AI may lose eligibility".
- HIGH F4: arkiv/swarm.md misses items 2, 3, 6, 8 and half of 5 (above). $500 bonus is scored from this file.
- MED F5: "one query we can run" is ambiguous in README (site `demo` vs `p2test`; query lives in a different file; run works but warns of rate limit with no access key; output has simulated writers only, no real-phone event). A judge running it sees `sim-1..3`.
- MED F6: README C does not state what happens when dependencies (Vercel domain, /api/drip, public RPC, Swarm gateway) go away; EF asks "what you control that the user depends on ... what happens if it goes away or refuses them".
- MED F7: Arkiv "who can edit each entity" answered only by `$creator` immutability; no use of readonly/extend; T1 is the native upgrade. Zero grep hits.
- MED F8: ENS named features (EAC delegation, per-subname resolver) unused by non-committee accounts; T3 is the only candidate that moves the ENS score; but it adds Sepolia gas to the phone path (conflicts with EF "works end to end" if drip fails).
- LOW F9: T11 adds the encrypted-ref hazard (swarm.md "Careful") for little score; drop.
- LOW F10: triggers expire 30 d (schema L21) while claim is "nobody can ... delete"; expiry is by design but T2 only extends if the flag allows; consistent story needed (1 sentence).

## 5. CLEAR
- pull.ts p2test works from repo root, read-only. Quorum k/window/phone list not hard-coded. LICENSE present. No tracker hits. Funder address is disclosed with its role. README Live link present. Claim discipline wording in README and swarm.md is careful.

## 6. CANNOT SEE
Demo video content; whether repo is public; actual Swarm link openability (did not fetch); whether sponsors weigh docs as I infer (only rubric text); feasibility, physics validity, build time; 02/03/05/06 not fully read, so crowding/impact notes unused; no live web check of Swarm gateway or ENS names.

## RANKING (sponsor+finalist gain; effort note only)
1. T12 compliance fixes (F1-F4; ~hours, doc-only). Moves all of Arkiv 25% items, Swarm items, ENS `ens/`, process gates.
2. T1 readonly/prev chain: "who can edit each entity" + "structural (works without you)". Medium effort.
3. T3 scoped setText grants: "Use Enhanced Access Control ... edit only certain text records". Medium-high effort, gas dependency risk.
4. T8 privacy ledger: README P / "server logs with nothing identifying". Low-medium.
5. T7 annex: Reach "Who is it for, and would they use it?". Medium; impact-validation pending.
6. T2 keep-alive + feed: "when it expires fit" + Swarm "most useful integration". Medium.
7. T4 scoreboard: "works end to end in the demo"; cosmetic for sponsors. Medium.
8. T9 verify-build: EF idea list match; cosmetic for ENS. Low.
9. T5 consistency panel: finalist Technicality only.
10. T6 calibration: needs phones; finalist only.
11. T10 languages: Usability only.
12. T11 encrypted annex: net negative.

## Searches run / sources fetched / tools used
Bash: cat/sed/grep on 01-commitments, 04-transform, README, arkiv/swarm.md, how-you-use-arkiv.md, schema.md, ens.ts, dashboard.ts, ensv2-abi.ts; `npx tsx scripts/pull.ts p2test 1440` (ok); ls ens (absent), LICENSE. No web fetches, no Playwright, no agents. First pull attempt used `timeout` (not on macOS), re-run without it. Nothing blocked.
