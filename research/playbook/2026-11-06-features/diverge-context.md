# Shared product context for DIVERGE workers (read-only input; do not edit)

Repo root: `/Users/mulaydm10/Dhruv/ETH mumbai`. Live: https://tremor-witness.vercel.app (`/?site=` sensor PWA, `/dashboard.html?site=`, `/report.html`, `/tremor-witness-viewer.html` offline single-file viewer).

**Product (do not change it):** "Residents' phones form a tamper-evident vibration record nobody controls." Android phones in neighbouring flats near metro tunnelling / demolition / piling in Mumbai detect construction vibration. An event counts only when k of n ENS-registered phones feel it within a window. Each phone signs its own readings to Arkiv; sealed evidence packs go to Swarm; every viewer recomputes the quorum in the browser; the record survives our servers going off.

**Built and live:**
- `packages/core/src/`: `dsp.ts` (band-pass 2–25 Hz, PPV via integration, STA/LTA trigger, dominant freq, low-freq ratio), `quorum.ts` (k-of-n in a window, deterministic, `isLive` registry hook, reject reasons handling/not-registered/no-quorum), `sync.ts` (3-tone 3/5/7 kHz sound sync, Goertzel detector, align clocks by shared instant), `coherence.ts` (experimental waveform coherence; weak separation in EXP-0001, no collusion claim).
- `packages/chain/src/`: `arkiv.ts` (schemas `tremor-witness.v1.{trigger,sensor,event,sync}`; trigger expiry 30 d, sensor 7 d, event 180 d; trigger stores ~1.5 s 3-axis waveform JSON in a bytes field), `swarm.ts` (JSON upload to public gateway with null stamp), `ens.ts` (ENSv2 on Sepolia: `tremorwitness.eth` → site subregistry → phone subnames; register with expiry, revoke via unregister, list, resolve; k and window from site text records).
- `apps/web/`: Vite PWA (sensor page, dashboard, printable evidence report with live Swarm hash re-check and ENS at-sealing vs now, offline viewer). Vercel functions: `api/drip.ts` (tGLM onboarding gas, 0.05 per phone), `api/ens-register.ts`, `api/ens-revoke.ts` (passcode-gated; committee is a server key today), `api/time.ts` (reference clock, Cristian's algorithm).
- Store-and-forward outbox (writes queued offline). Demo vibration source: a spare phone's motor pulses 5×700 ms.
- Scripts: `simulate.ts` (3 simulated phones E2E), `pull.ts`, `verify-event.ts` (Swarm pack ↔ Arkiv hash ↔ members exist), `ens-setup.ts`, `coherence-eval.ts`.

**Known weaknesses:** coherence weak (no collusion claim); phone clocks 2.8–3.3 s apart unsynced; committee is a server key (Safe 2-of-3 designed, not done); Swarm HTML hosting blocked by gateway approval; bzz.link needs mainnet ENS; no real resident/society asked yet; phone PPV 50–370 mm/s on close stomps is a corroborated trigger record, not geophone-grade; Arkiv max lifetime ~182.5 d vs years-long disputes; phones need gas via our drip server; public RPC rate limits.

**Hackathon:** ETHGlobal Mumbai, From Scratch track, team of 3 (Dhruv: DSP/ML, RF/radar signal processing, smart contracts, full stack; Akhilesh: full stack; Somnath: other). Finalist rubric (no weights): Technicality, Originality, Practicality, Usability (UI/UX/DX), WOW. 4-min demo + 3-min Q&A. Video 2–4 min (EF wants ≤3), no music, no TTS, no speed-up, no phone recording. Partner picks (max 3): Arkiv Build on Arkiv (+ Swarm bonus, free), ENS Best Use of ENSv2, EF Best CROPS App. Verbatim sponsor rubrics: `research/playbook/2026-11-06-features/01-commitments.md` §A. Sponsor research already captured: `research/tremor-witness/sponsors/` (ethglobal-*.md verbatim track text; docs-*.md developer docs) and `research/playbook/2026-11-05-ideation/sources/sponsor-tracks-verbatim.md` (all 41 tracks).

**Hardware:** Android phones only (Chrome), 50–68 Hz delivered, mic + vibration motor available. No geophones.

**Off the table:** pivoting the product; generic "AI chat about your data"; token/speculation mechanics; crowded headline patterns (agent spending caps, x402 marketplaces, identity wrappers) except as a small supporting feature with a clear reason; anything that makes our server load-bearing for reading or verifying (breaks the EF CROPS claim).

**Do not prune ideas for build difficulty or time.** Give a build-difficulty note instead.
