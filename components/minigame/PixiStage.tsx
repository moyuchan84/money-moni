"use client";

import { useEffect, useRef } from "react";
import { Application } from "pixi.js";

// PixiJS Application 생성 · 리사이즈 · 해제를 감당하는 공용 래퍼.
// 이 파일은 pixi.js를 직접 import하므로, 이 컴포넌트를 쓰는 쪽에서 반드시
// next/dynamic(() => import(...), { ssr: false })로만 불러온다(CLAUDE.md 절대 규칙 3).
export interface PixiStageProps {
  width: number;
  height: number;
  backgroundColor?: number;
  // app.init()이 끝난 뒤 한 번 호출된다. 여기서 스프라이트 배치·ticker 등록을 한다.
  // 반환한 함수가 있으면 언마운트 시 정리 콜백으로 실행된다.
  onReady: (app: Application) => void | (() => void);
}

export function PixiStage({ width, height, backgroundColor = 0xffffff, onReady }: PixiStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let ready = false;
    let cleanupGame: (() => void) | void;
    const app = new Application();

    // .init()은 비동기라 개발 모드의 StrictMode(mount→cleanup→mount) 상에서는
    // cleanup이 init 완료보다 먼저 실행될 수 있다. 아직 초기화되지 않은 Application을
    // destroy()하면 내부 리사이즈 플러그인이 없어 에러가 나므로, init이 끝난 뒤에만 해제한다.
    app.init({ width, height, backgroundColor, antialias: true }).then(() => {
      ready = true;
      if (destroyed) {
        app.destroy(true, { children: true });
        return;
      }
      container.appendChild(app.canvas);
      cleanupGame = onReadyRef.current(app);
    });

    return () => {
      destroyed = true;
      cleanupGame?.();
      if (ready) {
        app.destroy(true, { children: true });
      }
    };
  }, [width, height, backgroundColor]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className="overflow-hidden rounded-2xl shadow"
      aria-hidden
    />
  );
}

export default PixiStage;
