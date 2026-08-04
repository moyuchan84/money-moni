export interface GameLogoProps {
  text: string;
  size?: "splash" | "header";
}

const SIZE_CLASS: Record<NonNullable<GameLogoProps["size"]>, string> = {
  splash: "text-display",
  header: "text-heading",
};

// "머니타운"/"머니모니" 워드마크 전용 컴포넌트 — font-jua는 여기서만 쓴다(app/layout.tsx 주석 참고).
export function GameLogo({ text, size = "header" }: GameLogoProps) {
  return <span className={`font-jua text-primary ${SIZE_CLASS[size]}`}>{text}</span>;
}
