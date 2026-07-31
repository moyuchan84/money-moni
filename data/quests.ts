// 일일/주간 퀘스트 정의. 실제 콘텐츠는 Phase 1(게임 루프 뼈대)에서 채운다.

import type { BuildingId } from "./buildings";

export type QuestId = string;

export interface QuestDefinition {
  id: QuestId;
  titleKo: string;
  goal: number;
  relatedBuilding?: BuildingId;
}

export const dailyQuests: QuestDefinition[] = [
  {
    id: "daily-clear-any-building",
    titleKo: "오늘의 건물 아무 곳이나 클리어하기",
    goal: 1,
  },
];

export const weeklyQuests: QuestDefinition[] = [];
