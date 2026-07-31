"use client";

import { useEffect, useRef } from "react";
import { Graphics, Text, type Application, type FederatedPointerEvent, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";
import { ledgerHouseContent } from "@/data/ledgerHouseContent";

// PixiJS는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
// 수입/지출 통은 문서 설계상 DOM 오버레이도 가능하지만, 좌표계 변환 없이 더 단순하고 견고하게
// 만들기 위해 이 구현에서는 통도 Pixi Graphics로 같은 스테이지 좌표계 안에 그린다.

export interface LedgerSortingCanvasProps {
  width: number;
  height: number;
  reducedMotion: boolean;
  onComplete: (correctCount: number) => void;
}

type CoinKind = "income" | "spending";
type CoinGraphic = Graphics & { kind: CoinKind };

const COIN_RADIUS = 22;
const SPAWN_INTERVAL_MS = 900;
const FALL_SPEED_REDUCED = 1.2;
const FALL_SPEED_NORMAL = 2.2;

function randomKind(): CoinKind {
  return Math.random() < 0.5 ? "income" : "spending";
}

function isCoinGraphic(child: unknown): child is CoinGraphic {
  return child instanceof Graphics && "kind" in child;
}

export default function LedgerSortingCanvas({ width, height, reducedMotion, onComplete }: LedgerSortingCanvasProps) {
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xfff7ed}
      onReady={(app) =>
        setupGame(app, {
          width,
          height,
          reducedMotion,
          onComplete: (score) => onCompleteRef.current(score),
        })
      }
    />
  );
}

interface SetupOptions {
  width: number;
  height: number;
  reducedMotion: boolean;
  onComplete: (correctCount: number) => void;
}

function setupGame(app: Application, options: SetupOptions) {
  const { width, height, reducedMotion, onComplete } = options;
  const totalCoins = ledgerHouseContent.totalCoins;
  const binWidth = width * 0.38;
  const binY = height - 70;
  const incomeBin = { x: 10, y: binY, width: binWidth, height: 60 };
  const spendingBin = { x: width - binWidth - 10, y: binY, width: binWidth, height: 60 };

  // 통 그리기 — idea.md 6-2의 "들어온 돈은 초록, 나간 돈은 빨강" 색 규칙을 그대로 따른다.
  const incomeGraphic = new Graphics()
    .roundRect(incomeBin.x, incomeBin.y, incomeBin.width, incomeBin.height, 16)
    .fill(0xdcfce7)
    .stroke({ width: 3, color: 0x22c55e });
  const spendingGraphic = new Graphics()
    .roundRect(spendingBin.x, spendingBin.y, spendingBin.width, spendingBin.height, 16)
    .fill(0xfee2e2)
    .stroke({ width: 3, color: 0xef4444 });
  app.stage.addChild(incomeGraphic, spendingGraphic);

  const incomeLabel = new Text({ text: "수입 💰", style: { fontSize: 16, fill: 0x166534 } });
  incomeLabel.position.set(incomeBin.x + 12, incomeBin.y + 16);
  const spendingLabel = new Text({ text: "지출 💸", style: { fontSize: 16, fill: 0x991b1b } });
  spendingLabel.position.set(spendingBin.x + 12, spendingBin.y + 16);
  app.stage.addChild(incomeLabel, spendingLabel);

  const scoreText = new Text({ text: `0 / ${totalCoins}`, style: { fontSize: 18, fill: 0x1f2937 } });
  scoreText.position.set(width / 2 - 24, 8);
  app.stage.addChild(scoreText);

  let correctCount = 0;
  let resolvedCount = 0;
  let spawnedCount = 0;
  let finished = false;
  let draggingCoin: CoinGraphic | null = null;

  function pointInRect(px: number, py: number, rect: { x: number; y: number; width: number; height: number }) {
    return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  }

  function spawnCoin() {
    if (spawnedCount >= totalCoins || finished) return;
    spawnedCount += 1;
    const kind = randomKind();
    const coin = new Graphics().circle(0, 0, COIN_RADIUS).fill(kind === "income" ? 0x22c55e : 0xef4444) as CoinGraphic;
    const arrow = new Text({
      text: kind === "income" ? "↑" : "↓",
      style: { fontSize: 20, fill: 0xffffff, fontWeight: "bold" },
    });
    arrow.anchor.set(0.5);
    coin.addChild(arrow);

    coin.x = COIN_RADIUS + 10 + Math.random() * (width - (COIN_RADIUS + 10) * 2);
    coin.y = -COIN_RADIUS;
    coin.eventMode = "static";
    coin.cursor = "pointer";
    coin.kind = kind;

    coin.on("pointerdown", (event) => {
      draggingCoin = coin;
      app.stage.setChildIndex(coin, app.stage.children.length - 1);
      event.stopPropagation();
    });

    app.stage.addChild(coin);
  }

  function resolveCoin(coin: CoinGraphic, hitBin: "income" | "spending" | null) {
    resolvedCount += 1;
    if (hitBin === coin.kind) {
      correctCount += 1;
    }
    scoreText.text = `${correctCount} / ${totalCoins}`;
    coin.destroy();

    if (resolvedCount >= totalCoins && !finished) {
      finished = true;
      window.setTimeout(() => onComplete(correctCount), 400);
    }
  }

  function onStagePointerMove(event: FederatedPointerEvent) {
    if (!draggingCoin) return;
    const local = event.getLocalPosition(app.stage);
    draggingCoin.x = local.x;
    draggingCoin.y = local.y;
  }

  function onStagePointerUp() {
    if (!draggingCoin) return;
    const coin = draggingCoin;
    draggingCoin = null;

    let hitBin: "income" | "spending" | null = null;
    if (pointInRect(coin.x, coin.y, incomeBin)) hitBin = "income";
    else if (pointInRect(coin.x, coin.y, spendingBin)) hitBin = "spending";

    if (hitBin) {
      resolveCoin(coin, hitBin);
    }
  }

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("globalpointermove", onStagePointerMove);
  app.stage.on("pointerup", onStagePointerUp);
  app.stage.on("pointerupoutside", onStagePointerUp);

  const fallSpeed = reducedMotion ? FALL_SPEED_REDUCED : FALL_SPEED_NORMAL;
  const tickerCallback = (ticker: Ticker) => {
    for (const child of [...app.stage.children]) {
      if (child === draggingCoin || !isCoinGraphic(child)) continue;
      child.y += fallSpeed * ticker.deltaTime;
      if (child.y > height + COIN_RADIUS) {
        resolveCoin(child, null);
      }
    }
  };
  app.ticker.add(tickerCallback);

  const spawnInterval = window.setInterval(spawnCoin, SPAWN_INTERVAL_MS);
  spawnCoin();

  return () => {
    window.clearInterval(spawnInterval);
    app.ticker.remove(tickerCallback);
    app.stage.off("globalpointermove", onStagePointerMove);
    app.stage.off("pointerup", onStagePointerUp);
    app.stage.off("pointerupoutside", onStagePointerUp);
  };
}
