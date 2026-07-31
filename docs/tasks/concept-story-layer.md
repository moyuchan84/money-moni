# Task: 개념 스토리 레이어(StorySceneViewer) 구현

> 이 문서를 Claude Code 세션에 그대로 전달하면("이 문서의 Task를 T1부터 순서대로 진행해줘") 바로 실행할 수 있도록, 실제 코드베이스(2026-08 기준)의 파일 경로·인터페이스에 맞춰 작성했다. 각 Task를 마칠 때마다 아래 체크박스를 갱신한다.
>
> 참고 문서(작업 전 읽을 것): `docs/concept-story.md`(요구사양 + 15개 모듈 스토리 대사 초안), `CLAUDE.md`(절대 규칙·코드 스타일), `docs/phases.md`(전체 로드맵에서 이 작업의 위치).

---

## 0. 현재 코드베이스 스냅샷 (작업 시작 전 확인)

이미 구현되어 있는 것 — 그대로 재사용한다.

- 라우팅: `app/onboarding`, `app/town`, `app/building/[id]/{page,minigame/page,result/page}.tsx`, `app/money-tree/page.tsx`(스탠드얼론), `app/quest-log`, `app/shop`, `app/glossary`, `app/parent`
- 상태: `store/useGameStore.ts` — Zustand `persist`, `STORE_VERSION = 2`, `migrate`/`merge` 로직, `BuildingProgress { introSeen, minigameBestScore?, completedAt?, reflectionAnswer? }`
- 콘텐츠 파일 8개(패턴 고정: `narrationSrc`, `introMessageKo`, `instructionsKo`, 게임별 필드, `reflection: { questionKo, options }`): `data/museumContent.ts`, `ledgerHouseContent.ts`, `allowanceSquareContent.ts`, `bankContent.ts`, `moneyTreeContent.ts`, `jobCenterContent.ts`, `marketContent.ts`, `capitalWarehouseContent.ts`
- 공통 컴포넌트: `components/dialogue/NpcDialogue.tsx`(캐릭터+대사+"다시 듣기"/"다음" 버튼, `useSound().playNarration(src)` 사용), `components/dialogue/ReflectionPrompt.tsx`, `components/rive/VillageChiefCharacter.tsx`·`PiggyPetCharacter.tsx`, `components/providers/SoundProvider.tsx`(`useSound()` 훅 제공)
- 화면 조립: `app/building/[id]/BuildingIntroView.tsx`(`INTRO_CONTENT` 맵으로 건물별 `introMessageKo`/`narrationSrc` 주입 → "미니게임 시작하기" 버튼), `app/building/[id]/result/BuildingResultView.tsx`(`REFLECTION_CONTENT` 맵 → `<ReflectionPrompt />`)

아직 없는 것 — 이번 작업의 대상.

- 건물 진입 시 "다컷 이야기(상황→비유→실생활예시→게임으로 다리)"를 보여주는 **StorySceneViewer**. 지금은 `NpcDialogue` 한 줄 메시지만 뜨고 바로 미니게임으로 넘어간다 — 사용자가 지적한 "게임만으로는 이해가 부족하다"는 문제의 원인이 정확히 이 지점이다.
- 게임 종료 후 결과 화면에서 스토리의 비유를 다시 짚어주는 **recap 문구**.
- 스토리를 봤는지 여부를 기억하는 `storySeen` 상태.

범위 밖(별도 Task로 분리): 3구역 7개 건물(`seed-field`, `stock-street`, `etf-lab`, `gold-vault`, `coin-station`, `loan-counter`, `triple-village`)은 콘텐츠 파일 자체가 아직 없다(`docs/phases.md` Phase 5). 이 문서는 **이미 콘텐츠 파일이 있는 8개 건물**에 스토리 레이어를 붙이는 것까지만 다룬다. 3구역 건물은 이 패턴이 확립된 뒤 각 건물 콘텐츠 제작 시 같은 패턴을 그대로 따르면 된다.

---

## Task 목록

### T1. 스토리 씬 타입 정의 — `data/storyScene.ts`(신규)

`data/buildings.ts`처럼 공용 타입 파일을 하나 만든다.

```ts
export interface StoryScene {
  id: string;                 // "scene-1"
  speaker: "narrator" | "npc" | "child";
  textKo: string;
  narrationSrc?: string;      // /content/audio/{buildingId}-story-{sceneId}.mp3
  illustrationKey?: string;   // 일러스트/캐릭터 표정 힌트 (예: "museum-shell-era")
}

export interface BuildingStoryContent {
  metaphorLineKo: string;   // 이야기 중 강조 표시할 비유 한 문장
  realExampleKo: string;    // 실생활 예시 1~2문장
  storyScenes: StoryScene[]; // 3~5개
  bridgeLineKo: string;      // 마지막 컷: 게임으로 넘어가는 대사
  recapLineKo: string;       // 게임 종료 후 결과 화면에서 다시 보여줄 대사
}
```

- [ ] `data/storyScene.ts` 생성, 위 타입 export
- [ ] 기존 8개 콘텐츠 파일이 이 타입을 `import`해서 사용할 수 있도록 함(순환참조 주의: `buildings.ts`가 아닌 별도 파일로 분리한 이유)

### T2. 스토어 확장 — `store/useGameStore.ts`

- [ ] `BuildingProgress`에 `storySeen: boolean` 추가(기본값 `false`)
- [ ] `createInitialBuildingProgress()`와 `reconcileBuildingProgress()`의 기본 객체에 `storySeen: false` 반영
- [ ] 액션 `setBuildingStorySeen(buildingId: BuildingId): void` 추가 — `buildings[id].storySeen = true`만 갱신(코인/퀘스트 지급 없음, `completeBuilding`과 분리된 별개 액션)
- [ ] `STORE_VERSION`을 `3`으로 올리고 `migrate` 함수에 `version < 3` 분기 추가: 기존 저장분의 모든 건물에 `storySeen: false`를 채워 넣는다(기존 `v1→v2` 분기 패턴을 그대로 따라 작성)
- [ ] `useGameStore.test.ts`에 다음 케이스 추가: 신규 세이브는 모든 건물 `storySeen: false`로 시작한다 / `setBuildingStorySeen` 호출 시 해당 건물만 `true`로 바뀌고 다른 상태(코인 등)는 변하지 않는다 / v2 저장분을 마이그레이션하면 `storySeen: false`가 채워진다

### T3. `StorySceneViewer` 컴포넌트 — `components/dialogue/StorySceneViewer.tsx`(신규)

`NpcDialogue`를 그대로 재사용하지 않고 별도 컴포넌트로 만든다(진행바·건너뛰기·컷 전환 상태를 가져야 하므로). 다만 내부에서 캐릭터 렌더링은 `VillageChiefCharacter`/`PiggyPetCharacter`를 그대로 쓰고, 오디오 재생은 `useSound().playNarration()`을 그대로 쓴다(새 사운드 로직을 만들지 않는다).

```ts
export interface StorySceneViewerProps {
  scenes: StoryScene[];
  metaphorLineKo: string;
  bridgeLineKo: string;
  onComplete: () => void;   // 마지막 컷에서 "시작하기" 클릭 시
  onSkip: () => void;       // 건너뛰기 확정 시
}
```

요구사항:

- [ ] 화면 하단에 진행 표시(`n / total`, 점 형태 인디케이터)
- [ ] 화면 탭 또는 "다음" 버튼으로 다음 컷 이동, 마지막 컷 이전 컷으로는 좌측 화살표/스와이프로 되돌아가기 가능
- [ ] 각 컷 진입 시 `playNarration(scene.narrationSrc)` 자동 호출(단, `settings.narrationOn`이 꺼져 있으면 호출하지 않음 — `useGameStore`에서 읽어온다)
- [ ] `metaphorLineKo`는 일반 대사와 다른 강조 스타일(굵게, 배경색 강조 카드)로 별도 렌더링 — 스토리 씬들 중 하나에 인라인으로 녹여도 되고, 마지막에 "오늘의 한 마디"로 별도 노출해도 된다(콘텐츠 파일에서 이미 어느 컷의 대사가 비유 문장인지 `metaphorLineKo`로 명시하므로, 해당 텍스트와 동일한 컷에 강조 스타일을 입힌다)
- [ ] 마지막 컷에서는 `bridgeLineKo`를 보여주고 "시작하기" 버튼 노출 → 클릭 시 `onComplete()`
- [ ] 우상단 "건너뛰기" 버튼 — 클릭 시 확인 다이얼로그("정말 건너뛸까요? 이야기를 보면 게임이 더 쉬워져요!") → 확정 시 `onSkip()`
- [ ] `settings.reducedMotion`이 켜져 있으면 컷 전환 애니메이션(Motion) 지속시간을 줄이거나 생략
- [ ] 대사 텍스트는 항상 화면에 자막으로 표시(소리 없이도 이해 가능해야 함 — `docs/concept-story.md` 유즈케이스 4)
- [ ] 터치 타겟은 기존 컴포넌트들과 동일하게 `min-h-touch`/`min-w-touch` 클래스 사용

### T4. 콘텐츠 파일에 스토리 필드 채우기 — 8개 파일

`docs/concept-story.md` 7장의 대사를 그대로 옮겨 각 파일에 `BuildingStoryContent` 필드를 추가한다. 매핑은 다음과 같다.

| 콘텐츠 파일 | `docs/concept-story.md` 절 |
|---|---|
| `data/museumContent.ts` | 7-1 화폐의 역사 |
| `data/ledgerHouseContent.ts` | 7-2 가계부 |
| `data/allowanceSquareContent.ts` | 7-3 용돈 배분 |
| `data/bankContent.ts` | 7-4 저축과 이자 |
| `data/moneyTreeContent.ts` | 7-5 복리 |
| `data/jobCenterContent.ts` | 7-6 소득의 종류 |
| `data/marketContent.ts` | 7-7 인플레이션 |
| `data/capitalWarehouseContent.ts` | 7-8 자본 |

- [ ] 8개 파일 각각에 `storyScenes`(3~4컷, `speaker`/`textKo` 채움 — `narrationSrc`/`illustrationKey`는 자산이 없으면 일단 생략 가능), `metaphorLineKo`, `realExampleKo`, `bridgeLineKo`, `recapLineKo` 추가
- [ ] 기존 `introMessageKo`는 삭제하지 않는다 — `storySeen`이 이미 `true`인 재방문 시 건물 메인 화면에 짧게 보여줄 요약 문구로 계속 사용한다(T5 참고)
- [ ] 각 파일 상단 주석에 "docs/concept-story.md 7-N 참고"를 추가해 출처를 남긴다(기존 파일들의 주석 관례를 따름)

### T5. `BuildingIntroView.tsx` 통합

- [ ] `useGameStore`에서 `storySeen = state.buildings[building.id].storySeen`을 읽는다
- [ ] `storySeen === false`이고 해당 건물에 스토리 콘텐츠가 있으면(`STORY_CONTENT[building.id]` 존재) `<StorySceneViewer />`를 렌더링. `onComplete`에서 `setBuildingStorySeen(building.id)` 호출 후 화면을 기존 "미니게임 시작하기" 뷰로 전환. `onSkip`도 동일하게 `storySeen`을 `true`로 만들고 바로 기존 뷰로 전환한다(건너뛰어도 다음부터는 다시 안 뜨게)
- [ ] `storySeen === true`인 경우 기존 화면을 그대로 보여주되, 버튼 영역에 "이야기 다시보기" 버튼을 추가한다 — 클릭 시 `<StorySceneViewer />`를 다시 띄우되 이번엔 완료/건너뛰기 시 `storySeen`을 다시 갱신하지 않는다(이미 true이므로)
- [ ] 스토리 콘텐츠가 아직 없는 건물(3구역 7개)은 지금처럼 `INTRO_CONTENT`/`genericMinigameCopy` 폴백을 그대로 유지 — 이 Task에서 3구역 건물 동작을 바꾸지 않는다
- [ ] 기존 `INTRO_CONTENT` 맵 옆에 `STORY_CONTENT: Partial<Record<BuildingId, BuildingStoryContent>>` 맵을 추가하고 8개 건물을 채운다(T4에서 채운 필드를 그대로 매핑)

### T6. `money-tree`(스탠드얼론) 통합

`money-tree`는 `routeKind: "standalone"`이라 `/building/[id]` 구조를 쓰지 않는다. `app/money-tree/page.tsx`와 `components/moneyTree/MoneyTreeScene.tsx`를 확인해 T5와 동일한 로직(최초 방문 시 스토리, 재방문 시 "다시보기" 버튼)을 이식한다.

- [ ] `app/money-tree/page.tsx` 또는 `MoneyTreeScene.tsx` 진입 시 `buildings["money-tree"].storySeen` 확인 후 `<StorySceneViewer />` 삽입
- [ ] `money-tree`는 결과 화면(`/result`)이 따로 없으므로(개인 마당 위젯), recap 문구(`recapLineKo`)는 T4에서 채운 값을 나무를 "다시 심기/수확하기" 선택 직후 짧은 토스트나 `<NpcDialogue>`로 노출하는 방식으로 대체한다(정확한 위치는 `MoneyTreeScene.tsx` 기존 UI 흐름을 보고 자연스러운 지점에 배치)

### T7. `BuildingResultView.tsx` — recap 통합

- [ ] `REFLECTION_CONTENT` 맵 옆에 `RECAP_CONTENT: Partial<Record<BuildingId, string>>`(또는 T5의 `STORY_CONTENT`에서 `recapLineKo`만 뽑아 재사용)를 추가
- [ ] `<ReflectionPrompt />` 위쪽에 `recapLineKo`가 있으면 `<NpcDialogue speakerName="촌장님" message={recapLineKo} />` 형태로 한 번 더 비유를 짚어준 뒤 회고 질문으로 이어지게 배치
- [ ] recap이 없는 건물(3구역)은 기존처럼 회고 질문만 바로 보여준다

### T8. 접근성/설정 재확인

- [ ] `settings.narrationOn` 끔 상태에서 스토리 씬 진입 시 오디오가 재생되지 않고 자막만 보이는지 확인
- [ ] `settings.reducedMotion` 켬 상태에서 컷 전환 애니메이션이 즉시 전환되는지 확인
- [ ] `StorySceneViewer`의 모든 클릭 가능 요소가 기존 `min-h-touch` 규칙을 따르는지 확인(`CLAUDE.md` 절대 규칙 4)

### T9. 테스트

- [ ] `store/useGameStore.test.ts`: T2에서 추가한 케이스 포함해 전체 통과 확인
- [ ] `StorySceneViewer` 컴포넌트에 대한 단위 테스트 추가(Vitest + Testing Library가 세팅되어 있다면 활용, 없다면 최소한 스토리 진행/건너뛰기 로직을 분리한 순수 함수 단위로 테스트): 컷 이동, 마지막 컷에서 완료 콜백 호출, 건너뛰기 확인 다이얼로그 확정 시 스킵 콜백 호출
- [ ] `e2e/` 기존 스모크 테스트가 있다면(`onboarding → town → building → minigame → result` 플로우) 스토리 씬이 중간에 끼어들어도 깨지지 않도록 갱신 — 최초 방문 시 스토리를 끝까지 넘기는 단계를 추가

### T10. 문서 동기화

- [ ] `docs/phases.md`의 "15개 모듈 진행 현황" 표에서 이번에 스토리까지 완성된 건물(museum, ledger-house, allowance-square, bank, money-tree, job-center, market, capital-warehouse)의 상태를 갱신할지 검토(모듈 자체 완료 기준은 미니게임까지 포함이므로, 이미 "완료"로 표시돼 있다면 그대로 두고 별도 비고만 남겨도 됨)
- [ ] 새로 만든 `data/storyScene.ts`, `components/dialogue/StorySceneViewer.tsx`를 `CLAUDE.md`의 아키텍처 맵/컴포넌트 카테고리 설명에 반영할지 검토(선택)

---

## 완료 기준(Definition of Done)

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 모두 통과
- [ ] 8개 건물(museum/ledger-house/allowance-square/bank/money-tree/job-center/market/capital-warehouse) 각각 최초 진입 시 스토리 씬이 뜨고, 완료 후 미니게임으로 자연스럽게 이어진다
- [ ] 같은 건물에 재진입하면 스토리는 자동으로 건너뛰고, "이야기 다시보기" 버튼으로 원할 때 다시 볼 수 있다
- [ ] 미니게임 완료 후 결과 화면에 recap 문구가 뜬 다음 회고 질문으로 이어진다
- [ ] 새로고침해도 `storySeen` 상태가 유지된다(마이그레이션 포함 기존 세이브도 깨지지 않는다)
- [ ] 3구역 7개 건물의 기존 동작(범용 인트로)은 이번 작업으로 변경되지 않는다
