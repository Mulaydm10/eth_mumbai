// ENSv2 (Sepolia) setup for Tremor Witness: parent .eth name -> per-site UserRegistry -> phone subnames.
// Recipe + sources: research/tremor-witness/ensv2-recipe.md
//
// DRY-RUN BY DEFAULT: without --send nothing is broadcast; every step is printed and (where possible) eth_call-simulated.
//
// Usage (from repo root, key is read from .env, never printed):
//   npx tsx --env-file=.env scripts/ens-setup.ts parent  [parentLabel=tremorwitness]            [--send]
//   npx tsx --env-file=.env scripts/ens-setup.ts site    <site> [parentLabel]                     [--send]
//   npx tsx --env-file=.env scripts/ens-setup.ts params  <site> <k> <windowMs> [parentLabel]      [--send]
//   npx tsx --env-file=.env scripts/ens-setup.ts phone   <site> <label> <0xaddr> [days=30]        [--send]
//   npx tsx --env-file=.env scripts/ens-setup.ts revoke  <site> <label>                           [--send]
//   npx tsx --env-file=.env scripts/ens-setup.ts phones  <site> [parentLabel]    (read-only: lists phones from logs)
//
// Hierarchy (one resolver for the whole tree; only the committee holds resolver roles, so the
// "resolver roles are not scoped per name" caveat does not matter):
//   ETHRegistry[ tremorwitness ] -> subregistry R1 (UserRegistry), resolver RES (PermissionedResolver)
//   R1[ <site> ]                 -> subregistry R2 (UserRegistry), resolver RES
//   R2[ <phone> ]                -> no subregistry, resolver RES, owner = phone wallet, roleBitmap 0 (non-transferable)
import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  http,
  isAddress,
  keccak256,
  stringToHex,
  toHex,
  zeroAddress,
  zeroHash,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { normalize, packetToBytes } from "viem/ens";
import {
  COMMITTEE_REGISTRY_ROLES,
  COMMITTEE_RESOLVER_ROLES,
  ENSV2_SEPOLIA as C,
  ethRegistrarAbi,
  mockErc20Abi,
  permissionedResolverAbi,
  registryAbi,
  verifiableFactoryAbi,
} from "../packages/chain/src/ensv2-abi";

const RPC = process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";
const SEND = process.argv.includes("--send");
const PARENT_DEFAULT = process.env.TW_ENS_PARENT ?? "tremorwitness";
const YEAR = 365 * 86400;

const pub = createPublicClient({ chain: sepolia, transport: http(RPC) });

function account() {
  const k = process.env.FUNDER_PRIVATE_KEY;
  if (!k || !/^0x[0-9a-fA-F]{64}$/.test(k)) throw new Error("FUNDER_PRIVATE_KEY missing/invalid in env (run with --env-file=.env)");
  return privateKeyToAccount(k as Hex);
}
const wallet = () => createWalletClient({ account: account(), chain: sepolia, transport: http(RPC) });
/** The committee = the funder wallet for now (swap for a Safe by setting COMMITTEE_ADDRESS before running `parent`/`site`). */
const committee = (): Address => getAddress(process.env.COMMITTEE_ADDRESS ?? account().address);

const labelId = (label: string): bigint => BigInt(keccak256(stringToHex(label)));
const dns = (name: string): Hex => toHex(packetToBytes(normalize(name)));
const fullName = (parts: string[]) => normalize(parts.join(".") + ".eth");
const saltOf = (tag: string): bigint => BigInt(keccak256(stringToHex(`tremor-witness:${tag}`)));

// ---------------------------------------------------------------- tx helper (dry-run aware)
async function hasCode(a: Address) {
  return ((await pub.getCode({ address: a })) ?? "0x") !== "0x";
}
type Call = { address: Address; abi: any; functionName: string; args: readonly unknown[] };
async function tx(step: string, call: Call): Promise<Hex | null> {
  const acc = account();
  console.log(`\n[${step}] ${call.functionName} @ ${call.address}`);
  if (!SEND) {
    if (!(await hasCode(call.address))) return console.log("  dry-run: target has no code yet, simulation skipped"), null;
    try {
      await pub.simulateContract({ ...(call as any), account: acc });
      console.log("  dry-run: eth_call simulation OK");
    } catch (e: any) {
      console.log("  dry-run: simulation reverted (may be expected, depends on earlier steps):", (e.shortMessage ?? e.message).split("\n")[0]);
    }
    return null;
  }
  const hash = await wallet().writeContract(call as any);
  console.log("  sent", hash);
  const rc = await pub.waitForTransactionReceipt({ hash });
  if (rc.status !== "success") throw new Error(`tx reverted: ${hash}`);
  console.log(`  mined in block ${rc.blockNumber}, gas ${rc.gasUsed}`);
  return hash;
}

// ---------------------------------------------------------------- deterministic proxies via VerifiableFactory
async function proxyAddress(tag: string): Promise<Address> {
  return pub.readContract({
    address: C.verifiableFactory,
    abi: verifiableFactoryAbi,
    functionName: "predictProxyAddress",
    args: [account().address, saltOf(tag)],
  });
}
async function ensureProxy(tag: string, impl: Address, initData: Hex): Promise<Address> {
  const addr = await proxyAddress(tag);
  if (await hasCode(addr)) {
    console.log(`proxy "${tag}" already deployed at ${addr}`);
    return addr;
  }
  console.log(`proxy "${tag}" will be at ${addr}`);
  await tx(`deploy ${tag}`, {
    address: C.verifiableFactory,
    abi: verifiableFactoryAbi,
    functionName: "deployProxy",
    args: [impl, saltOf(tag), initData],
  });
  return addr;
}
const registryInit = (): Hex =>
  encodeFunctionData({
    abi: registryAbi,
    functionName: "initialize",
    args: [[{ account: committee(), roleBitmap: COMMITTEE_REGISTRY_ROLES }]],
  });
const resolverInit = (): Hex =>
  encodeFunctionData({
    abi: permissionedResolverAbi,
    functionName: "initialize",
    args: [[{ account: committee(), roleBitmap: COMMITTEE_RESOLVER_ROLES }], []],
  });

export const addrs = {
  parentRegistry: (parent: string) => proxyAddress(`${parent}:registry`),
  resolver: (parent: string) => proxyAddress(`${parent}:resolver`),
  siteRegistry: (parent: string, site: string) => proxyAddress(`${parent}:${site}:registry`),
};

// ---------------------------------------------------------------- 1. parent .eth name
export async function setupParent(parent = PARENT_DEFAULT) {
  parent = parent.toLowerCase();
  const me = account().address;
  console.log(`committee ${committee()}  deployer ${me}  Sepolia ETH ${await pub.getBalance({ address: me })} wei`);
  const r1 = await ensureProxy(`${parent}:registry`, C.userRegistryImpl, registryInit());
  const res = await ensureProxy(`${parent}:resolver`, C.permissionedResolverImpl, resolverInit());

  const available = await pub.readContract({ address: C.ethRegistrar, abi: ethRegistrarAbi, functionName: "isAvailable", args: [parent] });
  if (!available) {
    const owner = await pub.readContract({ address: C.ethRegistry, abi: registryAbi, functionName: "getOwner", args: [labelId(parent)] });
    console.log(`${parent}.eth is not available; current owner ${owner}`);
    if (owner.toLowerCase() !== committee().toLowerCase()) throw new Error("name taken by someone else: pick another parent label");
    const sub = await pub.readContract({ address: C.ethRegistry, abi: registryAbi, functionName: "getSubregistry", args: [parent] });
    if (sub.toLowerCase() !== r1.toLowerCase())
      await tx("attach R1", { address: C.ethRegistry, abi: registryAbi, functionName: "setSubregistry", args: [labelId(parent), r1] });
    const rv = await pub.readContract({ address: C.ethRegistry, abi: registryAbi, functionName: "getResolver", args: [parent] });
    if (rv.toLowerCase() !== res.toLowerCase())
      await tx("set parent resolver", { address: C.ethRegistry, abi: registryAbi, functionName: "setResolver", args: [labelId(parent), res] });
    return { r1, res };
  }

  const duration = BigInt(YEAR);
  const [base, premium] = await pub.readContract({ address: C.ethRegistrar, abi: ethRegistrarAbi, functionName: "getRegisterPrice", args: [parent, duration, C.mockUSDC] });
  const price = base + premium;
  console.log(`price for 1 year: ${price} (MockUSDC, 6 decimals) = ${Number(price) / 1e6} USDC`);
  // deterministic secret derived from the private key so an interrupted run can resume the commit
  const secret = keccak256(encodeAbiParameters([{ type: "string" }, { type: "bytes32" }], [`tw-ens-secret:${parent}`, keccak256(process.env.FUNDER_PRIVATE_KEY as Hex)]));
  const regArgs = [parent, committee(), secret, r1, res, duration, C.mockUSDC, zeroHash] as const;
  const commitment = await pub.readContract({
    address: C.ethRegistrar,
    abi: ethRegistrarAbi,
    functionName: "makeCommitment",
    args: [parent, committee(), secret, r1, res, duration, zeroHash],
  });
  const bal = await pub.readContract({ address: C.mockUSDC, abi: mockErc20Abi, functionName: "balanceOf", args: [me] });
  if (bal < price) await tx("mint test USDC (unrestricted)", { address: C.mockUSDC, abi: mockErc20Abi, functionName: "mint", args: [me, price] });
  await tx("approve registrar", { address: C.mockUSDC, abi: mockErc20Abi, functionName: "approve", args: [C.ethRegistrar, price] });
  const at = await pub.readContract({ address: C.ethRegistrar, abi: ethRegistrarAbi, functionName: "commitmentAt", args: [commitment] });
  const nowS = Math.floor(Date.now() / 1000);
  if (at === 0n || nowS - Number(at) > 86400) await tx("commit", { address: C.ethRegistrar, abi: ethRegistrarAbi, functionName: "commit", args: [commitment] });
  if (SEND) {
    console.log("waiting 65 s (MIN_COMMITMENT_AGE = 60 s)...");
    await new Promise((r) => setTimeout(r, 65_000));
  }
  await tx("register " + parent + ".eth", { address: C.ethRegistrar, abi: ethRegistrarAbi, functionName: "register", args: regArgs });
  return { r1, res };
}

// ---------------------------------------------------------------- 2. site subname + its own UserRegistry
export async function setupSite(site: string, parent = PARENT_DEFAULT) {
  site = site.toLowerCase();
  parent = parent.toLowerCase();
  const r1 = await addrs.parentRegistry(parent);
  const res = await addrs.resolver(parent);
  const r2 = await ensureProxy(`${parent}:${site}:registry`, C.userRegistryImpl, registryInit());
  const parentExpiry = await pub.readContract({ address: C.ethRegistry, abi: registryAbi, functionName: "getExpiry", args: [labelId(parent)] });
  const existing = (await hasCode(r1))
    ? await pub.readContract({ address: r1, abi: registryAbi, functionName: "getExpiry", args: [labelId(site)] })
    : 0n;
  if (existing > BigInt(Math.floor(Date.now() / 1000))) console.log(`${site}.${parent}.eth already registered until ${existing}`);
  else
    await tx(`register ${site}.${parent}.eth`, {
      address: r1,
      abi: registryAbi,
      functionName: "register",
      // owner = committee, no extra token roles (committee already holds root roles), expiry = parent's expiry
      args: [site, committee(), r2, res, 0n, parentExpiry === 0n ? BigInt(Math.floor(Date.now() / 1000) + YEAR) : parentExpiry],
    });
  return { r1, r2, res };
}

// ---------------------------------------------------------------- 3. site params (committee-only text records)
export async function setSiteParams(site: string, k: number, windowMs: number, parent = PARENT_DEFAULT) {
  const res = await addrs.resolver(parent.toLowerCase());
  const name = dns(fullName([site.toLowerCase(), parent.toLowerCase()]));
  const calls = [
    encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [name, "tw.k", String(k)] }),
    encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [name, "tw.window_ms", String(windowMs)] }),
  ];
  return tx(`set tw.k=${k}, tw.window_ms=${windowMs} on ${site}.${parent}.eth`, {
    address: res,
    abi: permissionedResolverAbi,
    functionName: "multicall",
    args: [calls],
  });
}

// ---------------------------------------------------------------- 4. phones
export async function registerPhone(site: string, label: string, addr: Address, expiryDays: number, parent = PARENT_DEFAULT) {
  site = site.toLowerCase();
  label = label.toLowerCase();
  parent = parent.toLowerCase();
  if (!isAddress(addr)) throw new Error("bad phone address");
  const r2 = await addrs.siteRegistry(parent, site);
  const res = await addrs.resolver(parent);
  const expiry = BigInt(Math.floor(Date.now() / 1000) + Math.round(expiryDays * 86400));
  await tx(`register ${label}.${site}.${parent}.eth`, {
    address: r2,
    abi: registryAbi,
    functionName: "register",
    // owner = phone wallet; roleBitmap 0 => no ROLE_CAN_TRANSFER_ADMIN => token is non-transferable
    args: [label, getAddress(addr), zeroAddress, res, 0n, expiry],
  });
  await tx(`addr record for ${label}.${site}.${parent}.eth`, {
    address: res,
    abi: permissionedResolverAbi,
    functionName: "setAddress",
    args: [dns(fullName([label, site, parent])), 60n, addr],
  });
}

export async function revokePhone(site: string, label: string, parent = PARENT_DEFAULT) {
  site = site.toLowerCase();
  label = label.toLowerCase();
  parent = parent.toLowerCase();
  const r2 = await addrs.siteRegistry(parent, site);
  const res = await addrs.resolver(parent);
  await tx(`unregister ${label}.${site}.${parent}.eth`, { address: r2, abi: registryAbi, functionName: "unregister", args: [labelId(label)] });
  // The UR falls back to the site's resolver (wildcard) once the entry is gone, so the record must be cleared too.
  await tx(`clear addr record`, {
    address: res,
    abi: permissionedResolverAbi,
    functionName: "setAddress",
    args: [dns(fullName([label, site, parent])), 60n, "0x"],
  });
}

// ---------------------------------------------------------------- 5. read-only: enumerate phones from logs
export async function listPhones(site: string, parent = PARENT_DEFAULT, fromBlock = 0n) {
  const r2 = await addrs.siteRegistry(parent.toLowerCase(), site.toLowerCase());
  const logs = await pub.getContractEvents({ address: r2, abi: registryAbi, fromBlock, toBlock: "latest" });
  const reg = new Map<string, { label: string; owner: Address; expiry: bigint }>();
  for (const l of logs as any[]) {
    if (l.eventName === "LabelRegistered") reg.set(String(l.args.tokenId), { label: l.args.label, owner: l.args.owner, expiry: l.args.expiry });
    else if (l.eventName === "LabelUnregistered") reg.delete(String(l.args.tokenId));
    else if (l.eventName === "TokenRegenerated") {
      const v = reg.get(String(l.args.oldTokenId));
      if (v) (reg.delete(String(l.args.oldTokenId)), reg.set(String(l.args.newTokenId), v));
    } else if (l.eventName === "ExpiryUpdated") {
      const v = reg.get(String(l.args.tokenId));
      if (v) v.expiry = l.args.newExpiry;
    }
  }
  const now = BigInt(Math.floor(Date.now() / 1000));
  return [...reg.values()].filter((p) => p.expiry > now);
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop()!);
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  console.log(SEND ? "*** --send: transactions WILL be broadcast ***" : "(dry run: no transaction is sent; add --send to broadcast)");
  if (cmd === "parent") await setupParent(rest[0]);
  else if (cmd === "site") await setupSite(rest[0]!, rest[1]);
  else if (cmd === "params") await setSiteParams(rest[0]!, Number(rest[1]), Number(rest[2]), rest[3]);
  else if (cmd === "phone") await registerPhone(rest[0]!, rest[1]!, rest[2] as Address, Number(rest[3] ?? 30));
  else if (cmd === "revoke") await revokePhone(rest[0]!, rest[1]!);
  else if (cmd === "phones") console.log(await listPhones(rest[0]!, rest[1]));
  else console.log("commands: parent | site | params | phone | revoke | phones (see header of this file)");
}
