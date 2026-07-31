"use client";

import { useEffect } from "react";

import { sfxSrc } from "@/data/soundContent";
import { useSound } from "@/components/providers/SoundProvider";

export interface RewardCelebrationProps {
  coins: number;
  visible: boolean;
  onDone?: () => void;
}

export function RewardCelebration({ coins, visible, onDone }: RewardCelebrationProps) {
  const { playSfx } = useSound();

  useEffect(() => {
    if (visible) playSfx(sfxSrc.coinGain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center text-ink shadow-card">
        <p aria-hidden className="text-display">
          🎉
        </p>
        <p className="text-heading font-bold text-success">코인 +{coins}</p>
        <button
          type="button"
          onClick={onDone}
          className="min-h-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
