// 주식회사 거리(주식) 건물 전용 카피. docs/idea.md 6-10, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-10 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export interface StockIdeaCard {
  id: string;
  labelKo: string;
  emoji: string;
  dayMultipliers: number[]; // 투표 다음 며칠간의 하루 단위 케이크(주가) 크기 배수
}

export const stockStreetContent = {
  narrationSrc: {
    intro: "/content/audio/stock-street-intro.mp3",
  },
  introMessageKo:
    "짱구과자 회사는 케이크처럼 여러 조각(주식)으로 나뉘어 있어! 신제품에 투표하고 다음 날 조각이 어떻게 변하는지 지켜보자.",
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "이 회사는 케이크처럼 여러 조각으로 나뉘어 있어. 그 조각 하나하나가 '주식'이야." },
    { id: "scene-2", speaker: "npc", textKo: "신제품이 인기를 끌면 회사가 잘돼서, 그 조각의 가치도 커져!" },
    { id: "scene-3", speaker: "npc", textKo: "근데 맛이 없으면? 조각도 작아지지…" },
    { id: "scene-4", speaker: "child", textKo: "그럼 내가 어떤 조각을 갖고 있으면, 그 회사가 잘되길 응원하게 되겠네!" },
  ],
  metaphorLineKo: "주식은 회사를 나눈 케이크 조각 하나야. 회사가 잘되면 내 조각도 커져.",
  realExampleKo:
    "내가 좋아하는 과자 회사, 게임 회사가 신제품으로 큰 인기를 끌면 그 회사의 주식을 가진 사람들도 함께 좋은 소식을 듣게 된다.",
  bridgeLineKo: "짱구과자의 신제품 아이디어에 투표해보고, 다음 날 케이크가 어떻게 변하는지 지켜보자.",
  recapLineKo: "회사가 잘되니까 조각도 커졌지? 그게 주식이 움직이는 이유야.",
  instructionsKo:
    "신제품 아이디어 하나를 골라봐. 그다음 \"다음 날\" 버튼을 눌러 케이크(주가)가 어떻게 변하는지 확인해보자!",
  baseCakeSize: 10,
  ideas: [
    { id: "idea-cookie", labelKo: "초코 쿠키맛", emoji: "🍪", dayMultipliers: [1.2, 1.1, 1.15] },
    { id: "idea-soda", labelKo: "톡톡 탄산맛", emoji: "🥤", dayMultipliers: [0.9, 1.3, 1.05] },
    { id: "idea-spicy", labelKo: "매콤 불맛", emoji: "🌶️", dayMultipliers: [0.85, 0.95, 0.9] },
  ] as StockIdeaCard[],
  reflection: {
    questionKo: "케이크가 커질 때랑 작아질 때, 기분이 어땠어?",
    options: [
      { id: "reflect-happy", label: "커질 때 신났어요" },
      { id: "reflect-worried", label: "작아질 때 걱정됐어요" },
      { id: "reflect-curious", label: "다음엔 뭐가 나올지 궁금했어요" },
    ],
  },
};
