"use client";

import Link from "next/link";

import { useGameStore } from "@/store/useGameStore";
import { ProgressBadge } from "@/components/feedback/ProgressBadge";

export default function QuestLogPage() {
  const daily = useGameStore((state) => state.quests.daily);
  const weekly = useGameStore((state) => state.quests.weekly);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-heading">퀘스트 로그</h1>

      <section>
        <h2 className="mb-2 text-body font-heading">오늘의 퀘스트</h2>
        {daily.length === 0 ? (
          <p className="text-caption">아직 등록된 일일 퀘스트가 없어요. (Phase 1에서 추가돼요)</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {daily.map((quest) => (
              <li key={quest.id}>
                <ProgressBadge label={quest.id} completed={Boolean(quest.claimedAt)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-body font-heading">이번 주 퀘스트</h2>
        {weekly.length === 0 ? (
          <p className="text-caption">아직 등록된 주간 퀘스트가 없어요. (Phase 1에서 추가돼요)</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weekly.map((quest) => (
              <li key={quest.id}>
                <ProgressBadge label={quest.id} completed={Boolean(quest.claimedAt)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/town" className="min-h-touch min-w-touch self-start text-body underline">
        마을로 돌아가기
      </Link>
    </main>
  );
}
