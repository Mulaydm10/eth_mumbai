# ETHGlobal Mumbai: team repo

Team: Dhruv Mulay (Main Agent), Akhilesh Nawale, Somnath Ghadge. Event facts, deadline and rules: **`COMPETITION.md`** (single source of truth).
Thesis, stack and track are not decided yet (`Q-0001`, `ADR-0002`, `Q-0003`).

## Read order for a cold agent
`CLAUDE.md` (or `AGENTS.md` if not Claude Code) → `STATE.md` → `VISION.md` → `COMPETITION.md` → `GOVERNANCE.md` → `AGENTS.md` →
recent `worklog.md` tail → `experiments/experiment_log.md`. Event background: `docs/research/ETHGlobal_Mumbai_Research_Handover.md` (frozen).

## Find things fast
| Need | File |
| --- | --- |
| What is true right now | `STATE.md` |
| Deadline, rules, rubric | `COMPETITION.md` |
| Rehearsed demo and reset | `DEMO.md` |
| Rubric → artifact map | `notes/judging_alignment.md` |
| Who may touch what | `AGENTS.md`, `GOVERNANCE.md` |
| Decisions / questions / experiments | `design/decisions/`, `research/open_questions.md`, `experiments/experiment_log.md` |
| Deliverables staging | `submissions/` |

IDs: `ADR-####` `Q-####` `EXP-####` `DEMO-####`; `grep -rn '<ID>' .` shows the trace.

## End-of-session checklist
Overwrite `STATE.md` · append a dated+timestamped `worklog.md` entry · append any new `EXP-####` row · log any LOCKED-file edit in the
`GOVERNANCE.md` audit table · release any finished work claim.

If a doc is still full of `TODO(<owner>)`, say so rather than invent.
