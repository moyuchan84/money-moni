// 보호자용 요약 대시보드(/parent) 전용 카피.

export const parentContent = {
  titleKo: "보호자용 요약",
  summaryLineKo(nickname: string) {
    return `${nickname || "우리 아이"}가 지금까지 모은 코인과 진행 상황이에요.`;
  },
  privacyNoteKo: "이름과 학습 진행도(완료한 건물, 회고 답변) 외의 개인정보는 저장하지 않아요.",
  coinsLabelKo: "모은 코인",
  districtProgressTitleKo: "구역별 진행도",
  districtLabelKo(district: 1 | 2 | 3) {
    return `${district}구역`;
  },
  districtLockedKo: "잠김",
  questProgressTitleKo: "퀘스트 진행",
  dailyQuestLabelKo: "오늘의 퀘스트",
  weeklyQuestLabelKo: "이번 주 퀘스트",
  soundLabelKo: "소리",
  reducedMotionLabelKo: "움직임 줄이기 (미니게임 애니메이션을 줄여요)",
  devToolsTitleKo: "개발자 도구 (배포 빌드에는 보이지 않아요)",
  devUnlockDistrict2Ko: "2구역 즉시 열기",
  devUnlockDistrict3Ko: "3구역 즉시 열기",
  newsSimplifierTitleKo: "오늘의 쉬운말 방울새",
  newsSimplifierHardLabelKo: "어려운 말",
  newsSimplifierEasyLabelKo: "쉬운 말",
};
