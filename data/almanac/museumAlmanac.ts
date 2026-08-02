import type { BuildingAlmanac } from "./almanacTypes";

export const museumAlmanac: BuildingAlmanac = {
  buildingId: "museum",
  theoryNoteKo:
    "기록에 남은 가장 오래된 동전은 기원전 7세기, 지금의 튀르키예 지역에 있던 리디아 왕국에서 금과 은이 섞인 '일렉트럼'이라는 금속으로 만들었어. 그 뒤 중국 송나라(10~11세기)는 '교자'라는 세계 최초의 지폐를 썼고, 20세기에는 나라들이 화폐 가치를 금에 딱 고정하는 '금본위제'를 오래 유지했어. 1944년 여러 나라 대표들이 미국 브레튼우즈에 모여 달러를 금에 연결하는 약속을 맺었지만, 1971년 닉슨 미국 대통령이 이 약속을 갑자기 멈추면서(닉슨 쇼크) 지금처럼 금과 상관없이 나라가 가치를 보증하는 '명목화폐' 시대가 시작됐어.",
  timeline: [
    {
      year: "기원전 7세기",
      titleKo: "세계 최초의 동전",
      descKo: "지금의 튀르키예 지역, 리디아 왕국 사람들이 금과 은이 자연히 섞인 '일렉트럼'으로 동전을 만들었어.",
      imageKey: "lydian-coin",
    },
    {
      year: "10~11세기",
      titleKo: "세계 최초의 지폐, 교자",
      descKo: "중국 송나라에서 '교자'라는 종이돈을 쓰기 시작했어. 무거운 동전을 들고 다니지 않아도 됐지.",
      imageKey: "jiaozi-banknote",
    },
    {
      year: "1944년",
      titleKo: "브레튼우즈 회의",
      descKo: "2차 세계대전이 끝나갈 무렵, 여러 나라 대표들이 미국 브레튼우즈에 모여 달러를 금에, 다른 나라 돈을 달러에 연결하기로 약속했어.",
      imageKey: "bretton-woods",
    },
    {
      year: "1971년",
      titleKo: "닉슨 쇼크",
      descKo: "미국 닉슨 대통령이 달러를 금으로 바꿔주는 약속을 갑자기 멈췄어. 이때부터 지금처럼 금과 상관없이 나라가 가치를 보증하는 돈을 쓰게 됐어.",
    },
    {
      year: "2008년",
      titleKo: "비트코인 백서 발표",
      descKo: "'사토시 나카모토'라는 이름으로 비트코인이라는 디지털 화폐의 설계도가 처음 발표되며 새로운 돈의 역사가 시작됐어.",
    },
  ],
  credits: [
    {
      imageKey: "lydian-coin",
      titleKo: "리디아의 일렉트럼 동전 (기원전 620~563년경)",
      authorKo: "Classical Numismatic Group(CNG) 촬영, 위키미디어 커먼즈",
      license: "CC-BY-SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrum_trite,_Alyattes,_Lydia,_620-563_BC.jpg",
    },
    {
      imageKey: "jiaozi-banknote",
      titleKo: "송나라 교자(세계 최초의 지폐) 도판",
      authorKo: "작자 미상, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jiao_zi.jpg",
    },
    {
      imageKey: "bretton-woods",
      titleKo: "1944년 브레튼우즈 회의 개회식 사진",
      authorKo: "미국 정부 기록사진, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Morgenthau_Bretton_Woods_opening_1944.jpg",
    },
  ],
};
