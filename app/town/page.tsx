"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { buildingList, type BuildingId } from "@/data/buildings";
import { townContent } from "@/data/townContent";
import { useGameStore } from "@/store/useGameStore";
import { TownMap } from "@/components/town/TownMap";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

export default function TownPage() {
  useDistrictBgm("town");
  const router = useRouter();
  const districts = useGameStore((state) => state.districts);
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
    <div className="flex flex-col gap-4">
      <nav className="flex gap-3 text-caption">
        <Link href="/quest-log">퀘스트 로그</Link>
        <Link href="/shop">상점</Link>
        <Link href="/glossary">용어 사전</Link>
        <Link href="/parent">보호자용</Link>
      </nav>
      <NpcDialogue
        speakerName="촌장님"
        message={townContent.introMessageKo}
        narrationSrc={townContent.narrationSrc.intro}
      />
      <TownMap
        buildings={buildingList}
        unlockedDistricts={{
          1: districts[1].unlocked,
          2: districts[2].unlocked,
          3: districts[3].unlocked,
        }}
        completedBuildingIds={completedBuildingIds}
        onSelectBuilding={handleSelectBuilding}
      />
    </div>
  );
}
