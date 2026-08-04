"use client";

import { motion } from "motion/react";

import type { BuildingAlmanac } from "@/data/almanac/almanacTypes";
import { almanacContent } from "@/data/almanacContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ImageCreditFooter } from "./ImageCreditFooter";
import { AlmanacWidgetSlot } from "./interactive/AlmanacWidgetSlot";

export function KnowledgeCard({ almanac }: { almanac: BuildingAlmanac }) {
  const reducedMotion = useReducedMotion();
  const creditByImageKey = new Map(almanac.credits.map((credit) => [credit.imageKey, credit]));

  return (
    <div className="flex flex-col gap-4 rounded-card bg-surface p-4 text-ink shadow-card">
      <p className="text-body text-fg">{almanac.theoryNoteKo}</p>

      {almanac.interactiveWidgetKey && (
        <section className="flex flex-col gap-3 rounded-card bg-primary-light p-4">
          <p className="text-body font-semibold text-primary">{almanacContent.interactiveHeadingKo}</p>
          <AlmanacWidgetSlot widgetKey={almanac.interactiveWidgetKey} />
        </section>
      )}

      <ol className="flex flex-col gap-4">
        {almanac.timeline.map((event, index) => {
          const credit = event.imageKey ? creditByImageKey.get(event.imageKey) : undefined;
          return (
            <motion.li
              key={`${event.year}-${index}`}
              className="flex flex-col gap-2"
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : index * 0.05 }}
            >
              <p className="text-caption font-semibold text-primary">{event.year}</p>
              <p className="text-body font-semibold text-ink">{event.titleKo}</p>
              <p className="text-body text-fg">{event.descKo}</p>
              {credit && (
                <>
                  <motion.div
                    className="aspect-[4/3] w-full overflow-hidden rounded-control bg-primary-light"
                    initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : index * 0.05 }}
                  >
                    <img
                      src={`/images/almanac/${almanac.buildingId}/${credit.imageKey}.jpg`}
                      alt={credit.titleKo}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  <ImageCreditFooter credit={credit} />
                </>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
