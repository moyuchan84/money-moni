# moneymoni — CLAUDE.md

## 프로젝트 한 줄 요약

초등학교 1~3학년 대상 자본주의/금융 학습 정적 웹앱. "머니타운"(마을 키우기 RPG) 세계관 위에 15개 경제 개념 모듈을 배치한다. Next.js App Router, 서버 없는 완전 정적(`output: 'export'`) 사이트.

## 반드시 먼저 읽을 문서

작업을 시작하기 전에 아래 순서로 읽는다. 이 CLAUDE.md는 매 세션 자동으로 로드되므로 요약만 담고, 상세 내용은 아래 문서를 참조한다.

- `docs/idea.md` — 기획안: 세계관, 3구역 15개 모듈, 게임 루프 컨셉
- `docs/implementation.md` — 기술 리서치와 화면/모듈별 구현 상세(라이브러리 선정 근거, 라우팅, 상태 스키마)
- `docs/phases.md` — 개발 Phase별 범위, 종료 조건, 모듈 체크리스트. **작업을 시작하기 전 지금 어느 Phase인지, 무엇이 종료 조건인지 반드시 이 파일에서 확인한다.**

## 기술 스택 (요약 — 선정 근거는 `docs/implementation.md` 2장)

Next.js(App Router, `output: 'export'`) + TypeScript + Tailwind CSS · 상태 Zustand(`persist`) · UI 애니메이션 Motion · 캐릭터/SVG 정밀 연출 GSAP · 인터랙티브 캐릭터 Rive · 미니게임 캔버스 PixiJS(+물리는 Matter.js) · 구조화 드래그 dnd-kit · 사운드 Howler.js · 내레이션은 실시간 TTS 대신 사전 녹음 mp3 우선.

## 명령어

프로젝트 스캐폴딩 완료 후 아래 명령어를 실제 `package.json` 스크립트와 일치시키고 이 섹션을 갱신한다. 지금은 목표 명령어만 명시한다.

- 개발 서버: `npm run dev`
- 정적 빌드(반드시 `output:'export'`로 빌드되는지 확인): `npm run build`
- 린트: `npm run lint`
- 타입체크: `npm run typecheck`
- 테스트: `npm run test` (store 로직은 Vitest, 온보딩→마을→건물→미니게임→보상 크리티컬 플로우는 Playwright)

**각 Phase를 완료로 표시하기 전 위 4개 명령어가 모두 통과해야 한다.**

## 아키텍처 맵

- `app/` — 라우트. 트리 구조는 `docs/implementation.md` 5장을 그대로 따른다(임의 변경 금지, 변경 시 그 문서도 함께 갱신).
- `data/` — 모든 한글 카피와 콘텐츠 메타(건물 정보, 퀘스트, 용어집). **컴포넌트에 한글 문자열을 직접 하드코딩하지 않는다** — 내레이션 mp3와 텍스트를 1:1로 관리해야 하기 때문이다.
- `store/useGameStore.ts` — 단일 진행 상태 소스. 스키마는 `docs/implementation.md` 6장 기준. 필드를 추가할 때는 반드시 기본값을 지정하고, 저장 스키마에 `version` 필드를 두어 증가시키고 마이그레이션 함수를 작성한다.
- `components/` — `town/`, `hud/`, `dialogue/`, `minigame/`, `feedback/` 카테고리를 유지한다. 새 공통 UI가 필요하면 먼저 이 폴더에 이미 있는지 확인한 뒤 없을 때만 추가한다.
- `content/audio/` — 사전 녹음 내레이션 mp3. 파일명은 `{buildingId}-{sceneKey}.mp3` 규칙을 고정한다.

## 절대 규칙 (린터가 잡아주지 않는 것들)

1. 서버 API 라우트나 서버 전용 데이터 페칭을 추가하지 않는다 — 정적 export가 깨진다.
2. `localStorage`를 컴포넌트에서 직접 호출하지 않는다 — 항상 `useGameStore`를 통해서만 읽고 쓴다(하이드레이션 가드가 우회되면 SSR/CSR 불일치가 난다).
3. PixiJS·Rive·Matter.js는 `next/dynamic(..., { ssr: false })`로만 임포트한다 — 마을 지도/허브 화면의 초기 번들에 섞이면 안 된다.
4. 터치/클릭 가능한 요소는 Tailwind의 `min-h-touch`(최소 44px, 아동 기준 2cm 상당) 토큰을 사용하고 임의 px 값을 쓰지 않는다.
5. 이름(닉네임) 외의 개인식별정보를 수집하지 않고, 외부로 데이터를 전송하는 코드를 추가하지 않는다.
6. 신규 건물 모듈은 `/building/[id]`, `/building/[id]/minigame`, `/building/[id]/result` 3-라우트 구조를 따른다. 예외가 필요하면 이 문서에 사유를 기록한다.
7. 정치적으로 민감한 모듈("세 갈래 실험마을" — 자본주의/사회주의/공산주의)은 정답·우열 판정 로직을 추가하지 않는다. `<ReflectionPrompt />`로만 마무리한다.

## 신규 건물 모듈 추가 절차

1. `docs/implementation.md` 8장에서 해당 모듈의 설계(라이브러리, 인터랙션)를 확인한다.
2. `data/buildings.ts`에 메타데이터를 추가한다(id, district, 잠금 조건, 보상 코인).
3. `app/building/[id]/page.tsx`, `minigame/page.tsx`, `result/page.tsx`를 생성한다.
4. `store`의 `buildings` 레코드에 해당 필드가 없으면 기본값과 함께 추가한다.
5. `content/audio/`에 내레이션 mp3 자리(제작 전이면 placeholder)를 추가한다.
6. `docs/phases.md`의 모듈 체크리스트에 완료 표시를 남긴다.

## 코드 스타일

- 컴포넌트 파일은 PascalCase, 훅은 camelCase(`use`로 시작), 라우트 폴더는 kebab-case.
- 드래그/캔버스/사운드처럼 브라우저 API에 의존하는 컴포넌트는 파일 최상단에 `'use client'`를 명시한다.
- GSAP 타임라인은 `useEffect` 내부에서 생성하고, cleanup에서 반드시 `revert()`로 해제한다(라우트 전환 시 메모리 누수 방지).
- 커밋 메시지는 `[phase-N] 짧은 설명` 형식을 권장한다(예: `[phase-2] ledger-house 미니게임 구현`).

## Phase 개요

Phase 0(기반 셋업) → Phase 1(게임 루프 뼈대) → Phase 2(1구역 완성 — 기술 파이프라인 검증) → Phase 3(공통 시스템 고도화: Rive/사운드) → Phase 4(2구역) → Phase 5(3구역) → Phase 6(QA/접근성/성능) → Phase 7(배포). 각 Phase는 정해진 종료 조건을 만족해야 다음으로 넘어간다. **상세 범위, 종료 조건, 15개 건물 모듈 체크리스트는 `docs/phases.md`를 반드시 확인한다.**
