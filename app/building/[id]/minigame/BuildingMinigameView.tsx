"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { BuildingId, BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { museumContent } from "@/data/museumContent";
import { ledgerHouseContent } from "@/data/ledgerHouseContent";
import { allowanceSquareContent } from "@/data/allowanceSquareContent";
import { useGameStore } from "@/store/useGameStore";
import { MiniGameShell } from "@/components/minigame/MiniGameShell";
import { TapToCompleteGame } from "@/components/minigame/TapToCompleteGame";
import { MuseumTimelineGame } from "@/components/minigame/museum/MuseumTimelineGame";
import { LedgerSortingGame } from "@/components/minigame/ledgerHouse/LedgerSortingGame";
import { AllowanceJarGame } from "@/components/minigame/allowanceSquare/AllowanceJarGame";
import { RewardCelebration } from "@/components/feedback/RewardCelebration";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

// Phase 2에서 실제 미니게임이 완성된 3개 건물만 전용 컴포넌트를 쓰고,
// 나머지 건물은 Phase 1의 범용 "탭해서 완료" 게임으로 계속 배선한다.
const MINIGAME_INSTRUCTIONS: Partial<Record<BuildingId, string>> = {
  museum: museumContent.instructionsKo,
  "ledger-house": ledgerHouseContent.instructionsKo,
  "allowance-square": allowanceSquareContent.instructionsKo,
};

function MinigameByBuilding({ buildingId, onComplete }: { buildingId: BuildingId; onComplete: (score: number) => void }) {
  switch (buildingId) {
    case "museum":
      return <MuseumTimelineGame onComplete={onComplete} />;
    case "ledger-house":
      return <LedgerSortingGame onComplete={onComplete} />;
    case "allowance-square":
      return <AllowanceJarGame onComplete={onComplete} />;
    default:
      return <TapToCompleteGame targetTaps={genericMinigameCopy.targetTaps} onComplete={onComplete} />;
  }
}

export function BuildingMinigameView({ building }: { building: BuildingMeta }) {
  useDistrictBgm(building.district);
  const router = useRouter();
  const completeBuilding = useGameStore((state) => state.completeBuilding);
  const wasAlreadyCompleted = useGameStore((state) =>
    Boolean(state.buildings[building.id].completedAt),
  );

  const [attempt, setAttempt] = useState(0);
  const [celebrationCoins, setCelebrationCoins] = useState<number | null>(null);

  function handleComplete(score: number) {
    const earnedCoins = wasAlreadyCompleted ? 0 : building.rewardCoins;
    completeBuilding(building.id, { score });
    setCelebrationCoins(earnedCoins);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <MiniGameShell
        title={building.titleKo}
        instructions={MINIGAME_INSTRUCTIONS[building.id] ?? genericMinigameCopy.promptKo}
        onRetry={() => setAttempt((value) => value + 1)}
      >
        <MinigameByBuilding key={attempt} buildingId={building.id} onComplete={handleComplete} />
      </MiniGameShell>
      <Link
        href={`/building/${building.id}`}
        className="min-h-touch min-w-touch self-start rounded-control border border-border bg-surface px-6 py-2 text-body text-primary"
      >
        뒤로가기
      </Link>
      <RewardCelebration
        coins={celebrationCoins ?? 0}
        visible={celebrationCoins !== null}
        onDone={() => router.push(`/building/${building.id}/result`)}
      />
    </main>
  );
}
