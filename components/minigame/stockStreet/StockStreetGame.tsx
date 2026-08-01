"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { stockStreetContent, type StockIdeaCard } from "@/data/stockStreetContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// 순수 Motion만 사용하는 2단계(투표→다음날 공개) 화면. JobCenterDayGame과 같은 카테고리(Pixi 불필요).

type Phase = "vote" | "reveal";

const IDEAS = stockStreetContent.ideas;

export interface StockStreetGameProps {
  onComplete: (score: number) => void;
}

export function StockStreetGame({ onComplete }: StockStreetGameProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("vote");
  const [selectedIdea, setSelectedIdea] = useState<StockIdeaCard | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [cumulativeMultiplier, setCumulativeMultiplier] = useState(1);

  function handleVote(idea: StockIdeaCard) {
    setSelectedIdea(idea);
    setPhase("reveal");
  }

  function handleNextDay() {
    if (!selectedIdea) return;
    const multiplier = selectedIdea.dayMultipliers[dayIndex];
    setCumulativeMultiplier((value) => value * multiplier);
    setDayIndex((value) => value + 1);
  }

  function handleFinish() {
    onComplete(Math.round(stockStreetContent.baseCakeSize * cumulativeMultiplier));
  }

  if (phase === "vote") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <p className="text-body text-fg">신제품 아이디어를 골라봐!</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {IDEAS.map((idea) => (
            <button
              key={idea.id}
              type="button"
              onClick={() => handleVote(idea)}
              className="min-h-touch flex flex-col items-center gap-1 rounded-control border border-border bg-surface p-4 text-center shadow-card"
            >
              <span aria-hidden className="text-display">
                {idea.emoji}
              </span>
              <span className="text-body font-semibold text-ink">{idea.labelKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const isLastDay = selectedIdea ? dayIndex >= selectedIdea.dayMultipliers.length : true;
  const cakeSize = Math.round(stockStreetContent.baseCakeSize * cumulativeMultiplier);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body text-fg">
        {selectedIdea?.emoji} {selectedIdea?.labelKo} · {isLastDay ? "결과" : `${dayIndex + 1}일째`}
      </p>
      <motion.div
        animate={{ scale: cumulativeMultiplier }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
        className="flex h-24 w-24 items-center justify-center text-display"
        aria-hidden
      >
        🍰
      </motion.div>
      <p className="text-body font-semibold text-ink">케이크 크기 {cakeSize}</p>
      {isLastDay ? (
        <button
          type="button"
          onClick={handleFinish}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          확인했어요
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNextDay}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          다음 날
        </button>
      )}
    </div>
  );
}
