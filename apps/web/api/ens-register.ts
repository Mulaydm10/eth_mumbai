// Register a phone as <label>.<site>.tremorwitness.eth (owner + addr = the phone's own wallet; expiring, non-transferable).
import { isAddress, type Address } from "viem";
import { LABEL_RE, MAX_PHONES_PER_SITE, ensCreateSite, ensRegisterPhone, listSitePhones, siteExists } from "../../../packages/chain/src/ens.js";
import { committee, fail } from "./_committee.js";

export async function POST(req: Request): Promise<Response> {
  try {
    const { site, label, address } = (await req.json()) as { site?: string; label?: string; address?: string };
    const s = String(site ?? "").toLowerCase();
    const l = String(label ?? "").toLowerCase();
    if (!LABEL_RE.test(s) || !LABEL_RE.test(l)) return fail(400, "site and phone name: 3-32 chars, a-z 0-9 -");
    if (!address || !isAddress(address)) return fail(400, "bad address");
    const { wallet, pub } = committee();
    if (!(await siteExists(pub, s))) await ensCreateSite(wallet, pub, s);
    const live = await listSitePhones(pub, s);
    const same = live.find((p) => p.label === l);
    if (same) {
      if (same.owner.toLowerCase() === address.toLowerCase()) return Response.json({ ok: true, name: same.name, expiry: same.expiry, existing: true });
      return fail(409, `${same.name} belongs to another phone; pick another name`);
    }
    if (live.length >= MAX_PHONES_PER_SITE) return fail(409, `site is full (${MAX_PHONES_PER_SITE} phones)`);
    const r = await ensRegisterPhone(wallet, pub, s, l, address as Address, 30);
    return Response.json({ ok: true, ...r });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
