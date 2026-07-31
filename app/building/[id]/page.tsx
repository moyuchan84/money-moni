import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";
import { BuildingIntroView } from "./BuildingIntroView";

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

  return <BuildingIntroView building={building} />;
}
