// Phase 1 임시 범용 미니게임("탭해서 완료") 카피.
// 실제 건물별 미니게임이 만들어지기 전까지 아무 건물에나 연결해 게임 루프 배선을 검증하는 용도다.
// docs/phases.md Phase 1 참고.

export interface ReflectionOptionCopy {
  id: string;
  label: string;
}

export const genericMinigameCopy = {
  introMessageKo: "오늘은 동전을 모아보자! 미니게임을 시작해볼까?",
  promptKo: "동전을 5번 톡톡 눌러서 모아보자!",
  targetTaps: 5,
  reflectionQuestionKo: "오늘 미니게임에서 어떤 점이 재밌었어?",
  reflectionOptions: [
    { id: "fun-tap", label: "톡톡 누르는 게 재밌었어요" },
    { id: "fun-reward", label: "코인을 받아서 좋았어요" },
    { id: "fun-character", label: "마을 친구를 만나서 좋았어요" },
  ] satisfies ReflectionOptionCopy[],
};
