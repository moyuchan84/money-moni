# FOMO 대응 & 포트폴리오 실전 연습 게임화 설계

> 목적: "포트폴리오 구성 → 가격 트렌드 → FOMO(급등 추격 매수)/패닉(급락 공포 매도) 방지"를
> **용어사전 텍스트가 아니라 실제 게임/인터랙티브 연습**으로 아이가 반복 체험하게 만든다.
> `docs/investment-mindset-and-cycles.md`(용어 5종·스토리·경제 사계절 바퀴)의 후속 문서이며,
> 그 문서의 콘텐츠 안전 원칙을 그대로 상속한다. 새 건물/새 라우트는 만들지 않는다.

---

## 1. 왜 이 문서가 필요한가 (현재 상태 진단)

실제 코드를 다시 확인한 결과, 투자 마인드 관련 콘텐츠는 아래처럼 이미 여러 층에 존재한다.

| 레이어 | 파일 | 상태 |
|---|---|---|
| 용어사전 | `data/glossary.ts` (investor-mindset/portfolio/real-estate/commodity/economic-seasons) | ✅ 구현됨 |
| 스토리 대사 | `data/stockStreetContent.ts` scene 5~9 (다람쥐 할아버지의 인내심, 급등 테마 경계) | ✅ 구현됨 |
| 스토리 대사 | `data/etfLabContent.ts` scene 6~11 (사계절 농부의 포트폴리오 비유) | ✅ 구현됨 |
| 도감 위젯 | `components/almanac/interactive/EconomicSeasonsWheel.tsx` (계절 4개 → 자산 5개 반응) | ✅ 구현됨, 그러나 **수동 탐색 위젯**(점수·시행착오 없음, 도감 완료 후에만 진입) |
| **실제 게임** | `components/minigame/stockStreet/StockStreetGame.tsx` | 신제품 1개 투표 → "다음 날" 버튼으로 배수 공개. **매수/매도 타이밍 결정 없음, FOMO/패닉 유발 이벤트 없음** |
| **실제 게임** | `components/minigame/etfLab/EtfBasketGame.tsx` | 과자(맛) 카드를 드래그해 바구니 구성 → 변동성 비교. **한 카테고리(과자) 안에서만 분산, 주식/부동산/금/원자재/현금 같은 실제 자산군 배분은 없음** |

즉 아이는 "왜 나눠 담아야 하는지", "왜 유행을 쫓으면 안 되는지"를 **대사로 듣고 도감에서 눈으로만
확인**하지만, 정작 게임에서는 그 원칙을 **직접 써먹어 볼 결정 지점이 없다.** 사용자가 지적한
"용어사전에만 있다"는 정확히 이 지점 — 게임 메커닉이 스토리·용어 레이어를 따라가지 못한 것이다.

이 문서는 기존 두 게임을 확장해 다음 두 가지 결정 지점을 실제로 만든다.

1. **StockStreetGame** → 가격이 출렁이는 동안 "지금 살까/팔까/버틸까"를 직접 선택하며 FOMO·패닉을
   연습하는 모드 추가.
2. **EtfBasketGame** → 과자 비유 다음 단계로, `EconomicSeasonsWheel`과 동일한 5개 자산 아이콘으로
   실제 자산군 배분을 연습하고 여러 라운드(계절) 동안 몰빵 vs 분산 결과를 비교하는 모드 추가.

---

## 2. 콘텐츠 안전 원칙 (상속 + 1개 추가)

`docs/investment-mindset-and-cycles.md` 1장의 원칙 1~4를 그대로 따른다. **어떤 카피에도 "지금
사라/팔라"는 문장이 없어야 하고, 특정 시점에 특정 자산이 오른다/내린다를 예측·확정처럼 보여주면
안 된다.** 이번 문서에서 추가로 지켜야 할 원칙은 다음 하나다.

- **원칙 5 (행동 채점의 범위)**: 이 게임들이 점수를 매기는 대상은 **"무엇을 골랐는가"가 아니라
  "원칙대로 버텼는가"**다. 즉 특정 자산(주식이 좋다/부동산이 나쁘다)에 대한 판단이 아니라,
  이미 스토리에서 배운 행동 원칙(급등 추격 매수 자제, 급락 공포 매도 자제, 분산)을 지켰는지를
  객관적으로 계산 가능한 수치(최종 결과값)로 비교한다. 이는 `triple-village` 같은 가치관·정치적
  중립이 필요한 주제와 다르다 — `bank`(이자 계산), `loan-counter`(레버리지 위험) 등 기존 건물들도
  이미 "행동의 결과"를 객관적으로 채점해왔으므로, `CLAUDE.md` 절대 규칙 7(정답 판정 금지)의
  적용 대상이 아니다. 다만 **결과 화면 문구는 항상 "이렇게 하면 결과가 이랬어요" 서술형**으로
  쓰고, "네가 틀렸다/못했다"는 식의 인격 평가 문구는 쓰지 않는다.

---

## 3. StockStreetGame 확장 — "흔들리지 않는 마음" 모드

### 3-1. 현재 구조

`Phase = "vote" | "reveal"`. `IDEAS`(3개 신제품) 중 하나를 골라 `dayMultipliers` 배열을 순서대로
누적 곱해 케이크(🍰) 크기를 키우기만 하는 구조. 플레이어는 지켜볼 뿐, 결정할 타이밍이 없다.

### 3-2. 새 구조 제안

`Phase = "vote" | "chart" | "summary"` (기존 `"reveal"`을 `"chart"`로 대체·확장)

**`"chart"` 단계 흐름**

1. 선택한 신제품의 가격이 하루씩 지나가며 위아래로 움직인다(기존 `dayMultipliers` 개념 유지,
   케이크 크기 애니메이션도 재사용). 지난 며칠의 가격은 작은 점/막대로 화면에 남아 "가격 트렌드"가
   눈에 보이게 한다(신규 — 순수 `motion.div` 막대들의 높이 애니메이션으로 구현, Pixi 불필요.
   기존 `stock-street`/`etf-lab`은 둘 다 Pixi 없이 순수 Motion만 쓰는 카테고리이므로 그 패턴을 따른다).
2. 정해진 특정 날짜에 **이벤트**가 뜬다(스토리에서 이미 예고한 두 가지):
   - **`hype`(우르르 이벤트)**: "친구들이 다 이 조각을 사고 있어! 🏃🏃🏃" + 그 순간 가격이 이미
     확 오른 상태. 화면에 "지금 살래요" / "지켜볼래요" 두 버튼.
   - **`scare`(깜짝 이벤트)**: "안 좋은 소문이 돌아서 다들 팔고 있어! 😨" + 그 순간 가격이 확
     떨어진 상태. 화면에 "지금 팔래요" / "지켜볼래요" 두 버튼.
   - 두 버튼 모두 **결과는 다음 날 이후에나 드러난다** — 즉시 "정답"을 알려주지 않는다(안전 원칙과
     동일하게, 이 선택도 "그 순간엔 몰랐다"는 것을 체감하게 하기 위함).
3. 이벤트 없는 날은 기존처럼 "다음 날" 버튼만 있다.
4. 마지막 날 이후 `"summary"` 단계로 진입.

**`"summary"` 단계**

- `ComparisonBarChart`를 재사용해 **"버틴 나(플레이어의 실제 선택)"** vs **"휩쓸렸다면(이벤트마다
  항상 '지금 살래요/팔래요'를 눌렀을 때의 가상 결과)"** 최종 케이크 크기를 나란히 비교.
- 비교는 **사후 계산**으로만 하고(플레이어가 실제로 안 고른 가상 시나리오를 별도 시뮬레이션),
  "이렇게 하니 이런 결과가 나왔어요"로만 서술한다. 어느 쪽이 항상 이기게 확정 짓지 않는다 — 다만
  이벤트 지점의 배수 설계 자체를(§3-3) 원칙(추격 매수는 비싼 값에 사는 것, 공포 매도는 싼 값에
  파는 것)에 맞게 짜서, 장기적으로는 버티는 쪽이 대체로 더 나은 결과가 나오도록 한다 — 매번 100%
  이기게 하지 않고 **가끔은 버텨도 아쉬운 날도 있게** 만들어 "항상 이긴다"는 단정을 피한다
  (원칙 1: 실시간 시세 예측처럼 보이면 안 됨 — 확률적으로 설계).
- `stockStreetContent.reflection`을 이용한 `<ReflectionPrompt />`는 그대로 유지(이미 있음).

### 3-3. 데이터 모델 확장 (`data/stockStreetContent.ts`)

```ts
export interface PriceEvent {
  afterDayIndex: number;      // 이 날 이후에 이벤트 발생
  kind: "hype" | "scare";
  messageKo: string;
  actionLabelKo: string;      // "지금 살래요" / "지금 팔래요"
  waitLabelKo: string;        // "지켜볼래요"
  eventDayMultiplier: number; // 이벤트 발생 순간의 그 날 배수(hype는 급등, scare는 급락)
  chaseOutcomeMultiplier: number; // 이벤트에 즉시 반응했을 때, 그 다음 며칠간 추가로 곱해질 배수
}
```

`ideas` 각 항목에 `events?: PriceEvent[]` 필드를 선택적으로 추가(신제품마다 이벤트 유무/위치가
달라도 됨). 초기 버전은 3개 아이디어 중 1~2개에만 이벤트를 넣어 시작해도 무방.

### 3-4. 신규 순수 함수 유틸 — `components/minigame/stockStreet/disciplineMath.ts`

`loan-counter`의 `tiltMath.ts`와 같은 패턴(부수효과 없는 순수 함수 모음)으로 신설한다.

- `computeDisciplinedResult(idea, playerChoices): number` — 플레이어가 실제로 고른 선택대로 최종
  배수 계산
- `computeChasedResult(idea): number` — 이벤트마다 항상 "지금 살래요/팔래요"를 눌렀다고 가정한
  최종 배수 계산(비교용 가상 시나리오)
- 두 함수 모두 `idea.dayMultipliers` + `idea.events`만 입력받는 순수 함수 → 유닛 테스트 용이

---

## 4. EtfBasketGame 확장 — "나만의 포트폴리오 농장" 모드

### 4-1. 현재 구조

과자 5종(모두 "간식"이라는 한 카테고리) 중 2개 이상을 바구니에 담고, 바구니 평균 변동성과 "한
종류만 샀을 때" 변동성을 1회 비교. 실제 자산군 개념도, 여러 번의 반복 연습도 없다.

### 4-2. 새 구조 제안

기존 과자 바구니 단계는 **도입부 튜토리얼로 그대로 유지**한다(이미 스토리 scene 1~4가 이 비유로
시작하므로 갑자기 없애면 스토리 흐름이 끊김). 그 다음에 **2단계(신규)**를 이어 붙인다.

**2단계: "농장에 무얼 심을까?" (자산군 배분 라운드)**

1. `EconomicSeasonsWheel.tsx`와 **동일한 5개 자산 아이콘**(📈주식 🏠부동산 🪙금 🌾원자재 💰현금)을
   재사용한다 — 같은 아이콘·라벨을 쓰는 것 자체가 "도감에서 본 그 자산들"이라는 연결감을 준다.
2. 플레이어는 씨앗 코인(예: 총 10개)을 5개 자산에 원하는 대로 배분한다(탭으로 +1/-1, 또는 드래그 —
   `EtfBasketGame`이 이미 `@dnd-kit`를 쓰고 있으므로 드래그 방식을 우선 고려, 탭 방식이 아이에게
   더 쉬우면 단순 +/- 버튼으로 대체 가능).
3. 배분을 마치면 "계절 뽑기" 버튼 → **무작위로 계절 하나가 뽑힌다**(플레이어는 뽑히기 전까지 어떤
   계절이 나올지 모른다 — 안전 원칙 2 그대로 준수, 예측 게임이 아니라 "미리 알 수 없으니 나눠
   담는다"는 결론으로 이어져야 함).
4. `EconomicSeasonsWheel.tsx`의 `SEASON_REACTIONS` 테이블(§4-3에서 공유 모듈로 승격)을 그대로 적용해
   내 배분에 그 계절의 자산별 반응(grow/steady/wilt)을 곱해 이번 라운드 결과를 계산.
5. 이 과정을 **3~4라운드 반복**(매 라운드 새로 무작위 계절). 라운드마다 결과가 작은 그래프/막대로
   누적 표시됨.
6. 마지막에 `ComparisonBarChart`로 **"내가 고른 배분"** vs **"한 자산에 몰빵했을 때(비교용 가상
   프리셋, 매 라운드 같은 자산에 10개 전부)** 최종 누적 결과를 비교. 이번에도 "항상 분산이
   이긴다"고 단정하지 않도록, 몰빵 프리셋이 어쩌다 한 번은 더 잘 나올 수도 있게 설계하되(계절은
   무작위이므로 자연히 그렇게 됨), **"여러 번 반복하면 분산 쪽이 덜 출렁인다"**는 변동성 관점의
   서술로 마무리한다(수익률 우열이 아니라 안정성 관점 — 원칙 3: 특정 배분 비율을 정답처럼 제시하지
   않음과 일치).

### 4-3. 리팩터링 제안: 계절-자산 반응 테이블 공유

`EconomicSeasonsWheel.tsx`에 있는 `SEASON_REACTIONS`/`ASSETS`를
`data/almanac/economicSeasons.ts`(신규, 공용 데이터 모듈)로 승격해 도감 위젯과 새 게임이 같은
테이블을 참조하게 한다. 두 군데에 같은 테이블이 중복 정의되면 나중에 한쪽만 수정되는 사고가
나기 쉽다.

```ts
// data/almanac/economicSeasons.ts
export type Season = "spring" | "summer" | "autumn" | "winter";
export type ReactionLevel = "grow" | "steady" | "wilt";
export type AssetId = "stock" | "realEstate" | "gold" | "commodity" | "cash";

export const SEASONS: { id: Season; labelKo: string; emoji: string }[] = [...];
export const ASSETS: { id: AssetId; labelKo: string; emoji: string }[] = [...];
export const SEASON_REACTIONS: Record<Season, Record<AssetId, ReactionLevel>> = {...};
export const REACTION_LABEL: Record<ReactionLevel, string> = {...};
export const REACTION_MULTIPLIER: Record<ReactionLevel, number> = { grow: 1.3, steady: 1.0, wilt: 0.8 }; // 신규: 게임 채점용 배수
```

`EconomicSeasonsWheel.tsx`는 이 모듈에서 import하도록 수정(내용 동일, 위치만 이동). 새 게임은
`REACTION_MULTIPLIER`(신규 필드)로 라운드 점수를 계산.

### 4-4. 데이터 모델 확장 (`data/etfLabContent.ts`)

```ts
export const portfolioRoundContent = {
  introMessageKo: "이번엔 과자가 아니라 진짜 농장에 씨앗(자산)을 심어보자!",
  totalSeeds: 10,
  roundCount: 4,
  concentratedPresetAssetId: "stock", // 비교용 몰빵 프리셋(라운드마다 같은 자산에 전부)
  recapLineKo: "어떤 계절이 올지 몰라도, 골고루 심어두면 밭 전체가 크게 흔들리지 않아.",
};
```

---

## 5. 결과 화면 연동 — 확인된 누락 보완

코드를 다시 읽으며 확인된 기존 갭 두 가지를 이번 작업에서 함께 고친다(신규 게임과 직접 연결된
버그이므로 별도 문서로 미루지 않는다).

1. `app/building/[id]/result/BuildingResultView.tsx`의 `REFLECTION_CONTENT` 맵에 `"stock-street"`와
   `"etf-lab"`이 **빠져 있다** — 두 건물 모두 `data/*Content.ts`에 `reflection` 필드가 이미 있는데도
   결과 화면에서는 일반 문구로 대체되고 있다. 이번 작업에서 두 건물을 맵에 추가한다.
2. `BuildingResultView`는 `score`(예: 케이크 크기, 바구니 개수)를 화면에 표시하지 않고 `wallet.coins`
   총액만 보여준다. 이번에 추가하는 "버틴 나 vs 휩쓸렸다면" / "분산 vs 몰빵" 비교는 **게임 자체의
   `"summary"` 단계 화면 안에서 끝내고**, `onComplete(score)`로는 지금처럼 단순 숫자만 넘긴다(결과
   화면 구조를 바꾸지 않는 선에서 처리). 코인 보상(`rewardCoins`)을 점수에 연동할지는 이번 범위에
   포함하지 않는다(추후 별도 논의 항목으로 남김).

---

## 6. 안전장치 체크리스트 (구현 시 반드시 재확인)

- [ ] 이벤트/결과 카피 어디에도 "지금 사세요/파세요"류의 단정 명령문이 없다(제안 버튼 라벨은
      "지금 살래요/지켜볼래요"처럼 아이 스스로의 선택 문구로만 쓴다)
- [ ] 두 게임 모두 실시간 시세를 흉내내지 않는다(항상 미리 정해진 배수/이벤트 배열로만 진행)
- [ ] 포트폴리오 라운드는 특정 배분 비율(예: "주식 60%")을 정답처럼 제시하지 않는다
- [ ] "휩쓸렸다면" 비교 시나리오가 매번 100% 지도록 설계하지 않는다(가끔은 버텨도 아쉬운 날이
      있어야 예측 게임처럼 보이지 않는다)
- [ ] 결과 문구는 항상 "이렇게 하니 이런 결과였어요" 서술형이며 인격 평가("잘했어/못했어")가 없다
- [ ] `app/parent/page.tsx`의 "실제 투자 조언이 아니다" 고지가 이 두 게임에도 적용됨을 재확인

---

## 7. 참고 — 이번 설계가 재사용하는 기존 패턴

- `motion/react`의 `motion.div` scale/height 애니메이션 (StockStreetGame 기존 케이크 애니메이션)
- `useReducedMotion()` — 두 게임 모두 이미 이 훅을 쓰고 있으므로 신규 애니메이션도 동일하게 게이팅
- `ComparisonBarChart` — EtfBasketGame이 이미 쓰는 컴포넌트, 그대로 재사용
- `@dnd-kit/core` — EtfBasketGame이 이미 쓰는 드래그 인터랙션, 포트폴리오 배분 UI에도 재사용 가능
- `ReflectionPrompt` — 두 건물 모두 이미 `reflection` 데이터가 있으므로 그대로 사용
- `data/almanac/almanacTypes.ts`/`EconomicSeasonsWheel.tsx`의 5-자산 아이콘·계절 반응 테이블 —
  공유 모듈로 승격해 게임과 도감이 같은 시각 언어를 쓰게 함
