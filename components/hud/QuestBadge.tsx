"use client";

export interface QuestBadgeProps {
  activeCount: number;
  onClick?: () => void;
}

export function QuestBadge({ activeCount, onClick }: QuestBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative min-h-touch min-w-touch rounded-pill bg-surface px-3 py-1 shadow-card"
      aria-label={`퀘스트 ${activeCount}개 진행 중`}
    >
      <span aria-hidden>📋</span>
      {activeCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-pill bg-primary px-1.5 text-caption text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
