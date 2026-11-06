# 08 Reconcile (orchestrator, 2026-11-06)

Inputs: 05-prior-art.md, 06-impact.md, 07-converge-{sponsor-fit (C1), feasibility (C2), physics (C3), demo-redteam (C4), crops (C5)}.md.
Composition check: the angles **disagreed substantively** (C1 ranks T1/T3 high and C4 keeps them out of the live demo; C5 found a trust-root problem no other angle owned; C3 refuted D1's physics). So the lenses did not overlap.

## Orchestrator verifications made during reconcile
- `apps/web/api/ens-register.ts` (read): **no authentication**. Any caller can create a site (`ensCreateSite`) and register any address up to 5 per site. Confirms C5.
- `apps/web/src/dashboard.ts` L210–216 (read): `isLive` checks that the name resolves to `$creator` **right now** (the comment says so). The `QuorumParams.isLive(sensor, creator, tMs)` signature in `packages/core/src/quorum.ts` already takes `tMs`, which the dashboard ignores. Confirms C5: revoking or letting a name expire un-counts *past, unsealed* events.
- `apps/web/package.json` L8 + `apps/web/.gitignore` L3 + `git ls-files apps/web/public` (empty): the build runs `cp dist-single/dashboard.html public/tremor-witness-viewer.html`, but `public/` holds only an ignored file, so it does not exist in a fresh clone. Confirms C2: **a fresh clone cannot build.** A one-line fix (`mkdir -p public &&`) is Dhruv's to make.
- `logs/.gitignore` ignores everything: C1's `pull.ts` run created only an ignored local file. No tracked repo file changed.

## Tensions and how they resolved

### R1. "Build T1/T3, they score" (C1) vs "keep T1/T3 out of the live demo" (C4)
Both hold, for different judges. Finalist judges are independent senior ecosystem people, not sponsor staff (D6, Mumbai workshop transcript, primary). Partners judge from materials, video and the per-partner field with a code link. **Resolution:** T1 and T3 are built for the sponsor tracks and shown in the **video and write-ups**; the live 4 minutes stays on the existing, rehearsable spine. This is not a contradiction; it is a routing decision.

### R2. T4 scoreboard: "demo spine" (04) vs "cosmetic for sponsors" (C1) vs "new failure surface" (C4)
C2 measured websocket push at a 4.2 s median write→push, against ~2 s of average added latency for the 4 s poll. That is a modest gain. **Resolution:** T4 becomes **T4-lite**: a static checklist on the existing dashboard that ticks as each attack is refused, plus a reset button and a fallback recording. Websocket push drops to Tier 2 (a nice-to-have that Arkiv's "each feature changes something users see" would credit, but not demo-critical).

### R3. T1 "edit-proof record" vs C2's HIGH finding that `readonly` does not stop the owner deleting
C5 had marked enforcement "unverified"; C2 verified on Rabdi: `readonly` blocks `patchEntity`, but the owner's `deleteEntity` succeeds. **Resolution and the honest wording:** triggers become *edit-proof and deletion-evident*. A deleted reading leaves a gap in the next reading's `prev` link. The only blind spot is the phone's *last* reading, and any reading that is a member of a sealed event is also caught by `verify-event.ts` (members-on-Arkiv check, already built). Do not say "delete-proof".

### R4. The biggest finding of the run: the trust root is weaker than the pitch (C5, confirmed by the orchestrator)
No DIVERGE frame owned this; C5 found it while auditing. Three facts:
1. `/api/ens-register` is unauthenticated, so anyone can create a site or fill its slots, and one person can register k wallets for one site.
2. Membership is evaluated *now*, so a revoke or a 30-day expiry silently un-counts past unsealed events. That contradicts README "nobody (… or us) can edit, delete or withhold a confirmed event" for any event not yet sealed.
3. README says `/api/drip` is "the one server we run"; there are four (`drip`, `ens-register`, `ens-revoke`, `time`).
**Why this matters most:** the #1 Q&A danger (C4, D6) is "two people stomping by their own phones" or "the contractor adds 5 phones". C3 showed physics cannot answer it robustly (amplitude-rank 11–94% detection depending on decay/noise; adaptive colluders defeat it). **The honest answer is governance: phones count only if the committee admitted them, and admission is evaluated at the time of the reading.** Today both halves of that answer are false. Two new Tier-1 features follow (added to the roadmap as T13, T14):
- **T13 Membership at the time of the reading.** Evaluate `isLive(sensor, creator, tMs)` from the ENS registry's register/unregister/expiry history (Sepolia logs or the registry's own expiry field), not the current state. A later revoke stops *future* readings only, which is exactly the build plan's stated semantics (build-plan §3 decision 6) and the EF "C" claim. Native to ENSv2 (expiring, revocable names) and to the existing `isLive(…, tMs)` hook. No real phones needed (simulate.ts can test it).
- **T14 Committee-admitted join.** The join QR carries a committee-signed, single-use, expiring invite (EIP-712, `site`, `label`, `expiry`); `/api/ens-register` verifies it. Judges still join in ~20 s by scanning the QR. Closes site squatting and self-registration.
Also: correct the README C/S lines (C5's walkaway statement) and the dashboard subtitle "no server of ours decides anything".

### R5. T5 physics: D1 (wavefront, sub-10 ms sync, chirp ranging) vs C3 (refuted)
C3 measured 83 ms onset scatter between two adjacent phones (n=7); arrival order is unresolvable at table or flat scale. Amplitude-rank separates one source from two only at favourable decay and noise. **Resolution:** T5 survives only as a *published physics* panel ("amplitude ratios and onset lags with ±~85 ms uncertainty; 'insufficient to tell' when they don't separate"), Tier 2. Never claim collusion detection, source location or sub-10 ms sync. D6's draft Q&A answer citing "independent flats" and "attenuation" overclaims (C4) and must be dropped.

### R6. T6 calibration: impact NICE-TO-HAVE (06) + motor aliasing risk (C3)
MMRC's objection is categorical ("can't be that accurate"), so per-phone calibration would not answer it (06). C3: a 150–300 Hz motor sampled at 50–68 Hz may alias unpredictably. **Resolution:** Tier 3. Keep one honest number instead: the same-stomp PPV ratio between two phones repeated with sd(ln) = 0.19 (n=7, one stomper, one spot), i.e. about ±20%.

### R7. T2 permanence: REAL & COSTLY (06) vs "a feed adds a mutable key" (C5)
06 found the J.N. Petit damage (25 Aug 2017) was disposed in July 2025, about 8 years later, so a 182-day record is a real gap. C2 verified `permissionlessExtension` lets a second wallet extend (but not patch or delete). **Resolution:** the *keep-alive button + expiry countdown* is Tier 1 (cheap, verified, cited). The Swarm feed is Tier 2, framed as a convenience pointer: the evidence is the immutable pack + its hash, never the feed. Note: keep-alive needs tGLM from the extender; the "anyone" claim is true of rights, not of gas.

### R8. T7 evidence-to-action: demand HIGH (05) vs REAL BUT MINOR (06)
05 found demand and that the Supreme Court upheld the s.63(4) hash certificate (22 May 2026, fetched by the prior-art agent). 06 found no evidence that drafting is the residents' bottleneck. **Resolution:** Tier 2, and a small, specific version only: the report gains a **SHA-256** of the pack next to the keccak (the certificate schedule names SHA-256; our packHash is keccak256), a Part A draft labelled "draft, not legal advice; Part B needs an expert", and one bilingual joint-inspection request citing only the Elphinstone precedent as reported. It moves Practicality and Arkiv Reach in materials; it is not a demo beat.

### R9. T8 privacy: "anon-rpc reads" (D3) vs tor-js failed (C2)
Only the non-anonymising passthrough worked; tor-js never became ready in 170 s. **Resolution:** ship the *measured leak ledger* (Tier 2, strengthens the P line with real hosts: Arkiv RPC, publicnode Sepolia, Swarm gateway, our API) and make no anon-rpc claim. Also fix the P line omissions C5 found (the full user-agent string in sensor entities; key reuse across sites).

### R10. T9 verify-build: live == repo (D3, C2) vs fresh clone fails to build (C2, orchestrator)
**Resolution:** the build fix becomes a Tier-0 compliance item (EF "O: … whether a user can build and run it from the repo alone"). The verify-build script is Tier 2 after that.

### R11. T3 scoped ENS setter: "phone writes only its own record" vs C2's MED (scope is the key string, across all names on the resolver)
**Resolution:** use site-unique keys (`tw.cal.<site>.<label>`) and demo the revert against a *different key*, not a different name. The phone needs a non-zero Sepolia balance (gas price was 16 wei: negligible, but the drip must also send Sepolia ETH). C5: calibration must never gate counting. State the new dependency in the README C line.

### R12. Lone-judge view (C4 HIGH) and runnable query (C1 MED, C5 note)
The dashboard defaults to a 30-minute window, and the only real events are from 03:49–03:51 IST, so a judge opening the link alone likely sees nothing (inferred from the HTML default; not rendered). The README uses site `demo` (0 rows in C5's probe) while `how-you-use-arkiv.md` uses `p2test` (simulated data only). **Resolution:** Tier 0: default to "latest sealed events" (or 24 h), point README and Arkiv files at one site that has a real-phone sealed event (`test2`, verified 4/4 by C4 in 2.3 s), and keep a labelled replay.

### R13. EXP-0001 clock offset
C3: the best-fit offset is −3.38 s, not −2.8 s; the "weak separation" conclusion stands. Note for Dhruv to append to the experiment log (append-only rule).

## Process notes
- Persistence deviations: `prior-art-adversary` and `impact-validator` have only a Write tool, so each rewrote its file once (logs kept). C2 called the drip twice because its first script crashed after funding. All recorded in RUN_LOG.md.
- No fetched content contained agent-directed instructions in this run (every worker reported "none seen"). The Definitive docs were not fetched.
