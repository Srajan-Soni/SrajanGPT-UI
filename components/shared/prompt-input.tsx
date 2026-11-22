"use client";

import { useState, useEffect, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";

interface PromptInputProps {
  /** Optional additional classes for layout/spacing overrides */
  className?: string;
}

/**
 * PromptInput
 * Client Component — tracks local input state, sends prompt to SrajanGPT
 * via useChatStore, and initiates the streaming response.
 */
export function PromptInput({ className }: PromptInputProps) {
  const [value, setValue] = useState("");
  const { sendMessage, isStreaming, inputPrompt, setInputPrompt } = useChatStore();

  // Sync external prefill (e.g. from clicking suggested prompts)
  useEffect(() => {
    if (inputPrompt) {
      setValue(inputPrompt);
      setInputPrompt("");
    }
  }, [inputPrompt, setInputPrompt]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim() || isStreaming) return;
    const promptToSend = value;
    setValue("");
    sendMessage(promptToSend);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Ask SrajanGPT"
      className={cn("relative", className)}
    >
      <div className="glass-panel flex items-center gap-2 rounded-2xl border border-gray-200 p-2 shadow-card transition-shadow focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-accent-500 focus-within:ring-offset-2">
        <label htmlFor="prompt-input" className="sr-only">
          Ask SrajanGPT anything
        </label>
        <input
          id="prompt-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask SrajanGPT anything..."
          autoComplete="off"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          disabled={!value.trim() || isStreaming}
          aria-label="Send prompt"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
