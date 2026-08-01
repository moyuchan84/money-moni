// 세 갈래 실험마을(자본주의/사회주의/공산주의) 건물 전용 카피. docs/idea.md 6-8, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-15 참고.
// CLAUDE.md 절대 규칙 7: 이 모듈은 정답·우열 판정 로직을 추가하지 않는다. 결과 문구는 사실 서술만 담고,
// 결과 화면도 건물 맞춤 recap 대사 뒤 범용 <ReflectionPrompt />로만 마무리한다.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export type EconomicMode = "capitalism" | "socialism" | "communism";

export interface VillageDefinition {
  mode: EconomicMode;
  nameKo: string;
  emoji: string;
  // {mine} = 내 몫, {total} = 마을 전체 생산량으로 치환된다. 어떤 모드도 "더 낫다"고 서술하지 않는다.
  resultTemplateKo: string;
}

export const tripleVillageContent = {
  narrationSrc: {
    intro: "/content/audio/triple-village-intro.mp3",
  },
  introMessageKo:
    "세 마을 모두 빵을 만들지만, 만든 빵을 나누는 방법은 서로 달라. 세 마을을 오가며 직접 빵집을 운영해보자.",
  storyScenes: [
    {
      id: "scene-1",
      speaker: "narrator",
      textKo: "세 마을 모두 빵을 만들어요. 하지만 만든 빵을 나누는 방법은 서로 달라요.",
    },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "우리 마을에선 각자 자기 가게를 운영해. 더 맛있게, 더 재밌게 만든 사람이 손님을 더 많이 데려가지.",
    },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "우리 마을에선 만든 빵을 모아서 다 같이 똑같이 나눠. 누가 더 열심히 만들어도 결과는 같아.",
    },
    { id: "scene-4", speaker: "npc", textKo: "우리 마을엔 아예 '내 가게'가 없어. 다 함께 짓고, 다 함께 나눠." },
  ],
  metaphorLineKo: "세 마을은 같은 빵을 굽지만, '누가 얼마나 가질지'를 정하는 규칙이 서로 다른 거야.",
  realExampleKo:
    "조별 과제를 했을 때 잘한 사람이 더 칭찬받는 것과, 다 같이 똑같이 나누는 것 중 어느 쪽이 더 좋았는지 떠올려보면 이해가 쉽다.",
  bridgeLineKo: "세 마을을 오가며 똑같이 빵집을 운영해보고, 어떤 게 다른지 직접 느껴보자.",
  recapLineKo: "세 마을 다 해봤지? 뭐가 더 좋다고 딱 잘라 말하긴 어려워. 각자 장단점이 있으니, 네 생각은 어때?",
  instructionsKo:
    "화면을 좌우로 넘기거나 화살표·점 버튼을 눌러서 세 마을을 오갈 수 있어. 빵 그림을 탭해서 반죽해보자!",
  roundDurationSeconds: 8,
  npcTapIntervalMinMs: 500,
  npcTapIntervalMaxMs: 1200,
  villages: [
    {
      mode: "capitalism",
      nameKo: "자본주의 마을",
      emoji: "🥖",
      resultTemplateKo: "네가 만든 빵 {mine}개, 네가 다 가져가요.",
    },
    {
      mode: "socialism",
      nameKo: "사회주의 마을",
      emoji: "🍞",
      resultTemplateKo: "마을 전체 {total}개를 셋이 똑같이 나눠 {mine}개씩 가져가요.",
    },
    {
      mode: "communism",
      nameKo: "공산주의 마을",
      emoji: "🤝",
      resultTemplateKo: "마을 전체가 함께 만든 빵은 {mine}개예요.",
    },
  ] as VillageDefinition[],
  reflection: {
    questionKo: "세 마을 중 어떤 마을이 가장 기억에 남았어?",
    options: [
      { id: "reflect-capitalism", label: "자본주의 마을이요" },
      { id: "reflect-socialism", label: "사회주의 마을이요" },
      { id: "reflect-communism", label: "공산주의 마을이요" },
    ],
  },
};
