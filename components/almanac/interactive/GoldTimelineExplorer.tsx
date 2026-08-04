"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 금(gold-vault 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-9 참고.
// "시대" 슬라이더를 밀면 배경만 교차 페이드로 바뀌고, 가운데 금 아이콘은 항상 그대로 반짝인다
// — "다른 건 다 변해도 금은 그대로"라는 메시지를 시각적으로 반복한다.
const ERAS = [
  { id: "king", labelKo: "왕의 시대", bgEmoji: "👑" },
  { id: "merchant", labelKo: "상인의 시대", bgEmoji: "⚖️" },
  { id: "today", labelKo: "지금", bgEmoji: "🏙️" },
];

export function GoldTimelineExplorer() {
  const reducedMotion = useReducedMotion();
  const [eraIndex, setEraIndex] = useState(0);
  const era = ERAS[eraIndex];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-control bg-white">
        <AnimatePresence mode="wait">
          <motion.span
            key={era.id}
            className="absolute text-7xl"
            style={{ opacity: 0.15 }}
            initial={reducedMotion ? { opacity: 0.15 } : { opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
            aria-hidden
          >
            {era.bgEmoji}
          </motion.span>
        </AnimatePresence>
        <motion.span
          className="text-5xl"
          animate={reducedMotion ? undefined : { scale: [1, 1.15, 1] }}
          transition={reducedMotion ? undefined : { duration: 1.6, repeat: Infinity }}
          aria-hidden
        >
          🪙
        </motion.span>
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
      <p className="text-body font-semibold text-ink">{era.labelKo} — 다른 건 다 변해도, 금은 그대로예요.</p>
    </div>
  );
}
