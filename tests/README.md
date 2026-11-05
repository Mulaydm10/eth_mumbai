> **LOCKED governing file.** Do not edit in place. See `GOVERNANCE.md`.

# Tests

Stack resolved by `ADR-0002` (TypeScript monorepo). **Run `npm test` from the repo root**: it runs every workspace's tests.

- Smoke test: `packages/core/test/quorum.test.ts`: a 3-phone impact is confirmed, a lone shake is rejected.
- Unit tests: `packages/core/test/dsp.test.ts` (PPV, rate, features, STA/LTA), `packages/core/test/sync.test.ts` (sound-sync detector + clock alignment).
- End to end (live networks, costs testnet gas): `npx tsx scripts/simulate.ts <site> 3`, then `npx tsx scripts/verify-event.ts <site>`.

Real-phone results are logged in `research/tremor-witness/LOG.md` with raw data pulled to `logs/`. Do not fake a number: anything not measured on real phones is labelled simulated.
