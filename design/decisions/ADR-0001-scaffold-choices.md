# ADR-0001: Scaffold choices

- **Status:** Accepted (scaffold authorship; Main Agent Dhruv Mulay)
- **Date:** 2026-11-05
- **Related:** Q-0001, Q-0002, Q-0003

## Context
Fixed-deadline event, three humans plus agents working concurrently. Thesis, stack and track were all undecided at scaffold time.

## Decision
- Three-piece cold start: `CLAUDE.md` (entry) · `STATE.md` (overwritten snapshot) · `worklog.md` (append-only, timestamped).
- Event facts live only in `COMPETITION.md` (LOCKED); every other doc links to it.
- `DEMO.md` stays runnable at all times once a path exists; fixing it outranks features.
- Concurrency runs through a claims table in `STATE.md` (see `AGENTS.md`).
- **No toolchain files and no `src/`** until `ADR-0002` is resolved. No faked test baseline.
- **No `ideas/` folder.** Candidate ideas are tracked under `Q-0001` to avoid dead scaffolding.
- **No `evals/`, `data/`, `models/`, `hardware/`** until the thesis shows they are needed (add via a new ADR).
- A live deployment is a finalist gate (see `COMPETITION.md`), so deployment and rollback live in `DEMO.md`'s reset section.

## Consequences
Whoever resolves `ADR-0002` must add toolchain config, fill the canonical commands in `CLAUDE.md` and land a green smoke test in one change.
