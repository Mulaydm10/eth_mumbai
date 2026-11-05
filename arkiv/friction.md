# Arkiv friction log (honest feedback, written as we hit it)

| # | When (IST, 6 Nov) | What happened | Impact | Suggestion |
| --- | --- | --- | --- | --- |
| 1 | 02:00 | Every write costs tGLM from the *sender*. Our design has many lightweight writers (each resident's phone signs its own readings), so every phone needs gas. We found no gas sponsorship or paymaster. | We had to build `/api/drip` (a small funder that tops up new phone wallets). Relaying through one server wallet would have broken the `$creator` trust model. | Sponsored writes: a paymaster, or a "write on behalf of, signed by X" mode that keeps the original signer verifiable. |
| 2 | 02:30 | The faucet needs a wallet sign-in **and** a human check, with one claim per wallet per hour. It's fine for a developer, but it can't fund fresh device wallets. | One teammate had to claim manually for our funder wallet. | A faucet API with an access key, or a larger hackathon allowance per access key. |
| 3 | 02:00 | The public RPC is "heavily rate limited", and access keys also need a wallet sign-in. For a browser app, the key goes into the bundle (the docs say to lock it to the site). | We shipped without a key first, and the SDK warns on every page load. | An unauthenticated read tier, separate from the write limits. Reads are what dashboards do most. |
| 4 | 02:10 | Number columns need `u64(...)` wrappers on write and come back as typed `{ value }` objects. A `bytes` value came back in a form we had to handle as either a hex string or a `Uint8Array`. | Small amounts of glue code (`num()`, the hex decode) in `arkiv.ts`. | Document the exact JS type returned for `bytes`; an option to return plain values. |
| 5 | 02:10 | 100 rows per page. A busy site (5 phones × a few triggers a minute) passes that in minutes. | The dashboard currently shows the newest 100 triggers only. | A cursor helper in the SDK (the `gt("$key")` pattern in the docs works, but a built-in one would help). |
| 6 | 02:20 | The maximum lifetime is about 182.5 days. Legal disputes over building damage run for years. | Sealed events also go to Swarm with a hash on Arkiv, and anyone can `extendEntity`. | A documented "keep alive" or extension pattern for public-interest records (who pays, and how to extend someone else's entity). |
| 7 | 01:40 | Network naming: the Devfolio India tour used Tiramisu with SDK 0.8, while the current docs use Rabdi with SDK 1.0. Older examples don't run as-is. | We spent minutes confirming which network is current. | A banner on the old tutorials pointing to Rabdi. |

## Swarm (bonus track) friction
| # | What happened | Suggestion |
| --- | --- | --- |
| S1 | Gateway uploads with the null stamp work from the browser (CORS `*`), which is great. But **serving an HTML site** (or raw HTML via `/bytes`) from the public gateway redirects to `bzz.link/forbidden` until the hash is approved by a form. | Document this up front for hackathons, or give fast-track approval for hackathon projects. We worked around it with an offline single-file viewer, and JSON evidence packs are served fine. |
| S2 | Retention of free null-stamp uploads isn't documented. | State the retention, so apps know when to re-upload or buy a stamp. |
