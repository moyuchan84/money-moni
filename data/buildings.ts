// 15개 학습 모듈의 정적 메타데이터. 실제 카피(대사, 설명)는 이후 Phase에서 채운다.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 모든 건물 정보는 이 파일을 통해서만 참조한다.

export type District = 1 | 2 | 3;

export type BuildingId =
  | "museum"
  | "ledger-house"
  | "allowance-square"
  | "bank"
  | "money-tree"
  | "job-center"
  | "market"
  | "capital-warehouse"
  | "seed-field"
  | "stock-street"
  | "etf-lab"
  | "gold-vault"
  | "coin-station"
  | "loan-counter"
  | "triple-village";

// CLAUDE.md 절대 규칙 6: 대부분의 모듈은 /building/[id] 3-라우트 구조를 따르지만,
// money-tree는 아바타 개인 마당 위젯이라 /money-tree 단일 라우트만 갖는 예외다.
export type BuildingRouteKind = "building" | "standalone";

export type UnlockCondition =
  | { type: "always" }
  | { type: "district" }; // 소속 구역(district)이 열려야 함 — 실제 판정은 store의 districts[district].unlocked 참고

export interface BuildingMeta {
  id: BuildingId;
  district: District;
  routeKind: BuildingRouteKind;
  titleKo: string;
  unlockCondition: UnlockCondition;
  rewardCoins: number;
}

export const buildings: Record<BuildingId, BuildingMeta> = {
  museum: {
    id: "museum",
    district: 1,
    routeKind: "building",
    titleKo: "박물관 (화폐의 역사)",
    unlockCondition: { type: "always" },
    rewardCoins: 30,
  },
  "ledger-house": {
    id: "ledger-house",
    district: 1,
    routeKind: "building",
    titleKo: "가계부 오두막",
    unlockCondition: { type: "always" },
    rewardCoins: 30,
  },
  "allowance-square": {
    id: "allowance-square",
    district: 1,
    routeKind: "building",
    titleKo: "용돈 배분 광장",
    unlockCondition: { type: "always" },
    rewardCoins: 30,
  },
  bank: {
    id: "bank",
    district: 2,
    routeKind: "building",
    titleKo: "은행 (저축·이자)",
    unlockCondition: { type: "district" },
    rewardCoins: 50,
  },
  "money-tree": {
    id: "money-tree",
    district: 2,
    routeKind: "standalone",
    titleKo: "머니나무 마당",
    unlockCondition: { type: "district" },
    rewardCoins: 50,
  },
  "job-center": {
    id: "job-center",
    district: 2,
    routeKind: "building",
    titleKo: "직업소개소",
    unlockCondition: { type: "district" },
    rewardCoins: 50,
  },
  market: {
    id: "market",
    district: 2,
    routeKind: "building",
    titleKo: "시장 (인플레이션)",
    unlockCondition: { type: "district" },
    rewardCoins: 50,
  },
  "capital-warehouse": {
    id: "capital-warehouse",
    district: 2,
    routeKind: "building",
    titleKo: "자본 도구창고",
    unlockCondition: { type: "district" },
    rewardCoins: 50,
  },
  "seed-field": {
    id: "seed-field",
    district: 3,
    routeKind: "building",
    titleKo: "투자 씨앗밭",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "stock-street": {
    id: "stock-street",
    district: 3,
    routeKind: "building",
    titleKo: "주식회사 거리",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "etf-lab": {
    id: "etf-lab",
    district: 3,
    routeKind: "building",
    titleKo: "ETF 조합소",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "gold-vault": {
    id: "gold-vault",
    district: 3,
    routeKind: "building",
    titleKo: "금고",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "coin-station": {
    id: "coin-station",
    district: 3,
    routeKind: "building",
    titleKo: "코인 정거장",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "loan-counter": {
    id: "loan-counter",
    district: 3,
    routeKind: "building",
    titleKo: "대출 창구",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
  "triple-village": {
    id: "triple-village",
    district: 3,
    routeKind: "building",
    titleKo: "세 갈래 실험마을",
    unlockCondition: { type: "district" },
    rewardCoins: 80,
  },
};

export const buildingList: BuildingMeta[] = Object.values(buildings);

// /building/[id] 정적 라우트 생성 대상 — money-tree(standalone)는 제외한다.
export const buildingRouteIds: BuildingId[] = buildingList
  .filter((b) => b.routeKind === "building")
  .map((b) => b.id);
