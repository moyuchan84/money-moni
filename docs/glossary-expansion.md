# 머니모니 — 용어사전 확장 스펙 & 콘텐츠

> 실제 코드(`data/glossary.ts`, `app/glossary/page.tsx`)를 확인한 결과를 바탕으로 작성했다. 지금 용어사전은 18개 용어 각각에 한 줄 정의만 있는 `<dl>` 목록이라("너무 단순함") 이를 비유·실생활 예시·관련 개념·게임 연결까지 갖춘 진짜 "사전"으로 확장한다. 실행용 체크리스트는 `docs/tasks/glossary-expansion.md`에 있다.

---

## 1. 현재 상태 진단

`data/glossary.ts`는 `docs/idea.md` 9장의 한 줄 정의를 그대로 옮긴 18개 항목(`GlossaryEntry { id, term, definitionKo }`)뿐이고, `app/glossary/page.tsx`는 이를 그냥 세로로 나열하는 `<dl>` 하나뿐이다. 카테고리 구분도, 비유도, 예시도, 다른 용어와의 연결도, 게임/도감으로의 링크도 없다. 반면 이미 이 프로젝트에는 훨씬 풍부한 재료가 있다 — `docs/concept-story.md`(15개 모듈별 비유·상황·실생활 예시)와 `docs/theory-deepdive.md`(15개 모듈별 실제 역사·이론)가 그것이다. 이번 확장은 **새로 리서치하기보다, 이미 만들어둔 두 문서의 내용을 용어사전 형태로 재구성하는 작업**에 가깝다.

## 2. 확장 방향

각 용어 카드는 다음 다섯 요소를 갖는다. ① 한 줄 정의(기존 유지, 목록에서 먼저 보임) ② 확장 설명(2~4문장, 왜/어떻게까지 설명) ③ 비유 한 문장(`concept-story.md`에서 가져옴, 강조 표시) ④ 실생활 예시 ⑤ 관련 용어·관련 건물 링크. 목록은 평평한 나열 대신 **카테고리별로 묶고**, 각 항목은 **기본 접힘 → 탭하면 펼쳐지는 아코디언**으로 바꿔 정보량이 늘어도 화면이 부담스럽지 않게 한다. 건물이 있는 용어는 "🏠 게임에서 만나보기" 링크로 `/building/[id]`(또는 `/money-tree`)로 보내고, `docs/tasks/theory-deepdive.md`가 구현된 뒤에는 "🧠 역사 더 알아보기" 링크로 `/almanac/[id]`도 연결한다(도감이 아직 없다면 이 링크는 조건부로 숨긴다).

## 3. 데이터 스키마 확장 — `data/glossary.ts`

```ts
export type GlossaryCategory =
  | "money-basics"       // 돈, 디지털화폐/코인, 스테이블코인
  | "income-spending"    // 소득, 소비/지출
  | "saving-growth"       // 저축, 이자, 복리
  | "capital-investment"  // 자본, 투자, 주식, ETF/ETN, 금
  | "debt"                 // 대출, 레버리지
  | "big-picture";         // 인플레이션, 자본주의/사회주의

export interface GlossaryEntry {
  id: GlossaryId;
  term: string;
  category: GlossaryCategory;
  shortDefinitionKo: string;     // 기존 definitionKo를 이름만 변경해 그대로 재사용
  longDefinitionKo: string;      // 신규 — 왜/어떻게를 담은 확장 설명
  metaphorKo: string;            // 신규 — docs/concept-story.md의 비유 재사용
  exampleKo: string;             // 신규 — 실생활 예시
  relatedBuildingId?: string;    // 신규 — "게임에서 만나보기" 딥링크(BuildingId 또는 "money-tree")
  relatedTermIds?: GlossaryId[]; // 신규 — 관련 용어 상호 링크
}
```

기존 `definitionKo` 필드명은 `shortDefinitionKo`로 바꾸는 것을 권장하되(의미가 더 명확해짐), 이름을 바꾸면 `app/glossary/page.tsx`의 참조도 함께 고쳐야 한다(`docs/tasks/glossary-expansion.md` T1 참고).

## 4. 18개 용어 확장 콘텐츠

카테고리별로 정리했다. `shortDefinitionKo`는 기존 값을 그대로 쓰면 되므로 생략하고, 신규 필드만 제시한다.

### 4-1. money-basics

**money(돈)** — longDefinition: "옛날엔 조개껍데기나 금속 동전으로 물건을 바꿨고, 지금은 지폐·카드·디지털 화폐로 바꿔. 돈의 모습은 시대마다 계속 바뀌어왔지만 '서로 다른 걸 편하게 바꾸도록 도와주는 도구'라는 역할은 변하지 않았어." / metaphor: "돈은 내가 가진 것과 남이 가진 것을 편하게 바꿀 수 있게 도와주는 마법의 다리야." / example: "마트에서 카드 한 장으로 뭐든지 살 수 있는 것처럼." / relatedBuilding: `museum` / related: `digital-currency`, `income`

**digital-currency(디지털 화폐/코인)** — long: "종이나 동전이 아니라 인터넷 속 컴퓨터에 기록되는 돈이야. 2008년 '사토시 나카모토'라는 이름으로 비트코인이라는 디지털 화폐의 설계도가 처음 발표됐어." / metaphor: "스마트폰 화면 안에 사는 눈에 안 보이는 동전." / example: "온라인 게임 속 포인트처럼, 실제로 손에 쥘 순 없지만 기록으로 존재하는 돈." / relatedBuilding: `coin-station` / related: `stablecoin`, `money`

**stablecoin(스테이블코인)** — long: "일반 코인은 가격이 롤러코스터처럼 크게 출렁이는데, 스테이블코인은 가격을 실제 돈(달러 등)에 꽉 묶어놓아서 출렁임이 훨씬 적어." / metaphor: "롤러코스터 옆의 잔잔한 튜브 물놀이 트랙." / example: "물놀이장에서 무서운 놀이기구 대신 잔잔한 튜브를 고르는 것과 비슷해." / relatedBuilding: `coin-station` / related: `digital-currency`

### 4-2. income-spending

**income(소득)** — long: "내가 벌어들이는 돈은 세 가지로 나뉘어. 몸을 움직여 버는 근로소득, 내가 사장이 되어 버는 사업소득, 내 돈이나 재산이 스스로 벌어다 주는 자본소득이야." / metaphor: "일꾼은 몸으로, 사장님은 아이디어로, 농장주는 심어둔 나무로 돈을 벌어." / example: "부모님이 회사에서 월급을 받는 것, 작은 가게를 운영하는 것, 은행에 맡긴 돈이 이자를 버는 것." / relatedBuilding: `job-center` / related: `spending`, `capital`

**spending(소비/지출)** — long: "원하는 것을 얻기 위해 돈을 내보내는 것이야. 가계부에서는 나가는 돈을 빨간 화살표로 표시하는데, 빨간 화살표가 너무 많으면 저금통이 홀쭉해져." / metaphor: "가계부 지도 위의 빨간 화살표." / example: "문구점에서 500원짜리 지우개를 사는 순간 빨간 화살표가 하나 그려지는 것." / relatedBuilding: `ledger-house` / related: `income`, `saving`

### 4-3. saving-growth

**saving(저축)** — long: "나중을 위해 돈을 안전한 곳에 모아두는 것이야. 다만 오래 넣어두기만 하면 인플레이션 때문에 그 돈으로 살 수 있는 게 조금씩 줄어들 수도 있어서, 어른들은 저축과 투자를 함께 고려해." / metaphor: "안전한 항아리에 동전을 모아두는 것." / example: "세뱃돈을 다 쓰지 않고 은행 계좌에 넣어두는 것." / relatedBuilding: `bank` / related: `interest`, `investment`, `inflation`

**interest(이자)** — long: "내 돈을 은행에 잠깐 맡겨준 대가로 은행이 '고마워'하며 조금 더 얹어주는 작은 보너스야. 오래, 많이 맡길수록 이자도 커져." / metaphor: "짝꿍에게 지우개를 빌려주고 다음 날 새 지우개 하나를 더 받는 것." / example: "저금통 대신 은행 계좌에 돈을 넣어두면 시간이 지나 조금씩 늘어 있는 것." / relatedBuilding: `bank` / related: `saving`, `compound-interest`

**compound-interest(복리)** — long: "받은 이자를 다시 저금해서, 그 이자가 또 이자를 만들게 하는 것이야. 실제로 '72의 법칙'이라는 계산법이 있는데, 72를 이자율로 나누면 원금이 대략 몇 년 만에 두 배가 되는지 알 수 있어(예: 이자율 6%면 약 12년)." / metaphor: "언덕에서 구르는 눈덩이 — 커질수록 더 빨리 커져." / example: "세뱃돈을 계속 저금만 해도 늘지만, 이자까지 계속 다시 저금하면 몇 년 뒤엔 훨씬 큰 차이가 나." / relatedBuilding: `money-tree` / related: `interest`, `investment`

### 4-4. capital-investment

**capital(자본)** — long: "돈을 더 버는 데 쓰이는 도구나 재산을 말해. 오븐, 트랙터, 가게, 저축해둔 돈까지 다 자본이 될 수 있어. 옛날 산업혁명 때는 기계(자본)가 생기면서 사람이 하루에 만들 수 있는 물건의 양이 크게 늘었어." / metaphor: "나 대신 일을 더 많이 해주는 도구." / example: "빵집 아저씨가 손으로만 반죽할 때보다 오븐을 산 뒤 훨씬 많은 빵을 구울 수 있게 된 것." / relatedBuilding: `capital-warehouse` / related: `income`, `investment`

**investment(투자)** — long: "더 크게 키우고 싶어서 어느 정도의 위험을 감수하고 돈을 심는 것이야. 저축과 다르게 결과가 항상 좋지만은 않아서, 잘되면 크게 불어나지만 잘못되면 줄어들 수도 있어(하이 리스크, 하이 리턴)." / metaphor: "결과를 알 수 없는 씨앗을 심는 것." / example: "세뱃돈을 그대로 저금하면 안전하게 남지만, 어른들이 일부를 투자하면 더 크게 불어날 수도, 줄어들 수도 있어." / relatedBuilding: `seed-field` / related: `stock`, `etf-etn`, `gold`, `saving`

**stock(주식)** — long: "회사를 케이크처럼 여러 조각으로 나눈 것 중 내가 가진 한 조각이야. 회사가 잘되면 내 조각의 가치도 커져. 1602년 네덜란드의 동인도회사가 세계 최초로 이런 '조각'(주식)을 만들어 팔았고, 이게 세계 최초의 증권거래소로 이어졌어." / metaphor: "회사를 나눈 케이크 한 조각." / example: "내가 좋아하는 과자 회사가 신제품으로 큰 인기를 끌면, 그 회사 주식을 가진 사람들도 좋은 소식을 듣게 돼." / relatedBuilding: `stock-street` / related: `investment`, `etf-etn`

**etf-etn(ETF/ETN)** — long: "여러 회사(또는 자산)를 한 바구니에 담아 조금씩 나눠 가지는 방법이야. 하나가 별로여도 바구니 전체는 덜 흔들려. 이런 '분산투자'가 좋은 이유를 설명한 이론으로 노벨경제학상을 받은 학자도 있어." / metaphor: "여러 과자를 조금씩 섞은 종합선물세트." / example: "좋아하는 과자 하나만 잔뜩 샀는데 단종되면 속상하지만, 여러 과자를 섞어 사면 덜 아쉬운 것." / relatedBuilding: `etf-lab` / related: `stock`, `investment`

**gold(금)** — long: "아주 오래전부터 지금까지 사람들이 믿고 아껴온 반짝이는 안전자산이야. 옛날엔 나라마다 화폐의 가치를 금에 딱 고정해두는 '금본위제'라는 제도도 있었어." / metaphor: "오래도록 사람들이 지켜온 반짝이는 약속." / example: "결혼반지나 돌잔치 금반지처럼, 시간이 지나도 가치가 잘 사라지지 않는다고 여겨져 특별한 선물로도 쓰여." / relatedBuilding: `gold-vault` / related: `investment`, `money`

### 4-5. debt

**loan(대출)** — long: "지금 필요한 돈을 남에게 빌리고, 나중에 조금 더 얹어 갚기로 하는 약속이야. 어른들이 집을 살 때 은행에서 돈을 빌리고 나중에 이자와 함께 갚아나가는 것도 대출의 예야." / metaphor: "친구에게 케이크를 빌리고 내일 조금 더 갚기로 하는 것." / example: "파티에 케이크를 더 크게 만들고 싶은데 재료가 모자랄 때 친구 것을 빌리는 것." / relatedBuilding: `loan-counter` / related: `leverage`, `interest`

**leverage(레버리지)** — long: "내 돈에 빌린 돈을 더해 더 큰 것을 시도하는 전략이야. 잘되면 원래보다 훨씬 크게 벌 수 있지만, 잘못되면 원래 내 돈보다 더 크게 잃을 수도 있어. 2008년에는 전 세계적으로 빚(레버리지)이 너무 많이 쌓여서 큰 어려움을 겪은 적도 있었어." / metaphor: "무거운 돌을 드는 지렛대 — 크게 들 수도, 균형을 잃을 수도." / example: "내 돈만으로 살 수 없던 것을 빌린 돈을 더해 사는 것, 대신 갚을 것도 더 커지는 것." / relatedBuilding: `loan-counter` / related: `loan`, `investment`

### 4-6. big-picture

**inflation(인플레이션)** — long: "시간이 지나며 같은 돈으로 살 수 있는 물건이 조금씩 줄어드는 현상이야. 나라마다 여러 물건 가격을 모아 계산하는 '물가지수'로 이 정도를 재고, 물가가 너무 심하게 오른 나라도 역사 속에 있었어." / metaphor: "천천히 바람이 빠지는 풍선." / example: "지난달엔 200원이던 아이스크림이 이번 달엔 300원이 된 것." / relatedBuilding: `market` / related: `saving`, `money`

**capitalism(자본주의)** — long: "각자 자기 것을 갖고 서로 경쟁하며 더 잘 만들려고 노력하는 방식이야. 1776년 애덤 스미스라는 학자가 이 방식을 이론으로 정리한 책을 냈어." / metaphor: "각자 다른 빵집을 운영하며 더 맛있게 만들려고 경쟁하는 마을." / example: "학교 조별 과제에서 잘한 사람이 더 칭찬받는 것과 비슷한 방식." / relatedBuilding: `triple-village` / related: `socialism-communism`, `capital`

**socialism-communism(사회주의/공산주의)** — long: "만든 것을 다 함께 나누거나 공동으로 소유하는 방식이야. 칼 마르크스라는 학자가 19세기에 이런 생각을 이론으로 제시했어. 정답이 정해진 문제는 아니고, 나라마다 자본주의와 이런 생각을 조금씩 섞어서 쓰기도 해." / metaphor: "만든 빵을 모아 다 같이 똑같이 나누는 마을." / example: "조별 과제 점수를 다 같이 똑같이 나눠 받는 것과 비슷한 방식." / relatedBuilding: `triple-village` / related: `capitalism`

## 5. UI 재구성 — `app/glossary/page.tsx`

카테고리 헤더 아래 아코디언 카드 목록으로 바꾼다. 접힌 상태에는 `term` + `shortDefinitionKo` + 아이콘만 보이고, 펼치면 `longDefinitionKo` → `metaphorKo`(강조 카드) → `exampleKo` → 관련 링크(관련 용어 칩, "게임에서 만나보기" 버튼) 순서로 보인다. 목록이 길어지므로 카테고리 탭이나 아코디언 섹션으로 한 화면에 전부 펼쳐지지 않게 한다. `docs/design-revision.md`가 먼저 적용되어 있다면 이 화면도 `AppShell`/`Button` 규칙을 그대로 따른다.

## 6. 참고

- `docs/concept-story.md` 7장 — 비유·상황 원문(이 문서의 `metaphorKo`/`exampleKo` 출처)
- `docs/theory-deepdive.md` 2장 — 실제 역사·이론 원문(이 문서의 `longDefinitionKo`에 녹아든 사실 출처)
- `docs/tasks/glossary-expansion.md` — 실행용 체크리스트
