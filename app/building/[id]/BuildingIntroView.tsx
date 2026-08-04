"use client";

import { useState } from "react";

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
import type { BuildingStoryContent, StoryScene } from "@/data/storyScene";
import { useGameStore } from "@/store/useGameStore";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { StorySceneViewer } from "@/components/dialogue/StorySceneViewer";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";
import { Button } from "@/components/ui/Button";
import { ButtonRow } from "@/components/ui/ButtonRow";

// 15개 건물(1~3구역) 모두 전용 인트로 대사·내레이션을 쓴다. genericMinigameCopy는 이 맵에 없는
// (정상 흐름에서는 없을) buildingId를 위한 fallback으로만 남겨둔다.
const INTRO_CONTENT: Partial<Record<BuildingId, { messageKo: string; narrationSrc?: string }>> = {
  museum: { messageKo: museumContent.introMessageKo, narrationSrc: museumContent.narrationSrc.intro },
  "ledger-house": {
    messageKo: ledgerHouseContent.introMessageKo,
    narrationSrc: ledgerHouseContent.narrationSrc.intro,
  },
  "allowance-square": {
    messageKo: allowanceSquareContent.introMessageKo,
    narrationSrc: allowanceSquareContent.narrationSrc.intro,
  },
  bank: { messageKo: bankContent.introMessageKo, narrationSrc: bankContent.narrationSrc.intro },
  "job-center": {
    messageKo: jobCenterContent.introMessageKo,
    narrationSrc: jobCenterContent.narrationSrc.intro,
  },
  "capital-warehouse": {
    messageKo: capitalWarehouseContent.introMessageKo,
    narrationSrc: capitalWarehouseContent.narrationSrc.intro,
  },
  market: { messageKo: marketContent.introMessageKo, narrationSrc: marketContent.narrationSrc.intro },
  "loan-counter": {
    messageKo: loanCounterContent.introMessageKo,
    narrationSrc: loanCounterContent.narrationSrc.intro,
  },
  "triple-village": {
    messageKo: tripleVillageContent.introMessageKo,
    narrationSrc: tripleVillageContent.narrationSrc.intro,
  },
  "seed-field": {
    messageKo: seedFieldContent.introMessageKo,
    narrationSrc: seedFieldContent.narrationSrc.intro,
  },
  "stock-street": {
    messageKo: stockStreetContent.introMessageKo,
    narrationSrc: stockStreetContent.narrationSrc.intro,
  },
  "etf-lab": {
    messageKo: etfLabContent.introMessageKo,
    narrationSrc: etfLabContent.narrationSrc.intro,
  },
  "gold-vault": {
    messageKo: goldVaultContent.introMessageKo,
    narrationSrc: goldVaultContent.narrationSrc.intro,
  },
  "coin-station": {
    messageKo: coinStationContent.introMessageKo,
    narrationSrc: coinStationContent.narrationSrc.intro,
  },
};

// 개념 스토리 레이어(docs/concept-story.md)가 준비된 15개 건물(1~3구역 전체)의 스토리 콘텐츠.
const STORY_CONTENT: Partial<Record<BuildingId, BuildingStoryContent>> = {
  museum: {
    storyScenes: museumContent.storyScenes as StoryScene[],
    metaphorLineKo: museumContent.metaphorLineKo,
    realExampleKo: museumContent.realExampleKo,
    bridgeLineKo: museumContent.bridgeLineKo,
    recapLineKo: museumContent.recapLineKo,
  },
  "ledger-house": {
    storyScenes: ledgerHouseContent.storyScenes as StoryScene[],
    metaphorLineKo: ledgerHouseContent.metaphorLineKo,
    realExampleKo: ledgerHouseContent.realExampleKo,
    bridgeLineKo: ledgerHouseContent.bridgeLineKo,
    recapLineKo: ledgerHouseContent.recapLineKo,
  },
  "allowance-square": {
    storyScenes: allowanceSquareContent.storyScenes as StoryScene[],
    metaphorLineKo: allowanceSquareContent.metaphorLineKo,
    realExampleKo: allowanceSquareContent.realExampleKo,
    bridgeLineKo: allowanceSquareContent.bridgeLineKo,
    recapLineKo: allowanceSquareContent.recapLineKo,
  },
  bank: {
    storyScenes: bankContent.storyScenes as StoryScene[],
    metaphorLineKo: bankContent.metaphorLineKo,
    realExampleKo: bankContent.realExampleKo,
    bridgeLineKo: bankContent.bridgeLineKo,
    recapLineKo: bankContent.recapLineKo,
  },
  "job-center": {
    storyScenes: jobCenterContent.storyScenes as StoryScene[],
    metaphorLineKo: jobCenterContent.metaphorLineKo,
    realExampleKo: jobCenterContent.realExampleKo,
    bridgeLineKo: jobCenterContent.bridgeLineKo,
    recapLineKo: jobCenterContent.recapLineKo,
  },
  "capital-warehouse": {
    storyScenes: capitalWarehouseContent.storyScenes as StoryScene[],
    metaphorLineKo: capitalWarehouseContent.metaphorLineKo,
    realExampleKo: capitalWarehouseContent.realExampleKo,
    bridgeLineKo: capitalWarehouseContent.bridgeLineKo,
    recapLineKo: capitalWarehouseContent.recapLineKo,
  },
  market: {
    storyScenes: marketContent.storyScenes as StoryScene[],
    metaphorLineKo: marketContent.metaphorLineKo,
    realExampleKo: marketContent.realExampleKo,
    bridgeLineKo: marketContent.bridgeLineKo,
    recapLineKo: marketContent.recapLineKo,
  },
  "loan-counter": {
    storyScenes: loanCounterContent.storyScenes as StoryScene[],
    metaphorLineKo: loanCounterContent.metaphorLineKo,
    realExampleKo: loanCounterContent.realExampleKo,
    bridgeLineKo: loanCounterContent.bridgeLineKo,
    recapLineKo: loanCounterContent.recapLineKo,
  },
  "triple-village": {
    storyScenes: tripleVillageContent.storyScenes as StoryScene[],
    metaphorLineKo: tripleVillageContent.metaphorLineKo,
    realExampleKo: tripleVillageContent.realExampleKo,
    bridgeLineKo: tripleVillageContent.bridgeLineKo,
    recapLineKo: tripleVillageContent.recapLineKo,
  },
  "seed-field": {
    storyScenes: seedFieldContent.storyScenes as StoryScene[],
    metaphorLineKo: seedFieldContent.metaphorLineKo,
    realExampleKo: seedFieldContent.realExampleKo,
    bridgeLineKo: seedFieldContent.bridgeLineKo,
    recapLineKo: seedFieldContent.recapLineKo,
  },
  "stock-street": {
    storyScenes: stockStreetContent.storyScenes as StoryScene[],
    metaphorLineKo: stockStreetContent.metaphorLineKo,
    realExampleKo: stockStreetContent.realExampleKo,
    bridgeLineKo: stockStreetContent.bridgeLineKo,
    recapLineKo: stockStreetContent.recapLineKo,
  },
  "etf-lab": {
    storyScenes: etfLabContent.storyScenes as StoryScene[],
    metaphorLineKo: etfLabContent.metaphorLineKo,
    realExampleKo: etfLabContent.realExampleKo,
    bridgeLineKo: etfLabContent.bridgeLineKo,
    recapLineKo: etfLabContent.recapLineKo,
  },
  "gold-vault": {
    storyScenes: goldVaultContent.storyScenes as StoryScene[],
    metaphorLineKo: goldVaultContent.metaphorLineKo,
    realExampleKo: goldVaultContent.realExampleKo,
    bridgeLineKo: goldVaultContent.bridgeLineKo,
    recapLineKo: goldVaultContent.recapLineKo,
  },
  "coin-station": {
    storyScenes: coinStationContent.storyScenes as StoryScene[],
    metaphorLineKo: coinStationContent.metaphorLineKo,
    realExampleKo: coinStationContent.realExampleKo,
    bridgeLineKo: coinStationContent.bridgeLineKo,
    recapLineKo: coinStationContent.recapLineKo,
  },
};

export function BuildingIntroView({ building }: { building: BuildingMeta }) {
  useDistrictBgm(building.district);
  const completedAt = useGameStore((state) => state.buildings[building.id].completedAt);
  const storySeen = useGameStore((state) => state.buildings[building.id].storySeen);
  const setBuildingStorySeen = useGameStore((state) => state.setBuildingStorySeen);
  const introContent = INTRO_CONTENT[building.id];
  const storyContent = STORY_CONTENT[building.id];
  const [replaying, setReplaying] = useState(false);

  if (storyContent && (!storySeen || replaying)) {
    const handleStoryDone = () => {
      if (!storySeen) setBuildingStorySeen(building.id);
      setReplaying(false);
    };

    return (
      <StorySceneViewer
        scenes={storyContent.storyScenes}
        metaphorLineKo={storyContent.metaphorLineKo}
        realExampleKo={storyContent.realExampleKo}
        bridgeLineKo={storyContent.bridgeLineKo}
        onComplete={handleStoryDone}
        onSkip={handleStoryDone}
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
      <NpcDialogue
        speakerName={commonContent.villageChiefSpeakerKo}
        message={
          completedAt
            ? buildingViewContent.alreadyCompletedIntroKo
            : (introContent?.messageKo ?? genericMinigameCopy.introMessageKo)
        }
        narrationSrc={completedAt ? undefined : introContent?.narrationSrc}
      />
      <ButtonRow>
        <Button href={`/building/${building.id}/minigame`} variant="primary">
          {buildingViewContent.startMinigameKo}
        </Button>
        <Button href="/town" variant="secondary">
          {commonContent.backToTownKo}
        </Button>
        {storyContent && (
          <Button type="button" variant="secondary" onClick={() => setReplaying(true)}>
            {commonContent.replayStoryKo}
          </Button>
        )}
      </ButtonRow>
    </main>
  );
}
