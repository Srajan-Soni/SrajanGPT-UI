"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Copy, Check, User } from "lucide-react";
import type { ChatMessage } from "@/types";
import { CodeBlock } from "@/components/chat/code-block";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  }

  return (
    <div
      className={`flex w-full gap-3 py-4 sm:gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
      )}

      <div
        className={`group relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${
          isUser
            ? "bg-primary text-primary-foreground shadow-sm"
            : "glass-panel border border-gray-200/80 bg-white/90 text-gray-900 shadow-card"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
            {message.content}
          </p>
        ) : (
          <div className="text-sm leading-relaxed text-gray-800 sm:text-base">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match && !String(children).includes("\n");
                    return !isInline ? (
                      <CodeBlock
                        language={match ? match[1] : ""}
                        value={String(children).replace(/\n$/, "")}
                      />
                    ) : (
                      <code
                        className="rounded-md bg-accent-100/70 px-1.5 py-0.5 font-mono text-xs text-primary font-medium sm:text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2.5 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="mb-3 list-decimal pl-5 space-y-1">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="leading-relaxed">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="mb-2 mt-4 text-base font-bold text-gray-900 sm:text-lg">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="mb-1.5 mt-3 text-sm font-semibold text-gray-900 sm:text-base">{children}</h3>;
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-4 border-primary/30 pl-3 italic text-gray-600 my-2">{children}</blockquote>;
                  },
                  table({ children }) {
                    return <div className="my-3 overflow-x-auto"><table className="w-full border-collapse text-left border border-gray-200">{children}</table></div>;
                  },
                  th({ children }) {
                    return <th className="border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="border border-gray-200 px-3 py-1.5 text-xs">{children}</td>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : message.isStreaming ? (
              <div className="flex items-center gap-1.5 py-1 text-gray-400">
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:0.4s]" />
              </div>
            ) : null}

            {message.isStreaming && message.content && (
              <span className="inline-block h-4 w-1 animate-pulse bg-accent-600 align-middle ml-1" />
            )}

            {!message.isStreaming && message.content && (
              <div className="mt-2.5 flex items-center justify-end border-t border-gray-100 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-700 shadow-sm">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
