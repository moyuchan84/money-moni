# Task: 용어사전 확장 구현

> `docs/glossary-expansion.md`(스펙 + 18개 용어 확장 콘텐츠)를 실제 파일에 적용한다. Claude Code에 "이 문서의 T1부터 순서대로 진행해줘"라고 전달한다.

---

## T1. `data/glossary.ts` 스키마 확장

- [ ] `GlossaryEntry`에 `category`, `longDefinitionKo`, `metaphorKo`, `exampleKo`, `relatedBuildingId?`, `relatedTermIds?` 필드 추가(`docs/glossary-expansion.md` 3장 인터페이스 그대로)
- [ ] 기존 `definitionKo` 필드명을 `shortDefinitionKo`로 변경(값은 그대로 유지) — 이름을 바꾸는 이유는 이제 "짧은 정의"와 "긴 정의"가 공존하기 때문
- [ ] `docs/glossary-expansion.md` 4장의 18개 용어 확장 콘텐츠를 그대로 옮겨 각 항목에 채운다. `relatedBuildingId`는 `data/buildings.ts`의 `BuildingId` 타입을 재사용해 오타를 방지한다
- [ ] `GlossaryCategory` 타입 추가, 6개 카테고리(`money-basics`/`income-spending`/`saving-growth`/`capital-investment`/`debt`/`big-picture`)로 18개 용어를 분류

## T2. `app/glossary/page.tsx` 재구성

- [ ] 현재의 단일 `<dl>` 나열을 카테고리별 섹션 + 아코디언 카드로 교체
- [ ] 각 카드는 기본 접힘(`term` + `shortDefinitionKo` + 아이콘만 표시), 클릭/탭 시 펼쳐져 `longDefinitionKo` → `metaphorKo`(강조 스타일 카드) → `exampleKo` → 관련 링크 순으로 표시
- [ ] 아코디언은 버튼 요소(`<button aria-expanded>`)로 구현해 키보드/스크린리더 접근성을 지킨다
- [ ] `relatedTermIds`가 있으면 같은 화면 안에서 해당 용어로 스크롤 이동하거나 포커스하는 작은 칩 버튼으로 렌더링
- [ ] `relatedBuildingId`가 있으면 "🏠 게임에서 만나보기" 버튼으로 해당 건물 라우트(`/building/{id}` 또는 `/money-tree`)로 이동하는 링크 추가
- [ ] `docs/design-revision.md`/`docs/tasks/design-system-revision.md`가 먼저 적용되어 있다면 이 화면도 `AppShell`/`Button`/`ButtonRow`를 사용한다. 아직 적용 전이라면 기존 스타일 관례(`min-h-touch`, `rounded-control` 등)를 그대로 따르되 나중에 리비전 시 함께 정리되도록 클래스를 과도하게 새로 만들지 않는다

## T3. 도감(지식 도감) 연동 — 선택, 의존성 있음

- [ ] `docs/tasks/theory-deepdive.md`가 이미 구현되어 `/almanac/[id]` 라우트가 존재한다면, 해당 건물이 있는 용어 카드에 "🧠 역사 더 알아보기" 링크를 추가로 노출한다
- [ ] 아직 구현 전이라면 이 링크는 생략하고, 도감 기능이 나중에 추가될 때 함께 연결한다(하드코딩된 죽은 링크를 만들지 않는다)

## T4. 테스트

- [ ] 18개 용어 모두 아코디언이 펼쳐지고 접히는지 확인
- [ ] `relatedTermIds`/`relatedBuildingId` 링크가 실제로 존재하는 용어/건물 id만 가리키는지(오타로 인한 깨진 링크 없는지) 확인하는 간단한 유닛 테스트 추가(예: 모든 `relatedTermIds`가 `glossary` 배열의 `id` 중 하나인지 검증)
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과

## T5. 문서 동기화

- [ ] `CLAUDE.md`/`docs/phases.md`에 이번 확장을 반영할지 검토(선택 — 용어사전은 건물 모듈이 아니라 독립 참고 화면이라 필수는 아님)

---

## 완료 기준(Definition of Done)

- [ ] 18개 용어 모두 짧은 정의 + 확장 설명 + 비유 + 실생활 예시를 갖춘다
- [ ] 관련 있는 건물로 바로 이동하는 링크가 동작한다
- [ ] 화면이 카테고리별로 정리되어 있고, 아코디언으로 정보 과부하 없이 탐색 가능하다
- [ ] 기존 용어사전 진입 경로(`/glossary`, 마을 상단 내비게이션)는 그대로 유지된다
