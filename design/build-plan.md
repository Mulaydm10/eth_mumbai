# Build plan: Tremor Witness

**Status:** Draft v1, written Fri 2026-11-06 01:45 IST by Claude Code for Dhruv. Not yet approved.
**Deadline:** Sat 7 Nov 09:00 IST (see `COMPETITION.md`). About **31 hours** were left when this was written.
**Inputs:**
- `research/playbook/2026-11-05-ideation/VERDICT.md`
- `research/tremor-witness/00-sponsor-fit-analysis-pasted.md`
- `research/tremor-witness/sponsors/ethglobal-*.md` (verbatim track text, read with Playwright)
- `research/tremor-witness/sponsors/docs-*.md` (packages, addresses, API calls, probes)

---

## 1. What we are building (one paragraph)
Tremor Witness lets residents' Android phones record construction vibration in old Mumbai buildings and turn it into a **shared record that no single party controls**.
- A phone lying on a floor runs our web app (PWA). When it feels a vibration in the construction band, it writes a signed **trigger** to Arkiv.
- An event is **confirmed** only when *k* of *n* registered phones trigger within the same time window. A single shaken phone never counts.
- Phones are registered as **ENSv2 sensor subnames** (expiring, revocable, non-transferable), issued by the housing society's **2-of-3 committee Safe**.
- Confirmed events get an **evidence pack on Swarm**. The public dashboard rebuilds everything from Arkiv, ENS and Swarm alone, so it keeps working when we switch our servers off.

**Pitch claim (do not overclaim):** "a corroborated event in this vibration band happened at this time, co-signed by these registered flats". It **never** claims "the legal limit was exceeded".

## 2. Sponsor picks (3 maximum, per `COMPETITION.md`)
| Pick | Track | What makes it central (and is what we will demo) | Required artifacts |
| --- | --- | --- | --- |
| 1 | **Arkiv: Build on Arkiv** ($3k/$1k) **+ Swarm bonus** ($500, does not use a pick) | Triggers and events are Arkiv entities. The quorum is an Arkiv query (`where` sensor-building `eq`, time `between`). The dashboard reads only Arkiv. Evidence packs are on Swarm and referenced from event entities. | `/arkiv/schema.md`, `friction.md`, `reach.md`, `why-arkiv.md`, `how-you-use-arkiv.md`, `swarm.md`. The README lists the writer wallet addresses and one runnable query. Judging is **25% each**: feedback, reach, why Arkiv, how. |
| 2 | **ENS: Best Use of ENSv2** ($3k/$2k/$1k/$1k) | ENS is the sensor registry the quorum check reads. A trigger counts only if `sensor-NN.<building>.tremorwitness.eth` resolves to the trigger's `$creator`. Subnames come from our own UserRegistry, which is non-transferable and expiring, with live revocation by the Safe through Enhanced Access Control roles. Quorum parameters are text records only the Safe can write. | A live demo link, open-source code, and **no hard-coded values**: the sensor set, quorum *k* and window are all read from ENS at runtime. Network: **Sepolia**. |
| 3 | **EF: Best CROPS App** ($2k/$1k/$500) | The lead property is **C**, censorship resistance: nobody (contractor, authority, secretary or us) can edit or withhold a confirmed event. **Kill the backend on camera** (their video brief says "switch off your backend"). The dashboard is also hosted on Swarm. | A README **"CROPS" section** with one or two lines for each of C, O, P and S; a free licence; no trackers or analytics; keys stay on the device. The video is **at most 3 minutes**. |
| (dropped) | World IDKit | It would be a 4th pick, it needs our backend to sign and verify (which clashes with killing the backend), and Android needs gated sandbox access. Keep it as a roadmap line ("one human per sensor"). | — |

## 3. Architecture
```
PHONE (PWA, Android Chrome, HTTPS)
  LinearAccelerationSensor ~60 Hz (+ DeviceMotion fallback), Wake Lock
  DSP: high-pass + band-pass (construction band) → integrate → PPV, dominant f
       trigger detector (STA/LTA) + anti-spoof features (low-freq energy ratio, PPV ceiling)
  key: viem local account generated in-browser, stored on device only
  writes  ─────────────►  ARKIV (Rabdi, chain 7794095)
                            entity "tw.trigger" (TTL 30 d): building, sensor, t_ms, ppv_bin, f_dom, feat_hash
                            entity "tw.event"   (TTL ~180 d): building, t_ms, k, signers[], ppv_band, swarm_ref
                          SWARM (public gateway, null stamp)
                            evidence pack JSON: triggers, features, ENS state snapshot, quorum params
COMMITTEE (2-of-3 Safe on Sepolia, Safe protocol-kit)
  ENSv2: tremorwitness.eth → <building> (UserRegistry owned by the Safe)
         sensor-NN.<building>: addr = phone key, expiry, no transfer role
         building text records: tw.k, tw.window_ms, tw.band, tw.sensors (list)
  revoke = unregister(sensor) via Safe
DASHBOARD (static, Vercel + mirror on Swarm)
  read ENS (viem getEnsAddress/getEnsText via UniversalResolverV2)
  read Arkiv triggers → keep only those whose $creator == resolved live sensor addr
  recompute quorum client-side → show confirmed events + rejections + revocations
  NO server of ours in the read path → "kill the backend" works
```

**Key design decisions** (each closes a risk raised by the research):
1. **Who counts is decided by `$creator`, not by a payload signature.** Arkiv makes `$creator` immutable, and anyone can write entities. The dashboard trusts only triggers whose `$creator` equals the address a **live** ENS sensor name resolves to. This closes the Arkiv "fake readings" risk.
2. **The quorum is recomputed by every reader, not decided by a server.** The phone that completes a quorum *also* writes a `tw.event` entity plus a Swarm pack as a convenience and for permanence. The source of truth stays the triggers plus ENS, so nobody can withhold a confirmation.
3. **Privacy (the P in CROPS).**
   - Phones write **only triggers** (above threshold, in the band), never a continuous stream, so presence at home is not leaked.
   - Sensor names are pseudonymous (`sensor-07`), not flat numbers.
   - Location is only "building".
   - No analytics.
4. **Phone gas.** Every Arkiv write costs the phone tGLM. At registration, the committee page sends a small tGLM drip to the phone's address. No relayer is used, because a relayer would break `$creator`.
5. **ENS roles.** The phone never writes ENS. The Safe holds the building's resolver and registry roles, which avoids the problem that resolver roles can't be scoped per name.
6. **Revocation semantics.** Once a sensor is unregistered, its *new* triggers stop counting. Events confirmed earlier keep their `tw.event` entity and Swarm pack, which carry the signer list and the ENS snapshot at confirmation time.
7. **Permanence.** Arkiv's maximum lifetime is about 182 days, but court cases take longer. The Swarm pack is the long-lived copy. **Stretch goal:** anchor a hash of each event on Sepolia (one `EventAnchor` log), so the record outlives Arkiv expiry. This also strengthens the "why blockchain" answer.

## 4. Stack (proposes resolving `ADR-0002`; Dhruv approves)
TypeScript end to end, as a pnpm monorepo:
- `packages/core`: DSP, trigger detector, anti-spoof features and the quorum algorithm. **Pure functions, unit-tested with vitest.** The smoke test lives here.
- `packages/chain`: Arkiv (`@arkiv-network/sdk` 1.0.1 + viem), ENS reads (viem 2.57.x), Swarm (`fetch` against `api.gateway.ethswarm.org` with the null stamp, or bee-js 13.2.0), Safe (`@safe-global/protocol-kit` 8.0.11).
- `apps/web`: Vite + React PWA with three routes: `/sensor` (phone), `/` (public dashboard) and `/committee` (register, revoke, set params through the Safe).
- `scripts/`: one-off ENS setup (deploy a UserRegistry proxy via VerifiableFactory, `setSubregistry`, grant roles to the Safe), driven from the Sepolia addresses in `docs-ensv2.md`.
- **No contracts are needed for the core build.** The `EventAnchor.sol` stretch goal would use Foundry.
- Hosting: Vercel (the live link) plus the same build uploaded to Swarm (the "survives our domain" link).
- **Smoke test:** `pnpm test` runs a core test that feeds a synthetic 3-phone impact and a 1-phone shake through the quorum, and expects confirm and reject. This must be green in the same commit that resolves ADR-0002.

## 5. Owners
| Person | Owns | Why |
| --- | --- | --- |
| **Dhruv** | `packages/core` (DSP, quorum, anti-spoof), ENS + Safe setup scripts, final architecture calls | Signal processing and smart contracts are his strengths |
| **Akhilesh** | `apps/web` (sensor PWA, dashboard, committee UI), Arkiv + Swarm integration, Vercel and Swarm hosting | Full-stack |
| **Somnath** | Device testing and **measurement runs** (the headline numbers); the drafts of `/arkiv/*.md`, the CROPS README and sponsor form text; the video script; outreach to one housing society or resident; booth questions to the sponsors | Frees both developers to build; the numbers and write-ups are a large share of the judging |

Each person claims their area in the `STATE.md` claims table. Commit small and often (it is a disqualification rule).

## 6. Timeline (IST; hard gates in bold)
| Window | Goal | Exit check |
| --- | --- | --- |
| **Fri 02:00–04:30** · P0 de-risk | Scaffold + ADR-0002 + green smoke test. **Three spikes in parallel:** (a) Dhruv: measure the real sensor Hz on each team phone; (b) Akhilesh: one Arkiv `createEntity` + query **from a phone browser** on Rabdi, with an access key from Arkiv Hub; (c) Dhruv: register `tremorwitness.eth` on Sepolia and deploy a building UserRegistry with roles to a 2-of-3 Safe. | **Go/no-go at 04:30.** All three work, or the fallback in §9 is taken. |
| Fri 04:30–09:00 | Sleep in shifts (one person always awake). | — |
| Fri 09:00–14:00 · P1 vertical slice | Phone trigger → Arkiv → dashboard verifies via ENS → quorum shown live with 3 phones on a table. | **14:00: 3 real phones, a stomp confirmed end to end.** |
| Fri 14:00–20:00 · P2 sponsor depth | Committee UI (register, revoke, params via Safe), Swarm evidence pack, Swarm-hosted dashboard, the kill-backend flow, privacy pass, anti-spoof tuning. Somnath starts the measurement harness. | 20:00: DEMO-0001 runs start to finish. |
| Fri 20:00–23:00 · polish | UI clarity, the judge-join QR flow, a labelled replay mode for judges without a phone. Stretch: Sepolia `EventAnchor`. | **23:00 feature freeze.** |
| Fri 23:00–Sat 04:00 · prove it | Measurement runs: spoof false-accept (N≥50 lone shakes and stomps), true-confirm (N≥50 multi-phone impacts) and the inter-phone PPV spread. Write the `/arkiv/*.md` files, the CROPS README, the ENS write-up and the AI-use notes. | Numbers recorded as `EXP-####` with raw logs in `logs/`. |
| Sat 04:00–07:30 · ship | Record the video (≤3 min, ≥720p, laptop recording, our own voice, no music, includes the kill-backend moment). Fill every form field. Make the repo **public**. Select the 3 partner prizes plus the Swarm bonus. | **Submit by 08:00** (an hour of buffer). |
| Sat 07:30–09:30 | Rehearse the 4-minute demo and the 3-minute Q&A (inspiration, tools and why, challenges; "why a blockchain?"; "phones can't be accurate"). | Judging starts at 09:30. |

## 7. Demo (becomes DEMO-0001 in `DEMO.md`)
1. **Hook (20 s):** the Colaba quote and MMRC 2017's "phones can't be that accurate".
2. **Join:** 4 phones on the table. Two judges scan a QR and their phones become sensors (registered live by the Safe).
3. **Stomp:** confirmed 4/4 within seconds and shown on the dashboard.
4. **Shake one phone alone:** rejected, "no quorum".
5. **Revoke a sensor (Safe 2-of-3):** that phone's next trigger is ignored, and the revocation is public.
6. **Kill the backend:** stop the server and open the Swarm-hosted dashboard. Everything rebuilds.
7. **Close:** our measured numbers (spoof rate, confirm rate, PPV spread), plus a labelled replay of a real construction-site recording.

## 8. Judging map (fills `notes/judging_alignment.md`)
- **Technicality:** the DSP and quorum, with measured spoof and confirmation rates.
- **Originality:** no prior published work found on a phone quorum plus an ENS sensor registry. Never say "unique".
- **Practicality:** it works today with residents' own phones, ideally with one real resident quote from Somnath's outreach.
- **Usability:** judges join with their own phones in about 20 seconds.
- **WOW:** the stomp on the table, then the backend dies and the record lives.

## 9. Risks, fallbacks and what to ask the sponsors
| Risk | Check at | Fallback |
| --- | --- | --- |
| Chrome gives the phones fewer than 30 Hz, or no sensor permission | P0 spike (a) | Use DeviceMotionEvent. Claim **detection plus a coarse band only**. A native APK is a stretch. |
| A Safe can't hold the ENSv2 roles, or UserRegistry deployment fails | P0 spike (c) | A committee EOA holds the roles (still Enhanced Access Control), with the Safe as a roadmap item. **Ask ENS at their booth** which Sepolia address set the judges use. |
| Arkiv rate limits or the browser write fails | P0 spike (b) | Get an access key. If it still fails, writes go via the committee page (weaker on `$creator`, so state it). |
| Swarm free-gateway retention is undocumented | P2 | Also pin the pack's hash in the `tw.event` entity (and in the Sepolia anchor if built). |
| The phone screen locks and readings stop | P1 | Wake Lock, re-acquired on `visibilitychange`. The UI says "keep this screen on". |
| ENS judges read the registry as "just an allowlist" | The write-up | Lead with ENSv2-native features: expiry, revocation, no transfer, role-scoped text records owned by a Safe. |
| "Why a blockchain?" | Q&A | The rehearsed answer (Sheet / WhatsApp / PDF vs co-signed by many flats, unwithholdable), plus the Sepolia anchor if built. |

**Booth questions** (Somnath, Friday morning):
- **ENS:** is a sensor-subname registry central enough? Which Sepolia address set? Is a Safe as role holder fine?
- **Arkiv:** confirm Rabdi for judging; what are the rate limits; is Swarm via the public gateway acceptable?
- **EF:** does a Swarm-hosted dashboard plus killing our server count as structural censorship resistance?

## 10. Open decisions for Dhruv
1. **Approve this plan and stack** (resolves `ADR-0002`). Then fill `VISION.md` (LOCKED; log it in `GOVERNANCE.md`).
2. **Parent ENS name:** `tremorwitness.eth` on Sepolia, or another.
3. **The Sepolia `EventAnchor` stretch:** yes or no. It is recommended because it fixes expiry and strengthens "why blockchain".
4. **Names of a real building or society** for the demo, or keep a fictional `sunrise-chs`.
