"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 분산투자(etf-lab 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-8 참고.
// PixiJS 캔버스는 이 위젯이 렌더링될 때만 로드한다(CLAUDE.md 절대 규칙 3).
const DiversificationBasketCanvas = dynamic(() => import("./DiversificationBasketCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: 280, height: 140 }}
      className="flex items-center justify-center rounded-control border-2 border-dashed border-border bg-surface-muted text-caption text-muted"
    >
      바구니를 준비하고 있어요
    </div>
  ),
});

export function DiversificationBasketExplorer() {
  const reducedMotion = useReducedMotion();
  const [singleShakeCount, setSingleShakeCount] = useState(0);
  const [multiShakeCount, setMultiShakeCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3">
      <DiversificationBasketCanvas
        width={280}
        height={140}
        reducedMotion={reducedMotion}
        singleShakeCount={singleShakeCount}
        multiShakeCount={multiShakeCount}
      />
      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => setSingleShakeCount((value) => value + 1)}
          className="min-h-touch min-w-touch flex-1 rounded-control bg-surface px-3 py-2 text-caption text-ink shadow-card"
        >
          🧺 한 종류만 흔들기
        </button>
        <button
          type="button"
          onClick={() => setMultiShakeCount((value) => value + 1)}
          className="min-h-touch min-w-touch flex-1 rounded-control bg-surface px-3 py-2 text-caption text-ink shadow-card"
        >
          🧺 여러 종류 흔들기
        </button>
      </div>
      <p className="text-body text-fg">
        과자 한 종류만 담은 바구니는 많이 출렁이고, 여러 종류를 나눠 담은 바구니는 덜 출렁여요 — 이게 바로
        분산투자가 위험을 줄이는 원리예요.
      </p>
    </div>
  );
}
