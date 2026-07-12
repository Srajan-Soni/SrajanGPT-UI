/**
 * Represents a single navigation link in the Navbar.
 */
export interface NavLink {
  /** Unique identifier, also used as the React key */
  id: string;
  /** Visible text label */
  label: string;
  /** URL or anchor hash (e.g. "#features") */
  href: string;
  /** Opens in a new tab (used for external links like GitHub) */
  external?: boolean;
}