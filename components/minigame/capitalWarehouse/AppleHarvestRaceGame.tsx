"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { capitalWarehouseContent } from "@/data/capitalWarehouseContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// 손으로만 따는 캐릭터(플레이어가 직접 탭)와 사다리(자본)를 가진 캐릭터(자동으로 더 빠르게 채집)를
// 제한 시간 동안 비교하는 게임(docs/idea.md 6-15).
export interface AppleHarvestRaceGameProps {
  onComplete: (score: number) => void;
}

export function AppleHarvestRaceGame({ onComplete }: AppleHarvestRaceGameProps) {
  const reducedMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(capitalWarehouseContent.gameDurationSeconds);
  const [bareHandsCount, setBareHandsCount] = useState(0);
  const [toolCount, setToolCount] = useState(0);
  const finishedRef = useRef(false);
  const bareHandsCountRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    const toolTick = window.setInterval(() => {
      // 시간이 다 된 뒤에는 사다리(자본) 쪽도 더 이상 늘어나지 않아야 결과 화면과 숫자가 일치한다.
      if (finishedRef.current) return;
      setToolCount((value) => value + 1);
    }, capitalWarehouseContent.toolTickIntervalMs);

    return () => {
      window.clearInterval(countdown);
      window.clearInterval(toolTick);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || finishedRef.current) return;
    finishedRef.current = true;
    onCompleteRef.current(bareHandsCountRef.current);
  }, [secondsLeft]);

  function handlePick() {
    if (secondsLeft <= 0) return;
    setBareHandsCount((value) => {
      const next = value + 1;
      bareHandsCountRef.current = next;
      return next;
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body font-semibold text-ink">남은 시간 {secondsLeft}초</p>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-2 rounded-control border border-border bg-surface p-3">
          <span aria-hidden className="text-display">
            ✋
          </span>
          <span className="text-caption text-muted">맨손</span>
          <motion.span
            key={bareHandsCount}
            initial={{ scale: reducedMotion ? 1 : 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="text-heading font-bold text-ink"
          >
            🍎 x{bareHandsCount}
          </motion.span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-control border border-border bg-surface p-3">
          <span aria-hidden className="text-display">
            🪜
          </span>
          <span className="text-caption text-muted">사다리(자본)</span>
          <motion.span
            key={toolCount}
            initial={{ scale: reducedMotion ? 1 : 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="text-heading font-bold text-ink"
          >
            🍎 x{toolCount}
          </motion.span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePick}
        disabled={secondsLeft <= 0}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white disabled:opacity-40"
      >
        손으로 따기
      </button>
    </div>
  );
}
