# CLAUDE.md: cold-start entry point

**What this is:** the working repo for our ETHGlobal Mumbai hackathon entry. Humans and agents work on it at the same time.
**Thesis:** not chosen yet (`Q-0001`). **Stack:** undecided (`ADR-0002`). **Track:** undecided (`Q-0003`).
**Event facts** (deadline, rules, rubric) live **only** in `COMPETITION.md`. Never restate them elsewhere; link instead.

## Read order
1. `STATE.md`: live snapshot (what is true *now*; it wins over the worklog)
2. `VISION.md`: the thesis (currently all `TODO(Dhruv)`; say so rather than invent)
3. `COMPETITION.md`: event facts, finalist requirements, rules, judging
4. `docs/research/ETHGlobal_Mumbai_Research_Handover.md`: frozen external research (sponsor tracks, past winners). **Read-only; do not edit, move or summarise.** Not the same as `research/`.
5. `GOVERNANCE.md` → `AGENTS.md` (concurrency) → tail of `worklog.md` → `experiments/experiment_log.md`
6. `DEMO.md` and `notes/judging_alignment.md` before touching anything user-visible

## The three pieces (don't conflate)
- `CLAUDE.md` (this file): entry point; points outward, duplicates nothing.
- `STATE.md`: live snapshot, **overwritten** every session.
- `worklog.md`: append-only history, dated **and timestamped**.

## Governance (one paragraph)
Dhruv Mulay is the Main Agent and the only one who edits LOCKED files (banner: "LOCKED governing file"). Every LOCKED edit is a row in
the `GOVERNANCE.md` audit table. `CLAUDE.md`, `STATE.md`, `AGENTS.md`, `DEMO.md` are deliberately not locked. Concurrency rules are in `AGENTS.md`.

## ID scheme
`ADR-####` decisions (`design/decisions/`) · `Q-####` open questions (`research/open_questions.md`) · `EXP-####` experiments
(`experiments/experiment_log.md`, raw logs in `logs/`) · `DEMO-####` demo scenarios (`DEMO.md`). `grep -rn '<ID>' .` recovers the full trace.

## Canonical commands
TODO(Dhruv): blocked on `ADR-0002`. **Binding:** whoever resolves the ADR fills this section **and** lands a green smoke test in the same change.
There is no test baseline until then; do not fake one (`tests/README.md`).

## Hard rules
1. Never invent a thesis, deadline, rule or rubric weight. Unknown stays `TODO(<owner>)`.
2. `DEMO.md` must stay runnable once a path exists; fixing a broken demo outranks new features.
3. Commit small and often with real messages. `COMPETITION.md` warns that large single commits or missing history can disqualify.
4. AI use is allowed but must be documented; keep specs, prompts and planning artifacts in the repo (see `COMPETITION.md`).
5. No secrets, keys or seed phrases in the repo.
6. Do not push or add a remote unless Dhruv asks.

## End-of-session checklist
Overwrite `STATE.md` · append a dated+timestamped `worklog.md` entry · append any new `EXP-####` row · log any LOCKED-file edit in the
`GOVERNANCE.md` audit table · release any finished claim in `STATE.md`. This applies when you block or run out of budget too.
