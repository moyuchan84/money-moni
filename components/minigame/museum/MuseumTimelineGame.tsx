"use client";

import { useState, type CSSProperties } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";

import { museumContent } from "@/data/museumContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MuseumTimelineStrip } from "./MuseumTimelineStrip";

const ERAS = museumContent.eras;
const FIRST_ERA = ERAS[0];
const LAST_ERA = ERAS[ERAS.length - 1];

function DraggableItem({ id, emoji, label }: { id: string; emoji: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: CSSProperties = { transform: CSS.Translate.toString(transform) };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      aria-label={label}
      className={`flex h-20 w-20 min-h-touch min-w-touch touch-none items-center justify-center rounded-control bg-surface text-display shadow-card transition ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <span aria-hidden>{emoji}</span>
    </button>
  );
}

function DroppableZone({ id, label, emoji }: { id: string; label: string; emoji: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-touch w-28 flex-col items-center gap-1 rounded-control border-2 border-dashed p-4 text-center text-ink transition ${
        isOver ? "border-primary bg-primary-light" : "border-border bg-surface-muted"
      }`}
    >
      <span aria-hidden className="text-heading">
        {emoji}
      </span>
      <span className="text-caption text-muted">{label}</span>
    </div>
  );
}

export interface MuseumTimelineGameProps {
  onComplete: (score: number) => void;
}

type Phase = "matching" | "failAttempt" | "failed";

export function MuseumTimelineGame({ onComplete }: MuseumTimelineGameProps) {
  const reducedMotion = useReducedMotion();
  const [eraIndex, setEraIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("matching");
  const [shaking, setShaking] = useState(false);

  const currentEra = ERAS[eraIndex];

  function handleMatchDragEnd(event: DragEndEvent) {
    if (!event.over || !currentEra || event.over.id !== currentEra.id) return;
    const nextIndex = eraIndex + 1;
    setEraIndex(nextIndex);
    if (nextIndex >= ERAS.length) {
      setPhase("failAttempt");
    }
  }

  function handleFailDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    setShaking(true);
    window.setTimeout(
      () => {
        setShaking(false);
        setPhase("failed");
        onComplete(ERAS.length);
      },
      reducedMotion ? 0 : 900,
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <MuseumTimelineStrip eras={ERAS} activeEraIndex={Math.min(eraIndex, ERAS.length - 1)} />

      {phase === "matching" && currentEra && (
        <DndContext onDragEnd={handleMatchDragEnd}>
          <div className="flex flex-col items-center gap-3">
            <p className="text-body">{currentEra.sceneKo}</p>
            <div className="flex items-center gap-6">
              <DraggableItem id="museum-item" emoji={currentEra.itemEmoji} label={currentEra.itemLabelKo} />
              <span aria-hidden className="text-heading">
                ➡️
              </span>
              <DroppableZone id={currentEra.id} label={currentEra.currencyLabelKo} emoji={currentEra.currencyEmoji} />
            </div>
          </div>
        </DndContext>
      )}

      {phase === "failAttempt" && (
        <DndContext onDragEnd={handleFailDragEnd}>
          <div className="flex flex-col items-center gap-3">
            <p className="text-body">{museumContent.failAttempt.promptKo}</p>
            <div className="flex items-center gap-6">
              <motion.div
                animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.5 }}
              >
                <DraggableItem id="museum-item" emoji={FIRST_ERA.currencyEmoji} label={FIRST_ERA.currencyLabelKo} />
              </motion.div>
              <span aria-hidden className="text-heading">
                ➡️
              </span>
              <DroppableZone id="today-market" label={LAST_ERA.currencyLabelKo} emoji={LAST_ERA.currencyEmoji} />
            </div>
          </div>
        </DndContext>
      )}

      {phase === "failed" && <p className="text-body">{museumContent.failAttempt.failMessageKo}</p>}
    </div>
  );
}
