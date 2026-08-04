// 지식 도감(이론 심화 레이어) 데이터 타입. docs/theory-deepdive.md 4-2 참고.
// 인터랙티브 위젯 스키마 확장은 docs/almanac-interactive.md 3장 참고.

import type { BuildingId } from "../buildings";

export interface AlmanacTimelineEvent {
  year: string; // "기원전 7세기", "1944년" 등 서술형 허용
  titleKo: string;
  descKo: string;
  imageKey?: string; // public/images/almanac/{buildingId}/{imageKey}.jpg
}

export type ImageLicense = "PD" | "CC-BY" | "CC-BY-SA";

export interface ImageCredit {
  imageKey: string;
  titleKo: string; // 이미지 설명
  authorKo: string;
  license: ImageLicense;
  sourceUrl: string; // 위키미디어 커먼즈 원본 파일 페이지
}

// components/almanac/interactive/AlmanacWidgetSlot.tsx의 레지스트리 키와 1:1 대응한다.
export type AlmanacWidgetKey =
  | "compound-interest" // money-tree
  | "interest-simulator" // bank
  | "inflation-balloon" // market
  | "income-race" // job-center
  | "tool-compare" // capital-warehouse
  | "seed-odds" // seed-field
  | "stock-price" // stock-street
  | "diversification-basket" // etf-lab
  | "gold-timeline" // gold-vault
  | "coin-track" // coin-station
  | "leverage-seesaw" // loan-counter
  | "arrow-flow" // ledger-house
  | "jar-ratio" // allowance-square
  | "bread-split" // triple-village
  | "money-shape-timeline" // museum
  | "economic-seasons-wheel"; // etf-lab

export interface BuildingAlmanac {
  buildingId: BuildingId;
  theoryNoteKo: string; // 조금 더 심화된 설명(공식/개념명 포함)
  timeline: AlmanacTimelineEvent[];
  credits: ImageCredit[];
  // 없으면 "직접 만져보기" 섹션 자체를 렌더링하지 않는다. etf-lab처럼 위젯이 여러 개면 배열로 둔다.
  interactiveWidgetKey?: AlmanacWidgetKey | AlmanacWidgetKey[];
}
