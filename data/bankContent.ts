// bank(은행 · 저축·이자) 건물 전용 카피. docs/idea.md 6-4, docs/implementation.md 8-3, docs/phases.md Phase 4 참고.
// docs/concept-story.md 7-4 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export const bankContent = {
  narrationSrc: {
    intro: "/content/audio/bank-intro.mp3",
  },
  introMessageKo:
    "저금통에 동전을 넣으면 은행이 매달 이자를 조금씩 더 얹어줘! 이자율 다이얼을 돌려서 저금통이 얼마나 빨리 차오르는지 확인해보자.",
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "어제 지우개 빌려줘서 고마워! 이거 새 지우개 하나 더 줄게." },
    { id: "scene-2", speaker: "child", textKo: "어? 빌려준 것보다 더 받았네?" },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "그게 바로 '이자'야! 은행도 네가 돈을 맡겨두면, 고마워서 조금 더 얹어줘.",
    },
    { id: "scene-4", speaker: "npc", textKo: "맡겨두는 시간이 길수록, 은행이 더 자주 고마움을 표현하지." },
  ],
  metaphorLineKo: "이자는 은행이 '고마워, 잠깐 맡겨줘서'라고 건네는 작은 보너스야.",
  realExampleKo:
    "저금통에 돈을 넣어두기만 해도, 은행 계좌에 넣어두면 시간이 지나 조금씩 늘어나 있는 걸 볼 수 있다.",
  bridgeLineKo: "그럼 우리도 저금통에 얼마나 맡겨야 얼마나 고마움을 받을 수 있는지 볼까?",
  recapLineKo: "맡겨두기만 했는데 조금 늘어 있었지? 그게 이자야!",
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
