"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";

import { allowanceSquareContent, type AllowanceJarId } from "@/data/allowanceSquareContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const JARS = allowanceSquareContent.jars;
const TOTAL_COINS = allowanceSquareContent.totalCoins;

function DraggableCoin({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: CSSProperties = { transform: CSS.Translate.toString(transform) };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      aria-label="용돈 동전"
      className={`flex h-11 w-11 min-h-touch min-w-touch touch-none items-center justify-center rounded-full bg-district1-secondary text-heading shadow transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span aria-hidden>🪙</span>
    </button>
  );
}

// SVG clipPath로 항아리 안쪽 모양을 자르고, 그 안의 사각형 높이를 Motion으로 트윈해
// 액체가 차오르는 느낌을 낸다(docs/implementation.md 8-2).
function JarVisual({
  jarId,
  colorHex,
  heightRatio,
  reducedMotion,
}: {
  jarId: string;
  colorHex: string;
  heightRatio: number;
  reducedMotion: boolean;
}) {
  const jarTop = 10;
  const jarBottom = 95;
  const innerHeight = jarBottom - jarTop;
  const liquidHeight = innerHeight * Math.min(heightRatio, 1);
  const liquidY = jarBottom - liquidHeight;
  const clipId = `jar-clip-${jarId}`;

  return (
    <svg viewBox="0 0 80 100" className="h-24 w-20" aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d="M15,10 H65 V20 L60,95 H20 L15,20 Z" />
        </clipPath>
      </defs>
      <path d="M15,10 H65 V20 L60,95 H20 L15,20 Z" fill="#ffffff" stroke={colorHex} strokeWidth={3} />
      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          x={10}
          width={60}
          fill={colorHex}
          initial={false}
          animate={{ y: liquidY, height: liquidHeight }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
        />
      </g>
    </svg>
  );
}

function JarDropZone({
  id,
  labelKo,
  emoji,
  colorHex,
  count,
  reducedMotion,
}: {
  id: AllowanceJarId;
  labelKo: string;
  emoji: string;
  colorHex: string;
  count: number;
  reducedMotion: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-touch flex-col items-center gap-1 rounded-2xl border-2 border-dashed p-2 transition ${
        isOver ? "border-district1-primary bg-district1-primary-light text-gray-900" : "border-transparent"
      }`}
    >
      <JarVisual jarId={id} colorHex={colorHex} heightRatio={count / TOTAL_COINS} reducedMotion={reducedMotion} />
      <span aria-hidden className="text-body">
        {emoji}
      </span>
      <span className="text-caption">
        {labelKo} ({count})
      </span>
    </div>
  );
}

export interface AllowanceJarGameProps {
  onComplete: (score: number) => void;
}

export function AllowanceJarGame({ onComplete }: AllowanceJarGameProps) {
  const reducedMotion = useReducedMotion();
  const [trayCoins, setTrayCoins] = useState<string[]>(() =>
    Array.from({ length: TOTAL_COINS }, (_, index) => `coin-${index}`),
  );
  const [jarCounts, setJarCounts] = useState<Record<AllowanceJarId, number>>(() =>
    Object.fromEntries(JARS.map((jar) => [jar.id, 0])) as Record<AllowanceJarId, number>,
  );
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (trayCoins.length > 0 || finishedRef.current) return;
    finishedRef.current = true;
    const timeout = window.setTimeout(
      () => {
        const emptyJar = JARS.find((jar) => jarCounts[jar.id] === 0);
        setEventMessage(
          emptyJar ? allowanceSquareContent.emptyJarEventKo[emptyJar.id] : allowanceSquareContent.balancedEventKo,
        );
        onComplete(TOTAL_COINS);
      },
      reducedMotion ? 0 : 300,
    );
    return () => window.clearTimeout(timeout);
  }, [trayCoins.length, jarCounts, reducedMotion, onComplete]);

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    const jarId = event.over.id as AllowanceJarId;
    const coinId = event.active.id as string;

    setTrayCoins((prev) => (prev.includes(coinId) ? prev.filter((id) => id !== coinId) : prev));
    setJarCounts((prev) => ({ ...prev, [jarId]: prev[jarId] + 1 }));
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex min-h-touch min-w-full flex-wrap justify-center gap-2 rounded-2xl bg-white/60 p-3 text-gray-900">
          {trayCoins.length === 0 ? (
            <p className="text-caption">동전을 다 나눠 담았어요!</p>
          ) : (
            trayCoins.map((coinId) => <DraggableCoin key={coinId} id={coinId} />)
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {JARS.map((jar) => (
            <JarDropZone
              key={jar.id}
              id={jar.id}
              labelKo={jar.labelKo}
              emoji={jar.emoji}
              colorHex={jar.colorHex}
              count={jarCounts[jar.id]}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </DndContext>

      {eventMessage && (
        <div className="rounded-3xl bg-white p-4 text-center text-gray-900 shadow">
          <p className="text-body">{eventMessage}</p>
        </div>
      )}
    </div>
  );
}
