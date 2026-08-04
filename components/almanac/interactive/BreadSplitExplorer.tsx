"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { tripleVillageContent, type EconomicMode } from "@/data/tripleVillageContent";

// 세 갈래 실험마을(triple-village 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-14 참고.
// 세 마을 버튼을 탭하면 같은 빵 10개가 마을 규칙에 따라 다르게 나뉘는 걸 보여준다.
// CLAUDE.md 절대 규칙 7: 어떤 모드도 "더 낫다"고 판정하지 않는다 — resultTemplateKo는
// 사실 서술만 담긴 기존 데이터를 그대로 재사용한다.
const VILLAGES = tripleVillageContent.villages;
const TOTAL_BREAD = 10;
const MINE_BY_MODE: Record<EconomicMode, number> = {
  capitalism: 5,
  socialism: Math.floor(TOTAL_BREAD / 3),
  communism: TOTAL_BREAD,
};

export function BreadSplitExplorer() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<EconomicMode | null>(null);

  const village = mode ? VILLAGES.find((item) => item.mode === mode) : undefined;
  const mine = mode ? MINE_BY_MODE[mode] : 0;
  const resultText = village
    ? village.resultTemplateKo.replace("{mine}", String(mine)).replace("{total}", String(TOTAL_BREAD))
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-wrap justify-center gap-2">
        {VILLAGES.map((item) => (
          <button
            key={item.mode}
            type="button"
            onClick={() => setMode(item.mode)}
            className={`min-h-touch min-w-touch rounded-control px-3 py-2 text-caption shadow-card ${
              mode === item.mode ? "bg-primary text-white" : "bg-surface text-ink"
            }`}
          >
            {item.emoji} {item.nameKo}
          </button>
        ))}
      </div>

      <div
        className="flex min-h-12 w-full flex-wrap items-center justify-center gap-1 rounded-control bg-white p-2"
        aria-hidden
      >
        {mode &&
          Array.from({ length: mine }, (_, index) => (
            <motion.span
              key={`${mode}-${index}`}
              className="text-xl"
              initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : index * 0.06 }}
            >
              🍞
            </motion.span>
          ))}
      </div>

      {resultText && <p className="text-body text-fg">{resultText}</p>}
    </div>
  );
}
