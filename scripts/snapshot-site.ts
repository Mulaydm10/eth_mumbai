// Full snapshot of a site's demo session into the repo (Arkiv entities expire; this keeps the data for future replays/UI).
// Pages through readings in time slices (each Arkiv query returns at most 100), then recomputes the quorum exactly like
// the dashboard: sound-sync clock correction + ENSv2 as-of registry rule.
// Usage: npx tsx scripts/snapshot-site.ts <site> <fromISO> [toISO] [outDir]
import { mkdirSync, writeFileSync } from "node:fs";
import { alignBySound, asOfCheck, computeQuorum, correctTime } from "@tw/core";
import { ENS_DEPLOYER, ensPublic, fetchEvents, fetchInviteRecords, fetchSensors, fetchSyncs, fetchTriggers, listSitePhones, publicClientFor, siteDisasterParams, siteLimits, siteParams, siteRegistrationHistory, type TriggerRow } from "@tw/chain";

const [site = "ethmumbai-demo", fromIso, toIso, outArg] = process.argv.slice(2);
if (!fromIso) throw new Error("usage: snapshot-site.ts <site> <fromISO> [toISO] [outDir]");
const from = Date.parse(fromIso);
const to = toIso ? Date.parse(toIso) : Date.now();
const out = outArg ?? `logs/demo-${site}-${new Date(from).toISOString().slice(0, 10)}`;
const arkiv = publicClientFor(process.env.ARKIV_ACCESS_KEY ?? "");
const ens = ensPublic();
const retry = async <T>(f: () => Promise<T>, n = 4): Promise<T> => {
  for (let i = 0; ; i++) {
    try {
      return await f();
    } catch (e) {
      if (i >= n) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
};

// Readings: newest-first pages of <=100; walk backwards from `to` with an upper bound until we pass `from`.
const byKey = new Map<string, TriggerRow>();
let until = to + 1;
for (let guard = 0; guard < 500; guard++) {
  const page = await retry(() => fetchTriggers(arkiv, site, from - 1, true, until));
  page.forEach((r) => byKey.set(r.key, r));
  if (page.length < 100) break;
  const oldest = Math.min(...page.map((r) => r.tMs));
  if (oldest >= until) break;
  until = oldest + 1; // re-include readings sharing the boundary ms (deduped by key)
  if (page.every((r) => r.tMs === oldest)) until = oldest; // >100 readings in one ms: impossible in practice
}
const readings = [...byKey.values()].filter((r) => r.tMs >= from && r.tMs <= to).sort((a, b) => a.tMs - b.tMs);

const [sensors, syncs, events, invites, phones, params, dparams, limits, history] = await Promise.all([
  retry(() => fetchSensors(arkiv, site, from - 3600_000)),
  retry(() => fetchSyncs(arkiv, site, from - 3600_000)),
  retry(() => fetchEvents(arkiv, site, from - 60_000)),
  retry(() => fetchInviteRecords(arkiv, site, ENS_DEPLOYER)),
  retry(() => listSitePhones(ens, site)),
  retry(() => siteParams(ens, site)),
  retry(() => siteDisasterParams(ens, site)),
  retry(() => siteLimits(ens, site)),
  retry(() => siteRegistrationHistory(ens, site)),
]);

// Recompute exactly like the dashboard.
const k = params.k ?? 2;
const windowMs = params.windowMs ?? 2000;
const creatorOf = new Map(readings.map((r) => [r.sensor, r.creator.toLowerCase()]));
const sync = alignBySound(syncs.filter((a) => !creatorOf.has(a.sensor) || creatorOf.get(a.sensor) === a.creator.toLowerCase()));
const why = new Map<string, string>();
const q = computeQuorum(
  readings.map((r) => ({ id: r.key, sensor: r.sensor, creator: r.creator, tMs: correctTime(r.sensor, r.tMs, sync), ppvMmS: r.ppvMmS, fDomHz: r.fDomHz, label: r.label, createdAtMs: r.createdAtMs })),
  {
    k,
    windowMs,
    isLive: (_s, _c, _t, t) => {
      const raw = readings.find((r) => r.key === t.id)!;
      const w = asOfCheck(history, { sensor: t.sensor, creator: t.creator, tMs: raw.tMs, createdAtMs: t.createdAtMs });
      why.set(t.id, w);
      return w === "ok";
    },
  },
);
const inEvent = new Set(q.events.flatMap((e) => e.members.map((m) => m.id)));
const rejected = new Map(q.rejected.map((r) => [r.trigger.id, r.reason as string]));

const ist = (ms: number) => new Date(ms).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
const perPhone: Record<string, { readings: number; structural: number; handling: number; inEvents: number }> = {};
for (const r of readings) {
  const p = (perPhone[r.sensor] ??= { readings: 0, structural: 0, handling: 0, inEvents: 0 });
  p.readings++;
  if (r.label === "structural") p.structural++;
  else p.handling++;
  if (inEvent.has(r.key)) p.inEvents++;
}
const rejCount = q.rejected.reduce<Record<string, number>>((m, r) => ((m[r.reason] = (m[r.reason] ?? 0) + 1), m), {});
const sealedIds = [...new Set(events.map((e) => e.eventId))];
const summary = {
  site,
  window: { from: new Date(from).toISOString(), to: new Date(to).toISOString(), fromIST: ist(from), toIST: ist(to) },
  rules: { k, windowMs, maxPhones: limits.maxPhones, maxMesh: limits.maxMesh, dk: dparams.dk, dwindowMs: dparams.dwindowMs },
  phones: phones.map((p) => ({ label: p.label, name: p.name, owner: p.owner, expiry: new Date(p.expiry * 1000).toISOString() })),
  invites: { issued: invites.filter((i) => i.kind === "issued").length, used: invites.filter((i) => i.kind === "used").length },
  readings: readings.length,
  perPhone,
  unregisteredWriters: [...new Set(readings.filter((r) => !phones.some((p) => p.label === r.sensor)).map((r) => `${r.sensor} (${r.creator})`))],
  confirmedEvents: q.events.map((e) => ({ tMs: e.tMs, ist: ist(e.tMs), phones: e.sensors, ppvMmS: [e.ppvMinMmS, e.ppvMaxMmS] })),
  rejected: rejCount,
  soundSync: sync ? { chirp: sync.chirp, refIST: ist(sync.refMs), correctionsMs: Object.fromEntries(sync.corrections) } : null,
  sealed: events.map((e) => ({ eventId: e.eventId, ist: ist(e.tMs), phones: e.sensors, swarmRef: e.swarmRef, packHash: e.packHash, arkivKey: e.key, expiresAt: e.expiresAtMs ? new Date(e.expiresAtMs).toISOString() : null })),
  sealedUnique: sealedIds.length,
  snapshotAt: new Date().toISOString(),
};

mkdirSync(out, { recursive: true });
writeFileSync(`${out}/readings.json`, JSON.stringify(readings.map((r) => ({ ...r, result: inEvent.has(r.key) ? "event" : rejected.get(r.key) ?? "grouped", asOf: why.get(r.key) })), null, 1));
writeFileSync(`${out}/registry.json`, JSON.stringify({ phones, history, sensors, invites, params, dparams, limits }, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 1));
writeFileSync(`${out}/sync.json`, JSON.stringify({ anchors: syncs, session: summary.soundSync }, null, 1));
writeFileSync(`${out}/sealed-events.json`, JSON.stringify(events, null, 1));
writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 1));
console.log(JSON.stringify({ ...summary, phones: summary.phones.map((p) => p.label), sealed: summary.sealed.map((s) => `${s.ist} ${s.phones.join(",")}`) }, null, 1));
console.log(`→ ${out}/`);
