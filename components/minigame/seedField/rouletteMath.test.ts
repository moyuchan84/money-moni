import { describe, expect, it } from "vitest";

import { computeStopAngle, pickWeightedOutcome, type RouletteSegment } from "./rouletteMath";

const SEGMENTS: RouletteSegment[] = [
  { outcome: "poor", weight: 0.2 },
  { outcome: "average", weight: 0.5 },
  { outcome: "abundant", weight: 0.3 },
];
const TWO_PI = Math.PI * 2;

describe("pickWeightedOutcome", () => {
  it("0~0.2 구간이면 poor를 반환한다", () => {
    expect(pickWeightedOutcome(SEGMENTS, 0.1)).toBe("poor");
  });

  it("0.2~0.7 구간이면 average를 반환한다", () => {
    expect(pickWeightedOutcome(SEGMENTS, 0.5)).toBe("average");
  });

  it("0.7~1.0 구간이면 abundant를 반환한다", () => {
    expect(pickWeightedOutcome(SEGMENTS, 0.9)).toBe("abundant");
  });

  it("경계값에서도 오류 없이 유효한 결과를 반환한다", () => {
    expect(["poor", "average", "abundant"]).toContain(pickWeightedOutcome(SEGMENTS, 0));
    expect(["poor", "average", "abundant"]).toContain(pickWeightedOutcome(SEGMENTS, 0.999999));
  });
});

describe("computeStopAngle", () => {
  it("반환한 각도만큼 회전하면 목표 구간이 포인터(wheel-local 0) 위치에 온다", () => {
    const randomWithinSegment = 0.5;
    const rotation = computeStopAngle(SEGMENTS, "average", 0, randomWithinSegment);

    const totalWeight = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
    const cumulativeBefore = SEGMENTS[0].weight; // average 이전 누적 = poor의 weight
    const segmentStart = (cumulativeBefore / totalWeight) * TWO_PI;
    const segmentSize = (SEGMENTS[1].weight / totalWeight) * TWO_PI;
    const angleInWheel = segmentStart + segmentSize * randomWithinSegment;

    const finalAngle = (angleInWheel + rotation) % TWO_PI;
    // 0과 2π 양쪽 다 "포인터 위치"를 뜻하므로, 둘 중 더 가까운 쪽과의 거리로 비교한다.
    const distanceFromPointer = Math.min(finalAngle, TWO_PI - finalAngle);
    expect(distanceFromPointer).toBeCloseTo(0, 5);
  });

  it("extraSpins가 늘어날수록 정확히 2π*extraSpins만큼 더 커진다(선형성)", () => {
    const rotation0 = computeStopAngle(SEGMENTS, "poor", 0, 0.5);
    const rotation2 = computeStopAngle(SEGMENTS, "poor", 2, 0.5);
    expect(rotation2 - rotation0).toBeCloseTo(2 * TWO_PI, 10);
  });

  it("randomWithinSegment는 구간 경계(0, 1)에 딱 붙지 않도록 캡핑된다", () => {
    const rotationAtZero = computeStopAngle(SEGMENTS, "abundant", 0, 0);
    const rotationAtNearZero = computeStopAngle(SEGMENTS, "abundant", 0, 0.05);
    expect(rotationAtZero).toBeCloseTo(rotationAtNearZero, 10);

    const rotationAtOne = computeStopAngle(SEGMENTS, "abundant", 0, 1);
    const rotationAtNearOne = computeStopAngle(SEGMENTS, "abundant", 0, 0.95);
    expect(rotationAtOne).toBeCloseTo(rotationAtNearOne, 10);
  });
});
