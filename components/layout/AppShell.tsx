import type { ReactNode } from "react";

// 고정폭 게임 캔버스 컨테이너. docs/design-revision.md 2-1 참고.
// 뷰포트 높이(min-h-screen) 기준으로 항상 전체 화면 배경을 채우고, 안쪽 프레임(max-w-app)도
// flex-1로 같은 높이를 나눠 받는다 — body/html의 퍼센트 높이 체인에 의존하면(min-h-full) 콘텐츠가
// 짧은 화면(예: 건물 인트로)에서 프레임이 자기 콘텐츠 높이로만 쪼그라들어 바탕 배경이 뷰포트를
// 다 채우지 못하고 위쪽에만 카드가 뜬 것처럼 보이는 문제가 있었다.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-light sm:py-6">
      <div className="mx-auto flex w-full max-w-app flex-1 flex-col bg-background sm:rounded-card sm:shadow-frame">
        {children}
      </div>
    </div>
  );
}
