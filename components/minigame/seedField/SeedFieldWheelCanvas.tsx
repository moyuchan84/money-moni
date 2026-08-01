"use client";

import { useEffect, useRef } from "react";
import { Graphics, Text, type Application, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";
import type { SeedFieldSegment } from "@/data/seedFieldContent";

// PixiJS는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
// 결과(멈출 각도)는 rouletteMath.ts에서 이미 역산되어 targetRotation으로 전달된다. 이 캔버스는
// requestAnimationFrame(Pixi ticker) 기반으로 현재 회전각을 목표까지 easeOut으로 보간할 뿐,
// 확률/결과 판정 로직을 갖지 않는다(implementation.md 8-4).

const SPIN_DURATION_MS_NORMAL = 2200;
const SPIN_DURATION_MS_REDUCED = 400;

export interface SeedFieldWheelCanvasProps {
  width: number;
  height: number;
  segments: SeedFieldSegment[];
  reducedMotion: boolean;
  spinRequestId: number; // 0에서 시작, 스핀을 요청할 때마다 1씩 증가
  targetRotation: number; // 누적 절대 회전각(라디안) — 매 스핀마다 더 커진다
  onSpinComplete: () => void;
  onCanvasReady: () => void;
}

export default function SeedFieldWheelCanvas({
  width,
  height,
  segments,
  reducedMotion,
  spinRequestId,
  targetRotation,
  onSpinComplete,
  onCanvasReady,
}: SeedFieldWheelCanvasProps) {
  const onSpinCompleteRef = useRef(onSpinComplete);
  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  });
  const onCanvasReadyRef = useRef(onCanvasReady);
  useEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
  });

  const applyTargetRef = useRef<((rotation: number) => void) | null>(null);
  const appliedRequestIdRef = useRef(0);

  useEffect(() => {
    if (spinRequestId > 0 && spinRequestId !== appliedRequestIdRef.current) {
      appliedRequestIdRef.current = spinRequestId;
      applyTargetRef.current?.(targetRotation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinRequestId]);

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xecfccb}
      onReady={(app) =>
        setupGame(app, {
          width,
          height,
          segments,
          reducedMotion,
          onSpinComplete: () => onSpinCompleteRef.current(),
          registerApplyTarget: (fn) => {
            applyTargetRef.current = fn;
            onCanvasReadyRef.current();
          },
        })
      }
    />
  );
}

interface SetupOptions {
  width: number;
  height: number;
  segments: SeedFieldSegment[];
  reducedMotion: boolean;
  onSpinComplete: () => void;
  registerApplyTarget: (fn: (rotation: number) => void) => void;
}

function setupGame(app: Application, options: SetupOptions) {
  const { width, height, segments, reducedMotion, onSpinComplete, registerApplyTarget } = options;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 16;
  const TWO_PI = Math.PI * 2;
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);

  const wheel = new Graphics();
  let cumulative = 0;
  for (const segment of segments) {
    const startAngle = (cumulative / totalWeight) * TWO_PI - Math.PI / 2;
    const endAngle = ((cumulative + segment.weight) / totalWeight) * TWO_PI - Math.PI / 2;
    wheel.moveTo(0, 0).arc(0, 0, radius, startAngle, endAngle).lineTo(0, 0).fill(segment.colorHex).stroke({
      width: 2,
      color: 0xffffff,
    });
    cumulative += segment.weight;
  }
  wheel.position.set(centerX, centerY);
  app.stage.addChild(wheel);

  cumulative = 0;
  for (const segment of segments) {
    const midAngle = ((cumulative + segment.weight / 2) / totalWeight) * TWO_PI - Math.PI / 2;
    const label = new Text({ text: segment.emoji, style: { fontSize: 22 } });
    label.anchor.set(0.5);
    label.position.set(Math.cos(midAngle) * radius * 0.6, Math.sin(midAngle) * radius * 0.6);
    wheel.addChild(label);
    cumulative += segment.weight;
  }

  // 고정 포인터 — wheel의 자식이 아니라 stage에 직접 그려 회전하지 않는다.
  const pointer = new Graphics().poly([centerX - 10, 4, centerX + 10, 4, centerX, 24]).fill(0x1f2937);
  app.stage.addChild(pointer);

  let currentRotation = 0;
  let spinStartRotation = 0;
  let spinTargetRotation = 0;
  let spinStartedAt = 0;
  let spinning = false;
  const spinDurationMs = reducedMotion ? SPIN_DURATION_MS_REDUCED : SPIN_DURATION_MS_NORMAL;

  function applyTarget(targetRotation: number) {
    spinStartRotation = currentRotation;
    spinTargetRotation = targetRotation;
    spinStartedAt = 0;
    spinning = true;
  }
  registerApplyTarget(applyTarget);

  const tickerCallback = (ticker: Ticker) => {
    if (!spinning) return;
    spinStartedAt += ticker.deltaMS;
    const t = Math.min(1, spinStartedAt / spinDurationMs);
    const eased = 1 - (1 - t) ** 3; // cubic ease-out
    currentRotation = spinStartRotation + (spinTargetRotation - spinStartRotation) * eased;
    wheel.rotation = currentRotation;

    if (t >= 1) {
      spinning = false;
      onSpinComplete();
    }
  };
  app.ticker.add(tickerCallback);

  return () => {
    app.ticker.remove(tickerCallback);
  };
}
