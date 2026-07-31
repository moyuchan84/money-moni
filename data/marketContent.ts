// market(시장 · 인플레이션) 건물 전용 카피. docs/idea.md 6-7, docs/implementation.md 8-3 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.
// docs/concept-story.md 7-7 참고.

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
  storyScenes: [
    {
      id: "scene-1",
      speaker: "child",
      textKo: "어? 저번 달엔 200원이었는데 왜 300원이 됐지? 내 돈이 줄어든 것도 아닌데!",
    },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "물건값이 조금씩 오르는 걸 '인플레이션'이라고 해. 재료값도 오르고, 사려는 사람도 많아졌거든.",
    },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "그러니까 같은 100원이라도, 시간이 지나면 살 수 있는 게 조금씩 줄어드는 거야.",
    },
    {
      id: "scene-4",
      speaker: "child",
      textKo: "그럼 저금통에만 오래 넣어두면… 내 돈으로 살 수 있는 게 줄어드는 거야?",
    },
  ],
  metaphorLineKo:
    "인플레이션은 풍선에서 바람이 조금씩 빠지는 것과 같아. 똑같은 100원인데, 살 수 있는 힘이 야금야금 줄어.",
  realExampleKo: "몇 년 전 500원이던 과자가 지금은 1,000원이 된 것도 인플레이션 때문이다.",
  bridgeLineKo: "물가 요정이 나타났어! 요정이 방해하기 전에 100원으로 사탕을 최대한 사보자.",
  recapLineKo: "값이 계속 오르니까 서둘러야 했지? 그래서 어른들은 돈을 그냥 두지 않고 불릴 방법을 찾는 거야.",
};
