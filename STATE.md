# STATE — 2026-11-06 16:55 IST

## Where we are
| Milestone | Status |
|---|---|
| M0 transport | code ✓, 2-emulator ✓; real range/latency + 3-phone relay need real phones |
| M1 join | code ✓ (stub + live reads); live join on Dhruv's phone pending |
| M2 roster | ✓ (saved per site, age + block shown, offline) |
| M3 signed gossip | ✓ unit + 2 emulators (accept / reject unregistered / dedupe / rate limit); relay via B needs 3 phones |
| M4 quorum | ✓ 307/307 golden vectors; 2-emulator confirmed; real shaking detection = TODO(measure), test button meanwhile |
| M5 check-ins | ✓ 2 emulators ("not heard from" works) |
| M6 sync to Arkiv | not started; needs R2/R3 schemas (messages already kept on disk as outbox) |
| M7 demo video | not started |

## Demo plan constraints (Dhruv, 2026-11-06)
Demo phones: APK by public link, not on the tailnet, join + ENS-register on their own.
- Needs **R5** (multi-use invite and/or demo site above 5 phones) — filed, proposed.
- Needs a **public APK link** (tailnet link won't work for them) — ask Dhruv (e.g. GitHub release).

## Next
1. Live join on Dhruv's phone; then a 2-phone real run (range/latency, check-ins, test quorum).
2. M6 against stubs (R2/R3 shapes), outbox upload with own key.
3. Disaster-tier detection: calibration method to agree with Dhruv (no invented threshold).

## How to run
- Tests: `./gradlew :app:testDebugUnitTest` (live: `TWM_LIVE=1`). Vectors: `TW_REPO=… node tools/golden/{chain,core}-vectors.mjs`.
- Release: `TWM_KEY_PROPS=… tools/build-release.sh`.
- Emulator protocol test (debug build only): `am broadcast -n dev.dhruv.twmesh/dev.dhruv.twmesh.DebugRosterReceiver -a WHOAMI|SET …`
  (see `app/src/debug`). Both emulators `-read-only`, different app data.
