// Disaster Mesh (companion Android app, extension; see extensions/disaster-mesh/BRIEF.md) — Arkiv schemas R2 + R3.
// Each mesh phone writes ONLY its own messages with its own key, so Arkiv `$creator` = the phone's ENS-registered owner.
// The web app does not read these; they are defined here so both sides share one exact on-chain format.
import { ExpirationTime } from "@arkiv-network/sdk";
import { and, desc, eq, gt } from "@arkiv-network/sdk/query";
import { bytes, defineSchema, str, u64 } from "@arkiv-network/sdk/schema";
import { bytesToHex } from "viem";
import { APP_TAG, type ArkivPublic, type ArkivWallet } from "./arkiv.js";

/** R2: a disaster-tier trigger (strong shaking detected by a mesh phone, or a manual Emergency press). */
export const DTriggerSchema = defineSchema(`${APP_TAG}.dtrigger`, {
  site: str().indexed(),
  sensor: str().indexed(), // ENS label, "mesh-…"
  tMs: u64().indexed(), // wall-clock ms (phone clock after its last /api/time or mesh correction)
  ppvUm: u64(), // peak particle velocity, µm/s (0 for manual)
  fDomCHz: u64(), // dominant frequency, centi-Hz (0 for manual)
  kind: str().indexed(), // "auto" | "manual"
  label: str(), // "structural" | "handling" (auto only; "" for manual)
  seq: u64().indexed(), // per-phone message number (gaps = missing uploads)
});

/** R3: a check-in ("I'm safe" / "I need help"). */
export const CheckinSchema = defineSchema(`${APP_TAG}.checkin`, {
  site: str().indexed(),
  sensor: str().indexed(),
  tMs: u64().indexed(),
  status: str().indexed(), // "safe" | "help"
  note: str(), // ≤ 80 chars (str is capped at 128 bytes)
  armMs: u64(), // tMs of the disaster event this answers (0 if none)
  seq: u64().indexed(),
  encLoc: bytes(), // optional, opt-in: flat/floor/last fix ECIES-encrypted to the committee key; empty otherwise
});

export const DTRIGGER_DAYS = 180;
export const CHECKIN_DAYS = 30;

export interface DTriggerInput { site: string; sensor: string; tMs: number; ppvMmS: number; fDomHz: number; kind: "auto" | "manual"; label?: "structural" | "handling"; seq: number }
export interface CheckinInput { site: string; sensor: string; tMs: number; status: "safe" | "help"; note?: string; armMs?: number; seq: number; encLoc?: Uint8Array }

export async function writeDTrigger(w: ArkivWallet, t: DTriggerInput) {
  return w.createEntity(
    DTriggerSchema,
    {
      site: t.site.slice(0, 64),
      sensor: t.sensor.slice(0, 64),
      tMs: u64(Math.round(t.tMs)),
      ppvUm: u64(Math.max(0, Math.round(t.ppvMmS * 1000))),
      fDomCHz: u64(Math.max(0, Math.round(t.fDomHz * 100))),
      kind: t.kind,
      label: t.kind === "auto" ? (t.label ?? "structural") : "",
      seq: u64(t.seq),
    },
    { expiration: ExpirationTime.fromDays(DTRIGGER_DAYS), flags: { readonly: true } },
  );
}

export async function writeCheckin(w: ArkivWallet, c: CheckinInput) {
  const note = new TextEncoder().encode((c.note ?? "").slice(0, 80)).length <= 128 ? (c.note ?? "").slice(0, 80) : "";
  return w.createEntity(
    CheckinSchema,
    { site: c.site.slice(0, 64), sensor: c.sensor.slice(0, 64), tMs: u64(Math.round(c.tMs)), status: c.status, note, armMs: u64(Math.round(c.armMs ?? 0)), seq: u64(c.seq), encLoc: c.encLoc ?? new Uint8Array() },
    { expiration: ExpirationTime.fromDays(CHECKIN_DAYS), flags: { readonly: true } },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const v = (e: any, k: string) => e[k]?.value;

export async function fetchDTriggers(p: ArkivPublic, site: string, sinceMs: number) {
  const res = await p.select({ $key: true, $creator: true, site: true, sensor: true, tMs: true, ppvUm: true, fDomCHz: true, kind: true, label: true, seq: true }).from(DTriggerSchema).where(and(eq("site", site), gt("tMs", u64(Math.max(0, Math.floor(sinceMs)))))).orderBy(desc("tMs")).limit(100).fetch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.entities as any[]).map((e) => ({ key: String(e.$key), creator: String(e.$creator), sensor: String(v(e, "sensor")), tMs: Number(v(e, "tMs")), ppvMmS: Number(v(e, "ppvUm")) / 1000, fDomHz: Number(v(e, "fDomCHz")) / 100, kind: String(v(e, "kind")), label: String(v(e, "label")), seq: Number(v(e, "seq")) }));
}

export async function fetchCheckins(p: ArkivPublic, site: string, sinceMs: number) {
  const res = await p.select({ $key: true, $creator: true, site: true, sensor: true, tMs: true, status: true, note: true, armMs: true, seq: true, encLoc: true }).from(CheckinSchema).where(and(eq("site", site), gt("tMs", u64(Math.max(0, Math.floor(sinceMs)))))).orderBy(desc("tMs")).limit(100).fetch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.entities as any[]).map((e) => {
    const loc = v(e, "encLoc");
    return { key: String(e.$key), creator: String(e.$creator), sensor: String(v(e, "sensor")), tMs: Number(v(e, "tMs")), status: String(v(e, "status")), note: String(v(e, "note")), armMs: Number(v(e, "armMs")), seq: Number(v(e, "seq")), encLoc: typeof loc === "string" ? loc : loc?.length ? bytesToHex(loc as Uint8Array) : "" };
  });
}
