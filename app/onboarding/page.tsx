"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { avatarPartCategories, freeOptions, type AvatarPartKey } from "@/data/avatarOptions";
import { onboardingContent } from "@/data/onboardingContent";
import { useGameStore, type AvatarLook } from "@/store/useGameStore";
import { AvatarPartPicker } from "@/components/onboarding/AvatarPartPicker";
import { Button } from "@/components/ui/Button";

function defaultLookFromCategories(): AvatarLook {
  return Object.fromEntries(
    avatarPartCategories.map((category) => [category.key, freeOptions(category)[0].id]),
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
      <h1 className="font-jua text-display text-ink">{onboardingContent.titleKo}</h1>
      <p className="text-body text-fg">{onboardingContent.subtitleKo}</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          {avatarPartCategories.map((category) => (
            <AvatarPartPicker
              key={category.key}
              label={category.labelKo}
              options={freeOptions(category)}
              selectedId={look[category.key]}
              onSelect={(optionId) => handleSelectPart(category.key, optionId)}
            />
          ))}
        </div>
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder={onboardingContent.nicknamePlaceholderKo}
          maxLength={12}
          className="min-h-touch rounded-control border border-border px-4 py-2 text-body"
        />
        <Button type="submit">{onboardingContent.startButtonKo}</Button>
      </form>
    </main>
  );
}
