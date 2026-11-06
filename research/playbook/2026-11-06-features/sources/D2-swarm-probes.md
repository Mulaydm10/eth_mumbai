# D2 Swarm primary-source excerpts and live probes (2026-11-06, curl + npx tsx in scratch, reads and null-stamp writes only, throwaway keys)

## Docs
- https://docs.ethswarm.org/llms.txt (200) lists: Feeds, Chunk types (CAC/SOC), GSOC, PSS, ACT ("Encrypt content for specific recipients using ACT"), Store with Encryption, Pinning, Erasure coding, Manifests, Multi-Author Blog ("per-author feeds and a shared index"), Dynamic Content ("Updatable content using feeds"). /llms-full.txt 200, /llms-api.txt 200 (204 KB).
- llms-api.txt L778: "Always use immutable stamp batches with feeds" (mutable batch overwrite breaks sequential feed index).
- llms-api.txt L4672 (verbatim): "Never use public gateways when requesting full encrypted references. The hash contains sensitive key information which should be kept private. Run your own node to use Bee's encryption features."
- llms-api.txt L624-641: swarm-cli ACT upload: `--act --stamp $id --act-history-address`; download needs act-publisher key, timestamp, history address. L685: grantee-list update twice within 1 s fails.
- npm @ethersphere/bee-js latest 13.2.0 (modified 2026-10-27). API in v13 is namespaced: bee.data/file/collection/feed/soc/rollingFeed/grantee/pin/stamp/messaging(pss, gsoc)/chunk/tag. (Our docs-swarm.md README snippet bee.data.upload matches v13.)

## Live probes against https://api.gateway.ethswarm.org with the null stamp (000..0)
1. POST /bzz with `swarm-encrypt: true` => 201, 128-hex reference (ref+key). GET /bzz/<128hex>/ => 200 plaintext. GET /bzz/<first 64 hex>/ => 404 (key needed). CORS Allow-Headers lists Swarm-Encrypt.
2. POST /bzz with `swarm-act: true` => 201 and header `swarm-act-history-address: bf59b83d...` (ACT accepted by gateway; response header exposed via access-control-expose-headers). Note: Access-Control-Allow-Headers does NOT list swarm-act, swarm-act-publisher etc, so a browser preflight for them would likely fail (untested from a browser).
3. Feeds: bee-js bee.feed.makeWriter(topic, throwawayKey).uploadReference(NULL_STAMP, ref) => OK on the public gateway; three sequential updates read back indices 0,1,2 (feedIndexNext 3) after ~4 s each; GET /feeds/<owner>/<topic> => 200 with headers swarm-feed-index, swarm-feed-index-next, swarm-feed-resolved-version v1. (First immediate read after 2nd write still showed index 0: propagation lag of seconds.)
4. SOC: bee.soc.makeWriter(key).upload(NULL_STAMP, id, payload) => ok (reference returned); immediate read back => 404 chunk not found (lag or id derivation; unverified).
5. POST /bzz with `swarm-collection: true` + tar => 201 collection ref. POST text/html => 201 (serving HTML blocked by gateway approval per earlier docs-swarm.md).
6. Not exposed on the gateway: /pins, /stamps, /node, /addresses, /chainstate, /tags => 404. /health 200. GET /batches works not (bee-js getAllGlobal parse error: array vs object).
7. bzz.link: https://bzz.link/bzz/<hash> redirects to https://bzz.link/forbidden?hash=<hash> for an unapproved hash. <hash>.bzz.link did not connect (000). No evidence of Sepolia ENS on bzz.link (docs mention eth.limo and bzz.link for mainnet ENS only).
