"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { buildings } from "@/data/buildings";
import { commonContent } from "@/data/commonContent";
import { glossary, type GlossaryCategory, type GlossaryId } from "@/data/glossary";
import { newsSimplifier } from "@/data/newsSimplifier";
import { NewsSimplifierCard } from "@/components/parent/NewsSimplifierCard";

const CATEGORY_ORDER: GlossaryCategory[] = [
  "money-basics",
  "income-spending",
  "saving-growth",
  "capital-investment",
  "debt",
  "big-picture",
];

const entryById = new Map(glossary.map((entry) => [entry.id, entry]));

function buildingHref(buildingId: keyof typeof buildings) {
  const building = buildings[buildingId];
  return building.routeKind === "standalone" ? "/money-tree" : `/building/${building.id}`;
}

export default function GlossaryPage() {
  const [openIds, setOpenIds] = useState<Set<GlossaryId>>(new Set());

  function toggle(id: GlossaryId) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-6">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.glossary}</h1>

      {CATEGORY_ORDER.map((category) => {
        const entries = glossary.filter((entry) => entry.category === category);

        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-body font-semibold text-ink">
              <span aria-hidden>{commonContent.glossary.categoryIcon[category]}</span>
              {commonContent.glossary.categoryLabelKo[category]}
            </h2>
            {category === "big-picture" && <NewsSimplifierCard entry={newsSimplifier[0]} />}
            <div className="flex flex-col gap-3">
              {entries.map((entry) => {
                const open = openIds.has(entry.id);

                return (
                  <div key={entry.id} id={entry.id} className="rounded-card bg-surface shadow-card">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => toggle(entry.id)}
                      className="flex min-h-touch w-full items-start gap-3 p-4 text-left"
                    >
                      <span aria-hidden>{commonContent.glossary.categoryIcon[entry.category]}</span>
                      <span className="flex-1">
                        <span className="block text-body font-semibold text-ink">{entry.term}</span>
                        <span className="block text-body text-fg">{entry.shortDefinitionKo}</span>
                      </span>
                    </button>
                    {open && (
                      <div className="flex flex-col gap-3 border-t border-border p-4">
                        <p className="text-body text-fg">{entry.longDefinitionKo}</p>
                        <div className="rounded-card bg-primary-light p-3">
                          <p className="text-body font-semibold text-primary">
                            {commonContent.glossary.metaphorHeadingKo}
                          </p>
                          <p className="text-body text-primary">{entry.metaphorKo}</p>
                        </div>
                        <div>
                          <p className="text-body font-semibold text-ink">
                            {commonContent.glossary.exampleHeadingKo}
                          </p>
                          <p className="text-body text-fg">{entry.exampleKo}</p>
                        </div>
                        {entry.relatedTermIds && entry.relatedTermIds.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <p className="text-body font-semibold text-ink">
                              {commonContent.glossary.relatedTermsHeadingKo}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {entry.relatedTermIds.map((relatedId) => {
                                const related = entryById.get(relatedId);
                                if (!related) return null;
                                return (
                                  <a
                                    key={relatedId}
                                    href={`#${relatedId}`}
                                    onClick={() =>
                                      setOpenIds((prev) => new Set(prev).add(relatedId))
                                    }
                                    className="inline-flex min-h-touch items-center rounded-control border border-border bg-surface px-3 py-1 text-body text-primary"
                                  >
                                    {related.term}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {entry.relatedBuildingId && (
                          <Button href={buildingHref(entry.relatedBuildingId)} variant="secondary">
                            🏠 {commonContent.glossary.visitBuildingKo}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <Button href="/town" variant="secondary">
        {commonContent.backToTownKo}
      </Button>
    </main>
  );
}
