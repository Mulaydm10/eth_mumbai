# TW Mesh (Tremor Witness Disaster Mesh)

Android companion app for **Tremor Witness** (ETHGlobal Mumbai 2026). In disaster mode, registered phones talk
directly over Bluetooth / Wi-Fi with no internet, agree offline that a disaster happened (the same quorum rule as the
Tremor Witness dashboard), and residents check in, so rescuers see who has **not** been heard from. No GPS tracking.

> **Status: early / experimental (milestone M1: join).** Not a safety tool yet.

## Provenance (what comes from where)

This app is a fork of **[SafeMesh](https://github.com/Mulaydm10/safemesh)**, which is itself a fork of
**[bitchat-android](https://github.com/permissionlesstech/bitchat-android)** by permissionless tech. Both are GPL-3.0,
so this app is **GPL-3.0** too (see [`LICENSE.md`](LICENSE.md)). The git history starts with SafeMesh's own commits.

| Part | Origin |
|---|---|
| BLE multi-hop mesh (TTL 7 hops, dedupe, store-and-forward), Wi-Fi Aware / hotspot transports, Noise link encryption, packet format, `com.bitchat.android.*` code, Wear OS module, `docs/` specs | **bitchat-android** (all credit to the bitchat contributors) |
| Encrypted groups, SOS/safety UI changes, README in `docs/SAFEMESH_README.md` | **SafeMesh** |
| `MessageType.TWM` (0x40) packet type and its send/receive hooks; everything under `dev.dhruv.twmesh` (protocol bus, mesh test screen; later: signed triggers, offline quorum, check-ins, roster, Arkiv sync) | **New in this app** (Tremor Witness protocol, BRIEF §5–§6) |
| `dev.dhruv.twmesh.chain` (secp256k1 Ethereum key, EIP-191 sign/recover, ABI, ENSv2 reads on Sepolia), join flow, home screen | **New** (checked against viem golden vectors in `app/src/test/resources/golden/`) |
| Removed: the public GPS SOS (button, GPS lookup) | Replaced later by signed check-ins and opt-in encrypted location |
| Changed: no location permission on Android 12+ (`BLUETOOTH_SCAN` neverForLocation), no background location, no location foreground service; Tor off by default; Nostr relays never connect (`TwmFlags.NOSTR`) | Privacy by default (BRIEF §0.6). The chat UI is kept one tap away for now; its code is still present. |

The package name stays `com.bitchat.android` to keep the upstream diff small; our own code lives in
`dev.dhruv.twmesh`. The app ID is `dev.dhruv.twmesh` ("TW Mesh"), so it installs next to SafeMesh and bitchat.

TW Mesh is a **separate program** from the Tremor Witness web app (MIT). It talks to it only over HTTP and public
chains (ENS on Sepolia, Arkiv); no code is shared between the two repos.

## Build

Requirements: JDK 21 (Gradle toolchain) and the Android SDK.

```sh
./gradlew :app:assembleDebug            # app/build/outputs/apk/debug/app-arm64-v8a-debug.apk
./gradlew :app:testDebugUnitTest        # JVM tests
TWM_KEY_PROPS=/path/to/key.properties tools/build-release.sh   # signed release; keys never enter the repo
```

## Progress
`STATE.md` (current state, overwritten) and `LOG.md` (append-only, IST). Logs name test phones A/B/C only.

## Credits and license
bitchat-android by permissionless tech and contributors; SafeMesh by Dhruv Mulay; TW Mesh by the Tremor Witness team.
Licensed under the **GNU General Public License v3.0**. If you distribute builds, you must make the source available
under the same license.
