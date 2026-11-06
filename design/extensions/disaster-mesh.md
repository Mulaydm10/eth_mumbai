# Extension idea: Disaster Mesh (analysis only, NOT implemented)

Status: **roadmap / pitched as an extension.** Not part of the hackathon build. No code from it is in this repo. Recorded 2026-11-06 ~14:10 IST.

## 1. The idea (Dhruv, paraphrased)
When the quorum fires (≥k phones agree there was shaking), every registered device on the site starts connecting to each other over Bluetooth / hotspot and forms a mesh (borrowing from Dhruv's earlier SafeMesh project), so that in an earthquake or other calamity we know where everyone is and can track each device on a map of the mesh. Execution would be a separate native app; it would be pitched as an extension of Tremor Witness.

## 2. Inputs
- **SafeMesh** (`github.com/Mulaydm10/safemesh`, public, **GPL-3.0**, last push 2026-11-01, i.e. before the hackathon): fork of bitchat-android, ~283 Kotlin files / ~80k lines. Transports: BLE multi-hop (7 hops), Wi-Fi Aware, hotspot. `MeshGraph` debug view (≈ "map of devices"). SOS = public text + GPS, unauthenticated and not rate-limited.
- **An earlier review (pasted by Dhruv, written from an older repo snapshot).** Verdict: don't merge; at most build an opt-in signed check-in; keep the mesh as a roadmap slide.
  - Points that still stand: wrong trigger; circular dependency on internet; browser can't mesh; passive location tracking hurts the CROPS privacy story and DPDP; from-scratch rule and GPL; BLE range; Bridgefy, Briar and bitchat are prior art.
  - Points that are now **stale**: "17 tests" (now 37); `DEMO.md` all TODO (DEMO-0001 drafted); stale `CLAUDE.md` header (fixed); World IDKit as an option (dropped).

## 3. Analysis

### 3.1 What a separate native app fixes, and what it doesn't
| Objection in the review | Fixed by a native companion app? |
|---|---|
| Web Bluetooth can't advertise, run in the background, or form a mesh/hotspot | **Yes.** Kotlin + foreground service, BLE advertise/scan, Wi-Fi Direct/Aware, or Google Nearby Connections (`P2P_CLUSTER`). |
| Two installs, two keys | Partly. The native app gets its own key, registered as a second ENS subname via the same invite flow (`<label>-m.<site>.tremorwitness.eth`), or imports the web key via QR (simpler, weaker). |
| Wrong trigger (construction quorum ≠ disaster) | **No:** a design problem, see 3.2. |
| Internet circularity (quorum is read from Arkiv) | **No**, unless the trigger is computed locally, see 3.2. |
| Passive location tracking vs privacy/CROPS/DPDP | **No:** a design problem, see 3.3. |
| From-scratch rule + GPL | Only if it stays **out of this submission** (pitch only) or is a clean-room build (not a SafeMesh fork). |

### 3.2 The trigger has to change: a separate "disaster tier", computed on the phone
- The construction quorum fires at ~1–3 mm/s on one site, several times a day near piling. That must **never** wake a mesh.
- Disaster tier (proposal):
  - the phone's own DSP sees strong shaking (an order of magnitude above the construction thresholds; the exact number is `TODO`, to calibrate against published felt-intensity data, not invented here);
  - **plus** k registered peers report the same over BLE within the window;
  - **or** the user presses "Emergency" by hand.
- The key insight: `computeQuorum()` (`packages/core/src/quorum.ts`) is pure and deterministic. Phones can gossip **signed triggers** over BLE and each one runs the same function locally. That gives **consensus without servers or internet**, using the same rule the dashboard uses online. This is the most on-thesis part of the whole idea.
- Membership offline: phones cache a snapshot of the ENS site registry (the evidence pack already stores ENS snapshots), so "is this a registered phone?" works offline via T13-style as-of checks against the snapshot.

### 3.3 Location: replace tracking with consent plus a roster
- "Know where everyone is" = passive GPS tracking. That breaks the README promise ("location is only the site"), the EF CROPS rule ("without giving up the other three", privacy being one), and DPDP 2023 consent. GPS is also poor inside or under buildings.
- What is more useful to rescuers, and private by default:
  1. **Roster vs check-in.** The ENS registry already lists every registered phone at the site. After a disaster event, each phone sends a signed "I'm safe / need help" message over the mesh. **Registered minus checked-in = "not heard from"**, the list rescuers actually need, with no GPS. The blockchain is genuinely load-bearing here: the roster is a public, non-forgeable registry.
  2. **Opt-in location, set at registration.** The phone shares the flat/floor its owner typed in (more useful in a building than GPS), plus a last GPS fix if the owner consented, **encrypted to the committee/rescuer key**, and short-lived.
  3. **"Map of devices" = mesh topology** (who hears whom, RSSI): a proximity graph, not coordinates. It shows clusters and which phones went silent.
- SOS authentication fixes SafeMesh's weakness: an SOS counts only if signed by a live subname key. A rate limit per key stops floods.

### 3.4 Is it still a blockchain-hackathon idea?
The mesh transport itself is off-chain by nature. The on-chain parts are real and defensible:
- **ENS:** the roster plus authentication of mesh senders (non-transferable, revocable, expiring subnames).
- **Arkiv:** check-ins and disaster triggers land as entities with built-in expiry once *any* phone reconnects (the existing store-and-forward outbox). The "not heard from" list becomes publicly verifiable.
- **Swarm:** the disaster evidence pack (who checked in when, signed).
- **Offline quorum:** the same pure rule, recomputed by every phone.

The relevance is secondary to the core product (tamper-proof, corroborated vibration evidence), but it is coherent: same phones, same keys, same quorum rule, same registry.

### 3.5 Sponsor effect
| Track | Effect |
|---|---|
| Arkiv | Neutral to slightly positive. Expiring check-ins are a good fit, but there's nothing live to demo. |
| ENS (ENSv2) | Slightly positive: ENS as roster plus sender authentication. |
| EF CROPS | **Positive if opt-in, negative if passive tracking.** "Works when servers *and* internet are down" extends our CROPS story. Passive tracking could cost us the track. |
| Others | No new fit. **The partner picks stay Arkiv (+ Swarm bonus), ENS, EF.** No new prize money is unlocked. |

### 3.6 Risks to state honestly in the pitch
- BLE indoor range ~10–30 m, 7 hops gives a building-sized island, not a city map. Reaching rescuers needs one phone to get connectivity or a rescuer phone to join.
- Android background limits: a foreground service plus Android 12+ permissions (`BLUETOOTH_SCAN/ADVERTISE/CONNECT`, `NEARBY_WIFI_DEVICES`). Battery drain while armed. iOS can't do this in the background.
- Prior art for mesh SOS (Bridgefy, Briar, bitchat, FireChat) and earthquake alerts (Android Earthquake Alerts, MyShake). Our novelty is **registry-authenticated offline quorum plus a verifiable roster**, not the mesh.

## 4. Decision
- **Now (hackathon):** do NOT build it, merge SafeMesh, or put GPL code in this repo. Pitch it as **one roadmap slide plus ~10 s in the video**: "Disaster mode: the same quorum rule runs phone-to-phone over Bluetooth with no internet; only registered phones count; residents check in, and the registry shows who hasn't. Builds on our SafeMesh work."
- **After the hackathon (execution plan, if pursued):**
  1. Spike with Google Nearby Connections (Apache-2.0 client, `P2P_CLUSTER`). Avoids the GPL fork; SafeMesh's BLE code is reused only if the extension itself is GPL.
  2. Port `packages/core` quorum and registry logic to Kotlin, or run it in an embedded JS engine, so online and offline results are bit-identical.
  3. Signed trigger gossip, plus an offline ENS snapshot, plus the disaster-tier threshold (calibrate first, as a new EXP).
  4. Signed check-ins, the "not heard from" roster, and opt-in encrypted flat/floor.
  5. Sync to Arkiv through the outbox on reconnect; a disaster pack on Swarm.
- **Optional, only if DEMO-0001, the video and a public repo are done first:** an in-web-app signed "I'm safe / need help" check-in (online, Arkiv, per site, no GPS). This is the only part buildable inside the current scope and rules.
