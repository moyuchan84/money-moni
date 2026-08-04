// 주식회사 거리(주식) 건물 전용 카피. docs/idea.md 6-10, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-10 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

// FOMO(우르르 몰림) 추격 매수·패닉(공포) 매도 연습 이벤트. dayMultipliers[afterDayIndex]가 이미
// 그 날의 실제 가격 변화이고, eventDayMultiplier는 그 순간을 강조하는 추가 배수(급등/급락 체감용),
// chaseOutcomeMultiplier는 "지금 살래요/팔래요"를 눌러 즉시 반응했을 때만 추가로 곱해지는 결과 배수다
// (다음 날이 되어야 반영됨 — "그 순간엔 결과를 몰랐다"는 것을 체감시키기 위함).
export interface PriceEvent {
  afterDayIndex: number; // 이 날 이후에 이벤트 발생
  kind: "hype" | "scare";
  messageKo: string;
  actionLabelKo: string; // "지금 살래요" / "지금 팔래요"
  waitLabelKo: string; // "지켜볼래요"
  eventDayMultiplier: number; // 이벤트 발생 순간의 그 날 배수
  chaseOutcomeMultiplier: number; // 이벤트에 즉시 반응했을 때, 다음 날 반영되는 결과 배수
}

export interface StockIdeaCard {
  id: string;
  labelKo: string;
  emoji: string;
  dayMultipliers: number[]; // 투표 다음 며칠간의 하루 단위 케이크(주가) 크기 배수
  events?: PriceEvent[];
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
    {
      id: "scene-5",
      speaker: "npc",
      characterId: "squirrel-grandpa",
      textKo:
        "나는 어릴 때부터 이 마을 가게들을 조금씩 응원해왔어. 회사가 자라는 걸 오래 지켜보는 것도 재밌단다 — 너무 빨리 부자가 되려고 조바심내지 않아도 괜찮아.",
    },
    {
      id: "scene-6",
      speaker: "npc",
      textKo:
        "참, 하나만 조심해. 갑자기 다들 \"이거다!\" 하고 우르르 몰리는 조각은 조심해야 해. 이미 값이 잔뜩 오른 다음일 때가 많거든.",
    },
    { id: "scene-7", speaker: "child", textKo: "그럼 어떻게 해요?" },
    {
      id: "scene-8",
      speaker: "npc",
      textKo: "유행보다는, 이 회사가 진짜 좋아지고 있는지를 먼저 봐. 그리고 인기가 없어서 값이 쌀 때 눈여겨봐 두는 사람들도 있어.",
    },
    {
      id: "scene-9",
      speaker: "narrator",
      textKo: "우르르 몰릴 때 같이 뛰기보다, 이미 잘 자라고 있는 나무를 미리 알아보는 게 더 지혜로워요.",
    },
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
    {
      id: "idea-soda",
      labelKo: "톡톡 탄산맛",
      emoji: "🥤",
      dayMultipliers: [0.9, 1.3, 1.05],
      events: [
        {
          afterDayIndex: 1,
          kind: "hype",
          messageKo: "친구들이 다 톡톡 탄산맛 조각을 사고 있어! 🏃🏃🏃",
          actionLabelKo: "지금 살래요",
          waitLabelKo: "지켜볼래요",
          eventDayMultiplier: 1.15,
          chaseOutcomeMultiplier: 0.8,
        },
      ],
    },
    {
      id: "idea-spicy",
      labelKo: "매콤 불맛",
      emoji: "🌶️",
      dayMultipliers: [0.85, 0.95, 0.9],
      events: [
        {
          afterDayIndex: 0,
          kind: "scare",
          messageKo: "안 좋은 소문이 돌아서 다들 팔고 있어! 😨",
          actionLabelKo: "지금 팔래요",
          waitLabelKo: "지켜볼래요",
          eventDayMultiplier: 0.9,
          chaseOutcomeMultiplier: 1.1,
        },
      ],
    },
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
