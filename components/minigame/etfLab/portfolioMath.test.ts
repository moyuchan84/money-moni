import { describe, expect, it } from "vitest";

import { applySeasonToAllocation, computeSwingRange, pickRandomSeason, sumAllocationValues } from "./portfolioMath";
import { ASSETS, REACTION_MULTIPLIER, SEASON_REACTIONS, SEASONS, type AssetId } from "@/data/almanac/economicSeasons";

function equalAllocation(perAsset: number): Record<AssetId, number> {
  return Object.fromEntries(ASSETS.map((asset) => [asset.id, perAsset])) as Record<AssetId, number>;
}

describe("applySeasonToAllocation", () => {
  it("자산별 계절 반응 배수를 곱한 값을 반환한다(summer)", () => {
    const result = applySeasonToAllocation(equalAllocation(2), "summer", SEASON_REACTIONS, REACTION_MULTIPLIER);
    expect(result.stock).toBeCloseTo(2 * 1.3, 5); // grow
    expect(result.realEstate).toBeCloseTo(2 * 1.0, 5); // steady
    expect(result.commodity).toBeCloseTo(2 * 1.3, 5); // grow
    expect(result.cash).toBeCloseTo(2 * 0.8, 5); // wilt
  });
});

describe("sumAllocationValues", () => {
  it("모든 자산 값의 합을 반환한다", () => {
    const applied = applySeasonToAllocation(equalAllocation(2), "summer", SEASON_REACTIONS, REACTION_MULTIPLIER);
    expect(sumAllocationValues(applied)).toBeCloseTo(10.8, 5);
  });
});

describe("pickRandomSeason", () => {
  it("randomValue가 0이면 첫 번째 계절을 반환한다", () => {
    expect(pickRandomSeason(SEASONS, 0)).toBe("spring");
  });

  it("randomValue가 1에 가까우면 마지막 계절을 반환한다", () => {
    expect(pickRandomSeason(SEASONS, 0.99)).toBe("winter");
  });

  it("구간 경계값도 올바른 계절로 매핑된다", () => {
    expect(pickRandomSeason(SEASONS, 0.2499)).toBe("spring");
    expect(pickRandomSeason(SEASONS, 0.25)).toBe("summer");
  });
});

describe("computeSwingRange", () => {
  it("최댓값과 최솟값의 차이를 반환한다", () => {
    expect(computeSwingRange([10, 12, 8])).toBe(4);
  });

  it("빈 배열이면 0을 반환한다", () => {
    expect(computeSwingRange([])).toBe(0);
  });
});
