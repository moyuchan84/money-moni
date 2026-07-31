"use client";

import { useSound } from "@/components/providers/SoundProvider";

export interface NpcDialogueProps {
  speakerName: string;
  message: string;
  narrationSrc?: string;
  onNext?: () => void;
}

export function NpcDialogue({ speakerName, message, narrationSrc, onNext }: NpcDialogueProps) {
  const { playNarration } = useSound();

  return (
    <div className="flex items-start gap-3 rounded-3xl bg-white p-4 text-gray-900 shadow">
      <div
        aria-hidden
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-district1-secondary-light text-heading"
      >
        🧑
      </div>
      <div className="flex-1">
        <p className="text-caption font-heading">{speakerName}</p>
        <p className="text-body">{message}</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => playNarration(narrationSrc)}
            className="min-h-touch min-w-touch rounded-full bg-district1-primary-light px-3 py-1 text-caption"
          >
            ▶️ 다시 듣기
          </button>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="min-h-touch min-w-touch rounded-full bg-district1-primary px-3 py-1 text-caption text-white"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
