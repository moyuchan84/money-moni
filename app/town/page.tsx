"use client";

import { useRouter } from "next/navigation";

import { buildingList, type BuildingId } from "@/data/buildings";
import { commonContent } from "@/data/commonContent";
import { townContent } from "@/data/townContent";
import { useGameStore } from "@/store/useGameStore";
import { TownMap } from "@/components/town/TownMap";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

export default function TownPage() {
  useDistrictBgm("town");
  const router = useRouter();
  const buildingProgress = useGameStore((state) => state.buildings);

  const completedBuildingIds = Object.entries(buildingProgress)
    .filter(([, progress]) => Boolean(progress.completedAt))
    .map(([id]) => id as BuildingId);

  function handleSelectBuilding(buildingId: BuildingId) {
    const building = buildingList.find((item) => item.id === buildingId);
    if (!building) return;
    // money-tree(standalone)는 /money-tree, 그 외는 /building/[id]로 이동한다.
    router.push(building.routeKind === "standalone" ? `/${buildingId}` : `/building/${buildingId}`);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <NpcDialogue
        speakerName={commonContent.villageChiefSpeakerKo}
        message={townContent.introMessageKo}
        narrationSrc={townContent.narrationSrc.intro}
      />
      <TownMap
        buildings={buildingList}
        completedBuildingIds={completedBuildingIds}
        onSelectBuilding={handleSelectBuilding}
      />
    </main>
  );
}
