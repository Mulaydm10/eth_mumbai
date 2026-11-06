// Committee: create a site (if new) and set its rules as ENS text records, from the dashboard Setup tab.
//   tw.k / tw.window_ms        web-app quorum (vibration)
//   tw.dk / tw.dwindow_ms      Disaster Mesh quorum (companion app)
//   tw.max_phones / tw.max_mesh phone limits per site (web app / mesh app)
// Everything lands on-chain in public text records, so anyone can audit the rules a site ran under.
import { HARD_MAX_MESH, HARD_MAX_PHONES, LABEL_RE, ensCreateSite, ensSetSiteText, siteExists } from "../../../packages/chain/src/ens.js";
import { committee, fail } from "./_committee.js";

const int = (v: unknown) => (typeof v === "number" && Number.isInteger(v) ? v : NaN);

export async function POST(req: Request): Promise<Response> {
  try {
    const b = (await req.json()) as Record<string, unknown>;
    if (!process.env.COMMITTEE_PASS || b.pass !== process.env.COMMITTEE_PASS) return fail(403, "committee passcode required");
    const site = String(b.site ?? "").toLowerCase();
    if (!LABEL_RE.test(site)) return fail(400, "site: 3-32 chars, a-z 0-9 -");
    const [maxPhones, maxMesh, k, windowMs, dk, dwindowMs] = [b.maxPhones, b.maxMesh, b.k, b.windowMs, b.dk, b.dwindowMs].map(int);
    if (!(maxPhones >= 1 && maxPhones <= HARD_MAX_PHONES)) return fail(400, `web phones: 1-${HARD_MAX_PHONES}`);
    if (!(maxMesh >= 0 && maxMesh <= HARD_MAX_MESH)) return fail(400, `mesh phones: 0-${HARD_MAX_MESH}`);
    if (!(k >= 2 && k <= Math.max(2, maxPhones))) return fail(400, `web quorum k: 2-${Math.max(2, maxPhones)} (needs at least 2 phones to agree)`);
    if (!(windowMs >= 500 && windowMs <= 10_000)) return fail(400, "web window: 500-10000 ms");
    if (maxMesh > 0 && !(dk >= 2 && dk <= Math.max(2, maxMesh))) return fail(400, `mesh quorum: 2-${Math.max(2, maxMesh)}`);
    if (maxMesh > 0 && !(dwindowMs >= 500 && dwindowMs <= 30_000)) return fail(400, "mesh window: 500-30000 ms");
    const { wallet, pub } = committee();
    const txs: string[] = [];
    if (!(await siteExists(pub, site))) txs.push(...(await ensCreateSite(wallet, pub, site, k, windowMs)));
    const records: Record<string, string> = { "tw.k": String(k), "tw.window_ms": String(windowMs), "tw.max_phones": String(maxPhones), "tw.max_mesh": String(maxMesh) };
    if (maxMesh > 0) Object.assign(records, { "tw.dk": String(dk), "tw.dwindow_ms": String(dwindowMs) });
    txs.push(await ensSetSiteText(wallet, pub, site, records));
    return Response.json({ ok: true, site, records, txs });
  } catch (e) {
    return fail(500, String((e as Error).message ?? e).slice(0, 300));
  }
}
