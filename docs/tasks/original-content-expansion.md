# Task: 오리지널 콘텐츠로 전환 구현

> `docs/original-content-expansion.md`를 실제 파일에 적용한다. Claude Code에 "이 문서의
> T1부터 순서대로 진행해줘"라고 전달한다.
>
> ⚠️ 먼저 확인: `docs/tasks/book-inspired-enrichment.md`가 이미 부분적으로 진행 중이었다면,
> 그 문서의 **T5(추천도서 데이터)·T6(RecommendedBookCard 컴포넌트)·T7(3곳 노출 연동)은 중단하고
> 되돌린다**(아직 코드에 반영 전이라면 그냥 건너뛴다). T1~T4, T8~T10은 그대로 유지한다.

---

## T1. `docs/concept-story.md` 갱신 — 4개 보너스 에피소드를 완결판으로 교체

- [ ] `market`(7-7), `job-center`(7-6), `allowance-square`(7-3), `loan-counter`(7-14) 섹션
      끝에 붙어 있던 기존 2~3줄짜리 보너스 장면을(`book-inspired-enrichment.md` 4장 버전)
      `original-content-expansion.md` 2장의 온전한 버전(상황/컷별 대사/비유/실생활예시/게임연결/
      회고 전체)으로 교체
- [ ] 이미 `data/*Content.ts`에 반영된 건물이 있다면(먼저 `docs/tasks/concept-story-layer.md`
      진행 상황 확인) 해당 데이터 파일에도 같은 내용으로 갱신

## T2. `data/glossary.ts` — 신규 용어 4개 (변경 없음, 이미 진행 중이면 그대로 유지)

- [ ] `docs/tasks/book-inspired-enrichment.md` T2가 아직 안 되어 있다면 지금 진행(신규 용어
      `tax`/`credit`/`cost-profit`/`value-spending` — 내용은 그대로, 저작권 이슈 없음)

## T3. "먼저 심은 다람쥐 할아버지" 캐릭터 신설

- [ ] `components/rive/SquirrelGrandpaCharacter.tsx` 신규 작성 — 기존
      `PiggyPetCharacter.tsx`/`VillageChiefCharacter.tsx` 패턴을 참고. Rive 자산이 아직
      없다면 우선 🐿️ 이모지 + 간단한 SVG로 대체하고, 나중에 Rive 자산이 준비되면 교체 가능하게
      `mood` prop 등 기존 캐릭터 컴포넌트와 동일한 인터페이스를 맞춘다
- [ ] `docs/concept-story.md`의 `money-tree`(7-5) 섹션 끝에 `original-content-expansion.md`
      3-1의 5~8번 컷 추가
- [ ] `stock-street`/`etf-lab`의 스토리 씬 또는 결과 화면에 3-2의 짧은 카메오 대사 추가
- [ ] 이미 `money-tree` 페이지가 `StorySceneViewer`로 스토리 씬을 실제로 렌더링하고 있으므로
      (`app/money-tree/page.tsx` 확인됨), `data/moneyTreeContent.ts`의 `storyScenes` 배열
      끝에 다람쥐 할아버지 컷을 실제로 추가해 바로 화면에 반영한다 — 이건 문서 갱신에서 그치지
      않고 코드까지 반영하는 유일한 항목(다른 항목은 아직 스토리 씬이 코드에 안 붙어 있어
      문서까지만 진행)

## T4. "쉬운말 방울새" 코너 신설

- [ ] `data/newsSimplifier.ts` 신규 작성 — `{ id, hardKo, easyKo }[]`, `original-content-
      expansion.md` 4-1의 6개 문안 그대로
- [ ] `components/parent/NewsSimplifierCard.tsx`(또는 적절한 위치) 신규 작성 — 어려운 말/쉬운
      말을 나란히 보여주는 단순 카드, 방문 시 배열에서 하나를 순환 노출(랜덤 또는 순차 — 상태
      저장 없이 `Math.random()` 또는 날짜 기반 인덱스로 충분, 스토어에 새 필드를 추가하지 않는다)
- [ ] `app/parent/page.tsx` 하단에 "오늘의 쉬운말 방울새" 섹션으로 추가
- [ ] `app/glossary/page.tsx`의 `big-picture` 카테고리 섹션 상단에 짧은 소개 + 예시 1개 추가
      (선택, 화면이 너무 길어지지 않는지 확인하며 진행)

## T5. `docs/book-inspired-enrichment.md` T5~T7 정리

- [ ] `docs/book-inspired-enrichment.md` 5장·6장 내용에 "→ `docs/original-content-
      expansion.md`로 대체됨, 진행하지 않음" 메모를 남긴다(문서 삭제는 하지 않음 — 리서치
      기록 자체는 남겨둘 가치가 있음)
- [ ] `docs/tasks/book-inspired-enrichment.md`의 T5·T6·T7 체크박스 앞에 동일한 메모를 남긴다
- [ ] 혹시 `data/recommendedBooks.ts`나 `RecommendedBookCard.tsx`가 이미 일부 코드로
      작성되어 있다면 삭제하고, 대신 T3·T4의 신규 파일로 교체되었는지 확인

## T6. 테스트 및 검증

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [ ] `/money-tree`에서 다람쥐 할아버지 컷이 실제로 스토리 씬에 나타나는지 확인
- [ ] `/parent`, `/glossary`에서 쉬운말 방울새 카드가 보이고, 어려운 말/쉬운 말이 둘 다 읽기
      쉬운 문장인지(word-break:keep-all 적용 여부 포함) 확인
- [ ] 앱 어디에도 실제 책 제목·저자·표지 이미지가 남아있지 않은지 전체 검색(`grep -r "존리\|
      이진우\|레모네이드 전쟁\|세금 내는 아이들\|하이파이브\|경제 지능"`)으로 확인

## T7. 문서 동기화

- [ ] `CLAUDE.md` 아키텍처 맵에 `components/rive/SquirrelGrandpaCharacter.tsx`,
      `data/newsSimplifier.ts`, `components/parent/NewsSimplifierCard.tsx` 추가

---

## 완료 기준(Definition of Done)

- [ ] 앱 안 어디에도 실제 도서 제목/저자/인용문이 없다 — 모든 콘텐츠가 머니타운 오리지널
      캐릭터와 대사로만 구성된다
- [ ] 4개 신규 용어(세금/신용/원가·이윤/가치소비)가 온전한 미니 스토리씬과 함께 관련 건물에
      자연스럽게 붙어 있다
- [ ] "먼저 심은 다람쥐 할아버지"가 `money-tree` 스토리 씬에 실제로 등장한다
- [ ] "쉬운말 방울새" 코너가 `/parent`(그리고 선택적으로 `/glossary`)에서 실제로 보인다
- [ ] 기존 15개 건물·용어사전·스토리 씬은 회귀 없이 그대로 동작한다
