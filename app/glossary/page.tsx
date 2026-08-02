import Link from "next/link";

import { glossary } from "@/data/glossary";
import { commonContent } from "@/data/commonContent";

export default function GlossaryPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.glossary}</h1>
      <dl className="flex flex-col gap-4">
        {glossary.map((entry) => (
          <div key={entry.id}>
            <dt className="text-body font-semibold text-ink">{entry.term}</dt>
            <dd className="text-body text-fg">{entry.definitionKo}</dd>
          </div>
        ))}
      </dl>
      <Link href="/town" className="min-h-touch min-w-touch self-start text-body underline">
        {commonContent.backToTownKo}
      </Link>
    </main>
  );
}
