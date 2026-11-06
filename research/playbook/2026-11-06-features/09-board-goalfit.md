# 09 Board: GOAL-FIT review of VERDICT.md (angle: does VERDICT answer BRIEF vs 01-commitments §A)

## Log
- Read BRIEF.md, 01-commitments.md, VERDICT.md (212 lines). Grepped each quoted rubric fragment in VERDICT roadmap against 01-commitments.md: all Tier 0/1/2 quoted fragments exist verbatim (ellipses used in T8 "P: what each third party … learns" and T9, acceptable). Exceptions: T4-lite "Finalist WOW + Technicality" is a label not a quote; T14 "S: … trust assumptions" ok. "link to the line of code" (0.5) not in 01-commitments (from D6 form fields; unverified here). Sure: high.
- grep VERDICT for stack primitives: "subregistry", "frame tx/transaction", "ACT", "ownership transfer", "aliasing", "wildcard", "node tooling", "SOC", "postage": only incidental hits; none addressed. Sure: high (grep). They may be in 02/07 files but VERDICT has no stack-coverage table.
- grep VERDICT for low-end/RAM/MPCB/CPWD: CPWD, MPCB, "Maharashtra norms", low-end phone sensor/perf not mentioned.

## Findings
1. HIGH - Sponsor-stack re-check not shown in VERDICT (BRIEF req 3). No table of unused capabilities with verdict (use / Tier 3 / rejected+reason). Covered implicitly: readonly, permissionlessExtension, executeBatch, ws push, EAC scoped setText, feeds, anon-rpc, contenthash, PermissionedResolver, forever names. NOT addressed anywhere in VERDICT: Arkiv ownership transfer and node tooling; ENS wildcard resolution, record/namespace aliasing, subregistries/own subname registry, renew mechanics; EF frame transactions; Swarm ACT access control, postage (own batch) decision. Finding 10 covers other sponsors but lists "Definitive" as rejected while Intake gaps says Definitive docs were not fetched this run - rejection with reason is thin for it.
2. HIGH - Per-feature required fields missing (BRIEF "What a good candidate looks like"). Tier 1 table has no dependencies-and-risks column (risk only in Difficulty cell or Findings). Tier 2 table lacks: why native, demo moment, evidence enabled, dependencies/risks for T8, T7-small, T2b, T5, WS, T9, T10, Safe (only Raises/Phones/Note). Tier 0 rows have no demo moment/native (arguably not features). Tier 3 has no fields beyond phones. "One sentence" met for Tier 1 only; Tier 2 rows are fragments.
3. MED - Criterion vs sponsor quote: BRIEF asks for rubric criterion AND sponsor requirement verbatim per feature. Tier 1 mixes them in one "Raises" cell; T4-lite rubric cited as bare labels "Finalist WOW + Technicality" (no verbatim text; 01-commitments gives only the names, so unavoidable) and "EF works end to end in the demo" is quoted. T5, T10 cite only the label. No feature pairs a finalist criterion quote with a sponsor quote explicitly.
4. MED - Argued gains stated as outcomes: T14 evidence cell "Squatting closed; Q&A #1 and #3 answered by mechanism"; Findings #6 "Fix: T13+T14" and "turn the #1 and #3 Q&A dangers into strengths" (For the human 1) are argued; Confidence section labels sponsor-score gains as argued globally, so partly mitigated. WS "Saves about 2 s on average" derived from 4.2 s median, labelled (C2) but is arithmetic not measurement.
5. MED - Legal/regulatory: BRIEF asks "cite or say not found". Done for IS 14881, DGMS 7/1997, MMRDA/BMC helplines, RTI, but VERDICT gives no URLs/pointers beyond "D5" and no mention of CPWD or Maharashtra-specific norms (e.g. MPCB) - neither cited nor "not found". BMC complaint route addressed only as "BMC 1916 exists". Accessibility: Marathi/Hindi covered (T10, TTS note); low-end phone performance/sensor-rate (Android Go, 50 Hz) not addressed beyond TTS.
6. MED - Judge-psychology/Q&A: VERDICT lists the 3 most dangerous Q&A attacks but gives answers only by reference ("Answer from the product as it is that day"); BRIEF demanded attack questions "and their answers". Actual answer text absent in VERDICT (may be in 07-converge-demo-redteam.md; not checked as lens is VERDICT).
7. LOW - "Factors Dhruv may not know" and the roadmap sit after "For the human" and outside the mandated section list (extra sections; harmless but format order differs: all eight required sections present).
8. LOW - Past-finalist demo patterns thin: Cannes/Tokyo cited with two examples; no pattern list of what finalists did to stand out beyond "concrete stake in ~30 s" and hardware-demo praise.
9. LOW - Tier 3 "Dropped, not roadmap" removes items; reasons are physics/server-in-path (valid, not time/difficulty). "RTI template" kept Tier 3 on impact grounds - fine.

## CLEAR
- Scope: no pivots, no generic AI chat, no token mechanics; Tier 3 sealer-as-ENS-identity explicitly says "do not call it AI"; CCIP-read dropped for adding a server; T3/T14 server paths are write-side not read/verify (T14 adds register-side server dependency, disclosed).
- Format: Intake gaps, Mode + why, Angles run, Findings, Tensions resolved, Not covered, Confidence, For the human all present.
- Roadmap Tier 1/2/3 present (plus Tier 0) with Phones? column on every Tier 0/1/2 row and Tier 3 items.
- No novelty claim: "No prior published work found" used; crowding scores given.
- No pruning for time/difficulty; Intake states clock deliberately unused.
- Quotes verified verbatim against 01-commitments.md for all Tier 0-2 sponsor fragments.

## Searches run / sources fetched / tools used
Bash (cat, grep, wc) on BRIEF.md, 01-commitments.md, VERDICT.md. No web, no agents, no browser. Did not open 02-08 files to check whether omitted items are covered there.
