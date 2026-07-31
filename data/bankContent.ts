// bank(은행 · 저축·이자) 건물 전용 카피. docs/idea.md 6-4, docs/implementation.md 8-3, docs/phases.md Phase 4 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const bankContent = {
  narrationSrc: {
    intro: "/content/audio/bank-intro.mp3",
  },
  introMessageKo:
    "저금통에 동전을 넣으면 은행이 매달 이자를 조금씩 더 얹어줘! 이자율 다이얼을 돌려서 저금통이 얼마나 빨리 차오르는지 확인해보자.",
  instructionsKo: "다이얼을 오른쪽으로 돌려서 이자율을 높이면, 저금통이 더 빨리 가득 차!",
  minRate: 0.5,
  maxRate: 3,
  defaultRate: 1,
  targetCoins: 10,
  reflection: {
    questionKo: "이자율을 올렸을 때 저금통은 어떻게 됐어?",
    options: [
      { id: "reflect-faster", label: "동전이 더 빨리 차올랐어요" },
      { id: "reflect-same", label: "속도는 그대로였어요" },
      { id: "reflect-notice", label: "잘 못 느꼈어요" },
    ],
  },
};
