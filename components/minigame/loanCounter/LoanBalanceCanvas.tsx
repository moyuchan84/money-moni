"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { Graphics, type Application, type Ticker } from "pixi.js";

import { PixiStage } from "@/components/minigame/PixiStage";
import { loanCounterContent } from "@/data/loanCounterContent";
import { computeWeightSlotOffsetX, isTipped } from "./tiltMath";

// matter-js와 pixi.js는 여기서만 import한다 — 이 파일은 next/dynamic(ssr:false)로만 불러온다(CLAUDE.md 절대 규칙 3).
//
// 추(무게)는 자유낙하/충돌시키지 않고 Matter.Constraint(stiffness 1, length 0)로 막대의 고정 슬롯에
// 강체 결합한다. 질량·중력 토크는 Matter 솔버가 실제로 계산하지만, 굴러떨어지거나 미끄러지는
// 불안정성이 없어 아동용 게임에 필요한 결정론적 동작을 보장한다.
//
// 별도의 Matter.Runner는 쓰지 않는다 — PixiStage의 app.ticker 콜백 하나에서 Matter.Engine.update와
// Pixi 그래픽 동기화를 함께 처리해, 정리해야 할 애니메이션 루프가 하나만 존재하게 한다.

export interface LoanBalanceCanvasProps {
  width: number;
  height: number;
  borrowerWeightCount: number; // 지금까지 눌린 "빌린 돈 추가하기" 횟수(누적)
  onTip: () => void; // 저울이 처음 기준 각도 이상 기울었을 때 1회 호출
}

const BEAM_LENGTH = 220;
const BEAM_THICKNESS = 18;
const WEIGHT_SIZE = 26;

export default function LoanBalanceCanvas({
  width,
  height,
  borrowerWeightCount,
  onTip,
}: LoanBalanceCanvasProps) {
  const onTipRef = useRef(onTip);
  useEffect(() => {
    onTipRef.current = onTip;
  });

  // 최신 borrowerWeightCount를 항상 참조할 수 있게 ref로 미러링한다(Pixi onReady는 마운트 시 1회만 실행되므로
  // 이후 prop 변화는 이 ref를 통해서만 캔버스 내부(setupGame)에 전달된다).
  const latestCountRef = useRef(borrowerWeightCount);
  useEffect(() => {
    latestCountRef.current = borrowerWeightCount;
  });

  const addWeightFnRef = useRef<(() => void) | null>(null);
  const appliedCountRef = useRef(0);

  function flushPendingWeights() {
    while (addWeightFnRef.current && appliedCountRef.current < latestCountRef.current) {
      addWeightFnRef.current();
      appliedCountRef.current += 1;
    }
  }

  useEffect(() => {
    flushPendingWeights();
  }, [borrowerWeightCount]);

  return (
    <PixiStage
      width={width}
      height={height}
      backgroundColor={0xf5f3ff}
      onReady={(app) =>
        setupGame(app, {
          width,
          height,
          onTip: () => onTipRef.current(),
          registerAddWeight: (fn) => {
            addWeightFnRef.current = fn;
            flushPendingWeights();
          },
        })
      }
    />
  );
}

interface SetupOptions {
  width: number;
  height: number;
  onTip: () => void;
  registerAddWeight: (fn: () => void) => void;
}

function setupGame(app: Application, options: SetupOptions) {
  const { width, height, onTip, registerAddWeight } = options;
  const pivotX = width / 2;
  const pivotY = height / 2;
  const beamHalfLength = BEAM_LENGTH / 2;
  const thresholdRad = (loanCounterContent.tipThresholdDeg * Math.PI) / 180;

  const engine = Matter.Engine.create({ gravity: { x: 0, y: 1 } });

  const beam = Matter.Bodies.rectangle(pivotX, pivotY, BEAM_LENGTH, BEAM_THICKNESS, {
    friction: 0.9,
    frictionStatic: 1,
  });
  const pivotConstraint = Matter.Constraint.create({
    bodyA: beam,
    pointA: { x: 0, y: 0 },
    pointB: { x: pivotX, y: pivotY },
    stiffness: 1,
    length: 0,
  });
  Matter.Composite.add(engine.world, [beam, pivotConstraint]);

  // 받침대 — 물리 바디 없이 항상 같은 자리에 그리는 순수 시각 요소.
  const standGraphic = new Graphics()
    .circle(0, 0, 7)
    .fill(0x78716c);
  standGraphic.position.set(pivotX, pivotY);
  app.stage.addChild(standGraphic);

  const beamGraphic = new Graphics()
    .roundRect(-beamHalfLength, -BEAM_THICKNESS / 2, BEAM_LENGTH, BEAM_THICKNESS, 6)
    .fill(0xa16207)
    .stroke({ width: 2, color: 0x78350f });
  beamGraphic.position.set(pivotX, pivotY);
  app.stage.addChild(beamGraphic);

  const weightBodies: Matter.Body[] = [];
  const weightGraphics: Graphics[] = [];
  let borrowerSlotCount = 0;

  function addWeight() {
    const slotIndex = borrowerSlotCount;
    borrowerSlotCount += 1;
    const offsetX = computeWeightSlotOffsetX(
      slotIndex,
      "borrower",
      loanCounterContent.slotSpacingPx,
      beamHalfLength,
    );
    const attachY = -BEAM_THICKNESS / 2 - WEIGHT_SIZE / 2;

    const weightBody = Matter.Bodies.rectangle(pivotX + offsetX, pivotY + attachY, WEIGHT_SIZE, WEIGHT_SIZE, {
      friction: 1,
    });
    const pin = Matter.Constraint.create({
      bodyA: beam,
      pointA: { x: offsetX, y: attachY },
      bodyB: weightBody,
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0,
    });
    Matter.Composite.add(engine.world, [weightBody, pin]);
    weightBodies.push(weightBody);

    const weightGraphic = new Graphics()
      .roundRect(-WEIGHT_SIZE / 2, -WEIGHT_SIZE / 2, WEIGHT_SIZE, WEIGHT_SIZE, 4)
      .fill(0xef4444)
      .stroke({ width: 2, color: 0x991b1b });
    app.stage.addChild(weightGraphic);
    weightGraphics.push(weightGraphic);
  }

  registerAddWeight(addWeight);

  let tipped = false;
  const tickerCallback = (ticker: Ticker) => {
    // deltaMS를 33ms로 clamp해 탭 전환 등으로 프레임이 오래 밀렸을 때 물리가 한 번에 크게 튀지 않게 한다.
    Matter.Engine.update(engine, Math.min(ticker.deltaMS, 33));

    beamGraphic.rotation = beam.angle;
    beamGraphic.position.set(beam.position.x, beam.position.y);

    for (let i = 0; i < weightBodies.length; i += 1) {
      const body = weightBodies[i];
      const graphic = weightGraphics[i];
      graphic.position.set(body.position.x, body.position.y);
      graphic.rotation = body.angle;
    }

    if (!tipped && isTipped(beam.angle, thresholdRad)) {
      tipped = true;
      onTip();
    }
  };
  app.ticker.add(tickerCallback);

  return () => {
    app.ticker.remove(tickerCallback);
    Matter.Composite.clear(engine.world, false);
  };
}
