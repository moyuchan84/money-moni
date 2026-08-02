"use client";

import type { BuildingMeta } from "@/data/buildings";
import { commonContent } from "@/data/commonContent";
import { almanacContent } from "@/data/almanacContent";
import { almanacByBuildingId, isAlmanacUnlocked } from "@/data/almanac";
import { useGameStore } from "@/store/useGameStore";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { KnowledgeCard } from "@/components/almanac/KnowledgeCard";
import { Button } from "@/components/ui/Button";

export function AlmanacDetailView({ building }: { building: BuildingMeta }) {
  const buildingsProgress = useGameStore((state) => state.buildings);
  const district2Unlocked = useGameStore((state) => state.districts[2].unlocked);
  const unlocked = isAlmanacUnlocked(building.id, buildingsProgress, district2Unlocked);
  const almanac = almanacByBuildingId[building.id];

  if (!unlocked) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 p-6">
        <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
        <NpcDialogue
          speakerName={commonContent.villageChiefSpeakerKo}
          message={almanacContent.lockedDetailMessageKo}
        />
        <div className="self-start">
          <Button href="/almanac" variant="secondary">
            {almanacContent.backToAlmanacKo}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
      <KnowledgeCard almanac={almanac} />
      <Button href="/almanac" variant="secondary">
        {almanacContent.backToAlmanacKo}
      </Button>
    </main>
  );
}
