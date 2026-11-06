# 10 Sufficiency gate (orchestrator, 2026-11-06)

## Board results (09-board-*.md)
| Member | CRITICAL | HIGH | MED | LOW | Verdict |
|---|---|---|---|---|---|
| correctness | 0 | 0 | 3 (SC ruling wording; "every finalist"; collusion % + 83 ms caveats) | 2 | claims verified against code and files (14 checks) |
| consistency | 0 | 0 | 5 (Q&A numbering; T4-lite deleted-reading row live vs video; T14 live demo vs R1, single-use vs one QR; "governance answers collusion" needs "not built yet"; 182-day support) | 4 | numbers match across files |
| red-team | **1** (T13 keyed on phone-written `tMs` → a revoked phone can backdate) | 3 (no "void-since"; T13 effort + cached index; T14 = same hot key, bearer invite) + 1 missing Q&A ("the phone picks its own timestamp") | 4 | 0 | ENSv2 history is reconstructible (ens.ts L79–96 already folds the events) |
| goal-fit | 0 | 2 (no sponsor-capability table; missing per-feature BRIEF fields in Tiers 1–3) | 4 | 2 | scope, tiers, quotes, no novelty claims: clear |
| reproducibility | 0 | 1 (fresh-clone build fails; already a Tier-0 item, now independently reproduced, `mkdir -p` fix confirmed in a scratch clone) | 0 | 3 | verify-event 4/4 OK (2.99 s), C3 numbers reproduced, `npm test` 21/21 green |

## Orchestrator checks on the board's CRITICAL/HIGH items
- **Red-team F1 (CRITICAL) confirmed.** The phone writes `tMs` itself (quorum.ts `Trigger.tMs`; main.ts stamps it). Under T13 as drafted, a revoked phone could backdate. **Fix (design, applied to VERDICT):** membership is evaluated at the **Arkiv inclusion time** of the trigger (`$createdAt` block, which the chain sets, not the phone; `arkiv_query` can select `createdAt` per D2 `sources/D2-arkiv-docs.md` L21) AND the name must also have been live at the claimed `tMs`. Readings whose inclusion time is far after `tMs` (store-and-forward outbox uploads) are shown as "uploaded late" with the gap; any reading written after a revoke never counts. Cost stated: offline readings uploaded after a revoke are lost. Arkiv block time → wall clock needs `getBlockTiming` (2 s blocks, D2).
- Red-team F3: confirmed `packages/chain/src/ens.ts` L75–96 already scans `LabelRegistered / LabelUnregistered / ExpiryUpdated / TokenRegenerated` in 45k-block chunks; the fold needs block numbers kept and a cache. Effort re-rated Medium-High.
- Red-team F4 + consistency 3: T14 reworded: a per-judge, expiring invite signed by the committee key, with every invite published (Arkiv entity) so admissions are auditable; it does not remove the single key (Safe is the separate step). Demo moved to video.
- Goal-fit 1–2: sponsor-capability table and per-feature fields added centrally.
- Consistency 5: the ~182.5-day Arkiv maximum is TESTED from the docs (D2 [1]: extend max 7,884,000 blocks ≈ 182.5 d from the extension block; friction.md #6). 06 had not checked it itself; no change to the claim, but the wording now says it is per extension, renewable.

## Gate decision
Criteria: no CRITICAL/HIGH left unaddressed · rubric met · every tension resolved · rest cosmetic.
- The single CRITICAL is a design flaw in one recommended feature. Its fix is a design statement, verified against code and docs by the orchestrator (above), not a new empirical claim. All HIGH items are wording, structure or completeness fixes applied centrally.
- No new evidence would be produced by a second board round. The remaining unknowns (real phones, venue Wi-Fi, a resident's voice) cannot be closed by more review.
- **Decision: STOP.** Apply fixes centrally to VERDICT.md, re-verify the changed claims (done above and in the final self-check), finish.
