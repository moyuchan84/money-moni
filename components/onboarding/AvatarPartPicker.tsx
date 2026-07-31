"use client";

import type { AvatarOption } from "@/data/avatarOptions";

export interface AvatarPartPickerProps {
  label: string;
  options: AvatarOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AvatarPartPicker({ label, options, selectedId, onSelect }: AvatarPartPickerProps) {
  return (
    <fieldset className="flex flex-col items-center gap-2">
      <legend className="text-caption font-heading">{label}</legend>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selectedId === option.id}
            aria-label={option.labelKo}
            className={`flex min-h-touch min-w-touch items-center justify-center rounded-2xl px-3 py-2 text-heading transition ${
              selectedId === option.id
                ? "bg-district1-primary text-white"
                : "bg-white shadow hover:scale-105"
            }`}
          >
            <span aria-hidden>{option.emoji}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
