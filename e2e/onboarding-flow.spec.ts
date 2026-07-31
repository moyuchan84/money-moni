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

// docs/phases.md Phase 1 종료 조건을 검증한다:
// 아무 건물(placeholder 미니게임 포함)에 들어가 완료하면 코인이 늘고, 퀘스트가 진행되고,
// 건물에 완료 표시가 남고, 새로고침해도 그대로 유지된다.
test("건물 완료 시 코인 적립·퀘스트 진행·완료 표시가 새로고침 후에도 유지된다", async ({ page }) => {
  await page.goto("/onboarding");

  // 아바타 파츠(피부색 등) 중 하나를 골라도 온보딩이 정상 진행되는지 함께 확인한다.
  await page.getByRole("button", { name: "중간 피부" }).click();
  await page.getByPlaceholder("닉네임").fill("몽이");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.waitForURL("**/town");

  await page.getByRole("button", { name: "박물관 (화폐의 역사)" }).click();
  await page.waitForURL("**/building/museum");
  await page.getByRole("link", { name: "미니게임 시작하기" }).click();
  await page.waitForURL("**/building/museum/minigame");

  const coinButton = page.getByRole("button", { name: "코인 모으기" });
  for (let i = 0; i < 5; i += 1) {
    await coinButton.click();
  }

  // 미니게임 완료 시 코인 보상 축하 팝업이 뜨고, 확인을 누르면 결과 화면으로 이동한다.
  await expect(page.getByText("코인 +30")).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForURL("**/building/museum/result");

  await expect(page.getByText("지금 가진 코인은 30개예요!")).toBeVisible();

  // 회고 질문에 답하면 마을로 돌아갈 수 있다(CLAUDE.md ReflectionPrompt 규칙).
  await page.getByRole("button", { name: "톡톡 누르는 게 재밌었어요" }).click();
  await page.getByRole("link", { name: "마을로 돌아가기" }).click();
  await page.waitForURL("**/town");

  // 건물에 완료 표시가 남고, 퀘스트가 진행된다.
  await expect(
    page.getByRole("button", { name: "박물관 (화폐의 역사)" }).getByText("✅ 완료"),
  ).toBeVisible();

  await page.getByRole("link", { name: "퀘스트 로그" }).click();
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
