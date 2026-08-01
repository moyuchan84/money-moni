// 대출 창구(대출·레버리지) 건물 전용 카피. docs/idea.md 6-14, docs/implementation.md 8-4, docs/phases.md Phase 5 참고.
// docs/concept-story.md 7-14 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const loanCounterContent = {
  narrationSrc: {
    intro: "/content/audio/loan-counter-intro.mp3",
  },
  introMessageKo:
    "빌린 돈을 더하면 더 큰 걸 할 수 있어! 대신 너무 많이 빌리면 저울이 기울어져. 지렛대 저울로 직접 확인해보자.",
  storyScenes: [
    { id: "scene-1", speaker: "child", textKo: "케이크를 더 크게 만들고 싶은데 재료가 모자라…" },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "내 케이크 조각을 빌려줄게! 대신 내일은 원래보다 조금 더 갚아야 해.",
    },
    {
      id: "scene-3",
      speaker: "child",
      textKo: "오, 오늘 파티는 더 커졌다! 근데 내일 갚을 걸 생각하니 조금 걱정도 되네.",
    },
    {
      id: "scene-4",
      speaker: "npc",
      textKo: "내 돈에 빌린 돈을 더하면 더 큰 걸 할 수 있어. 대신 잘못되면 원래보다 더 크게 잃을 수도 있지.",
    },
  ],
  metaphorLineKo:
    "대출은 친구에게 케이크를 빌리고 내일 조금 더 갚기로 하는 약속이고, 레버리지는 지렛대로 원래보다 훨씬 무거운 걸 드는 것과 같아.",
  realExampleKo:
    "어른들이 집을 살 때 은행에서 돈을 빌리고 나중에 이자와 함께 갚아나가는 것도 대출의 예다.",
  bridgeLineKo: "지렛대로 돌을 들어보자. 너무 욕심내면 저울이 반대로 기울 수도 있으니 조심해야 해.",
  recapLineKo: "빌리니까 더 크게 할 수 있었지만, 갚을 것도 더 커졌지? 그게 대출과 레버리지의 양면이야.",
  instructionsKo: "\"빌린 돈 추가하기\" 버튼을 눌러서 저울에 무게를 더해봐. 너무 많이 더하면 저울이 기울어져!",
  tipThresholdDeg: 25,
  slotSpacingPx: 26,
  reflection: {
    questionKo: "빌린 돈을 몇 번 더했을 때 저울이 기울었어?",
    options: [
      { id: "reflect-early", label: "얼마 안 더했는데 기울었어요" },
      { id: "reflect-many", label: "꽤 많이 더해야 기울었어요" },
      { id: "reflect-careful", label: "다음엔 더 조심해서 더할래요" },
    ],
  },
};
