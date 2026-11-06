// Register a phone as <label>.<site>.tremorwitness.eth (owner + addr = the phone's own wallet; expiring, non-transferable).
// T14: a NEW phone needs a committee-signed, unexpired, unused invite whose issuance is logged on Arkiv; the use is logged
// too. A phone already registered to the same wallet may re-join without an invite.
import { getAddress, isAddress, type Address, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { LABEL_RE, MAX_MESH_PHONES_PER_SITE, MAX_PHONES_PER_SITE, ensCreateSite, isMeshLabel, ensRegisterPhone, ensureHeadGrant, listSitePhones, siteExists } from "../../../packages/chain/src/ens.js";
import { decodeInvite, fetchInviteRecords, inviteSigner, writeInviteRecord } from "../../../packages/chain/src/invite.js";
import { publicClientFor, walletClientFor } from "../../../packages/chain/src/arkiv.js";
import { committee, fail } from "./_committee.js";

export async function POST(req: Request): Promise<Response> {
  try {
    const { site, label, address, invite } = (await req.json()) as { site?: string; label?: string; address?: string; invite?: string };
    const s = String(site ?? "").toLowerCase();
    const l = String(label ?? "").toLowerCase();
    if (!LABEL_RE.test(s) || !LABEL_RE.test(l)) return fail(400, "site and phone name: 3-32 chars, a-z 0-9 -");
    if (!address || !isAddress(address)) return fail(400, "bad address");
    const { wallet, pub } = committee();
    const exists = await siteExists(pub, s);
    const live = exists ? await listSitePhones(pub, s) : [];
    const same = live.find((p) => p.label === l);
    if (same) {
      if (same.owner.toLowerCase() === address.toLowerCase()) {
        // T3 backfill: phones registered before T3 lack the head-write grant; add it on rejoin (no-op if present).
        const grant = await ensureHeadGrant(wallet, pub, s, l, address as Address).catch(() => null);
        return Response.json({ ok: true, name: same.name, expiry: same.expiry, existing: true, headGrant: grant ? "granted" : "ok" });
      }
      return fail(409, `${same.name} belongs to another phone; pick another name`);
    }
    // Sensing phones and Disaster Mesh phones ("mesh-…" labels, R1) have separate caps.
    const mesh = isMeshLabel(l);
    const cap = mesh ? MAX_MESH_PHONES_PER_SITE : MAX_PHONES_PER_SITE;
    if (live.filter((p) => isMeshLabel(p.label) === mesh).length >= cap) return fail(409, `site is full (${cap} ${mesh ? "mesh " : ""}phones)`);

    // ---- T14 invite check ----
    const inv = invite ? decodeInvite(invite) : null;
    if (!inv) return fail(403, "joining needs a committee invite: scan the invite QR on the dashboard");
    if (inv.site !== s) return fail(403, "this invite is for another site");
    if (inv.exp < Date.now()) return fail(403, "invite expired: ask the committee for a new one");
    const key = process.env.FUNDER_PRIVATE_KEY as Hex;
    const committeeAddr = privateKeyToAccount(key).address;
    if (getAddress(await inviteSigner(inv)) !== committeeAddr) return fail(403, "invite not signed by the committee");
    const arkiv = publicClientFor(process.env.ARKIV_ACCESS_KEY ?? "");
    const recs = await fetchInviteRecords(arkiv, s, committeeAddr, inv.inviteId);
    if (!recs.some((r) => r.kind === "issued")) return fail(403, "invite issuance not found on Arkiv");
    // v1: single use. v2 (R5): up to `uses` joins, one per phone wallet. (Two joins racing at the same instant could
    // both pass this count; acceptable for a committee-issued, short-lived demo invite.)
    const used = recs.filter((r) => r.kind === "used");
    if (used.length >= (inv.uses ?? 1)) return fail(409, inv.uses ? `invite fully used (${inv.uses} phones)` : "invite already used");
    if (used.some((r) => r.phone.toLowerCase() === address.toLowerCase())) return fail(409, "this phone already joined with this invite");

    if (!exists) await ensCreateSite(wallet, pub, s);
    const r = await ensRegisterPhone(wallet, pub, s, l, address as Address, 30);
    await writeInviteRecord(walletClientFor(key, process.env.ARKIV_ACCESS_KEY ?? ""), { site: s, inviteId: inv.inviteId, kind: "used", exp: inv.exp, phone: getAddress(address), label: l });
    return Response.json({ ok: true, ...r, inviteId: inv.inviteId, ...(inv.uses ? { usesLeft: inv.uses - used.length - 1 } : {}) });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
