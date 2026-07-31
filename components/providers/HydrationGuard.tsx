"use client";

import type { ReactNode } from "react";

import { useGameStore } from "@/store/useGameStore";

// Zustand persist가 localStorage에서 복원을 마치기 전까지는 저장된 진행 상태를
// 화면에 반영하지 않는다 — 서버에서 만든 최초 정적 HTML과의 하이드레이션 불일치를 막기 위함.
export function HydrationGuard({ children }: { children: ReactNode }) {
  const hasHydrated = useGameStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-full">
        <p className="text-body">불러오는 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
