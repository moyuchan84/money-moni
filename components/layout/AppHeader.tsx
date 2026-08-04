"use client";

import { usePathname, useRouter } from "next/navigation";

import { commonContent } from "@/data/commonContent";
import { useGameStore } from "@/store/useGameStore";
import { CoinWallet } from "@/components/hud/CoinWallet";
import { QuestBadge } from "@/components/hud/QuestBadge";
import { SoundToggle } from "@/components/hud/SoundToggle";
import { GameLogo } from "@/components/hud/GameLogo";

// 항상 보이는 전역 상단 헤더 — 옛 app/town/layout.tsx의 헤더 로직을 그대로 흡수했다.
export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const coins = useGameStore((state) => state.wallet.coins);
  const activeQuestCount = useGameStore(
    (state) => state.quests.daily.length + state.quests.weekly.length,
  );
  const isTown = pathname === "/town";

  return (
    <header className="flex items-center justify-between gap-2 border-b border-border p-4">
      {isTown ? (
        <GameLogo text={commonContent.header.wordmarkKo} size="header" />
      ) : (
        <button
          type="button"
          onClick={() => router.push("/town")}
          aria-label={commonContent.header.backToTownAriaKo}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-pill bg-surface px-3 py-1 text-body text-primary shadow-card"
        >
          <span aria-hidden>←</span>
        </button>
      )}

      <div className="flex items-center gap-2">
        {hasHydrated ? (
          <CoinWallet coins={coins} />
        ) : (
          <span className="inline-block min-h-touch w-16 rounded-pill bg-surface-muted" aria-hidden />
        )}
        {hasHydrated ? (
          <QuestBadge activeCount={activeQuestCount} onClick={() => router.push("/quest-log")} />
        ) : (
          <span className="inline-block min-h-touch min-w-touch rounded-pill bg-surface-muted" aria-hidden />
        )}
        <SoundToggle />
      </div>
    </header>
  );
}
