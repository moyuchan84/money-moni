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
      className={`flex h-24 min-h-touch w-full min-w-touch flex-col justify-center rounded-control px-3 py-2 text-left transition ${
        locked ? "grayscale opacity-40" : "bg-surface text-ink shadow-card hover:scale-105"
      }`}
    >
      <span className="line-clamp-2 text-body font-semibold text-ink">{building.titleKo}</span>
      {locked && <span className="truncate text-caption text-muted">🔒 곧 열려요</span>}
      {!locked && completed && <span className="truncate text-caption text-success">✅ 완료</span>}
    </button>
  );
}
