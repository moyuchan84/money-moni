"use client";

import { useEffect, useRef } from "react";
import { Text, type Application, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";

// PixiJS는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
// 바구니 두 개가 각각 독립적으로 감쇠 진동(damped sine)하며, 담긴 종류 수에 따라 진폭이 다르게
// 줄어드는 걸 보여준다. LoanBalanceCanvas.tsx처럼 결정론적 시뮬레이션이 핵심이 아니라 "느낌"을
// 전달하는 게 목적이라 Matter.js 없이 순수 sine 감쇠로 충분하다(docs/almanac-interactive.md 6-8).

export interface DiversificationBasketCanvasProps {
  width: number;
  height: number;
  reducedMotion: boolean;
  singleShakeCount: number; // "한 종류만" 바구니 흔들기 누른 누적 횟수
  multiShakeCount: number; // "여러 종류" 바구니 흔들기 누른 누적 횟수
}

const SINGLE_AMPLITUDE = 26;
const MULTI_AMPLITUDE = 10;
const DECAY = 0.94;
const FREQUENCY = 0.012;

export default function DiversificationBasketCanvas({
  width,
  height,
  reducedMotion,
  singleShakeCount,
  multiShakeCount,
}: DiversificationBasketCanvasProps) {
  const latestSingleRef = useRef(singleShakeCount);
  useEffect(() => {
    latestSingleRef.current = singleShakeCount;
  });
  const latestMultiRef = useRef(multiShakeCount);
  useEffect(() => {
    latestMultiRef.current = multiShakeCount;
  });

  const shakeSingleFnRef = useRef<(() => void) | null>(null);
  const appliedSingleRef = useRef(0);
  function flushSingle() {
    while (shakeSingleFnRef.current && appliedSingleRef.current < latestSingleRef.current) {
      shakeSingleFnRef.current();
      appliedSingleRef.current += 1;
    }
  }
  useEffect(() => {
    flushSingle();
  }, [singleShakeCount]);

  const shakeMultiFnRef = useRef<(() => void) | null>(null);
  const appliedMultiRef = useRef(0);
  function flushMulti() {
    while (shakeMultiFnRef.current && appliedMultiRef.current < latestMultiRef.current) {
      shakeMultiFnRef.current();
      appliedMultiRef.current += 1;
    }
  }
  useEffect(() => {
    flushMulti();
  }, [multiShakeCount]);

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xf0fdf4}
      onReady={(app) =>
        setupScene(app, {
          width,
          height,
          reducedMotion,
          registerShakeSingle: (fn) => {
            shakeSingleFnRef.current = fn;
            flushSingle();
          },
          registerShakeMulti: (fn) => {
            shakeMultiFnRef.current = fn;
            flushMulti();
          },
        })
      }
    />
  );
}

interface SetupOptions {
  width: number;
  height: number;
  reducedMotion: boolean;
  registerShakeSingle: (fn: () => void) => void;
  registerShakeMulti: (fn: () => void) => void;
}

function setupScene(app: Application, options: SetupOptions) {
  const { width, height, reducedMotion, registerShakeSingle, registerShakeMulti } = options;
  const basketY = height / 2;
  const singleX = width * 0.28;
  const multiX = width * 0.72;

  const singleBasket = new Text({ text: "🧺", style: { fontSize: 40 } });
  singleBasket.anchor.set(0.5);
  singleBasket.position.set(singleX, basketY);
  app.stage.addChild(singleBasket);

  const singleContents = new Text({ text: "🍪", style: { fontSize: 20 } });
  singleContents.anchor.set(0.5);
  singleContents.position.set(singleX, basketY - 28);
  app.stage.addChild(singleContents);

  const multiBasket = new Text({ text: "🧺", style: { fontSize: 40 } });
  multiBasket.anchor.set(0.5);
  multiBasket.position.set(multiX, basketY);
  app.stage.addChild(multiBasket);

  const multiContents = new Text({ text: "🍪🍎🥕", style: { fontSize: 15 } });
  multiContents.anchor.set(0.5);
  multiContents.position.set(multiX, basketY - 28);
  app.stage.addChild(multiContents);

  const labelStyle = { fontSize: 13, fill: 0x166534 };
  const singleLabel = new Text({ text: "한 종류만", style: labelStyle });
  singleLabel.anchor.set(0.5);
  singleLabel.position.set(singleX, basketY + 34);
  app.stage.addChild(singleLabel);

  const multiLabel = new Text({ text: "여러 종류", style: labelStyle });
  multiLabel.anchor.set(0.5);
  multiLabel.position.set(multiX, basketY + 34);
  app.stage.addChild(multiLabel);

  let singleAmplitude = 0;
  let multiAmplitude = 0;
  let elapsedMs = 0;

  registerShakeSingle(() => {
    singleAmplitude = reducedMotion ? 0 : SINGLE_AMPLITUDE;
  });
  registerShakeMulti(() => {
    multiAmplitude = reducedMotion ? 0 : MULTI_AMPLITUDE;
  });

  const tickerCallback = (ticker: Ticker) => {
    elapsedMs += ticker.deltaMS;
    singleBasket.x = singleX + singleAmplitude * Math.sin(elapsedMs * FREQUENCY);
    singleContents.x = singleBasket.x;
    multiBasket.x = multiX + multiAmplitude * Math.sin(elapsedMs * FREQUENCY * 1.15);
    multiContents.x = multiBasket.x;
    singleAmplitude *= DECAY;
    multiAmplitude *= DECAY;
  };
  app.ticker.add(tickerCallback);

  return () => {
    app.ticker.remove(tickerCallback);
  };
}
