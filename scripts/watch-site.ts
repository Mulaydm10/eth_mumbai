// Live watcher for a demo run: prints a line whenever the site's ENS rules/phones, readings or sealed events change.
// Usage: npx tsx scripts/watch-site.ts <site> [intervalSec]
import { alignBySound, computeQuorum, correctTime } from "@tw/core";
import { ensPublic, fetchEvents, fetchSyncs, fetchInviteRecords, fetchTriggers, listSitePhones, publicClientFor, siteExists, siteLimits, siteParams, ENS_DEPLOYER } from "@tw/chain";

const site = process.argv[2] ?? "ethmumbai-demo";
const every = Number(process.argv[3] ?? 20) * 1000;
const arkiv = publicClientFor("");
const ens = ensPublic();
const start = Date.now() - 30 * 60_000;
let last = "";
const ist = (ms: number) => new Date(ms).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });

async function tick() {
  try {
    if (!(await siteExists(ens, site))) {
      const line = `site ${site}: not created yet (save it in the Setup tab)`;
      if (line !== last) console.log(`${ist(Date.now())} ${line}`), (last = line);
      return;
    }
    const [p, lim, phones, rows, evs, inv] = await Promise.all([siteParams(ens, site), siteLimits(ens, site), listSitePhones(ens, site), fetchTriggers(arkiv, site, start), fetchEvents(arkiv, site, start), fetchInviteRecords(arkiv, site, ENS_DEPLOYER)]);
    const k = p.k ?? 2, w = p.windowMs ?? 2000;
    const sync = alignBySound(await fetchSyncs(arkiv, site, start - 6 * 3600_000).catch(() => []));
    const syncTxt = sync ? `sync #${sync.chirp} [${[...sync.corrections].map(([n, v]) => `${n}:${Math.round(v)}ms`).join(" ")}]` : "no sync";
    const q = computeQuorum(rows.map((r) => ({ id: r.key, sensor: r.sensor, creator: r.creator, tMs: correctTime(r.sensor, r.tMs, sync), ppvMmS: r.ppvMmS, fDomHz: r.fDomHz, label: r.label, createdAtMs: r.createdAtMs })), { k, windowMs: w, isLive: (s, c) => phones.some((x) => x.label === s && x.owner.toLowerCase() === c.toLowerCase()) });
    const per = phones.map((x) => `${x.label}:${rows.filter((r) => r.sensor === x.label).length}`).join(" ");
    const rej = q.rejected.reduce<Record<string, number>>((m, r) => ((m[r.reason] = (m[r.reason] ?? 0) + 1), m), {});
    const lastEv = q.events.at(-1);
    const line = `rules k=${k}/${w}ms max=${lim.maxPhones}+${lim.maxMesh}mesh | invites ${inv.filter((i) => i.kind === "issued").length} issued ${inv.filter((i) => i.kind === "used").length} used | phones ${phones.length} [${per}] | readings ${rows.length} | events ${q.events.length}${lastEv ? ` (last ${ist(lastEv.tMs)} ${lastEv.sensors.join(",")} ${lastEv.ppvMinMmS.toFixed(2)}-${lastEv.ppvMaxMmS.toFixed(2)}mm/s)` : ""} | rejected ${JSON.stringify(rej)} | sealed ${new Set(evs.map((e) => e.eventId)).size} | ${syncTxt}`;
    if (line !== last) console.log(`${ist(Date.now())} ${line}`), (last = line);
  } catch (e) {
    console.log(`${ist(Date.now())} read error: ${String((e as Error).message ?? e).slice(0, 120)}`);
  }
}
await tick();
setInterval(tick, every);
