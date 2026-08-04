"use client";

import { useRouter } from "next/navigation";

import { buildingList, type BuildingId } from "@/data/buildings";
import { commonContent } from "@/data/commonContent";
import { almanacContent } from "@/data/almanacContent";
import { isAlmanacUnlocked } from "@/data/almanac";
import { useGameStore } from "@/store/useGameStore";
import { AlmanacGrid } from "@/components/almanac/AlmanacGrid";
import { Button } from "@/components/ui/Button";
import { ButtonRow } from "@/components/ui/ButtonRow";

export default function AlmanacPage() {
  const router = useRouter();
  const buildingsProgress = useGameStore((state) => state.buildings);
  const district2Unlocked = useGameStore((state) => state.districts[2].unlocked);

  function handleSelect(buildingId: BuildingId) {
    router.push(`/almanac/${buildingId}`);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.almanac}</h1>
      <p className="text-body text-fg">{almanacContent.hubIntroMessageKo}</p>
      <AlmanacGrid
        buildings={buildingList}
        isUnlocked={(id) => isAlmanacUnlocked(id, buildingsProgress, district2Unlocked)}
        onSelect={handleSelect}
      />
      <ButtonRow>
        <Button href="/town" variant="secondary">
          {commonContent.backToTownKo}
        </Button>
        <Button href="/credits" variant="secondary">
          {commonContent.townNav.credits}
        </Button>
      </ButtonRow>
    </main>
  );
}
