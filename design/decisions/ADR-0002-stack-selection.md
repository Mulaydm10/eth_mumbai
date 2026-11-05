# ADR-0002: Stack selection

- **Status:** Accepted (2026-11-06, Dhruv: "start" on `design/build-plan.md`)
- **Date:** 2026-11-05
- **Related:** Q-0002, Q-0001, Q-0003

## Context
Stack is undecided and depends on the thesis (`Q-0001`) and track (`Q-0003`). The event is an Ethereum hackathon, so on-chain pieces are likely but not assumed.

## Options considered (candidates, none chosen)
| Option | For | Against |
| --- | --- | --- |
| TypeScript end-to-end (web app + contract tooling) | One language across UI, scripts and contract tooling; fast path to a public URL | TODO(Dhruv) |
| Python backend + TypeScript frontend | Strong if the build is agent/LLM heavy | Two toolchains to keep green |
| Contracts-first (Solidity) + thin UI | Fits an on-chain core | TODO(Dhruv) |
| Other | TODO(Dhruv) | TODO(Dhruv) |

## Decision criteria
1. Team skill overlap (roles as listed in `docs/research/ETHGlobal_Mumbai_Research_Handover.md`).
2. Time to a **live public deployment** (finalist gate in `COMPETITION.md`).
3. Smoke test green within minutes of a fresh clone.
4. Fit with the tooling required by the chosen partner prizes (`Q-0004`).
5. Incremental commit history is feasible (see `COMPETITION.md` version-control rule).

## Decision
**TypeScript end to end** (npm workspaces): `packages/core` (pure DSP + quorum + sound sync, vitest), `packages/chain` (Arkiv SDK 1.0.1, Swarm gateway, ENSv2 via viem 2.57.16), `apps/web` (Vite PWA: sensor page, dashboard, offline single-file viewer; Vercel functions for onboarding gas, ENS committee actions, reference time). No Solidity of our own: ENSv2 and Arkiv contracts are used as deployed. Smoke test: `npm test` (`packages/core/test/quorum.test.ts`: a 3-phone impact confirms, a lone shake is rejected).

## Consequences
Resolving this ADR **must, in the same change**: add toolchain config and `src/`, fill the `CLAUDE.md` canonical commands, land a green smoke test, update `tests/README.md` (Main Agent) and log it in `GOVERNANCE.md`.
