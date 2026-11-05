# Track study: arkiv
Agent: track-study. Date 2026-11-05 (IST).

## Page 1: https://ethglobal.com/events/mumbai/prizes
Fetch time: 01:28 IST | Method: Playwright navigate + evaluate document.body.innerText (page fully rendered, no clicks needed) | Verbatim section for this sponsor:

```text
Arkiv

$15,000

arkiv.network
arkivnetwork
Open page →
About

Arkiv is the Web3 database, an Ethereum-aligned DB-Chain. Your app's data lives in Arkiv entities: each one is owned by a wallet, can be queried with SQL-like filters, and expires when you choose.

Most prizes are for projects built from scratch. Build on Arkiv and the Arkiv + Swarm bonus also have a prize for existing projects that add Arkiv at the event. RPC: https://rpc.rabdi.db-chain.testnet.arkiv.network · Explorer: https://rabdi.explorer.arkiv.network · Indexer: https://indexer.rabdi.db-chain.testnet.arkiv.network · Faucet: https://hub.arkiv.network/faucet · Access keys: https://hub.arkiv.network/access-keys · Chain ID: 7794095

Prizes
🪞 Mirror something Ethereum depends on ⸺ $4,000
🥇
1st place
$3,000
🥈
2nd place
$1,000

Pick public data that Ethereum apps and developers rely on, and mirror it into Arkiv entities that anyone can query without asking you for access.

Example: Sourcify's API looks up its 7.9 million verified Ethereum mainnet contracts by address. We mirrored them to Arkiv at sourcify.arkiv.network, and now anyone can filter them by name, ABI, compiler version, deployer and more.

Ideas: token lists, chain and RPC registries, address labels, wallet ratings, function signatures.

How we judge:

Arkiv feedback (25%): /arkiv/friction.md
What should we improve today to make Arkiv better: something that got in your way, or something we don't have yet that would make building easier?
When something broke, what did you expect, what happened, and how can we reproduce it?
Reach (25%): /arkiv/reach.md
How many people or projects already use or depend on this data?
Who would use your copy on Arkiv after Mumbai, and for what?
Why Arkiv (25%): /arkiv/why-arkiv.md
If this data sat in Postgres or any other database instead of Arkiv, what could people no longer do?
What can people do with your copy on Arkiv that they can't do with the original source today?
Data quality (25%): /arkiv/data-quality.md
Is the data up to date, and how does your import keep it that way?
Can people filter it the way they actually search for it?
Qualification Requirements
Built from scratch at ETHGlobal Mumbai, following ETHGlobal's rules.
The data's license allows republishing. Link it in your README.
Not Sourcify data, from any chain.
Your import script is in the repo, and we can re-run it.
Your project writes to Arkiv's current testnet (see the docs) with @arkiv-network/sdk or the JSON-RPC API, and a feature or query people use reads the data from Arkiv.
In your README: the wallet address(es) that wrote your entities, and one query we can run.
/arkiv/schema.md: your entities, the fields you query, who owns them and when they expire. /arkiv/friction.md: your feedback.
One file per criterion in How we judge, at the path next to it, answering its questions with links, numbers or a query we can run.
A public repo with an open-source license. Say how you used AI, as ETHGlobal's rules require.
Each team can win one Arkiv track prize; the Arkiv + Swarm bonus can come on top of it.
Links and Resources
Sourcify on Arkiv (example)
https://sourcify.arkiv.network
↗
Docs
https://docs.arkiv.network
↗
🧩 Build on Arkiv (from scratch) ⸺ $4,000
🥇
1st place
$3,000
🥈
2nd place
$1,000

Build a new app whose data lives in Arkiv. You query its entities with SQL-like filters, and each one has an owner wallet and an expiration you choose.

Some directions:

Agents: ephemeral coordination state: tasks, bids and claims that agents share, query and let expire.
Markets: listings or offers that expire at their deadline.
Publishing and media: posts, profiles and follows that any app can read.
Names and identity: profiles or service directories keyed by ENS names.

How we judge:

Arkiv feedback (25%): /arkiv/friction.md
What should we improve today to make Arkiv better: something that got in your way, or something we don't have yet that would make building easier?
When something broke, what did you expect, what happened, and how can we reproduce it?
Reach (25%): /arkiv/reach.md
Who is it for, and would they use it?
Can they try it today, and will you keep building it after Mumbai?
Why Arkiv (25%): /arkiv/why-arkiv.md
If you swapped Arkiv for Postgres or any other database, what would your users lose?
What did you keep off Arkiv, and why?
How you use Arkiv (25%): /arkiv/how-you-use-arkiv.md
Do the things you filter on, who can edit each entity, and when it expires fit what your app does?
Does each Arkiv feature you use change something your users see?
Qualification Requirements
Built from scratch at ETHGlobal Mumbai, following ETHGlobal's rules.
Your app writes to Arkiv's current testnet (see the docs) with @arkiv-network/sdk or the JSON-RPC API, and at least one feature users see reads its data from Arkiv.
In your README: the wallet address(es) that wrote your entities, and one query we can run.
/arkiv/schema.md: your entities, the fields you query, who owns them and when they expire. /arkiv/friction.md: your feedback.
One file per criterion in How we judge, at the path next to it, answering its questions with links, numbers or a query we can run.
A public repo with an open-source license. Say how you used AI, as ETHGlobal's rules require.
Not counted: the SDK installed but never used to read, or Arkiv used only as a log that nothing reads.
Each team can win one Arkiv track prize; the Arkiv + Swarm bonus can come on top of it.
Links and Resources
Docs
https://docs.arkiv.network
↗
AI tools (MCP + plugin)
https://hub.arkiv.network/ai-tools
↗
🧩 Build on Arkiv (existing projects) ⸺ $4,000
🆕  This prize is only available to Continuity Track participants →
🥇
1st place
$3,000
🥈
2nd place
$1,000

Already building a product? Bring it to ETHGlobal Mumbai and move part of its data into Arkiv. You query Arkiv entities with SQL-like filters, and each one has an owner wallet and an expiration you choose.

Some directions:

Data your users own: profiles, posts or settings that stay with each user's wallet and that other apps can read.
Shared state: listings, orders or tasks that several parties query, and that expire when they are done.
Agents: ephemeral coordination state that your agents share, query and let expire.

How we judge:

Arkiv feedback (25%): /arkiv/friction.md
What should we improve today to make Arkiv better: something that got in your way, or something we don't have yet that would make adding Arkiv easier?
When something broke, what did you expect, what happened, and how can we reproduce it?
Reach (25%): /arkiv/reach.md
Who uses your product today, and will they use the part on Arkiv?
Will it ship to them after Mumbai?
Why Arkiv (25%): /arkiv/why-arkiv.md
If this data stayed in your current database, what would your users lose?
What did you keep off Arkiv, and why?
How you use Arkiv (25%): /arkiv/how-you-use-arkiv.md
Do the things you filter on, who can edit each entity, and when it expires fit what your product does?
Does each Arkiv feature you use change something your users see?
Qualification Requirements
An existing project in ETHGlobal's Continuity batch, following ETHGlobal's rules.
The Arkiv part is new work done at ETHGlobal Mumbai. In your README, say what existed before the event and what you added; we judge only what you added.
Your app writes to Arkiv's current testnet (see the docs) with @arkiv-network/sdk or the JSON-RPC API, and at least one feature users see reads its data from Arkiv.
In your README: the wallet address(es) that wrote your entities, and one query we can run.
/arkiv/schema.md: your entities, the fields you query, who owns them and when they expire. /arkiv/friction.md: your feedback.
One file per criterion in How we judge, at the path next to it, answering its questions with links, numbers or a query we can run.
A public repo with an open-source license. Say how you used AI, as ETHGlobal's rules require.
Not counted: the SDK installed but never used to read, or Arkiv used only as a log that nothing reads.
Each team can win one Arkiv track prize; the Arkiv + Swarm bonus can come on top of it.
Links and Resources
Docs
https://docs.arkiv.network
↗
AI tools (MCP + plugin)
https://hub.arkiv.network/ai-tools
↗
🛠️ Node tooling ⸺ $2,000

Build a tool for the people who run Arkiv nodes. Two directions:

Operator dashboard: a collector that runs next to a node and shows how many days are left before the disk is full (with an alert), requests and latency per method, peers, sync, CPU and memory.
Slow query finder: load data into your own node and measure which query shapes are slow. Run it only on your own node, never on a public endpoint.

For reference: nodes.arkiv.network shows Arkiv's community nodes from the outside. You don't have to rebuild it: use it as a guide, and show what only a tool next to the node can see.

How we judge:

Arkiv feedback (25%): /arkiv/friction.md
What should we improve today to make running or querying an Arkiv node better: something that got in your way, or something we don't have yet?
When something broke, what did you expect, what happened, and how can we reproduce it?
Real use (25%): /arkiv/real-use.md
Would people who run Arkiv nodes, or Arkiv's engineers, actually use this?
What does it tell them that they need to know?
What's new (25%): /arkiv/whats-new.md
What does it show or find that the node's built-in tools don't?
Is it more than putting an existing dashboard together?
Easy to run (25%): /arkiv/easy-to-run.md
Can someone else install and run it from your README in a few minutes?
Does the README say what it needs and what to do when it fails?
Qualification Requirements
Built from scratch at ETHGlobal Mumbai: a new repo that runs next to the node. A pull request to an existing repo is not from scratch.
It works against an Arkiv node in your demo. A node on your own machine is enough.
In your README: which node you used, and how to reproduce the demo. If your tool writes Arkiv entities, also the wallet address(es) that wrote them and a /arkiv/schema.md.
/arkiv/friction.md: your feedback on running and querying the node.
One file per criterion in How we judge, at the path next to it, answering its questions with links, numbers or a query we can run.
Slow query shapes you find go to us privately (we will share how at the Arkiv booth), never into your public repo, /arkiv/friction.md or demo.
A public repo with an open-source license. Say how you used AI, as ETHGlobal's rules require.
Each team can win one Arkiv track prize; the Arkiv + Swarm bonus can come on top of it.
Links and Resources
Arkiv community nodes (reference)
https://nodes.arkiv.network
↗
Arkiv node client
https://github.com/Arkiv-Network/arkiv
↗
Docs
https://docs.arkiv.network
↗
🐝 Arkiv + Swarm bonus (from scratch) ⸺ $500

Use Swarm (ethswarm.org) in your project in a meaningful way, and you are also in the running for $500. For example, keep the files your users see on Swarm and point to them from your Arkiv entities, or upload them encrypted so only the people who get the reference can open them. The most useful integration wins. It comes on top of any track prize: you can win a track and this bonus.

To enter: when you submit a from-scratch project to Mirror, Build on Arkiv or Node tooling, also select this bonus. Arkiv's prizes count as one partner prize on ETHGlobal, so it does not use another of your three picks. Existing projects have their own Arkiv + Swarm bonus.

Qualification Requirements
Your project uses both Arkiv and Swarm. A project that uses only Swarm does not qualify.
/arkiv/swarm.md in your repo, with:
What you keep on Swarm, what you keep on Arkiv, and which entity field holds the Swarm reference or feed.
One Arkiv entity key and the Swarm reference it points to, with a link we can open.
The postage stamp batch ID you uploaded with and the wallet that bought it (or who gave you the batch), and the Bee node or service you uploaded through.
The files in your repo that upload to Swarm and read from it.
Steps to run one upload and one read yourself, what they need, and what we should see.
The moment in your demo video where Swarm is used.
What got in your way with Swarm.
Careful: an encrypted Swarm reference contains its key, and Arkiv entities are public. Never store one in an entity as it is: encrypt it first or keep it off Arkiv.
Links and Resources
Swarm
https://www.ethswarm.org
↗
Swarm docs
https://docs.ethswarm.org
↗
🐝 Arkiv + Swarm bonus (existing projects) ⸺ $500
🆕  This prize is only available to Continuity Track participants →

Use Swarm (ethswarm.org) in what you add to your product at ETHGlobal Mumbai, and you are also in the running for $500. For example, keep the files your users see on Swarm and point to them from your Arkiv entities, or upload them encrypted so only the people who get the reference can open them. The most useful integration wins. It comes on top of the Build on Arkiv prize for existing projects: you can win both.

To enter: when you submit your project to Build on Arkiv (existing projects), also select this bonus. Arkiv's prizes count as one partner prize on ETHGlobal, so it does not use another of your three picks.

Qualification Requirements
An existing project in ETHGlobal's Continuity batch that uses both Arkiv and Swarm. A project that uses only Swarm does not qualify.
How Swarm works with your Arkiv entities is new work done at ETHGlobal Mumbai. In /arkiv/swarm.md, say what existed before the event; we judge only what you added.
/arkiv/swarm.md in your repo, with:
What you keep on Swarm, what you keep on Arkiv, and which entity field holds the Swarm reference or feed.
One Arkiv entity key and the Swarm reference it points to, with a link we can open.
The postage stamp batch ID you uploaded with and the wallet that bought it (or who gave you the batch), and the Bee node or service you uploaded through.
The files in your repo that upload to Swarm and read from it.
Steps to run one upload and one read yourself, what they need, and what we should see.
The moment in your demo video where Swarm is used.
What got in your way with Swarm.
Careful: an encrypted Swarm reference contains its key, and Arkiv entities are public. Never store one in an entity as it is: encrypt it first or keep it off Arkiv.
Links and Resources
Swarm
https://www.ethswarm.org
↗
Swarm docs
https://docs.ethswarm.org
↗
Resources
Docs
https://docs.arkiv.network
↗
Arkiv Hub
https://hub.arkiv.network
↗
AI tools (MCP + plugin)
https://hub.arkiv.network/ai-tools
↗
Discord
https://discord.gg/arkiv
↗
```


## Page 2..n: docs.arkiv.network (via /llms.txt index; each page fetched in-browser with fetch() inside Playwright and text extracted)
Fetch time: 01:29 IST | Method: Playwright evaluate fetch+DOMParser. Full text of all 25 pages saved at .playwright-mcp/arkiv_docs_dec.txt (scratch). Verbatim excerpts of the pages that matter:

```text
=== llms.txt ===
# Arkiv

> The Web3 database. A universal data layer for Ethereum — queryable, time-scoped, tamper-proof, wallet-owned. The TypeScript SDK is `@arkiv-network/sdk`, built on viem.

## Get started

- [What Arkiv is](https://docs.arkiv.network/start-here/introduction/): entities, attributes, ownership, expiration
- [Your first entity](https://docs.arkiv.network/start-here/first-entity/): install, define a schema, write, query
- [Connect to Arkiv](https://docs.arkiv.network/start-here/clients/): public and wallet clients, browser wallets, access keys

## Schemas

- [Define a schema](https://docs.arkiv.network/schemas/define/): `defineSchema`, `.indexed()`, `.optional()`, `.default()`, named schemas
- [Column types](https://docs.arkiv.network/schemas/column-types/): `bool`, `i32`, `u64`, `u256`, `dec`, `str`, `addr`, `key`, `bytes`

## Write data

- [Create entities](https://docs.arkiv.network/writing/create/): `createEntity(schema, values, { expiration, flags, salt })`
- [Expiration](https://docs.arkiv.network/writing/expiration/): `ExpirationTime`, `extendEntity`
- [Change and delete](https://docs.arkiv.network/writing/change/): `patchEntity`, `changeOwnership`, `deleteEntity`
- [Batches](https://docs.arkiv.network/writing/batches/): `executeBatch`, `predictEntityKeys`

## Query data

- [Select fields](https://docs.arkiv.network/querying/select/): `select({ $key: true, title: true }).from(schema)`, flat typed rows
- [Filter results](https://docs.arkiv.network/querying/filter/): `where`, `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `between`, `startsWith`, `exists`, `hasType`, `and`, `or`, `not`
- [Paginate results](https://docs.arkiv.network/querying/paginate/): `limit` (max 100), `fetch`, `next`, `for await`, `cursor`, `atBlock`
- [Sort results](https://docs.arkiv.network/querying/sort/): `orderBy(asc(name))`, `orderBy(desc(name))`, one key, entity fields, entities without the attribute
- [Count entities](https://docs.arkiv.network/querying/count/): `client.count()`, `withCount`
- [Read one entity](https://docs.arkiv.network/querying/get-entity/): `getEntity(key, schema?)`
- [Query without a schema](https://docs.arkiv.network/querying/without-schema/): `$attributes`, `$attributeSchema`, `query()` with `orderBy`, raw query strings
- [Watch entity events](https://docs.arkiv.network/querying/watch-events/): `watchEntityEvents`

## Guides

- [Use with React](https://docs.arkiv.network/guides/react/): wagmi, RainbowKit, TanStack Query, Next.js; build the Arkiv wallet client from wagmi’s connection

## Reference

- [Query language](https://docs.arkiv.network/reference/query-language/)
- [Errors](https://docs.arkiv.network/reference/errors/)
- [Limits](https://docs.arkiv.network/reference/limits/)
- [API reference](https://docs.arkiv.network/typescript-sdk/api-reference/)

## JSON-RPC API

- [Read methods](https://docs.arkiv.network/json-rpc/querying-data/): `arkiv_query` (with the `count` projection), `arkiv_getEntity`, `arkiv_getBlockTiming`
- [Write transactions](https://docs.arkiv.network/json-rpc/mutating-entities/): `execute` calldata, attribute encoding, entity keys, events, revert errors

## Conventions that trip up generated code

- Arkiv is a public database: anyone can write entities of any shape. Name schemas after your project (`defineSchema("my-app.posts", ...)`), and filter by owner or creator (`.ownedBy(address)`, `.createdBy(address)`) when you need to trust what you read
- Entity fields start with `$` in selections, rows and filters: `$key`, `$owner`, `$creator`, `$createdAt`, `$updatedAt`, `$expiresAt`, `$creationFlags`. Names without `$` are attributes
- Every write goes through a schema. There is no payload or content type: store data in `str` (up to 128 bytes) or `bytes` columns
- A column value is a typed object: read it through `.value`. `dec`, `addr`, `key` and `u64` values must be wrapped, as in `dec("4.5")`
- Only indexed columns can be filtered on. `bytes` is never indexed
- `expiration` is required on every create. Build it with helpers such as `ExpirationTime.fromDays(30)`
- There is no `updateEntity`: `patchEntity` changes only the columns it names
- Sort with `.orderBy(desc("score"))` from `@arkiv-network/sdk/query`. It takes one key, an `asc` or a `desc`. Through a schema, any column but a `bytes` one can be sorted on, indexed or not, and so can `$key`, `$owner`, `$creator` and `$expiresAt`. Without a schema, write the type: `desc("score", "dec")`. `query()` takes the same key: `query(condition, { orderBy: desc("score", "dec") })`
- An entity without the sorted attribute, or with it stored as another type, sorts first with `asc` and last with `desc`
- There is no `getEntityCount`. Count with `client.count().from(schema).where(...).fetch()`, or add `.withCount()` to a select to get the total on every page
```

```text
=== https://docs.arkiv.network/start-here/introduction/ (200) ===
      What Arkiv is
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            Arkiv is a Web3 database. It stores your data as entities that you can query by indexed attributes, that your wallet owns, and that expire when you say so. You talk to it with the same tools you use for Ethereum: a wallet, a transaction, and a JSON-RPC endpoint.
Four principlesSection titled “Four principles”
   Queryable  Filter and paginate records through indexed attributes with a Web2-like query language. No external indexer.    Time-scoped  Every entity has an expiration block. When it arrives, the entity leaves the query surface. You pay for the lifetime you choose.    Tamper-proof  Every write is a signed Ethereum transaction. State is committed with a keccak Merkle-Patricia trie, so any change is evident.    Wallet-owned  Only the owner wallet can update, extend, transfer, or delete an entity. 
EntitiesSection titled “Entities”
An entity is one record. It holds your data as attributes, and Arkiv keeps a few fields of its own on every entity. Those fields start with $, which no attribute name can:
FieldWhat it holds$keyThe entity’s 32-byte key, assigned when it’s created$ownerThe account that can change the entity$creatorThe account that created it. It never changes$createdAtThe block the entity was created in$updatedAtThe block it last changed in$expiresAtThe block it expires at$creationFlagsProperties fixed when the entity was created
AttributesSection titled “Attributes”
An attribute is a named, typed value, such as a str called title or a dec called score. An entity holds up to 32 of them. Each attribute is either indexed, so queries can filter on it, or stored only, which costs less. See column types for the types.
In the SDK you describe an entity’s attributes once, in a schema, the way you describe a table’s columns in SQL.
OwnershipSection titled “Ownership”
The account that creates an entity owns it. Only the owner can change, hand over or delete it. You can also hand an entity to another account.
ExpirationSection titled “Expiration”
Every entity has an expiration block. From that block on, the entity is gone: queries don’t return it and every operation on it fails. You choose a lifetime when you create the entity, and you can extend it later.
Arkiv counts time in blocks. A block takes 2 seconds on Rabdi, the public testnet.
Arkiv is publicSection titled “Arkiv is public”
Anyone can write entities to Arkiv, with any attribute names and values, and anyone can read them. A query that filters only on common attribute names, such as category = "news", can return entities from other projects. Keep your data apart in two ways:
Tag your entities: give your schema a name unique to your project, and every query through it only sees entities with that tag
Filter by owner: anyone can copy your tag. To trust what you read, keep only entities your account owns or created. See filter on entity fields
How you reach ArkivSection titled “How you reach Arkiv”
Arkiv speaks Ethereum’s JSON-RPC. Writes are transactions, and reads are arkiv_query calls. You pay for writes in GLM, Arkiv’s gas token. On the testnet, it’s test GLM, tGLM. The TypeScript SDK, @arkiv-network/sdk, wraps both and builds on viem.
Next, store your first entity.            Next  Your First Entity      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/start-here/first-entity/ (200) ===
      Store and query your first entity
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            
This guide targets the Rabdi testnet. Check  Networks for current testnets and faucets.
In this tutorial you write a blog post to Arkiv and read it back with a query. It takes one TypeScript file and a test account with some test GLM.
Before you start, you need:
Node.js 22.10 or later, or Bun
The private key of a test account. Fund it with test GLM (tGLM) from the faucet
An access key. Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free key from the Arkiv Hub
Set up the projectSection titled “Set up the project”
Create a folder with a package.json that marks it as an ES module:
Terminal windowmkdir arkiv-hello && cd arkiv-helloecho '{ "type": "module" }' > package.json
Install the SDK and viem, which the SDK builds on:
      bun     pnpm     yarn     npm      Terminal windowbun add @arkiv-network/sdk viem  Terminal windowpnpm add @arkiv-network/sdk viem  Terminal windowyarn add @arkiv-network/sdk viem  Terminal windownpm install @arkiv-network/sdk viem     
Put your private key and access key in environment variables:
Terminal windowexport PRIVATE_KEY=your_private_key_hereexport ARKIV_ACCESS_KEY=your_access_key_here
Describe a postSection titled “Describe a post”
Create hello.ts. Start with a schema, which lists the attributes a post has and their types. The indexed() ones are the ones you can filter on:
hello.tsimport { addr, bytes, dec, defineSchema, str } from "@arkiv-network/sdk/schema"
const Posts = defineSchema("my-app.posts", {  author: addr().indexed(),  category: str().indexed(),  score: dec().indexed(),  title: str(),  body: bytes(),  summary: str().optional(),})
The name tags every post you write, and a query through Posts only sees entities with that tag. Arkiv is a public database that other projects write to as well, so replace my-app with a name unique to your project. The rest of the docs use this schema.
Connect to RabdiSection titled “Connect to Rabdi”
Add two clients. The public client reads, and the wallet client signs and sends writes with your account:
hello.tsimport { createPublicClient, createWalletClient } from "@arkiv-network/sdk"import { rabdi } from "@arkiv-network/sdk/chains"import { http, type Hex } from "viem"import { privateKeyToAccount } from "viem/accounts"
const chain = rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" })const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)const publicClient = createPublicClient({ chain, transport: http() })const walletClient = createWalletClient({ chain, transport: http(), account })
rabdi puts your access key in the RPC URL, so http() with no URL sends it. Without ARKIV_ACCESS_KEY, the chain uses the public RPC and logs a warning.
Use of the public RPC is subject to the Arkiv  Terms of Use and  Privacy Policy.
Write the postSection titled “Write the post”
createEntity takes the schema, the post’s values and how long the post should live. It returns the new entity’s key:
hello.tsimport { ExpirationTime } from "@arkiv-network/sdk"import { stringToBytes } from "viem"
const { entityKey } = await walletClient.createEntity(  Posts,  {    author: addr(account.address),    category: "intro",    score: dec("4.5"),    title: "Hello, Arkiv",    body: stringToBytes("My first entity."),  },  { expiration: ExpirationTime.fromDays(1) },)console.log("Created", entityKey)
Each value has to match its column. "intro" and "Hello, Arkiv" are strings, so they’re str values as they are. A dec or an addr has no plain JavaScript form, so you wrap those in dec(...) and addr(...). summary is optional, so you can leave it out.
Query it backSection titled “Query it back”
Select the fields you want, name the schema and keep only the posts your account owns:
hello.tsimport { hexToString } from "viem"
const { entities } = await publicClient  .select({ $key: true, title: true, body: true })  .from(Posts)  .ownedBy(account.address)  .fetch()
for (const post of entities) {  console.log(post.$key, post.title.value, hexToString(post.body.value))}
Anyone can write an entity with your schema’s tag, so ownedBy keeps out posts your account doesn’t own. Each row holds the fields you selected. $key is the entity’s key, and every name without a $ is a column. A column comes back as a typed value, so you read it through .value.
Run itSection titled “Run it”
      bun     node      Terminal windowbun hello.ts  Terminal windownode --experimental-strip-types hello.ts     
The script prints the key of the new post, then the post itself:
Created 0x5f1e…0x5f1e… Hello, Arkiv My first entity.
If the create fails because of insufficient funds, the account has no tGLM yet. Get some from the faucet and run the script again.
Next stepsSection titled “Next steps”
Define your own schema
Write data: lifetimes, patches and batches
Query data: selections, filters and pagination
           Previous  What Arkiv Is      Next  Connect to Arkiv      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/start-here/clients/ (200) ===
      Connect to Arkiv
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            
This guide targets the Rabdi testnet. Check  Networks for current testnets and faucets.
You reach Arkiv through two clients. A public client reads: it queries entities and watches events, and needs no account. A wallet client writes: it signs and sends transactions with an account. Both are viem clients with Arkiv’s actions added, so they take a chain and a transport like any viem client.
Make the chainSection titled “Make the chain”
rabdi makes the chain from your access key. Arkiv’s public RPC is heavily rate limited to prevent abuse, so get a free key from the Arkiv Hub:
import { rabdi } from "@arkiv-network/sdk/chains"
const chain = rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" })
With accessKey: "", the chain uses the public RPC and logs a warning. In a browser app, read the key from your bundler’s public environment variables and lock it to your site. The examples below use this chain.
Read with a public clientSection titled “Read with a public client”
import { createPublicClient } from "@arkiv-network/sdk"import { http } from "viem"
const publicClient = createPublicClient({ chain, transport: http() })
A public client holds no account, so it’s safe in the browser. http() with no URL uses the chain’s RPC URL, which carries your access key.
Use of the public RPC is subject to the Arkiv  Terms of Use and  Privacy Policy.
Write from a serverSection titled “Write from a server”
On a server, sign with a private key. Keep the key in an environment variable or a secret store, never in code:
import { createWalletClient } from "@arkiv-network/sdk"import { http, type Hex } from "viem"import { privateKeyToAccount } from "viem/accounts"
const walletClient = createWalletClient({  chain,  transport: http(),  account: privateKeyToAccount(process.env.PRIVATE_KEY as Hex),})
Write from a browser walletSection titled “Write from a browser wallet”
In the browser, let the user’s wallet sign. Pass the wallet’s provider as a custom transport and the user’s address as the account:
import { createWalletClient } from "@arkiv-network/sdk"import { custom } from "viem"
const [address] = await window.ethereum.request({  method: "eth_requestAccounts",})const walletClient = createWalletClient({  chain,  transport: custom(window.ethereum),  account: address,})
This connects to the wallet directly. In an app that uses wagmi, such as one built with RainbowKit, build the client from wagmi’s connection instead.
The wallet asks the user to approve every write, and it has to be on Rabdi when it does. addChain adds Rabdi to the wallet and asks the user to switch to it. Add the chain without your access key:
import { rabdi } from "@arkiv-network/sdk/chains"
await walletClient.addChain({ chain: rabdi({ accessKey: "" }) })
Use of the public RPC is subject to the Arkiv  Terms of Use and  Privacy Policy.
Read and write with one setupSection titled “Read and write with one setup”
A wallet client has only the write actions. Keep a public client next to it for reads. Both can share the transport settings:
const transport = http()const publicClient = createPublicClient({ chain, transport })const walletClient = createWalletClient({ chain, transport, account })           Previous  Your First Entity      Next  Define a Schema      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/schemas/define/ (200) ===
      Define a schema
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            A schema lists the attributes an entity has, their types, and which of them are indexed. The SDK types your writes and reads from it and checks them when they run. Arkiv itself never sees the schema: it stores each attribute with its type and an indexed flag, and the schema decides both.
Declare the columnsSection titled “Declare the columns”
Call defineSchema with a name and an object of columns. Each column is a type constructor called with no arguments:
import { addr, bytes, dec, defineSchema, str } from "@arkiv-network/sdk/schema"
const Posts = defineSchema("my-app.posts", {  author: addr().indexed(),  category: str().indexed(),  score: dec().indexed(),  title: str(),  body: bytes(),  summary: str().optional(),})
The key of each entry is the attribute’s name. See column types for every type and what it holds.
Index the columns you filter onSection titled “Index the columns you filter on”
.indexed() makes a column filterable. A column without it is stored, selectable and sortable, but a filter on it is a compile error:
import { eq } from "@arkiv-network/sdk/query"
publicClient.select().from(Posts).where(eq("category", "news")) // workspublicClient.select().from(Posts).where(eq("title", "Hello"))   // compile error
An index costs extra on every write, so index only what you filter on. bytes columns can’t be indexed.
Make a column optional or give it a defaultSection titled “Make a column optional or give it a default”
By default, every column is required: a create must give it a value. Two modifiers change that:
.optional(): a create may leave the column out, a patch may unset it, and a read gives undefined where it’s missing
.default(value): a create that leaves the column out writes this value instead
import { bool, defineSchema, i32, key, str } from "@arkiv-network/sdk/schema"
const Comments = defineSchema("comments", {  post: key().indexed(),  text: str(),  likes: i32().indexed().default(0),  hidden: bool().optional(),})
Modifiers chain in any order, and each returns a new column.
Name the schema after your projectSection titled “Name the schema after your project”
A named schema tags every entity it creates with an indexed arkiv.schema attribute that holds the name. A query through the schema filters on that tag, so it only sees entities written through it:
const { entities } = await publicClient.select().from(Posts).fetch()
This returns posts only, even with no other filter. The tag isn’t part of the rows you read back.
Arkiv is a public database, and other projects may define a schema called posts too. Put your project in the name, as in my-app.posts, so your queries don’t pick up their entities. A name can be any text up to 128 bytes.
The tag keeps other projects’ data out by accident, not on purpose: anyone can write an entity with your tag. When you need to trust what you read, also filter by owner or creator.
Leave the name out when you don’t want a tag:
const Tags = defineSchema({ label: str().indexed() })
An unnamed schema still types and checks what you read and write. A query through it matches whatever its filters match, whichever project wrote the entities, so give its queries a filter only your data matches.
Naming rulesSection titled “Naming rules”
An attribute name:
Starts with a letter, followed by letters, digits, ., - or _
Is at most 32 bytes long
Is case-sensitive: Title and title are different attributes
Can’t contain --, or be a word the query language reserves, such as and, not, between, order, desc or a type name like str
A name can’t start with $, so a column never collides with an entity field. A column called owner is fine, and you read it next to the entity’s $owner. arkiv.schema is the only name a schema can’t use.
A schema has at most 32 columns, or 31 if it’s named, since the tag counts as one more attribute.           Previous  Connect to Arkiv      Next  Column Types      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/schemas/column-types/ (200) ===
      Column types
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            Arkiv stores 9 attribute types. Each type constructor does two jobs. Called with no arguments it’s a column, as in dec(). Called with a value it’s a typed value, as in dec("4.5"). SQL works the same way, with DECIMAL as a type and DECIMAL '4.5' as a value.
TypesSection titled “Types”
TypeHolds.value in JavaScriptbooltrue or falsebooleani32A signed 32-bit integernumberu64An unsigned 64-bit integerbigintu256An unsigned 256-bit integerbigintdecA signed decimal with 18 decimal placesstring, like "4.5"strText, up to 128 bytes of UTF-8stringaddrAn Ethereum addresschecksummed hexkeyThe key of another entityhexbytesUp to 128 KiB of binary datahex
Every indexed column takes eq, ne, gt, gte, lt, lte, between, exists and hasType. Only str takes startsWith. bytes can’t be indexed, so it can’t be filtered on. See filter results.
Write a valueSection titled “Write a value”
Five types have a plain JavaScript form you can write as is. Through a schema, a plain value only fits a column of its own type:
JavaScript valueTypebooleanboolnumberi32bigintu256stringstrUint8Arraybytes
Wrap every other value in its constructor:
import { addr, dec, key, u64 } from "@arkiv-network/sdk/schema"
dec("4.5")u64(1_700_000_000n)addr("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")key(entityKey)
A bare 5 is an i32, so it doesn’t fit a dec column: write dec(5). A bare 5n is a u256, not a u64: write u64(5n).
A constructor checks its value and throws InvalidValueError when the value doesn’t fit, for example i32(2 ** 40).
Type detailsSection titled “Type details”
dec: pass fractions as strings, since a JavaScript number can’t hold most decimals exactly. dec(0.1) throws, dec("0.1") works. More than 18 decimal places throws instead of rounding. decUnits(value) gives the exact scaled bigint for arithmetic, and decFromUnits(units) turns it back
str: the 128-byte limit counts bytes, not characters. Any character is allowed. To filter on a hash or other binary value, store it as lowercase hex, which fits up to 64 bytes
addr: mixed-case input must have a valid EIP-55 checksum, so a mistyped address throws. All-lowercase input is accepted. Addresses come back checksummed
key: a reference to another entity. Arkiv doesn’t check that the entity exists, and a reference to a deleted or expired entity stays as it is
bytes: each value holds up to 128 KiB, and all the bytes values of one create or patch share a single 128 KiB budget. Going over throws EntityTooLargeError. Pass a Uint8Array or hex, and read hex back
           Previous  Define a Schema      Next  Create Entities      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/writing/create/ (200) ===
      Create entities
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            createEntity writes one entity through a schema. It takes the schema, the entity’s values and its options, and resolves once the transaction is in a block. The examples on this page use the Posts schema and clients from your first entity.
Write an entitySection titled “Write an entity”
import { ExpirationTime } from "@arkiv-network/sdk"import { addr, dec } from "@arkiv-network/sdk/schema"import { stringToBytes } from "viem"
const { entityKey, txHash, expiresAt } = await walletClient.createEntity(  Posts,  {    author: addr(account.address),    category: "news",    score: dec("3.9"),    title: "Arkiv ships schemas",    body: stringToBytes("Columns, types and indexes."),  },  { expiration: ExpirationTime.fromDays(30) },)
The result holds the new entity’s key, the transaction hash, and the block the entity expires at.
The values are checked against the schema, both when you compile and when the code runs:
Every required column needs a value
An optional column can be left out
A column with a default that you leave out is written with its default
Each value must have its column’s type. A bare 5 for a dec column is a compile error: write dec(5)
A value that doesn’t fit throws SchemaMismatchError before anything is sent.
Set the lifetimeSection titled “Set the lifetime”
expiration is required. Build it with ExpirationTime:
{ expiration: ExpirationTime.fromHours(12) }{ expiration: ExpirationTime.atDate(new Date("2027-01-01")) }
See expiration for every option.
Fix properties at creationSection titled “Fix properties at creation”
flags sets properties that can never change afterwards. Both are off by default:
readonly: the entity’s attributes can never be changed. You can still extend it, hand it over or delete it
permissionlessExtension: anyone can extend the entity, not only its owner. Use this to let others keep an entity alive without letting them change it
await walletClient.createEntity(Posts, values, {  expiration: ExpirationTime.fromDays(30),  flags: { readonly: true },})
Read them back from the entity’s $creationFlags.
Choose how the key is madeSection titled “Choose how the key is made”
Arkiv derives an entity’s key from the owner, a per-owner counter and a salt. By default the salt is 128 random bits, so nobody can guess a key before the entity exists. Pass salt: NO_SALT for a key that anyone can work out from the owner’s address and counter:
import { NO_SALT } from "@arkiv-network/sdk"
await walletClient.createEntity(Posts, values, {  expiration: ExpirationTime.fromDays(30),  salt: NO_SALT,})
To learn a key before you send the create, see predict keys.
Set transaction fieldsSection titled “Set transaction fields”
Every write takes an optional last argument with transaction fields: gas, nonce, and either gasPrice or maxFeePerGas and maxPriorityFeePerGas. Anything you leave out is estimated:
await walletClient.createEntity(Posts, values, options, {  maxFeePerGas: 2_000_000_000n,})
Handle failuresSection titled “Handle failures”
createEntity throws before it sends anything when the input is wrong:
SchemaMismatchError: a value is missing or has the wrong type
InvalidValueError: a value doesn’t fit its type, such as an i32 out of range
EntityTooLargeError: the bytes values add up to more than 128 KiB
InvalidExpiryError: the expiration is already in the past, or too far away to store
It throws EntityMutationError when the transaction fails or reverts. See errors for the full list.           Previous  Column Types      Next  Expiration      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/writing/expiration/ (200) ===
      Expiration
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            Every entity expires at a block you choose. From that block on, queries don’t return it and every operation on it fails. You set a lifetime of up to about 182 days when you create the entity, and can extend it any time before it expires. A shorter lifetime costs less, so start short and extend what you still need.
Build an expirationSection titled “Build an expiration”
ExpirationTime builds the expiration that createEntity, extendEntity and batches take. Use a duration, a deadline, or a deadline with a minimum:
import { ExpirationTime } from "@arkiv-network/sdk"
ExpirationTime.fromHours(12)ExpirationTime.fromDays(30)ExpirationTime.max()ExpirationTime.atDate(new Date("2027-01-01"))ExpirationTime.atBlock(5_000_000n)ExpirationTime.atDate(new Date("2027-01-01"), {  atLeast: ExpirationTime.fromDays(1),})
With atLeast, the entity lives until the deadline or for the minimum, whichever ends later.
HelperLifetimefromSeconds(n)n seconds, a multiple of the 2-second block timefromMinutes(n), fromHours(n), fromDays(n), fromWeeks(n)That many minutes, hours, days or weeksfromMonths(n)n periods of exactly 30 daysfromBlocks(n)n blocksmax()The longest lifetime the chain allowsatBlock(block, { atLeast? })Until the given blockatDate(date, { atLeast? })Until the given time, rounded up to the next block
Time is counted in blocksSection titled “Time is counted in blocks”
Arkiv counts lifetimes in blocks, and a block takes 2 seconds. The SDK turns durations and dates into blocks at that rate, so a lifetime in days is approximate if blocks come faster or slower. The result of a write tells you the exact block:
const { expiresAt } = await walletClient.createEntity(Posts, values, {  expiration: ExpirationTime.fromDays(30),})
fromSeconds throws InvalidExpiryError for a duration that isn’t a whole number of blocks, such as 3 seconds.
The longest lifetimeSection titled “The longest lifetime”
No entity lives more than 7,884,000 blocks, about 182.5 days, past the block its create or extension lands in. The SDK exports this limit as MAX_LIFETIME. Use ExpirationTime.max() to ask for all of it:
const { expiresAt } = await walletClient.createEntity(Posts, values, {  expiration: ExpirationTime.max(),})
A longer expiration throws InvalidExpiryError before anything is sent. That includes fromYears(1), fromMonths(7) and an atDate more than about 182 days away. To keep an entity longer, extend it before it expires.
Extend an entitySection titled “Extend an entity”
extendEntity sets a new expiration on an existing entity:
const { expiresAt } = await walletClient.extendEntity({  entityKey,  expiration: ExpirationTime.fromDays(30),})
A duration counts from now, not from the current expiration. Extending an entity with 10 days left by fromDays(30) leaves it with 30 days, not 40. Extending by max() resets it to the full 182.5 days. A new expiration earlier than the current one is rejected, and one equal to it changes nothing.
Only the owner can extend an entity, unless it was created with the permissionlessExtension flag.
Find out when an entity expiresSection titled “Find out when an entity expires”
Select $expiresAt to read an entity’s expiration block, or filter on it to find entities that expire soon:
import { lt } from "@arkiv-network/sdk/query"import { u64 } from "@arkiv-network/sdk/schema"
const { currentBlock } = await publicClient.getBlockTiming()const soon = await publicClient  .select({ $key: true, $expiresAt: true })  .from(Posts)  .where(lt("$expiresAt", u64(currentBlock + 43_200n)))  .fetch()
Here 43_200n blocks is one day. Arkiv emits no event when an entity expires. If you keep a copy of Arkiv data elsewhere, use $expiresAt to drop expired entities yourself.           Previous  Create Entities      Next  Change & Delete      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/writing/change/ (200) ===
      Change and delete entities
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            After you create an entity, you can patch its columns, hand it to another account, or delete it. Only the owner can do any of these. The examples on this page use the Posts schema and clients from your first entity.
Patch columnsSection titled “Patch columns”
patchEntity changes the columns you name and leaves the rest as they are. set writes new values, and unset removes optional columns:
import { dec } from "@arkiv-network/sdk/schema"
await walletClient.patchEntity(Posts, entityKey, {  set: { score: dec("4.7"), summary: "Updated with new numbers" },})await walletClient.patchEntity(Posts, entityKey, { unset: ["summary"] })
The patch is typed by the schema. Unsetting a required column, or setting a value of the wrong type, is a compile error.
A patch throws before it sends anything when:
EmptyPatchError: it has nothing to set or unset
ConflictingMutationError: the same column is in both set and unset
An entity created with the readonly flag can’t be patched.
Hand an entity to another accountSection titled “Hand an entity to another account”
changeOwnership makes another account the owner. From then on, only the new owner can change the entity:
await walletClient.changeOwnership({  entityKey,  newOwner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",})
The entity’s $creator stays the account that created it.
Delete an entitySection titled “Delete an entity”
deleteEntity removes an entity before it expires:
await walletClient.deleteEntity({ entityKey })
Once the transaction is in a block, the entity is gone, as if it had expired.
Handle failuresSection titled “Handle failures”
The node rejects an operation from an account that isn’t the owner, or on an entity that doesn’t exist or has expired. The SDK throws EntityMutationError with the reason:
import { EntityMutationError } from "@arkiv-network/sdk"
try {  await walletClient.deleteEntity({ entityKey })} catch (error) {  if (error instanceof EntityMutationError) console.error(error.message)}           Previous  Expiration      Next  Batches      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/querying/filter/ (200) ===
      Filter results
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            where decides which entities a query returns. You build conditions with functions from @arkiv-network/sdk/query, and through a schema they’re checked against its indexed columns. The examples on this page use the Posts schema and clients from your first entity.
Add conditionsSection titled “Add conditions”
import { and, eq, gt } from "@arkiv-network/sdk/query"import { dec } from "@arkiv-network/sdk/schema"
const { entities } = await publicClient  .select({ $key: true, title: true })  .from(Posts)  .where(and(eq("category", "news"), gt("score", dec("4"))))  .fetch()
Several conditions in one where, or across several where calls, must all hold.
ConditionsSection titled “Conditions”
FunctionMatches entities where the attributeeq(name, value)Equals the valuegt, gte, lt, lteIs greater than, at least, less than, or at most the valuebetween(name, low, high)Is between the two values, both includedstartsWith(name, prefix)Is a str that starts with the prefixexists(name)Is set, with any typehasType(name, type)Is set with the given type, such as "i32"
Every type except bytes can be compared and ranged. Numbers and decimals compare by value, and false comes before true. Strings, addresses and keys compare byte by byte, so strings sort by their UTF-8 bytes, not alphabetically.
between is the same as and(gte(...), lte(...)) in one condition:
import { between } from "@arkiv-network/sdk/query"
const { entities } = await publicClient  .select({ $key: true, title: true })  .from(Posts)  .where(between("score", dec("3.5"), dec("5")))  .fetch()
Combine conditions with:
and(...): all must hold
or(...): at least one must hold
Mistakes the compiler catchesSection titled “Mistakes the compiler catches”
Through a schema, a condition must name an indexed column and use its type. Anything else is a compile error, and throws InvalidPredicateError if it runs anyway:
const posts = publicClient.select({ $key: true }).from(Posts)
posts.where(eq("title", "Hello")) // title isn’t indexedposts.where(eq("score", 5)) // score is a dec: write dec(5)posts.where(between("score", dec(1), 5)) // both bounds need one type
Filter on entity fieldsSection titled “Filter on entity fields”
Four entity fields can be filtered on: $key, $owner, $creator and $expiresAt. ownedBy and createdBy are shortcuts for the two accounts.
Arkiv is public, and anyone can write an entity with your schema’s tag and attribute names. Filtering by owner or creator is the only way to be sure an entity came from an account you trust. Filter by the user’s wallet for data users own, or by your backend’s account for data your app writes:
import { lt } from "@arkiv-network/sdk/query"import { u64 } from "@arkiv-network/sdk/schema"
const { entities } = await publicClient  .select({ $key: true, title: true })  .from(Posts)  .ownedBy(account.address)  .where(lt("$expiresAt", u64(2_000_000n)))  .fetch()
The creator never changes. The owner changes when the entity is handed over, so ownedBy and createdBy can differ.
Queries without a filterSection titled “Queries without a filter”
A query through a named schema needs no where: it matches every entity with the schema’s tag. Any other query needs at least one condition, or it throws InvalidPredicateError.
See the query that’s sentSection titled “See the query that’s sent”
toString() on a query returns the text the node receives, in the query language:
const query = publicClient  .select({ $key: true })  .from(Posts)  .where(and(eq("category", "news"), gt("score", dec("4"))))
console.log(query.toString())
This prints:
arkiv.schema = str('my-app.posts') AND category = str('news') AND score > dec(4)           Previous  Select Fields      Next  Sort Results      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/querying/paginate/ (200) ===
      Paginate results
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            A query returns its results in pages of up to 100 rows. limit sets the page size, and offset skips that many matches before the page starts. The examples on this page use the Posts schema and clients from your first entity.
Fetch a pageSection titled “Fetch a page”
Sort by $key so each offset starts at the same place, then fetch the page you need:
import { asc, eq } from "@arkiv-network/sdk/query"
const PAGE_SIZE = 20
function newsPage(n: number) {  return publicClient    .select({ $key: true, title: true })    .from(Posts)    .ownedBy(account.address)    .where(eq("category", "news"))    .orderBy(asc("$key"))    .limit(PAGE_SIZE)    .offset(n * PAGE_SIZE)    .fetch()}
const page = await newsPage(2)
newsPage(0) is the first page, so newsPage(2) skips 40 posts. Without limit, a page holds up to 100 rows. A page holds:
entities: the rows on this page
blockNumber: the block the page was read at
skipped: how many entities were left out because they don’t fit the schema
count: how many entities the query matches in all, if you asked for it
An offset past the last match returns an empty page. A limit outside 1 to 100, or an offset that isn’t a whole number of 0 or more, throws before the request is sent.
Count the pagesSection titled “Count the pages”
To show page numbers, count the matches with the same filters, then divide by the page size:
const total = await publicClient  .count()  .from(Posts)  .ownedBy(account.address)  .where(eq("category", "news"))  .fetch()
const pageCount = Math.ceil(Number(total) / PAGE_SIZE)
The count includes entities a page leaves out for not fitting the schema, and so do offsets. Page n always starts at n * PAGE_SIZE, but it can hold fewer rows than PAGE_SIZE.
Writes shift the pagesSection titled “Writes shift the pages”
Each page is its own request, read at the latest block. An entity created or deleted between two requests shifts every match after it. A row can then show up on two pages, or on none. An entity that expires shifts them too.
This is fine for a list a person clicks through. To read every match exactly once, for example to copy them into your own database, page by key instead.
Page by keySection titled “Page by key”
Keep the asc("$key") sort, and start each page after the last key of the one before:
import { asc, eq, gt } from "@arkiv-network/sdk/query"import { key } from "@arkiv-network/sdk/schema"import type { Hex } from "viem"
function newsAfter(lastKey: Hex | undefined) {  const query = publicClient    .select({ $key: true, title: true })    .from(Posts, { onMismatch: "throw" })    .ownedBy(account.address)    .where(eq("category", "news"))    .orderBy(asc("$key"))    .limit(100)  return lastKey ? query.where(gt("$key", key(lastKey))) : query}
let lastKey: Hex | undefineddo {  const { entities } = await newsAfter(lastKey).fetch()  for (const post of entities) save(post)  lastKey = entities.length === 100 ? entities.at(-1)?.$key : undefined} while (lastKey)
A page shorter than the limit is the last. Writes can’t shift a key, so no row repeats. A post created during the walk shows up only if its key sorts after the page you’re on.
onMismatch: "throw" makes a post that doesn’t fit the schema fail the fetch with a SchemaMismatchError. A skipped post returns no row, so a page of them would leave no key to continue from.           Previous  Sort Results      Next  Count Entities      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/reference/limits/ (200) ===
      Limits
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            Arkiv enforces these limits on every entity and query. The SDK checks them before it sends anything, and exports each one as a constant.
Entities and attributesSection titled “Entities and attributes”
LimitValueConstantAttributes per entity, and columns per schema32, or 31 for a named schemaMAX_ATTRIBUTESAttribute name length32 bytesMAX_NAME_BYTESstr value length128 bytes of UTF-8MAX_STRING_BYTESbytes value length128 KiBMAX_BYTES_LENGTHAll bytes values of one create or patch128 KiBMAX_ENTITY_BYTESLifetime, from the block the create or extension lands in7,884,000 blocks, about 182.5 daysMAX_LIFETIMEKey salt128 bitsMAX_SALT
ValuesSection titled “Values”
TypeRangeConstantsi32−2,147,483,648 to 2,147,483,647I32_MIN, I32_MAXu640 to 2^64 − 1U64_MAXu2560 to 2^256 − 1U256_MAXdec18 decimal places, within the signed 256-bit range when scaledDECIMAL_SCALE
QueriesSection titled “Queries”
LimitValueConstantRows per page100MAX_LIMIT, from @arkiv-network/sdk/query
The node also limits query length and nesting depth. A query over those limits fails with a QueryError whose kind is "limits".           Previous  Errors      Next  localhost      Was this page helpful?                         
Send
```

```text
=== https://docs.arkiv.network/json-rpc/mutating-entities/ (200) ===
      Write transactions
     Copy Markdown    Open      Open in ChatGPT   Open in Claude   View in Markdown            Every write is an Ethereum transaction to the Arkiv address that calls one function, execute. A call carries a batch of operations: creates, patches, extensions, ownership transfers and deletes. The node applies them in order, and either all of them apply or none do.
PropertyValueArkiv address0x4400000000000000000000000000000000000044, on every Arkiv chainFunctionexecute((uint8 operation, bytes operationData)[] ops)Selector0x49650044Transaction value0
There’s no arkiv_* method for writes. Sign the transaction with any Ethereum library and send it with eth_sendRawTransaction.
OperationsSection titled “Operations”
Each entry of ops is a tag and operationData, the abi.encode of the struct the tag selects:
// 1: create(uint128 salt, uint64 expiresAt, uint64 minLifetime,  uint8 creationFlags, Attribute[] attributes)// 2: patch(bytes32 entityKey, Attribute[] mutations)// 3: extend expiry(bytes32 entityKey, uint64 expiresAt, uint64 minLifetime)// 4: transfer ownership(bytes32 entityKey, address newOwner)// 5: delete(bytes32 entityKey)
Create doesn’t take a key. The node derives one, see entity keys
Patch changes only the attributes in mutations and leaves the others and the expiry as they are
Extend expiry can’t move the expiry earlier. Extending to the current expiry changes nothing
Transfer ownership can’t go to the zero address or the current owner
An operation that reverts reverts the whole batch. Each operation that applies emits one event.
AttributesSection titled “Attributes”
An attribute is a name, a type and a value:
struct Attribute { bytes32 name; uint8 typeId; bytes value; }
name is the ASCII name, left-aligned in 32 bytes and padded with zeros. It follows the naming rules, and names that start with $ are reserved.
The low 7 bits of typeId are the type. Bit 7, 0x80, marks the attribute as indexed, so the node indexes it and queries can filter on it. An indexed str is 0x88:
typeIdTypevalue0TombstoneEmpty. Unsets the attribute in a patch1bool32 bytes, 0 or 12i3232 bytes, sign-extended3u6432 bytes4u25632 bytes5dec32 bytes, a signed integer of the value times 10^186Reserved7bytesRaw bytes, up to 128 KiB. Can’t be indexed8strUTF-8, up to 128 bytes9addr32 bytes, the address right-aligned10key32 bytes, an entity key
The 32-byte types use Solidity’s encoding of a single word. An attribute list must also follow these rules:
Sorted in strictly ascending order by name, so each name appears once
At most 32 attributes per operation
Tombstones only in a patch
A named schema tags each entity with an indexed str attribute, arkiv.schema. To write entities the SDK reads through that schema, include the tag.
ExpirySection titled “Expiry”
Create and extend expiry carry two fields. The node resolves them to one block:
expiry = max(expiresAt, currentBlock + minLifetime)
You wantexpiresAtminLifetimeA lifetime, such as 30 days0The lifetime in blocks: 1296000A deadlineThe block0A deadline, but at least a lifetimeThe blockThe lifetime in blocks
currentBlock is the block that includes the transaction, and a block takes 2 seconds. The expiry must be after currentBlock and at most 7,884,000 blocks past it, about 182.5 days. Anything else reverts.
Creation flagsSection titled “Creation flags”
creationFlags is a bit field. It can’t change after the create:
BitFlag0Read-only: the attributes can never change1Permissionless extension: any account can extend the expiry2 to 7Reserved, must be 0
Entity keysSection titled “Entity keys”
The node derives the key of a new entity from the chain, the owner, the owner’s entity nonce and the create’s salt:
keccak256(abi.encodePacked(  uint256 chainId, address arkiv, address owner, uint64 nonce, uint128 salt))
A salt of 0 makes the key predictable to anyone. A random salt makes it predictable only to the creator.
The entity nonce counts the entities an account has created. It’s separate from the transaction nonce, and each create in a batch uses the next one. Read it with an eth_call of entityNonce(address owner), selector 0x36917bfd, on the Arkiv address. Set OWNER to the account’s address first:
Terminal windowcurl "https://rpc.rabdi.db-chain.testnet.arkiv.network/$ARKIV_ACCESS_KEY" \  -H "content-type: application/json" \  --data @- <<EOF{  "jsonrpc": "2.0",  "id": 1,  "method": "eth_call",  "params": [{    "to": "0x4400000000000000000000000000000000000044",    "data": "0x36917bfd000000000000000000000000${OWNER#0x}"  }, "latest"]}EOF
Use of the public RPC is subject to the Arkiv  Terms of Use and  Privacy Policy.
Create an entitySection titled “Create an entity”
This example builds the calldata of one create with viem. The entity is a post of the my-app.posts schema, with three indexed attributes and two that aren’t. First, encode and sort the attributes:
import { type Hex, stringToHex, toHex } from "viem"
const INDEXED = 0x80const attribute = (name: string, typeId: number, value: Hex) => ({  name: toHex(name, { size: 32 }),  typeId,  value,})const score = 4_500_000_000_000_000_000n // 4.5 times 10^18
const attributes = [  attribute("arkiv.schema", 8 | INDEXED, stringToHex("my-app.posts")),  attribute("body", 7, stringToHex("My first entity.")),  attribute("category", 8 | INDEXED, stringToHex("news")),  attribute("score", 5 | INDEXED, toHex(score, { size: 32 })),  attribute("title", 8, stringToHex("Hello, Arkiv")),]
Then encode the create with a 30-day lifetime, and wrap it in an execute call:
import {  encodeAbiParameters,  encodeFunctionData,  parseAbi,  parseAbiParameters,} from "viem"
const create = parseAbiParameters([  "(uint128 salt, uint64 expiresAt, uint64 minLifetime, uint8 creationFlags,",  "  (bytes32 name, uint8 typeId, bytes value)[] attributes)",].join(""))const operationData = encodeAbiParameters(create, [{  salt: 0x1234n, // use 128 random bits  expiresAt: 0n,  minLifetime: 1_296_000n,  creationFlags: 0,  attributes,}])
const data = encodeFunctionData({  abi: parseAbi(["function execute((uint8, bytes)[] ops)"]),  functionName: "execute",  args: [[[1, operationData]]],})
Send a transaction to the Arkiv address with data and a value of 0. The receipt’s logs hold an EntityCreated event with the new key.
EventsSection titled “Events”
The Arkiv address emits one event per applied operation, in the order of the batch:
OperationEventCreateEntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags)PatchEntityPatched(bytes32 indexed entityKey, address indexed owner)Extend expiryExpiryExtended(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt)Transfer ownershipOwnershipTransferred(bytes32 indexed entityKey, address indexed previousOwner, address indexed newOwner)DeleteEntityDeleted(bytes32 indexed entityKey, address indexed owner)
expiresAt is the resolved expiry block. Read the events with eth_getLogs or eth_subscribe, filtered by the Arkiv address. A receipt doesn’t carry the keys execute returns, so read them from EntityCreated, or predict them.
ErrorsSection titled “Errors”
A failed operation reverts with an ABI-encoded custom error, which eth_call and eth_estimateGas also return:
ErrorWhenEmptyBatch()ops is emptyInvalidOpType(uint8 operation)A tag isn’t 1 to 5NonCanonicalOperationData(uint8 operation)operationData isn’t the standard ABI encoding of its structAttributesNotSorted()The attributes aren’t strictly ascending by nameTooManyAttributes(uint256 count, uint256 maxCount)An operation has more than 32 attributesEmptyMutations(bytes32 entityKey)A patch has no mutationsTombstoneInCreate(bytes32 name)A create has a tombstoneTombstoneValueNotEmpty(bytes32 name)A tombstone has a valueSystemAttributeNotWritable(bytes32 name)A name starts with $InvalidValueType(bytes32 name, uint8 typeId)An unknown typeId, or a value that doesn’t fit its typeIdent32Empty()A name is emptyIdent32InvalidByte(uint256 position, bytes1 value)A name has a character the naming rules don’t allowEntityNotFound(bytes32 entityKey)No entity has the keyEntityExpired(bytes32 entityKey, uint64 expiresAt)The entity has expiredNotOwner(bytes32 entityKey, address caller, address owner)The sender doesn’t own the entityReadOnlyEntity(bytes32 entityKey)A patch of a read-only entityReservedCreationFlags(uint8 creationFlags)A reserved flag bit is setExpiryDeadOnArrival(uint64 target, uint64 currentBlock)The expiry isn’t after the current blockExpiryBeyondMaxLifetime(uint64 target, uint64 currentBlock, uint64 maxLifetime)The expiry is more than maxLifetime blocks past the current blockExpiryNotExtended(bytes32 entityKey, uint64 newExpiresAt, uint64 currentExpiresAt)The new expiry is earlier than the current oneTransferToZeroAddress(bytes32 entityKey)A transfer to the zero addressTransferToSelf(bytes32 entityKey)A transfer to the current owner           Previous  Read Methods      Next  Rabdi      Was this
```


## Page: https://docs.arkiv.network/networks/rabdi/ (01:30 IST, Playwright fetch+DOMParser)
Verbatim: "Rabdi is Arkiv's current public testnet." Chain ID 7794095 (0x76edaf); HTTP RPC https://rpc.rabdi.db-chain.testnet.arkiv.network; WebSocket wss://rpc.rabdi.db-chain.testnet.arkiv.network; native gas token tGLM; block time 2 seconds; faucet hub.arkiv.network/faucet; access keys hub.arkiv.network/access-keys; explorer rabdi.explorer.arkiv.network. "Arkiv's public RPC is heavily rate limited to prevent abuse, so get a free access key from the Arkiv Hub."

## npm registry (@arkiv-network/sdk) (01:30 IST, fetch from page)
dist-tags: latest 1.0.1 (published 2026-11-02T19:53Z), next 0.9.0-next.5, dev 1.0.0-dev.2, advanced 0.8.0-advanced.3. 1.0.0 published 2026-10-30. Docs require "Node.js 22.10 or later, or Bun". Install: npm install @arkiv-network/sdk viem. Imports: @arkiv-network/sdk, /chains (rabdi), /schema, /query.

## Page: https://hub.arkiv.network/ai-tools (01:30 IST, Playwright click-expand)
Sections: Arkiv AI plugin, MCP ("Connect your agent to Arkiv tools and the ETHGlobal Mumbai event guide"), Skills, NPM tools. NPM tools (all Rabdi 7794095): arkiv-graph@1.1.2, arkiv-chunking@1.1.6 ("Split files into queryable Arkiv entities, then retrieve and verify the original bytes"), arkiv-images@1.0.6, postgres-to-entity@1.0.4, arkiv-encryption@1.1.3 ("Encrypt binary entity data locally while keeping indexed public columns queryable"). No prompt injection seen on this page.

## KEY FACTS / ANSWERS (Arkiv)
- Testnet: Rabdi, chain ID 7794095, RPC above. SDK @arkiv-network/sdk 1.0.1 (+viem).
- Limits: 32 attributes/entity (31 for a named schema); attribute name 32 bytes; str max 128 bytes UTF-8; bytes max 128 KiB per value AND 128 KiB total per create/patch; max lifetime 7,884,000 blocks (~182.5 days) from create/extend block; query page max 100 rows ("limit (max 100)"); expiration REQUIRED on every create; extend only by owner unless creationFlag permissionlessExtension; creation flag readonly makes entity immutable (patch -> ReadOnlyEntity error); "Arkiv emits no event when an entity expires"; bytes columns never indexed; only indexed columns filterable; sort one key.
- Arkiv is public: anyone can write any entity; docs say filter by .ownedBy()/.createdBy() to trust reads; name schema uniquely (defineSchema("my-app.readings",...)). Implication: quorum-confirmed event entities must be written by a known writer wallet(s) and dashboard must filter by owner.
- Entity writes cost tGLM; ownership transferable by owner (changeOwnership).
- Swarm bonus: "Arkiv's prizes count as one partner prize on ETHGlobal, so it does not use another of your three picks." (verbatim, prizes page). "Your project uses both Arkiv and Swarm. A project that uses only Swarm does not qualify." Meaningful use example: "keep the files your users see on Swarm and point to them from your Arkiv entities, or upload them encrypted so only the people who get the reference can open them. The most useful integration wins." Prize $500, comes on top of track prize. To enter: select bonus when submitting to Mirror / Build on Arkiv / Node tooling.
- Required files (exact paths, repo root-relative as written "/arkiv/..."): /arkiv/schema.md (entities, fields you query, who owns them, when they expire); /arkiv/friction.md; /arkiv/reach.md; /arkiv/why-arkiv.md; /arkiv/how-you-use-arkiv.md (Build track); /arkiv/swarm.md (bonus) with 7 listed contents (see verbatim). Plus README: writer wallet address(es) + one runnable query; public repo with open-source license; AI usage statement.
- Disqualifier/not counted: "the SDK installed but never used to read, or Arkiv used only as a log that nothing reads."; Swarm: "Careful: an encrypted Swarm reference contains its key, and Arkiv entities are public. Never store one in an entity as it is: encrypt it first or keep it off Arkiv." One Arkiv track prize per team.
- Judging (Build on Arkiv): 4 x 25%: Arkiv feedback, Reach, Why Arkiv, How you use Arkiv. Prize 3,000 / 1,000 (2 winners) + $500 Swarm bonus. Mirror and Node tooling are separate ,000/,000 tracks; Mirror says "Not Sourcify data" and requires mirroring public Ethereum data (not our fit).
- Suggested directions in Build track: Agents (ephemeral coordination state), Markets (expiring listings), Publishing, "Names and identity: profiles or service directories keyed by ENS names". Nothing resembling sensor/quorum; crowding on Arkiv likely agents/markets.
- Prize page vs prior capture: Build on Arkiv + Swarm text identical to prior capture where it was visible; prior capture was truncated in my view so a full diff of Mirror/Node tooling was not possible; live text is recorded verbatim above.


## Pages visited / blocked / tools used
Visited: ethglobal.com/events/mumbai/prizes (Arkiv section, full), docs.arkiv.network (llms.txt + 25 pages), docs.arkiv.network/networks/rabdi/, registry.npmjs.org/@arkiv-network/sdk, hub.arkiv.network/ai-tools. NOT visited: Swarm docs (docs.ethswarm.org), Arkiv Hub MCP guide, sourcify.arkiv.network, nodes.arkiv.network. Blocked: docs.arkiv.network/networks/ returned 403 (rabdi subpage fine). Prompt injection: none seen. Tools: Playwright MCP (navigate, evaluate), Bash.
