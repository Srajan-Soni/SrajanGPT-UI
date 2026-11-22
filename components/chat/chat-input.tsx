"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent } from "react";
import { ArrowUp, Square } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export function ChatInput() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming, stopStreaming, inputPrompt, setInputPrompt } =
    useChatStore();

  // If inputPrompt is updated from external (e.g., prompt cards), populate textarea
  useEffect(() => {
    if (inputPrompt) {
      setText(inputPrompt);
      setInputPrompt("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [inputPrompt, setInputPrompt]);

  // Auto-resize textarea height up to 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [text]);

  function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!text.trim() || isStreaming) return;
    const promptToSend = text;
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    sendMessage(promptToSend);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:pb-6">
      <form
        onSubmit={handleSubmit}
        className="glass-panel relative flex items-end gap-2 rounded-2xl border border-gray-200/90 bg-white/95 p-2 shadow-card focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-500/20"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message SrajanGPT..."
          rows={1}
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-base"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stopStreaming}
            aria-label="Stop generation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition-opacity hover:bg-gray-800"
          >
            <Square className="h-4 w-4 fill-current" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </form>
      <p className="mt-2 text-center text-[11px] text-gray-600 sm:text-xs">
        SrajanGPT may occasionally produce inaccurate information. Verify critical outputs.
      </p>
    </div>
  );
}
