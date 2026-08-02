# Task: 디자인/레이아웃 시스템 리비전

> `docs/design-revision.md`(진단 + 방향)를 실제 파일에 적용하는 단계별 작업이다. Claude Code에 "이 문서의 T1부터 순서대로 진행해줘"라고 전달하면 된다. 각 Task를 마칠 때마다 체크박스를 갱신한다.

---

## 0. 작업 전 확인

- [x] `docs/design-revision.md` 전체를 읽는다
- [x] `app/globals.css`, `app/layout.tsx`, `app/town/layout.tsx`, `components/town/TownMap.tsx`·`DistrictLayer.tsx`·`BuildingHotspot.tsx`, `components/hud/CoinWallet.tsx`·`QuestBadge.tsx`·`SoundToggle.tsx`, `app/onboarding/page.tsx`, `app/building/[id]/BuildingIntroView.tsx`·`result/BuildingResultView.tsx`, `components/dialogue/NpcDialogue.tsx`·`ReflectionPrompt.tsx`의 현재 내용을 다시 한번 확인한다(이 문서의 스니펫과 실제 파일이 그 사이 달라졌을 수 있음) — 3개 Explore 서브에이전트로 전수 재확인한 결과 문서 진단과 실제 코드가 100% 일치했다(구현 전 상태).

---

## T1. 전역 한글 줄바꿈 규칙 + 프레임 토큰 — `app/globals.css`

`@theme inline` 블록에 다음 토큰을 추가한다(기존 토큰은 그대로 둔다):

```css
/* 고정폭 게임 캔버스 — docs/design-revision.md 2-1 */
--shadow-frame: 0 8px 30px rgba(0, 0, 0, 0.12);
```

`body` 규칙을 다음과 같이 수정한다(한글 어절 단위 줄바꿈 + 안전장치):

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  word-break: keep-all;
  overflow-wrap: break-word;
}
```

- [x] 위 두 변경 반영 — 단, `--shadow-frame`은 `@theme inline` 토큰이 아니라 기존 `shadow-card`와 동일한 패턴(`@utility shadow-frame { box-shadow: ...; }`)으로 추가했다. 이 코드베이스의 그림자는 애초에 `--theme` 변수가 아니라 수동 `@utility`로 정의되어 있어(`shadow-card` 참고) 기존 컨벤션과의 일관성을 우선했다.
- [x] `word-break: keep-all`이 상속되므로 버튼/배지 등 하위 요소에 별도로 `break-keep` 클래스를 추가할 필요는 없다(Tailwind에 `break-keep` 유틸이 이미 존재하니, 혹시 특정 요소에서 상속이 깨지는 경우에만 개별적으로 `break-keep` 클래스를 보강한다) — 별도 보강 불필요했음을 e2e 오버플로 검증으로 확인.
- [x] (추가) `--container-app: 30rem;`을 `@theme inline`에 추가해 `max-w-app` 유틸리티로 사용 — 아래 T2 참고.

## T2. `AppShell` 컴포넌트 신설 — `components/layout/AppShell.tsx`(신규)

```tsx
import type { ReactNode } from "react";

// 고정폭 게임 캔버스 컨테이너. docs/design-revision.md 2-1 참고.
// 모바일에서는 화면 전체를 그대로 채우고, sm 이상에서는 가운데 고정폭으로 떠 있는 형태가 된다.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-primary-light sm:py-6">
      <div className="mx-auto flex min-h-full w-full max-w-[30rem] flex-col bg-background sm:min-h-0 sm:rounded-card sm:shadow-frame">
        {children}
      </div>
    </div>
  );
}
```

- [x] 위 파일 생성 — 단, `max-w-[30rem]` 임의값 대신 `--container-app: 30rem`(→ `max-w-app` 유틸리티)을 실제로 사용했다. 코드베이스 전체에 임의 대괄호 값(`max-w-[...]` 등)이 한 곳도 없어(CLAUDE.md 절대 규칙 4의 정신과 일치) 토큰 방식을 우선했고, Tailwind v4의 `--container-*` 네임스페이스가 `max-w-app` 유틸리티를 실제로 생성함을 로컬에서 확인했다(`getComputedStyle(...).maxWidth === '480px'`).
- [x] `app/layout.tsx`의 `<body>` 내부를 감싼다 — 단, 문서 스니펫과 순서를 바꿔 `SoundProvider > AppShell > HydrationGuard > children`으로 구현했다. 문서 원안(`HydrationGuard`가 `AppShell`보다 바깥)대로 하면 하이드레이션 로딩 중(`HydrationGuard`의 "불러오는 중..." 폴백)에는 프레임이 전혀 안 보이다가 하이드레이션 완료 후 갑자기 프레임 안으로 콘텐츠가 스냅되는 레이아웃 점프가 생기기 때문에, 로딩 상태에서도 프레임이 항상 유지되도록 순서를 조정했다.
- [x] `AppShell` 안쪽(`bg-background`)과 바깥쪽(`bg-primary-light`) 배경이 라이트 테마 톤에서 자연스럽게 대비되는지 육안 확인 — 대비가 충분해 그라디언트로 바꾸지 않고 단색 `bg-primary-light` 그대로 유지했다.
- [x] (실사용 중 발견·추가 수정) 육안 확인 과정에서 `min-h-full`이 `body`의 퍼센트 높이 체인 문제로 제대로 동작하지 않아, 콘텐츠가 짧은 화면(건물 인트로 등)에서 프레임이 자기 콘텐츠 높이로만 쪼그라들고 바탕 배경이 뷰포트를 다 못 채우는 버그를 발견했다. `min-h-screen` + 안쪽 프레임 `flex-1`로 교체해 모든 화면에서 항상 전체 높이를 채우도록 수정하고, `BuildingIntroView.tsx`에도 `justify-center`를 추가해 콘텐츠가 세로 중앙에 오도록 맞췄다. e2e 프레임 높이 회귀 테스트는 없었으므로 `/shop`·`/quest-log`·`/money-tree` 등 추가 화면을 브라우저로 육안 재확인했다.

## T3. 공용 `Button`/`ButtonRow` 컴포넌트 — `components/ui/Button.tsx`, `components/ui/ButtonRow.tsx`(신규)

```tsx
// components/ui/Button.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white",
  secondary: "border border-border bg-surface text-primary",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const className = `min-h-touch min-w-touch inline-flex items-center justify-center rounded-control px-6 py-2 text-center text-body ${VARIANT_CLASS[variant]} ${disabled ? "opacity-40" : ""}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
```

```tsx
// components/ui/ButtonRow.tsx
import type { ReactNode } from "react";

// 모바일에서는 세로로 쌓고 sm 이상에서 가로로 배치한다.
// docs/design-revision.md 2-4 — 버튼 두 개를 좁은 화면에서 억지로 한 줄에 넣지 않는 것이 목적.
export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row">{children}</div>;
}
```

- [x] 두 파일 생성
- [x] `app/building/[id]/BuildingIntroView.tsx`의 버튼 영역(`<div className="flex gap-3">...`)을 `<ButtonRow>`+`<Button>`으로 교체(구역 잠김 상태의 단독 "마을로 돌아가기" 링크도 함께 교체)
- [x] `app/building/[id]/result/BuildingResultView.tsx`의 "마을로 돌아가기" 버튼을 `<Button href="/town" variant="secondary">`로 교체 — 단, 실제로는 `variant="primary"`를 유지했다. 이 화면은 버튼이 이것 하나뿐인 유일한 CTA이고 기존에도 `bg-primary`(채워진 스타일)였다. Button 컴포넌트 도입은 반복 코드를 통일하는 작업이지 시각적 스타일을 바꾸는 작업이 아니므로 기존 톤을 보존했다.
- [x] `app/onboarding/page.tsx`의 제출 버튼을 `<Button type="submit">`으로 교체
- [x] `components/dialogue/NpcDialogue.tsx`의 "다시 듣기"/"다음" 버튼, `components/dialogue/ReflectionPrompt.tsx`의 선택지 버튼은 크기·모양이 달라(pill, 좌측 정렬 등) 공용 `Button`을 그대로 쓰기보다 현재 스타일을 유지해도 무방하다 — 다만 `min-h-touch`는 계속 유지할 것 — 변경 없이 유지, `min-h-touch` 존재 재확인함.

## T4. 마을 지도 그리드 정리 — `components/town/DistrictLayer.tsx`, `BuildingHotspot.tsx`

`DistrictLayer.tsx`의 `<div className="flex flex-wrap gap-3">`를 다음으로 교체:

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
```

`BuildingHotspot.tsx`를 고정 높이 + 2줄 말줄임으로 변경:

```tsx
className={`min-h-touch min-w-touch flex h-24 flex-col justify-center rounded-control px-3 py-2 text-left transition ${
  locked ? "grayscale opacity-40" : "bg-surface text-ink shadow-card hover:scale-105"
}`}
```

```tsx
<span className="line-clamp-2 text-body font-semibold text-ink">{building.titleKo}</span>
```

- [x] 위 두 변경 반영(`h-24` 등 정확한 높이 값은 실제 building 제목 최장 길이 기준으로 2줄이 잘리지 않게 로컬에서 조정) — `h-24`가 최장 제목("박물관 (화폐의 역사)")에서도 2줄로 잘 담기는 것을 실측으로 확인, 조정 불필요했다.
- [x] `line-clamp-2`가 동작하려면 Tailwind의 line-clamp 플러그인/유틸이 활성화되어 있는지 확인(Tailwind v4는 `line-clamp-*`를 기본 제공하므로 별도 플러그인 설치는 보통 불필요 — 로컬에서 실제 렌더 확인) — 별도 설치 없이 정상 동작 확인.
- [x] 잠금 상태(`locked && <span>🔒 곧 열려요</span>`)와 완료 상태(`✅ 완료`) 텍스트도 카드 안에서 줄바꿈 없이 한 줄로 보이는지 확인, 필요하면 `text-caption` 아래에 `truncate` 추가 — `truncate` 추가함.

## T5. HUD 정렬 재확인 — `components/hud/*`

`AppShell`이 폭을 제약하면 `app/town/layout.tsx`의 헤더(`flex items-center justify-between gap-2 p-4`)는 대부분 자동으로 해결된다. 다음만 추가로 확인한다.

- [x] `CoinWallet`, `QuestBadge`, `SoundToggle`이 헤더 안에서 서로 겹치거나 너무 붙지 않는지(`gap-2`가 충분한지) 375px 폭에서 확인 — 문제 없음.
- [x] `QuestBadge`의 카운트 배지(`absolute -right-1 -top-1`)가 두 자리 숫자(예: "12")일 때 잘리지 않는지 확인, 필요하면 `min-w-[1.25rem]` 추가 — 임의값 대신 Tailwind 기본 스페이싱 스케일의 `min-w-5`(1.25rem)를 추가했다.

## T6. 시각 회귀 검증 — Playwright

- [x] 기존 `e2e/` 설정을 활용해 `/town`, `/onboarding`, `/building/museum` 세 화면을 375px(모바일), 768px(태블릿), 1440px(데스크톱) 뷰포트로 스크린샷 캡처하는 테스트를 추가(신규 파일 또는 기존 스모크 테스트에 뷰포트 매트릭스 추가) — `e2e/layout-viewports.spec.ts` 신규 추가(9개 테스트: 3화면 × 3뷰포트). 스크린샷 대신 bounding box/scrollWidth 단언으로 구현해 CI에서 안정적으로 재현 가능하게 했다.
- [x] 1440px 스크린샷에서 본문이 화면 가운데 고정폭 프레임 안에 담기고 바깥에 배경이 채워지는지 확인 — `.max-w-app` 프레임의 폭이 480px로 고정되고 좌우에 여백이 생기는지 단언으로 검증.
- [x] 375px 스크린샷에서 버튼 텍스트가 어절 단위로만 줄바꿈되거나 한 줄에 들어가는지, 컨테이너 밖으로 넘치는 텍스트가 없는지 확인(스크립트로 각 버튼 요소의 `scrollWidth <= clientWidth` 단언을 추가해도 좋다) — 구현함. 단, `QuestBadge`처럼 알림 배지가 의도적으로 부모 박스 밖으로 걸치는 요소(`absolute` 자식을 가진 요소)는 오탐 방지를 위해 검사에서 제외했다.

## T7. 문서 동기화

- [x] `CLAUDE.md`의 "절대 규칙"에 다음을 추가할지 검토: "신규 화면은 `AppShell` 내부에서만 조립하고, 버튼은 `components/ui/Button`/`ButtonRow`를 통해서만 만든다 — 직접 `<button>`/`<Link>`에 유틸 클래스를 반복 작성하지 않는다" — 절대 규칙 8로 추가했다(AppShell은 `app/layout.tsx`에서 전역으로 이미 감싸므로 "버튼은 Button/ButtonRow로만 만든다" 위주로 표현).
- [x] `CLAUDE.md`의 아키텍처 맵에 `components/layout/`, `components/ui/` 카테고리 추가 — 완료.
- [x] `docs/phases.md`에 이번 리비전을 별도 항목(예: "Phase 2.5 · 디자인 시스템 리비전")으로 기록할지 검토 — "Phase 6.5 · 디자인/레이아웃 시스템 리비전"으로 Phase 6과 7 사이에 기록했다(Phase 6 QA/폴리시 이후 발견된 리비전이라 2.5보다 6.5가 시간 순서에 맞는다고 판단).

---

## 완료 기준(Definition of Done)

- [x] `npm run lint`, `npm run typecheck`, `npm run test` 모두 통과
- [x] 1440px 데스크톱 뷰포트에서 모든 주요 화면이 가운데 고정폭 프레임 안에 담기고, 프레임 바깥은 빈 여백이 아니라 배경으로 채워진다
- [x] 375px 모바일 뷰포트에서 버튼 텍스트가 어색하게(음절 단위로) 잘려 줄바꿈되는 곳이 없다
- [x] 마을 지도 건물 그리드가 제목 길이와 무관하게 균일한 카드 크기로 정렬된다
- [x] 기존 기능(온보딩→마을→건물→미니게임→결과, 스토리 씬 등)이 레이아웃 변경 이후에도 동일하게 동작한다 — 기존 e2e 6개 테스트(district-unlock-flow, onboarding-flow, money-tree-flow) 회귀 없음으로 확인.
