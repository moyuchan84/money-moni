import { beforeEach, describe, expect, it } from "vitest";

import { buildingList } from "@/data/buildings";
import { useGameStore } from "./useGameStore";

describe("useGameStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState(useGameStore.getInitialState(), true);
  });

  it("15개 건물 진행 상태를 포함한 기본값으로 시작한다", () => {
    const state = useGameStore.getState();

    expect(state.avatar.nickname).toBe("");
    expect(state.wallet.coins).toBe(0);
    expect(state.districts[1].unlocked).toBe(true);
    expect(state.districts[2].unlocked).toBe(false);
    expect(state.districts[3].unlocked).toBe(false);
    expect(Object.keys(state.buildings)).toHaveLength(buildingList.length);
  });

  it("setNickname으로 바꾼 값이 localStorage에도 저장된다(새로고침 후 유지 검증)", () => {
    useGameStore.getState().setNickname("몽이");
    expect(useGameStore.getState().avatar.nickname).toBe("몽이");

    const saved = localStorage.getItem("moneymoni-save");
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved as string);
    expect(parsed.state.avatar.nickname).toBe("몽이");
    // hasHydrated는 런타임 플래그이므로 저장 대상에서 제외되어야 한다.
    expect(parsed.state.hasHydrated).toBeUndefined();
  });
});
