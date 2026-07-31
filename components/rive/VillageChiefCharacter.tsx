"use client";

import { RiveCharacter, type CharacterMood } from "./RiveCharacter";

export interface VillageChiefCharacterProps {
  mood?: CharacterMood;
  className?: string;
}

// public/content/rive/village-chief.riv은 아직 0바이트 placeholder다(실제 .riv 제작 전).
// 로드되지 않으면 기존 🧑 이모지로 자동 폴백한다.
export function VillageChiefCharacter({ mood = "neutral", className }: VillageChiefCharacterProps) {
  return (
    <RiveCharacter
      src="/content/rive/village-chief.riv"
      stateMachineName="ChiefState"
      mood={mood}
      ariaLabel="촌장님 캐릭터"
      className={className ?? "flex h-16 w-16 items-center justify-center rounded-pill bg-primary-light text-heading"}
      fallback={
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-pill bg-primary-light text-heading"
        >
          🧑
        </div>
      }
    />
  );
}
