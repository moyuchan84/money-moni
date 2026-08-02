import { commonContent } from "@/data/commonContent";
import { almanacContent } from "@/data/almanacContent";
import { allAlmanacCredits } from "@/data/almanac";
import { buildings } from "@/data/buildings";
import { Button } from "@/components/ui/Button";

export default function CreditsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-heading font-bold text-ink">{commonContent.pageTitles.credits}</h1>
      <p className="text-body text-fg">{almanacContent.creditsIntroMessageKo}</p>
      <ul className="flex flex-col gap-3">
        {allAlmanacCredits.map((credit) => (
          <li
            key={`${credit.buildingId}-${credit.imageKey}`}
            className="rounded-card bg-surface p-4 text-ink shadow-card"
          >
            <p className="text-caption text-muted">{buildings[credit.buildingId].titleKo}</p>
            <p className="text-body font-semibold text-ink">{credit.titleKo}</p>
            <p className="text-body text-fg">
              {credit.authorKo} · {almanacContent.creditsLicenseLabelKo[credit.license]}
            </p>
            <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-body underline">
              {almanacContent.viewOriginalKo}
            </a>
          </li>
        ))}
      </ul>
      <Button href="/town" variant="secondary">
        {commonContent.backToTownKo}
      </Button>
    </main>
  );
}
