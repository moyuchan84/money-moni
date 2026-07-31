"use client";

import type { ReactNode } from "react";

// dnd-kit은 아직 설치되지 않았다(Phase 2에서 도입). 실제 구현 시 이 컴포넌트를
// dnd-kit의 useDroppable과 연결한다. 지금은 props 인터페이스만 확정한다.

export interface DndTargetZoneProps {
  id: string;
  label: string;
  isOver?: boolean;
  children?: ReactNode;
}

export function DndTargetZone({ id, label, isOver, children }: DndTargetZoneProps) {
  return (
    <div
      data-zone-id={id}
      className={`min-h-touch rounded-2xl border-2 border-dashed p-4 text-center ${
        isOver ? "border-district2-primary bg-district2-primary-light" : "border-district2-secondary"
      }`}
    >
      <p className="text-caption">{label}</p>
      {children}
    </div>
  );
}
