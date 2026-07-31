"use client";

// PixiJS는 아직 설치되지 않았다(Phase 2에서 도입). 실제 구현 시 이 컴포넌트 내부에서만
// `next/dynamic(() => import('pixi.js'), { ssr: false })`로 임포트한다(CLAUDE.md 절대 규칙 3).

export interface PixiCanvasProps {
  width?: number;
  height?: number;
}

export function PixiCanvas({ width = 480, height = 320 }: PixiCanvasProps) {
  return (
    <div
      style={{ width, height }}
      className="flex items-center justify-center rounded-control border-2 border-dashed border-border bg-surface-muted text-caption text-muted"
    >
      미니게임을 준비하고 있어요
    </div>
  );
}
