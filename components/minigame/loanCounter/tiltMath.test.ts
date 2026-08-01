import { describe, expect, it } from "vitest";

import { computeWeightSlotOffsetX, isTipped } from "./tiltMath";

describe("isTipped", () => {
  it("threshold 미만이면 기울지 않은 것으로 판정한다", () => {
    expect(isTipped(0.3, 0.436)).toBe(false);
  });

  it("threshold 이상(양수 각도)이면 기운 것으로 판정한다", () => {
    expect(isTipped(0.5, 0.436)).toBe(true);
  });

  it("threshold 이상(음수 각도)이면 기운 것으로 판정한다 — 방향 무관", () => {
    expect(isTipped(-0.5, 0.436)).toBe(true);
  });

  it("threshold와 정확히 같으면 기운 것으로 판정한다(경계값)", () => {
    expect(isTipped(0.436, 0.436)).toBe(true);
  });
});

describe("computeWeightSlotOffsetX", () => {
  it("slotIndex가 늘어날수록 중심에서 더 멀어진다", () => {
    const first = computeWeightSlotOffsetX(0, "borrower", 20, 100);
    const second = computeWeightSlotOffsetX(1, "borrower", 20, 100);
    expect(second).toBeGreaterThan(first);
  });

  it("side가 lender면 음수, borrower면 양수를 반환한다", () => {
    expect(computeWeightSlotOffsetX(0, "lender", 20, 100)).toBeLessThan(0);
    expect(computeWeightSlotOffsetX(0, "borrower", 20, 100)).toBeGreaterThan(0);
  });

  it("beamHalfLength - 10을 넘지 않도록 캡핑된다", () => {
    const offset = computeWeightSlotOffsetX(10, "borrower", 20, 100);
    expect(offset).toBe(90);
  });
});
