// 주식회사 거리(stock-street) FOMO 이벤트 결과 계산 중 DOM 없이 테스트 가능한 순수 함수만 분리한다.
// docs/fomo-portfolio-practice.md 3-3, 3-4 참고.

import type { StockIdeaCard } from "@/data/stockStreetContent";

export type EventChoice = "act" | "wait";
export type PlayerEventChoices = Record<number, EventChoice>; // key = PriceEvent.afterDayIndex

// 플레이어가 실제로 고른 선택대로 최종 배수를 계산한다. 이벤트가 없는 날은 dayMultipliers만
// 곱하고, 이벤트가 있는 날은 eventDayMultiplier(모두에게 보이는 그 날의 가격 변화)를 곱한 뒤,
// 그 이벤트에서 "act"(즉시 반응)를 골랐을 때만 chaseOutcomeMultiplier를 추가로 곱한다.
export function computeDisciplinedResult(idea: StockIdeaCard, playerChoices: PlayerEventChoices): number {
  let multiplier = 1;
  idea.dayMultipliers.forEach((dayMultiplier, dayIndex) => {
    multiplier *= dayMultiplier;
    const event = idea.events?.find((candidate) => candidate.afterDayIndex === dayIndex);
    if (!event) return;
    multiplier *= event.eventDayMultiplier;
    if (playerChoices[event.afterDayIndex] === "act") {
      multiplier *= event.chaseOutcomeMultiplier;
    }
  });
  return multiplier;
}

// 이벤트마다 항상 "지금 살래요/팔래요"를 눌렀다고 가정한 가상 시나리오의 최종 배수.
export function computeChasedResult(idea: StockIdeaCard): number {
  let multiplier = 1;
  idea.dayMultipliers.forEach((dayMultiplier, dayIndex) => {
    multiplier *= dayMultiplier;
    const event = idea.events?.find((candidate) => candidate.afterDayIndex === dayIndex);
    if (!event) return;
    multiplier *= event.eventDayMultiplier * event.chaseOutcomeMultiplier;
  });
  return multiplier;
}
