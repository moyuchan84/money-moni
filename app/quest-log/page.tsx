"use client";

import Link from "next/link";

import { dailyQuests, weeklyQuests } from "@/data/quests";
import { questLogContent } from "@/data/questLogContent";
import { useGameStore } from "@/store/useGameStore";
import { ProgressBadge } from "@/components/feedback/ProgressBadge";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";

export default function QuestLogPage() {
  useDistrictBgm("town");
  const daily = useGameStore((state) => state.quests.daily);
  const weekly = useGameStore((state) => state.quests.weekly);

  const dailyTitles = new Map(dailyQuests.map((quest) => [quest.id, quest.titleKo]));
  const weeklyTitles = new Map(weeklyQuests.map((quest) => [quest.id, quest.titleKo]));

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">퀘스트 로그</h1>
      <NpcDialogue
        speakerName="촌장님"
        message={questLogContent.introMessageKo}
        narrationSrc={questLogContent.narrationSrc.intro}
      />

      <section>
        <h2 className="mb-2 text-body font-semibold text-ink">오늘의 퀘스트</h2>
        {daily.length === 0 ? (
          <p className="text-caption">아직 등록된 일일 퀘스트가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {daily.map((quest) => (
              <li key={quest.id}>
                <ProgressBadge
                  label={`${dailyTitles.get(quest.id) ?? quest.id} (${quest.progress}/${quest.goal})`}
                  completed={Boolean(quest.claimedAt)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-body font-semibold text-ink">이번 주 퀘스트</h2>
        {weekly.length === 0 ? (
          <p className="text-caption">아직 등록된 주간 퀘스트가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weekly.map((quest) => (
              <li key={quest.id}>
                <ProgressBadge
                  label={`${weeklyTitles.get(quest.id) ?? quest.id} (${quest.progress}/${quest.goal})`}
                  completed={Boolean(quest.claimedAt)}
                />
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
