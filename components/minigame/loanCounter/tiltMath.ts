// 대출 창구(loan-counter) 저울 물리 연산 중 DOM/Pixi/Matter.js 없이 테스트 가능한 순수 함수만 분리한다.
// docs/idea.md 6-14, docs/concept-story.md 7-14 참고.

export type LoanSide = "lender" | "borrower";

export function isTipped(angleRad: number, thresholdRad: number): boolean {
  return Math.abs(angleRad) >= thresholdRad;
}

// slotIndex: 0부터 시작, 해당 side에 이미 놓인 무게 개수.
// side: "borrower"(빌린 돈, 오른쪽 +) | "lender"(원금, 왼쪽 -).
// beamHalfLength - 10을 넘지 않도록 캡핑해, 추가 많아져도 막대 끝을 벗어나지 않게 한다.
export function computeWeightSlotOffsetX(
  slotIndex: number,
  side: LoanSide,
  slotSpacing: number,
  beamHalfLength: number,
): number {
  const sign = side === "borrower" ? 1 : -1;
  const maxDistance = beamHalfLength - 10;
  const distanceFromCenter = Math.min(maxDistance, (slotIndex + 1) * slotSpacing);
  return sign * distanceFromCenter;
}
