# Tremor Witness (ETHGlobal Mumbai 2026)

**Residents' phones become a shared vibration record that no single party controls.** Android phones in neighbouring flats detect construction vibration. An event counts only when several registered phones feel it at the same time. Readings are signed by each phone and stored on **Arkiv**. Sealed evidence packs go to **Swarm**. The dashboard recomputes everything in your browser, and keeps working when our servers are off.

- Live: https://tremor-witness.vercel.app (sensor) · https://tremor-witness.vercel.app/dashboard.html?site=p2test (dashboard) · `/tremor-witness-viewer.html` (offline single-file viewer)
- Claim discipline: we show *a corroborated event in a vibration band at a time*, **not** that a legal limit was exceeded.
- Sponsor write-ups: Arkiv → `arkiv/` (schema, why, how, reach, friction, swarm). ENSv2 → `ens/` (Prototype 3). EF CROPS → the section below.

## CROPS
- **C, censorship resistance (the lead property):** nobody (contractor, authority, society secretary, or us) can edit, delete or withhold a confirmed event.
  - Each phone signs its own readings to Arkiv.
  - Every viewer recomputes the quorum from public data.
  - Evidence packs live on Swarm, with a hash on Arkiv.
  - The offline viewer is one HTML file that reads Arkiv directly. Switch our backend off and the record is still readable and verifiable.
- **O, open source:** MIT licence, the whole stack is in this repo, and every rule (`packages/core/src/quorum.ts`) is readable and re-runnable (`scripts/verify-event.ts`).
- **P, privacy:** phones publish only detected events (above threshold), never a continuous stream. Phone names are pseudonymous, and location is only "site". There are no analytics or trackers, and keys never leave the device. Trade-off, stated: event times are public by design, because that is the evidence.
- **S, security:** each phone has its own key, and a trigger counts only if its immutable Arkiv `$creator` matches the registered phone. Quorum rejects a lone or spoofed phone, and tilt and acceleration checks reject a handled phone. Sealed packs are hash-verified. Trade-off, stated: the onboarding gas faucet (`/api/drip`) is the one server we run, and it is not in the data path.

## Run it
```bash
npm install && npm test          # core DSP + quorum tests
npm run dev                      # local web app (phones need HTTPS: use the Vercel link)
npx tsx scripts/simulate.ts demo 3     # 3 simulated phones → Arkiv → quorum
npx tsx scripts/pull.ts demo 60        # pull a site's data from Arkiv into logs/
npx tsx scripts/verify-event.ts demo   # verify sealed events (Swarm pack ↔ Arkiv hash)
```

## Team repo notes

Team: Dhruv Mulay (Main Agent), Akhilesh Nawale, Somnath Ghadge. Event facts, deadline and rules: **`COMPETITION.md`** (single source of truth).

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
