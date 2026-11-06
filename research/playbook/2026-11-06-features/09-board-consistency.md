# 09 Board: CONSISTENCY angle
Lens: internal consistency of VERDICT.md vs stage files. Read-only.

[1] read VERDICT, 08, 04 fully; now grepping C4/C1/C3/C2
[2] findings so far: Q&A numbering mismatch (C4 #2=legal, #3=key, #4=delete vs VERDICT 3 list); T4-lite 'deleted reading' row vs C4 video-only; T14 live vs C4 existing join; 182-day unverified (06 L51, C4 L67) not carried; checked legal/form factors OK

## Mechanical check (grep of VERDICT numbers vs stage files)
Checked and MATCH: 83 ms n=7, sd(ln)=0.19, -3.38 s (C3 L9-11); 4.2 s ws median, ~2 s poll (C2 L20); 3 of 8 swarm (C1 L51); 2.3 s / 4/4 (C4 L79); 30-min window, 03:49-03:51 IST (C4 L20,72); crowding 6/10-2/10, 3/10, 2/10, 3/10 (05); 8 years / 25 Aug 2017 / July 2025 (06 L12,32); form facts 2-4 min, 720p, 50-150 MB, 3-6 shots, 5 repos, 20 chars (D6 L36-44); judges independent (D6 L43); Takarabako ~10 min (D6 L63); IS 14881 5 mm/s, DGMS 7/1997, SRCC 1800 22 8801, BMC 1916, DPDP not concluded, indiacode 403 (D5 L16,22,25,29); C4 timings 3:40, 1:50, 2:15 (C4 L25,54,55). Every T1-T12 in 04 is tiered or dropped with reason (T12 -> Tier 0, T9/T8/T10 -> T2, T11 -> T3, T6 -> T3, RTI part of T7 -> T3). R1-R13 tier placements all match.

## Findings
MED-1 Q&A list mis-numbered vs C4. VERDICT L195-198 "three most dangerous (C4): 1 Collusion 2 Who controls committee key 3 Can a reading be deleted". C4 L60-63: #1 collusion, #2 admissibility/legal, #3 committee key, #4 deletion. VERDICT then (L128, L154, L212) says "#1 and #3 Q&A" which is right only under C4 numbering; under VERDICT's own list #3 is deletion. Sure: high.
MED-2 T4-lite "deleted reading" row vs C4. VERDICT L158 lists six rows incl. "deleted reading" as "Live spine of the 4 minutes (C4 script)". C4 L41: "VIDEO-ONLY: T1 gap-evident chain ... great film, risky live"; C4 live script L31-36 has no deleted-reading beat (beats: stake, join, stomp, spoof, revoke, byte flip, kill). R1 (08 L15) says live stays on existing spine. Row cannot tick live. Sure: high.
MED-3 T14 labelled "Live (same 20 s join)" vs C4/R1. VERDICT L154 adds a live "no-invite register attempt shows refused". C4 L30 JOIN beat uses the existing /api/ens-register; C4 never mentions T14; script has 20 s slack (L37); 08 L15 says live 4 min stays on existing spine. Also "single-use" invite (L154) conflicts with C4's one big join QR scanned by 2-3 judges (C4 L30). T14 Phones? says "No" though it changes the live join path C4 flags as the venue-Wi-Fi/RPC risk. Sure: medium-high.
MED-4 Collusion answer stated as governance with no "not built yet" caveat. VERDICT L58 "The honest answer to collusion is governance (T13+T14)". 08 L28 (R4): "Today both halves of that answer are false." C4 L60 today's answer: "We do not claim collusion resistance". The Q&A section (L195-199) gives no collusion answer for today; says only "answer from the product as it is that day" (consistent in spirit, but the reader is never told the current answer). Sure: high.
MED-5 182-day expiry unverified but carried as verified. VERDICT T2a (L156) and finding 8 (L71) use "REAL & COSTLY"; 06 L51 "independent source for the '182 days' claim (not checked)"; C4 L26 "Do NOT add the 8 years vs 182 days line live (182-day mechanic unverified per 06)"; C4 L67 same. VERDICT "Not covered" (L107) lists only atBlock and Swarm retention, not the 182-day figure. Sure: high.
LOW-1 T2a omits gas caveat: 08 L40 (R7) "keep-alive needs tGLM from the extender; 'anyone' is true of rights, not gas". VERDICT L156 "any wallet can extend" no caveat.
LOW-2 Finding 5 range "30-94% ... only with low noise and steep decay" (VERDICT L57). C3 L29-30: 30% occurs at sig=0.2 with shallow decay p=0.5; C3 L65 states 60-94% for p=1.0, sig<=0.4 and 10-40% for p<=0.75 or sig>=0.4. Low-end 30% is not "steep decay". Also 11-37% matches sig=0.7 (L31).
LOW-3 R11 asked to "state the new dependency in the README C line" (08 L52); Tier 0.1 text (L142) does not list the T3 Sepolia-ETH dependency. Also T3 "Phones? No to build" is consistent with Sepolia need (L157, L130); not a contradiction.
LOW-4 Form line (VERDICT L192) omits the max-3-partners rule (D6 L39); tier items touch ENS, Arkiv, Swarm plus EF so 4 sponsor claims; VERDICT L83 says keep Arkiv(+Swarm), ENSv2, EF = 3 partners, ok, but the 3-cap is never stated. Sure: medium.
LOW-5 04 L24 T3 included site rule card as text records; no tier line carries it (dropped without reason). Minor.

## CLEAR
Tier placement vs R1-R13; T3/T6/T5/WS/T9/T7 tiers; T1 wording "edit-proof, deletion-evident"; all numeric repeats; legal and form "Factors" section vs D5/D6; Q&A "strike independent flats/attenuation, cite no statute" matches C4 L60,L61; T13/T14 consistently called not-yet-built in R4.

## Searches run / sources fetched / tools used
Bash only (cat, grep, sed) on VERDICT.md, 08, 04, 07-converge-{demo-redteam,sponsor-fit,physics,feasibility}, 02-diverge-judges, 02-diverge-narrow-legal, 05, 06. No failures, no web, no browser, no other file edited.
