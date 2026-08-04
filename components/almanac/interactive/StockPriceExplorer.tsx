"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 주가(stock-street 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-7 참고.
// "신제품 인기도" 슬라이더를 밀면 케이크(회사) 속 "내 조각"의 크기가 실시간으로 커지거나 작아진다
// — StockStreetGame.tsx가 이미 쓰는 "케이크 emoji를 motion scale로 키운다" 패턴을 그대로 따른다.
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 100;
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.8;
const MIN_SHARE_PERCENT = 10;
const MAX_SHARE_PERCENT = 60;

export function StockPriceExplorer() {
  const reducedMotion = useReducedMotion();
  const [popularity, setPopularity] = useState(50);

  const ratio = popularity / MAX_POPULARITY;
  const scale = MIN_SCALE + ratio * (MAX_SCALE - MIN_SCALE);
  const mySharePercent = Math.round(MIN_SHARE_PERCENT + ratio * (MAX_SHARE_PERCENT - MIN_SHARE_PERCENT));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="flex h-24 w-24 items-center justify-center text-display"
        animate={{ scale }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
        aria-hidden
      >
        🍰
      </motion.div>

      <label className="flex w-full flex-col gap-1 text-caption text-muted">
        신제품 인기도
        <input
          type="range"
          min={MIN_POPULARITY}
          max={MAX_POPULARITY}
          step={5}
          value={popularity}
          onChange={(event) => setPopularity(Number(event.target.value))}
          className="min-h-touch w-full accent-primary"
          aria-label="신제품 인기도"
        />
      </label>
      <p className="text-body font-semibold text-ink">
        인기도 {popularity}% → 내가 가진 조각 약 {mySharePercent}%
      </p>
    </div>
  );
}
