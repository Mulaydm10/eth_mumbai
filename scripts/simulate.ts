// End-to-end self-test without phones: N fresh wallets get gas from the live /api/drip, register as sensors,
// write one simultaneous "stomp" (+ one lone trigger), then we read Arkiv back and compute the quorum.
// Usage: npx tsx --env-file=.env scripts/simulate.ts [site=selftest] [phones=3]   (needs COMMITTEE_PASS for invites)
import { computeQuorum } from "@tw/core";
import { fetchSensors, fetchTriggers, publicClientFor, walletClientFor, writeSensor, writeTrigger } from "@tw/chain";
import { formatEther } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const site = process.argv[2] ?? "selftest";
const n = Number(process.argv[3] ?? 3);
const BASE = process.env.TW_URL ?? "https://tremor-witness.vercel.app";
const ak = process.env.ARKIV_ACCESS_KEY ?? "";
const pub = publicClientFor(ak);
const phones = Array.from({ length: n }, (_, i) => {
  const k = generatePrivateKey();
  return { name: `sim-${i + 1}-${Date.now().toString(36).slice(-3)}`, key: k, addr: privateKeyToAccount(k).address, w: walletClientFor(k, ak) };
});

console.log("1) drip gas via", BASE);
for (const p of phones) {
  const r = await fetch(`${BASE}/api/drip`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: p.addr }) });
  console.log("  ", p.name, p.addr.slice(0, 10), JSON.stringify(await r.json()).slice(0, 120));
}
console.log("1b) register ENS names via", `${BASE}/api/ens-register`);
// T14: new phones need a committee invite. Run with --env-file=.env so COMMITTEE_PASS is available.
for (const p of phones) {
  const inv = (await (await fetch(`${BASE}/api/ens-invite`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ site, pass: process.env.COMMITTEE_PASS ?? "" }) })).json()) as { invite?: string; error?: string };
  if (!inv.invite) console.log("   invite failed:", inv.error, "(run: npx tsx --env-file=.env scripts/simulate.ts …)");
  const r = await fetch(`${BASE}/api/ens-register`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ site, label: p.name, address: p.addr, invite: inv.invite }) });
  console.log("  ", p.name, JSON.stringify(await r.json()).slice(0, 140));
}
const bal0 = await pub.getBalance({ address: phones[0]!.addr });

console.log("2) register sensors + write a simultaneous stomp");
const now = Date.now();
const wave = { fs: 60, x: [0, 0.1, -0.1], y: [0, 0.05, -0.05], z: [0, 0.3, -0.2] };
await Promise.all(
  phones.map(async (p, i) => {
    await writeSensor(p.w, { site, sensor: p.name, startedMs: now - 5000, rateHz: 60, api: "simulated", ua: "scripts/simulate.ts" });
    await writeTrigger(p.w, { site, sensor: p.name, tMs: now + i * 150, ppvMmS: 2 + i * 0.4, fDomHz: 14, lowF: 0.05, rateHz: 60, label: "structural", wave });
  }),
);
await writeTrigger(phones[0]!.w, { site, sensor: phones[0]!.name, tMs: now + 20_000, ppvMmS: 5, fDomHz: 2, lowF: 0.8, rateHz: 60, label: "handling", wave });
const bal1 = await pub.getBalance({ address: phones[0]!.addr });
console.log(`   gas used by phone 1 for 3 writes: ${formatEther(bal0 - bal1)} tGLM`);

console.log("3) read back from Arkiv + quorum");
await new Promise((r) => setTimeout(r, 3000));
const sensors = await fetchSensors(pub, site, now - 60_000);
const rows = await fetchTriggers(pub, site, now - 60_000);
const owner = new Map(sensors.map((s) => [s.sensor, s.creator.toLowerCase()]));
const q = computeQuorum(
  rows.map((r) => ({ id: r.key, sensor: r.sensor, creator: r.creator, tMs: r.tMs, ppvMmS: r.ppvMmS, fDomHz: r.fDomHz, label: r.label })),
  { k: Math.min(3, n), windowMs: 2000, isLive: (s, c) => owner.get(s) === c.toLowerCase() },
);
console.log(`   sensors=${sensors.length} triggers=${rows.length} confirmed=${q.events.length} rejected=${q.rejected.map((r) => r.reason).join(",")}`);
for (const e of q.events) console.log(`   EVENT ${new Date(e.tMs).toISOString()} phones=${e.sensors.join(",")} ppv=${e.ppvMinMmS}-${e.ppvMaxMmS} mm/s`);
