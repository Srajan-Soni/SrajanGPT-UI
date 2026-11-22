import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants";

interface LogoProps {
  /** Optional additional classes for size/spacing overrides */
  className?: string;
  /** Whether the logo links to home — disable for contexts like a static footer mark */
  linkToHome?: boolean;
}

/**
 * Logo
 * Renders the SrajanGPT brand mark (icon + wordmark). Used identically
 * in Navbar and Footer — single source of truth for brand presentation.
 */
export function Logo({ className, linkToHome = true }: LogoProps) {
  const content = (
    <span className={cn("flex items-center gap-2 font-semibold text-gray-900", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
<Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />      </span>
      <span className="text-lg tracking-tight">{siteConfig.name}</span>
    </span>
  );

  if (!linkToHome) return content;

  return (
    <Link href="/" aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}