"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 가계부(ledger-house 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-12 참고.
// 초록 화살표(들어온 돈)/빨간 화살표(나간 돈) 버튼을 탭할 때마다 저금통이 통통해지거나 홀쭉해진다.
const INCOME_AMOUNT = 500;
const SPENDING_AMOUNT = 300;
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.6;
const SCALE_PER_WON = 1 / 2000;

export function ArrowFlowExplorer() {
  const reducedMotion = useReducedMotion();
  const [netAmount, setNetAmount] = useState(0);

  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, 1 + netAmount * SCALE_PER_WON));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="text-6xl"
        animate={{ scale }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
        aria-hidden
      >
        🐷
      </motion.div>

      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => setNetAmount((value) => value + INCOME_AMOUNT)}
          className="min-h-touch min-w-touch flex-1 rounded-control bg-success-light px-3 py-2 text-caption text-success"
        >
          🟢 들어온 돈 +{INCOME_AMOUNT}원
        </button>
        <button
          type="button"
          onClick={() => setNetAmount((value) => value - SPENDING_AMOUNT)}
          className="min-h-touch min-w-touch flex-1 rounded-control bg-danger-light px-3 py-2 text-caption text-danger"
        >
          🔴 나간 돈 −{SPENDING_AMOUNT}원
        </button>
      </div>

      <p className="text-body text-fg">지금까지 남은 돈: {netAmount.toLocaleString()}원</p>
    </div>
  );
}
