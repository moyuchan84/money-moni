// allowance-square(용돈 배분 광장) 건물 전용 카피. docs/idea.md 6-3, docs/implementation.md 8-2 참고.
// KB 자료 기준 소비30 / 위시리스트30 / 저축30 / 기부10 공식을 그대로 반영한다.

export type AllowanceJarId = "spending" | "wishlist" | "saving" | "donation";

export interface AllowanceJar {
  id: AllowanceJarId;
  labelKo: string;
  emoji: string;
  colorHex: string;
}

export const allowanceSquareContent = {
  narrationSrc: {
    intro: "content/audio/allowance-square-intro.mp3",
  },
  introMessageKo:
    "매주 들어오는 용돈을 소비, 위시리스트, 저축, 기부 항아리에 나눠 담아보자. 한 곳에만 몰아 담으면 다음 주에 곤란해질 수도 있어!",
  instructionsKo: "동전을 드래그해서 4개 항아리에 나눠 담아보자!",
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
