export interface ProgressBadgeProps {
  label: string;
  completed: boolean;
}

export function ProgressBadge({ label, completed }: ProgressBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-touch items-center gap-1 rounded-full px-3 py-1 text-caption ${
        completed ? "bg-district2-secondary-light" : "bg-black/5"
      }`}
    >
      {completed ? "✅" : "⬜"} {label}
    </span>
  );
}
