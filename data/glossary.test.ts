import { describe, expect, it } from "vitest";

import { buildings } from "./buildings";
import { glossary } from "./glossary";

const glossaryIds = new Set(glossary.map((entry) => entry.id));

describe("glossary", () => {
  it("relatedTermIds는 모두 glossary 안에 실제로 존재하는 id를 가리킨다", () => {
    for (const entry of glossary) {
      for (const relatedId of entry.relatedTermIds ?? []) {
        expect(glossaryIds.has(relatedId)).toBe(true);
      }
    }
  });

  it("relatedBuildingId는 모두 buildings 안에 실제로 존재하는 건물 id를 가리킨다", () => {
    for (const entry of glossary) {
      if (entry.relatedBuildingId) {
        expect(buildings[entry.relatedBuildingId]).toBeDefined();
      }
    }
  });

  it("22개 용어 모두 확장 필드(long/metaphor/example)를 빈 문자열 없이 갖는다", () => {
    expect(glossary).toHaveLength(22);
    for (const entry of glossary) {
      expect(entry.longDefinitionKo.length).toBeGreaterThan(0);
      expect(entry.metaphorKo.length).toBeGreaterThan(0);
      expect(entry.exampleKo.length).toBeGreaterThan(0);
    }
  });
});
