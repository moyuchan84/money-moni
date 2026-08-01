"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { seedFieldContent, type SeedFieldOutcome } from "@/data/seedFieldContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { computeStopAngle, pickWeightedOutcome } from "./rouletteMath";

// Pixi 캔버스는 이 라우트에 진입할 때만 로드한다(CLAUDE.md 절대 규칙 3).
const SeedFieldWheelCanvas = dynamic(() => import("./SeedFieldWheelCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: 240, height: 240 }}
      className="flex items-center justify-center rounded-control border-2 border-dashed border-border bg-surface-muted text-caption text-muted"
    >
      미니게임을 준비하고 있어요
    </div>
  ),
});

type Phase = "idle" | "spinning" | "revealed";

const SEGMENTS = seedFieldContent.segments;
const SPIN_COUNT = seedFieldContent.spinCount;

export interface SeedFieldGameProps {
  onComplete: (score: number) => void;
}

export function SeedFieldGame({ onComplete }: SeedFieldGameProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [canvasReady, setCanvasReady] = useState(false);
  const [spinsDone, setSpinsDone] = useState(0);
  const [spinRequestId, setSpinRequestId] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [outcome, setOutcome] = useState<SeedFieldOutcome | null>(null);

  function handleSpin() {
    if (phase !== "idle" || !canvasReady) return;
    const picked = pickWeightedOutcome(SEGMENTS, Math.random());
    const rotation = computeStopAngle(SEGMENTS, picked, spinsDone + 1, Math.random());
    setOutcome(picked);
    setTargetRotation(rotation);
    setSpinRequestId((value) => value + 1);
    setPhase("spinning");
  }

  function handleSpinComplete() {
    setSpinsDone((value) => value + 1);
    setPhase("revealed");
  }

  function handleNext() {
    if (spinsDone >= SPIN_COUNT) {
      onComplete(SPIN_COUNT);
      return;
    }
    setPhase("idle");
  }

  const outcomeMeta = outcome ? SEGMENTS.find((segment) => segment.outcome === outcome) : null;
  const outcomeMessage = outcome ? seedFieldContent.outcomeMessagesKo[outcome] : "";

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body text-fg">
        {spinsDone} / {SPIN_COUNT}번 심었어요
      </p>
      <SeedFieldWheelCanvas
        width={240}
        height={240}
        segments={SEGMENTS}
        reducedMotion={reducedMotion}
        spinRequestId={spinRequestId}
        targetRotation={targetRotation}
        onSpinComplete={handleSpinComplete}
        onCanvasReady={() => setCanvasReady(true)}
      />
      {phase === "revealed" && outcomeMeta && (
        <div className="rounded-card bg-surface p-4 text-center shadow-card">
          <p aria-hidden className="text-display">
            {outcomeMeta.emoji}
          </p>
          <p className="text-body text-ink">{outcomeMessage}</p>
        </div>
      )}
      {phase === "revealed" ? (
        <button
          type="button"
          onClick={handleNext}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          {spinsDone >= SPIN_COUNT ? "확인했어요" : "다시 심기"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSpin}
          disabled={!canvasReady || phase === "spinning"}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white disabled:opacity-40"
        >
          씨앗 심기
        </button>
      )}
    </div>
  );
}
