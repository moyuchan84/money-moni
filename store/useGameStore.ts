import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { buildingList, type BuildingId } from "@/data/buildings";

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
      daily: [],
      weekly: [],
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
