// 온보딩 아바타 파츠 선택지. 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해
// 파츠 카테고리 라벨과 옵션 라벨 모두 이 파일을 통해서만 참조한다.

export interface AvatarOption {
  id: string;
  labelKo: string;
  emoji: string;
  // 값이 있으면 상점 전용 유료 옵션이다(온보딩에는 노출하지 않는다 — freeOptions 참고).
  priceCoins?: number;
}

export type AvatarPartKey = "skin" | "hair" | "outfit" | "pet";

export interface AvatarPartCategory {
  key: AvatarPartKey;
  labelKo: string;
  options: AvatarOption[];
}

const skinOptions: AvatarOption[] = [
  { id: "light", labelKo: "밝은 피부", emoji: "🧑🏻" },
  { id: "medium", labelKo: "중간 피부", emoji: "🧑🏽" },
  { id: "dark", labelKo: "짙은 피부", emoji: "🧑🏿" },
];

const hairOptions: AvatarOption[] = [
  { id: "brown", labelKo: "갈색 머리", emoji: "🟤" },
  { id: "black", labelKo: "검은 머리", emoji: "⚫" },
  { id: "blonde", labelKo: "금발 머리", emoji: "🟡" },
];

const outfitOptions: AvatarOption[] = [
  { id: "default", labelKo: "기본 옷", emoji: "👕" },
  { id: "dress", labelKo: "원피스", emoji: "👗" },
  { id: "hoodie", labelKo: "후드티", emoji: "🧥" },
  { id: "gold-suit", labelKo: "금빛 정장", emoji: "🥻", priceCoins: 150 },
  { id: "hero-cape", labelKo: "슈퍼히어로 망토", emoji: "🦸", priceCoins: 120 },
];

const petOptions: AvatarOption[] = [
  { id: "piggy", labelKo: "저금통 돼지", emoji: "🐷" },
  { id: "cat", labelKo: "동전 고양이", emoji: "🐱" },
  { id: "owl", labelKo: "지혜 부엉이", emoji: "🦉" },
  { id: "dragon", labelKo: "아기 용", emoji: "🐉", priceCoins: 200 },
  { id: "unicorn", labelKo: "유니콘", emoji: "🦄", priceCoins: 180 },
];

export const avatarPartCategories: AvatarPartCategory[] = [
  { key: "skin", labelKo: "피부색", options: skinOptions },
  { key: "hair", labelKo: "머리 색", options: hairOptions },
  { key: "outfit", labelKo: "옷", options: outfitOptions },
  { key: "pet", labelKo: "저금통 펫", options: petOptions },
];

// 온보딩에는 무료 옵션만 노출한다 — 유료 옵션은 상점(data/shopItems.ts)에서만 구매할 수 있다.
export function freeOptions(category: AvatarPartCategory): AvatarOption[] {
  return category.options.filter((option) => option.priceCoins === undefined);
}
