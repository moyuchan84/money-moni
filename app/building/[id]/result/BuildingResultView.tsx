"use client";

import { useState } from "react";
import Link from "next/link";

import type { BuildingId, BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { museumContent } from "@/data/museumContent";
import { ledgerHouseContent } from "@/data/ledgerHouseContent";
import { allowanceSquareContent } from "@/data/allowanceSquareContent";
import { bankContent } from "@/data/bankContent";
import { jobCenterContent } from "@/data/jobCenterContent";
import { capitalWarehouseContent } from "@/data/capitalWarehouseContent";
import { marketContent } from "@/data/marketContent";
import { useGameStore } from "@/store/useGameStore";
import { ReflectionPrompt } from "@/components/dialogue/ReflectionPrompt";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

// Phase 2에서 실제 콘텐츠가 채워진 3개 건물은 건물 맞춤 회고 질문을 쓴다.
// 나머지 건물은 Phase 1의 범용 회고 질문을 유지한다.
const REFLECTION_CONTENT: Partial<
  Record<BuildingId, { questionKo: string; options: { id: string; label: string }[] }>
> = {
  museum: museumContent.reflection,
  "ledger-house": ledgerHouseContent.reflection,
  "allowance-square": allowanceSquareContent.reflection,
  bank: bankContent.reflection,
  "job-center": jobCenterContent.reflection,
  "capital-warehouse": capitalWarehouseContent.reflection,
  market: marketContent.reflection,
};

export function BuildingResultView({ building }: { building: BuildingMeta }) {
  useDistrictBgm(building.district);
  const coins = useGameStore((state) => state.wallet.coins);
  const reflectionAnswer = useGameStore((state) => state.buildings[building.id].reflectionAnswer);
  const setBuildingReflectionAnswer = useGameStore((state) => state.setBuildingReflectionAnswer);
  const [justAnswered, setJustAnswered] = useState(false);

  const reflection = REFLECTION_CONTENT[building.id] ?? {
    questionKo: genericMinigameCopy.reflectionQuestionKo,
    options: genericMinigameCopy.reflectionOptions,
  };

  function handleAnswer(optionId: string) {
    setBuildingReflectionAnswer(building.id, optionId);
    setJustAnswered(true);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p aria-hidden className="text-display">
        🎉
      </p>
      <h1 className="text-heading font-bold text-ink">수고했어요!</h1>
      <p className="text-body text-fg">지금 가진 코인은 {coins}개예요!</p>

      {reflectionAnswer ? (
        <p className="text-body text-fg">
          {justAnswered ? "회고를 남겨줘서 고마워!" : "이미 회고를 남겼어요. 고마워!"}
        </p>
      ) : (
        <ReflectionPrompt question={reflection.questionKo} options={reflection.options} onAnswer={handleAnswer} />
      )}

      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        마을로 돌아가기
      </Link>
    </main>
  );
}
