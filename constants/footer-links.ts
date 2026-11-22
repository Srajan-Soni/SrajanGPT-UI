import type { NavLink } from "@/types";

/**
 * Footer link groups, organized by category.
 * Each group renders as its own column (desktop) / stacked section (mobile).
 */
export const footerLinkGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { id: "features", label: "Features", href: "#features" },
      { id: "pricing", label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { id: "github", label: "GitHub", href: "#github", external: true },
    ],
  },
];