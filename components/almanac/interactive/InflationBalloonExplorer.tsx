"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 인플레이션(market 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-3 참고.
// "몇 년 뒤?" 슬라이더를 밀면 풍선이 쭈그러들고, 100원으로 살 수 있는 아이스크림 개수가 줄어든다.
const MAX_YEARS = 10;
const START_ICE_CREAM_COUNT = 5;

export function InflationBalloonExplorer() {
  const reducedMotion = useReducedMotion();
  const [years, setYears] = useState(0);

  const scale = 1 - years * 0.04;
  const iceCreamCount = Math.max(1, START_ICE_CREAM_COUNT - Math.floor(years / 2));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="text-6xl"
        animate={{ scale }}
        transition={{ duration: reducedMotion ? 0 : 0.4 }}
        aria-hidden
      >
        🎈
      </motion.div>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        몇 년 뒤?
        <input
          type="range"
          min={0}
          max={MAX_YEARS}
          step={1}
          value={years}
          onChange={(event) => setYears(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="몇 년 뒤"
        />
      </label>
      <p className="text-body font-semibold text-ink">
        {years}년 뒤, 100원으로 살 수 있는 아이스크림: {"🍦".repeat(iceCreamCount)} ({iceCreamCount}개)
      </p>
    </div>
  );
}
