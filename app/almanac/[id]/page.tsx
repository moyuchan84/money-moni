import { notFound } from "next/navigation";

import { buildingList } from "@/data/buildings";
import { AlmanacDetailView } from "./AlmanacDetailView";

export function generateStaticParams() {
  // buildingRouteIds(building)와 달리 money-tree(standalone)도 도감 상세 페이지를 갖는다.
  return buildingList.map((building) => ({ id: building.id }));
}

// 정적 export이므로 목록에 없는 id는 빌드 타임에 이미 걸러진다.
export const dynamicParams = false;

export default async function AlmanacDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const building = buildingList.find((item) => item.id === id);
  if (!building) notFound();

  return <AlmanacDetailView building={building} />;
}
