"use client";

import { RiveCharacter, type CharacterMood } from "./RiveCharacter";

export interface SquirrelGrandpaCharacterProps {
  mood?: CharacterMood;
  className?: string;
}

// public/content/rive/squirrel-grandpa.riv은 아직 0바이트 placeholder다(실제 .riv 제작 전).
// 로드되지 않으면 기존 🐿️ 이모지로 자동 폴백한다.
export function SquirrelGrandpaCharacter({ mood = "neutral", className }: SquirrelGrandpaCharacterProps) {
  return (
    <RiveCharacter
      src="/content/rive/squirrel-grandpa.riv"
      stateMachineName="SquirrelGrandpaState"
      mood={mood}
      ariaLabel="다람쥐 할아버지 캐릭터"
      className={className ?? "flex h-16 w-16 items-center justify-center rounded-pill bg-primary-light text-heading"}
      fallback={
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-pill bg-primary-light text-heading"
        >
          🐿️
        </div>
      }
    />
  );
}
