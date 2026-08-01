// 세 마을(자본주의/사회주의/공산주의)의 결과 재분배 규칙. 순수 산술 함수일 뿐, 어떤 모드도
// "더 낫다"고 판정하지 않는다(CLAUDE.md 절대 규칙 7 — docs/idea.md 6-8 참고).

import type { EconomicMode } from "@/data/tripleVillageContent";

export function distributeResult(tapsByPlayer: number[], mode: EconomicMode): number[] {
  const total = tapsByPlayer.reduce((sum, count) => sum + count, 0);

  if (mode === "capitalism") {
    // 각자 만든 만큼 그대로 가져간다.
    return [...tapsByPlayer];
  }

  if (mode === "socialism") {
    // 마을 전체 생산량을 인원수로 균등 분배한다. 나머지는 앞에서부터 1개씩 더 준다.
    const count = tapsByPlayer.length;
    const base = Math.floor(total / count);
    let remainder = total - base * count;
    return tapsByPlayer.map(() => {
      if (remainder > 0) {
        remainder -= 1;
        return base + 1;
      }
      return base;
    });
  }

  // communism: 개인 몫이라는 개념이 없다 — 모두가 마을 전체 생산량을 함께 본다.
  return tapsByPlayer.map(() => total);
}
