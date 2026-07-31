import { beforeEach, describe, expect, it } from "vitest";

import { buildingList, buildings } from "@/data/buildings";
import { dailyQuests } from "@/data/quests";
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

  it("일일 퀘스트 정의(data/quests.ts)를 기본 진행도 0으로 초기화한다", () => {
    const state = useGameStore.getState();

    expect(state.quests.daily).toHaveLength(dailyQuests.length);
    expect(state.quests.daily[0]).toMatchObject({
      id: dailyQuests[0].id,
      progress: 0,
      goal: dailyQuests[0].goal,
    });
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

  it("completeBuilding으로 코인이 늘고 건물이 완료 처리되고 관련 일일 퀘스트가 진행된다", () => {
    const museum = buildings.museum;
    useGameStore.getState().completeBuilding("museum", { score: 5 });

    const state = useGameStore.getState();
    expect(state.wallet.coins).toBe(museum.rewardCoins);
    expect(state.wallet.history).toHaveLength(1);
    expect(state.buildings.museum.completedAt).toBeDefined();
    expect(state.buildings.museum.minigameBestScore).toBe(5);

    const quest = state.quests.daily.find((item) => item.id === dailyQuests[0].id);
    expect(quest?.progress).toBe(1);
    expect(quest?.claimedAt).toBeDefined();
  });

  it("이미 완료된 건물을 다시 클리어해도 코인·퀘스트를 중복 지급하지 않는다", () => {
    useGameStore.getState().completeBuilding("museum", { score: 5 });
    useGameStore.getState().completeBuilding("museum", { score: 5 });

    const state = useGameStore.getState();
    expect(state.wallet.coins).toBe(buildings.museum.rewardCoins);
    expect(state.wallet.history).toHaveLength(1);
  });

  it("addCoins/spendCoins가 지갑 잔액과 내역을 갱신한다", () => {
    useGameStore.getState().addCoins(20, "테스트 적립");
    expect(useGameStore.getState().wallet.coins).toBe(20);

    useGameStore.getState().spendCoins(5, "테스트 차감");
    expect(useGameStore.getState().wallet.coins).toBe(15);

    // 잔액보다 큰 금액은 차감되지 않는다.
    useGameStore.getState().spendCoins(100, "잔액 부족 테스트");
    expect(useGameStore.getState().wallet.coins).toBe(15);
  });

  it("setBuildingReflectionAnswer로 회고 답변이 저장된다", () => {
    useGameStore.getState().setBuildingReflectionAnswer("museum", "fun-tap");
    expect(useGameStore.getState().buildings.museum.reflectionAnswer).toBe("fun-tap");
  });
});
