# LOG (append-only, IST)

Test phones are named A/B/C here; raw device logs stay local (SafeMesh AGENTS.md privacy rules).

## 2026-11-06 15:41 IST — first spike (Nearby Connections, clean-room)
- Before the brief switched to SafeMesh, a clean-room Google Nearby Connections spike was built (`P2P_CLUSTER`,
  hello + 2 s ping/RTT logger). Kept on branch `nearby-spike` as the brief's fallback transport. On the emulator:
  advertising + discovery started in ~1.7–1.9 s; no peer (emulator, single instance). Not measured on phones.

## 2026-11-06 15:50 IST — repo from the SafeMesh fork
- Brief §0.4 now: build on SafeMesh (GPL-3.0). `main` = SafeMesh history (remote `safemesh`, 4 commits) + ours.
- Decisions (Dhruv): app id `dev.dhruv.twmesh` "TW Mesh"; remove the GPS SOS in M0; strip chat/Nostr/geohash/Tor in M1;
  only 1 real phone for now → build ahead, queue real-phone checks; GitHub repo later; committed logs anonymous.
- Build needs JDK 21 (Gradle toolchain); AGP 9.3.1, Kotlin 2.4.10, Gradle 9.6.1, compile/target SDK 37, minSdk 26.
  Unmodified SafeMesh: builds; 677 JVM tests pass (3 skipped). arm64 debug APK 45 MB (Tor/arti native libs).

## 2026-11-06 16:00 IST — M0 code
- New packet type `MessageType.TWM` (0x40): public broadcast, in `SecurityManager.SIGNED_TYPES` (must carry the
  sender's announced Ed25519 signature), dispatched to `dev.dhruv.twmesh.TwmBus`, relayed by SafeMesh's
  `PacketRelayManager` (TTL 7), not added to gossip sync, not BLE-padded. `MeshService.sendTwm()` (BLE origin;
  Wi-Fi Aware TODO).
- `TwmTestActivity` ("Mesh test", replaces the header SOS button): hello, ping every 2 s (lost = no pong in 5 s),
  RTT/loss/relay count per typed distance, RSSI of direct neighbours, shareable log.
- Removed GPS SOS: header button, `sendSos`, `findSosLocation` (no location is read by our code). SOS *receive*
  formatting is still in the code (stripped in M1).
- `TwmPacketTest` (3 tests: wire value, encode/decode round-trip, no BLE padding): pass.

## 2026-11-06 16:07 IST — M0 test on two emulators (simulated Bluetooth)
- Two API 37 emulators (read-only instances, app data cleared on one so the identities differ) found each other
  over the emulator's virtual Bluetooth (peer count 1 within seconds).
- Hello delivered both ways (relays 0).
- 2 s pings for ~46 s: **23 pongs, 0 lost, RTT min 24 / median 35 / max 48 ms**, RSSI −8 dBm (simulated).
- ⚠ Simulated radio: these numbers say the TWM path works end to end; they are NOT range/latency measurements.
  Real BLE range, RTT and the 3-phone relay remain TODO(measure) on real phones.
- Finding for M1: onboarding still asks for background location + precise location (SafeMesh's BLE-scan setup).
  Plan: `BLUETOOTH_SCAN` with `neverForLocation` on Android 12+, drop `ACCESS_BACKGROUND_LOCATION`; location only
  where Android ≤ 11 requires it for BLE scans.

## 2026-11-06 16:10–16:30 IST — M1: strip + join
- **Strip (privacy):** Android 12+ asks for no location at all: `BLUETOOTH_SCAN` neverForLocation, location permissions
  `maxSdkVersion=30`, `ACCESS_BACKGROUND_LOCATION` + location foreground-service type removed; the mesh's own
  permission check (`BluetoothPermissionManager`) had the same location rule and had to change too (first try: mesh
  never started, "Missing Bluetooth permissions"). Verified on 2 emulators (API 37): no location permission granted,
  peers still discovered, TWM pings 13/13 (median 42 ms, simulated radio). Tor default OFF (log: "applyMode: OFF");
  Nostr relays never connect (`TwmFlags.NOSTR`, log: "Nostr disabled in TW Mesh"). Onboarding wording now says
  TW Mesh, no geohash bullet. Chat UI NOT deleted: moved behind "Mesh chat (from SafeMesh)" on the new home screen.
- **Chain code (`dev.dhruv.twmesh.chain`):** BouncyCastle secp256k1 key, EIP-55 address, EIP-191 sign (RFC 6979,
  low-s) + recover, ABI encode/decode, namehash/DNS encoding, ENSv2 reads (site registry via
  `predictProxyAddress`, phone list by replaying registry logs in 45k-block chunks, Universal Resolver `resolve`).
  Golden vectors from viem (`tools/golden/chain-vectors.mjs`, reads the TW repo read-only): 9/9 pass, signatures
  byte-identical to viem.
- **Live read-only check (TWM_LIVE=1):** registry addresses for 2 sites match viem; one site lists 2 live phones, both
  resolve to their owners; site params k=2, window 2000 ms; unknown name → null.
- **Invite format note:** the dashboard QR uses `?site=…&inv=…` (BRIEF §4 says `invite=`); the app accepts both.
- **Join flow:** local checks first (committee signature recovered on the phone, expiry, label), then
  `/api/drip` (Arkiv + Sepolia, non-fatal), `/api/ens-register` (invite passed unchanged), then poll the Universal
  Resolver until the name resolves to the phone key (8 × 5 s). Stub-backend tests (MockWebServer): 5/5.
  Key: generated on first open, stored in EncryptedSharedPreferences (AES-256-GCM key in Android Keystore; Keystore
  has no secp256k1). Screens: TW Mesh home (main screen), Join (scan QR via SafeMesh's ML Kit scanner, or paste link).
- Emulator: fake invite (signed by a test key) refused with "not signed by the site committee"; key shown.
- Release build (R8) signed with the phone-apps key: installs, pings 10/10, invite check works (BouncyCastle survives R8).
  arm64 release APK 20 MB.
- All JVM tests: 696 pass, 5 skipped (3 upstream + 2 live).
- **Not done (needs Dhruv):** the live join — a real dashboard invite on the real phone (uses 1 of the site's 5 slots;
  R1 still "proposed").
