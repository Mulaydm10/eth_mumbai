// T14: committee-signed, single-use, expiring invites. Every issue and every use is a public Arkiv entity, so anyone
// can audit who was let in, when, and by which signature. Joining a site (ENS registration) requires a valid unused invite.
import { ExpirationTime } from "@arkiv-network/sdk";
import { and, desc, eq } from "@arkiv-network/sdk/query";
import { bytes, defineSchema, str, u64 } from "@arkiv-network/sdk/schema";
import { bytesToHex, hexToBytes, recoverMessageAddress, type Address, type Hex } from "viem";
import { APP_TAG, type ArkivPublic, type ArkivWallet } from "./arkiv.js";

export interface Invite {
  site: string;
  inviteId: string; // 32 hex chars
  exp: number; // unix ms
  sig: Hex; // committee's EIP-191 signature over inviteMessage()
  uses?: number; // v2 (Disaster Mesh R5): how many phones may join with this one invite; absent = v1 single-use
}

/** Max phones one multi-use (v2) invite may admit. */
export const MAX_INVITE_USES = 20;

/** v1 (single-use) message is unchanged; v2 adds `uses`, so a v1 signature can never be replayed as multi-use. */
export const inviteMessage = (site: string, inviteId: string, exp: number, uses?: number) =>
  uses === undefined ? `tremor-witness invite v1|site=${site}|id=${inviteId}|exp=${exp}` : `tremor-witness invite v2|site=${site}|id=${inviteId}|exp=${exp}|uses=${uses}`;

export function encodeInvite(i: Invite): string {
  const json = JSON.stringify(i);
  const b64 = typeof btoa === "function" ? btoa(json) : Buffer.from(json, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeInvite(s: string): Invite | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("utf8");
    const i = JSON.parse(json) as Invite;
    return typeof i.site === "string" && /^[0-9a-f]{32}$/.test(i.inviteId) && Number.isFinite(i.exp) && /^0x[0-9a-fA-F]+$/.test(i.sig) && (i.uses === undefined || (Number.isInteger(i.uses) && i.uses >= 1 && i.uses <= MAX_INVITE_USES)) ? i : null;
  } catch {
    return null;
  }
}

/** Who signed this invite (to be compared with the committee address). */
export const inviteSigner = (i: Invite): Promise<Address> => recoverMessageAddress({ message: inviteMessage(i.site, i.inviteId, i.exp, i.uses), signature: i.sig });

export const InviteSchema = defineSchema(`${APP_TAG}.invite`, {
  site: str().indexed(),
  inviteId: str().indexed(),
  kind: str().indexed(), // "issued" | "used"
  exp: u64(),
  phone: str(), // used: the phone wallet; issued: ""
  label: str(), // used: the ENS label registered; issued: ""
  sig: bytes(), // issued: the committee signature, 65 bytes (so anyone can re-verify); str is capped at 128 bytes
  uses: u64().optional(), // v2 issued: how many joins this invite allows (needed to re-verify the v2 signature)
});

export async function writeInviteRecord(w: ArkivWallet, r: { site: string; inviteId: string; kind: "issued" | "used"; exp: number; phone?: string; label?: string; sig?: string; uses?: number }) {
  return w.createEntity(
    InviteSchema,
    { site: r.site, inviteId: r.inviteId, kind: r.kind, exp: u64(r.exp), phone: r.phone ?? "", label: r.label ?? "", sig: r.sig ? hexToBytes(r.sig as Hex) : new Uint8Array(), ...(r.uses !== undefined ? { uses: u64(r.uses) } : {}) },
    { expiration: ExpirationTime.fromDays(90) },
  );
}

export interface InviteRecord {
  key: string;
  creator: string;
  site: string;
  inviteId: string;
  kind: string;
  exp: number;
  phone: string;
  label: string;
  sig: string;
  uses?: number;
}

/** Invite records for a site (or one invite), newest first. Only records written by `committee` are trusted. */
export async function fetchInviteRecords(p: ArkivPublic, site: string, committee: string, inviteId?: string): Promise<InviteRecord[]> {
  const cond = inviteId ? and(eq("site", site), eq("inviteId", inviteId)) : eq("site", site);
  const res = await p.select({ $key: true, $creator: true, site: true, inviteId: true, kind: true, exp: true, phone: true, label: true, sig: true, uses: true }).from(InviteSchema).where(cond).orderBy(desc("exp")).limit(100).fetch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.entities as any[])
    .map((e) => ({
      key: String(e.$key),
      creator: String(e.$creator),
      site: String(e.site.value),
      inviteId: String(e.inviteId.value),
      kind: String(e.kind.value),
      exp: Number(e.exp.value),
      phone: String(e.phone.value),
      label: String(e.label.value),
      sig: typeof e.sig?.value === "string" ? String(e.sig.value) : e.sig?.value ? bytesToHex(e.sig.value as Uint8Array) : "",
      uses: e.uses?.value !== undefined && e.uses?.value !== null ? Number(e.uses.value) : undefined,
    }))
    .filter((r) => r.creator.toLowerCase() === committee.toLowerCase());
}
