import { defineConfig, devices } from "@playwright/test";

// 흔한 포트(3000, 4173 등)는 다른 프로젝트의 서버와 충돌할 수 있어 임의의 포트를 쓴다.
// scripts/run-e2e.mjs가 이 값으로 정적 서버를 띄운 뒤 이 설정을 실행한다.
const PORT = 47893;

// output:'export' 정적 산출물(out/)을 실제로 서빙해 검증한다 —
// next dev/next start가 아니라 배포되는 형태 그대로 테스트하기 위함.
// 서버 프로세스 자체는 Playwright의 webServer가 아니라 scripts/run-e2e.mjs가 직접
// spawn/kill한다 — Windows 샌드박스에서 webServer가 셸을 거쳐 자식을 띄우다 보니
// 테스트 종료 후에도 정적 서버가 죽지 않고 포트를 점유하는 문제가 있었기 때문이다.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
