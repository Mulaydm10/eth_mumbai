import { describe, expect, it } from "vitest";
import { computeQuorum, type Trigger } from "../src/quorum";

let n = 0;
const tr = (sensor: string, tMs: number, label: Trigger["label"] = "structural", ppv = 2): Trigger => ({
  id: `id${n++}`,
  sensor,
  creator: `0x${sensor}`,
  tMs,
  ppvMmS: ppv,
  fDomHz: 15,
  label,
});

describe("computeQuorum (smoke test: confirm a 3-phone impact, reject a lone shake)", () => {
  it("confirms 3 phones within the window and rejects a lone phone", () => {
    const r = computeQuorum([tr("a", 1000, "structural", 2), tr("b", 1300, "structural", 3), tr("c", 1600), tr("a", 9000)], { k: 3, windowMs: 1500 });
    expect(r.events).toHaveLength(1);
    expect(r.events[0]!.sensors).toEqual(["a", "b", "c"]);
    expect(r.events[0]!.ppvMinMmS).toBe(2);
    expect(r.events[0]!.ppvMaxMmS).toBe(3);
    expect(r.rejected.map((x) => x.reason)).toEqual(["no-quorum"]);
  });

  it("one phone triggering twice is still one sensor", () => {
    const r = computeQuorum([tr("a", 1000), tr("a", 1100), tr("b", 1200)], { k: 3, windowMs: 1500 });
    expect(r.events).toHaveLength(0);
  });

  it("handling-labelled triggers never count", () => {
    const r = computeQuorum([tr("a", 1000), tr("b", 1100, "handling"), tr("c", 1200)], { k: 3, windowMs: 1500 });
    expect(r.events).toHaveLength(0);
    expect(r.rejected.some((x) => x.reason === "handling")).toBe(true);
  });

  it("unregistered / revoked sensors are excluded by the registry check", () => {
    const live = new Set(["a", "b"]);
    const r = computeQuorum([tr("a", 1000), tr("b", 1100), tr("x", 1200)], { k: 3, windowMs: 1500, isLive: (s) => live.has(s) });
    expect(r.events).toHaveLength(0);
    expect(r.rejected.find((x) => x.trigger.sensor === "x")!.reason).toBe("not-registered");
  });

  it("is order-independent (every viewer gets the same answer)", () => {
    const ts = [tr("a", 1000), tr("b", 1400), tr("c", 1450), tr("b", 5000), tr("c", 5100), tr("a", 5200)];
    const a = computeQuorum(ts, { k: 3, windowMs: 1500 });
    const b = computeQuorum([...ts].reverse(), { k: 3, windowMs: 1500 });
    expect(a.events.map((e) => e.tMs)).toEqual(b.events.map((e) => e.tMs));
    expect(a.events).toHaveLength(2);
  });
});
