"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 자본(capital-warehouse 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-5 참고.
// 같은 10초를 "손으로 반죽"과 "오븐 사용"이 동시에 채운다고 가정하고, 빵 개수 차이를 stagger
// 등장 애니메이션 + 카운트로 보여준다.
const HAND_BREAD_COUNT = 5;
const OVEN_BREAD_COUNT = 20;
const DURATION_SECONDS = 2.5;

export function ToolCompareExplorer() {
  const reducedMotion = useReducedMotion();
  const [round, setRound] = useState(0);
  const started = round > 0;

  const handInterval = DURATION_SECONDS / HAND_BREAD_COUNT;
  const ovenInterval = DURATION_SECONDS / OVEN_BREAD_COUNT;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-control bg-white p-2">
          <span className="text-caption text-muted">✋ 손으로 반죽</span>
          <div className="flex min-h-8 flex-wrap items-center justify-center gap-1" aria-hidden>
            {started &&
              Array.from({ length: HAND_BREAD_COUNT }, (_, index) => (
                <motion.span
                  key={`${round}-${index}`}
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : index * handInterval }}
                >
                  🍞
                </motion.span>
              ))}
          </div>
          <span className="text-body font-semibold text-ink">{started ? `${HAND_BREAD_COUNT}개` : "-"}</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-control bg-white p-2">
          <span className="text-caption text-muted">🔥 오븐 사용</span>
          <div className="flex min-h-8 flex-wrap items-center justify-center gap-1" aria-hidden>
            {started &&
              Array.from({ length: OVEN_BREAD_COUNT }, (_, index) => (
                <motion.span
                  key={`${round}-${index}`}
                  className="text-xs"
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : index * ovenInterval }}
                >
                  🍞
                </motion.span>
              ))}
          </div>
          <span className="text-body font-semibold text-ink">{started ? `${OVEN_BREAD_COUNT}개` : "-"}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setRound((value) => value + 1)}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        ⏱️ 같은 10초, 시작!
      </button>
      <p className="text-body text-fg">같은 10초 동안, 도구(자본)가 있으면 훨씬 많이 만들 수 있어요.</p>
    </div>
  );
}
