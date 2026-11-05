import { describe, expect, it } from "vitest";
import { coherence, type Wave } from "../src/coherence";

const FS = 60;
const N = 90; // 1.5 s excerpt, like the real triggers

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5);
}

/** A damped sinusoid burst at `fHz` starting `onsetMs` into the excerpt, split across axes by `dir`, plus noise. */
function burst(sensor: string, fHz: number, onsetMs: number, gain: number, dir: [number, number, number], seed: number, t0Ms = 0, decay = 6): Wave {
  const r = rng(seed);
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / FS) * 1000 - onsetMs;
    const s = t >= 0 ? gain * Math.exp((-decay * t) / 1000) * Math.sin((2 * Math.PI * fHz * t) / 1000) : 0;
    x.push(dir[0] * s + 0.02 * r());
    y.push(dir[1] * s + 0.02 * r());
    z.push(9.8 + dir[2] * s + 0.02 * r()); // gravity on z, removed by the band-pass
  }
  return { sensor, fs: FS, x, y, z, t0Ms };
}

describe("coherence", () => {
  it("one source at 3 phones (different gains, orientations, ~40 ms delays, clock offsets) is coherent", () => {
    const w = [
      burst("a", 12, 300, 3.0, [0.2, 0.3, 0.9], 1, 10_000),
      burst("b", 12, 340, 1.2, [0.9, 0.1, 0.4], 2, 10_020),
      burst("c", 12, 280, 0.6, [0.4, 0.8, 0.4], 3, 9_990),
    ];
    const r = coherence(w);
    expect(r.verdict).toBe("coherent");
    expect(r.score).toBeGreaterThan(0.6);
  });

  it("three neighbours stomping their own phones (different frequencies, decays and timing) is suspect", () => {
    const w = [
      burst("a", 6, 200, 3, [0, 0, 1], 4, 10_000, 3),
      burst("b", 17, 700, 3, [0, 0, 1], 5, 10_000, 14),
      burst("c", 23, 1000, 3, [0, 0, 1], 6, 10_000, 25),
    ];
    const r = coherence(w);
    expect(r.score).toBeLessThan(0.4);
    expect(r.verdict).toBe("suspect");
  });

  it("is deterministic and order-independent in its score", () => {
    const w = [burst("a", 10, 300, 2, [0, 0, 1], 7), burst("b", 10, 320, 1, [1, 0, 0], 8)];
    expect(coherence(w).score).toBeCloseTo(coherence([...w].reverse()).score, 10);
  });

  it("reports the envelope lag between phones", () => {
    const w = [burst("a", 12, 300, 2, [0, 0, 1], 9, 0), burst("b", 12, 450, 2, [0, 0, 1], 10, 0)];
    const p = coherence(w).pairs[0]!;
    expect(Math.abs(Math.abs(p.lagMs) - 150)).toBeLessThanOrEqual(30);
  });
});
