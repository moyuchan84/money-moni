"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { museumContent } from "@/data/museumContent";

// 화폐의 역사(museum 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-15 참고.
// 가로 슬라이더로 시대를 옮기면 가운데 "돈" 아이콘이 조개→동전→지폐→카드→디지털 순으로
// 교차 페이드된다. MuseumTimelineGame.tsx(정답 판정이 있는 미니게임)와는 별개의, 도감 전용
// 가벼운 버전이며 museumContent.eras 데이터만 재사용한다(게임 컴포넌트 자체는 재사용하지 않음).
const ERAS = museumContent.eras;

export function MoneyShapeTimelineExplorer() {
  const reducedMotion = useReducedMotion();
  const [eraIndex, setEraIndex] = useState(0);
  const era = ERAS[eraIndex];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-control bg-white">
        <AnimatePresence mode="wait">
          <motion.span
            key={era.id}
            className="text-6xl"
            initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            aria-hidden
          >
            {era.currencyEmoji}
          </motion.span>
        </AnimatePresence>
      </div>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        시대
        <input
          type="range"
          min={0}
          max={ERAS.length - 1}
          step={1}
          value={eraIndex}
          onChange={(event) => setEraIndex(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="시대"
        />
      </label>
      <p className="text-body font-semibold text-ink">
        {era.eraLabelKo} — {era.currencyLabelKo}
      </p>
    </div>
  );
}
