// money-tree(복리, 개인 마당) 전용 카피. docs/idea.md 6-5, docs/implementation.md 8-3 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const moneyTreeContent = {
  narrationSrc: {
    intro: "/content/audio/money-tree-intro.mp3",
    dailyLimit: "/content/audio/money-tree-daily-limit.mp3",
  },
  introMessageKo:
    "이 나무는 심을수록 이자가 붙어서 점점 커져! 매일 딱 한 번, 열매를 먹을지 다시 심을지 골라보자.",
  harvestButtonKo: "열매 먹기 (코인으로 받기)",
  replantButtonKo: "다시 심기 (나무를 더 키우기)",
  alreadyActedTodayKo: "오늘은 이미 나무를 돌봤어! 내일 다시 와줘.",
  harvestRewardReasonKo: "머니나무 열매 수확",
  stageLabelsKo: ["씨앗", "새싹", "어린 나무", "가지 많은 나무", "열매가 주렁주렁 열린 나무"],
  dailyInterestRate: 0.1,
  startingPrincipal: 20,
  maxStage: 4,
};
