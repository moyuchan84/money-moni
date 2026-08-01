// ETF 조합소(ETF/ETN) 건물 전용 카피. docs/idea.md 6-11, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-11 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export interface EtfSnackCard {
  id: string;
  labelKo: string;
  emoji: string;
  volatilityPct: number; // 하루 동안 가격이 오르내릴 수 있는 폭(%)
}

export const etfLabContent = {
  narrationSrc: {
    intro: "/content/audio/etf-lab-intro.mp3",
  },
  introMessageKo:
    "과자 한 종류만 잔뜩 사면 그게 별로일 때 슬프지만, 여러 과자를 섞은 바구니를 사면 덜 슬퍼! 나만의 바구니를 만들어보자.",
  storyScenes: [
    { id: "scene-1", speaker: "child", textKo: "좋아하는 과자만 잔뜩 샀는데, 이거 하나가 별로면 다 별로잖아…" },
    { id: "scene-2", speaker: "npc", textKo: "그래서 사람들은 여러 과자를 조금씩 섞은 '종합선물세트'를 사기도 해." },
    { id: "scene-3", speaker: "npc", textKo: "하나가 별로여도, 다른 게 맛있으면 덜 아쉽잖아?" },
    {
      id: "scene-4",
      speaker: "narrator",
      textKo: "여러 회사(자산)를 한 바구니에 담아 나눠 갖는 방법을 ETF라고 해요.",
    },
  ],
  metaphorLineKo: "ETF는 여러 과자를 조금씩 섞은 종합선물세트야. 하나가 별로여도 바구니 전체는 덜 흔들려.",
  realExampleKo:
    "한 회사에만 다 걸었다가 그 회사가 안 좋아지면 크게 실망하지만, 여러 회사를 조금씩 나눠 가지면 덜 불안하다.",
  bridgeLineKo: "여러 과자 카드로 나만의 바구니를 만들어보고, 한 종류만 골랐을 때랑 비교해보자.",
  recapLineKo: "바구니로 만드니까 덜 출렁였지? 그게 나눠 담는 이유야.",
  instructionsKo: "과자 카드를 아래 바구니로 끌어다 놓아봐. 2개 이상 담으면 비교해볼 수 있어!",
  minBasketItems: 2,
  singleSnackVolatilityPct: 40,
  snacks: [
    { id: "snack-choco", labelKo: "초코과자", emoji: "🍫", volatilityPct: 40 },
    { id: "snack-chip", labelKo: "감자칩", emoji: "🥔", volatilityPct: 25 },
    { id: "snack-candy", labelKo: "젤리", emoji: "🍬", volatilityPct: 30 },
    { id: "snack-cookie", labelKo: "쿠키", emoji: "🍪", volatilityPct: 15 },
    { id: "snack-icecream", labelKo: "아이스크림", emoji: "🍦", volatilityPct: 35 },
  ] as EtfSnackCard[],
  reflection: {
    questionKo: "바구니에 과자를 몇 개 담았을 때 가장 안심이 됐어?",
    options: [
      { id: "reflect-two", label: "2개만 담아도 괜찮았어요" },
      { id: "reflect-many", label: "여러 개 담을수록 안심됐어요" },
      { id: "reflect-unsure", label: "잘 모르겠어요" },
    ],
  },
};
