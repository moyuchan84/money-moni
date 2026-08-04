import { describe, expect, it } from "vitest";

import { computeChasedResult, computeDisciplinedResult, type PlayerEventChoices } from "./disciplineMath";
import { stockStreetContent } from "@/data/stockStreetContent";

const soda = stockStreetContent.ideas.find((idea) => idea.id === "idea-soda")!;
const spicy = stockStreetContent.ideas.find((idea) => idea.id === "idea-spicy")!;
const cookie = stockStreetContent.ideas.find((idea) => idea.id === "idea-cookie")!;

describe("computeDisciplinedResult", () => {
  it("이벤트에서 지켜봤으면 순수 dayMultipliers × eventDayMultiplier만 반영한다(idea-soda)", () => {
    const choices: PlayerEventChoices = { 1: "wait" };
    expect(computeDisciplinedResult(soda, choices)).toBeCloseTo(0.9 * 1.3 * 1.15 * 1.05, 5);
  });

  it("이벤트에서 즉시 반응했으면 chaseOutcomeMultiplier가 추가로 곱해진다(idea-soda)", () => {
    const choices: PlayerEventChoices = { 1: "act" };
    expect(computeDisciplinedResult(soda, choices)).toBeCloseTo(0.9 * 1.3 * 1.15 * 0.8 * 1.05, 5);
  });

  it("이벤트가 없는 아이디어는 dayMultipliers 누적곱과 동일하다(회귀 없음)", () => {
    const result = computeDisciplinedResult(cookie, {});
    expect(result).toBeCloseTo(1.2 * 1.1 * 1.15, 5);
  });

  it("scare 이벤트에서 즉시 팔았을 때가 지켜봤을 때보다 결과가 더 나은 경우도 있다(idea-spicy)", () => {
    const waited = computeDisciplinedResult(spicy, { 0: "wait" });
    const acted = computeDisciplinedResult(spicy, { 0: "act" });
    expect(waited).toBeCloseTo(0.85 * 0.9 * 0.95 * 0.9, 5);
    expect(acted).toBeCloseTo(0.85 * 0.9 * 1.1 * 0.95 * 0.9, 5);
    expect(acted).toBeGreaterThan(waited);
  });
});

describe("computeChasedResult", () => {
  it("모든 이벤트에서 즉시 반응했다고 가정한 배수를 계산한다(idea-soda)", () => {
    expect(computeChasedResult(soda)).toBeCloseTo(0.9 * 1.3 * 1.15 * 0.8 * 1.05, 5);
  });

  it("버틴 쪽(discipline)이 이길 때도, 휩쓸린 쪽이 이길 때도 있다 — 매번 한쪽이 이기도록 고정되지 않았다", () => {
    const sodaDisciplined = computeDisciplinedResult(soda, { 1: "wait" });
    const sodaChased = computeChasedResult(soda);
    expect(sodaDisciplined).toBeGreaterThan(sodaChased);

    const spicyDisciplined = computeDisciplinedResult(spicy, { 0: "wait" });
    const spicyChased = computeChasedResult(spicy);
    expect(spicyChased).toBeGreaterThan(spicyDisciplined);
  });
});
