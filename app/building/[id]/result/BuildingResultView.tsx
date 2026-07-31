"use client";

import { useState } from "react";
import Link from "next/link";

import type { BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { useGameStore } from "@/store/useGameStore";
import { ReflectionPrompt } from "@/components/dialogue/ReflectionPrompt";

export function BuildingResultView({ building }: { building: BuildingMeta }) {
  const coins = useGameStore((state) => state.wallet.coins);
  const reflectionAnswer = useGameStore((state) => state.buildings[building.id].reflectionAnswer);
  const setBuildingReflectionAnswer = useGameStore((state) => state.setBuildingReflectionAnswer);
  const [justAnswered, setJustAnswered] = useState(false);

  function handleAnswer(optionId: string) {
    setBuildingReflectionAnswer(building.id, optionId);
    setJustAnswered(true);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p aria-hidden className="text-display">
        🎉
      </p>
      <h1 className="text-heading font-heading">수고했어요!</h1>
      <p className="text-body">지금 가진 코인은 {coins}개예요!</p>

      {reflectionAnswer ? (
        <p className="text-body">
          {justAnswered ? "회고를 남겨줘서 고마워!" : "이미 회고를 남겼어요. 고마워!"}
        </p>
      ) : (
        <ReflectionPrompt
          question={genericMinigameCopy.reflectionQuestionKo}
          options={genericMinigameCopy.reflectionOptions}
          onAnswer={handleAnswer}
        />
      )}

      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
      >
        마을로 돌아가기
      </Link>
    </main>
  );
}
