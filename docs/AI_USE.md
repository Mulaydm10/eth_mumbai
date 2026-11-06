# How we used AI (ETHGlobal rules: say where and how)

We used **Claude Code** (Anthropic, Claude Opus as the main session, with Claude Sonnet sub-agents for research workers) extensively throughout this hackathon, and we're open about it. Everything it produced is in this repository, including the prompts and planning artifacts, as the rules require.

## What the humans did
- **Dhruv Mulay**:
  - chose the problem and the product (Tremor Mesh), the sponsors and the scope;
  - directed every build step ("one phone first, then grow", web app not native, max 5 phones, offline mode, the depth list);
  - made the product decisions (revocation semantics, which features to cut);
  - ran the real-phone tests;
  - completed the human steps no agent could: faucet human check, Sepolia funding, logins.
- **The team** ran the multi-phone tests on real Android phones and the demo rehearsal.

## What AI did, and where to see it
| Area | How AI was used | Where it is recorded |
| --- | --- | --- |
| Research and ideation | Two multi-agent "playbook" runs: idea generation, prior-art and impact checks, sponsor-fit and red-team reviews. One more run scoped to features. | `research/playbook/2026-11-05-ideation/` and `research/playbook/2026-11-06-features/`. Each has `BRIEF.md` (the prompt), `RUN_LOG.md`, every worker's file, and `VERDICT.md`. |
| Sponsor documentation study | Agents read ETHGlobal track pages (Playwright browser) and sponsor developer docs, and saved the verbatim text | `research/tremor-witness/sponsors/` |
| Planning | Build plan, stack decision, governance | `design/build-plan.md`, `design/decisions/ADR-0002-stack-selection.md` |
| Code | Most code was written by Claude Code under Dhruv's direction, in small commits: signal processing, quorum, sound sync, coherence, Arkiv/ENS/Swarm integration, the web app and the Vercel functions. Humans tested it on real phones and steered it from the results. | git history (each commit is co-authored "Claude Opus"), `worklog.md`, `research/tremor-witness/LOG.md` |
| Experiments and analysis | Pulling real phone data from Arkiv, finding the 3.3 s clock gap, tuning thresholds, and the honest negative coherence result | `experiments/experiment_log.md` (EXP-0001), `logs/` (local) |
| Writing | README, `arkiv/*.md`, `ens/README.md`, this file | the files themselves |

## What AI did not do
- It did not sign up for anything on our behalf with credentials, and it did not bypass human-verification checks. Those steps are flagged in `research/tremor-witness/LOG.md`.
- It did not fabricate measurements. Numbers in our materials come from real phones or are labelled "simulated".

## Spec-driven artifacts
Prompts and specs: the `BRIEF.md` files above, `design/build-plan.md`, `research/tremor-witness/00-sponsor-fit-analysis-pasted.md`, and the session log in `worklog.md`.
