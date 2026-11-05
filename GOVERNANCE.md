> **LOCKED governing file.** Do not edit in place. See `GOVERNANCE.md`.

# Governance

## Main Agent
**Dhruv Mulay** is the Main Agent: sole authority over LOCKED files. Others (humans or agents) propose a change by
appending a `Q-####` to `research/open_questions.md` or writing a Proposed ADR; the Main Agent applies it and logs it below.

## File categories

**LOCKED** (edit only via the Main Agent; every edit logged in the audit table):
`GOVERNANCE.md`, `COMPETITION.md`, `VISION.md`, `design/README.md`, `experiments/README.md`, `research/README.md`,
`notes/ai_onboarding_prompt.md`, `logs/README.md`, `tests/README.md`.

**Deliberately NOT locked.** Their whole value is staying current, and locking would defeat that:
`CLAUDE.md`, `STATE.md`, `AGENTS.md`, `DEMO.md`, `README.md`, `notes/glossary.md`, `notes/judging_alignment.md`,
`submissions/README.md`, and everything under `src/` once it exists.
(ADR files are immutable once Accepted; a change is a new superseding ADR, not an edit.)

**Append-only** (add at the end, never rewrite): `worklog.md`, `experiments/experiment_log.md`,
`research/prior_art.md`, `research/open_questions.md` (close a Q by adding a line, never delete it).

**Frozen input:** `docs/research/ETHGlobal_Mumbai_Research_Handover.md` is an external research handover. Do not edit, move or
summarise it. Event facts taken from it live in `COMPETITION.md`, which links back to it.

## Audit table (every LOCKED-file edit, including initial authorship)

| Date | File | Editor | Change | Why |
| --- | --- | --- | --- | --- |
| 2026-11-05 | GOVERNANCE.md | hackathon-setup (for Dhruv Mulay) | Initial authorship | Scaffold |
| 2026-11-05 | VISION.md | hackathon-setup | Initial authorship, all slots TODO | Scaffold; thesis not chosen (Q-0001) |
| 2026-11-05 | COMPETITION.md | hackathon-setup | Initial authorship from the research handover | Scaffold |
| 2026-11-05 | design/README.md | hackathon-setup | Initial authorship | Scaffold |
| 2026-11-05 | experiments/README.md | hackathon-setup | Initial authorship | Scaffold |
| 2026-11-05 | research/README.md | hackathon-setup | Initial authorship | Scaffold |
| 2026-11-05 | notes/ai_onboarding_prompt.md | hackathon-setup | Initial authorship | Scaffold |
| 2026-11-05 | logs/README.md | hackathon-setup | Initial authorship | Scaffold |
| 2026-11-05 | tests/README.md | hackathon-setup | Initial authorship | Scaffold |
