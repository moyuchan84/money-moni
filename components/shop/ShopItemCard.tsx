"use client";

import { shopContent } from "@/data/shopContent";
import { sfxSrc } from "@/data/soundContent";
import type { ShopItem } from "@/data/shopItems";
import { useSound } from "@/components/providers/SoundProvider";

export interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}

export function ShopItemCard({ item, owned, equipped, canAfford, onPurchase }: ShopItemCardProps) {
  const { playSfx } = useSound();

  function handleClick() {
    if (owned || !canAfford) return;
    onPurchase();
    playSfx(sfxSrc.purchase);
  }

  const buttonLabel = owned
    ? equipped
      ? `${shopContent.ownedLabelKo} · 착용 중`
      : shopContent.ownedLabelKo
    : canAfford
      ? shopContent.buyButtonKo
      : shopContent.insufficientCoinsKo;

  return (
    <div className="flex flex-col items-center gap-2 rounded-card bg-surface p-4 text-center shadow-card">
      <span aria-hidden className="text-display">
        {item.emoji}
      </span>
      <p className="text-body font-semibold text-ink">{item.nameKo}</p>
      <p className="text-caption text-muted">{item.priceCoins}코인</p>
      <button
        type="button"
        onClick={handleClick}
        disabled={owned || !canAfford}
        className={`min-h-touch min-w-touch rounded-control px-4 py-2 text-caption ${
          owned
            ? "bg-success-light text-success"
            : canAfford
              ? "bg-primary text-white"
              : "bg-surface-muted text-muted"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
