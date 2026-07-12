import type { NavLink } from "@/types";

/**
 * Primary navigation links rendered in the Navbar.
 * Adding a new link here automatically renders it — no Navbar.tsx changes needed.
 */
export const navLinks: NavLink[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "features", label: "Features", href: "#features" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
];