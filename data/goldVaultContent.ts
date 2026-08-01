// 금고(금) 건물 전용 카피. docs/idea.md 6-12, docs/implementation.md 8-4 참고.
// docs/concept-story.md 7-12 참고.
// 컴포넌트에 한글 문자열을 직접 하드코딩하지 않기 위해 이 파일을 통해서만 참조한다.

export interface GoldVaultEra {
  id: string;
  eraLabelKo: string;
  lineKo: string;
  backgroundEmoji: string;
}

export const goldVaultContent = {
  narrationSrc: {
    intro: "/content/audio/gold-vault-intro.mp3",
  },
  introMessageKo:
    "아주 먼 옛날 왕도, 오래전 상인도, 지금의 어른들도 반짝이는 금을 소중히 여겼어. 여러 시대를 지나며 금을 만나보자.",
  storyScenes: [
    {
      id: "scene-1",
      speaker: "narrator",
      textKo: "아주 먼 옛날 왕도, 오래전 상인도, 지금의 어른들도 이 반짝이는 금을 소중히 여겼어요.",
    },
    { id: "scene-2", speaker: "npc", textKo: "다른 돈의 가치가 흔들릴 때도, 나는 오랫동안 사람들의 믿음을 지켜왔지." },
    { id: "scene-3", speaker: "npc", textKo: "그래서 사람들은 걱정될 때 나를 찾아와." },
  ],
  metaphorLineKo: "금은 아주 오래전부터 지금까지 사람들이 계속 믿어온 반짝이는 약속이야.",
  realExampleKo:
    "결혼반지나 돌 반지처럼, 금은 오래 두어도 가치가 잘 사라지지 않는다고 여겨져 특별한 날 선물로도 많이 쓰인다.",
  bridgeLineKo: "여러 시대를 지나오는 동안 금이 어떻게 반짝임을 지켜왔는지 함께 볼까?",
  recapLineKo: "다른 것들은 변해도 금은 오래오래 믿음을 지켰지?",
  instructionsKo: "\"다음\" 버튼을 눌러서 여러 시대를 지나며 금이 어떻게 반짝임을 지켜왔는지 살펴보자.",
  eras: [
    {
      id: "era-ancient-king",
      eraLabelKo: "아주 먼 옛날, 왕의 시대",
      lineKo: "왕도 금을 아주 소중히 여겼어요.",
      backgroundEmoji: "👑",
    },
    {
      id: "era-merchant",
      eraLabelKo: "오래전, 상인의 시대",
      lineKo: "상인들도 금으로 값진 물건을 주고받았어요.",
      backgroundEmoji: "🏺",
    },
    {
      id: "era-turmoil",
      eraLabelKo: "돈의 가치가 흔들렸던 시대",
      lineKo: "다른 돈의 가치가 흔들렸지만, 금은 여전히 반짝였어요.",
      backgroundEmoji: "⚔️",
    },
    {
      id: "era-modern",
      eraLabelKo: "지금, 어른들의 시대",
      lineKo: "지금 어른들도 걱정될 때 금을 찾아요.",
      backgroundEmoji: "🏙️",
    },
  ] as GoldVaultEra[],
  reflection: {
    questionKo: "여러 시대를 지나오는 동안 금이 계속 반짝인 걸 보니 어떤 생각이 들었어?",
    options: [
      { id: "reflect-reliable", label: "믿음직스러워 보였어요" },
      { id: "reflect-curious", label: "왜 그런지 더 궁금해졌어요" },
      { id: "reflect-neutral", label: "그냥 그랬어요" },
    ],
  },
};
