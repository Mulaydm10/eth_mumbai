# 06 Impact validation (adversarial) for features T7, T2, T6

Angle: is the PROBLEM behind each feature worth solving (not buildability). Tags: FETCHED / SNIPPET / UNVERIFIED.
Tooling note: only Write/Read/Search/Fetch tools were available (no append/Edit/bash), so the file was written at start, then re-written once at the end with the log preserved. No other file edited. No Playwright used. No injected instructions seen in fetched pages (Asian Age page checked explicitly: none).

## Log (chronological)
1. File created (header).
2. WebSearch "Mumbai metro vibration residents complaint cracks RTI structural audit" -> SNIPPET: Mahim Laxmi Niwas/Meher Manzil (Metro 3) structural audit; Dahisar East residents (Madhuban CHS) -> BMC installed 4 seismographs after complaints; Elphinstone Bridge (MMRDA) halted 13 Nov 2025 after residents' concerns, resumed with accelerometers 24/7. No RTI filings surfaced.
3. WebSearch for "can't be that accurate" -> not found directly; led to Asian Age URL on 2nd search.
4. WebSearch Bombay HC metro damage -> J.N. Petit Institute case; Jaisinghani night-noise case; Mulund slab PIL (Mar 2026). SNIPPET.
5. FETCH FPJ Elphinstone residents' protest (Nov 2025): residents sought "a solution or at least clarity on safety measures"; NO demand for monitoring data/RTI in article. Confidence high (read). Weakens T7 stated-pain.
6. FETCH FPJ J.N. Petit order (11 Jul 2025, Sonak/Jain JJ): stay + expert committee after finial fell 25 Aug 2017; petition disposed July 2025 (~8 years); trustees alleged vibration instruments were NOT installed before drilling; MMRCL affidavit: vibration "within permissible limits"; MMRCL restores finial without admitting liability; liberty to seek compensation if damage proven. Article gives no measured readings. High confidence.
7. FETCH Asian Age 7 Oct 2017 "Vibrations less than 1/4th of permissible limit: MMRC": S.K. Gupta, director (projects) MMRC: "Vibrations gauged through mobile apps can't be that accurate." and "We are using machines that will measure the exact vibration levels." J.N. Petit alleged "the vibrations are four times more than the permissible limit." High confidence (read). NOTE: it is a dismissal of mobile apps by the contractor-side authority = T6 evidence cuts both ways.
8. WebSearch RTI + condition survey -> no RTI replies/refusals found. SNIPPET: MMRCL media note says contractors do Building Condition Surveys, trigger levels, monitoring; after Siddharth College complaint, BCS report "shared with the college authorities". Jica Line 3 EIA has baseline vibration monitoring at named buildings.
9. WebSearch s.65B/BSA s.63 -> SNIPPET only: Arjun Panditrao Khotkar (2020) 7 SCC 1 says certificate mandatory; BSA s.63 adds two-part certificate (party + expert, hash value); some commentators argue BSA s.61 relaxes. Bombay HC held CDR Excel without 65B(4) inadmissible. No construction-damage case where 65B mattered found.
10. WebSearch crowdsourced seismology calibration -> SNIPPET: arXiv 2407.03570 (22M waveforms, 81k phones): "accelerometer model and smartphone specifications" most critical for data quality; filtering low-quality data improves magnitude estimation. MyShake triggers only when stationary. Not opened.
11. WebSearch Mahim follow-up -> SNIPPETs: Girgaon/Kalbadevi Metro-3 evictees "8 years after eviction ... still await homes" (FPJ headline); TOI "140 Yr Old Chawls Claim For Damage By Metro Denied" (403 on fetch; HC noted disputed facts, MMRCL denied tunnelling caused the cracks - snippet).
12. FETCH MumbaiLive Mahim tilted buildings: MMRCL "closely monitoring"; attributes damage partly to ageing ("dilapidated from ageing"); article mentions NO pre-construction baseline; audit report "will be shared with residents"; evacuated 25 families. High confidence. Supports the evidentiary-gap story (cause is disputed; residents lack own data) - but stated pain is about causation, not drafting.

## Per-item findings

### 1. T7 evidence -> action (complaint/RTI/joint-inspection annex)
PROBLEM REALITY: REAL BUT MINOR as a *drafting/proof bottleneck*; the underlying causation-evidence gap is REAL.
- Stated: residents DO complain, protest and litigate (Elphinstone Nov 2025; Mahim; Dahisar -> BMC seismographs; J.N. Petit). Authorities respond with their own instruments (accelerometers, seismographs, audits).
- NOT found: any RTI filing/refusal on metro vibration or condition surveys (searched twice); any case where s.65B/s.63 certificate decided a construction-damage dispute; any resident saying drafting is the hurdle. Elphinstone article explicitly shows residents asking only for "clarity on safety measures".
- Real gap evidenced: J.N. Petit alleged no monitoring before drilling; MMRCL says "within limits" and blames ageing (Mahim) -> contested causation with no resident-held baseline. That supports *evidence existence*, not *annex-drafting* tooling.
- Today's alternative: media + society letters + MLAs/ministers + HC PIL; authority-installed monitors. Switching test: an annex template is a marginal improvement over a letter; the value is the independent time-stamped record, which is the core product, not T7.
- Pitch-usable: "J.N. Petit trustees said monitoring instruments weren't installed before drilling; MMRCL replied vibrations were 'within permissible limits' - nobody outside the contractor held a record." (FPJ 11 Jul 2025; Asian Age 7 Oct 2017.) Legal certificate point is plausible and well-grounded in law (Arjun Panditrao; BSA s.63) but unevidenced in this domain: label inferred.

### 2. T2 permanence beyond ~182 days
PROBLEM REALITY: REAL & COSTLY on the timeline fact; unsure anyone pays to keep it.
- J.N. Petit: incident 25 Aug 2017, disposed July 2025 (~8 years) [FETCHED FPJ]. Order leaves liberty to claim compensation later if damage is proved -> the evidence window is open-ended. Girgaon/Kalbadevi evictees still awaiting homes 8 years on [SNIPPET headline, not opened] (displacement, not vibration; shows how slow remedies are).
- Pitch quote: "The petition lasted ~8 years; a 182-day record would have expired ~7.5 years before disposal."
- Who keeps it alive: the society/trustees/NGO/journalist/lawyer; Swarm stamp renewals are cheap (inferred, not sized). Counter: courts decided on committee reports and affidavits, not on a decade-old raw log; durable value is the sealed *pack hash*, which is likely smaller than the 182-day issue. Caution: I did not verify the 182-day mechanic (not my remit; see 02-diverge-narrow-legal.md).

### 3. T6 relative calibration
PROBLEM REALITY: NICE-TO-HAVE for the trigger record; REAL as an *objection to anticipate*.
- Stated objection exists: MMRC director S.K. Gupta, Asian Age 7 Oct 2017: "Vibrations gauged through mobile apps can't be that accurate." [FETCHED]. But the objection is categorical (phones are not instruments), not "per-phone calibration is missing"; per-phone calibration will not answer it, whereas multi-phone corroboration + a calibrated reference vibration source (the spare-phone pulse demo) addresses it by different means.
- Science: arXiv 2407.03570 [SNIPPET, not opened]: device model/specs most critical to data quality over 81k phones -> device variability is the recognised caveat in crowdsourced seismology; but trigger/quorum design (MyShake) is the accepted workaround.
- Who reads: authority engineer (will dismiss phones anyway), court (will lean on committee/IIT experts, as J.N. Petit), journalist (cares about corroboration and plain-language). A mm/s uncertainty band mainly helps defence against a hostile engineer's cross-exam; low marginal value versus corroboration. No source found asking for per-phone calibration.

## Strongest case against
Residents' real bottleneck is not documenting, it is that authorities/contractors hold the only trusted baseline and courts defer to expert committees; none of T7/T2/T6 changes that. No RTI/65B-in-construction case was found, so T7's pain is inferred.

## Ranking (evidence strength)
1. T2 (hard timeline: ~8 yrs, FETCHED) 2. T7 (contested-causation gap is stated; drafting need is not) 3. T6 (objection stated, but calibration isn't the remedy). Put T2 in front of judges as one line; frame T7 as "evidence pack with s.63 certificate" only as a legal-readiness claim; drop or demote T6 to a one-sentence honesty note.

## Searches run / sources fetched / tools used
Searches (WebSearch, standard): 9 (metro vibration complaints; "can't be that accurate"; Bombay HC metro damage; Asian Age app; RTI condition survey; 65B/BSA 63; crowdsourced seismology calibration; Mahim follow-up; society RTI/structural audit).
Fetched OK: FPJ Elphinstone protest; FPJ J.N. Petit order; Asian Age 071017; MumbaiLive tilted buildings.
Blocked: magzter/TOI chawl-claim-denied (HTTP 403) -> snippet only. Not opened: arXiv 2407.03570, MMRCL media note, Jica EIA, BSA commentary. Not found: any RTI filing/refusal; any s.65B construction-damage case; independent source for the "182 days" claim (not checked). No bash/append tool, so file re-written once.
