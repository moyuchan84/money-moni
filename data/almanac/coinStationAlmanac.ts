import type { BuildingAlmanac } from "./almanacTypes";

export const coinStationAlmanac: BuildingAlmanac = {
  buildingId: "coin-station",
  theoryNoteKo:
    "2008년, '사토시 나카모토'라는 이름으로 비트코인이라는 디지털 화폐의 설계도(백서)가 처음 발표됐고, 2009년에 첫 비트코인 블록이 만들어졌어. 스테이블코인은 이보다 조금 뒤인 2014년쯤부터 테더(USDT) 같은 종류가 나오면서 본격적으로 쓰이기 시작했어.",
  timeline: [
    {
      year: "2008년",
      titleKo: "비트코인 백서 발표",
      descKo: "'사토시 나카모토'라는 이름으로 비트코인이라는 디지털 화폐의 설계도가 처음 발표됐어.",
    },
    {
      year: "2009년",
      titleKo: "첫 비트코인 채굴",
      descKo: "비트코인의 첫 번째 블록이 만들어지며 실제로 비트코인이 세상에 등장했어.",
      imageKey: "bitcoin-logo",
    },
    {
      year: "2014년경",
      titleKo: "스테이블코인의 등장",
      descKo: "테더(USDT) 같은 스테이블코인이 나오면서, 가격이 실제 돈에 묶인 코인을 쓰는 사람들이 늘어났어.",
    },
  ],
  credits: [
    {
      imageKey: "bitcoin-logo",
      titleKo: "비트코인(BTC) 상징이 새겨진 기념 코인",
      authorKo: "Satheesh Sankaran, 위키미디어 커먼즈",
      license: "CC-BY-SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bitcoin_BTC_golden_coin_with_the_symbol.jpg",
    },
  ],
};
