"use client";

import { useState, type CSSProperties } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { etfLabContent, type EtfSnackCard } from "@/data/etfLabContent";
import { ComparisonBarChart } from "@/components/minigame/ComparisonBarChart";

const SNACKS = etfLabContent.snacks;

function DraggableSnackCard({ snack }: { snack: EtfSnackCard }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: snack.id });
  const style: CSSProperties = { transform: CSS.Translate.toString(transform) };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      aria-label={`${snack.labelKo} 카드`}
      className={`min-h-touch min-w-touch flex touch-none flex-col items-center gap-1 rounded-control border border-border bg-surface p-2 shadow-card ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span aria-hidden className="text-heading">
        {snack.emoji}
      </span>
      <span className="text-caption text-muted">{snack.labelKo}</span>
    </button>
  );
}

function BasketDropZone({ items }: { items: EtfSnackCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: "basket" });

  // reducedMotion 예외: 이 화면은 GSAP/Motion 트윈 없이 dnd-kit 드래그 위치와 아래 색상 하이라이트뿐이라
  // 줄일 대상 트윈이 없다(카드 등장/비교 전환도 즉시 상태 전환이라 지속시간 개념이 없음).
  return (
    <div
      ref={setNodeRef}
      aria-label="과자 바구니"
      className={`flex min-h-touch min-w-full flex-wrap justify-center gap-2 rounded-card border-2 border-dashed p-3 transition ${
        isOver ? "border-primary bg-primary-light" : "border-border bg-surface-muted"
      }`}
    >
      {items.length === 0 ? (
        <p className="text-caption text-muted">여기로 과자 카드를 끌어다 놓아봐</p>
      ) : (
        items.map((snack) => (
          <span
            key={snack.id}
            className="flex flex-col items-center gap-1 rounded-control bg-surface p-2 text-center text-ink"
          >
            <span aria-hidden className="text-heading">
              {snack.emoji}
            </span>
            <span className="text-caption text-muted">{snack.labelKo}</span>
          </span>
        ))
      )}
    </div>
  );
}

export interface EtfBasketGameProps {
  onComplete: (score: number) => void;
}

export function EtfBasketGame({ onComplete }: EtfBasketGameProps) {
  const [availableIds, setAvailableIds] = useState<string[]>(SNACKS.map((snack) => snack.id));
  const [basketIds, setBasketIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.over.id !== "basket") return;
    const snackId = event.active.id as string;
    setAvailableIds((prev) => prev.filter((id) => id !== snackId));
    setBasketIds((prev) => (prev.includes(snackId) ? prev : [...prev, snackId]));
  }

  const basketSnacks = SNACKS.filter((snack) => basketIds.includes(snack.id));
  const canCompare = basketIds.length >= etfLabContent.minBasketItems;
  const basketAverageVolatility = basketSnacks.length
    ? Math.round(basketSnacks.reduce((sum, snack) => sum + snack.volatilityPct, 0) / basketSnacks.length)
    : 0;

  if (comparing) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <p className="text-body font-semibold text-ink">바구니 vs 한 종류만 샀을 때, 흔들림 비교</p>
        <ComparisonBarChart
          items={[
            { id: "basket", labelKo: "내 바구니(여러 개)", value: basketAverageVolatility, colorHex: "#22c55e" },
            {
              id: "single",
              labelKo: "한 종류만 샀을 때",
              value: etfLabContent.singleSnackVolatilityPct,
              colorHex: "#ef4444",
            },
          ]}
          maxValue={Math.max(basketAverageVolatility, etfLabContent.singleSnackVolatilityPct, 1)}
          unitLabelKo="%"
        />
        <button
          type="button"
          onClick={() => onComplete(basketIds.length)}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          완료
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex min-h-touch flex-wrap justify-center gap-2">
          {availableIds.length === 0 ? (
            <p className="text-caption text-muted">모든 과자를 바구니에 담았어요!</p>
          ) : (
            SNACKS.filter((snack) => availableIds.includes(snack.id)).map((snack) => (
              <DraggableSnackCard key={snack.id} snack={snack} />
            ))
          )}
        </div>
        <BasketDropZone items={basketSnacks} />
      </DndContext>
      <button
        type="button"
        onClick={() => setComparing(true)}
        disabled={!canCompare}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white disabled:opacity-40"
      >
        {canCompare ? "비교하기" : `비교하기 (${etfLabContent.minBasketItems}개 이상 담아봐)`}
      </button>
    </div>
  );
}
