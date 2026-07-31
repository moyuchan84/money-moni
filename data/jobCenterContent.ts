// job-center(직업소개소 · 소득의 종류) 건물 전용 카피. docs/idea.md 6-6, docs/implementation.md 8-3 참고.
// docs/concept-story.md 7-6 참고.
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
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "나는 오늘도 마을 청소를 해야 돈을 벌어. 안 하면 한 푼도 못 벌지." },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "나는 레모네이드 가판대를 운영해. 잘 팔리면 많이 벌고, 안 팔리면 적게 벌어.",
    },
    {
      id: "scene-3",
      speaker: "npc",
      textKo: "나는… 씨앗을 심어놨더니, 오늘은 낮잠만 자도 나무가 알아서 열매를 만들어줘!",
    },
    {
      id: "scene-4",
      speaker: "narrator",
      textKo:
        "몸을 움직여 버는 돈, 내가 사장이 되어 버는 돈, 내 재산이 스스로 벌어다 주는 돈 — 셋 다 다른 종류의 소득이에요.",
    },
  ],
  metaphorLineKo: "일꾼은 몸으로, 사장님은 아이디어로, 농장주는 심어둔 나무로 돈을 벌어.",
  realExampleKo:
    "부모님이 회사에 다니며 월급을 받는 것(근로소득), 작은 가게를 운영하는 것(사업소득), 은행에 맡긴 돈이 이자를 버는 것(자본소득)이 모두 이 세 가지 예다.",
  bridgeLineKo: "오늘 하루, 셋 중 한 명이 되어서 직접 살아볼까?",
  recapLineKo: "똑같이 하루를 보냈는데 버는 방법이 다 달랐지? 나중엔 이 세 가지를 다 가질 수도 있어.",
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
