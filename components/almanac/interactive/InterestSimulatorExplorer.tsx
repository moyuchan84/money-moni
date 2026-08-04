"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 저축 이자(bank 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-2 참고.
// "몇 달 동안 맡겨둘까?" 슬라이더를 밀면 동전이 개월 수만큼 쌓이고, 처음 1000원이 매달 조금씩
// 불어나는 걸 보여준다.
const MIN_MONTHS = 1;
const MAX_MONTHS = 24;
const DEFAULT_MONTHS = 6;
const STARTING_AMOUNT = 1000;
const MONTHLY_RATE = 0.01;

export function InterestSimulatorExplorer() {
  const reducedMotion = useReducedMotion();
  const [months, setMonths] = useState(DEFAULT_MONTHS);

  const currentAmount = Math.round(STARTING_AMOUNT * Math.pow(1 + MONTHLY_RATE, months));

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex min-h-16 w-full flex-wrap content-start items-start justify-center gap-1 rounded-control bg-white p-2"
        aria-hidden
      >
        {Array.from({ length: months }, (_, index) => (
          <motion.span
            key={index}
            className="text-xl"
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : index * 0.03 }}
          >
            🪙
          </motion.span>
        ))}
      </div>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        몇 달 동안 맡겨둘까?
        <input
          type="range"
          min={MIN_MONTHS}
          max={MAX_MONTHS}
          step={1}
          value={months}
          onChange={(event) => setMonths(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="맡겨두는 개월 수"
        />
      </label>
      <p className="text-body font-semibold text-ink">
        처음 {STARTING_AMOUNT.toLocaleString()}원 → {months}달 뒤 {currentAmount.toLocaleString()}원
      </p>
    </div>
  );
}
