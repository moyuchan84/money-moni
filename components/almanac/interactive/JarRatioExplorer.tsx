"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { allowanceSquareContent } from "@/data/allowanceSquareContent";

// 용돈 배분(allowance-square 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-13 참고.
// 항아리 4개 슬라이더가 항상 합 100%를 유지하도록 서로 연동되고, 항아리 물 높이가 실시간으로
// 바뀐다. AllowanceJarGame.tsx의 clipPath 물 채우기 연출을 그대로 가져오되, 드래그 앤 드롭
// 없이 슬라이더로만 조작하는 별개의 탐색형 컴포넌트다.
const JARS = allowanceSquareContent.jars;
// data/allowanceSquareContent.ts 주석의 기준 비율(소비30/위시리스트30/저축30/기부10)을 기본값으로 쓴다.
const DEFAULT_RATIOS = [30, 30, 30, 10];

function redistribute(ratios: number[], changedIndex: number, nextValue: number): number[] {
  const clamped = Math.min(100, Math.max(0, nextValue));
  const remaining = 100 - clamped;
  const othersSum = ratios.reduce((sum, value, index) => (index === changedIndex ? sum : sum + value), 0);

  return ratios.map((value, index) => {
    if (index === changedIndex) return clamped;
    if (othersSum === 0) return remaining / (ratios.length - 1);
    return (value / othersSum) * remaining;
  });
}

function JarVisual({
  colorHex,
  heightRatio,
  reducedMotion,
}: {
  colorHex: string;
  heightRatio: number;
  reducedMotion: boolean;
}) {
  const jarTop = 10;
  const jarBottom = 95;
  const innerHeight = jarBottom - jarTop;
  const liquidHeight = innerHeight * Math.min(heightRatio, 1);
  const liquidY = jarBottom - liquidHeight;
  const clipId = `almanac-jar-clip-${colorHex.replace("#", "")}`;

  return (
    <svg viewBox="0 0 80 100" className="h-20 w-16" aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d="M15,10 H65 V20 L60,95 H20 L15,20 Z" />
        </clipPath>
      </defs>
      <path d="M15,10 H65 V20 L60,95 H20 L15,20 Z" fill="#ffffff" stroke={colorHex} strokeWidth={3} />
      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          x={10}
          width={60}
          fill={colorHex}
          initial={false}
          animate={{ y: liquidY, height: liquidHeight }}
          transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
        />
      </g>
    </svg>
  );
}

export function JarRatioExplorer() {
  const reducedMotion = useReducedMotion();
  const [ratios, setRatios] = useState<number[]>(DEFAULT_RATIOS);

  function handleChange(index: number, value: number) {
    setRatios((prev) => redistribute(prev, index, value));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2">
        {JARS.map((jar, index) => (
          <div key={jar.id} className="flex flex-col items-center gap-1">
            <JarVisual colorHex={jar.colorHex} heightRatio={ratios[index] / 100} reducedMotion={reducedMotion} />
            <span aria-hidden className="text-caption">
              {jar.emoji}
            </span>
            <span className="text-caption text-muted">{Math.round(ratios[index])}%</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2">
        {JARS.map((jar, index) => (
          <label key={jar.id} className="flex w-full flex-col gap-1 text-caption text-muted">
            {jar.labelKo}
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(ratios[index])}
              onChange={(event) => handleChange(index, Number(event.target.value))}
              className="min-h-touch w-full accent-primary"
              aria-label={`${jar.labelKo} 비율`}
            />
          </label>
        ))}
      </div>
      <p className="text-body text-fg">네 항아리를 합쳐 항상 100%가 되도록 자동으로 맞춰져요.</p>
    </div>
  );
}
