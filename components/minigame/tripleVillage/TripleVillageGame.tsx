"use client";

import { useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";

import { tripleVillageContent, type EconomicMode } from "@/data/tripleVillageContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VillagePanel } from "./VillagePanel";

// 3개 마을을 가로 트랙에 나란히 배치하고 Motion drag="x"로 스와이프한다. 정밀한 드래그 조작이
// 어려운 아동을 위해 화살표·점 버튼으로도 동일하게 조작할 수 있어야 한다(implementation.md 3장).
// 이 스와이프+탭-대안 캐러셀 패턴은 지금은 이 건물 전용이지만, 다른 곳에서도 필요해지면
// 별도 컴포넌트로 추출할 수 있다.

const VILLAGES = tripleVillageContent.villages;
const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 260;

export interface TripleVillageGameProps {
  onComplete: (score: number) => void;
}

export function TripleVillageGame({ onComplete }: TripleVillageGameProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);
  const [roundResults, setRoundResults] = useState<Partial<Record<EconomicMode, number>>>({});

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(VILLAGES.length - 1, index));
    setActiveIndex(clamped);
    animate(x, -clamped * PANEL_WIDTH, { duration: reducedMotion ? 0 : 0.3, ease: "easeOut" });
  }

  function handleRoundDone(mode: EconomicMode, myShare: number) {
    setRoundResults((prev) => ({ ...prev, [mode]: myShare }));
  }

  const allRoundsDone = VILLAGES.every((village) => roundResults[village.mode] !== undefined);

  function handleFinish() {
    const total = VILLAGES.reduce((sum, village) => sum + (roundResults[village.mode] ?? 0), 0);
    onComplete(total);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT }}
        className="overflow-hidden rounded-card border border-border bg-surface-muted"
      >
        <motion.div
          className="flex h-full touch-pan-y"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(PANEL_WIDTH * (VILLAGES.length - 1)), right: 0 }}
          dragElastic={0.15}
          onDragEnd={() => {
            const proposedIndex = Math.round(-x.get() / PANEL_WIDTH);
            goTo(proposedIndex);
          }}
        >
          {VILLAGES.map((village) => (
            <div key={village.mode} style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT }} className="shrink-0">
              <VillagePanel village={village} onRoundDone={handleRoundDone} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="이전 마을"
          className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-3 py-2 text-body text-ink disabled:opacity-40"
        >
          ◀
        </button>
        <div className="flex items-center gap-2" aria-hidden>
          {VILLAGES.map((village, index) => (
            <span
              key={village.mode}
              className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === VILLAGES.length - 1}
          aria-label="다음 마을"
          className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-3 py-2 text-body text-ink disabled:opacity-40"
        >
          ▶
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {VILLAGES.map((village, index) => (
          <button
            key={village.mode}
            type="button"
            onClick={() => goTo(index)}
            aria-current={index === activeIndex}
            aria-label={`${village.nameKo}로 이동`}
            className={`min-h-touch min-w-touch rounded-pill px-3 py-1 text-caption ${
              index === activeIndex ? "bg-primary text-white" : "border border-border bg-surface text-muted"
            }`}
          >
            {village.emoji} {village.nameKo}
          </button>
        ))}
      </div>

      {allRoundsDone && (
        <button
          type="button"
          onClick={handleFinish}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          결과 다 봤어요! 다음으로
        </button>
      )}
    </div>
  );
}
