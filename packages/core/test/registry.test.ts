import { describe, expect, it } from "vitest";
import { asOfCheck, type RegistrationInterval } from "../src/registry";

const H = 3_600_000;
// phone "p1" registered to 0xAA from t=1h until revoked at t=5h.
const reg: RegistrationInterval[] = [{ label: "p1", owner: "0xAA", fromMs: 1 * H, toMs: 5 * H }];
const r = (tMs: number, createdAtMs: number, creator = "0xaa") => ({ sensor: "p1", creator, tMs, createdAtMs });

describe("T13 as-of membership", () => {
  it("counts a reading made and recorded while registered", () => {
    expect(asOfCheck(reg, r(2 * H, 2 * H + 3000))).toBe("ok");
  });
  it("a revocation does NOT erase history: the 2h reading still counts after the 5h revoke", () => {
    // Same reading evaluated by a dashboard at 9h: the decision depends only on 2h and its upload time.
    expect(asOfCheck(reg, r(2 * H, 2 * H + 3000))).toBe("ok");
  });
  it("blocks backdating: written after the revoke but claiming a time before it", () => {
    expect(asOfCheck(reg, r(4 * H, 6 * H))).toBe("not-registered-at-upload-time");
  });
  it("offline store-and-forward still counts if uploaded while still registered", () => {
    expect(asOfCheck(reg, r(2 * H, 4.5 * H))).toBe("ok");
  });
  it("rejects readings before the phone ever joined (beyond join slack)", () => {
    expect(asOfCheck(reg, r(0.5 * H, 2 * H))).toBe("not-registered-at-reading-time");
  });
  it("allows the join race: sensing starts a minute before the registration block lands", () => {
    expect(asOfCheck(reg, r(1 * H - 60_000, 1 * H + 5000))).toBe("ok");
  });
  it("rejects a reading claiming a time after Arkiv recorded it", () => {
    expect(asOfCheck(reg, r(3 * H, 2 * H))).toBe("claims-future-time");
  });
  it("rejects a wallet that is not the registered owner", () => {
    expect(asOfCheck(reg, r(2 * H, 2 * H, "0xbb"))).toBe("not-registered-at-reading-time");
  });
});
