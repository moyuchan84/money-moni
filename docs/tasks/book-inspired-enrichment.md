# Task: 어린이 경제 도서 7권 기반 콘텐츠 보강 구현

> `docs/book-inspired-enrichment.md`(리서치 + 실제 문안)를 실제 파일에 적용한다. Claude Code에
> "이 문서의 T1부터 순서대로 진행해줘"라고 전달한다.
>
> ⚠️ 이 태스크는 새 건물/새 라우트를 만들지 않는다. 기존 15개 건물(전부 구현 완료)과 용어사전
> (18개 용어, 카테고리 아코디언 UI 구현 완료)의 콘텐츠 레이어만 두껍게 만드는 작업이다. 시작 전
> `git status`로 로컬에 진행 중인 다른 변경이 없는지 먼저 확인한다.

---

## T1. 사실 재확인(선택이지만 권장)

- [ ] 도서관/서점 미리보기로 『하이파이브 금융교육』, 『끌어올려! 경제 지능』 시리즈의 실제 목차를
      한 번 더 확인 — `docs/book-inspired-enrichment.md` 1-6/1-7은 검색 제한으로 목차를 완전히
      확인하지 못한 상태다
- [ ] 존리 관련 도서의 정확한 서지정보(제목 하나로 확정)를 확인해 `data/recommendedBooks.ts`의
      `titleKo`를 실제 출간작 제목으로 교체

## T2. `data/glossary.ts` — 신규 용어 4개 추가

- [ ] `GlossaryId`에 `"tax" | "credit" | "cost-profit" | "value-spending"` 추가
- [ ] `docs/book-inspired-enrichment.md` 3장의 4개 항목(`tax`/`credit`/`cost-profit`/
      `value-spending`) 전체를 `glossary` 배열에 그대로 추가
- [ ] 기존 `spending` 항목의 `relatedTermIds`에 `"value-spending"` 추가
- [ ] 기존 `loan` 항목의 `relatedTermIds`에 `"credit"` 추가
- [ ] `GlossaryCategory`는 기존 6개(`money-basics`/`income-spending`/`saving-growth`/
      `capital-investment`/`debt`/`big-picture`)를 그대로 재사용 — 새 카테고리를 만들지 않는다
      (`tax`→`big-picture`, `credit`→`debt`, `cost-profit`/`value-spending`→`income-spending`)
- [ ] `app/glossary/page.tsx`는 `glossary` 배열과 `CATEGORY_ORDER`를 그대로 순회하는 구조라
      **코드 변경 없이** 새 용어 4개가 해당 카테고리 섹션에 자동으로 나타나는지 확인만 한다

## T3. `docs/concept-story.md` — 5개 건물에 확장 장면 추가

- [ ] `market`(7-7) 섹션 끝에 `docs/book-inspired-enrichment.md` 4-1의 원가/이윤/동업 장면과
      비유·예시 추가
- [ ] `job-center`(7-6) 섹션 끝에 4-2의 세금 장면 추가
- [ ] `allowance-square`(7-3) 섹션의 1번 대사 뒤에 4-3의 충동구매/가치소비 장면 끼워넣기
- [ ] `loan-counter`(7-14) 섹션의 2번 대사 뒤에 4-4의 신용 장면 끼워넣기
- [ ] `seed-field`(7-9) 섹션의 회고 뒤에 4-5의 조급해하지 않는 마음가짐 질문 추가
- [ ] 이 문서는 아직 코드로 배선되지 않은 콘텐츠 소스 문서이므로(현재 `StorySceneViewer`는
      `money-tree`에만 연결됨, T4 참고), 이번 태스크에서는 **문서 갱신까지만** 하고 실제
      `data/*Content.ts`로의 반영은 `docs/tasks/concept-story-layer.md`가 각 건물에 연결될 때
      함께 반영한다(중복 작업 방지를 위해 순서를 명확히 함)

## T4. 실제 코드에 반영 — 이미 스토리 씬이 연결된 건물만 우선

- [ ] `docs/tasks/concept-story-layer.md` 진행 상황을 먼저 확인한다. 만약 `market`/`job-center`/
      `allowance-square`/`loan-counter`/`seed-field` 중 이미 `data/*Content.ts`에 `storyScenes`가
      채워져 실제 화면에 쓰이고 있는 건물이 있다면, T3에서 갱신한 장면을 해당 데이터 파일에도
      그대로 반영한다
- [ ] 아직 스토리 씬이 코드에 연결되지 않은 건물이라면, 이번 태스크에서는 문서(T3)까지만 하고
      코드 반영은 건너뛴다(빈 자리를 만들지 않는다)

## T5. `data/recommendedBooks.ts` 신규 작성

- [ ] `docs/book-inspired-enrichment.md` 6-1의 스키마와 7개 항목 전체를 그대로 작성
- [ ] `RecommendedBook.relatedBuildingIds`는 `data/buildings.ts`의 `BuildingId` 타입을 재사용해
      오타를 방지한다(용어사전 T1이 이미 이 패턴을 쓰고 있으니 동일하게)

## T6. `components/reading/RecommendedBookCard.tsx` 신규 작성

- [ ] 책 아이콘(📚 이모지) + `titleKo`(굵게) + `authorKo`(작게) + `whyKo`(본문) 순서로 렌더링하는
      단순 카드
- [ ] 표지 이미지 없음 — 저작권 사유(`docs/book-inspired-enrichment.md` 8장 참고), 이미지 관련
      props를 아예 만들지 않는다
- [ ] `docs/design-revision.md`/`docs/tasks/design-system-revision.md`가 이미 적용된 화면
      (`app/glossary/page.tsx` 등)에서는 `rounded-card bg-surface shadow-card` 톤을 재사용

## T7. 노출 위치 3곳 연동

- [ ] `app/parent/page.tsx` 하단에 "이 앱과 함께 읽으면 좋은 책" 섹션 추가 —
      `recommendedBooks` 전체를 `RecommendedBookCard`로 나열
- [ ] `app/building/[id]/result/BuildingResultView.tsx`의 회고 프롬프트 아래, `building.id`와
      일치하는 `relatedBuildingIds`를 가진 책이 있으면 `RecommendedBookCard` 1개만 표시(없으면
      섹션 자체를 렌더링하지 않음 — 빈 카드/빈 제목 노출 금지)
- [ ] `app/glossary/page.tsx`의 아코디언 펼침 영역에서, 해당 용어의 `relatedBuildingId`에
      매핑된 추천 도서가 있으면 관련 건물 이동 버튼 옆에 "📚 함께 읽으면 좋은 책: {titleKo}" 한
      줄을 작게 추가(없으면 생략)

## T8. 미니게임 메커니즘 보강(선택, 낮은 우선순위 — 별도 이터레이션 권장)

- [ ] `components/minigame/market/MarketPriceGame.tsx`에 원가 대비 판매가 슬라이더 추가(정답
      판정 없이 반응 애니메이션만 분기)
- [ ] `components/minigame/jobCenter/JobCenterDayGame.tsx` 급여 지급 연출에 "세금 -10%" 표시 추가
- [ ] `components/minigame/allowanceSquare/AllowanceJarGame.tsx`에 충동구매 유혹 이벤트 카드 1회
      추가(참기/사기 모두 다른 결과 애니메이션만, 옳고 그름 판정 없음 — `CLAUDE.md` 절대 규칙 7
      준수)
- [ ] 이 항목들은 기존 통과 중인 미니게임 테스트에 영향을 줄 수 있으므로, 변경 후
      `npm run test`로 회귀 여부를 반드시 확인한다

## T9. 테스트 및 검증

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [ ] 용어사전에서 4개 신규 용어가 올바른 카테고리 섹션에 나타나고, 아코디언이 정상 동작하는지
      확인
- [ ] `relatedTermIds`/`relatedBuildingId`가 실제 존재하는 id만 가리키는지 검증하는 기존 테스트
      (있다면)가 신규 4개 용어에도 통과하는지 확인
- [ ] `/parent`, 그리고 추천 도서가 매핑된 건물 결과 화면(`market`/`job-center`/
      `allowance-square`/`loan-counter`/`stock-street`/`etf-lab`/`money-tree`)에서
      `RecommendedBookCard`가 올바르게 보이거나(매핑 있음) 아예 안 보이는지(매핑 없음) 확인

## T10. 문서 동기화

- [ ] `CLAUDE.md` 아키텍처 맵에 `data/recommendedBooks.ts`, `components/reading/
      RecommendedBookCard.tsx` 추가
- [ ] `docs/phases.md`에 이번 콘텐츠 보강 작업 완료 여부 반영(선택)

---

## 완료 기준(Definition of Done)

- [ ] 용어사전이 18개에서 22개 용어로 늘어나고, 4개 신규 용어 모두 짧은 정의·긴 설명·비유·예시를
      갖춘다
- [ ] `docs/concept-story.md`에 5개 건물의 확장 장면이 반영되어, 이후 concept-story-layer 작업이
      이 내용을 그대로 가져다 쓸 수 있다
- [ ] `/parent` 화면과 관련 건물 결과 화면, 용어사전에서 실제 책 제목과 저자를 볼 수 있고, 책
      내용을 그대로 베낀 부분이 없다(패러프레이즈만 사용)
- [ ] 새로 추가된 것 중 어느 것도 죽은 링크나 빈 자리를 만들지 않는다(매핑이 없으면 섹션 자체가
      안 보임)
- [ ] 기존 15개 건물 미니게임과 용어사전 아코디언은 회귀 없이 그대로 동작한다
