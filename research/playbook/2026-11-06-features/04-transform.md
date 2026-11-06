# 04 TRANSFORM (orchestrator): judge the best version of each candidate, not its first

Prompts used: PAIR (combine with?), BOUND (10× / 1/10), USE (who, when), SHIP (smallest shippable), LOOP (what improves each run). Strongest reframing in **bold**. Candidate IDs carried to 05–08 as T1…T12.

## T1 ← H2 Edit-proof record with native Arkiv flags
- PAIR with H7: the "delete an inconvenient reading" row in the attack scoreboard.
- BOUND 1/10: flags only (`readonly` on triggers, `readonly + permissionlessExtension` on events), no hash chain.
- BOUND 10×: witness cosigning of a site head by every phone (D4 F1).
- USE: a resident's phone whose owner is pressured by the contractor to delete readings.
- **SHIP: triggers created `readonly`; each trigger carries `prev` = the same phone's previous trigger key; the dashboard draws a per-phone chain and flags a gap ("reading #14 missing: deleted by its own phone"); sealed events `readonly + permissionlessExtension`, created in one `executeBatch`.** It is cheap, it is visible, and it answers the Arkiv "who can edit each entity" question in the UI.

## T2 ← H3 Permanence chain
- PAIR with T1 (`permissionlessExtension`) and T4 (ENS text pointer).
- BOUND 1/10: just the "keep alive" button + "expires in N days, kept alive by M wallets".
- BOUND 10×: immutable per-event ENS names with contenthash, burned admin roles (D3 F-03).
- USE: a court clerk or journalist 170 days later.
- **SHIP: "Keep this evidence alive" button (any wallet, `extendEntity` allowed by the flag) + expiry countdown + Swarm feed per site whose latest points at the newest pack; the site's ENS text record `tw.feed` holds the feed address.** The immutable per-event ENS name is the 10× version and goes to Tier 2/3.

## T3 ← H4 Split authority on ENSv2
- PAIR with T6 (the phone's own record holds its calibration).
- BOUND 1/10: one setter-role grant per phone (`tw.cal.<label>`), plus a revert demo.
- BOUND 10×: per-phone PermissionedResolver instances + a Safe 2-of-3 + a least-privilege sealer name with ENSIP-26 agent records.
- USE: the society secretary (membership) vs the resident (their own phone's data).
- **SHIP: at join, the committee grants the phone `setText` scoped to `tw.cal.<label>`; the phone signs its own calibration/health record; the "try to write another phone's record → revert" button; the site's rule card (k, window, band, threshold) as text records. The Safe 2-of-3 is the next increment (designed; waits on owner addresses).** Note the phone then needs Sepolia gas as well as tGLM (new dependency on the drip).

## T4 ← H7 Attack scoreboard as the demo spine
- PAIR with T1, T2, T3, T5 (each contributes one refused attack).
- BOUND 1/10: a static checklist on the dashboard that ticks as each moment happens.
- USE: the finalist panel (independent senior ecosystem people, D6) and the EF video.
- LOOP: each rehearsal's outcomes are logged → a measured "attacks refused N/N in rehearsal" number.
- **SHIP: a `/judges` scoreboard page fed live by Arkiv websocket push (D2 F1): six attacks, each a row that turns green with the entity key / tx hash that proves it, a latency badge (stomp→screen), and a reset button.** It also serves as the fallback path (D6: Tokyo failures were survivable only with a second path).

## T5 ← H1 Physics-consistency gate
- BOUND 1/10: amplitude-rank consistency only (no timing): one source ⇒ amplitudes fall with distance from a single point; two separate stompers ⇒ each phone peaks on its own stomper.
- BOUND 10×: full TDOA source location with chirp-measured geometry.
- USE: the collusion attack (two people stomping by their own phones on a countdown).
- SHIP: an `inconsistent-sources` *indicator* (not a reject) from amplitude ranks + each phone's own `lowFPct`/`fDom`, tested on EXP-0002 data.
- **Best version: reframe from "we detect collusion" to "we publish the physics a lawyer would ask for": a per-event consistency panel (amplitude ranks, inter-phone lags with the sync uncertainty stated, coherence) with explicit "insufficient to tell" when the numbers don't separate.** That is honest given EXP-0001, and it still answers Q&A #2 with a measurement plan instead of a dodge. Needs real phones.

## T6 ← H9 Known-source calibration
- PAIR with T3 (record lives on the phone's own ENS key) and T5 (relative sensitivity feeds amplitude ranks).
- **SHIP: "Calibrate" step at join: the spare phone pulses its motor 5×; each phone logs its response amplitude + noise floor as a calibration entity; the dashboard shows each event's PPV range normalised by relative sensitivity with an uncertainty band, and a phone above a noise-floor limit is flagged "deaf: does not vote".** Needs real phones.

## T7 ← H8 Evidence-to-action annex
- BOUND 1/10: one bilingual "request a joint inspection" letter from the sealed pack.
- BOUND 10×: complaint + RTI + BSA s.63(4) Part A draft + DYFI resident reports + engineer-reply trail.
- USE: the society secretary at 9 a.m. after a night of piling.
- **SHIP: report.html "Act on this" section: (a) joint-inspection request and (b) RTI request for the authority's monitoring records for these exact windows, both Marathi + English, printable, client-side, each with the pack SHA-256 and an offline-verify QR; (c) a BSA s.63(4) Part A draft clearly labelled "draft, not legal advice; Part B needs an expert".** Impact-validation required (is this how residents act?).

## T8 ← H5 Measured privacy ledger
- BOUND 1/10: the ledger without anon-rpc (it measures what each host sees today).
- **SHIP: `/privacy` page: every request the session made, grouped by host, with "what this host learns" filled from a fixed map; a toggle routing reads through anon-rpc if the call-through to Arkiv works.** The README P line then quotes measured numbers.

## T9 ← H6 Verify-the-verifier
- **SHIP: `npm run verify-build` rebuilds and compares the sha256 manifest with (a) the live site and (b) an ENS text record `tw.build` written at release.** No in-page self-check (circular).

## T10 ← H10 Language access
- **SHIP: Marathi/Hindi/English toggle on the sensor page and report, icon-first status, 48 px targets, aria-live status; a "data sent tonight" counter.** A 5-second language flip in the demo.

## T11 ← H11 Private annex
- **Best version: an optional encrypted attachment (photos of cracks) with WebCrypto, ciphertext on Swarm, hash on Arkiv, key by QR to the society.** Kept because the Swarm bonus names encryption; low pitch value otherwise.

## T12 ← Materials and compliance (from 03)
- **SHIP: fix `arkiv/swarm.md` (6 items), write `ens/` (which ENSv2 features, where in code, the live names to resolve), a "verify it yourself in 60 s" README block, a per-sponsor deep-link table for the form's code-link field, video chapters with on-screen captions at each sponsor moment, a trust-assumptions table, DEMO.md reset + fallback.**

## Candidates carried to prior-art (05) and impact (06)
Novelty/crowding is only worth checking where it changes the pitch: T5 (phone-array physics consistency as anti-collusion evidence), T1 (gap-evident per-device chains on a queryable ledger), T3 (per-device scoped ENS records), T7 (evidence pack → RTI/complaint annex for residents). Impact-validation where a resident/legal use is claimed: T7, T6 (does relative calibration matter to anyone who would read the record), T2 (do disputes really outlive 182 days, and who would extend).
