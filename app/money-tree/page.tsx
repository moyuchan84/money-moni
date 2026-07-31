"use client";

import Link from "next/link";

import { moneyTreeContent } from "@/data/moneyTreeContent";
import { useGameStore } from "@/store/useGameStore";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
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

  const today = new Date().toISOString().slice(0, 10);
  const alreadyActedToday = lastActionAt?.slice(0, 10) === today;
  const mood = computeMood(lastActionAt, alreadyActedToday);

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6 text-center">
      <h1 className="text-heading font-bold text-ink">머니나무 마당</h1>
      <NpcDialogue
        speakerName="촌장님"
        message={moneyTreeContent.introMessageKo}
        narrationSrc={
          alreadyActedToday ? moneyTreeContent.narrationSrc.dailyLimit : moneyTreeContent.narrationSrc.intro
        }
      />
      <PiggyPetCharacter mood={mood} />
      <MoneyTreeScene alreadyActedToday={alreadyActedToday} />
      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        마을로 돌아가기
      </Link>
    </main>
  );
}
