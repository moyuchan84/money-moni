// allowance-square(용돈 배분 광장) 건물 전용 카피. docs/idea.md 6-3, docs/implementation.md 8-2 참고.
// KB 자료 기준 소비30 / 위시리스트30 / 저축30 / 기부10 공식을 그대로 반영한다.
// docs/concept-story.md 7-3 참고.

export type AllowanceJarId = "spending" | "wishlist" | "saving" | "donation";

export interface AllowanceJar {
  id: AllowanceJarId;
  labelKo: string;
  emoji: string;
  colorHex: string;
}

export const allowanceSquareContent = {
  narrationSrc: {
    intro: "/content/audio/allowance-square-intro.mp3",
  },
  introMessageKo:
    "매주 들어오는 용돈을 소비, 위시리스트, 저축, 기부 항아리에 나눠 담아보자. 한 곳에만 몰아 담으면 다음 주에 곤란해질 수도 있어!",
  instructionsKo: "동전을 드래그해서 4개 항아리에 나눠 담아보자!",
  storyScenes: [
    { id: "scene-1", speaker: "child", textKo: "어제 다 써버려서 민지 생일선물을 못 사겠어…" },
    {
      id: "scene-2",
      speaker: "npc",
      textKo: "그래서 마을 사람들은 돈이 생기면 네 개의 항아리에 나눠 담아. 쓸 돈, 갖고 싶은 것, 저금, 그리고 나눔.",
    },
    { id: "scene-3", speaker: "npc", textKo: "한 항아리에만 몰빵하면 꼭 이런 일이 생기더라고." },
    { id: "scene-4", speaker: "child", textKo: "그럼 이번엔 나눠서 담아볼래!" },
  ],
  metaphorLineKo:
    "용돈은 한 바구니가 아니라 네 개의 작은 항아리에 나눠 담는 거야 — 오늘 쓸 돈, 나중에 살 것, 모아둘 돈, 나눠줄 돈.",
  realExampleKo: "세뱃돈을 받으면 다 쓰지 않고 일부는 저금하고 일부는 부모님과 함께 기부하는 것도 같은 원리다.",
  bridgeLineKo: "이번 주 용돈이 들어왔어! 네 항아리에 어떻게 나눠 담을지 직접 해보자.",
  recapLineKo: "한 곳에만 담지 않고 나누니까, 이번엔 민지 선물도 살 수 있었지?",
  totalCoins: 10,
  jars: [
    { id: "spending", labelKo: "소비", emoji: "🍭", colorHex: "#f97316" },
    { id: "wishlist", labelKo: "위시리스트", emoji: "🎁", colorHex: "#3b82f6" },
    { id: "saving", labelKo: "저축", emoji: "🐷", colorHex: "#22c55e" },
    { id: "donation", labelKo: "기부", emoji: "❤️", colorHex: "#8b5cf6" },
  ] satisfies AllowanceJar[],
  emptyJarEventKo: {
    spending: "소비 항아리가 비어서, 친구 생일 선물을 못 샀어요.",
    wishlist: "위시리스트 항아리가 비어서, 갖고 싶던 장난감을 못 샀어요.",
    saving: "저금통이 텅 비어서, 급하게 돈이 필요할 때 곤란했어요.",
    donation: "기부 항아리가 비어서, 이웃 돕기 성금을 내지 못해 아쉬웠어요.",
  } satisfies Record<AllowanceJarId, string>,
  balancedEventKo: "네 항아리에 골고루 담아서 이번 주도 문제없이 지나갔어요!",
  reflection: {
    questionKo: "항아리 4개 중에 어디에 가장 많이 담고 싶었어?",
    options: [
      { id: "reflect-spending", label: "소비 항아리" },
      { id: "reflect-wishlist", label: "위시리스트 항아리" },
      { id: "reflect-saving", label: "저축 항아리" },
      { id: "reflect-donation", label: "기부 항아리" },
    ],
  },
};
