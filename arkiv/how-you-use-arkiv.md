# How Tremor Witness uses Arkiv

Code: `packages/chain/src/arkiv.ts` (schemas, reads, writes) · `apps/web/src/main.ts` (phone) · `apps/web/src/dashboard.ts` (dashboard) · `scripts/` (CLI).

## Writes
1. **Phone joins a site:** the phone generates a wallet key in the browser (it never leaves the device). `/api/drip` tops it up with about 0.05 tGLM. This is used for onboarding only and is not in the data path. The phone then writes a `sensor` entity.
2. **Phone detects an impact:** the phone does the signal processing (band-pass, PPV, STA/LTA trigger, tilt-based handling detection) and writes a `trigger` entity, **signed by the phone**, including a waveform excerpt.
3. **A quorum is reached:** any dashboard viewer can **seal** the event. The dashboard builds an evidence pack, uploads it to Swarm, and writes an `event` entity (`eventId`, `swarmRef`, `packHash`).

Measured cost: about **0.00019 tGLM per write** (3 writes = 0.00057 tGLM, `scripts/simulate.ts`).

## Reads (the features users see)
- **Dashboard** (`/dashboard.html?site=<site>`): it lists phones, triggers and confirmed events **read only from Arkiv**, and recomputes the quorum in the browser with `computeQuorum` (`packages/core/src/quorum.ts`). It refreshes every 4 s.
- **Offline viewer** (`/tremor-witness-viewer.html`): the same dashboard as one self-contained HTML file. It reads Arkiv directly with no server of ours.
- **CLI:** `npm run pull -- <site> <minutes>` dumps everything to `logs/`, and `npx tsx scripts/verify-event.ts <site>` re-verifies each sealed event: Swarm pack, then keccak hash, then that its members exist on Arkiv.

## Runnable query
```bash
npm install
npx tsx scripts/pull.ts p2test 1440      # phones + triggers for site "p2test" over the last 24 h
npx tsx scripts/verify-event.ts p2test 1440
```

## Writer addresses
- Each phone writes with its own browser-generated wallet. The dashboard lists every writer wallet with an explorer link.
- Team funder (`/api/drip`, onboarding gas only): `0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F`
- Self-test writers (site `p2test`): created fresh by `scripts/simulate.ts` and printed when it runs.
