"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

// PixiJS + Matter.js 캔버스는 이 라우트에 진입할 때만 로드한다(CLAUDE.md 절대 규칙 3).
const LoanBalanceCanvas = dynamic(() => import("./LoanBalanceCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: 280, height: 220 }}
      className="flex items-center justify-center rounded-control border-2 border-dashed border-border bg-surface-muted text-caption text-muted"
    >
      미니게임을 준비하고 있어요
    </div>
  ),
});

export interface LoanCounterGameProps {
  onComplete: (score: number) => void;
}

export function LoanCounterGame({ onComplete }: LoanCounterGameProps) {
  const [weightsAdded, setWeightsAdded] = useState(0);
  const [tipped, setTipped] = useState(false);
  const weightsAddedRef = useRef(0);

  function handleAddWeight() {
    if (tipped) return;
    setWeightsAdded((value) => {
      const next = value + 1;
      weightsAddedRef.current = next;
      return next;
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body font-semibold text-ink">
        {tipped ? "저울이 기울었어요! 손해예요" : `빌린 돈 ${weightsAdded}번 추가했어요`}
      </p>
      <LoanBalanceCanvas
        width={280}
        height={220}
        borrowerWeightCount={weightsAdded}
        onTip={() => setTipped(true)}
      />
      {tipped ? (
        <button
          type="button"
          onClick={() => onComplete(weightsAddedRef.current)}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          결과 확인
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddWeight}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          빌린 돈 추가하기
        </button>
      )}
    </div>
  );
}
