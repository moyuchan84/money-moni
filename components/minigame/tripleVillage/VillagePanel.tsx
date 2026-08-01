"use client";

import { useEffect, useRef, useState } from "react";

import { tripleVillageContent, type EconomicMode, type VillageDefinition } from "@/data/tripleVillageContent";
import { distributeResult } from "./distributeResult";

// 마을 하나의 "빵 반죽하기" 라운드. 3개 마을이 항상 동시에 마운트된 상태로(TripleVillageGame 참고)
// 각자 독립된 타이머를 유지하므로, 다른 마을을 보다가 돌아와도 진행 중인 값이 그대로 보인다.

type Phase = "baking" | "roundDone";

const NPC_COUNT = 2;

function formatResult(template: string, mine: number, total: number): string {
  return template.replace("{mine}", String(mine)).replace("{total}", String(total));
}

export interface VillagePanelProps {
  village: VillageDefinition;
  onRoundDone: (mode: EconomicMode, myShare: number) => void;
}

export function VillagePanel({ village, onRoundDone }: VillagePanelProps) {
  const [phase, setPhase] = useState<Phase>("baking");
  const [secondsLeft, setSecondsLeft] = useState(tripleVillageContent.roundDurationSeconds);
  const [playerTaps, setPlayerTaps] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  const playerTapsRef = useRef(0);
  const npcTapsRef = useRef<number[]>(Array.from({ length: NPC_COUNT }, () => 0));
  const finishedRef = useRef(false);
  const onRoundDoneRef = useRef(onRoundDone);
  useEffect(() => {
    onRoundDoneRef.current = onRoundDone;
  });

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    const npcTimeoutIds: number[] = [];
    function scheduleNpcTap(npcIndex: number) {
      const { npcTapIntervalMinMs, npcTapIntervalMaxMs } = tripleVillageContent;
      const delay = npcTapIntervalMinMs + Math.random() * (npcTapIntervalMaxMs - npcTapIntervalMinMs);
      const timeoutId = window.setTimeout(() => {
        if (finishedRef.current) return;
        npcTapsRef.current = npcTapsRef.current.map((count, index) => (index === npcIndex ? count + 1 : count));
        scheduleNpcTap(npcIndex);
      }, delay);
      npcTimeoutIds.push(timeoutId);
    }
    for (let npcIndex = 0; npcIndex < NPC_COUNT; npcIndex += 1) scheduleNpcTap(npcIndex);

    return () => {
      window.clearInterval(countdown);
      npcTimeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || finishedRef.current) return;
    finishedRef.current = true;

    const taps = [playerTapsRef.current, ...npcTapsRef.current];
    const total = taps.reduce((sum, count) => sum + count, 0);
    const result = distributeResult(taps, village.mode);
    const myShare = result[0];

    setResultMessage(formatResult(village.resultTemplateKo, myShare, total));
    setPhase("roundDone");
    onRoundDoneRef.current(village.mode, myShare);
  }, [secondsLeft, village.mode, village.resultTemplateKo]);

  function handleKneadBread() {
    if (phase !== "baking") return;
    setPlayerTaps((value) => {
      const next = value + 1;
      playerTapsRef.current = next;
      return next;
    });
  }

  if (phase === "roundDone") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <p aria-hidden className="text-display">
          {village.emoji}
        </p>
        <p className="text-body font-semibold text-ink">{village.nameKo}</p>
        <p className="text-body text-fg">{resultMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-caption text-muted">
        {village.nameKo} · 남은 시간 {secondsLeft}초
      </p>
      <button
        type="button"
        onClick={handleKneadBread}
        className="min-h-touch min-w-touch flex flex-col items-center gap-1 rounded-control border border-border bg-surface px-6 py-4 shadow-card"
      >
        <span aria-hidden className="text-display">
          {village.emoji}
        </span>
        <span className="text-caption text-muted">빵 반죽하기</span>
      </button>
      <p className="text-body font-semibold text-ink">내가 만든 빵 {playerTaps}개</p>
    </div>
  );
}
