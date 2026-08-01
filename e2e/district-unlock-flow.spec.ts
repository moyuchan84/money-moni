import { test, expect, type Locator, type Page } from "@playwright/test";

import { buildings } from "../data/buildings";
import { allowanceSquareContent } from "../data/allowanceSquareContent";
import { bankContent } from "../data/bankContent";
import { capitalWarehouseContent } from "../data/capitalWarehouseContent";
import { etfLabContent } from "../data/etfLabContent";
import { seedGameState, completedBuildingProgress } from "./seedState";

async function dragTo(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("드래그할 요소의 위치를 찾지 못했어요.");

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 5, startY + 5, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 15 });
  await page.mouse.up();
}

// 이야기 씬이 뜨면 "시작하기" 버튼이 보일 때까지 "다음"을 눌러 넘긴다(재방문이면 스토리 자체가
// 뜨지 않으므로 이 루프는 곧바로 통과한다).
async function skipStoryIfPresent(page: Page) {
  while (
    !(await page
      .getByRole("button", { name: "시작하기", exact: true })
      .isVisible()
      .catch(() => false)) &&
    (await page
      .getByRole("button", { name: "다음" })
      .isVisible()
      .catch(() => false))
  ) {
    await page.getByRole("button", { name: "다음" }).click();
  }
  const startButton = page.getByRole("button", { name: "시작하기", exact: true });
  if (await startButton.isVisible().catch(() => false)) {
    await startButton.click();
  }
}

async function completeViaResult(page: Page, reflectionLabel: string) {
  await page.getByRole("button", { name: reflectionLabel }).click();
  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");
}

// docs/phases.md Phase 4 종료 조건(1구역 완료 후 2구역이 실제로 열리는 잠금 해제 플로우)을
// UI 레벨에서 검증한다. museum·ledger-house는 이미 store 단위 테스트로 검증된 완료 로직을
// localStorage에 직접 시드하고(e2e/seedState.ts 참고), 이 테스트는 실제로 확인하려는 마지막
// 한 걸음 — allowance-square를 실제로 플레이해 2구역이 잠금 해제되는 순간 — 만 UI로 재생한다.
test("1구역 마지막 건물을 완료하면 2구역이 열리고, 2구역 은행 미니게임을 완주할 수 있다", async ({ page }) => {
  await seedGameState(page, {
    avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
    wallet: { coins: 0, history: [] },
    districts: { 1: { unlocked: true }, 2: { unlocked: false }, 3: { unlocked: false } },
    buildings: {
      museum: completedBuildingProgress(),
      "ledger-house": completedBuildingProgress(),
    },
  });

  await page.goto("/");
  await page.waitForURL("**/town");

  // 2구역은 아직 잠겨 있다.
  await expect(page.getByRole("button", { name: "은행 (저축·이자)" })).toBeDisabled();

  await page.getByRole("button", { name: "용돈 배분 광장" }).click();
  await page.waitForURL("**/building/allowance-square");
  await skipStoryIfPresent(page);

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/allowance-square/minigame");

  const coin = page.getByRole("button", { name: "용돈 동전" });
  const jars = allowanceSquareContent.jars;
  for (let i = 0; i < allowanceSquareContent.totalCoins; i += 1) {
    const jar = jars[i % jars.length];
    const jarZone = page.getByText(new RegExp(`^${jar.labelKo} \\(\\d+\\)$`));
    await dragTo(page, coin.first(), jarZone);
  }

  await expect(page.getByText("코인 +30")).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/allowance-square/result");
  await completeViaResult(page, allowanceSquareContent.reflection.options[0].label);

  // 2구역이 열려서 은행 버튼을 누를 수 있다.
  const bankHotspot = page.getByRole("button", { name: "은행 (저축·이자)" });
  await expect(bankHotspot).toBeEnabled();
  await bankHotspot.click();
  await page.waitForURL("**/building/bank");
  await skipStoryIfPresent(page);

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/bank/minigame");

  // 이자율 다이얼 GSAP timeline(timeScale 바인딩)이 기본 배속으로 저금통을 다 채울 때까지 기다린다.
  await expect(page.getByText(`코인 +${buildings.bank.rewardCoins}`)).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/bank/result");
  await completeViaResult(page, bankContent.reflection.options[0].label);
});

// docs/phases.md Phase 5 종료 조건(2구역 진행도 기준 3구역 잠금 해제)을 UI 레벨에서 검증한다.
// 1구역 전체 + 2구역 4개 중 3개(bank/job-center/market)는 시드하고, capital-warehouse를 실제로
// 완료해 3구역이 열리는 순간만 재생한 뒤, 3구역의 새 인터랙션 패턴(dnd-kit 바구니, etf-lab)을
// 실제로 끝까지 플레이해본다.
test("2구역 마지막 건물을 완료하면 3구역이 열리고, 3구역 ETF 조합소 미니게임을 완주할 수 있다", async ({ page }) => {
  await seedGameState(page, {
    avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
    wallet: { coins: 0, history: [] },
    districts: { 1: { unlocked: true }, 2: { unlocked: true }, 3: { unlocked: false } },
    buildings: {
      museum: completedBuildingProgress(),
      "ledger-house": completedBuildingProgress(),
      "allowance-square": completedBuildingProgress(),
      bank: completedBuildingProgress(),
      "job-center": completedBuildingProgress(),
      market: completedBuildingProgress(),
    },
  });

  await page.goto("/");
  await page.waitForURL("**/town");

  // 3구역은 아직 잠겨 있다.
  await expect(page.getByRole("button", { name: "ETF 조합소" })).toBeDisabled();

  await page.getByRole("button", { name: "자본 도구창고" }).click();
  await page.waitForURL("**/building/capital-warehouse");
  await skipStoryIfPresent(page);

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/capital-warehouse/minigame");

  // 제한 시간(15초) 동안 몇 번 눌러도 결과 지급은 시간 종료 시 자동으로 이뤄진다.
  await page.getByRole("button", { name: "손으로 따기" }).click();
  await page.getByRole("button", { name: "손으로 따기" }).click();
  await expect(page.getByText(`코인 +${buildings["capital-warehouse"].rewardCoins}`)).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/capital-warehouse/result");
  await completeViaResult(page, capitalWarehouseContent.reflection.options[0].label);

  // 3구역이 열려서 ETF 조합소 버튼을 누를 수 있다.
  const etfHotspot = page.getByRole("button", { name: "ETF 조합소" });
  await expect(etfHotspot).toBeEnabled();
  await etfHotspot.click();
  await page.waitForURL("**/building/etf-lab");
  await skipStoryIfPresent(page);

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/etf-lab/minigame");

  // dnd-kit 바구니에 과자 카드를 최소 2개 이상 담아야 비교할 수 있다.
  const basket = page.getByLabel("과자 바구니");
  const snacks = etfLabContent.snacks;
  for (let i = 0; i < etfLabContent.minBasketItems; i += 1) {
    const card = page.getByRole("button", { name: `${snacks[i].labelKo} 카드` });
    await dragTo(page, card, basket);
  }

  await page.getByRole("button", { name: "비교하기" }).click();
  await page.getByRole("button", { name: "완료" }).click();

  await expect(page.getByText(`코인 +${buildings["etf-lab"].rewardCoins}`)).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/etf-lab/result");
  await completeViaResult(page, etfLabContent.reflection.options[0].label);
});
