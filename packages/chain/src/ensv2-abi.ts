// ENSv2 (Sepolia) ABIs, role constants and addresses for Tremor Witness.
// Every signature was copied from ensdomains/contracts-v2 @ 07e55a056f5b6a9c90119f501bdd05714e67dddd
// (contracts/src/** and contracts/deployments/sepolia/*.json) and the selectors re-checked against those artifacts.
// Notes: see research/tremor-witness/ensv2-recipe.md
import { parseAbi } from "viem";

/** contracts-v2 commit that the Sepolia deployment of 2026-10-01 is pinned to (contracts/docs/addresses/sepolia.md). */
export const ENSV2_SEPOLIA_COMMIT = "07e55a056f5b6a9c90119f501bdd05714e67dddd";

export const ENSV2_SEPOLIA = {
  chainId: 11155111,
  rootRegistry: "0xb458d6a3a77919449d03e7a6903c26827c1ec43f",
  ethRegistry: "0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4",
  ethRegistrar: "0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3",
  rentPriceOracle: "0x8196665d4ca7488b6474a9ec8e7d2719fb42263a",
  verifiableFactory: "0xda70306c98e97ece36f997a21368e53298572991",
  permissionedResolverImpl: "0x115eb53f0c60696633855f90b138178fb40b2b2c",
  userRegistryImpl: "0x9bd8a88719068d09ecee662f36c0e3856708366a",
  universalResolverV2: "0x24e1d8e068620b647ca097f961a61055f4f42d72",
  /** What viem/ENS libraries ship; the same address on mainnet and Sepolia. */
  upgradableUniversalResolverProxy: "0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe",
  mockUSDC: "0x240b0316df57887dbbe58b586508b19e633a14aa",
} as const;

/** EAC root resource (EnhancedAccessControl.sol:54). */
export const ROOT_RESOURCE = 0n;

/** Admin variant of a role: role << 128 (RegistryRolesLib / PermissionedResolverLib). */
export const admin = (role: bigint): bigint => role << 128n;

/** src/registry/libraries/RegistryRolesLib.sol */
export const RegistryRoles = {
  ROLE_REGISTRAR: 1n << 0n,
  ROLE_REGISTER_RESERVED: 1n << 4n,
  ROLE_SET_PARENT: 1n << 8n,
  ROLE_UNREGISTER: 1n << 12n,
  ROLE_RENEW: 1n << 16n,
  ROLE_SET_SUBREGISTRY: 1n << 20n,
  ROLE_SET_RESOLVER: 1n << 24n,
  /** Only the ADMIN form exists: (1 << 28) << 128. A token without it cannot be transferred. */
  ROLE_CAN_TRANSFER_ADMIN: (1n << 28n) << 128n,
  ROLE_WAS_RESERVED: 1n << 32n,
  ROLE_SET_URI: 1n << 36n,
  ROLE_CAN_NAME: 1n << 120n,
  ROLE_UPGRADE: 1n << 124n,
} as const;

/** src/resolver/libraries/PermissionedResolverLib.sol */
export const ResolverRoles = {
  ROLE_SET_ADDRESS: 1n << 0n,
  ROLE_SET_TEXT: 1n << 4n,
  ROLE_SET_CONTENTHASH: 1n << 8n,
  ROLE_SET_ABI: 1n << 12n,
  ROLE_SET_INTERFACE: 1n << 16n,
  ROLE_SET_NAME: 1n << 20n,
  ROLE_SET_DATA: 1n << 24n,
  ROLE_LINK: 1n << 28n,
  ROLE_CAN_NAME: 1n << 120n,
  ROLE_UPGRADE: 1n << 124n,
} as const;

/** Committee bitmap on a UserRegistry root: register, revoke, renew, repoint, upgrade (each with its admin role). */
export const COMMITTEE_REGISTRY_ROLES = [
  RegistryRoles.ROLE_REGISTRAR,
  RegistryRoles.ROLE_UNREGISTER,
  RegistryRoles.ROLE_RENEW,
  RegistryRoles.ROLE_SET_RESOLVER,
  RegistryRoles.ROLE_SET_SUBREGISTRY,
  RegistryRoles.ROLE_UPGRADE,
].reduce((acc, r) => acc | r | admin(r), 0n);

/** Committee bitmap on the PermissionedResolver root: write addr + text records, upgrade (each with its admin role). */
export const COMMITTEE_RESOLVER_ROLES = [
  ResolverRoles.ROLE_SET_ADDRESS,
  ResolverRoles.ROLE_SET_TEXT,
  ResolverRoles.ROLE_UPGRADE,
].reduce((acc, r) => acc | r | admin(r), 0n);

/** ETHRegistrar (src/registrar/ETHRegistrar.sol, interfaces/IETHRegistrar.sol). */
export const ethRegistrarAbi = parseAbi([
  "function makeCommitment(string label, address owner, bytes32 secret, address subregistry, address resolver, uint64 duration, bytes32 referrer) pure returns (bytes32)",
  "function commit(bytes32 commitment)",
  "function register(string label, address owner, bytes32 secret, address subregistry, address resolver, uint64 duration, address paymentToken, bytes32 referrer) returns (uint256 tokenId)",
  "function isAvailable(string label) view returns (bool)",
  "function getRegisterPrice(string label, uint64 duration, address paymentToken) view returns (uint256 base, uint256 premium)",
  "function commitmentAt(bytes32 commitment) view returns (uint64)",
  "function MIN_COMMITMENT_AGE() view returns (uint64)",
  "function MAX_COMMITMENT_AGE() view returns (uint64)",
  "function MIN_REGISTER_DURATION() view returns (uint64)",
  "event NameRegistered(uint256 indexed tokenId, string label, address owner, address subregistry, address resolver, uint64 duration, address paymentToken, bytes32 indexed referrer, uint256 base, uint256 premium)",
]);

/** Mock ERC20 used as the Sepolia payment token (contracts/test/mocks/MockERC20.sol; mint is unrestricted). */
export const mockErc20Abi = parseAbi([
  "function mint(address to, uint256 amount)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
]);

/** VerifiableFactory (deployments/sepolia/VerifiableFactory.json). */
export const verifiableFactoryAbi = parseAbi([
  "function deployProxy(address implementation, uint256 salt, bytes data) returns (address proxy)",
  "function predictProxyAddress(address deployer, uint256 salt) view returns (address proxy)",
  "function verifyContract(address proxy) view returns (address implementation)",
  "event ProxyDeployed(address indexed sender, address indexed proxyAddress, uint256 salt, address implementation)",
]);

/** PermissionedRegistry / UserRegistry (src/registry/PermissionedRegistry.sol, UserRegistry.sol, interfaces/IRegistryEvents.sol). Also valid for ETHRegistry. */
export const registryAbi = parseAbi([
  "struct Grant { address account; uint256 roleBitmap; }",
  "function initialize(Grant[] grants)",
  "function register(string label, address owner, address registry, address resolver, uint256 roleBitmap, uint64 expiry) returns (uint256)",
  "function unregister(uint256 anyId)",
  "function renew(uint256 anyId, uint64 newExpiry)",
  "function setSubregistry(uint256 anyId, address registry)",
  "function setResolver(uint256 anyId, address resolver)",
  "function getExpiry(uint256 anyId) view returns (uint64)",
  "function getOwner(uint256 anyId) view returns (address)",
  "function getTokenId(uint256 anyId) view returns (uint256)",
  "function getStatus(uint256 anyId) view returns (uint8)",
  "function getSubregistry(string label) view returns (address)",
  "function getResolver(string label) view returns (address)",
  "function roles(uint256 anyId, address account) view returns (uint256)",
  "function grantRootRoles(uint256 roleBitmap, address account) returns (bool)",
  "function revokeRootRoles(uint256 roleBitmap, address account) returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)",
  "event RegistryCreated()",
  "event LabelRegistered(uint256 indexed tokenId, bytes32 indexed labelHash, string label, address owner, uint64 expiry, address indexed sender)",
  "event LabelReserved(uint256 indexed tokenId, bytes32 indexed labelHash, string label, uint64 expiry, address indexed sender)",
  "event LabelUnregistered(uint256 indexed tokenId, address indexed sender)",
  "event ExpiryUpdated(uint256 indexed tokenId, uint64 indexed newExpiry, address indexed sender)",
  "event SubregistryUpdated(uint256 indexed tokenId, address indexed subregistry, address indexed sender)",
  "event ResolverUpdated(uint256 indexed tokenId, address indexed resolver, address indexed sender)",
  "event TokenRegenerated(uint256 indexed oldTokenId, uint256 indexed newTokenId)",
  "event TokenResource(uint256 indexed tokenId, uint256 indexed resource)",
]);

/** PermissionedResolver (src/resolver/PermissionedResolver.sol, AbstractRecordResolver.sol). Setters take the DNS-encoded name. */
export const permissionedResolverAbi = parseAbi([
  "struct Grant { address account; uint256 roleBitmap; }",
  "function initialize(Grant[] grants, bytes[] calls)",
  "function setAddress(bytes name, uint256 coinType, bytes addressBytes)",
  "function setText(bytes name, string key, string value)",
  "function multicall(bytes[] calls) returns (bytes[] results)",
  "function resolve(bytes name, bytes data) view returns (bytes)",
  "function getRecordId(bytes32 node) view returns (uint256)",
  "function grantRootRoles(uint256 roleBitmap, address account) returns (bool)",
  "function grantSetterRoles(bytes setter, address account) returns (bool)",
  "function roles(uint256 resource, address account) view returns (uint256)",
  "event Linked(uint256 indexed recordId, bytes32 indexed node, bytes name)",
  "event AddressUpdated(uint256 indexed recordId, uint256 coinType, bytes addressBytes)",
  "event TextUpdated(uint256 indexed recordId, string indexed keyHash, string key, string value)",
]);
