// museum(화폐의 역사) 건물 전용 카피. docs/idea.md 6-1, docs/implementation.md 8-2 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export interface MuseumEra {
  id: string;
  eraLabelKo: string;
  itemEmoji: string;
  itemLabelKo: string;
  currencyEmoji: string;
  currencyLabelKo: string;
  sceneKo: string;
}

export const museumContent = {
  narrationSrc: {
    intro: "/content/audio/museum-intro.mp3",
    fail: "/content/audio/museum-fail.mp3",
  },
  introMessageKo:
    "옛날 사람들은 조개껍데기랑 소금으로 물건을 샀대! 시대를 옆으로 넘기면서 돈이 어떻게 바뀌어왔는지 같이 알아보자.",
  instructionsKo: "타임라인을 옆으로 밀어보고, 그 시대에 맞는 돈으로 물건을 바꿔보자!",
  eras: [
    {
      id: "shell",
      eraLabelKo: "조개껍데기 시대",
      itemEmoji: "🐟",
      itemLabelKo: "생선",
      currencyEmoji: "🐚",
      currencyLabelKo: "조개껍데기",
      sceneKo: "생선을 조개껍데기랑 바꿔보자!",
    },
    {
      id: "coin",
      eraLabelKo: "동전 시대",
      itemEmoji: "🍞",
      itemLabelKo: "빵",
      currencyEmoji: "🪙",
      currencyLabelKo: "동전",
      sceneKo: "빵을 동전으로 사볼까?",
    },
    {
      id: "banknote",
      eraLabelKo: "지폐 시대",
      itemEmoji: "👗",
      itemLabelKo: "옷",
      currencyEmoji: "💵",
      currencyLabelKo: "지폐",
      sceneKo: "옷은 지폐로 사는 게 편하겠다!",
    },
    {
      id: "card",
      eraLabelKo: "카드 시대",
      itemEmoji: "🎮",
      itemLabelKo: "장난감",
      currencyEmoji: "💳",
      currencyLabelKo: "카드",
      sceneKo: "장난감은 카드로 결제해보자.",
    },
    {
      id: "digital",
      eraLabelKo: "디지털 화폐 시대",
      itemEmoji: "🎫",
      itemLabelKo: "입장권",
      currencyEmoji: "📱",
      currencyLabelKo: "디지털 화폐",
      sceneKo: "이제 눈에 안 보이는 돈으로도 살 수 있어!",
    },
  ] satisfies MuseumEra[],
  failAttempt: {
    promptKo: "마지막으로, 조개껍데기로 오늘 시장에서도 물건을 살 수 있을까?",
    failMessageKo: "앗, 조개껍데기는 이제 안 통해요! 시대마다 사용하는 돈이 다르구나.",
  },
  reflection: {
    questionKo: "돈의 모습이 시대마다 바뀐 이유는 뭐였을까?",
    options: [
      { id: "reflect-heavy", label: "무겁고 들고 다니기 불편해서" },
      { id: "reflect-trust", label: "다 같이 믿고 쓸 수 있는 게 필요해서" },
      { id: "reflect-easy", label: "더 쉽고 빠르게 주고받고 싶어서" },
    ],
  },
};
