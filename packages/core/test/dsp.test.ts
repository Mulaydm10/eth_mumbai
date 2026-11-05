import { describe, expect, it } from "vitest";
import { StaLta, VelocityTracker, defaultBand, dominantHz, lowFreqRatio, measuredRateHz } from "../src/dsp";

const FS = 60; // Chrome's Generic Sensor cap

function sine(fHz: number, ampMs2: number, seconds: number, fs = FS) {
  const n = Math.round(seconds * fs);
  return Array.from({ length: n }, (_, i) => ({ t: (i * 1000) / fs, x: 0, y: 0, z: ampMs2 * Math.sin((2 * Math.PI * fHz * i) / fs) }));
}

describe("VelocityTracker (PPV)", () => {
  it("recovers velocity amplitude of a steady 10 Hz vibration within 20%", () => {
    const f = 10;
    const targetMmS = 5; // a typical residential-limit-scale vibration
    const amp = (targetMmS / 1000) * 2 * Math.PI * f; // a = v * 2*pi*f
    const vt = new VelocityTracker(defaultBand(FS));
    let peak = 0;
    sine(f, amp, 4).forEach((s, i) => {
      const { velMmS } = vt.push(s);
      if (i > FS * 2) peak = Math.max(peak, velMmS); // skip filter transients
    });
    expect(peak).toBeGreaterThan(targetMmS * 0.8);
    expect(peak).toBeLessThan(targetMmS * 1.2);
  });

  it("reads near zero for a still phone", () => {
    const vt = new VelocityTracker(defaultBand(FS));
    let peak = 0;
    for (let i = 0; i < FS * 3; i++) peak = Math.max(peak, vt.push({ t: i, x: 0, y: 0, z: 0 }).velMmS);
    expect(peak).toBeLessThan(1e-9);
  });
});

describe("features", () => {
  it("measures the delivered sample rate", () => {
    expect(measuredRateHz([0, 16.7, 33.3, 50, 66.7, 83.3])).toBeCloseTo(60, 0);
  });
  it("labels dominant frequency", () => {
    const x = sine(12, 1, 1).map((s) => s.z);
    expect(dominantHz(x, FS)).toBeGreaterThan(10);
    expect(dominantHz(x, FS)).toBeLessThan(14);
  });
  it("hand sway (1.5 Hz) is low-frequency dominated; structural 15 Hz is not", () => {
    expect(lowFreqRatio(sine(1.5, 1, 2).map((s) => s.z), FS)).toBeGreaterThan(0.7);
    expect(lowFreqRatio(sine(15, 1, 2).map((s) => s.z), FS)).toBeLessThan(0.1);
  });
});

describe("StaLta trigger", () => {
  it("fires on an impact after quiet, stays low on noise floor", () => {
    const tr = new StaLta(0.2, 5, FS);
    let rng = 1;
    const noise = () => ((rng = (rng * 16807) % 2147483647) / 2147483647 - 0.5) * 0.01;
    let maxQuiet = 0;
    for (let i = 0; i < FS * 6; i++) maxQuiet = Math.max(maxQuiet, tr.push(noise()));
    let maxHit = 0;
    for (let i = 0; i < FS * 0.3; i++) maxHit = Math.max(maxHit, tr.push(0.5 * Math.sin(i) + noise()));
    expect(maxQuiet).toBeLessThan(3);
    expect(maxHit).toBeGreaterThan(5);
  });
});
