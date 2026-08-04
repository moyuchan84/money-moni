"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { seedFieldContent, type SeedFieldOutcome } from "@/data/seedFieldContent";
import { pickWeightedOutcome } from "@/components/minigame/seedField/rouletteMath";

// 투자 확률(seed-field 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-6 참고.
// "씨앗 심기"를 여러 번 탭하면 결과가 매번 달라지는 걸 누적된 결과 목록으로 확인한다.
// 미니게임과 같은 확률 로직(rouletteMath.pickWeightedOutcome)을 그대로 재사용한다.
const SEGMENTS = seedFieldContent.segments;
const SEGMENT_BY_OUTCOME = Object.fromEntries(SEGMENTS.map((segment) => [segment.outcome, segment]));

export function SeedOddsExplorer() {
  const reducedMotion = useReducedMotion();
  const [results, setResults] = useState<SeedFieldOutcome[]>([]);

  function handlePlant() {
    const outcome = pickWeightedOutcome(SEGMENTS, Math.random());
    setResults((prev) => [...prev, outcome]);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 rounded-control bg-white p-2"
        aria-hidden
      >
        {results.length === 0 && <span className="text-caption text-muted">씨앗을 심어보세요</span>}
        {results.map((outcome, index) => (
          <motion.span
            key={index}
            className="text-2xl"
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            title={SEGMENT_BY_OUTCOME[outcome].labelKo}
          >
            {SEGMENT_BY_OUTCOME[outcome].emoji}
          </motion.span>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePlant}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        🌱 씨앗 심기
      </button>
      <p className="text-body text-fg">심을 때마다 결과가 달라져요 — 지금까지 {results.length}번 심어봤어요.</p>
    </div>
  );
}
