"use client";

import { useSound } from "@/components/providers/SoundProvider";

export function SoundToggle() {
  const { soundOn, toggleSound } = useSound();

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "소리 끄기" : "소리 켜기"}
      className="min-h-touch min-w-touch rounded-pill bg-surface px-3 py-1 shadow-card"
    >
      {soundOn ? "🔊" : "🔇"}
    </button>
  );
}
