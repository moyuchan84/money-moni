import type { BuildingAlmanac } from "./almanacTypes";

export const allowanceSquareAlmanac: BuildingAlmanac = {
  buildingId: "allowance-square",
  interactiveWidgetKey: "jar-ratio",
  theoryNoteKo:
    "행동경제학자 리처드 세일러는 사람들이 같은 돈이라도 어느 '마음속 계좌'에 넣었는지에 따라 다르게 쓴다는 '심리적 회계' 이론을 제시했어. 용돈을 항아리별로 나누는 것 자체가 이 이론을 실생활에 적용한 예야. 리처드 세일러는 2017년에 이 연구로 노벨 경제학상을 받았어.",
  timeline: [
    {
      year: "제시된 이론",
      titleKo: "심리적 회계(mental accounting)",
      descKo: "같은 돈이라도 어느 '마음속 계좌'에 넣었는지에 따라 사람들이 다르게 쓴다는 이론이야.",
      imageKey: "richard-thaler",
    },
    {
      year: "2017년",
      titleKo: "노벨 경제학상",
      descKo: "리처드 세일러는 이 심리적 회계 연구를 포함한 행동경제학 업적으로 노벨 경제학상을 받았어.",
    },
  ],
  credits: [
    {
      imageKey: "richard-thaler",
      titleKo: "리처드 세일러(행동경제학자, 2017년 노벨 경제학상 수상)",
      authorKo: "Chatham House, 위키미디어 커먼즈",
      license: "CC-BY",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Richard_Thaler_Chatham.jpg",
    },
  ],
};
