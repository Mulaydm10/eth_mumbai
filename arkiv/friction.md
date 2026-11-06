# Arkiv friction log (logged as we hit it, with reproductions)

Context: Tremor Mesh has **many lightweight writers**. Every resident's phone signs its own readings from a browser. Most friction below comes from that shape: many browser wallets with tiny budgets, writing often and reading constantly. All times are IST on 6 Nov 2026. Code references are to this repo.

## 1. Every phone needs gas, and there is no sponsored-write path
- **What happened (02:00):** each write costs tGLM from the sender. Each phone is its own wallet (by design: `$creator` *is* the trust signal), so every phone needs gas before its first reading.
- **Reproduce:**
  1. Generate a fresh key with `generatePrivateKey()`.
  2. Call `walletClient.createEntity(...)` on Rabdi.
  3. It fails with insufficient funds.
- **Measured:** about **0.00019 tGLM per write** (3 writes = 0.000566 tGLM, `scripts/simulate.ts`).
- **What we did:** `/api/drip`, a small server that tops up new phone wallets (0.05 tGLM each). Relaying writes through one server wallet would have broken the `$creator` trust model, because every reading would look like it came from us.
- **Suggestion:** sponsored writes (a paymaster), or "write on behalf of X, signed by X" so the original signer stays verifiable as `$creator`.

## 2. The faucet can't fund device wallets
- **What happened (02:30):** the faucet requires sign-in-with-Ethereum **and** a human check, and allows one claim per wallet per hour. That's right for developers, but impossible for 5 phone wallets created on the spot.
- **Reproduce:** open hub.arkiv.network/faucet → it asks for wallet sign-in → then the human-verification widget.
- **What we did:** a teammate claimed 10 tGLM once into our funder wallet, which then drips to phones.
- **Suggestion:** a faucet API keyed by the access key, or a hackathon allowance per access key.

## 3. Public RPC rate limits, and access keys need a wallet sign-in
- **What happened (02:00):** the SDK warns on every page load ("heavily rate limited"). Our dashboard polls every 4 s and opens up to 4 queries per refresh, and the evidence report adds a 100-row query with waveforms.
- **Reproduce:** `createPublicClient({ chain: rabdi({ accessKey: "" }), transport: http() })`. The console prints the warning; then poll `select().from(...)` every few seconds from several tabs.
- **Suggestion:** an unauthenticated **read** tier separate from write limits, since dashboards and verifiers are read-heavy. Also document what "heavily" means in numbers.

### 3b. A browser access key is public by construction (06:55)
- **What happened:** to stop the throttling we added an access key. Arkiv's docs say to read it from the bundler's public env and "lock it to your site". Vercel then flagged `VITE_ARKIV_ACCESS_KEY` as "looks like a credential … exposes its value to anyone visiting your site" and refused to add it until we chose `--type config`.
- **The tension:** keeping the key server-side would force a proxy into the read path, which defeats our censorship-resistance design (readers must not depend on our server).
- **What we did:** exposed it as Arkiv recommends and locked it to our origin in the Hub. **Gotcha we hit:** once locked, requests with *no* `Origin` header (server functions, scripts) are rejected too (`403 ORIGIN_FORBIDDEN`), which silently broke our invite and join endpoints until we moved them back to the public endpoint.
- **Reproduce:** `curl -X POST https://rpc.rabdi.db-chain.testnet.arkiv.network/<locked-key> -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'` with no Origin gives 403; adding the allowed Origin gives 200.
- **Suggestion:** a documented read-only, origin-scoped key type (or keyless reads with higher limits for reads), so browser dApps don't have to publish a key that also carries write or quota power.

## 4. Typed values: `u64(...)` wrappers on write, `{ value }` on read, and `bytes` in two shapes
- **What happened (02:10):** numbers must be wrapped (`u64(Date.now())`) and come back as `{ value: bigint }`. A `bytes` column came back in a form we had to handle both as a `0x…` hex string and as a `Uint8Array`.
- **Reproduce:** write `wave: stringToBytes(json)` with `createEntity`, then read it back with `.select({ wave: true })` and log `typeof e.wave.value`.
- **What we did:** helpers `num()` and a hex/Uint8Array decoder in `packages/chain/src/arkiv.ts`.
- **Suggestion:** document the exact JS type returned per column type, and offer an option to return plain JS values.

## 5. 100 rows per page
- **What happened (02:10):** 5 phones × a few triggers a minute pass 100 rows within minutes. A verifier re-checking a whole day needs pagination.
- **Reproduce:** `.limit(101)` → error. `.limit(100)` on a busy site silently drops older rows from our dashboard window.
- **Suggestion:** a built-in cursor iterator in the SDK. The `gt("$key", …)` pattern from the docs works but is easy to get wrong.

## 6. Maximum lifetime (~182.5 days) vs legal timelines
- **What happened (02:20):** building-damage disputes in Mumbai run for years. Our confirmed events use 180 days, the longest we can set.
- **What we did:**
  - the evidence pack goes to Swarm;
  - its keccak hash is stored on Arkiv;
  - the printable report carries the hash, so a re-uploaded copy still verifies.
- **Suggestion:** a documented "keep alive" pattern for public-interest records: who pays, how a third party can `extendEntity`, and what happens at expiry.

## 7. Network naming drift (Tiramisu vs Rabdi)
- **What happened (01:40):** the India tour material uses Tiramisu with SDK 0.8, while current docs use Rabdi with SDK 1.0. Old snippets fail as-is.
- **Suggestion:** a banner on older tutorials pointing to Rabdi and SDK 1.0.

## 8. Unbounded expensive reads when you select `bytes`
- **What happened (05:10):** to compute waveform coherence, the dashboard needs the `wave` bytes for an event's members. There's no "fetch these keys" batch read in our path, so we re-query the window with `wave: true` (about 3 KB per row × up to 100 rows) and cache in the browser.
- **Suggestion:** a batch `getEntities([...keys], { select })` for verifiers, who usually know exactly which entities they need.

## 9. What worked well (so the team knows what to keep)
- **CORS `*` on the Rabdi RPC:** our offline single-file viewer works from any origin, including a local file server.
- **`$creator` immutability** is exactly the primitive a "who measured this?" product needs.
- **`ExpirationTime.fromDays`** made our privacy design (short-lived raw readings, longer-lived confirmed events) a one-liner.
- **The schema tag plus `where(and(eq, gt))`:** the multi-phone quorum *is* a query, with no indexer of our own.

## Swarm (bonus track)
| # | What happened | Reproduce | Suggestion |
| --- | --- | --- | --- |
| S1 | Browser uploads with the null stamp work (CORS `*`). But **serving an HTML site** (or raw HTML via `/bytes`) redirects to `bzz.link/forbidden` until a form approves the hash. | `curl -X POST …/bzz` with `swarm-collection: true` → open `/bzz/<ref>/` → redirect to the approval form | State this up front in hackathon docs, or fast-track approvals. Our workaround is the offline single-file viewer. |
| S2 | Retention of free null-stamp uploads is undocumented. | n/a | State the retention, so apps know when to re-upload or buy a stamp. |
| S3 | Hashes registered with ENS are served at `<name>.bzz.link`, but that needs a **mainnet** ENS name; our ENSv2 names are on Sepolia. | — | Support Sepolia/ENSv2 names on bzz.link for testnet projects. |
