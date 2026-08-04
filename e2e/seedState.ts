import type { Page } from "@playwright/test";

// store/useGameStore.ts의 persist 설정(name/version)과 반드시 일치해야 한다.
const STORAGE_KEY = "moneymoni-save";
const STORE_VERSION = 4;

// 3구역처럼 여러 건물을 순서대로 깨야만 도달하는 상태를 매번 UI로 전부 재생하면 테스트가
// 지나치게 느리고 취약해진다. 이미 store 단위 테스트(store/useGameStore.test.ts)로 검증된
// "이전 진행도"는 localStorage에 직접 시드하고, 이 테스트가 실제로 검증하려는 마지막 한 걸음
// (새 미니게임 완주)만 실제 UI 플레이로 확인한다.
export async function seedGameState(page: Page, state: Record<string, unknown>) {
  // addInitScript는 이 page의 이후 모든 탐색(reload 포함)에서 다시 실행된다. 이미 실제 진행으로
  // localStorage가 갱신된 뒤에도 재실행되어 시드값으로 덮어써버리면 새로고침 유지 검증이 불가능해지므로,
  // 키가 아직 없을 때(최초 1회)만 시드한다.
  await page.addInitScript(
    ({ key, version, state }) => {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, JSON.stringify({ state, version }));
    },
    { key: STORAGE_KEY, version: STORE_VERSION, state },
  );
}

export function completedBuildingProgress(completedAt = "2026-01-01T00:00:00.000Z") {
  return { introSeen: true, storySeen: true, completedAt };
}
