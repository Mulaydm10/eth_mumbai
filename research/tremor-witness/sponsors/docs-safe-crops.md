# Docs study: safe-crops (docs agent, started 01:27 IST)

## [01:37] EF CROPS primary source. Confidence HIGH (primary document, read in full text)
Source: "The Ethereum Foundation Mandate" PDF, https://ethereum.foundation/mandate (served as application/pdf, 24 MB, 38pp; published 13 Mar 2026 per press: https://www.theblock.co/news/ecosystems/2026-03-13-ethereum-foundation-mandate-role-one-of-many-stewards-network-393563). Extracted with pdftotext; (WebFetch fails on size).
CROPS = Censorship Resistance, Open Source (and Free, as in Freedom), Privacy, Security. "We hold that these properties - CROPS - must remain, as an indivisible whole, the sine qua non of all Ethereum's development priorities, which cannot be displaced." (Press adds Vitalik later extended to "capture resistance"; NOT in the mandate's four.)
Verbatim definitions (Principles for Action, Technical Pillar):
- "Censorship Resistance: No actor can selectively exclude valid use or break functionality, including by gaining durable, non-competitive control of any critical mechanisms."
- "All work must be architected to be maximally unstoppable and to function without incorporating centralized intermediaries or kill switches."
- "Censorship resistance also includes technical resistance to extra-technical pressure, such as social mores or legal restriction. The protocol relies on cryptographic guarantees for its resilience and neutrality, not on the temporal concerns of the political context."
- "Open Source and Free, as in Freedom: No privileged code or hidden specifications. All work must be public and auditable: no proprietary 'black boxes.' All work must also be forkable: Ethereum's credibility depends on predictable exit paths..." "Supported projects must pledge that they will not change their open source or copyleft license... merely source-available licenses are not tolerated."
- "Privacy: User data is not exposed beyond necessity or against their interests." "privacy must be permissionless and available to all." "end users should always selectively negotiate their disclosures".
- "Security: Things must do what they claim to do, no more and no less." "Security requires simplicity, including responsible minimization of lines of code and external dependencies" "Security also means governance minimization; no social layer should override protocol guarantees lightly." "True security protects both system and users from technical failure, social entrapment, and coercion."
- Walkaway test: "Our ultimate goal is for Ethereum to pass the walkaway test: its protocol and core application layers become robust and trustless enough that they would continue to reliably function and evolve even if the Foundation and today's core developers disappeared tomorrow." "Achieving this needs, among other things, intermediary minimization and structural decentralization".
- Cross-layer warning (Resolving Quandaries): "A proposal that on narrow analysis satisfies the CROPS properties, yet introduces a user chokepoint at another layer of interaction, whether that be forced intermediation, extraction, or some other anti-sovereign pattern, is a proposal that must be rejected." and "Protocols may remain formally un-degraded or 'pristine' while in reality, positive or essential capabilities ... migrate into centralized, intermediary-dependent, trust-dependent, permissioned, or opaque structures or services."
- The 'unhappy case' test (very useful for our 'kill the backend' demo): "One way that this occurs is through thinking only about the 'happy case,' where all the variables play out as planned, but not about the 'unhappy case' such as where third-party dependencies (whether APIs, content delivery networks, or otherwise) disappear or break - or worse, where the team itself disappears or is hacked or an insider turns hostile."
- Red-flag list: "if on closer inspection work introduces privileged positions - such as closed components, whitelists, soft-default routing, discretionary upgrade ability, or dependency-heavy integrations - it is right to be skeptical." Contrast example: an "open market for intermediaries ... without a whitelist" treated "as a temporary artifact with a credible path to elimination via user-driven routes and on-chain guarantees", publishing "threat models, ship legible specs".
=> "Structurally censorship-resistant" (our synthesis, from these quotes): no actor holds a kill switch or whitelist; function survives if the team/APIs/CDNs vanish (walkaway test); trust anchored in cryptography + on-chain state, not a server; open/forkable code and specs; minimal dependencies and governance; fallback/exit paths for users. Note the red-flag 'discretionary upgrade ability': ENS UserRegistry/PermissionedResolver are UUPS-upgradeable (ROLE_UPGRADE) and Safe committee holds admin power -- be ready to address in a CROPS red-team (a 2-of-3 committee is a deliberate, accountable governance choice, not a hidden kill-switch, but revocation power over sensors IS a chokepoint to disclose).
Related event context: Arkiv x Devfolio 'Global Tour Stop' (Oct 2026) states CROPS as "the Ethereum Foundation's mandate that Ethereum stay censorship resistant, open source, private and secure" and asks 'Who is harmed today if this data is censored, shut down, leaked or forged?' (github.com/Arkiv-Network/global-tour-stop-pre-devcon README).

## [01:38] Safe on Sepolia. Confidence HIGH (npm + official docs repo + live probe)
Packages (npm view, 01:38 IST): @safe-global/protocol-kit 8.0.11 ; @safe-global/api-kit 5.0.4 ; @safe-global/relay-kit 6.1.5 ; @safe-global/types-kit 4.0.1. Install: pnpm add @safe-global/protocol-kit viem  (docs use viem).
Sources: https://github.com/safe-global/safe-core-sdk (READMEs); https://github.com/safe-global/safe-docs pages/sdk/protocol-kit/guides/safe-deployment.mdx and guides/signatures/transactions.mdx (docs home https://docs.safe.global/sdk/protocol-kit).
Transaction Service Sepolia: LIVE. https://api.safe.global/tx-service/sep/api/v1/about/ => {"name":"Safe Transaction Service","version":"6.14.0",...}. The old host https://safe-transaction-sepolia.safe.global/api/v1/about/ returns 308 redirect to it (curl -L reaches same JSON). api-kit constructor: new SafeApiKit({ chainId: 11155111n, apiKey: 'YOUR_API_KEY' }) -- docs say API KEY required (see http://docs.safe.global/core-api/how-to-use-api-keys). Probe: GET without key on /safes/<unknown>/ => 404 (not 401, i.e. read endpoints answer); POST /safes/<addr>/multisig-transactions/ without key => see probe line below.
### Deploy a 2-of-3 Safe (verbatim from safe-deployment.mdx)
```typescript
import Safe, { PredictedSafeProps, SafeAccountConfig, SafeDeploymentConfig } from '@safe-global/protocol-kit'
import { sepolia } from 'viem/chains'
const safeAccountConfig: SafeAccountConfig = { owners: ['0x...', '0x...', '0x...'], threshold: 2 }
const predictedSafe: PredictedSafeProps = { safeAccountConfig }
const protocolKit = await Safe.init({ provider: sepolia.rpcUrls.default.http[0], signer: SIGNER_PRIVATE_KEY, predictedSafe })
const safeAddress = await protocolKit.getAddress()          // predict address
const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()
const client = await protocolKit.getSafeProvider().getExternalSigner()
const transactionHash = await client.sendTransaction({ to: deploymentTransaction.to, value: BigInt(deploymentTransaction.value), data: deploymentTransaction.data as `0x${string}`, chain: sepolia })
await client.waitForTransactionReceipt({ hash: transactionHash })
const newProtocolKit = await protocolKit.connect({ safeAddress })   // isSafeDeployed(), getOwners(), getThreshold()
```
### Create / sign / (propose) / execute a Safe tx that calls ENS contracts (from guides/signatures/transactions.mdx)
```typescript
const safeTransactionData = { to: ENS_CONTRACT, value: '0', data: encodeFunctionData({abi, functionName:'register', args:[...]}) }   // data = calldata for any ENS call (register/unregister/grantRoles/...)
let safeTransaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] })   // transactions[] with >1 entries => MultiSend batch
// owner 1
protocolKit = await protocolKit.connect({ provider: RPC_URL, signer: OWNER_1_PRIVATE_KEY })
safeTransaction = await protocolKit.signTransaction(safeTransaction, SigningMethod.ETH_SIGN)
// owner 2
protocolKit = await protocolKit.connect({ provider: RPC_URL, signer: OWNER_2_PRIVATE_KEY })
safeTransaction = await protocolKit.signTransaction(safeTransaction, SigningMethod.ETH_SIGN_TYPED_DATA_V4)
// optional: share via Tx Service
const safeTransactionHash = await protocolKit.getTransactionHash(safeTransaction)
const apiKit = new SafeApiKit({ chainId, apiKey: 'YOUR_API_KEY' })
await apiKit.proposeTransaction({ safeAddress, safeTransactionData: safeTransaction.data, safeTxHash: safeTransactionHash, senderAddress: signerAddress, senderSignature: buildSignatureBytes([signatureOwner1]) })
await apiKit.confirmTransaction(safeTransactionHash, buildSignatureBytes([signatureOwner2]))
// execute (any funded signer account pays gas)
protocolKit = await protocolKit.connect({ provider: RPC_URL, signer: OWNER_1_PRIVATE_KEY, safeAddress })
const transactionResponse = await protocolKit.executeTransaction(safeTransaction)
```
Safe Wallet UI queue: https://app.safe.global/transactions/queue?safe=sep:<SAFE_ADDRESS> (NETWORK_PREFIX for Sepolia = sep).
### What this means for ENS
- A Safe is just a contract account address; give it ENS roles by passing its address in UserRegistry.initialize(grants[]) or grantRoles/grantRootRoles/grantSetterRoles. The Safe then calls register()/unregister()/setText through execTransaction. msg.sender seen by ENS = the Safe address. ENS ROLE checks are address-based, no EIP-1271 involved for role checks.
- 'Without the Tx Service' (CROPS-friendly): protocol-kit lets you collect owner signatures out of band (signTransaction, then merge safeTransaction.addSignature) and executeTransaction on-chain; Tx Service is a centralized convenience ("a centralized and open-source service that anyone can deploy and run" - docs wording). Mention this in a CROPS red-team.
- Owners could also be passkeys (docs home lists Passkeys Support) -- not studied.
### Unknowns
- Safe contract version / singleton addresses on Sepolia not checked (protocol-kit resolves them via safe-deployments); Sepolia is a supported network (Tx Service up).
- API key issuance (free?) not verified: docs.safe.global/core-api/how-to-use-api-keys not fetched.

[01:38] Probe result: POST /safes/<addr>/multisig-transactions/ with empty body and NO api key => HTTP 400 validation errors (not 401), so the endpoint is reachable without a key; whether a key is enforced for real proposals is unverified (docs say apiKey param).

## Sources fetched / blocked / tools used
Fetched OK: ethereum.foundation/mandate (PDF via curl + pdftotext); npm (safe packages); api.safe.global/tx-service/sep/api/v1/about/ and POST probe; github safe-global/safe-core-sdk (protocol-kit, api-kit READMEs), safe-global/safe-docs (safe-deployment.mdx, signatures/transactions.mdx); WebSearch (press on mandate).
Blocked/failed: WebFetch of the mandate (24 MB exceeds limit); docs.safe.global .md paths 404 (site is not served as md) -- used the safe-docs GitHub repo instead.
Not done: ethereum.org CROPS explainer page; Safe singleton/factory addresses on Sepolia; API key how-to page.
Tools: curl, pdftotext, WebFetch, WebSearch, GitHub MCP, npm.
