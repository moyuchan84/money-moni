"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";

import { etfLabContent } from "@/data/etfLabContent";
import { ASSETS, REACTION_MULTIPLIER, SEASON_REACTIONS, SEASONS, type AssetId, type Season } from "@/data/almanac/economicSeasons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ComparisonBarChart } from "@/components/minigame/ComparisonBarChart";
import { applySeasonToAllocation, computeSwingRange, pickRandomSeason, sumAllocationValues } from "./portfolioMath";

// 과자 바구니(EtfBasketGame) 완료 후 이어지는 2단계 — 5개 자산군에 씨앗 코인을 배분하고,
// 무작위 계절 4라운드를 겪어본 뒤 분산 vs 몰빵을 비교한다. docs/fomo-portfolio-practice.md 4-2 참고.

const { totalSeeds: TOTAL_SEEDS, roundCount: ROUND_COUNT, concentratedPresetAssetId: PRESET_ASSET_ID } =
  etfLabContent.portfolioRoundContent;

type Stage = "allocate" | "rounds" | "compare";

function emptyAllocation(): Record<AssetId, number> {
  return Object.fromEntries(ASSETS.map((asset) => [asset.id, 0])) as Record<AssetId, number>;
}

function DraggableSeedCoin({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: CSSProperties = { transform: CSS.Translate.toString(transform) };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      aria-label="씨앗 코인"
      className={`flex h-11 w-11 min-h-touch min-w-touch touch-none items-center justify-center rounded-pill bg-primary text-heading text-white shadow-card transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span aria-hidden>🌱</span>
    </button>
  );
}

function AssetDropZone({
  assetId,
  labelKo,
  emoji,
  count,
  reducedMotion,
}: {
  assetId: AssetId;
  labelKo: string;
  emoji: string;
  count: number;
  reducedMotion: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: assetId });
  const heightPct = TOTAL_SEEDS > 0 ? Math.min(100, (count / TOTAL_SEEDS) * 100) : 0;
  const target = { height: `${heightPct}%` };

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-touch flex-col items-center gap-1 rounded-control border-2 border-dashed p-2 transition ${
        isOver ? "border-primary bg-primary-light" : "border-border bg-surface-muted"
      }`}
    >
      <div className="flex h-10 w-6 items-end overflow-hidden rounded-pill bg-white">
        <motion.div
          className="w-full rounded-pill bg-primary"
          initial={false}
          animate={reducedMotion ? undefined : target}
          style={reducedMotion ? target : undefined}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
        />
      </div>
      <span aria-hidden className="text-heading">
        {emoji}
      </span>
      <span className="text-caption text-muted">
        {labelKo} ({count})
      </span>
    </div>
  );
}

export interface PortfolioRoundGameProps {
  onComplete: (score: number) => void;
}

export function PortfolioRoundGame({ onComplete }: PortfolioRoundGameProps) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("allocate");
  const [traySeeds, setTraySeeds] = useState<string[]>(() =>
    Array.from({ length: TOTAL_SEEDS }, (_, index) => `seed-${index}`),
  );
  const [allocation, setAllocation] = useState<Record<AssetId, number>>(emptyAllocation);
  const [playerValues, setPlayerValues] = useState<Record<AssetId, number> | null>(null);
  const [presetValues, setPresetValues] = useState<Record<AssetId, number> | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [seasonHistory, setSeasonHistory] = useState<Season[]>([]);
  const [playerTotalsByRound, setPlayerTotalsByRound] = useState<number[]>([]);
  const [presetTotalsByRound, setPresetTotalsByRound] = useState<number[]>([]);

  useEffect(() => {
    if (stage !== "allocate" || traySeeds.length > 0) return;
    const timeout = window.setTimeout(
      () => {
        const preset = Object.fromEntries(
          ASSETS.map((asset) => [asset.id, asset.id === PRESET_ASSET_ID ? TOTAL_SEEDS : 0]),
        ) as Record<AssetId, number>;
        setPlayerValues(allocation);
        setPresetValues(preset);
        setPlayerTotalsByRound([sumAllocationValues(allocation)]);
        setPresetTotalsByRound([sumAllocationValues(preset)]);
        setStage("rounds");
      },
      reducedMotion ? 0 : 300,
    );
    return () => window.clearTimeout(timeout);
  }, [stage, traySeeds.length, allocation, reducedMotion]);

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    const assetId = event.over.id as AssetId;
    const seedId = event.active.id as string;
    setTraySeeds((prev) => (prev.includes(seedId) ? prev.filter((id) => id !== seedId) : prev));
    setAllocation((prev) => ({ ...prev, [assetId]: prev[assetId] + 1 }));
  }

  function handleDrawSeason() {
    if (!playerValues || !presetValues || roundIndex >= ROUND_COUNT) return;
    const season = pickRandomSeason(SEASONS, Math.random());
    const nextPlayer = applySeasonToAllocation(playerValues, season, SEASON_REACTIONS, REACTION_MULTIPLIER);
    const nextPreset = applySeasonToAllocation(presetValues, season, SEASON_REACTIONS, REACTION_MULTIPLIER);
    setPlayerValues(nextPlayer);
    setPresetValues(nextPreset);
    setSeasonHistory((value) => [...value, season]);
    setPlayerTotalsByRound((value) => [...value, sumAllocationValues(nextPlayer)]);
    setPresetTotalsByRound((value) => [...value, sumAllocationValues(nextPreset)]);
    const nextRoundIndex = roundIndex + 1;
    setRoundIndex(nextRoundIndex);
    if (nextRoundIndex >= ROUND_COUNT) setStage("compare");
  }

  if (stage === "allocate") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-body text-fg">{etfLabContent.portfolioRoundContent.introMessageKo}</p>
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex min-h-touch min-w-full flex-wrap justify-center gap-2 rounded-card bg-surface-muted p-3">
            {traySeeds.length === 0 ? (
              <p className="text-caption text-muted">씨앗을 다 심었어요!</p>
            ) : (
              traySeeds.map((seedId) => <DraggableSeedCoin key={seedId} id={seedId} />)
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {ASSETS.map((asset) => (
              <AssetDropZone
                key={asset.id}
                assetId={asset.id}
                labelKo={asset.labelKo}
                emoji={asset.emoji}
                count={allocation[asset.id]}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </DndContext>
      </div>
    );
  }

  if (stage === "rounds") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <p className="text-body text-fg">
          {roundIndex}/{ROUND_COUNT} 라운드 지났어요
        </p>
        <div className="flex w-full flex-col gap-1">
          {seasonHistory.map((season, index) => {
            const seasonMeta = SEASONS.find((candidate) => candidate.id === season)!;
            return (
              <p key={index} className="text-caption text-muted">
                {index + 1}라운드 {seasonMeta.emoji} {seasonMeta.labelKo} — 내 배분 {Math.round(playerTotalsByRound[index + 1] ?? 0)} / 몰빵{" "}
                {Math.round(presetTotalsByRound[index + 1] ?? 0)}
              </p>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleDrawSeason}
          className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          계절 뽑기
        </button>
      </div>
    );
  }

  const finalPlayerTotal = playerValues ? sumAllocationValues(playerValues) : 0;
  const finalPresetTotal = presetValues ? sumAllocationValues(presetValues) : 0;
  const playerSwing = computeSwingRange(playerTotalsByRound);
  const presetSwing = computeSwingRange(presetTotalsByRound);
  const presetAssetLabel = ASSETS.find((asset) => asset.id === PRESET_ASSET_ID)?.labelKo ?? "";

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-body font-semibold text-ink">내 배분 vs {presetAssetLabel} 몰빵, 최종 결과 비교</p>
      <ComparisonBarChart
        items={[
          { id: "player-total", labelKo: "내가 고른 배분", value: Math.round(finalPlayerTotal), colorHex: "#22c55e" },
          { id: "preset-total", labelKo: "한 자산에 몰빵했을 때", value: Math.round(finalPresetTotal), colorHex: "#ef4444" },
        ]}
        maxValue={Math.max(Math.round(finalPlayerTotal), Math.round(finalPresetTotal), 1)}
      />
      <p className="text-body font-semibold text-ink">흔들린 정도(변동폭) 비교</p>
      <ComparisonBarChart
        items={[
          { id: "player-swing", labelKo: "내 배분이 흔들린 정도", value: Math.round(playerSwing), colorHex: "#22c55e" },
          { id: "preset-swing", labelKo: "몰빵이 흔들린 정도", value: Math.round(presetSwing), colorHex: "#ef4444" },
        ]}
        maxValue={Math.max(Math.round(playerSwing), Math.round(presetSwing), 1)}
      />
      <p className="text-body text-fg">{etfLabContent.portfolioRoundContent.recapLineKo}</p>
      <button
        type="button"
        onClick={() => onComplete(Math.round(finalPlayerTotal))}
        className="min-h-touch min-w-touch rounded-control bg-primary px-6 py-2 text-body text-white"
      >
        완료
      </button>
    </div>
  );
}
