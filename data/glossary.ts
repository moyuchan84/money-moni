// 용어 미니사전. 짧은 정의 카피는 docs/idea.md 9장(아이 눈높이 정의 초안)을 그대로 옮긴 것이고,
// 확장 필드(long/metaphor/example)는 docs/concept-story.md·docs/theory-deepdive.md의 내용을
// docs/glossary-expansion.md 4장에서 정리한 문장을 그대로 옮긴 것이다.

import type { BuildingId } from "./buildings";

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
  | "stablecoin"
  | "tax"
  | "credit"
  | "cost-profit"
  | "value-spending";

export type GlossaryCategory =
  | "money-basics"
  | "income-spending"
  | "saving-growth"
  | "capital-investment"
  | "debt"
  | "big-picture";

export interface GlossaryEntry {
  id: GlossaryId;
  term: string;
  category: GlossaryCategory;
  shortDefinitionKo: string;
  longDefinitionKo: string;
  metaphorKo: string;
  exampleKo: string;
  relatedBuildingId?: BuildingId;
  relatedTermIds?: GlossaryId[];
}

export const glossary: GlossaryEntry[] = [
  {
    id: "money",
    term: "돈",
    category: "money-basics",
    shortDefinitionKo: "내가 가진 것과 남이 가진 것을 편하게 바꿀 수 있게 도와주는 약속의 도구",
    longDefinitionKo:
      "옛날엔 조개껍데기나 금속 동전으로 물건을 바꿨고, 지금은 지폐·카드·디지털 화폐로 바꿔. 돈의 모습은 시대마다 계속 바뀌어왔지만 '서로 다른 걸 편하게 바꾸도록 도와주는 도구'라는 역할은 변하지 않았어.",
    metaphorKo: "돈은 내가 가진 것과 남이 가진 것을 편하게 바꿀 수 있게 도와주는 마법의 다리야.",
    exampleKo: "마트에서 카드 한 장으로 뭐든지 살 수 있는 것처럼.",
    relatedBuildingId: "museum",
    relatedTermIds: ["digital-currency", "income"],
  },
  {
    id: "digital-currency",
    term: "디지털 화폐/코인",
    category: "money-basics",
    shortDefinitionKo: "종이나 동전이 아니라 인터넷 속 컴퓨터에 기록되는 돈",
    longDefinitionKo:
      "종이나 동전이 아니라 인터넷 속 컴퓨터에 기록되는 돈이야. 2008년 '사토시 나카모토'라는 이름으로 비트코인이라는 디지털 화폐의 설계도가 처음 발표됐어.",
    metaphorKo: "스마트폰 화면 안에 사는 눈에 안 보이는 동전.",
    exampleKo: "온라인 게임 속 포인트처럼, 실제로 손에 쥘 순 없지만 기록으로 존재하는 돈.",
    relatedBuildingId: "coin-station",
    relatedTermIds: ["stablecoin", "money"],
  },
  {
    id: "stablecoin",
    term: "스테이블코인",
    category: "money-basics",
    shortDefinitionKo: "가격이 실제 돈(달러 등)에 묶여 있어 잘 출렁이지 않는 코인",
    longDefinitionKo:
      "일반 코인은 가격이 롤러코스터처럼 크게 출렁이는데, 스테이블코인은 가격을 실제 돈(달러 등)에 꽉 묶어놓아서 출렁임이 훨씬 적어.",
    metaphorKo: "롤러코스터 옆의 잔잔한 튜브 물놀이 트랙.",
    exampleKo: "물놀이장에서 무서운 놀이기구 대신 잔잔한 튜브를 고르는 것과 비슷해.",
    relatedBuildingId: "coin-station",
    relatedTermIds: ["digital-currency"],
  },
  {
    id: "income",
    term: "소득",
    category: "income-spending",
    shortDefinitionKo:
      "내가 벌어들이는 돈. 몸을 움직여 버는 근로소득, 내가 사장이 되어 버는 사업소득, 내 돈이나 물건이 스스로 벌어다 주는 자본소득으로 나뉨",
    longDefinitionKo:
      "내가 벌어들이는 돈은 세 가지로 나뉘어. 몸을 움직여 버는 근로소득, 내가 사장이 되어 버는 사업소득, 내 돈이나 재산이 스스로 벌어다 주는 자본소득이야.",
    metaphorKo: "일꾼은 몸으로, 사장님은 아이디어로, 농장주는 심어둔 나무로 돈을 벌어.",
    exampleKo: "부모님이 회사에서 월급을 받는 것, 작은 가게를 운영하는 것, 은행에 맡긴 돈이 이자를 버는 것.",
    relatedBuildingId: "job-center",
    relatedTermIds: ["spending", "capital"],
  },
  {
    id: "spending",
    term: "소비/지출",
    category: "income-spending",
    shortDefinitionKo: "원하는 것을 얻기 위해 돈을 내보내는 것",
    longDefinitionKo:
      "원하는 것을 얻기 위해 돈을 내보내는 것이야. 가계부에서는 나가는 돈을 빨간 화살표로 표시하는데, 빨간 화살표가 너무 많으면 저금통이 홀쭉해져.",
    metaphorKo: "가계부 지도 위의 빨간 화살표.",
    exampleKo: "문구점에서 500원짜리 지우개를 사는 순간 빨간 화살표가 하나 그려지는 것.",
    relatedBuildingId: "ledger-house",
    relatedTermIds: ["income", "saving", "value-spending"],
  },
  {
    id: "saving",
    term: "저축",
    category: "saving-growth",
    shortDefinitionKo: "나중을 위해 돈을 안전하게 모아두는 것",
    longDefinitionKo:
      "나중을 위해 돈을 안전한 곳에 모아두는 것이야. 다만 오래 넣어두기만 하면 인플레이션 때문에 그 돈으로 살 수 있는 게 조금씩 줄어들 수도 있어서, 어른들은 저축과 투자를 함께 고려해.",
    metaphorKo: "안전한 항아리에 동전을 모아두는 것.",
    exampleKo: "세뱃돈을 다 쓰지 않고 은행 계좌에 넣어두는 것.",
    relatedBuildingId: "bank",
    relatedTermIds: ["interest", "investment", "inflation"],
  },
  {
    id: "interest",
    term: "이자",
    category: "saving-growth",
    shortDefinitionKo: "내 돈을 잠깐 빌려준 대가로 더 받는 작은 보너스",
    longDefinitionKo:
      "내 돈을 은행에 잠깐 맡겨준 대가로 은행이 '고마워'하며 조금 더 얹어주는 작은 보너스야. 오래, 많이 맡길수록 이자도 커져.",
    metaphorKo: "짝꿍에게 지우개를 빌려주고 다음 날 새 지우개 하나를 더 받는 것.",
    exampleKo: "저금통 대신 은행 계좌에 돈을 넣어두면 시간이 지나 조금씩 늘어 있는 것.",
    relatedBuildingId: "bank",
    relatedTermIds: ["saving", "compound-interest"],
  },
  {
    id: "compound-interest",
    term: "복리",
    category: "saving-growth",
    shortDefinitionKo: "받은 이자를 다시 저금해서, 이자가 이자를 낳게 만드는 마법",
    longDefinitionKo:
      "받은 이자를 다시 저금해서, 그 이자가 또 이자를 만들게 하는 것이야. 실제로 '72의 법칙'이라는 계산법이 있는데, 72를 이자율로 나누면 원금이 대략 몇 년 만에 두 배가 되는지 알 수 있어(예: 이자율 6%면 약 12년).",
    metaphorKo: "언덕에서 구르는 눈덩이 — 커질수록 더 빨리 커져.",
    exampleKo: "세뱃돈을 계속 저금만 해도 늘지만, 이자까지 계속 다시 저금하면 몇 년 뒤엔 훨씬 큰 차이가 나.",
    relatedBuildingId: "money-tree",
    relatedTermIds: ["interest", "investment"],
  },
  {
    id: "capital",
    term: "자본",
    category: "capital-investment",
    shortDefinitionKo: "돈을 더 버는 데 쓰이는 도구나 재산 (기계, 가게, 투자한 돈 등)",
    longDefinitionKo:
      "돈을 더 버는 데 쓰이는 도구나 재산을 말해. 오븐, 트랙터, 가게, 저축해둔 돈까지 다 자본이 될 수 있어. 옛날 산업혁명 때는 기계(자본)가 생기면서 사람이 하루에 만들 수 있는 물건의 양이 크게 늘었어.",
    metaphorKo: "나 대신 일을 더 많이 해주는 도구.",
    exampleKo: "빵집 아저씨가 손으로만 반죽할 때보다 오븐을 산 뒤 훨씬 많은 빵을 구울 수 있게 된 것.",
    relatedBuildingId: "capital-warehouse",
    relatedTermIds: ["income", "investment"],
  },
  {
    id: "investment",
    term: "투자",
    category: "capital-investment",
    shortDefinitionKo: "더 크게 키우고 싶어서 어느 정도의 위험을 감수하고 돈을 심는 것",
    longDefinitionKo:
      "더 크게 키우고 싶어서 어느 정도의 위험을 감수하고 돈을 심는 것이야. 저축과 다르게 결과가 항상 좋지만은 않아서, 잘되면 크게 불어나지만 잘못되면 줄어들 수도 있어(하이 리스크, 하이 리턴).",
    metaphorKo: "결과를 알 수 없는 씨앗을 심는 것.",
    exampleKo: "세뱃돈을 그대로 저금하면 안전하게 남지만, 어른들이 일부를 투자하면 더 크게 불어날 수도, 줄어들 수도 있어.",
    relatedBuildingId: "seed-field",
    relatedTermIds: ["stock", "etf-etn", "gold", "saving"],
  },
  {
    id: "stock",
    term: "주식",
    category: "capital-investment",
    shortDefinitionKo: "회사를 여러 조각으로 나눈 것 중 내가 가진 한 조각",
    longDefinitionKo:
      "회사를 케이크처럼 여러 조각으로 나눈 것 중 내가 가진 한 조각이야. 회사가 잘되면 내 조각의 가치도 커져. 1602년 네덜란드의 동인도회사가 세계 최초로 이런 '조각'(주식)을 만들어 팔았고, 이게 세계 최초의 증권거래소로 이어졌어.",
    metaphorKo: "회사를 나눈 케이크 한 조각.",
    exampleKo: "내가 좋아하는 과자 회사가 신제품으로 큰 인기를 끌면, 그 회사 주식을 가진 사람들도 좋은 소식을 듣게 돼.",
    relatedBuildingId: "stock-street",
    relatedTermIds: ["investment", "etf-etn"],
  },
  {
    id: "etf-etn",
    term: "ETF/ETN",
    category: "capital-investment",
    shortDefinitionKo: "여러 회사(또는 자산)를 한 바구니에 담아 조금씩 나눠 가지는 방법",
    longDefinitionKo:
      "여러 회사(또는 자산)를 한 바구니에 담아 조금씩 나눠 가지는 방법이야. 하나가 별로여도 바구니 전체는 덜 흔들려. 이런 '분산투자'가 좋은 이유를 설명한 이론으로 노벨경제학상을 받은 학자도 있어.",
    metaphorKo: "여러 과자를 조금씩 섞은 종합선물세트.",
    exampleKo: "좋아하는 과자 하나만 잔뜩 샀는데 단종되면 속상하지만, 여러 과자를 섞어 사면 덜 아쉬운 것.",
    relatedBuildingId: "etf-lab",
    relatedTermIds: ["stock", "investment"],
  },
  {
    id: "gold",
    term: "금",
    category: "capital-investment",
    shortDefinitionKo: "아주 오래전부터 사람들이 믿고 아껴온 반짝이는 안전자산",
    longDefinitionKo:
      "아주 오래전부터 지금까지 사람들이 믿고 아껴온 반짝이는 안전자산이야. 옛날엔 나라마다 화폐의 가치를 금에 딱 고정해두는 '금본위제'라는 제도도 있었어.",
    metaphorKo: "오래도록 사람들이 지켜온 반짝이는 약속.",
    exampleKo: "결혼반지나 돌잔치 금반지처럼, 시간이 지나도 가치가 잘 사라지지 않는다고 여겨져 특별한 선물로도 쓰여.",
    relatedBuildingId: "gold-vault",
    relatedTermIds: ["investment", "money"],
  },
  {
    id: "loan",
    term: "대출",
    category: "debt",
    shortDefinitionKo: "지금 필요한 돈을 남에게 빌리고, 나중에 조금 더 얹어 갚기로 하는 약속",
    longDefinitionKo:
      "지금 필요한 돈을 남에게 빌리고, 나중에 조금 더 얹어 갚기로 하는 약속이야. 어른들이 집을 살 때 은행에서 돈을 빌리고 나중에 이자와 함께 갚아나가는 것도 대출의 예야.",
    metaphorKo: "친구에게 케이크를 빌리고 내일 조금 더 갚기로 하는 것.",
    exampleKo: "파티에 케이크를 더 크게 만들고 싶은데 재료가 모자랄 때 친구 것을 빌리는 것.",
    relatedBuildingId: "loan-counter",
    relatedTermIds: ["leverage", "interest", "credit"],
  },
  {
    id: "leverage",
    term: "레버리지",
    category: "debt",
    shortDefinitionKo:
      "내 돈에 빌린 돈을 더해 더 큰 것을 시도하는 지렛대 전략(잘되면 더 크게 벌지만, 잘못되면 더 크게 잃을 수 있음)",
    longDefinitionKo:
      "내 돈에 빌린 돈을 더해 더 큰 것을 시도하는 전략이야. 잘되면 원래보다 훨씬 크게 벌 수 있지만, 잘못되면 원래 내 돈보다 더 크게 잃을 수도 있어. 2008년에는 전 세계적으로 빚(레버리지)이 너무 많이 쌓여서 큰 어려움을 겪은 적도 있었어.",
    metaphorKo: "무거운 돌을 드는 지렛대 — 크게 들 수도, 균형을 잃을 수도.",
    exampleKo: "내 돈만으로 살 수 없던 것을 빌린 돈을 더해 사는 것, 대신 갚을 것도 더 커지는 것.",
    relatedBuildingId: "loan-counter",
    relatedTermIds: ["loan", "investment"],
  },
  {
    id: "inflation",
    term: "인플레이션",
    category: "big-picture",
    shortDefinitionKo: "시간이 지나며 같은 돈으로 살 수 있는 물건이 조금씩 줄어드는 현상",
    longDefinitionKo:
      "시간이 지나며 같은 돈으로 살 수 있는 물건이 조금씩 줄어드는 현상이야. 나라마다 여러 물건 가격을 모아 계산하는 '물가지수'로 이 정도를 재고, 물가가 너무 심하게 오른 나라도 역사 속에 있었어.",
    metaphorKo: "천천히 바람이 빠지는 풍선.",
    exampleKo: "지난달엔 200원이던 아이스크림이 이번 달엔 300원이 된 것.",
    relatedBuildingId: "market",
    relatedTermIds: ["saving", "money"],
  },
  {
    id: "capitalism",
    term: "자본주의",
    category: "big-picture",
    shortDefinitionKo: "각자 자기 것을 갖고 서로 경쟁하며 더 잘 만들려고 노력하는 방식",
    longDefinitionKo:
      "각자 자기 것을 갖고 서로 경쟁하며 더 잘 만들려고 노력하는 방식이야. 1776년 애덤 스미스라는 학자가 이 방식을 이론으로 정리한 책을 냈어.",
    metaphorKo: "각자 다른 빵집을 운영하며 더 맛있게 만들려고 경쟁하는 마을.",
    exampleKo: "학교 조별 과제에서 잘한 사람이 더 칭찬받는 것과 비슷한 방식.",
    relatedBuildingId: "triple-village",
    relatedTermIds: ["socialism-communism", "capital"],
  },
  {
    id: "socialism-communism",
    term: "사회주의/공산주의",
    category: "big-picture",
    shortDefinitionKo: "만든 것을 다 함께 나누거나 공동으로 소유하는 방식",
    longDefinitionKo:
      "만든 것을 다 함께 나누거나 공동으로 소유하는 방식이야. 칼 마르크스라는 학자가 19세기에 이런 생각을 이론으로 제시했어. 정답이 정해진 문제는 아니고, 나라마다 자본주의와 이런 생각을 조금씩 섞어서 쓰기도 해.",
    metaphorKo: "만든 빵을 모아 다 같이 똑같이 나누는 마을.",
    exampleKo: "조별 과제 점수를 다 같이 똑같이 나눠 받는 것과 비슷한 방식.",
    relatedBuildingId: "triple-village",
    relatedTermIds: ["capitalism"],
  },
  {
    id: "tax",
    term: "세금",
    category: "big-picture",
    shortDefinitionKo: "다 함께 쓰는 것(학교, 도로, 병원 등)을 위해 나라에 걷는 돈",
    longDefinitionKo:
      "세금은 나라 살림을 위해 사람들이 조금씩 나눠 내는 돈이야. 월급을 받을 때도, 물건을 살 때도 " +
      "그 안에 조금씩 세금이 포함돼 있어. 이렇게 모인 돈으로 학교, 도로, 병원처럼 다 함께 쓰는 것들을 " +
      "만들고 운영해. 그래서 세금을 내는 것만큼, 그 돈이 잘 쓰이고 있는지 관심을 갖는 것도 중요해.",
    metaphorKo: "세금은 마을 사람들이 조금씩 걷어서 다 같이 쓰는 놀이터를 만드는 것과 같아.",
    exampleKo: "우리 반이 학급 화폐로 나라 놀이를 하면서, 번 돈의 일부를 세금으로 걷어 학급 행사 비용으로 쓰는 것.",
    relatedBuildingId: "job-center",
    relatedTermIds: ["income"],
  },
  {
    id: "credit",
    term: "신용",
    category: "debt",
    shortDefinitionKo: "먼저 쓰고 나중에 갚을 거라는 믿음, 그리고 그 약속을 잘 지켜온 기록",
    longDefinitionKo:
      "신용카드는 지금 당장 돈을 안 내고 물건을 사고, 나중에(보통 한 달 뒤) 한꺼번에 갚는 카드야. " +
      "'이 사람은 나중에 꼭 갚을 거야'라는 믿음이 있어야 쓸 수 있는데, 이 믿음을 '신용'이라고 해. " +
      "약속을 잘 지킬수록 신용이 쌓이고, 안 지키면 신용이 깎여서 나중엔 아무도 믿어주지 않게 돼.",
    metaphorKo: "신용은 '나중에 꼭 갚을게'라는 약속을 계속 지켜서 쌓은 믿음의 점수판이야.",
    exampleKo: "문방구 아저씨가 자주 오는 단골에게 '다음에 와서 줘도 돼'라고 외상을 주는 것도 신용 덕분이야.",
    relatedBuildingId: "loan-counter",
    relatedTermIds: ["loan"],
  },
  {
    id: "cost-profit",
    term: "원가와 이윤",
    category: "income-spending",
    shortDefinitionKo: "물건을 만드는 데 든 돈(원가)과 판 값의 차이가 이윤",
    longDefinitionKo:
      "레모네이드를 만들 때 레몬, 설탕, 컵을 사는 데 든 돈이 '원가'야. 그걸 얼마에 파느냐에 따라 " +
      "남는 돈, 즉 '이윤'이 달라져. 너무 비싸게 팔면 안 팔리고, 너무 싸게 팔면 남는 게 없어서 " +
      "적당한 값을 찾는 게 중요해.",
    metaphorKo: "이윤은 내가 산 가격과 판 가격 사이에 남는 틈이야.",
    exampleKo: "500원짜리 재료로 레모네이드를 만들어 800원에 팔면, 300원이 이윤으로 남는 것.",
    relatedBuildingId: "market",
    relatedTermIds: ["capital", "spending"],
  },
  {
    id: "value-spending",
    term: "가치소비",
    category: "income-spending",
    shortDefinitionKo: "순간의 충동보다 내가 정말 아끼고 필요한 것에 돈을 쓰는 습관",
    longDefinitionKo:
      "가게에서 예쁜 걸 보면 당장 사고 싶어지는 마음을 '충동구매'라고 해. 가치소비는 그 순간의 " +
      "충동보다 '이게 나한테 정말 필요할까? 내가 정말 좋아하는 걸까?'를 한 번 더 생각해보고 " +
      "돈을 쓰는 습관이야. 사고 나서 후회하는 일을 줄여주고, 내가 진짜 원하는 걸 위해 돈을 아낄 수 있게 해줘.",
    metaphorKo: "가치소비는 사기 전에 마음에게 한 번 더 물어보는 것이야 — '이거 진짜 나한테 필요해?'",
    exampleKo: "장난감 가게에서 당장 사고 싶은 걸 참고, 집에 와서도 계속 생각나는지 하루 지켜본 뒤 결정하는 것.",
    relatedBuildingId: "allowance-square",
    relatedTermIds: ["spending"],
  },
];
