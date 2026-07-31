"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { marketContent } from "@/data/marketContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PriceCounter } from "@/components/minigame/market/PriceCounter";

// PixiJS 캔버스는 이 라우트에 진입할 때만 로드한다(CLAUDE.md 절대 규칙 3).
const MarketPriceCanvas = dynamic(() => import("./MarketPriceCanvas"), {
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

export interface MarketPriceGameProps {
  onComplete: (score: number) => void;
}

export function MarketPriceGame({ onComplete }: MarketPriceGameProps) {
  const reducedMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(marketContent.gameDurationSeconds);
  const [remainingBudget, setRemainingBudget] = useState(marketContent.startingBudget);
  const [currentPrice, setCurrentPrice] = useState(marketContent.startingPrice);
  const [candyCount, setCandyCount] = useState(0);
  const finishedRef = useRef(false);
  const candyCountRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => window.clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || finishedRef.current) return;
    finishedRef.current = true;
    onCompleteRef.current(candyCountRef.current);
  }, [secondsLeft]);

  function handlePriceTick() {
    setCurrentPrice((value) => value + marketContent.priceIncrease);
  }

  function handleBuy() {
    if (secondsLeft <= 0 || remainingBudget < currentPrice) return;
    setRemainingBudget((value) => value - currentPrice);
    setCandyCount((value) => {
      const next = value + 1;
      candyCountRef.current = next;
      return next;
    });
  }

  const canAfford = remainingBudget >= currentPrice && secondsLeft > 0;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <p className="text-body text-fg">
        남은 시간 {secondsLeft}초 · 남은 돈 {remainingBudget}원 · 사탕 {candyCount}개
      </p>
      <MarketPriceCanvas
        width={280}
        height={180}
        reducedMotion={reducedMotion}
        priceTickIntervalMs={marketContent.priceTickIntervalMs}
        onPriceTick={handlePriceTick}
      />
      <PriceCounter price={currentPrice} />
      <button
        type="button"
        onClick={handleBuy}
        disabled={!canAfford}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white disabled:opacity-40"
      >
        사탕 사기
      </button>
    </div>
  );
}
