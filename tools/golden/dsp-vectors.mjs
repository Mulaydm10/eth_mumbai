// Regenerates app/src/test/resources/golden/dsp-v1.json by running the Tremor Witness repo's OWN dsp.ts
// (VelocityTracker, StaLta, dominantHz, lowFreqRatio, measuredRateHz) on synthetic signals, sample by sample.
// Usage: TW_REPO=/path/to/tremor-witness "$TW_REPO/node_modules/.bin/tsx" tools/golden/dsp-vectors.mjs > app/src/test/resources/golden/dsp-v1.json
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
const { VelocityTracker, StaLta, defaultBand, dominantHz, lowFreqRatio, measuredRateHz } = await import(R + "/packages/core/src/dsp.ts");
let rng = 12345; const rnd = () => ((rng = (rng * 16807) % 2147483647) / 2147483647 - 0.5);
function signal(kind, fs, seconds) {
  const n = Math.round(seconds * fs), out = [];
  for (let i = 0; i < n; i++) {
    const t = i / fs; let x = 0.002 * rnd(), y = 0.002 * rnd(), z = 0.002 * rnd();
    if (kind === "sine10") z += 0.3 * Math.sin(2 * Math.PI * 10 * t);
    if (kind === "quake") { const env = t > 3 ? Math.exp(-(t - 3) / 2) * Math.min(1, (t - 3) * 4) : 0;
      x += env * 2.0 * Math.sin(2 * Math.PI * 3.1 * t); y += env * 1.4 * Math.sin(2 * Math.PI * 4.7 * t + 1); z += env * 0.9 * Math.sin(2 * Math.PI * 7.3 * t); }
    if (kind === "sway") x += 1.5 * Math.sin(2 * Math.PI * 1.2 * t);
    if (kind === "knock") { if (Math.abs(t - 4) < 0.05) z += 3 * Math.sin(2 * Math.PI * 40 * t); }
    out.push({ t: i * 1000 / fs, x, y, z });
  }
  return out;
}
const cases = [];
for (const [kind, fs] of [["sine10", 60], ["quake", 100], ["sway", 50], ["knock", 200], ["quake", 400]]) {
  const s = signal(kind, fs, 8);
  const vt = new VelocityTracker(defaultBand(fs)), tr = new StaLta(0.15, 5, fs);
  const acc = [], vel = [], ratio = [];
  for (const p of s) { const r = vt.push(p); acc.push(r.accBand); vel.push(r.velMmS); ratio.push(tr.push(r.accBand)); }
  const z = s.map((p) => p.z), x = s.map((p) => p.x);
  cases.push({ kind, fs, samples: s, accBand: acc, velMmS: vel, ratio,
    dominantHzZ: dominantHz(z, fs), dominantHzX: dominantHz(x, fs), lowFreqZ: lowFreqRatio(z, fs), lowFreqX: lowFreqRatio(x, fs),
    rate: measuredRateHz(s.slice(0, 50).map((p) => p.t)) });
}
console.log(JSON.stringify({ source: "packages/core/src/dsp.ts", cases }));
