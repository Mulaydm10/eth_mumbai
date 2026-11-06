// Multi-phone quorum: an event is confirmed only when >= k distinct sensors trigger within one time window.
// Deterministic and pure, so every viewer (dashboard, judge, court) recomputes the same answer from the same triggers.

export interface Trigger {
  id: string; // entity key or any unique id
  sensor: string; // sensor id (later: ENS subname)
  creator: string; // address that wrote it (Arkiv $creator)
  tMs: number; // wall-clock ms
  ppvMmS: number;
  fDomHz: number;
  label: "structural" | "handling";
  createdAtMs?: number; // when Arkiv recorded it ($createdAt block → wall time); used by the as-of rule (registry.ts)
}

export interface QuorumParams {
  k: number; // distinct sensors required
  windowMs: number; // all members within this span
  /** Optional registry check: returns true if this creator may speak for this sensor at time t. */
  isLive?: (sensor: string, creator: string, tMs: number, t: Trigger) => boolean;
}

export type RejectReason = "handling" | "not-registered" | "no-quorum";

export interface ConfirmedEvent {
  tMs: number; // median member time
  sensors: string[];
  members: Trigger[];
  ppvMinMmS: number;
  ppvMaxMmS: number;
}

export interface QuorumResult {
  events: ConfirmedEvent[];
  rejected: { trigger: Trigger; reason: RejectReason }[];
}

export function computeQuorum(triggers: Trigger[], p: QuorumParams): QuorumResult {
  const rejected: QuorumResult["rejected"] = [];
  const valid: Trigger[] = [];
  for (const t of triggers) {
    if (p.isLive && !p.isLive(t.sensor, t.creator, t.tMs, t)) rejected.push({ trigger: t, reason: "not-registered" });
    else if (t.label !== "structural") rejected.push({ trigger: t, reason: "handling" });
    else valid.push(t);
  }
  // Stable, deterministic order: time, then id.
  valid.sort((a, b) => a.tMs - b.tMs || a.id.localeCompare(b.id));

  const used = new Set<string>();
  const events: ConfirmedEvent[] = [];
  for (let i = 0; i < valid.length; i++) {
    const anchor = valid[i]!;
    if (used.has(anchor.id)) continue;
    // First trigger per sensor inside [anchor, anchor + window].
    const bySensor = new Map<string, Trigger>();
    for (let j = i; j < valid.length && valid[j]!.tMs - anchor.tMs <= p.windowMs; j++) {
      const c = valid[j]!;
      if (!used.has(c.id) && !bySensor.has(c.sensor)) bySensor.set(c.sensor, c);
    }
    if (bySensor.size >= p.k) {
      const members = [...bySensor.values()];
      members.forEach((m) => used.add(m.id));
      // Duplicate triggers from member sensors inside the same window belong to this event too.
      for (let j = i; j < valid.length && valid[j]!.tMs - anchor.tMs <= p.windowMs; j++) {
        if (bySensor.has(valid[j]!.sensor)) used.add(valid[j]!.id);
      }
      const ts = members.map((m) => m.tMs).sort((a, b) => a - b);
      const ppv = members.map((m) => m.ppvMmS);
      events.push({
        tMs: ts[Math.floor(ts.length / 2)]!,
        sensors: members.map((m) => m.sensor).sort(),
        members,
        ppvMinMmS: Math.min(...ppv),
        ppvMaxMmS: Math.max(...ppv),
      });
    } else {
      used.add(anchor.id);
      rejected.push({ trigger: anchor, reason: "no-quorum" });
    }
  }
  return { events, rejected };
}
