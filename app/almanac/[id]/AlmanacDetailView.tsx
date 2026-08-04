"use client";

import type { BuildingMeta } from "@/data/buildings";
import { almanacContent } from "@/data/almanacContent";
import { almanacByBuildingId } from "@/data/almanac";
import { KnowledgeCard } from "@/components/almanac/KnowledgeCard";
import { Button } from "@/components/ui/Button";

export function AlmanacDetailView({ building }: { building: BuildingMeta }) {
  const almanac = almanacByBuildingId[building.id];

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{building.titleKo}</h1>
      <KnowledgeCard almanac={almanac} />
      <Button href="/almanac" variant="secondary">
        {almanacContent.backToAlmanacKo}
      </Button>
    </main>
  );
}
