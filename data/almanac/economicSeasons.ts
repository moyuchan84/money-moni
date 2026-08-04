// 경제 사계절(4계절) → 자산군 반응 공유 테이블. 원래 components/almanac/interactive/EconomicSeasonsWheel.tsx에
// 로컬로 있던 데이터를 이 모듈로 승격했다 — 지식 도감 위젯과 etf-lab 미니게임(포트폴리오 라운드)이
// 같은 시각 언어(아이콘·계절 이름)와 채점 테이블을 공유하게 하기 위함.
// docs/investment-mindset-and-cycles.md 6장, docs/fomo-portfolio-practice.md 4-3 참고.

export type Season = "spring" | "summer" | "autumn" | "winter";
export type ReactionLevel = "grow" | "steady" | "wilt";
export type AssetId = "stock" | "realEstate" | "gold" | "commodity" | "cash";

export const SEASONS: { id: Season; labelKo: string; emoji: string }[] = [
  { id: "spring", labelKo: "봄", emoji: "🌱" },
  { id: "summer", labelKo: "여름", emoji: "☀️" },
  { id: "autumn", labelKo: "가을", emoji: "🍂" },
  { id: "winter", labelKo: "겨울", emoji: "❄️" },
];

export const ASSETS: { id: AssetId; labelKo: string; emoji: string }[] = [
  { id: "stock", labelKo: "주식", emoji: "📈" },
  { id: "realEstate", labelKo: "부동산", emoji: "🏠" },
  { id: "gold", labelKo: "금", emoji: "🪙" },
  { id: "commodity", labelKo: "원자재", emoji: "🌾" },
  { id: "cash", labelKo: "현금", emoji: "💰" },
];

// 부동산은 특정 계절에 편향시키지 않고 항상 "보통"으로 고정한다(설계 문서 6-3 참고).
export const SEASON_REACTIONS: Record<Season, Record<AssetId, ReactionLevel>> = {
  spring: { stock: "grow", realEstate: "steady", gold: "steady", commodity: "steady", cash: "steady" },
  summer: { stock: "grow", realEstate: "steady", gold: "steady", commodity: "grow", cash: "wilt" },
  autumn: { stock: "wilt", realEstate: "steady", gold: "grow", commodity: "grow", cash: "wilt" },
  winter: { stock: "wilt", realEstate: "steady", gold: "grow", commodity: "wilt", cash: "grow" },
};

export const REACTION_LABEL: Record<ReactionLevel, string> = {
  grow: "쑥쑥 자람",
  steady: "보통",
  wilt: "시듦",
};

// 포트폴리오 라운드(etf-lab) 채점용 배수. 도감 위젯은 쓰지 않고, 미니게임 계산에만 쓰인다.
export const REACTION_MULTIPLIER: Record<ReactionLevel, number> = { grow: 1.3, steady: 1.0, wilt: 0.8 };
