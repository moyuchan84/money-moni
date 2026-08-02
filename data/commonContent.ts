// 여러 화면에서 반복되는 공통 UI 카피. 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해
// 이 파일을 통해서만 참조한다(CLAUDE.md `data/` 규칙).

export const commonContent = {
  villageChiefSpeakerKo: "촌장님",
  backToTownKo: "마을로 돌아가기",
  replayStoryKo: "이야기 다시보기",
  // 마을 지도(town) 상단 내비게이션 라벨. 각 대상 페이지의 h1과는 별도로 짧게 유지한다.
  townNav: {
    questLog: "퀘스트 로그",
    shop: "상점",
    glossary: "용어 사전",
    parent: "보호자용",
  },
  pageTitles: {
    questLog: "퀘스트 로그",
    shop: "상점",
    glossary: "용어 사전",
    moneyTree: "머니나무 마당",
  },
  // components/dialogue/StorySceneViewer.tsx가 모든 건물의 개념 스토리 씬에서 공통으로 쓰는 카피.
  storyViewer: {
    speakerLabel: {
      narrator: "이야기꾼",
      npc: "촌장님",
      child: "나",
    },
    skipKo: "건너뛰기",
    skipConfirmTitleKo: "정말 건너뛸까요? 이야기를 보면 게임이 더 쉬워져요!",
    skipConfirmCancelKo: "아니요, 계속 볼래요",
    skipConfirmOkKo: "네, 건너뛸게요",
    metaphorHeadingKo: "오늘의 한 마디",
    realExampleHeadingKo: "우리 주변에서는",
    prevKo: "이전",
    nextKo: "다음",
    startKo: "시작하기",
  },
  // app/glossary/page.tsx가 쓰는 카테고리 섹션 라벨/아이콘과 아코디언 카드 안 소제목.
  glossary: {
    categoryLabelKo: {
      "money-basics": "돈의 기초",
      "income-spending": "소득과 소비",
      "saving-growth": "저축과 성장",
      "capital-investment": "자본과 투자",
      debt: "빚",
      "big-picture": "큰 그림",
    },
    categoryIcon: {
      "money-basics": "💰",
      "income-spending": "💸",
      "saving-growth": "🌱",
      "capital-investment": "📈",
      debt: "🤝",
      "big-picture": "🌍",
    },
    metaphorHeadingKo: "오늘의 한 마디",
    exampleHeadingKo: "우리 주변에서는",
    relatedTermsHeadingKo: "관련 용어",
    visitBuildingKo: "게임에서 만나보기",
  },
};
