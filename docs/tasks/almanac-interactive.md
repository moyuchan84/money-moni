# Task: 지식 도감 애니메이션·인터랙티브 강화 구현

> `docs/almanac-interactive.md`를 실제 파일에 적용한다. Claude Code에 "이 문서의 T1부터
> 순서대로 진행해줘"라고 전달한다. 분량이 많으므로 **T1~T3(P0~P1)까지만 먼저 진행하고, T4
> 이후는 별도 세션으로 이어가도 무방하다**고 명시해서 전달하는 걸 권장한다.
>
> ⚠️ 시작 전 확인: `/almanac`, `/almanac/[id]`, `KnowledgeCard.tsx`, 15개 건물의
> `data/almanac/*.ts`는 이미 전부 구현되어 있다(`docs/tasks/theory-deepdive.md` 완료 상태).
> 이 태스크는 그 위에 애니메이션/인터랙티브만 추가한다 — 데이터 스키마의 기존 필드나 라우트
> 구조를 바꾸지 않는다.

---

## T1. (P0) 타임라인 등장 애니메이션 — 15개 건물 공통

- [x] `hooks/useReducedMotion.ts`(이미 존재)를 `components/almanac/KnowledgeCard.tsx`에서
      구독
- [x] `timeline.map()`이 렌더링하는 `<li>`를 `motion.li`로 바꾸고, `docs/almanac-interactive.md`
      5장의 `whileInView` + stagger(`delay: index * 0.05`) 애니메이션 적용
- [x] `reducedMotion`이 true면 `initial`을 `{ opacity: 1 }`로 바꿔 애니메이션 없이 즉시 표시
- [x] 이미지가 있는 카드는 이미지에 살짝 확대(`scale: 0.95 → 1`) 효과 추가
- [x] 15개 건물 전부(museum/ledger-house/allowance-square/bank/money-tree/job-center/
      market/capital-warehouse/seed-field/stock-street/etf-lab/gold-vault/coin-station/
      loan-counter/triple-village) `/almanac/[id]`에서 스크롤하며 확인
      — `motion.li`는 모든 건물이 같은 `KnowledgeCard`를 쓰므로 15개 전부 자동 적용됨. 4개
      건물(money-tree/market/etf-lab/loan-counter)은 브라우저로 직접 확인, 나머지는 build 성공
      + 공통 컴포넌트 재사용으로 확인을 갈음.

## T2. `data/almanac/almanacTypes.ts` 스키마 확장

- [x] `AlmanacWidgetKey` 유니언 타입 추가(`docs/almanac-interactive.md` 3장 15개 값 그대로)
- [x] `BuildingAlmanac`에 `interactiveWidgetKey?: AlmanacWidgetKey` 선택 필드 추가
- [x] `components/almanac/interactive/AlmanacWidgetSlot.tsx` 신규 작성 — `widgetKey`를 받아
      해당 위젯 컴포넌트를 렌더링하는 레지스트리(스위치문 또는 매핑 객체), 키가 없으면
      `null` 반환
- [x] `components/almanac/KnowledgeCard.tsx`에 "✨ 직접 만져보며 이해하기" 섹션 삽입(4장
      의사 코드 그대로) — `interactiveWidgetKey`가 없는 건물은 이 섹션 자체가 안 보여야 함
- [x] `data/almanacContent.ts`에 `interactiveHeadingKo: "직접 만져보며 이해하기"` 카피 추가

## T3. (P1) 핵심 위젯 4개 구현

- [x] `data/almanac/moneyTreeAlmanac.ts`에 `interactiveWidgetKey: "compound-interest"` 추가,
      `components/almanac/interactive/CompoundInterestExplorer.tsx` 작성
      (`docs/almanac-interactive.md` 6-1)
- [x] `data/almanac/marketAlmanac.ts`에 `interactiveWidgetKey: "inflation-balloon"` 추가,
      `InflationBalloonExplorer.tsx` 작성(6-3)
- [x] `data/almanac/etfLabAlmanac.ts`에 `interactiveWidgetKey: "diversification-basket"` 추가,
      `DiversificationBasketExplorer.tsx` 작성 — `PixiStage` 기반, `next/dynamic({ ssr: false })`로
      로드(6-8)
- [x] `data/almanac/loanCounterAlmanac.ts`에 `interactiveWidgetKey: "leverage-seesaw"` 추가,
      `LeverageSeesawExplorer.tsx` 작성 — 기존 `components/minigame/loanCounter/tiltMath.ts`의
      `isTipped` 판정 로직 재사용(6-11). 브라우저 확인 중 `MAX_ANGLE_DEG`가
      `tipThresholdDeg`(25도)보다 낮아 경고 상태가 절대 트리거되지 않는 버그를 발견해 30도로
      수정.
- [x] `components/almanac/AlmanacGrid.tsx`의 건물 카드에 `interactiveWidgetKey`가 있으면
      우상단에 "✨" 배지 추가(8장)

## T4. (P2) 나머지 수치형 위젯 4개 — 별도 세션 권장

- [x] `interest-simulator`(bank) — `InterestSimulatorExplorer.tsx`(6-2). 처음 1000원을 매달
      1% 복리로 불리는 단순 모델 + 개월 수만큼 동전이 stagger로 쌓이는 연출. 브라우저 확인
      (6달 → 1,062원) 완료.
- [x] `stock-price`(stock-street) — `StockPriceExplorer.tsx`(6-7). SVG path 보간 대신
      StockStreetGame.tsx가 이미 쓰는 "케이크 emoji를 motion scale로 키우는" 패턴을 그대로
      재사용(원칙 4 — 굳이 새 기법 도입 안 함). 브라우저 확인(인기도 50% → 조각 35%) 완료.
- [x] `jar-ratio`(allowance-square) — `JarRatioExplorer.tsx`(6-13). `allowanceSquareContent.jars`
      데이터 재사용, 슬라이더 4개가 합 100%를 유지하도록 재분배하는 순수 함수(`redistribute`)
      작성. 브라우저로 극단값(100/0/0/0)과 전부-0 동률 분배(30/23/23/23) 두 경로 모두 확인.
- [x] `arrow-flow`(ledger-house) — `ArrowFlowExplorer.tsx`(6-12). 브라우저 확인(수입 2회 →
      1,000원, 돼지 scale 커짐) 완료. 콘솔 에러 없음.

## T5. (P3) 비교·경험형 위젯 7개 — 별도 세션 권장

- [x] `income-race`(job-center) — 6-4. `jobCenterContent.characters` 재사용, 캐릭터별
      `window.setTimeout` 체인으로 steady/jagged/one-jump 세 패턴 구현. 브라우저 확인
      (일꾼10·사장님14·농장주12, 각 캐릭터 `eveningEarningsCoins`와 정확히 일치) 완료.
- [x] `tool-compare`(capital-warehouse) — 6-5. 브라우저 확인(5개 vs 20개, stagger 등장) 완료.
- [x] `seed-odds`(seed-field) — 기존 `rouletteMath.pickWeightedOutcome` 재사용, 6-6. 브라우저
      확인(5회 연속 탭 → 5개의 서로 다른 결과 누적) 완료.
- [x] `gold-timeline`(gold-vault) — 6-9. 브라우저 확인(슬라이더 끝 → "지금" 라벨 전환) 완료.
- [x] `coin-track`(coin-station) — 6-10. **버그 발견 및 수정**: 처음에 `onAnimationComplete`
      콜백으로 "출렁인 정도" 비교 막대를 드러냈는데, 자동화 브라우저 탭에서 `requestAnimationFrame`이
      극심하게 스로틀링되는 걸 확인(10프레임에 22초) — 이 환경에서는 onAnimationComplete가
      사실상 발화하지 않았다. `window.setTimeout` 기반으로 교체해 다른 위젯들과 동일한
      패턴으로 맞추고 나서 정상 동작 확인(클릭 → 3초 뒤 비교 막대 노출).
- [x] `bread-split`(triple-village) — 정답 판정 없음 유지, 6-14. `tripleVillageContent.villages`
      재사용. 브라우저 확인(사회주의 선택 → "10개를 셋이 나눠 3개씩", 빵 3개 표시) 완료.
- [x] `money-shape-timeline`(museum) — 미니게임의 `MuseumTimelineGame.tsx`와 별개로 새로
      작성(재사용 금지, 6-15). `museumContent.eras` 데이터 재사용. 브라우저 확인(슬라이더 3 →
      "카드 시대 — 카드") 완료.

## T6. 테스트 및 검증

- [x] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [x] `npm run build`(정적 export)로 15개 `/almanac/[id]` 라우트가 모두 정상 prerender되는지 확인
- [x] 브라우저(claude-in-chrome)로 T3의 4개 위젯을 실제로 조작해 확인 — 복리(72÷rate 계산),
      인플레이션(풍선 축소·아이스크림 개수), 분산투자(Pixi 바구니, 콘솔 에러 없음),
      레버리지(저울 기울기+경고 상태)까지 실제 값 변화 확인
- [x] 모든 슬라이더가 키보드(방향키/End)만으로 조작 가능한지 확인 — money-tree/loan-counter/
      market 위젯에서 클릭 후 방향키·End로 값 변경 확인
- [x] `DiversificationBasketExplorer.tsx`가 서버 사이드 렌더링 에러 없이 `next build`를
      통과하는지 확인(`ssr: false` 누락 시 정적 export 빌드가 깨질 수 있음)
- [x] `/parent`에서 "움직임 줄이기"를 켠 상태로 money-tree 위젯 재확인 — 눈덩이가 여러 초짜리
      애니메이션 없이 최종 위치·크기로 바로 표시됨을 확인
- [x] 375px 뷰포트에서 15개 건물 위젯 전부 확인(iframe으로 실제 375px 렌더링 재현 — 브라우저
      자동화 세션의 `resize_window`가 이 환경에서는 실제 뷰포트에 반영되지 않아, 페이지 안에
      `width:375px` iframe을 주입해 그 안에서 각 건물을 로드하는 방식으로 우회). 슬라이더
      라벨·3열 그리드 캐릭터 라벨·하단 내비 6개는 375px에서도 한 줄 유지. `한 종류만 흔들기`/
      `여러 종류 흔들기`(etf-lab), `들어온 돈 +500원`/`나간 돈 −300원`(ledger-house) 버튼은
      2줄로 감싸지지만 `word-break: keep-all` 덕분에 어절 단위로 깔끔하게 줄바꿈되어 문제
      없음. 음절 단위로 잘리는 라벨은 없었다.

## T7. 문서 동기화

- [x] `CLAUDE.md` 아키텍처 맵에 `components/almanac/interactive/` 추가
- [x] `docs/theory-deepdive.md`에 "인터랙티브 위젯은 `docs/almanac-interactive.md` 참고"
      한 줄 추가(상호 참조)

---

## 완료 기준(Definition of Done)

- [x] 15개 건물 전부의 도감 타임라인이 스크롤 시 애니메이션으로 등장한다(P0)
- [x] 복리·인플레이션·분산투자·레버리지 4개 핵심 개념은 슬라이더/탭으로 직접 조작하며 결과를
      확인할 수 있는 인터랙티브 위젯을 갖는다(P1)
- [x] 어떤 위젯도 승패·점수·타이머가 없다 — 순수 탐색형 도구로 유지된다
- [x] `reducedMotion` 설정을 켜면 모든 위젯에서 애니메이션이 사라지고 조작 기능만 남는다
- [x] 기존 미니게임·용어사전·스토리 씬은 회귀 없이 그대로 동작한다(`npm run test` 50개 전체 통과)
- [x] P2·P3까지 포함해 15개 건물 전부가 `interactiveWidgetKey`를 갖는다(당초 계획보다 확장 완료)

**교훈**: `onAnimationComplete` 콜백으로 후속 상태를 트리거하는 패턴은 피한다 — 자동화 브라우저
환경처럼 `requestAnimationFrame`이 스로틀링되는 상황에서 콜백이 사실상 발화하지 않을 수 있다
(coin-track 위젯에서 실제로 겪음). 애니메이션 종료 후 무언가를 보여줘야 한다면 `window.setTimeout`
기반으로 구현하는 쪽이 이 프로젝트의 다른 위젯들과도 일관되고 더 안전하다.
