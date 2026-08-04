"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// 코인 안정성(coin-station 도감)을 직접 조작해보는 위젯. docs/almanac-interactive.md 6-10 참고.
// "출발!"을 누르면 롤러코스터 트랙의 동전은 크게 요동치며, 튜브 트랙의 동전은 잔잔하게
// 미끄러지듯 이동한다. 도착 후 "출렁인 정도"를 막대로 비교한다.
// 세로 흔들림은 (framer motion 키프레임과 궁합이 더 좋은) transform 기반 y 값으로 애니메이션하고,
// 정적인 세로 위치는 style.top으로 고정해 layout 프로퍼티(top)에 키프레임 배열을 직접 넘기지 않는다.
const DURATION_SECONDS = 1.8;
const TRACK_HEIGHT_PX = 40;
const CENTER_Y_PX = (TRACK_HEIGHT_PX - 24) / 2;
const COASTER_WOBBLE_KEYFRAMES_PX = [0, -14, 12, -8, 0];
const COASTER_WOBBLE_SCORE = 85;
const TUBE_WOBBLE_SCORE = 15;

export function CoinTrackExplorer() {
  const reducedMotion = useReducedMotion();
  const [round, setRound] = useState(0);
  const [arrived, setArrived] = useState(false);
  const started = round > 0;

  function handleStart() {
    setArrived(false);
    setRound((value) => value + 1);
  }

  // onAnimationComplete 대신 명시적 타이머로 "출렁인 정도" 비교를 드러낸다 — rAF 기반 콜백보다
  // 타이머가 더 예측 가능하게 애니메이션 종료 시점과 맞아떨어진다(다른 위젯들의 window.setTimeout
  // 패턴과 동일).
  useEffect(() => {
    if (!started) return;
    const timeoutId = window.setTimeout(() => setArrived(true), reducedMotion ? 0 : DURATION_SECONDS * 1000);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full flex-col gap-3">
        <div className="relative h-10 w-full overflow-hidden rounded-control bg-white">
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-caption text-muted">🎢</span>
          <motion.span
            key={`coaster-${round}`}
            className="absolute text-xl"
            style={{ top: CENTER_Y_PX }}
            initial={{ left: "6%", y: 0 }}
            animate={{
              left: started ? "88%" : "6%",
              y: started && !reducedMotion ? COASTER_WOBBLE_KEYFRAMES_PX : 0,
            }}
            transition={{ duration: reducedMotion ? 0 : DURATION_SECONDS, ease: "easeInOut" }}
          >
            🪙
          </motion.span>
        </div>
        <div className="relative h-10 w-full overflow-hidden rounded-control bg-white">
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-caption text-muted">🛝</span>
          <motion.span
            key={`tube-${round}`}
            className="absolute text-xl"
            style={{ top: CENTER_Y_PX }}
            initial={{ left: "6%" }}
            animate={{ left: started ? "88%" : "6%" }}
            transition={{ duration: reducedMotion ? 0 : DURATION_SECONDS, ease: "easeInOut" }}
          >
            🪙
          </motion.span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        🚀 출발!
      </button>

      {started && (arrived || reducedMotion) && (
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-caption text-muted">롤러코스터</span>
            <div className="h-3 flex-1 rounded-pill bg-primary-light">
              <div className="h-3 rounded-pill bg-primary" style={{ width: `${COASTER_WOBBLE_SCORE}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-caption text-muted">튜브 미끄럼틀</span>
            <div className="h-3 flex-1 rounded-pill bg-primary-light">
              <div className="h-3 rounded-pill bg-primary" style={{ width: `${TUBE_WOBBLE_SCORE}%` }} />
            </div>
          </div>
        </div>
      )}
      <p className="text-body text-fg">출렁인 정도(진폭)를 막대로 비교해봤어요.</p>
    </div>
  );
}
