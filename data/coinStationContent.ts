// 코인 정거장(코인/스테이블코인) 건물 전용 카피. docs/idea.md 6-13, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-13 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const coinStationContent = {
  narrationSrc: {
    intro: "/content/audio/coin-station-intro.mp3",
  },
  introMessageKo:
    "일반 코인은 롤러코스터처럼 출렁이고, 스테이블코인은 잔잔한 튜브 트랙 같아! 둘 다 타보고 소지금이 어떻게 다른지 비교해보자.",
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "나는 종이도 금속도 아니야. 인터넷 속 컴퓨터에 기록된 동전이지." },
    { id: "scene-2", speaker: "npc", textKo: "근데 나는 롤러코스터처럼 가격이 확 올랐다가 확 내려가기도 해!" },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "나는 조금 달라. 내 가격은 진짜 돈(달러)에 꽉 묶여 있어서 출렁임이 훨씬 적어.",
    },
    { id: "scene-4", speaker: "narrator", textKo: "나 같은 걸 '스테이블코인'이라고 불러요." },
  ],
  metaphorLineKo: "일반 코인은 롤러코스터, 스테이블코인은 잔잔한 튜브 물놀이 트랙과 같아.",
  realExampleKo:
    "롤러코스터를 타면 스릴 있지만 무섭기도 한 것처럼, 코인 가격도 크게 흔들려서 어른들도 신중하게 다룬다.",
  bridgeLineKo: "롤러코스터 코인과 튜브 트랙 스테이블코인, 둘 다 타보고 도착했을 때 소지금이 어떻게 다른지 비교해보자.",
  recapLineKo: "출렁임이 컸던 쪽과 잔잔했던 쪽, 뭐가 다르게 느껴졌어?",
  instructionsKo: "\"출발!\" 버튼을 눌러서 코인과 스테이블코인이 같은 시간 동안 얼마나 출렁이는지 비교해보자.",
  raceDurationMs: 6000,
  baseAmount: 1000,
  coinAmplitudePx: 60,
  stableAmplitudePx: 8,
  valuePerPixel: 5,
  resultMessageKo: "코인은 많이 출렁였지만, 스테이블코인은 거의 그대로였어요.",
  reflection: {
    questionKo: "출렁임이 컸던 코인과 잔잔했던 스테이블코인, 어느 쪽이 더 재밌게 느껴졌어?",
    options: [
      { id: "reflect-coin", label: "출렁이는 코인이요" },
      { id: "reflect-stable", label: "잔잔한 스테이블코인이요" },
      { id: "reflect-both", label: "둘 다 신기했어요" },
    ],
  },
};
