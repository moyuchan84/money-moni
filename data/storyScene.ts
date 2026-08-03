// 출처: docs/concept-story.md 5장 "데이터 스키마 & 아키텍처 통합"
// buildings.ts와 분리한 이유: 앞으로 8개 건물 콘텐츠 파일이 이 파일을 import하게 될 때 buildings.ts와의 순환참조를 피하기 위함.

export interface StoryScene {
  id: string; // 예: "scene-1"
  speaker: "narrator" | "npc" | "child";
  characterId?: "village-chief" | "squirrel-grandpa"; // 생략 시 village-chief로 취급(기존 콘텐츠 하위호환)
  textKo: string;
  narrationSrc?: string; // /content/audio/{buildingId}-story-{sceneId}.mp3, 음성 자산 없으면 생략
  illustrationKey?: string; // 일러스트/표정 힌트, 자산 없으면 생략
}

export interface BuildingStoryContent {
  metaphorLineKo: string;
  realExampleKo: string;
  storyScenes: StoryScene[]; // 3~5컷
  bridgeLineKo: string;
  recapLineKo: string;
}
