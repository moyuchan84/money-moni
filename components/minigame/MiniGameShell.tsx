"use client";

import type { ReactNode } from "react";

export interface MiniGameShellProps {
  title: string;
  instructions: string;
  narrationSrc?: string;
  children: ReactNode;
  onRetry?: () => void;
}

export function MiniGameShell({ title, instructions, children, onRetry }: MiniGameShellProps) {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-heading font-bold text-ink">{title}</h1>
        <p className="text-body text-fg">{instructions}</p>
      </header>
      <div className="flex justify-center">{children}</div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-touch self-center rounded-control bg-primary px-6 py-2 text-body text-white"
        >
          다시 하기
        </button>
      )}
    </div>
  );
}
