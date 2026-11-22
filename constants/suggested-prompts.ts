import type { SuggestedPrompt } from "@/types";

/**
 * Suggested prompt cards shown below the Hero search box.
 * Cards without `fields` fill the search box directly on click.
 * Cards with `fields` open a structured mini-form (e.g. Write Email).
 */
export const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "write-code",
    title: "Write Code",
    description: "Generate code in any language from a plain description.",
    prompt: "Write a well-documented function that ",
    icon: "Code2",
  },
  {
    id: "translate",
    title: "Translate Text",
    description: "Translate text between languages instantly.",
    prompt: "Translate the following text to ",
    icon: "Languages",
  },
  {
    id: "write-email",
    title: "Write Email",
    description: "Draft a professional email with your own details.",
    prompt:
      "Write an email from {from} to {to} with the subject '{subject}'. Context: {body}",
    icon: "Mail",
    fields: [
      {
        id: "from",
        label: "From",
        placeholder: "you@example.com",
        type: "email",
        required: true,
      },
      {
        id: "to",
        label: "To",
        placeholder: "recipient@example.com",
        type: "email",
        required: true,
      },
      {
        id: "subject",
        label: "Subject",
        placeholder: "e.g. Project Update",
        type: "text",
        required: true,
      },
      {
        id: "body",
        label: "What should this email say?",
        placeholder: "e.g. Let them know the deadline moved to Friday",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "summarize",
    title: "Summarize Content",
    description: "Turn long text into a clear, concise summary.",
    prompt: "Summarize the following content in a few key points: ",
    icon: "FileText",
  },
  {
    id: "get-suggestions",
    title: "Get Suggestions",
    description: "Get tailored recommendations for any decision.",
    prompt: "Suggest the best options for ",
    icon: "Lightbulb",
  },
  {
    id: "explain-concept",
    title: "Explain a Concept",
    description: "Break down any complex topic into simple terms.",
    prompt: "Explain the following concept in simple terms: ",
    icon: "Brain",
  },
];