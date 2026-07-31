// money-tree(복리, 개인 마당) 전용 카피. docs/idea.md 6-5, docs/implementation.md 8-3 참고.
// docs/concept-story.md 7-5 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const moneyTreeContent = {
  narrationSrc: {
    intro: "/content/audio/money-tree-intro.mp3",
    dailyLimit: "/content/audio/money-tree-daily-limit.mp3",
  },
  introMessageKo:
    "이 나무는 심을수록 이자가 붙어서 점점 커져! 매일 딱 한 번, 열매를 먹을지 다시 심을지 골라보자.",
  storyScenes: [
    {
      id: "scene-1",
      speaker: "child",
      textKo: "처음엔 이렇게 작았는데… 어? 구를수록 왜 이렇게 빨리 커지지?",
    },
    { id: "scene-2", speaker: "npc", textKo: "눈이 눈을 더 붙게 만들거든. 커질수록, 더 빨리 커져!" },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "돈도 똑같아. 이자로 받은 돈을 다시 저금하면, 그 이자가 또 이자를 만들어.",
    },
    {
      id: "scene-4",
      speaker: "npc",
      textKo: "그래서 우리 마당의 이 나무도, 열매를 다시 심을 때마다 가지가 훨씬 빨리 갈라지는 거야.",
    },
  ],
  metaphorLineKo: "복리는 언덕에서 구르는 눈덩이야 — 커질수록 더 빨리 커져.",
  realExampleKo:
    "세뱃돈을 안 쓰고 계속 저금만 해도 늘지만, 이자까지 계속 다시 저금하면 몇 년 뒤엔 훨씬 큰 차이가 난다.",
  bridgeLineKo: "우리 마당의 머니나무도 한번 키워볼까? 열매를 먹을지, 다시 심을지는 네가 골라봐.",
  recapLineKo: "다시 심을 때마다 나무가 더 빨리 자랐지? 그게 눈덩이처럼 커지는 복리야.",
  harvestButtonKo: "열매 먹기 (코인으로 받기)",
  replantButtonKo: "다시 심기 (나무를 더 키우기)",
  alreadyActedTodayKo: "오늘은 이미 나무를 돌봤어! 내일 다시 와줘.",
  harvestRewardReasonKo: "머니나무 열매 수확",
  stageLabelsKo: ["씨앗", "새싹", "어린 나무", "가지 많은 나무", "열매가 주렁주렁 열린 나무"],
  dailyInterestRate: 0.1,
  startingPrincipal: 20,
  maxStage: 4,
};
