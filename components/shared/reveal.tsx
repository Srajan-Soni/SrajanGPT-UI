"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ANIMATION } from "@/constants";

interface RevealProps {
  /** Content to animate in */
  children: ReactNode;
  /** Optional additional classes passed to the motion wrapper */
  className?: string;
  /** Delay in seconds before this element's animation starts */
  delay?: number;
  /**
   * true: animates immediately on mount (use for above-the-fold Hero content).
   * false (default): animates when scrolled into view (use for below-fold sections).
   */
  triggerOnMount?: boolean;
  /** Vertical offset (px) the element travels during the animation */
  y?: number;
}

/**
 * Reveal
 * Single reusable fade + slide-up animation wrapper. Client Component
 * because Framer Motion requires browser APIs — kept as a small leaf
 * component so parent sections (Hero, SuggestedPrompts, Features) can
 * remain Server Components.
 *
 * Respects prefers-reduced-motion: when set, content appears instantly
 * with no motion, per accessibility requirements.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  triggerOnMount = false,
  y = 20,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: { opacity: 1, y: 0 },
  };

  const viewportOrMountProps = triggerOnMount
    ? { initial: "hidden", animate: "visible" }
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-80px" },
      };

  return (
    <motion.div
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : ANIMATION.duration.base,
        delay: shouldReduceMotion ? 0 : delay,
        ease: ANIMATION.ease,
      }}
      className={className}
      {...viewportOrMountProps}
    >
      {children}
    </motion.div>
  );
}