// Committee revokes a phone: unregister its ENS name + clear its addr record. Its next readings stop counting.
import { LABEL_RE, ensRevokePhone } from "../../../packages/chain/src/ens.js";
import { committee, fail } from "./_committee.js";

export async function POST(req: Request): Promise<Response> {
  try {
    const { site, label, pass } = (await req.json()) as { site?: string; label?: string; pass?: string };
    if (!process.env.COMMITTEE_PASS || pass !== process.env.COMMITTEE_PASS) return fail(403, "committee passcode required");
    const s = String(site ?? "").toLowerCase();
    const l = String(label ?? "").toLowerCase();
    if (!LABEL_RE.test(s) || !LABEL_RE.test(l)) return fail(400, "bad site or phone name");
    const { wallet, pub } = committee();
    const txs = await ensRevokePhone(wallet, pub, s, l);
    return Response.json({ ok: true, txs });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
