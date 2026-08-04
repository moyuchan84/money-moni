"use client";

import { buildingList, type District } from "@/data/buildings";
import { dailyQuests, weeklyQuests } from "@/data/quests";
import { parentContent } from "@/data/parentContent";
import { commonContent } from "@/data/commonContent";
import { useGameStore } from "@/store/useGameStore";
import { SoundToggle } from "@/components/hud/SoundToggle";
import { getTodayNewsSimplifierEntry } from "@/data/newsSimplifier";
import { NewsSimplifierCard } from "@/components/parent/NewsSimplifierCard";
import { Button } from "@/components/ui/Button";

const DISTRICTS: District[] = [1, 2, 3];

export default function ParentPage() {
  const nickname = useGameStore((state) => state.avatar.nickname);
  const coins = useGameStore((state) => state.wallet.coins);
  const buildingProgress = useGameStore((state) => state.buildings);
  const districts = useGameStore((state) => state.districts);
  const daily = useGameStore((state) => state.quests.daily);
  const weekly = useGameStore((state) => state.quests.weekly);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);
  const setReducedMotion = useGameStore((state) => state.setReducedMotion);
  const debugUnlockDistrict2 = useGameStore((state) => state.debugUnlockDistrict2);
  const debugUnlockDistrict3 = useGameStore((state) => state.debugUnlockDistrict3);

  const dailyClaimedCount = daily.filter((quest) => Boolean(quest.claimedAt)).length;
  const weeklyClaimedCount = weekly.filter((quest) => Boolean(quest.claimedAt)).length;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{parentContent.titleKo}</h1>
      <p className="text-body text-fg">{parentContent.summaryLineKo(nickname)}</p>

      <section className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4">
        <span className="text-caption text-muted">{parentContent.coinsLabelKo}</span>
        <span className="text-heading font-bold text-ink">{coins}</span>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-body font-semibold text-ink">{parentContent.districtProgressTitleKo}</h2>
        <ul className="flex flex-col gap-1">
          {DISTRICTS.map((district) => {
            const districtBuildings = buildingList.filter(
              (building) => building.district === district && building.routeKind === "building",
            );
            const completedCount = districtBuildings.filter((building) =>
              Boolean(buildingProgress[building.id]?.completedAt),
            ).length;
            const unlocked = districts[district].unlocked;
            return (
              <li key={district} className="flex items-center justify-between text-body text-fg">
                <span>{parentContent.districtLabelKo(district)}</span>
                <span>
                  {unlocked
                    ? `${completedCount}/${districtBuildings.length}`
                    : parentContent.districtLockedKo}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-body font-semibold text-ink">{parentContent.questProgressTitleKo}</h2>
        <ul className="flex flex-col gap-1">
          <li className="flex items-center justify-between text-body text-fg">
            <span>{parentContent.dailyQuestLabelKo}</span>
            <span>
              {dailyClaimedCount}/{dailyQuests.length}
            </span>
          </li>
          <li className="flex items-center justify-between text-body text-fg">
            <span>{parentContent.weeklyQuestLabelKo}</span>
            <span>
              {weeklyClaimedCount}/{weeklyQuests.length}
            </span>
          </li>
        </ul>
      </section>

      <p className="text-caption text-muted">{parentContent.privacyNoteKo}</p>

      <div className="flex items-center gap-2 text-body">
        <span>{parentContent.soundLabelKo}</span>
        <SoundToggle />
      </div>

      <label className="flex min-h-touch items-center gap-2 text-body">
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(event) => setReducedMotion(event.target.checked)}
          className="h-6 w-6"
        />
        {parentContent.reducedMotionLabelKo}
      </label>

      {process.env.NODE_ENV === "development" && (
        <section className="flex flex-col gap-2 rounded-card border border-dashed border-border p-4">
          <h2 className="text-body font-semibold text-ink">{parentContent.devToolsTitleKo}</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={debugUnlockDistrict2}
              className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-4 py-2 text-body text-primary"
            >
              {parentContent.devUnlockDistrict2Ko}
            </button>
            <button
              type="button"
              onClick={debugUnlockDistrict3}
              className="min-h-touch min-w-touch rounded-control border border-border bg-surface px-4 py-2 text-body text-primary"
            >
              {parentContent.devUnlockDistrict3Ko}
            </button>
          </div>
        </section>
      )}

      <NewsSimplifierCard entry={getTodayNewsSimplifierEntry()} />

      <Button href="/town" variant="secondary">
        {commonContent.backToTownKo}
      </Button>
    </main>
  );
}
