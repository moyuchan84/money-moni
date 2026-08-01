"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

import { goldVaultContent } from "@/data/goldVaultContent";
import { useGsapContext } from "@/hooks/useGsapContext";

// MuseumTimelineStrip과 같은 useGsapContext 패턴을 재사용하되, ScrollTrigger 없이 "다음" 버튼
// 클릭(eraIndex 변경)에 반응해 카드를 페이드인한다. 금 캐릭터는 애니메이션 대상에서 제외해
// "변하지 않음"을 표현한다(docs/implementation.md 8-4).

const ERAS = goldVaultContent.eras;

export interface GoldVaultGameProps {
  onComplete: (score: number) => void;
}

export function GoldVaultGame({ onComplete }: GoldVaultGameProps) {
  const [eraIndex, setEraIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    (_context, reducedMotion) => {
      if (!cardRef.current) return;
      if (reducedMotion) {
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    },
    [eraIndex],
  );

  const era = ERAS[eraIndex];
  const isLastEra = eraIndex === ERAS.length - 1;

  function handleNext() {
    if (isLastEra) {
      onComplete(ERAS.length);
      return;
    }
    setEraIndex((value) => value + 1);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-3 rounded-card bg-surface p-6 text-center shadow-card"
      >
        <p aria-hidden className="text-display">
          {era.backgroundEmoji}
        </p>
        <p className="text-caption text-muted">{era.eraLabelKo}</p>
        <p className="text-body text-ink">{era.lineKo}</p>
        <p aria-hidden className="text-display">
          ✨🪙
        </p>
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        {isLastEra ? "완료" : "다음"}
      </button>
    </div>
  );
}
