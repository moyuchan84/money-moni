import { test, expect } from "@playwright/test";

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
