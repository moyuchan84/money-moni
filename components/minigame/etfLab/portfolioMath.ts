// ETF 조합소(etf-lab) 포트폴리오 라운드 결과 계산 중 DOM/dnd-kit 없이 테스트 가능한 순수 함수만
// 분리한다. docs/fomo-portfolio-practice.md 4-2, 4-3 참고.

import type { AssetId, ReactionLevel, Season } from "@/data/almanac/economicSeasons";

export function applySeasonToAllocation(
  values: Record<AssetId, number>,
  season: Season,
  seasonReactions: Record<Season, Record<AssetId, ReactionLevel>>,
  reactionMultiplier: Record<ReactionLevel, number>,
): Record<AssetId, number> {
  const reactions = seasonReactions[season];
  return Object.fromEntries(
    Object.entries(values).map(([assetId, value]) => [
      assetId,
      value * reactionMultiplier[reactions[assetId as AssetId]],
    ]),
  ) as Record<AssetId, number>;
}

export function sumAllocationValues(values: Record<AssetId, number>): number {
  return Object.values(values).reduce((sum, value) => sum + value, 0);
}

// randomValue(0~1)를 주입받아 계절 하나를 뽑는다 — Math.random()을 직접 호출하지 않아 테스트 가능하다
// (seedField/rouletteMath.ts의 pickWeightedOutcome과 동일한 패턴).
export function pickRandomSeason(seasons: { id: Season }[], randomValue: number): Season {
  const index = Math.min(seasons.length - 1, Math.floor(randomValue * seasons.length));
  return seasons[index].id;
}

export function computeSwingRange(totals: number[]): number {
  return totals.length === 0 ? 0 : Math.max(...totals) - Math.min(...totals);
}
