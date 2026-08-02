import type { BuildingAlmanac } from "./almanacTypes";

export const bankAlmanac: BuildingAlmanac = {
  buildingId: "bank",
  theoryNoteKo:
    "지금까지 남아 문을 열고 있는 은행 중 가장 오래된 곳은 1472년 이탈리아에서 세워진 '몬테 데이 파스키 디 시에나'야. 550년도 더 된 은행이 지금도 있다는 게 신기하지? 오늘날에는 나라마다 '중앙은행'(우리나라는 한국은행)이 있어서, 다른 은행들이 이자를 얼마로 정할지에 영향을 주는 '기준금리'라는 걸 정해.",
  timeline: [
    {
      year: "1472년",
      titleKo: "세계에서 가장 오래된 은행",
      descKo: "이탈리아 시에나에서 '몬테 데이 파스키 디 시에나' 은행이 세워졌어. 지금도 문을 열고 있는, 세계에서 가장 오래된 은행이야.",
      imageKey: "monte-dei-paschi",
    },
    {
      year: "오늘날",
      titleKo: "중앙은행과 기준금리",
      descKo: "한국은행 같은 중앙은행이 '기준금리'를 정하면, 여러 은행이 그걸 참고해 저축 이자와 대출 이자를 정해.",
    },
  ],
  credits: [
    {
      imageKey: "monte-dei-paschi",
      titleKo: "몬테 데이 파스키 디 시에나 은행 본점(팔라초 살림베니)",
      authorKo: ". Ray in Manila, 위키미디어 커먼즈",
      license: "CC-BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Palazzo_Salimbeni,_Siena,_Headquarters_of_Monte_dei_Paschi_di_Siena,_the_worlds_oldest_surviving_bank.jpg",
    },
  ],
};
