# STATE (overwritten every session)

**Tie-break:** if this file and `worklog.md` disagree about what is true *now*, **this file wins**. The worklog explains how we got here.
**Deadline:** see `COMPETITION.md` (do not copy it here). Compute time remaining from the current time before planning.
**Clock warning:** this Mac's clock runs **CET**. IST = CET + 4:30. Always convert before planning.

## Done
- Repo scaffolded (governance, event facts, demo/agent docs). No product work yet.
- 2026-11-05 21:15 IST: full context read (all repo docs plus the three new, still untracked research inputs below). No decisions made.

## Research inputs (all in `docs/research/`, read-only)
- `ETHGlobal_Mumbai_Research_Handover.md`: committed, frozen.
- `ETHGlobal-Mumbai-2026-Compendium.pdf`: **untracked**. Newest and widest source (Nov 5): schedule, per-sponsor rules, what wins, the Fiducia post-mortem, ideas A-D/LeakMeter/Hedged LP with verdicts.
- `Idea_Candidates_Verbatim.md`: **untracked**. Three refined candidates: MachineLease, ReadLeak (refined LeakMeter), Fallback Checkout.
- `ethonline-2026-finalists-study-guide.pdf`: **untracked**. Prepared for the WHU Solana hackathon (Oct 2); only the parts about the ETHOnline finalists apply here.
- Committing these is Dhruv's call: the compendium holds personal notes and will be public once the repo is published.

## Conflicts between sources (do not resolve silently; Dhruv decides)
1. **Team size:** `COMPETITION.md` says 3 people; the compendium works out prize ceilings and person-hours for **4**.
2. **World Agent Pass $5,000 split:** handover says $2.5k / $1.5k / $1k; compendium says the split is not stated and that "proofs are mocked at this event".
3. **Demo video:** the compendium repeats the website's "optional"; the finalist email says it is required. `COMPETITION.md` already follows the email.
4. **Track:** the compendium lists "from scratch (not continuity)" and says "You decided not to use Fiducia", but `Q-0003` is still open in the repo.

## Sponsor constraints not yet in `COMPETITION.md` (from the compendium; verify on /prizes)
- EF: at most one EF prize per project. Arkiv: all tracks count as one pick; judged partly from schema.md, friction.md, reach.md, why-arkiv.md and data-quality.md; Mirror needs a redistribution licence.
- ENS: ENSv2 on mainnet or Sepolia, central rather than cosmetic, live demo, open source, no hard-coded values.
- Arc: every prize must start in Arc Studio. 0G Physical AI: requires a safe stop and rejects "0G used only for logs"; whether a phone counts as real hardware is unclear. Chainlink CCIP: requires a CCIP state change.

## In flight
- Playbook ideation run (option c) in the background; it records everything to `research/playbook/2026-11-05-ideation/` (start with `RESUME.md` if it is cut off).

## Blocked
- Thesis not chosen (`Q-0001`) · stack undecided (`ADR-0002` / `Q-0002`) · track undecided (`Q-0003`) · submission option and partner prizes (`Q-0004`).

## Next intended step
Dhruv picks the thesis (`Q-0001`; the compendium's self-imposed target was about 22:00 IST Thu), the track (`Q-0003`) and the stack (`ADR-0002`). Then fill in `VISION.md`, the `CLAUDE.md` commands and `DEMO.md`, and land the smoke test.

## Latest experiment
None (`experiments/experiment_log.md` is empty).

## Work claims
Claim before starting; release the moment you stop. A stale claim blocks others worse than none.

| Surface / task | Owner (human or agent) | Claimed at (IST) | Released |
| --- | --- | --- | --- |
| `research/playbook/2026-11-05-ideation/` (ideation run, DIVERGE→CONVERGE) | playbook agent via Claude Code | 21:25 | |

Last updated: 2026-11-05 21:15 IST · Claude Code (context analysis)
