"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Howl } from "howler";

import { useGameStore } from "@/store/useGameStore";

const BGM_VOLUME = 0.5;
const BGM_FADE_MS = 800;

interface SoundContextValue {
  soundOn: boolean;
  narrationOn: boolean;
  toggleSound: () => void;
  // src가 없으면(콘텐츠 제작 전 placeholder) 조용히 아무 것도 하지 않는다.
  playSfx: (src?: string) => void;
  playNarration: (src?: string) => void;
  // BGM은 루프 재생 + 트랙 전환 시 크로스페이드된다. 같은 src 재호출은 무시한다
  // (건물 인트로→미니게임처럼 같은 구역 안에서 라우트만 바뀔 때 재생을 그대로 이어간다).
  playBgm: (src?: string) => void;
  stopBgm: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundOn = useGameStore((state) => state.settings.soundOn);
  const narrationOn = useGameStore((state) => state.settings.narrationOn);
  const setSoundOn = useGameStore((state) => state.setSoundOn);
  const howlCache = useRef<Map<string, Howl>>(new Map());
  const bgmCache = useRef<Map<string, Howl>>(new Map());
  const currentBgmRef = useRef<{ src: string; howl: Howl } | null>(null);
  const soundOnRef = useRef(soundOn);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

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

  const stopBgm = useCallback(() => {
    const current = currentBgmRef.current;
    currentBgmRef.current = null;
    if (!current) return;
    current.howl.fade(current.howl.volume(), 0, BGM_FADE_MS);
    current.howl.once("fade", () => current.howl.stop());
  }, []);

  const playBgm = useCallback(
    (src?: string) => {
      if (!src) {
        stopBgm();
        return;
      }
      if (currentBgmRef.current?.src === src) return;

      const previous = currentBgmRef.current;
      let next = bgmCache.current.get(src);
      if (!next) {
        next = new Howl({ src: [src], loop: true, volume: 0, preload: false });
        bgmCache.current.set(src, next);
      }
      currentBgmRef.current = { src, howl: next };

      if (soundOnRef.current) {
        next.play();
        next.fade(0, BGM_VOLUME, BGM_FADE_MS);
      }

      if (previous) {
        previous.howl.fade(previous.howl.volume(), 0, BGM_FADE_MS);
        previous.howl.once("fade", () => previous.howl.stop());
      }
    },
    [stopBgm],
  );

  // soundOn 토글에 맞춰 현재 BGM을 페이드아웃 후 pause(정지 아님, 다시 켜면 이어서 재생)한다.
  useEffect(() => {
    const current = currentBgmRef.current;
    if (!current) return;
    if (soundOn) {
      current.howl.play();
      current.howl.fade(0, BGM_VOLUME, BGM_FADE_MS);
    } else {
      current.howl.fade(current.howl.volume(), 0, BGM_FADE_MS);
      current.howl.once("fade", () => current.howl.pause());
    }
  }, [soundOn]);

  const toggleSound = useCallback(() => setSoundOn(!soundOn), [setSoundOn, soundOn]);

  const value = useMemo<SoundContextValue>(
    () => ({ soundOn, narrationOn, toggleSound, playSfx, playNarration, playBgm, stopBgm }),
    [soundOn, narrationOn, toggleSound, playSfx, playNarration, playBgm, stopBgm],
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
