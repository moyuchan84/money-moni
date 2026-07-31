"use client";

import type { BuildingId, BuildingMeta, District } from "@/data/buildings";
import { DistrictLayer } from "./DistrictLayer";

export interface TownMapProps {
  buildings: BuildingMeta[];
  unlockedDistricts: Record<District, boolean>;
  completedBuildingIds: BuildingId[];
  onSelectBuilding: (buildingId: BuildingId) => void;
}

const DISTRICTS: District[] = [1, 2, 3];

export function TownMap({
  buildings,
  unlockedDistricts,
  completedBuildingIds,
  onSelectBuilding,
}: TownMapProps) {
  return (
    <div className="flex flex-col gap-4">
      {DISTRICTS.map((district) => (
        <DistrictLayer
          key={district}
          district={district}
          unlocked={unlockedDistricts[district]}
          buildings={buildings.filter((building) => building.district === district)}
          completedBuildingIds={completedBuildingIds}
          onSelectBuilding={onSelectBuilding}
        />
      ))}
    </div>
  );
}
