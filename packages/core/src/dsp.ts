// Signal processing for one phone's accelerometer stream.
// Units: acceleration in m/s^2 (gravity already removed by LinearAccelerationSensor), time in ms,
// velocity reported in mm/s (PPV = peak particle velocity, the standard building-vibration measure).

export interface Sample {
  t: number; // ms
  x: number;
  y: number;
  z: number;
}

/** Second-order IIR section (RBJ audio-EQ cookbook), direct form I. */
export class Biquad {
  private x1 = 0;
  private x2 = 0;
  private y1 = 0;
  private y2 = 0;
  constructor(
    private b0: number,
    private b1: number,
    private b2: number,
    private a1: number,
    private a2: number,
  ) {}

  static lowpass(fc: number, fs: number, q = Math.SQRT1_2): Biquad {
    const w0 = (2 * Math.PI * fc) / fs;
    const c = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    return new Biquad((1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - alpha) / a0);
  }

  static highpass(fc: number, fs: number, q = Math.SQRT1_2): Biquad {
    const w0 = (2 * Math.PI * fc) / fs;
    const c = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    return new Biquad((1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - alpha) / a0);
  }

  step(x: number): number {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

export interface BandConfig {
  fs: number; // nominal sample rate (Hz)
  lowHz: number; // high-pass corner: removes tilt / slow drift / hand sway
  highHz: number; // low-pass corner: must stay below fs/2
}

export const defaultBand = (fs: number): BandConfig => ({ fs, lowHz: 2, highHz: Math.min(25, fs * 0.42) });

/** Per-axis band-pass + integration to velocity. One instance per phone stream. */
export class VelocityTracker {
  private hp: Biquad[];
  private lp: Biquad[];
  private vhp: Biquad[];
  private prevA = [0, 0, 0];
  private v = [0, 0, 0];
  private readonly dt: number;

  constructor(private cfg: BandConfig) {
    this.hp = [0, 1, 2].map(() => Biquad.highpass(cfg.lowHz, cfg.fs));
    this.lp = [0, 1, 2].map(() => Biquad.lowpass(cfg.highHz, cfg.fs));
    // A second high-pass on velocity removes integration drift.
    this.vhp = [0, 1, 2].map(() => Biquad.highpass(cfg.lowHz, cfg.fs));
    this.dt = 1 / cfg.fs;
  }

  /** Returns band-passed acceleration magnitude (m/s^2) and velocity magnitude (mm/s). */
  push(s: Sample): { accBand: number; velMmS: number } {
    const raw = [s.x, s.y, s.z];
    let a2 = 0;
    let v2 = 0;
    for (let i = 0; i < 3; i++) {
      const a = this.lp[i]!.step(this.hp[i]!.step(raw[i]!));
      const vInt = this.v[i]! + ((a + this.prevA[i]!) / 2) * this.dt;
      this.prevA[i] = a;
      this.v[i] = vInt;
      const vf = this.vhp[i]!.step(vInt);
      a2 += a * a;
      v2 += vf * vf;
    }
    return { accBand: Math.sqrt(a2), velMmS: Math.sqrt(v2) * 1000 };
  }
}

/** Short-term / long-term average trigger on band-passed acceleration. */
export class StaLta {
  private sta = 0;
  private lta = 0;
  private n = 0;
  constructor(
    private staS: number,
    private ltaS: number,
    private fs: number,
  ) {}
  push(x: number): number {
    const e = x * x;
    const as = 1 / Math.max(1, this.staS * this.fs);
    const al = 1 / Math.max(1, this.ltaS * this.fs);
    this.sta += as * (e - this.sta);
    this.lta += al * (e - this.lta);
    this.n++;
    // Warm-up: the LTA needs a few seconds before the ratio is meaningful.
    if (this.n < this.ltaS * this.fs * 0.5 || this.lta <= 1e-12) return 0;
    return this.sta / this.lta;
  }
}

/** Estimate the sample rate actually delivered (Hz) from timestamps: median interval. */
export function measuredRateHz(ts: number[]): number {
  if (ts.length < 3) return 0;
  const d: number[] = [];
  for (let i = 1; i < ts.length; i++) d.push(ts[i]! - ts[i - 1]!);
  d.sort((a, b) => a - b);
  const med = d[Math.floor(d.length / 2)]!;
  return med > 0 ? 1000 / med : 0;
}

/** Dominant frequency (Hz) of a short window by zero-crossing count. Cheap and adequate for a band label. */
export function dominantHz(x: number[], fs: number): number {
  if (x.length < 4) return 0;
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  let zc = 0;
  for (let i = 1; i < x.length; i++) {
    if ((x[i - 1]! - mean) * (x[i]! - mean) < 0) zc++;
  }
  return (zc / 2) * (fs / x.length);
}

/** Share of signal energy below `cutHz` (high for hand sway / handling, low for structural vibration). */
export function lowFreqRatio(x: number[], fs: number, cutHz = 3): number {
  if (x.length === 0) return 0;
  const lp = Biquad.lowpass(cutHz, fs);
  let lo = 0;
  let tot = 0;
  for (const v of x) {
    const l = lp.step(v);
    lo += l * l;
    tot += v * v;
  }
  return tot > 0 ? Math.min(1, lo / tot) : 0;
}
