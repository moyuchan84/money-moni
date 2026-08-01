"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

import { moneyTreeContent } from "@/data/moneyTreeContent";
import { commonContent } from "@/data/commonContent";
import { sfxSrc } from "@/data/soundContent";
import { useGameStore } from "@/store/useGameStore";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useSound } from "@/components/providers/SoundProvider";
import { RewardCelebration } from "@/components/feedback/RewardCelebration";
import { NpcDialogue } from "@/components/dialogue/NpcDialogue";

const BRANCH_COUNT = moneyTreeContent.maxStage;

// 트렁크 위 한 점(100,120)에서 갈라지는 4개 가지 좌표 — 정교한 삽화가 아니라
// GSAP strokeDashoffset 트윈으로 "자라나는" 느낌을 내기 위한 최소한의 벡터 스케치.
const BRANCH_PATHS = ["M100,120 L58,78", "M100,120 L142,78", "M100,120 L40,36", "M100,120 L160,36"];

export interface MoneyTreeSceneProps {
  alreadyActedToday: boolean;
}

export function MoneyTreeScene({ alreadyActedToday }: MoneyTreeSceneProps) {
  const stage = useGameStore((state) => state.moneyTree.stage);
  const principal = useGameStore((state) => state.moneyTree.principal);
  const growMoneyTree = useGameStore((state) => state.growMoneyTree);
  const { playSfx } = useSound();
  const [celebrationCoins, setCelebrationCoins] = useState<number | null>(null);
  const [justActed, setJustActed] = useState(false);

  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const interest = Math.round(principal * moneyTreeContent.dailyInterestRate);

  const containerRef = useGsapContext<HTMLDivElement>(
    (_context, reducedMotion) => {
      branchRefs.current.forEach((path, index) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length });

        if (index >= stage) {
          // 아직 자라지 않은 가지는 완전히 숨긴다.
          gsap.set(path, { strokeDashoffset: length });
          return;
        }
        if (reducedMotion || index < stage - 1) {
          // 이미 자란 가지는 즉시 완성 상태로 보여준다.
          gsap.set(path, { strokeDashoffset: 0 });
          return;
        }
        // 방금 늘어난 가지만 자라나는 트윈을 재생한다.
        gsap.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" });
      });
    },
    [stage],
  );

  function handleReplant() {
    if (alreadyActedToday) return;
    growMoneyTree("replant");
    playSfx(sfxSrc.treeGrow);
    setJustActed(true);
  }

  function handleHarvest() {
    if (alreadyActedToday) return;
    growMoneyTree("harvest");
    setCelebrationCoins(interest);
    setJustActed(true);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={containerRef} className="rounded-card bg-surface-muted p-4 shadow-card">
        <svg viewBox="0 0 200 220" className="h-56 w-56" aria-hidden>
          <path d="M100,220 L100,120" stroke="#8a5a2b" strokeWidth={8} strokeLinecap="round" fill="none" />
          {BRANCH_PATHS.map((d, index) => (
            <path
              key={d}
              ref={(el) => {
                branchRefs.current[index] = el;
              }}
              d={d}
              stroke="#1f9254"
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <p className="text-body text-fg">
        {moneyTreeContent.stageLabelsKo[stage]} · 원금 {principal}코인 · 오늘 이자 {interest}코인
      </p>

      {justActed && (
        <NpcDialogue
          speakerName={commonContent.villageChiefSpeakerKo}
          message={moneyTreeContent.recapLineKo}
          character="none"
          onNext={() => setJustActed(false)}
        />
      )}

      {alreadyActedToday ? (
        <p className="text-caption text-muted">{moneyTreeContent.alreadyActedTodayKo}</p>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleHarvest}
            className="min-h-touch rounded-control bg-primary px-6 py-2 text-body text-white"
          >
            {moneyTreeContent.harvestButtonKo}
          </button>
          <button
            type="button"
            onClick={handleReplant}
            disabled={stage >= BRANCH_COUNT}
            className="min-h-touch rounded-control border border-border bg-surface px-6 py-2 text-body text-primary disabled:opacity-40"
          >
            {moneyTreeContent.replantButtonKo}
          </button>
        </div>
      )}

      <RewardCelebration
        coins={celebrationCoins ?? 0}
        visible={celebrationCoins !== null}
        onDone={() => setCelebrationCoins(null)}
      />
    </div>
  );
}
