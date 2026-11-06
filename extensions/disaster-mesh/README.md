# Disaster Mesh: companion Android app (extension, not part of the judged build)

Everything about the Disaster Mesh extension is in this folder. The Android app's code is in [`app/`](app/). It was merged in on 2026-11-06 from `Mulaydm10/tremor-witness-mesh` with its full commit history (git subtree), and **from now on it is developed here**.

| What | Where |
|---|---|
| App source (Kotlin, GPL-3.0) | [`app/`](app/) (the old repo [tremor-witness-mesh](https://github.com/Mulaydm10/tremor-witness-mesh) still hosts the APK releases) |
| Latest pre-release (demo build) | [v0.8.0](https://github.com/Mulaydm10/tremor-witness-mesh/releases/tag/v0.8.0) |
| Last stable release | [v0.7.0](https://github.com/Mulaydm10/tremor-witness-mesh/releases/tag/v0.7.0) |
| Idea + analysis | [`design/extensions/disaster-mesh.md`](../../design/extensions/disaster-mesh.md) |
| Build brief given to the app's Claude session | [`BRIEF.md`](BRIEF.md) |
| Backend changes it asked for (and their status) | [`BACKEND_REQUESTS.md`](BACKEND_REQUESTS.md) |

## v0.8.0 APKs (SHA-256)
| File | SHA-256 |
|---|---|
| `twmesh-0.8.0-arm64.apk` (most phones) | `4da00ab606bad60c88a1bd76d5b9d99ffb584f50381f525bdb0ae41e3bfe3356` |
| `twmesh-0.8.0-universal.apk` | `412255f3100a6be9ffb19789fb26c7c94dc24cfdf7d17f234935df8355c1f20d` |

Check a download with `shasum -a 256 twmesh-0.8.0-arm64.apk`.

## How it connects to this repo
The app is a separate program that talks to the same public backend as the web app.
- **Joining:** the same invite QR as the web app, created in the dashboard Setup tab (`/dashboard.html#setup`). The app registers ENSv2 subnames starting with `mesh-`.
- **Per-site limits and rules:** the ENS text records `tw.max_mesh`, `tw.dk` and `tw.dwindow_ms`.
- **Data:** disaster triggers and check-ins are Arkiv entities `tremor-witness.v1.dtrigger` and `tremor-witness.v1.checkin`. Their schemas are in [`packages/chain/src/mesh.ts`](../../packages/chain/src/mesh.ts).
- **Quorum:** the same quorum rule as `packages/core`.

## Provenance and license
- The app is built on SafeMesh, Dhruv's earlier fork of bitchat-android. The Tremor Witness parts were added at the event. To see which commits came from where, run `git log -- extensions/disaster-mesh/app`.
- The app is GPL-3.0; its license is in [`app/LICENSE.md`](app/LICENSE.md). The rest of this repo is unchanged: the app is a separate program that only talks to the public backend.
- **Build:** open `app/` in Android Studio, or run `cd extensions/disaster-mesh/app && ./gradlew assembleDebug`. The npm workspaces don't include it, so `npm test` is unaffected.
