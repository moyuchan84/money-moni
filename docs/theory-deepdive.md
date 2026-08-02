# 머니모니 — 이론 심화 레이어(지식 도감) 자료조사 & 개발계획서

> 목적: 지금까지의 스토리 레이어(비유·상황, `docs/concept-story.md`)와 미니게임만으로는 "진짜 역사와 이론"이 빠져 있다는 피드백을 반영해, 실제 역사적 사실·인물·연도와 위키미디어 이미지를 곁들인 **선택적 심화 레이어("지식 도감")**를 추가한다. 이 문서는 자료조사 결과와 이를 기존 시스템(머니타운, 3-라우트 건물 구조, 스토리 레이어)에 녹여 넣는 개발계획을 함께 담는다. 실행용 체크리스트는 `docs/tasks/theory-deepdive.md`에 별도로 있다.

---

## 1. 왜 "선택적" 레이어인가

`docs/idea.md`가 처음부터 세운 원칙은 "문제 풀이가 아닌 체험형 학습"이었고, `docs/concept-story.md`는 초1~3 눈높이의 비유로 개념을 체감시키는 데 집중했다. 이번에 요청된 진짜 역사·이론·실제 인물·이미지는 교육적으로 매우 가치 있지만, 모든 내용을 필수 플로우에 욱여넣으면 어린 학습자에게는 과부하가 된다. 그래서 이 콘텐츠는 **게임 완료 후 결과 화면에 노출되는 선택 버튼("지식 카드 보기")을 통해서만 들어가는 3번째 레이어**로 설계한다 — 궁금한 아이나 옆에서 함께 보는 보호자가 원할 때만 펼쳐보는 "도감/백과사전" 형태다. 기존 온보딩→마을→건물→미니게임→회고 플로우는 전혀 바뀌지 않는다.

세 레이어의 역할 분담은 다음과 같다. ① 스토리 레이어(`docs/concept-story.md`) — 비유로 "감"을 잡는다. ② 미니게임 — 손으로 조작하며 규칙을 체감한다. ③ 지식 도감(이 문서) — 원할 때 실제 역사·이론·진짜 사진으로 "이게 진짜 있었던 일이구나"를 확인한다.

---

## 2. 자료조사 — 15개 모듈별 실제 역사·이론

아래는 각 건물에 넣을 실제 역사적 사실과 이론을 정리한 것이다. 연도·인물명은 여러 출처로 교차 확인했지만, 실제 카피 작성 시 위키백과 원문으로 한 번 더 대조할 것을 권장한다(3장 참고).

### 2-1. `museum` — 화폐의 역사
물물교환의 한계 이후, 기록상 가장 오래된 주조 화폐는 기원전 7세기경 소아시아 리디아 왕국에서 만든 **일렉트럼(금-은 자연합금) 동전**으로 알려져 있다. 이후 중국은 세계 최초의 지폐로 여겨지는 **교자(交子, 북송시대, 10~11세기)**를 사용했고, 유럽에서는 17세기 스톡홀름 은행 등이 근대적 지폐 발행을 시작했다. 19~20세기 초 여러 나라가 화폐 가치를 금에 고정하는 **금본위제**를 채택했고, 2차대전 이후 1944년 **브레튼우즈 체제**로 미국 달러를 금에, 다른 나라 화폐를 달러에 고정하는 체제가 만들어졌다. 이 체제는 1971년 미국 닉슨 대통령이 달러의 금 태환을 전격 중단한 **닉슨 쇼크**로 끝났고, 이때부터 오늘날처럼 금과 연동되지 않는 **명목화폐(fiat money)** 시대가 시작됐다. 신용카드는 1950년 다이너스클럽 카드로 처음 등장했고, 2008년에는 사토시 나카모토라는 이름으로 비트코인 백서가 발표되며 디지털 화폐 시대가 열렸다.

### 2-2. `ledger-house` — 가계부
현대적 가계부 조언 중 가장 널리 알려진 것은 미국 상원의원 엘리자베스 워런이 2005년 저서(『All Your Worth』)에서 제안한 **50/30/20 법칙**(필수 지출 50%·원하는 지출 30%·저축 20%)이다. 이는 이 앱의 4항아리(소비/위시/저축/기부) 배분 아이디어와 이론적으로 연결되는 실제 재무설계 원칙이다. "현금 봉투 예산법(envelope budgeting)"도 오래전부터 쓰인 가계부 방법론으로, 카테고리별 봉투에 현금을 나눠 담아 초과 지출을 막는 방식이다.

### 2-3. `allowance-square` — 용돈 배분
행동경제학자 리처드 탈러가 제시한 **"심리적 회계(mental accounting)"** 개념은 사람들이 같은 돈이라도 어느 "마음속 계좌"에 넣었는지에 따라 다르게 쓴다는 이론이다. 용돈을 항아리별로 나누는 것 자체가 이 이론을 실생활에 적용한 예다(탈러는 2017년 노벨 경제학상을 받았다).

### 2-4. `bank` — 저축과 이자
현존하는 세계에서 가장 오래된 은행은 이탈리아의 **몬테 데이 파스키 디 시에나(1472년 설립)**로 알려져 있다. 오늘날 각 나라는 중앙은행(한국은 한국은행)이 "기준금리"를 정해 시중 은행 금리에 영향을 준다.

### 2-5. `money-tree` — 복리
복리를 빠르게 어림하는 실제 공식이 **"72의 법칙"**이다 — 72를 연이자율(%)로 나누면 원금이 대략 몇 년 만에 두 배가 되는지 알 수 있다(예: 연 6%면 약 12년). "복리는 인류의 8대 불가사의"라는 말이 아인슈타인이 한 것으로 널리 알려져 있지만, 실제로 아인슈타인이 이 말을 했다는 확실한 근거는 없다 — 콘텐츠에 넣을 경우 "아인슈타인이 했다고 알려져 있지만 확실하진 않다"고 정직하게 표기해야 한다.

### 2-6. `job-center` — 소득의 종류
실제 세법상 소득도 근로소득·사업소득·이자소득/배당소득(자본소득의 일종) 등으로 구분되며, 이는 이 건물의 세 캐릭터(일꾼/사장님/농장주) 설정과 그대로 대응된다.

### 2-7. `market` — 인플레이션
각국 통계청/중앙은행은 여러 생활 물품 가격을 종합한 **소비자물가지수(CPI)**로 물가 상승률을 측정한다. 한국은행은 물가안정목표를 통해 인플레이션을 관리하려 한다. 역사적으로 물가가 극단적으로 치솟은 사례(1920년대 독일 바이마르공화국의 초인플레이션 등)도 있었다 — 아이들에게는 무섭지 않게 "옛날에 물가가 정말 많이, 아주 많이 오른 나라도 있었대" 정도로 순화해서 다룬다.

### 2-8. `capital-warehouse` — 자본
18세기 후반 **산업혁명**은 기계(자본)가 사람의 노동을 어떻게 증폭시키는지 보여준 실제 역사적 전환점이다. 애덤 스미스는 1776년 저서 『국부론』에서 분업과 생산성의 관계를 이론화했다.

### 2-9. `seed-field` — 투자란 무엇인가
"위험이 클수록 기대되는 수익도 크다(하이 리스크, 하이 리턴)"는 투자 이론의 기본 원칙이다.

### 2-10. `stock-street` — 주식
세계 최초의 주식회사이자 최초로 주식을 거래할 수 있는 증권거래소가 만들어진 것은 1602년 네덜란드의 **동인도회사(VOC)**와 **암스테르담 증권거래소**다 — 아이들에게 아주 훌륭한 "진짜 이야기"가 될 수 있는 소재다. 오늘날 한국의 코스피(KOSPI), 미국의 다우존스·나스닥 등도 함께 소개할 수 있다.

### 2-11. `etf-lab` — ETF/ETN
분산투자의 이론적 근거는 해리 마코위츠의 **현대 포트폴리오 이론(1952년 논문, 1990년 노벨 경제학상)**이다 — "여러 자산에 나눠 담으면 같은 기대수익에도 위험(변동성)을 줄일 수 있다"는 것이 핵심이다. 최초의 ETF는 1993년 미국에서 출시된 **SPDR S&P 500(SPY)**로 알려져 있다.

### 2-12. `gold-vault` — 금
금본위제 역사는 2-1과 연결되며, 오늘날에도 여러 나라 중앙은행이 금을 외환보유액의 일부로 보유하고 있다.

### 2-13. `coin-station` — 코인/스테이블코인
2008년 "사토시 나카모토"라는 필명으로 비트코인 백서가 발표됐고, 2009년 첫 블록이 채굴됐다. 스테이블코인은 2014년경 테더(USDT) 등이 등장하며 본격화됐다.

### 2-14. `loan-counter` — 대출과 레버리지
2008년 세계 금융위기는 과도한 빚(레버리지)이 쌓였을 때 어떤 위험이 생길 수 있는지 보여준 실제 역사적 사례다 — 아이들에게는 "빚을 너무 많이 지면 온 세상 사람들이 곤란해질 수도 있었대" 정도로 아주 순화해서 다룬다.

### 2-15. `triple-village` — 자본주의·사회주의·공산주의
애덤 스미스는 1776년 『국부론』에서 자유 시장과 "보이지 않는 손"을 이론화하며 자본주의의 사상적 토대를 놓았고, 칼 마르크스는 1848년 『공산당 선언』과 1867년 『자본론』에서 자본주의를 비판하며 공산주의 이론을 제시했다. 20세기 냉전 시기 미국(자본주의 진영)과 소련(공산주의 진영)의 실제 체제 경쟁이 있었고, 오늘날 대부분의 나라는 시장경제에 정부 개입을 일부 결합한 **혼합경제** 형태를 취하고 있다. 이 모듈은 정치적으로 민감하므로, `CLAUDE.md` 절대 규칙 7(정답 판정 금지)을 그대로 유지하고 역사적 사실 나열에 집중한다.

---

## 3. 이미지/위키 자산 소싱 방법론

### 3-1. 원칙

정적 사이트(`output: 'export'`)이므로 위키미디어 이미지를 **핫링크하지 않고 반드시 다운로드해 `/public` 아래 정적 자산으로 포함**한다(외부 서버 장애·URL 변경·트래픽 정책 위반을 피하기 위함). 이미지를 고를 때는 다음 순서를 따른다. 먼저 위키미디어 커먼즈(commons.wikimedia.org)에서 주제 카테고리를 검색하고, 개별 파일 페이지에서 라이선스(퍼블릭 도메인/CC-BY-SA/CC-BY 등)와 저작자 정보를 확인한 뒤, 라이선스에 맞는 저작자 표시 문구를 만들어 이미지와 함께 저장한다.

### 3-2. 라이선스 유형과 요건

**퍼블릭 도메인(PD)**: 저작권이 소멸했거나(저작자 사후 매우 오랜 시간 경과 등) 각국 정부기관이 공무로 제작해 저작권을 주장하지 않는 이미지(예: 미국 연방정부 공식 사진 다수)가 해당한다. 법적으로 저작자 표시가 필수는 아니지만, 출처를 남기는 것이 좋은 관행이다. **CC-BY / CC-BY-SA**: 저작자 표시가 필수이며(이름, 라이선스 종류, 원본 링크), CC-BY-SA는 이 이미지를 활용해 만든 2차 저작물도 같은 라이선스로 공개해야 한다는 조건(share-alike)이 있다 — 앱에 삽입하는 이미지 자체는 그대로 사용하는 것이라 문제없지만, 저작자 표시는 반드시 앱 내 어딘가(3-3의 크레딧 페이지)에 노출해야 한다.

### 3-3. 앱 내 저작자 표시 페이지

`/credits`(가칭 "고마운 자료들") 라우트를 새로 만들어, 사용된 모든 위키미디어 이미지의 제목·저작자·라이선스·원본 링크를 목록으로 노출한다. 마을 지도의 하단 내비게이션이나 `/parent` 화면에 이 페이지로 가는 링크를 추가한다. 이는 CC-BY-SA 준수를 위한 사실상 필수 요건이다.

### 3-4. 이미지 후보 카테고리(검색 키워드)

아래는 실제 파일 URL을 이 문서에서 확정하지 않고(라이선스는 개별 파일마다 다르고 링크가 바뀔 수 있어, 확정된 적 없는 URL을 문서에 박아두면 오히려 위험하다), 위키미디어 커먼즈에서 검색해 확인할 **카테고리/키워드**만 제시한다. 실제 개발 시 이 키워드로 검색한 뒤 파일별 라이선스를 직접 확인하고 골라야 한다.

- `museum`: "Lydian electrum coin", "Jiaozi Song dynasty banknote", "Bretton Woods Conference 1944", "Nixon 1971 gold convertibility"
- `bank`: "Monte dei Paschi di Siena", "Bank of Korea building"
- `stock-street`: "Dutch East India Company VOC share certificate", "Amsterdam Stock Exchange historical"
- `etf-lab`: "Harry Markowitz portrait"(초상 사진은 인물 관련 라이선스를 특히 꼼꼼히 확인)
- `gold-vault`: "gold bar", "gold standard historical photo"
- `coin-station`: "Bitcoin logo", "Bitcoin whitepaper"
- `capital-warehouse`: "Industrial Revolution factory illustration", "Adam Smith portrait"
- `triple-village`: "Adam Smith portrait", "Karl Marx portrait"(둘 다 오래전 인물의 초상화이므로 대부분 퍼블릭 도메인일 가능성이 높지만 개별 확인 필요)

인물 초상화(애덤 스미스, 칼 마르크스, 마코위츠 등)를 아이들 화면에 그대로 쓰기보다, 실제 인물 사진/초상화는 "지식 카드"의 작은 삽화로만 쓰고 메인 비주얼은 기존 일러스트 톤(SVG 캐릭터)을 유지하는 것을 권장한다 — 사실성과 친근한 톤을 함께 가져가기 위함이다.

---

## 4. 시스템 통합 설계

### 4-1. 새 라우트

`app/almanac/page.tsx`(도감 허브 — 완료한 건물의 지식카드를 그리드로 모아 보여줌), `app/almanac/[buildingId]/page.tsx`(개별 지식카드 상세), `app/credits/page.tsx`(이미지 저작자 표시 목록).

### 4-2. 데이터 스키마 — `data/almanac/{buildingId}Almanac.ts`(신규, 15개)

```ts
export interface AlmanacTimelineEvent {
  year: string;       // "기원전 7세기", "1944년" 등 서술형 허용
  titleKo: string;
  descKo: string;
  imageKey?: string;   // /public/images/almanac/{buildingId}/{imageKey}.jpg
}

export interface ImageCredit {
  imageKey: string;
  titleKo: string;         // 이미지 설명
  authorKo: string;
  license: "PD" | "CC-BY" | "CC-BY-SA";
  sourceUrl: string;        // 위키미디어 커먼즈 원본 파일 페이지
}

export interface BuildingAlmanac {
  buildingId: string;
  theoryNoteKo: string;      // 조금 더 심화된 설명(공식/개념명 포함)
  timeline: AlmanacTimelineEvent[];
  credits: ImageCredit[];
}
```

- `store/useGameStore.ts`에는 새 상태를 추가하지 않는다 — 도감 진입 조건은 기존 `buildings[id].completedAt` 유무만으로 판정하면 충분하다(완료한 건물만 지식카드 열람 가능).

### 4-3. 컴포넌트

`components/almanac/KnowledgeCard.tsx`(연표 + 이론 노트 렌더링), `components/almanac/AlmanacGrid.tsx`(도감 허브의 카드 그리드 — 완료 여부에 따라 잠금/해금 표시는 기존 `BuildingHotspot` 그리드 패턴을 재사용), `components/almanac/ImageCreditFooter.tsx`(카드 하단에 이미지 출처 인라인 표시 + `/credits` 링크).

### 4-4. 진입 동선

`app/building/[id]/result/BuildingResultView.tsx`의 회고(`<ReflectionPrompt />`) 아래에 "🧠 더 깊이 알아보기" 버튼을 추가해 `/almanac/[id]`로 이동시킨다(기존 T5/T7 변경사항과 함께 작업 시 `components/ui/Button`(있다면) 또는 기존 스타일로 `variant="secondary"`에 준하는 톤으로 추가). 마을 지도 상단 내비게이션(`townContent.townNav`)에도 "도감" 항목을 하나 추가한다.

### 4-5. 톤 가이드

`theoryNoteKo`는 스토리 레이어보다 한 단계 더 정보 밀도가 높아도 되지만, 여전히 초1~3이 읽을 수 있는 문장으로 쓴다. 연도·인물명·공식은 그대로 노출하되(이것이 "진짜"라는 신뢰감을 준다), 문장 구조는 짧게 유지한다. 예: "1602년, 네덜란드 사람들은 '동인도회사'라는 아주 큰 회사를 여러 사람이 조금씩 나눠 갖도록 만들었어. 이게 세계 최초의 '주식회사'야!"

---

## 5. 참고 자료

- [Nixon shock (Wikipedia)](https://en.wikipedia.org/wiki/Nixon_shock)
- [Croeseid — 리디아 화폐 (Wikipedia)](https://en.wikipedia.org/wiki/Croeseid)
- [World's First IPO: Dutch East India Company, 1602](https://www.gripinvest.in/blog/dutch-east-india-worlds-first-ipo)
- [400 years: the story — Amsterdam Exchange History](https://www.beursgeschiedenis.nl/en/the-story/)
- [What Is the 50/30/20 Rule? (Acorns)](https://www.acorns.com/learn/saving/50-30-20-budget-rule/)
- [Commons:Reusing content outside Wikimedia — Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [Commons:Licensing — Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Licensing)
- [A brief history of Stablecoins](https://arkadikofinance.medium.com/a-brief-history-of-stablecoins-a19f7880f839)

이 문서의 연도·사실은 여러 출처로 교차 확인했지만, 위키백과처럼 계속 업데이트되는 참고자료의 특성상 실제 콘텐츠 제작 시점에 한 번 더 원문(위키백과 등)을 직접 대조하는 것을 권장한다(`docs/tasks/theory-deepdive.md` T1 참고).
