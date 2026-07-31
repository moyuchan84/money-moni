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
import type { BuildingStoryContent, StoryScene } from "@/data/storyScene";
import { useGameStore } from "@/store/useGameStore";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { StorySceneViewer } from "@/components/dialogue/StorySceneViewer";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

// Phase 2에서 실제 콘텐츠가 채워진 3개 건물은 전용 인트로 대사·내레이션을 쓴다.
// 나머지 건물은 Phase 1의 범용 카피를 그대로 유지한다.
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
};

// 개념 스토리 레이어(docs/concept-story.md)가 준비된 7개 건물의 스토리 콘텐츠.
// 3구역 7개 건물은 아직 스토리가 없으므로 이 맵에 키가 존재하지 않는다 — 기존 동작 그대로 유지된다.
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
};

export function BuildingIntroView({ building }: { building: BuildingMeta }) {
  useDistrictBgm(building.district);
  const districtUnlocked = useGameStore((state) => state.districts[building.district].unlocked);
  const completedAt = useGameStore((state) => state.buildings[building.id].completedAt);
  const storySeen = useGameStore((state) => state.buildings[building.id].storySeen);
  const setBuildingStorySeen = useGameStore((state) => state.setBuildingStorySeen);
  const introContent = INTRO_CONTENT[building.id];
  const storyContent = STORY_CONTENT[building.id];
  const [replaying, setReplaying] = useState(false);

  if (!districtUnlocked) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6">
        <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
        <NpcDialogue
          speakerName="촌장님"
          message="이 구역은 아직 잠겨 있어요. 다른 구역부터 열어보자!"
        />
        <Link
          href="/town"
          className="min-h-touch min-w-touch self-start rounded-control border border-border bg-surface px-6 py-2 text-body text-primary"
        >
          마을로 돌아가기
        </Link>
      </main>
    );
  }

  if (storyContent && (!storySeen || replaying)) {
    const handleStoryDone = () => {
      if (!storySeen) setBuildingStorySeen(building.id);
      setReplaying(false);
    };

    return (
      <StorySceneViewer
        scenes={storyContent.storyScenes}
        metaphorLineKo={storyContent.metaphorLineKo}
        bridgeLineKo={storyContent.bridgeLineKo}
        onComplete={handleStoryDone}
        onSkip={handleStoryDone}
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
      <NpcDialogue
        speakerName="촌장님"
        message={
          completedAt
            ? "벌써 완료한 곳이네! 다시 놀러 와도 좋아."
            : (introContent?.messageKo ?? genericMinigameCopy.introMessageKo)
        }
        narrationSrc={completedAt ? undefined : introContent?.narrationSrc}
      />
      <div className="flex gap-3">
        <Link
          href={`/building/${building.id}/minigame`}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          미니게임 시작하기
        </Link>
        <Link
          href="/town"
          className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-6 py-2 text-body text-primary"
        >
          마을로 돌아가기
        </Link>
        {storyContent && (
          <button
            type="button"
            onClick={() => setReplaying(true)}
            className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-6 py-2 text-body text-primary"
          >
            이야기 다시보기
          </button>
        )}
      </div>
    </main>
  );
}
