import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildingList, buildings } from "@/data/buildings";
import { dailyQuests } from "@/data/quests";
import { moneyTreeContent } from "@/data/moneyTreeContent";
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

  describe("growMoneyTree", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("replant는 원금에 이자를 재투자하고 stage를 늘린다", () => {
      const before = useGameStore.getState().moneyTree;
      useGameStore.getState().growMoneyTree("replant");

      const after = useGameStore.getState().moneyTree;
      const expectedInterest = Math.round(before.principal * moneyTreeContent.dailyInterestRate);
      expect(after.principal).toBe(before.principal + expectedInterest);
      expect(after.stage).toBe(before.stage + 1);
      expect(after.history).toHaveLength(1);
      expect(after.lastActionType).toBe("replant");
    });

    it("harvest는 원금은 그대로 두고 이자만큼 코인을 지갑에 지급한다", () => {
      const before = useGameStore.getState().moneyTree;
      const expectedInterest = Math.round(before.principal * moneyTreeContent.dailyInterestRate);

      useGameStore.getState().growMoneyTree("harvest");

      expect(useGameStore.getState().moneyTree.principal).toBe(before.principal);
      expect(useGameStore.getState().wallet.coins).toBe(expectedInterest);
    });

    it("같은 날 두 번째 호출은 아무 것도 바꾸지 않는다(하루 1회 제한)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-31T09:00:00.000Z"));

      useGameStore.getState().growMoneyTree("replant");
      const afterFirst = useGameStore.getState().moneyTree;

      vi.setSystemTime(new Date("2026-07-31T15:00:00.000Z"));
      useGameStore.getState().growMoneyTree("replant");
      const afterSecond = useGameStore.getState().moneyTree;
      expect(afterSecond).toEqual(afterFirst);

      // 다음 날로 이동하면 다시 실행된다.
      vi.setSystemTime(new Date("2026-08-01T09:00:00.000Z"));
      useGameStore.getState().growMoneyTree("replant");
      expect(useGameStore.getState().moneyTree.stage).toBe(afterFirst.stage + 1);
    });
  });

  describe("purchaseShopItem", () => {
    it("코인이 충분하면 코인을 차감하고 보유 목록·아바타 파츠에 반영한다", () => {
      useGameStore.getState().addCoins(100, "테스트 적립");
      useGameStore.getState().purchaseShopItem("gold-suit", "outfit", 60);

      const state = useGameStore.getState();
      expect(state.wallet.coins).toBe(40);
      expect(state.shop.ownedItemIds).toContain("gold-suit");
      expect(state.avatar.look.outfit).toBe("gold-suit");
    });

    it("코인이 부족하면 아무 것도 바뀌지 않는다", () => {
      useGameStore.getState().purchaseShopItem("gold-suit", "outfit", 60);

      const state = useGameStore.getState();
      expect(state.wallet.coins).toBe(0);
      expect(state.shop.ownedItemIds).not.toContain("gold-suit");
    });

    it("이미 보유한 아이템은 다시 구매해도 코인을 중복 차감하지 않는다", () => {
      useGameStore.getState().addCoins(200, "테스트 적립");
      useGameStore.getState().purchaseShopItem("gold-suit", "outfit", 60);
      useGameStore.getState().purchaseShopItem("gold-suit", "outfit", 60);

      expect(useGameStore.getState().wallet.coins).toBe(140);
      expect(useGameStore.getState().shop.ownedItemIds).toHaveLength(1);
    });
  });

  it("v1 저장 스키마를 v2로 마이그레이션하면 moneyTree.principal/shop이 기본값으로 채워진다", async () => {
    localStorage.setItem(
      "moneymoni-save",
      JSON.stringify({
        state: {
          avatar: { nickname: "옛날몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
          wallet: { coins: 30, history: [] },
          districts: { 1: { unlocked: true }, 2: { unlocked: false }, 3: { unlocked: false } },
          buildings: {},
          moneyTree: { stage: 2, history: ["harvest", "replant"] },
          quests: { daily: [], weekly: [] },
          settings: { soundOn: true, narrationOn: true, reducedMotion: false },
        },
        version: 1,
      }),
    );

    await useGameStore.persist.rehydrate();

    const state = useGameStore.getState();
    expect(state.avatar.nickname).toBe("옛날몽이");
    expect(state.moneyTree.stage).toBe(2);
    expect(state.moneyTree.principal).toBe(moneyTreeContent.startingPrincipal);
    expect(state.moneyTree.history).toEqual([]);
    expect(state.shop.ownedItemIds).toEqual([]);
  });

  it("저장분에 없던 건물 id(예: 나중에 추가된 2구역 건물)는 병합 시 기본값으로 채워진다", async () => {
    localStorage.setItem(
      "moneymoni-save",
      JSON.stringify({
        state: {
          avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
          wallet: { coins: 30, history: [] },
          districts: { 1: { unlocked: true }, 2: { unlocked: false }, 3: { unlocked: false } },
          // 오래된 저장분이라 museum만 있고, 이후 추가된 bank 등은 아예 키 자체가 없다.
          buildings: { museum: { introSeen: true, completedAt: "2026-01-01T00:00:00.000Z" } },
          moneyTree: { stage: 0, principal: moneyTreeContent.startingPrincipal, history: [] },
          shop: { ownedItemIds: [] },
          quests: { daily: [], weekly: [] },
          settings: { soundOn: true, narrationOn: true, reducedMotion: false },
        },
        version: 2,
      }),
    );

    await useGameStore.persist.rehydrate();

    const state = useGameStore.getState();
    expect(state.buildings.museum.completedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(state.buildings.bank).toEqual({ introSeen: false, storySeen: false });
    expect(Object.keys(state.buildings)).toHaveLength(buildingList.length);
  });

  it("새 스토어의 모든 건물은 storySeen: false로 시작한다", () => {
    const state = useGameStore.getState();

    expect(state.buildings.museum.storySeen).toBe(false);
    expect(state.buildings.bank.storySeen).toBe(false);
  });

  it("setBuildingStorySeen을 호출하면 해당 건물만 storySeen이 true가 되고 다른 상태는 변하지 않는다", () => {
    useGameStore.getState().setBuildingStorySeen("bank");

    const state = useGameStore.getState();
    expect(state.buildings.bank.storySeen).toBe(true);
    expect(state.buildings.museum.storySeen).toBe(false);
    expect(state.wallet.coins).toBe(0);
  });

  it("v2 저장 스키마를 v3로 마이그레이션하면 storySeen이 없는 건물에 false가 채워진다", async () => {
    localStorage.setItem(
      "moneymoni-save",
      JSON.stringify({
        state: {
          avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
          wallet: { coins: 30, history: [] },
          districts: { 1: { unlocked: true }, 2: { unlocked: false }, 3: { unlocked: false } },
          // v2 저장분이라 museum에 storySeen 키가 아예 없다.
          buildings: { museum: { introSeen: true, completedAt: "2026-01-01T00:00:00.000Z" } },
          moneyTree: { stage: 0, principal: moneyTreeContent.startingPrincipal, history: [] },
          shop: { ownedItemIds: [] },
          quests: { daily: [], weekly: [] },
          settings: { soundOn: true, narrationOn: true, reducedMotion: false },
        },
        version: 2,
      }),
    );

    await useGameStore.persist.rehydrate();

    const state = useGameStore.getState();
    expect(state.buildings.museum.storySeen).toBe(false);
    expect(state.buildings.museum.completedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("v3 저장 스키마를 v4로 마이그레이션하면 구역 잠금 상태가 제거되고 모든 건물에 접근할 수 있다", async () => {
    localStorage.setItem(
      "moneymoni-save",
      JSON.stringify({
        state: {
          avatar: { nickname: "몽이", look: { skin: "light", hair: "brown", outfit: "default", pet: "piggy" }, level: 1, exp: 0 },
          wallet: { coins: 30, history: [] },
          districts: { 1: { unlocked: true }, 2: { unlocked: false }, 3: { unlocked: false } },
          buildings: { museum: { introSeen: true, storySeen: true, completedAt: "2026-01-01T00:00:00.000Z" } },
          moneyTree: { stage: 0, principal: moneyTreeContent.startingPrincipal, history: [] },
          shop: { ownedItemIds: [] },
          quests: { daily: [], weekly: [] },
          settings: { soundOn: true, narrationOn: true, reducedMotion: false },
        },
        version: 3,
      }),
    );

    await useGameStore.persist.rehydrate();

    const state = useGameStore.getState();
    expect(state).not.toHaveProperty("districts");
  });
});
