import type { BuildingAlmanac } from "./almanacTypes";

export const goldVaultAlmanac: BuildingAlmanac = {
  buildingId: "gold-vault",
  interactiveWidgetKey: "gold-timeline",
  theoryNoteKo:
    "옛날에는 여러 나라가 자기 나라 돈의 가치를 금에 딱 고정해두는 '금본위제'라는 제도를 썼어(자세한 역사는 박물관 도감 참고). 지금은 돈의 가치가 금에 고정되어 있지 않지만, 오늘날에도 여러 나라 중앙은행은 만약을 대비해 금을 외환보유액의 일부로 계속 갖고 있어.",
  timeline: [
    {
      year: "19~20세기",
      titleKo: "금본위제 시대",
      descKo: "여러 나라가 자기 나라 돈의 가치를 금에 딱 고정해두는 제도를 오래 썼어.",
    },
    {
      year: "오늘날",
      titleKo: "지금도 금을 모아두는 나라들",
      descKo: "여러 나라의 중앙은행은 지금도 금을 안전한 자산으로 여겨 창고에 보관하고 있어.",
      imageKey: "gold-bars",
    },
  ],
  credits: [
    {
      imageKey: "gold-bars",
      titleKo: "쌓여 있는 금괴",
      authorKo: "Stevebidmead, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Gold_bullion_bars.jpg",
    },
  ],
};
