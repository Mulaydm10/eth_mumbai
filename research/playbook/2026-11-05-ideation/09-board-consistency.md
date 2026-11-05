# 09 Board: CONSISTENCY (internal consistency only)
Angle: numbers, scores, rankings, sponsor amounts, pick counts, labels, required fields across VERDICT.md and prior stages.

## Log (all files read in full except sponsor-tracks-verbatim.md, grepped + targeted sections)
- Read VERDICT.md, 08-reconcile.md, 05-prior-art.md, 06-impact.md, 04-transform.md, 03-cross-pollination.md, 01-commitments.md; also grepped 07-converge-sponsor-fit.md, 07-converge-finalist-redteam.md, sources/sponsor-docs-notes.md, 00-intake, 06-impact-physical.md for cross-checks. Sure: high.

## Prize amounts vs sources/sponsor-tracks-verbatim.md (lines cited)
- Arkiv Build from scratch $3,000/$1,000 (L1146-1153). VERDICT $3k/$1k. MATCH. Arkiv Mirror $3k/$1k (L1100-1107). MATCH.
- ENSv2 $3k/$2k/$1k/$1k (L1914-1926). MATCH. CROPS $2k/$1k/$500 (L1751-1762). MATCH. Alt mempool $2.5k/$1.5k/$1k (L1699-1710). MATCH.
- World Agent Pass $2.5k/$1.5k/$1k (L158-167) and 0G Physical AI $2.5k/$1.5k/$1k (L448-457) match the Intake line. CLEAR.
- 12 sponsors (Intake) = 12 named on the prizes page (L8). CLEAR.
- Verbatim quotes in VERDICT (ENSv2 "central ... hard-coded", Arkiv "Not counted", alt-mempool areas (b)/(c) and qualification, CROPS "structural beats cosmetic", kill-backend video) all found in the source (L1932, L1184, L1714-1730, L1777, L1788). CLEAR.

## Stack rules
- S-B: Arkiv (1 pick, one Arkiv track prize) + ENS + EF CROPS = 3 picks, 1 EF prize. CLEAR. S-A: EF + Arkiv Mirror = 2 picks, 1 EF. CLEAR. E1: EF Anon-RPC + Arkiv Mirror = 2, 1 EF. CLEAR.

## Numbers/rankings cross-check
- EVs: S-B $1.9k (07 L76), S-A $1.5k cond. / ~$0.95k discounted (07 L123), E1 $1.15k (07 L145): all match VERDICT and 08 T7. Rank S-B > S-A > E1 consistent across 05/06/07-C4/08/VERDICT. Prior-art 1-in-4, 6 of 8 downgraded, crowding 4/10 demand 6/10, S-A 7-8 vs ~2: match 05. Sim numbers (-25%..+17%, ±5%, +30..60%) match 08 T5. Devnet chain 0x539 = 1337 (07 [4]) OK; Arkiv 0x76edaf = 7794095 OK. TDOA dropped consistently (04 carried it; 08 T5 and VERDICT drop it with reason). CLEAR.

## FINDINGS
1. [MED] #3 FALLBACK E1 lacks most required fields. VERDICT #3 gives crowding/originality, EV, impact verdict but NO one-sentence problem, NO cited evidence+cost, NO sponsor verbatim requirement or how-met, NO Level-3, WOW, measurable number, or phone-only needs. 05/06 list E1 as a "survivor ... as the CONTROL", so it is a surviving idea; 07 sponsor-fit (L119-145) holds the material. Quote: "### #3 FALLBACK ONLY: ReadLeak/LeakMeter (E1) - It qualifies most reliably for EF Anon-RPC...". Mitigant: labelled fallback only.
2. [MED] #2 LIFEBOAT sponsor stack lacks per-sponsor "verbatim requirement + how met". EF gets verbatim areas and qualification but the "how met" is only implicit (Level-3 text); Arkiv Mirror gets only "(sweeper-delegate data). C1 judges this decorative ... Optional." with no verbatim Mirror requirement and no how-met. 07 L125 lists Mirror's required files (schema/friction/reach/why-arkiv/data-quality, licence, re-runnable import script), none in VERDICT. Also Mirror is "mirror public data"; S-A's data is original (07 L30 marks Mirror FAIL for S-B-style original data), so Mirror qualification for S-A is unargued.
3. [LOW] S-B "cost" is unsized. Required "cited evidence + cost"; VERDICT: "Cost: not sized in ₹. The verdict was REAL, narrow, locally costly." Honest and consistent with 06 ("city-wide count and ₹ damage are unsized"), but the required field is not met numerically. Same for S-A aggregate (honestly flagged, only per-victim $170k and fee 5-10%/$1k min).
4. [LOW] "measured" vs "not yet measured". Level-3 bullet: "with a **measured** spoof-rejection rate"; headline bullet: "(measurable by the team, not yet measured)". The first reads as already done. 08 T5 says "become things the team can measure". Wording only.
5. [LOW] ENS network statement differs from earlier stage without a note. 03 L(Sponsor facts): "ENSv2 is live on mainnet (the brief says so)"; VERDICT: "ENSv2 Sepolia bytecode probed; mainnet v1 still serving per S2". S2 (sponsor-docs-notes L56) supports the VERDICT; 03 was superseded. VERDICT is right, it just does not say it overrides 03.
6. [LOW] "auditor-only text records" (VERDICT #1 ENS) vs 07 L21/L88: records are public, EAC does not restrict reads, "Drop 'contractor read-only' from the pitch". "Auditor-only" is only correct as write-permission; could be misread as read privacy. 04 still carries "read-only contractor" (superseded; VERDICT correctly omits).
7. [LOW] Rank vs EV tension not explained in VERDICT. VERDICT gives E1 EV $1.15k and S-A ~$0.95k discounted yet ranks S-A #2; the reason (rubric fit/impact/C4 ordering) is in 08 T7 but VERDICT's #3 text does not say why a higher-EV option is below. Not a contradiction.
8. [LOW] 04 S-A third sponsor "ENSv2 ... feature only" vs VERDICT "No honest third pick": consistent in substance (feature, not honest pick); no action.
No CRITICAL or HIGH findings. Prize amounts, pick counts, EF/Arkiv limits, EVs, rankings, and verdict labels are internally consistent. For S-B (#1) every required field is present: one-sentence problem, evidence (3 URLs), crowding, stack with verbatim + how met, Level-3, WOW, number, difficulty, phone-only needs.

## Searches run / sources fetched / tools used
Bash (cat, grep, sed) on local run-dir files only. No web fetches; nothing blocked or failed (one zsh "====08 not found" echo glitch, harmless; files re-read).
