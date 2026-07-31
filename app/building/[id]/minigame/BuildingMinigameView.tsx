"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { BuildingMeta } from "@/data/buildings";
import { genericMinigameCopy } from "@/data/genericMinigame";
import { useGameStore } from "@/store/useGameStore";
import { MiniGameShell } from "@/components/minigame/MiniGameShell";
import { TapToCompleteGame } from "@/components/minigame/TapToCompleteGame";
import { RewardCelebration } from "@/components/feedback/RewardCelebration";

export function BuildingMinigameView({ building }: { building: BuildingMeta }) {
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
        instructions={genericMinigameCopy.promptKo}
        onRetry={() => setAttempt((value) => value + 1)}
      >
        <TapToCompleteGame
          key={attempt}
          targetTaps={genericMinigameCopy.targetTaps}
          onComplete={handleComplete}
        />
      </MiniGameShell>
      <Link
        href={`/building/${building.id}`}
        className="min-h-touch min-w-touch self-start rounded-full bg-white px-6 py-2 text-body shadow"
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
