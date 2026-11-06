# 02 DIVERGE D2: in-solution mechanism frame, ARKIV + SWARM stacks
Angle: re-check Arkiv and Swarm from current primary sources; find capabilities Tremor Witness does not use; turn each into a candidate feature. Generation phase: no pruning for difficulty. Date 2026-11-06. Append-only log.

## Log (append-only)
### [1] Arkiv docs llms.txt + core pages, fetched via curl (scratch). Confidence HIGH (primary, 2026-11-06)
- https://docs.arkiv.network/llms.txt => 200 (4.8 KB). /llms-full.txt => 404 (but body 15 KB, not-found page; absence of llms-full is not evidence the docs lack it). Pages fetched as HTML and stripped: querying/watch-events, writing/change, writing/batches, writing/expiration, writing/create, reference/limits, querying/paginate, querying/count, reference/query-language, start-here/clients, json-rpc/querying-data.
- npm @arkiv-network/sdk latest = 1.0.1 (modified 2026-11-02); dist-tags next 0.9.0-next.5, dev 1.0.0-dev.2, advanced 0.8.0-advanced.3. Our repo uses 1.0.1 (current).
- Verified capabilities (verbatim in sources/D2-arkiv-docs.md):
  * watchEntityEvents (publicClient): handlers onEntityCreated/onEntityPatched/onExpiryExtended/onOwnershipTransferred/onEntityDeleted/onEvent; SDK POLLS every half block (pollingInterval configurable); events carry no attributes; no event on expiry.
  * executeBatch: atomic creates+patches+extensions+ownershipChanges+deletes in ONE tx; predictEntityKeys lets a create refer to a key created in the same batch (key() column).
  * changeOwnership: new owner only can change; $creator stays. patchEntity set/unset. deleteEntity. flags at creation: readonly (attrs immutable; can still extend/hand over/delete), permissionlessExtension (ANYONE can extend, not change). Read via $creationFlags.
  * extendEntity: duration counts from now, not from old expiry; max 7,884,000 blocks (~182.5 d) from the extension block; owner-only unless permissionlessExtension.
  * Query: eq/ne/gt/gte/lt/lte/between/startsWith/exists/hasType/and/or/not; ORDER BY one key (asc/desc), sortable even unindexed (not bytes, not $createdAt/$updatedAt); filter/sort on $key,$owner,$creator,$expiresAt; .ownedBy()/.createdBy(); count() and withCount(); limit<=100, offset; key-cursor paging; atBlock listed in llms.txt (historical reads).
  * $expiresAt filter + getBlockTiming => "expiring soon" queries.
  * NO salt: NO_SALT makes keys predictable from owner+counter.
  * Rate limits: public RPC "heavily rate limited"; free access key from "Arkiv Hub", "lock it to your site", in browser from public env var.
  * Limits: 32 attrs; name 32 B; str 128 B; bytes 128 KiB per create/patch; 100 rows/page.
- Repo use check: see next entry.

### [2] Repo usage check (grep packages/chain/src/arkiv.ts, apps/web/src/*.ts, scripts). Confidence HIGH
Product uses ONLY: defineSchema, createEntity (expiration only, no flags/salt), select/from/where(eq,gt,and)/orderBy(desc)/limit, $key/$creator selects, 4 s polling in dashboard. UNUSED: watchEntityEvents, executeBatch/predictEntityKeys, extendEntity, permissionlessExtension flag, readonly flag, changeOwnership, patchEntity, deleteEntity, count()/withCount, between/startsWith/exists/or/not, $expiresAt filters, getBlockTiming, ownedBy/createdBy server-side filters (creator is checked client-side), atBlock, access key (accessKey "" default => public rate-limited RPC), websocket transport, paging by $key cursor.

### [3] Live RPC probes (reads only, no key) of https://rpc.rabdi.db-chain.testnet.arkiv.network, 2026-11-06. Confidence HIGH
- arkiv_getBlockTiming => {"current_block":269109,"duration":2}. eth_chainId 0x76edaf = 7794095.
- arkiv_query count of `arkiv.schema = str('tremor-witness.v1.event')` => count 0x6 (6 live events on chain from all writers).
- select creationFlags/owner/creator/expiresAt works; our events: flags {readonly:false, permissionlessExtension:false}; owner==creator==sealer wallet; expiresAt 0x7ab528 = 8,041,768 blocks.
- Response carries a `cursor` field ("b64:...") when ORDER BY is used with limit: server-side cursor paging exists in the RPC (SDK doc mentions `cursor`, `next`, `for await`).
- `atBlock` param: query with atBlock 0x1 => error -32006 "block 1 is unavailable: state for this block is not retained" with data.latest => HISTORICAL STATE READS EXIST, within a retention window (window size not measured). Feature: "as-of" queries.
- eth_getLogs on 0x44..44 from block 0x41400 => -32603 "golemdb segment_range_of(transactions): NotImplemented" (getLogs over ranges is NOT usable on this node, at least for that range). rpc_modules not available.
- **WebSocket works**: wss://rpc.rabdi.db-chain.testnet.arkiv.network (no key) accepts eth_subscribe newHeads (a head every ~2 s) and eth_subscribe logs {address:0x4400..0044}: pushed live entity-operation logs from OTHER teams' activity immediately (topic0 e986ee22... and 10dc3526...). So push-based live updates are real; our dashboard polls every 4 s instead.
- Indexer host https://indexer.rabdi.db-chain.testnet.arkiv.network: / and all unknown paths serve the "Arkiv BlockExplorer" SPA (200 HTML). Real JSON endpoints found by reading the bundle (/assets/index-CbkB2eFO.js): /api/blocks (block metrics, fee columns incl. rent), /api/entity/<key> (full per-entity operation history: create/patch/extend/transfer with blockDate, hash, salt, creationFlags, expiresAt, resolvedExpiresAt, `permanent`, newOwner, bytesSize, schemaName, attributes, transactionRentFeeWei), /api/search?q= (key/addr/hash prefixes), /api/transaction/<hash>, /api/auth/* (access tokens, Google login), /api/admin/metrics, /api/entity-explorer/rpc. /graphql, /openapi.json, /docs, /health are SPA fallbacks (not APIs). `permanent` field appears in explorer output (always false for our event); no docs for a permanent mode (note, unverified).
- Verified GET /api/entity/0x48fea052... returns create op of a live event (block 265768, schema tremor-witness.v1.event, eventId, swarmRef bdf5704d..., transactionRentFeeWei present).
--- resumed 2026-11-06T00:17:48Z ---

### [4] Swarm docs/bee-js/gateway re-check (full excerpts in sources/D2-swarm-probes.md). Confidence HIGH for items marked VERIFIED
- docs.ethswarm.org/llms.txt, /llms-full.txt, /llms-api.txt all 200. bee-js latest 13.2.0 (2026-10-27), tarball installed in scratch; d.ts grep confirms namespaces feed, soc, rollingFeed, grantee (ACT), pin, stamp, messaging (pss, gsoc), collection, chunk.
- VERIFIED on public gateway with the NULL stamp (no cost, throwaway keys): (a) FEEDS: sequential feed write + read-latest works (indices 0,1,2; GET /feeds/<owner>/<topic> returns swarm-feed-index headers). The product uses NO feed today. (b) Native Bee ENCRYPT (swarm-encrypt) upload works, 128-hex ref needed to read; BUT docs L4672 warn never to put encrypted refs through a public gateway (the gateway sees the key). (c) ACT upload header accepted (returns swarm-act-history-address); CORS Allow-Headers does not list swarm-act so browser use is unverified/likely blocked. (d) SOC write returns ok; read-back 404 (unresolved). (e) collection (tar) upload works.
- Not exposed by the gateway: /stamps /pins /tags /node. So "postage batch ID + who bought it" cannot be shown: we use the gateway's shared null stamp; there is NO batch ID of our own. bzz.link: unapproved hash => /forbidden; no Sepolia ENS evidence (docs say mainnet ENS only via eth.limo/bzz.link). Test of an actual mainnet ENS name NOT done (no name, would cost money).

### [5] Arkiv extra checks: SDK 1.0.1 tarball, GitHub org, indexer. Confidence HIGH/MED
- SDK src grep: accessKey is required by chain factories (rabdi({accessKey}); error MissingAccessKeyError says free key or accessKey "" for the heavily rate-limited public endpoint); webSocket transport referenced; watchEntityEvents, withCount, ownedBy/createdBy, atBlock all in SDK. No entity-history method in SDK; per-entity history only via explorer endpoint /api/entity/<key> (see [3]).
- GitHub org Arkiv-Network (API list): arkiv-sdk-js (pushed 2026-11-02), arkiv-sdk-python/rust, arkiv-op-geth, learn-arkiv (docs site + "fullstack tutorial"), usecases-copypal (cross-device clipboard w/ expiry), usecases-filedb/imagedb (chunked files stored ON Arkiv: the pattern Swarm replaces), usecases-webdb (web hosting on Arkiv), usecases-portfolio, rpcplorer (JSON-RPC explorer), arkiv-tests, sqlite-store. No "node tooling track" repo found under that name (not proof of absence). Page 2 of the repo list returned nothing parseable.
- Product vs capability (Arkiv rubric "Does each Arkiv feature you use change something your users see?"): the unused primitives that CAN change what is seen are watchEntityEvents/ws push, permissionlessExtension + extendEntity, changeOwnership, count/withCount, $expiresAt, atBlock, executeBatch, readonly flag, entity-history explorer endpoint.

### [6] arkiv/swarm.md vs bonus qualification list (fact-finding only)
Required by 01-commitments §A -> in our swarm.md?
- what on Swarm / what on Arkiv / which field holds ref: PRESENT (partly; the Arkiv-side list is only implicit, field names swarmRef, packHash named).
- One Arkiv entity key + the Swarm ref it points to + a link we can open: MISSING (only a verify command with truncated hash, no key, no link).
- Postage stamp batch ID + buying wallet (or who gave it) + Bee node/service: PARTIAL. It says "null postage stamp" and the public gateway but gives no batch ID (000..0 is the gateway's shared stamp; nobody bought it) and no statement of who provides it. Judges may read that as missing.
- Files in repo that upload/read: PRESENT (swarm.ts, dashboard.ts; read side scripts/verify-event.ts is referenced only by command).
- Steps to run one upload and one read yourself: PARTIAL (read/verify command only; no upload command).
- Moment in the demo video where Swarm is used: MISSING.
- What got in your way: PRESENT (pointer to friction.md S1-S2).
- "Careful: encrypted reference contains its key": NOT ADDRESSED (we use no encryption, so say so explicitly).
Also: swarm.md claims "Content addressing means a court can check ... recompute the keccak hash" (note: Swarm refs are BMT hashes, our packHash is a separate keccak; OK as written). Retention of null-stamp uploads is undocumented (swarm.ts comment says so); swarm.md says "pack must outlive us" which leans on that unproven retention.

## FEATURE CANDIDATES (D2). Status tags: V = ingredient verified by me (saw API or ran it), A = assumed
Common to all: sponsor phrases are from 01-commitments §A. Rubric phrase R-A = "Does each Arkiv feature you use change something your users see?" (as logged in §A / ethglobal-arkiv.md; I did not re-fetch the rubric).

### F1. Live push dashboard (Arkiv websocket + watchEntityEvents instead of 4 s polling) [V]
1. The dashboard subscribes to Arkiv entity events over WebSocket so a phone trigger appears on the map/timeline the moment it lands, with a visible "pushed by chain, N ms" badge.
2. Raises: "at least one feature users see reads its data from Arkiv" / R-A.
3. Native: the chain is the event bus; no backend, no poll loop; removes a latency we currently own.
4. Demo: judge stomps; within ~2-4 s (one block = 2 s) the trigger appears with block number and latency; ~10 s.
5. Measures end-to-end latency stomp -> block -> screen per trigger (a real number for the writeup).
6. Difficulty: low-medium. SDK watchEntityEvents polls every half block (documented) and raw wss eth_subscribe logs works without a key (I received other teams' logs). Events carry no attributes, so a follow-up get by key is needed.
7. Real phones: yes for the demo, no for build (simulate.ts).
8. https://docs.arkiv.network/ (querying/watch-events) ; wss://rpc.rabdi.db-chain.testnet.arkiv.network eth_subscribe verified.

### F2. Community-extended lifetimes: permissionlessExtension "keep this alive" button [V docs, A behaviour on our key]
1. Sealed events are created with the permissionlessExtension flag so ANY resident or neighbour can pay to extend an event's life, shown as a "kept alive by N wallets, until <date>" meter.
2. Raises: "Arkiv entities" retention/expiry as a user-visible feature (R-A); also CROPS "works without you" (nobody needs our server or key to keep evidence alive).
3. Native: Arkiv's expiry (BTL) is the retention policy; extension by non-owners is a protocol feature, not our database.
4. Demo: judge taps "extend 30 days" from a wallet that is NOT the sealer; $expiresAt visibly moves; ~15 s.
5. Evidence persistence over time: a court-relevant event survives past our 182.5 d max by relay extension; per-event custody log.
6. Difficulty: medium (flag only settable at create time, so applies to new events; needs wallet sign in browser, gas funds; max 7,884,000 blocks ~182.5 d per extension counted from NOW, not stacking).
7. Phones: no (any wallet).
8. docs.arkiv.network/writing/change + writing/expiration (see sources/D2-arkiv-docs.md).

### F3. "Expires in" heartbeat and renewal queue via $expiresAt + getBlockTiming [V]
1. A panel lists events sorted by time left (query on $expiresAt) with a one-click batch renew for those under N days.
2. Raises R-A (query feature that changes what is seen); pairs with F2/F7.
3. Native: uses indexed system attribute and block timing, no cron on our side.
4. Demo: panel shows "3 events expire in < 10 days", renew all in one tx; ~15 s.
5. Evidence: custody/retention coverage statistic.
6. Difficulty: low (queries) ; renew needs executeBatch (F7).
7. Phones: no.
8. docs querying/query-language ($expiresAt), arkiv_getBlockTiming probe returned {"current_block":269109,"duration":2}.

### F4. Phone-ownership handover: changeOwnership when a phone/wallet is rotated or a resident hands the site to a successor [V docs, A UX]
1. A site's committee entities (registry/params) or a phone's trigger history can be handed to a new owner wallet via changeOwnership while $creator keeps provenance; UI shows "created by A, now owned by B".
2. Raises R-A; ties to ENS roles (D3).
3. Native: $owner vs $creator split is exactly the "who recorded vs who controls" semantic our evidence needs.
4. Demo: transfer a registry entity to a Safe/other wallet; $owner changes, $creator stays; ~20 s.
5. Evidence: attribution does not break after custody change (provenance test).
6. Difficulty: medium (needs who-owns-what schema thinking; only the owner can change; breaks if the entity is "readonly"? no: readonly still allows handover per docs).
7. Phones: no.
8. docs writing/change; indexer /api/entity/<key> shows `newOwner` field in op history.

### F5. Entity timeline "chain of custody" page from the indexer /api/entity/<key> [V endpoint, A stability]
1. Each sealed event page shows its full operation history (create, extend, transfer, with block dates, fees) read from the explorer API next to the Swarm pack.
2. Raises R-A and judging "evidence".
3. Native: reads the chain's own history, no log table of ours.
4. Demo: open event; custody timeline renders; ~10 s.
5. Evidence: per-event rent fee and operation trail ("transactionRentFeeWei") gives a measured on-chain cost per sealed event.
6. Difficulty: low; but it is an undocumented SPA backend endpoint (could change, and puts a third-party host in the read path; CROPS "P" section must say so).
7. Phones: no.
8. https://indexer.rabdi.db-chain.testnet.arkiv.network/api/entity/0x48fea052... (probed).

### F6. Historical "as-of" replay: atBlock queries to replay the quorum state at the exact block of the shake [V, window unmeasured]
1. A scrubber replays the registry/trigger set as it was at block X (atBlock) to show what the sealer could have known at the time.
2. Raises R-A ("feature changes what users see") and integrity.
3. Native: Arkiv historical reads replace us storing snapshots.
4. Demo: drag slider, map changes; ~15 s.
5. Evidence: proves no retroactive registry edits (phone list at sealing time = list at block).
6. Difficulty: medium; retention window of state is small (block 1 was refused "not retained"); need to measure window.
7. Phones: no.
8. RPC probe error -32006 with data.latest; docs listing atBlock.

### F7. Atomic seal: executeBatch that creates the event entity + patches/extends in one transaction, with predictEntityKeys [V docs]
1. The seal writes the event entity and the member index entities in ONE atomic tx (all-or-nothing), shown as one tx hash.
2. Raises R-A / Arkiv "uses batch" depth; reduces half-sealed states.
3. Native: protocol-level atomicity instead of our retry code.
4. Demo: "sealed in one tx, 1 hash" with block explorer link; ~8 s.
5. Evidence: seal atomicity, gas per seal measured.
6. Difficulty: medium (refactor sealing path; key prediction semantics).
7. Phones: no.
8. docs writing/batches.

### F8. Swarm feed per site: "latest sealed event" and an append-only site ledger feed [V]
1. Each site has a Swarm feed (owner = sealer wallet, topic = site id) whose latest update points to the newest evidence-pack index; Arkiv event stores the feed owner+topic, so one stable link always resolves to the newest pack.
2. Raises: "point to them from your Arkiv entities" + "which entity field holds the Swarm reference or feed" (swarm.md wording literally allows a feed).
3. Native: Swarm's mutable-pointer primitive for the one thing content addressing cannot do (a stable URL for "latest").
4. Demo: seal 2 events; open the one feed URL; it flips from pack A to pack B (swarm-feed-index 0 -> 1); ~15 s.
5. Evidence: feed index = monotonic count of seals; gaps visible.
6. Difficulty: low-medium. Needs a signer in the browser (an app-held key is a trust issue; sealer wallet signs via the bee-js signer = the committee key). Gateway lag of seconds seen; docs: use immutable batch for feeds, and ours is the shared null stamp (durability unknown).
7. Phones: no.
8. https://docs.ethswarm.org/docs/develop/tools-and-features/feeds ; ran bee.feed.makeWriter/Reader against api.gateway.ethswarm.org.

### F9. Per-phone feed of raw waveforms (each phone owns a Swarm feed of its own captures) [V mechanism, A product fit]
1. Each phone's wallet is a feed owner; its recent raw captures are appended to its own feed; the Arkiv trigger entity holds only the feed index for that moment.
2. Raises "keep the files your users see on Swarm and point to them from your Arkiv entities".
3. Native: owner-signed feeds mean the phone proves authorship of the waveform without our server; Arkiv holds the 128 B-limited pointer, Swarm the bulk (Arkiv bytes cap 128 KiB).
4. Demo: tap a trigger; waveform loads from the phone's feed; ~10 s.
5. Evidence: waveform availability rate; size per capture.
6. Difficulty: medium-high (per-phone signing and upload in the PWA; null-stamp retention).
7. Phones: yes.
8. As F8.

### F10. Client-side encrypted evidence for the resident only (WebCrypto, key in URL fragment) [V partly]
1. The pack (or the identifying part, e.g. exact location and phone list) is AES-GCM encrypted in the browser, the ciphertext goes to Swarm, the key travels only in the share link fragment given to a lawyer/journalist; Arkiv holds only the public hash + ciphertext ref.
2. Raises the verbatim "or upload them encrypted so only the people who get the reference can open them" and the "Careful" rule about keys.
3. Native only if the privacy story matters (residents reporting a neighbour/company); makes the shared-secret flow part of the product.
4. Demo: open the link without fragment -> unreadable bytes; with fragment -> readable; ~12 s.
5. Evidence: privacy property testable by a judge.
6. Difficulty: medium. Do NOT use Bee native swarm-encrypt through the public gateway: docs L4672 say the gateway sees the key; I verified native encrypt works (128-hex ref) so the risk is real. Client-side encryption avoids that.
7. Phones: no.
8. docs.ethswarm.org llms-api.txt L4672; probe in sources/D2-swarm-probes.md. Note: tension with the project's public-verifiability claim (anyone can check quorum on Arkiv); a split (public summary, encrypted detail) resolves it.

### F11. ACT-gated detail pack: grant a named reader (lawyer, council) access, revoke later [V upload header only; A usable from browser]
1. The resident grants specific public keys (grantee list) to open the raw pack; revoke by patching the grantee list.
2. Raises "upload them encrypted so only the people who get the reference can open them".
3. Native: ACT is Swarm's own access-control primitive (history address kept on the Arkiv entity).
4. Demo: grant council key -> they open; revoke -> fail; ~25 s.
5. Evidence: access-grant log (history address versions).
6. Difficulty: HIGH. ACT needs a real stamp and generally own Bee node (docs say run your own node for encryption); gateway returned an act-history header but CORS Allow-Headers omits swarm-act so a browser call is likely blocked. Assumed unusable without own Bee node.
7. Phones: no.
8. https://docs.ethswarm.org/docs/develop/act ; llms-api.txt L624-685.

### F12. Swarm GSOC / PSS "live alert channel" (neighbours' phones receive a push when a quorum seals) [A]
1. Swarm pub/sub (GSOC) gives a serverless notification channel for quorum events.
2. Raises: only a "meaningful Swarm use" argument.
3. Native: weak for Arkiv rubric because Arkiv websocket (F1) already does the job.
4. Demo: n/a.
5. Evidence: none beyond F1.
6. Difficulty: high; needs a node (messaging.gsocSubscribe is a websocket to a Bee node; the public gateway does not expose it, A).
7. Phones: yes.
8. bee-js 13.2.0 d.ts messaging.gsocMine/gsocSend/gsocSubscribe.

### F13. Count and site-health statistics with count()/withCount (no row download) [V]
1. Home page shows "events sealed, phones registered, triggers today" computed server-side by Arkiv count queries (no 100-row page limit issue).
2. Raises R-A.
3. Native: chain-side aggregates; probe: arkiv_query count returned 0x6 live events.
4. Demo: counters tick as stomps happen; 5 s.
5. Evidence: dataset size, scale statistics.
6. Difficulty: low.
7. Phones: no.
8. docs querying/count ; probe.

### F14. Read-only evidence seal: set the `readonly` flag so a sealed event's attributes are immutable, with an "immutable" badge [V docs]
1. Sealed event entities are created readonly (attributes cannot be patched ever, but can still be extended/handed over/deleted), displayed as a badge.
2. Raises R-A and integrity.
3. Native: protocol-enforced immutability replaces "trust us".
4. Demo: attempt a patch on a sealed event from the owner wallet -> chain rejects; ~15 s (needs a negative test; a sealed tx failing on screen).
5. Evidence: demonstrated immutability test.
6. Difficulty: low (flag at create); the demo needs an owner-key attempt.
7. Phones: no.
8. docs writing/create (flags readonly, permissionlessExtension), probe shows our events currently have readonly:false.

### F15. Access key per site origin to lift the public RPC rate limit, with a visible "RPC tier" statement [V]
1. Use a free Arkiv Hub access key locked to our site so the dashboard is not throttled in the judging room; show it in README as the P-section statement.
2. Raises CROPS "P: what each third party learns" and reliability.
3. Native: documented way ("lock it to your site").
4. Demo: none (infrastructure); safety for demo.
5. Evidence: request counts.
6. Difficulty: low. Key would be public in the browser by design (docs).
7. Phones: no.
8. SDK MissingAccessKeyError text; docs reference/limits.

### F16. Arkiv-side "file index" without bytes: entity stores swarmRef + byte size + mime + sha for N files, queryable by size/type [V]
1. Add typed attributes (size, kind: pack/waveform/image) and show a gallery of Swarm objects queried from Arkiv by kind.
2. Raises the Swarm bonus "keep the files your users see on Swarm and point to them".
3. Native: Arkiv as index, Swarm as blobs; the usecases-filedb pattern puts blobs on Arkiv, ours is the inverse.
4. Demo: gallery loads from Swarm refs; 10 s.
5. Evidence: bytes saved on Arkiv vs 128 KiB cap.
6. Difficulty: low.
7. Phones: no.
8. docs reference/limits.

### F17. Pack mirror health check: probe Swarm retrievability and auto re-upload from a resident's local copy [V mechanism, A retention]
1. A "pack health" light per event (GET /bzz/<ref> 200 or not) and a "re-upload my copy" button that re-posts the file to the gateway and verifies the same reference and keccak match.
2. Raises the bonus's usefulness; addresses undocumented retention directly.
3. Native: content addressing makes re-upload produce the same reference (to be tested: same bytes via /bzz?name must give the same ref).
4. Demo: simulate loss (point to wrong gateway) then re-upload; ref identical; ~20 s.
5. Evidence: retrievability over time (a time series of 200/404 across the hackathon).
6. Difficulty: low.
7. Phones: no.
8. bee-js data.isRetrievable ; gateway behaviour in probes.

## DISCARDED (with reasons)
- Swarm PSS: needs a Bee node; the gateway does not expose it (A). Same as F12 in effect.
- Postage stamp purchase in-app (buying xBZZ on Gnosis): real money and wallet bridging; also bee-js stamp.create needs an own node (gateway does not expose /stamps, probe 404). Report instead: no batch ID exists for us.
- Erasure coding / pinning: node-side options; the gateway does not expose /pins (404) and erasure header unverified.
- Arkiv eth_getLogs-based history: node returns NotImplemented for ranges (probe), so event backfill by logs is unusable.
- Python/Rust SDKs: wrong stack.
- Arkiv usecases-webdb style hosting of the dashboard on Arkiv: crowded pattern and size cap 128 KiB.
- Storing the Swarm ref only encrypted on Arkiv: unnecessary (our ref is unencrypted and the pack contains no key); only relevant if F10 is built.

## Open items I could not settle
- Retention of null-stamp gateway uploads (undocumented). - Whether Allow-Headers blocks swarm-act in a real browser. - The state retention window for atBlock. - bzz.link with Sepolia ENS (no evidence either way; mainnet name not tested). - Real Arkiv Hub access-key rate tiers (page not fetched).
- No injection text seen in fetched content.

## Searches run / sources fetched / tools used (resumed part)
- curl: docs.ethswarm.org/llms.txt, llms-full.txt (status), llms-api.txt (204 KB, grepped); api.gateway.ethswarm.org probes (/health /readiness /node /addresses /stamps /pins /tags /feeds; POST bzz with encrypt, act, collection, html; POST bytes; OPTIONS preflight); bzz.link/forbidden redirect checks; GitHub REST api.github.com/orgs/Arkiv-Network/repos (page 1 ok) and raw READMEs of usecases-copypal, learn-arkiv (arkiv-events and query-api READMEs 404).
- npm: view @ethersphere/bee-js; npm i bee-js 13.2.0 + tsx in scratch; npm pack @arkiv-network/sdk@1.0.1 and grep of src/dist.
- npx tsx scripts in scratch (feed.mts, feed2.mts) using throwaway keys and the null stamp, no team funds, no .env.
- Read: 01-commitments.md §A, arkiv/swarm.md, packages/chain/src/swarm.ts, docs-swarm.md. Did not re-read arkiv.ts/dashboard.ts in this resume (usage was logged in [2]).
- Blocked/failed: TinyFish MCP tools (server not found, 404) - not needed; Playwright not used per rules; Arkiv Hub access-key page and the ETHGlobal rubric were not re-fetched; docs.arkiv.network/llms-full.txt 404.
