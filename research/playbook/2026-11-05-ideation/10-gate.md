# 10 · Sufficiency gate (biased toward stopping)

**Board totals:** 0 CRITICAL. HIGH: correctness 1, red-team 6 (consistency 0, goal-fit 0, reproducibility 0). MED: about 12. LOW: about 15.

**Are the HIGH findings fixable centrally without new evidence?**
| HIGH | Fix applied in VERDICT v2 | Needs another round? |
|---|---|---|
| Physics compressed (correctness F1, repro MED) | The full ranges, the pipeline and the scenario are now stated; the 2–5 mm/s weak zone is called out; the sim is labelled SIMULATED, not measured | No |
| Why a blockchain? (red-team F1) | A scripted crisp answer: multi-party, no single editor or withholder, verifiable without us. Compared against the Sheet, WhatsApp and a signed PDF | No |
| CROPS: the single auditor is a chokepoint (F5) | The issuing/revoking role goes to a k-of-n society committee Safe; every revoke is a public Arkiv entity; a revoke stops only future readings; the trade-offs go in the CROPS README | No |
| ENS reads as an allowlist (F3) | Kept as the sensor registry gate, with expiring and non-transferable subnames and committee roles. The residual risk is stated | No (the risk is accepted and stated) |
| Arkiv looks log-shaped (F4) | The quorum computation *is* the Arkiv query, the evidence pack and dashboard read only from Arkiv, and revocations are entities | No |
| Who installs it / adoption (F6) | **Not resolvable by desk research.** It needs a conversation with a resident welfare association or society. Stated as the top residual and handed to the human | Another research round would not resolve it → STOP |
| Table stomp ≠ piling (F7) | The demo is relabelled as a demonstration of quorum and revocation; a labelled real-site replay is added as a build note | No |

The MED/LOW findings are fixed in wording:
- the problem sentence is softened, with Elphinstone/VJTI treated as counter-evidence;
- the quote is corrected to "drained instantly";
- inline "judgment" tags are added;
- E1 and #2 fields are completed;
- the reason for not using Uniswap, Arc, Hedera or 0G is stated;
- prior-art kills are justified under the human's crowding filter (shipped product or granted patent means crowded, mapping to Originality), not as novelty-first.

**Rubric met?** All 5 finalist criteria are now stated for #1. The sponsor stack obeys the pick rules (verified by consistency).
**Tensions resolved?** T1–T8 are resolved, and the board raised no new contradiction between angles.

**Decision: STOP.** No second loop. Re-verification after the fixes: the ground-truth checks (devnet, Arkiv, sim) were already reproduced independently by the orchestrator and by the reproducibility board.
