// Pull Tremor Mesh data straight from Arkiv into logs/ (no server of ours involved).
// Usage: node scripts/pull.ts [site=demo] [minutes=180]
import { writeFileSync, mkdirSync } from "node:fs";
import { fetchSensors, fetchTriggers, publicClientFor } from "@tw/chain";

const site = process.argv[2] ?? "demo";
const minutes = Number(process.argv[3] ?? 180);
const since = Date.now() - minutes * 60_000;
const p = publicClientFor(process.env.ARKIV_ACCESS_KEY ?? "");
const [sensors, triggers] = await Promise.all([fetchSensors(p, site, since), fetchTriggers(p, site, since, true)]);
mkdirSync("logs", { recursive: true });
const file = `logs/arkiv-${site}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(file, JSON.stringify({ site, since, pulledAt: Date.now(), sensors, triggers }, null, 1));
console.log(`site=${site} sensors=${sensors.length} triggers=${triggers.length} → ${file}`);
for (const s of sensors) console.log(`  sensor ${s.sensor} ${s.rateHz} Hz ${s.api} by ${s.creator.slice(0, 10)}`);
for (const t of triggers.slice(0, 20)) console.log(`  ${new Date(t.tMs).toISOString()} ${t.sensor} ${t.ppvMmS.toFixed(2)} mm/s ${t.fDomHz} Hz ${t.label}`);
