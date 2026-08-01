// 투자 씨앗밭(seed-field) 확률 룰렛 연산 중 DOM/Pixi 없이 테스트 가능한 순수 함수만 분리한다.
// docs/implementation.md 8-4: "결과를 먼저 정한 뒤 멈출 각도를 역산하는 방식".
// 각도 규약: wheel-local 0 = 위쪽(포인터 고정 위치), 증가할수록 시계 방향.

import type { SeedFieldOutcome } from "@/data/seedFieldContent";

export interface RouletteSegment {
  outcome: SeedFieldOutcome;
  weight: number;
}

export function pickWeightedOutcome<T extends RouletteSegment>(
  segments: T[],
  randomValue: number,
): SeedFieldOutcome {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  const target = randomValue * totalWeight;
  let cumulative = 0;
  for (const segment of segments) {
    cumulative += segment.weight;
    if (target < cumulative) return segment.outcome;
  }
  return segments[segments.length - 1].outcome;
}

// 결과(outcome)를 먼저 정하고, 그 결과가 나오도록 바퀴를 얼마나 돌려야 하는지 역산한다.
// randomWithinSegment: 목표 구간 안에서 정확히 어디에 멈출지(0~1) — 경계에 딱 붙지 않도록 캡핑한다.
// extraSpins: 추가로 몇 바퀴 더 돌지(시각적 연출용, 결과에는 영향 없음).
export function computeStopAngle<T extends RouletteSegment>(
  segments: T[],
  outcome: SeedFieldOutcome,
  extraSpins: number,
  randomWithinSegment: number,
): number {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  const clamped = Math.min(0.95, Math.max(0.05, randomWithinSegment));
  const TWO_PI = Math.PI * 2;

  let cumulativeBefore = 0;
  for (const segment of segments) {
    if (segment.outcome === outcome) {
      const segmentStart = (cumulativeBefore / totalWeight) * TWO_PI;
      const segmentSize = (segment.weight / totalWeight) * TWO_PI;
      const angleInWheel = segmentStart + segmentSize * clamped;
      // 목표 지점(angleInWheel)이 고정 포인터(wheel-local 0) 아래로 오도록 필요한 회전량.
      const baseRotation = (TWO_PI - angleInWheel) % TWO_PI;
      return extraSpins * TWO_PI + baseRotation;
    }
    cumulativeBefore += segment.weight;
  }
  throw new Error(`Unknown outcome: ${outcome}`);
}
