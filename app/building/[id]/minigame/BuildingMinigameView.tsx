"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { BuildingId, BuildingMeta } from "@/data/buildings";
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
import { MiniGameShell } from "@/components/minigame/MiniGameShell";
import { TapToCompleteGame } from "@/components/minigame/TapToCompleteGame";
import { MuseumTimelineGame } from "@/components/minigame/museum/MuseumTimelineGame";
import { LedgerSortingGame } from "@/components/minigame/ledgerHouse/LedgerSortingGame";
import { AllowanceJarGame } from "@/components/minigame/allowanceSquare/AllowanceJarGame";
import { BankInterestGame } from "@/components/minigame/bank/BankInterestGame";
import { JobCenterDayGame } from "@/components/minigame/jobCenter/JobCenterDayGame";
import { AppleHarvestRaceGame } from "@/components/minigame/capitalWarehouse/AppleHarvestRaceGame";
import { MarketPriceGame } from "@/components/minigame/market/MarketPriceGame";
import { LoanCounterGame } from "@/components/minigame/loanCounter/LoanCounterGame";
import { TripleVillageGame } from "@/components/minigame/tripleVillage/TripleVillageGame";
import { SeedFieldGame } from "@/components/minigame/seedField/SeedFieldGame";
import { StockStreetGame } from "@/components/minigame/stockStreet/StockStreetGame";
import { EtfBasketGame } from "@/components/minigame/etfLab/EtfBasketGame";
import { GoldVaultGame } from "@/components/minigame/goldVault/GoldVaultGame";
import { CoinStationGame } from "@/components/minigame/coinStation/CoinStationGame";
import { RewardCelebration } from "@/components/feedback/RewardCelebration";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

// 15개 건물(1~3구역) 모두 전용 미니게임 컴포넌트를 쓴다. TapToCompleteGame/genericMinigameCopy는
// switch의 default 분기(정상 흐름에서는 도달하지 않음)를 위해 남겨둔다.
const MINIGAME_INSTRUCTIONS: Partial<Record<BuildingId, string>> = {
  museum: museumContent.instructionsKo,
  "ledger-house": ledgerHouseContent.instructionsKo,
  "allowance-square": allowanceSquareContent.instructionsKo,
  bank: bankContent.instructionsKo,
  "job-center": jobCenterContent.instructionsKo,
  "capital-warehouse": capitalWarehouseContent.instructionsKo,
  market: marketContent.instructionsKo,
  "loan-counter": loanCounterContent.instructionsKo,
  "triple-village": tripleVillageContent.instructionsKo,
  "seed-field": seedFieldContent.instructionsKo,
  "stock-street": stockStreetContent.instructionsKo,
  "etf-lab": etfLabContent.instructionsKo,
  "gold-vault": goldVaultContent.instructionsKo,
  "coin-station": coinStationContent.instructionsKo,
};

function MinigameByBuilding({ buildingId, onComplete }: { buildingId: BuildingId; onComplete: (score: number) => void }) {
  switch (buildingId) {
    case "museum":
      return <MuseumTimelineGame onComplete={onComplete} />;
    case "ledger-house":
      return <LedgerSortingGame onComplete={onComplete} />;
    case "allowance-square":
      return <AllowanceJarGame onComplete={onComplete} />;
    case "bank":
      return <BankInterestGame onComplete={onComplete} />;
    case "job-center":
      return <JobCenterDayGame onComplete={onComplete} />;
    case "capital-warehouse":
      return <AppleHarvestRaceGame onComplete={onComplete} />;
    case "market":
      return <MarketPriceGame onComplete={onComplete} />;
    case "loan-counter":
      return <LoanCounterGame onComplete={onComplete} />;
    case "triple-village":
      return <TripleVillageGame onComplete={onComplete} />;
    case "seed-field":
      return <SeedFieldGame onComplete={onComplete} />;
    case "stock-street":
      return <StockStreetGame onComplete={onComplete} />;
    case "etf-lab":
      return <EtfBasketGame onComplete={onComplete} />;
    case "gold-vault":
      return <GoldVaultGame onComplete={onComplete} />;
    case "coin-station":
      return <CoinStationGame onComplete={onComplete} />;
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
