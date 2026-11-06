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
