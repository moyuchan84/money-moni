// job-center(직업소개소 · 소득의 종류) 건물 전용 카피. docs/idea.md 6-6, docs/implementation.md 8-3 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export type JobCenterCharacterId = "worker" | "business" | "farmer";

export interface JobCenterCharacter {
  id: JobCenterCharacterId;
  nameKo: string;
  emoji: string;
  incomeTypeLabelKo: string;
  scenesKo: string[];
  eveningEarningsCoins: number;
  eveningLineKo: string;
}

export const jobCenterContent = {
  narrationSrc: {
    intro: "/content/audio/job-center-intro.mp3",
  },
  introMessageKo:
    "일꾼, 사장님, 농장주 중 한 명을 골라서 하루를 살아보자. 저녁이 되면 세 사람이 얼마나 벌었는지 함께 비교해볼 거야!",
  instructionsKo: "캐릭터를 골라 하루 장면을 넘겨보고, 저녁에 번 돈을 비교해보자.",
  characters: [
    {
      id: "worker",
      nameKo: "일꾼",
      emoji: "🧹",
      incomeTypeLabelKo: "근로소득",
      scenesKo: [
        "아침 일찍 일어나서 마을 청소를 시작해요.",
        "땀을 뻘뻘 흘리며 골목골목을 쓸고 닦아요.",
        "저녁이 되어 오늘 일한 만큼 급여를 받았어요.",
      ],
      eveningEarningsCoins: 10,
      eveningLineKo: "몸을 움직여 일한 만큼 딱 그만큼 벌었어요.",
    },
    {
      id: "business",
      nameKo: "사장님",
      emoji: "🍋",
      incomeTypeLabelKo: "사업소득",
      scenesKo: [
        "레모네이드 가판대를 열 준비를 해요.",
        "손님들에게 레모네이드를 팔아요. 잘 팔리는 날도, 안 팔리는 날도 있어요.",
        "저녁에 오늘 판 만큼 이익을 계산해봐요.",
      ],
      eveningEarningsCoins: 14,
      eveningLineKo: "장사가 잘된 날이라 일꾼보다 조금 더 벌었어요.",
    },
    {
      id: "farmer",
      nameKo: "농장주",
      emoji: "🌱",
      incomeTypeLabelKo: "자본소득",
      scenesKo: [
        "아침에 씨앗을 심어두어요.",
        "낮 동안 그늘에서 낮잠을 자요. 나무는 알아서 자라고 있어요.",
        "저녁이 되니 나무에서 열매가 열려 돈이 되었어요.",
      ],
      eveningEarningsCoins: 12,
      eveningLineKo: "낮잠을 잤는데도 심어둔 나무가 스스로 돈을 벌어다 줬어요!",
    },
  ] satisfies JobCenterCharacter[],
  comparisonTitleKo: "오늘 저녁, 세 사람이 번 돈을 비교해볼까?",
  comparisonNoteKo: "농장주는 일하지 않은 시간에도 돈을 벌었어요. 이런 걸 자본소득이라고 해요.",
  reflection: {
    questionKo: "세 캐릭터 중 어떤 방식으로 돈을 벌어보고 싶어?",
    options: [
      { id: "reflect-worker", label: "일꾼처럼 몸을 움직여서" },
      { id: "reflect-business", label: "사장님처럼 내 가게를 운영해서" },
      { id: "reflect-farmer", label: "농장주처럼 자산이 대신 벌어주게" },
    ],
  },
};
