# STATE (overwritten every session)

**Tie-break:** if this file and `worklog.md` disagree about what is true *now*, **this file wins**. The worklog explains how we got here.
**Deadline:** see `COMPETITION.md` (do not copy it here). Compute time remaining from the current time before planning.
**Clock warning:** this Mac's clock runs **CET**. IST = CET + 4:30.

## What we are building
**Tremor Witness**: residents' Android phones record construction vibration. An event counts only when several ENS-registered phones feel it together. Readings are signed by each phone on **Arkiv**, sealed evidence packs go to **Swarm**, and the record survives our servers going off (**EF CROPS**). Plan: `design/build-plan.md` · stack: `ADR-0002` (Accepted) · commands: `CLAUDE.md`.

## Live
- Sensor page: https://tremor-witness.vercel.app/?site=<site> · Dashboard: `/dashboard.html?site=<site>` (big join QR) · Offline viewer: `/tremor-witness-viewer.html`
- ENS (Sepolia, ENSv2 contracts-v2 07e55a05 set): **tremorwitness.eth**; sites `test2` (k=2, 2000 ms) and `p3test` (k=3). Committee = funder wallet 0x32DE…500F.
- Arkiv Rabdi (chain 7794095): schemas `tremor-witness.v1.{trigger,sensor,event,sync}`.
- Repo: https://github.com/Mulaydm10/eth_mumbai (**private: must go public before submission**).

## Done
- Prototype 0–3 + offline mode, all deployed and committed. 17 tests green.
- Sponsors: **Arkiv ✓** (code + all `arkiv/*.md`), **Swarm bonus ✓** (evidence packs, hash-verified), **ENSv2 ✓** (registry gates the quorum, revoke, params from text records; verified on p3test), **EF CROPS ✓** (README CROPS section, offline single-file viewer).
- Real-phone findings (2 phones, ~50–68 Hz): detection and handling rejection work. Phone clocks were ~2.8–3.3 s apart, so we added internet reference sync (/api/time) and sound sync (3-tone chirp, offline). Tilt threshold is now 15°. First real ENS-gated confirmed event on test2 at 03:49 IST.

## In flight
- Nothing running. The **last real-phone round (04:05 IST) was inconclusive**: only phone-b0a8's readings reached Arkiv, and no sound-sync anchors arrived. The likely cause is that phone-cad2 wasn't reloaded (old code). Retest when the teammate is back: reload both phones, allow the microphone, play the sync sound, stomp ~4 s apart, then `npx tsx scripts/pull.ts test2 30`.

## Trust model + Tier 0 (feature-playbook verdict)
- Done: **T13** as-of membership, **T14** signed invites (issue/use on Arkiv), Tier 0 docs (README accurate, `ens/README.md`, `arkiv/swarm.md` 8/8, `docs/AI_USE.md`, `DEMO.md` draft), latest sealed evidence on the dashboard, fresh-clone build fix. Verdict: `research/playbook/2026-11-06-features/VERDICT.md`.
- Next (Tier 1): T1 readonly + per-phone hash chain, T2a keep-alive, T3 per-phone ENS record, T4-lite attack checklist. Needs: Safe owner addresses (C), real-phone rehearsal of DEMO-0001, EXP-0002.

## Depth items (Dhruv's A–F list)
- Done: **A** coherence (experimental; EXP-0001 weak separation), **E** `/report.html` evidence report, **B** demo vibration source, **F** friction log.
- Waiting: **C** Safe 2-of-3 committee (needs 3 owner addresses), **D** Swarm-hosted site (gateway approval: ask at booth), **EXP-0002** collusion test (phones).

## Next intended steps (priority order)
1. Real-phone retest of sound sync + outbox, then **measured headline numbers** (true-confirm rate, lone-shake false-accept rate, inter-phone PPV spread) logged as `EXP-0001…`.
2. `ens/` write-up for ENS judges; fill `notes/judging_alignment.md`; `DEMO.md` DEMO-0001 + reset/rollback.
3. Fill `VISION.md` (LOCKED; log in GOVERNANCE) from the build plan, with Dhruv's sign-off.
4. Video script (≤3 min for EF), AI-use disclosure, make the repo public, submission form, partner picks: Arkiv (+Swarm), ENS, EF.
5. Optional: Swarm gateway approval (form open in the Playwright browser), 2-of-3 Safe as committee, Sepolia event anchor.

## Blocked
- Real-phone tests wait for the teammate (asleep since ~04:10 IST).

## Work claims
| Surface / task | Owner | Claimed at (IST) | Released |
| --- | --- | --- | --- |
| _none_ | | | |

Last updated: 2026-11-06 06:53 IST · Claude Code (T13/T14 + Tier 0)
