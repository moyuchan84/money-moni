import { describe, expect, it } from "vitest";

import { distributeResult } from "./distributeResult";

describe("distributeResult", () => {
  it("capitalism은 각자 만든 만큼 그대로 돌려준다(입력 배열은 변경하지 않는다)", () => {
    const input = [5, 3, 2];
    const result = distributeResult(input, "capitalism");

    expect(result).toEqual([5, 3, 2]);
    expect(result).not.toBe(input);
    expect(input).toEqual([5, 3, 2]);
  });

  it("socialism은 합계를 인원수로 균등 분배하고, 나머지는 앞에서부터 1개씩 준다", () => {
    expect(distributeResult([5, 3, 2], "socialism")).toEqual([4, 3, 3]);
  });

  it("socialism은 나누어떨어지면 모두 같은 값을 받는다", () => {
    expect(distributeResult([9, 9, 9], "socialism")).toEqual([9, 9, 9]);
  });

  it("communism은 모든 원소가 마을 전체 합계값이 된다", () => {
    expect(distributeResult([5, 3, 2], "communism")).toEqual([10, 10, 10]);
  });

  it("모두 0탭이면 세 모드 전부 0으로 채워진다(0으로 나누기 오류 없음)", () => {
    expect(distributeResult([0, 0, 0], "capitalism")).toEqual([0, 0, 0]);
    expect(distributeResult([0, 0, 0], "socialism")).toEqual([0, 0, 0]);
    expect(distributeResult([0, 0, 0], "communism")).toEqual([0, 0, 0]);
  });
});
