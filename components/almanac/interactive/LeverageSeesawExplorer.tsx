"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loanCounterContent } from "@/data/loanCounterContent";
import { isTipped } from "@/components/minigame/loanCounter/tiltMath";

// 레버리지(loan-counter 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-11 참고.
// "빌리는 돈" 슬라이더를 밀면 저울이 기울고, 성공/실패 시 손익이 함께 커지는 걸 보여준다.
// 기운 정도 판정은 minigame과 같은 loanCounterContent.tipThresholdDeg + tiltMath.isTipped를 재사용한다.
const MY_MONEY = 10000;
const MAX_BORROW_RATIO = 3;
const MAX_ANGLE_DEG = 30; // loanCounterContent.tipThresholdDeg(25도)를 넘어서야 경고 상태를 실제로 볼 수 있다
const ASSUMED_RETURN_RATE = 0.3;

export function LeverageSeesawExplorer() {
  const reducedMotion = useReducedMotion();
  const [borrowRatio, setBorrowRatio] = useState(1);

  const angleDeg = (borrowRatio / MAX_BORROW_RATIO) * MAX_ANGLE_DEG;
  const thresholdRad = (loanCounterContent.tipThresholdDeg * Math.PI) / 180;
  const tipped = isTipped((angleDeg * Math.PI) / 180, thresholdRad);
  const borrowedAmount = Math.round(MY_MONEY * borrowRatio);
  const gainLoss = Math.round(borrowedAmount * ASSUMED_RETURN_RATE);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 220 100" className="h-24 w-full" aria-hidden>
        <circle cx="110" cy="80" r="6" fill="#78716c" />
        <motion.g
          animate={{ rotate: angleDeg }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
          style={{ transformOrigin: "110px 80px" }}
        >
          <rect x="0" y="74" width="220" height="12" rx="6" fill={tipped ? "#c23652" : "#a16207"} />
        </motion.g>
      </svg>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        빌리는 돈 (내 돈의 {borrowRatio.toFixed(1)}배)
        <input
          type="range"
          min={0}
          max={MAX_BORROW_RATIO}
          step={0.1}
          value={borrowRatio}
          onChange={(event) => setBorrowRatio(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="빌리는 돈 배율"
        />
      </label>

      <p className="text-body text-fg">
        빌린 돈 {borrowedAmount.toLocaleString()}원 · 잘되면 +{gainLoss.toLocaleString()}원 · 안되면 −
        {gainLoss.toLocaleString()}원
      </p>
      {tipped && <p className="text-caption font-semibold text-danger">⚠️ 저울이 크게 기울었어요!</p>}
    </div>
  );
}
