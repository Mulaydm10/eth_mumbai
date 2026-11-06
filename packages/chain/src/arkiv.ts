// Arkiv (Rabdi testnet) schemas, clients and queries shared by the phone app, the dashboard and scripts.
// Docs: research/tremor-witness/sponsors/docs-arkiv.md. Anyone can write with our tag, so readers must
// check $creator (Prototype 2 checks it against ENS sensor names).
import { ExpirationTime, createPublicClient, createWalletClient } from "@arkiv-network/sdk";
import { rabdi } from "@arkiv-network/sdk/chains";
import { and, desc, eq, gt } from "@arkiv-network/sdk/query";
import { bytes, defineSchema, str, u64 } from "@arkiv-network/sdk/schema";
import { http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const APP_TAG = "tremor-witness.v1";

export const TriggerSchema = defineSchema(`${APP_TAG}.trigger`, {
  site: str().indexed(),
  sensor: str().indexed(),
  tMs: u64().indexed(), // wall-clock ms
  ppvUm: u64().indexed(), // peak particle velocity, micrometres per second (mm/s × 1000)
  fDomCHz: u64(), // dominant frequency, centi-Hz
  lowFPct: u64(), // % of energy below 3 Hz
  rateCHz: u64(), // delivered sample rate, centi-Hz
  label: str().indexed(), // "structural" | "handling"
  wave: bytes(), // JSON waveform excerpt {fs, x[], y[], z[]} for offline analysis
  seq: u64().indexed().optional(), // T1: per-phone reading number 1,2,3…; a missing number = deleted or never uploaded
});

export const SensorSchema = defineSchema(`${APP_TAG}.sensor`, {
  site: str().indexed(),
  sensor: str().indexed(),
  startedMs: u64().indexed(),
  rateCHz: u64(),
  api: str(),
  ua: str(),
});

/** A sealed, quorum-confirmed event. Convenience + permanence pointer: readers still recompute from triggers. */
export const EventSchema = defineSchema(`${APP_TAG}.event`, {
  site: str().indexed(),
  eventId: str().indexed(), // keccak256 of the sorted member trigger keys (same event => same id, whoever seals it)
  tMs: u64().indexed(),
  k: u64(),
  nSensors: u64(),
  ppvMinUm: u64(),
  ppvMaxUm: u64(),
  sensors: str(), // comma list (<=128 bytes)
  swarmRef: str().indexed(), // evidence pack on Swarm
  packHash: str(), // keccak256 of the pack JSON, so a re-uploaded copy can be verified
});

export function makeChain(accessKey = "") {
  return rabdi({ accessKey });
}

export function publicClientFor(accessKey = "") {
  return createPublicClient({ chain: makeChain(accessKey), transport: http() });
}

export function walletClientFor(privateKey: Hex, accessKey = "") {
  return createWalletClient({ chain: makeChain(accessKey), transport: http(), account: privateKeyToAccount(privateKey) });
}

export type ArkivWallet = ReturnType<typeof walletClientFor>;
export type ArkivPublic = ReturnType<typeof publicClientFor>;

export interface TriggerInput {
  site: string;
  sensor: string;
  tMs: number;
  ppvMmS: number;
  fDomHz: number;
  lowF: number;
  rateHz: number;
  label: "structural" | "handling";
  wave: { fs: number; x: number[]; y: number[]; z: number[]; [extra: string]: unknown };
  seq?: number;
}

const enc = new TextEncoder();
const dec = new TextDecoder();
const r3 = (v: number) => Math.round(v * 1000) / 1000;

export async function writeTrigger(w: ArkivWallet, t: TriggerInput, days = 30) {
  const wave = enc.encode(JSON.stringify({ ...t.wave, fs: r3(t.wave.fs), x: t.wave.x.map(r3), y: t.wave.y.map(r3), z: t.wave.z.map(r3) }));
  return w.createEntity(
    TriggerSchema,
    {
      site: t.site.slice(0, 64),
      sensor: t.sensor.slice(0, 64),
      tMs: u64(Math.round(t.tMs)),
      ppvUm: u64(Math.max(0, Math.round(t.ppvMmS * 1000))),
      fDomCHz: u64(Math.max(0, Math.round(t.fDomHz * 100))),
      lowFPct: u64(Math.max(0, Math.min(100, Math.round(t.lowF * 100)))),
      rateCHz: u64(Math.max(0, Math.round(t.rateHz * 100))),
      label: t.label,
      wave,
      ...(t.seq ? { seq: u64(t.seq) } : {}),
    },
    // T1: readonly = nobody (not even the phone) can edit a reading after it is written; deletion stays visible via seq gaps.
    { expiration: ExpirationTime.fromDays(days), flags: { readonly: true } },
  );
}

export async function writeSensor(w: ArkivWallet, s: { site: string; sensor: string; startedMs: number; rateHz: number; api: string; ua: string }) {
  return w.createEntity(
    SensorSchema,
    {
      site: s.site.slice(0, 64),
      sensor: s.sensor.slice(0, 64),
      startedMs: u64(Math.round(s.startedMs)),
      rateCHz: u64(Math.round(s.rateHz * 100)),
      api: s.api.slice(0, 40),
      ua: s.ua.slice(0, 120),
    },
    { expiration: ExpirationTime.fromDays(7) },
  );
}

export interface TriggerRow {
  key: string;
  creator: string;
  site: string;
  sensor: string;
  tMs: number;
  ppvMmS: number;
  fDomHz: number;
  lowF: number;
  rateHz: number;
  label: "structural" | "handling";
  wave?: { fs: number; x: number[]; y: number[]; z: number[] };
  createdAtBlock?: number; // Arkiv block that recorded it (the phone cannot choose this)
  createdAtMs?: number; // that block's wall time, from arkiv_getBlockTiming (± one block, 2 s)
  seq?: number;
  readonly?: boolean; // created with the readonly flag (edit-proof)
}

const num = (v: { value: unknown } | undefined) => Number((v?.value as bigint | number | undefined) ?? 0);

/** Triggers for a site since `sinceMs`, newest first (up to 100 per page). */
export async function fetchTriggers(p: ArkivPublic, site: string, sinceMs: number, withWave = false): Promise<TriggerRow[]> {
  const res = await p
    .select({ $key: true, $creator: true, $createdAt: true, $creationFlags: true, seq: true, site: true, sensor: true, tMs: true, ppvUm: true, fDomCHz: true, lowFPct: true, rateCHz: true, label: true, ...(withWave ? { wave: true } : {}) })
    .from(TriggerSchema)
    .where(and(eq("site", site), gt("tMs", u64(Math.max(0, Math.floor(sinceMs))))))
    .orderBy(desc("tMs"))
    .limit(100)
    .fetch();
  const timing = await p.getBlockTiming().catch(() => null);
  const blockToMs = (b: number) => (timing ? (timing.currentBlockTime - (Number(timing.currentBlock) - b) * timing.blockDuration) * 1000 : undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.entities.map((e: any) => {
    let wave: TriggerRow["wave"];
    if (withWave && e.wave?.value) {
      try {
        const v = e.wave.value;
        const b = typeof v === "string" ? Uint8Array.from(v.replace(/^0x/, "").match(/../g)!.map((h: string) => parseInt(h, 16))) : (v as Uint8Array);
        wave = JSON.parse(dec.decode(b));
      } catch {
        wave = undefined;
      }
    }
    return {
      key: String(e.$key),
      creator: String(e.$creator),
      site: String(e.site.value),
      sensor: String(e.sensor.value),
      tMs: num(e.tMs),
      ppvMmS: num(e.ppvUm) / 1000,
      fDomHz: num(e.fDomCHz) / 100,
      lowF: num(e.lowFPct) / 100,
      rateHz: num(e.rateCHz) / 100,
      label: String(e.label.value) === "handling" ? "handling" : "structural",
      wave,
      createdAtBlock: e.$createdAt !== undefined ? Number(e.$createdAt) : undefined,
      createdAtMs: e.$createdAt !== undefined ? blockToMs(Number(e.$createdAt)) : undefined,
      seq: e.seq?.value !== undefined ? Number(e.seq.value) : undefined,
      readonly: typeof e.$creationFlags === "object" ? Boolean(e.$creationFlags?.readonly) : e.$creationFlags !== undefined ? (Number(e.$creationFlags) & 1) === 1 : undefined,
    } satisfies TriggerRow;
  });
}

export interface SensorRow {
  key: string;
  creator: string;
  sensor: string;
  startedMs: number;
  rateHz: number;
  api: string;
  ua: string;
}

export async function fetchSensors(p: ArkivPublic, site: string, sinceMs: number): Promise<SensorRow[]> {
  const res = await p
    .select({ $key: true, $creator: true, sensor: true, startedMs: true, rateCHz: true, api: true, ua: true })
    .from(SensorSchema)
    .where(and(eq("site", site), gt("startedMs", u64(Math.max(0, Math.floor(sinceMs))))))
    .orderBy(desc("startedMs"))
    .limit(100)
    .fetch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.entities.map((e: any) => ({
    key: String(e.$key),
    creator: String(e.$creator),
    sensor: String(e.sensor.value),
    startedMs: num(e.startedMs),
    rateHz: num(e.rateCHz) / 100,
    api: String(e.api.value),
    ua: String(e.ua.value),
  }));
}

export interface EventInput {
  site: string;
  eventId: string;
  tMs: number;
  k: number;
  sensors: string[];
  ppvMinMmS: number;
  ppvMaxMmS: number;
  swarmRef: string;
  packHash: string;
}

export async function writeEvent(w: ArkivWallet, e: EventInput, days = 180) {
  return w.createEntity(
    EventSchema,
    {
      site: e.site.slice(0, 64),
      eventId: e.eventId,
      tMs: u64(Math.round(e.tMs)),
      k: u64(e.k),
      nSensors: u64(e.sensors.length),
      ppvMinUm: u64(Math.round(e.ppvMinMmS * 1000)),
      ppvMaxUm: u64(Math.round(e.ppvMaxMmS * 1000)),
      sensors: e.sensors.join(",").slice(0, 128),
      swarmRef: e.swarmRef,
      packHash: e.packHash,
    },
    // T1 + T2a: sealed events are edit-proof AND anyone (not only the sealer) may extend their life on Arkiv.
    { expiration: ExpirationTime.fromDays(days), flags: { readonly: true, permissionlessExtension: true } },
  );
}

export interface EventRow extends EventInput {
  key: string;
  creator: string;
  expiresAtMs?: number; // T2a: when this record leaves Arkiv unless someone extends it
  extendable?: boolean; // created with permissionlessExtension (anyone may extend)
}

export async function fetchEvents(p: ArkivPublic, site: string, sinceMs: number): Promise<EventRow[]> {
  const res = await p
    .select({ $key: true, $creator: true, $expiresAt: true, $creationFlags: true, site: true, eventId: true, tMs: true, k: true, sensors: true, ppvMinUm: true, ppvMaxUm: true, swarmRef: true, packHash: true })
    .from(EventSchema)
    .where(and(eq("site", site), gt("tMs", u64(Math.max(0, Math.floor(sinceMs))))))
    .orderBy(desc("tMs"))
    .limit(100)
    .fetch();
  const timing = await p.getBlockTiming().catch(() => null);
  const blockToMs = (b: number) => (timing ? (timing.currentBlockTime - (Number(timing.currentBlock) - b) * timing.blockDuration) * 1000 : undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.entities.map((e: any) => ({
    key: String(e.$key),
    creator: String(e.$creator),
    expiresAtMs: e.$expiresAt !== undefined ? blockToMs(Number(e.$expiresAt)) : undefined,
    extendable: typeof e.$creationFlags === "object" ? Boolean(e.$creationFlags?.permissionlessExtension) : e.$creationFlags !== undefined ? (Number(e.$creationFlags) & 2) === 2 : undefined,
    site: String(e.site.value),
    eventId: String(e.eventId.value),
    tMs: num(e.tMs),
    k: num(e.k),
    sensors: String(e.sensors.value).split(",").filter(Boolean),
    ppvMinMmS: num(e.ppvMinUm) / 1000,
    ppvMaxMmS: num(e.ppvMaxUm) / 1000,
    swarmRef: String(e.swarmRef.value),
    packHash: String(e.packHash.value),
  }));
}

/** A phone heard the sound-sync chirp at tMs (its own clock). Anchors from several phones align their clocks offline. */
export const SyncSchema = defineSchema(`${APP_TAG}.sync`, {
  site: str().indexed(),
  sensor: str().indexed(),
  tMs: u64().indexed(),
  method: str(), // "sound"
  chirp: u64().optional(), // v2: which of the 6 tone orders (the chirp's ID)
  role: str().optional(), // v2: "emit" (this phone played it) | "hear" (this phone heard it)
});

export async function writeSync(w: ArkivWallet, a: { site: string; sensor: string; tMs: number; method: string; chirp?: number; role?: "emit" | "hear" }) {
  return w.createEntity(
    SyncSchema,
    {
      site: a.site.slice(0, 64),
      sensor: a.sensor.slice(0, 64),
      tMs: u64(Math.round(a.tMs)),
      method: a.method.slice(0, 16),
      ...(a.chirp !== undefined ? { chirp: u64(a.chirp) } : {}),
      ...(a.role ? { role: a.role } : {}),
    },
    { expiration: ExpirationTime.fromDays(30), flags: { readonly: true } },
  );
}

export async function fetchSyncs(p: ArkivPublic, site: string, sinceMs: number) {
  const res = await p
    .select({ $key: true, $creator: true, sensor: true, tMs: true, method: true, chirp: true, role: true })
    .from(SyncSchema)
    .where(and(eq("site", site), gt("tMs", u64(Math.max(0, Math.floor(sinceMs))))))
    .orderBy(desc("tMs"))
    .limit(100)
    .fetch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.entities.map((e: any) => ({
    key: String(e.$key),
    creator: String(e.$creator),
    sensor: String(e.sensor.value),
    tMs: num(e.tMs),
    method: String(e.method.value),
    chirp: e.chirp?.value !== undefined ? Number(e.chirp.value) : undefined,
    role: e.role?.value === "emit" ? ("emit" as const) : e.role?.value === "hear" ? ("hear" as const) : undefined,
  }));
}

/** T2a: anyone can keep a sealed event alive on Arkiv (it was created with permissionlessExtension). */
export async function extendEvent(w: ArkivWallet, entityKey: string, days = 180) {
  return w.extendEntity({ entityKey: entityKey as `0x${string}`, expiration: ExpirationTime.fromDays(days) });
}
