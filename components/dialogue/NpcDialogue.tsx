"use client";

import { useSound } from "@/components/providers/SoundProvider";
import { VillageChiefCharacter } from "@/components/rive/VillageChiefCharacter";
import type { CharacterMood } from "@/components/rive/RiveCharacter";

export interface NpcDialogueProps {
  speakerName: string;
  message: string;
  narrationSrc?: string;
  onNext?: () => void;
  character?: "village-chief" | "none";
  mood?: CharacterMood;
}

export function NpcDialogue({
  speakerName,
  message,
  narrationSrc,
  onNext,
  character = "village-chief",
  mood = "neutral",
}: NpcDialogueProps) {
  const { playNarration } = useSound();

  return (
    <div className="flex items-start gap-3 rounded-card bg-surface p-4 text-ink shadow-card">
      {character === "village-chief" && (
        <div className="shrink-0">
          <VillageChiefCharacter mood={mood} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-caption font-semibold text-ink">{speakerName}</p>
        <p className="text-body text-fg">{message}</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => playNarration(narrationSrc)}
            className="min-h-touch min-w-touch rounded-pill bg-primary-light px-3 py-1 text-caption text-primary"
          >
            ▶️ 다시 듣기
          </button>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="min-h-touch min-w-touch rounded-pill bg-primary px-3 py-1 text-caption text-white"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
