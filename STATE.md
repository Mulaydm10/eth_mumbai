# STATE — 2026-11-06 18:15 IST

## Where we are
| Milestone | Status |
|---|---|
| M0 transport | code ✓, 2-emulator ✓; real range/latency + 3-phone relay need real phones |
| M1 join | ✓ LIVE: 2 emulators joined meshtest via v2 invite, names resolve on Sepolia |
| M2 roster | ✓ (saved per site, age + block shown, offline) |
| M3 signed gossip | ✓ unit + 2 emulators (accept / reject unregistered / dedupe / rate limit); relay via B needs 3 phones |
| M4 quorum + detection | ✓ quorum 307/307; DSP port identical to TS; detector + sensor live; threshold 96.4 mm/s (EXP-0001), phone validation TODO(measure) |
| M5 check-ins | ✓ 2 emulators ("not heard from" works) |
| M6 sync to Arkiv | ✓ byte-identical to mesh.ts (vectors) + live: 2 emulators uploaded own messages, read back by TW code |
| M7 demo video | ✓ 85 s, 16:9 + 9:16 (3 emulators, real ENS + Arkiv, labelled test shaking); voice = macOS say until the ElevenLabs key is renewed |

## Demo plan constraints (Dhruv, 2026-11-06)
Demo phones: APK by public link, not on the tailnet, join + ENS-register on their own.
- R5 (multi-use v2 invite) + R1 (mesh- labels, 15/site) are LIVE (backend 50b5400). One v2 QR → every demo phone joins.
- Public APK: GitHub release v0.6.0 (latest/download link in README and LOG). New builds: bump versionCode, new release.

## Next
1. Dhruv's phone joins meshtest with the same v2 invite (2 uses left, valid until 00:00 IST 7 Nov).
2. Real-phone run (range/latency, relay via a 3rd phone), public APK link for demo phones.
3. EXP-0001 validation: replay published accelerograms through the DSP; false-positive soak.
4. Offline mesh clock exchange (§5.2). Re-voice M7 with ElevenLabs once the key works (cut/prep.py without DEMO_TTS=say).

## How to run
- Tests: `./gradlew :app:testDebugUnitTest` (live: `TWM_LIVE=1`). Vectors: `TW_REPO=… node tools/golden/{chain,core}-vectors.mjs`.
- Release: `TWM_KEY_PROPS=… tools/build-release.sh`.
- Emulator protocol test (debug build only): `am broadcast -n dev.dhruv.twmesh/dev.dhruv.twmesh.DebugRosterReceiver -a WHOAMI|SET …`
  (see `app/src/debug`). Both emulators `-read-only`, different app data.
