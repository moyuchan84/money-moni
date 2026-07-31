"use client";

import { useEffect, useRef } from "react";
import { Graphics, Text, type Application, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";

// PixiJS는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
// "물가 요정"이 날아다니는 연출과, 그 틱 루프 위에서 주기적으로 가격을 올리는 이벤트만 이 캔버스가 맡는다.
// 가격 숫자 자체의 카운트업 표시는 별도 DOM 컴포넌트(PriceCounter)가 Motion으로 처리한다.

export interface MarketPriceCanvasProps {
  width: number;
  height: number;
  reducedMotion: boolean;
  priceTickIntervalMs: number;
  onPriceTick: () => void;
}

export default function MarketPriceCanvas({
  width,
  height,
  reducedMotion,
  priceTickIntervalMs,
  onPriceTick,
}: MarketPriceCanvasProps) {
  const onPriceTickRef = useRef(onPriceTick);

  useEffect(() => {
    onPriceTickRef.current = onPriceTick;
  });

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xfef9c3}
      onReady={(app) =>
        setupGame(app, {
          width,
          height,
          reducedMotion,
          priceTickIntervalMs,
          onPriceTick: () => onPriceTickRef.current(),
        })
      }
    />
  );
}

interface SetupOptions {
  width: number;
  height: number;
  reducedMotion: boolean;
  priceTickIntervalMs: number;
  onPriceTick: () => void;
}

function setupGame(app: Application, options: SetupOptions) {
  const { width, height, reducedMotion, priceTickIntervalMs, onPriceTick } = options;

  const stall = new Graphics().roundRect(width / 2 - 40, height - 60, 80, 50, 10).fill(0xfdba74).stroke({
    width: 3,
    color: 0xea580c,
  });
  app.stage.addChild(stall);

  const stallLabel = new Text({ text: "🍬 사탕 가게", style: { fontSize: 16, fill: 0x7c2d12 } });
  stallLabel.anchor.set(0.5, 0);
  stallLabel.position.set(width / 2, height - 55);
  app.stage.addChild(stallLabel);

  const fairy = new Text({ text: "🧚", style: { fontSize: 32 } });
  fairy.anchor.set(0.5);
  fairy.position.set(width / 2, 40);
  app.stage.addChild(fairy);

  const amplitude = width / 2 - 30;
  const speed = reducedMotion ? 0.0008 : 0.0015;
  let elapsedMs = 0;
  let sincePriceTickMs = 0;

  const tickerCallback = (ticker: Ticker) => {
    elapsedMs += ticker.deltaMS;
    fairy.x = width / 2 + Math.sin(elapsedMs * speed) * amplitude;
    fairy.y = 40 + Math.cos(elapsedMs * speed * 1.7) * 12;

    sincePriceTickMs += ticker.deltaMS;
    if (sincePriceTickMs >= priceTickIntervalMs) {
      sincePriceTickMs = 0;
      onPriceTick();
      fairy.scale.set(1.3);
    } else {
      fairy.scale.x += (1 - fairy.scale.x) * 0.1;
      fairy.scale.y += (1 - fairy.scale.y) * 0.1;
    }
  };
  app.ticker.add(tickerCallback);

  return () => {
    app.ticker.remove(tickerCallback);
  };
}
