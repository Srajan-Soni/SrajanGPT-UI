"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  History,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";
import type { Conversation } from "@/types";

interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previousWeek: Conversation[];
  older: Conversation[];
}

function groupConversations(conversations: Conversation[]): GroupedConversations {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfSevenDays = startOfToday - 6 * 86400000;

  const groups: GroupedConversations = {
    today: [],
    yesterday: [],
    previousWeek: [],
    older: [],
  };

  for (const conv of conversations) {
    const timestamp = conv.updatedAt || conv.createdAt;
    if (timestamp >= startOfToday) {
      groups.today.push(conv);
    } else if (timestamp >= startOfYesterday) {
      groups.yesterday.push(conv);
    } else if (timestamp >= startOfSevenDays) {
      groups.previousWeek.push(conv);
    } else {
      groups.older.push(conv);
    }
  }

  return groups;
}

export function HistoryDrawer() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    clearAllConversations,
    newChat,
    isHistoryOpen,
    setIsHistoryOpen,
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const groups = groupConversations(conversations);

  function startEditing(conv: Conversation) {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  }

  function saveEditing(id: string) {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle.trim());
    }
    setEditingId(null);
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleSelect(id: string) {
    selectConversation(id);
    setIsHistoryOpen(false);
  }

  function handleNewChat() {
    newChat();
    setIsHistoryOpen(false);
  }

  const renderGroup = (title: string, list: Conversation[]) => {
    if (list.length === 0) return null;

    return (
      <div key={title} className="mb-4">
        <h4 className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h4>
        <div className="space-y-0.5">
          {list.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-accent-100 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100/80"
                }`}
              >
                {isEditing ? (
                  <div className="flex w-full items-center gap-1.5">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditing(conv.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                      autoFocus
                      className="w-full rounded-md border border-accent-300 bg-white px-2 py-0.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => saveEditing(conv.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelect(conv.id)}
                      className="flex flex-1 items-center gap-2.5 truncate text-left"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                      <span className="truncate">{conv.title || "Untitled Conversation"}</span>
                    </button>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conv);
                        }}
                        title="Rename"
                        className="p-1 text-gray-400 hover:text-gray-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        title="Delete"
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetContent side="left" className="w-80 p-0 flex flex-col justify-between">
        <div>
          <SheetHeader className="p-4 border-b border-gray-100">
            <SheetTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="h-5 w-5" />
                <span>Chat History</span>
              </span>
            </SheetTitle>

            <Button
              onClick={handleNewChat}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3 max-h-[calc(100vh-12rem)]">
            {conversations.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <History className="mx-auto h-8 w-8 opacity-40 mb-2" />
                <p className="text-sm">No saved conversations.</p>
                <p className="text-xs text-gray-400 mt-1">Start chatting to build your history.</p>
              </div>
            ) : (
              <>
                {renderGroup("Today", groups.today)}
                {renderGroup("Yesterday", groups.yesterday)}
                {renderGroup("Previous 7 Days", groups.previousWeek)}
                {renderGroup("Older", groups.older)}
              </>
            )}
          </div>
        </div>

        {conversations.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/50">
            {confirmClear ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-red-600 font-medium">Delete all history?</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => {
                      clearAllConversations();
                      setConfirmClear(false);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear all conversations</span>
              </button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
