# 03 Cross-pollination (orchestrator, 2026-11-06)

Inputs: 02-diverge-free.md (D1, 22 ideas), 02-diverge-arkiv-swarm.md (D2, 17), 02-diverge-ens-ef.md (D3, 14), 02-diverge-analogy.md (D4, 18), 02-diverge-narrow-legal.md (D5, 18 + legal table), 02-diverge-judges.md (D6, 15 demo moments + 8 materials items + 15 Q&A). About 120 raw items.
This stage **combines**; it does not judge. Merge reasoning is kept because it is the easiest thing to lose.

## Orchestrator spot-checks made while reading (facts, not judgments)
- **Sound sync never stores audio** (`apps/web/src/sound.ts` L28–53: mic samples go through a Goertzel detector in memory, output is muted, only the heard-instant is written). D6's Q15 answer is now grounded.
- **Sound-sync timing resolution:** `createScriptProcessor(2048, …)` at 48 kHz is ~43 ms per callback; blocks are dated back from `performance.now()` at the callback. Sub-10 ms alignment (assumed by D1 I-01/I-15) is NOT established; plausible jitter is tens of ms. Matters for every arrival-time idea below.
- **Arkiv creation flags are unused** (`grep readonly|permissionless packages/chain/src/arkiv.ts` → nothing). D2 verified the flags in docs and that our 6 live events have `readonly:false, permissionlessExtension:false`.

## Clusters and the hybrids they produce

### H1. Physics-consistency gate (anti-collusion, the weakest Q&A answer)
Ingredients: D1 I-01 wavefront map, I-02 moveout check, I-03 distance decay, I-15 chirp ranging; D4 F5 arrival-lag vs geometry (radio-astronomy coincidence), F8 noise-floor station quality, F13 uncertainty band; D6-8 room seismograph.
**Merge:** sound sync already makes every phone hear the same acoustic event. If each phone also emits a short chirp in turn, the *acoustic* time of flight gives phone-to-phone distances (D1 I-15) — the geometry is self-measured, nobody types it in. Geometry + aligned clocks then give a *plausible arrival-order and amplitude-rank envelope* for a single ground source (D4 F5, D1 I-03). A trigger set that is "simultaneous everywhere" or whose amplitude ranking implies two sources becomes a new reject reason `non-physical` (D1 I-02), shown with an uncertainty band (D4 F13).
**Why it is the strongest technical hybrid:** it attacks Q&A #2 ("two people stomping by their own phones") using Dhruv's RF/radar background (TDOA, coincidence detection), and it is DSP, not blockchain decoration.
**Known tension carried forward:** sample period 15–20 ms + sync jitter of tens of ms vs table-scale lags under 1 ms. Arrival-order checks can only work at building scale (tens of metres). Amplitude-rank is scale-free and may be the honest core. CONVERGE must compute this.

### H2. Gap-evident, edit-proof record using native Arkiv flags
Ingredients: D2 F14 `readonly` flag, F7 `executeBatch` atomic seal, F2 `permissionlessExtension`, F5 indexer entity history; D1 I-04 per-phone hash chain + heartbeats, I-05 silence proof; D4 F1 cosigned site head (Sigsum witness), F2 gossip, F17 liveness ticks.
**Merge:** make the entity flags carry the trust semantics. Triggers are `readonly` (a phone cannot patch its PPV after the fact). Each trigger also carries `prevKey`/`prevHash` of the same phone's previous trigger (D1 I-04), so a phone deleting its own embarrassing reading (a stated CROPS trade-off today) leaves a visible gap. Optionally each trigger also quotes the latest sealed-event id the phone saw, which is the cheap form of witness cosigning (D4 F1/F2). Sealed events are `readonly + permissionlessExtension`, written in one `executeBatch` (D2 F7).
**Why native:** the Arkiv rubric asks verbatim "who can edit each entity, and when it expires fit what your app does?" This makes that answer concrete and checkable, at the cost of flags at creation time.

### H3. Nobody-can-kill-it permanence chain
Ingredients: D2 F2 permissionless "keep alive" + F3 "expires in" + F8 Swarm feed per site + F17 pack-health re-upload; D3 F-03 immutable ENS event name with contenthash, F-11 walkaway kit; D1 I-07 feed as site ledger, I-21 re-seal relay; D4 F15 "find my evidence" beacon.
**Merge:** three layers, each run by a different party: (a) Arkiv event entity with `permissionlessExtension`, so any resident, journalist or court clerk can press "keep alive" and the UI shows "kept alive by N wallets" (D2 F2); (b) a Swarm **feed** per site whose latest update points at the newest pack, giving the bonus its "reference or feed" field (D2 F8); (c) the ENS site name carries the feed/pack pointer (text or contenthash), so the pointer outlives our domain (D3 F-11). The immutable per-event ENS name (D3 F-03) is the strongest-but-heaviest variant.
**Answers:** Q&A #4 (182-day expiry) and EF "C: … what happens if it goes away".

### H4. Split authority on ENSv2 (three scoped role-holders)
Ingredients: D3 F-01 phone writes only its own record (grantSetterRoles, verified by simulation), F-02 per-phone resolver, F-06 quorum agent with least-privilege name (ENSIP-26 "agents as namespaces"), F-08 serverless Safe 2-of-3 with QR-passed signatures, F-07 reverse names; D1 I-11, I-12; D4 F12 rule card in ENS text records.
**Merge:** membership (register/revoke) sits with the committee (Safe target, funder key today); each phone holds a setter role for exactly one text key `tw.cal.<label>` and publishes its own calibration/health there; the sealer process holds a role only for event pointers. Demo: the phone writes its own record, then tries another phone's key and gets the EAC revert on screen. The rules (k, window, band, threshold) are a human-readable "rule card" in text records (D4 F12).
**Why:** ENS prize text asks for precisely "letting an account edit only certain text records on a name". Carry forward: grants are per resolver instance, not per name (D3 verified), so the key must be phone-unique.

### H5. Measured privacy: leak ledger + anon-rpc reads
Ingredients: D3 F-09 anon-rpc for browser reads (nox live on Sepolia; call-through to Arkiv untested), F-12 leak ledger; D5 F13 "what is public" panel; README P line.
**Merge:** a page that logs every outbound request the app makes (host, what it can learn) and renders the README's P table from live data; a toggle routes reads through anon-rpc and the table changes. Writes stay direct, by design (`$creator` must be the phone).
**Note:** EF allows only one EF prize, so this strengthens CROPS P rather than entering the anon-rpc track.

### H6. Verify-the-verifier (O and C letters)
Ingredients: D3 F-10 build hash (live site byte-identical to a fresh local build, verified), D1 I-09 multi-provider reader, I-10.
**Merge:** release script writes the build manifest hash to an ENS text record `tw.build`; `npm run verify-build` (or the offline viewer opened from a downloaded copy) compares. Multi-RPC cross-check applies to Sepolia reads (several public RPCs exist); Arkiv has one RPC, so it cannot apply there. D3's warning stands: a page cannot verify itself.

### H7. The attack scoreboard as the demo spine
Ingredients: D1 I-19 adversary table, I-08 pull-the-plug; D6-2/3/4/5/6/14 (stomp, spoof refused, revoke live, kill backend, byte flip, airplane outbox); D2 F1 websocket push with latency badge; D6 Cannes/Tokyo patterns (stake in 30 s, audience participation, "I didn't know a phone could…").
**Merge:** structure the 4 minutes as attacks, each refused by a named primitive, ticking a scoreboard on the big screen:
| Attack | Refused by | Sponsor |
| --- | --- | --- |
| shake one phone in hand | DSP handling classifier | (Technicality) |
| one phone alone | k-of-n quorum | Arkiv query |
| revoked or unregistered phone | ENSv2 subname resolves now | ENS |
| edit one byte of the pack | keccak on Arkiv vs Swarm bytes | Arkiv + Swarm |
| delete an inconvenient reading | per-phone hash chain gap (H2) | Arkiv |
| switch off our servers | offline viewer reads Arkiv/ENS/Swarm | EF CROPS |
Websocket push makes stomp→screen fast enough to feel live (D2 F1).

### H8. Evidence-to-action annex (Practicality, Reach)
Ingredients: D5 F4 complaint letter, F5 RTI template, F6 joint-inspection request, F7 BSA s.63(4) Part A helper, F8 committee view, F9 channel router, F15 "why it shook" explainer, F17 WhatsApp share; D4 F3 DYFI "did you feel it" reports, F4 PVT contractor-claim comparison; D6-9 contractor view, D6-10 printed report with QR.
**Merge:** `report.html` gains a client-side bilingual annex generated from the sealed pack: a joint-inspection request (citing only the Elphinstone precedent as reported), an RTI request for the authority's own monitoring records for those exact windows, and a pre-filled BSA s.63(4) Part A certificate draft carrying the pack's SHA-256. Every page has a QR that re-verifies offline. "Did you feel it?" one-tap resident reports (DYFI) attach human corroboration to a sealed event.
**Why native:** the evidence pack is already the attachment; this answers the impact finding that residents wanted *monitoring and action*, not a ledger (2026-11-05 06-impact-physical.md).

### H9. Known-source calibration with the motor (data quality)
Ingredients: D1 I-13 join-by-tapping calibration; D5 F16 calibration logbook; D4 F8 noise floor, F11 persistence rule (stuck sensor), F13 uncertainty; the existing spare-phone motor source (5×700 ms); H4's own-record.
**Merge:** at join, the spare phone's motor pulse is a known reference; each phone logs its response and noise floor as a calibration record (Arkiv entity and/or its own ENS `tw.cal.<label>` from H4). The dashboard then shows a per-phone relative sensitivity and an uncertainty band on each event's PPV range, and a deaf or stuck phone gets a quality flag (it does not vote).
**Why:** turns Q&A #1 ("phones aren't calibrated") from a concession into a measured relative band.

### H10. Language and low-end access
Ingredients: D5 F1 Marathi/Hindi/English toggle, F2 on-device voice prompts, F14 large-text screen; F3 low-end mode; F11 data-cost meter.
**Merge:** icon-first sensor screen with a three-language toggle and a "data sent tonight: N KB" counter. **Conflict carried forward:** D5 F3's 10–20 Hz low-rate mode would break the 2–25 Hz band (Nyquist), so it is rejected as stated; battery/wake-lock items survive.

### H11. Resident-held private detail (Swarm encryption)
Ingredients: D2 F10 WebCrypto-encrypted pack with the key in the URL fragment, F11 ACT (browser CORS likely blocks); D1 I-06 k-of-n threshold unlock.
**Merge:** the public pack stays public; an optional private annex (e.g. a resident's photos of cracks, or their flat number) is encrypted client-side, its ciphertext hash on Arkiv, key shared by QR. Threshold unlock mirrors the quorum (k residents release it).
**Tension:** evidence wants to be public; nothing in the current pack is secret. Kept as a candidate only if a real private item exists (photos of cracks inside homes are one).

## Materials and compliance items (not features, but score-moving; carried straight to CONVERGE)
- `arkiv/swarm.md` misses 3 bonus items and has 3 partial ones (D2 §6): an entity key + ref + openable link; the demo-video moment; an explicit "no encryption used, so no key on Arkiv"; "null stamp, shared by the public gateway, no batch of our own"; an upload command; and the retention caveat.
- README points to `ens/`, which does not exist (orchestrator, 00). ENS judges read materials.
- Submission form facts from the Mumbai workshop (D6, primary): video uploaded to ETHGlobal, auto-checked; 3–6 screenshots; per-partner explanation ≥20 chars **with a code link** plus an integration rating plus feedback; "How it's made" is what partners judge.
- D6 M1–M8: a "verify it yourself in 60 s" block, a per-sponsor deep-link table, video chapters with on-screen captions at each sponsor moment, a trust-assumptions table, and a `/judges` page.
- DEMO.md has no reset or fallback (D6); live hardware failure was survivable at Tokyo only with a second path.

## Dropped at merge (with reasons)
- D3 F-13 CCIP-read resolver: adds a gateway we control (C/P regression).
- D3 F-14 alt-mempool paymaster: different chain from everything we use.
- D2 F12 GSOC/PSS alerts: need a Bee node; the gateway does not expose them.
- D5 F3 low sample-rate mode: breaks the band (see H10).
- D4 F10 eBird reviewer tiers: adds a human moderator, which is a censorship point.
- Other sponsors: D3 found no load-bearing case. World is the only real hook (one human per phone), and it fights pseudonymity and needs a backend plus a 4th pick.
