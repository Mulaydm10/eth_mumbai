# Recorded demo dataset: `ethmumbai-demo`, 6 Nov 2026, 22:45–23:20 IST

The first 4-phone live rehearsal (EXP-0004), saved permanently because Arkiv entities expire. It's meant as **the reference dataset** for future replays and UI work: a future dashboard can load these files instead of (or next to) live Arkiv.

| File | What |
|---|---|
| `summary.json` | Rules (k=3, 2000 ms, limits), phones, per-phone counts, confirmed events, rejection counts, sound-sync session, sealed events |
| `readings.json` | Every reading (141), with waveform excerpts, Arkiv key, creator wallet, `result` (event / no-quorum / handling / not-registered) and `asOf` (registry check) |
| `registry.json` | ENSv2 phones + registration history, sensor-start records, invite audit, ENS text-record rules |
| `sync.json` | All sound-sync anchors + the session the dashboard used |
| `sealed-events.json` | The sealed event(s): Swarm ref, keccak pack hash, Arkiv key, expiry |

Recreate or extend with `npx tsx scripts/snapshot-site.ts ethmumbai-demo 2026-11-06T17:15:00Z [toISO]`. The result is recomputed exactly like the dashboard (sound-sync correction plus the ENSv2 as-of rule).
