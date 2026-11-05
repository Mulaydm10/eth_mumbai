# Docs study: swarm (docs agent, started 01:27 IST)

## [01:32] bee-js README + live gateway probes. Confidence HIGH (all probed live)
Sources: npm view @ethersphere/bee-js => latest **13.2.0** (modified 2026-10-27); https://github.com/ethersphere/bee-js README.md ("Intended to be used with Bee version 2.8.1"; runs in browser|node|webworker|electron); https://bee-js.ethswarm.org/docs/ ; src/utils/constants.ts.
Also: @ethersphere/swarm-cli 3.7.0 (npm). Swarm blog Aug 2026: bee-js undergoing restructuring (v12 -> v13 migration doc: https://bee-js.ethswarm.org/docs/migrating-to-v13/). Old example code (v1-v10) may not match.

### KEY FINDING: upload with NO Bee node and NO postage purchase via public gateway
bee-js constants.ts (verbatim):
  export const SWARM_GATEWAY_URL = 'https://api.gateway.ethswarm.org'
  export const NULL_STAMP = new BatchId('0000000000000000000000000000000000000000000000000000000000000000')
README snippet (verbatim):
```js
import { Bee, NULL_STAMP, SWARM_GATEWAY_URL } from '@ethersphere/bee-js'

main()

async function main() {
  const bee = new Bee(SWARM_GATEWAY_URL)
  const { reference } = await bee.data.upload(NULL_STAMP, 'Hello, World!')
  console.log(reference.toHex())
}
```
Other README snippets (need own Bee node + batchId): bee.file.upload(batchId, file) [browser File input], bee.collection.uploadFromFileList(batchId, fileList), bee.data.upload(batchId,'text'), bee.data.download(reference).toUtf8()/parsePayloadAsJson(); bee.storage.buy(Size.fromGigabytes(1), Duration.fromDays(7)) to buy stamp on own node. Browser CORS note: from Bee 2.8.3 a node rejects cross-origin POST unless origin listed in cors-allowed-origins (applies to own node, not the public gateway which returns Access-Control-Allow-Origin: *).

### Live curl probes (Thu 5 Nov 2026 ~01:32 IST), all against https://api.gateway.ethswarm.org
1. GET /health => OK 200.
2. POST /bytes (body 'tremor-witness-probe', header swarm-postage-batch-id: 000...0 [64 zeros]) => HTTP 201 {"reference":"00b39f6ca7f1b431cfa45780a085cd1e8e77a1c9321a0363193b90135421e02e"}; GET /bytes/<ref> => 200 returns body. CONFIRMED.
3. POST /bzz?name=wave.csv (text/csv body, same null batch header) => 201 {"reference":"a008420a1dc2df51431a15c05df43a9f443c0e371754c394c0413868554b3fa7"}; GET /bzz/<ref>/ => 200 returns CSV text. CONFIRMED.
4. POST /bzz?name=big.txt, 400,001-byte body => 201 ref 6bf99dd2...dbd2; GET back 200, 400001 bytes. So >=400 KB works (CSV waveform excerpts fine). Max size/rate limit NOT found.
5. CORS: responses carry Access-Control-Allow-Origin: *; OPTIONS preflight allows headers incl. Swarm-Postage-Batch-Id; methods GET, POST, OPTIONS => browser-direct upload works with plain fetch(), no backend.
Plain-fetch recipe (verified shape via curl):
```js
const r = await fetch('https://api.gateway.ethswarm.org/bzz?name=evidence.json', {method:'POST', headers:{'content-type':'application/json','swarm-postage-batch-id':'0'.repeat(64)}, body: JSON.stringify(pack)});
const {reference} = await r.json();   // 64 hex chars
// read: https://api.gateway.ethswarm.org/bzz/<reference>/   (or /bytes/<reference> for /bytes uploads)
```
### Caveats / unknowns
- Retention/permanence of free gateway uploads: NOT documented in what I fetched (null stamp = gateway-sponsored shared stamp; likely time-limited, may be GC'd). Do not claim permanence; for a durable demo, pin/re-upload close to demo time and keep a local copy. Content address = hash, so verifying integrity against Arkiv-stored ref is still valid.
- Reference is content-addressed 32-byte hex (64 chars); fits an Arkiv `str` attribute (<=128 bytes) or can be stored as bytes32. Suggested Arkiv attr: swarmRef = str(<64 hex>), plus sha256/keccak of pack for integrity.
- Mutable pointers (feeds/SOC) need a stamp (not null-stamp tested). Not needed.
- No Arkiv<->Swarm official integration page found in docs.arkiv.network pages fetched or via search. The "Arkiv + Swarm bonus" is therefore app-level: store ref in an Arkiv entity attribute.
- gateway.ethswarm.org root page is an SPA (title "Swarm Gateway"), not documented further here.

## Sources fetched / blocked / tools used
Fetched OK: npm registry (bee-js 13.2.0); github ethersphere/bee-js README.md + src/utils/constants.ts (via search_code); bee-js.ethswarm.org/docs/{,upload-download,storage}; live curl to api.gateway.ethswarm.org (/health, POST /bytes, POST /bzz, GET back, OPTIONS).
Blocked/404: docs.ethswarm.org/docs/develop/tools-and-features/gateway (404); gateway.ethswarm.org root (SPA, no content). Not found: gateway quota/retention docs, any ETHGlobal/Arkiv-specific Swarm endpoint or hackathon stamp.
Tools: curl, WebSearch, GitHub MCP, npm.
