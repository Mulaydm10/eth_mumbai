# Tremor Mesh (ETHGlobal Mumbai 2026)

> **Name:** the project is called **Tremor Mesh** (it was built as "Tremor Witness"). The URL, ENS names (`*.tremorwitness.eth`) and Arkiv schemas (`tremor-witness.v1.*`) keep the original name, because renaming them would orphan every phone, reading and sealed event already on-chain.

**Residents' phones become a shared vibration record.** Android phones in neighbouring flats detect construction vibration. An event counts only when several **ENS-registered** phones feel it at the same time. Each phone signs its own readings to **Arkiv**. Sealed evidence packs go to **Swarm**. The dashboard recomputes everything in your browser from public data.

- **Live:** https://tremor-witness.vercel.app/dashboard.html?site=test2 (dashboard: real 2-phone data, latest sealed evidence, join QR) · `/?site=<site>` (phone sensor) · `/report.html` (printable evidence report) · `/tremor-witness-viewer.html` (offline single-file viewer)
- **What we claim:** *a corroborated event in a vibration band at a time, co-signed by registered phones*. **Not** that a legal limit was exceeded, and not geophone-grade measurement.
- **Sponsor write-ups:**
  - Arkiv → `arkiv/` (schema, why, how, reach, friction, swarm);
  - ENSv2 → `ens/README.md`;
  - EF CROPS → the section below.
- **Privacy (measured hosts per page):** `docs/PRIVACY.md`. **Languages:** phone page in English, मराठी and हिंदी.
- **AI use:** `docs/AI_USE.md`. **Demo script:** `DEMO.md`. **Licence:** MIT (`LICENSE`).

## Who decides who counts, and as of when
A phone's reading counts if the phone's ENSv2 name (`<phone>.<site>.tremorwitness.eth`) was registered to the wallet that wrote it, **both at the reading's claimed time and at the moment Arkiv recorded it** (`packages/core/src/registry.ts`). The building's committee issues names through signed, single-use invites that are logged publicly on Arkiv, and can revoke them. **Revoking stops a phone's future readings only; history is not rewritten**, and a revoked phone cannot backdate.

## CROPS
- **C, censorship resistance (the lead property):** once a reading is on Arkiv, **no single party can quietly change what it shows**.
  - Each phone signs its own readings, and every viewer recomputes the quorum from public Arkiv and ENS data.
  - Sealed evidence lives on Swarm, and its keccak hash is on Arkiv. The printable report re-checks it.
  - The **offline viewer** is one HTML file that reads Arkiv, ENS and Swarm directly. Switch our servers off and existing evidence stays readable and verifiable.
  - *Limits, stated:*
    - **Membership** (who may join) is controlled by the building committee through ENS. Today that committee is one key run by our onboarding service; a 2-of-3 Safe is designed.
    - A phone's owner can still **delete** its own Arkiv entity (Arkiv's `readonly` blocks edits, not owner deletes). Sealed packs on Swarm keep a copy.
    - Arkiv entities expire (maximum about 182 days), so long-lived evidence relies on the Swarm pack plus its hash.
- **O, open source:** MIT licence. The whole stack is in this repo, every rule is readable and tested (`npm test`, 29 tests), and `scripts/verify-event.ts` re-verifies any site.
- **P, privacy:**
  - Phones publish only detected events above threshold, never a continuous stream.
  - Phone names are pseudonymous, and location is only "site".
  - There are no analytics or trackers, and phone keys never leave the device.
  - *Stated trade-offs:* event times and waveform excerpts are public by design, because they are the evidence. The phone talks to the hosts listed under S.
- **S, security:**
  - Each phone has its own key, and its readings count only under the as-of ENS rule above.
  - The quorum rejects a lone phone, and tilt and acceleration checks reject a handled phone.
  - Joining needs a committee-signed, single-use invite; issue and use are logged on Arkiv.
  - Sealed packs are hash-verified.
  - **The servers we run (all Vercel functions), and what each can and cannot do:**

    | Function | What it does | What it cannot do |
    | --- | --- | --- |
    | `/api/drip` | Gives a new phone a little testnet gas | Write or alter readings |
    | `/api/time` | Reference clock for aligning phones | Nothing depends on it: phones fall back to their own clock and sound sync |
    | `/api/ens-invite` | Committee signs an invite for one phone, or a multi-use one for up to 50 (passcode) | — |
    | `/api/ens-register` | Registers an invited phone's ENS name | Register without a valid, unused, Arkiv-logged invite |
    | `/api/ens-revoke` | Committee revokes a phone (passcode) | — |
    | `/api/site-setup` | Committee sets a site's rules as public ENS text records (passcode): phone limits `tw.max_phones` / `tw.max_mesh`, quorum `tw.k` / `tw.window_ms`, mesh quorum `tw.dk` / `tw.dwindow_ms` (dashboard Setup tab) | Change the rules secretly: every change is a public Sepolia transaction |

    None of them is needed to **read or verify** evidence.

## Arkiv: writer addresses and a query you can run
- **Writers:**
  - every phone writes with its own in-browser wallet. On `test2` that's `0xB0A8F94ee56F653603695367Db6739b60096EDE1` (phone-b0a8) and `0xCAd25E795068C5C5592ca64b60d105AD5CAF45F7` (phone-cad2);
  - sealed events are written by whichever dashboard viewer sealed them, e.g. `0xb529c8E35A00581b685EB58bdACf43377ea553BA`;
  - invites and onboarding gas come from the committee/funder `0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F`.
- **Network:** Rabdi testnet, chain `7794095`, schemas `tremor-witness.v1.{trigger,sensor,event,sync,invite}` (`arkiv/schema.md`).
- **Run a query:**
```bash
npm install
npx tsx scripts/pull.ts test2 100000        # all phones + readings at site test2 (real 2-phone data), saved to logs/
npx tsx scripts/verify-event.ts p3test 100000   # every sealed event: Swarm pack hash ↔ Arkiv, members exist
```

## Run it
```bash
npm install && npm test                    # core: DSP, quorum, sound sync, coherence, as-of membership (29 tests)
npm run dev                                # local web app (phone sensors need HTTPS: use the Vercel link on phones)
npx tsx --env-file=.env scripts/simulate.ts <site> 3   # E2E: 3 simulated phones → invite → ENS → Arkiv → quorum (needs committee .env)
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
