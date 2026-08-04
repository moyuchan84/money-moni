"use client";

import type { BuildingId, BuildingMeta } from "@/data/buildings";

export interface BuildingHotspotProps {
  building: BuildingMeta;
  completed: boolean;
  onSelect: (buildingId: BuildingId) => void;
}

export function BuildingHotspot({ building, completed, onSelect }: BuildingHotspotProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(building.id)}
      className="flex h-24 min-h-touch w-full min-w-touch flex-col justify-center rounded-control bg-surface px-3 py-2 text-left text-ink shadow-card transition hover:scale-105"
    >
      <span className="line-clamp-2 text-body font-semibold text-ink">{building.titleKo}</span>
      {completed && <span className="truncate text-caption text-success">✅ 완료</span>}
    </button>
  );
}
