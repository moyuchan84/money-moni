# Task: 이론 심화 레이어("지식 도감") 구현

> `docs/theory-deepdive.md`(자료조사 + 설계)를 실제 코드에 적용하는 단계다. Claude Code에 "이 문서의 T1부터 순서대로 진행해줘"라고 전달한다. 이 작업은 `docs/tasks/concept-story-layer.md`, `docs/tasks/design-system-revision.md`와 독립적으로 진행 가능하지만, 가능하면 디자인 리비전(AppShell/Button 도입) 이후에 진행해 새 화면이 처음부터 새 레이아웃 규칙을 따르게 하는 것을 권장한다.

---

## T1. 콘텐츠 사실 검증

- [ ] `docs/theory-deepdive.md` 2장의 15개 모듈별 사실(연도, 인물명, 사건명)을 위키백과 등 원문으로 재확인한다 — 이 문서는 여러 출처를 교차 확인해 작성했지만 최종 확정 전 재검증을 권장한다고 명시되어 있다
- [ ] 특히 "아인슈타인의 복리 명언"처럼 출처가 불확실한 항목은 반드시 "~라고 알려져 있지만 확실하지 않다"는 문구를 유지한다

## T2. 이미지 자산 수집 — `public/images/almanac/{buildingId}/`

- [ ] `docs/theory-deepdive.md` 3-4의 검색 키워드로 위키미디어 커먼즈(commons.wikimedia.org)에서 각 모듈당 1~3장의 이미지를 찾는다
- [ ] 파일별 라이선스(PD/CC-BY/CC-BY-SA)와 저작자를 확인하고 다운로드해 `public/images/almanac/{buildingId}/{imageKey}.jpg`로 저장한다(핫링크 금지 — `docs/design-revision.md`의 정적 자산 원칙과 동일한 이유)
- [ ] 이미지가 지나치게 무겁지 않도록(수백 KB 이하) 리사이즈/압축한다
- [ ] 초상화(애덤 스미스, 칼 마르크스 등)는 지식카드 안의 작은 삽화로만 쓰고, 화면의 메인 비주얼은 기존 SVG 캐릭터 톤을 유지한다

## T3. 데이터 파일 생성 — `data/almanac/{buildingId}Almanac.ts` × 15

- [ ] `data/almanac/almanacTypes.ts`에 `docs/theory-deepdive.md` 4-2의 `AlmanacTimelineEvent`/`ImageCredit`/`BuildingAlmanac` 타입 정의
- [ ] 15개 모듈 각각에 대해 `theoryNoteKo`, `timeline`(연표), `credits`(이미지 출처)를 채운 콘텐츠 파일 작성 — `docs/theory-deepdive.md` 2장 내용을 아이 눈높이 문장으로 옮겨 쓴다(4-5 톤 가이드 참고)
- [ ] 3구역 7개 건물(`seed-field` 등)은 아직 게임 콘텐츠 자체가 없으므로(`docs/phases.md` Phase 5), 도감 콘텐츠도 해당 건물의 게임 콘텐츠 제작과 함께 채워도 된다 — 이 Task에서는 이미 콘텐츠가 있는 8개 건물(museum/ledger-house/allowance-square/bank/money-tree/job-center/market/capital-warehouse)을 우선한다

## T4. 크레딧 페이지 — `app/credits/page.tsx`(신규)

- [ ] 모든 `data/almanac/*.ts`의 `credits` 배열을 모아 보여주는 목록 페이지 구현(이미지 제목, 저작자, 라이선스, 원본 링크)
- [ ] 마을 상단 내비게이션(`data/townContent.ts`의 `townNav`)에 "고마운 자료들" 항목 추가, `app/town/page.tsx`의 `<nav>`에 링크 추가

## T5. 도감 허브 & 상세 화면

- [ ] `components/almanac/KnowledgeCard.tsx` 구현 — 연표를 시간순 리스트(또는 가로 스크롤)로 보여주고, 각 이벤트에 이미지가 있으면 함께 표시, 카드 하단에 `ImageCreditFooter` 배치
- [ ] `components/almanac/AlmanacGrid.tsx` 구현 — `components/town/DistrictLayer.tsx`의 그리드 패턴(T4 in `docs/tasks/design-system-revision.md` 참고)을 재사용해 완료한 건물만 해금된 카드로 보여주고 미완료 건물은 잠금 표시
- [ ] `app/almanac/page.tsx`(허브), `app/almanac/[id]/page.tsx`(상세) 라우트 구현. `store`의 `state.buildings[id].completedAt` 유무로 해금 판정(신규 상태 필드 불필요)

## T6. 진입 동선 연결

- [ ] `app/building/[id]/result/BuildingResultView.tsx`의 `<ReflectionPrompt />` 아래에 "🧠 더 깊이 알아보기" 버튼 추가 → `/almanac/[id]`로 이동(해당 건물에 아직 도감 콘텐츠가 없으면 버튼 자체를 숨긴다)
- [ ] 마을 지도 상단 내비게이션에 "도감" 링크 추가

## T7. 테스트/검증

- [ ] 미완료 건물의 도감 상세 페이지 직접 접근 시 잠금 안내가 뜨는지 확인
- [ ] 이미지 로드 실패(파일 누락) 시 레이아웃이 깨지지 않는지 확인(alt 텍스트, 고정 비율 컨테이너)
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과

## T8. 문서 동기화

- [ ] `CLAUDE.md` 아키텍처 맵에 `data/almanac/`, `components/almanac/`, `app/almanac/`, `app/credits/` 추가
- [ ] `docs/phases.md`에 이번 작업을 별도 항목으로 기록할지 검토(예: "Phase 3.5 · 지식 도감 레이어")

---

## 완료 기준(Definition of Done)

- [ ] 완료한 8개 건물 각각에서 결과 화면 → "더 깊이 알아보기" → 실제 연도·인물·사진이 담긴 지식카드로 이어진다
- [ ] 모든 위키미디어 이미지의 저작자 표시가 `/credits`에서 확인 가능하다
- [ ] 미완료 건물의 도감 콘텐츠는 잠겨 있고, 핵심 게임 루프(온보딩→마을→건물→미니게임→결과)는 이번 작업으로 변경되지 않는다
- [ ] 아인슈타인 복리 명언처럼 출처가 불확실한 내용에는 불확실성이 명시되어 있다
