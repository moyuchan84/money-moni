"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Howl } from "howler";

import { useGameStore } from "@/store/useGameStore";

interface SoundContextValue {
  soundOn: boolean;
  narrationOn: boolean;
  toggleSound: () => void;
  // src가 없으면(콘텐츠 제작 전 placeholder) 조용히 아무 것도 하지 않는다.
  playSfx: (src?: string) => void;
  playNarration: (src?: string) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundOn = useGameStore((state) => state.settings.soundOn);
  const narrationOn = useGameStore((state) => state.settings.narrationOn);
  const setSoundOn = useGameStore((state) => state.setSoundOn);
  const howlCache = useRef<Map<string, Howl>>(new Map());

  const play = useCallback((src: string | undefined, enabled: boolean) => {
    if (!enabled || !src) return;
    let howl = howlCache.current.get(src);
    if (!howl) {
      howl = new Howl({ src: [src], preload: false });
      howlCache.current.set(src, howl);
    }
    howl.play();
  }, []);

  const playSfx = useCallback((src?: string) => play(src, soundOn), [play, soundOn]);
  const playNarration = useCallback(
    (src?: string) => play(src, narrationOn),
    [play, narrationOn],
  );
  const toggleSound = useCallback(() => setSoundOn(!soundOn), [setSoundOn, soundOn]);

  const value = useMemo<SoundContextValue>(
    () => ({ soundOn, narrationOn, toggleSound, playSfx, playNarration }),
    [soundOn, narrationOn, toggleSound, playSfx, playNarration],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound은 SoundProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
