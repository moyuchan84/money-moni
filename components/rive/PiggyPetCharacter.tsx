"use client";

import { RiveCharacter, type CharacterMood } from "./RiveCharacter";

export interface PiggyPetCharacterProps {
  mood: CharacterMood;
  className?: string;
}

// public/content/rive/piggy-pet.riv은 아직 0바이트 placeholder다(실제 .riv 제작 전).
// 로드되지 않으면 기존 🐷 이모지로 자동 폴백한다. 아바타의 펫 선택(고양이/부엉이 등)별
// 개별 애니메이션은 이번 Phase 범위 밖이며, "저금통 펫" 하나의 상태 머신만 다룬다.
export function PiggyPetCharacter({ mood, className }: PiggyPetCharacterProps) {
  return (
    <RiveCharacter
      src="/content/rive/piggy-pet.riv"
      stateMachineName="PetState"
      mood={mood}
      ariaLabel="저금통 펫"
      className={className ?? "flex h-24 w-24 items-center justify-center text-display"}
      fallback={
        <span aria-hidden className="flex h-24 w-24 items-center justify-center text-display">
          🐷
        </span>
      }
    />
  );
}
