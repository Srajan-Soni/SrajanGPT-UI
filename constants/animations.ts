/**
 * Shared Framer Motion timing/easing values.
 * Ensures consistent motion feel across Hero, Cards, and Sections (used in Step 14).
 */
export const ANIMATION = {
  duration: {
    fast: 0.2,
    base: 0.4,
    slow: 0.8,
  },
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // "easeOutExpo" — smooth, premium deceleration
  stagger: 0.08,
} as const;