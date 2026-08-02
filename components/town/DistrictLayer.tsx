"use client";

import type { BuildingId, BuildingMeta, District } from "@/data/buildings";
import { BuildingHotspot } from "./BuildingHotspot";

// 구역 웨이파인딩 전용 배경 톤 — CTA/버튼에는 쓰지 않는다(app/globals.css 참고).
const DISTRICT_BG: Record<District, string> = {
  1: "bg-district-1-light",
  2: "bg-district-2-light",
  3: "bg-district-3-light",
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
    <section className={`rounded-card p-4 ${DISTRICT_BG[district]} ${unlocked ? "" : "grayscale"}`}>
      <h2 className="mb-2 text-heading font-bold text-ink">{district}구역</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
