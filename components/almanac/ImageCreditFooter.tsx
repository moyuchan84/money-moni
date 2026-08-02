import Link from "next/link";

import type { ImageCredit } from "@/data/almanac/almanacTypes";
import { almanacContent } from "@/data/almanacContent";

export function ImageCreditFooter({ credit }: { credit: ImageCredit }) {
  return (
    <p className="text-caption text-muted">
      {almanacContent.imageCreditPrefixKo}
      {credit.titleKo} · {credit.authorKo} ·{" "}
      <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
        {almanacContent.viewOriginalKo}
      </a>{" "}
      · <Link href="/credits" className="underline">
        {almanacContent.moreCreditsLinkKo}
      </Link>
    </p>
  );
}
