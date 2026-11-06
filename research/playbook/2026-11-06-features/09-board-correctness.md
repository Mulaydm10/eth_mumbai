# 09 Board: CORRECTNESS / METHODOLOGY review of VERDICT.md
Angle: are factual claims true and supported by cited files/code. Read-only.

- [check] ens-register.ts read in full: no auth/sig/header check; creates site if missing, registers any address. CLEAR (high).
- [check] dashboard.ts L213-222: isLive typed (sensor,creator) and resolves against ens.resolved now; quorum.ts L18/L40 passes tMs. VERDICT claim true; cited L210-216 -> actual 213-216 (fine). CLEAR.
- [check] fresh clone: package.json build does `cp dist-single/dashboard.html public/...`; .gitignore ignores public/tremor-witness-viewer.html; `git ls-files apps/web/public` empty. CLEAR (caveat: not actually run on a clean clone; vite build might not create public/ either).
- [check] api dir: drip, ens-register, ens-revoke, time (+_committee helper) = 4 servers; README L17 says "/api/drip is the one server we run". CLEAR.
- [check] C3: 83ms sd n=7 (07-converge-physics L10), sd(ln)=0.19 (L11), EXP-0001 offset -3.38 (L68): CLEAR. 
- FINDING (MED): VERDICT F5 "30-94% ... drops to 11-37% at realistic noise": L25-34 sims: sig=0.2 gives .30-.94; sig=0.7 gives .11-.37. "Realistic" for sig=.7 is an assumption (only measured sig is 0.19 best case, sig 0.4 gives .18-.79). VERDICT also omits that threshold was calibrated on the model itself (optimistic) -- but says "a model, an upper bound" in Confidence. And 83 ms is truncated at +/-300 ms with offset fitted on the same data (L10) but VERDICT lists it under "Measured" without caveat.
- [check] 06 Petit: 25 Aug 2017, disposed Jul 2025 (L12, L32) CLEAR. 05 crowding: T1 6/2, T3 3, T5 2 (one query), T7 3 demand HIGH: CLEAR.
- [check] README L7 links `ens/`; `ls ens` -> no such dir. CLEAR (claim true). 07-converge-sponsor-fit L51: "3 of 8 met, 2 partial, 3 missing" CLEAR vs VERDICT "meets 3 of 8".
- FINDING (MED): legal. VERDICT "Supreme Court upheld the hash requirement on 22 May 2026" / "settled law" (05 L52). But 02-diverge-narrow-legal.md L9 (LiveLaw fetched): "court declined to issue notice, so no final determination", judgment PDF not fetched. 05 L16 says "three-judge bench upheld". Sources disagree on finality; VERDICT states "upheld" flatly (only caveated as news-sourced in Not covered). Suggest "dismissed a challenge to s.63(4) at the notice stage (per LiveLaw)".
- [check] IS 14881 = blasting guideline, 5 mm/s lower bound (02-legal L16, pdftotext of primary PDF) CLEAR; DGMS 7/1997 mining, confirmed only via secondary sources (L11,38 "medium-low") - VERDICT only says "covers mining": CLEAR.
- [check] dashboard.html L21 value="30" "Last min"; redteam L20,72 events 03:49-03:51 IST, verify 4 events 2.28 s. CLEAR; VERDICT correctly labels inferred.
- [check] C2: readonly patch rejected, owner delete OK (feasibility L9,L11,L55), PE ext by second key OK, WS median 4239 ms n=5 (L19). CLEAR. (n=5, single moment: VERDICT says "4.2 s median" without n; LOW.)
- [check] D6 form facts (02-diverge-judges L39-44,84): 2-4 min, 720p, no music, 50-150MB, >=20 chars + code link, 3-6 screenshots, 5 repos, staff quote at Mumbai workshop transcript L307. CLEAR.
- FINDING (MED): VERDICT "every Cannes/Tokyo 2026 finalist opened with a concrete stake in ~30 s". Evidence files cover only Takarabako, Enconomy (Tokyo, 2 of 8) and PaintGlobal, npmguard, DIVE (Cannes) -- ~5 finalists; 02-judges L49 generalises to "every". Should read "the finalist openings we reviewed (5)".
- FINDING (LOW): Tier-1 T2a "impact: J.N. Petit took ~8 years" rests on one case; 06 L32 itself notes liberty to claim later; fine as example but VERDICT item 8 'REAL & COSTLY' is from one fetched article; 06 labels it so. No change needed beyond "one case".
- [check] No idea called "novel": item 9 says 'Never "novel"'. CLEAR. Argued gains: Confidence section files sponsor-score gains under Argued; item "Saves about 2 s" is computed from uniform-poll model (feasibility L20), not measured end-to-end, but VERDICT lists WS under Tier2 without 'estimated': LOW.
- [check] Intake line "T3 verified by state-override simulation" / item 7 'scoped ENS setText grant works' vs 05 L32 caveat 'verify before claiming' (scope per resolver) -- VERDICT item 7 states the per-key-across-names scope, consistent. CLEAR.

## Searches run / sources fetched / tools used
Bash (cat/grep/sed/ls/git ls-files) over repo and stage files only. No web, no browser, no agents. Not independently verified: BSA/DGMS primary texts, FPJ/LiveLaw pages (relied on stage files), whether a truly clean clone fails (not run). indiacode etc. not accessed by me.
