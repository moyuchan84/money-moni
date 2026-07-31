"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { bankContent } from "@/data/bankContent";
import { useGsapContext } from "@/hooks/useGsapContext";

// 저금통이 가득 차는 데 걸리는 기본 시간(이자율 1배 기준). 슬라이더 값이 이 타임라인의
// timeScale()에 실시간으로 바인딩되어, 숫자 계산 없이도 "이자율이 높을수록 빨리 는다"는
// 감각을 준다(docs/idea.md 6-4, docs/phases.md Phase 4 — 이번 Phase의 유일한 신규 패턴).
const BASE_FILL_DURATION_SECONDS = 6;

export interface BankInterestGameProps {
  onComplete: (score: number) => void;
}

export function BankInterestGame({ onComplete }: BankInterestGameProps) {
  const [rate, setRate] = useState(bankContent.defaultRate);
  const [coinCount, setCoinCount] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const containerRef = useGsapContext<HTMLDivElement>((_context, reducedMotion) => {
    const progress = { coins: 0 };
    const timeline = gsap.timeline();
    timeline.to(progress, {
      coins: bankContent.targetCoins,
      duration: BASE_FILL_DURATION_SECONDS,
      ease: "none",
      // 움직임 줄이기 설정에서는 부드러운 연속 변화 대신 정수 단위로 뚝뚝 끊어 보여준다.
      snap: reducedMotion ? { coins: 1 } : undefined,
      onUpdate: () => {
        setCoinCount(Math.floor(progress.coins));
      },
      onComplete: () => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        onCompleteRef.current(bankContent.targetCoins);
      },
    });
    timeline.timeScale(rate);
    timelineRef.current = timeline;
  }, []);

  function handleRateChange(value: number) {
    setRate(value);
    timelineRef.current?.timeScale(value);
  }

  const fillRatio = Math.min(coinCount / bankContent.targetCoins, 1);

  return (
    <div ref={containerRef} className="flex w-full max-w-xs flex-col items-center gap-4">
      <svg viewBox="0 0 100 90" className="h-32 w-36" aria-hidden>
        <path
          d="M15,55 Q15,20 50,20 Q85,20 85,55 L85,70 Q85,80 75,80 L25,80 Q15,80 15,70 Z"
          fill="#fde68a"
          stroke="#d97706"
          strokeWidth={3}
        />
        <rect x="15" y={80 - 55 * fillRatio} width={70} height={55 * fillRatio} fill="#f59e0b" opacity={0.6} />
        <circle cx="50" cy="15" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth={2} />
      </svg>

      <p className="text-body text-fg">
        저금통 {coinCount} / {bankContent.targetCoins}코인
      </p>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        이자율 다이얼
        <input
          type="range"
          min={bankContent.minRate}
          max={bankContent.maxRate}
          step={0.1}
          value={rate}
          onChange={(event) => handleRateChange(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="이자율 다이얼"
        />
      </label>
      <p className="text-caption text-muted">이자율 x{rate.toFixed(1)}</p>
    </div>
  );
}
