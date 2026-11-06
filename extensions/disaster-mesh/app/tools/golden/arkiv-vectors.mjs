// Regenerates app/src/test/resources/golden/arkiv-v1.json by running the Tremor Witness repo's OWN writeDTrigger /
// writeCheckin (packages/chain/src/mesh.ts, read-only) against a fake JSON-RPC (globalThis.fetch is mocked), with a
// fixed salt, block, nonce, gas and fees. It records the exact calldata and the signed raw transaction.
// Usage: TW_REPO=/path/to/tremor-witness node tools/golden/arkiv-vectors.mjs > app/src/test/resources/golden/arkiv-v1.json
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
// The repo's TS imports "./x.js" for "./x.ts": map those when only the .ts exists.
registerHooks({ resolve(spec, ctx, next) {
  if (spec.startsWith(".") && spec.endsWith(".js") && ctx.parentURL?.includes("/packages/")) {
    const ts = new URL(spec.replace(/\.js$/, ".ts"), ctx.parentURL);
    if (!existsSync(fileURLToPath(new URL(spec, ctx.parentURL))) && existsSync(fileURLToPath(ts))) return next(ts.href, ctx);
  }
  return next(spec, ctx);
} });
process.chdir(R); // bare imports (viem, @arkiv-network/sdk) resolve from the repo's node_modules
const { writeDTrigger, writeCheckin } = await import(R + "/packages/chain/src/mesh.ts");
const { walletClientFor } = await import(R + "/packages/chain/src/arkiv.ts");
const { parseTransaction } = await import(R + "/node_modules/viem/_esm/index.js");

const PK = "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"; // public web3.js docs test key, never funded
const BLOCK = 0x123456, NONCE = 5, GAS = 0x30d40, BASEFEE = 7, PRIO = 1;
let saltByte = 1;
globalThis.crypto.getRandomValues = (a) => { for (let i = 0; i < a.length; i++) a[i] = saltByte; saltByte++; return a; };
let rec;
globalThis.fetch = async (url, init) => {
  const body = JSON.parse(init.body);
  const one = (q) => {
    const r = (result) => ({ jsonrpc: "2.0", id: q.id, result });
    switch (q.method) {
      case "eth_chainId": return r("0x76ed2f");
      case "eth_blockNumber": return r("0x" + BLOCK.toString(16));
      case "eth_estimateGas": rec.calldata = q.params[0].data; rec.to = q.params[0].to; return r("0x" + GAS.toString(16));
      case "eth_getTransactionCount": return r("0x" + NONCE.toString(16));
      case "eth_getBlockByNumber": return r({ number: "0x" + BLOCK.toString(16), baseFeePerGas: "0x" + BASEFEE.toString(16), timestamp: "0x1", hash: "0x" + "11".repeat(32), transactions: [] });
      case "eth_maxPriorityFeePerGas": return r("0x" + PRIO.toString(16));
      case "eth_gasPrice": return r("0x8");
      case "eth_sendRawTransaction": rec.rawTx = q.params[0]; throw new Error("captured");
      default: throw new Error("unmocked " + q.method);
    }
  };
  try {
    const out = Array.isArray(body) ? body.map(one) : one(body);
    return new Response(JSON.stringify(out), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e) {
    if (String(e.message) === "captured") return new Response(JSON.stringify({ jsonrpc: "2.0", id: body.id, error: { code: -1, message: "captured" } }), { status: 200 });
    throw e;
  }
};
const w = walletClientFor(PK);
const out = { key: PK, address: w.account.address, block: BLOCK, nonce: NONCE, gas: GAS, baseFee: BASEFEE, priorityFee: PRIO, chainId: 7794095, cases: [] };
const inputs = [
  ["dtrigger", { site: "test2", sensor: "mesh-3c2c", tMs: 1762425600123, ppvMmS: 0, fDomHz: 0, kind: "manual", seq: 1 }],
  ["dtrigger", { site: "test2", sensor: "mesh-3c2c", tMs: 1762425600999, ppvMmS: 12.3456, fDomHz: 7.891, kind: "auto", label: "structural", seq: 2 }],
  ["checkin", { site: "test2", sensor: "mesh-3c2c", tMs: 1762425601000, status: "help", note: "flat 302 – stairs blocked é", armMs: 1762425600123, seq: 3 }],
  ["checkin", { site: "test2", sensor: "mesh-3c2c", tMs: 1762425602000, status: "safe", seq: 4 }],
];
for (const [kind, input] of inputs) {
  rec = {};
  const salt = saltByte;
  try { await (kind === "dtrigger" ? writeDTrigger : writeCheckin)(w, input); } catch (e) { if (!rec.rawTx) throw e; }
  const tx = parseTransaction(rec.rawTx);
  out.cases.push({ kind, input, saltByte: salt, to: rec.to, calldata: rec.calldata, rawTx: rec.rawTx,
    tx: { nonce: tx.nonce, gas: String(tx.gas), maxFeePerGas: String(tx.maxFeePerGas), maxPriorityFeePerGas: String(tx.maxPriorityFeePerGas), value: String(tx.value ?? 0n) } });
}
console.log(JSON.stringify(out, null, 1));
