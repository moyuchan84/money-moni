"use client";

import Link from "next/link";

import type { BuildingId, BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { museumContent } from "@/data/museumContent";
import { ledgerHouseContent } from "@/data/ledgerHouseContent";
import { allowanceSquareContent } from "@/data/allowanceSquareContent";
import { useGameStore } from "@/store/useGameStore";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
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
};

export function BuildingIntroView({ building }: { building: BuildingMeta }) {
  useDistrictBgm(building.district);
  const districtUnlocked = useGameStore((state) => state.districts[building.district].unlocked);
  const completedAt = useGameStore((state) => state.buildings[building.id].completedAt);
  const introContent = INTRO_CONTENT[building.id];

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
      </div>
    </main>
  );
}
