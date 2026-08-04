import { test, expect, type Locator, type Page } from "@playwright/test";

import { museumContent } from "../data/museumContent";
import { allowanceSquareContent } from "../data/allowanceSquareContent";

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

// docs/phases.md Phase 0 종료 조건을 그대로 검증한다:
// 온보딩 → 마을 지도(placeholder) → 임의의 건물 stub 페이지 → 뒤로가기가 클릭으로 오류 없이
// 동작하며, 새로고침해도 저장된 상태(닉네임 등)가 유지된다.
test("온보딩 → 마을 → 건물 stub → 뒤로가기 → 새로고침 후 닉네임 유지", async ({ page }) => {
  await page.goto("/");

  await page.waitForURL("**/onboarding");
  await page.getByPlaceholder("닉네임").fill("몽이");
  await page.getByRole("button", { name: "시작하기" }).click();

  await page.waitForURL("**/town");
  await expect(page.getByRole("heading", { name: "1구역" })).toBeVisible();

  const museumHotspot = page.getByRole("button", { name: "박물관 (화폐의 역사)" });
  await expect(museumHotspot).toBeVisible();
  await museumHotspot.click();

  await page.waitForURL("**/building/museum");

  // 최초 진입 시 뜨는 이야기 씬은 이 테스트의 관심사가 아니므로 건너뛰기로 넘긴다.
  await page.getByRole("button", { name: "건너뛰기" }).click();
  await page.getByRole("button", { name: "네, 건너뛸게요" }).click();

  await expect(page.getByRole("heading", { name: "박물관 (화폐의 역사)" })).toBeVisible();

  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");

  // 새로고침 후에도 닉네임(=온보딩 완료 상태)이 유지되어 다시 /town에 머무른다.
  await page.reload();
  await page.waitForURL("**/town");
  await expect(page.getByRole("heading", { name: "1구역" })).toBeVisible();

  // 루트로 다시 이동해도 온보딩으로 되돌아가지 않고 곧바로 마을로 이동한다.
  await page.goto("/");
  await page.waitForURL("**/town");
});

// docs/phases.md Phase 2 종료 조건을 검증한다: museum의 실제 미니게임(GSAP 타임라인 + dnd-kit
// 교환 매칭)을 끝까지 플레이하면 코인이 늘고, 퀘스트가 진행되고, 건물에 완료 표시가 남고,
// 새로고침해도 그대로 유지된다.
test("museum 타임라인 미니게임 완료 시 코인 적립·퀘스트 진행·완료 표시가 새로고침 후에도 유지된다", async ({ page }) => {
  await page.goto("/onboarding");

  // 아바타 파츠(피부색 등) 중 하나를 골라도 온보딩이 정상 진행되는지 함께 확인한다.
  await page.getByRole("button", { name: "중간 피부" }).click();
  await page.getByPlaceholder("닉네임").fill("몽이");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.waitForURL("**/town");

  await page.getByRole("button", { name: "박물관 (화폐의 역사)" }).click();
  await page.waitForURL("**/building/museum");

  // 최초 진입 시 이야기 씬을 먼저 끝까지 넘긴 뒤 미니게임을 시작한다.
  while (
    !(await page
      .getByRole("button", { name: "시작하기", exact: true })
      .isVisible()
      .catch(() => false))
  ) {
    await page.getByRole("button", { name: "다음" }).click();
  }
  await page.getByRole("button", { name: "시작하기", exact: true }).click();

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/museum/minigame");

  // 5개 시대를 순서대로 드래그 매칭한다.
  for (const era of museumContent.eras) {
    const item = page.getByRole("button", { name: era.itemLabelKo });
    const zone = page.getByText(era.currencyLabelKo, { exact: true });
    await dragTo(page, item, zone);
  }

  // 마지막으로 조개껍데기를 오늘 시장에 써보는 실패 연출을 겪는다.
  const lastEra = museumContent.eras[museumContent.eras.length - 1];
  const firstEra = museumContent.eras[0];
  const failItem = page.getByRole("button", { name: firstEra.currencyLabelKo });
  const failZone = page.getByText(lastEra.currencyLabelKo, { exact: true });
  await dragTo(page, failItem, failZone);

  await expect(page.getByText(museumContent.failAttempt.failMessageKo)).toBeVisible();

  // 미니게임 완료 시 코인 보상 축하 팝업이 뜨고, 확인을 누르면 결과 화면으로 이동한다.
  await expect(page.getByText("코인 +30")).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/museum/result");

  await expect(page.getByText("지금 가진 코인은 30개예요!")).toBeVisible();

  // 회고 질문에 답하면 마을로 돌아갈 수 있다(CLAUDE.md ReflectionPrompt 규칙).
  await page.getByRole("button", { name: museumContent.reflection.options[0].label }).click();
  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");

  // 건물에 완료 표시가 남고, 퀘스트가 진행된다.
  await expect(
    page.getByRole("button", { name: "박물관 (화폐의 역사)" }).getByText("✅ 완료"),
  ).toBeVisible();

  // 하단 내비의 "퀘스트" 탭으로 이동한다(town 인라인 nav는 BottomNav로 대체됨).
  await page.getByRole("link", { name: "퀘스트", exact: true }).click();
  await page.waitForURL("**/quest-log");
  await expect(page.getByText(/오늘의 건물 아무 곳이나 클리어하기 \(1\/1\)/)).toBeVisible();

  // 새로고침해도 코인·완료 표시·퀘스트 진행이 그대로 유지된다.
  await page.reload();
  await expect(page.getByText(/오늘의 건물 아무 곳이나 클리어하기 \(1\/1\)/)).toBeVisible();

  await page.goto("/town");
  await expect(
    page.getByRole("button", { name: "박물관 (화폐의 역사)" }).getByText("✅ 완료"),
  ).toBeVisible();
});

// docs/phases.md Phase 2 종료 조건을 검증한다: allowance-square의 dnd-kit 4항아리 배분 게임을
// 끝까지 플레이하면(모든 항아리에 최소 1개씩 담아 "균형" 이벤트를 겪으면) 코인이 늘고 완료 표시가 남는다.
test("allowance-square 항아리 배분 게임 완료 시 코인 적립·완료 표시가 남는다", async ({ page }) => {
  await page.goto("/onboarding");
  await page.getByPlaceholder("닉네임").fill("몽이");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.waitForURL("**/town");

  await page.getByRole("button", { name: "용돈 배분 광장" }).click();
  await page.waitForURL("**/building/allowance-square");

  // 최초 진입 시 이야기 씬을 먼저 끝까지 넘긴 뒤 미니게임을 시작한다.
  while (
    !(await page
      .getByRole("button", { name: "시작하기", exact: true })
      .isVisible()
      .catch(() => false))
  ) {
    await page.getByRole("button", { name: "다음" }).click();
  }
  await page.getByRole("button", { name: "시작하기", exact: true }).click();

  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/allowance-square/minigame");

  const coin = page.getByRole("button", { name: "용돈 동전" });
  const jars = allowanceSquareContent.jars;

  // 10개 동전을 4항아리에 골고루(라운드로빈) 나눠 담아 "균형" 이벤트를 겪는다.
  for (let i = 0; i < allowanceSquareContent.totalCoins; i += 1) {
    const jar = jars[i % jars.length];
    const jarZone = page.getByText(new RegExp(`^${jar.labelKo} \\(\\d+\\)$`));
    await dragTo(page, coin.first(), jarZone);
  }

  await expect(page.getByText(allowanceSquareContent.balancedEventKo)).toBeVisible();
  await expect(page.getByText("코인 +30")).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/allowance-square/result");

  await page.getByRole("button", { name: allowanceSquareContent.reflection.options[0].label }).click();
  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");

  await expect(
    page.getByRole("button", { name: "용돈 배분 광장" }).getByText("✅ 완료"),
  ).toBeVisible();
});
