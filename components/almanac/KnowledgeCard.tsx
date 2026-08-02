import type { BuildingAlmanac } from "@/data/almanac/almanacTypes";
import { ImageCreditFooter } from "./ImageCreditFooter";

export function KnowledgeCard({ almanac }: { almanac: BuildingAlmanac }) {
  const creditByImageKey = new Map(almanac.credits.map((credit) => [credit.imageKey, credit]));

  return (
    <div className="flex flex-col gap-4 rounded-card bg-surface p-4 text-ink shadow-card">
      <p className="text-body text-fg">{almanac.theoryNoteKo}</p>
      <ol className="flex flex-col gap-4">
        {almanac.timeline.map((event, index) => {
          const credit = event.imageKey ? creditByImageKey.get(event.imageKey) : undefined;
          return (
            <li key={`${event.year}-${index}`} className="flex flex-col gap-2">
              <p className="text-caption font-semibold text-primary">{event.year}</p>
              <p className="text-body font-semibold text-ink">{event.titleKo}</p>
              <p className="text-body text-fg">{event.descKo}</p>
              {credit && (
                <>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-control bg-primary-light">
                    <img
                      src={`/images/almanac/${almanac.buildingId}/${credit.imageKey}.jpg`}
                      alt={credit.titleKo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ImageCreditFooter credit={credit} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
