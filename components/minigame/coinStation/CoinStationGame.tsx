"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { coinStationContent } from "@/data/coinStationContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CoinValueCounters } from "./CoinValueCounters";

// Pixi 캔버스는 이 라우트에 진입할 때만 로드한다(CLAUDE.md 절대 규칙 3).
const CoinWaveCanvas = dynamic(() => import("./CoinWaveCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: 280, height: 180 }}
      className="flex items-center justify-center rounded-control border-2 border-dashed border-border bg-surface-muted text-caption text-muted"
    >
      미니게임을 준비하고 있어요
    </div>
  ),
});

type Phase = "idle" | "racing" | "done";

export interface CoinStationGameProps {
  onComplete: (score: number) => void;
}

export function CoinStationGame({ onComplete }: CoinStationGameProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [coinValue, setCoinValue] = useState(coinStationContent.baseAmount);
  const [stableValue, setStableValue] = useState(coinStationContent.baseAmount);

  // 캔버스는 매 프레임(최대 60fps) onValueUpdate를 호출한다 — 그대로 setState하면 리렌더가
  // 과도해지므로, 최신값은 ref에만 담아두고 별도 인터벌에서 낮은 빈도로 화면에 반영한다.
  const latestOffsetsRef = useRef({ coin: 0, stable: 0 });

  useEffect(() => {
    if (phase !== "racing") return;
    const interval = window.setInterval(() => {
      const { coin, stable } = latestOffsetsRef.current;
      setCoinValue(coinStationContent.baseAmount + Math.round(coin * coinStationContent.valuePerPixel));
      setStableValue(coinStationContent.baseAmount + Math.round(stable * coinStationContent.valuePerPixel));
    }, 150);
    return () => window.clearInterval(interval);
  }, [phase]);

  function handleValueUpdate(coinOffset: number, stableOffset: number) {
    latestOffsetsRef.current = { coin: coinOffset, stable: stableOffset };
  }

  function handleRaceDone() {
    const { coin, stable } = latestOffsetsRef.current;
    setCoinValue(coinStationContent.baseAmount + Math.round(coin * coinStationContent.valuePerPixel));
    setStableValue(coinStationContent.baseAmount + Math.round(stable * coinStationContent.valuePerPixel));
    setPhase("done");
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <CoinWaveCanvas
        width={280}
        height={180}
        reducedMotion={reducedMotion}
        raceDurationMs={coinStationContent.raceDurationMs}
        coinAmplitudePx={coinStationContent.coinAmplitudePx}
        stableAmplitudePx={coinStationContent.stableAmplitudePx}
        running={phase === "racing"}
        onValueUpdate={handleValueUpdate}
        onRaceDone={handleRaceDone}
      />
      <CoinValueCounters coinValue={coinValue} stableValue={stableValue} />
      {phase === "done" && (
        <p className="rounded-card bg-surface p-3 text-center text-body text-ink shadow-card">
          {coinStationContent.resultMessageKo}
        </p>
      )}
      {phase === "idle" && (
        <button
          type="button"
          onClick={() => setPhase("racing")}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          출발!
        </button>
      )}
      {phase === "done" && (
        <button
          type="button"
          onClick={() => onComplete(1)}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          확인했어요
        </button>
      )}
    </div>
  );
}
