"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 72의 법칙(money-tree 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-1 참고.
// 승패·점수 없음 — 이자율 슬라이더를 움직이면 눈덩이가 굴러가는 속도·크기와 "약 몇 년" 계산만 바뀐다.
const MIN_RATE = 1;
const MAX_RATE = 20;
const DEFAULT_RATE = 6;

export function CompoundInterestExplorer() {
  const reducedMotion = useReducedMotion();
  const [rate, setRate] = useState(DEFAULT_RATE);

  const years = Math.round(72 / rate);
  const scale = 0.6 + (rate / MAX_RATE) * 0.9;
  const durationSeconds = reducedMotion ? 0 : Math.max(0.6, 2.4 - rate / 12);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-full overflow-hidden rounded-control bg-white" aria-hidden>
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full">
          <path d="M0,90 Q100,20 200,90 L200,100 L0,100 Z" fill="#d9f99d" />
        </svg>
        <motion.div
          key={rate}
          className="absolute bottom-3 text-3xl"
          initial={{ left: "0%", scale: 0.5 }}
          animate={{ left: "78%", scale }}
          transition={{ duration: durationSeconds, ease: "easeOut" }}
        >
          ⛄
        </motion.div>
      </div>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        연이자율
        <input
          type="range"
          min={MIN_RATE}
          max={MAX_RATE}
          step={1}
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="연이자율"
        />
      </label>
      <p className="text-body font-semibold text-ink">
        연 {rate}% → 원금이 두 배가 되는 데 약 {years}년 (72 ÷ {rate})
      </p>
    </div>
  );
}
