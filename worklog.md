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

## 2026-11-06 01:51 IST · Claude Code (for Dhruv Mulay) · Prototype 0: single-phone sensor page
- Dhruv asked to prove one phone first. Built `packages/core` (band-pass, PPV, STA/LTA, features; 6 tests green) and `apps/web` (Vite, vanilla TS).
- Deployed a static build to https://tremor-witness.vercel.app (Vercel project `tremor-witness`). Everything installs locally in this folder (npm workspaces, `node_modules/`); nothing is global.
- Next: Dhruv tests it on a real phone (delivered Hz, stomp vs shake), then Prototype 1 adds Arkiv writes.

## 2026-11-06 02:31 IST · Claude Code (for Dhruv Mulay) · Prototype 1 deployed (web app, up to 5 phones)
- Phones write each detected event to Arkiv Rabdi with their own in-browser key. The dashboard (`/dashboard.html`) reads Arkiv and recomputes the quorum (default k=3, window 2 s, first 5 phones per site count). `npm run pull -- <site> <minutes>` dumps data to `logs/`.
- `/api/drip` tops up new phone wallets from a team funder wallet (key only in the gitignored `.env` and as a Vercel secret). Blocker: the funder has 0 tGLM. The faucet signed in automatically, but it has a human-verification step, which Dhruv must complete.

## 2026-11-06 02:34 IST · Claude Code (for Dhruv Mulay) · Prototype 1 verified end to end
- Dhruv completed the faucet human check in the shared Playwright browser: 10 tGLM went to the funder wallet.
- `scripts/simulate.ts` ran with 3 fresh wallets: live /api/drip funded each, sensors and triggers were written to Arkiv, read back, quorum confirmed 3/3, and the handling trigger was rejected. The live dashboard in a browser showed the same. Gas is about 0.00019 tGLM per write, so 10 tGLM covers roughly 200 phone top-ups of 0.05.

## 2026-11-06 03:43 IST · Claude Code (for Dhruv Mulay) · Prototype 3: ENSv2 integrated and verified
- Dhruv funded the committee wallet with 0.05 Sepolia ETH. Registered **tremorwitness.eth** on Sepolia (ENSv2 contracts-v2 07e55a05 set) with its own UserRegistry + PermissionedResolver; sites test2 and p3test.
- Phones register as <name>.<site>.tremorwitness.eth (owner = phone wallet, roleBitmap 0 = non-transferable, 30-day expiry) via /api/ens-register (committee auto-approves, max 5/site). /api/ens-revoke is passcode-protected (COMMITTEE_PASS, Vercel secret + .env).
- Dashboard trust rule: a reading counts only if the phone's ENS name resolves now to its Arkiv $creator; k/window come from ENS text records. Verified: live phones confirmed, revoked phones rejected, pack carries the ENS snapshot.
- Fixes on the way: ESM .js import extensions for Vercel functions; "latest" for the last log chunk (load-balanced RPC lag). Total Sepolia spend so far is negligible (gas price ~19 wei).

## 2026-11-06 04:38 IST · Claude Code (for Dhruv Mulay) · Offline mode, round-3 test, docs sync
- Built offline mode: store-and-forward outbox and sound-sync clock alignment (core detector + 6 tests, Arkiv `sync` anchors, dashboard correction); also internet reference sync (/api/time, re-sync every 2 min).
- Real 2-phone round at 04:05 IST: only phone-b0a8's 7 stomps + 1 shake reached Arkiv; no sync anchors. The likely cause is that phone-cad2 was not reloaded. Retest pending (teammate asleep).
- Resolved ADR-0002 (TypeScript monorepo), filled the CLAUDE.md canonical commands, updated tests/README.md (LOCKED, logged in GOVERNANCE) and rewrote STATE.md.

## 2026-11-06 05:13 IST · Claude Code (for Dhruv Mulay) · Depth items A, B, E, F
- A: `packages/core/src/coherence.ts` (envelope xcorr + spectral cosine + peak-freq agreement) with 4 tests and `scripts/coherence-eval.ts`. **EXP-0001**: on real 2-phone data it separates same-stomp from different-stomp pairs only weakly, so it's shown as an *experimental indicator* (score + lag), with no collusion claim. Removed the "_none yet_" placeholder row from the append-only experiment log when adding EXP-0001.
- E: `/report.html`: printable evidence report built only from Arkiv + Swarm + ENS, with live hash re-check. Tolerates older packs.
- B: "Be the vibration source" on the phone page (a spare phone's motor). F: Arkiv friction log rewritten with reproductions.
- Waiting: C (Safe 2-of-3 needs 3 owner addresses from Dhruv), D (Swarm gateway approval: ask at booth), EXP-0002 collusion test and the real-phone sound-sync retest.

## 2026-11-06 06:28 IST · Claude Code (for Dhruv Mulay) · Scoped feature playbook: verdict
- Run: research/playbook/2026-11-06-features/ (stopped once at the usage limit, then resumed with append-only workers). VERDICT: fix the trust model before adding features. /api/ens-register is unauthenticated; the dashboard checks current (not as-of) registration, so revoke/expiry un-counts unsealed events; README overclaims ("nobody can withhold", "one server"). Plus the Tier 0 compliance gaps and Tier 1–3 roadmap. Fixed the fresh-clone build (apps/web/public tracked).

## 2026-11-06 06:53 IST · Claude Code (for Dhruv Mulay) · Trust model (T13, T14) + Tier 0
- T13 as-of membership: `packages/core/src/registry.ts` (8 tests) + ENS registration history from logs + Arkiv `$createdAt` → time. Dashboard + packs use it.
- T14 invites: `/api/ens-invite` (passcode) signs a single-use 30-min invite and logs it on Arkiv; `/api/ens-register` requires a valid unused logged invite (existing phones may rejoin). Fixed: signature stored as bytes (Arkiv str ≤128 bytes).
- Tier 0: latest sealed evidence on the dashboard; `arkiv/swarm.md` all 8 items; `ens/README.md`; `docs/AI_USE.md`; `DEMO.md` DEMO-0001 draft + video cut list; README rewritten (accurate CROPS limits, 5 server functions, writer addresses, runnable query); fresh-clone build fixed; simulate.ts uses invites. 29 tests green. Corrected one false claim in ens/README before release.

## 2026-11-06 06:59 IST · Claude Code (for Dhruv Mulay) · T1 + T2a (stopped at usage limit)
- T1: readings created `readonly` with a per-phone `seq`; `seqGaps` core (4 tests). T2a: sealed events are `readonly` + `permissionlessExtension`, with `extendEvent` and a "Keep alive" button. All 3 Arkiv properties verified live (scratch/t1-test.ts). Deployed; not yet browser-checked.
- Resume: browser-check `/dashboard.html?site=t1check` (Keep alive), then T3 (per-phone ENS record), T4-lite (attack checklist), Tier 2 no-phone items.

## 2026-11-06 11:38 IST · Claude Code (for Dhruv Mulay) · Tier 1 complete + Tier 2 (no-phone) items
- T1 readonly + seq gaps, T2a keep-alive, T3 phone-owned ENS head (verified live incl. refusals), T4-lite attack checklist. Dashboard Arkiv load reduced after public-RPC throttling.
- T7 report: SHA-256 + certificate draft + bilingual joint-inspection request. T10 language toggle. T8 measured privacy doc. 33 tests green.
- Not done (Tier 2 remainder): Swarm feed per site, websocket push, verify-build, Safe 2-of-3 (needs owner addresses). Needs phones: DEMO-0001 rehearsal, sound-sync retest, EXP-0002.

## 2026-11-06 15:20 IST · Claude Code (for Dhruv Mulay) · Extension analysis: Disaster Mesh
- Recorded Dhruv's idea plus the earlier review, with an in-depth analysis in `design/extensions/disaster-mesh.md`. Not implemented, by request. Decision: pitch as an extension (roadmap slide plus ~10 s of the video); no SafeMesh (GPL-3.0, pre-hackathon) code in this repo; partner picks unchanged.

## 2026-11-06 15:34 IST · Claude Code (for Dhruv Mulay) · Disaster Mesh build brief
- Wrote `extensions/disaster-mesh/BRIEF.md` (handoff to a separate Claude that builds the native Android companion app) and `BACKEND_REQUESTS.md` (requests R1–R4; only the main session implements backend changes). The brief locks the web app, packages and backend against edits by the app session. No web app code changed.
- 15:45 IST: Brief updated (Dhruv): the app now builds on the SafeMesh code (GPL-3.0 app repo, provenance stated, separate program; take the mesh layer, drop the unauthenticated SOS and GPS broadcast).

## 2026-11-06 17:06 IST · Claude Code (for Dhruv Mulay) · Disaster Mesh backend (R1, R2, R3, R5)
- R5: v2 multi-use invites (`uses` 2-20, `ttlMin` ≤ 360, one join per wallet). R1: `mesh-` labels get a separate cap of 15/site. R2/R3: `dtrigger` and `checkin` Arkiv schemas, plus the disaster quorum text-record reader and setter. R4 deferred. BRIEF corrected (`inv=`, `mesh-` labels, schema pointers).
- Tests: 42 unit (37 core + 5 chain invite/mesh). Live: `scripts/mesh-backend-check.ts meshtest` 12/12 against production. v1 invites and sensing-phone joins verified unchanged.
