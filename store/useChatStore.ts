"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Conversation, ModelOption } from "@/types";
import { chatService } from "@/services/chatService";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  inputPrompt: string;
  selectedModel: string;
  availableModels: ModelOption[];
  error: string | null;
  abortController: AbortController | null;

  // Actions
  setInputPrompt: (text: string) => void;
  setSelectedModel: (model: string) => void;
  fetchAvailableModels: () => Promise<void>;
  createConversation: (title?: string) => string;
  selectConversation: (id: string | null) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  newChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      inputPrompt: "",
      selectedModel: "openai/gpt-oss-120b",
      availableModels: [],
      error: null,
      abortController: null,

      setInputPrompt: (text: string) => set({ inputPrompt: text }),

      setSelectedModel: (model: string) => set({ selectedModel: model }),

      fetchAvailableModels: async () => {
        try {
          const res = await chatService.getModels();
          set({
            availableModels: res.models,
            selectedModel: get().selectedModel || res.default_model,
          });
        } catch (err) {
          console.warn("Failed to load models list from backend:", err);
        }
      },

      createConversation: (initialTitle?: string) => {
        const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newConv: Conversation = {
          id,
          title: initialTitle || "New Conversation",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().selectedModel,
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeConversationId: id,
          error: null,
        }));
        return id;
      },

      selectConversation: (id: string | null) => {
        set({ activeConversationId: id, error: null });
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const updated = state.conversations.filter((c) => c.id !== id);
          const nextActiveId =
            state.activeConversationId === id
              ? updated.length > 0
                ? updated[0].id
                : null
              : state.activeConversationId;
          return {
            conversations: updated,
            activeConversationId: nextActiveId,
          };
        });
      },

      clearAllConversations: () => {
        set({ conversations: [], activeConversationId: null, error: null });
      },

      newChat: () => {
        // Abort any ongoing stream
        const controller = get().abortController;
        if (controller) controller.abort();
        set({
          activeConversationId: null,
          isStreaming: false,
          error: null,
          abortController: null,
        });
      },

      stopStreaming: () => {
        const controller = get().abortController;
        if (controller) {
          controller.abort();
        }
        set({ isStreaming: false, abortController: null });
      },

      sendMessage: async (content: string) => {
        const trimmed = content.trim();
        if (!trimmed || get().isStreaming) return;

        let activeId = get().activeConversationId;
        const currentModel = get().selectedModel;

        // Auto-generate conversation title from first prompt
        const titleSnippet =
          trimmed.length > 35 ? `${trimmed.slice(0, 32)}...` : trimmed;

        if (!activeId) {
          activeId = get().createConversation(titleSnippet);
        }

        const userMessage: ChatMessage = {
          id: `msg_user_${Date.now()}`,
          role: "user",
          content: trimmed,
          createdAt: Date.now(),
        };

        const assistantMessageId = `msg_asst_${Date.now()}`;
        const assistantPlaceholder: ChatMessage = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          createdAt: Date.now(),
          isStreaming: true,
        };

        // Append user and placeholder messages
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === activeId) {
              const updatedTitle =
                c.messages.length === 0 ? titleSnippet : c.title;
              return {
                ...c,
                title: updatedTitle,
                updatedAt: Date.now(),
                messages: [...c.messages, userMessage, assistantPlaceholder],
              };
            }
            return c;
          }),
          isStreaming: true,
          error: null,
          inputPrompt: "",
        }));

        // Prepare context messages for API
        const activeConv = get().conversations.find((c) => c.id === activeId);
        const historyForApi = (activeConv ? activeConv.messages : [])
          .filter((m) => m.id !== assistantMessageId)
          .map((m) => ({ role: m.role, content: m.content }));

        const controller = new AbortController();
        set({ abortController: controller });

        let accumulatedContent = "";

        await chatService.streamChat({
          messages: historyForApi,
          model: currentModel,
          signal: controller.signal,
          onChunk: (chunk) => {
            if (chunk.content) {
              accumulatedContent += chunk.content;
              set((state) => ({
                conversations: state.conversations.map((c) => {
                  if (c.id === activeId) {
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMessageId
                          ? {
                              ...m,
                              content: accumulatedContent,
                              reasoning: chunk.reasoning || m.reasoning,
                            }
                          : m
                      ),
                    };
                  }
                  return c;
                }),
              }));
            }
          },
          onDone: () => {
            set((state) => ({
              isStreaming: false,
              abortController: null,
              conversations: state.conversations.map((c) => {
                if (c.id === activeId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, isStreaming: false }
                        : m
                    ),
                  };
                }
                return c;
              }),
            }));
          },
          onError: (err) => {
            set((state) => ({
              isStreaming: false,
              abortController: null,
              error: err.message,
              conversations: state.conversations.map((c) => {
                if (c.id === activeId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? {
                            ...m,
                            content:
                              m.content ||
                              `⚠️ Error: ${err.message || "Failed to generate response"}`,
                            isStreaming: false,
                          }
                        : m
                    ),
                  };
                }
                return c;
              }),
            }));
          },
        });
      },
    }),
    {
      name: "srajangpt_chat_store",
      partialize: (state) => ({
        conversations: state.conversations,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
