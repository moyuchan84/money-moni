"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

// 스플래시("/")와 미니게임 플레이 화면(".../minigame")에서는 헤더/하단내비를 완전히 숨긴다
// (opacity가 아니라 렌더 자체를 생략 — 게임 캔버스가 공간을 온전히 쓰도록).
function isFocusMode(pathname: string): boolean {
  return pathname === "/" || pathname.endsWith("/minigame");
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isFocusMode(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      {children}
      <BottomNav />
    </>
  );
}
