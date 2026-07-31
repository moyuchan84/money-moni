"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { jobCenterContent, type JobCenterCharacterId } from "@/data/jobCenterContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Pixi 없이 Motion의 AnimatePresence만으로 3~4개 정적 장면을 전환한다(docs/phases.md Phase 4).
const CHARACTERS = jobCenterContent.characters;

type Phase = "select" | "scenes" | "comparison";

export interface JobCenterDayGameProps {
  onComplete: (score: number) => void;
}

export function JobCenterDayGame({ onComplete }: JobCenterDayGameProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("select");
  const [characterId, setCharacterId] = useState<JobCenterCharacterId | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);

  const character = CHARACTERS.find((item) => item.id === characterId) ?? null;
  const transition = { duration: reducedMotion ? 0 : 0.3 };

  function handleSelect(id: JobCenterCharacterId) {
    setCharacterId(id);
    setSceneIndex(0);
    setPhase("scenes");
  }

  function handleNextScene() {
    if (!character) return;
    if (sceneIndex >= character.scenesKo.length - 1) {
      setPhase("comparison");
      return;
    }
    setSceneIndex((value) => value + 1);
  }

  function handleFinish() {
    if (!character) return;
    onComplete(character.scenesKo.length);
  }

  if (phase === "select") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CHARACTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className="min-h-touch flex flex-col items-center gap-1 rounded-control border border-border bg-surface p-4 text-center shadow-card"
            >
              <span aria-hidden className="text-display">
                {item.emoji}
              </span>
              <span className="text-body font-semibold text-ink">{item.nameKo}</span>
              <span className="text-caption text-muted">{item.incomeTypeLabelKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "scenes" && character) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            transition={transition}
            className="w-full rounded-card bg-surface p-4 text-center shadow-card"
          >
            <p aria-hidden className="text-display">
              {character.emoji}
            </p>
            <p className="text-body text-fg">{character.scenesKo[sceneIndex]}</p>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={handleNextScene}
          className="min-h-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          다음
        </button>
      </div>
    );
  }

  if (phase === "comparison" && character) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <p className="text-body font-semibold text-ink">{jobCenterContent.comparisonTitleKo}</p>
        <div className="flex w-full flex-col gap-2">
          {CHARACTERS.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-control border p-3 ${
                item.id === character.id ? "border-primary bg-primary-light" : "border-border bg-surface"
              }`}
            >
              <span className="text-body text-ink">
                {item.emoji} {item.nameKo}
              </span>
              <span className="text-body font-semibold text-ink">{item.eveningEarningsCoins}코인</span>
            </div>
          ))}
        </div>
        <p className="text-caption text-muted">{jobCenterContent.comparisonNoteKo}</p>
        <button
          type="button"
          onClick={handleFinish}
          className="min-h-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          확인했어요
        </button>
      </div>
    );
  }

  return null;
}
