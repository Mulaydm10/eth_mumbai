// ENSv2 (Sepolia) for Tremor Mesh: the sensor registry the quorum reads.
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
import type { RegistrationInterval } from "../../core/src/registry.js";
import { COMMITTEE_REGISTRY_ROLES, ResolverRoles, ENSV2_SEPOLIA as C, permissionedResolverAbi, registryAbi, verifiableFactoryAbi } from "./ensv2-abi.js";

export const ENS_PARENT = "tremorwitness";
/** Deployer of the deterministic proxies (= committee for now). Public address, not a secret. */
export const ENS_DEPLOYER: Address = "0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F";
/** First block of our deployment: log scans start here (public RPCs cap ranges at 50k blocks). */
export const ENS_DEPLOY_BLOCK = 12072217n;
export const ENS_RESOLVER: Address = "0xFA87654E65542Ad82428f3326c322d6a12C55957";
export const ENS_PARENT_REGISTRY: Address = "0xf2EC49c03254C9F4F2843B00B1ECF277dDbeF76B";
export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
export const MAX_PHONES_PER_SITE = 5; // vibration-sensing phones (web app)
/** Disaster Mesh R1: companion-app phones use labels "mesh-…" and have their own cap, so they never take a sensing slot. */
export const MAX_MESH_PHONES_PER_SITE = 15;
/** Per-site limits are committee-set ENS text records (tw.max_phones, tw.max_mesh); these are the hard ceilings. */
export const HARD_MAX_PHONES = 20;
export const HARD_MAX_MESH = 50;
export const isMeshLabel = (label: string) => label.startsWith("mesh-");

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

/** Disaster Mesh R2: disaster-tier quorum (tw.dk, tw.dwindow_ms). Missing → null; the app falls back to tw.k/tw.window_ms. */
export async function siteDisasterParams(pub: Pub, site: string) {
  const name = siteName(site);
  const [k, w] = await Promise.all([pub.getEnsText({ name, key: "tw.dk" }).catch(() => null), pub.getEnsText({ name, key: "tw.dwindow_ms" }).catch(() => null)]);
  return { dk: k ? Number(k) : null, dwindowMs: w ? Number(w) : null };
}

/** Per-site phone limits from ENS (committee-set via the dashboard Setup tab). Missing → defaults 5 / 15. */
export async function siteLimits(pub: Pub, site: string) {
  const name = siteName(site);
  const [p, m] = await Promise.all([pub.getEnsText({ name, key: "tw.max_phones" }).catch(() => null), pub.getEnsText({ name, key: "tw.max_mesh" }).catch(() => null)]);
  const clamp = (v: string | null, d: number, hi: number) => (v && Number.isInteger(Number(v)) ? Math.min(Math.max(Number(v), 0), hi) : d);
  return { maxPhones: clamp(p, MAX_PHONES_PER_SITE, HARD_MAX_PHONES), maxMesh: clamp(m, MAX_MESH_PHONES_PER_SITE, HARD_MAX_MESH), fromEns: { maxPhones: p !== null && p !== "", maxMesh: m !== null && m !== "" } };
}

// ---------------------------------------------------------------- committee writes (server only)

/** Committee: set several text records on the site name in one multicall. */
export async function ensSetSiteText(w: WalletClient, pub: Pub, site: string, records: Record<string, string>) {
  const name = dns(siteName(site));
  const calls = Object.entries(records).map(([k, v]) => encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [name, k, v] }));
  return send(w, pub, { address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "multicall", args: [calls] });
}
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
  // T3: let the phone itself write ONE text key (its reading "head"), scoped by Enhanced Access Control to that key only.
  const setter = encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [dns(phoneName(site, label)), phoneHeadKey(site, label), ""] });
  const grant = await send(w, pub, { address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "grantSetterRoles", args: [setter, getAddress(addr)] });
  return { name: phoneName(site, label), expiry: Number(expiry), txs: [reg, rec, grant] };
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

/**
 * T13: full registration HISTORY of a site's phones as time intervals (registered → unregistered/expired), from the
 * site registry's logs and Sepolia block timestamps. Used for "was this phone registered when it recorded?".
 */
export async function siteRegistrationHistory(pub: Pub, site: string): Promise<RegistrationInterval[]> {
  const r2 = await siteRegistryAddress(pub, site);
  const latest = await pub.getBlockNumber();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logs: any[] = [];
  for (let from = ENS_DEPLOY_BLOCK; from <= latest; from += 45_000n) {
    const to = from + 44_999n >= latest ? ("latest" as const) : from + 44_999n;
    const get = () => pub.getContractEvents({ address: r2, abi: registryAbi, fromBlock: from, toBlock: to });
    logs.push(...(await get().catch(async () => (await new Promise((r) => setTimeout(r, 1500)), get()))));
  }
  const blockMs = new Map<bigint, number>();
  await Promise.all(
    [...new Set(logs.map((l) => l.blockNumber as bigint))].map(async (b) => {
      const blk = await pub.getBlock({ blockNumber: b });
      blockMs.set(b, Number(blk.timestamp) * 1000);
    }),
  );
  const open = new Map<string, RegistrationInterval>();
  const out: RegistrationInterval[] = [];
  for (const l of logs.sort((a, b) => Number(a.blockNumber - b.blockNumber) || a.logIndex - b.logIndex)) {
    if (!l.args) continue; // other registry events (role grants etc.) without decoded args
    const at = blockMs.get(l.blockNumber)!;
    const id = String(l.args.tokenId ?? l.args.oldTokenId ?? "");
    if (l.eventName === "LabelRegistered") {
      const iv = { label: String(l.args.label), owner: getAddress(l.args.owner), fromMs: at, toMs: Number(l.args.expiry) * 1000 };
      open.set(id, iv);
      out.push(iv);
    } else if (l.eventName === "LabelUnregistered") {
      const iv = open.get(id);
      if (iv) {
        iv.toMs = Math.min(iv.toMs, at);
        open.delete(id);
      }
    } else if (l.eventName === "TokenRegenerated") {
      const iv = open.get(String(l.args.oldTokenId));
      if (iv) {
        open.delete(String(l.args.oldTokenId));
        open.set(String(l.args.newTokenId), iv);
      }
    } else if (l.eventName === "ExpiryUpdated") {
      const iv = open.get(id);
      if (iv) iv.toMs = Number(l.args.newExpiry) * 1000;
    }
  }
  return out;
}

// ---------------------------------------------------------------- T3: phone-owned record (its reading "head")
/** The single text key a phone may write (EAC scopes the grant to this key). Unique per site+phone. */
export const phoneHeadKey = (site: string, label: string) => `tw.head.${site.toLowerCase()}.${label.toLowerCase()}`;

export interface PhoneHead {
  seq: number; // highest reading number the phone has produced
  tMs: number; // when it declared it
}

/** Read the head a phone declared on its own ENS record (null if never written). */
export async function readPhoneHead(pub: Pub, site: string, label: string): Promise<PhoneHead | null> {
  try {
    const v = await pub.getEnsText({ name: phoneName(site, label), key: phoneHeadKey(site, label) });
    if (!v) return null;
    const j = JSON.parse(v) as PhoneHead;
    return Number.isFinite(j.seq) ? j : null;
  } catch {
    return null;
  }
}

/** Phone-side: write its own head with its own wallet (needs a little Sepolia ETH; only this key is permitted). */
export async function writePhoneHead(w: WalletClient, pub: Pub, site: string, label: string, head: PhoneHead) {
  // Public RPCs are load-balanced: a just-mined gas drip may not be visible on the node we hit. Wait for it (≤45 s).
  for (let i = 0; i < 15 && (await pub.getBalance({ address: w.account!.address })) === 0n; i++) await new Promise((r) => setTimeout(r, 3000));
  return send(w, pub, {
    address: ENS_RESOLVER,
    abi: permissionedResolverAbi,
    functionName: "setText",
    args: [dns(phoneName(site, label)), phoneHeadKey(site, label), JSON.stringify(head)],
  });
}

/**
 * Make sure a phone may write its head key (phones registered before T3 never got the grant). Idempotent: reads the
 * resolver's role bitmap for resource(key) first and only grants when ROLE_SET_TEXT is missing.
 */
export async function ensureHeadGrant(w: WalletClient, pub: Pub, site: string, label: string, addr: Address) {
  const key = phoneHeadKey(site, label);
  const resource = BigInt(keccak256(stringToHex(key)));
  const roles = (await pub.readContract({ address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "roles", args: [resource, getAddress(addr)] })) as bigint;
  if ((roles & ResolverRoles.ROLE_SET_TEXT) !== 0n) return null;
  const setter = encodeFunctionData({ abi: permissionedResolverAbi, functionName: "setText", args: [dns(phoneName(site, label)), key, ""] });
  return send(w, pub, { address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "grantSetterRoles", args: [setter, getAddress(addr)] });
}
