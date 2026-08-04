import type { BuildingAlmanac } from "./almanacTypes";

export const etfLabAlmanac: BuildingAlmanac = {
  buildingId: "etf-lab",
  interactiveWidgetKey: ["diversification-basket", "economic-seasons-wheel"],
  theoryNoteKo:
    "'여러 자산에 나눠 담으면 위험을 줄일 수 있다'는 생각을 수학으로 증명한 사람이 해리 마코위츠야. 1952년에 발표한 논문에서 이 이론(현대 포트폴리오 이론)을 정리했고, 1990년에 노벨 경제학상을 받았어. 이 이론 덕분에 여러 회사를 한 바구니에 담는 최초의 ETF(SPDR S&P 500, 줄여서 SPY)가 1993년 미국에서 태어났어.",
  timeline: [
    {
      year: "1952년",
      titleKo: "현대 포트폴리오 이론",
      descKo:
        "해리 마코위츠는 '여러 자산에 나눠 담으면 같은 기대수익에도 위험(변동성)을 줄일 수 있다'는 것을 논문으로 증명했어.",
      imageKey: "harry-markowitz",
    },
    {
      year: "1990년",
      titleKo: "노벨 경제학상",
      descKo: "해리 마코위츠는 이 분산투자 이론으로 노벨 경제학상을 받았어.",
    },
    {
      year: "1993년",
      titleKo: "세계 최초의 ETF",
      descKo: "미국에서 최초의 ETF인 'SPDR S&P 500(SPY)'가 세상에 나왔어.",
    },
  ],
  credits: [
    {
      imageKey: "harry-markowitz",
      titleKo: "마코위츠의 효율적 투자선(위험과 기대수익의 관계) 그래프",
      authorKo: "위키미디어 사용자 G2010a, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Markowitz_frontier.jpg",
    },
  ],
};
