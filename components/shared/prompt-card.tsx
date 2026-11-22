"use client";

import { resolveIcon } from "@/components/shared/icon-map";
import { cn } from "@/lib/utils";
import type { SuggestedPrompt } from "@/types";
import { useChatStore } from "@/store/useChatStore";

interface PromptCardProps {
  /** The suggested prompt data to render */
  prompt: SuggestedPrompt;
  /** Optional additional classes */
  className?: string;
}

/**
 * PromptCard
 * Populates the Hero prompt input with this card's prompt template and focuses it.
 */
export function PromptCard({ prompt, className }: PromptCardProps) {
  const Icon = resolveIcon(prompt.icon);
  const { setInputPrompt } = useChatStore();

  function handleClick() {
    setInputPrompt(prompt.prompt);
    const inputEl = document.getElementById("prompt-input");
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group cursor-pointer flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card-hover focus-visible:-translate-y-0.5",
        className
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {prompt.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">
          {prompt.description}
        </p>
      </div>
    </button>
  );
}
