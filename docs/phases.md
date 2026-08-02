# 머니모니 개발 Phase 로드맵

> `CLAUDE.md`에서 링크된 상세 문서입니다. 새 작업을 시작하기 전 지금이 어느 Phase인지, 그 Phase의 종료 조건(exit criteria)이 무엇인지 이 문서에서 먼저 확인하세요. 각 Phase/모듈이 끝나면 아래 체크박스를 갱신합니다.

프로젝트가 방대해질 것을 고려해, 다음 원칙으로 Phase를 나눕니다. 첫째, 처음부터 15개 모듈을 넓게 벌리지 않고 **세로로 하나를 완주**해서(온보딩부터 보상까지) 기술 파이프라인 전체가 실제로 동작하는지 가장 먼저 검증합니다. 둘째, 검증된 패턴은 이후 구역에서 그대로 재사용해 속도를 높입니다. 셋째, 새로운 기술적 위험(물리 시뮬레이션, 스와이프 병렬 씬 등)은 해당 구역 개발 초반에 먼저 스파이크(prototype)해서 리스크를 앞당겨 확인합니다.

---

## Phase 0 · 기반 셋업

**목표**: 아무 콘텐츠 없이도 프로젝트의 뼈대와 규칙이 전부 자리 잡게 한다.

- [x] Next.js + TypeScript + Tailwind 스캐폴딩, `output: 'export'` 설정 및 더미 빌드 확인
- [x] ESLint/Prettier, `npm run lint` / `npm run typecheck` 스크립트 확정
- [x] 디자인 토큰: 구역별 색상(1구역 노랑/주황, 2구역 파랑/초록, 3구역 보라/청록), 타이포 스케일, `min-h-touch` 등 터치 크기 토큰을 Tailwind 테마로 구현
- [x] `store/useGameStore.ts` 스키마 초안 구현(`docs/implementation.md` 6장) + `hasHydrated` 가드 + `persist` + `version` 필드
- [x] `data/buildings.ts`, `data/quests.ts`, `data/glossary.ts` 타입 정의 및 15개 모듈 placeholder 엔트리(제목만 있고 콘텐츠는 비어 있어도 됨)
- [x] `app/` 라우트 스켈레톤 전체 생성(`docs/implementation.md` 5장 트리 그대로, 각 페이지는 "준비 중" 정도만 표시)
- [x] 공통 컴포넌트 셸: `TownMap`, `NpcDialogue`, `MiniGameShell`, `RewardCelebration`, `CoinWallet`, `QuestBadge`, `SoundToggle` — 비주얼은 거칠어도 되지만 props 인터페이스는 확정
- [x] Howler 기반 사운드 프로바이더 배선(자산 없이 무음이어도 동작만 확인)

**종료 조건**: `npm run build`로 정적 export가 성공하고, 온보딩 → 마을 지도(placeholder) → 임의의 건물 stub 페이지 → 뒤로가기가 클릭으로 오류 없이 동작하며, 새로고침해도 저장된 상태(닉네임 등)가 유지된다.

---

## Phase 1 · 게임 루프 뼈대(MVP)

**목표**: 콘텐츠 완성도는 낮아도 되니, "게임으로서 한 바퀴 돈다"는 것을 검증한다.

- [x] 온보딩(아바타 파츠 조합 + 닉네임) 완성
- [x] 마을 지도에 15개 건물 핫스팟 전부 표시(미구현 건물은 "곧 열려요" 잠금 상태)
- [x] 퀘스트 로그 + 일일 퀘스트 최소 1개 실제 동작
- [x] 코인 지갑 적립/차감 end-to-end 동작, 상점은 빈 상태여도 무방
- [x] `<ReflectionPrompt />` 범용 버전 구현(질문/선택지를 데이터로 주입 가능하게)
- [x] 임시 범용 미니게임("탭해서 완료") 하나를 만들어 아무 건물에나 연결 — 실제 미니게임을 만들기 전에 보상 지급 → 퀘스트 진행 → 마을 상태 갱신까지의 배선을 먼저 검증하기 위함

**종료 조건**: 플레이어가 마을에서 아무 건물(placeholder 미니게임 포함)에 들어가 완료하면 코인이 늘고, 퀘스트가 진행되고, 건물에 완료 표시가 남고, 새로고침해도 그대로 유지된다.

---

## Phase 2 · 1구역(저금통 마을) 완성 — 기술 파이프라인 검증

**목표**: 실제 비주얼/애니메이션/사운드 수준으로 3개 건물을 완성해, 이후 모든 구역이 재사용할 컴포넌트와 패턴을 이 단계에서 확립한다.

- [x] `museum`(화폐의 역사) — GSAP `ScrollTrigger` 타임라인, dnd-kit 교환 매칭 미니게임
- [x] `ledger-house`(가계부) — PixiJS 낙하 기반 분류 미니게임 (통은 문서 설계의 DOM 오버레이 대신, 좌표계 변환 없이 더 단순·견고하도록 Pixi Graphics로 같은 스테이지에 그림 — `components/minigame/ledgerHouse/LedgerSortingCanvas.tsx` 주석 참고)
- [x] `allowance-square`(용돈 배분) — dnd-kit 4항아리 드래그, SVG `clipPath` 액체 차오름 애니메이션(Motion 트윈)
- [x] 위 3개에 사용된 애니메이션 유틸을 공용으로 추출: `hooks/useGsapContext.ts`(GSAP 컨텍스트 생성/해제), `hooks/useReducedMotion.ts`, `components/minigame/PixiStage.tsx`(PixiJS Application 생성·리사이즈·해제 래퍼)
- [ ] 실제 내레이션 mp3 3개 건물분 연동 — **코드 배선은 완료**(`narrationSrc` 경로를 `public/content/audio/{buildingId}-{sceneKey}.mp3` 규칙으로 연결, 사운드 온/오프는 정상 동작)했지만, 실제 사람이 녹음한 음원 파일은 이 세션에서 만들 수 없어 `public/content/audio/`에는 0바이트 placeholder만 있다. 실제 녹음본이 준비되면 같은 경로에 덮어쓰기만 하면 됨. (Phase 3에서 `content/audio/`가 `public/content/audio/`로 이동함 — 정적 export는 `public/` 밖의 파일을 서빙하지 않아 브라우저에서 404가 나던 문제를 수정.)
- [x] 1구역 한정 접근성 점검: 터치 타겟(`min-h-touch`/`min-w-touch`, Pixi 동전은 지름 44px로 통일), 색 대비(흰/연한 배경 카드에 다크모드에서도 고정된 어두운 텍스트색 강제 — Phase 0/1부터 있던 대비 문제를 1구역 화면들에서 함께 수정), `reducedMotion` 옵션 동작(`/parent`에 토글 추가, 3개 미니게임 모두 반영)

**종료 조건**: 1구역 3개 건물이 기획안(`docs/idea.md` 6-1~6-3) 수준의 완성도로 플레이 가능하고, 초기 로드 시간·FPS가 목표치(모바일 중급기기 기준 미니게임 55fps 이상, 건물 진입 화면 로드 2초 이내 목표— 실측 후 조정) 안에 있다.

---

## Phase 3 · 공통 시스템 고도화

**목표**: Phase 2에서 임시로 둔 요소(정적 SVG 캐릭터, 부분 사운드)를 최종 품질로 끌어올려 이후 구역에 바로 적용할 수 있게 한다.

- [ ] Rive로 촌장 NPC / 저금통 펫 상태 머신 제작 및 통합(정적 SVG 대체) — **코드 파이프라인은 완료**(`@rive-app/react-canvas` 설치, `components/rive/*`에 `next/dynamic(ssr:false)` 래퍼·`mood`(happy/neutral/worried) 상태 머신 input 연동·로드 실패 시 기존 이모지 자동 폴백까지 구현하고 `NpcDialogue`/`money-tree`에 통합함)했지만, 실제 `.riv` 상태 머신 파일은 Rive 에디터로 제작해야 하는 디자인 자산이라 이 세션에서 만들 수 없어 `public/content/rive/`에는 0바이트 placeholder(`village-chief.riv`, `piggy-pet.riv`)만 있다. 실제 파일이 준비되면 같은 경로에 덮어쓰기만 하면 되고, 상태 머신 이름은 `ChiefState`/`PetState`, input 이름은 `mood`(0=worried/1=neutral/2=happy)로 맞춰야 한다.
- [x] `money-tree`(복리, 개인 마당) 완성 — GSAP 경로 애니메이션(가지 성장 strokeDashoffset 트윈), 하루 1회 제한 로직(store `growMoneyTree`, 날짜 비교) 구현 및 검증 완료.
- [ ] BGM/SFX 풀 세트 연동, 구역별 BGM 전환 — **코드 배선은 완료**(`SoundProvider`에 `playBgm`/`stopBgm` 크로스페이드 추가, `hooks/useDistrictBgm.ts`로 마을/건물/머니나무/상점 전 화면에 배선, `RewardCelebration`/머니나무/상점 구매에 SFX 연결)했지만, 실제 작곡·녹음된 BGM·SFX 음원은 이 세션에서 만들 수 없어 `public/content/audio/`의 `bgm-*.mp3`/`sfx-*.mp3`는 0바이트 placeholder다. 실제 음원이 준비되면 같은 경로에 덮어쓰기만 하면 됨.
- [ ] 내레이션 커버리지를 허브 화면(마을 지도, 퀘스트 로그, 상점)까지 확대 — **코드 배선은 완료**(세 화면 모두 `NpcDialogue` + 전용 `narrationSrc` 연결)했지만, Phase 2와 동일한 이유로 실제 녹음 음원은 placeholder 상태다.
- [x] 상점 실제 아이템 카탈로그 연결(구매 → 아바타 반영) — `data/shopItems.ts`(`data/avatarOptions.ts`의 유료 옵션에서 파생), 구매 시 코인 차감 + 즉시 장착까지 구현 및 검증 완료.

**종료 조건**: 최종 비주얼/사운드 톤이 확정되고, 이후 구역 개발자가 "새 화면을 어떻게 만드는지" 스스로 참고할 수 있는 레퍼런스 화면 세트가 1구역에 완성돼 있다. **현재 상태**: 코드 레퍼런스(Rive 폴백 패턴, BGM 크로스페이드 훅, 상점/머니나무 화면 구성)는 1구역에 전부 완성되어 이후 구역 개발자가 그대로 재사용할 수 있다. 다만 실제 `.riv` 아트·BGM/SFX 음원·나머지 내레이션 녹음본은 외부 제작이 필요해 여전히 placeholder이므로, "최종 비주얼/사운드 톤 확정"은 그 자산들이 준비된 뒤에 완료로 봐야 한다.

---

## Phase 4 · 2구역(은행 마을)

**목표**: 검증된 패턴을 재사용하며 개발 속도를 낸다. 새 패턴은 이자율 슬라이더 연동 정도.

- [x] `bank`(저축·이자) — 슬라이더 값과 GSAP `timeScale()` 바인딩
- [x] `job-center`(소득의 종류) — `AnimatePresence` 기반 장면 전환
- [x] `market`(인플레이션) — PixiJS 파티클 이벤트 연출 + 숫자 카운트업
- [x] `capital-warehouse`(자본) — 맨손 vs 사다리(자본) 제한시간 비교 미니게임(idea.md 6-15 채택)
- [x] 2구역 잠금 해제 조건(1구역 진행도 기준) 실제 로직 연결 및 테스트 — 1구역 3개 건물(`museum`/`ledger-house`/`allowance-square`) 모두 완료 시 `districts[2].unlocked`가 `true`로 전환되도록 `store/useGameStore.ts`의 `completeBuilding`에 `isDistrictFullyCompleted` 판정을 추가하고 단위 테스트로 검증(2개만 완료 시 잠김 유지, 3개 완료 시 해제, 재완료해도 퇴행 없음). `/parent`에 개발용 임시 "2구역 열기" 버튼(`debugUnlockDistrict2`)도 추가해 실제 플레이 없이 확인 가능하게 함.
- [ ] 실제 내레이션 mp3 4개 건물분 연동 — **코드 배선은 완료**(1구역과 동일한 패턴으로 `narrationSrc` 연결)했지만, 이 세션에서는 실제 녹음본을 만들 수 없어 `public/content/audio/`에는 0바이트 placeholder만 있다.

**종료 조건**: 2구역 4개 건물 완성, 1구역 완료 후 2구역이 실제로 열리는 잠금 해제 플로우가 검증된다. — 완료.

---

## Phase 5 · 3구역(투자 타워)

**목표**: 가장 새로운 기술 패턴이 몰려 있는 구역이므로, 위험한 것부터 먼저 스파이크한다.

- [x] (선행 스파이크) `loan-counter`(대출/레버리지) — Matter.js + PixiJS 물리 저울. 추(무게)를 자유낙하시키지 않고 `Matter.Constraint`(stiffness 1, length 0)로 막대에 강체 결합해 결정론적으로 동작하게 구현(`components/minigame/loanCounter/`). 별도 `Matter.Runner` 없이 Pixi `app.ticker` 콜백 하나에서 물리 업데이트와 그래픽 동기화를 함께 처리.
- [x] (선행 스파이크) `triple-village`(세 갈래 실험마을) — Motion `drag="x"` 스와이프 + 화살표/점 버튼 탭 대안(`components/minigame/tripleVillage/`). 결과 분배 로직은 `distributeResult()` 순수 함수로 분리(자본주의/사회주의/공산주의 3모드, 우열 판정 없음 — CLAUDE.md 절대 규칙 7 준수).
- [x] `seed-field`(투자란) — 확률 룰렛(결과 역산 방식). `rouletteMath.ts`에 `pickWeightedOutcome`/`computeStopAngle` 순수 함수 분리.
- [x] `stock-street`(주식) — 투표 → 주가(케이크 크기) 변화 2단계 화면(Motion `scale` 트윈).
- [x] `etf-lab`(ETF/ETN) — dnd-kit 단일 드롭존(바구니) + 신규 공용 컴포넌트 `components/minigame/ComparisonBarChart.tsx`로 변동폭 비교.
- [x] `gold-vault`(금) — `useGsapContext` 재사용, 시대별 카드 GSAP 페이드인 자동 재생 시퀀스.
- [x] `coin-station`(코인/스테이블코인) — PixiJS 웨이브 경로 비교(코인=큰 진폭, 스테이블코인=작은 진폭) + DOM 소지금 카운터.
- [x] 3구역 잠금 해제 조건(2구역 진행도 기준) 연결 — `isDistrictFullyCompleted`에 `routeKind === "building"` 필터를 추가해 `money-tree`(standalone 예외)를 판정에서 제외하고, `completeBuilding`에 2구역 완료 → 3구역 해금 체크를 추가. 단위테스트로 검증(3/4 완료 시 잠김 유지, 4/4 완료 시 해제, 재완료해도 퇴행 없음).
- [ ] 실제 내레이션 mp3 7개 건물분 연동 — **코드 배선은 완료**(기존 8개 건물과 동일한 `narrationSrc` 패턴)했지만, 이 세션에서는 실제 녹음본을 만들 수 없어 `public/content/audio/`에는 0바이트 placeholder만 있다.

**종료 조건**: 3구역 7개 건물 완성. 이 시점에 15개 모듈 전체와 3구역 모두가 콘텐츠 100% 커버리지에 도달한다. — 완료. `npm run lint`/`typecheck`/`test`(49개 테스트 통과)/`build` 모두 통과 확인했고, `matter-js`(loan-counter 전용) 청크가 정적 export 산출물의 어떤 HTML에도 직접 참조되지 않고(= `next/dynamic(ssr:false)`로만 지연 로드) `/town`·건물 인트로 화면 번들과 분리되어 있음을 빌드 산출물에서 직접 확인했다(CLAUDE.md 절대 규칙 3).

---

## Phase 6 · 폴리시 · QA · 접근성 · 성능

**목표**: 아이가 실제로 써도 되는 수준으로 다듬는다.

- [x] 전 화면 접근성 재감사(터치 타겟, 명도 대비 WCAG AA, 내레이션 커버리지, `reducedMotion`) — 터치 타겟(`min-h-touch`/`min-w-touch`)과 명도 대비(`--color-ink` 강제 토큰)는 이미 전 구역에 일관 적용되어 있음을 재확인했다. `reducedMotion`은 `EtfBasketGame`/`LoanCounter`(Matter.js 물리)가 실제로는 줄일 트윈이 없거나(색상 전환만 존재) 물리 시뮬레이션 자체가 핵심 메커니즘이라는 이유를 코드 주석으로 명시했다. 내레이션 커버리지 점검 중 `docs/concept-story.md`가 요구하는 5요소 중 "실생활 예시"(`realExampleKo`)가 15개 건물 전부 데이터에는 있지만 `StorySceneViewer`에서 한 번도 렌더링되지 않던 버그를 발견해 수정했다(`components/dialogue/StorySceneViewer.tsx`).
- [x] 성능 예산 점검(번들 사이즈, `next/dynamic` lazy load 실제 동작 확인, 저사양/모바일 기기 실측) — `npm run build` 산출물(`out/`)에서 PixiJS·Rive·Matter.js를 포함한 청크가 `/town`과 15개 건물의 모든 인트로/결과 화면 HTML에 전혀 참조되지 않음을 스크립트로 전수 확인했다(Phase 5에서는 loan-counter 하나만 확인했던 것을 전 구역으로 확장). 정적 export 전체 9.8MB, JS 청크 총합 2.8MB. **저사양 모바일 기기 실측(55fps 목표)은 이 세션에서 물리 기기가 없어 수행할 수 없다** — 오디오/Rive 자산과 동일하게 외부에서 별도로 검증이 필요한 항목으로 남겨둔다.
- [x] 카피 재검토 — 초1 읽기 수준(문장 길이, 어휘) 기준 전수 검토 — 15개 건물 콘텐츠 파일(`data/*Content.ts`)과 `data/glossary.ts`를 전수 확인한 결과, 이미 2~3문장 원칙과 구체적 비유를 일관되게 지키고 있어 별도 재작성은 필요하지 않았다. 동시에 `data/`에 없던 핵심 화면 하드코딩 한글(건물 인트로/결과 화면, `StorySceneViewer` 공통 UI, 마을 지도 내비게이션, 온보딩, `/parent`)을 `data/commonContent.ts`/`data/buildingViewContent.ts`/`data/onboardingContent.ts`/`data/parentContent.ts`로 옮겼다(CLAUDE.md `data/` 규칙 위반 정리). **범위 제한**: 미니게임 Pixi 캔버스 안의 짧은 라벨(숫자/한두 글자)은 이번 범위에서 제외했다 — 여전히 컴포넌트에 하드코딩된 채로 남아 있는 남은 debt다.
- [x] (선택) 보호자용 요약 대시보드(`/parent`) 구현 — 닉네임 한 줄 + 개발용 임시 버튼뿐이던 화면을 코인 총합, 구역별 완료 현황(`n구역 x/y`), 일일/주간 퀘스트 진행 요약, 사운드 토글(`SoundToggle` 재사용)을 보여주는 화면으로 확장했다. 배포를 앞두고 실사용자에게 노출되면 안 되는 개발용 `debugUnlockDistrict2` 버튼은 화면에서 제거했다(스토어 액션 자체와 그 단위 테스트는 유지).
- [ ] 가능하다면 실제 아동 대상 소규모 사용성 테스트 진행 및 피드백 반영 — **이 세션에서는 수행하지 않음(범위 밖으로 확정)**. 실제 아동 참여가 필요한 외부 활동이라 코드 작업으로 대체할 수 없다. Phase 7 이전에 별도로 진행해야 한다.
- [x] 버그 트리아지 및 수정 — `TODO`/`FIXME` 마커는 없었다. 위 접근성 재감사 중 발견한 `realExampleKo` 미노출 버그를 수정했고, 신규 E2E 테스트를 작성하는 과정에서 Playwright `addInitScript`가 `page.reload()`마다 재실행되어 진행 상태를 시드값으로 덮어쓰는 테스트 하네스 버그(`e2e/seedState.ts`)를 발견해 "키가 없을 때만 시드" 가드로 수정했다.
- [x] E2E 크리티컬 플로우 커버리지 확장(원래 체크리스트에는 없었지만 종료 조건 충족을 위해 추가) — 기존에는 1구역(museum/allowance-square)만 커버했다. `e2e/district-unlock-flow.spec.ts`(1→2구역, 2→3구역 잠금 해제 + 은행/ETF 조합소 실제 완주)와 `e2e/money-tree-flow.spec.ts`(standalone 라우트 + 하루 1회 제한 로직의 새로고침 유지)를 추가해 6개 테스트 모두 통과한다. **남은 갭**: `loan-counter`(Matter.js)는 물리 타이밍이 얽혀 있어 이번 확장에서 제외했다 — 여전히 e2e 커버리지 밖이다.

**종료 조건**: `npm run lint`, `npm run typecheck`, `npm run test`(Vitest 49개 + Playwright 6개)가 모두 통과한다 — 확인 완료. 접근성 체크리스트 항목은 위와 같이 코드로 가능한 부분은 전부 해소했으나, 저사양 기기 실측과 아동 대상 사용성 테스트는 외부 활동이 필요해 이 세션 범위 밖으로 남아 있다.

---

## Phase 6.5 · 디자인/레이아웃 시스템 리비전

**목표**: "PC에서 목업처럼 덩그러니 보인다", "모바일 버튼 텍스트 줄바꿈이 이상하다", "마을 지도 그리드가 들쭉날쭉하다"는 피드백을 해소한다. 상세 진단과 방향은 `docs/design-revision.md`, 실행 체크리스트는 `docs/tasks/design-system-revision.md` 참고. `design/layout-system-revision` 브랜치에서 진행했다.

- [x] `app/globals.css`에 `word-break: keep-all`/`overflow-wrap: break-word`(한글 어절 단위 줄바꿈), `--container-app: 30rem`(`max-w-app` 유틸리티), `shadow-frame` 유틸리티 추가.
- [x] `components/layout/AppShell.tsx` 신설 — 고정폭 게임 캔버스 컨테이너. `app/layout.tsx`에서 전역으로 한 번만 감싼다(`SoundProvider > AppShell > HydrationGuard > children` 순서 — 하이드레이션 로딩 중에도 프레임이 유지되도록 문서 원안에서 순서를 조정했다).
- [x] (실사용 중 발견) `AppShell`의 `min-h-full`이 `body`가 명시적 높이를 갖지 않아 퍼센트 높이 체인이 끊겨, 콘텐츠가 짧은 화면(건물 인트로 등)에서 프레임이 자기 콘텐츠 높이로만 쪼그라들고 바탕 배경이 뷰포트를 다 못 채우는 버그가 있었다. `min-h-screen`(뷰포트 기준, 조상 체인에 의존하지 않음) + 안쪽 프레임 `flex-1`로 교체해 모든 화면에서 항상 전체 높이를 채우도록 고쳤다. 같은 맥락에서 `BuildingIntroView.tsx`의 `<main>`에도 `justify-center`를 추가해 짧은 콘텐츠가 프레임 위쪽에 쏠리지 않고 세로 중앙에 오도록 맞췄다(`BuildingResultView.tsx`/온보딩은 이미 `items-center justify-center`가 있어 그대로 두었다).
- [x] `components/ui/Button.tsx`/`ButtonRow.tsx` 신설 — 건물 인트로/결과 화면, 온보딩 제출 버튼에 적용. `NpcDialogue`/`ReflectionPrompt`는 별도 스타일 계약(pill 모양)을 유지하고 대상에서 제외.
- [x] `components/town/DistrictLayer.tsx`(`flex flex-wrap` → `grid grid-cols-2 sm:grid-cols-3`), `BuildingHotspot.tsx`(고정 높이 `h-24` + `line-clamp-2` + 캡션 `truncate`) — 마을 지도 카드 크기를 제목 길이와 무관하게 균일화.
- [x] `components/hud/QuestBadge.tsx` 카운트 배지에 `min-w-5` 보강(두 자리 숫자 대비).
- [x] `e2e/layout-viewports.spec.ts` 신규 — `/town`·`/onboarding`·`/building/museum`을 375/768/1440px 뷰포트로 방문해 AppShell 프레임 크기·가운데 정렬·버튼 텍스트 오버플로 없음을 검증(9개 테스트). 기존 3개 스펙(6개 테스트) 회귀 없음 확인.
- [x] `CLAUDE.md` 아키텍처 맵에 `components/layout/`, `components/ui/` 추가, 절대 규칙 8("버튼은 Button/ButtonRow로만 만든다") 추가.

**종료 조건**: `npm run lint`/`typecheck`/`test`/`build` 모두 통과, `npm run test:e2e`(Vitest와 별개로 Playwright 15개 테스트) 전체 통과 — 확인 완료.

---

## Phase 7 · 배포 및 런칭 준비

- [ ] 정적 호스팅 설정(Vercel/Netlify/정적 스토리지 등 — `output:'export'` 산출물 배포)
- [ ] 커스텀 도메인/HTTPS 확인
- [ ] (선택) 서비스워커 기반 오프라인 지원 검토
- [ ] 최종 릴리즈 체크리스트 작성 및 실행

---

## 모듈별 "완료(Definition of Done)" 공통 체크리스트

새 건물 모듈을 "완료"로 표시하기 전 아래를 모두 만족해야 합니다.

- [ ] `docs/idea.md`에 정의된 개념 설명 애니메이션과 미니게임 컨셉이 구현되어 있다
- [ ] `docs/concept-story.md`에 정의된 개념 스토리 씬(3~5컷)이 구현되어 있고, 게임 종료 후 결과 화면에 recap 대사가 노출된다
- [ ] `data/buildings.ts`에 메타데이터가 등록되어 있고 잠금 조건이 실제로 동작한다
- [ ] 내레이션 mp3가 연결되어 있고(또는 명시적으로 placeholder 처리) 사운드 온/오프가 정상 동작한다
- [ ] 터치 타겟이 `min-h-touch` 토큰을 따르고, 드래그가 필요한 인터랙션에는 탭 대안이 있다(가능한 경우)
- [ ] 완료 시 코인 보상과 퀘스트 진행이 store에 정확히 반영된다
- [ ] `<ReflectionPrompt />` 회고 질문이 붙어 있다
- [ ] 새로고침 후에도 진행 상태가 유지된다(하이드레이션 오류 없음)
- [ ] `npm run lint` / `npm run typecheck` 통과

---

## 15개 모듈 진행 현황 (요약)

구역별로 위 Phase 체크박스와 별개로, 전체 그림을 한눈에 보기 위한 표입니다. 상태는 `대기 / 진행중 / 완료` 중 하나로 갱신하세요.

| 구역 | 모듈 | 라우트 id | 상태 | 비고 |
|---|---|---|---|---|
| 1구역 | 화폐의 역사 | `museum` | 완료 | 개념 스토리 씬(`docs/concept-story.md` 7-1) 추가 완료 |
| 1구역 | 가계부 | `ledger-house` | 완료 | 개념 스토리 씬(7-2) 추가 완료 |
| 1구역 | 용돈 배분 | `allowance-square` | 완료 | 개념 스토리 씬(7-3) 추가 완료 |
| 2구역 | 저축·이자 | `bank` | 완료 | 개념 스토리 씬(7-4) 추가 완료 |
| 2구역 | 복리(개인 위젯) | `money-tree` | 완료 | 개념 스토리 씬(7-5) 추가 완료(결과 페이지가 없어 recap은 다시 심기/수확 직후 노출) |
| 2구역 | 소득의 종류 | `job-center` | 완료 | 개념 스토리 씬(7-6) 추가 완료 |
| 2구역 | 인플레이션 | `market` | 완료 | 개념 스토리 씬(7-7) 추가 완료 |
| 2구역 | 자본 | `capital-warehouse` | 완료 | 개념 스토리 씬(7-8) 추가 완료 |
| 3구역 | 투자란 | `seed-field` | 완료 | 개념 스토리 씬(7-9) 추가 완료. PixiJS 확률 룰렛(`rouletteMath.ts` 순수 함수) |
| 3구역 | 주식 | `stock-street` | 완료 | 개념 스토리 씬(7-10) 추가 완료. 투표→주가변화 2단계, Motion만 사용(Pixi 불필요) |
| 3구역 | ETF/ETN | `etf-lab` | 완료 | 개념 스토리 씬(7-11) 추가 완료. dnd-kit 바구니 + 공용 `ComparisonBarChart` |
| 3구역 | 금 | `gold-vault` | 완료 | 개념 스토리 씬(7-12) 추가 완료. `useGsapContext` 재사용 자동 재생 시퀀스 |
| 3구역 | 코인/스테이블코인 | `coin-station` | 완료 | 개념 스토리 씬(7-13) 추가 완료. PixiJS 웨이브 비교 |
| 3구역 | 대출/레버리지 | `loan-counter` | 완료 | 개념 스토리 씬(7-14) 추가 완료. 선행 스파이크 — Matter.js + PixiJS 물리 저울(`tiltMath.ts` 순수 함수) |
| 3구역 | 자본주의/사회주의/공산주의 | `triple-village` | 완료 | 개념 스토리 씬(7-15) 추가 완료. 선행 스파이크 — Motion 스와이프 + `distributeResult()` 순수 함수(절대 규칙 7 준수, 우열 판정 없음) |
