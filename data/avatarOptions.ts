// 온보딩 아바타 파츠 선택지. 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해
// 파츠 카테고리 라벨과 옵션 라벨 모두 이 파일을 통해서만 참조한다.

export interface AvatarOption {
  id: string;
  labelKo: string;
  emoji: string;
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
];

const petOptions: AvatarOption[] = [
  { id: "piggy", labelKo: "저금통 돼지", emoji: "🐷" },
  { id: "cat", labelKo: "동전 고양이", emoji: "🐱" },
  { id: "owl", labelKo: "지혜 부엉이", emoji: "🦉" },
];

export const avatarPartCategories: AvatarPartCategory[] = [
  { key: "skin", labelKo: "피부색", options: skinOptions },
  { key: "hair", labelKo: "머리 색", options: hairOptions },
  { key: "outfit", labelKo: "옷", options: outfitOptions },
  { key: "pet", labelKo: "저금통 펫", options: petOptions },
];
