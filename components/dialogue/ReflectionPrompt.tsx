"use client";

// 범용 버전은 Phase 1에서 완성한다(docs/phases.md Phase 1). 지금은 props 인터페이스만 확정한다.
// CLAUDE.md 절대 규칙 7: triple-village처럼 민감한 주제는 정답 판정 없이 이 컴포넌트로만 마무리한다.

export interface ReflectionOption {
  id: string;
  label: string;
}

export interface ReflectionPromptProps {
  question: string;
  options: ReflectionOption[];
  onAnswer: (optionId: string) => void;
}

export function ReflectionPrompt({ question, options, onAnswer }: ReflectionPromptProps) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow">
      <p className="text-body font-heading">{question}</p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onAnswer(option.id)}
            className="min-h-touch rounded-2xl bg-district2-primary-light px-4 py-2 text-left text-body"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
