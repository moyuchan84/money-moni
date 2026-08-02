# 스플래시 페이지 + 전역 상단 헤더/하단 내비게이션 설계

> 목적: (1) 앱 진입 시 아이들이 좋아할 만한 짧고 가벼운 애니메이션 스플래시를 보여주고,
> (2) 지금은 `/town` 화면에만 있고 그 외 모든 화면(용어사전, 상점, 퀘스트 로그, 보호자용,
> 머니나무, 건물 인트로/미니게임/결과)에는 전혀 없는 내비게이션을, **상단 헤더 + 하단 탭바**로
> 모든 화면에 일관되게 깔아서 "어디서든 다른 메뉴로 바로 이동"할 수 있게 만드는 것.
>
> 이 문서는 추측이 아니라 2026-08-02 기준 실제 코드를 다시 읽고 확인한 내용을 기준으로 쓴다.
> 아래 "1장 현재 상태 진단"은 로컬 Claude Code가 그동안 진행한 작업 결과까지 반영한 최신본이다.

---

## 1. 현재 상태 진단 (실제 코드 재확인 결과)

지난 리비전 문서(`docs/design-revision.md`, `docs/tasks/design-system-revision.md`,
`docs/tasks/concept-story-layer.md`, `docs/tasks/glossary-expansion.md`)를 로컬에서 작업하는
동안 예상보다 많은 부분이 이미 구현되어 있었다. 이 문서를 작업하기 전에 반드시 아래 현황을
숙지해야 중복 작업이나 되돌리기가 생기지 않는다.

### 1-1. 이미 구현되어 있는 것 (건드리지 말고 재사용할 것)

- **`components/layout/AppShell.tsx`** — `app/layout.tsx`가 이미 이걸로 전체를 감싸고 있다.
  `min-h-screen` 배경 + `max-w-app` 고정폭 "게임 캔버스" 프레임(`sm` 이상에서
  `rounded-card`/`shadow-frame`). PC에서 "빈 목업처럼 보이던" 문제는 이미 해결된 상태다.
- **`components/ui/Button.tsx`, `components/ui/ButtonRow.tsx`** — `variant: primary|secondary`,
  `href`/`onClick` 겸용, 항상 `min-h-touch min-w-touch`. 다만 **`app/glossary/page.tsx`
  한 곳에만 적용되어 있고**, town/shop/quest-log/parent/money-tree/building 화면들은 여전히
  손으로 짠 `<Link className="min-h-touch ... rounded-control ...">`를 각자 반복 중이다.
- **15개 건물 전부** 데이터(`data/buildings.ts`)와 전용 미니게임 컴포넌트
  (`components/minigame/**`)가 이미 구현되어 있다(1구역 3개, 2구역 4개, 3구역 8개 — district
  2·3까지 이미 완료된 상태. `docs/phases.md`의 진행 표를 다시 확인해서 동기화할 필요가 있다).
- **`components/dialogue/StorySceneViewer.tsx`** — 개념 스토리 씬 뷰어가 실제로 존재하고,
  `store/useGameStore.ts`에 `storySeen`/`setBuildingStorySeen`도 있다. 단, **현재는
  `app/money-tree/page.tsx`(standalone) 한 곳에서만 사용 중**이고, `/building/[id]`
  (`BuildingIntroView.tsx`)에는 아직 연결되지 않았다 — `docs/tasks/concept-story-layer.md`가
  부분적으로만 진행된 상태.
- **용어사전 확장**(`docs/tasks/glossary-expansion.md`)은 T1·T2까지 완료 — `data/glossary.ts`가
  `category`/`longDefinitionKo`/`metaphorKo`/`exampleKo`/`relatedBuildingId`/`relatedTermIds`를
  전부 갖추고 있고, `app/glossary/page.tsx`는 카테고리별 아코디언 UI로 이미 재구성되어 있다.

### 1-2. 아직 안 되어 있는 것 (이 문서가 다룰 범위)

- **`app/globals.css`의 `body` 규칙에 `word-break: keep-all; overflow-wrap: break-word;`가
  아직 없다.** `docs/design-revision.md`가 지목한 모바일 버튼 줄바꿈 문제의 CSS 레벨 원인은
  그대로 남아 있다.
- **`components/town/DistrictLayer.tsx`/`BuildingHotspot.tsx`는 여전히 `flex flex-wrap`**이고
  `line-clamp-2`나 고정 카드 높이가 없다 — 건물 그리드가 들쭉날쭉해지는 문제도 미해결.
- **전역 헤더가 없다.** `app/town/layout.tsx`에만 헤더(코인월렛 + 퀘스트뱃지 + 사운드토글)가
  있고, 이건 **`/town` 라우트에서만** 렌더링된다. `/glossary`, `/shop`, `/quest-log`,
  `/parent`, `/money-tree`, `/building/[id]/*` 어디에서도 코인이 얼마인지, 소리가 켜져
  있는지조차 확인할 수 없다.
- **화면 간 이동 수단이 사실상 "마을로 돌아가기" 링크 하나뿐이다.** `town/page.tsx`의
  `<nav>`(퀘스트로그/상점/용어사전/보호자용 텍스트 링크 4개)도 마을 화면 안에서만 보이고,
  일단 건물이나 용어사전에 들어가면 반드시 `/town`으로 돌아온 다음에야 다른 메뉴로 갈 수
  있다. 예를 들어 상점에서 바로 용어사전으로 가는 길이 없다.
- **하단 내비게이션이 아예 없다.**
- **스플래시가 없다.** `app/page.tsx`는 `"use client"` 컴포넌트로, `useEffect`에서
  닉네임 유무만 보고 `router.replace("/town" | "/onboarding")`를 즉시 호출한다. 화면에는
  아무것도 그려지지 않고 `return null`이다.
- **`data/commonContent.ts`의 `townNav`에는 "마을(홈)" 항목과 "도감(almanac)" 항목이 아직
  없다**(현재 4개: questLog/shop/glossary/parent). 도감(`docs/tasks/theory-deepdive.md`)은
  아직 라우트 자체가 없으므로 이번에도 dead link를 만들지 않는다.

이 두 그룹을 합치면 방향이 명확해진다: **AppShell/Button 같은 뼈대는 이미 있으니 새로 만들지
않고, 그 위에 "항상 보이는 헤더 + 하단 탭바" 레이어와 "짧은 스플래시" 레이어만 얹는다.**
`word-break: keep-all` 전역 규칙과 건물 그리드 CSS 정리는 이번에 같이 처리한다(원래
design-revision 작업의 남은 조각이라 여기서 마무리하는 게 자연스럽다).

---

## 2. 스플래시 화면

### 2-1. 목표

- 그림 에셋 없이 **타이포그래피 + 기본 기호(이모지/유니코드 글리프)**만으로 구성. `$`, `🪙`,
  `💰`, `✨` 같은 걸 화면에 흩뿌리듯 배치하고 애니메이션만으로 재미를 준다.
- "머니모니" 워드마크는 이미 세팅되어 있는 `font-jua`(`app/layout.tsx`의 `Jua` 폰트,
  `components/hud`에 `GameLogo.tsx`가 CLAUDE.md 주석에 언급되어 있음 — 실제 파일 존재
  여부는 구현 시 확인)를 그대로 쓴다.
- **길게 잡지 않는다**: 1.2~1.8초 내외로 짧게, 탭/클릭하면 즉시 스킵.
- `settings.reducedMotion`(이미 스토어에 있는 필드, `app/parent/page.tsx`에서 토글 가능)이
  켜져 있으면 움직이는 연출을 걷어내고 페이드 정도만 남긴다.
- 매번(콜드 로드마다) 짧게 보여주는 것으로 충분하다 — "최초 1회만" 같은 별도 저장 상태는
  두지 않는다(이미 `app/page.tsx`가 앱의 유일한 진입점이라 자연스럽게 앱을 새로 열 때만
  보이게 된다).

### 2-2. 동작 흐름

```
/  (SplashScreen 렌더)
   ├─ 애니메이션 재생 (또는 reducedMotion이면 짧은 페이드)
   ├─ 자동 종료 타이머(예: 1500ms) 또는 화면 탭 → 스킵
   └─ 종료 시: 기존 app/page.tsx의 리다이렉트 로직 실행
              (nickname 있으면 /town, 없으면 /onboarding)
```

`app/page.tsx`는 지금도 클라이언트 컴포넌트이고 `useGameStore`의 `nickname`을 이미 읽고
있으므로, 리다이렉트 타이밍만 "스플래시 종료 콜백" 뒤로 미루면 된다. **단, `HydrationGuard`가
`hasHydrated`를 확인하기 전까지는 `nickname`이 아직 확정되지 않은 상태**이므로, 스플래시
자체는 `HydrationGuard` 통과 여부와 무관하게(순수 장식이니) 먼저 보여줘도 되지만, 실제
리다이렉트 목적지 계산은 여전히 하이드레이션 이후에 해야 한다 — 지금 로직 그대로 유지.

### 2-3. 비주얼 구성 (구현 가이드)

- 배경: `bg-primary-light`(이미 토큰 있음, AppShell 바깥 배경과 같은 톤이라 자연스럽게
  이어짐) 위에 중앙 정렬.
- 중앙: `font-jua text-display text-primary`로 "머니모니" 워드마크. `motion`(이미
  `package.json`에 `motion@^12`로 설치되어 있음 — Framer Motion 개명판)의 스프링
  트랜지션으로 스케일 0.8→1.05→1 바운스.
- 워드마크 주변에 `$`, `🪙`, `💰` 몇 개를 `motion`의 `animate`로 위아래 살짝 떠다니게
  (`y: [0, -8, 0]` 반복) 배치. 개수는 6~8개 이내로 절제 — 화려한 일러스트가 아니라
  "글자와 기호만으로 재미"라는 요청 취지를 지킨다.
- 하단에 작은 캡션 한 줄(예: "자본주의 생존기, 머니타운" — `docs/idea.md`/기존
  `metadata.description`과 톤 맞춤), `text-caption text-muted`.
- 탭/클릭 시 즉시 스킵되도록 전체를 `role="button"`에 준하는 클릭 핸들러로 감싼다(스크린
  리더 사용자를 위해 "건너뛰기" 텍스트 버튼도 하나 눈에 안 띄게 우하단에 둔다 — 완전히
  숨기지 않는다).
- GSAP은 이번 스플래시처럼 "제한된 프레임 안에서 정확히 짧게 재생"하는 데도 잘 맞지만,
  이미 `motion`이 상태 기반 트랜지션에 쓰이고 있으니(용어사전 아코디언 등과 톤을 맞추려면)
  **`motion` 하나로 통일**하는 걸 권장 — GSAP은 나중에 개별 미니게임의 정밀 타임라인에만
  쓴다는 기존 역할 분담(`docs/implementation.md`)을 유지.

---

## 3. 전역 상단 헤더 (`AppHeader`)

### 3-1. 배치 위치

`app/layout.tsx`의 `AppShell` **안쪽**, `HydrationGuard`보다 **바깥쪽**에 둔다. 즉:

```
<AppShell>
  <AppHeader />       {/* 항상 렌더 — 하이드레이션 이전엔 코인 등은 0/기본값으로 잠깐 보일 수 있음 */}
  <HydrationGuard>{children}</HydrationGuard>
  <BottomNav />
</AppShell>
```

다만 코인 숫자 등은 `hasHydrated` 이전에 0으로 깜빡였다가 실제 값으로 바뀌면 어색하므로,
`AppHeader` 내부에서도 `hasHydrated`를 직접 구독해서 하이드레이션 전에는 코인/퀘스트 숫자
자리에 스켈레톤(빈 pill)을 보여주고, 이후 실제 값으로 교체한다.

### 3-2. 구성 요소 (기존 HUD 컴포넌트 재사용)

- 좌측: 뒤로가기 또는 로고. **경로에 따라 달라진다**:
  - `/town`(홈)일 때: "머니타운" 워드마크(작게, `font-jua`) — 여기선 뒤로가기 불필요.
  - 그 외 화면: `router.back()` 대신 **명시적으로 `/town`으로 가는 뒤로가기 아이콘 버튼**을
    쓴다(현재 앱 안에서 브라우저 히스토리가 항상 예측 가능하지 않으므로 — 기존
    `commonContent.backToTownKo`가 이미 "마을로 돌아가기"라는 문구를 쓰고 있으니 그 의미를
    그대로 아이콘화).
- 중앙 또는 우측: 기존 `CoinWallet`, `SoundToggle`을 그대로 재사용(이미 `components/hud/`에
  있음, 새로 안 만듦).
- 우측: `QuestBadge` — 지금 `town/layout.tsx`에서 쓰던 것과 동일하게 클릭 시 `/quest-log`로
  이동.

### 3-3. `town/layout.tsx` 정리

지금 `TownLayout`이 갖고 있던 헤더(coins/questBadge/soundToggle 계산 로직)는 그대로
`AppHeader`로 옮기고, `app/town/layout.tsx`는 **레이아웃 파일 자체를 삭제**하거나
BGM 훅 같은 town 전용 로직만 남긴다(현재 `TownLayout`엔 헤더 렌더 외 다른 책임이 없으므로
삭제가 더 단순하다 — `useDistrictBgm`은 이미 `town/page.tsx`에서 별도로 호출 중이라 중복
없음 확인 필요).

---

## 4. 하단 내비게이션 (`BottomNav`)

### 4-1. 탭 구성 (5개, 아이콘 + 짧은 한글 라벨)

| 탭 | 아이콘 | 라벨(`commonContent.bottomNav.*`) | 이동 경로 |
|---|---|---|---|
| 마을 | 🏠 | 마을 | `/town` |
| 퀘스트 | 📋 | 퀘스트 | `/quest-log` |
| 상점 | 🛍️ | 상점 | `/shop` |
| 사전 | 📖 | 사전 | `/glossary` |
| 보호자 | 👪 | 보호자 | `/parent` |

- 라벨은 기존 `townNav`의 "퀘스트 로그"/"용어 사전" 같은 풀네임 대신 **탭바 전용 2글자
  라벨**을 새로 만든다(풀네임은 각 페이지 `<h1>`에 그대로 남아 있으니 정보 손실 없음). 이건
  `docs/design-revision.md`가 지적한 "모바일에서 버튼 텍스트가 줄바꿈/찌그러짐" 문제를 탭바
  단계에서부터 원천 차단하는 선택이다 — 5칸짜리 좁은 탭에 긴 텍스트를 넣지 않는다.
- 도감(almanac)은 아직 라우트가 없으므로 **이번엔 6번째 탭을 추가하지 않는다.**
  `docs/tasks/theory-deepdive.md`가 구현되어 `/almanac` 라우트가 생기면, 그때
  `commonContent.bottomNav`에 항목을 추가하고 5→6탭으로 확장한다(하드코딩된 죽은 링크를
  만들지 않는다는 이 프로젝트의 기존 원칙과 동일하게 적용).
- 현재 탭 하이라이트: `usePathname()`으로 현재 경로가 어느 탭에 해당하는지 판정(예:
  `/building/*`나 `/money-tree`는 "마을" 탭을 활성 상태로 표시 — 건물/미니게임 화면은
  마을 지도의 하위 화면이라는 위계를 시각적으로 유지).

### 4-2. 스타일

- `AppShell`의 `max-w-app` 안쪽 하단에 고정(`sticky bottom-0` 또는 `AppShell` 내부
  flex 레이아웃에서 `mt-auto`), `bg-surface`, 상단 테두리 `border-t border-border`.
- 각 탭 버튼은 반드시 `min-h-touch min-w-touch`(기존 유틸 그대로), 세로로 아이콘 위/라벨
  아래 배치, 라벨엔 `whitespace-nowrap`보다는 **`word-break: keep-all`가 전역으로 적용된
  뒤이므로 2글자 라벨 자체가 줄바꿈될 일이 없다.**

---

## 5. 포커스 모드 — 미니게임 중엔 상단/하단 다 숨김

미니게임 플레이 화면(`/building/[id]/minigame`, `/money-tree`의 게임 중 화면)에서까지
헤더/탭바가 떠 있으면 아이가 게임 중 실수로 탭바를 눌러 이탈하거나, 좁은 화면에서 게임
캔버스 공간을 뺏길 수 있다. 그래서:

- 새 클라이언트 컴포넌트 `AppChrome`(헤더+하단내비를 감싸는 래퍼, 또는 각각에 개별 적용)이
  `usePathname()`을 보고 다음 조건이면 두 요소를 렌더링하지 않는다(완전히 숨김, `opacity`
  아님 — 게임 캔버스가 그 공간을 온전히 쓰도록):
  - `pathname.endsWith("/minigame")`
  - 스플래시 화면(`/`, 스플래시가 끝나기 전)
- 대신 미니게임 화면에는 이미 `MiniGameShell`(`components/minigame/MiniGameShell.tsx`)이
  자체적으로 재시도 버튼 등을 갖고 있으니, 거기에 작은 "나가기(뒤로가기)" 아이콘 버튼만
  추가하면 충분하다(이미 `BuildingMinigameView.tsx`에 "뒤로가기" 링크가 있음 — 그대로 유지).

---

## 6. 데이터 정리 (`data/commonContent.ts` 확장)

기존 `townNav`(4개)는 유지하되(아직 그 문자열을 참조하는 곳이 있을 수 있음), 새로 아래
블록을 추가한다:

```ts
bottomNav: {
  home: "마을",
  questLog: "퀘스트",
  shop: "상점",
  glossary: "사전",
  parent: "보호자",
},
splash: {
  wordmarkKo: "머니모니",
  captionKo: "자본주의 생존기, 머니타운",
  skipKo: "건너뛰기",
},
header: {
  backToTownAriaKo: "마을로 돌아가기",
},
```

---

## 7. 가독성 관련 CSS 정리 (design-revision 잔여 작업, 이번에 같이 처리)

- `app/globals.css`의 `body` 규칙에 추가:
  ```css
  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-body);
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  ```
- `components/town/DistrictLayer.tsx`: `flex flex-wrap gap-3` → `grid grid-cols-2 gap-3
  sm:grid-cols-3`.
- `components/town/BuildingHotspot.tsx`: 고정 높이(`h-24` 등) + 제목에 `line-clamp-2` 추가.

이 세 가지는 `docs/tasks/design-system-revision.md`에 원래 있던 항목인데 아직 반영되지
않았으므로, 이번 하단내비/헤더 작업과 화면이 겹치는 김에 같이 정리하는 게 효율적이다.

---

## 8. 남은 "뒤로가기 링크" 정리 방향 (선택, 일관성용)

이번 작업으로 상단 헤더에 "마을로 돌아가기"가 상시 노출되므로, 각 페이지 하단에 중복으로
있던 개별 `<Link href="/town">마을로 돌아가기</Link>`들은 **제거해도 된다**(단, 게임 결과
화면처럼 "완료 후 확실한 다음 행동"으로서 의미가 있는 버튼은 유지 — 예:
`BuildingResultView.tsx`의 "마을로 돌아가기"는 완료 축하 흐름의 일부라 남겨도 무방).
이 정리는 필수는 아니고, 하는 김에 `Button`/`ButtonRow` 컴포넌트로 교체하면
`docs/tasks/design-system-revision.md`의 미완료 항목(전 화면 Button 적용)도 자연히
진행된다.
