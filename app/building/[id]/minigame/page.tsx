import Link from "next/link";
import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";
import { MiniGameShell } from "@/components/minigame/MiniGameShell";
import { PixiCanvas } from "@/components/minigame/PixiCanvas";

export function generateStaticParams() {
  return buildingRouteIds.map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function BuildingMinigamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = buildingList.find((item) => item.id === id && item.routeKind === "building");
  if (!building) notFound();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <MiniGameShell title={building.titleKo} instructions="미니게임을 준비하고 있어요.">
        <PixiCanvas />
      </MiniGameShell>
      <div className="flex gap-3">
        <Link
          href={`/building/${building.id}/result`}
          className="min-h-touch min-w-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
        >
          결과 보기
        </Link>
        <Link
          href={`/building/${building.id}`}
          className="min-h-touch min-w-touch rounded-full bg-white px-6 py-2 text-body shadow"
        >
          뒤로가기
        </Link>
      </div>
    </main>
  );
}
