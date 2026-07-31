"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// PixiJS·Rive·Matter.js는 next/dynamic(ssr:false)로만 임포트한다(CLAUDE.md 절대 규칙 3) —
// 마을 지도/허브 화면의 초기 번들에 무거운 Rive 런타임이 섞이면 안 된다.
const RiveCharacterCanvas = dynamic(() => import("./RiveCharacterCanvas"), {
  ssr: false,
  loading: () => <div className="h-16 w-16 animate-pulse rounded-pill bg-surface-muted" aria-hidden />,
});

export type CharacterMood = "happy" | "neutral" | "worried";

const MOOD_VALUE: Record<CharacterMood, number> = { worried: 0, neutral: 1, happy: 2 };

export interface RiveCharacterProps {
  src: string;
  stateMachineName: string;
  inputName?: string;
  mood: CharacterMood;
  ariaLabel: string;
  className?: string;
  // .riv 자산이 없거나 로드에 실패했을 때 그대로 보여줄 정적 대체 UI(이모지 등).
  fallback: ReactNode;
}

export function RiveCharacter({
  src,
  stateMachineName,
  inputName = "mood",
  mood,
  ariaLabel,
  className,
  fallback,
}: RiveCharacterProps) {
  if (!src) return <>{fallback}</>;

  return (
    <RiveCharacterCanvas
      src={src}
      stateMachineName={stateMachineName}
      inputName={inputName}
      moodValue={MOOD_VALUE[mood]}
      ariaLabel={ariaLabel}
      className={className}
      fallback={fallback}
    />
  );
}
