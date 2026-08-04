import { test, expect, type Page } from "@playwright/test";

import { seedGameState, completedBuildingProgress } from "./seedState";

// docs/tasks/design-system-revision.md T6 — 대표 화면(/town, /onboarding, /building/museum)을
// 모바일/태블릿/데스크톱 뷰포트에서 방문해, AppShell 고정폭 프레임과 한글 keep-all 줄바꿈이
// 실제로 동작하는지 검증한다.
const VIEWPORTS = {
  mobile: { width: 375, height: 800 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

const APP_FRAME_MAX_WIDTH = 480; // --container-app: 30rem (app/globals.css)

async function seedTownState(page: Page) {
  // /town·/building/museum 모두 마을 지도 그리드(완료/미완료 카드가 섞인 상태)와 실제 코인 값을
  // 함께 확인할 수 있도록 일부 진행된 상태로 시드한다.
  await seedGameState(page, {
    avatar: {
      nickname: "몽이",
      look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" },
      level: 1,
      exp: 0,
    },
    wallet: { coins: 120, history: [] },
    buildings: {
      museum: { introSeen: true, storySeen: true },
      "ledger-house": completedBuildingProgress(),
      "allowance-square": completedBuildingProgress(),
      bank: completedBuildingProgress(),
    },
  });
}

const PAGES: {
  path: string;
  seed?: boolean;
  waitForReady: (page: Page) => Promise<unknown>;
}[] = [
  {
    path: "/onboarding",
    waitForReady: (page) => page.getByRole("button", { name: "시작하기" }).waitFor(),
  },
  {
    path: "/town",
    seed: true,
    waitForReady: (page) => page.getByRole("heading", { name: "1구역" }).waitFor(),
  },
  {
    path: "/building/museum",
    seed: true,
    // museum.storySeen을 시드해 이야기 씬을 건너뛰고 곧바로 버튼 그룹(ButtonRow) 화면에 도달한다.
    waitForReady: (page) => page.getByRole("link", { name: "미니게임 시작하기" }).waitFor(),
  },
];

for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`${deviceName} 뷰포트 (${viewport.width}px)`, () => {
    test.use({ viewport });

    for (const { path, seed, waitForReady } of PAGES) {
      test(`${path} — 프레임/줄바꿈 검증`, async ({ page }) => {
        if (seed) await seedTownState(page);
        await page.goto(path);
        await waitForReady(page);

        // 페이지 레벨 가로 스크롤(오버플로)이 없는지 모든 뷰포트에서 공통 확인.
        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        expect(hasHorizontalOverflow).toBe(false);

        // 고정폭 캔버스(AppShell) 확인.
        const frame = page.locator(".max-w-app").first();
        await expect(frame).toBeVisible();
        const frameBox = await frame.boundingBox();
        if (!frameBox) throw new Error("AppShell 프레임을 찾지 못했다.");

        if (viewport.width > APP_FRAME_MAX_WIDTH) {
          // 뷰포트가 프레임 최대폭보다 넓으면 프레임 폭은 480px로 고정되고 가운데 정렬되어,
          // 프레임 바깥 양쪽에 배경 여백이 생겨야 한다("목업처럼 덩그러니"의 반대 상태).
          expect(frameBox.width).toBeLessThanOrEqual(APP_FRAME_MAX_WIDTH + 1);
          const leftMargin = frameBox.x;
          const rightMargin = viewport.width - (frameBox.x + frameBox.width);
          expect(leftMargin).toBeGreaterThan(0);
          expect(rightMargin).toBeGreaterThan(-1);
        } else {
          // 모바일 폭에서는 프레임이 화면 전체를 채운다.
          expect(frameBox.width).toBeGreaterThanOrEqual(viewport.width - 1);
        }

        // 대표 버튼/링크 텍스트가 자기 박스를 벗어나지(scrollWidth > clientWidth) 않는지 확인 —
        // word-break: keep-all 미적용 시 버튼 텍스트가 음절 단위로 잘려 오버플로하던 증상의 회귀 검증.
        // QuestBadge의 알림 배지(-right-1 -top-1로 부모 박스 밖에 의도적으로 걸치는 장식 요소)처럼
        // absolute 포지셔닝된 자식을 가진 요소는 원래도 scrollWidth가 클 수 있어 제외한다.
        const overflowingCount = await page.evaluate(() => {
          const controls = Array.from(document.querySelectorAll("button, a"));
          return controls.filter((el) => {
            const hasAbsoluteDescendant = Array.from(el.querySelectorAll("*")).some(
              (child) => getComputedStyle(child).position === "absolute",
            );
            if (hasAbsoluteDescendant) return false;
            return el.scrollWidth > el.clientWidth + 1;
          }).length;
        });
        expect(overflowingCount).toBe(0);
      });
    }
  });
}
