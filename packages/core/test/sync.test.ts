import { describe, expect, it } from "vitest";
import { DEFAULT_EMIT_LAG_MS, SYNC_ORDERS, SYNC_TONES, SYNC_TONE_MS, ToneSyncDetector, alignBySound, chirpIdOf, correctTime, emitLags, goertzel } from "../src/sync";

describe("alignBySound v2", () => {
  it("removes a 3.3 s clock gap between two phones", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 100_000, chirp: 2, role: "hear" },
      { sensor: "b", tMs: 103_300, chirp: 2, role: "hear" },
    ])!;
    expect(Math.abs(correctTime("a", 200_000, s) - correctTime("b", 203_300, s))).toBeLessThan(1);
  });

  it("works when the emitter cannot hear itself (emit anchor shifted by the default emit→hear lag)", () => {
    const s = alignBySound([
      { sensor: "player", tMs: 50_000, chirp: 4, role: "emit" },
      { sensor: "listener", tMs: 52_000, chirp: 4, role: "hear" },
    ])!;
    // Emission at 50 000 arrives ~320 ms later; the listener's clock is therefore 2000 - 320 ms ahead.
    expect(s.corrections.get("listener")! - s.corrections.get("player")!).toBe(2000 - DEFAULT_EMIT_LAG_MS);
  });

  it("learns a phone's own emit→hear lag from chirps it heard itself (real data: ~300–450 ms)", () => {
    const lags = emitLags([
      { sensor: "a", tMs: 1_000, chirp: 0, role: "emit" },
      { sensor: "a", tMs: 1_300, chirp: 0, role: "hear" },
      { sensor: "a", tMs: 9_000, chirp: 2, role: "emit" },
      { sensor: "a", tMs: 9_320, chirp: 2, role: "hear" },
    ]);
    expect(lags.get("a")).toBe(320);
    // Then a later chirp a played but did not hear, while b heard it at a's-clock + 5 000 + 320 → b is 5 s ahead.
    const s = alignBySound([
      { sensor: "a", tMs: 1_000, chirp: 0, role: "emit" },
      { sensor: "a", tMs: 1_300, chirp: 0, role: "hear" },
      { sensor: "a", tMs: 9_000, chirp: 2, role: "emit" },
      { sensor: "a", tMs: 9_320, chirp: 2, role: "hear" },
      { sensor: "a", tMs: 40_000, chirp: 5, role: "emit" },
      { sensor: "b", tMs: 45_320, chirp: 5, role: "hear" },
    ])!;
    expect(s.chirp).toBe(5);
    expect(s.corrections.get("b")! - s.corrections.get("a")!).toBe(5_000);
  });

  it("does NOT merge back-to-back chirps with different IDs (real test: chirps 4–10 s apart)", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 10_000, chirp: 0, role: "hear" },
      { sensor: "b", tMs: 10_050, chirp: 0, role: "hear" },
      { sensor: "a", tMs: 15_000, chirp: 3, role: "hear" }, // a newer chirp heard by one phone only
    ])!;
    expect(s.chirp).toBe(0);
    expect(Math.abs(s.corrections.get("b")! - s.corrections.get("a")! - 50)).toBeLessThan(1);
  });

  it("prefers a phone's acoustic 'hear' anchor over its own 'emit' anchor", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 1_000, chirp: 1, role: "emit" },
      { sensor: "a", tMs: 1_040, chirp: 1, role: "hear" },
      { sensor: "b", tMs: 1_045, chirp: 1, role: "hear" },
    ])!;
    expect(Math.abs(s.corrections.get("b")! - s.corrections.get("a")! - 5)).toBeLessThan(1);
  });

  it("splits a repeated chirp ID into separate sessions (only 6 IDs; repeats within seconds in the real test)", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 1_000, chirp: 3, role: "hear" },
      { sensor: "b", tMs: 1_004, chirp: 3, role: "hear" },
      { sensor: "a", tMs: 7_000, chirp: 3, role: "hear" }, // same ID 6 s later: a new chirp, not part of the first
      { sensor: "b", tMs: 7_130, chirp: 3, role: "hear" },
    ])!;
    // Newest session = the second one (b 130 ms after a), not a mix of the two.
    expect(Math.abs(s.corrections.get("b")! - s.corrections.get("a")! - 130)).toBeLessThan(1);
  });

  it("returns null when no session has two phones", () => {
    expect(alignBySound([{ sensor: "a", tMs: 1, chirp: 0 }])).toBeNull();
  });
});

describe("ToneSyncDetector v2 (any of 6 orders → chirp ID)", () => {
  const FS = 48_000;
  const BLOCK = 256;
  function signal(order: readonly number[], startMs: number, totalMs: number, noise = 0.01) {
    const n = Math.round((totalMs / 1000) * FS);
    const x = new Float32Array(n);
    let seed = 7;
    for (let i = 0; i < n; i++) {
      seed = (seed * 16807) % 2147483647;
      x[i] = (seed / 2147483647 - 0.5) * noise;
      const tMs = (i / FS) * 1000;
      const k = Math.floor((tMs - startMs) / SYNC_TONE_MS);
      if (tMs >= startMs && k < 3) x[i]! += 0.3 * Math.sin((2 * Math.PI * SYNC_TONES[order[k]!]! * i) / FS);
    }
    return x;
  }
  function run(x: Float32Array) {
    const hits: [number, number][] = [];
    const d = new ToneSyncDetector(FS, (t, id) => hits.push([t, id]));
    for (let i = 0; i + BLOCK <= x.length; i += BLOCK) d.push(x.subarray(i, i + BLOCK), (i / FS) * 1000);
    return hits;
  }

  it("decodes every one of the 6 orders with onset accurate to ~1 block", () => {
    SYNC_ORDERS.forEach((order, id) => {
      const hits = run(signal(order, 1000, 2000));
      expect(hits).toHaveLength(1);
      expect(hits[0]![1]).toBe(id);
      expect(Math.abs(hits[0]![0] - 1000)).toBeLessThan(12);
    });
  });

  it("ignores noise and a single steady tone", () => {
    expect(run(signal([0, 1, 2], 99_999, 2000))).toHaveLength(0);
    const x = new Float32Array(FS);
    for (let i = 0; i < x.length; i++) x[i] = 0.3 * Math.sin((2 * Math.PI * 3000 * i) / FS);
    expect(run(x)).toHaveLength(0);
  });

  it("chirpIdOf maps orders to 0-5 and goertzel picks the right bin", () => {
    expect(chirpIdOf([2, 1, 0])).toBe(5);
    const x = Array.from({ length: 512 }, (_, i) => Math.sin((2 * Math.PI * 5000 * i) / FS));
    expect(goertzel(x, 5000, FS)).toBeGreaterThan(50 * goertzel(x, 3000, FS));
  });
});
