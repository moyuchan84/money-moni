export interface CoinWalletProps {
  coins: number;
}

export function CoinWallet({ coins }: CoinWalletProps) {
  return (
    <div className="flex min-h-touch items-center gap-1 rounded-full bg-district1-secondary-light px-3 py-1">
      <span aria-hidden>🪙</span>
      <span className="text-body font-heading">{coins}</span>
    </div>
  );
}
