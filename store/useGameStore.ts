import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { buildings, buildingList, type BuildingId } from "@/data/buildings";
import { dailyQuests, weeklyQuests, type QuestDefinition } from "@/data/quests";

export interface AvatarLook {
  skin: string;
  hair: string;
  outfit: string;
  pet: string;
}

export interface WalletHistoryEntry {
  amount: number;
  reason: string;
  at: string;
}

export interface BuildingProgress {
  introSeen: boolean;
  minigameBestScore?: number;
  completedAt?: string;
  reflectionAnswer?: string;
}

export interface QuestProgress {
  id: string;
  progress: number;
  goal: number;
  claimedAt?: string;
}

export interface GameState {
  hasHydrated: boolean;

  avatar: {
    nickname: string;
    look: AvatarLook;
    level: number;
    exp: number;
  };

  wallet: {
    coins: number;
    history: WalletHistoryEntry[];
  };

  districts: {
    1: { unlocked: true };
    2: { unlocked: boolean };
    3: { unlocked: boolean };
  };

  buildings: Record<BuildingId, BuildingProgress>;

  moneyTree: {
    stage: number;
    lastWateredAt?: string;
    history: ("harvest" | "replant")[];
  };

  quests: {
    daily: QuestProgress[];
    weekly: QuestProgress[];
  };

  settings: {
    soundOn: boolean;
    narrationOn: boolean;
    reducedMotion: boolean;
  };

  setHasHydrated: (value: boolean) => void;
  setNickname: (nickname: string) => void;
  setAvatarLook: (look: Partial<AvatarLook>) => void;
  completeOnboarding: (nickname: string, look: Partial<AvatarLook>) => void;
  addCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => void;
  completeBuilding: (buildingId: BuildingId, options?: { score?: number }) => void;
  setBuildingReflectionAnswer: (buildingId: BuildingId, optionId: string) => void;
  setSoundOn: (value: boolean) => void;
  setNarrationOn: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
}

const defaultAvatarLook: AvatarLook = {
  skin: "light",
  hair: "brown",
  outfit: "default",
  pet: "piggy",
};

function createInitialBuildingProgress(): Record<BuildingId, BuildingProgress> {
  return Object.fromEntries(
    buildingList.map((building) => [building.id, { introSeen: false }]),
  ) as Record<BuildingId, BuildingProgress>;
}

function createQuestProgressList(defs: QuestDefinition[]): QuestProgress[] {
  return defs.map((def) => ({ id: def.id, progress: 0, goal: def.goal }));
}

// 저장된 퀘스트 진행도를 최신 퀘스트 정의(data/quests.ts)와 맞춘다.
// 새로 추가된 퀘스트는 진행도 0으로 채워 넣고, 정의에서 사라진 퀘스트는 제거한다.
function reconcileQuestProgress(
  defs: QuestDefinition[],
  existing: QuestProgress[] | undefined,
): QuestProgress[] {
  return defs.map((def) => {
    const found = existing?.find((quest) => quest.id === def.id);
    return found ? { ...found, goal: def.goal } : { id: def.id, progress: 0, goal: def.goal };
  });
}

function createInitialState() {
  return {
    hasHydrated: false,
    avatar: {
      nickname: "",
      look: defaultAvatarLook,
      level: 1,
      exp: 0,
    },
    wallet: {
      coins: 0,
      history: [],
    },
    districts: {
      1: { unlocked: true as const },
      2: { unlocked: false },
      3: { unlocked: false },
    },
    buildings: createInitialBuildingProgress(),
    moneyTree: {
      stage: 0,
      history: [],
    },
    quests: {
      daily: createQuestProgressList(dailyQuests),
      weekly: createQuestProgressList(weeklyQuests),
    },
    settings: {
      soundOn: true,
      narrationOn: true,
      reducedMotion: false,
    },
  };
}

// 저장 스키마 버전. 필드 구조를 바꿀 때마다 올리고 아래 migrate에 변환 로직을 추가한다.
const STORE_VERSION = 1;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...createInitialState(),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setNickname: (nickname) =>
        set((state) => ({ avatar: { ...state.avatar, nickname } })),

      setAvatarLook: (look) =>
        set((state) => ({
          avatar: { ...state.avatar, look: { ...state.avatar.look, ...look } },
        })),

      completeOnboarding: (nickname, look) =>
        set((state) => ({
          avatar: {
            ...state.avatar,
            nickname,
            look: { ...state.avatar.look, ...look },
          },
        })),

      addCoins: (amount, reason) =>
        set((state) => ({
          wallet: {
            coins: state.wallet.coins + amount,
            history: [
              ...state.wallet.history,
              { amount, reason, at: new Date().toISOString() },
            ],
          },
        })),

      spendCoins: (amount, reason) =>
        set((state) => {
          if (amount > state.wallet.coins) return state; // 잔액 부족 시 아무 것도 하지 않는다.
          return {
            wallet: {
              coins: state.wallet.coins - amount,
              history: [
                ...state.wallet.history,
                { amount: -amount, reason, at: new Date().toISOString() },
              ],
            },
          };
        }),

      completeBuilding: (buildingId, options = {}) =>
        set((state) => {
          const building = buildings[buildingId];
          const now = new Date().toISOString();
          const prevProgress = state.buildings[buildingId];
          const alreadyCompleted = Boolean(prevProgress.completedAt);

          const nextBuildings: Record<BuildingId, BuildingProgress> = {
            ...state.buildings,
            [buildingId]: {
              ...prevProgress,
              introSeen: true,
              completedAt: prevProgress.completedAt ?? now,
              minigameBestScore:
                options.score !== undefined
                  ? Math.max(prevProgress.minigameBestScore ?? 0, options.score)
                  : prevProgress.minigameBestScore,
            },
          };

          // 이미 완료된 건물을 다시 클리어해도 코인·퀘스트를 중복 지급하지 않는다.
          if (alreadyCompleted) {
            return { buildings: nextBuildings };
          }

          const nextDaily = state.quests.daily.map((quest) => {
            const def = dailyQuests.find((item) => item.id === quest.id);
            if (!def || quest.claimedAt) return quest;
            if (def.relatedBuilding && def.relatedBuilding !== buildingId) return quest;
            const nextProgress = Math.min(quest.progress + 1, quest.goal);
            return {
              ...quest,
              progress: nextProgress,
              claimedAt: nextProgress >= quest.goal ? now : quest.claimedAt,
            };
          });

          return {
            buildings: nextBuildings,
            wallet: {
              coins: state.wallet.coins + building.rewardCoins,
              history: [
                ...state.wallet.history,
                { amount: building.rewardCoins, reason: `${building.titleKo} 완료`, at: now },
              ],
            },
            quests: { ...state.quests, daily: nextDaily },
          };
        }),

      setBuildingReflectionAnswer: (buildingId, optionId) =>
        set((state) => ({
          buildings: {
            ...state.buildings,
            [buildingId]: {
              ...state.buildings[buildingId],
              reflectionAnswer: optionId,
            },
          },
        })),

      setSoundOn: (value) =>
        set((state) => ({ settings: { ...state.settings, soundOn: value } })),

      setNarrationOn: (value) =>
        set((state) => ({ settings: { ...state.settings, narrationOn: value } })),

      setReducedMotion: (value) =>
        set((state) => ({ settings: { ...state.settings, reducedMotion: value } })),
    }),
    {
      name: "moneymoni-save",
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      // hasHydrated·액션 함수는 매 로드마다 새로 계산되는 런타임 값이므로 저장 대상에서 제외한다.
      partialize: (state) => ({
        avatar: state.avatar,
        wallet: state.wallet,
        districts: state.districts,
        buildings: state.buildings,
        moneyTree: state.moneyTree,
        quests: state.quests,
        settings: state.settings,
      }),
      migrate: (persistedState) => {
        // STORE_VERSION이 1이므로 아직 변환할 이전 버전이 없다.
        // 향후 스키마가 바뀌면 여기서 persistedState.version별 분기 처리를 추가한다.
        return persistedState as GameState;
      },
      // 퀘스트 정의(data/quests.ts)가 바뀌어도 저장된 진행도와 항상 맞도록 병합 시점에 재조정한다.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<GameState>;
        return {
          ...currentState,
          ...persisted,
          quests: {
            daily: reconcileQuestProgress(dailyQuests, persisted.quests?.daily),
            weekly: reconcileQuestProgress(weeklyQuests, persisted.quests?.weekly),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
