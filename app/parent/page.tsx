"use client";

import Link from "next/link";

import { useGameStore } from "@/store/useGameStore";

export default function ParentPage() {
  const nickname = useGameStore((state) => state.avatar.nickname);
  const buildingProgress = useGameStore((state) => state.buildings);

  const completedCount = Object.values(buildingProgress).filter((progress) =>
    Boolean(progress.completedAt),
  ).length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-heading font-heading">보호자용 요약</h1>
      <p className="text-body">
        {nickname || "우리 아이"}가 지금까지 완료한 건물: {completedCount}개
      </p>
      <p className="text-caption">
        이름과 학습 진행도(완료한 건물, 회고 답변) 외의 개인정보는 저장하지 않아요.
      </p>
      <Link href="/town" className="min-h-touch min-w-touch self-start text-body underline">
        마을로 돌아가기
      </Link>
    </main>
  );
}
