// 지식 도감(이론 심화 레이어) 데이터 타입. docs/theory-deepdive.md 4-2 참고.

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

export interface BuildingAlmanac {
  buildingId: BuildingId;
  theoryNoteKo: string; // 조금 더 심화된 설명(공식/개념명 포함)
  timeline: AlmanacTimelineEvent[];
  credits: ImageCredit[];
}
