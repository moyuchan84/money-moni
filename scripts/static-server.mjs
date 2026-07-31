// npx serve의 자동 포트 전환(get-port 폴백)이 이 환경의 샌드박스에서 지정한 포트를
// 무시하는 문제가 있어, playwright.config.ts의 webServer용으로 최소 정적 서버를 직접 둔다.
import http from "node:http";
import handler from "serve-handler";

const port = Number(process.env.STATIC_SERVER_PORT ?? 47893);
const root = process.env.STATIC_SERVER_ROOT ?? "out";

const server = http.createServer((request, response) =>
  handler(request, response, { public: root }),
);

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root}/ at http://127.0.0.1:${port}`);
});
