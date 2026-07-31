"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useGameStore } from "@/store/useGameStore";
import { CoinWallet } from "@/components/hud/CoinWallet";
import { QuestBadge } from "@/components/hud/QuestBadge";
import { SoundToggle } from "@/components/hud/SoundToggle";

export default function TownLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const coins = useGameStore((state) => state.wallet.coins);
  const activeQuestCount = useGameStore(
    (state) => state.quests.daily.length + state.quests.weekly.length,
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-2 p-4">
        <CoinWallet coins={coins} />
        <div className="flex items-center gap-2">
          <QuestBadge activeCount={activeQuestCount} onClick={() => router.push("/quest-log")} />
          <SoundToggle />
        </div>
      </header>
      <main className="flex-1 px-4 pb-4">{children}</main>
    </div>
  );
}
