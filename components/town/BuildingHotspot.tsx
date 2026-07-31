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
      className={`min-h-touch min-w-touch rounded-control px-4 py-3 text-left transition ${
        locked ? "grayscale opacity-40" : "bg-surface text-ink shadow-card hover:scale-105"
      }`}
    >
      <span className="block text-body font-semibold text-ink">{building.titleKo}</span>
      {locked && <span className="block text-caption text-muted">🔒 곧 열려요</span>}
      {!locked && completed && <span className="block text-caption text-success">✅ 완료</span>}
    </button>
  );
}
