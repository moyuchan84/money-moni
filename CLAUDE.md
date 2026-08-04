# moneymoni — CLAUDE.md

## 프로젝트 한 줄 요약

초등학교 1~3학년 대상 자본주의/금융 학습 정적 웹앱. "머니타운"(마을 키우기 RPG) 세계관 위에 15개 경제 개념 모듈을 배치한다. Next.js App Router, 서버 없는 완전 정적(`output: 'export'`) 사이트.

## 반드시 먼저 읽을 문서

작업을 시작하기 전에 아래 순서로 읽는다. 이 CLAUDE.md는 매 세션 자동으로 로드되므로 요약만 담고, 상세 내용은 아래 문서를 참조한다.

- `docs/idea.md` — 기획안: 세계관, 3구역 15개 모듈, 게임 루프 컨셉
- `docs/implementation.md` — 기술 리서치와 화면/모듈별 구현 상세(라이브러리 선정 근거, 라우팅, 상태 스키마)
- `docs/phases.md` — 개발 Phase별 범위, 종료 조건, 모듈 체크리스트. **작업을 시작하기 전 지금 어느 Phase인지, 무엇이 종료 조건인지 반드시 이 파일에서 확인한다.**
- `docs/concept-story.md` — 미니게임 전(후)에 이야기·비유·실생활 예시로 개념을 먼저 이해시키는 "개념 스토리 레이어" 요구사양과 15개 모듈 스토리 콘텐츠 초안. 건물 모듈을 만들 때 반드시 참조한다.

## 기술 스택 (요약 — 선정 근거는 `docs/implementation.md` 2장)

Next.js(App Router, `output: 'export'`) + TypeScript + Tailwind CSS · 상태 Zustand(`persist`) · UI 애니메이션 Motion · 캐릭터/SVG 정밀 연출 GSAP · 인터랙티브 캐릭터 Rive · 미니게임 캔버스 PixiJS(+물리는 Matter.js) · 구조화 드래그 dnd-kit · 사운드 Howler.js · 내레이션은 실시간 TTS 대신 사전 녹음 mp3 우선.

## 명령어

- 개발 서버: `npm run dev`
- 정적 빌드(`output:'export'`, `out/` 생성 확인): `npm run build`
- 린트: `npm run lint` (Next 16부터 `next lint`가 제거되어 ESLint CLI를 직접 호출한다)
- 타입체크: `npm run typecheck`
- 단위 테스트(Vitest, store 로직): `npm run test`
- E2E 테스트(Playwright, 온보딩→마을→건물→미니게임→보상 크리티컬 플로우): `npm run test:e2e` — 정적 export 산출물(`out/`)을 `serve`로 서빙해 검증한다.

**각 Phase를 완료로 표시하기 전 위 4개 명령어(`build`/`lint`/`typecheck`/`test`)가 모두 통과해야 한다. `test:e2e`는 Phase 0에서는 스모크 수준 1개만 두고, 실제 크리티컬 플로우 커버리지는 Phase 1부터 확장한다.**

## 아키텍처 맵

- `app/` — 라우트. 트리 구조는 `docs/implementation.md` 5장을 그대로 따른다(임의 변경 금지, 변경 시 그 문서도 함께 갱신).
- `data/` — 모든 한글 카피와 콘텐츠 메타(건물 정보, 퀘스트, 용어집). **컴포넌트에 한글 문자열을 직접 하드코딩하지 않는다** — 내레이션 mp3와 텍스트를 1:1로 관리해야 하기 때문이다. 건물별 개념 스토리 씬 데이터 타입은 `data/storyScene.ts`에 정의한다. `data/newsSimplifier.ts`는 "쉬운말 방울새"(어려운 경제 뉴스 문장 → 쉬운말 번역, 오리지널 캐릭터) 데이터를 담는다.
- `store/useGameStore.ts` — 단일 진행 상태 소스. 스키마는 `docs/implementation.md` 6장 기준. 필드를 추가할 때는 반드시 기본값을 지정하고, 저장 스키마에 `version` 필드를 두어 증가시키고 마이그레이션 함수를 작성한다.
- `components/` — `town/`, `hud/`, `dialogue/`, `minigame/`, `feedback/`, `layout/`, `ui/` 카테고리를 유지한다. 새 공통 UI가 필요하면 먼저 이 폴더에 이미 있는지 확인한 뒤 없을 때만 추가한다. 개념 스토리 씬 뷰어는 `components/dialogue/StorySceneViewer.tsx`로 공용화되어 있다. `components/layout/AppShell.tsx`는 고정폭 게임 캔버스 컨테이너로 `app/layout.tsx`에서 전역으로 한 번만 감싸므로 개별 페이지가 직접 폭 제약을 만들 필요는 없다. `components/ui/Button.tsx`/`ButtonRow.tsx`는 공용 버튼 컴포넌트다(디자인 근거: `docs/design-revision.md`). `components/parent/NewsSimplifierCard.tsx`는 `/parent`·`/glossary` 전용 "쉬운말 방울새" 카드다.
- `public/content/audio/` — 사전 녹음 내레이션 mp3. 파일명은 `{buildingId}-{sceneKey}.mp3` 규칙을 고정한다. **반드시 `public/` 밑에 둔다** — 정적 export는 `public/`만 사이트 루트로 서빙하므로, `content/`가 `public/` 밖에 있으면 브라우저에서 404가 난다. 코드에서 참조할 때는 항상 `/content/audio/...`처럼 슬래시로 시작하는 루트 상대 경로를 쓴다(슬래시 없이 쓰면 현재 라우트 기준 상대 경로로 잘못 풀린다).
- `public/content/rive/` — Rive 상태 머신 `.riv` 파일(촌장 NPC, 저금통 펫, 다람쥐 할아버지, 사계절 농부 등). 파일명은 `{character}.riv` 규칙을 고정한다(예: `village-chief.riv`, `piggy-pet.riv`, `squirrel-grandpa.riv`, `seasonal-farmer.riv`). 위와 같은 이유로 `public/` 밑에 두고 `/content/rive/...` 루트 상대 경로로 참조한다. 상태 머신 이름·input 이름은 `components/rive/` 프리셋 컴포넌트(`SeasonalFarmerCharacter.tsx` 등)에 하드코딩되어 있으므로 실제 `.riv` 제작 시 그 값(`ChiefState`/`PetState`/`SquirrelGrandpaState`/`SeasonalFarmerState`, input `mood`)에 맞춰야 한다.
- **절대 규칙 6 예외**: `money-tree`(복리, 아바타 개인 마당 위젯)는 건물이 아니라 개인 위젯이라 `/building/[id]` 3-라우트 구조를 따르지 않고 `/money-tree` 단일 라우트만 갖는다(`data/buildings.ts`의 `routeKind: 'standalone'`).
- `data/almanac/` — 지식 도감(이론 심화 레이어) 콘텐츠. `almanacTypes.ts`에 스키마, `{buildingId}Almanac.ts` 15개에 실제 역사·이론(연표·이미지 출처), `index.ts`가 `Record<BuildingId, BuildingAlmanac>`로 조립하고 잠금 판정 헬퍼(`isAlmanacUnlocked`)도 여기서 export한다. `components/almanac/`(`KnowledgeCard`/`AlmanacGrid`/`ImageCreditFooter`), `app/almanac/`(허브 + `[id]` 상세), `app/credits/`(이미지 저작자 표시 목록)가 이 데이터를 사용한다. 이미지 파일은 `public/images/almanac/{buildingId}/{imageKey}.jpg`에 위키미디어 커먼즈에서 라이선스를 확인해 다운로드해 두며, 크레딧은 `/credits`에서 확인할 수 있다. `BuildingAlmanac.interactiveWidgetKey`(선택 필드)가 있는 건물은 `KnowledgeCard`에 "직접 만져보며 이해하기" 섹션이 추가로 렌더링된다 — 상세 설계는 `docs/almanac-interactive.md` 참고.
- `components/almanac/interactive/` — 지식 도감 전용 인터랙티브 위젯(승패·점수 없이 슬라이더/탭으로 개념을 체감하는 탐색형 도구). `AlmanacWidgetSlot.tsx`가 `AlmanacWidgetKey` → 위젯 컴포넌트 레지스트리다(키가 아직 없으면 `null`). 모두 `useReducedMotion()`을 구독하고, PixiJS를 쓰는 위젯은 절대 규칙 3에 따라 `next/dynamic(..., { ssr: false })`로만 불러온다. `BuildingAlmanac.interactiveWidgetKey`는 건물 하나에 위젯이 여러 개면(`etf-lab`처럼) 배열도 받는다 — `KnowledgeCard.tsx`가 배열/단일 값을 모두 정규화해 순서대로 렌더링한다. `EconomicSeasonsWheel.tsx`(경제 사계절 바퀴, `etf-lab`)는 계절 선택과 무관하게 "다음 계절은 미리 알 수 없다"는 안내 문구를 항상 고정 노출한다(`docs/investment-mindset-and-cycles.md` 참고).

## 절대 규칙 (린터가 잡아주지 않는 것들)

1. 서버 API 라우트나 서버 전용 데이터 페칭을 추가하지 않는다 — 정적 export가 깨진다.
2. `localStorage`를 컴포넌트에서 직접 호출하지 않는다 — 항상 `useGameStore`를 통해서만 읽고 쓴다(하이드레이션 가드가 우회되면 SSR/CSR 불일치가 난다).
3. PixiJS·Rive·Matter.js는 `next/dynamic(..., { ssr: false })`로만 임포트한다 — 마을 지도/허브 화면의 초기 번들에 섞이면 안 된다.
4. 터치/클릭 가능한 요소는 Tailwind의 `min-h-touch`(최소 44px, 아동 기준 2cm 상당) 토큰을 사용하고 임의 px 값을 쓰지 않는다.
5. 이름(닉네임) 외의 개인식별정보를 수집하지 않고, 외부로 데이터를 전송하는 코드를 추가하지 않는다.
6. 신규 건물 모듈은 `/building/[id]`(개념 스토리 씬 뷰어 겸 진입 화면), `/building/[id]/minigame`, `/building/[id]/result`(recap 대사 포함) 3-라우트 구조를 따른다. 예외가 필요하면 이 문서에 사유를 기록한다.
7. 정치적으로 민감한 모듈("세 갈래 실험마을" — 자본주의/사회주의/공산주의)은 정답·우열 판정 로직을 추가하지 않는다. `<ReflectionPrompt />`로만 마무리한다.
8. 버튼은 `components/ui/Button`/`ButtonRow`를 통해서만 만든다 — `<button>`/`<Link>`에 `min-h-touch rounded-control ...` 조합을 페이지마다 직접 반복 작성하지 않는다. `NpcDialogue`/`ReflectionPrompt`처럼 이미 pill 모양 등 별도 스타일 계약을 가진 컴포넌트는 예외로 현재 스타일을 유지한다. 한글 텍스트가 버튼 안에서 음절 단위로 잘려 줄바꿈되지 않도록 `body`에 전역 `word-break: keep-all`이 걸려 있으므로, 새 텍스트 블록에 별도로 `break-keep`을 추가할 필요는 보통 없다.

## 신규 건물 모듈 추가 절차

1. `docs/implementation.md` 8장에서 해당 모듈의 설계(라이브러리, 인터랙션)를 확인한다.
2. `docs/concept-story.md` 7장에서 해당 모듈의 스토리 초안(상황/비유/실생활 예시/컷별 대사/게임 연결/회고)을 확인한다.
3. `data/buildings.ts`에 메타데이터를 추가한다(id, district, 잠금 조건, 보상 코인). 콘텐츠 파일(`data/{building}Content.ts`)에는 `data/storyScene.ts`의 `BuildingStoryContent` 타입에 맞춰 `storyScenes`, `metaphorLineKo`, `realExampleKo`, `bridgeLineKo`, `recapLineKo`를 추가한다.
4. `app/building/[id]/page.tsx`, `minigame/page.tsx`, `result/page.tsx`(recap 대사 + `<ReflectionPrompt />` 포함)를 생성한다.
5. `store`의 `buildings` 레코드에 `storySeen` 등 필요한 필드가 없으면 기본값과 함께 추가한다.
6. `public/content/audio/`에 내레이션 mp3 자리(제작 전이면 placeholder)를 추가한다.
7. `docs/phases.md`의 모듈 체크리스트에 완료 표시를 남긴다.

## 코드 스타일

- 컴포넌트 파일은 PascalCase, 훅은 camelCase(`use`로 시작), 라우트 폴더는 kebab-case.
- 드래그/캔버스/사운드처럼 브라우저 API에 의존하는 컴포넌트는 파일 최상단에 `'use client'`를 명시한다.
- GSAP 타임라인은 `useEffect` 내부에서 생성하고, cleanup에서 반드시 `revert()`로 해제한다(라우트 전환 시 메모리 누수 방지).
- 커밋 메시지는 `[phase-N] 짧은 설명` 형식을 권장한다(예: `[phase-2] ledger-house 미니게임 구현`).

## Phase 개요

Phase 0(기반 셋업) → Phase 1(게임 루프 뼈대) → Phase 2(1구역 완성 — 기술 파이프라인 검증) → Phase 3(공통 시스템 고도화: Rive/사운드) → Phase 4(2구역) → Phase 5(3구역) → Phase 6(QA/접근성/성능) → Phase 6.5(디자인/레이아웃 시스템 리비전) → Phase 7(배포). 각 Phase는 정해진 종료 조건을 만족해야 다음으로 넘어간다. **상세 범위, 종료 조건, 15개 건물 모듈 체크리스트는 `docs/phases.md`를 반드시 확인한다.**
