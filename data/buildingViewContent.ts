// /building/[id](진입 화면)와 /building/[id]/result(결과 화면)가 건물과 무관하게 공통으로 쓰는 카피.
// 건물별 대사는 data/{building}Content.ts에 따로 있다.

export const buildingViewContent = {
  alreadyCompletedIntroKo: "벌써 완료한 곳이네! 다시 놀러 와도 좋아.",
  startMinigameKo: "미니게임 시작하기",
  resultHeadingKo: "수고했어요!",
  coinsLineKo(coins: number) {
    return `지금 가진 코인은 ${coins}개예요!`;
  },
  reflectionJustAnsweredKo: "회고를 남겨줘서 고마워!",
  reflectionAlreadyAnsweredKo: "이미 회고를 남겼어요. 고마워!",
};
