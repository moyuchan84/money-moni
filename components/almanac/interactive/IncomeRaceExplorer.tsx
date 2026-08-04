"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { jobCenterContent, type JobCenterCharacterId } from "@/data/jobCenterContent";

// 소득의 종류(job-center 도감)를 직접 조작해보는 위젯. docs/almanac-interactive.md 6-4 참고.
// "하루 빨리감기"를 누르면 일꾼(느리게 조금씩)/사장님(들쭉날쭉)/농장주(가만히 있다 한 번에)
// 세 캐릭터의 코인이 동시에 서로 다른 패턴으로 올라간다 — 승패 없음을 문구로 명시한다.
const CHARACTERS = jobCenterContent.characters;
const STEADY_STEP_MS = 160;

export function IncomeRaceExplorer() {
  const reducedMotion = useReducedMotion();
  const [coins, setCoins] = useState<Record<JobCenterCharacterId, number>>(() =>
    Object.fromEntries(CHARACTERS.map((character) => [character.id, 0])) as Record<JobCenterCharacterId, number>,
  );
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  function scheduleSteady(target: number) {
    let current = 0;
    const step = () => {
      current += 1;
      setCoins((prev) => ({ ...prev, worker: current }));
      if (current < target) {
        timeoutIdsRef.current.push(window.setTimeout(step, reducedMotion ? 0 : STEADY_STEP_MS));
      }
    };
    timeoutIdsRef.current.push(window.setTimeout(step, reducedMotion ? 0 : STEADY_STEP_MS));
  }

  function scheduleJagged(target: number) {
    let current = 0;
    const step = () => {
      const jump = Math.min(target - current, 1 + Math.floor(Math.random() * 4));
      current += jump;
      setCoins((prev) => ({ ...prev, business: current }));
      if (current < target) {
        timeoutIdsRef.current.push(
          window.setTimeout(step, reducedMotion ? 0 : 120 + Math.random() * 300),
        );
      }
    };
    timeoutIdsRef.current.push(window.setTimeout(step, reducedMotion ? 0 : 120 + Math.random() * 300));
  }

  function scheduleAutomatic(target: number) {
    timeoutIdsRef.current.push(
      window.setTimeout(() => setCoins((prev) => ({ ...prev, farmer: target })), reducedMotion ? 0 : 1400),
    );
  }

  function handlePlay() {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
    setCoins(
      Object.fromEntries(CHARACTERS.map((character) => [character.id, 0])) as Record<
        JobCenterCharacterId,
        number
      >,
    );
    for (const character of CHARACTERS) {
      if (character.id === "worker") scheduleSteady(character.eveningEarningsCoins);
      if (character.id === "business") scheduleJagged(character.eveningEarningsCoins);
      if (character.id === "farmer") scheduleAutomatic(character.eveningEarningsCoins);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-full grid-cols-3 gap-2">
        {CHARACTERS.map((character) => (
          <div key={character.id} className="flex flex-col items-center gap-1 rounded-control bg-white p-2">
            <span aria-hidden className="text-display">
              {character.emoji}
            </span>
            <span className="text-caption text-muted">{character.nameKo}</span>
            <motion.span
              key={coins[character.id]}
              initial={reducedMotion ? { scale: 1 } : { scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="text-body font-semibold text-ink"
            >
              🪙{coins[character.id]}
            </motion.span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePlay}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        ⏩ 하루 빨리감기
      </button>
      <p className="text-body text-fg">셋 다 다른 방식으로 벌었을 뿐, 어느 쪽이 더 낫다고 할 순 없어요.</p>
    </div>
  );
}
