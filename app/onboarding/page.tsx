"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useGameStore } from "@/store/useGameStore";

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useGameStore((state) => state.completeOnboarding);
  const [nickname, setNickname] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;
    // 아바타 파츠 커스터마이징은 Phase 1에서 채운다. 지금은 기본 look을 그대로 둔다.
    completeOnboarding(trimmed, {});
    router.replace("/town");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-display font-heading">머니타운에 온 걸 환영해!</h1>
      <p className="text-body">너를 부를 이름을 알려줘.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임"
          maxLength={12}
          className="min-h-touch rounded-2xl border border-district1-secondary px-4 py-2 text-body"
        />
        <button
          type="submit"
          className="min-h-touch min-w-touch rounded-full bg-district1-primary px-8 py-2 text-body text-white"
        >
          시작하기
        </button>
      </form>
    </main>
  );
}
