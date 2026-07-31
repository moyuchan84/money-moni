import { notFound } from "next/navigation";

import { buildingList, buildingRouteIds } from "@/data/buildings";
import { BuildingMinigameView } from "./BuildingMinigameView";

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

  return <BuildingMinigameView building={building} />;
}
