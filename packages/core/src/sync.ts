// Offline clock alignment by a shared sound ("sync chirp").
// Every phone in the room hears the same chirp at (almost) the same instant (sound: ~3 ms per metre) and records
// that moment in ITS OWN clock as an anchor. Anchors from one chirp form a session; each phone's clock error relative
// to the session median is its correction. No internet or server is involved in producing anchors.

export interface SyncAnchor {
  sensor: string;
  tMs: number; // the phone's own wall-clock time when it heard the chirp
}

export interface SyncSession {
  refMs: number; // median anchor time (the shared instant, in "median phone" time)
  corrections: Map<string, number>; // sensor → ms to SUBTRACT from that phone's timestamps
}

/**
 * Group anchors into sessions (one chirp heard by several phones), newest session with >= minPhones wins.
 * Anchors of one chirp lie within the phones' clock disagreement (seconds), so `maxSpreadMs` bounds a session;
 * separate chirps must be further apart than that.
 */
export function alignBySound(anchors: SyncAnchor[], maxSpreadMs = 30_000, minPhones = 2): SyncSession | null {
  const sorted = [...anchors].sort((a, b) => a.tMs - b.tMs);
  const sessions: SyncAnchor[][] = [];
  for (const a of sorted) {
    const cur = sessions[sessions.length - 1];
    if (cur && a.tMs - cur[0]!.tMs <= maxSpreadMs) cur.push(a);
    else sessions.push([a]);
  }
  for (let i = sessions.length - 1; i >= 0; i--) {
    // One anchor per phone per session: keep the first (a phone may re-hear an echo).
    const first = new Map<string, number>();
    for (const a of sessions[i]!) if (!first.has(a.sensor)) first.set(a.sensor, a.tMs);
    if (first.size < minPhones) continue;
    const ts = [...first.values()].sort((a, b) => a - b);
    const mid = ts.length % 2 ? ts[(ts.length - 1) / 2]! : (ts[ts.length / 2 - 1]! + ts[ts.length / 2]!) / 2;
    return { refMs: mid, corrections: new Map([...first].map(([s, t]) => [s, t - mid])) };
  }
  return null;
}

/** Apply a session's corrections (phones without an anchor are left as they are). */
export function correctTime(sensor: string, tMs: number, s: SyncSession | null): number {
  return s ? tMs - (s.corrections.get(sensor) ?? 0) : tMs;
}

/** Goertzel power of one frequency in a block (cheap single-bin DFT), used to detect the sync tones. */
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

export const SYNC_TONES = [3000, 5000, 7000] as const; // Hz, played in this order
export const SYNC_TONE_MS = 90;

/**
 * Streaming detector for the 3-tone sync signal. Feed fixed-size blocks with their start time (ms).
 * Fires once per signal with the onset time of the FIRST tone (the shared instant).
 */
export class ToneSyncDetector {
  private stage = 0;
  private onset = 0;
  private stageAt = 0;
  private noise = 1e-9;
  private lastFire = -Infinity;
  constructor(
    private fs: number,
    private onDetect: (onsetMs: number) => void,
  ) {}

  push(block: Float32Array | number[], tMs: number) {
    const p = SYNC_TONES.map((f) => goertzel(block, f, this.fs));
    let total = 0;
    for (let i = 0; i < block.length; i++) total += (block[i] as number) ** 2;
    total /= block.length;
    const want = p[this.stage]!;
    // A pure tone puts ~N/2 times the block's mean power into its Goertzel bin; white noise puts ~1x. So "on" means
    // the bin holds a large share of the block (scale-free), beats the other two tones, and clears the noise floor.
    const others = p.filter((_, i) => i !== this.stage);
    const on = total > 0 && want > 0.1 * total * block.length && want > 4 * Math.max(...others) && want > 30 * this.noise;
    if (!on && this.stage === 0) this.noise = 0.98 * this.noise + 0.02 * Math.max(p[0]!, 1e-12);
    if (on) {
      if (this.stage === 0) {
        if (tMs - this.lastFire < 3000) return;
        this.onset = tMs;
        this.stage = 1;
        this.stageAt = tMs;
      } else if (tMs - this.stageAt >= SYNC_TONE_MS * 0.5) {
        this.stage++;
        this.stageAt = tMs;
        if (this.stage === SYNC_TONES.length) {
          this.lastFire = tMs;
          this.stage = 0;
          this.onDetect(this.onset);
        }
      }
    } else if (this.stage > 0 && tMs - this.stageAt > SYNC_TONE_MS * 2.5) {
      this.stage = 0; // sequence broken: not our signal
    }
  }
}
