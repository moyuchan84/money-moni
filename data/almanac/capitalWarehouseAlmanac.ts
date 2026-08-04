import type { BuildingAlmanac } from "./almanacTypes";

export const capitalWarehouseAlmanac: BuildingAlmanac = {
  buildingId: "capital-warehouse",
  interactiveWidgetKey: "tool-compare",
  theoryNoteKo:
    "18세기 후반, 유럽에서 '산업혁명'이 일어나면서 기계(자본)가 사람의 노동을 얼마나 크게 늘려줄 수 있는지 실제로 보여줬어. 하루 종일 손으로 만들던 물건을 기계로는 훨씬 많이, 훨씬 빨리 만들 수 있게 됐지. 애덤 스미스는 1776년 『국부론』에서, 한 사람이 여러 일을 조금씩 하는 것보다 일을 나눠서(분업) 각자 잘하는 것에 집중하면 훨씬 더 많이 만들 수 있다는 것도 설명했어.",
  timeline: [
    {
      year: "18세기 후반",
      titleKo: "산업혁명",
      descKo: "기계(자본)가 만들어지면서 사람이 하루에 만들 수 있는 물건의 양이 크게 늘어났어.",
    },
    {
      year: "1776년",
      titleKo: "애덤 스미스의 『국부론』",
      descKo: "애덤 스미스는 일을 나눠서(분업) 각자 잘하는 것에 집중하면 훨씬 더 많이 만들 수 있다고 설명했어.",
      imageKey: "adam-smith",
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
  ],
};
