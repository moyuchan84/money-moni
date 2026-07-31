"use client";

import Link from "next/link";

import { useGameStore } from "@/store/useGameStore";

export default function ParentPage() {
  const nickname = useGameStore((state) => state.avatar.nickname);
  const buildingProgress = useGameStore((state) => state.buildings);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);
  const setReducedMotion = useGameStore((state) => state.setReducedMotion);
  const district2Unlocked = useGameStore((state) => state.districts[2].unlocked);
  const debugUnlockDistrict2 = useGameStore((state) => state.debugUnlockDistrict2);

  const completedCount = Object.values(buildingProgress).filter((progress) =>
    Boolean(progress.completedAt),
  ).length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-heading font-bold text-ink">보호자용 요약</h1>
      <p className="text-body text-fg">
        {nickname || "우리 아이"}가 지금까지 완료한 건물: {completedCount}개
      </p>
      <p className="text-caption text-muted">
        이름과 학습 진행도(완료한 건물, 회고 답변) 외의 개인정보는 저장하지 않아요.
      </p>

      <label className="flex min-h-touch items-center gap-2 text-body">
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(event) => setReducedMotion(event.target.checked)}
          className="h-6 w-6"
        />
        움직임 줄이기 (미니게임 애니메이션을 줄여요)
      </label>

      {/* 개발용 임시 버튼 — 1구역을 실제로 다 깨지 않아도 2구역 콘텐츠를 확인할 수 있게 한다.
          실사용자 배포 전 Phase 6에서 유지 여부를 재검토한다. */}
      <button
        type="button"
        onClick={debugUnlockDistrict2}
        disabled={district2Unlocked}
        className="min-h-touch self-start rounded-control border border-border bg-surface px-4 py-2 text-caption text-primary disabled:opacity-40"
      >
        [개발용] {district2Unlocked ? "2구역 이미 열림" : "2구역 열기"}
      </button>

      <Link href="/town" className="min-h-touch min-w-touch self-start text-body underline">
        마을로 돌아가기
      </Link>
    </main>
  );
}
