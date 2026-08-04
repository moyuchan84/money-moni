import type { BuildingAlmanac } from "./almanacTypes";

export const moneyTreeAlmanac: BuildingAlmanac = {
  buildingId: "money-tree",
  interactiveWidgetKey: "compound-interest",
  theoryNoteKo:
    "복리를 빠르게 어림하는 실제 계산법이 '72의 법칙'이야 — 72를 연이자율(%)로 나누면 원금이 대략 몇 년 만에 두 배가 되는지 알 수 있어(예: 연 6%면 72÷6=약 12년). '복리는 인류의 8대 불가사의'라는 말이 아인슈타인이 한 것으로 널리 알려져 있지만, 실제로 아인슈타인이 이 말을 했다는 확실한 증거는 없어 — 그만큼 복리의 힘이 놀랍다는 뜻으로 널리 퍼진 말일 뿐이야.",
  timeline: [
    {
      year: "언제나 통하는 계산법",
      titleKo: "72의 법칙",
      descKo: "72를 연이자율로 나누면, 원금이 대략 몇 년 만에 두 배가 되는지 빠르게 어림할 수 있어.",
    },
    {
      year: "출처 불확실",
      titleKo: "\"복리는 8대 불가사의\"?",
      descKo:
        "아인슈타인이 복리를 '인류의 8대 불가사의'라고 말했다는 이야기가 유명하지만, 실제로 아인슈타인이 이 말을 했다는 확실한 근거는 없다고 알려져 있어.",
    },
  ],
  credits: [],
};
