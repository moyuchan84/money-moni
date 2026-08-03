// "쉬운말 방울새" — 어려운 경제 뉴스 문장을 쉬운 말로 바꿔주는 오리지널 캐릭터 코너.
// 실제 뉴스를 인용하지 않고 흔히 나올 법한 일반적인 문장을 새로 지어써서 에버그린으로 재사용한다.
// docs/original-content-expansion.md 4장 참고.

export interface NewsSimplifierEntry {
  id: string;
  hardKo: string;
  easyKo: string;
}

export const newsSimplifier: NewsSimplifierEntry[] = [
  {
    id: "base-rate",
    hardKo: "기준금리가 인상되었습니다.",
    easyKo: "은행에서 돈을 빌리거나 맡길 때 기준이 되는 '이자'가 조금 올랐대! 그럼 저금하면 이자를 더 많이 받을 수도 있어.",
  },
  {
    id: "trade-balance",
    hardKo: "수출이 증가하며 무역수지가 개선됐습니다.",
    easyKo: "우리나라가 다른 나라에 물건을 더 많이 팔았대! 그래서 들어온 돈이 나간 돈보다 많아졌다는 뜻이야.",
  },
  {
    id: "inflation-slowdown",
    hardKo: "물가 상승률이 둔화되었습니다.",
    easyKo: "물건값이 오르는 속도가 조금 느려졌대! 아직 오르고 있긴 하지만, 예전만큼 빠르게는 아니라는 뜻이야.",
  },
  {
    id: "household-debt",
    hardKo: "가계 부채가 늘어나고 있습니다.",
    easyKo: "사람들이 빌린 돈이 점점 많아지고 있대. 빌린 돈은 나중에 이자까지 갚아야 하니까, 너무 많이 빌리면 힘들어질 수 있어.",
  },
  {
    id: "exchange-rate",
    hardKo: "환율이 상승했습니다.",
    easyKo: "다른 나라 돈으로 바꿀 때 우리 돈이 조금 더 많이 필요해졌대. 그럼 외국 물건을 사 올 때 조금 더 비싸질 수 있어.",
  },
  {
    id: "earnings-improvement",
    hardKo: "기업의 실적이 개선됐습니다.",
    easyKo: "회사가 예전보다 돈을 더 잘 벌었대! 그 회사의 주식(조각)을 가진 사람들도 좋은 소식을 듣게 되는 거야.",
  },
];

// 스토어에 새 필드를 추가하지 않고, 날짜 기반으로 결정론적 인덱스를 고른다(SSR/CSR 불일치 방지).
export function getTodayNewsSimplifierEntry(now: Date = new Date()): NewsSimplifierEntry {
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return newsSimplifier[dayOfYear % newsSimplifier.length];
}
