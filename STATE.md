# STATE — 2026-11-06 16:30 IST

## M0: code done; real-phone measurements pending (1 phone available)
## M1 (join): code done and tested against stubs + live Sepolia reads; live join pending
Works (verified on emulators / JVM):
- No location permission on Android 12+, mesh still works; Tor off; Nostr off; GPS SOS gone.
- Home screen (TW Mesh) → Join a site / Mesh test / SafeMesh chat.
- Join: invite QR or link → committee signature checked on the phone → gas drips → `/api/ens-register` → name checked
  on Sepolia. Golden vectors (viem) 9/9, join stub tests 5/5, live ENS reads 2/2, all 696 JVM tests pass.

Waiting on Dhruv:
- Install the release APK on the phone, open "Join a site", scan a fresh dashboard invite for the site, name e.g.
  `dhruv-m` → expect "resolves to this phone's key". This uses one of the site's 5 slots (R1 proposed).

## Next
1. After the live join: M2 roster snapshot (cache `listSitePhones` + block + fetch time; show offline).
2. M4 golden vectors for quorum/asOf (no extra phones needed). M3/M5 need 3 phones.
3. Cosmetic: status-bar icons are light-on-light on the Join/Mesh-test screens.

## Blockers
- More Android phones for M0 range/latency and M3 relay.

## How to run
- Debug: `./gradlew :app:assembleDebug`; tests: `./gradlew :app:testDebugUnitTest` (live: `TWM_LIVE=1`).
- Release: `TWM_KEY_PROPS=… tools/build-release.sh` → `app/build/outputs/apk/release/app-arm64-v8a-release.apk`.
- Two-emulator test: both emulators `-read-only`; different app data on each (`pm clear` one).
