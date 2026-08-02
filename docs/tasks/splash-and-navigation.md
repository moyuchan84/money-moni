# Task: 스플래시 화면 + 전역 상단 헤더/하단 내비게이션 구현

> `docs/splash-and-navigation.md` 스펙을 실제 파일에 적용한다. Claude Code에
> "이 문서의 T1부터 순서대로 진행해줘"라고 전달한다.
>
> ⚠️ 시작 전 확인: 이 태스크를 작성하는 시점 기준으로 `components/layout/AppShell.tsx`,
> `components/ui/Button.tsx`/`ButtonRow.tsx`, `components/dialogue/StorySceneViewer.tsx`,
> 15개 건물 미니게임, 용어사전 확장(T1·T2)은 **이미 구현되어 있다.** 이 태스크는 그 위에
> 헤더/하단내비/스플래시만 추가하는 것이므로, 위 파일들을 다시 만들거나 구조를 바꾸지 않는다.
> 작업 전에 `git status`/`git diff`로 로컬에 아직 커밋 안 된 변경이 있는지 먼저 확인해서
> 충돌 없이 이어서 작업한다.

---

## T1. `data/commonContent.ts` 확장

- [ ] `bottomNav: { home, questLog, shop, glossary, parent }` (탭바 전용 2글자 라벨,
      `docs/splash-and-navigation.md` 6장 그대로) 추가
- [ ] `splash: { wordmarkKo, captionKo, skipKo }` 추가
- [ ] `header: { backToTownAriaKo }` 추가
- [ ] 기존 `townNav`는 그대로 둔다(다른 곳에서 참조 중일 수 있으니 이번 태스크에서 삭제하지
      않음 — T5에서 실제 미참조 확인 후 정리)

## T2. 전역 CSS/그리드 정리 (design-revision 잔여 작업)

- [ ] `app/globals.css`의 `body` 규칙에 `word-break: keep-all; overflow-wrap: break-word;`
      추가
- [ ] `components/town/DistrictLayer.tsx`: `flex flex-wrap gap-3` →
      `grid grid-cols-2 gap-3 sm:grid-cols-3`
- [ ] `components/town/BuildingHotspot.tsx`: 카드에 고정 높이 클래스 추가, 제목
      `<span>`에 `line-clamp-2` 추가
- [ ] 변경 후 `/town` 화면을 375px/768px/1440px 뷰포트에서 스크린샷으로 확인(그리드가
      들쭉날쭉하지 않은지)

## T3. `SplashScreen` 컴포넌트 + `app/page.tsx` 연동

- [ ] `components/splash/SplashScreen.tsx` 신규 작성
  - `motion`(패키지 이미 설치됨, `import { motion } from "motion/react"`) 사용해 워드마크
    스케일 바운스 + `$`/🪙/💰 기호 6~8개 떠다니는 애니메이션
  - `useGameStore((s) => s.settings.reducedMotion)` 구독 — true면 애니메이션 생략하고
    짧은 페이드만
  - 자동 종료 타이머(예: 1500ms, `reducedMotion`이면 800ms 정도로 단축) + 화면 전체 클릭
    시 즉시 스킵 + 우하단에 눈에 잘 안 띄지만 접근 가능한 "건너뛰기" 텍스트 버튼
    (`commonContent.splash.skipKo`)
  - 종료 시 `onDone()` 콜백 호출(부모가 리다이렉트 처리)
- [ ] `app/page.tsx` 수정: 기존 `useEffect` 리다이렉트 로직은 유지하되, 스플래시가 먼저
      렌더링되고 `onDone`에서 지금의 `router.replace(...)` 호출이 일어나도록 구조 변경
  - `return null` 대신 `<SplashScreen onDone={handleDone} />` 렌더
  - `nickname`은 이미 구독 중이므로 그대로 재사용, 계산 로직은 바꾸지 않는다

## T4. `AppHeader` 컴포넌트

- [ ] `components/layout/AppHeader.tsx` 신규 작성
  - `usePathname()`으로 `/town`인지 판정 → `/town`이면 좌측에 "머니타운" 워드마크(작게),
    아니면 뒤로가기 아이콘 버튼(`/town`으로 이동, `aria-label`은
    `commonContent.header.backToTownAriaKo`)
  - 우측에 기존 `CoinWallet`, `QuestBadge`(클릭 시 `/quest-log`), `SoundToggle` 그대로 재사용
    (신규 작성 금지 — `components/hud/`에서 import)
  - `hasHydrated` 이전엔 코인 숫자 자리를 스켈레톤(빈 pill)으로 표시
- [ ] `app/town/layout.tsx`에 있던 헤더 렌더 로직(coins/activeQuestCount 계산 포함)을
      `AppHeader`로 옮긴 뒤, `app/town/layout.tsx`는 헤더 렌더 부분을 제거한다(BGM 등
      town 전용 로직이 남아있는지 먼저 확인 — 없다면 파일 자체 삭제 검토)
- [ ] `app/town/page.tsx`의 인라인 `<nav>`(퀘스트로그/상점/용어사전/보호자용 텍스트 링크)는
      제거 — 이제 하단 내비(T5)가 그 역할을 대신한다

## T5. `BottomNav` 컴포넌트

- [ ] `components/layout/BottomNav.tsx` 신규 작성
  - `docs/splash-and-navigation.md` 4-1의 5개 탭(마을/퀘스트/상점/사전/보호자) 아이콘
    이모지 + `commonContent.bottomNav.*` 라벨
  - `usePathname()`으로 현재 탭 판정(`/building/*`, `/money-tree`는 "마을" 탭 활성 처리)
  - 각 탭 버튼은 `Link` 기반, `min-h-touch min-w-touch`, 활성 탭은 `text-primary` +
    아이콘 강조, 비활성은 `text-muted`
- [ ] 도감(almanac) 탭은 **추가하지 않는다** — `/almanac` 라우트가 없는 상태에서 죽은
      링크를 만들지 않는다(`docs/tasks/theory-deepdive.md`가 나중에 구현되면 그때 6번째
      탭으로 추가)

## T6. `AppShell`/`app/layout.tsx`에 헤더·하단내비 배선 + 포커스 모드

- [ ] `components/layout/AppShell.tsx`는 그대로 두고, `app/layout.tsx`에서
      `AppHeader`/`BottomNav`를 `AppShell` 안쪽, `HydrationGuard` 바깥쪽에 배치
      (`docs/splash-and-navigation.md` 3-1 코드 스니펫 그대로)
- [ ] 새 클라이언트 컴포넌트 `components/layout/AppChrome.tsx` 작성 — `usePathname()`이
      `/` 또는 `.../minigame`로 끝나면 `AppHeader`/`BottomNav`를 렌더링하지 않고, 그 외에는
      `children`과 함께 렌더링하는 래퍼로 만들어 `app/layout.tsx`를 깔끔하게 유지
  ```tsx
  // app/layout.tsx 예시
  <AppShell>
    <AppChrome>
      <HydrationGuard>{children}</HydrationGuard>
    </AppChrome>
  </AppShell>
  ```
- [ ] `app/building/[id]/minigame/BuildingMinigameView.tsx`의 기존 "뒤로가기" 링크는
      포커스 모드에서 유일한 이탈 경로가 되므로 그대로 유지(제거하지 않음)

## T7. 개별 페이지 "뒤로가기" 링크 정리 (선택, 일관성)

- [ ] `app/shop/page.tsx`, `app/quest-log/page.tsx`, `app/parent/page.tsx`,
      `app/money-tree/page.tsx`, `app/building/[id]/BuildingIntroView.tsx`,
      `app/building/[id]/minigame/BuildingMinigameView.tsx` 하단의 손으로 짠
      `<Link className="min-h-touch ...">` 뒤로가기 버튼들을 `components/ui/Button.tsx`
      (`variant="secondary"`)로 교체 — 헤더에 이미 뒤로가기가 있으므로 페이지 하단 버튼은
      제거해도 되지만, 제거 여부는 화면별 흐름을 보고 판단(예: `BuildingResultView.tsx`의
      "마을로 돌아가기"는 완료 축하 흐름의 일부이므로 유지 권장, 이때도 `Button` 컴포넌트로
      교체는 진행)
- [ ] 이 작업은 `docs/tasks/design-system-revision.md`의 "전 화면 Button 적용" 잔여
      항목과 같은 작업이므로, 이미 그 문서 기준으로 진행 중이었다면 중복 확인 후 병합

## T8. 테스트 및 검증

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` 통과
- [ ] Playwright로 `/`(스플래시 → 자동 이동), `/town`, `/glossary`, `/shop`, `/quest-log`,
      `/parent`, `/building/museum`, `/building/museum/minigame` 각각 375px/768px/1440px
      스크린샷 확인:
  - 스플래시가 800~1500ms 내 자동 종료되거나 탭으로 스킵되는지
  - 미니게임 화면(`/minigame`)에서만 헤더/하단내비가 사라지는지
  - 그 외 모든 화면에서 헤더(코인/사운드) + 하단 5탭이 항상 보이는지
  - 하단 탭 라벨이 2글자 고정이라 어떤 뷰포트에서도 줄바꿈되지 않는지
- [ ] `settings.reducedMotion`을 `/parent` 화면에서 켠 상태로 스플래시 재확인(움직임 축소
      + 시간 단축 확인)

## T9. 문서 동기화

- [ ] `CLAUDE.md`의 아키텍처 맵에 `components/layout/AppHeader.tsx`,
      `components/layout/BottomNav.tsx`, `components/layout/AppChrome.tsx`,
      `components/splash/SplashScreen.tsx` 추가
- [ ] `docs/phases.md`의 15개 건물 진행 표를 실제 구현 상태(district 2·3까지 완료)에 맞게
      갱신 — 이 태스크와 별개로 발견된 괴리이니 확인 차원에서 함께 처리 권장

---

## 완료 기준(Definition of Done)

- [ ] `/`에 진입하면 텍스트+기호 애니메이션 스플래시가 짧게 보이고, 탭하면 즉시 스킵되며,
      종료 후 닉네임 유무에 따라 `/town` 또는 `/onboarding`으로 자동 이동한다
- [ ] `/town`을 포함한 모든 일반 화면 상단에 코인/사운드/뒤로가기가 있는 헤더가 항상 보인다
- [ ] 모든 일반 화면 하단에 마을/퀘스트/상점/사전/보호자 5탭 내비가 항상 보이고, 탭 이동이
      화면 어디서든 즉시 가능하다(더 이상 `/town`을 거치지 않아도 됨)
- [ ] 미니게임 플레이 화면에서는 헤더/하단내비가 숨겨져 게임 캔버스가 화면을 온전히 쓴다
- [ ] 모바일(375px)에서 하단 탭 라벨이 줄바꿈되지 않는다
- [ ] 기존에 구현되어 있던 AppShell/Button/StorySceneViewer/15개 건물 미니게임/용어사전
      확장 기능은 전부 그대로 동작한다(회귀 없음)
