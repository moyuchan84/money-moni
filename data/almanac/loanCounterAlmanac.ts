import type { BuildingAlmanac } from "./almanacTypes";

export const loanCounterAlmanac: BuildingAlmanac = {
  buildingId: "loan-counter",
  interactiveWidgetKey: "leverage-seesaw",
  theoryNoteKo:
    "2008년, 전 세계적으로 빚(레버리지)이 너무 많이 쌓였을 때 어떤 일이 생길 수 있는지 보여준 실제 사건이 있었어. 미국의 큰 금융회사였던 리먼 브라더스가 이 시기에 무너졌고, 이 일을 계기로 온 세상 사람들이 한동안 아주 곤란해질 수도 있다는 걸 알게 됐어. 그만큼 빚은 잘 쓰면 도움이 되지만, 너무 많이 지면 위험할 수도 있다는 교훈을 남긴 사건이야.",
  timeline: [
    {
      year: "2008년",
      titleKo: "세계 금융위기",
      descKo: "빚(레버리지)이 너무 많이 쌓였을 때 온 세상 사람들이 한동안 곤란해질 수도 있다는 걸 보여준 사건이야.",
      imageKey: "financial-crisis-2008",
    },
  ],
  credits: [
    {
      imageKey: "financial-crisis-2008",
      titleKo: "뉴욕 타임스스퀘어의 리먼 브라더스 사옥 간판",
      authorKo: "David Shankbone, 위키미디어 커먼즈",
      license: "CC-BY-SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lehman_Brothers_Times_Square_by_David_Shankbone.jpg",
    },
  ],
};
