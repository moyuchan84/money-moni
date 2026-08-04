"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { stockStreetContent, type PriceEvent, type StockIdeaCard } from "@/data/stockStreetContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ComparisonBarChart } from "@/components/minigame/ComparisonBarChart";
import { computeChasedResult, computeDisciplinedResult, type EventChoice, type PlayerEventChoices } from "./disciplineMath";

// 순수 Motion만 사용하는 3단계(투표→가격 흐름 지켜보기(이벤트 포함)→비교 요약) 화면. Pixi 불필요.

type Phase = "vote" | "chart" | "summary";

const IDEAS = stockStreetContent.ideas;

function DayTrendBars({ history, reducedMotion }: { history: number[]; reducedMotion: boolean }) {
  if (history.length === 0) return null;
  const maxValue = Math.max(...history, 1);

  return (
    <div className="flex h-16 w-full items-end justify-center gap-1.5">
      {history.map((value, index) => {
        const heightPct = Math.max(8, Math.min(100, (value / maxValue) * 100));
        const target = { height: `${heightPct}%` };
        return (
          <motion.div
            key={index}
            role="img"
            aria-label={`${index + 1}일째 배수 ${value.toFixed(2)}`}
            className="w-3 rounded-pill bg-primary-light"
            initial={false}
            animate={reducedMotion ? undefined : target}
            style={reducedMotion ? target : undefined}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export interface StockStreetGameProps {
  onComplete: (score: number) => void;
}

export function StockStreetGame({ onComplete }: StockStreetGameProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("vote");
  const [selectedIdea, setSelectedIdea] = useState<StockIdeaCard | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [cumulativeMultiplier, setCumulativeMultiplier] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const [pendingEvent, setPendingEvent] = useState<PriceEvent | null>(null);
  const [pendingChaseMultiplier, setPendingChaseMultiplier] = useState<number | null>(null);
  const [playerChoices, setPlayerChoices] = useState<PlayerEventChoices>({});

  function handleVote(idea: StockIdeaCard) {
    setSelectedIdea(idea);
    setPhase("chart");
  }

  function handleNextDay() {
    if (!selectedIdea || pendingEvent) return;
    const dayMultiplier = selectedIdea.dayMultipliers[dayIndex];
    let next = cumulativeMultiplier * (pendingChaseMultiplier ?? 1) * dayMultiplier;
    const event = selectedIdea.events?.find((candidate) => candidate.afterDayIndex === dayIndex);
    if (event) {
      next *= event.eventDayMultiplier;
    }
    setCumulativeMultiplier(next);
    setHistory((value) => [...value, next]);
    setPendingChaseMultiplier(null);
    setDayIndex((value) => value + 1);
    if (event) setPendingEvent(event);
  }

  function handleEventChoice(choice: EventChoice) {
    if (!pendingEvent) return;
    setPlayerChoices((value) => ({ ...value, [pendingEvent.afterDayIndex]: choice }));
    setPendingChaseMultiplier(choice === "act" ? pendingEvent.chaseOutcomeMultiplier : null);
    setPendingEvent(null);
  }

  function handleShowSummary() {
    setCumulativeMultiplier((value) => value * (pendingChaseMultiplier ?? 1));
    setPendingChaseMultiplier(null);
    setPhase("summary");
  }

  function handleFinish() {
    if (!selectedIdea) return;
    const disciplinedMultiplier = computeDisciplinedResult(selectedIdea, playerChoices);
    onComplete(Math.round(stockStreetContent.baseCakeSize * disciplinedMultiplier));
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

  if (phase === "summary" && selectedIdea) {
    const disciplinedMultiplier = computeDisciplinedResult(selectedIdea, playerChoices);
    const chasedMultiplier = computeChasedResult(selectedIdea);
    const disciplinedCake = Math.round(stockStreetContent.baseCakeSize * disciplinedMultiplier);
    const chasedCake = Math.round(stockStreetContent.baseCakeSize * chasedMultiplier);

    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <p className="text-body font-semibold text-ink">버틴 나 vs 휩쓸렸다면, 케이크 크기 비교</p>
        <ComparisonBarChart
          items={[
            { id: "disciplined", labelKo: "버틴 나", value: disciplinedCake, colorHex: "#22c55e" },
            { id: "chased", labelKo: "휩쓸렸다면", value: chasedCake, colorHex: "#ef4444" },
          ]}
          maxValue={Math.max(disciplinedCake, chasedCake, 1)}
        />
        <button
          type="button"
          onClick={handleFinish}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          확인했어요
        </button>
      </div>
    );
  }

  const isLastDay = selectedIdea ? dayIndex >= selectedIdea.dayMultipliers.length : true;
  const cakeSize = Math.round(stockStreetContent.baseCakeSize * cumulativeMultiplier);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body text-fg">
        {selectedIdea?.emoji} {selectedIdea?.labelKo} · {isLastDay && !pendingEvent ? "결과" : `${dayIndex + 1}일째`}
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
      <DayTrendBars history={history} reducedMotion={reducedMotion} />

      {pendingEvent ? (
        <div className="flex w-full flex-col items-center gap-3 rounded-card bg-surface p-4 text-center shadow-card">
          <p aria-hidden className="text-display">
            {pendingEvent.kind === "hype" ? "🏃" : "😨"}
          </p>
          <p className="text-body text-ink">{pendingEvent.messageKo}</p>
          <div className="grid w-full grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleEventChoice("act")}
              className="min-h-touch min-w-touch rounded-control bg-primary px-3 py-2 text-body text-white"
            >
              {pendingEvent.actionLabelKo}
            </button>
            <button
              type="button"
              onClick={() => handleEventChoice("wait")}
              className="min-h-touch min-w-touch rounded-control bg-primary px-3 py-2 text-body text-white"
            >
              {pendingEvent.waitLabelKo}
            </button>
          </div>
        </div>
      ) : isLastDay ? (
        <button
          type="button"
          onClick={handleShowSummary}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          결과 보기
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
