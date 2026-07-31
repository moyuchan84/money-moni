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
      className="relative min-h-touch min-w-touch rounded-full bg-white px-3 py-1 shadow"
      aria-label={`퀘스트 ${activeCount}개 진행 중`}
    >
      <span aria-hidden>📋</span>
      {activeCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-district3-primary px-1.5 text-caption text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
