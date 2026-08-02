"use client";

import { useState } from "react";
import Link from "next/link";

import { moneyTreeContent } from "@/data/moneyTreeContent";
import { commonContent } from "@/data/commonContent";
import type { StoryScene } from "@/data/storyScene";
import { useGameStore } from "@/store/useGameStore";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { StorySceneViewer } from "@/components/dialogue/StorySceneViewer";
import { PiggyPetCharacter } from "@/components/rive/PiggyPetCharacter";
import { MoneyTreeScene } from "@/components/moneyTree/MoneyTreeScene";
import type { CharacterMood } from "@/components/rive/RiveCharacter";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function computeMood(lastActionAt: string | undefined, alreadyActedToday: boolean): CharacterMood {
  if (alreadyActedToday) return "happy";
  if (!lastActionAt) return "neutral";
  const daysSince = (Date.now() - new Date(lastActionAt).getTime()) / MS_PER_DAY;
  return daysSince > 1 ? "worried" : "neutral";
}

export default function MoneyTreePage() {
  useDistrictBgm(2);
  const lastActionAt = useGameStore((state) => state.moneyTree.lastActionAt);
  const storySeen = useGameStore((state) => state.buildings["money-tree"].storySeen);
  const setBuildingStorySeen = useGameStore((state) => state.setBuildingStorySeen);
  const [replaying, setReplaying] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const alreadyActedToday = lastActionAt?.slice(0, 10) === today;
  const mood = computeMood(lastActionAt, alreadyActedToday);

  if (!storySeen || replaying) {
    return (
      <main className="flex flex-1 flex-col p-6">
        <StorySceneViewer
          scenes={moneyTreeContent.storyScenes as StoryScene[]}
          metaphorLineKo={moneyTreeContent.metaphorLineKo}
          realExampleKo={moneyTreeContent.realExampleKo}
          bridgeLineKo={moneyTreeContent.bridgeLineKo}
          onComplete={() => {
            if (!storySeen) setBuildingStorySeen("money-tree");
            setReplaying(false);
          }}
          onSkip={() => {
            if (!storySeen) setBuildingStorySeen("money-tree");
            setReplaying(false);
          }}
        />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6 text-center">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.moneyTree}</h1>
      <NpcDialogue
        speakerName={commonContent.villageChiefSpeakerKo}
        message={moneyTreeContent.introMessageKo}
        narrationSrc={
          alreadyActedToday ? moneyTreeContent.narrationSrc.dailyLimit : moneyTreeContent.narrationSrc.intro
        }
      />
      <PiggyPetCharacter mood={mood} />
      <MoneyTreeScene alreadyActedToday={alreadyActedToday} />
      <div className="flex gap-3">
        <Link
          href="/town"
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          {commonContent.backToTownKo}
        </Link>
        <button
          type="button"
          onClick={() => setReplaying(true)}
          className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-6 py-2 text-body text-primary"
        >
          {commonContent.replayStoryKo}
        </button>
      </div>
    </main>
  );
}
