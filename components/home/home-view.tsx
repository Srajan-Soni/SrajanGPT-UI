"use client";

import { useChatStore } from "@/store/useChatStore";
import { Hero } from "@/components/sections/hero";
import { SuggestedPrompts } from "@/components/sections/suggested-prompts";
import { Features } from "@/components/sections/features";
import { ChatView } from "@/components/chat/chat-view";

/**
 * HomeView
 * Client Component managing the seamless transition between the static Landing Page
 * and the active ChatGPT-style conversational interface.
 */
export function HomeView() {
  const { activeConversationId, conversations } = useChatStore();

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const hasActiveChat = Boolean(activeConv && activeConv.messages.length > 0);

  if (hasActiveChat) {
    return <ChatView />;
  }

  return (
    <>
      <Hero />
      <SuggestedPrompts />
      <Features />
    </>
  );
}
