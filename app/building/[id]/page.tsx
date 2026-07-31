import Link from "next/link";
import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";

export function generateStaticParams() {
  return buildingRouteIds.map((id) => ({ id }));
}

// 정적 export이므로 목록에 없는 id는 빌드 타임에 이미 걸러진다.
export const dynamicParams = false;

export default async function BuildingIntroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = buildingList.find((item) => item.id === id && item.routeKind === "building");
  if (!building) notFound();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-heading">{building.titleKo}</h1>
      <NpcDialogue speakerName="촌장님" message="이 건물은 아직 준비 중이에요. 곧 만나요!" />
      <div className="flex gap-3">
        <Link
          href={`/building/${building.id}/minigame`}
          className="min-h-touch min-w-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
        >
          미니게임 시작하기
        </Link>
        <Link
          href="/town"
          className="min-h-touch min-w-touch rounded-full bg-white px-6 py-2 text-body shadow"
        >
          마을로 돌아가기
        </Link>
      </div>
    </main>
  );
}
