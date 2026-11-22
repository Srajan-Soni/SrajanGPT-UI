"use client";

import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  ChevronDown,
  History,
  AlertCircle,
  X,
  Code2,
  Lightbulb,
  Mail,
  Zap,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { MessageItem } from "@/components/chat/message-item";
import { ChatInput } from "@/components/chat/chat-input";
import { HistoryDrawer } from "@/components/chat/history-drawer";
import { Button } from "@/components/ui/button";

const QUICK_STARTERS = [
  {
    icon: Code2,
    title: "Write Python Script",
    prompt: "Write a well-commented Python script that scrapes headlines from a news website using BeautifulSoup.",
  },
  {
    icon: Lightbulb,
    title: "Explain Async Architecture",
    prompt: "Explain asynchronous Python programming and FastAPI event loops in simple terms with an analogy.",
  },
  {
    icon: Mail,
    title: "Draft Follow-up Email",
    prompt: "Draft a polite and professional follow-up email to a client regarding an outstanding project milestone review.",
  },
  {
    icon: Zap,
    title: "Optimize SQL Query",
    prompt: "Explain best practices to optimize slow SQL JOIN queries with index recommendations.",
  },
];

export function ChatView() {
  const {
    conversations,
    activeConversationId,
    newChat,
    selectedModel,
    setSelectedModel,
    availableModels,
    fetchAvailableModels,
    setIsHistoryOpen,
    sendMessage,
    error,
    clearError,
    serverStatus,
    checkServerHealth,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConv?.messages || [];

  // Check health and fetch available models on mount
  useEffect(() => {
    checkServerHealth();
    fetchAvailableModels();
  }, [checkServerHealth, fetchAvailableModels]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf("assistant");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
      {/* Slide-out conversation history drawer */}
      <HistoryDrawer />

      {/* Chat Top Action Bar */}
      <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-3 glass-panel">
        <div className="flex items-center gap-2">
          {/* History Drawer Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 text-gray-700 hover:text-primary hover:bg-accent-50"
            title="Open conversation history"
            aria-label="Open conversation history"
          >
            <History className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline text-xs font-medium">History</span>
            {conversations.length > 0 && (
              <span className="ml-0.5 rounded-full bg-accent-100 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                {conversations.length}
              </span>
            )}
          </Button>

          <span className="text-gray-300">|</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={newChat}
            className="flex items-center gap-1.5 text-gray-600 hover:text-primary"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Home</span>
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

          {/* Server Connection Status Indicator */}
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-500 ml-1"
            title={
              serverStatus === "connected"
                ? "Backend connected on port 8000"
                : "Backend unreachable"
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                serverStatus === "connected"
                  ? "bg-emerald-500"
                  : serverStatus === "checking"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="capitalize">{serverStatus}</span>
          </span>
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

      {/* Global Error Banner */}
      {error && (
        <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800 sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="p-1 text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Message Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              How can SrajanGPT help you today?
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mb-6">
              Powered by Groq inference for near-instant responses.
            </p>

            {/* Quick Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
              {QUICK_STARTERS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => sendMessage(item.prompt)}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card text-left"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{item.prompt}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100/60">
            {messages.map((message, idx) => (
              <MessageItem
                key={message.id}
                message={message}
                isLastAssistant={idx === lastAssistantIndex}
              />
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
