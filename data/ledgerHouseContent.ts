// ledger-house(가계부) 건물 전용 카피. docs/idea.md 6-2, docs/implementation.md 8-2 참고.
// docs/concept-story.md 7-2 참고.

export const ledgerHouseContent = {
  narrationSrc: {
    intro: "/content/audio/ledger-house-intro.mp3",
  },
  introMessageKo:
    "용돈을 받으면 들어오는 돈, 간식을 사 먹으면 나가는 돈이야. 떨어지는 동전을 알맞은 통에 담아서 가계부를 채워보자!",
  instructionsKo: "떨어지는 동전을 드래그해서 수입 통과 지출 통에 나눠 담아보자!",
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "오늘 용돈 500원 받았지? 이건 초록 화살표! 들어온 돈이야." },
    { id: "scene-2", speaker: "npc", textKo: "그런데 아까 젤리 사 먹었잖아. 그건 빨간 화살표, 나간 돈!" },
    { id: "scene-3", speaker: "npc", textKo: "초록이 많으면 저금통이 통통해지고, 빨강이 너무 많으면 홀쭉해져." },
    { id: "scene-4", speaker: "child", textKo: "그럼 나는 오늘 어떻게 됐는지 한번 적어볼래!" },
  ],
  metaphorLineKo: "가계부는 내 돈이 어디서 왔다가 어디로 갔는지 그려주는 지도야.",
  realExampleKo: "문구점에서 500원짜리 지우개를 사면, 그 순간 지도에 빨간 화살표 하나가 그려지는 셈이다.",
  bridgeLineKo: "오늘 하루 동전들이 어디로 가는지, 우리가 직접 화살표를 그려볼까?",
  recapLineKo: "초록 화살표, 빨간 화살표! 이제 어디로 갔는지 한눈에 보이지?",
  incomeBinLabelKo: "수입 💰",
  spendingBinLabelKo: "지출 💸",
  totalCoins: 8,
  reflection: {
    questionKo: "이번 판에서 어떤 동전 구분이 더 헷갈렸어?",
    options: [
      { id: "reflect-income", label: "들어오는 돈(수입) 구분하기" },
      { id: "reflect-spending", label: "나가는 돈(지출) 구분하기" },
      { id: "reflect-none", label: "둘 다 잘 구분했어요!" },
    ],
  },
};
