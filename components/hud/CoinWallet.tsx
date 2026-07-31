export interface CoinWalletProps {
  coins: number;
}

export function CoinWallet({ coins }: CoinWalletProps) {
  return (
    <div className="flex min-h-touch items-center gap-1 rounded-pill bg-warning-light px-3 py-1">
      <span aria-hidden>🪙</span>
      <span className="text-body font-bold text-ink">{coins}</span>
    </div>
  );
}
