// Live check of the Disaster Mesh backend (R1, R2, R3, R5) against production. Uses throwaway keys; needs COMMITTEE_PASS.
//   npx tsx --env-file=.env scripts/mesh-backend-check.ts <site>
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { decodeInvite, encodeInvite } from "../packages/chain/src/invite";
import { fetchCheckins, fetchDTriggers, writeCheckin, writeDTrigger } from "../packages/chain/src/mesh";
import { publicClientFor, walletClientFor } from "../packages/chain/src/arkiv";

const BASE = "https://tremor-witness.vercel.app";
const site = process.argv[2] ?? "meshtest";
const post = async (path: string, body: object) => {
  const r = await fetch(BASE + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, j: (await r.json()) as Record<string, unknown> };
};
let pass = 0, failN = 0;
const expect = (name: string, ok: boolean, info: unknown) => { ok ? pass++ : failN++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${JSON.stringify(info).slice(0, 160)}`); };
const tag = Date.now().toString(16).slice(-4);
const keys = new Map<string, `0x${string}`>();
const phone = () => { const k = generatePrivateKey(); const acc = privateKeyToAccount(k); keys.set(acc.address, k); return acc; };

// R5: multi-use invite, uses=2
const inv2 = await post("/api/ens-invite", { site, pass: process.env.COMMITTEE_PASS, uses: 2, ttlMin: 30 });
expect("v2 invite issued", inv2.status === 200 && inv2.j.uses === 2, inv2.j);
const invite = String(inv2.j.invite);
const [a, b, c] = [phone(), phone(), phone()];
const ra = await post("/api/ens-register", { site, label: `mesh-a${tag}`, address: a.address, invite });
expect("mesh phone A joins (1/2)", ra.status === 200 && ra.j.usesLeft === 1, ra.j);
const ra2 = await post("/api/ens-register", { site, label: `mesh-x${tag}`, address: a.address, invite });
expect("same wallet, 2nd name with same invite refused", ra2.status === 409, ra2.j);
const rb = await post("/api/ens-register", { site, label: `mesh-b${tag}`, address: b.address, invite });
expect("mesh phone B joins (2/2)", rb.status === 200 && rb.j.usesLeft === 0, rb.j);
const rc = await post("/api/ens-register", { site, label: `mesh-c${tag}`, address: c.address, invite });
expect("3rd phone refused (fully used)", rc.status === 409, rc.j);

// Forgery: take a v1 invite and add uses
const inv1 = await post("/api/ens-invite", { site, pass: process.env.COMMITTEE_PASS });
expect("v1 invite issued (no uses)", inv1.status === 200 && inv1.j.uses === undefined, inv1.j);
const forged = encodeInvite({ ...decodeInvite(String(inv1.j.invite))!, uses: 5 });
const rf = await post("/api/ens-register", { site, label: `mesh-f${tag}`, address: c.address, invite: forged });
expect("v1 invite + forged uses refused", rf.status === 403, rf.j);
// v1 still single-use, for a sensing phone label
const rs = await post("/api/ens-register", { site, label: `s${tag}`, address: c.address, invite: String(inv1.j.invite) });
expect("v1 invite still works (sensing phone)", rs.status === 200, rs.j);
const d = phone();
const rs2 = await post("/api/ens-register", { site, label: `t${tag}`, address: d.address, invite: String(inv1.j.invite) });
expect("v1 invite reuse refused", rs2.status === 409, rs2.j);

// R2 + R3: mesh phone A writes its own dtrigger + checkin to Arkiv (after the gas drip), then read back
const drip = await post("/api/drip", { address: a.address });
expect("drip tGLM to mesh phone A", drip.status === 200, drip.j);
await new Promise((r) => setTimeout(r, 8000));
const wa = walletClientFor(keys.get(a.address)!);
const now = Date.now();
await writeDTrigger(wa, { site, sensor: `mesh-a${tag}`, tMs: now, ppvMmS: 0, fDomHz: 0, kind: "manual", seq: 1 });
await writeCheckin(wa, { site, sensor: `mesh-a${tag}`, tMs: now + 1, status: "safe", note: "backend check", armMs: now, seq: 2 });
await new Promise((r) => setTimeout(r, 4000));
const pub = publicClientFor();
const dts = (await fetchDTriggers(pub, site, now - 60_000)).filter((x) => x.sensor === `mesh-a${tag}`);
expect("dtrigger on Arkiv, $creator = phone A", dts.length === 1 && dts[0]!.creator.toLowerCase() === a.address.toLowerCase() && dts[0]!.kind === "manual", dts[0]);
const cis = (await fetchCheckins(pub, site, now - 60_000)).filter((x) => x.sensor === `mesh-a${tag}`);
expect("checkin on Arkiv, $creator = phone A", cis.length === 1 && cis[0]!.creator.toLowerCase() === a.address.toLowerCase() && cis[0]!.status === "safe" && cis[0]!.armMs === now, cis[0]);
console.log(`\n${pass} passed, ${failN} failed (site ${site}, tag ${tag})`);
process.exit(failN ? 1 : 0);
