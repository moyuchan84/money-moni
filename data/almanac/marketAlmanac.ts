import type { BuildingAlmanac } from "./almanacTypes";

export const marketAlmanac: BuildingAlmanac = {
  buildingId: "market",
  theoryNoteKo:
    "각 나라의 통계청이나 중앙은행은 여러 생활 물건의 가격을 모아 '소비자물가지수(CPI)'라는 숫자로 물가가 얼마나 올랐는지 재. 우리나라 한국은행도 물가가 너무 많이 오르지 않도록 관리하는 목표를 세워두고 있어. 옛날에는 물가가 정말 많이, 아주 많이 오른 나라도 있었대(1920년대 독일 등) — 돈의 가치가 크게 흔들리면 사람들이 아주 힘들어질 수 있다는 걸 보여준 사례야.",
  timeline: [
    {
      year: "오늘날",
      titleKo: "소비자물가지수(CPI)",
      descKo: "각 나라는 여러 물건 가격을 모아 계산한 '소비자물가지수'로 물가가 오르는 정도를 재고 관리해.",
    },
    {
      year: "1920년대",
      titleKo: "물가가 아주 많이 오른 나라도 있었어",
      descKo:
        "옛날 독일에서는 물가가 정말 많이, 아주 많이 올라서 지폐를 수레에 가득 실어야 할 정도였대. 돈의 가치가 너무 흔들리면 안 되는 이유를 보여준 일이야.",
      imageKey: "weimar-banknote",
    },
  ],
  credits: [
    {
      imageKey: "weimar-banknote",
      titleKo: "1923년 독일 초인플레이션 시기의 5천억 마르크 지폐",
      authorKo: "Berlin-George, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:German_Railways_Banknote_500000000000_Mark_1923_Hyperinflation_Notgeld_Stuttgart,_obverse.jpg",
    },
  ],
};
