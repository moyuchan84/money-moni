"use client";

import dynamic from "next/dynamic";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// PixiJS 캔버스는 이 라우트에 진입할 때만 로드한다(CLAUDE.md 절대 규칙 3).
const LedgerSortingCanvas = dynamic(() => import("./LedgerSortingCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: 320, height: 360 }}
      className="flex items-center justify-center rounded-2xl border-2 border-dashed border-district1-secondary bg-white/50 text-caption text-gray-900"
    >
      미니게임을 준비하고 있어요
    </div>
  ),
});

export interface LedgerSortingGameProps {
  onComplete: (score: number) => void;
}

export function LedgerSortingGame({ onComplete }: LedgerSortingGameProps) {
  const reducedMotion = useReducedMotion();

  return (
    <LedgerSortingCanvas width={320} height={360} reducedMotion={reducedMotion} onComplete={onComplete} />
  );
}
