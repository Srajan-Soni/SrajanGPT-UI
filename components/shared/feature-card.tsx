import { resolveIcon } from "@/components/shared/icon-map";
import { cn } from "@/lib/utils";
import type { Feature } from "@/types";

interface FeatureCardProps {
  /** The feature data to render */
  feature: Feature;
  /** Optional additional classes — used for grid-span overrides on the last item */
  className?: string;
}

/**
 * FeatureCard
 * Server Component — purely informational, no interactivity, so no
 * "use client" boundary is needed. Reuses the same icon resolution
 * pattern established by PromptCard in Step 11.
 */
export function FeatureCard({ feature, className }: FeatureCardProps) {
  const Icon = resolveIcon(feature.icon);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-gray-900">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">
          {feature.description}
        </p>
      </div>
    </div>
  );
}