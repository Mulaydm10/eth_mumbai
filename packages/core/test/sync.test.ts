import { describe, expect, it } from "vitest";
import { SYNC_TONES, SYNC_TONE_MS, ToneSyncDetector, alignBySound, correctTime, goertzel } from "../src/sync";

describe("alignBySound", () => {
  it("removes a 3.3 s clock gap between two phones (the real test2 case)", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 100_000 },
      { sensor: "b", tMs: 103_300 },
    ])!;
    // The same stomp stamped 3.3 s apart by the two raw clocks lands at the same corrected time.
    expect(Math.abs(correctTime("a", 200_000, s) - correctTime("b", 203_300, s))).toBeLessThan(1);
  });

  it("uses the newest chirp session with >= 2 phones and ignores lone anchors", () => {
    const s = alignBySound([
      { sensor: "a", tMs: 1_000 },
      { sensor: "b", tMs: 1_500 },
      { sensor: "a", tMs: 500_000 }, // newer, but only one phone heard it
    ])!;
    expect(s.corrections.get("b")! - s.corrections.get("a")!).toBe(500);
  });

  it("returns null when no session has two phones", () => {
    expect(alignBySound([{ sensor: "a", tMs: 1 }])).toBeNull();
  });
});

describe("ToneSyncDetector", () => {
  const FS = 48_000;
  const BLOCK = 256;
  function signal(startMs: number, totalMs: number, noise = 0.01) {
    const n = Math.round((totalMs / 1000) * FS);
    const x = new Float32Array(n);
    let seed = 7;
    for (let i = 0; i < n; i++) {
      seed = (seed * 16807) % 2147483647;
      x[i] = (seed / 2147483647 - 0.5) * noise;
      const tMs = (i / FS) * 1000;
      const k = Math.floor((tMs - startMs) / SYNC_TONE_MS);
      if (tMs >= startMs && k < SYNC_TONES.length) x[i]! += 0.3 * Math.sin((2 * Math.PI * SYNC_TONES[k]! * i) / FS);
    }
    return x;
  }
  function run(x: Float32Array) {
    const hits: number[] = [];
    const d = new ToneSyncDetector(FS, (t) => hits.push(t));
    for (let i = 0; i + BLOCK <= x.length; i += BLOCK) d.push(x.subarray(i, i + BLOCK), (i / FS) * 1000);
    return hits;
  }

  it("detects the 3-tone sync with onset accurate to ~1 block (5 ms)", () => {
    const hits = run(signal(1000, 2000));
    expect(hits).toHaveLength(1);
    expect(Math.abs(hits[0]! - 1000)).toBeLessThan(12);
  });

  it("ignores noise and a single tone that never completes the sequence", () => {
    expect(run(signal(99_999, 2000))).toHaveLength(0);
    const x = new Float32Array(FS);
    for (let i = 0; i < x.length; i++) x[i] = 0.3 * Math.sin((2 * Math.PI * 3000 * i) / FS);
    expect(run(x)).toHaveLength(0);
  });

  it("goertzel picks the right bin", () => {
    const x = Array.from({ length: 512 }, (_, i) => Math.sin((2 * Math.PI * 5000 * i) / FS));
    expect(goertzel(x, 5000, FS)).toBeGreaterThan(50 * goertzel(x, 3000, FS));
  });
});
