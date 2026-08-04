"use client";

import { useRouter } from "next/navigation";

import { useGameStore } from "@/store/useGameStore";
import { SplashScreen } from "@/components/splash/SplashScreen";

// 이 컴포넌트는 layout.tsx의 HydrationGuard가 hasHydrated를 확인한 뒤에만 마운트되므로,
// 여기서 읽는 avatar.nickname은 항상 localStorage에서 복원된 실제 값이다.
export default function HomePage() {
  const router = useRouter();
  const nickname = useGameStore((state) => state.avatar.nickname);

  function handleDone() {
    router.replace(nickname ? "/town" : "/onboarding");
  }

  return <SplashScreen onDone={handleDone} />;
}
