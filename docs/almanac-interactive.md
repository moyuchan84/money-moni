# 지식 도감(`/almanac`) — 애니메이션·인터랙티브 콘텐츠 강화 설계

> 목적: 지금 지식 도감(`/almanac/[id]`)은 `theoryNoteKo`(설명 문단) + `timeline`(연표 목록)을
> **정지된 텍스트/이미지 목록**으로만 보여주고 있다. 이걸 미니게임과는 별개로, "만져보고
> 움직여보면서 개념이 실제로 와닿는" 인터랙티브 콘텐츠로 강화한다. 미니게임(승패·점수·코인
> 보상이 있는 도전 과제)과는 성격이 다르다는 걸 명확히 한다 — 여기서는 **정답도, 승패도 없이**
> 슬라이더를 움직이고 탭해보면서 "아, 이래서 이렇게 되는구나"를 눈으로 확인하는 것이 목적이다.
>
> 이 문서를 쓰기 전 실제 코드를 다시 확인했다: `/almanac` 허브, `/almanac/[id]` 상세,
> `KnowledgeCard.tsx`, 15개 건물의 `data/almanac/*.ts`가 **이미 전부 구현되어 있다**
> (`docs/tasks/theory-deepdive.md`가 완료된 상태). 이번 문서는 그 위에 애니메이션/인터랙티브
> 레이어만 얹는다 — 데이터 스키마나 라우트를 갈아엎지 않는다.

---

## 1. 현재 상태 (실제 코드 기준)

`components/almanac/KnowledgeCard.tsx`는 `almanac.theoryNoteKo` 문단 하나와, `timeline`
배열을 `<ol>`로 순서대로 나열할 뿐이다(각 항목은 연도·제목·설명·선택적 이미지). 애니메이션도,
사용자가 조작할 수 있는 요소도 전혀 없다 — 스크롤해서 읽는 것 외에는 할 게 없는 화면이다. 반면
같은 프로젝트의 미니게임들은 이미 애니메이션/인터랙티브 기법을 여러 방식으로 쓰고 있다.

- `components/splash/SplashScreen.tsx`: `motion/react`의 `animate`/`whileInView` 스타일
  애니메이션 + `useReducedMotion()` 훅으로 감속 대응(이미 구현된 훅, 재사용 가능).
- `components/minigame/market/MarketPriceCanvas.tsx`: `PixiStage`(PixiJS 래퍼) 위에서
  캐릭터가 사인파를 그리며 움직이고, 일정 주기로 이벤트가 발생하는 패턴.
- `components/minigame/loanCounter/LoanBalanceCanvas.tsx`: 캔버스 기반으로 값이 변할 때마다
  시각적으로 기울어지는 인터랙션(레버리지 시소류 패턴 — 이번 설계에서 그대로 참고).

**이번 설계는 이 기존 기술 스택(motion, GSAP, PixiStage/캔버스)을 그대로 재사용**하고, 새
라이브러리를 추가하지 않는다.

---

## 2. 설계 원칙

1. **게임이 아니다.** 점수·타이머·승패·코인 보상이 없다. 슬라이더/탭으로 값을 바꾸면 결과가
   실시간으로 바뀌어 보이는, 순수하게 "조작해보며 이해하는" 도구다. `CLAUDE.md` 절대 규칙과
   충돌하지 않는다(정답 판정이 없다는 점에서 오히려 더 안전하다).
2. **읽기는 그대로 두고, 그 옆에 "직접 만져보기" 하나를 추가한다.** `theoryNoteKo`/`timeline`
   텍스트를 지우거나 대체하지 않는다 — 텍스트로 읽고 싶은 아이/부모도 있기 때문이다.
3. **`reducedMotion` 설정을 항상 존중한다.** 이미 있는 `useReducedMotion()` 훅을 모든 위젯이
   구독해서, 켜져 있으면 애니메이션 없이 최종 상태만 즉시 보여준다(값 조작 자체는 그대로
   가능 — 움직임만 없앤다).
4. **가벼운 것부터: 대부분은 SVG + `motion`로 충분하다.** PixiJS(캔버스)는 "계속 살아있는
   움직임"(출렁임, 흔들림 물리효과)이 꼭 필요한 곳에만 쓴다 — 나머지는 슬라이더 값에 따라
   `motion`의 `animate`로 SVG 도형을 움직이는 것으로 충분하고, 번들 크기·구현 난이도 모두
   낫다.
5. **15개 건물 전부를 한 번에 만들지 않는다.** 숫자로 표현되는 개념(복리, 인플레이션, 분산투자,
   레버리지, 이자, 주가)일수록 인터랙티브 위젯의 효과가 크다. 7장에 우선순위를 명시한다.

---

## 3. 데이터 스키마 확장 — `data/almanac/almanacTypes.ts`

```ts
export type AlmanacWidgetKey =
  | "compound-interest"     // money-tree
  | "interest-simulator"    // bank
  | "inflation-balloon"     // market
  | "income-race"           // job-center
  | "tool-compare"          // capital-warehouse
  | "seed-odds"             // seed-field
  | "stock-price"           // stock-street
  | "diversification-basket" // etf-lab
  | "gold-timeline"         // gold-vault
  | "coin-track"            // coin-station
  | "leverage-seesaw"       // loan-counter
  | "arrow-flow"            // ledger-house
  | "jar-ratio"             // allowance-square
  | "bread-split"           // triple-village
  | "money-shape-timeline"; // museum

export interface BuildingAlmanac {
  buildingId: BuildingId;
  theoryNoteKo: string;
  timeline: AlmanacTimelineEvent[];
  credits: ImageCredit[];
  interactiveWidgetKey?: AlmanacWidgetKey; // 신규, 선택 필드 — 없으면 위젯 섹션 자체를 렌더링하지 않는다
}
```

기존 15개 `data/almanac/*.ts` 파일에 `interactiveWidgetKey` 한 줄씩만 추가하면 된다(7장
우선순위에 따라 먼저 적용할 건물부터).

---

## 4. 컴포넌트 구조

```
components/almanac/
  KnowledgeCard.tsx           # 기존 — "직접 만져보기" 섹션 삽입 지점만 추가
  interactive/
    AlmanacWidgetSlot.tsx     # 신규 — interactiveWidgetKey → 실제 위젯 컴포넌트 매핑(레지스트리)
    CompoundInterestExplorer.tsx
    InterestSimulator.tsx
    InflationBalloonExplorer.tsx
    IncomeRaceExplorer.tsx
    ToolCompareExplorer.tsx
    SeedOddsExplorer.tsx
    StockPriceExplorer.tsx
    DiversificationBasketExplorer.tsx
    GoldTimelineExplorer.tsx
    CoinTrackExplorer.tsx
    LeverageSeesawExplorer.tsx
    ArrowFlowExplorer.tsx
    JarRatioExplorer.tsx
    BreadSplitExplorer.tsx
    MoneyShapeTimelineExplorer.tsx
```

`AlmanacWidgetSlot.tsx`는 `interactiveWidgetKey`가 없으면 `null`을 반환한다(죽은 자리를
만들지 않는다). 캔버스/PixiJS를 쓰는 위젯(4-바구니 흔들림, 코인 트랙)은 `CLAUDE.md` 절대
규칙 3에 따라 `next/dynamic(..., { ssr: false })`로만 불러온다.

`KnowledgeCard.tsx` 변경 지점(의사 코드):

```tsx
<div className="flex flex-col gap-4 rounded-card bg-surface p-4 text-ink shadow-card">
  <p className="text-body text-fg">{almanac.theoryNoteKo}</p>

  {almanac.interactiveWidgetKey && (
    <section className="flex flex-col gap-3 rounded-card bg-primary-light p-4">
      <p className="text-body font-semibold text-primary">
        ✨ {almanacContent.interactiveHeadingKo /* "직접 만져보며 이해하기" */}
      </p>
      <AlmanacWidgetSlot widgetKey={almanac.interactiveWidgetKey} />
    </section>
  )}

  <ol className="flex flex-col gap-4">{/* 기존 timeline 렌더링, 5장 애니메이션만 추가 */}</ol>
</div>
```

---

## 5. 타임라인 자체의 등장 애니메이션 (모든 건물 공통, 15개 전부 적용)

지금은 `timeline.map()`이 즉시 전부 렌더링된다. 여기에 `motion`의 `whileInView` + stagger를
적용해, 스크롤해서 각 연표 카드가 눈에 들어올 때마다 살짝 아래에서 위로 슬라이드하며
나타나도록 한다(이미지가 있는 카드는 이미지가 살짝 확대되며 나타나는 효과 추가).

```tsx
<motion.li
  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-40px" }}
  transition={{ duration: 0.4, delay: index * 0.05 }}
>
  {/* 기존 연도/제목/설명/이미지 */}
</motion.li>
```

이 변경 하나만으로도 "정지된 목록"이라는 인상이 크게 줄어들고, 15개 건물 전부에 동일하게
적용 가능해 비용 대비 효과가 가장 크다 — **우선순위 최상위(7장 P0)로 둔다.**

---

## 6. 15개 인터랙티브 위젯 상세 설계

각 위젯은 "무엇을 조작하는가 → 무엇이 실시간으로 바뀌어 보이는가 → 어떤 기술로 만드는가"로
정리했다.

### 6-1. `compound-interest`(`money-tree`, 72의 법칙) — 최우선

**조작**: 이자율 슬라이더(연 1%~20%)를 움직인다.
**변화**: (a) "72÷이자율 = 약 __년"이 실시간 텍스트로 계산되어 표시된다. (b) 눈덩이 SVG가
언덕을 굴러 내려가는 애니메이션 속도와 최종 크기가 이자율에 비례해 커진다(기존 `money-tree`
스토리의 "눈덩이" 비유를 그대로 시각화).
**기술**: `motion`의 `animate`로 눈덩이 SVG의 `scale`/`x` 값을 이자율에 따라 계산한 값으로
트랜지션. 슬라이더는 표준 `<input type="range">`(키보드 접근성 기본 제공).

### 6-2. `interest-simulator`(`bank`)

**조작**: "몇 달 동안 맡겨둘까?" 슬라이더(1~24개월).
**변화**: 저금통 SVG 위로 동전이 한 개씩 쌓이는 애니메이션(개월 수에 비례), 옆에 "처음 1000원
→ 지금 OOO원"이 카운트업된다.
**기술**: `motion`의 `animate` + stagger로 동전 아이콘들을 순차 등장.

### 6-3. `inflation-balloon`(`market`)

**조작**: "몇 년 뒤?" 슬라이더(0~10년).
**변화**: 풍선 SVG가 슬라이더 값에 비례해 조금씩 쭈그러들고(바람 빠짐), "100원으로 살 수
있는 아이스크림: N개"가 줄어드는 애니메이션.
**기술**: `motion`의 `animate`로 풍선 `scale`/`opacity` 보간.

### 6-4. `income-race`(`job-center`)

**조작**: "하루 빨리감기" 버튼 한 번 탭.
**변화**: 일꾼(느리게 조금씩)/사장님(들쭉날쭉)/농장주(가만히 있어도 자동으로) 세 캐릭터의
코인 카운터가 동시에, 서로 다른 패턴으로 올라가는 애니메이션이 재생된다(경쟁이 아니라 "다른
방식"이라는 걸 보여주는 게 목적 — 승패 없음을 카피로 명시).
**기술**: `motion`의 `animate` 시퀀스 3개를 `Promise.all`로 동시 재생.

### 6-5. `tool-compare`(`capital-warehouse`)

**조작**: "손으로 반죽" vs "오븐 사용" 버튼 탭.
**변화**: 같은 10초 동안 만들어지는 빵 개수가 카운터로 애니메이션되며 눈에 띄게 차이 난다.
**기술**: `motion`의 카운트업(숫자 tween) + 빵 아이콘 stagger 등장.

### 6-6. `seed-odds`(`seed-field`)

**조작**: "씨앗 심기" 버튼을 여러 번 탭.
**변화**: 탭할 때마다 무작위로 풍년(🌾, 큰 보상)/흉년(🥀, 작은 보상) 결과가 하나씩 화면에
쌓여서, 여러 번 반복하면 "매번 다르다"는 게 누적된 결과로 보인다(기존
`minigame/seedField/rouletteMath.ts`의 확률 로직을 재사용 가능 — 새로 만들지 않는다).
**기술**: 기존 `rouletteMath.ts` 로직 + `motion`으로 결과 아이콘 등장 애니메이션.

### 6-7. `stock-price`(`stock-street`)

**조작**: "신제품 인기도" 슬라이더(0~100).
**변화**: 케이크(회사) SVG에서 "내 조각"의 크기가 슬라이더에 비례해 실시간으로 커지거나
작아진다.
**기술**: `motion`의 `animate`로 SVG 조각의 `path`/`scale` 보간.

### 6-8. `diversification-basket`(`etf-lab`) — 최우선

**조작**: "바구니 흔들기" 버튼 — 과자 1종류만 담긴 바구니 vs 여러 종류가 담긴 바구니를 각각
탭해서 흔들어본다.
**변화**: 한 종류만 담긴 바구니는 크게 출렁이고(진폭 큼), 여러 종류가 섞인 바구니는 덜
출렁인다(진폭 작음) — 분산투자로 변동성이 줄어드는 걸 물리적 흔들림으로 체감시킨다.
**기술**: 지속적인 흔들림 물리효과가 필요하므로 `PixiStage` 기반 캔버스 사용(`MarketPriceCanvas.tsx`
패턴 재사용) — 스프링감 있는 흔들림은 PixiJS 틱 루프가 SVG보다 자연스럽다.

### 6-9. `gold-timeline`(`gold-vault`)

**조작**: "시대" 슬라이더(왕의 시대 → 상인의 시대 → 지금).
**변화**: 배경 일러스트(간단한 SVG 실루엣)가 슬라이더에 따라 바뀌지만, 화면 중앙의 금 아이콘은
항상 똑같이 반짝인다("다른 건 다 변해도 금은 그대로"라는 메시지를 시각적으로 반복).
**기술**: `motion`의 `AnimatePresence`로 배경 교차 페이드.

### 6-10. `coin-track`(`coin-station`)

**조작**: "출발!" 버튼 — 롤러코스터 트랙과 튜브 트랙에 각각 동전을 하나씩 출발시킨다.
**변화**: 롤러코스터 동전은 위아래로 크게 요동치며 이동하고, 튜브 동전은 잔잔하게 미끄러지듯
이동한다. 도착 후 "출렁인 정도"를 막대로 비교.
**기술**: `motion`의 `animate`로 두 경로(sine 곡선 vs 직선)를 따라가는 애니메이션.

### 6-11. `leverage-seesaw`(`loan-counter`) — 최우선

**조작**: "빌리는 돈" 슬라이더(0~내 돈의 3배).
**변화**: 시소 SVG가 슬라이더 값에 비례해 기울고, 동시에 "성공하면 +__원" / "실패하면 −__원"
두 숫자가 함께 커진다 — 레버리지가 이익과 손해를 동시에 증폭시킨다는 걸 시각화.
**기술**: 기존 `loanCounter/tiltMath.ts`(이미 시소 기울기 계산 로직이 있음 — 재사용)
+ `LoanBalanceCanvas.tsx`와 같은 캔버스 패턴, 또는 `motion`의 `rotate` 트랜지션으로도 충분히
구현 가능(캔버스 재사용이 더 빠르면 그쪽 선택).

### 6-12. `arrow-flow`(`ledger-house`)

**조작**: 초록 화살표(들어온 돈)/빨간 화살표(나간 돈) 버튼을 각각 탭.
**변화**: 탭할 때마다 저금통 SVG가 애니메이션으로 통통해지거나(초록) 홀쭉해진다(빨강).
**기술**: `motion`의 `scale` 트랜지션.

### 6-13. `jar-ratio`(`allowance-square`)

**조작**: 4개 항아리(소비/위시/저축/기부) 비율 슬라이더 4개(합이 100%가 되도록 서로 연동).
**변화**: 각 항아리 SVG의 물 높이가 실시간으로 애니메이션되며 채워진다.
**기술**: `motion`의 `height`/`clipPath` 애니메이션, 슬라이더 4개 연동 로직은 순수 JS 계산.

### 6-14. `bread-split`(`triple-village`)

**조작**: "자본주의 마을" / "사회주의 마을" / "공산주의 마을" 버튼 3개.
**변화**: 같은 빵 10개가 버튼에 따라 다른 규칙(잘한 사람이 더 많이 / 모두 똑같이 n분의 1 /
처음부터 공동 소유라 나눈다는 개념 자체가 없음)으로 나뉘는 애니메이션이 재생된다. 정답 표시나
우열 판정 없음(`CLAUDE.md` 절대 규칙 7 그대로 유지).
**기술**: `motion`의 stagger로 빵 조각 아이콘이 캐릭터별로 나뉘어 이동하는 애니메이션.

### 6-15. `money-shape-timeline`(`museum`)

**조작**: 가로 스크러버(드래그 또는 좌우 버튼)로 시대를 이동.
**변화**: 화면 중앙의 "돈" 아이콘이 조개 → 동전 → 지폐 → 카드 → 스마트폰(디지털) 순서로
모양이 바뀌는 애니메이션(모핑이 아니라 교차 페이드로 충분).
**기술**: `motion`의 `AnimatePresence` 교차 페이드. 기존 미니게임
`MuseumTimelineStrip.tsx`(게임용 타임라인 스트립)과는 별개의, 도감 전용 가벼운 버전으로 만든다
(미니게임 컴포넌트를 직접 재사용하지 않는다 — 그쪽은 정답 판정이 있는 게임 로직과 얽혀 있다).

---

## 7. 구현 우선순위

| 우선순위 | 항목 | 이유 |
|---|---|---|
| P0 | 5장 — 타임라인 등장 애니메이션(15개 전체) | 비용 최저, 효과 즉시 — "정지된 화면" 인상을 가장 빠르게 없앤다 |
| P1 | `compound-interest`(money-tree), `inflation-balloon`(market), `diversification-basket`(etf-lab), `leverage-seesaw`(loan-counter) | 이 프로젝트의 핵심 금융 개념(복리·인플레이션·분산투자·레버리지)이자 숫자로 체감 효과가 가장 큰 4개 |
| P2 | `interest-simulator`(bank), `stock-price`(stock-street), `jar-ratio`(allowance-square), `arrow-flow`(ledger-house) | 나머지 수치형 개념 |
| P3 | 나머지 7개(income-race/tool-compare/seed-odds/gold-timeline/coin-track/bread-split/money-shape-timeline) | 비교·경험 중심 개념, 급하지 않음 |

P0~P1까지만 먼저 끝내도 사용자가 요청한 "애니메이션 + 인터랙티브"의 체감 효과 대부분을
얻을 수 있다. P2~P3는 이후 이터레이션으로 넘겨도 무방하다.

---

## 8. `AlmanacGrid`에 "인터랙티브 있음" 배지 추가

`components/almanac/AlmanacGrid.tsx`의 각 건물 카드에, 해당 건물의 `interactiveWidgetKey`가
있으면 카드 우상단에 작은 "✨" 배지를 추가한다(아직 위젯이 없는 건물과 시각적으로 구분되도록
— 순차적으로 P1→P2→P3 구현될 때마다 배지가 하나씩 늘어나는 자연스러운 흐름).

---

## 9. 성능/접근성 체크리스트

- 모든 위젯은 `useReducedMotion()`을 구독해 애니메이션 유무를 결정한다(값 조작 자체는 항상
  가능 — 결과가 즉시 나타나기만 하면 됨).
- 슬라이더는 표준 `<input type="range">`를 쓰고 `aria-label`을 채운다(커스텀 드래그 컴포넌트를
  새로 만들지 않는다 — 접근성과 구현 비용 모두에서 유리).
- 모든 상호작용 요소는 `min-h-touch min-w-touch`를 지킨다.
- PixiJS/캔버스를 쓰는 위젯(`diversification-basket`)은 반드시 `next/dynamic({ ssr: false })`로
  불러온다(`CLAUDE.md` 절대 규칙 3).
- 위젯 자체는 `store`에 새 상태를 추가하지 않는다(슬라이더 값은 컴포넌트 로컬 state로 충분 —
  저장할 필요 없는 탐색용 값이다).

---

## 10. 참고 자료

- 기존 코드: `components/splash/SplashScreen.tsx`(motion + `useReducedMotion` 패턴),
  `components/minigame/market/MarketPriceCanvas.tsx`(PixiStage 패턴),
  `components/minigame/loanCounter/LoanBalanceCanvas.tsx`·`tiltMath.ts`(시소 기울기 계산
  재사용 대상), `components/minigame/seedField/rouletteMath.ts`(확률 로직 재사용 대상)
- [Motion(구 Framer Motion) — `whileInView` 문서](https://motion.dev/docs/react-scroll-animations)
- [Motion — `useReducedMotion`/접근성 가이드](https://motion.dev/docs/react-accessibility)
