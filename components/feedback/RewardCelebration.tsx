"use client";

export interface RewardCelebrationProps {
  coins: number;
  visible: boolean;
  onDone?: () => void;
}

export function RewardCelebration({ coins, visible, onDone }: RewardCelebrationProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-xl">
        <p aria-hidden className="text-display">
          🎉
        </p>
        <p className="text-heading font-heading">코인 +{coins}</p>
        <button
          type="button"
          onClick={onDone}
          className="min-h-touch rounded-full bg-district1-primary px-6 py-2 text-body text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
