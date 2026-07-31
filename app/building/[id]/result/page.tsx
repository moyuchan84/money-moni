import Link from "next/link";
import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";

export function generateStaticParams() {
  return buildingRouteIds.map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function BuildingResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = buildingList.find((item) => item.id === id && item.routeKind === "building");
  if (!building) notFound();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p aria-hidden className="text-display">
        🎉
      </p>
      <h1 className="text-heading font-heading">수고했어요!</h1>
      <p className="text-body">
        코인 지급과 회고 질문은 다음 단계에서 연결돼요. (예정 보상: {building.rewardCoins} 코인)
      </p>
      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
      >
        마을로 돌아가기
      </Link>
    </main>
  );
}
