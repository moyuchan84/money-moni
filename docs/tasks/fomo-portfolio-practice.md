# Task: FOMO 대응 & 포트폴리오 실전 연습 게임화

> `docs/fomo-portfolio-practice.md`를 실제 파일에 적용한다. Claude Code에 "이 문서의 T1부터
> 순서대로 진행해줘"라고 전달한다.
>
> ⚠️ **가장 먼저**: `docs/investment-mindset-and-cycles.md` 1장(콘텐츠 안전 원칙)과
> `docs/fomo-portfolio-practice.md` 2장(원칙 5)을 정독하고 시작한다. 이벤트/버튼 카피에
> "지금 사세요/파세요"류 단정문이 없어야 하고, 두 게임 모두 실시간 시세를 흉내내면 안 된다.
> 새 건물/새 라우트는 만들지 않는다. 기존 `StockStreetGame.tsx`/`EtfBasketGame.tsx`의 기존
> 단계(투표, 과자 바구니)는 삭제하지 않고 그 다음 단계로 이어 붙인다.

---

## T1. 계절-자산 반응 테이블 공유 모듈로 승격

- [ ] `data/almanac/economicSeasons.ts` 신규 생성 — `EconomicSeasonsWheel.tsx`의 `Season`/
      `ReactionLevel`/`AssetId`/`SEASONS`/`ASSETS`/`SEASON_REACTIONS`/`REACTION_LABEL`을 그대로
      이 파일로 이동
- [ ] `REACTION_MULTIPLIER: Record<ReactionLevel, number>`(`{ grow: 1.3, steady: 1.0, wilt: 0.8 }`)
      신규 필드 추가(게임 채점용)
- [ ] `EconomicSeasonsWheel.tsx`는 이 파일에서 import하도록 수정, 화면 동작·안내 문구는 변경 없이
      그대로 유지(회귀 없어야 함)

## T2. StockStreetGame — "흔들리지 않는 마음" 모드

- [ ] `data/stockStreetContent.ts`에 `PriceEvent` 인터페이스 추가(`docs/fomo-portfolio-practice.md`
      3-3 그대로), `ideas` 중 최소 1~2개에 `events?: PriceEvent[]` 데이터 채우기(hype 1개, scare 1개
      이상)
- [ ] `components/minigame/stockStreet/disciplineMath.ts` 신규 작성 — `computeDisciplinedResult`,
      `computeChasedResult` 순수 함수(3-4 시그니처 참고), `loan-counter/tiltMath.ts`와 같은
      "부수효과 없는 순수 함수 파일" 패턴 유지
- [ ] `StockStreetGame.tsx`의 `Phase`에 `"chart"`(기존 `"reveal"` 대체·확장) 유지하고 이벤트 발생
      시 hype/scare 카드 + "지금 살래요/팔래요" · "지켜볼래요" 버튼 노출
- [ ] `Phase = "summary"` 신규 추가 — `ComparisonBarChart`로 "버틴 나" vs "휩쓸렸다면" 최종 결과 비교
      (`disciplineMath.ts`의 두 함수 결과 사용)
- [ ] 지난 날짜들의 가격을 작은 막대/점으로 남겨 트렌드가 보이게 하는 UI 추가(순수 `motion.div`,
      Pixi 사용하지 않음 — 기존 stock-street는 Pixi 없는 카테고리)
- [ ] `useReducedMotion()`이 켜져 있으면 막대/점 애니메이션 없이 최종 상태만 즉시 표시
- [ ] 기존 `handleFinish`/`onComplete(score)` 흐름 유지(score 계산식은 그대로 두거나, 실제 플레이어
      선택을 반영하도록 자연스럽게 확장 — 이번 태스크의 필수 요구사항은 아님)

## T3. EtfBasketGame — "나만의 포트폴리오 농장" 모드

- [ ] `data/etfLabContent.ts`에 `portfolioRoundContent` 객체 추가(3-4 예시 그대로: `totalSeeds`,
      `roundCount`, `concentratedPresetAssetId`, `introMessageKo`, `recapLineKo`)
- [ ] `EtfBasketGame.tsx`의 기존 "과자 바구니 → 비교" 단계는 그대로 두고, 완료 후 이어지는 신규
      2단계 화면(또는 신규 컴포넌트로 분리해 `EtfBasketGame.tsx`에서 순차 렌더 — 구현 편한 쪽 선택)
      추가:
  - [ ] `T1`에서 만든 `data/almanac/economicSeasons.ts`의 `ASSETS` 5개 아이콘으로 씨앗 코인
        배분 UI(+/- 버튼 또는 `@dnd-kit` 드래그, 아이 눈높이에 더 쉬운 쪽으로 구현)
  - [ ] "계절 뽑기" 버튼 → `SEASONS`에서 무작위 1개 선택(플레이어에게 사전 노출 금지)
  - [ ] `SEASON_REACTIONS` + `REACTION_MULTIPLIER`로 라운드 결과 계산, `roundCount`만큼 반복
  - [ ] 라운드별 결과를 작은 막대/이모지로 누적 표시
  - [ ] 마지막에 `ComparisonBarChart`로 "내 배분" vs "몰빵 프리셋" 최종 누적 결과 비교
- [ ] `useReducedMotion()` 동일하게 게이팅

## T4. 결과 화면 연동 버그 보완

- [ ] `app/building/[id]/result/BuildingResultView.tsx`의 `REFLECTION_CONTENT` 맵에 `"stock-street"`
      (`stockStreetContent.reflection`), `"etf-lab"`(`etfLabContent.reflection`) 추가 — 현재 두
      건물이 빠져 있어 일반 문구로 대체되고 있음을 확인했음
- [ ] 위 수정이 다른 건물들의 기존 reflection 노출에 회귀를 일으키지 않는지 확인

## T5. 안전 카피 재검증

- [ ] hype/scare 이벤트 메시지, 버튼 라벨, summary 단계 문구 전체를 `docs/fomo-portfolio-practice.md`
      6장 체크리스트와 대조
- [ ] "휩쓸렸다면"/"몰빵 프리셋" 비교 시나리오가 매번 100% 지도록 설계되지 않았는지 데이터 확인
      (이벤트 배수/계절 반응표 상 가끔은 버텨도·분산해도 아쉬운 케이스가 존재해야 함)
- [ ] 앱 전체 재검색: `grep -rn "사세요\|파세요\|매수하세요\|매도하세요"` — 신규 카피 포함 0건 확인

## T6. 테스트 및 검증

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [ ] `disciplineMath.ts`에 대한 유닛 테스트 추가(순수 함수이므로 테스트 용이) — 최소 "버틴 경우"와
      "휩쓸린 경우" 각각 기대값대로 계산되는지
- [ ] `StockStreetGame`을 hype 이벤트가 있는 아이디어로 플레이 → 이벤트 카드/버튼 정상 노출,
      summary 단계에서 비교 차트 정상 표시 확인
- [ ] `EtfBasketGame`을 끝까지 플레이 → 4라운드 반복 후 비교 차트 정상 표시, 매 실행마다 계절이
      무작위로 다르게 나오는지(고정값 아님) 확인
- [ ] `EconomicSeasonsWheel.tsx`가 T1 리팩터링 이후에도 기존과 동일하게 동작하는지(회귀 없음) 확인
- [ ] `BuildingResultView`에서 stock-street/etf-lab 완료 후 각 건물 고유 reflection 문구가 뜨는지 확인

## T7. 문서 동기화

- [ ] `CLAUDE.md` 아키텍처 맵에 `data/almanac/economicSeasons.ts`,
      `components/minigame/stockStreet/disciplineMath.ts` 추가
- [ ] `docs/investment-mindset-and-cycles.md` 6장에 "이 반응 테이블은 이후
      `data/almanac/economicSeasons.ts`로 이동, `EconomicSeasonsWheel.tsx`와
      `EtfBasketGame.tsx` 포트폴리오 라운드가 함께 참조함"이라는 상호 참조 각주 추가

---

## 완료 기준(Definition of Done)

- [ ] `StockStreetGame`에 최소 1회의 hype 이벤트와 1회의 scare 이벤트가 있고, 각각 즉시
      반응했을 때와 지켜봤을 때의 결과가 summary 단계에서 비교된다
- [ ] `EtfBasketGame`에 5개 자산군(주식/부동산/금/원자재/현금) 배분 → 무작위 계절 반복 라운드 →
      분산 vs 몰빵 비교가 있다
- [ ] 두 게임 모두 도감의 `EconomicSeasonsWheel.tsx`와 같은 아이콘·반응 테이블을 공유해서 시각
      언어가 일관된다
- [ ] `BuildingResultView`에서 두 건물의 고유 reflection 문구가 정상 노출된다
- [ ] 앱 어디에도 특정 시점에 특정 자산을 사거나 팔라는 단정적 조언이 없고, 비교 시나리오가
      매번 같은 쪽이 이기도록 고정되어 있지 않다
- [ ] 기존 15개 건물·용어사전·지식 도감·기존 과자 바구니/신제품 투표 단계는 회귀 없이 그대로 동작한다
