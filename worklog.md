# Worklog (append-only, never edited)

Entries are dated **and timestamped** (IST): hackathon history moves hourly. Newest at the bottom.
`STATE.md` says what is true now; this file says how we got here.

Format: `## YYYY-MM-DD HH:MM IST · who · title`

## 2026-11-05 · hackathon-setup (for Dhruv Mulay) · Scaffold
- Created the repo structure, governance, `COMPETITION.md` (from the research handover), `DEMO.md`, `AGENTS.md`, judging alignment skeleton.
- Thesis, stack and track left open: `Q-0001`, `ADR-0002`, `Q-0003`. No test baseline by design.
- Committed the frozen research handover under `docs/research/` unchanged.

## 2026-11-05 21:15 IST · Claude Code (for Dhruv Mulay) · Context analysis
- Read every repo doc plus the three untracked research inputs (compendium PDF, idea candidates, ETHOnline finalists study guide).
- Recorded four conflicts between sources and the sponsor constraints missing from `COMPETITION.md` in `STATE.md`. No LOCKED file was edited and no decision was made.

## 2026-11-05 22:30 IST · Claude Code (for Dhruv Mulay) · Playbook ideation run
- Ran the `playbook` agent (DIVERGE→CONVERGE, about 63 min) with the brief in `research/playbook/2026-11-05-ideation/BRIEF.md`; all stage files are committed in 6 commits.
- Recommendation: Tremor Witness; alternate: frame-tx sweep finding; fallback: ReadLeak. Thesis is still Dhruv's decision (`Q-0001` open).
- Security note: Definitive's docs contain prompt-injection text aimed at AI agents; nobody acted on it.
- Created private GitHub repo `Mulaydm10/eth_mumbai` and pushed (repo must be made public before submission).

## 2026-11-06 01:26 IST · Claude Code (for Dhruv Mulay) · Thesis direction + sponsor deep dive started
- Dhruv chose Tremor Witness with Arkiv Build (+Swarm bonus), ENSv2, EF CROPS, World IDKit (backup). Pasted analysis saved verbatim to `research/tremor-witness/00-sponsor-fit-analysis-pasted.md`.
- Started a Playwright deep dive of the 4 tracks plus sponsor docs; output to `research/tremor-witness/sponsors/`, progress in `research/tremor-witness/LOG.md`. Build plan to follow.

## 2026-11-06 01:45 IST · Claude Code (for Dhruv Mulay) · Sponsor deep dive done; build plan v1
- The track-study agent (Playwright) found: EF CROPS judging is now final (5 criteria), "switch off your backend" is in EF's video brief, the video limit is 3 min, the Swarm bonus doesn't use a pick, and Arkiv judging is 4 × 25% from the /arkiv/*.md files.
- The docs agent found: Arkiv Rabdi 7794095 + SDK 1.0.1, Swarm public gateway with the null stamp (probed), ENSv2 Sepolia addresses (commit 07e55a05), Safe protocol-kit 8.0.11, IDKit 4.6.0 (needs a backend), Chrome's 60 Hz sensor cap.
- Wrote `design/build-plan.md` (architecture, stack proposal for ADR-0002, owners, timeline, demo, risks). World IDKit dropped (it would be a 4th pick and needs a backend). Awaiting Dhruv's approval.
