"use client";

// 두 값(또는 여러 값)을 막대로 비교해 보여주는 공용 컴포넌트. 차팅 라이브러리 없이 직접 그린다.
// 색상만으로 정보를 구분하지 않도록 각 막대에 라벨+수치를 담은 aria-label을 함께 준다
// (docs/implementation.md 8-4 "접근성 있는 차트 팔레트 원칙").

export interface ComparisonBarChartItem {
  id: string;
  labelKo: string;
  value: number;
  colorHex: string;
}

export interface ComparisonBarChartProps {
  items: ComparisonBarChartItem[];
  maxValue: number;
  unitLabelKo?: string;
}

export function ComparisonBarChart({ items, maxValue, unitLabelKo = "" }: ComparisonBarChartProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((item) => {
        const widthPct = maxValue > 0 ? Math.min(100, (item.value / maxValue) * 100) : 0;
        return (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-caption text-muted">
              <span>{item.labelKo}</span>
              <span>
                {item.value}
                {unitLabelKo}
              </span>
            </div>
            <div
              role="img"
              aria-label={`${item.labelKo} ${item.value}${unitLabelKo}`}
              className="h-4 w-full overflow-hidden rounded-pill bg-surface-muted"
            >
              <div style={{ width: `${widthPct}%`, backgroundColor: item.colorHex }} className="h-full rounded-pill" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
