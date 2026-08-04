"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import { commonContent } from "@/data/commonContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GameLogo } from "@/components/hud/GameLogo";

const AUTO_DISMISS_MS = 1500;
const AUTO_DISMISS_REDUCED_MS = 800;

// 워드마크 주변에 흩뿌릴 기호 6개 — 그림 에셋 없이 타이포그래피+기호만으로 구성.
const FLOATING_SYMBOLS = [
  { symbol: "$", className: "top-[14%] left-[18%]" },
  { symbol: "🪙", className: "top-[20%] right-[16%]" },
  { symbol: "💰", className: "bottom-[26%] left-[14%]" },
  { symbol: "✨", className: "bottom-[20%] right-[18%]" },
  { symbol: "$", className: "top-[38%] left-[8%]" },
  { symbol: "🪙", className: "top-[40%] right-[10%]" },
];

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const doneRef = useRef(false);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }

  useEffect(() => {
    const timer = setTimeout(finish, reducedMotion ? AUTO_DISMISS_REDUCED_MS : AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div
      onClick={finish}
      className="relative flex flex-1 flex-col items-center justify-center gap-4 bg-primary-light p-6"
    >
      {!reducedMotion &&
        FLOATING_SYMBOLS.map(({ symbol, className }, index) => (
          <motion.span
            key={index}
            aria-hidden
            className={`pointer-events-none absolute text-heading ${className}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.15 }}
          >
            {symbol}
          </motion.span>
        ))}

      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.8 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: [0.8, 1.05, 1] }}
        transition={reducedMotion ? { duration: 0.4 } : { duration: 0.6, ease: "easeOut" }}
      >
        <GameLogo text={commonContent.splash.wordmarkKo} size="splash" />
      </motion.div>

      <p className="text-caption text-muted">{commonContent.splash.captionKo}</p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
        className="absolute bottom-4 right-4 min-h-touch min-w-touch rounded-control px-3 py-2 text-caption text-muted"
      >
        {commonContent.splash.skipKo}
      </button>
    </div>
  );
}
