import type { ReactNode } from "react";

// 모바일에서는 세로로 쌓고 sm 이상에서 가로로 배치한다.
// docs/design-revision.md 2-4 — 버튼 두 개를 좁은 화면에서 억지로 한 줄에 넣지 않는 것이 목적.
export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row">{children}</div>;
}
