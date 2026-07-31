"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

import { useReducedMotion } from "./useReducedMotion";

type SetupFn = (context: gsap.Context, reducedMotion: boolean) => void;

// GSAP 타임라인은 useEffect 안에서 만들고 cleanup에서 revert()로 해제한다(CLAUDE.md 코드 스타일 규칙,
// 라우트 전환 시 메모리 누수 방지). scope를 넘기지 않으면 내부에서 만든 ref를 컨테이너로 반환하므로
// 그 ref를 렌더링할 요소에 붙이면 gsap.context가 선택자 범위를 그 하위로 제한한다.
export function useGsapContext<T extends HTMLElement>(
  setup: SetupFn,
  deps: unknown[],
  scope?: RefObject<T | null>,
): RefObject<T | null> {
  const fallbackScope = useRef<T | null>(null);
  const scopeRef = scope ?? fallbackScope;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const context = gsap.context((self) => setup(self, reducedMotion), scopeRef);
    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);

  return scopeRef;
}
