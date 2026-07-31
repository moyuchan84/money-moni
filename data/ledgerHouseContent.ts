// ledger-house(가계부) 건물 전용 카피. docs/idea.md 6-2, docs/implementation.md 8-2 참고.

export const ledgerHouseContent = {
  narrationSrc: {
    intro: "/content/audio/ledger-house-intro.mp3",
  },
  introMessageKo:
    "용돈을 받으면 들어오는 돈, 간식을 사 먹으면 나가는 돈이야. 떨어지는 동전을 알맞은 통에 담아서 가계부를 채워보자!",
  instructionsKo: "떨어지는 동전을 드래그해서 수입 통과 지출 통에 나눠 담아보자!",
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
