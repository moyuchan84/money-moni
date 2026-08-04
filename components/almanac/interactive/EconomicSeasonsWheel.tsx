"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SEASONS, ASSETS, SEASON_REACTIONS, REACTION_LABEL, type Season, type ReactionLevel } from "@/data/almanac/economicSeasons";

// 경제 사계절 바퀴(etf-lab 도감) — 포트폴리오/경제 계절 위젯.
// docs/investment-mindset-and-cycles.md 6장 참고. 레이 달리오의 올웨더 포트폴리오 성장·물가
// 4분면을 아이 눈높이로 단순화했다. 계절을 예측하는 도구가 아니라 "그래서 나눠 담는다"는
// 결론으로만 귀결시켜야 해서(콘텐츠 안전 원칙 2), 하단 안내 문구는 계절 선택과 무관하게
// 항상 고정으로 보인다. 계절-자산 반응 테이블은 data/almanac/economicSeasons.ts 공유 모듈 참고
// (etf-lab 포트폴리오 라운드 미니게임과 같은 테이블을 쓴다).

const REACTION_MOTION: Record<ReactionLevel, { scale: number; y: number; opacity: number }> = {
  grow: { scale: 1.3, y: -6, opacity: 1 },
  steady: { scale: 1, y: 0, opacity: 1 },
  wilt: { scale: 0.8, y: 4, opacity: 0.6 },
};

export function EconomicSeasonsWheel() {
  const reducedMotion = useReducedMotion();
  const [season, setSeason] = useState<Season>("spring");
  const reactions = SEASON_REACTIONS[season];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-wrap justify-center gap-2">
        {SEASONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSeason(option.id)}
            aria-pressed={season === option.id}
            className={`min-h-touch min-w-touch flex-1 rounded-control px-3 py-2 text-caption shadow-card ${
              season === option.id ? "bg-primary text-white" : "bg-surface text-ink"
            }`}
          >
            {option.emoji} {option.labelKo}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-5 gap-2 rounded-control bg-white p-3">
        {ASSETS.map((asset) => {
          const level = reactions[asset.id];
          const target = REACTION_MOTION[level];
          return (
            <div key={asset.id} className="flex flex-col items-center gap-1">
              <motion.span
                className="text-3xl"
                animate={reducedMotion ? undefined : target}
                initial={false}
                transition={{ duration: reducedMotion ? 0 : 0.4 }}
                style={reducedMotion ? target : undefined}
                aria-hidden
              >
                {asset.emoji}
              </motion.span>
              <span className="text-caption text-muted">{asset.labelKo}</span>
              <span className="text-caption font-semibold text-ink">{REACTION_LABEL[level]}</span>
            </div>
          );
        })}
      </div>

      <p className="text-body font-semibold text-primary">
        다음 계절이 뭐가 될진 아무도 미리 알 수 없어요 — 그래서 여러 자산을 골고루 나눠 갖는 거예요.
      </p>
    </div>
  );
}
