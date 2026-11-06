# 09 Board red-team (devil's advocate) - angle: attack VERDICT.md recommendations (T13/T14, Tier 0 honesty, demo scope, tiering, judge question). Read-only.

## Log
- [read] VERDICT.md in full; 08-reconcile.md L28-29 (T13 definition); 07-converge-crops.md L19, L64; 07-converge-demo-redteam.md L20, L72.
- [read] packages/chain/src/ens.ts L50-185, ensv2-abi.ts L90-137; apps/web/api/ens-register.ts, _committee.ts; packages/core/src/quorum.ts L18,40; apps/web/dist main bundle (sensor payload `tMs:F` where F = wallMs from the phone clock + server offset).
- [grep] `isLive` only in quorum.ts (signature takes tMs, line 40 call `p.isLive(t.sensor,t.creator,t.tMs)`); dashboard.ts L210-216 uses current resolve. dashboard.html L21 `value="30"`.

## Findings

### F1 CRITICAL - T13 as written keys membership to `tMs`, which the phone itself writes; revocation becomes backdate-able
Evidence: quorum.ts L40 passes `t.tMs`; main bundle shows payload `{site,sensor,tMs:F,...}` with F computed on the phone (Date.now plus an offset fetched from /api/time, and `correctTime` shifts it further via sound sync, sync.ts L42). An Arkiv entity's tMs is an attribute chosen by the writer. If T13 evaluates "registered and unexpired at tMs", a phone revoked at 14:00 (found fake) can write a reading today stamped 13:00 and it still counts. The VERDICT's own R3/R4 claim "a later revoke stops future readings" is therefore false unless the time used is the Arkiv/chain block timestamp of the write (unforgeable) instead of tMs, and that must be bounded to |block_time - tMs| < skew. Sure: high (code read). 
Change to VERDICT: T13 text must say "membership evaluated at the entity's Arkiv creation block time (or min(tMs, block time) with a max-skew check), never at the phone-supplied tMs"; add a simulate.ts test: revoke then write a backdated trigger => rejected.

### F2 HIGH - T13 removes the only after-the-fact remedy for a discovered fake phone (court angle: bug as specified, feature only if paired)
Evidence: ens.ts L82-96 replays LabelRegistered/Unregistered/ExpiryUpdated as a current-state fold; LabelUnregistered carries no "effective-from" or reason and `ensRevokePhone` (ens.ts L148-155) is unregister only. Under T13 a revoke is purely prospective, so readings a colluder wrote while admitted keep counting for every past event, and unsealed events cannot be corrected. For a court that is arguably correct (do not rewrite history), but then the VERDICT should say a discovered-fake needs a second, explicit primitive: a committee "void-since" record (e.g. ENS text `tw.void.<label>=<timestamp>`) whose application is itself visible and logged, so verifiers can show both views (counted-at-the-time vs counted-after-voiding). Currently Tier 1 offers no way to say "this phone was fake from day one". Sure: high on logic, medium on what a court prefers.
Change: add to T13 an explicit "void-since" semantics and state both views on the dashboard; put it in the Q&A (#1 collusion).

### F3 HIGH - T13 implementation cost is understated ("Medium"): the registry logs have no timestamps and the scan is already slow
Evidence: ensv2-abi.ts events L130-135 (LabelRegistered with expiry, LabelUnregistered, ExpiryUpdated) DO exist, so history of register/unregister/renew is reconstructible (CLEAR on the existence question). But none of the events carry block time; each needs a getBlock lookup; ens.ts L70-77 already scans from ENS_DEPLOY_BLOCK in 45k-block chunks over a public RPC with retry/sleep, on every dashboard poll. Also ExpiryUpdated sets only `newExpiry`; the registry has no "expiry at time t" view (getExpiry is current only, ens.ts L56), so a reading in a window before a renew must be derived from the fold, and the original expiry comes from LabelRegistered. Name expiry + re-registration under a new owner in the same label is handled only via tokenId map (TokenRegenerated) which is untested for time-slicing. Sure: medium-high.
Change: Difficulty Medium-High; require a cached, per-block-ordered event index (with block timestamps) and a unit test on ordering, and note that `ens.ok` path latency worsens.

### F4 HIGH - T14 moves trust to the same single hot key and adds a demo-day availability dependency
Evidence: _committee.ts L1: "The committee key is the team funder key (Vercel secret)"; ens-register.ts already auto-approves any address (L12-26, no auth). Under T14, either (a) the invite is signed by that same key on the server (no new trust, the endpoint just checks a signature the same server minted = cosmetic), or (b) minted offline by a committee laptop (real separation, but the committee must be present and minting for every phone a judge scans; a 5-phone cap MAX_PHONES_PER_SITE exists). A QR is a bearer token: a colluder simply photographs it, so single-use stops reuse but not "contractor gets 5 invites". It binds admission to a human/committee decision only if the committee decides who gets a QR - which is the governance statement, and that is what T14 should be sold as, not as a technical guarantee.
Change: reword T14 as "admission is a committee decision, auditable, via invite log"; choose (b) or Safe; do not claim it stops collusion; add "invite log published (who/when/which label)".

### F5 MED - Tier 0.1 honesty edits: net positive, but sequencing risk
Evidence: README/dashboard overclaims (07-converge-crops L19) are verifiable false by any judge reading ens-register.ts, so the downside of editing is small. Weak spot: the walkaway statement will open the Q&A on the committee key (#2) before T13/T14 exist; if 0.1 ships and T13/T14 do not, the README publicly states the weakness with no mitigation. Not a reason to skip 0.1, a reason to make the wording conditional on what is built. Sure: medium.
Change: add in VERDICT "0.1 wording is written last, after T13/T14 decisions, and lists only shipped features".

### F6 MED - Keeping T1/T3 out of the live demo
Evidence: VERDICT R1 cites D6 (primary: finalist judges independent; "three minutes of slide and one minute of demo"). Sponsor partners judge from the form (code links) and video, so the call is supported. Counter: T1's key visual ("deleted reading appears as gap") is a 10 s video moment already planned, and a booth visit is where partner staff look at the repo/dashboard; T4-lite row "deleted reading" relies on T1 (Findings table: attack checklist includes "deleted reading") - but T1 is in Tier 1 anyway, so it is in the demo through T4-lite. There is an internal inconsistency: R1 says T1 stays out of the live 4 minutes, yet T4-lite's six rows include "deleted reading" and C4's script uses it. Sure: medium.
Change: clarify R1: T1 present as a checklist row and a video moment; T3 stays out.

### F7 MED - Dashboard lone-judge fix (0.6) is cosmetic if events get stale; pin an example
Evidence: dashboard.html L21 `value="30"`; events from 2026-11-05. "Latest sealed events or 24 h" will still be empty after a day. Needs "latest sealed event regardless of age" by site. Low cost.
Change: 0.6 -> "show last N sealed events regardless of age, with timestamp".

### F8 MED - Tier placement
- Tier-1 T3 (ENS text-key grant) is the most cosmetic Tier-1 item: it writes only health/rate diagnostics, and "ENS's own docs use the same grant pattern for avatars" (VERDICT 9, crowding 3/10). It needs phones to hold Sepolia ETH (adds a drip dependency). Consider demoting to Tier 2.
- T2a keep-alive (extend only) is cheap and visible; fine.
- Tier 3 "immutable per-event ENS names with contenthash -> pack, admin roles burned" arguably deserves Tier 1/2: it directly answers Q&A #3 ("can a reading be deleted") for sealed events more strongly than T1's readonly (which VERDICT finding 6 says the owner can still delete). Evidence: VERDICT item 6 (owner delete not blocked). It is no-phone work. Sure: low-medium (not tested).
Change: swap T3 down, bring "event name + contenthash" up as the delete-proof anchor, or state explicitly that Swarm pack + Arkiv hash in verify-event is the delete-proof evidence.

### F9 HIGH - Most damaging question not prepared: "Your timestamp is chosen by the phone; why should I believe when it happened?"
Evidence: tMs is phone clock + offset from /api/time (our server; crops L64 notes silent fallback to phone clock), then moved by sound sync. VERDICT prepares collusion/committee key/deletion but not time integrity. Combined with F1 it is also the T13 weakness. Answer must be: Arkiv block timestamp bounds each write; tMs only within skew; real events are cross-checked by k phones agreeing within the window.
Change: add as Q&A #4 with that answer and implement the skew check.

## CLEAR
- Does ENSv2 on Sepolia expose registry history for register/unregister/expiry? CLEAR (attack fails): ensv2-abi.ts L130-134 events LabelRegistered(expiry), LabelUnregistered, ExpiryUpdated exist and ens.ts L79-96 already folds them; expiry history IS reconstructible, only block timestamps are missing (F3).
- Tier 0 honesty hurting the pitch: mostly CLEAR; the claims are checkable false statements (F5 residual).
- T2a keep-alive / Tier 0.2 build fix: not cosmetic, CLEAR.

## Searches run / sources fetched / tools used
Bash (cat, grep, sed) over VERDICT.md, 07/08 stage files, ens.ts, ensv2-abi.ts, ens-register.ts, _committee.ts, quorum.ts, sync.ts, built bundle apps/web/dist. No web fetches. Playwright not used. One grep with `--include` glob failed under zsh (no match error), redone without it.
