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

## 2026-11-06 16:35–16:55 IST — M2 roster, M4 vectors, M3 signed gossip, M5 check-ins (emulators)
- **Demo requirement (Dhruv):** demo phones get the APK by link, are NOT on the tailnet, and must join + ENS-register
  on their own. The app only uses public endpoints (Vercel API, public Sepolia RPC), so no tailnet is needed. Blockers
  are backend-side: single-use 30-min invites + 5-phone cap → filed **R5** (multi-use v2 invite and/or demo site).
  App: scanning a valid invite now joins immediately; default name `mesh-<last 4 hex of address>`; v2 invite
  message format (R5 proposal) already parsed and verified.
- **M2 roster:** `Ens.registrationHistory` (registry logs + block timestamps → intervals, like siteRegistrationHistory)
  + live phones + block; saved as JSON per site (`RosterStore`), with fetch time; refreshed after join and on home
  resume if older than 10 min; shown with its age and block. Live: 8 intervals on one site, both live phones covered.
- **M4 golden vectors:** `tools/golden/core-vectors.mjs` runs the TW repo's own `computeQuorum` + `asOfCheck` (TS,
  read-only, Node 26 strips types) on 7 hand cases + 300 seeded random scenarios (revoked / late-joining / wrong-owner
  phones, handling labels, window edges, future claims). Kotlin port (`core/Quorum.kt`): **307/307 identical**
  (events, members, median time, ppv min/max, rejected ids + reasons, every as-of verdict).
  Disaster-tier DSP threshold NOT done: TODO(measure); the home screen has a clearly labelled "Test: send a shaking
  signal" for demos instead.
- **M3 protocol:** flat signed JSON per BRIEF §5 (canonical = sorted keys, no whitespace, integers only,
  JSON.stringify escaping); canonical text, signature, wire and id match viem byte for byte. Verifier: signature →
  addr, as-of roster check (heard-at time = recording time), dedupe by id, 10/min/sender. Only ACCEPTED messages are
  relayed (SafeMesh TTL 7), so unregistered phones can't flood the mesh. Own messages re-gossiped every 60 s
  (latest check-in + recent alerts) for phones that arrive later. Messages kept in `mesh-<site>.jsonl` (M6 outbox).
- **Emulator run (2 emulators, debug-only fake roster hook `src/debug`, real code path otherwise):**
  check-ins A safe / B help + note → both phones show the same Need help / Safe lists, silent c-m under
  "Not heard from" (M5 ✓ on 2 devices); both send a test shaking signal within 5 s → both show
  "DISASTER CONFIRMED by a-m, b-m" at the same time (M4 offline quorum ✓ on 2 devices); b-m removed from A's roster →
  A ignores B's next check-in ("1 not registered", log NOT_REGISTERED) (M3 rejection ✓). Relay (3 phones, A→C via B)
  still needs real phones: emulators are all in range of each other.
- Tests: 705 pass (incl. live Sepolia), 3 upstream skipped. Release APK (R8) 20 MB, no debug hook inside, smoke OK.

## 2026-11-06 17:00–17:20 IST — backend live (50b5400): R1, R2, R3, R5; M6 Arkiv upload
- Backend update read (BRIEF §4/§6, BACKEND_REQUESTS, `packages/chain/src/mesh.ts`): v2 multi-use invites live (format =
  our proposal, already supported by the app), `mesh-` labels have their own cap of 15/site (R1), Arkiv schemas
  `tremor-witness.v1.dtrigger` / `.checkin` (R2/R3), `tw.dk`/`tw.dwindow_ms` defined but unset (fallback kept). R4 deferred.
- **Arkiv writes in Kotlin** (`chain/Arkiv.kt`): attribute encoding (name = UTF-8 right-padded bytes32, typeId |
  0x80 when indexed, sorted by name), `execute((uint8,bytes)[])` create op (salt, expiresAt 0, minLifetime = days ×
  43 200 blocks, readonly flag), RLP + EIP-1559 signing, receipt → `EntityCreated` (entity key, owner).
  Golden vectors from the real `writeDTrigger`/`writeCheckin` with a mocked RPC (`tools/golden/arkiv-vectors.mjs`):
  **calldata and signed raw tx byte-identical for all 4 cases** (manual + auto dtrigger, help + safe checkin, UTF-8 note).
- **Live, production (no stubs):** `/api/time` best RTT 219 ms, offset 10 ms. Throwaway key → `/api/drip` funded
  0.05 tGLM → 1 dtrigger + 1 checkin written to Arkiv (site `twm-livetest`, so no real site touched); owner = the key.
  Measured cost: 0.00064 tGLM for 2 writes (≈ 0.00032 per write; BRIEF says 0.00019: our maxFee = 2 × base + tip, the
  charged amount depends on the block's base fee). Read back with the TW repo's own `fetchDTriggers`/`fetchCheckins`
  (`tools/golden/arkiv-readback.mjs`): every field matches, `creator` = the key.
- **M6 in the app** (`Uploader.kt`): own messages only, mapped dmanual → dtrigger kind "manual", dtrigger → "auto",
  checkin → status/note/armMs (time of the alert it answers)/seq; per-site `seq` added to every signed message;
  test shaking signals are never uploaded; drip when balance < 0.002 tGLM; retries every 60 s; status on the home screen.
  **2 emulators, live Arkiv:** A presses Emergency, B "I need help" (note "flat 302"), A "I'm safe" → each phone
  uploaded only its own messages within ~10 s; TW repo reader returns them with creator = that phone, armMs = the
  emergency's time, seq 1/2 and 1.
- Join: shows "N more phones can join with this invite" (`usesLeft`). Live `/api/ens-register` still untested: needs a
  committee invite (the app never holds the passcode).
- Tests: 708 pass, 4 skipped (3 upstream + live-write, which ran separately with TWM_LIVE_WRITE=1).

## 2026-11-06 18:00–18:15 IST — live ENS join (v2 invite, site meshtest) + full live flow on 2 emulators
- Dhruv issued a v2 invite (meshtest, uses 4, 6 h). Both emulators joined through the real join screen (pasted link,
  default name): `mesh-8621.meshtest.tremorwitness.eth` and `mesh-3c2a.meshtest.tremorwitness.eth`. Steps on screen:
  committee signature ✓ → Arkiv gas "already enough" → Sepolia gas topped up → registered → **resolves to this phone's
  key on Sepolia** ✓ → site list saved (5 phones). Invite uses left: 2.
- Live mesh on the REAL roster: both phones show the same Need help / Safe lists; "Not heard from" = the site's 3 other
  registered phones; each phone's check-in uploaded to Arkiv (site meshtest) by itself.
- Found: A saved its site list before B joined, so A rejected B ("not registered") until A refreshed. Fix: on a
  NOT_REGISTERED / NO_ROSTER message, refresh the site list (at most once a minute, needs internet); the sender re-sends
  every 60 s, so the newcomer is accepted on the next round. (Not yet re-run on device.)
- Join now requires `mesh-` names (backend R1: other names take a sensing slot); texts updated for multi-use invites.
- The emulators ran a debug build from before the `usesLeft` display; the server does return `usesLeft`.
- Tests: 708 pass (8 skipped: 3 upstream + 5 live-only).

## 2026-11-06 18:20 IST — public repo + release 0.6.0
- Dhruv OK'd a public repo: https://github.com/Mulaydm10/tremor-witness-mesh (GPL-3.0, SafeMesh history kept).
- Before pushing, our 5 unpublished commits were rewritten to the GitHub no-reply identity (they carried personal
  emails); this repo's git config now uses the no-reply address. Branch `nearby-spike` is NOT pushed.
- Version 0.6.0 (versionCode 41, so it installs over the earlier test APKs; SafeMesh's was 2.1.0/40).
- Release v0.6.0: `twmesh-0.6.0-arm64.apk` (20 MB), `twmesh-0.6.0-universal.apk` (52 MB), `SHA256SUMS.txt`.
  Public download checked anonymously: HTTP 200, checksum matches.
  Demo link: https://github.com/Mulaydm10/tremor-witness-mesh/releases/latest/download/twmesh-0.6.0-arm64.apk
- The temporary tailnet APK server is stopped.

## 2026-11-06 18:20–18:35 IST — M4: real strong-shaking detection (0.7.0)
- **DSP port** (`core/Dsp.kt`): Biquad, VelocityTracker (PPV), STA/LTA, dominant frequency, low-frequency share,
  delivered rate, all ported from `packages/core/src/dsp.ts`. Golden vectors (`tools/golden/dsp-vectors.mjs`, run with
  the TW repo's own `tsx`; Node 26 strip-only mode can't load `dsp.ts`): 5 synthetic signals at 50–400 Hz, per-sample
  acceleration / velocity / ratio; worst relative difference **3·10⁻¹⁴**.
- **Threshold (EXP-0001):** 96.4 mm/s = PGV at MMI VI from the USGS ShakeMap GMICE (Worden et al. 2012; coefficients
  read from ShakeMap's `wgrw12.py`). Starting value; phone validation TODO(measure). Plan: replay published
  accelerograms + false-positive soak at construction sites.
- **Finding:** the web pipeline's "> 50 % energy below 3 Hz = handling" rule would discard earthquakes (synthetic 2–6 Hz
  burst: low-frequency share 0.47–0.70). The disaster tier keeps tilt > 15° and acc > 30 m/s² and drops that rule;
  the quorum handles sway.
- **Detector** (`core/Detector.kt`): web event state machine + disaster tier. Unit tests: strong burst → 234 mm/s,
  structural, disaster; weak burst → event, not disaster; tilting phone → handling; still phone → nothing.
- **ShakeSensor**: Android linear acceleration (requested 100 Hz, delivered rate measured) + gravity for tilt, starts
  once the phone has joined. Events ≥ 96.4 mm/s become signed `dtrigger`s (label structural/handling) that the
  quorum and the Arkiv uploader use (uploaded as kind "auto"). Home screen: sensor rate, live mm/s, last event.
  Emulator: runs at 20 Hz; a ±25 m/s² square wave from the sensor console → 1275 mm/s, tilt 27° → handling (correct
  for an artificial signal).
- Version 0.7.0 (code 42). Tests: 714 pass (8 skipped: 3 upstream + 5 live-only).

## 2026-11-06 18:40–19:10 IST — M7 demo video (+ upload on network return)
- 85 s demo (16:9 + 9:16), built with the demo-video toolchain: `video/shots/emulators.sh` plays the scene through the
  real app on 3 emulators and records them host-side (`adb emu screenrecord`, 30 fps wall clock; `adb shell
  screenrecord` compresses still periods and drifted between phones), `video/terminal.tape` records the Arkiv
  read-back, `video/cut/shots.json` is the edit. Voice: macOS `say` (the stored ElevenLabs key returned 401).
  Mastered −14 LUFS / −1.4 dBTP. Finals copied to the Omen's ~/Downloads (not committed, not published).
- What the video shows, all real except where labelled: 3 phones registered on ENS (meshtest, third phone
  `mesh-36bb` joined live with the v2 invite, 1 use left) → Wi-Fi + data off → each phone sends the labelled TEST
  shaking signal (k = 3 within 2 s from the site's ENS records) → DISASTER CONFIRMED on all three (triggers 12 ms
  apart) → B "I need help · flat 302", A "I'm safe" (C saw A's check-in "via 1 relay") → "Not heard from" from the
  roster → A back online writes its own check-in to Arkiv (~10 s) → read back with the TW repo's fetchCheckins:
  creator = A, armMs = the confirmed alert, test triggers not uploaded.
- Takes that failed (kept honest): take 1 had only 2 phones (meshtest needs k = 3: correctly no confirmation);
  take 2's composite drifted (adb screenrecord timing); take 3 missed one phone's tap (scroll differed).
- App fix found while filming: upload + stale roster refresh now run as soon as the network returns
  (ConnectivityManager callback); before, the outbox waited for the 60 s loop. Offline status reads "no internet".

## 2026-11-06 19:40–20:20 IST — §5.2 clock alignment (offline)
- `core/ClockSync.kt` (pure, JVM-tested): one server-time estimate per phone = monotonic clock (elapsedRealtime) +
  offset, with an error bound that grows by an assumed 100 ppm drift (pessimistic; real drift TODO(measure)).
  Server: Cristian, best of 8 by round trip (err = rtt/2). Neighbour: NTP four timestamps over ONE Bluetooth hop,
  err = neighbour's err + δ/2 (holds for any path asymmetry). A phone adopts a neighbour's time only if the error is
  strictly smaller than its own, so no loops; with ≥ 3 answers, ones that disagree with the majority are dropped.
- `core/TimeWire.kt`: "TWT1" packets, never relayed, never logged/uploaded. Answers are signed EIP-191 by the phone key
  and accepted only from phones registered on the site (saved ENS list). Asking phones ask every 2 min while their
  error is > 100 ms. The fix is saved (same boot exact; after a reboot re-anchored on the wall clock).
- Home screen shows the clock source and ± error; red when the error is > ¼ of the quorum window.
- Tests: 723, 0 failed (new ClockSyncTest: 500 random asymmetric-link cases, true error always within the bound;
  2 hops; no loop back; outlier outvoted; signed wire round trip, tampering detected).
- 3 emulators, live: online, all synced from /api/time (±113–114 ms; round trip ~230 ms). Then Wi-Fi + data off,
  B forgot its time and was set 7 s fast: one exchange → 8 signed answers from mesh-8621 + mesh-36bb, adopted
  mesh-8621 (1 hop, ±134 ms); B's clock vs its own wall clock = −244 ms, vs −237 ms from its own earlier internet
  sync (7 ms apart). C restarted offline: clock restored from disk (±118 ms).
- Limit: with only 2 answering neighbours there is no majority, so the smaller error wins (a registered phone lying
  about its time could skew one neighbour). Emulator Bluetooth is simulated: real BLE δ TODO(measure).
