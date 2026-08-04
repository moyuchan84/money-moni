# Task: 투자 마인드 & 포트폴리오·경제 사계절 구현

> `docs/investment-mindset-and-cycles.md`를 실제 파일에 적용한다. Claude Code에 "이 문서의
> T1부터 순서대로 진행해줘"라고 전달한다.
>
> ⚠️ **가장 먼저**: `docs/investment-mindset-and-cycles.md` 1장(콘텐츠 안전 원칙)을 정독하고
> 시작한다. 이 태스크의 어떤 카피에도 "지금 이걸 사라/팔라"는 식의 문장이 들어가면 안 되고,
> 경제 계절 위젯 화면에는 "다음 계절은 미리 알 수 없다"는 문구가 항상 함께 있어야 한다.
> 새 건물/새 라우트는 만들지 않는다.

---

## T1. `data/glossary.ts` — 신규 용어 5종 추가

- [ ] `GlossaryId`에 `"investor-mindset" | "portfolio" | "real-estate" | "commodity" |
      "economic-seasons"` 추가
- [ ] `docs/investment-mindset-and-cycles.md` 3장의 5개 항목 전체를 `glossary` 배열에 추가
- [ ] 기존 `stock` 항목의 `relatedTermIds`에 `"investor-mindset"`, `capital` 항목에
      `"real-estate"`, `gold` 항목에 `"commodity"` 추가
- [ ] 기존 6개 카테고리 그대로 사용(새 카테고리 만들지 않음) — `investor-mindset`/
      `portfolio`→`capital-investment`, `real-estate`/`commodity`→`capital-investment`,
      `economic-seasons`→`big-picture`

## T2. `docs/concept-story.md` — 보너스 장면 3개 추가

- [ ] `seed-field`(7-9) 섹션 끝에 4-1(여유자금 원칙) 추가
- [ ] `stock-street`(7-10) 섹션 끝에 4-2(저점매수·고점매도 & 급등 테마 경계) 추가
- [ ] `capital-warehouse`(7-8) 섹션 끝에 4-3(부동산, 신규 캐릭터 "건물지기 아주머니") 추가
- [ ] 이미 해당 건물의 `data/*Content.ts`에 `storyScenes`가 실제로 연결되어 있다면(먼저
      `docs/tasks/concept-story-layer.md`/`docs/tasks/original-content-expansion.md` 진행
      상황 확인) 데이터 파일에도 반영, 아직이면 문서 갱신까지만

## T3. `etf-lab` "포트폴리오 실험실" 확장

- [ ] `components/rive/SeasonalFarmerCharacter.tsx` 신규 작성 —
      `components/rive/SquirrelGrandpaCharacter.tsx` 패턴 재사용(Rive 자산 없으면 이모지
      🌾 + SVG로 우선 대체)
- [ ] `docs/concept-story.md`의 `etf-lab`(7-11) 섹션 끝에 5-1(사계절 농부 확장 스토리) 추가
- [ ] `data/etfLabContent.ts`에 스토리 씬이 이미 연결되어 있다면 실제 데이터에도 반영
- [ ] 기존 `components/minigame/etfLab/EtfBasketGame.tsx`는 변경하지 않는다(게임 연결
      대사만 "회사뿐 아니라 다른 자산도"로 자연스럽게 이어지도록 문구만 확인)

## T4. `EconomicSeasonsWheel.tsx` 인터랙티브 위젯

- [ ] `docs/tasks/almanac-interactive.md`의 T2(스키마 확장)가 이미 진행되어 있는지 먼저
      확인 — `AlmanacWidgetKey`/`AlmanacWidgetSlot.tsx`/`interactiveHeadingKo`가 없다면
      이 태스크보다 `docs/tasks/almanac-interactive.md` T2를 먼저 진행한다
- [ ] `AlmanacWidgetKey`에 `"economic-seasons-wheel"` 추가
- [ ] `components/almanac/interactive/EconomicSeasonsWheel.tsx` 신규 작성 —
      `docs/investment-mindset-and-cycles.md` 6-2/6-3 그대로: 계절 버튼 4개, 자산 아이콘
      5개(📈🏠🪙🌾💰) 반응 애니메이션, 화면 하단 고정 안내 문구("다음 계절이 뭐가 될진
      아무도 미리 알 수 없어요…") 반드시 포함
- [ ] `data/almanac/etfLabAlmanac.ts`에 `interactiveWidgetKey: "economic-seasons-wheel"` 추가
- [ ] `AlmanacWidgetSlot.tsx`의 레지스트리에 새 위젯 등록
- [ ] `useReducedMotion()` 구독 — 켜져 있으면 애니메이션 없이 최종 상태만 즉시 표시(계절
      선택 자체는 항상 가능)

## T5. 안전 문구 배치

- [ ] `app/parent/page.tsx`에 "이 앱은 실제 투자 조언이 아니라, 투자의 기본 개념과 마음가짐을
      다루는 교육용 콘텐츠입니다"를 `parentContent.ts`에 새 필드로 추가해 노출
- [ ] `EconomicSeasonsWheel.tsx` 화면에 6-2의 고정 안내 문구가 항상(계절 선택 여부와 무관하게)
      보이는지 재확인

## T6. 테스트 및 검증

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [ ] 신규 용어 5개가 용어사전 올바른 카테고리에 나타나는지 확인
- [ ] `relatedTermIds`/`relatedBuildingId` 유효성 테스트(있다면)가 신규 용어에도 통과하는지
      확인
- [ ] `EconomicSeasonsWheel.tsx`를 4계절 전부 탭해보고, 각 계절마다 다른 자산이 반응하는지,
      안내 문구가 항상 보이는지 확인
- [ ] 앱 전체에서 "지금 사세요/파세요" 류의 단정적 문장이 없는지 전체 검색으로 확인
      (`grep -rn "사세요\|파세요\|매수하세요\|매도하세요"`)

## T7. 문서 동기화

- [ ] `CLAUDE.md` 아키텍처 맵에 `components/rive/SeasonalFarmerCharacter.tsx`,
      `components/almanac/interactive/EconomicSeasonsWheel.tsx` 추가
- [ ] `docs/almanac-interactive.md`의 `AlmanacWidgetKey` 목록에 `economic-seasons-wheel`을
      역참조로 추가(상호 참조)

---

## 완료 기준(Definition of Done)

- [ ] 투자자의 마음가짐(저점매수·고점매도, 급등 테마 경계, 여유자금, 인내심), 포트폴리오,
      부동산, 원자재, 경제 계절 — 5개 개념이 용어사전에 온전히 추가된다
- [ ] `seed-field`/`stock-street`/`capital-warehouse`/`etf-lab` 스토리에 관련 장면이
      자연스럽게 이어붙는다
- [ ] `etf-lab` 지식 도감에 "경제 사계절 바퀴" 인터랙티브 위젯이 있고, 어떤 계절을 눌러도
      "다음 계절은 미리 알 수 없다"는 문구가 항상 함께 보인다
- [ ] 앱 어디에도 특정 시점에 특정 자산을 사거나 팔라는 단정적 조언이 없다
- [ ] 기존 15개 건물·용어사전·지식 도감은 회귀 없이 그대로 동작한다
