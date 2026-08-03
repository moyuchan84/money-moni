import type { NewsSimplifierEntry } from "@/data/newsSimplifier";
import { parentContent } from "@/data/parentContent";

export interface NewsSimplifierCardProps {
  entry: NewsSimplifierEntry;
}

export function NewsSimplifierCard({ entry }: NewsSimplifierCardProps) {
  return (
    <section className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4">
      <h2 className="text-body font-semibold text-ink">{parentContent.newsSimplifierTitleKo}</h2>
      <p className="text-caption text-muted">
        {parentContent.newsSimplifierHardLabelKo}: {entry.hardKo}
      </p>
      <p className="text-body text-fg">
        {parentContent.newsSimplifierEasyLabelKo}: {entry.easyKo}
      </p>
    </section>
  );
}
