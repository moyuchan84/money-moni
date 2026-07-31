"use client";

import type { BuildingId, BuildingMeta, District } from "@/data/buildings";
import { BuildingHotspot } from "./BuildingHotspot";

const DISTRICT_BG: Record<District, string> = {
  1: "bg-district1-primary-light",
  2: "bg-district2-primary-light",
  3: "bg-district3-primary-light",
};

export interface DistrictLayerProps {
  district: District;
  unlocked: boolean;
  buildings: BuildingMeta[];
  completedBuildingIds: BuildingId[];
  onSelectBuilding: (buildingId: BuildingId) => void;
}

export function DistrictLayer({
  district,
  unlocked,
  buildings,
  completedBuildingIds,
  onSelectBuilding,
}: DistrictLayerProps) {
  return (
    <section className={`rounded-3xl p-4 ${DISTRICT_BG[district]} ${unlocked ? "" : "grayscale"}`}>
      <h2 className="mb-2 text-heading font-heading">{district}구역</h2>
      <div className="flex flex-wrap gap-3">
        {buildings.map((building) => (
          <BuildingHotspot
            key={building.id}
            building={building}
            locked={!unlocked}
            completed={completedBuildingIds.includes(building.id)}
            onSelect={onSelectBuilding}
          />
        ))}
      </div>
    </section>
  );
}
