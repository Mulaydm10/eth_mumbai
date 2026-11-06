import { describe, expect, it } from "vitest";
import { gapCount, seqGaps } from "../src/integrity";

describe("T1 seq gaps", () => {
  it("no gaps in a complete run", () => expect(seqGaps([1, 2, 3, 4])).toEqual([]));
  it("finds a deleted reading", () => expect(seqGaps([1, 2, 4, 5])).toEqual([{ from: 3, to: 3 }]));
  it("finds a multi-reading gap and counts it", () => {
    const g = seqGaps([5, 1, 9, 2]);
    expect(g).toEqual([{ from: 3, to: 4 }, { from: 6, to: 8 }]);
    expect(gapCount(g)).toBe(5);
  });
  it("ignores duplicates and missing seq (old readings without seq)", () => expect(seqGaps([1, 1, 2, NaN, 0])).toEqual([]));
});
