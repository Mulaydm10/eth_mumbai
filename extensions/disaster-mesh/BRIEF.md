# Disaster Mesh: build brief for the companion Android app

**Audience:** the Claude Code session that builds this app. Read all of this before writing code.
**Owner:** Dhruv Mulay (team: Dhruv, Akhilesh Nawale, Somnath Ghadge).
**Parent project:** Tremor Mesh, ETHGlobal Mumbai 2026. This app is an **extension**, pitched as one.
**Background analysis (read second):** `design/extensions/disaster-mesh.md` in this repo.

---

## 0. Hard rules (read first, never break)

1. **The Tremor Mesh web app is LOCKED. Do not modify, move, reformat or "improve" anything in this repo outside `extensions/disaster-mesh/`.** That means none of `apps/web/**` (pages, `src/`, the `api/` server functions, `vite.config.ts`, `vercel.json`), `packages/core/**`, `packages/chain/**`, `scripts/**`, the root `package.json` or lockfile, `README.md`, `DEMO.md` or `STATE.md`. Don't run its deploy command. Don't touch its Vercel project or env vars.
2. **Backend changes are made by the main Tremor Mesh session, not by you.** If you need a backend change (new endpoint, new Arkiv schema, a change to joining), write a request in `extensions/disaster-mesh/BACKEND_REQUESTS.md` (format in §8) and tell Dhruv. Build against a stub until it ships.
3. **Build the app in its own repo/folder, not inside this monorepo's workspaces.** Recommended: a new repo `Mulaydm10/tremor-witness-mesh`. Ask Dhruv for the location before creating it. You may *read* this repo's code (`packages/core`, `packages/chain`) as the reference implementation and copy the protocol constants.
4. **Build on SafeMesh, under its licence.** The app reuses the mesh layer of `github.com/Mulaydm10/safemesh` (a GPL-3.0 fork of bitchat-android, pre-hackathon). Therefore:
   - the app repo is licensed **GPL-3.0**, keeping the bitchat and SafeMesh copyright notices and LICENSE;
   - its README states plainly which parts come from SafeMesh/bitchat and which are new (our protocol: §5–§6);
   - the app stays a **separate program** in its own repo. It talks to Tremor Mesh only over HTTP and the chains, so the MIT web app is unaffected. Never copy GPL code into this repo.
   - **Take:** the BLE multi-hop mesh (TTL/7 hops, dedupe, store-and-forward), Wi-Fi Aware/hotspot transports, `MeshGraph` (it becomes the proximity view), and bitchat's link encryption.
   - **Don't take:** the unauthenticated public SOS message, or broadcasting GPS. They are replaced by our signed check-ins (§5.3) and opt-in encrypted location (§5.4).
5. **Never commit secrets.** No private keys, `.env`, the committee passcode or Arkiv keys. The phone's own key lives in Android Keystore / EncryptedSharedPreferences.
6. **Privacy by default.** No passive GPS tracking, ever. Location is opt-in, encrypted to the committee/rescuer key, and short-lived (§5.4). This is a judging requirement (EF CROPS: privacy can't be traded away), not a nice-to-have.
7. **Log as you go**, because sessions hit usage limits. Keep `LOG.md` (append-only, timestamped IST) and `STATE.md` (overwritten each session: what works, what's next, blockers) in the app repo. Commit small and often with real messages.
8. Never invent numbers (thresholds, ranges, battery figures). Measure them, or write `TODO(measure)`.

---

## 1. The idea in one paragraph

Tremor Mesh phones at a construction site already detect vibration, sign readings with their own keys, and count an event only when **k registered phones agree** (an ENSv2 registry of phones, readings on Arkiv, evidence on Swarm). Disaster Mesh adds a **disaster mode**. When shaking far stronger than construction vibration is felt by several registered phones (or someone presses Emergency), the phones **connect to each other directly over Bluetooth / Wi-Fi Direct** with no internet. They agree among themselves that a disaster event happened, using the **same quorum rule** the web dashboard uses. Each resident then **checks in** ("I'm safe" / "I need help"), signed by their registered phone. Because the site's phone roster is public on ENS, **roster minus check-ins = the "not heard from" list**, which is what rescuers need, with no GPS tracking. Everything is stored on the phones and uploaded to Arkiv (and the pack to Swarm) as soon as **any** phone in the mesh gets internet.

**Pitch line:** "The same quorum that proves construction damage keeps working phone-to-phone when the servers and the internet are gone. Only registered phones count, and the registry tells rescuers who hasn't checked in."

---

## 2. Scope

### MVP (build this, in this order)
1. **Join:** the phone gets its own key and registers as an ENS subname at a site via the existing invite flow (§4).
2. **Mesh transport:** discover and connect to nearby app phones, and exchange signed messages (gossip with dedupe and a hop limit).
3. **Disaster trigger:** strong-shaking detection on the phone, plus an Emergency button (§5.1).
4. **Offline quorum:** gossip signed triggers; every phone runs the same quorum function and reaches the same answer (§5.2).
5. **Check-ins:** signed safe / need-help messages gossiped over the mesh (§5.3).
6. **Roster view:** registered phones (from a cached ENS snapshot) vs check-ins, showing "not heard from" (§5.3).
7. **Sync on reconnect:** upload triggers and check-ins to Arkiv (§6).

### Later (don't start until the MVP works on 2+ real phones)
- Opt-in encrypted flat/floor and last location (§5.4); a disaster evidence pack on Swarm; the proximity graph (who hears whom, RSSI); relaying through a rescuer phone.

### Out of scope
- iOS, background mesh on iOS, city-scale range, earthquake early warning (Android Earthquake Alerts / MyShake already do that), and any change to the web app.

---

## 3. Recommended stack (verify each choice in a spike before committing)

- **Android, Kotlin**, minSdk 29+. A foreground service while "armed".
- **Transport: SafeMesh's existing mesh layer** (BLE multi-hop + Wi-Fi Aware/hotspot), from the fork. Start by cloning SafeMesh into the new repo (with its history, so the provenance is visible), stripping the parts that aren't needed (chat UI, Nostr/geohash channels, the public SOS), and carrying our signed protocol messages (§5) as a new message type over its transport. The fallback, if its transport proves unreliable in the M0 spike, is Google Nearby Connections (`P2P_CLUSTER`).
- **Protocol logic must match the web app exactly.** Two options:
  - (a) **Recommended:** bundle `packages/core` (quorum, registry as-of check) and the Arkiv write path from `packages/chain` into one JS file with esbuild, **in the app repo**, reading this repo as a dependency or a copied snapshot. Run it in `androidx.javascriptengine` (or a headless WebView). Then online and offline quorum results are identical by construction, and the official Arkiv TS SDK (`@arkiv-network/sdk` 1.0.1) does the writes.
  - (b) Port to Kotlin and keep the **golden test vectors** (§9) passing.
- **Crypto:** secp256k1 Ethereum keys and EIP-191 `personal_sign` messages (web3j or the bundled viem in option (a)). Addresses must be ordinary Ethereum addresses, because they are the phone's ENS owner and Arkiv `$creator`.

---

## 4. Backend you can use today (read-only contract: do not change it)

Base URL: `https://tremor-witness.vercel.app`. All endpoints are `POST` JSON (except time) and return `{ ok: boolean, error?: string, ... }`. Native HTTP has no CORS problems.

| Endpoint | Body | Returns | Notes |
|---|---|---|---|
| `GET /api/time` | n/a | `{ t: ms }` | Server clock. The web app uses Cristian's algorithm: best of 8 by lowest RTT, offset = t + rtt/2 − local. |
| `POST /api/drip` | `{ address }` | `{ ok, funded, hash? , balance? }` | Tops up Arkiv (Rabdi) gas, tGLM, if the balance is low. |
| `POST /api/drip` | `{ address, chain: "sepolia" }` | same | Tops up Sepolia ETH (for ENS writes). |
| `POST /api/ens-register` | `{ site, label, address, invite }` | `{ ok, name, expiry, existing?, inviteId?, headGrant? }` | Registers `<label>.<site>.tremorwitness.eth` → `address`. **Needs a valid, unused invite** for a new phone (an already-registered address may rejoin). Codes: 403 bad/expired/used invite, 409 conflict. |
| `POST /api/ens-invite` | `{ site, pass }` | `{ ok, inviteId, exp, invite }` | **Committee only** (passcode). The app must NOT hold the passcode. A resident gets an invite (a QR/link containing `invite=...`) from the dashboard. |
| `POST /api/ens-revoke` | `{ site, label, pass }` | `{ ok, txs }` | Committee only. Don't use it. |

**Invite format:** the `invite` string is produced by `encodeInvite` in `packages/chain/src/invite.ts`. It is signed by the committee over `tremor-witness invite v1|site=<site>|id=<inviteId>|exp=<exp>` and is valid for 30 minutes, once. Accept it from a scanned QR (the dashboard's URL carries it as the **`inv`** query parameter: `/?site=…&inv=…`; corrected 2026-11-06) and pass it through unchanged.

**Multi-use invites (v2, live since 2026-11-06, R5):** `POST /api/ens-invite {site, pass, uses: 2-20, ttlMin: 5-360}` returns an invite whose JSON adds `uses`, signed over `tremor-witness invite v2|site=…|id=…|exp=…|uses=…`. `/api/ens-register` admits up to `uses` phones, one per wallet (409 `this phone already joined with this invite` / `invite fully used`), and returns `usesLeft`. A v1 signature with `uses` added fails the signature check (403). The committee issues these (curl or `scripts/mesh-backend-check.ts` shows how); the app never holds the passcode.

**Labels:** `^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$`. **Mesh phones use labels starting with `mesh-`** (for example `mesh-b0a8`) and never take a sensing slot (R1, live). **Phone limits are per site and set by the committee** in the dashboard Setup tab (`/dashboard.html#setup`): ENS text records `tw.max_phones` (web app, default 5, max 20) and `tw.max_mesh` (mesh app, default 15, max 50); `/api/ens-register` enforces them (409 `site is full (N mesh phones)`). The same tab sets `tw.k` / `tw.window_ms` and **`tw.dk` / `tw.dwindow_ms`**, and creates the invite QR (up to 50 uses). Read the limits with `siteLimits` in `packages/chain/src/ens.ts`. Any other label counts as a sensing phone.

### Chains and contracts (constants from `packages/chain/src/ens.ts` / `arkiv.ts`)
- **Arkiv (Rabdi testnet), chain id 7794095.** Use the **public endpoint with no access key.** The project key is origin-locked to the website, and requests without an Origin get 403. Expect rate limits: back off on 429 and batch reads.
- **ENSv2 on Sepolia:**
  - RPC `https://ethereum-sepolia-rpc.publicnode.com`.
  - Parent `tremorwitness.eth`; parent registry `0xf2EC49c03254C9F4F2843B00B1ECF277dDbeF76B`.
  - Resolver `0xFA87654E65542Ad82428f3326c322d6a12C55957`.
  - Committee/deployer `0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F`; deploy block 12072217.
  - Site text records: `tw.k` and `tw.window_ms`.
  - Read the phone list and history with the logic of `listSitePhones` / `siteRegistrationHistory` in `ens.ts`. The load-balanced RPC lags, so use "latest" for the last log chunk and retry.
- **Existing Arkiv schemas** (tag prefix `tremor-witness.v1`): `.trigger`, `.sensor`, `.event`, `.sync`, `.invite`. Field definitions are in `packages/chain/src/arkiv.ts` and `invite.ts`. **Do not write to these with new meanings.** New data goes in new schemas that the backend session adds (R2, R3).

---

## 5. Protocol (MVP)

All mesh messages are JSON, signed by the phone key with EIP-191 over the canonical JSON (sorted keys, no whitespace), and carry `{v:1, type, site, sender (label), addr, tMs, nonce, sig}`. Receivers verify: the signature recovers to `addr`, and `addr` is the registered owner of `<sender>.<site>.tremorwitness.eth` in the cached roster, **as of `tMs`** (same rule as `asOfCheck` in `packages/core/src/registry.ts`). Dedupe on `hash(msg)`. Hop limit 7. Rate limit 10 messages/min per sender (drop extras).

### 5.1 Disaster trigger (a separate tier, NOT the construction trigger)
- The construction pipeline fires at ~mm/s levels several times a day near piling. **That must never arm the mesh.**
- Local detection uses the same DSP chain as `packages/core/src/dsp.ts` (band-pass, PPV velocity, STA/LTA, handling rejection), with a **disaster threshold** = `TODO(measure)`. Calibrate it from published felt-intensity/PGV tables and phone tests (shake table or a strong drop test is NOT valid; document the method). Log the calibration as an experiment.
- The phone broadcasts a `dtrigger` {ppv, fDom, label}.
- **Armed** when the offline quorum (§5.2) confirms k phones within the window, **or** a user presses Emergency (a `dmanual` message; it counts as an alert but is shown as "manual", not "confirmed").

### 5.2 Offline quorum
- Every phone collects verified `dtrigger`s and runs `computeQuorum(triggers, {k, windowMs, isLive})` from `packages/core/src/quorum.ts`.
- `k` and `windowMs` come from the cached site text records (disaster tier: `TODO`, read `tw.dk` / `tw.dwindow_ms` (R2: keys defined, reader `siteDisasterParams` in `packages/chain/src/ens.ts`, committee sets them with `scripts/ens-setup.ts dparams`; **not set on any site yet**, so fall back to `tw.k` / `tw.window_ms` and say so)).
- Clock alignment: the last `/api/time` offset (kept from when online), plus mesh time-exchange (NTP-style RTT over the link) when offline.
- Same inputs give the same output on every phone. Prove it with the golden vectors (§9).

### 5.3 Check-ins and roster
- `checkin` {status: `safe` | `help`, note? ≤ 80 chars}. The latest check-in per sender wins.
- Roster = the cached ENS snapshot of live phones (label, owner, expiry), refreshed whenever online and stored with its fetch time and block number.
- UI: three lists: **Need help**, **Safe**, **Not heard from** (roster minus check-ins since the arm time). Show the snapshot age.

### 5.4 Location (later, opt-in only)
- Off by default. At setup, the user may type a flat/floor and allow "share my last location in an emergency".
- Encrypt it to the committee/rescuer public key (ECIES/secp256k1), attach it only to `help` check-ins, and set a short Arkiv expiry. Never send plain coordinates over the mesh.

---

## 6. Sync to Arkiv when any phone is online
- Every phone keeps an outbox (as the web app does). When online, it writes **its own** messages with its own key, so `$creator` = the phone. Phones never relay-write others' messages under their own key: that would break the trust model.
- Optional (R4): one online phone uploads a **bundle** of other phones' signed messages, which verifiers check signature by signature. Needs a backend request first.
- Gas: call `/api/drip` before the first write; about 0.00019 tGLM per write (measured).
- Schemas (R2/R3, live): `tremor-witness.v1.dtrigger` and `tremor-witness.v1.checkin`, exact fields in `packages/chain/src/mesh.ts` (`DTriggerSchema`, `CheckinSchema`, write/fetch helpers). Both are written `readonly`. Expiry: dtrigger 180 days, check-in 30 days. Verified live: a mesh phone wrote both and they read back with `$creator` = that phone.

---

## 7. Milestones and definition of done
| # | Milestone | Done when |
|---|---|---|
| M0 | Repo from the SafeMesh fork (GPL-3.0, provenance in README) + LOG/STATE + spike | Two phones exchange a "hello" over SafeMesh's mesh layer; a 3-phone relay works; measured range/latency logged |
| M1 | Join | Scan a dashboard invite QR → key in Keystore → drip → `/api/ens-register` → name resolves on Sepolia |
| M2 | Roster snapshot | Offline (airplane mode + Bluetooth on), the app shows the site's live phones from cache |
| M3 | Signed gossip | 3 phones, A→C via B (relay); bad signature / unregistered sender rejected; dedupe and rate limit verified |
| M4 | Disaster trigger + offline quorum | Golden vectors pass; all phones show the same "confirmed" result in airplane mode |
| M5 | Check-ins + "not heard from" | One phone silent → appears under "Not heard from" on the others |
| M6 | Sync | Re-enable internet on one phone → its entities appear on Arkiv with `$creator` = that phone |
| M7 | Demo | A 60–90 s screen recording for the "extension" part of the pitch |

---

## 8. Backend requests (to the main Tremor Mesh session)

Append to `extensions/disaster-mesh/BACKEND_REQUESTS.md`. One row per request: `| ID | date IST | what & why | proposed shape | status |`. Don't implement it yourself. Expected requests (proposed, not built):
- **R1:** let a "mesh" device register without using one of the 5 slots, or allow a role flag, OR confirm the `<name>-m` label approach.
- **R2:** new Arkiv schema `tremor-witness.v1.dtrigger` (site, sensor, tMs, ppvUm, fDomCHz, label, seq, sig) plus site text records `tw.dk` / `tw.dwindow_ms`.
- **R3:** new Arkiv schema `tremor-witness.v1.checkin` (site, sensor, tMs, status, note, encLoc bytes optional), plus a dashboard roster panel (that's a web-app change, so the main session decides).
- **R4:** a bundle-upload format for relayed messages and how verifiers check it.

---

## 9. Golden test vectors
Before trusting the offline quorum, generate fixtures from `packages/core` (`computeQuorum`, `asOfCheck`, `seqGaps`) by running the existing TS functions on sample inputs. Save the inputs and outputs as JSON in the app repo, and make the app's implementation reproduce them exactly. The reference tests in `packages/core/test/*.test.ts` show the edge cases (handling rejection, unregistered sender, window edges, revoked phones).

## 10. Where to read in this repo (read-only)
- `packages/core/src/quorum.ts`, `registry.ts`, `dsp.ts`, `integrity.ts`: the rules.
- `packages/chain/src/arkiv.ts`, `ens.ts`, `invite.ts`, `ensv2-abi.ts`: chain constants, schemas, ENS reads.
- `apps/web/src/main.ts`: how the web phone joins, drips, syncs its clock and keeps its outbox. Read it; **do not edit it.**
- `README.md`, `ens/README.md`, `arkiv/friction.md`: what the judges were told and the known gotchas.
- `design/extensions/disaster-mesh.md`: why the design is shaped this way (trigger tier, privacy, licence).
