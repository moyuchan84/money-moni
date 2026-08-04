"use client";

import { dailyQuests, weeklyQuests } from "@/data/quests";
import { questLogContent } from "@/data/questLogContent";
import { commonContent } from "@/data/commonContent";
import { useGameStore } from "@/store/useGameStore";
import { ProgressBadge } from "@/components/feedback/ProgressBadge";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";
import { Button } from "@/components/ui/Button";

export default function QuestLogPage() {
  useDistrictBgm("town");
  const daily = useGameStore((state) => state.quests.daily);
  const weekly = useGameStore((state) => state.quests.weekly);

  const dailyTitles = new Map(dailyQuests.map((quest) => [quest.id, quest.titleKo]));
  const weeklyTitles = new Map(weeklyQuests.map((quest) => [quest.id, quest.titleKo]));

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.questLog}</h1>
      <NpcDialogue
        speakerName={commonContent.villageChiefSpeakerKo}
        message={questLogContent.introMessageKo}
        narrationSrc={questLogContent.narrationSrc.intro}
      />

      <section>
        <h2 className="mb-2 text-body font-semibold text-ink">{questLogContent.dailySectionTitleKo}</h2>
        {daily.length === 0 ? (
          <p className="text-caption">{questLogContent.dailyEmptyKo}</p>
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
        <h2 className="mb-2 text-body font-semibold text-ink">{questLogContent.weeklySectionTitleKo}</h2>
        {weekly.length === 0 ? (
          <p className="text-caption">{questLogContent.weeklyEmptyKo}</p>
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

      <Button href="/town" variant="secondary">
        {commonContent.backToTownKo}
      </Button>
    </main>
  );
}
