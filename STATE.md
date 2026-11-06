# STATE — 2026-11-06 16:10 IST

## Milestone M0 (repo from SafeMesh fork + LOG/STATE + spike): code done, real-phone checks pending
Works (verified):
- GPL-3.0 repo from SafeMesh history, provenance in README, app id `dev.dhruv.twmesh` ("TW Mesh").
- `MessageType.TWM` over SafeMesh's BLE mesh: hello + ping/pong between two emulators, 23/23 pongs, median 35 ms
  (simulated radio). 677 SafeMesh tests + 3 TWM tests pass.
- GPS SOS removed; "Mesh test" screen in its place.

Not done (needs real phones; only 1 available):
- Real 2-phone hello + range/latency (1/5/10/20 m, through a wall, airplane mode + Bluetooth).
- 3-phone relay A→C via B (emulators can't separate radios: all are in range of each other).

## Next
1. M1 strip + join: remove chat UI/Nostr/geohash/Tor/background location; invite QR → key (Keystore) → drip →
   `/api/ens-register` (label `<name>-m`, R1 pending) → name resolves on Sepolia.
2. M2 roster snapshot, M4 golden vectors (no extra phones needed).
3. Real-phone M0/M3 runs when more phones are available.

## Blockers
- More Android phones (have 1).

## How to run
- Build: `./gradlew :app:assembleDebug` (JDK 21 toolchain). Tests: `./gradlew :app:testDebugUnitTest`.
- Release: `TWM_KEY_PROPS=… tools/build-release.sh`.
- Two-emulator test: start both emulators with `-read-only`, `pm clear dev.dhruv.twmesh` on one, open "Mesh test".
