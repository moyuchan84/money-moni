import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";
import { BuildingResultView } from "./BuildingResultView";

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

  return <BuildingResultView building={building} />;
}
