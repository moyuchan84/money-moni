"use client";

import { useEffect, useReducer, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { StoryScene } from "@/data/storyScene";
import { useSound } from "@/components/providers/SoundProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VillageChiefCharacter } from "@/components/rive/VillageChiefCharacter";

export interface StorySceneViewerProps {
  scenes: StoryScene[];
  metaphorLineKo: string;
  bridgeLineKo: string;
  onComplete: () => void; // 마지막 컷에서 "시작하기" 클릭
  onSkip: () => void; // 건너뛰기 확정 시
}

export interface StoryViewerState {
  index: number;
  skipConfirmOpen: boolean;
}

export type StoryViewerAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "requestSkip" }
  | { type: "cancelSkip" };

// DOM 없이 단위 테스트하기 위해 순수 함수로 분리한다(StorySceneViewer.test.ts 참고).
export function storyViewerReducer(
  state: StoryViewerState,
  action: StoryViewerAction,
  totalScenes: number,
): StoryViewerState {
  switch (action.type) {
    case "next":
      return { ...state, index: Math.min(state.index + 1, totalScenes - 1) };
    case "prev":
      return { ...state, index: Math.max(state.index - 1, 0) };
    case "requestSkip":
      return { ...state, skipConfirmOpen: true };
    case "cancelSkip":
      return { ...state, skipConfirmOpen: false };
    default:
      return state;
  }
}

const SWIPE_THRESHOLD_PX = 50;

const SPEAKER_LABEL: Record<StoryScene["speaker"], string> = {
  narrator: "이야기꾼",
  npc: "촌장님",
  child: "나",
};

export function StorySceneViewer({
  scenes,
  metaphorLineKo,
  bridgeLineKo,
  onComplete,
  onSkip,
}: StorySceneViewerProps) {
  const totalScenes = scenes.length;
  const [state, dispatch] = useReducer(
    (currentState: StoryViewerState, action: StoryViewerAction) =>
      storyViewerReducer(currentState, action, totalScenes),
    { index: 0, skipConfirmOpen: false },
  );
  const { index, skipConfirmOpen } = state;
  const scene = scenes[index];
  const isLastScene = index === totalScenes - 1;

  const { playNarration } = useSound();
  const reducedMotion = useReducedMotion();

  // narrationOn 여부는 playNarration 내부에서 이미 처리하므로 여기서는 신경 쓰지 않는다.
  useEffect(() => {
    playNarration(scene.narrationSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // 스와이프 델타 추적 + 스와이프가 발생했을 때 뒤이어 오는 탭(click) 이벤트를 억제하기 위한 ref.
  const pointerStartX = useRef<number | null>(null);
  const swipedRef = useRef(false);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (startX === null) return;

    const delta = event.clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    swipedRef.current = true;
    dispatch({ type: delta < 0 ? "next" : "prev" });
  };

  const handleTapAdvance = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    dispatch({ type: "next" });
  };

  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: "requestSkip" })}
          className="min-h-touch min-w-touch rounded-pill bg-surface-muted px-3 py-1 text-caption text-muted"
        >
          건너뛰기
        </button>
      </div>

      <div
        className="relative flex-1 cursor-pointer touch-pan-y select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleTapAdvance}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            {scene.speaker === "npc" && <VillageChiefCharacter mood="neutral" />}
            <div className="w-full rounded-card bg-surface p-4 text-ink shadow-card">
              <p className="text-caption font-semibold text-muted">{SPEAKER_LABEL[scene.speaker]}</p>
              <p className="text-body text-fg">{scene.textKo}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isLastScene && (
        <div className="rounded-card bg-primary-light p-4 text-primary shadow-card">
          <p className="text-caption font-semibold">오늘의 한 마디</p>
          <p className="mt-1 text-body font-bold">{metaphorLineKo}</p>
          <p className="mt-2 text-body text-ink">{bridgeLineKo}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1" aria-hidden>
          {scenes.map((s, i) => (
            <span
              key={s.id}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <p className="text-caption text-muted">
          {index + 1} / {totalScenes}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "prev" })}
            className="min-h-touch min-w-touch rounded-control bg-surface-muted px-4 py-2 text-body text-ink"
          >
            이전
          </button>
        ) : (
          <span />
        )}

        {isLastScene ? (
          <button
            type="button"
            onClick={onComplete}
            className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
          >
            시작하기
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ type: "next" })}
            className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
          >
            다음
          </button>
        )}
      </div>

      {skipConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center text-ink shadow-card">
            <p className="text-body font-semibold text-ink">
              정말 건너뛸까요? 이야기를 보면 게임이 더 쉬워져요!
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "cancelSkip" })}
                className="min-h-touch min-w-touch rounded-control bg-surface-muted px-4 py-2 text-body text-ink"
              >
                아니요, 계속 볼래요
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="min-h-touch min-w-touch rounded-control bg-primary px-4 py-2 text-body text-white"
              >
                네, 건너뛸게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
