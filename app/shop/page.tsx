"use client";

import Link from "next/link";

import { useGameStore } from "@/store/useGameStore";
import { CoinWallet } from "@/components/hud/CoinWallet";

export default function ShopPage() {
  const coins = useGameStore((state) => state.wallet.coins);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading font-heading">상점</h1>
        <CoinWallet coins={coins} />
      </div>
      <p className="text-body">
        아직 판매 중인 아이템이 없어요. 게임 안에서만 쓰는 머니타운 코인으로, 실제 돈과는 관계가
        없어요.
      </p>
      <Link href="/town" className="min-h-touch min-w-touch self-start text-body underline">
        마을로 돌아가기
      </Link>
    </main>
  );
}
