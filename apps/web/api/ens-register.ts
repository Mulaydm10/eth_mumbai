// Register a phone as <label>.<site>.tremorwitness.eth (owner + addr = the phone's own wallet; expiring, non-transferable).
// T14: a NEW phone needs a committee-signed, unexpired, unused invite whose issuance is logged on Arkiv; the use is logged
// too. A phone already registered to the same wallet may re-join without an invite.
import { getAddress, isAddress, type Address, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { LABEL_RE, MAX_PHONES_PER_SITE, ensCreateSite, ensRegisterPhone, listSitePhones, siteExists } from "../../../packages/chain/src/ens.js";
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
      if (same.owner.toLowerCase() === address.toLowerCase()) return Response.json({ ok: true, name: same.name, expiry: same.expiry, existing: true });
      return fail(409, `${same.name} belongs to another phone; pick another name`);
    }
    if (live.length >= MAX_PHONES_PER_SITE) return fail(409, `site is full (${MAX_PHONES_PER_SITE} phones)`);

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
    if (recs.some((r) => r.kind === "used")) return fail(409, "invite already used");

    if (!exists) await ensCreateSite(wallet, pub, s);
    const r = await ensRegisterPhone(wallet, pub, s, l, address as Address, 30);
    await writeInviteRecord(walletClientFor(key, process.env.ARKIV_ACCESS_KEY ?? ""), { site: s, inviteId: inv.inviteId, kind: "used", exp: inv.exp, phone: getAddress(address), label: l });
    return Response.json({ ok: true, ...r, inviteId: inv.inviteId });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
