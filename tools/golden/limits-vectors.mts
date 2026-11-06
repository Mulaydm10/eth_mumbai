// Regenerates app/src/test/resources/golden/limits-v1.json from the Tremor Witness repo's own readers (read-only):
// siteLimits / siteParams / siteDisasterParams in packages/chain/src/ens.ts, fed by a mock ENS text lookup.
// Usage: TW_REPO=/path/to/tremor-witness "$TW_REPO/node_modules/.bin/tsx" tools/golden/limits-vectors.mts > app/src/test/resources/golden/limits-v1.json
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
const ens = await import(R + "/packages/chain/src/ens.ts");
const inv = await import(R + "/packages/chain/src/invite.ts");
const values: (string | null)[] = [null, "", " ", "0", "1", "7", "15", "20", "21", "50", "51", "-3", "2.5", "abc", " 8 ", "1e1", "0x10", "Infinity", "007", "+4", "5f"];
const cases = [];
for (const v of values) {
  const pub = { getEnsText: async ({ key }: { key: string }) => (v === "THROW" ? Promise.reject(new Error()) : v) };
  const l = await ens.siteLimits(pub as any, "meshtest");
  const p = await ens.siteParams(pub as any, "meshtest");
  const d = await ens.siteDisasterParams(pub as any, "meshtest");
  const num = (x: number | null) => (x === null || Number.isNaN(x) ? null : x);   // NaN has no JSON form: the app treats it as missing
  cases.push({ text: v, maxPhones: l.maxPhones, maxMesh: l.maxMesh, fromEns: l.fromEns.maxMesh, k: num(p.k), windowMs: num(p.windowMs), dk: num(d.dk), isNaN: Number.isNaN(p.k as number) });
}
console.log(JSON.stringify({ source: "packages/chain/src/ens.ts siteLimits/siteParams/siteDisasterParams", defaults: { maxPhones: ens.MAX_PHONES_PER_SITE, maxMesh: ens.MAX_MESH_PHONES_PER_SITE, hardPhones: ens.HARD_MAX_PHONES, hardMesh: ens.HARD_MAX_MESH, maxInviteUses: inv.MAX_INVITE_USES }, cases }, null, 1));
