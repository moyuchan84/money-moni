"use client";

import type { BuildingId, BuildingMeta } from "@/data/buildings";

export interface BuildingHotspotProps {
  building: BuildingMeta;
  locked: boolean;
  completed: boolean;
  onSelect: (buildingId: BuildingId) => void;
}

export function BuildingHotspot({ building, locked, completed, onSelect }: BuildingHotspotProps) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(building.id)}
      className={`min-h-touch min-w-touch rounded-2xl px-4 py-3 text-left transition ${
        locked ? "grayscale opacity-40" : "bg-white text-gray-900 shadow hover:scale-105"
      }`}
    >
      <span className="block text-body font-heading">{building.titleKo}</span>
      {locked && <span className="block text-caption">🔒 곧 열려요</span>}
      {!locked && completed && <span className="block text-caption">✅ 완료</span>}
    </button>
  );
}
