// EXP: does waveform coherence separate "same stomp felt by two phones" from "two different stomps"?
// Uses real Arkiv data pulled into logs/ (two phones). Same-stomp pairs: structural triggers that line up after removing
// the phones' measured clock offset. Different-stomp pairs: structural triggers from the two phones that are NOT the same
// stomp, re-timed to overlap (the best case for a colluder who times their stomp perfectly).
// Usage: npx tsx scripts/coherence-eval.ts logs/arkiv-test2-<...>.json [offsetMs=auto]
import { readFileSync } from "node:fs";
import { coherence, type Wave } from "@tw/core";

const file = process.argv[2]!;
const d = JSON.parse(readFileSync(file, "utf8")) as {
  pulledAt: number;
  triggers: { key: string; sensor: string; tMs: number; label: string; wave?: { fs: number; x: number[]; y: number[]; z: number[] } }[];
};
const T = d.triggers.filter((t) => t.label === "structural" && t.wave && t.tMs < d.pulledAt + 60_000);
const sensors = [...new Set(T.map((t) => t.sensor))];
if (sensors.length < 2) throw new Error("need two phones");
const [A, B] = sensors as [string, string];
const a = T.filter((t) => t.sensor === A).sort((p, q) => p.tMs - q.tMs);
const b = T.filter((t) => t.sensor === B).sort((p, q) => p.tMs - q.tMs);

// Clock offset B−A: median nearest positive/negative gap under 5 s (same method as the round-2 analysis).
let off = Number(process.argv[3]);
if (!Number.isFinite(off)) {
  const gaps = a.map((x) => b.map((y) => y.tMs - x.tMs).filter((g) => Math.abs(g) < 5000).sort((p, q) => Math.abs(p) - Math.abs(q))[0]).filter((g): g is number => g !== undefined);
  gaps.sort((p, q) => p - q);
  off = gaps[Math.floor(gaps.length / 2)] ?? 0;
}
const toWave = (t: (typeof T)[number], shift = 0): Wave => ({ sensor: t.sensor, fs: t.wave!.fs, x: t.wave!.x, y: t.wave!.y, z: t.wave!.z, t0Ms: t.tMs - 300 - shift });

const same: number[] = [];
const diff: number[] = [];
const usedB = new Set<string>();
for (const x of a) {
  const m = b.filter((y) => !usedB.has(y.key) && Math.abs(y.tMs - off - x.tMs) <= 1000).sort((p, q) => Math.abs(p.tMs - off - x.tMs) - Math.abs(q.tMs - off - x.tMs))[0];
  if (m) {
    usedB.add(m.key);
    same.push(coherence([toWave(x), toWave(m, off)]).score);
  }
  // Different stomps: every B trigger more than 3 s away (after offset), re-timed to start exactly with x.
  for (const y of b) if (Math.abs(y.tMs - off - x.tMs) > 3000) diff.push(coherence([toWave(x), { ...toWave(y), t0Ms: x.tMs - 300 }]).score);
}
const stat = (v: number[]) => {
  const s = [...v].sort((p, q) => p - q);
  const q = (f: number) => s[Math.min(s.length - 1, Math.floor(f * s.length))] ?? NaN;
  return `n=${s.length} median=${q(0.5).toFixed(2)} p10=${q(0.1).toFixed(2)} p90=${q(0.9).toFixed(2)}`;
};
console.log(`phones ${A}, ${B}; clock offset B−A = ${(off / 1000).toFixed(2)} s`);
console.log(`same stomp       : ${stat(same)}`);
console.log(`different stomps : ${stat(diff)}`);
for (const th of [0.4, 0.5, 0.6, 0.7]) {
  const tpr = same.filter((s) => s >= th).length / Math.max(1, same.length);
  const fpr = diff.filter((s) => s >= th).length / Math.max(1, diff.length);
  console.log(`threshold ${th.toFixed(1)}: same-stomp pass ${(100 * tpr).toFixed(0)}%  different-stomp pass ${(100 * fpr).toFixed(0)}%`);
}
