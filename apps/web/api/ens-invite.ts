// T14: the committee issues a single-use, 30-minute invite for one phone to join a site.
// R5 (Disaster Mesh demo): optional `uses` (2-50) makes a v2 multi-use invite, with optional `ttlMin` (max 360).
// The invite is signed by the committee key and the issuance is logged publicly on Arkiv before it is handed out.
import { randomBytes } from "node:crypto";
import { MAX_INVITE_USES, encodeInvite, inviteMessage, writeInviteRecord } from "../../../packages/chain/src/invite.js";
import { walletClientFor } from "../../../packages/chain/src/arkiv.js";
import { LABEL_RE } from "../../../packages/chain/src/ens.js";
import { privateKeyToAccount } from "viem/accounts";
import type { Hex } from "viem";
import { fail } from "./_committee.js";

const TTL_MS = 30 * 60_000;

export async function POST(req: Request): Promise<Response> {
  try {
    const { site, pass, uses: rawUses, ttlMin } = (await req.json()) as { site?: string; pass?: string; uses?: number; ttlMin?: number };
    if (!process.env.COMMITTEE_PASS || pass !== process.env.COMMITTEE_PASS) return fail(403, "committee passcode required");
    const s = String(site ?? "").toLowerCase();
    if (!LABEL_RE.test(s)) return fail(400, "bad site");
    const key = process.env.FUNDER_PRIVATE_KEY as Hex | undefined;
    if (!key) return fail(503, "committee not configured");
    const uses = rawUses === undefined || rawUses === 1 ? undefined : Number(rawUses);
    if (uses !== undefined && (!Number.isInteger(uses) || uses < 2 || uses > MAX_INVITE_USES)) return fail(400, `uses: 2-${MAX_INVITE_USES}`);
    const ttl = uses !== undefined && ttlMin !== undefined ? Math.min(Math.max(Number(ttlMin) || 30, 5), 360) * 60_000 : TTL_MS;
    const inviteId = randomBytes(16).toString("hex");
    const exp = Date.now() + ttl;
    const sig = await privateKeyToAccount(key).signMessage({ message: inviteMessage(s, inviteId, exp, uses) });
    await writeInviteRecord(walletClientFor(key, process.env.ARKIV_ACCESS_KEY ?? ""), { site: s, inviteId, kind: "issued", exp, sig, uses });
    return Response.json({ ok: true, inviteId, exp, ...(uses ? { uses } : {}), invite: encodeInvite({ site: s, inviteId, exp, sig, ...(uses ? { uses } : {}) }) });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
