"use client";

import type { BuildingId, BuildingMeta, District } from "@/data/buildings";
import { almanacContent } from "@/data/almanacContent";

// components/town/DistrictLayer.tsx/BuildingHotspot.tsx의 그리드·잠금 스타일을 그대로 재사용한다.
const DISTRICT_BG: Record<District, string> = {
  1: "bg-district-1-light",
  2: "bg-district-2-light",
  3: "bg-district-3-light",
};

export interface AlmanacGridProps {
  buildings: BuildingMeta[];
  onSelect: (buildingId: BuildingId) => void;
}

export function AlmanacGrid({ buildings, onSelect }: AlmanacGridProps) {
  const districts: District[] = [1, 2, 3];

  return (
    <div className="flex flex-col gap-4">
      {districts.map((district) => {
        const districtBuildings = buildings.filter((b) => b.district === district);
        if (districtBuildings.length === 0) return null;

        return (
          <section key={district} className={`rounded-card p-4 ${DISTRICT_BG[district]}`}>
            <h2 className="mb-2 text-heading font-bold text-ink">{district}구역</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {districtBuildings.map((building) => (
                <button
                  key={building.id}
                  type="button"
                  onClick={() => onSelect(building.id)}
                  className="flex h-24 min-h-touch w-full min-w-touch flex-col justify-center rounded-control bg-surface px-3 py-2 text-left text-ink shadow-card transition hover:scale-105"
                >
                  <span className="line-clamp-2 text-body font-semibold text-ink">{building.titleKo}</span>
                  <span className="truncate text-caption text-muted">{almanacContent.unlockedCaptionKo}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
