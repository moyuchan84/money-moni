import type { ComponentType } from "react";

import type { AlmanacWidgetKey } from "@/data/almanac/almanacTypes";
import { CompoundInterestExplorer } from "./CompoundInterestExplorer";
import { InflationBalloonExplorer } from "./InflationBalloonExplorer";
import { DiversificationBasketExplorer } from "./DiversificationBasketExplorer";
import { LeverageSeesawExplorer } from "./LeverageSeesawExplorer";
import { InterestSimulatorExplorer } from "./InterestSimulatorExplorer";
import { StockPriceExplorer } from "./StockPriceExplorer";
import { JarRatioExplorer } from "./JarRatioExplorer";
import { ArrowFlowExplorer } from "./ArrowFlowExplorer";
import { IncomeRaceExplorer } from "./IncomeRaceExplorer";
import { ToolCompareExplorer } from "./ToolCompareExplorer";
import { SeedOddsExplorer } from "./SeedOddsExplorer";
import { GoldTimelineExplorer } from "./GoldTimelineExplorer";
import { CoinTrackExplorer } from "./CoinTrackExplorer";
import { BreadSplitExplorer } from "./BreadSplitExplorer";
import { MoneyShapeTimelineExplorer } from "./MoneyShapeTimelineExplorer";
import { EconomicSeasonsWheel } from "./EconomicSeasonsWheel";

// interactiveWidgetKey → 실제 위젯 컴포넌트 매핑. 아직 구현되지 않은 키는 null을 반환해
// "직접 만져보기" 섹션 자체가 죽은 자리로 남지 않게 한다(docs/almanac-interactive.md 4장).
const WIDGET_REGISTRY: Partial<Record<AlmanacWidgetKey, ComponentType>> = {
  "compound-interest": CompoundInterestExplorer,
  "inflation-balloon": InflationBalloonExplorer,
  "diversification-basket": DiversificationBasketExplorer,
  "leverage-seesaw": LeverageSeesawExplorer,
  "interest-simulator": InterestSimulatorExplorer,
  "stock-price": StockPriceExplorer,
  "jar-ratio": JarRatioExplorer,
  "arrow-flow": ArrowFlowExplorer,
  "income-race": IncomeRaceExplorer,
  "tool-compare": ToolCompareExplorer,
  "seed-odds": SeedOddsExplorer,
  "gold-timeline": GoldTimelineExplorer,
  "coin-track": CoinTrackExplorer,
  "bread-split": BreadSplitExplorer,
  "money-shape-timeline": MoneyShapeTimelineExplorer,
  "economic-seasons-wheel": EconomicSeasonsWheel,
};

export function AlmanacWidgetSlot({ widgetKey }: { widgetKey: AlmanacWidgetKey }) {
  const Widget = WIDGET_REGISTRY[widgetKey];
  if (!Widget) return null;
  return <Widget />;
}
