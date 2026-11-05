# Docs study: arkiv (docs agent, started 01:27 IST)

## npm probe 01:27
npm view @arkiv-network/sdk: latest 1.0.1; tags next 0.9.0-next.5, advanced 0.8.0-advanced.3, dev 1.0.0-dev.2. (npm view arkiv-sdk = 0.1.19, probably unrelated). Confidence high.

## [01:30] Official docs (docs.arkiv.network, raw .md pages; old arkiv.dev.golem.network redirects here). Confidence HIGH
NOTE: older docs/guides mention testnets Kaolin (chain 60138453025) and Mendoza and SDK 0.4.4/0.6.0 -- STALE. Current public testnet = **Rabdi**. Kaolin RPC timed out, Mendoza host does not resolve (probed 01:30).
### networks/rabdi (https://docs.arkiv.network/networks/rabdi/)
# Rabdi

Rabdi is Arkiv's current public testnet. You can build and test your app against a live network.

## Connect your app

Call [`rabdi`](https://docs.arkiv.network/typescript-sdk/api-reference/chains/functions/rabdi/) from the SDK with your [access key](https://docs.arkiv.network/start-here/access-keys/), and pass the chain to a client:

```ts
import { createPublicClient } from "@arkiv-network/sdk"
import { rabdi } from "@arkiv-network/sdk/chains"
import { http } from "viem"

const client = createPublicClient({
  chain: rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" }),
  transport: http(),
})
```

Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free access key from the [Arkiv Hub](https://hub.arkiv.network/access-keys). With `accessKey: ""`, the chain uses the public RPC and logs a warning.

For reading, writing and browser wallets, see [Connect to Arkiv](https://docs.arkiv.network/start-here/clients/).

## Network reference

| Property          | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| Chain ID          | `7794095` (`0x76edaf`)                                   |
| HTTP RPC          | `https://rpc.rabdi.db-chain.testnet.arkiv.network`       |
| WebSocket RPC     | `wss://rpc.rabdi.db-chain.testnet.arkiv.network`         |
| Native gas token  | tGLM                                                     |
| Block time        | 2 seconds                                                |
| Faucet            | [hub.arkiv.network/faucet](https://hub.arkiv.network/faucet) |
| Access keys       | [hub.arkiv.network/access-keys](https://hub.arkiv.network/access-keys) |
| Explorer          | [rabdi.explorer.arkiv.network](https://rabdi.explorer.arkiv.network) |

<RpcTerms />
**Tip:** If you use a raw JSON-RPC client instead of the SDK, get the chain ID and RPC URL from the table, and [add your access key](https://docs.arkiv.network/start-here/access-keys/#send-the-key-with-your-requests). See the [JSON-RPC API](https://docs.arkiv.network/json-rpc/querying-data/) for the methods.

## Get test tGLM

Arkiv uses GLM to pay for transactions. On Rabdi it’s test GLM, `tGLM`. Get some from the [faucet](https://hub.arkiv.network/faucet).

## Get help

If requests to the RPC fail, or you have another problem, ask in [Discord](https://discord.gg/arkiv). A team member is usually available.PROBE: curl eth_chainId on https://rpc.rabdi.db-chain.testnet.arkiv.network (no key) => {"result":"0x76edaf"} HTTP 200 (=7794095). CONFIRMED.
### reference/limits
# Limits

Arkiv enforces these limits on every entity and query. The SDK checks them before it sends anything, and exports each one as a constant.

## Entities and attributes

| Limit | Value | Constant |
| --- | --- | --- |
| Attributes per entity, and columns per schema | 32, or 31 for a named schema | `MAX_ATTRIBUTES` |
| Attribute name length | 32 bytes | `MAX_NAME_BYTES` |
| `str` value length | 128 bytes of UTF-8 | `MAX_STRING_BYTES` |
| `bytes` value length | 128 KiB | `MAX_BYTES_LENGTH` |
| All `bytes` values of one create or patch | 128 KiB | `MAX_ENTITY_BYTES` |
| Lifetime, from the block the create or extension lands in | 7,884,000 blocks, about 182.5 days | `MAX_LIFETIME` |
| Key salt | 128 bits | `MAX_SALT` |

## Values

| Type | Range | Constants |
| --- | --- | --- |
| `i32` | −2,147,483,648 to 2,147,483,647 | `I32_MIN`, `I32_MAX` |
| `u64` | 0 to 2^64 − 1 | `U64_MAX` |
| `u256` | 0 to 2^256 − 1 | `U256_MAX` |
| `dec` | 18 decimal places, within the signed 256-bit range when scaled | `DECIMAL_SCALE` |

## Queries

| Limit | Value | Constant |
| --- | --- | --- |
| Rows per page | 100 | `MAX_LIMIT`, from `@arkiv-network/sdk/query` |

The node also limits query length and nesting depth. A query over those limits fails with a `QueryError` whose `kind` is `"limits"`.### start-here/introduction
# What Arkiv is

Arkiv is a Web3 database. It stores your data as entities that you can query by indexed attributes, that your wallet owns, and that expire when you say so. You talk to it with the same tools you use for Ethereum: a wallet, a transaction, and a JSON-RPC endpoint.

## Four principles

<div class="principles">
**Queryable**
Filter and paginate records through indexed attributes with a Web2-like query language. No external indexer.

**Time-scoped**
Every entity has an expiration block. When it arrives, the entity leaves the query surface. You pay for the lifetime you choose.

**Tamper-proof**
Every write is a signed Ethereum transaction. State is committed with a keccak Merkle-Patricia trie, so any change is evident.

**Wallet-owned**
Only the owner wallet can update, extend, transfer, or delete an entity.

</div>

## Entities

An entity is one record. It holds your data as attributes, and Arkiv keeps a few fields of its own on every entity. Those fields start with `$`, which no attribute name can:

| Field | What it holds |
| --- | --- |
| `$key` | The entity’s 32-byte key, assigned when it’s created |
| `$owner` | The account that can change the entity |
| `$creator` | The account that created it. It never changes |
| `$createdAt` | The block the entity was created in |
| `$updatedAt` | The block it last changed in |
| `$expiresAt` | The block it expires at |
| `$creationFlags` | Properties fixed when the entity was created |

## Attributes

An attribute is a named, typed value, such as a `str` called `title` or a `dec` called `score`. An entity holds up to 32 of them. Each attribute is either indexed, so queries can filter on it, or stored only, which costs less. See [column types](https://docs.arkiv.network/schemas/column-types/) for the types.

In the SDK you describe an entity’s attributes once, in a [schema](https://docs.arkiv.network/schemas/define/), the way you describe a table’s columns in SQL.

## Ownership

The account that creates an entity owns it. Only the owner can change, hand over or delete it. You can also [hand an entity to another account](https://docs.arkiv.network/writing/change/#hand-an-entity-to-another-account).

## Expiration

Every entity has an expiration block. From that block on, the entity is gone: queries don’t return it and every operation on it fails. You choose a lifetime when you create the entity, and you can [extend it](https://docs.arkiv.network/writing/expiration/) later.

Arkiv counts time in blocks. A block takes 2 seconds on Rabdi, the public testnet.

## Arkiv is public

Anyone can write entities to Arkiv, with any attribute names and values, and anyone can read them. A query that filters only on common attribute names, such as `category = "news"`, can return entities from other projects. Keep your data apart in two ways:

- **Tag your entities**: give your [schema](https://docs.arkiv.network/schemas/define/#name-the-schema-after-your-project) a name unique to your project, and every query through it only sees entities with that tag
- **Filter by owner**: anyone can copy your tag. To trust what you read, keep only entities your account owns or created. See [filter on entity fields](https://docs.arkiv.network/querying/filter/#filter-on-entity-fields)

## How you reach Arkiv

Arkiv speaks Ethereum’s JSON-RPC. Writes are [transactions](https://docs.arkiv.network/json-rpc/mutating-entities/), and reads are [`arkiv_query` calls](https://docs.arkiv.network/json-rpc/querying-data/). You pay for writes in GLM, Arkiv’s gas token. On the testnet, it’s test GLM, `tGLM`. The TypeScript SDK, [`@arkiv-network/sdk`](https://www.npmjs.com/package/@arkiv-network/sdk), wraps both and builds on [viem](https://viem.sh).

Next, [store your first entity](https://docs.arkiv.network/start-here/first-entity/).### start-here/first-entity
# Store and query your first entity

<NetworkNote />

In this tutorial you write a blog post to Arkiv and read it back with a query. It takes one TypeScript file and a test account with some test GLM.

Before you start, you need:

- Node.js 22.10 or later, or [Bun](https://bun.sh)
- The private key of a test account. Fund it with test GLM (`tGLM`) from the [faucet](https://hub.arkiv.network/faucet)
- An access key. Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free key from the [Arkiv Hub](https://hub.arkiv.network/access-keys)

## Set up the project

1. Create a folder with a `package.json` that marks it as an ES module:

    ```bash
    mkdir arkiv-hello && cd arkiv-hello
    echo '{ "type": "module" }' > package.json
    ```

2. Install the SDK and [viem](https://www.npmjs.com/package/viem), which the SDK builds on:

    ```bash
        bun add @arkiv-network/sdk viem
        ```
      ```bash
        pnpm add @arkiv-network/sdk viem
        ```
      ```bash
        yarn add @arkiv-network/sdk viem
        ```
      ```bash
        npm install @arkiv-network/sdk viem
        ```
3. Put your private key and access key in environment variables:

    ```bash
    export PRIVATE_KEY=your_private_key_here
    export ARKIV_ACCESS_KEY=your_access_key_here
    ```

## Describe a post

Create `hello.ts`. Start with a schema, which lists the attributes a post has and their types. The `indexed()` ones are the ones you can filter on:

```ts title="hello.ts"
import { addr, bytes, dec, defineSchema, str } from "@arkiv-network/sdk/schema"

const Posts = defineSchema("my-app.posts", {
  author: addr().indexed(),
  category: str().indexed(),
  score: dec().indexed(),
  title: str(),
  body: bytes(),
  summary: str().optional(),
})
```

The name tags every post you write, and a query through `Posts` only sees entities with that tag. Arkiv is a public database that other projects write to as well, so replace `my-app` with a name unique to your project. The rest of the docs use this schema.

## Connect to Rabdi

Add two clients. The public client reads, and the wallet client signs and sends writes with your account:

```ts title="hello.ts"
import { createPublicClient, createWalletClient } from "@arkiv-network/sdk"
import { rabdi } from "@arkiv-network/sdk/chains"
import { http, type Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"

const chain = rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" })
const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
const publicClient = createPublicClient({ chain, transport: http() })
const walletClient = createWalletClient({ chain, transport: http(), account })
```

`rabdi` puts your [access key](https://docs.arkiv.network/start-here/access-keys/) in the RPC URL, so `http()` with no URL sends it. Without `ARKIV_ACCESS_KEY`, the chain uses the public RPC and logs a warning.

<RpcTerms />

## Write the post

`createEntity` takes the schema, the post’s values and how long the post should live. It returns the new entity’s key:

```ts title="hello.ts"
import { ExpirationTime } from "@arkiv-network/sdk"
import { stringToBytes } from "viem"

const { entityKey } = await walletClient.createEntity(
  Posts,
  {
    author: addr(account.address),
    category: "intro",
    score: dec("4.5"),
    title: "Hello, Arkiv",
    body: stringToBytes("My first entity."),
  },
  { expiration: ExpirationTime.fromDays(1) },
)
console.log("Created", entityKey)
```

Each value has to match its column. `"intro"` and `"Hello, Arkiv"` are strings, so they’re `str` values as they are. A `dec` or an `addr` has no plain JavaScript form, so you wrap those in `dec(...)` and `addr(...)`. `summary` is optional, so you can leave it out.

## Query it back

Select the fields you want, name the schema and keep only the posts your account owns:

```ts title="hello.ts"
import { hexToString } from "viem"

const { entities } = await publicClient
  .select({ $key: true, title: true, body: true })
  .from(Posts)
  .ownedBy(account.address)
  .fetch()

for (const post of entities) {
  console.log(post.$key, post.title.value, hexToString(post.body.value))
}
```

Anyone can write an entity with your schema’s tag, so `ownedBy` keeps out posts your account doesn’t own. Each row holds the fields you selected. `$key` is the entity’s key, and every name without a `$` is a column. A column comes back as a typed value, so you read it through `.value`.

## Run it

```bash
    bun hello.ts
    ```
  ```bash
    node --experimental-strip-types hello.ts
    ```
  The script prints the key of the new post, then the post itself:

```text
Created 0x5f1e…
0x5f1e… Hello, Arkiv My first entity.
```

If the create fails because of insufficient funds, the account has no tGLM yet. Get some from the [faucet](https://hub.arkiv.network/faucet) and run the script again.

## Next steps

- [Define your own schema](https://docs.arkiv.network/schemas/define/)
- [Write data](https://docs.arkiv.network/writing/create/): lifetimes, patches and batches
- [Query data](https://docs.arkiv.network/querying/select/): selections, filters and pagination### start-here/clients (BROWSER WALLET STORY)
# Connect to Arkiv

<NetworkNote />

You reach Arkiv through two clients. A public client reads: it queries entities and watches events, and needs no account. A wallet client writes: it signs and sends transactions with an account. Both are [viem clients](https://viem.sh/docs/clients/intro) with Arkiv’s actions added, so they take a chain and a transport like any viem client.

## Make the chain

`rabdi` makes the chain from your [access key](https://docs.arkiv.network/start-here/access-keys/). Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free key from the [Arkiv Hub](https://hub.arkiv.network/access-keys):

```ts
import { rabdi } from "@arkiv-network/sdk/chains"

const chain = rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" })
```

With `accessKey: ""`, the chain uses the public RPC and logs a warning. In a browser app, read the key from your bundler’s public environment variables and [lock it to your site](https://docs.arkiv.network/start-here/access-keys/#lock-the-key-down). The examples below use this `chain`.

## Read with a public client

```ts
import { createPublicClient } from "@arkiv-network/sdk"
import { http } from "viem"

const publicClient = createPublicClient({ chain, transport: http() })
```

A public client holds no account, so it’s safe in the browser. `http()` with no URL uses the chain’s RPC URL, which carries your access key.

<RpcTerms />

## Write from a server

On a server, sign with a private key. Keep the key in an environment variable or a secret store, never in code:

```ts
import { createWalletClient } from "@arkiv-network/sdk"
import { http, type Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"

const walletClient = createWalletClient({
  chain,
  transport: http(),
  account: privateKeyToAccount(process.env.PRIVATE_KEY as Hex),
})
```

## Write from a browser wallet

In the browser, let the user’s wallet sign. Pass the wallet’s provider as a `custom` transport and the user’s address as the account:

```ts
import { createWalletClient } from "@arkiv-network/sdk"
import { custom } from "viem"

const [address] = await window.ethereum.request({
  method: "eth_requestAccounts",
})
const walletClient = createWalletClient({
  chain,
  transport: custom(window.ethereum),
  account: address,
})
```

This connects to the wallet directly. In an app that uses wagmi, such as one built with RainbowKit, [build the client from wagmi’s connection](https://docs.arkiv.network/guides/react/) instead.

The wallet asks the user to approve every write, and it has to be on Rabdi when it does. `addChain` adds Rabdi to the wallet and asks the user to switch to it. Add the chain without your access key:

```ts
import { rabdi } from "@arkiv-network/sdk/chains"

await walletClient.addChain({ chain: rabdi({ accessKey: "" }) })
```

<RpcTerms />

## Read and write with one setup

A wallet client has only the write actions. Keep a public client next to it for reads. Both can share the transport settings:

```ts
const transport = http()
const publicClient = createPublicClient({ chain, transport })
const walletClient = createWalletClient({ chain, transport, account })
```### start-here/access-keys
# Access Keys

Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free access key from the [Arkiv Hub](https://hub.arkiv.network/access-keys). The key raises the rate limits on your calls.

- You get one key per wallet on each network.
- A key works on one network only. You choose the network when you create the key.
- Each key has a monthly quota, measured in cost units.

The SDK asks for a key when you connect to Rabdi. To try Arkiv without one, pass `accessKey: ""`: the SDK uses the public RPC and logs a warning.

<RpcTerms />

## Get a key

1. Open [hub.arkiv.network/access-keys](https://hub.arkiv.network/access-keys).

2. Connect your wallet and sign the sign-in message. The signature proves that you own the wallet. It does not send a transaction.

3. Complete your registration if the Hub asks for it.

4. Select the network. For the current public testnet, select **Rabdi**.

5. Give your project a name, solve the captcha, and select **Generate**.

The Hub shows your key on the page. Copy it with the copy button.

## Send the key with your requests

The RPC accepts the key in three forms. Use the one that fits your client.

| Form | How |
| ---- | --- |
| In the path | Append the key to the RPC URL: `https://rpc.rabdi.db-chain.testnet.arkiv.network/<key>` |
| `X-API-KEY` header | `X-API-KEY: <key>` |
| Bearer token | `Authorization: Bearer <key>` |

### HTTP

```bash
curl --json '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}' \
  -H "X-API-KEY: <key>" \
  https://rpc.rabdi.db-chain.testnet.arkiv.network
```

### WebSocket

The WebSocket endpoint accepts the key in the path or in the `X-API-KEY` header.

```bash
wscat -c wss://rpc.rabdi.db-chain.testnet.arkiv.network/<key> \
  -x '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}' \
  -w 1
```

## Use a key with the SDK

Pass the key to `rabdi`. Read it from an environment variable rather than writing it in code:

```ts
import { createPublicClient } from "@arkiv-network/sdk"
import { rabdi } from "@arkiv-network/sdk/chains"
import { http } from "viem"

const publicClient = createPublicClient({
  chain: rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" }),
  transport: http(),
})
```

`rabdi` puts the key at the end of both RPC URLs. So `http()` and `webSocket()` with no URL send it. Don’t add a chain with your key to a user’s wallet: the wallet keeps the URL and uses it for every app. [Add the chain without a key](https://docs.arkiv.network/start-here/clients/#write-from-a-browser-wallet) instead.

Leaving out `accessKey` is a type error, and throws `MissingAccessKeyError` if it runs anyway. A key the RPC doesn’t know fails every call with HTTP status 401.
**Handle the key with care:** A key isn’t a password, but anyone who has it can spend your quota. In a web app, anyone can read it from the network requests, so add your site to the key’s **Origins**. On a server, add your server’s IP to the **IP allowlist**. See [lock the key down](#lock-the-key-down).

## Watch your quota

The **Usage** tab on the Hub shows the cost units you used this month, the RPC calls and requests made, and the date the quota resets. The counts can lag a few minutes behind live traffic.

When you reach the quota, the RPC can reject calls on that key. The Hub shows a warning when this happens.

If you need more, select **Request more quota** on the Usage tab and give a short reason. For very large quotas, use **Request even higher quota** to contact the team.

## Lock the key down

The Hub has two allowlists. Both are empty by default, which allows requests from anywhere.

- **Origins.** List the websites that can use the key from a browser. Non-browser clients can forge the `Origin` header, so treat this as attribution, not access control.
- **IP allowlist.** List the exact server IPs that can use the key. No CIDR ranges. Requests from other IPs are rejected, so this is real access control.

## Regenerate or delete a key

Both actions are on the key header in the Hub.

- **Regenerate** gives you a new key. The old key stops working at once. Update your integrations before you regenerate.
- **Delete** removes the key. This is permanent, but you can generate a new key afterwards.

## Get help

If your calls are rejected and you are not over quota, ask in [Discord](https://discord.gg/arkiv).
## [01:30] Write/query pages (docs.arkiv.network/<path>.md). Confidence HIGH. No prompt injection seen in these pages (agent-skill page is a benign skills install guide).
### writing_create
# Create entities

`createEntity` writes one entity through a schema. It takes the schema, the entity’s values and its options, and resolves once the transaction is in a block. The examples on this page use the `Posts` schema and clients from [your first entity](https://docs.arkiv.network/start-here/first-entity/).

## Write an entity

```ts
import { ExpirationTime } from "@arkiv-network/sdk"
import { addr, dec } from "@arkiv-network/sdk/schema"
import { stringToBytes } from "viem"

const { entityKey, txHash, expiresAt } = await walletClient.createEntity(
  Posts,
  {
    author: addr(account.address),
    category: "news",
    score: dec("3.9"),
    title: "Arkiv ships schemas",
    body: stringToBytes("Columns, types and indexes."),
  },
  { expiration: ExpirationTime.fromDays(30) },
)
```

The result holds the new entity’s key, the transaction hash, and the block the entity expires at.

The values are checked against the schema, both when you compile and when the code runs:

- Every required column needs a value
- An optional column can be left out
- A column with a default that you leave out is written with its default
- Each value must have its column’s type. A bare `5` for a `dec` column is a compile error: write `dec(5)`

A value that doesn’t fit throws `SchemaMismatchError` before anything is sent.

## Set the lifetime

`expiration` is required. Build it with `ExpirationTime`:

```ts
{ expiration: ExpirationTime.fromHours(12) }
{ expiration: ExpirationTime.atDate(new Date("2027-01-01")) }
```

See [expiration](https://docs.arkiv.network/writing/expiration/) for every option.

## Fix properties at creation

`flags` sets properties that can never change afterwards. Both are off by default:

- **`readonly`**: the entity’s attributes can never be changed. You can still extend it, hand it over or delete it
- **`permissionlessExtension`**: anyone can extend the entity, not only its owner. Use this to let others keep an entity alive without letting them change it

```ts
await walletClient.createEntity(Posts, values, {
  expiration: ExpirationTime.fromDays(30),
  flags: { readonly: true },
})
```

Read them back from the entity’s `$creationFlags`.

## Choose how the key is made

Arkiv derives an entity’s key from the owner, a per-owner counter and a salt. By default the salt is 128 random bits, so nobody can guess a key before the entity exists. Pass `salt: NO_SALT` for a key that anyone can work out from the owner’s address and counter:

```ts
import { NO_SALT } from "@arkiv-network/sdk"

await walletClient.createEntity(Posts, values, {
  expiration: ExpirationTime.fromDays(30),
  salt: NO_SALT,
})
```

To learn a key before you send the create, see [predict keys](https://docs.arkiv.network/writing/batches/#refer-to-an-entity-created-in-the-same-batch).

## Set transaction fields

Every write takes an optional last argument with transaction fields: `gas`, `nonce`, and either `gasPrice` or `maxFeePerGas` and `maxPriorityFeePerGas`. Anything you leave out is estimated:

```ts
await walletClient.createEntity(Posts, values, options, {
  maxFeePerGas: 2_000_000_000n,
})
```

## Handle failures

`createEntity` throws before it sends anything when the input is wrong:

- **`SchemaMismatchError`**: a value is missing or has the wrong type
- **`InvalidValueError`**: a value doesn’t fit its type, such as an `i32` out of range
- **`EntityTooLargeError`**: the `bytes` values add up to more than 128 KiB
- **`InvalidExpiryError`**: the expiration is already in the past, or too far away to store

It throws `EntityMutationError` when the transaction fails or reverts. See [errors](https://docs.arkiv.network/reference/errors/) for the full list.
### writing_expiration
# Expiration

Every entity expires at a block you choose. From that block on, queries don’t return it and every operation on it fails. You set a lifetime of up to about 182 days when you create the entity, and can extend it any time before it expires. A shorter lifetime costs less, so start short and extend what you still need.

## Build an expiration

`ExpirationTime` builds the `expiration` that `createEntity`, `extendEntity` and batches take. Use a duration, a deadline, or a deadline with a minimum:

```ts
import { ExpirationTime } from "@arkiv-network/sdk"

ExpirationTime.fromHours(12)
ExpirationTime.fromDays(30)
ExpirationTime.max()
ExpirationTime.atDate(new Date("2027-01-01"))
ExpirationTime.atBlock(5_000_000n)
ExpirationTime.atDate(new Date("2027-01-01"), {
  atLeast: ExpirationTime.fromDays(1),
})
```

With `atLeast`, the entity lives until the deadline or for the minimum, whichever ends later.

| Helper | Lifetime |
| --- | --- |
| `fromSeconds(n)` | `n` seconds, a multiple of the 2-second block time |
| `fromMinutes(n)`, `fromHours(n)`, `fromDays(n)`, `fromWeeks(n)` | That many minutes, hours, days or weeks |
| `fromMonths(n)` | `n` periods of exactly 30 days |
| `fromBlocks(n)` | `n` blocks |
| `max()` | The [longest lifetime](#the-longest-lifetime) the chain allows |
| `atBlock(block, { atLeast? })` | Until the given block |
| `atDate(date, { atLeast? })` | Until the given time, rounded up to the next block |

## Time is counted in blocks

Arkiv counts lifetimes in blocks, and a block takes 2 seconds. The SDK turns durations and dates into blocks at that rate, so a lifetime in days is approximate if blocks come faster or slower. The result of a write tells you the exact block:

```ts
const { expiresAt } = await walletClient.createEntity(Posts, values, {
  expiration: ExpirationTime.fromDays(30),
})
```

`fromSeconds` throws `InvalidExpiryError` for a duration that isn’t a whole number of blocks, such as 3 seconds.

## The longest lifetime

No entity lives more than 7,884,000 blocks, about 182.5 days, past the block its create or extension lands in. The SDK exports this limit as `MAX_LIFETIME`. Use `ExpirationTime.max()` to ask for all of it:

```ts
const { expiresAt } = await walletClient.createEntity(Posts, values, {
  expiration: ExpirationTime.max(),
})
```

A longer expiration throws `InvalidExpiryError` before anything is sent. That includes `fromYears(1)`, `fromMonths(7)` and an `atDate` more than about 182 days away. To keep an entity longer, [extend it](#extend-an-entity) before it expires.

## Extend an entity

`extendEntity` sets a new expiration on an existing entity:

```ts
const { expiresAt } = await walletClient.extendEntity({
  entityKey,
  expiration: ExpirationTime.fromDays(30),
})
```

A duration counts from now, not from the current expiration. Extending an entity with 10 days left by `fromDays(30)` leaves it with 30 days, not 40. Extending by `max()` resets it to the full 182.5 days. A new expiration earlier than the current one is rejected, and one equal to it changes nothing.

Only the owner can extend an entity, unless it was created with the [`permissionlessExtension` flag](https://docs.arkiv.network/writing/create/#fix-properties-at-creation).

## Find out when an entity expires

Select `$expiresAt` to read an entity’s expiration block, or filter on it to find entities that expire soon:

```ts
import { lt } from "@arkiv-network/sdk/query"
import { u64 } from "@arkiv-network/sdk/schema"

const { currentBlock } = await publicClient.getBlockTiming()
const soon = await publicClient
  .select({ $key: true, $expiresAt: true })
  .from(Posts)
  .where(lt("$expiresAt", u64(currentBlock + 43_200n)))
  .fetch()
```

Here `43_200n` blocks is one day. Arkiv emits no event when an entity expires. If you keep a copy of Arkiv data elsewhere, use `$expiresAt` to drop expired entities yourself.
### writing_change
# Change and delete entities

After you create an entity, you can patch its columns, hand it to another account, or delete it. Only the owner can do any of these. The examples on this page use the `Posts` schema and clients from [your first entity](https://docs.arkiv.network/start-here/first-entity/).

## Patch columns

`patchEntity` changes the columns you name and leaves the rest as they are. `set` writes new values, and `unset` removes optional columns:

```ts
import { dec } from "@arkiv-network/sdk/schema"

await walletClient.patchEntity(Posts, entityKey, {
  set: { score: dec("4.7"), summary: "Updated with new numbers" },
})
await walletClient.patchEntity(Posts, entityKey, { unset: ["summary"] })
```

The patch is typed by the schema. Unsetting a required column, or setting a value of the wrong type, is a compile error.

A patch throws before it sends anything when:

- **`EmptyPatchError`**: it has nothing to set or unset
- **`ConflictingMutationError`**: the same column is in both `set` and `unset`

An entity created with the [`readonly` flag](https://docs.arkiv.network/writing/create/#fix-properties-at-creation) can’t be patched.

## Hand an entity to another account

`changeOwnership` makes another account the owner. From then on, only the new owner can change the entity:

```ts
await walletClient.changeOwnership({
  entityKey,
  newOwner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
})
```

The entity’s `$creator` stays the account that created it.

## Delete an entity

`deleteEntity` removes an entity before it expires:

```ts
await walletClient.deleteEntity({ entityKey })
```

Once the transaction is in a block, the entity is gone, as if it had expired.

## Handle failures

The node rejects an operation from an account that isn’t the owner, or on an entity that doesn’t exist or has expired. The SDK throws `EntityMutationError` with the reason:

```ts
import { EntityMutationError } from "@arkiv-network/sdk"

try {
  await walletClient.deleteEntity({ entityKey })
} catch (error) {
  if (error instanceof EntityMutationError) console.error(error.message)
}
```
### writing_batches
# Batches

`executeBatch` sends many operations in one transaction. Either every operation applies or none does. A batch can mix entities of several schemas, and a create in it can refer to another entity the same batch creates. The examples on this page use the `Posts` schema and clients from [your first entity](https://docs.arkiv.network/start-here/first-entity/).

## Send a batch

Each kind of operation has its own list. Creates and patches name their schema:

```ts
import { ExpirationTime } from "@arkiv-network/sdk"
import { dec } from "@arkiv-network/sdk/schema"

const result = await walletClient.executeBatch({
  creates: [
    { schema: Posts, values, expiration: ExpirationTime.fromDays(7) },
  ],
  patches: [{ schema: Posts, entityKey, set: { score: dec("5") } }],
  extensions: [
    { entityKey: otherKey, expiration: ExpirationTime.fromDays(90) },
  ],
  ownershipChanges: [{ entityKey: oldKey, newOwner: teammate }],
  deletes: [{ entityKey: staleKey }],
})
```

Every list is optional, but the batch needs at least one operation. A create takes the same `flags` and `salt` as [`createEntity`](https://docs.arkiv.network/writing/create/).

The result holds the transaction hash and the keys each kind of operation touched. `createdEntities` lists the new keys in the order of `creates`:

```ts
const [newPostKey] = result.createdEntities
```

## Refer to an entity created in the same batch

To link two new entities, you need the first one’s key before it exists. `predictEntityKeys` works out the keys an account’s next creates will get, each with the salt that produces it:

```ts
import { defineSchema, key, str } from "@arkiv-network/sdk/schema"

const Comments = defineSchema("comments", {
  post: key().indexed(),
  text: str(),
})

const [post, comment] = await publicClient.predictEntityKeys({
  owner: account.address,
  count: 2,
})
```

Pass each salt to its create, in the same order. The comment stores the post’s key:

```ts
const expiration = ExpirationTime.fromDays(7)

await walletClient.executeBatch({
  creates: [
    { schema: Posts, values, expiration, salt: post.salt },
    {
      schema: Comments,
      values: { post: key(post.key), text: "First!" },
      expiration,
      salt: comment.salt,
    },
  ],
})
```

A prediction holds only while nothing else from the same account lands first. If another create from the account gets in between, the keys change.
### querying_filter
# Filter results

`where` decides which entities a query returns. You build conditions with functions from `@arkiv-network/sdk/query`, and through a schema they’re checked against its indexed columns. The examples on this page use the `Posts` schema and clients from [your first entity](https://docs.arkiv.network/start-here/first-entity/).

## Add conditions

```ts
import { and, eq, gt } from "@arkiv-network/sdk/query"
import { dec } from "@arkiv-network/sdk/schema"

const { entities } = await publicClient
  .select({ $key: true, title: true })
  .from(Posts)
  .where(and(eq("category", "news"), gt("score", dec("4"))))
  .fetch()
```

Several conditions in one `where`, or across several `where` calls, must all hold.

## Conditions

| Function | Matches entities where the attribute |
| --- | --- |
| `eq(name, value)` | Equals the value |
| `gt`, `gte`, `lt`, `lte` | Is greater than, at least, less than, or at most the value |
| `between(name, low, high)` | Is between the two values, both included |
| `startsWith(name, prefix)` | Is a `str` that starts with the prefix |
| `exists(name)` | Is set, with any type |
| `hasType(name, type)` | Is set with the given type, such as `"i32"` |

Every type except `bytes` can be compared and ranged. Numbers and decimals compare by value, and `false` comes before `true`. Strings, addresses and keys compare byte by byte, so strings sort by their UTF-8 bytes, not alphabetically.

`between` is the same as `and(gte(...), lte(...))` in one condition:

```ts
import { between } from "@arkiv-network/sdk/query"

const { entities } = await publicClient
  .select({ $key: true, title: true })
  .from(Posts)
  .where(between("score", dec("3.5"), dec("5")))
  .fetch()
```

Combine conditions with:

- **`and(...)`**: all must hold
- **`or(...)`**: at least one must hold

## Mistakes the compiler catches

Through a schema, a condition must name an indexed column and use its type. Anything else is a compile error, and throws `InvalidPredicateError` if it runs anyway:

```ts
const posts = publicClient.select({ $key: true }).from(Posts)

posts.where(eq("title", "Hello")) // title isn’t indexed
posts.where(eq("score", 5)) // score is a dec: write dec(5)
posts.where(between("score", dec(1), 5)) // both bounds need one type
```

## Filter on entity fields

Four entity fields can be filtered on: `$key`, `$owner`, `$creator` and `$expiresAt`. `ownedBy` and `createdBy` are shortcuts for the two accounts.

Arkiv is public, and anyone can write an entity with your schema’s tag and attribute names. Filtering by owner or creator is the only way to be sure an entity came from an account you trust. Filter by the user’s wallet for data users own, or by your backend’s account for data your app writes:

```ts
import { lt } from "@arkiv-network/sdk/query"
import { u64 } from "@arkiv-network/sdk/schema"

const { entities } = await publicClient
  .select({ $key: true, title: true })
  .from(Posts)
  .ownedBy(account.address)
  .where(lt("$expiresAt", u64(2_000_000n)))
  .fetch()
```

The creator never changes. The owner changes when the entity is handed over, so `ownedBy` and `createdBy` can differ.

## Queries without a filter

A query through a named schema needs no `where`: it matches every entity with the schema’s tag. Any other query needs at least one condition, or it throws `InvalidPredicateError`.

## See the query that’s sent

`toString()` on a query returns the text the node receives, in the [query language](https://docs.arkiv.network/reference/query-language/):

```ts
const query = publicClient
  .select({ $key: true })
  .from(Posts)
  .where(and(eq("category", "news"), gt("score", dec("4"))))

console.log(query.toString())
```

This prints:

```text
arkiv.schema = str('my-app.posts') AND category = str('news') AND score > dec(4)
```
### querying_select
# Select fields

A query starts with `select`, which names the fields you want back. Each result is a flat row with those fields, typed from the selection and the schema. The examples on this page use the `Posts` schema and clients from [your first entity](https://docs.arkiv.network/start-here/first-entity/).

## Pick fields and columns

Set each field you want to `true`. Names that start with `$` are entity fields, and every other name is a column:

```ts
import { eq } from "@arkiv-network/sdk/query"

const { entities } = await publicClient
  .select({ $key: true, $createdAt: true, title: true, score: true })
  .from(Posts)
  .where(eq("category", "news"))
  .fetch()

const [row] = entities
row.$key       // Hex
row.$createdAt // bigint, a block number
row.title      // StrValue: row.title.value is a string
row.score      // DecValue: row.score.value is a string like "4.5"
```

Reading a field you didn’t select is a compile error. Every field is fetched over the network, so select only what you use.

The entity fields are:

| Field | Type |
| --- | --- |
| `$key` | `Hex` |
| `$owner` | `Hex`, a checksummed address |
| `$creator` | `Hex`, a checksummed address |
| `$createdAt` | `bigint`, a block number |
| `$updatedAt` | `bigint`, a block number |
| `$expiresAt` | `bigint`, a block number |
| `$creationFlags` | `{ readonly, permissionlessExtension, raw }` |

A column named like an entity field doesn’t clash with it. If a schema has an `owner` column, `owner` selects the column and `$owner` the entity’s owner.

## Select everything

Call `select()` with nothing, or with `"*"`, for every entity field and every column:

```ts
const { entities } = await publicClient
  .select()
  .from(Posts)
  .where(eq("category", "news"))
  .fetch()
```

## Read every attribute as a map

`$attributes: true` returns all of an entity’s attributes in one map. Use it to read entities whose attributes you don’t know by name:

```ts
const { entities } = await publicClient
  .select({ $key: true, $attributes: true })
  .where(eq("category", "news"))
  .fetch()
```

`$attributes` only takes `true`. To fetch some attributes, select each by name. To learn what entities hold without fetching their values, select [`$attributeSchema`](https://docs.arkiv.network/querying/without-schema/#discover-an-entitys-shape).

## Entities that don’t fit the schema

A query through a schema checks every row against the columns you selected. A matching entity that misses a required column, or holds a value of another type, is left out of the page. So is an entity with another schema’s tag. Anyone can write an entity your query matches, so one that doesn’t fit never breaks the read of the others. Each page reports how many it skipped:

```ts
const page = await publicClient
  .select()
  .from(Posts)
  .where(eq("category", "news"))
  .fetch()

console.log(`${page.skipped} entities did not fit Posts`)
```

A page with skipped entities holds fewer rows than its limit, and can be empty while later pages still have rows.

To fail the fetch with `SchemaMismatchError` instead, pass `onMismatch: "throw"`:

```ts
publicClient.select().from(Posts, { onMismatch: "throw" })
```

## Selections built at runtime

Write the selection inline. A selection stored in a variable widens `true` to `boolean`. The SDK then can’t tell which fields come back, so every field of the row is optional. Add `as const` to keep it exact:

```ts
const fields = { $key: true, title: true } as const

const { entities } = await publicClient.select(fields).from(Posts).fetch()
```

A selection that’s only known at runtime, typed `SelectArg`, gives rows whose fields are all optional.
### reference_query-language
# Query language

A query is a boolean expression over attributes, optionally followed by a sort. The SDK’s condition and sort functions write it for you. You write it by hand when you pass a string to `query()`.

```sql
category = str('news') AND score > dec(4) AND EXISTS(summary)
```

## Comparisons

| Syntax | Matches when the attribute |
| --- | --- |
| `name = value` | Equals the value |
| `name < value`, `<=`, `>`, `>=` | Compares as given |
| `name BETWEEN low AND high` | Is between the two values, both included. Both need one type |
| `name STARTSWITH str('prefix')` | Is a `str` that starts with the prefix |
| `EXISTS(name)` | Is set, with any type |
| `TYPEOF(name) = type` | Is set with the given type, such as `i32` |

A comparison also checks the type: `score = i32(4)` doesn’t match a `score` stored as a `dec`. It only sees indexed attributes, so it never matches an attribute stored without an index.

Every type can be compared and ranged. Numbers compare by value, and `false` comes before `true`. `str`, `addr` and `key` compare byte by byte, with no collation. Only `str` takes `STARTSWITH`.

The `AND` inside `BETWEEN` belongs to it. `a BETWEEN 1 AND 5 AND b = 2` means `(a BETWEEN 1 AND 5) AND b = 2`.

## Values

Write every value with its type, except booleans:

| Type | Example |
| --- | --- |
| `bool` | `true`, `false` |
| `i32` | `i32(-7)` |
| `u64` | `u64(1700000000)` |
| `u256` | `u256(1000000000000000000)` |
| `dec` | `dec(4.5)` |
| `str` | `str('it''s')`. A quote inside is doubled |
| `addr` | `addr(0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)` |
| `key` | `key(0x9f2c…)`, 32 bytes |

A bare number is an `i32`. `bytes` values can’t be compared, since `bytes` is never indexed.

## Entity fields

Four entity fields can be filtered and sorted on, each with a fixed type:

| Field | Type |
| --- | --- |
| `$key` | `key` |
| `$owner` | `addr` |
| `$creator` | `addr` |
| `$expiresAt` | `u64` |

## Combining

`AND` and `OR` combine conditions. `AND` binds tighter than `OR`. Use parentheses to group:

```sql
(category = str('news') OR category = str('blog')) AND score >= dec(3)
```

## Sorting

`ORDER BY` at the end of a query sorts the entities it matches by one attribute. It names the attribute, the type to sort it as, and a direction:

```sql
category = str('news') ORDER BY score:dec DESC
```

- `ASC` sorts smallest first and `DESC` largest first. Without either, the sort is `ASC`. The SDK always writes one
- An attribute needs its type after the `:`. An [entity field](#entity-fields) has a fixed type, so `ORDER BY $expiresAt` needs none, and a `:` can repeat it but not change it
- A sort sees only the attribute stored with its type. An entity without the attribute, or with it stored as another type, sorts below every value: first with `ASC`, last with `DESC`
- A query sorts by one attribute only. Entities that tie come in the node’s own order
- Unlike a condition, a sort reads an attribute whether or not it’s indexed. `$createdAt` and `$updatedAt` can’t be sorted on. Values sort in the order they compare
- `ORDER BY` applies to the whole condition, so `a = i32(1) OR b = i32(2) ORDER BY a:i32 ASC` needs no parentheses

## Other rules

- Keywords are case-insensitive: `and` and `AND` are the same
- The keywords `AND`, `OR`, `NOT`, `TRUE`, `FALSE`, `BETWEEN`, `STARTSWITH`, `EXISTS`, `TYPEOF`, `ORDER`, `BY`, `ASC` and `DESC`, and the type names, can’t be attribute names
- `--` starts a comment that runs to the end of the line
- A named schema’s tag is the `str` attribute `arkiv.schema`. `arkiv.schema = str('my-app.posts')` matches every entity written through a schema named `my-app.posts`

## Errors

The node rejects a query it can’t run with a `QueryError`. Its `kind` says why:

| `kind` | Cause |
| --- | --- |
| `parse` | The query doesn’t parse |
| `type` | A condition uses the wrong type for its operator, such as `STARTSWITH` on an `i32`, or `BETWEEN` bounds of two types |
| `literal` | A value is invalid, such as an `i32` out of range |
| `limits` | The query goes over a node limit, such as its length or nesting depth |
### schemas_define
# Define a schema

A schema lists the attributes an entity has, their types, and which of them are indexed. The SDK types your writes and reads from it and checks them when they run. Arkiv itself never sees the schema: it stores each attribute with its type and an indexed flag, and the schema decides both.

## Declare the columns

Call `defineSchema` with a name and an object of columns. Each column is a type constructor called with no arguments:

```ts
import { addr, bytes, dec, defineSchema, str } from "@arkiv-network/sdk/schema"

const Posts = defineSchema("my-app.posts", {
  author: addr().indexed(),
  category: str().indexed(),
  score: dec().indexed(),
  title: str(),
  body: bytes(),
  summary: str().optional(),
})
```

The key of each entry is the attribute’s name. See [column types](https://docs.arkiv.network/schemas/column-types/) for every type and what it holds.

## Index the columns you filter on

`.indexed()` makes a column filterable. A column without it is stored, selectable and [sortable](https://docs.arkiv.network/querying/sort/), but a filter on it is a compile error:

```ts
import { eq } from "@arkiv-network/sdk/query"

publicClient.select().from(Posts).where(eq("category", "news")) // works
publicClient.select().from(Posts).where(eq("title", "Hello"))   // compile error
```

An index costs extra on every write, so index only what you filter on. `bytes` columns can’t be indexed.

## Make a column optional or give it a default

By default, every column is required: a create must give it a value. Two modifiers change that:

- **`.optional()`**: a create may leave the column out, a patch may unset it, and a read gives `undefined` where it’s missing
- **`.default(value)`**: a create that leaves the column out writes this value instead

```ts
import { bool, defineSchema, i32, key, str } from "@arkiv-network/sdk/schema"

const Comments = defineSchema("comments", {
  post: key().indexed(),
  text: str(),
  likes: i32().indexed().default(0),
  hidden: bool().optional(),
})
```

Modifiers chain in any order, and each returns a new column.

## Name the schema after your project

A named schema tags every entity it creates with an indexed `arkiv.schema` attribute that holds the name. A query through the schema filters on that tag, so it only sees entities written through it:

```ts
const { entities } = await publicClient.select().from(Posts).fetch()
```

This returns posts only, even with no other filter. The tag isn’t part of the rows you read back.

Arkiv is a public database, and other projects may define a schema called `posts` too. Put your project in the name, as in `my-app.posts`, so your queries don’t pick up their entities. A name can be any text up to 128 bytes.

The tag keeps other projects’ data out by accident, not on purpose: anyone can write an entity with your tag. When you need to trust what you read, also [filter by owner or creator](https://docs.arkiv.network/querying/filter/#filter-on-entity-fields).

Leave the name out when you don’t want a tag:

```ts
const Tags = defineSchema({ label: str().indexed() })
```

An unnamed schema still types and checks what you read and write. A query through it matches whatever its filters match, whichever project wrote the entities, so give its queries a filter only your data matches.

## Naming rules

An attribute name:

- Starts with a letter, followed by letters, digits, `.`, `-` or `_`
- Is at most 32 bytes long
- Is case-sensitive: `Title` and `title` are different attributes
- Can’t contain `--`, or be a word the query language reserves, such as `and`, `not`, `between`, `order`, `desc` or a type name like `str`

A name can’t start with `$`, so a column never collides with an entity field. A column called `owner` is fine, and you read it next to the entity’s `$owner`. `arkiv.schema` is the only name a schema can’t use.

A schema has at most 32 columns, or 31 if it’s named, since the tag counts as one more attribute.
### schemas_column-types
# Column types

Arkiv stores 9 attribute types. Each type constructor does two jobs. Called with no arguments it’s a column, as in `dec()`. Called with a value it’s a typed value, as in `dec("4.5")`. SQL works the same way, with `DECIMAL` as a type and `DECIMAL '4.5'` as a value.

## Types

| Type | Holds | `.value` in JavaScript |
| --- | --- | --- |
| `bool` | `true` or `false` | `boolean` |
| `i32` | A signed 32-bit integer | `number` |
| `u64` | An unsigned 64-bit integer | `bigint` |
| `u256` | An unsigned 256-bit integer | `bigint` |
| `dec` | A signed decimal with 18 decimal places | `string`, like `"4.5"` |
| `str` | Text, up to 128 bytes of UTF-8 | `string` |
| `addr` | An Ethereum address | checksummed hex |
| `key` | The key of another entity | hex |
| `bytes` | Up to 128 KiB of binary data | hex |

Every indexed column takes `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `between`, `exists` and `hasType`. Only `str` takes `startsWith`. `bytes` can’t be indexed, so it can’t be filtered on. See [filter results](https://docs.arkiv.network/querying/filter/).

## Write a value

Five types have a plain JavaScript form you can write as is. Through a schema, a plain value only fits a column of its own type:

| JavaScript value | Type |
| --- | --- |
| `boolean` | `bool` |
| `number` | `i32` |
| `bigint` | `u256` |
| `string` | `str` |
| `Uint8Array` | `bytes` |

Wrap every other value in its constructor:

```ts
import { addr, dec, key, u64 } from "@arkiv-network/sdk/schema"

dec("4.5")
u64(1_700_000_000n)
addr("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
key(entityKey)
```

A bare `5` is an `i32`, so it doesn’t fit a `dec` column: write `dec(5)`. A bare `5n` is a `u256`, not a `u64`: write `u64(5n)`.

A constructor checks its value and throws `InvalidValueError` when the value doesn’t fit, for example `i32(2 ** 40)`.

## Type details

- **`dec`**: pass fractions as strings, since a JavaScript number can’t hold most decimals exactly. `dec(0.1)` throws, `dec("0.1")` works. More than 18 decimal places throws instead of rounding. `decUnits(value)` gives the exact scaled `bigint` for arithmetic, and `decFromUnits(units)` turns it back
- **`str`**: the 128-byte limit counts bytes, not characters. Any character is allowed. To filter on a hash or other binary value, store it as lowercase hex, which fits up to 64 bytes
- **`addr`**: mixed-case input must have a valid EIP-55 checksum, so a mistyped address throws. All-lowercase input is accepted. Addresses come back checksummed
- **`key`**: a reference to another entity. Arkiv doesn’t check that the entity exists, and a reference to a deleted or expired entity stays as it is
- **`bytes`**: each value holds up to 128 KiB, and all the `bytes` values of one create or patch share a single 128 KiB budget. Going over throws `EntityTooLargeError`. Pass a `Uint8Array` or hex, and read hex back
### guides_react
# Use Arkiv with React

In a React app that connects wallets through wagmi, read through an Arkiv public client and write through an Arkiv wallet client built from wagmi’s connection. Users connect once, with the connect button you already have. This guide uses a Next.js app with RainbowKit, which includes wagmi and TanStack Query. The same code works with ConnectKit or plain wagmi.

Before you start, you need:

- A React app with wagmi and TanStack Query set up, for example from RainbowKit’s Next.js template
- The SDK installed

```bash
    bun add @arkiv-network/sdk
    ```
  ```bash
    pnpm add @arkiv-network/sdk
    ```
  ```bash
    yarn add @arkiv-network/sdk
    ```
  ```bash
    npm install @arkiv-network/sdk
    ```
  ## Make the chains

`rabdi` makes the chain from your [access key](https://docs.arkiv.network/start-here/access-keys/). Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free key from the [Arkiv Hub](https://hub.arkiv.network/access-keys). Make the chain once and share it. Make a second one without the key for the user’s wallet:

```ts title="lib/arkiv.ts"
import { rabdi } from "@arkiv-network/sdk/chains"

export const chain = rabdi({
  accessKey: process.env.NEXT_PUBLIC_ARKIV_ACCESS_KEY ?? "",
})

// For the user's wallet, which keeps the chain's RPC URL
export const walletChain = rabdi({ accessKey: "" })
```

The key ships to the browser, so add your site to the key’s **Origins** on the Hub. See [lock the key down](https://docs.arkiv.network/start-here/access-keys/#lock-the-key-down).

## Add Rabdi to the wagmi config

Add `walletChain` to the chains your config lists, next to any chains your app already uses:

```ts title="lib/wagmi.ts"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { walletChain } from "@/lib/arkiv"

export const config = getDefaultConfig({
  appName: "My App",
  projectId: "your_walletconnect_project_id",
  chains: [walletChain],
  ssr: true,
})
```

RainbowKit then asks the user to switch networks when their wallet is on a chain that isn’t in the list. If the wallet doesn’t have Rabdi yet, wagmi adds it with the chain’s RPC URL. The wallet keeps that URL and uses it for every app on Rabdi, so `walletChain` has no key. Otherwise other apps would spend your quota. Your public client still reads with `chain` and your key.

## Share the schema and a public client

Reads don’t need the user’s wallet, so one public client serves the whole app. Put it in `lib/arkiv.ts`, next to the chain and your schemas:

```ts title="lib/arkiv.ts"
import { createPublicClient } from "@arkiv-network/sdk"
import { addr, bytes, dec, defineSchema, str } from "@arkiv-network/sdk/schema"
import { http } from "viem"

export const Posts = defineSchema("my-app.posts", {
  author: addr().indexed(),
  category: str().indexed(),
  score: dec().indexed(),
  title: str(),
  body: bytes(),
  summary: str().optional(),
})

export const publicClient = createPublicClient({
  chain,
  transport: http(),
})
```

<RpcTerms />

## Read with TanStack Query

Wrap each query in `useQuery`. This hook lists the posts an account owns:

```ts title="hooks/use-posts.ts"
import { useQuery } from "@tanstack/react-query"
import type { Address } from "viem"
import { Posts, publicClient } from "@/lib/arkiv"

export function usePosts(owner: Address | undefined) {
  return useQuery({
    queryKey: ["posts", owner],
    enabled: owner !== undefined,
    queryFn: async () => {
      const { entities } = await publicClient
        .select({ $key: true, title: true, score: true })
        .from(Posts)
        .ownedBy(owner as Address)
        .fetch()
      return entities
    },
  })
}
```

Anyone can write entities with your schema’s tag, so `ownedBy` keeps the list to the account’s own posts. Keep `bigint` values out of query keys, since TanStack Query can’t hash them.

Use the hook with the connected account:

```tsx title="components/my-posts.tsx"
"use client"

import { useAccount } from "wagmi"
import { usePosts } from "@/hooks/use-posts"

export function MyPosts() {
  const { address } = useAccount()
  const { data: posts, isPending } = usePosts(address)

  if (!address) return <p>Connect a wallet to see your posts.</p>
  if (isPending) return <p>Loading…</p>

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.$key}>
          {post.title.value} ({post.score.value})
        </li>
      ))}
    </ul>
  )
}
```

## Build a wallet client from wagmi

Writes need an Arkiv wallet client. Build it from the connection wagmi already manages:

```ts title="hooks/use-arkiv-wallet.ts"
import { createWalletClient } from "@arkiv-network/sdk"
import { useMemo } from "react"
import { custom } from "viem"
import { useWalletClient } from "wagmi"
import { chain } from "@/lib/arkiv"

export function useArkivWallet() {
  // Only resolves while the wallet is connected and on Rabdi
  const { data: walletClient } = useWalletClient({ chainId: chain.id })

  return useMemo(() => {
    if (!walletClient) return undefined
    return createWalletClient({
      chain,
      transport: custom(walletClient.transport),
      account: walletClient.account,
    })
  }, [walletClient])
}
```

`custom(walletClient.transport)` sends the Arkiv client’s requests through the connected wallet, so the user approves each write there. With `chainId: chain.id`, the hook returns `undefined` until the wallet is connected and on Rabdi.

Don’t use `window.ethereum` in a wagmi app. It may not be the wallet the user connected, and with WalletConnect there may be none.

## Write with a mutation

Wrap each write in `useMutation`, and invalidate the queries it changes:

```ts title="hooks/use-create-post.ts"
import { ExpirationTime } from "@arkiv-network/sdk"
import { addr, dec } from "@arkiv-network/sdk/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { stringToBytes } from "viem"
import { useArkivWallet } from "@/hooks/use-arkiv-wallet"
import { Posts } from "@/lib/arkiv"

export function useCreatePost() {
  const arkiv = useArkivWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: { title: string; body: string }) => {
      if (!arkiv) throw new Error("Connect a wallet on Rabdi first")
      const values = {
        author: addr(arkiv.account.address),
        category: "news",
        score: dec("4.5"),
        title: post.title,
        body: stringToBytes(post.body),
      }
      const expiration = ExpirationTime.fromDays(30)
      return arkiv.createEntity(Posts, values, { expiration })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  })
}
```

`createEntity` resolves once the post is in a block, so the refetched list includes it. Call the mutation from a component:

```tsx title="components/new-post-button.tsx"
"use client"

import { useCreatePost } from "@/hooks/use-create-post"
import { useArkivWallet } from "@/hooks/use-arkiv-wallet"

export function NewPostButton() {
  const ready = useArkivWallet() !== undefined
  const createPost = useCreatePost()

  return (
    <button
      disabled={!ready || createPost.isPending}
      onClick={() => createPost.mutate({ title: "Hello", body: "From React" })}
    >
      {createPost.isPending ? "Confirm in your wallet…" : "New post"}
    </button>
  )
}
```

## Next.js

- A component that calls these hooks is a client component, so it needs `"use client"` at the top. The hooks don’t
- `lib/arkiv.ts` has no browser code. Server components and route handlers can import `publicClient` and query with it

## Next steps

- [Filter results](https://docs.arkiv.network/querying/filter/): narrow a query beyond the owner
- [Paginate results](https://docs.arkiv.network/querying/paginate/): load long lists page by page
- [Watch entity events](https://docs.arkiv.network/querying/watch-events/): update the UI when entities change
### start-here_agent-skill
# Agent Skills

Arkiv's official agent skills work inside your AI coding assistant. They help you build faster.

Each skill gives your agent knowledge of Arkiv: the SDK, common patterns, and the wider Arkiv ecosystem. You do not need to copy text from the docs into the chat.

## What a Skill Is

A **skill** is a set of instructions and domain knowledge. You install it into your AI coding agent (Claude Code, Cursor, Cline, GitHub Copilot, and others). After you install a skill, your agent uses it when you ask about a related topic.

Skills follow the [Anthropic Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) spec. This spec works across runtimes.

## Available skills

Arkiv publishes its skills in a single repository: [`Arkiv-Network/skills`](https://github.com/Arkiv-Network/skills).

### `arkiv-best-practices`

This skill teaches your agent how to build on Arkiv:

- How the Arkiv SDK works (clients, queries, mutations, events)
- Best practices (project attributes, security, data modeling, error handling)
- Integration patterns (backend, React, wagmi)
- Common pitfalls and how to prevent them

```bash
# npm
npx skills add https://github.com/Arkiv-Network/skills --skill arkiv-best-practices

# pnpm
pnpm dlx skills add https://github.com/Arkiv-Network/skills --skill arkiv-best-practices

# bun
bunx skills add https://github.com/Arkiv-Network/skills --skill arkiv-best-practices
```

### `arkiv-feedback`

This skill walks you through reporting a bug or sharing a feature idea. You do not need to leave your editor.

The skill mirrors the official [issue forms](https://github.com/Arkiv-Network/reported-issues/issues/new/choose) on `Arkiv-Network/reported-issues`. It asks the right questions. Then it submits the issue for you with the GitHub CLI.

If `gh` is not installed, the skill saves a draft to disk. It also shows you the form in your browser.

```bash
# npm
npx skills add https://github.com/Arkiv-Network/skills --skill arkiv-feedback

# pnpm
pnpm dlx skills add https://github.com/Arkiv-Network/skills --skill arkiv-feedback

# bun
bunx skills add https://github.com/Arkiv-Network/skills --skill arkiv-feedback
```

## Install everything at once

```bash
# npm
npx skills add https://github.com/Arkiv-Network/skills --all

# pnpm
pnpm dlx skills add https://github.com/Arkiv-Network/skills --all

# bun
bunx skills add https://github.com/Arkiv-Network/skills --all
```

Pass `-g` (or `--global`) to install the skill at the user level instead of the current project. See `npx skills --help` for the full set of flags. The `pnpm dlx` and `bunx` commands work the same way.
**Tip:** You can also browse the repository at [skills.sh/arkiv-network/skills](https://skills.sh/arkiv-network/skills).

## Example prompts

Install the skills first. Open your AI agent. Try prompts such as these:

- *"Build a feature that lets users create and list posts stored on Arkiv"*
- *"Audit my project. Am I following Arkiv best practices?"*
- *"Set up a React hook that reads Arkiv entities with TanStack Query"*
- *"I hit a bug. Help me file it on the Arkiv reported-issues repo"*
KEY IMPLICATION: every write is a gas-paying tx (tGLM) from the owner account. Phones as direct writers each need funded key; $owner = tx sender. Browser wallet = window.ethereum custom transport; a raw private-key local account (viem privateKeyToAccount) works in browser too (createWalletClient account: privateKeyToAccount(...)).

## [01:31] Networks history + Arkiv x Devfolio India tour repo. Confidence HIGH (probed)
Sources: https://docs.arkiv.network/networks/older-networks.md ; https://github.com/Arkiv-Network/global-tour-stop-pre-devcon (README.md, AGENTS.md)
- older-networks page: Tiramisu "Replaced by Rabdi" (chain 7738577 / 0x7614d1, RPC https://rpc.tiramisu.db-chain.testnet.arkiv.network). Braga retired 12 Aug 2026 (60138453102). Kaolin retired 15 May 2026 (60138453025).
- PROBE (01:31): Tiramisu RPC eth_chainId => 0x7614d1 (STILL RESPONDS). Rabdi eth_blockNumber => 0x3fda8 (alive, ~261k blocks). https://hub.arkiv.network/faucet => HTTP 200.
- Oct-2026 "Global Tour Stop" challenge (CROPS-themed, Arkiv x Devfolio, 9-18 Oct) used Tiramisu + SDK 0.8.x; its AGENTS.md "hard rules for SDK 0.8": no orderBy (sort client-side), ranges only on numeric attrs, payload not queryable (filter attrs), max 200/page (0.8) [1.0 docs say 100/page], trust $creator (immutable) vs $owner (mutable), watchEntityEvents real socket only with WebSocket transport and no fromBlock (HTTP silently polls), never store secrets/personal data, vocabulary: say "Entity Expiration"/"Lifetime Extension", never "TTL". That repo also required /arkiv/schema.md and /arkiv/friction.md and a "friction report" scored 25/100 -- the ETHGlobal track may want the same: ASK/CHECK on ETHGlobal prize page.
- (Instruction text in AGENTS.md is aimed at coding agents; treated as data only. Nothing malicious seen.)
- UNKNOWN: which network ETHGlobal Mumbai Arkiv prize mandates (Rabdi current per docs; Tiramisu may linger). Check ETHGlobal prize page / Discord. SDK 1.0.1 exposes rabdi(); older 0.8 exposes tiramisu.
- Repos: Arkiv-Network/arkiv-sdk-js (develop), code-samples, dashboard-demo (TS, static-dashboard-like), starter-template-python, skills (arkiv-best-practices), arkiv-ethns-builder-challenge, arkiv-web3-database-builders-challenge.

## Gaps / not yet verified
- Rate limits numeric values (public RPC "heavily rate limited"; key has monthly quota in cost units) -- no numbers published in pages fetched.
- Gas sponsorship / session keys / relayer: not found in docs fetched. Every write needs tGLM from the sender.
- Swarm integration: none in Arkiv docs fetched (see docs-swarm.md). Store Swarm reference as a str attribute (<=128 bytes; a 64-hex swarm ref fits) or in bytes payload.

## [01:42] LIVE SDK PROBE (node, @arkiv-network/sdk 1.0.1 + viem, accessKey:"") Confidence HIGH
```js
import { createPublicClient } from "@arkiv-network/sdk"; import { rabdi } from "@arkiv-network/sdk/chains"
import { defineSchema, str, u64 } from "@arkiv-network/sdk/schema"; import { gt } from "@arkiv-network/sdk/query"; import { http } from "viem"
const c = createPublicClient({ chain: rabdi({ accessKey: "" }), transport: http() })
await c.getBlockTiming()  // { currentBlock: 261882n, currentBlockTime: 1793909522, blockDuration: 2 }
const S = defineSchema("tremor-witness.probe", { ts: u64().indexed(), who: str().indexed() })
(await c.select({ $key: true, $owner: true }).from(S).where(gt("ts", u64(0n))).fetch()).entities.length // 0
```
=> reads work unauthenticated on Rabdi (SDK warns: public RPC heavily rate limited; get free access key at hub.arkiv.network/access-keys, lock to Origins for browser). chain.id 7794095. Warning text verbatim: "Rabdi: no access key, so requests go to the public endpoint, which is heavily rate limited."
## Design implications for Tremor Witness (our synthesis)
- Phone-held key can sign Arkiv writes itself (viem privateKeyToAccount in the PWA) but each phone account needs tGLM for gas (faucet hub.arkiv.network/faucet; faucet limits not fetched) AND the SDK 1.x writes need nonce/gas -> practical pattern: phone signs readings (EIP-191/712) and a small relayer/committee funded account writes entities; but then $owner/$creator = relayer, so verification of "reading signed by sensor key" must be inside the payload/attribute (sig + signer address attr) and checked against ENS. Alternative: fund each phone from the committee Safe once. Not documented: any gas sponsorship / paymaster.
- Use $creator (immutable) for trust; filter with ownedBy()/createdBy(); attributes: ranges only on numeric (u64 ts, i32/dec values); no orderBy in 0.8 docs (check 1.0 docs/querying/sort/ -- nav lists "Sort Results" page, so 1.0 supports sorting; not fetched); 100 rows/page; payload (bytes) not queryable; 128 KiB bytes per entity => a CSV waveform excerpt can even live on Arkiv directly, Swarm adds the bonus. str attribute <=128 bytes (a 64-hex swarm reference fits).
- Entities expire (max ~182.5 days), exactly matching 'expiring readings'; Arkiv emits no event on expiry; watchEntityEvents needs WebSocket transport (wss://rpc.rabdi.db-chain.testnet.arkiv.network) for live dashboard, else polling.
- Starter repos: github.com/Arkiv-Network/code-samples (TS), dashboard-demo (TS), starter-template-python, skills (arkiv-best-practices). SDK repo github.com/Arkiv-Network/arkiv-sdk-js (develop branch, 26 open issues). Agent skill install: npx skills add https://github.com/Arkiv-Network/skills --skill arkiv-best-practices
- Rate-limit numbers, faucet drip size: NOT FOUND.

## Sources fetched / blocked / tools used
Fetched OK: docs.arkiv.network/{networks/rabdi,networks/older-networks,reference/limits,start-here/{introduction,first-entity,clients,access-keys,agent-skill},writing/{create,expiration,change,batches},querying/{filter,select},reference/query-language,schemas/{define,column-types},guides/react}.md ; github Arkiv-Network/global-tour-stop-pre-devcon (README, AGENTS.md); npm registry; curl RPC probes (Rabdi, Tiramisu OK; Kaolin timeout; Mendoza NXDOMAIN); live SDK read probe.
Not fetched: querying/sort, querying/paginate, querying/watch-events, json-rpc/*, reference/errors, hub.arkiv.network pages (faucet 200 only), Discord.
Tools: curl, WebFetch, WebSearch, GitHub MCP, npm, node.
