import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  /** Content to render inside the constrained-width wrapper */
  children: ReactNode;
  /** Optional additional classes for spacing/layout overrides */
  className?: string;
  /** HTML element to render as — defaults to div, useful for <section>/<footer> semantics */
  as?: "div" | "section" | "footer" | "header" | "main";
}

/**
 * Container
 * Provides consistent max-width, centering, and responsive horizontal padding
 * for every section on the page. This is the single source of truth for
 * the page's content width — change it here to resize the entire layout.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}