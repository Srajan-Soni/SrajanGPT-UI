/**
 * Represents a single feature highlighted in the Features section.
 */
export interface Feature {
  /** Unique identifier, also used as the React key */
  id: string;
  /** Feature title (e.g. "Lightning Fast") */
  title: string;
  /** Short supporting description */
  description: string;
  /** Lucide icon name used to render the feature's icon */
  icon: string;
}