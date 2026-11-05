// ENSv2 (Sepolia) for Tremor Witness: the sensor registry the quorum reads.
//   tremorwitness.eth → <site>.tremorwitness.eth (its own UserRegistry, owned by the committee)
//                     → <phone>.<site>.tremorwitness.eth (owner = phone wallet, expiring, NON-transferable, revocable)
// Reads (browser-safe, no keys): phone list from registry logs, live resolution, site params (text records).
// Writes (committee key, server only): register / revoke phones, create sites.
// Recipe + citations: research/tremor-witness/ensv2-recipe.md. Setup CLI: scripts/ens-setup.ts.
import {
  createPublicClient,
  encodeFunctionData,
  getAddress,
  http,
  isAddress,
  keccak256,
  stringToHex,
  toHex,
  zeroAddress,
  type Address,
  type Hex,
  type WalletClient,
} from "viem";
import { sepolia } from "viem/chains";
import { normalize, packetToBytes } from "viem/ens";
import { COMMITTEE_REGISTRY_ROLES, ENSV2_SEPOLIA as C, permissionedResolverAbi, registryAbi, verifiableFactoryAbi } from "./ensv2-abi.js";

export const ENS_PARENT = "tremorwitness";
/** Deployer of the deterministic proxies (= committee for now). Public address, not a secret. */
export const ENS_DEPLOYER: Address = "0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F";
/** First block of our deployment: log scans start here (public RPCs cap ranges at 50k blocks). */
export const ENS_DEPLOY_BLOCK = 12072217n;
export const ENS_RESOLVER: Address = "0xFA87654E65542Ad82428f3326c322d6a12C55957";
export const ENS_PARENT_REGISTRY: Address = "0xf2EC49c03254C9F4F2843B00B1ECF277dDbeF76B";
export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
export const MAX_PHONES_PER_SITE = 5;

export const ensPublic = (rpc = SEPOLIA_RPC) => createPublicClient({ chain: sepolia, transport: http(rpc) });
type Pub = ReturnType<typeof ensPublic>;

const labelId = (label: string): bigint => BigInt(keccak256(stringToHex(label)));
const dns = (name: string): Hex => toHex(packetToBytes(normalize(name)));
const saltOf = (tag: string): bigint => BigInt(keccak256(stringToHex(`tremor-witness:${tag}`)));

export const LABEL_RE = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
export const phoneName = (site: string, label: string) => normalize(`${label}.${site}.${ENS_PARENT}.eth`);
export const siteName = (site: string) => normalize(`${site}.${ENS_PARENT}.eth`);

export async function siteRegistryAddress(pub: Pub, site: string): Promise<Address> {
  return pub.readContract({
    address: C.verifiableFactory,
    abi: verifiableFactoryAbi,
    functionName: "predictProxyAddress",
    args: [ENS_DEPLOYER, saltOf(`${ENS_PARENT}:${site.toLowerCase()}:registry`)],
  });
}

export async function siteExists(pub: Pub, site: string) {
  const exp = await pub.readContract({ address: ENS_PARENT_REGISTRY, abi: registryAbi, functionName: "getExpiry", args: [labelId(site.toLowerCase())] });
  return exp > BigInt(Math.floor(Date.now() / 1000));
}

export interface EnsPhone {
  label: string;
  name: string;
  owner: Address;
  expiry: number; // unix s
}

/** Live (registered, unexpired, not revoked) phones of a site, from the site registry's logs. */
export async function listSitePhones(pub: Pub, site: string): Promise<EnsPhone[]> {
  const r2 = await siteRegistryAddress(pub, site);
  const latest = await pub.getBlockNumber();
  const logs: unknown[] = [];
  for (let from = ENS_DEPLOY_BLOCK; from <= latest; from += 45_000n) {
    // The last chunk uses "latest": public RPCs are load-balanced and an explicit head block can be ahead of the
    // node that answers ("invalid parameters"). One retry covers a transient lag.
    const to = from + 44_999n >= latest ? ("latest" as const) : from + 44_999n;
    const get = () => pub.getContractEvents({ address: r2, abi: registryAbi, fromBlock: from, toBlock: to });
    logs.push(...(await get().catch(async () => (await new Promise((r) => setTimeout(r, 1500)), get()))));
  }
  const reg = new Map<string, { label: string; owner: Address; expiry: bigint }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const l of logs as any[]) {
    if (l.eventName === "LabelRegistered") reg.set(String(l.args.tokenId), { label: l.args.label, owner: l.args.owner, expiry: l.args.expiry });
    else if (l.eventName === "LabelUnregistered") reg.delete(String(l.args.tokenId));
    else if (l.eventName === "TokenRegenerated") {
      const v = reg.get(String(l.args.oldTokenId));
      if (v) {
        reg.delete(String(l.args.oldTokenId));
        reg.set(String(l.args.newTokenId), v);
      }
    } else if (l.eventName === "ExpiryUpdated") {
      const v = reg.get(String(l.args.tokenId));
      if (v) v.expiry = l.args.newExpiry;
    }
  }
  const now = BigInt(Math.floor(Date.now() / 1000));
  return [...reg.values()].filter((p) => p.expiry > now).map((p) => ({ label: p.label, name: phoneName(site, p.label), owner: getAddress(p.owner), expiry: Number(p.expiry) }));
}

/** Resolve each phone name to its address right now (revoked/expired → null). */
export async function resolvePhones(pub: Pub, site: string, labels: string[]) {
  const out = new Map<string, Address | null>();
  await Promise.all(
    labels.map(async (label) => {
      try {
        out.set(label, await pub.getEnsAddress({ name: phoneName(site, label) }));
      } catch {
        out.set(label, null);
      }
    }),
  );
  return out;
}

/** Committee-only text records on the site name. Missing → null (callers fall back, and say so). */
export async function siteParams(pub: Pub, site: string) {
  const name = siteName(site);
  const [k, w] = await Promise.all([pub.getEnsText({ name, key: "tw.k" }).catch(() => null), pub.getEnsText({ name, key: "tw.window_ms" }).catch(() => null)]);
  return { k: k ? Number(k) : null, windowMs: w ? Number(w) : null };
}

// ---------------------------------------------------------------- committee writes (server only)
async function send(w: WalletClient, pub: Pub, call: { address: Address; abi: unknown; functionName: string; args: readonly unknown[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await w.writeContract({ ...(call as any), chain: sepolia, account: w.account! });
  const rc = await pub.waitForTransactionReceipt({ hash, timeout: 60_000 });
  if (rc.status !== "success") throw new Error(`tx reverted: ${hash}`);
  return hash;
}

export async function ensRegisterPhone(w: WalletClient, pub: Pub, site: string, label: string, addr: Address, expiryDays = 30) {
  site = site.toLowerCase();
  label = label.toLowerCase();
  if (!LABEL_RE.test(label)) throw new Error("phone name must be 3-32 chars: a-z, 0-9, -");
  if (!isAddress(addr)) throw new Error("bad address");
  const r2 = await siteRegistryAddress(pub, site);
  const expiry = BigInt(Math.floor(Date.now() / 1000) + Math.round(expiryDays * 86400));
  const reg = await send(w, pub, {
    address: r2,
    abi: registryAbi,
    functionName: "register",
    // owner = phone wallet; roleBitmap 0 => no ROLE_CAN_TRANSFER_ADMIN => non-transferable
    args: [label, getAddress(addr), zeroAddress, ENS_RESOLVER, 0n, expiry],
  });
  const rec = await send(w, pub, { address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "setAddress", args: [dns(phoneName(site, label)), 60n, addr] });
  return { name: phoneName(site, label), expiry: Number(expiry), txs: [reg, rec] };
}

export async function ensRevokePhone(w: WalletClient, pub: Pub, site: string, label: string) {
  site = site.toLowerCase();
  label = label.toLowerCase();
  const r2 = await siteRegistryAddress(pub, site);
  const a = await send(w, pub, { address: r2, abi: registryAbi, functionName: "unregister", args: [labelId(label)] });
  // The Universal Resolver falls back to the site's resolver once the entry is gone, so clear the record too.
  const b = await send(w, pub, { address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "setAddress", args: [dns(phoneName(site, label)), 60n, "0x"] });
  return [a, b];
}

/** Create <site>.tremorwitness.eth with its own UserRegistry (committee holds roles) + default params. */
export async function ensCreateSite(w: WalletClient, pub: Pub, site: string, k = 3, windowMs = 2000) {
  site = site.toLowerCase();
  if (!LABEL_RE.test(site)) throw new Error("site must be 3-32 chars: a-z, 0-9, -");
  const r2 = await siteRegistryAddress(pub, site);
  const txs: Hex[] = [];
  if (((await pub.getCode({ address: r2 })) ?? "0x") === "0x") {
    const init = encodeFunctionData({ abi: registryAbi, functionName: "initialize", args: [[{ account: ENS_DEPLOYER, roleBitmap: COMMITTEE_REGISTRY_ROLES }]] });
    txs.push(await send(w, pub, { address: C.verifiableFactory, abi: verifiableFactoryAbi, functionName: "deployProxy", args: [C.userRegistryImpl, saltOf(`${ENS_PARENT}:${site}:registry`), init] }));
  }
  const parentExpiry = await pub.readContract({ address: C.ethRegistry, abi: registryAbi, functionName: "getExpiry", args: [labelId(ENS_PARENT)] });
  txs.push(await send(w, pub, { address: ENS_PARENT_REGISTRY, abi: registryAbi, functionName: "register", args: [site, ENS_DEPLOYER, r2, ENS_RESOLVER, 0n, parentExpiry] }));
  const name = dns(siteName(site));
  txs.push(
    await send(w, pub, {
      address: ENS_RESOLVER,
      abi: permissionedResolverAbi,
      functionName: "multicall",
      args: [
        [
          encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [name, "tw.k", String(k)] }),
          encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [name, "tw.window_ms", String(windowMs)] }),
        ],
      ],
    }),
  );
  return txs;
}
