/**
 * Represents a single structured input field for prompts that require
 * more than free text (e.g. "Write Email" needs To/Subject/From/Body).
 */
export interface PromptField {
  /** Unique key for this field, used as form field name */
  id: string;
  /** Label shown above the input (e.g. "To") */
  label: string;
  /** Placeholder text shown inside the input */
  placeholder: string;
  /** Input type — determines which form control renders */
  type: "text" | "email" | "textarea";
  /** Whether this field must be filled before submitting */
  required: boolean;
}

/**
 * Represents a single suggested prompt card shown on the landing page.
 */
export interface SuggestedPrompt {
  /** Unique identifier, also used as the React key */
  id: string;
  /** Short title shown on the card (e.g. "Write Email") */
  title: string;
  /** Short supporting description shown under the title */
  description: string;
  /**
   * The base prompt text sent when clicked.
   * For structured prompts, this acts as a template with {field_id} placeholders
   * that get interpolated once the form (built in a later step) is submitted.
   */
  prompt: string;
  /** Lucide icon name used to render the card's icon */
  icon: string;
  /**
   * Optional structured fields. When present, clicking the card should open
   * a form instead of directly filling the search box (behavior implemented
   * when we build prompt interactivity).
   */
  fields?: PromptField[];
}