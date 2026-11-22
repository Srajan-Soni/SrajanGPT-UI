export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  reasoning?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  context_window: number;
  is_default: boolean;
}

export interface ModelListResponse {
  default_model: string;
  models: ModelOption[];
}

export interface StreamChunkPayload {
  content: string;
  reasoning?: string;
  model?: string;
  finish_reason?: string;
  done: boolean;
  error?: string;
}
