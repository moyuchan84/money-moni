"use client";

import { useState } from "react";
import Link from "next/link";

import type { BuildingId, BuildingMeta } from "@/data/buildings";
import { commonContent } from "@/data/commonContent";
import { buildingViewContent } from "@/data/buildingViewContent";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { museumContent } from "@/data/museumContent";
import { ledgerHouseContent } from "@/data/ledgerHouseContent";
import { allowanceSquareContent } from "@/data/allowanceSquareContent";
import { bankContent } from "@/data/bankContent";
import { jobCenterContent } from "@/data/jobCenterContent";
import { capitalWarehouseContent } from "@/data/capitalWarehouseContent";
import { marketContent } from "@/data/marketContent";
import { loanCounterContent } from "@/data/loanCounterContent";
import { tripleVillageContent } from "@/data/tripleVillageContent";
import { seedFieldContent } from "@/data/seedFieldContent";
import { stockStreetContent } from "@/data/stockStreetContent";
import { etfLabContent } from "@/data/etfLabContent";
import { goldVaultContent } from "@/data/goldVaultContent";
import { coinStationContent } from "@/data/coinStationContent";
import { useGameStore } from "@/store/useGameStore";
import { ReflectionPrompt } from "@/components/dialogue/ReflectionPrompt";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

// 15개 건물(1~3구역) 모두 건물 맞춤 회고 질문을 쓴다. genericMinigameCopy는 이 맵에 없는
// (정상 흐름에서는 없을) buildingId를 위한 fallback으로만 남겨둔다.
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
  "loan-counter": loanCounterContent.reflection,
  // triple-village의 질문은 "어떤 마을이 기억에 남았는지"만 묻는다 — 어느 체제가 낫다는 판정이 아니다
  // (CLAUDE.md 절대 규칙 7).
  "triple-village": tripleVillageContent.reflection,
  "seed-field": seedFieldContent.reflection,
  "stock-street": stockStreetContent.reflection,
  "etf-lab": etfLabContent.reflection,
  "gold-vault": goldVaultContent.reflection,
  "coin-station": coinStationContent.reflection,
};

// recap 대사가 준비된 15개 건물(1~3구역 전체) 모두 값이 존재한다.
const RECAP_CONTENT: Partial<Record<BuildingId, string>> = {
  museum: museumContent.recapLineKo,
  "ledger-house": ledgerHouseContent.recapLineKo,
  "allowance-square": allowanceSquareContent.recapLineKo,
  bank: bankContent.recapLineKo,
  "job-center": jobCenterContent.recapLineKo,
  "capital-warehouse": capitalWarehouseContent.recapLineKo,
  market: marketContent.recapLineKo,
  "loan-counter": loanCounterContent.recapLineKo,
  "triple-village": tripleVillageContent.recapLineKo,
  "seed-field": seedFieldContent.recapLineKo,
  "stock-street": stockStreetContent.recapLineKo,
  "etf-lab": etfLabContent.recapLineKo,
  "gold-vault": goldVaultContent.recapLineKo,
  "coin-station": coinStationContent.recapLineKo,
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
  const recap = RECAP_CONTENT[building.id];

  function handleAnswer(optionId: string) {
    setBuildingReflectionAnswer(building.id, optionId);
    setJustAnswered(true);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p aria-hidden className="text-display">
        🎉
      </p>
      <h1 className="text-heading font-bold text-ink">{buildingViewContent.resultHeadingKo}</h1>
      <p className="text-body text-fg">{buildingViewContent.coinsLineKo(coins)}</p>

      {recap && (
        <NpcDialogue speakerName={commonContent.villageChiefSpeakerKo} message={recap} character="none" />
      )}

      {reflectionAnswer ? (
        <p className="text-body text-fg">
          {justAnswered
            ? buildingViewContent.reflectionJustAnsweredKo
            : buildingViewContent.reflectionAlreadyAnsweredKo}
        </p>
      ) : (
        <ReflectionPrompt question={reflection.questionKo} options={reflection.options} onAnswer={handleAnswer} />
      )}

      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        {commonContent.backToTownKo}
      </Link>
    </main>
  );
}
