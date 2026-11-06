// T13: "as-of" membership. A reading counts only if its phone was registered to the writing wallet
//   (a) at the reading's CLAIMED time (tMs, the phone's own clock), and
//   (b) at the time Arkiv RECORDED it ($createdAt block → wall time, which the phone cannot choose).
// (b) closes backdating: a revoked phone can't write today with yesterday's timestamp. (a) + (b) together mean a
// revocation (or name expiry) stops FUTURE readings only. Readings made and recorded while registered keep counting.
// Offline store-and-forward still works: a reading recorded late counts if the phone was still registered at upload.

export interface RegistrationInterval {
  label: string;
  owner: string; // wallet the name was registered to
  fromMs: number; // registration block time
  toMs: number; // min(unregistration block time, expiry); Infinity if neither
}

export interface AsOfOptions {
  /** A reading may not claim a time later than when Arkiv recorded it (+ this clock slack). */
  futureSlackMs?: number;
  /** Phones join and immediately sense; allow a claimed time this much before the registration block. */
  joinSlackMs?: number;
}

export type AsOfReason = "ok" | "not-registered-at-reading-time" | "not-registered-at-upload-time" | "claims-future-time" | "no-upload-time";

export function registeredAt(intervals: RegistrationInterval[], label: string, owner: string, atMs: number, slackBeforeMs = 0) {
  const o = owner.toLowerCase();
  return intervals.some((r) => r.label === label && r.owner.toLowerCase() === o && atMs >= r.fromMs - slackBeforeMs && atMs < r.toMs);
}

export function asOfCheck(
  intervals: RegistrationInterval[],
  r: { sensor: string; creator: string; tMs: number; createdAtMs?: number },
  opt: AsOfOptions = {},
): AsOfReason {
  const future = opt.futureSlackMs ?? 120_000;
  const join = opt.joinSlackMs ?? 120_000;
  if (r.createdAtMs === undefined || !Number.isFinite(r.createdAtMs)) return "no-upload-time";
  if (r.tMs > r.createdAtMs + future) return "claims-future-time";
  if (!registeredAt(intervals, r.sensor, r.creator, r.tMs, join)) return "not-registered-at-reading-time";
  if (!registeredAt(intervals, r.sensor, r.creator, r.createdAtMs, join)) return "not-registered-at-upload-time";
  return "ok";
}
