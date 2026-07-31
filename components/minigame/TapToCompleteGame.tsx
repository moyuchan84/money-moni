"use client";

import { useState } from "react";

export interface TapToCompleteGameProps {
  targetTaps: number;
  onComplete: (score: number) => void;
}

export function TapToCompleteGame({ targetTaps, onComplete }: TapToCompleteGameProps) {
  const [taps, setTaps] = useState(0);
  const done = taps >= targetTaps;

  function handleTap() {
    if (done) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= targetTaps) {
      onComplete(next);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleTap}
        disabled={done}
        aria-label="코인 모으기"
        className="flex h-32 w-32 items-center justify-center rounded-pill bg-primary text-display text-white shadow-card transition active:scale-95 disabled:opacity-60"
      >
        <span aria-hidden>{done ? "✅" : "🪙"}</span>
      </button>
      <p className="text-caption text-muted">
        {taps} / {targetTaps}
      </p>
    </div>
  );
}
