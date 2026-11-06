// Offline clock alignment by a shared sound ("sync chirp"), v2.
//
// One phone EMITS three tones (3/5/7 kHz) in one of 6 orders; the order is the chirp's ID (0-5), so back-to-back chirps
// never merge. Every phone that HEARS it records the onset in its own wall clock. The EMITTER records the moment its
// audio clock says the first tone left the speaker, because the playing phone often cannot hear itself (real test,
// 6 Nov: 18 of 22 anchors were heard by only one phone). Anchors with the same chirp ID inside a short span form a
// session; each phone's clock error vs the session median is its correction. No internet or server involved.

export interface SyncAnchor {
  sensor: string;
  tMs: number; // the phone's own wall-clock time of the chirp onset (heard) or emission (emitted)
  chirp?: number; // 0-5: which tone order (absent on v1 anchors)
  role?: "emit" | "hear";
}

export interface SyncSession {
  refMs: number; // median anchor time
  chirp?: number;
  corrections: Map<string, number>; // sensor → ms to SUBTRACT from that phone's timestamps
}

export const SYNC_TONES = [3000, 5000, 7000] as const; // Hz
export const SYNC_TONE_MS = 90;

/** The 6 orders of the three tones; index = chirp ID. */
export const SYNC_ORDERS: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];
export const chirpIdOf = (order: readonly number[]) => SYNC_ORDERS.findIndex((o) => o[0] === order[0] && o[1] === order[1] && o[2] === order[2]);

/**
 * Group anchors into sessions. v2 anchors group by chirp ID within `spreadMs` (phones' clock disagreement bound).
 * v1 anchors (no chirp ID) fall back to time-only grouping. Newest session with >= minPhones distinct phones wins.
 */
export function alignBySound(anchors: SyncAnchor[], spreadMs = 15_000, minPhones = 2): SyncSession | null {
  const sorted = [...anchors].sort((a, b) => a.tMs - b.tMs);
  const sessions: { chirp?: number; items: SyncAnchor[] }[] = [];
  for (const a of sorted) {
    // Find an open session with the same chirp ID (or both undefined) that started within spreadMs.
    const s = [...sessions].reverse().find((x) => x.chirp === a.chirp && a.tMs - x.items[0]!.tMs <= spreadMs);
    if (s) s.items.push(a);
    else sessions.push({ chirp: a.chirp, items: [a] });
  }
  const ranked = sessions
    .map((s) => {
      // One anchor per phone: prefer its "hear" (acoustic) over "emit" if both exist, then the earliest.
      const per = new Map<string, SyncAnchor>();
      for (const a of s.items) {
        const cur = per.get(a.sensor);
        if (!cur || (cur.role === "emit" && a.role === "hear")) per.set(a.sensor, a);
      }
      return { s, per };
    })
    .filter((x) => x.per.size >= minPhones)
    .sort((a, b) => b.s.items[0]!.tMs - a.s.items[0]!.tMs);
  const best = ranked[0];
  if (!best) return null;
  const ts = [...best.per.values()].map((a) => a.tMs).sort((a, b) => a - b);
  const mid = ts.length % 2 ? ts[(ts.length - 1) / 2]! : (ts[ts.length / 2 - 1]! + ts[ts.length / 2]!) / 2;
  return { refMs: mid, chirp: best.s.chirp, corrections: new Map([...best.per].map(([k, a]) => [k, a.tMs - mid])) };
}

/** Apply a session's corrections (phones without an anchor are left as they are). */
export function correctTime(sensor: string, tMs: number, s: SyncSession | null): number {
  return s ? tMs - (s.corrections.get(sensor) ?? 0) : tMs;
}

/** Goertzel power of one frequency in a block (cheap single-bin DFT). */
export function goertzel(block: Float32Array | number[], fHz: number, fs: number): number {
  const k = (2 * Math.PI * fHz) / fs;
  const c = 2 * Math.cos(k);
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < block.length; i++) {
    const s0 = (block[i] as number) + c * s1 - s2;
    s2 = s1;
    s1 = s0;
  }
  return (s1 * s1 + s2 * s2 - c * s1 * s2) / block.length;
}

/**
 * Streaming detector for the 3-tone sync signal in ANY of the 6 orders. Feed fixed-size blocks with their start time.
 * Fires once per signal with (onset of the first tone, chirp ID).
 */
export class ToneSyncDetector {
  private seq: number[] = [];
  private onset = 0;
  private stageAt = 0;
  private noise = 1e-9;
  private lastFire = -Infinity;
  constructor(
    private fs: number,
    private onDetect: (onsetMs: number, chirp: number) => void,
  ) {}

  /** Which tone (0-2) dominates this block, if any. */
  private dominant(block: Float32Array | number[]): number {
    const p = SYNC_TONES.map((f) => goertzel(block, f, this.fs));
    let total = 0;
    for (let i = 0; i < block.length; i++) total += (block[i] as number) ** 2;
    total /= block.length;
    let best = -1;
    for (let i = 0; i < 3; i++) {
      const others = p.filter((_, j) => j !== i);
      // A pure tone puts ~N/2× the block's mean power into its bin; noise ~1×. Scale-free test + beats the others.
      if (total > 0 && p[i]! > 0.1 * total * block.length && p[i]! > 4 * Math.max(...others) && p[i]! > 30 * this.noise) best = i;
    }
    if (best < 0) this.noise = 0.98 * this.noise + 0.02 * Math.max(Math.max(...p), 1e-12);
    return best;
  }

  push(block: Float32Array | number[], tMs: number) {
    const d = this.dominant(block);
    const n = this.seq.length;
    if (n > 0 && tMs - this.stageAt > SYNC_TONE_MS * 2.5) this.seq = []; // sequence broken: not our signal
    if (d < 0) return;
    if (this.seq.length === 0) {
      if (tMs - this.lastFire < 1500) return;
      this.seq = [d];
      this.onset = tMs;
      this.stageAt = tMs;
      return;
    }
    const last = this.seq[this.seq.length - 1]!;
    if (d === last) {
      this.stageAt = tMs; // still the same tone
      return;
    }
    if (this.seq.includes(d) || tMs - this.stageAt < 0) {
      this.seq = [];
      return;
    }
    this.seq.push(d);
    this.stageAt = tMs;
    if (this.seq.length === 3) {
      const id = chirpIdOf(this.seq);
      this.lastFire = tMs;
      this.seq = [];
      if (id >= 0) this.onDetect(this.onset, id);
    }
  }
}
