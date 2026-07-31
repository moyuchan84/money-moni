// market(시장 · 인플레이션) 건물 전용 카피. docs/idea.md 6-7, docs/implementation.md 8-3 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const marketContent = {
  narrationSrc: {
    intro: "/content/audio/market-intro.mp3",
  },
  introMessageKo:
    "작년엔 100원으로 사탕 5개를 살 수 있었는데, 물가 요정이 나타나서 사탕값을 자꾸 올리고 있어! 요정이 값을 올리기 전에 사탕을 최대한 많이 사보자.",
  instructionsKo: "'사탕 사기' 버튼을 눌러서, 물가 요정이 값을 올리기 전에 최대한 많이 사보자!",
  startingBudget: 100,
  startingPrice: 20,
  priceIncrease: 4,
  priceTickIntervalMs: 1200,
  gameDurationSeconds: 15,
  reflection: {
    questionKo: "물가 요정이 값을 올릴 때 기분이 어땠어?",
    options: [
      { id: "reflect-rush", label: "빨리 사야 해서 조급했어요" },
      { id: "reflect-fewer", label: "같은 돈으로 더 적게 살 수 있어서 아쉬웠어요" },
      { id: "reflect-fun", label: "요정을 피하는 게 재밌었어요" },
    ],
  },
};
