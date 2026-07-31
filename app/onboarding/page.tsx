"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { avatarPartCategories, type AvatarPartKey } from "@/data/avatarOptions";
import { useGameStore, type AvatarLook } from "@/store/useGameStore";
import { AvatarPartPicker } from "@/components/onboarding/AvatarPartPicker";

function defaultLookFromCategories(): AvatarLook {
  return Object.fromEntries(
    avatarPartCategories.map((category) => [category.key, category.options[0].id]),
  ) as unknown as AvatarLook;
}

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useGameStore((state) => state.completeOnboarding);
  const [nickname, setNickname] = useState("");
  const [look, setLook] = useState<AvatarLook>(defaultLookFromCategories);

  function handleSelectPart(key: AvatarPartKey, optionId: string) {
    setLook((prev) => ({ ...prev, [key]: optionId }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;
    completeOnboarding(trimmed, look);
    router.replace("/town");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-display font-heading">머니타운에 온 걸 환영해!</h1>
      <p className="text-body">나만의 모습을 만들고, 너를 부를 이름을 알려줘.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          {avatarPartCategories.map((category) => (
            <AvatarPartPicker
              key={category.key}
              label={category.labelKo}
              options={category.options}
              selectedId={look[category.key]}
              onSelect={(optionId) => handleSelectPart(category.key, optionId)}
            />
          ))}
        </div>
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
