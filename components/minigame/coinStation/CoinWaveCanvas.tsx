"use client";

import { useEffect, useRef } from "react";
import { Graphics, Text, type Application, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";

// PixiJS는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
// MarketPriceCanvas와 같은 ticker 기반 패턴으로 두 웨이브(코인=큰 진폭, 스테이블코인=작은 진폭)를
// 고정 시간 동안 이동시킨다. 값(소지금) 계산은 이 캔버스가 아니라 셸(CoinStationGame)이 맡는다 —
// 이 캔버스는 픽셀 오프셋만 콜백으로 넘긴다.

export interface CoinWaveCanvasProps {
  width: number;
  height: number;
  reducedMotion: boolean;
  raceDurationMs: number;
  coinAmplitudePx: number;
  stableAmplitudePx: number;
  running: boolean;
  onValueUpdate: (coinOffsetPx: number, stableOffsetPx: number) => void;
  onRaceDone: () => void;
}

export default function CoinWaveCanvas({
  width,
  height,
  reducedMotion,
  raceDurationMs,
  coinAmplitudePx,
  stableAmplitudePx,
  running,
  onValueUpdate,
  onRaceDone,
}: CoinWaveCanvasProps) {
  const onValueUpdateRef = useRef(onValueUpdate);
  useEffect(() => {
    onValueUpdateRef.current = onValueUpdate;
  });
  const onRaceDoneRef = useRef(onRaceDone);
  useEffect(() => {
    onRaceDoneRef.current = onRaceDone;
  });

  const startFnRef = useRef<(() => void) | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (running && !startedRef.current && startFnRef.current) {
      startedRef.current = true;
      startFnRef.current();
    }
  }, [running]);

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xeef2ff}
      onReady={(app) =>
        setupGame(app, {
          width,
          height,
          reducedMotion,
          raceDurationMs,
          coinAmplitudePx,
          stableAmplitudePx,
          onValueUpdate: (coin, stable) => onValueUpdateRef.current(coin, stable),
          onRaceDone: () => onRaceDoneRef.current(),
          registerStart: (fn) => {
            startFnRef.current = fn;
            if (running && !startedRef.current) {
              startedRef.current = true;
              fn();
            }
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
  raceDurationMs: number;
  coinAmplitudePx: number;
  stableAmplitudePx: number;
  onValueUpdate: (coinOffsetPx: number, stableOffsetPx: number) => void;
  onRaceDone: () => void;
  registerStart: (fn: () => void) => void;
}

function setupGame(app: Application, options: SetupOptions) {
  const {
    width,
    height,
    reducedMotion,
    raceDurationMs,
    coinAmplitudePx,
    stableAmplitudePx,
    onValueUpdate,
    onRaceDone,
    registerStart,
  } = options;

  const trackStartX = 24;
  const trackEndX = width - 24;
  const coinTrackY = height * 0.32;
  const stableTrackY = height * 0.72;

  const coinTrackLine = new Graphics()
    .moveTo(trackStartX, coinTrackY)
    .lineTo(trackEndX, coinTrackY)
    .stroke({ width: 2, color: 0xfca5a5 });
  const stableTrackLine = new Graphics()
    .moveTo(trackStartX, stableTrackY)
    .lineTo(trackEndX, stableTrackY)
    .stroke({ width: 2, color: 0x93c5fd });
  app.stage.addChild(coinTrackLine, stableTrackLine);

  const coinLabel = new Text({ text: "🎢 코인", style: { fontSize: 13, fill: 0x991b1b } });
  coinLabel.position.set(trackStartX, coinTrackY - 26);
  const stableLabel = new Text({ text: "🛟 스테이블코인", style: { fontSize: 13, fill: 0x1e3a8a } });
  stableLabel.position.set(trackStartX, stableTrackY - 26);
  app.stage.addChild(coinLabel, stableLabel);

  const coinCart = new Text({ text: "🪙", style: { fontSize: 22 } });
  coinCart.anchor.set(0.5);
  coinCart.position.set(trackStartX, coinTrackY);
  const stableCart = new Text({ text: "🪙", style: { fontSize: 22 } });
  stableCart.anchor.set(0.5);
  stableCart.position.set(trackStartX, stableTrackY);
  app.stage.addChild(coinCart, stableCart);

  let running = false;
  let elapsedMs = 0;
  const speed = reducedMotion ? 0.006 : 0.012;

  function start() {
    running = true;
  }
  registerStart(start);

  const tickerCallback = (ticker: Ticker) => {
    if (!running) return;
    elapsedMs += ticker.deltaMS;
    const progress = Math.min(1, elapsedMs / raceDurationMs);

    const coinOffset = Math.sin(elapsedMs * speed) * coinAmplitudePx;
    const stableOffset = Math.sin(elapsedMs * speed * 1.3) * stableAmplitudePx;

    coinCart.x = trackStartX + progress * (trackEndX - trackStartX);
    coinCart.y = coinTrackY + coinOffset;
    stableCart.x = trackStartX + progress * (trackEndX - trackStartX);
    stableCart.y = stableTrackY + stableOffset;

    onValueUpdate(coinOffset, stableOffset);

    if (progress >= 1) {
      running = false;
      onRaceDone();
    }
  };
  app.ticker.add(tickerCallback);

  return () => {
    app.ticker.remove(tickerCallback);
  };
}
