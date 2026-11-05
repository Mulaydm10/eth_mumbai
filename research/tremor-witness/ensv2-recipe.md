# ENSv2 on Sepolia recipe (ensv2 agent)
Pin: contracts-v2 commit 07e55a056f5b6a9c90119f501bdd05714e67dddd (contracts/docs/addresses/sepolia.md, deployed 2026-10-01). Addresses come from sponsors/docs-ensv2.md lines 2323-2364 (re-verified on chain below).

Source checkout: `git fetch --depth 1` of ensdomains/contracts-v2 @07e55a056f5b6a9c90119f501bdd05714e67dddd into scratchpad c2/. Paths below are relative to `contracts/` in that commit. Deployed ABIs: `contracts/deployments/sepolia/<Name>.json` (addresses match docs/addresses/sepolia.md).

## Q4/Q5 findings (registry) [source-verified]
- UserRegistry.initialize(Grant[] grants): src/registry/UserRegistry.sol:58-69. `struct Grant {address account; uint256 roleBitmap;}` src/access-control/interfaces/IEACGrantInitializable.sol. Grants go on ROOT_RESOURCE. Reverts InvalidOwner if no root role holder.
- PermissionedRegistry.register(string label,address owner,IRegistry registry,address resolver,uint256 roleBitmap,uint64 expiry) returns(uint256 tokenId): src/registry/PermissionedRegistry.sol:210-223. Needs ROLE_REGISTRAR on ROOT (l.467). owner==0 => reserved (roleBitmap must be 0). expiry in the past reverts CannotSetPastExpiry.
- unregister(uint256 anyId) l.227-238; needs ROLE_UNREGISTER on token resource OR root (via _checkExpiryAndTokenRoles). Burns token, sets expiry=now. Emits LabelUnregistered(tokenId, sender).
- setSubregistry(uint256 anyId, IRegistry) l.148-153; needs ROLE_SET_SUBREGISTRY on the TOKEN's resource (or root). anyId may be labelhash.
- renew(uint256 anyId,uint64 newExpiry) l.243.
- Role constants (src/registry/libraries/RegistryRolesLib.sol): ROLE_REGISTRAR=1<<0, ROLE_REGISTER_RESERVED=1<<4, ROLE_SET_PARENT=1<<8, ROLE_UNREGISTER=1<<12, ROLE_RENEW=1<<16, ROLE_SET_SUBREGISTRY=1<<20, ROLE_SET_RESOLVER=1<<24, ROLE_CAN_TRANSFER_ADMIN=(1<<28)<<128 (there is NO non-admin transfer role), ROLE_WAS_RESERVED=1<<32, ROLE_SET_URI=1<<36, ROLE_CAN_NAME=1<<120, ROLE_UPGRADE=1<<124. Each *_ADMIN = role<<128.
- NON-TRANSFERABLE: _update (l.517-546) reverts TransferDisallowed unless `from` holds ROLE_CAN_TRANSFER_ADMIN on the token resource. Root-held roles do not count ("ignored on root"). So register phones with a roleBitmap WITHOUT ROLE_CAN_TRANSFER_ADMIN (e.g. 0). Safe transfers additionally need an emancipated registry. unsafeTransfer (l.185) also goes through _update, so also blocked.
- Events (src/registry/interfaces/IRegistryEvents.sol l.18-27,44): `LabelRegistered(uint256 indexed tokenId, bytes32 indexed labelHash, string label, address owner, uint64 expiry, address indexed sender)`; `LabelUnregistered(uint256 indexed tokenId, address indexed sender)`; also `ExpiryUpdated(uint256 indexed tokenId,uint64 indexed newExpiry,address indexed sender)`, `ResolverUpdated`, `SubregistryUpdated`, `TokenRegenerated(old,new)`, `TokenResource(tokenId, resource)`. NOTE LabelUnregistered carries only tokenId (no label): match to LabelRegistered by tokenId (token version is bumped on unregister, so the tokenId of re-registered label differs; unregister uses the current tokenId at the time = the one in the registered log unless roles were regenerated via TokenRegenerated).
- Enumeration method ENSv2 supports: logs on the UserRegistry (LabelRegistered / LabelUnregistered / ExpiryUpdated). No on-chain enumerate function exists in PermissionedRegistry.

## Q1 ETHRegistrar (register a .eth 2LD) [source + on-chain verified, 2026-11-05]
- Contract 0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3 (deployments/sepolia/ETHRegistrar.json); source src/registrar/ETHRegistrar.sol.
- `makeCommitment(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,bytes32 referrer) pure returns(bytes32)` = keccak256(abi.encode(label,owner,secret,subregistry,resolver,duration,referrer)) (l.205-221). NOTE: no payment token in the commitment.
- `commit(bytes32)` l.114. `register(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,address paymentToken,bytes32 referrer) returns(uint256 tokenId)` l.123-171. Payer = msg.sender, pulled by SafeERC20.safeTransferFrom(token, msg.sender, BENEFICIARY, base+premium) => msg.sender must `approve(ETHRegistrar, amount)` first. owner != 0. Owner is arbitrary (can differ from payer).
- Owner token roles at registration: REGISTRATION_ROLE_BITMAP = SET_SUBREGISTRY|SET_SUBREGISTRY_ADMIN|SET_RESOLVER|SET_RESOLVER_ADMIN|CAN_TRANSFER_ADMIN (l.18-23). So the committee (owner) can call ETHRegistry.setSubregistry / setResolver itself.
- On-chain reads (publicnode RPC): MIN_COMMITMENT_AGE=60s, MAX_COMMITMENT_AGE=86400s, MIN_REGISTER_DURATION=2419200s (28 d), GRACE_PERIOD=2419200s, BENEFICIARY=0x84D3a426D4E12E955d1DF95db0B24fe26afE39D3, rentPriceOracle=0x8196665D4ca7488B6474a9EC8E7d2719FB42263A.
- Price: getRegisterPrice("tremorwitness", 365d, MockUSDC) => base=8000021, premium=0 (MockUSDC has 6 decimals => ~8.000021 USDC / year). 4-char label: 160.000009 USDC/yr. Labels <5 chars cost more; 3-char `abc` and `abcde` unavailable in probe. `tremorwitness` isAvailable()=true at probe time.
- Payment token: MockUSDC 0x240b0316df57887dbbe58b586508b19e633a14aa (deploy/00_MockTokens.ts: MockERC20("USDC", 6)); test/mocks/MockERC20.sol:26 `mint(address to,uint256 amount)` has NO access control. Anyone can mint. Gas only is real cost.
- Flow: mint USDC -> approve(ETHRegistrar) -> commit(hash) -> wait >=60 s (and <24 h) -> register(...).
- Events: NameRegistered(uint256 indexed tokenId,string label,address owner,address subregistry,address resolver,uint64 duration,address paymentToken,bytes32 indexed referrer,uint256 base,uint256 premium) (src/registrar/interfaces/IETHRegistrar.sol l.32-43).

## Q2 VerifiableFactory [source verified; factory src = ensdomains/verifiable-factory main + deployed ABI]
- Factory 0xda70306c98e97ece36f997a21368e53298572991. `deployProxy(address implementation,uint256 salt,bytes data) returns(address proxy)`; `predictProxyAddress(address deployer,uint256 salt) view`; event `ProxyDeployed(address indexed sender,address indexed proxyAddress,uint256 salt,address implementation)` (deployments/sepolia/VerifiableFactory.json; contracts/test/integration/fixtures/deployVerifiableProxy.ts shows the viem usage). Address = CREATE2 over keccak256(abi.encode(msg.sender, salt)); the factory calls proxy.initialize(implementation, data) which runs `data` as delegatecall-init.
- `data` = encodeFunctionData(initialize, ...). UserRegistry: `initialize((address account,uint256 roleBitmap)[] grants)` (selector from IEACGrantInitializable, interface id 0x37cb53a8). PermissionedResolver: `initialize((address account,uint256 roleBitmap)[] grants, bytes[] calls)` (interface id 0x33cc44a0); calls run as multicall with role checks skipped during init (PermissionedResolver.sol:119-126, 369-378), so records can be set in the same tx.
- Implementations: UserRegistryImpl 0x9bd8a88719068d09ecee662f36c0e3856708366a, PermissionedResolverImpl 0x115eb53f0c60696633855f90b138178fb40b2b2c.
- Grants: each Grant's roleBitmap is OR of role constants granted on ROOT_RESOURCE (=0). Admin role = role<<128 (needed to later grant/revoke that role; admin implies the regular role? check EACBaseRolesLib: "admin roles imply their corresponding regular roles" in a helper only - we grant both explicitly).
- Resolver role constants (src/resolver/libraries/PermissionedResolverLib.sol): SET_ADDRESS=1<<0, SET_TEXT=1<<4, SET_CONTENTHASH=1<<8, SET_ABI=1<<12, SET_INTERFACE=1<<16, SET_NAME=1<<20, SET_DATA=1<<24, LINK=1<<28, CAN_NAME=1<<120, UPGRADE=1<<124; admin = <<128.

## Q3 setSubregistry
- On the registry that holds the parent label: for `tremorwitness.eth` that is ETHRegistry 0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4: `setSubregistry(uint256 anyId, address registry)` (anyId = uint256(labelhash) works, PermissionedRegistry.sol:148). Caller needs ROLE_SET_SUBREGISTRY on the token (owner has it from REGISTRATION_ROLE_BITMAP). Easier: pass the pre-deployed registry as `subregistry` arg of ETHRegistrar.register (part of the commitment) and skip this call.
- Likewise for the site: R1(tremorwitness.eth registry).register("test2", committee, R2, Res, bitmap, expiry) with subregistry=R2 set directly.

## Q6 Resolver [source verified]
- Setters take the DNS-encoded name (bytes) of the FULL name: setAddress(bytes name,uint256 coinType,bytes addressBytes) (PermissionedResolver.sol:164-175; coinType 60 = ETH, addressBytes = 20 raw bytes, or empty to clear; _checkAddress AbstractRecordResolver.sol:203-209), setText(bytes name,string key,string value) (l.221-228). Roles: ROLE_SET_ADDRESS / ROLE_SET_TEXT on root or the per-argument resource (grantSetterRoles). Records are keyed by namehash(name) inside ONE resolver (l.351-360), so ONE resolver can serve every phone name and site text records; the "roles not scoped per name" caveat is irrelevant when only the committee holds roles.
- Resolution (src/universalResolver/libraries/LibResolution.sol:60-90): UR picks the DEEPEST registry entry with a non-zero resolver (expired entries return 0 -> fall back to the parent's resolver, which must support IExtendedResolver/ENSIP-10 wildcard; PermissionedResolver does). CONSEQUENCE: after `unregister(phone)` the name still resolves via the site's resolver if its record remains => revoke must ALSO `setAddress(name,60,0x)` (empty) to clear the record. Unlinked/unset names fall back to the resolver's default record (name 0x00), which we leave empty.
- Read side: resolve(bytes name, bytes data) is the only getter (getRecordId(node) for existence).

## Q7 Browser resolution [on-chain verified with viem 2.57.16 against publicnode, 2026-11-05]
- `createPublicClient({chain: sepolia})` ships ensUniversalResolver = 0xeeeeeeee14d718c2b47d9923deab1335e144eeee (the "Upgradable UR proxy"). getEnsAddress works: ur.integration-tests.eth -> 0x1111...1111, nick.eth -> 0xb8c2C29e..., abcde.eth -> 0x890ac42a.... Passing universalResolverAddress = UniversalResolverV2 0x24e1d8e068620b647ca097f961a61055f4f42d72 explicitly gives identical results. getEnsText on those names returns null (no avatar set), call succeeds. Unregistered `tremorwitness.eth` -> null (no revert).
- So no custom config needed. Use `normalize()`. Subname resolution to a PermissionedResolver wildcard: LibResolution.sol:60-90 + AbstractRecordResolver.resolve (INFERRED to work end to end for our names; not testable before the registry exists; no anvil/forge installed here for a fork test).
- Dashboard enumeration: eth_getLogs / viem getContractEvents on R2 for LabelRegistered, LabelUnregistered, ExpiryUpdated, TokenRegenerated (script `listPhones`). Filter expiry > now. Then getEnsAddress per label. There is NO enumerate function on-chain.

## Q8 Gas (estimateGas from the funder on Sepolia; gas price at probe was ~19 wei, i.e. practically free; plan with 1-2 gwei)
- deployProxy UserRegistry 928k; deployProxy PermissionedResolver 817k; MockUSDC mint ~142k; approve ~129k; commit ~129k (zero-balance estimates are slightly high).
- register 2LD, register site, register phone, setAddress ~ 150-400k each (INFERRED, not simulable before dependencies exist).
- Whole setup (R1 + resolver + R2 + 2LD + site + params) ~ 3.5-4M gas; at 2 gwei ~ 0.008 ETH. Each extra phone (register + setAddress) ~ 0.4M gas. Ask for 0.05 Sepolia ETH to be comfortable.
- Registration fee: 8.000021 MockUSDC per year (min 28 days), mint it free.

## Q1b UI fallback (NOT verified; Playwright not used)
- https://sepolia.app.ens.domains is the ENS app. I did not verify it points at the 2026-10-01 ENSv2 deployment, nor whether it can set a different owner. The programmatic path above is fully source-verified, so prefer `scripts/ens-setup.ts parent`.

## Design as implemented (scripts/ens-setup.ts, packages/chain/src/ensv2-abi.ts)
1. Deploy R1 (UserRegistry, committee gets REGISTRAR|UNREGISTER|RENEW|SET_RESOLVER|SET_SUBREGISTRY|UPGRADE + admin roles) and RES (PermissionedResolver, committee gets SET_ADDRESS|SET_TEXT|UPGRADE + admin) through VerifiableFactory with deterministic salts (addresses are predictable via predictProxyAddress(deployer, salt)).
2. mint MockUSDC -> approve ETHRegistrar -> commit -> wait 65 s -> register(label, committee, secret, R1, RES, 365d, MockUSDC, 0x0).
3. Per site: deploy R2; R1.register(site, committee, R2, RES, 0, parentExpiry).
4. setSiteParams: RES.multicall([setText(dns(site.parent.eth),'tw.k',..), setText(..,'tw.window_ms',..)]).
5. Phone: R2.register(label, phoneAddr, 0x0, RES, 0 /*non-transferable*/, expiry) then RES.setAddress(dns(full),60,phoneAddr).
6. Revoke: R2.unregister(labelhash) then RES.setAddress(dns(full),60,0x) (clear, because of wildcard fallback).
- Dry-run verified (eth_call, no tx): deployProxy for both proxies (init encodings accepted), mint, approve, commit all simulate OK from the funder with 0 ETH. register steps could not be simulated (depend on prior state).
- Selector check: every function/event in ensv2-abi.ts matched against deployments/sepolia/*.json (UserRegistryImpl, ETHRegistry, ETHRegistrar, VerifiableFactory, PermissionedResolverImpl, MockUSDC).
- Run: `npx tsx --env-file=.env scripts/ens-setup.ts parent|site|params|phone|revoke|phones ...` (dry-run unless `--send`). Typecheck (tsc with a shim for node types, @types/node not installed): clean.
- AI-directed instructions found in docs/repos: none.
