import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildingList } from "../buildings";
import { almanacByBuildingId, allAlmanacCredits } from "./index";

const LICENSES = ["PD", "CC-BY", "CC-BY-SA"];

describe("almanacByBuildingId", () => {
  it("buildingList의 모든 건물이 도감 항목을 가진다", () => {
    for (const building of buildingList) {
      expect(almanacByBuildingId[building.id]).toBeDefined();
    }
  });

  it("모든 credits의 license가 허용된 값 중 하나다", () => {
    for (const credit of allAlmanacCredits) {
      expect(LICENSES).toContain(credit.license);
    }
  });

  it("timeline의 imageKey는 모두 같은 건물의 credits 항목과 짝이 맞는다", () => {
    for (const almanac of Object.values(almanacByBuildingId)) {
      const creditKeys = new Set(almanac.credits.map((c) => c.imageKey));
      for (const event of almanac.timeline) {
        if (event.imageKey) {
          expect(creditKeys.has(event.imageKey)).toBe(true);
        }
      }
    }
  });

  it("credits가 가리키는 imageKey는 모두 timeline에서 실제로 쓰인다(고아 크레딧 없음)", () => {
    for (const almanac of Object.values(almanacByBuildingId)) {
      const usedKeys = new Set(almanac.timeline.map((e) => e.imageKey).filter(Boolean));
      for (const credit of almanac.credits) {
        expect(usedKeys.has(credit.imageKey)).toBe(true);
      }
    }
  });

  it("credits가 참조하는 이미지 파일이 public/images/almanac에 실제로 존재한다", () => {
    for (const almanac of Object.values(almanacByBuildingId)) {
      for (const credit of almanac.credits) {
        const filePath = path.resolve(
          __dirname,
          "../../public/images/almanac",
          almanac.buildingId,
          `${credit.imageKey}.jpg`,
        );
        expect(existsSync(filePath)).toBe(true);
      }
    }
  });
});
