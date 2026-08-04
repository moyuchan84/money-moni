import { test, expect } from "@playwright/test";

import { moneyTreeContent } from "../data/moneyTreeContent";
import { seedGameState } from "./seedState";

// money-tree는 CLAUDE.md 절대 규칙 6의 예외로 /building/[id] 3-라우트 구조를 따르지 않는
// standalone 라우트다(docs/phases.md Phase 3 종료 조건). 이야기 씬 → 수확/다시심기 →
// 코인 보상까지의 개인 위젯 플로우를 검증한다.
test("money-tree: 이야기 씬을 넘긴 뒤 열매를 수확하면 코인을 받는다", async ({ page }) => {
  await seedGameState(page, {
    avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
    wallet: { coins: 0, history: [] },
  });

  await page.goto("/town");

  const moneyTreeHotspot = page.getByRole("button", { name: "머니나무 마당" });
  await expect(moneyTreeHotspot).toBeEnabled();
  await moneyTreeHotspot.click();
  await page.waitForURL("**/money-tree");

  // 최초 진입 시 뜨는 이야기 씬을 끝까지 넘긴다.
  while (
    !(await page
      .getByRole("button", { name: "시작하기", exact: true })
      .isVisible()
      .catch(() => false))
  ) {
    await page.getByRole("button", { name: "다음" }).click();
  }
  await page.getByRole("button", { name: "시작하기", exact: true }).click();

  await expect(page.getByRole("heading", { name: "머니나무 마당" })).toBeVisible();

  const interestCoins = Math.round(moneyTreeContent.startingPrincipal * moneyTreeContent.dailyInterestRate);
  await page.getByRole("button", { name: moneyTreeContent.harvestButtonKo }).click();

  await expect(page.getByText(`코인 +${interestCoins}`)).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();

  // 하루 한 번 제한 로직 — 오늘은 이미 나무를 돌봤으므로 버튼이 사라지고 안내 문구가 뜬다.
  await expect(page.getByText(moneyTreeContent.alreadyActedTodayKo)).toBeVisible();

  // 새로고침해도 오늘 이미 행동했다는 상태가 유지된다.
  await page.reload();
  await expect(page.getByText(moneyTreeContent.alreadyActedTodayKo)).toBeVisible();
});
