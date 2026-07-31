"use client";

import Link from "next/link";

import type { BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { useGameStore } from "@/store/useGameStore";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";

export function BuildingIntroView({ building }: { building: BuildingMeta }) {
  const districtUnlocked = useGameStore((state) => state.districts[building.district].unlocked);
  const completedAt = useGameStore((state) => state.buildings[building.id].completedAt);

  if (!districtUnlocked) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6">
        <h1 className="text-heading font-heading">{building.titleKo}</h1>
        <NpcDialogue
          speakerName="촌장님"
          message="이 구역은 아직 잠겨 있어요. 다른 구역부터 열어보자!"
        />
        <Link
          href="/town"
          className="min-h-touch min-w-touch self-start rounded-full bg-white px-6 py-2 text-body shadow"
        >
          마을로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-heading">{building.titleKo}</h1>
      <NpcDialogue
        speakerName="촌장님"
        message={completedAt ? "벌써 완료한 곳이네! 다시 놀러 와도 좋아." : genericMinigameCopy.introMessageKo}
      />
      <div className="flex gap-3">
        <Link
          href={`/building/${building.id}/minigame`}
          className="min-h-touch min-w-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
        >
          미니게임 시작하기
        </Link>
        <Link
          href="/town"
          className="min-h-touch min-w-touch rounded-full bg-white px-6 py-2 text-body shadow"
        >
          마을로 돌아가기
        </Link>
      </div>
    </main>
  );
}
