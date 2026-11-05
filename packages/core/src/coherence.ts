// Waveform coherence: do the phones in a confirmed event look like ONE vibration source?
//
// A k-of-n quorum alone can be gamed by neighbours stomping their own phones at the same moment. One real source
// (a pile driver, a breaker, a stomp in the room) reaches every phone through the same structure, so its signals share:
//   1. envelope timing: the energy bursts line up within a physically plausible lag (here bounded by clock-sync error),
//   2. spectral shape: the same source through the same building gives a similar spectrum,
//   3. dominant frequency.
// Independent local impacts on different phones differ in shape and spectrum. The score is deterministic, so any
// verifier recomputes the same number from the Arkiv waveform excerpts. It is an indicator, not proof: measured
// thresholds come from real-phone experiments (EXP-####), and the report says so.
import { Biquad } from "./dsp";

export interface Wave {
  sensor: string;
  fs: number;
  x: number[];
  y: number[];
  z: number[];
  /** Wall-clock time (ms) of sample 0 (trigger time − pre-roll, after any clock correction). */
  t0Ms: number;
}

export interface CoherenceOptions {
  maxLagMs?: number; // largest plausible offset between phones (clock-sync error + propagation)
  gridHz?: number; // common resampling rate
  bandHz?: [number, number];
}

export interface PairScore {
  a: string;
  b: string;
  envelope: number; // best normalized cross-correlation of envelopes, 0..1
  spectral: number; // cosine similarity of band spectra, 0..1
  freqAgree: number; // 1 when dominant frequencies match, falls off with relative difference
  lagMs: number; // lag at the envelope peak
  score: number;
}

export interface CoherenceResult {
  score: number; // median pair score, 0..1
  verdict: "coherent" | "uncertain" | "suspect";
  pairs: PairScore[];
}

export const COHERENT_AT = 0.6;
export const SUSPECT_BELOW = 0.4;

/** Band-pass each axis, combine to a magnitude signal, return it with its own time base. */
function prep(w: Wave, band: [number, number]) {
  const hi = Math.min(band[1], w.fs * 0.42);
  const axes = [w.x, w.y, w.z].map((a) => {
    const m = a.reduce((s, v) => s + v, 0) / Math.max(1, a.length);
    const hp = Biquad.highpass(band[0], w.fs);
    const lp = Biquad.lowpass(hi, w.fs);
    return a.map((v) => lp.step(hp.step(v - m)));
  });
  const n = Math.min(axes[0]!.length, axes[1]!.length, axes[2]!.length);
  const sig = Array.from({ length: n }, (_, i) => Math.hypot(axes[0]![i]!, axes[1]![i]!, axes[2]![i]!));
  return { sig, fs: w.fs, t0: w.t0Ms };
}

/** Moving-RMS envelope (window ms), resampled onto an absolute-time grid. */
function envelopeOnGrid(p: { sig: number[]; fs: number; t0: number }, gridHz: number, winMs = 60) {
  const w = Math.max(1, Math.round((winMs / 1000) * p.fs));
  const env: number[] = [];
  let acc = 0;
  const q: number[] = [];
  for (const v of p.sig) {
    q.push(v * v);
    acc += v * v;
    if (q.length > w) acc -= q.shift()!;
    env.push(Math.sqrt(acc / q.length));
  }
  const dur = (env.length / p.fs) * 1000;
  const n = Math.floor((dur / 1000) * gridHz);
  const out: { t: number; v: number }[] = [];
  for (let i = 0; i < n; i++) {
    const tRel = (i / gridHz) * 1000;
    const f = (tRel / 1000) * p.fs;
    const k = Math.floor(f);
    const v = k + 1 < env.length ? env[k]! + (env[k + 1]! - env[k]!) * (f - k) : env[env.length - 1]!;
    out.push({ t: p.t0 + tRel, v });
  }
  return out;
}

function pearson(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  if (n < 8) return 0;
  let ma = 0;
  let mb = 0;
  for (let i = 0; i < n; i++) (ma += a[i]!), (mb += b[i]!);
  ma /= n;
  mb /= n;
  let sab = 0;
  let saa = 0;
  let sbb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i]! - ma;
    const db = b[i]! - mb;
    sab += da * db;
    saa += da * da;
    sbb += db * db;
  }
  return saa > 0 && sbb > 0 ? sab / Math.sqrt(saa * sbb) : 0;
}

/** Best envelope correlation over lags in [-maxLag, +maxLag] on the shared absolute-time grid. */
function envelopeXcorr(ea: { t: number; v: number }[], eb: { t: number; v: number }[], gridHz: number, maxLagMs: number) {
  const step = 1000 / gridHz;
  const maxLag = Math.round(maxLagMs / step);
  // Index of grid b relative to grid a at zero lag (both grids share step).
  const base = Math.round((eb[0]!.t - ea[0]!.t) / step);
  let best = -1;
  let bestLag = 0;
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    const shift = base + lag; // ea[i] pairs with eb[i - shift]
    const av: number[] = [];
    const bv: number[] = [];
    for (let i = 0; i < ea.length; i++) {
      const j = i - shift;
      if (j >= 0 && j < eb.length) (av.push(ea[i]!.v), bv.push(eb[j]!.v));
    }
    const r = pearson(av, bv);
    if (r > best) (best = r), (bestLag = lag * step);
  }
  return { r: Math.max(0, best), lagMs: bestLag };
}

/** Normalized power in 1-Hz bins across the band (Goertzel on the magnitude signal minus its mean). */
function bandSpectrum(p: { sig: number[]; fs: number }, band: [number, number]) {
  const m = p.sig.reduce((s, v) => s + v, 0) / Math.max(1, p.sig.length);
  const x = p.sig.map((v) => v - m);
  const hi = Math.min(band[1], p.fs * 0.42);
  const spec: number[] = [];
  for (let f = Math.ceil(band[0]); f <= hi; f++) {
    const k = (2 * Math.PI * f) / p.fs;
    const c = 2 * Math.cos(k);
    let s1 = 0;
    let s2 = 0;
    for (const v of x) {
      const s0 = v + c * s1 - s2;
      s2 = s1;
      s1 = s0;
    }
    spec.push(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2));
  }
  const norm = Math.hypot(...spec) || 1;
  return spec.map((v) => v / norm);
}

const cosine = (a: number[], b: number[]) => {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i]! * b[i]!;
  return Math.max(0, Math.min(1, s));
};
const peakHz = (spec: number[], lo: number) => lo + spec.indexOf(Math.max(...spec));

export function coherence(waves: Wave[], opt: CoherenceOptions = {}): CoherenceResult {
  const band = opt.bandHz ?? [2, 25];
  const gridHz = opt.gridHz ?? 100;
  const maxLagMs = opt.maxLagMs ?? 250;
  const prepped = waves.map((w) => ({ w, p: prep(w, band) }));
  const envs = prepped.map(({ p }) => envelopeOnGrid(p, gridHz));
  const specs = prepped.map(({ p }) => bandSpectrum(p, band));
  const lo = Math.ceil(band[0]);
  const pairs: PairScore[] = [];
  for (let i = 0; i < waves.length; i++) {
    for (let j = i + 1; j < waves.length; j++) {
      if (!envs[i]!.length || !envs[j]!.length) continue;
      const { r, lagMs } = envelopeXcorr(envs[i]!, envs[j]!, gridHz, maxLagMs);
      const spectral = cosine(specs[i]!, specs[j]!);
      const fa = peakHz(specs[i]!, lo);
      const fb = peakHz(specs[j]!, lo);
      const freqAgree = Math.exp(-Math.abs(fa - fb) / Math.max(1, Math.min(fa, fb)) / 0.3);
      // Weights: shape over time and spectrum carry most of the evidence; peak frequency is a coarse sanity check.
      const score = 0.4 * r + 0.4 * spectral + 0.2 * freqAgree;
      pairs.push({ a: waves[i]!.sensor, b: waves[j]!.sensor, envelope: r, spectral, freqAgree, lagMs, score });
    }
  }
  const sorted = pairs.map((p) => p.score).sort((a, b) => a - b);
  const score = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2]! : (sorted[sorted.length / 2 - 1]! + sorted[sorted.length / 2]!) / 2) : 0;
  const verdict = score >= COHERENT_AT ? "coherent" : score < SUSPECT_BELOW ? "suspect" : "uncertain";
  return { score, verdict, pairs };
}
