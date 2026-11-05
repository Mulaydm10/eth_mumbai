# AGENTS.md: vendor-neutral multi-agent rules

Twin of `CLAUDE.md`. The read order, ID scheme and canonical commands live in `CLAUDE.md` only; this file carries the **concurrency model**. Non-Claude agents: read `CLAUDE.md` for those, then return here.
Event facts: `COMPETITION.md` only.

## Who owns what
| Surface | Owner | Notes |
| --- | --- | --- |
| LOCKED files (`GOVERNANCE.md` list) | Main Agent: Dhruv Mulay | Others propose via a `Q-####` or Proposed ADR. |
| `STATE.md`, `worklog.md`, `DEMO.md`, `notes/judging_alignment.md` | Whoever holds a claim; everyone appends | Not locked. |
| `src/` areas (when they exist) | TODO(Dhruv): assign per area after `ADR-0002` | One owner per area at a time. |
| `docs/research/ETHGlobal_Mumbai_Research_Handover.md` | Nobody | Frozen; read-only. |

## Claiming work
1. Add a row to the **Work claims** table in `STATE.md` (surface, owner, time in IST) **before** editing.
2. If a row already covers your surface, do not edit it; pick other work or ask in `STATE.md` under Blocked.
3. **Release the claim the moment you stop.** A stale claim blocks others worse than no claim.

## The one hard rule
**Any agent finishing a unit of work updates `STATE.md` before yielding.** "Finishing" includes blocking and running out of turn budget.
Also append a timestamped `worklog.md` entry and log any LOCKED edit in the `GOVERNANCE.md` audit table.

## Conflicting work
Never silently pick a winner. Record the conflict under **Blocked** in `STATE.md`, keep both versions discoverable (separate branch or file, named in the entry), and let the Main Agent decide.

## Keep it runnable
Before yielding, if a demo path exists, confirm `DEMO.md` still runs. If you broke it, fix it first.
