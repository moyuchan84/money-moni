import Link from "next/link";
import type { ReactNode } from "react";

// 공용 버튼 — 페이지마다 min-h-touch/rounded-control 조합을 손으로 반복하지 않기 위한 컴포넌트.
// docs/design-revision.md 2-4 참고. NpcDialogue/ReflectionPrompt처럼 pill 모양 등
// 다른 스타일 계약을 쓰는 곳은 이 컴포넌트를 쓰지 않아도 된다.
export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white",
  secondary: "border border-border bg-surface text-primary",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const className = `min-h-touch min-w-touch inline-flex items-center justify-center rounded-control px-6 py-2 text-center text-body ${VARIANT_CLASS[variant]} ${disabled ? "opacity-40" : ""}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
