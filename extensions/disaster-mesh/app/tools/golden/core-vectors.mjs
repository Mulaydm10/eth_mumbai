// Regenerates app/src/test/resources/golden/core-v1.json by running the Tremor Witness repo's OWN computeQuorum and
// asOfCheck (packages/core/src, TypeScript, loaded read-only; Node >= 23 strips types natively).
// Usage: TW_REPO=/path/to/tremor-witness node tools/golden/core-vectors.mjs > app/src/test/resources/golden/core-v1.json
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
const { computeQuorum } = await import(R + "/packages/core/src/quorum.ts");
const { asOfCheck, registeredAt } = await import(R + "/packages/core/src/registry.ts");

// Seeded PRNG (mulberry32) so the file is reproducible.
let seed = 0x7357; const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const hex = (n) => [...Array(n)].map(() => "0123456789abcdef"[ri(0, 15)]).join("");
const INF = 1e15; // JSON has no Infinity; Kotlin uses Long.MAX-ish sentinel the same way

const sensors = ["a-m", "b-m", "c-m", "d-m", "e-m"];
const owner = Object.fromEntries(sensors.map((s, i) => [s, "0x" + String(i + 1).repeat(40)]));

function scenario(i) {
  const k = ri(2, 4), windowMs = [500, 1500, 2000, 5000][ri(0, 3)];
  // Registration intervals: most live forever, some revoked/expired/late-joining, one wrong owner.
  const intervals = sensors.map((s) => {
    const r = rnd();
    if (r < 0.15) return { label: s, owner: owner[s], fromMs: 0, toMs: ri(2000, 8000) };          // revoked mid-way
    if (r < 0.25) return { label: s, owner: owner[s], fromMs: ri(3000, 9000), toMs: INF };        // joined late
    return { label: s, owner: owner[s], fromMs: 0, toMs: INF };
  });
  const triggers = [];
  const n = ri(1, 12);
  for (let j = 0; j < n; j++) {
    const s = sensors[ri(0, sensors.length - 1)];
    const tMs = ri(1000, 12000);
    const wrongOwner = rnd() < 0.08;
    triggers.push({
      id: hex(16), sensor: s, creator: wrongOwner ? "0x" + "9".repeat(40) : owner[s], tMs,
      ppvMmS: Math.round(rnd() * 5000) / 100, fDomHz: ri(1, 40), label: rnd() < 0.15 ? "handling" : "structural",
      createdAtMs: rnd() < 0.05 ? tMs - 300000 : tMs + ri(0, 4000),
    });
  }
  const useRegistry = i % 3 !== 0;
  const asOf = triggers.map((t) => asOfCheck(intervals, t));
  const isLive = useRegistry ? (s, c, tMs, t) => asOfCheck(intervals, t) === "ok" : undefined;
  const r = computeQuorum(triggers, { k, windowMs, isLive });
  return {
    k, windowMs, useRegistry, intervals, triggers, asOf,
    events: r.events.map((e) => ({ tMs: e.tMs, sensors: e.sensors, memberIds: e.members.map((m) => m.id), ppvMinMmS: e.ppvMinMmS, ppvMaxMmS: e.ppvMaxMmS })),
    rejected: r.rejected.map((x) => ({ id: x.trigger.id, reason: x.reason })),
  };
}

const cases = [];
// The repo's own hand-written cases (packages/core/test/quorum.test.ts), ids hex so ordering matches across languages.
const tr = (id, sensor, tMs, label = "structural", ppv = 2) => ({ id, sensor, creator: owner[sensor] ?? "0x" + "8".repeat(40), tMs, ppvMmS: ppv, fDomHz: 15, label, createdAtMs: tMs });
const fixed = [
  { k: 3, windowMs: 1500, triggers: [tr("01", "a-m", 1000, "structural", 2), tr("02", "b-m", 1300, "structural", 3), tr("03", "c-m", 1600), tr("04", "a-m", 9000)] },
  { k: 3, windowMs: 1500, triggers: [tr("01", "a-m", 1000), tr("02", "a-m", 1100), tr("03", "b-m", 1200)] },
  { k: 3, windowMs: 1500, triggers: [tr("01", "a-m", 1000), tr("02", "b-m", 1100, "handling"), tr("03", "c-m", 1200)] },
  { k: 3, windowMs: 1500, triggers: [tr("01", "a-m", 1000), tr("02", "b-m", 1400), tr("03", "c-m", 1450), tr("04", "b-m", 5000), tr("05", "c-m", 5100), tr("06", "a-m", 5200)] },
  { k: 2, windowMs: 1000, triggers: [tr("01", "a-m", 1000), tr("02", "b-m", 2000)] },  // exactly on the window edge
  { k: 2, windowMs: 1000, triggers: [tr("01", "a-m", 1000), tr("02", "b-m", 2001)] },  // just outside
  { k: 2, windowMs: 1000, triggers: [tr("0b", "a-m", 1000), tr("0a", "b-m", 1000)] },  // same time: id order
];
for (const f of fixed) {
  const r = computeQuorum(f.triggers, { k: f.k, windowMs: f.windowMs });
  cases.push({ k: f.k, windowMs: f.windowMs, useRegistry: false, intervals: [], triggers: f.triggers, asOf: [],
    events: r.events.map((e) => ({ tMs: e.tMs, sensors: e.sensors, memberIds: e.members.map((m) => m.id), ppvMinMmS: e.ppvMinMmS, ppvMaxMmS: e.ppvMaxMmS })),
    rejected: r.rejected.map((x) => ({ id: x.trigger.id, reason: x.reason })) });
}
for (let i = 0; i < 300; i++) cases.push(scenario(i));
// registeredAt edge checks
const iv = [{ label: "a-m", owner: owner["a-m"], fromMs: 1000, toMs: 5000 }];
const regAt = [[999, 0], [880, 120], [1000, 0], [4999, 0], [5000, 0]].map(([at, slack]) => ({ at, slack, ok: registeredAt(iv, "a-m", owner["a-m"].toUpperCase(), at, slack) }));
console.log(JSON.stringify({ source: "packages/core/src/{quorum,registry}.ts", infinity: INF, regAt: { intervals: iv, checks: regAt }, cases }));
