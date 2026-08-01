// 투자 씨앗밭(투자란 무엇인가) 건물 전용 카피. docs/idea.md 6-9, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-9 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export type SeedFieldOutcome = "poor" | "average" | "abundant";

export interface SeedFieldSegment {
  outcome: SeedFieldOutcome;
  weight: number;
  labelKo: string;
  emoji: string;
  colorHex: number;
}

export const seedFieldContent = {
  narrationSrc: {
    intro: "/content/audio/seed-field-intro.mp3",
  },
  introMessageKo:
    "저축은 안전한 항아리, 투자는 씨앗을 심는 것과 같아! 씨앗을 심어서 풍년일지 흉년일지 직접 확인해보자.",
  storyScenes: [
    { id: "scene-1", speaker: "npc", textKo: "이 씨앗, 안전한 항아리에 넣어둘 수도 있고, 밭에 심을 수도 있어." },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "항아리에 두면 그대로지만 안전해. 밭에 심으면 크게 자랄 수도 있지만, 날씨가 나쁘면 시들 수도 있어.",
    },
    { id: "scene-3", speaker: "child", textKo: "그럼 다 심는 것도, 다 항아리에 두는 것도 아니고… 나눠서 해볼래!" },
  ],
  metaphorLineKo: "저축은 안전한 항아리, 투자는 결과를 알 수 없는 씨앗을 심는 것과 같아.",
  realExampleKo:
    "세뱃돈을 그대로 저금하면 안전하게 그대로 남지만, 어른들이 그 돈의 일부를 투자하면 더 크게 불어날 수도, 줄어들 수도 있다.",
  bridgeLineKo: "씨앗을 심어볼까? 풍년일지 흉년일지는 심어봐야 알아.",
  recapLineKo: "심을 때마다 결과가 달랐지? 그래서 투자는 씨앗 하나에 다 걸지 않는 게 중요해.",
  instructionsKo: "\"씨앗 심기\" 버튼을 눌러 룰렛을 돌려봐. 풍년, 평년, 흉년 중 무엇이 나올지는 심어봐야 알아!",
  spinCount: 3,
  segments: [
    { outcome: "poor", weight: 0.2, labelKo: "흉년", emoji: "🥀", colorHex: 0xfca5a5 },
    { outcome: "average", weight: 0.5, labelKo: "평년", emoji: "🌱", colorHex: 0xfde68a },
    { outcome: "abundant", weight: 0.3, labelKo: "풍년", emoji: "🌾", colorHex: 0x86efac },
  ] as SeedFieldSegment[],
  outcomeMessagesKo: {
    poor: "흉년이에요… 씨앗이 별로 자라지 못했어요.",
    average: "평년이에요! 씨앗이 무난하게 자랐어요.",
    abundant: "풍년이에요! 씨앗이 크게 자랐어요.",
  } as Record<SeedFieldOutcome, string>,
  reflection: {
    questionKo: "세 번 심어보니 매번 같은 결과였어, 달랐어?",
    options: [
      { id: "reflect-different", label: "매번 결과가 달랐어요" },
      { id: "reflect-same", label: "비슷한 결과가 많았어요" },
      { id: "reflect-unsure", label: "잘 모르겠어요" },
    ],
  },
};
