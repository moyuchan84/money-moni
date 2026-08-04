import type { BuildingAlmanac } from "./almanacTypes";

export const stockStreetAlmanac: BuildingAlmanac = {
  buildingId: "stock-street",
  interactiveWidgetKey: "stock-price",
  theoryNoteKo:
    "세계 최초로 '주식'을 사고팔 수 있었던 곳은 1602년 네덜란드야. 아주 큰 무역회사였던 '동인도회사(VOC)'가 회사를 작은 조각으로 나눠 누구나 조금씩 살 수 있게 했고, 이걸 사고파는 '암스테르담 증권거래소'도 함께 생겼어. 오늘날 우리나라의 코스피(KOSPI), 미국의 다우존스·나스닥도 모두 이런 증권거래소야.",
  timeline: [
    {
      year: "1602년",
      titleKo: "세계 최초의 주식회사, 동인도회사",
      descKo:
        "네덜란드 사람들은 '동인도회사'라는 아주 큰 회사를 여러 사람이 조금씩 나눠 갖도록 만들었어. 이게 세계 최초의 '주식회사'야!",
      imageKey: "voc-share",
    },
    {
      year: "1602년",
      titleKo: "세계 최초의 증권거래소",
      descKo: "같은 해, 암스테르담에 주식을 사고파는 세계 최초의 증권거래소가 문을 열었어.",
      imageKey: "amsterdam-exchange",
    },
  ],
  credits: [
    {
      imageKey: "voc-share",
      titleKo: "동인도회사(VOC) 주식 증서(1606년)",
      authorKo: "네덜란드 동인도회사(VOC), 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VOC_aandeel_9_september_1606.jpg",
    },
    {
      imageKey: "amsterdam-exchange",
      titleKo: "암스테르담 증권거래소(1612년 조감도)",
      authorKo: "Claes Jansz. Visscher, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bird's-eye_view_of_the_Beurs_van_Hendrick_de_Keyser_by_Claes_Jansz._Visscher_(II)_1612_Stadsarchief_Amsterdam_010001000620.jpg",
    },
  ],
};
