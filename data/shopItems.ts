// 상점 카탈로그. 완전히 새 스키마를 만들지 않고 data/avatarOptions.ts의 유료 옵션에서
// 그대로 파생한다(옵션 id가 곧 아이템 id이자 store.avatar.look에 저장되는 값).

import { avatarPartCategories, type AvatarPartKey } from "./avatarOptions";

export interface ShopItem {
  id: string;
  partKey: AvatarPartKey;
  nameKo: string;
  emoji: string;
  priceCoins: number;
}

export const shopItems: ShopItem[] = avatarPartCategories.flatMap((category) =>
  category.options
    .filter((option) => option.priceCoins !== undefined)
    .map((option) => ({
      id: option.id,
      partKey: category.key,
      nameKo: option.labelKo,
      emoji: option.emoji,
      priceCoins: option.priceCoins as number,
    })),
);
