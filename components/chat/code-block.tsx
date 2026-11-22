"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-gray-800 bg-[#0c0620] text-gray-100 shadow-card">
      <div className="flex items-center justify-between border-b border-gray-800/80 bg-[#160c3b]/80 px-4 py-2 text-xs font-medium text-gray-400">
        <span className="font-mono lowercase">{language || "plaintext"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed sm:text-sm">
        <pre>
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
