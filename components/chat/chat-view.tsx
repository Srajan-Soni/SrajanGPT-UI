"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Plus, Sparkles, ChevronDown } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { MessageItem } from "@/components/chat/message-item";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";

export function ChatView() {
  const {
    conversations,
    activeConversationId,
    newChat,
    selectedModel,
    setSelectedModel,
    availableModels,
    fetchAvailableModels,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConv?.messages || [];

  // Fetch available models on mount
  useEffect(() => {
    fetchAvailableModels();
  }, [fetchAvailableModels]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
      {/* Chat Top Action Bar */}
      <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-3 glass-panel">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={newChat}
            className="flex items-center gap-1.5 text-gray-600 hover:text-primary"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>

          <span className="text-gray-300">|</span>

          {/* Model Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-accent-50 text-accent-700 font-medium text-xs sm:text-sm pl-3 pr-7 py-1.5 rounded-lg border border-accent-200 hover:border-accent-300 focus:outline-none focus:ring-1 focus:ring-accent-500 cursor-pointer"
            >
              {availableModels.length > 0 ? (
                availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id}
                  </option>
                ))
              ) : (
                <option value={selectedModel}>{selectedModel}</option>
              )}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-accent-700 pointer-events-none absolute right-2" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={newChat}
            className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
          </Button>
        </div>
      </div>

      {/* Message Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              How can SrajanGPT help you today?
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Ask anything — generate code, summarize documents, brainstorm ideas, or chat.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100/60">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Floating / Docked Chat Input */}
      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
}
