"use client";

import Link from "next/link";

import { shopContent } from "@/data/shopContent";
import { shopItems } from "@/data/shopItems";
import { useGameStore } from "@/store/useGameStore";
import { useDistrictBgm } from "@/hooks/useDistrictBgm";
import { CoinWallet } from "@/components/hud/CoinWallet";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";
import { ShopItemCard } from "@/components/shop/ShopItemCard";

export default function ShopPage() {
  useDistrictBgm("town");
  const coins = useGameStore((state) => state.wallet.coins);
  const ownedItemIds = useGameStore((state) => state.shop.ownedItemIds);
  const look = useGameStore((state) => state.avatar.look);
  const purchaseShopItem = useGameStore((state) => state.purchaseShopItem);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading font-bold text-ink">상점</h1>
        <CoinWallet coins={coins} />
      </div>

      <NpcDialogue
        speakerName="촌장님"
        message={shopContent.introMessageKo}
        narrationSrc={shopContent.narrationSrc.intro}
      />

      {shopItems.length === 0 ? (
        <p className="text-body text-fg">{shopContent.emptyStateKo}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shopItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              owned={ownedItemIds.includes(item.id)}
              equipped={look[item.partKey] === item.id}
              canAfford={coins >= item.priceCoins}
              onPurchase={() => purchaseShopItem(item.id, item.partKey, item.priceCoins)}
            />
          ))}
        </div>
      )}

      <Link href="/town" className="min-h-touch min-w-touch self-start text-body text-primary underline">
        마을로 돌아가기
      </Link>
    </main>
  );
}
