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
      characterId: "seasonal-farmer",
      textKo: "얘들아, 나는 작물을 한 가지만 심지 않아.",
    },
    { id: "scene-7", speaker: "child", textKo: "왜요? 제일 잘 자라는 것만 심으면 되잖아요!" },
    {
      id: "scene-8",
      speaker: "npc",
      characterId: "seasonal-farmer",
      textKo:
        "문제는, 다음에 무슨 계절이 올지 미리 정확히는 알 수 없다는 거야. 봄엔 새싹 작물이, 여름엔 뜨거운 작물이, 가을엔 단단한 작물이, 겨울엔 저장 작물이 강해.",
    },
    {
      id: "scene-9",
      speaker: "npc",
      characterId: "seasonal-farmer",
      textKo:
        "그래서 나는 여러 계절에 강한 작물들을 골고루 심어둬. 그럼 어떤 계절이 와도 밭 전체가 크게 흔들리지 않아 — 이게 바로 '포트폴리오'야.",
    },
    {
      id: "scene-10",
      speaker: "narrator",
      textKo: "포트폴리오는 다음 계절을 맞히는 게 아니라, 어떤 계절이 와도 버티도록 미리 골고루 심어두는 큰 농장이에요.",
    },
    {
      id: "scene-11",
      speaker: "narrator",
      textKo:
        "용돈을 장난감 하나에 다 쓰지 않고 책, 저금, 나눔에도 나눠두면, 장난감이 금방 질려도 다른 즐거움이 남아있는 것과 비슷해요.",
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
