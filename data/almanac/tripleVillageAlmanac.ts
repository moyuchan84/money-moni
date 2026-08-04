import type { BuildingAlmanac } from "./almanacTypes";

export const tripleVillageAlmanac: BuildingAlmanac = {
  buildingId: "triple-village",
  interactiveWidgetKey: "bread-split",
  theoryNoteKo:
    "1776년, 애덤 스미스라는 학자는 『국부론』이라는 책에서 사람들이 각자 자유롭게 경쟁하는 시장이 마치 '보이지 않는 손'처럼 사회를 이롭게 만든다고 설명했어(자본주의). 반대로 칼 마르크스는 1848년 『공산당 선언』, 1867년 『자본론』에서 다르게 생각했어 — 만든 것을 다 함께 나누는 게 더 낫다고 봤지(공산주의). 20세기에는 미국(자본주의)과 소련(공산주의)이 실제로 서로 다른 체제로 오래 경쟁했고, 오늘날 대부분의 나라는 두 생각을 조금씩 섞은 '혼합경제'를 쓰고 있어. 이건 정답이 정해진 문제가 아니라, 지금도 나라마다 다르게 선택하고 있는 부분이야.",
  timeline: [
    {
      year: "1776년",
      titleKo: "애덤 스미스와 『국부론』",
      descKo: "애덤 스미스는 사람들이 자유롭게 경쟁하는 시장이 사회를 이롭게 만든다는 생각을 책으로 정리했어.",
      imageKey: "adam-smith",
    },
    {
      year: "1848년·1867년",
      titleKo: "칼 마르크스의 생각",
      descKo: "칼 마르크스는 『공산당 선언』과 『자본론』에서, 만든 것을 다 함께 나누는 게 더 낫다는 생각을 제시했어.",
      imageKey: "karl-marx",
    },
    {
      year: "20세기",
      titleKo: "냉전 시기의 체제 경쟁",
      descKo: "미국(자본주의)과 소련(공산주의)이 실제로 서로 다른 체제로 오랫동안 경쟁했어.",
    },
    {
      year: "오늘날",
      titleKo: "혼합경제",
      descKo: "지금 대부분의 나라는 시장경제에 정부의 도움을 일부 더한 '혼합경제' 형태를 쓰고 있어.",
    },
  ],
  credits: [
    {
      imageKey: "adam-smith",
      titleKo: "애덤 스미스 초상화",
      authorKo: "작자 미상(스코틀랜드), 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Adam_Smith,_1723_-_1790._Political_economist_-_Google_Art_Project.jpg",
    },
    {
      imageKey: "karl-marx",
      titleKo: "칼 마르크스 초상 사진",
      authorKo: "John Jabez Edwin Mayall, 위키미디어 커먼즈(퍼블릭 도메인)",
      license: "PD",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Karl_Marx_Portrait.jpg",
    },
  ],
};
