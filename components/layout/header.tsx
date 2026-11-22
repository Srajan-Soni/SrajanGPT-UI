"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { navLinks } from "@/constants";
import { useChatStore } from "@/store/useChatStore";
import { HistoryDrawer } from "@/components/chat/history-drawer";

/**
 * Header
 * Fixed, glassmorphic top navigation with integrated History Drawer trigger.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { conversations, setIsHistoryOpen } = useChatStore();

  return (
    <>
      <HistoryDrawer />
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/60 glass-panel">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            {conversations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary hover:bg-accent-50"
                aria-label="Open chat history"
              >
                <History className="h-4 w-4 text-primary" />
                <span>Chats</span>
                <span className="rounded-full bg-accent-100 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                  {conversations.length}
                </span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const inputEl = document.getElementById("prompt-input");
                if (inputEl) {
                  inputEl.focus();
                  inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              Start Chat
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {conversations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="h-10 px-2 text-primary"
                aria-label="Chat history"
              >
                <History className="h-5 w-5" />
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  className="h-11 w-11 p-0"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <nav
                  className="mt-8 flex flex-col gap-1 px-4"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 flex flex-col gap-2 px-4">
                  {conversations.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsHistoryOpen(true);
                      }}
                    >
                      <History className="h-4 w-4" />
                      <span>Saved Chats ({conversations.length})</span>
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      const inputEl = document.getElementById("prompt-input");
                      if (inputEl) {
                        inputEl.focus();
                        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                  >
                    Start Chat
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  );
}
