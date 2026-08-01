"use client";

import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// PriceCounter와 같은 역할 분담 — Pixi 웨이브와 분리된 순수 DOM 소지금 표시.
export interface CoinValueCountersProps {
  coinValue: number;
  stableValue: number;
}

export function CoinValueCounters({ coinValue, stableValue }: CoinValueCountersProps) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.15 };

  return (
    <div className="flex w-full justify-around gap-4">
      <div className="flex flex-col items-center gap-1">
        <span className="text-caption text-muted">코인 소지금</span>
        <motion.span
          key={coinValue}
          initial={{ scale: reducedMotion ? 1 : 1.1 }}
          animate={{ scale: 1 }}
          transition={transition}
          className="text-heading font-bold text-ink"
        >
          {coinValue}원
        </motion.span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-caption text-muted">스테이블코인 소지금</span>
        <motion.span
          key={stableValue}
          initial={{ scale: reducedMotion ? 1 : 1.1 }}
          animate={{ scale: 1 }}
          transition={transition}
          className="text-heading font-bold text-ink"
        >
          {stableValue}원
        </motion.span>
      </div>
    </div>
  );
}
