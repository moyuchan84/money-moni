import type { BuildingId } from "../buildings";
import type { BuildingAlmanac } from "./almanacTypes";
import { museumAlmanac } from "./museumAlmanac";
import { ledgerHouseAlmanac } from "./ledgerHouseAlmanac";
import { allowanceSquareAlmanac } from "./allowanceSquareAlmanac";
import { bankAlmanac } from "./bankAlmanac";
import { moneyTreeAlmanac } from "./moneyTreeAlmanac";
import { jobCenterAlmanac } from "./jobCenterAlmanac";
import { marketAlmanac } from "./marketAlmanac";
import { capitalWarehouseAlmanac } from "./capitalWarehouseAlmanac";
import { seedFieldAlmanac } from "./seedFieldAlmanac";
import { stockStreetAlmanac } from "./stockStreetAlmanac";
import { etfLabAlmanac } from "./etfLabAlmanac";
import { goldVaultAlmanac } from "./goldVaultAlmanac";
import { coinStationAlmanac } from "./coinStationAlmanac";
import { loanCounterAlmanac } from "./loanCounterAlmanac";
import { tripleVillageAlmanac } from "./tripleVillageAlmanac";

export const almanacByBuildingId: Record<BuildingId, BuildingAlmanac> = {
  museum: museumAlmanac,
  "ledger-house": ledgerHouseAlmanac,
  "allowance-square": allowanceSquareAlmanac,
  bank: bankAlmanac,
  "money-tree": moneyTreeAlmanac,
  "job-center": jobCenterAlmanac,
  market: marketAlmanac,
  "capital-warehouse": capitalWarehouseAlmanac,
  "seed-field": seedFieldAlmanac,
  "stock-street": stockStreetAlmanac,
  "etf-lab": etfLabAlmanac,
  "gold-vault": goldVaultAlmanac,
  "coin-station": coinStationAlmanac,
  "loan-counter": loanCounterAlmanac,
  "triple-village": tripleVillageAlmanac,
};

export const allAlmanacCredits = Object.values(almanacByBuildingId).flatMap((almanac) =>
  almanac.credits.map((credit) => ({ buildingId: almanac.buildingId, ...credit })),
);
