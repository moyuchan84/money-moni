# 머니모니(MoneyMoni) 구현 기술 문서 — UI 구조 · 라이브러리 리서치 · 화면/챕터별 구현 상세

> 전제: `docs/idea.md`(기획안)에서 확정한 머니타운(마을 키우기 RPG) 세계관, 3구역(저금통마을/은행마을/투자타워) 15개 모듈, 게임 루프(코인·퀘스트 로그·아바타/마을 이중 레벨)를 그대로 구현 대상으로 삼습니다. 이 문서는 "무엇을 만들지"가 아니라 **"무엇으로, 어떻게 만들지"**에 집중합니다.

---

## 1. 기술 스택 최종 추천

리서치 결과를 종합한 결론부터 정리합니다. 각 판단 근거는 2장에 있습니다.

| 영역 | 추천 라이브러리 | 대안/보완 |
|---|---|---|
| 프레임워크 | Next.js (App Router) + TypeScript, `output: 'export'`로 정적 사이트 빌드 | — |
| 스타일링 | Tailwind CSS + 디자인 토큰(CSS 변수) | — |
| 전역 상태/저장 | Zustand + `persist` 미들웨어(localStorage) | — |
| UI 전환·제스처 애니메이션 | Motion(구 Framer Motion) | — |
| SVG/캐릭터 정밀 애니메이션 | GSAP (+ ScrollTrigger, MorphSVG — 2025년부터 전면 무료) | — |
| 인터랙티브 캐릭터(표정·상태 변화) | Rive + `@rive-app/react-canvas` | 예산/일정 부족 시 Lottie로 대체 |
| 미니게임 캔버스 렌더링 | PixiJS + `@pixi/react` | 단순 정적 배치·드래그 조작만 필요한 화면은 Konva(react-konva) |
| 물리 기반 미니게임(저울·지렛대) | Matter.js (PixiJS와 함께) | — |
| 구조화된 드래그 앤 드롭(항아리 배분, 카드 조합 등) | dnd-kit | — |
| 사운드(BGM/SFX) | Howler.js (+ react-howler) | — |
| 내레이션(음성 안내) | 사전 녹음 mp3(정적 자산) 우선 + Web Speech API 보조 | — |
| 보상 연출(파티클) | canvas-confetti(간단) / PixiJS 파티클(정교) | — |
| 폰트 | 아동 친화 라운드체 한글 웹폰트(3장 참고) | — |

---

## 2. 라이브러리 리서치 근거

### 2-1. UI 애니메이션: GSAP vs Motion(Framer Motion)

두 라이브러리는 성격이 다릅니다. **Motion**은 React 상태에 반응해 선언적으로 애니메이션을 기술하는 방식이라 버튼 등장, 모달/드로어 전환, 드래그 제스처처럼 "상태 → 화면"으로 바로 연결되는 UI 애니메이션에 강합니다. **GSAP**는 타임라인을 직접 제어하는 명령형 방식으로, 여러 요소를 밀리초 단위로 순서대로 조율해야 하는 연출(예: 화폐 역사 타임라인, 나무가 갈라지며 자라는 연출, 시장 물가 요정 등장 시퀀스)에 강점이 있습니다. 특히 SVG 모핑(MorphSVG)과 정밀 시퀀싱은 GSAP가 명확히 우위이고, GSAP는 2025년 4월부터 유료 플러그인을 포함해 전면 무료로 전환되어 상업 프로젝트에도 제약이 없습니다. Framer Motion은 2025년 2월 "Motion"으로 리브랜딩되었습니다.

**결론**: 버튼·카드·모달·페이지 전환·드래그 제스처 같은 "인터페이스 애니메이션"은 Motion, 캐릭터/나무/타임라인처럼 "연출이 있는 씬"은 GSAP로 역할을 분담합니다.

참고: [GSAP vs Framer Motion in 2026: An Honest Verdict](https://www.hontran.dev/blog/gsap-vs-framer-motion), [GSAP vs Framer Motion, Motion & Anime.js 2026 비교 (Annnimate)](https://annnimate.com/compare)

### 2-2. 캔버스/2D 렌더링: Fabric.js vs Konva vs PixiJS

세 라이브러리 모두 캔버스 위에 오브젝트를 그리지만 강점이 다릅니다. Fabric.js는 선택·드래그·크기조정 핸들이 기본 내장되어 있어 오브젝트를 직접 조작하는 에디터류에 적합하고, Konva(및 React 바인딩 react-konva)는 씬 그래프 기반이라 React 컴포넌트 트리와 자연스럽게 맞물리며 레이어 단위 성능 최적화가 쉽습니다. PixiJS는 WebGL 렌더러로 세 라이브러리 중 성능이 가장 높고, 스프라이트·파티클·틱(tick) 기반 게임 루프가 내장되어 있어 실제로 "움직이는 게임 장면"을 만들기에 가장 적합합니다.

**결론**: 머니타운의 미니게임 대부분(룰렛, 롤러코스터 vs 튜브 트랙 비교, 물가 요정 이벤트, 지렛대 균형 게임 등)은 연속적으로 움직이는 게임 루프가 필요하므로 **PixiJS**를 기본으로 채택합니다. 카드 나열·조합처럼 정적 배치 후 드래그만 필요한 화면은 굳이 WebGL을 쓸 필요가 없어 **dnd-kit + 일반 DOM/SVG**로 구현합니다(3-3 참고).

참고: [Fabric.js vs Konva vs PixiJS: Canvas & 2D Graphics 2026 (PkgPulse)](https://www.pkgpulse.com/guides/fabricjs-vs-konva-vs-pixijs-canvas-2d-graphics-2026), [Konva.js FAQ](https://konvajs.org/docs/faq.html)

### 2-3. 인터랙티브 캐릭터: Rive

Rive는 디자인 툴에서 벡터 캐릭터를 만들고 "상태 머신(State Machine)"을 붙여 내보낸 뒤, 웹에서는 상태 값만 바꿔주면 캐릭터가 자동으로 표정·동작을 전환하는 방식입니다. 예를 들어 저금통 펫 캐릭터의 상태를 게임 로직에서 `mood: "happy" | "neutral" | "worried"`로 바꾸면, 저축액이 늘 때 웃고 지출이 과할 때 시무룩해지는 반응을 별도의 프레임 애니메이션 코드 없이 구현할 수 있습니다. React 런타임(`@rive-app/react-canvas`)이 공식 제공됩니다.

**결론**: 마을 촌장 NPC, 저금통 펫, 아바타의 감정 반응처럼 "여러 상태를 오가는 캐릭터"는 Rive로 제작하는 것을 권장합니다. 디자이너 리소스가 부족한 MVP 단계에서는 우선 정적 SVG + Motion 조합으로 대체하고, 이후 Rive로 교체하는 점진적 접근도 가능합니다.

참고: [awesome-rive (공식 예제 모음)](https://github.com/rive-app/awesome-rive), [Integrating Rive into a React Project (Codrops)](https://tympanus.net/codrops/2025/05/12/integrating-rive-into-a-react-project-behind-the-scenes-of-valley-adventures/)

### 2-4. 드래그 앤 드롭: dnd-kit

react-beautiful-dnd는 Atlassian이 유지보수를 공식 중단한 상태라 신규 프로젝트에 적합하지 않습니다. 대안은 dnd-kit과 Pragmatic drag-and-drop인데, dnd-kit은 주간 280만 다운로드로 사실상 표준 지위이며 번들이 6KB로 가볍고, `PointerSensor`로 마우스와 터치를 동일하게 처리하며, 키보드 내비게이션과 스크린 리더 공지를 기본 제공해 접근성 대응이 쉽습니다. Pragmatic DnD는 더 저수준이라 커스터마이징 자유도는 높지만 접근성을 직접 구현해야 합니다.

**결론**: 용돈 항아리 배분(6-3), 가계부 수입/지출 분류(6-2), ETF 카드 조합(6-11)처럼 "정해진 목표 지점으로 오브젝트를 옮기는" 구조화된 드래그 인터랙션에는 **dnd-kit**을 사용합니다.

참고: [dnd-kit vs react-beautiful-dnd vs Pragmatic DnD 2026 (PkgPulse)](https://www.pkgpulse.com/guides/dnd-kit-vs-react-beautiful-dnd-vs-pragmatic-drag-drop-2026)

### 2-5. 사운드: Howler.js

Howler.js는 브라우저 간 오디오 재생 차이(포맷, 동시 재생, 모바일 정책)를 감춰주는 사실상의 표준 웹 오디오 라이브러리입니다. React 래퍼(react-howler)도 있지만, BGM 전환·SFX 동시 재생·음소거 토글처럼 게임 특성이 강한 요구에는 Howler.js를 Zustand 스토어와 직접 연결하는 커스텀 훅(`useSound()`)으로 감싸는 편이 더 유연합니다.

### 2-6. 내레이션(음성 안내): Web Speech API의 한계와 대안

초1 학생은 아직 읽기가 느리거나 서툰 경우가 많아, 각 화면의 지시문을 소리로 들려주는 기능이 중요합니다. 브라우저 내장 `SpeechSynthesis`(Web Speech API)는 별도 자산 없이 바로 쓸 수 있지만, 비표준 API라 브라우저·OS별로 사용 가능한 한국어 음성 목록과 품질이 들쭉날쭉하고, 안드로이드 크롬에서는 일시정지/재개가 제대로 동작하지 않는 등 호환성 이슈가 보고되어 있습니다. 또한 사용자의 클릭 등 상호작용 없이는 재생이 막히는 브라우저 정책도 있습니다.

**결론**: 정적 사이트이므로 서버 TTS를 실시간으로 돌릴 필요는 없습니다. 콘텐츠 제작 단계에서 각 화면의 핵심 대사를 클라우드 TTS(또는 성우 녹음)로 **미리 mp3로 생성해 정적 자산으로 번들**하는 방식을 기본으로 하고, 사용자가 직접 입력하거나 실시간 생성이 필요한 극히 일부 텍스트(예: 이름 입력 확인)에 한해 Web Speech API를 보조 수단으로 사용합니다. 이렇게 하면 음질과 속도가 기기에 관계없이 일정하게 유지됩니다.

참고: [Web Speech API로 프론트엔드에서 TTS 구현하기](https://wormwlrm.github.io/2024/03/09/Web-Speech-API.html)

### 2-7. 상태 저장: Zustand + persist, 그리고 Next.js 하이드레이션 이슈

Zustand의 `persist` 미들웨어는 스토어를 자동으로 localStorage에 직렬화하지만, Next.js처럼 서버에서 먼저 렌더링(SSR/SSG) 후 클라이언트에서 다시 렌더링하는 구조에서는 "서버에는 저장된 값이 없고 클라이언트에는 있는" 불일치로 하이드레이션 경고가 발생하기 쉽습니다. 실무에서는 스토어에 `hasHydrated` 플래그를 두고, `onRehydrateStorage` 콜백에서 이를 true로 바꾼 뒤, 그 값이 true가 되기 전에는 저장된 상태를 렌더링에 반영하지 않고 스켈레톤/로딩 화면을 보여주는 패턴이 널리 쓰입니다. 이 프로젝트는 `output: 'export'`로 완전한 정적 사이트로 빌드하므로 서버 렌더링 자체가 빌드 타임에만 일어나 런타임 SSR 이슈는 없지만, 최초 정적 HTML과 클라이언트 하이드레이션 사이의 불일치는 동일하게 주의가 필요합니다.

참고: [Fix Next.js hydration error with Zustand state management](https://medium.com/@koalamango/fix-next-js-hydration-error-with-zustand-state-management-0ce51a0176ad)

---

## 3. 아동 대상 디자인/인터랙션 가이드라인

Nielsen Norman Group 등 아동 UX 리서치를 종합하면, 만 7~9세는 정밀한 손가락 조작(소근육 운동)이 아직 발달 중인 단계입니다. 이 연령대를 위한 구체적 원칙은 다음과 같습니다.

**터치 타겟은 성인 기준의 약 4배**를 권장합니다(최소 2cm × 2cm). 버튼, 건물 클릭 영역, 드래그 가능한 오브젝트 모두 넉넉한 크기로 잡습니다. **정밀한 드래그 조작은 피하거나 대안을 함께 제공**합니다 — 마우스/트랙패드로 작은 오브젝트를 정확히 끌어다 놓는 것은 이 연령대에 특히 어렵기 때문에, 드래그가 필요한 미니게임은 "탭하면 자동으로 이동" 같은 대체 조작을 함께 제공하는 것이 좋습니다. **터치스크린에서는 스와이프/탭 위주로, 데스크톱에서는 단순 클릭이나 방향키 정도로** 인터랙션을 단순화합니다.

이 외에 이 프로젝트에 적용할 원칙을 추가합니다. 텍스트는 한 화면에 2~3문장을 넘기지 않고, 모든 지시문에는 음성 안내(2-6)를 함께 제공합니다. 실패해도 벌칙 없이 "다시 해볼까?"로 유도하는 긍정적 피드백을 기본으로 하고, 색약 학생을 고려해 정보를 색으로만 구분하지 않고(예: 저금통 상태는 색 + 표정 아이콘을 함께 사용) 형태·아이콘을 함께 씁니다. 개인정보는 이름(닉네임)과 아바타 설정 정도만 로컬에 저장하고 서버로 전송하지 않습니다.

참고: [Design for Kids Based on Their Stage of Physical Development (NN/G)](https://www.nngroup.com/articles/children-ux-physical-development/), [A Practical Guide To Design For Children (Smart Interface Design Patterns)](https://smart-interface-design-patterns.com/articles/design-guidelines-children/)

---

## 4. 디자인 토큰 초안

폰트는 가독성보다 "친근함"이 우선인 헤드라인/버튼 영역에는 라운드형 한글 폰트 후보(배달의민족 주아체류, 여기어때 잘난체류, 카페24 써라운드류 등 무료 상업용 한글 폰트)를 검토하고, 본문/설명 텍스트처럼 정확히 읽혀야 하는 영역은 Noto Sans KR 등 가독성이 검증된 폰트를 사용해 두 트랙으로 나누는 것을 권장합니다(실제 채택 전 각 폰트의 최신 라이선스 조건을 배포 시점에 다시 확인해야 합니다).

색상 팔레트는 구역별로 톤을 살짝 구분합니다 — 1구역(저금통마을)은 따뜻한 노랑/주황 계열, 2구역(은행마을)은 신뢰감 있는 파랑/초록 계열, 3구역(투자타워)은 조금 더 다이나믹한 보라/청록 계열처럼, 아이가 지도만 봐도 "여긴 다른 동네구나"를 색으로 느끼게 합니다. 색상은 배경/텍스트 대비를 WCAG AA 이상으로 맞추고, 코인·경고·성공 같은 상태색은 색약 대비까지 고려해 아이콘과 함께 사용합니다.

---

## 5. 정보 구조 & 라우팅 (Next.js App Router)

전체 저장 데이터가 클라이언트(localStorage)에만 있고 서버 API가 필요 없으므로, `next.config.js`에서 `output: 'export'`로 완전한 정적 사이트로 빌드합니다. 건물/구역처럼 아이디로 갈리는 화면은 빌드 타임에 `generateStaticParams`로 모든 슬러그를 미리 정적 HTML로 뽑아둡니다.

```
app/
  layout.tsx                 // 폰트, 전역 Provider(Zustand 하이드레이션 가드, 사운드 Provider) 로딩
  page.tsx                   // 첫 진입: 세이브 있으면 /town, 없으면 /onboarding으로 이동
  onboarding/
    page.tsx                 // 닉네임 + 아바타 커스터마이징 (Rive 또는 SVG 파츠 조합)
  town/
    layout.tsx                // 공통 HUD: 코인 지갑, 퀘스트 알림 배지, 사운드/TTS 토글
    page.tsx                  // 전체 마을 지도 (SVG 아이소메트릭, 구역/건물 핫스팟)
  building/
    [buildingId]/
      page.tsx                // 건물 진입 씬: 개념 설명 애니메이션 + NPC 대사
      minigame/
        page.tsx              // 미니게임 화면 (PixiJS 또는 dnd-kit 기반, 동적 임포트)
      result/
        page.tsx               // 결과/회고 질문 + 보상(코인, 배지) 지급
  money-tree/
    page.tsx                  // 아바타 개인 마당의 복리 나무 위젯 상세 화면
  quest-log/
    page.tsx                  // 일일/주간 퀘스트 목록
  shop/
    page.tsx                  // 코인으로 아바타 아이템/마을 장식 구매
  glossary/
    page.tsx                  // 용어 미니사전 (기획안 9장 콘텐츠)
  parent/
    page.tsx                  // (선택) 보호자용 요약 대시보드, 학습 진행도만 표시
data/
  buildings.ts                // 15개 모듈의 정적 메타데이터(제목, 구역, NPC 대사, 잠금조건, 보상)
  quests.ts                   // 일일/주간 퀘스트 정의
  glossary.ts                 // 용어 사전 데이터
store/
  useGameStore.ts             // Zustand 루트 스토어 (아래 6장 스키마)
components/
  town/ (TownMap, DistrictLayer, BuildingHotspot)
  hud/ (CoinWallet, QuestBadge, SoundToggle)
  dialogue/ (NpcDialogue, ReflectionPrompt)
  minigame/ (MiniGameShell, PixiCanvas, DndTargetZone)
  feedback/ (RewardCelebration, ProgressBadge)
```

건물 진입(`/building/[id]`)과 미니게임(`/building/[id]/minigame`)을 분리한 이유는, 무거운 PixiJS/Rive 자산을 미니게임 라우트에서만 `next/dynamic(..., { ssr: false })`로 지연 로딩해 마을 지도와 건물 소개 화면은 가볍게 유지하기 위해서입니다(9장 성능 참고).

---

## 6. 게임 상태 스키마 (Zustand)

전 레벨을 하나의 세이브로 통합한다는 결정(기획안 7장)을 그대로 반영해, 스토어를 하나의 세이브 오브젝트로 설계합니다.

```ts
interface GameState {
  hasHydrated: boolean;               // Next.js 하이드레이션 가드용

  avatar: {
    nickname: string;
    look: { skin: string; hair: string; outfit: string; pet: string };
    level: number;
    exp: number;
  };

  wallet: {
    coins: number;                    // 게임 내 가상 화폐(머니타운 코인)
    history: { amount: number; reason: string; at: string }[];
  };

  districts: {
    1: { unlocked: true };            // 1구역은 항상 열림
    2: { unlocked: boolean };         // 1구역 진행도 충족 시 true
    3: { unlocked: boolean };
  };

  buildings: Record<BuildingId, {
    introSeen: boolean;
    minigameBestScore?: number;
    completedAt?: string;
    reflectionAnswer?: string;        // 하브루타식 회고 질문 답(선택 저장)
  }>;

  moneyTree: {
    stage: number;                    // 성장 단계
    lastWateredAt?: string;
    history: ("harvest" | "replant")[];
  };

  quests: {
    daily: { id: string; progress: number; goal: number; claimedAt?: string }[];
    weekly: { id: string; progress: number; goal: number; claimedAt?: string }[];
  };

  settings: {
    soundOn: boolean;
    narrationOn: boolean;
    reducedMotion: boolean;           // 접근성: 애니메이션 최소화 옵션
  };
}
```

`persist` 미들웨어로 이 전체를 localStorage에 저장하고, `onRehydrateStorage`에서 `hasHydrated`를 true로 바꾼 뒤에만 마을 진행 상태를 화면에 반영합니다(2-7 참고). 이렇게 스키마를 처음부터 하나로 통합해두면 이후 미니게임을 추가할 때도 `buildings` 레코드에 항목만 추가하면 되어 구조를 다시 설계할 필요가 없습니다.

---

## 7. 공통 컴포넌트 & 인터랙션 패턴

모든 화면에서 재사용되는 컴포넌트를 먼저 정의해두면 15개 모듈 각각을 훨씬 빠르게 조립할 수 있습니다.

**`<TownMap />`**: SVG 아이소메트릭 마을 배경 위에 건물 개수만큼 `<BuildingHotspot>`을 절대 좌표로 배치합니다. 잠긴 구역/건물은 `grayscale` 필터와 자물쇠 아이콘으로 표시하고, hover/tap 시 Motion의 `whileHover`/`whileTap`으로 살짝 확대되는 반응을 줍니다. 배경의 잔잔한 움직임(깃발이 흔들리는 정도)은 GSAP의 반복 타임라인으로 별도 처리합니다.

**`<NpcDialogue />`**: 말풍선 UI + 좌측 캐릭터(Rive 또는 정적 SVG) + 우측 텍스트 + 재생 버튼(사전 녹음 mp3 재생, 2-6 참고)으로 구성합니다. 텍스트는 타자기 효과(Motion의 `useAnimate` 또는 간단한 커스텀 훅)로 한 글자씩 나타나게 해 리듬감을 줍니다.

**`<MiniGameShell />`**: 모든 미니게임 화면의 공통 틀입니다. 상단에 목표 설명(텍스트+음성), 중앙에 실제 게임 캔버스(PixiJS Stage 또는 dnd-kit 컨텍스트), 하단에 "다시 하기" 버튼을 배치하고, 게임 완료 시 `onComplete(score)` 콜백으로 결과를 상위(라우트)에 전달해 `/building/[id]/result`로 이동시킵니다. 실제 렌더러(Pixi 인스턴스 등)는 `next/dynamic({ ssr: false })`로 이 셸 안에서만 로드합니다.

**`<RewardCelebration />`**: 코인 획득/퀘스트 완료 시 공통으로 쓰는 보상 연출입니다. 간단한 경우 canvas-confetti로 화면 전체에 코인 모양 파티클을 뿌리고, 미니게임 내부처럼 이미 PixiJS 컨텍스트가 떠 있는 화면에서는 PixiJS 파티클 컨테이너를 재사용해 별도 라이브러리 로딩 없이 처리합니다.

**`<ReflectionPrompt />`**: 미니게임 종료 후 "왜 그렇게 선택했어?" 같은 하브루타식 질문을 2~3개의 짧은 선택지 카드로 제시합니다(초1~2 저학년은 자유 서술보다 선택형이 부담이 적습니다). 선택 결과는 `buildings[id].reflectionAnswer`에 저장해 추후 보호자 요약(`/parent`)에 활용할 수 있습니다.

---

## 8. 화면/챕터별 구현 상세

아래는 기획안의 15개 모듈과 허브 화면을 라우트 단위로 매핑하고, 각 화면에서 구체적으로 어떤 라이브러리·기법을 쓰는지 정리한 것입니다. 반복되는 패턴(가계부류 분류 게임, 룰렛류 확률 게임 등)은 대표 화면에서 상세히 설명하고 나머지는 차이점만 짚습니다.

### 8-1. 허브 화면

| 화면 | 라우트 | 핵심 구현 |
|---|---|---|
| 아바타 생성 | `/onboarding` | SVG 파츠(머리/피부/옷)를 레이어로 겹쳐 조합, Motion으로 파츠 전환 시 살짝 바운스. 완료 시 Zustand `avatar` 초기화 |
| 마을 지도 | `/town` | `<TownMap />`(7장), 구역별 색 톤(4장), 진입 시 GSAP로 카메라가 줌인하는 인트로 1회 재생 |
| 퀘스트 로그 | `/quest-log` | 리스트 UI, 완료 시 `<RewardCelebration />`, 데이터는 `quests.ts` 정의 + 스토어 진행도 결합 |
| 상점 | `/shop` | 그리드 카드, 구매 시 코인 차감 애니메이션(숫자 카운트다운은 Motion의 `animate` 숫자 트위닝) |
| 용어 사전 | `/glossary` | 검색/카테고리 필터만 있는 단순 리스트, 무거운 애니메이션 불필요 |

### 8-2. 1구역 · 저금통 마을

**박물관(화폐의 역사, `/building/museum`)**: 가로로 긴 타임라인을 GSAP `ScrollTrigger`로 스크롤에 맞춰 진행시킵니다. 각 정거장(조개껍데기 → 동전 → 지폐 → 카드 → 디지털화폐)에 도달하면 해당 시대 시장 장면이 페이드인되고, 미니게임에서는 dnd-kit으로 "내가 가진 물건을 오늘 시대의 화폐로 교환"하는 드래그 매칭을 시킵니다. 마지막 정거장에서 조개껍데기로 교환을 시도하면 실패 애니메이션(흔들림, Motion의 `shake` 커스텀 variant)이 재생됩니다.

**가계부 오두막(`/building/ledger-house`)**: 미니게임은 제한 시간 동안 화면 위에서 떨어지는 동전 아이콘을 좌/우 두 통(수입/지출)으로 드래그하는 분류 게임입니다. 오브젝트가 여러 개 동시에 움직여야 하므로 PixiJS(틱 기반 낙하 물리)로 구현하고, 통 자체는 DOM 오버레이로 두어 히트테스트만 좌표 비교로 처리합니다.

**용돈 배분 광장(`/building/allowance-square`)**: 4개의 항아리(소비/위시/저축/기부)에 동전을 dnd-kit으로 드래그해 담습니다. 이 화면은 순수 UI 인터랙션이라 PixiJS 없이 dnd-kit + Motion만으로 충분합니다. 항아리가 채워지는 정도는 SVG `clipPath`의 높이를 상태에 따라 Motion으로 트윈해 액체가 차오르는 느낌을 냅니다. 배분이 끝나면 다음 주 이벤트(생일선물/이웃돕기) 결과를 짧은 스토리 카드로 보여줍니다.

### 8-3. 2구역 · 은행 마을

**은행(저축·이자, `/building/bank`)**: 이자율 슬라이더(Radix UI Slider 등 헤드리스 컴포넌트 + 커스텀 스타일, 또는 직접 구현)를 움직이면 저금통 SVG 안 동전 개수가 차오르는 속도가 실시간으로 바뀝니다. 이 애니메이션은 GSAP 타임라인의 `timeScale()`을 슬라이더 값에 바인딩해 구현하면, 속도 변화가 끊김 없이 부드럽게 이어집니다.

**머니나무 마당(`/money-tree`)**: 복리 개념의 핵심 화면입니다. 나무는 SVG 경로로 그리고, 가지가 갈라지는 성장은 GSAP `DrawSVGPlugin` 없이도 `strokeDasharray`/`strokeDashoffset` 트윈으로 구현 가능합니다(2025년 전면 무료화로 MorphSVG까지 쓸 수 있다면 가지 모양 자체를 단계별로 모핑). "열매를 먹을지 다시 심을지" 선택은 매일 1회 접근 가능한 버튼으로 제한해, 실제 저축 습관처럼 하루 단위 리듬을 만듭니다.

**직업소개소(소득의 종류, `/building/job-center`)**: 세 캐릭터(일꾼/사장님/농장주) 중 하나를 골라 플레이하는 짧은 하루 시뮬레이션입니다. 각 캐릭터의 하루 일과는 3~4개의 정적 장면 전환(Motion의 `AnimatePresence`)만으로 충분히 표현되므로 PixiJS 없이 구현합니다.

**시장(인플레이션, `/building/market`)**: "물가 요정" 이벤트가 등장해 가격표 숫자가 스스륵 올라가는 연출이 핵심입니다. PixiJS 파티클로 요정 캐릭터가 날아다니게 하고, 가격 숫자는 Motion의 숫자 카운트업 애니메이션으로 처리합니다. 미니게임은 제한된 100원으로 최대한 많은 사탕을 담는 타이밍 게임으로, PixiJS 틱 루프 위에서 사탕 가격이 실시간으로 변합니다.

**자본 도구창고(`/building/capital-warehouse`)**: 여러 직업의 도구를 비교 전시하는 정적 갤러리로, 무거운 인터랙션 없이 Motion의 스태거(stagger) 등장 애니메이션 정도로 충분합니다.

### 8-4. 3구역 · 투자 타워

**투자 씨앗밭(`/building/seed-field`)**: 확률 룰렛 미니게임입니다. PixiJS로 룰렛 휠을 그리고 `requestAnimationFrame` 기반 감속 트윈(easeOut)으로 멈추는 지점을 결과값에 맞춰 계산합니다(결과를 먼저 정한 뒤 멈출 각도를 역산하는 방식이 구현이 단순합니다).

**주식회사 거리(`/building/stock-street`)**: 신제품 투표 → 다음날 케이크(주가) 크기 변화라는 2단계 화면입니다. 케이크 크기 변화는 Motion의 `scale` 트윈, 투표 UI는 카드 선택 컴포넌트로 충분합니다.

**ETF 조합소(`/building/etf-lab`)**: 여러 과자 카드 중 몇 개를 골라 바구니를 만드는 화면으로, dnd-kit의 다중 드롭존 기능을 사용합니다. 결과 비교(바구니 전체 변동폭 vs 개별 종목 변동폭)는 간단한 라인 차트로 보여주는데, 이 프로젝트의 데이터 시각화 요소이므로 색상·형태 설계 시 접근성 있는 차트 팔레트 원칙을 적용합니다.

**금고(`/building/gold-vault`)**: 여러 시대를 지나오는 스토리 챌린지로, GSAP 타임라인 기반의 자동 재생 시퀀스에 사용자는 "다음" 버튼만 누르는 저부담 인터랙션입니다.

**코인 정거장(`/building/coin-station`)**: 롤러코스터(코인) vs 튜브 트랙(스테이블코인) 비교가 핵심으로, 두 트랙 모두 PixiJS에서 같은 시간 동안 다른 진폭의 웨이브 경로로 캐릭터를 이동시켜 시각적으로 "출렁임의 차이"를 대비시킵니다.

**대출 창구(`/building/loan-counter`)**: 유일하게 물리 시뮬레이션이 필요한 화면입니다. Matter.js로 지렛대(막대)와 추(돌, 빌린 돈)를 실제 물리 바디로 생성하고, PixiJS를 렌더러로 붙여(`pixi.js` + `matter-js` 조합) 사용자가 추를 더할 때마다 저울이 실시간으로 기우는 모습을 물리 엔진이 자동 계산하게 합니다. 일정 각도 이상 기울면 "손해" 상태로 판정합니다.

**세 갈래 실험마을(자본주의/사회주의/공산주의, `/building/triple-village`)**: 세 개의 병렬 씬을 스와이프(Motion의 `drag="x"` + 스냅)로 전환하며 같은 "빵집 운영" 미니게임을 서로 다른 규칙으로 반복시킵니다. 규칙 차이(내가 만든 만큼 갖는지, 똑같이 나누는지)는 게임 로직 레벨에서 결과 분배 함수만 바꿔 재사용성을 높입니다. 민감한 주제이므로 이 화면에는 정답 배지 대신 "네 생각은 어때?" 형태의 `<ReflectionPrompt />`만 배치하고 우열을 매기지 않습니다.

---

## 9. 성능 최적화

캐릭터/캔버스 라이브러리(PixiJS, Rive)는 무겁기 때문에 마을 지도 진입 시점의 초기 번들에는 포함하지 않습니다. 각 건물의 미니게임 컴포넌트는 `next/dynamic(() => import(...), { ssr: false, loading: () => <MiniGameSkeleton /> })`으로 해당 라우트에 진입할 때만 로드합니다. 사운드 자산(BGM/내레이션 mp3)도 구역에 진입할 때만 프리로드하도록 Howler의 `preload: false` 옵션과 라우트 전환 훅을 조합합니다. 이미지/SVG는 SVGO로 최적화하고, 마을 전체 지도처럼 큰 SVG는 `viewBox` 기반 반응형으로 만들어 화면 크기별 별도 자산 없이 대응합니다. `settings.reducedMotion`이 켜져 있으면 GSAP/Motion 애니메이션 지속시간을 전역적으로 단축하거나 생략하는 래퍼 훅을 공통으로 둡니다.

---

## 10. 안전/개인정보 고려사항

회원가입이나 실명·이메일 수집 없이 닉네임만으로 시작하고, 모든 진행 데이터는 기기 로컬(localStorage)에만 저장해 외부로 전송하지 않는 것을 원칙으로 합니다. 게임 내 화폐(코인)는 실제 화폐/결제 수단과 무관함을 상점 화면에 명시하고, 인앱결제·외부 링크·채팅 기능은 두지 않습니다. 정적 사이트이므로 별도 서버가 없어 사용자 데이터 유출 위험 자체가 구조적으로 낮다는 점도 장점입니다. 보호자용 화면(`/parent`)을 둘 경우에도 아이의 학습 진행도(완료한 건물, 회고 답변)만 보여주고 그 외 개인정보는 다루지 않습니다.

---

## 11. 구현 우선순위 (제안)

1단계는 게임 루프의 뼈대(온보딩 → 마을 지도 → 코인 지갑 → 퀘스트 로그 → 1구역 3개 건물)를 세워 "실제로 플레이가 도는지" 검증하는 데 집중합니다. 이때 Rive·PixiJS 같은 고급 자산은 자리표시자(정적 SVG, CSS 애니메이션)로 두고, Zustand 스키마와 라우팅 구조를 먼저 확정합니다. 2단계에서 1구역 화면들을 실제 비주얼(GSAP 타임라인, PixiJS 미니게임)로 교체하며 공통 컴포넌트(`<MiniGameShell>`, `<NpcDialogue>` 등)를 다지고, 이후 2·3구역은 이미 검증된 컴포넌트를 재사용해 콘텐츠만 채워나가는 방식으로 속도를 낼 수 있습니다. 물리 기반 화면(대출 창구)과 스와이프형 병렬 씬(세 갈래 실험마을)처럼 기술적으로 새로운 패턴이 필요한 화면은 3구역 초반에 미리 프로토타입을 만들어 리스크를 앞당겨 확인하는 것을 권장합니다.

---

## 12. 참고 자료

- [GSAP vs Framer Motion in 2026: An Honest Verdict](https://www.hontran.dev/blog/gsap-vs-framer-motion)
- [GSAP vs Framer Motion, Motion & Anime.js — 2026 Comparisons (Annnimate)](https://annnimate.com/compare)
- [Fabric.js vs Konva vs PixiJS: Canvas & 2D Graphics 2026 (PkgPulse)](https://www.pkgpulse.com/guides/fabricjs-vs-konva-vs-pixijs-canvas-2d-graphics-2026)
- [Konva.js FAQ](https://konvajs.org/docs/faq.html)
- [awesome-rive](https://github.com/rive-app/awesome-rive)
- [Integrating Rive into a React Project (Codrops)](https://tympanus.net/codrops/2025/05/12/integrating-rive-into-a-react-project-behind-the-scenes-of-valley-adventures/)
- [dnd-kit vs react-beautiful-dnd vs Pragmatic DnD 2026 (PkgPulse)](https://www.pkgpulse.com/guides/dnd-kit-vs-react-beautiful-dnd-vs-pragmatic-drag-drop-2026)
- [Web Speech API로 프론트엔드에서 TTS 구현하기](https://wormwlrm.github.io/2024/03/09/Web-Speech-API.html)
- [Fix Next.js hydration error with Zustand state management](https://medium.com/@koalamango/fix-next-js-hydration-error-with-zustand-state-management-0ce51a0176ad)
- [Design for Kids Based on Their Stage of Physical Development (NN/G)](https://www.nngroup.com/articles/children-ux-physical-development/)
- [A Practical Guide To Design For Children (Smart Interface Design Patterns)](https://smart-interface-design-patterns.com/articles/design-guidelines-children/)
