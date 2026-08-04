import { test, expect, type Locator, type Page } from "@playwright/test";

import { buildings } from "../data/buildings";
import { bankContent } from "../data/bankContent";
import { capitalWarehouseContent } from "../data/capitalWarehouseContent";
import { etfLabContent } from "../data/etfLabContent";

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

async function startAtTown(page: Page) {
  await page.goto("/onboarding");
  await page.getByPlaceholder("닉네임").fill("몽이");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.waitForURL("**/town");
}

async function completeViaResult(page: Page, reflectionLabel: string) {
  await page.getByRole("button", { name: reflectionLabel }).click();
  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");
}

// 1~3구역은 처음부터 모두 열려 있으므로(구역 잠금 해제 로직 없음), 이 테스트는 온보딩만 마치고
// 곧바로 2·3구역 건물로 이동해 은행/자본 도구창고/ETF 조합소 미니게임이 실제로 완주되는지만 검증한다.
test("은행 미니게임을 완주하면 코인이 적립되고 완료 처리된다", async ({ page }) => {
  await startAtTown(page);

  await page.getByRole("button", { name: "은행 (저축·이자)" }).click();
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

test("자본 도구창고와 ETF 조합소 미니게임을 순서대로 완주할 수 있다", async ({ page }) => {
  await startAtTown(page);

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

  await page.getByRole("button", { name: "ETF 조합소" }).click();
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
