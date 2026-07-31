export interface ProgressBadgeProps {
  label: string;
  completed: boolean;
}

export function ProgressBadge({ label, completed }: ProgressBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-touch items-center gap-1 rounded-pill px-3 py-1 text-caption ${
        completed ? "bg-success-light text-success" : "bg-surface-muted text-muted"
      }`}
    >
      {completed ? "✅" : "⬜"} {label}
    </span>
  );
}
