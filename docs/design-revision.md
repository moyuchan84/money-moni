# 머니모니 디자인/레이아웃 시스템 리비전 스펙

> 실제 코드(`app/globals.css`, `app/layout.tsx`, `app/town/layout.tsx`, `components/town/*`, `components/hud/*`, `app/onboarding/page.tsx`, `app/building/[id]/BuildingIntroView.tsx` 등)를 직접 읽고 진단한 내용을 기반으로 작성했다. "PC에서 목업처럼 덩그러니 보인다", "모바일 버튼 안 텍스트 줄바꿈/글씨크기가 이상하다"는 피드백의 원인을 코드 수준에서 짚고, 리비전 방향을 정의한다. 실행용 체크리스트는 `docs/tasks/design-system-revision.md`에 별도로 있다.

---

## 1. 문제 진단 (코드 근거)

### 1-1. PC에서 "목업처럼 덩그러니" 보이는 이유 — 컨테이너 부재

전체 코드베이스를 확인한 결과, **어떤 레이아웃에도 `max-width` + 가운데 정렬 컨테이너가 없다.** `app/layout.tsx`의 `<body className="min-h-full flex flex-col">`, `app/town/layout.tsx`의 `<div className="flex flex-1 flex-col">`, 각 건물/온보딩 화면의 `<main className="flex flex-1 flex-col gap-6 p-6">`까지 전부 폭 제약 없이 뷰포트 전체 너비를 그대로 차지한다. 이 앱은 사실상 "모바일 앱"처럼 설계된 화면(세로 스택, 큼직한 버튼, 하단 내비게이션 없음)인데, 그 화면을 1920px 데스크톱 브라우저 창에 폭 제약 없이 펼쳐놓으니 `TownLayout`의 헤더(코인 지갑 ↔ 퀘스트/사운드 버튼)는 화면 양 끝에 뚝 떨어져 붙고, 본문 콘텐츠는 왼쪽 정렬된 좁은 텍스트 덩어리로 남는다 — 이것이 "목업처럼 덩그러니"의 정체다. 글씨 크기(`--text-body: 1.125rem` 등)는 이미 아동 친화적으로 충분히 크게 잡혀 있으므로, 폰트 크기 자체를 더 키우는 방향은 원인 해결이 아니다. 문제는 **그 텍스트를 담을 "틀(프레임)"이 없다**는 것이다.

### 1-2. 모바일에서 버튼 텍스트 줄바꿈이 이상한 이유 — 한글 word-break 미설정

`app/globals.css`를 확인하면 `body` 규칙에 `word-break`/`word-wrap` 관련 설정이 전혀 없다. 브라우저 기본값(`word-break: normal` + `overflow-wrap: normal`)에서는 한글이 공백 없는 긴 문자열(버튼 라벨 등)일 때 음절 단위로 아무 데서나 잘려 줄바꿈될 수 있다(예: "미니게임 시작하기"가 "미니게임 시작하" + "기"처럼 어색하게 잘림). 한글 UI에서는 `word-break: keep-all`을 전역으로 걸어 어절 단위로만 줄바꿈되게 하는 것이 국내 프로덕트(토스, 네이버, 카카오 계열 등)의 표준 관행인데, 이 프로젝트에는 아직 적용되어 있지 않다.

추가로 버튼 레이아웃 자체도 줄바꿈을 유발하기 쉽게 짜여 있다. `app/building/[id]/BuildingIntroView.tsx`와 `BuildingResultView.tsx`의 버튼 영역은 `<div className="flex gap-3">` 안에 "미니게임 시작하기"(9자)와 "마을로 돌아가기"(8자) 두 버튼을 나란히 두는데, 좁은 모바일 폭(360~390px)에서는 `gap-3`(12px)까지 포함해 두 버튼의 내용 폭 합이 화면 폭을 초과하기 쉽다. 이 상태에서 `word-break` 기본값과 만나면 버튼 안 텍스트가 어색하게 여러 줄로 쪼개진다.

### 1-3. 건물 목록(마을 지도) 그리드가 들쭉날쭉한 이유

`components/town/DistrictLayer.tsx`는 건물 버튼들을 `flex flex-wrap gap-3`로만 배치하고, `components/town/BuildingHotspot.tsx`는 버튼 크기를 내용(텍스트 길이)에 맞춰 자동으로 정한다(`px-4 py-3`, 고정 폭/높이 없음). "박물관 (화폐의 역사)"처럼 긴 제목과 "은행 (저축·이자)"처럼 짧은 제목이 같은 줄에 섞이면 버튼 크기가 제각각이라 줄마다 높이·너비가 들쭉날쭉해진다. 이 역시 "PC에서 대충 만든 것 같다"는 인상에 크게 기여한다 — 명확한 그리드가 아니라 텍스트 길이에 따라 흘러가는 배치이기 때문이다.

### 1-4. 근본 원인 — 공용 레이아웃 셸의 부재

위 세 가지 증상은 사실 하나의 원인에서 갈라져 나온다. **페이지마다 레이아웃(컨테이너 폭, 패딩, 버튼 정렬 방식)을 각자 `flex`/`p-6` 조합으로 즉석에서 짜고 있고, 이를 통일하는 공용 컴포넌트(`AppShell`, 공용 `Button`, 그리드 컴포넌트)가 하나도 없다.** `CLAUDE.md`가 지금까지 다뤄온 규칙(터치 타겟 44px, `min-h-touch` 등)은 "크기"에 대한 규칙이었지 "레이아웃 구조"에 대한 규칙이 없었다는 것이 이번에 드러난 공백이다.

---

## 2. 리비전 방향

### 2-1. "고정폭 게임 캔버스" 컨테이너 도입

이 앱은 모바일 우선(세로 스크롤, 큰 버튼, 단일 컬럼)으로 설계된 게임형 UI이며, 이는 잘못된 선택이 아니다. 데스크톱에서 이 구조 자체를 다단 그리드로 새로 짜는 것은 과잉 대응이다. 대신 업계에서 흔히 쓰는 해법을 따른다 — **본문 전체를 하나의 고정 최대폭 컨테이너("게임 캔버스")에 넣고 뷰포트 안에서 가운데 정렬**하며, 그 바깥(데스크톱의 남는 공간)에는 은은한 배경 처리를 넣어 "빈 공간"이 아니라 "의도된 프레임"으로 보이게 한다. 컨테이너 최대폭은 480~560px(rem으로 `30rem`~`35rem`) 사이를 권장하고, 태블릿 이상에서는 살짝 더 넓혀도 좋지만(예: `40rem`) 데스크톱용 별도 다단 레이아웃은 만들지 않는다.

프레임 바깥 배경은 앱의 구역 컬러 토큰(`--color-primary-light`, district 컬러 등)을 활용한 은은한 그라디언트나 단색 톤을 추천하고, 프레임 자체에는 `shadow-card`보다 한 단계 진한 그림자(`shadow-frame` 신규 토큰)를 주어 "카드 위에 앱이 떠 있는" 느낌을 준다.

### 2-2. 브레이크포인트 전략

베이스(모바일)를 기본으로 하고, `sm`(≥640px)과 `md`(≥768px) 두 단계만 추가로 고려한다. 데스크톱 전용의 새로운 3단, 4단 브레이크포인트는 만들지 않는다 — 앞서 정한 "고정폭 캔버스"가 `sm`/`md` 이상에서는 그냥 화면 가운데 떠 있는 형태로 고정되기 때문에, 그 안의 내부 레이아웃은 모바일과 거의 동일하게 유지해도 된다. 브레이크포인트는 주로 다음 두 가지에만 사용한다. 첫째, 버튼 그룹이 좁은 화면에서는 세로로 쌓이고 `sm` 이상에서는 가로로 나란히 배치되는 정도의 조정. 둘째, 캔버스 바깥 여백/그림자가 `md` 이상에서만 보이도록 하는 처리.

### 2-3. 한글 텍스트 줄바꿈 규칙

전역 `body`(또는 `@layer base`)에 `word-break: keep-all`과 안전장치로 `overflow-wrap: break-word`를 함께 건다(아주 긴 영문/숫자 문자열이 keep-all과 만나 컨테이너를 뚫고 나가는 것을 방지하는 조합이다). 이 규칙 하나로 1-2에서 지적한 버튼 텍스트 어색한 줄바꿈 문제의 대부분이 해결된다.

### 2-4. 버튼 컴포넌트 통일

지금은 버튼마다 `<button>`/`<Link>`에 `min-h-touch min-w-touch rounded-control ... px-6 py-2 text-body ...` 조합을 페이지마다 손으로 반복 작성하고 있다(`BuildingIntroView.tsx`, `BuildingResultView.tsx`, `onboarding/page.tsx`, `NpcDialogue.tsx`, `ReflectionPrompt.tsx`에 유사하지만 미묘하게 다른 클래스 조합이 반복됨). 공용 `<Button>`(`primary`/`secondary` variant, 항상 `min-h-touch`, `whitespace-normal`이되 `keep-all` 상속, 텍스트 가운데 정렬, 내부 아이콘 슬롯 지원)을 만들고 기존 반복 코드를 이 컴포넌트로 교체한다. 이렇게 하면 향후 어떤 화면에 버튼을 추가하든 줄바꿈·정렬·크기 규칙이 자동으로 지켜진다.

버튼 그룹(두 개 이상의 버튼이 나란한 경우)은 기본적으로 **모바일 폭에서는 세로로 쌓이고(`flex-col`), `sm` 이상에서 가로로(`sm:flex-row`) 전환**되는 공용 `<ButtonRow>`를 함께 정의한다. 좁은 화면에서 굳이 두 버튼을 한 줄에 욱여넣지 않는 것이 줄바꿈 문제의 가장 근본적인 예방책이다.

### 2-5. 마을 지도 건물 그리드 정리

`DistrictLayer`/`BuildingHotspot`을 `flex flex-wrap`에서 **명시적 CSS 그리드(`grid grid-cols-2 sm:grid-cols-3`)** 로 바꾸고, 각 건물 버튼에 고정 높이(또는 `aspect-ratio`)와 `line-clamp-2`(제목이 두 줄을 넘지 않도록)를 적용해 제목 길이와 무관하게 카드 크기가 항상 일정하게 맞도록 한다. 균일한 그리드는 "정돈된 마을 지도"처럼 보이게 하는 가장 저비용 고효율 개선이다.

### 2-6. 타이포는 "크기"보다 "여백"을 재조정

앞서 진단했듯 폰트 크기 값 자체(`--text-*`)는 이미 아동 친화적이다. 이번 리비전에서는 값을 더 키우기보다, 컨테이너가 생기면서 자연히 확보되는 여백(카드 사이 `gap`, 섹션 사이 `space-y`)을 일관된 스케일(`--spacing-*` 기반 4/8pt 그리드)로 정리하는 데 집중한다. 다만 `text-caption`(0.9375rem=15px)처럼 보조 정보용 텍스트가 배지·버튼 안에서 지나치게 작아 보이는 사례가 있다면 개별적으로 `text-body`로 올리는 것은 허용한다.

---

## 3. 신규/변경 대상 컴포넌트 요약

| 컴포넌트 | 상태 | 역할 |
|---|---|---|
| `components/layout/AppShell.tsx` | 신규 | 전체 페이지를 감싸는 고정폭 캔버스 + 데스크톱 배경 프레임 |
| `components/ui/Button.tsx` | 신규 | `primary`/`secondary` variant, keep-all 상속, 항상 `min-h-touch` |
| `components/ui/ButtonRow.tsx` | 신규 | 모바일 세로 스택 → `sm` 이상 가로 배치 |
| `components/town/BuildingHotspot.tsx` | 변경 | 고정 높이 카드, `line-clamp-2` 적용 |
| `components/town/DistrictLayer.tsx` | 변경 | `flex flex-wrap` → `grid` |
| `app/globals.css` | 변경 | `word-break: keep-all`, `--shadow-frame`, 캔버스 최대폭 토큰 추가 |
| `app/layout.tsx` | 변경 | `<AppShell>`로 `children` 감싸기 |

기존에 이미 잘 만들어진 것(디자인 토큰 체계 자체, `min-h-touch`/`min-w-touch` 유틸, `NpcDialogue`/`ReflectionPrompt`의 카드 스타일)은 그대로 유지한다 — 이번 리비전은 "토큰을 새로 만드는 것"이 아니라 "이미 있는 토큰을 담을 그릇(컨테이너)과 그 그릇 안 배치 규칙을 만드는 것"이다.

---

## 4. 검증 방법

Playwright(`e2e/`에 이미 설정되어 있음)로 대표 화면(`/town`, `/onboarding`, `/building/museum`) 각각을 모바일 폭(375px), 태블릿 폭(768px), 데스크톱 폭(1440px) 세 가지 뷰포트에서 스크린샷을 찍어 비교한다. 모바일 스크린샷에서는 버튼 텍스트가 한 줄로(또는 keep-all 기준 자연스러운 어절 단위로만) 표시되는지, 데스크톱 스크린샷에서는 콘텐츠가 가운데 고정폭 프레임 안에 담기고 바깥에 배경이 채워지는지를 육안 + 텍스트 노드 overflow 여부(스크립트로 `scrollWidth > clientWidth` 체크)로 함께 확인한다.

## 5. 참고

- `docs/tasks/design-system-revision.md` — 이 스펙을 실제 파일에 적용하는 단계별 Task
- `CLAUDE.md` — 이번 리비전 이후 "AppShell/Button/ButtonRow 필수 사용" 규칙을 절대 규칙에 추가할 것을 권장(별도 작업)
