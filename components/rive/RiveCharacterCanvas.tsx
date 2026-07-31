"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

// .riv 자산이 준비되지 않았거나(placeholder) 로드에 실패하면 이 시간 안에 폴백으로 전환한다.
const LOAD_TIMEOUT_MS = 3000;

export interface RiveCharacterCanvasProps {
  src: string;
  stateMachineName: string;
  inputName: string;
  moodValue: number;
  ariaLabel: string;
  className?: string;
  fallback: ReactNode;
}

// @rive-app/react-canvas를 직접 import하는 유일한 파일이다 — 반드시 RiveCharacter.tsx의
// next/dynamic(ssr:false)를 통해서만 불러온다(CLAUDE.md 절대 규칙 3).
export default function RiveCharacterCanvas({
  src,
  stateMachineName,
  inputName,
  moodValue,
  ariaLabel,
  className,
  fallback,
}: RiveCharacterCanvasProps) {
  const [failed, setFailed] = useState(false);

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay: true,
    onLoadError: () => setFailed(true),
  });

  const input = useStateMachineInput(rive, stateMachineName, inputName);

  useEffect(() => {
    // StateMachineInput은 @rive-app/react-canvas가 제공하는 라이브러리 클래스 인스턴스이고,
    // .value 세터로 상태 머신 입력값을 바꾸는 것이 Rive의 공식 API다(React 상태가 아님).
    // eslint-disable-next-line react-hooks/immutability
    if (input) input.value = moodValue;
  }, [input, moodValue]);

  // 0바이트 placeholder 자산은 onLoadError 이벤트 없이 그냥 멈춰있을 수 있으므로,
  // 일정 시간 안에 rive 인스턴스가 준비되지 않으면 폴백으로 전환한다.
  useEffect(() => {
    if (rive || failed) return;
    const timeout = window.setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [rive, failed]);

  if (failed) return <>{fallback}</>;

  return (
    <div role="img" aria-label={ariaLabel} className={className}>
      <RiveComponent />
    </div>
  );
}
