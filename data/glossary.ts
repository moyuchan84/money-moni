// 용어 미니사전. 정의 카피는 docs/idea.md 9장(아이 눈높이 정의 초안)을 그대로 옮긴 것이다.

export type GlossaryId =
  | "money"
  | "income"
  | "spending"
  | "saving"
  | "interest"
  | "compound-interest"
  | "capital"
  | "investment"
  | "stock"
  | "etf-etn"
  | "gold"
  | "loan"
  | "leverage"
  | "inflation"
  | "capitalism"
  | "socialism-communism"
  | "digital-currency"
  | "stablecoin";

export interface GlossaryEntry {
  id: GlossaryId;
  term: string;
  definitionKo: string;
}

export const glossary: GlossaryEntry[] = [
  {
    id: "money",
    term: "돈",
    definitionKo: "내가 가진 것과 남이 가진 것을 편하게 바꿀 수 있게 도와주는 약속의 도구",
  },
  {
    id: "income",
    term: "소득",
    definitionKo:
      "내가 벌어들이는 돈. 몸을 움직여 버는 근로소득, 내가 사장이 되어 버는 사업소득, 내 돈이나 물건이 스스로 벌어다 주는 자본소득으로 나뉨",
  },
  {
    id: "spending",
    term: "소비/지출",
    definitionKo: "원하는 것을 얻기 위해 돈을 내보내는 것",
  },
  {
    id: "saving",
    term: "저축",
    definitionKo: "나중을 위해 돈을 안전하게 모아두는 것",
  },
  {
    id: "interest",
    term: "이자",
    definitionKo: "내 돈을 잠깐 빌려준 대가로 더 받는 작은 보너스",
  },
  {
    id: "compound-interest",
    term: "복리",
    definitionKo: "받은 이자를 다시 저금해서, 이자가 이자를 낳게 만드는 마법",
  },
  {
    id: "capital",
    term: "자본",
    definitionKo: "돈을 더 버는 데 쓰이는 도구나 재산 (기계, 가게, 투자한 돈 등)",
  },
  {
    id: "investment",
    term: "투자",
    definitionKo: "더 크게 키우고 싶어서 어느 정도의 위험을 감수하고 돈을 심는 것",
  },
  {
    id: "stock",
    term: "주식",
    definitionKo: "회사를 여러 조각으로 나눈 것 중 내가 가진 한 조각",
  },
  {
    id: "etf-etn",
    term: "ETF/ETN",
    definitionKo: "여러 회사(또는 자산)를 한 바구니에 담아 조금씩 나눠 가지는 방법",
  },
  {
    id: "gold",
    term: "금",
    definitionKo: "아주 오래전부터 사람들이 믿고 아껴온 반짝이는 안전자산",
  },
  {
    id: "loan",
    term: "대출",
    definitionKo: "지금 필요한 돈을 남에게 빌리고, 나중에 조금 더 얹어 갚기로 하는 약속",
  },
  {
    id: "leverage",
    term: "레버리지",
    definitionKo:
      "내 돈에 빌린 돈을 더해 더 큰 것을 시도하는 지렛대 전략(잘되면 더 크게 벌지만, 잘못되면 더 크게 잃을 수 있음)",
  },
  {
    id: "inflation",
    term: "인플레이션",
    definitionKo: "시간이 지나며 같은 돈으로 살 수 있는 물건이 조금씩 줄어드는 현상",
  },
  {
    id: "capitalism",
    term: "자본주의",
    definitionKo: "각자 자기 것을 갖고 서로 경쟁하며 더 잘 만들려고 노력하는 방식",
  },
  {
    id: "socialism-communism",
    term: "사회주의/공산주의",
    definitionKo: "만든 것을 다 함께 나누거나 공동으로 소유하는 방식",
  },
  {
    id: "digital-currency",
    term: "디지털 화폐/코인",
    definitionKo: "종이나 동전이 아니라 인터넷 속 컴퓨터에 기록되는 돈",
  },
  {
    id: "stablecoin",
    term: "스테이블코인",
    definitionKo: "가격이 실제 돈(달러 등)에 묶여 있어 잘 출렁이지 않는 코인",
  },
];
