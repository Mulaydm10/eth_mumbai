// Reads back entities the app wrote, with the Tremor Witness repo's OWN fetchDTriggers / fetchCheckins (read-only).
// Usage: TW_REPO=… node tools/golden/arkiv-readback.mjs <site> <sinceMs> <creatorAddress>
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
registerHooks({ resolve(spec, ctx, next) {
  if (spec.startsWith(".") && spec.endsWith(".js") && ctx.parentURL?.includes("/packages/")) {
    const ts = new URL(spec.replace(/\.js$/, ".ts"), ctx.parentURL);
    if (!existsSync(fileURLToPath(new URL(spec, ctx.parentURL))) && existsSync(fileURLToPath(ts))) return next(ts.href, ctx);
  }
  return next(spec, ctx);
} });
process.chdir(R);
const { fetchDTriggers, fetchCheckins } = await import(R + "/packages/chain/src/mesh.ts");
const { publicClientFor } = await import(R + "/packages/chain/src/arkiv.ts");
const [site, since, creator] = process.argv.slice(2);
const p = publicClientFor();
const mine = (x) => x.creator.toLowerCase() === creator.toLowerCase();
const d = (await fetchDTriggers(p, site, Number(since) - 60000)).filter(mine);
const c = (await fetchCheckins(p, site, Number(since) - 60000)).filter(mine);
console.log(JSON.stringify({ dtriggers: d, checkins: c }, null, 1));
