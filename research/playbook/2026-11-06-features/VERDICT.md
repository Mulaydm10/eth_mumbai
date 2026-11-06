# VERDICT: Tremor Witness scoped feature generation (DIVERGE → CONVERGE)
Status: **FINAL.** The board fixes are applied (10-gate.md). Orchestrator: playbook (Opus). Each claim cites the stage file that holds its evidence. RUN_LOG.md has the full trace.

## Intake gaps
- **Nothing essential was missing.** BRIEF.md was complete, so no INTAKE REQUEST was sent.
- **Clock.** The repo contains time information (COMPETITION.md, STATE.md, the build plan). I read it and deliberately did not use it for scoping. No branch was pruned for time or difficulty. Difficulty appears only as a note, and sequencing is Dhruv's call.
- **Interruption.** The run hit the 5-hour usage limit at 05:44 IST.
  - D2, D3, D5 and D6 were re-spawned and continued their files by appending.
  - D4's analogies F16 and F18 were never fetched.
  - TinyFish was disconnected for the rest of the run; workers used curl, WebFetch and Playwright instead.
- **Persistence deviations.**
  - `prior-art-adversary` and `impact-validator` only have a Write tool, so each rewrote its file once and kept its log.
  - C2 called the live `/api/drip` twice (testnet tGLM), because its first script crashed after funding.
  - C1's `pull.ts` run wrote one file into `logs/`. That folder is gitignored, so no tracked file changed.
- **Injection text.** No worker reported agent-directed instructions. The Definitive docs were not fetched this run; Definitive was assessed from its track text only.
- **Assumption.** Judges will have Android phones. This is untested, and each live beat has a fallback.

## Mode + why
**DIVERGE → CONVERGE**, in that order and never blended. The task passed the subtlety test (00-intake-and-profile.md) for three reasons:
- **The space is wide:** four sponsor stacks, each with newly shipped primitives.
- **The constraints are coupled:** a gain for one sponsor can cost another.
- **The scoring axis is a judgment call:** for two of the three sponsors it is "native vs bolted-on".

The run surfaced something no frame was set up to find: **the product's trust root is weaker than its pitch** (08 R4). The CROPS-integrity angle found it while auditing.

## Angles run
| Stage | Lens (Sonnet unless noted) | Risk it owned |
|---|---|---|
| D1 | free generator | breadth (22 ideas) |
| D2 | Arkiv + Swarm stack re-check, live RPC/gateway probes | unused Arkiv/Swarm primitives |
| D3 | ENSv2 + EF tooling + other sponsors, Sepolia read-only simulations | unused ENS/EF primitives; whether a 4th sponsor fits |
| D4 | distant analogy (12 domains) | mechanisms a single pass would not reach |
| D5 | extreme user, Indian legal route, accessibility | practicality, reach, legal facts |
| D6 | judges, demo, video, form (sole Playwright user) | judge psychology, finalist patterns, form fields, Q&A |
| 05 | prior-art-adversary | crowding and demand for T1, T3, T5, T7 |
| 06 | impact-validator | whether the problem behind T7, T2 and T6 is real |
| C1 | sponsor fit vs verbatim rubric + compliance audit | cosmetic integrations, missing qualification items |
| C2 | feasibility by intervention (live Rabdi/Sepolia/Swarm, throwaway keys) | whether each primitive behaves as claimed |
| C3 | physics/DSP numbers on real logs + simulation | overclaimed physics |
| C4 | demo and judge red-team | live-failure modes, Q&A danger, overclaims |
| C5 | CROPS / privacy / trust-model integrity | servers in the read path, false README claims |
| Board | correctness · consistency · red-team · goal-fit · reproducibility | errors in this VERDICT |

## Findings (ranked; each with its evidence)
1. **HIGH: the trust root contradicts the pitch.** Source: C5, verified by the orchestrator (08 R4) and the correctness board.
   - `/api/ens-register` has no authentication. Anyone can create a site or register k wallets for one site.
   - The dashboard checks membership *now* (`dashboard.ts` L210–222), although `quorum.ts` `isLive(sensor, creator, tMs)` already accepts a time. A revoke or a 30-day name expiry therefore silently un-counts past events that were never sealed.
   - Two lines overclaim:
     - README: "nobody (… or us) can edit, delete or withhold".
     - Dashboard: "no server of ours decides anything".
   - README calls `/api/drip` "the one server we run". There are four: `drip`, `ens-register`, `ens-revoke` and `time`.
2. **HIGH: a fresh clone cannot build.** Source: C2, reproduced by the reproducibility board.
   - `npm run build -w apps/web` fails at `cp … public/tremor-witness-viewer.html`, because `apps/web/public/` is untracked.
   - Adding `mkdir -p public` before the copy fixes it (tested in a scratch clone).
   - This breaks EF's "O: … whether a user can build and run it from the repo alone".
   - The live site is otherwise byte-identical to a local build (C2, D3).
3. **HIGH: compliance gaps that partners judge from materials.** Source: C1, correctness board.
   - README has no entity-writer addresses.
   - README's runnable query targets site `demo`, which returned 0 rows (C5).
   - `ens/` is linked but does not exist.
   - There is no AI-use statement.
   - `arkiv/swarm.md` meets 3 of the 8 Swarm-bonus items.
4. **HIGH: a judge who opens the link alone probably sees nothing.** Source: C4.
   - The dashboard defaults to a 30-minute window.
   - The only real-phone events are from 03:49–03:51 IST. `verify-event` passes them 4/4 in 2.3–3.0 s (C4, reproducibility board).
   - This is inferred from the HTML default, not from a rendered page.
5. **HIGH: physics cannot carry an anti-collusion claim.** Source: C3, reproduced.
   - The onset scatter between two adjacent phones is about 83 ms (n=7). That figure holds only with residuals truncated at ±300 ms and the clock offset fitted on the same data; at a looser tolerance it is 333 ms.
   - Arrival order cannot be resolved at table or flat scale.
   - Sub-10 ms sync, wavefront location and chirp ranging do not hold.
   - In a model where amplitude falls with distance, amplitude-rank consistency detects two sources this often at 5% false alarm:
     - 30–94% at noise σ=0.2;
     - 18–79% at σ=0.4;
     - 11–37% at σ=0.7.
   - The only measured σ is 0.19, from one stomper at one spot.
   - Adaptive colluders cut detection to 10–71%.
   - **Physics cannot answer "two people stomping by their own phones".** Admission can, through T13 + T14, but neither is built yet.
6. **HIGH: Arkiv `readonly` blocks edits, not the owner's delete.** Source: C2, live on Rabdi.
   - Triggers can be made edit-proof and deletion-evident (T1), never delete-proof.
7. **CRITICAL (fixed in the design): a phone sets its own timestamp.** Source: red-team board, confirmed in code.
   - Each phone writes its own `tMs`. Evaluating membership at `tMs` alone would let a revoked phone backdate readings.
   - T13 below therefore uses the Arkiv inclusion time (`$createdAt`, set by the chain) as well.
   - The same fact means two admitted phones can simply write matching fake timestamps. That is collusion again, and it is answered by admission, not by physics.
8. **Verified and unused today.** Source: C2, live, throwaway keys, site `pb-c2-test`.
   - `readonly` rejects `patchEntity`.
   - `permissionlessExtension` lets a second wallet extend an entity but not patch or delete it.
   - `executeBatch` works with a predicted key.
   - The flags cost no extra gas.
   - Websocket push: 4.2 s median (n=5).
   - A scoped ENS `setText` grant works. Its scope is the **key string**, across every name on the resolver (state-override simulation).
   - Swarm feeds work on the null stamp.
   - anon-rpc's tor path failed; only the non-anonymising passthrough worked.
9. **Impact (06).**
   - **T2 permanence: REAL & COSTLY.** Damage at J.N. Petit (25 Aug 2017); the petition was disposed in July 2025, about 8 years later (FPJ, fetched). This rests on one case.
   - **T7 evidence-to-action: REAL BUT MINOR.** No evidence that drafting is the bottleneck. No Mumbai metro-vibration RTI was found.
   - **T6 calibration: NICE-TO-HAVE.** MMRC's 2017 "can't be that accurate" objection is categorical.
10. **Crowding (05). No prior published work found for any combination below.**
    - T7: 3/10, demand HIGH.
    - T5: 2/10, from one query only.
    - T3: 3/10. ENS's own docs grant avatar-only rights the same way.
    - T1: 6/10 for the mechanism, 2/10 for this combination.
11. **Other sponsors: no (D3).** Keep Arkiv (+Swarm), ENSv2 and EF CROPS. Reasons are in the capability table below.

### Sponsor-stack re-check: every capability the brief named
Status key: **V** = verified live or by simulation this run; **D** = verified in primary docs only; **A** = assumed.

| Capability | Status | Used today? | Decision | Reason / file |
|---|---|---|---|---|
| Arkiv websocket / `watchEntityEvents` | V (4.2 s median push) | No (4 s poll) | Tier 2 | modest latency gain (C2) |
| Arkiv `executeBatch` + predicted keys | V | No | Tier 1 (inside T1) | atomic seal (C2) |
| Arkiv `readonly` flag | V (patch rejected; delete allowed) | No | Tier 1 (T1) | edit-proof, deletion-evident (C2) |
| Arkiv `permissionlessExtension` + `extendEntity` | V (2nd key extends; cannot patch/delete) | No | Tier 1 (T2a) | anyone can keep evidence alive (C2) |
| Arkiv `changeOwnership` ($creator stays) | D | No | Tier 3 | phone hand-over to a successor flat; no demo value (D2 F4) |
| Arkiv count / `$expiresAt` / `atBlock` / indexer `/api/entity/<key>` history | V (atBlock window unmeasured) | No | Tier 2 (inside T2a countdown, T1 history view) | D2 [3] |
| Arkiv node tooling | searched; no node-tooling repo found | — | Reject | not our track (D2 [5]) |
| Arkiv access key (rate tier) | D | No (public tier warns "heavily rate limited") | Tier 0 note | needed for a smooth demo (C4, reproducibility board) |
| ENSv2 per-site UserRegistry (subregistries) | V | **Yes** | keep | the current registry |
| ENSv2 expiring / revocable / non-transferable names | V | **Yes** | keep, evaluated at reading time (T13) | 08 R4 |
| ENSv2 renew (`ExpiryUpdated`) | D (event folded in ens.ts L92) | No button | Tier 2 (with T13 index) | renew instead of re-register |
| ENSv2 EAC argument-scoped setter (`grantSetterRoles`) | V (simulation) | No | Tier 1 (T3) | ENS's own words (C2, D3) |
| ENSv2 per-subname Permissioned Resolver | D | No | Tier 3 | heavier than T3 for the same story (D3 F-02) |
| ENSv2 wildcard resolution (ENSIP-10) | V (our resolver answers unregistered names) | No | Reject as built: needs CCIP-read (a gateway we run) | breaks CROPS C (D3 F-13) |
| ENSv2 record linking / namespace aliasing | D | No | Tier 3 | useful only with several societies (D3 F-04/F-05) |
| ENSv2 contenthash / ENSIP-24 `data()` | V served; committee lacks the role | No | Tier 3 (immutable per-event names) | D3 F-03 |
| ENSv2 "forever names" (burned admin roles) | D | No | Tier 3 | D3 F-03 |
| ENSv2 reverse/primary names for phones | V (null today) | No | Tier 3 | Sepolia path unverified (D3 F-07) |
| ENSIP-25/26 agent records ("agents as namespaces") | D | No | Tier 3; the sealer is deterministic software, never call it AI | D3 F-06 |
| bzz.link via ENS | D: needs mainnet ENS; unapproved hashes go to /forbidden | No | Reject unless Dhruv buys a mainnet name (real money) | D2 [4], friction S1/S3 |
| Swarm feeds | V | No | Tier 2 (T2b) | a convenience pointer; the feed key must be stated (C5) |
| Swarm native encryption via gateway | V upload; docs: the gateway sees the key | No | Reject; client-side WebCrypto only (Tier 3 T11) | D2 [4] |
| Swarm ACT | D upload; browser CORS omits `swarm-act` | No | Reject | D2 F11 |
| Swarm own postage batch | gateway does not expose `/stamps` | No (null stamp) | State it in swarm.md (Tier 0) | buying needs xBZZ + own Bee node |
| EF anon-rpc | tor path FAILED; passthrough only | No | Tier 3 | C2 test 4 |
| EF frame transactions / alt mempool | D: throwaway chain 1337, separate from Arkiv/ENS | No | Reject | D3 F-14 |
| EF walkaway / "unhappy case" test | applied by C5 | — | Tier 0 README C line | C5 |
| World IDKit | D | No | Reject: 4th pick, needs a backend, fights pseudonymity | D3 |
| 0G, Chainlink CRE, Hedera, Whitechain, Arc, Uniswap, 1inch, Definitive | track text only | — | Reject: nothing load-bearing | D3 (Definitive docs not fetched) |

## Tensions resolved (08-reconcile.md R1–R13, plus the board)
- **R1. T1/T3 score with sponsors but stay out of the live 4 minutes.**
  - Partners judge from materials, video and code links.
  - Finalist judges are independent senior ecosystem people (D6, primary).
  - So T1/T3 go into the video and write-ups.
- **R2. The websocket scoreboard page becomes T4-lite:** a checklist on the existing dashboard. Its "deleted reading" and "server off" rows are video beats, not live ones (consistency board).
- **R3. T1 wording: "edit-proof, deletion-evident".** The phone's last reading is the only blind spot. Members of sealed events are also checked by `verify-event.ts`.
- **R4 + red-team F1. Admission, not physics, answers collusion.**
  - That gives T13 (membership at Arkiv inclusion time) and T14 (per-judge invites with a published invite log).
  - **Neither is built yet.** Today the honest answer is "we do not claim collusion resistance".
- **R5–R6. Physics and calibration are scaled down.**
  - T5 becomes a "published physics, says insufficient to tell" panel.
  - T6 drops to Tier 3, because the motor pulse may alias.
  - One honest number remains: the same-stomp PPV ratio between two phones varies by about ±20% (sd(ln)=0.19, n=7).
- **R7. Keep-alive is Tier 1; the Swarm feed is a Tier-2 pointer.**
  - The extender pays tGLM. The right to extend is "anyone"; the gas still has to come from someone.
  - Arkiv's maximum is about 182.5 days *per extension* (D2 docs; friction.md #6), so repeated extension can keep a record alive indefinitely.
- **R8. T7 shrinks to three items,** shipped as materials:
  - a SHA-256 of the pack;
  - a Part A certificate draft;
  - one bilingual joint-inspection request.
- **R9. Ship the measured leak ledger; make no anon-rpc claim.**
- **R10. The build fix is Tier 0.**
- **R11. T3 needs site-unique keys and a little Sepolia ETH** for each phone.
- **R12. A lone judge must see a real event:** show the latest N sealed events regardless of age (red-team F7).
- **R13. EXP-0001's best-fit clock offset is −3.38 s, not −2.8 s.** The conclusion stands.

## Not covered (the honest part)
- **No new feature was run on a real phone.** The last real-phone round was inconclusive (STATE.md).
- **No resident or housing society has been asked.** This is still the top residual from the ideation run.
- **Legal research is incomplete.**
  - The body text of BSA s.63 was not read (indiacode returned 403).
  - The Supreme Court item (22 May 2026, *Pune Bar Assn v UoI*) is reported by LiveLaw as **declining to issue notice** on a challenge to s.63(4). That is not a final determination, and the judgment PDF was not fetched.
  - CPWD specifications, Maharashtra/MMRDA monitoring norms and the Mumbai Heritage Conservation Committee rules were not found or not searched.
  - No lawyer was consulted.
- **Venue Wi-Fi at Jio World Centre is unknown.** The evidence of congestion at India events is a YouTube chapter description only.
- **Nobody rendered the dashboard or viewer this round.**
- **Concurrent Mumbai submissions** cannot be seen.
- **Build reproducibility across machines** was not checked.
- **Two retention windows are unmeasured:** Arkiv's `atBlock` window and null-stamp Swarm retention.
- **T2's REAL & COSTLY verdict rests on one case.**
- **The evidence scripts live in volatile temp directories** (`$TMPDIR/pb-c2`, `/private/tmp/claude-501/pb-c3`), uncommitted.

## Confidence
- **Measured:**
  - All C2 live tests.
  - C3's real-log numbers (with the caveats above) and its simulation numbers (a model, an upper bound).
  - `verify-event` 4/4.
  - Fresh-clone build failure and its fix.
  - Live site identical to the local build.
  - `npm test` 21/21.
  - Every code fact in 08 and 10.
- **Argued:**
  - Every sponsor-score gain.
  - Every demo-time estimate.
  - The websocket "~2 s saved" (poll arithmetic, not end-to-end).
  - The impact verdicts (fetched news, not residents).
- **Unknown:**
  - Whether judges carry Android phones.
  - How venue Wi-Fi behaves.
  - How hard the panel probes the committee key. C4 rates it likely.

## For the human
These are judgment calls only Dhruv can make.
1. **Fix the trust root before adding features?** That means T13 + T14 plus the README rewrite.
   - *My call: yes, first.* It is the only finding that could cost the EF prize outright: "structural beats cosmetic", and the README's C line is false today.
   - Write the README last, and describe only what has shipped (red-team F5).
2. **What does a revoke mean?** It can stop future readings only, or the committee can also mark a phone "void since day one" (red-team F2). A court may want both views.
   - *My call: prospective by default, with a separate, public "void-since" record that the dashboard shows alongside.* Nothing is silently erased.
3. **Who holds committee authority?** A Safe 2-of-3 needs three owner addresses. It answers "who controls the key". It does not fix the team-disappears case (C5).
4. **How much of T1/T3 goes into the video?** T3 adds a Sepolia-gas dependency to the phone's write path.
5. **Run EXP-0002 on real phones** (design in 07-converge-physics.md). It is the only route from "insufficient to tell" to a number.
6. **Keep the motor demo source?** It is a reliable trigger. It is not calibration, so never call it that.

---

## Ranked feature roadmap
**Phones?** = needs real phones to validate. "No" means it can be built and verified with `simulate.ts`, scripts or a laptop. Difficulty is a note, never a filter.

### Tier 0: compliance and honesty (score-moving, demo-critical, mostly docs)
| # | Item | Raises (verbatim) | Deps / risks | Phones? | Difficulty |
|---|---|---|---|---|---|
| 0.1 | Rewrite the README C/P/S lines and the dashboard subtitle to match the code: four servers; reading/verifying needs none of them; who counts = committee-admitted phones; C5's walkaway statement; T3's Sepolia dependency if shipped. **Write it last; list only shipped features.** | EF "C: what you control that the user depends on … and what happens if it goes away or refuses them"; "the other three still hold, or trade-offs are stated in the README" | Honest wording exposes the committee key, so ship T13/T14 first if possible | No | Low |
| 0.2 | Fix the fresh-clone build: `mkdir -p public &&` before the `cp` in `apps/web/package.json` | EF "O: the license, and whether a user can build and run it from the repo alone" | None (fix verified in a scratch clone) | No | Trivial |
| 0.3 | README: entity-writer addresses + one runnable query on a site with a real sealed event (`test2`); align `arkiv/how-you-use-arkiv.md`; get an Arkiv access key for the demo | Arkiv "In your README: the wallet address(es) that wrote your entities, and one query we can run" | Public RPC is "heavily rate limited" | No | Low |
| 0.4 | Complete `arkiv/swarm.md`:<br>• entity key + Swarm ref + openable link<br>• "public gateway's shared null stamp; no batch of our own"<br>• upload command<br>• demo-video timestamp<br>• "no encryption used, so no key on Arkiv"<br>• retention caveat | Swarm bonus: "One Arkiv entity key and the Swarm reference it points to, with a link we can open"; "The postage stamp batch ID … (or who gave you the batch)"; "The moment in your demo video where Swarm is used" | Null-stamp retention is undocumented | No | Low |
| 0.5 | Write `ens/`: features used, code lines, live names to resolve, a revoke tx. Add an AI-use statement. Add per-partner code links for the form. | ENS "ENSv2 features should be central to the product, not a cosmetic add-on"; ETHGlobal form "link to the line of code" (D6, Mumbai workshop transcript); "Say how you used AI" (Arkiv) | None | No | Low |
| 0.6 | Dashboard shows the **latest N sealed events regardless of age**, plus a labelled replay | Arkiv "at least one feature users see reads its data from Arkiv"; finalist Usability | None | No | Low |
| 0.7 | DEMO.md:<br>• C4's 3:40 live script, with a reset and a fallback clip per beat<br>• a hotspot we control<br>• the video cut list with captions: Swarm at 1:50, backend off at 2:15 | EF "including the moment it matters: for example you switch off your backend"; Swarm "The moment in your demo video where Swarm is used" | Venue Wi-Fi; Sepolia/Arkiv RPC latency | Yes (rehearsal) | Low |

### Tier 1: highest rubric and sponsor gain per unit of build

**T13. Membership at the time of writing.**
- **One sentence:** a reading counts only if the phone's ENS name was registered and unexpired both at the reading's Arkiv inclusion time (`$createdAt`, set by the chain) and at its claimed `tMs`. Readings uploaded long after `tMs` (offline outbox) are labelled "uploaded late".
- **Raises:** EF "depth of the lead property: structural (works without you) beats cosmetic (a setting)". ENS "subname setups: expiring, revocable, non-transferable".
- **Native because:** `isLive(sensor, creator, tMs)` already exists in `quorum.ts`, and `ens.ts` L75–96 already folds `LabelRegistered / LabelUnregistered / ExpiryUpdated`.
- **Demo moment (video, 10 s):** revoke a phone; its past reading still counts; a new reading, even one backdated, does not.
- **Evidence it enables:** a `simulate.ts` test: revoke, then a backdated write, is rejected.
- **Deps / risks:**
  - Needs a cached event index with block numbers; the current scan runs in 45k-block chunks on every poll.
  - Needs Arkiv block→time via `getBlockTiming`.
  - Offline readings uploaded after a revoke are lost (stated).
  - Pair with a public "void-since" record if Dhruv chooses one.
- **Difficulty:** Medium-High. **Phones?** No.

**T14. Per-judge committee invites with a public invite log.**
- **One sentence:** the join QR carries a per-person, expiring invite signed by the committee key; `/api/ens-register` refuses calls without one; every invite issued is written to Arkiv, so admissions are auditable.
- **Raises:** EF "S: how keys and user data are protected, and the trust assumptions". ENS "delegate specific rights".
- **Native because:** admission is the product's real answer to fake phones and collusion (08 R4).
- **Demo moment (video, 8 s):** a register call without an invite is refused. Live joining stays as today, with one QR per judge.
- **Evidence it enables:** site squatting is closed; there is a public admission log.
- **Deps / risks:**
  - Still the same single committee key, so the invite is a bearer token. A Safe is the separate fix.
  - Mint invites offline or with the key not on the server, if possible.
- **Difficulty:** Low-Medium. **Phones?** No (one phone flow check later).

**T1. Edit-proof, deletion-evident readings.**
- **One sentence:**
  - Triggers are created `readonly`, each carrying `prev` = the same phone's previous trigger key; the dashboard flags gaps.
  - Sealed events are created `readonly + permissionlessExtension` in one `executeBatch`.
- **Raises:** Arkiv "Do the things you filter on, who can edit each entity, and when it expires fit what your app does?"; "Does each Arkiv feature you use change something your users see?"
- **Native because:** the creation flags carry the trust semantics (verified live, no extra gas).
- **Demo moment (video, 10 s):** "gap after reading #13: deleted by its own phone".
- **Evidence it enables:** a gap count per phone; `verify-event` already checks the members of sealed events.
- **Deps / risks:**
  - Never claim "delete-proof".
  - The phone's last reading is the blind spot.
  - Needs a schema version bump (`v2`).
- **Difficulty:** Low-Medium. **Phones?** No.

**T2a. "Keep this evidence alive" button and expiry countdown.**
- **One sentence:** any wallet can extend a sealed event; the page shows "expires in N days, kept alive by M wallets".
- **Raises:** Arkiv "when it expires fit what your app does"; impact: J.N. Petit took about 8 years (06).
- **Native because:** `permissionlessExtension` lets anyone extend but not patch or delete (verified).
- **Demo moment:** materials, or 8 s of video.
- **Evidence it enables:** extension history from the indexer.
- **Deps / risks:**
  - Only events sealed after T1 carry the flag.
  - The extender pays tGLM.
  - The maximum is about 182.5 days per extension.
- **Difficulty:** Low. **Phones?** No.

**T3. Each phone writes only its own ENS record.**
- **One sentence:** the committee grants each phone a setter role for one site-unique key, `tw.cal.<site>.<label>`; the phone publishes its own sample rate, clock offset and noise floor; writing any other key reverts.
- **Raises:** ENS "Use Enhanced Access Control … to delegate specific rights, like letting an account edit only certain text records on a name".
- **Native because:** it splits membership (committee) from data (phone), which is the EAC model; verified by state-override simulation.
- **Demo moment (video, 15 s):** the phone writes its record; the "write another key" button reverts.
- **Evidence it enables:** a phone-signed diagnostic history that anyone can read.
- **Deps / risks:**
  - The drip must also send a little Sepolia ETH.
  - The scope is the key string across all names on the resolver.
  - The record must never gate counting (C5).
  - The red-team board rates this the most cosmetic Tier-1 item. It stays because it is the only item that moves ENS's named features.
- **Difficulty:** Medium. **Phones?** Build: no. On-phone flow: yes.

**T4-lite. Attack checklist on the dashboard.**
- **One sentence:** rows tick as each attack is refused (handled phone, lone phone, unregistered phone, byte flip, server off); each row links the entity key or tx; plus a reset button.
- **Raises:** finalist WOW + Technicality; EF "works end to end in the demo".
- **Native because:** every row is a refusal the product already makes.
- **Demo moment:** the live spine of C4's 3:40 script (stake → judges join → stomp → spoof refused → revoke → byte flip → backend off, last). The "deleted reading" row is video-only.
- **Evidence it enables:** a rehearsal log of attacks refused N/N.
- **Deps / risks:** the existing 4 s poll; the handling classifier was never rate-measured.
- **Difficulty:** Low. **Phones?** Yes (rehearsal).

### Tier 2: strong additions
**T8. Measured leak ledger.**
- **One sentence:** a page lists every host each page contacts (Arkiv RPC, publicnode Sepolia, the Swarm gateway, our `/api/*`) and what each host learns; the README P line is corrected to match (it also needs to cover the UA string in sensor entities and key reuse across sites).
- **Raises:** EF "P: what each third party (your server, RPC provider, analytics, indexers) learns about the user".
- **Native because:** it turns a README claim into a measurement.
- **Demo moment:** materials, or 10 s of video.
- **Evidence it enables:** a host table captured from a real browser.
- **Deps / risks:** make no anon-rpc claim (the tor path failed).
- **Phones?** No.

**T7-small. Act-on-this annex in the report.**
- **One sentence:** the report adds, all client-side:
  - a SHA-256 of the pack;
  - a BSA s.63(4) **Part A draft** ("draft, not legal advice; Part B needs an expert");
  - one Marathi/English joint-inspection request with an offline-verify QR.
- **Raises:** Arkiv "Who is it for, and would they use it?"; finalist Practicality.
- **Native because:** the evidence pack is already the attachment.
- **Demo moment:** a printed A4 on the table.
- **Evidence it enables:** none measured (impact: REAL BUT MINOR).
- **Deps / risks:** typed personal data must never reach a URL, Arkiv or Swarm (C5); cite no statute from the stage.
- **Phones?** No.

**T2b. Swarm feed per site.**
- **One sentence:** the feed's latest entry is the newest pack; the site's ENS text record `tw.feed` holds the feed address.
- **Raises:** Swarm "which entity field holds the Swarm reference or feed"; "The most useful integration wins".
- **Native because:** one stable address per building.
- **Demo moment:** materials.
- **Evidence it enables:** feed history.
- **Deps / risks:**
  - The feed key is a new mutable pointer: burn it or hold it in a Safe (C5).
  - The evidence is the pack, never the feed.
- **Phones?** No.

**T5. Published-physics panel.**
- **One sentence:** each event shows amplitude ratios, onset lags (±~85 ms) and coherence, and says "insufficient to tell" when these do not separate.
- **Raises:** finalist Technicality.
- **Native because:** Dhruv's DSP is the product's own engine.
- **Demo moment:** video, only if EXP-0002 separates.
- **Evidence it enables:** EXP-0002 numbers.
- **Deps / risks:** never claim collusion detection, source location or sub-10 ms sync.
- **Phones?** **Yes.**

**WS. Websocket push instead of the 4 s poll.**
- **Raises:** Arkiv "Does each Arkiv feature you use change something your users see?"
- **Native because:** Arkiv push is verified live (4.2 s median, n=5).
- **Demo moment:** a faster badge.
- **Deps / risks:** about 2 s saved, by arithmetic; a new transport adds a failure surface.
- **Phones?** No.

**T9. `npm run verify-build` plus an ENS `tw.build` record.**
- **Raises:** EF idea list: "a tool that proves the shipped frontend or extension matches the public repo".
- **Native because:** the live site equals a local build today.
- **Demo moment:** materials.
- **Deps / risks:** needs Tier 0.2 first; the record is written by the same committee key.
- **Phones?** No.

**T10. Language access.**
- **One sentence:** Marathi/Hindi/English toggle, icon-first status, 48 px targets, aria-live, and a "data sent tonight" counter.
- **Raises:** EF "UX: would someone use it without knowing what CROPS means"; finalist Usability.
- **Native because:** the status words are what the product does.
- **Demo moment:** a 5 s language flip on stage.
- **Deps / risks:**
  - On-device Marathi TTS is often missing on Android Go.
  - A low sample-rate mode is not allowed: it breaks the 2–25 Hz band (C3).
- **Phones?** No (yes for TTS).

**Safe. Committee as a Safe 2-of-3 holding the ENS roles.**
- **Raises:** ENS EAC; answers "who controls the key".
- **Native because:** designed in the build plan.
- **Demo moment:** video.
- **Deps / risks:**
  - Needs 3 owner addresses.
  - The Safe Tx Service needs an API key.
  - It does not fix walkaway (C5).
- **Phones?** No.

### Tier 3: roadmap slide only
Each item lists what it is, the reason it waits, and whether it needs phones.
- **T6, motor-referenced calibration and "a deaf phone does not vote".**
  - Why it waits: the motor may alias (C3), and impact is only NICE-TO-HAVE (06).
  - Phones: yes.
- **Immutable per-event ENS names**, with contenthash pointing to the Swarm pack and admin roles burned ("forever names").
  - Why it waits: the committee lacks the contenthash role today.
  - Phones: no.
- **Per-phone Permissioned Resolver.**
  - Why it waits: heavier than T3 for the same story.
  - Phones: no.
- **The sealer as a least-privilege ENS identity with ENSIP-26 records** ("agents as namespaces").
  - Why it waits: it is deterministic software, so never call it AI.
  - Phones: no.
- **anon-rpc reads.**
  - Why it waits: the tor path must work first.
  - Phones: no.
- **T11, a client-side encrypted annex** (photos of cracks), with the key passed by QR.
  - Why it waits: the evidence is public by design.
  - Phones: no.
- **`changeOwnership` hand-over of a phone's readings to a successor flat.**
  - Phones: no.
- **"Did you feel it?" resident reports** bound to sealed events (USGS DYFI).
  - Phones: yes.
- **Contractor claim vs witness record** (parallel vote tabulation).
  - Why it waits: needs the contractor to cooperate.
  - Phones: no.
- **RTI template and complaint-channel router.**
  - Why it waits: no metro-vibration RTI precedent was found.
  - Phones: no.

**Dropped, and not on the roadmap:**
- wavefront source location, chirp ranging and sub-10 ms sync (refuted by C3);
- a 10–20 Hz low-power mode (breaks the band);
- a CCIP-read resolver (adds a server we run);
- an alt-mempool paymaster;
- World ID and every other sponsor.

## Factors Dhruv may not know (sources: D5, D6, C4)
**Judges**
- Finalist judges are independent senior people from the Ethereum ecosystem. They are not ETHGlobal or sponsor staff.
- From ETHGlobal staff at the Mumbai workshop (primary): "if your demo is three minutes of slide and one minute of demo, there's really low chance".
- Judges at Cannes and Tokyo 2026 stayed hours late to talk to every team.

**Past finalists**
- The 5 finalist openings reviewed all stated a concrete stake within about 30 s: npmguard, DIVE, Kura, Takarabako, Enconomy.
- Audience participation worked: hand polls, and a room-wide QR.
- Phone physics impressed the host. Tokyo, on Enconomy: "I didn't know you could actually read the echo off of your phone's microphone".
- Takarabako's hardware failure cost about 10 minutes, and there was no second path.

**Form and video (Mumbai workshop transcript, primary)**
- The video is uploaded to ETHGlobal and auto-checked: 2–4 minutes, at least 720p, speech with no music, about 50–150 MB. It is mandatory for the finalist track.
- Screenshots: 3–6.
- Repos: up to 5.
- Partner prizes: up to **3** partners. For each, at least 20 characters on how you integrated it, with a code link, plus an integration rating and feedback.
- Partners judge "How it's made".

**Q&A, ranked by danger (C4, plus red-team F9). Honest answers for today's product:**
1. *"Two people stomp by their own phones."*
   - We do not claim collusion resistance.
   - Phones count only if the committee admitted them, and admission is the real control. Today that control is weak (one server key, open registration). T13/T14 fix it.
   - Physics publishes what it can and says "insufficient to tell".
   - Do **not** say "independent flats" or "attenuation".
2. *"Is it legal evidence?"*
   - We do not claim admissibility.
   - The pack is hash-verifiable and could accompany a s.63(4) certificate prepared with an expert.
   - Cite no ruling from the stage.
3. *"Who controls the committee key?"*
   - Today, a server-held key decides who counts.
   - The quorum math is public; membership is not trustless yet.
   - A Safe 2-of-3 is designed.
4. *"The phone picks its own timestamp; why believe it?"*
   - Arkiv sets the inclusion time, and an implausible claimed time is flagged.
   - Two admitted colluders can still fabricate (see #1).
   - T13 enforces this. It is not built yet.
5. *"Can a reading be deleted?"*
   - Today, yes, by its own phone.
   - Sealed packs and their hashes survive.
   - T1 makes deletions visible.
6. *"Phones aren't instruments."*
   - This is a corroborated trigger record, not a mm/s measurement.
   - The same-stomp ratio between two phones varies by about ±20% (n=7).
7. *"Records expire."*
   - About 182.5 days per extension, renewable by anyone once T2a ships.
   - The Swarm pack plus its hash outlive the entity.
8. *"Why blockchain?"*
   - Reading and verifying need none of our servers. Show the kill switch.
9. *"Does sound sync work?"*
   - It is built, but the real-phone retest is pending.
10. *"Gas and privacy?"*
    - The drip funds testnet gas for onboarding only.
    - Audio is never stored (sound.ts L28–53, verified).
    - Event times are public by design.

**Indian legal and regulatory**
- **Electronic-records certificate (BSA 2023 s.63(4)).** Part A is filled by the party, Part B by an expert. Each carries a hash, and SHA-256 is named. Source: the Schedule, via advocatekhoj.
- **Supreme Court, 22 May 2026.** The court declined to issue notice on a challenge to s.63(4) (LiveLaw). This is not a final ruling.
- **Vibration limits.** IS 14881:2001 is a *blasting* guideline, with a 5 mm/s lower bound (primary PDF). DGMS Circular 7/1997 covers mining; secondary sources only.
- **Not found:**
  - any metro-tunnelling or piling vibration standard;
  - CPWD or Maharashtra/MMRDA numeric monitoring norms;
  - any Bombay High Court or Supreme Court numeric monitoring order;
  - any Mumbai metro-vibration RTI.
- **Complaint channels.**
  - MMRDA's toll-free line 1800 22 8801 exists, but vibration is not a listed category.
  - BMC's 1916 helpline and the My BMC app exist; no vibration category was found.
  - The Bombay High Court ordered a grievance mechanism for MMRCL in 2018; the contact number found is from 2018 and may be out of date.
- **RTI.** s.2(f) covers electronic records (secondary sources). Contractor-held data is reachable only through the authority.
- **DPDP Act.** Its s.3(c) exclusions are read. Whether it applies to pseudonymous building-level keys is not concluded.

**Accessibility and low-end phones**
- The UI is English-only today.
- A screen-on, wake-lock sensing session drains battery. Plug the phone in overnight (D5).
- Marathi TTS is often missing on Android Go, so ship recorded clips as a fallback.
- Do not lower the sample rate to save power: it breaks the 2–25 Hz band (C3).

**Venue**
- Wi-Fi congestion at ETHGlobal India events is reported with medium confidence. Bring your own hotspot.

## What I am handing back
I found the inconsistencies. Choosing the reframe that resolves them is yours. It turns on one sentence: what the product promises about **who decides who counts, and as of when**. That sentence drives:
- the README's C line;
- Q&A answers #1, #3 and #4;
- the ENS write-up;
- whether revocation is prospective only or also offers "void since day one".

Building the features, rehearsing on real phones and running EXP-0002 are also yours.
