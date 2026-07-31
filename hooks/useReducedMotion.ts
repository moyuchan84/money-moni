"use client";

import { useGameStore } from "@/store/useGameStore";

// GSAP/Motion 애니메이션 길이를 정할 때 이 값을 함께 참고한다.
// true면 각 미니게임에서 트윈 duration을 줄이거나 즉시 최종 상태로 스킵한다.
export function useReducedMotion() {
  return useGameStore((state) => state.settings.reducedMotion);
}
