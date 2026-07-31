// Playwright의 webServer 옵션이 이 환경(Windows 샌드박스)에서 자식 프로세스를 셸을 거쳐
// 띄우다 보니 테스트가 끝나도 정적 서버가 죽지 않고 포트를 점유한 채 남는 문제가 있었다.
// 그래서 서버 프로세스를 직접(셸 없이) spawn하고 종료까지 이 스크립트가 책임진다.
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = process.env.STATIC_SERVER_PORT ?? "47893";
const BASE_URL = `http://127.0.0.1:${PORT}/`;

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error("static server did not become ready in time"));
        } else {
          setTimeout(attempt, 300);
        }
      });
    };
    attempt();
  });
}

const server = spawn(process.execPath, ["scripts/static-server.mjs"], {
  env: { ...process.env, STATIC_SERVER_PORT: PORT },
  stdio: "inherit",
});

let exitCode = 1;
try {
  await waitForServer(BASE_URL);

  // playwright는 우리가 강제 종료할 필요가 없는(자연 종료되는) 프로세스라서
  // Windows에서 .cmd 셸이 껴도 문제가 없다 — 그래서 npx는 shell로 그냥 실행한다.
  // (인자를 배열로 따로 넘기면 Node가 이스케이프 미흡을 경고하므로 문자열 하나로 넘긴다)
  const playwright = spawn("npx playwright test", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, E2E_BASE_URL: BASE_URL },
  });

  exitCode = await new Promise((resolve) => {
    playwright.on("exit", (code) => resolve(code ?? 1));
  });
} finally {
  server.kill();
}

process.exit(exitCode);
