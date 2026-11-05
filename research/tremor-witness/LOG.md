# Tremor Witness build-prep log (append-only, IST)

| Time (IST) | Who | Event | Output |
| --- | --- | --- | --- |
| Fri 01:26 | Dhruv (direction) | Chose Tremor Witness and 4 sponsor tracks: Arkiv Build (+Swarm bonus), ENSv2, EF CROPS, World IDKit (backup). Asked for an in-depth Playwright study of the 4 tracks, then a build plan; "record everything". | 00-sponsor-fit-analysis-pasted.md |
| Fri 01:27 | Claude Code | Spawned track-study agent (Sonnet, Playwright) on ethglobal.com prizes/details + sponsor links | sponsors/ethglobal-*.md |
| Fri 01:27 | Claude Code | Spawned docs agent (Sonnet, WebFetch/GitHub/curl, no Playwright) on Arkiv, Swarm, ENSv2, Safe/CROPS, World IDKit, phone sensors | sponsors/docs-*.md |
| 01:27 | docs agent | started docs study (6 files created); npm @arkiv-network/sdk latest 1.0.1 | sponsors/docs-arkiv.md |
| 01:28 | track-study agent | prizes page innerText (Arkiv/EF/ENS/World sections verbatim) | sponsors/ethglobal-{arkiv,ef-crops,ens,world-idkit}.md |
| 01:29 | track-study agent | info/details page verbatim | sponsors/ethglobal-general.md |
| 01:30 | docs agent | Arkiv: testnet=Rabdi chain 7794095 (0x76edaf, probed OK), RPC rpc.rabdi.db-chain.testnet.arkiv.network, faucet hub.arkiv.network/faucet, SDK @arkiv-network/sdk 1.0.1; limits 128KiB bytes, max life ~182.5d, 100 rows/page, 32 attrs | sponsors/docs-arkiv.md |
| 01:30 | docs agent | Arkiv API: defineSchema, createEntity(schema,vals,{expiration:ExpirationTime.fromDays(n)}), patchEntity, deleteEntity, extendEntity; query select().from().ownedBy().where(and(eq,gt,between)).fetch(); $owner/$creator/$expiresAt filterable; writes cost tGLM gas | sponsors/docs-arkiv.md |
| 01:30 | track-study agent | docs.arkiv.network (25 pages via llms.txt), rabdi network page, npm registry, hub ai-tools | sponsors/ethglobal-arkiv.md |
| 01:31 | docs agent | Arkiv: Tiramisu (7738577) replaced by Rabdi but still answers; Oct tour challenge rules (friction report, schema.md) in Arkiv-Network/global-tour-stop-pre-devcon | sponsors/docs-arkiv.md |
| 01:32 | track-study agent | docs.ens.domains ENSv2 (12 pages) + Sepolia/mainnet deployments | sponsors/ethglobal-ens.md |
| 01:32 | docs agent | Swarm: bee-js 13.2.0; browser-only upload works via https://api.gateway.ethswarm.org with null stamp (64 zeros), CORS *, 400KB OK (probed POST /bzz, GET back 200) | sponsors/docs-swarm.md |
| 01:32 | track-study agent | EF Mandate blog + CROPS prize analysis | sponsors/ethglobal-ef-crops.md |
| 01:33 | docs agent | ENSv2 docs saved from docs.ens.domains/llms-full.txt (subnames, registry template, PermissionedResolver, EAC, app-dev tutorial); Sepolia address table is a dynamic component, hunting addresses | sponsors/docs-ensv2.md |
| 01:33 | track-study agent | docs.world.org IDKit/credentials/sandbox + simulator | sponsors/ethglobal-world-idkit.md |
| 01:35 | docs agent | ENSv2 Sepolia canonical addresses (contracts-v2 commit 07e55a05, deployed 2026-10-01) saved and eth_getCode-probed OK: RootRegistry 0xb458d6a3..., ETHRegistry 0xd4ebcbbd..., VerifiableFactory 0xda70306c..., PermResolverImpl 0x115eb53f..., UserRegistryImpl 0x9bd8a887..., UR proxy 0xeEeEEEeE...; older sets exist, beware | sponsors/docs-ensv2.md |
| 01:36 | docs agent | ENS read probe OK: viem 2.57.16 getEnsAddress on Sepolia works via UR 0xeeeeeeee..; subname design: UserRegistry.register(label,owner,0x0,resolver,roleBitmap w/o ROLE_CAN_TRANSFER_ADMIN,expiry), unregister() to revoke, grantRoles/grantRootRoles/grantSetterRoles | sponsors/docs-ensv2.md |
| 01:37 | docs agent | CROPS: primary source = EF Mandate PDF (ethereum.foundation/mandate); verbatim defs, walkaway test, 'unhappy case' third-party API/CDN disappears test, red-flag list (whitelists, discretionary upgrade ability) | sponsors/docs-safe-crops.md |
| 01:38 | docs agent | Safe: protocol-kit 8.0.11, api-kit 5.0.4; Tx Service Sepolia live at api.safe.global/tx-service/sep (v6.14.0; docs say apiKey needed); 2-of-3 deploy + createTransaction/signTransaction/executeTransaction snippets saved | sponsors/docs-safe-crops.md |
| 01:40 | docs agent | World IDKit 4.6.0 (@worldcoin/idkit, idkit-core): RP signature needs secret signing key (backend); verify POST developer.world.org/api/v4/verify/{rp_id} has no CORS => needs tiny function; staging+simulator.worldcoin.org usable w/o Orb; PoH=Orb, Selfie Check=no Orb (medium assurance) | sponsors/docs-world-idkit.md |
| 01:42 | docs agent | Arkiv SDK 1.0.1 live read probe OK on Rabdi; design notes (phone gas, $creator trust, 128KiB, ~182d max expiry); footers added | sponsors/docs-arkiv.md |
| 01:42 | docs agent | Phone sensors: LinearAccelerationSensor needs HTTPS + visible page (readings stop when screen locked/hidden), Chrome caps 60 Hz, Wake Lock baseline since Mar 2025 | sponsors/docs-phone-sensors.md |
| Fri 01:45 | Claude Code | Both research agents returned; findings committed. Build plan v1 written. | ../../design/build-plan.md |
| Fri 01:51 | Claude Code | Dhruv: "test on a single phone first, basic prototype, then grow". Built Prototype 0 (sensor page: rate, PPV, trigger, structural/handling label, CSV export). Deployed https://tremor-witness.vercel.app | apps/web, packages/core |
