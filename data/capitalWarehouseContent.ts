// capital-warehouse(자본 도구창고 · 자본) 건물 전용 카피. docs/idea.md 6-15, docs/phases.md Phase 4 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.
// docs/concept-story.md 7-8 참고.

export const capitalWarehouseContent = {
  narrationSrc: {
    intro: "/content/audio/capital-warehouse-intro.mp3",
  },
  introMessageKo:
    "빵집 아저씨의 오븐, 농부의 트랙터, 우리 마을의 머니나무처럼 돈을 더 버는 데 쓰이는 도구나 재산을 자본이라고 해. 손으로만 사과를 따는 것과 사다리(자본)를 쓰는 것, 뭐가 더 유리할까?",
  instructionsKo: "제한 시간 동안 '손으로 따기'를 눌러서 사과를 모아봐! 사다리를 가진 친구와 비교해보자.",
  gameDurationSeconds: 15,
  toolTickIntervalMs: 700,
  reflection: {
    questionKo: "사다리(자본)를 가진 친구와 비교했을 때 어떤 생각이 들었어?",
    options: [
      { id: "reflect-tool-helps", label: "도구가 있으면 훨씬 유리하구나!" },
      { id: "reflect-hand-tired", label: "손으로만 하니까 힘들었어요" },
      { id: "reflect-want-tool", label: "나도 도구를 갖고 싶어졌어요" },
    ],
  },
  storyScenes: [
    {
      id: "scene-1",
      speaker: "npc",
      textKo: "오븐이 없던 시절엔 손으로만 빵을 구웠어. 하루에 열 개도 힘들었지.",
    },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "근데 오븐을 산 뒤부터는 하루에 백 개도 구울 수 있게 됐어!",
    },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "이 오븐처럼, 돈을 더 버는 데 쓰이는 도구나 재산을 '자본'이라고 해.",
    },
    {
      id: "scene-4",
      speaker: "narrator",
      textKo: "트랙터, 가게, 심지어 저금해둔 돈도 다 자본이 될 수 있어요.",
    },
  ],
  metaphorLineKo: "자본은 나 대신 일을 더 많이 해주는 도구야.",
  realExampleKo: "배달 아저씨의 오토바이, 농부의 트랙터, 우리 마을 은행에 모인 저축도 모두 자본의 예다.",
  bridgeLineKo: "여러 직업의 도구들을 구경하며, 도구가 있고 없고에 따라 무엇이 달라지는지 비교해볼까?",
  recapLineKo: "같은 시간, 같은 사람인데 도구(자본)가 있으니까 결과가 크게 달랐지?",
};
