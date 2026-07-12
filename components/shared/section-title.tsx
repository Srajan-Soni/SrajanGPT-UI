import { cn } from "@/lib/utils";

interface SectionTitleProps {
  /** Small uppercase label shown above the heading (e.g. "FEATURES") */
  eyebrow?: string;
  /** Main heading text */
  title: string;
  /** Optional supporting subheading text */
  subtitle?: string;
  /** Text alignment — defaults to center, matches ChatGPT/Claude landing page style */
  align?: "left" | "center";
  /** Optional additional classes for spacing overrides */
  className?: string;
}

/**
 * SectionTitle
 * Consistent heading treatment used across Features, Suggested Prompts,
 * and any future sections — ensures uniform typography scale and spacing
 * without repeating heading markup in every section component.
 */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base text-gray-500 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}